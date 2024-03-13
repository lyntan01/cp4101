import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page, PageTypeEnum, User, UserRoleEnum } from "../../types/models";
import { useToast } from "../../wrappers/ToastProvider";
import {
  GenericButton,
  GenericButtonIconOnRight,
} from "../../components/buttons";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { getPageById } from "../../api/page";
import { updateTextPage } from "../../api/textPage";
import { updateExercisePage } from "../../api/exercisePage";
import TraditionalTextPageContent from "./TraditionalTextPageContent";
import { isJsonFormat, isMarkdownFormat } from "../../utils/checkFormat";
import { convertMarkdownToLexicalJson } from "../../utils/convertMarkdownToLexicalJson";
import ExercisePageContent from "./ExercisePageContent";
import { useAuth } from "../../wrappers/AuthContext";

const ViewPageWrapper: React.FC = () => {
  const { pageId } = useParams();
  const [page, setPage] = useState<Page>();

  const { user } = useAuth<User>();

  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();

  const getPage = async () => {
    try {
      const response = await getPageById(pageId ?? "");
      const page = response.data;

      // Check if the page content is in Markdown, and convert to Lexical JSON if true
      const updatedPage = await convertPageContentToLexicalJson(page);

      setPage(updatedPage);
    } catch (error) {
      displayToast(
        "Page could not be retrieved from the server.",
        ToastType.ERROR
      );
      console.log(error);
    }
  };

  // Helper function to convert page content from Markdown to Lexical JSON
  const convertPageContentToLexicalJson = async (page: Page): Promise<Page> => {
    if (
      page.type === PageTypeEnum.TRADITIONAL_TEXT_BASED_LESSON &&
      !isJsonFormat(page.traditionalTextBasedLessonPage!.content) &&
      isMarkdownFormat(page.traditionalTextBasedLessonPage!.content)
    ) {
      const lexicalJsonContent = await convertMarkdownToLexicalJson(
        page.traditionalTextBasedLessonPage!.content
      )
      const updateTextPageResponse = await updateTextPage({
        textPageId: page.traditionalTextBasedLessonPage!.id,
        title: page.title,
        content: lexicalJsonContent
      })

      // Retrieve the page again, text page content should be in Lexical JSON format
      const response = await getPageById(pageId ?? '')
      return response.data
    } else if (
      page.type === PageTypeEnum.EXERCISE &&
      !isJsonFormat(page.exercisePage!.instructions)
    ) {
      const lexicalJsonContent = await convertMarkdownToLexicalJson(
        page.exercisePage!.instructions
      )
      const updateExercisePageResponse = await updateExercisePage({
        exercisePageId: page.exercisePage!.id,
        title: page.title,
        instructions: lexicalJsonContent,
        sandboxId: page.exercisePage!.sandboxId,
        correctAnswer: page.exercisePage!.correctAnswer
      })

      // Retrieve the page again, exercise page instructions should be in Lexical JSON format
      const response = await getPageById(pageId ?? '')
      return response.data
    }

    return page
  }

  useEffect(() => {
    getPage();
  }, [pageId]);

  if (page && page.chapter) {
    const pageIndex = page.chapter.pages.findIndex((p) => p.id === pageId);
    const numPagesInChapter = page.chapter.pages.length;

    const navToPreviousPage = () => {
      const prevPageId = page.chapter.pages[pageIndex - 1].id;
      navigate(`/pages/${prevPageId}`);
    };

    const navToNextPage = () => {
      const nextPageId = page.chapter.pages[pageIndex + 1].id;
      navigate(`/pages/${nextPageId}`);
    };

    const navToChaptersPage = () => {
      console.log(page);
      navigate(`/courses/${page.chapter.courseId}/2`);
    };

    const navToEditPage = () => {
      navigate(`/pages/edit/${page.id}`);
    };

    return (
      <div className="pb-10">
        <div className="flex justify-between mb-4">
          <GenericButton
            text="Back to chapters page"
            type="button"
            icon={<ArrowUturnLeftIcon className="h-4 w-4" />}
            onClick={navToChaptersPage}
            className="bg-white text-zinc-500 shadow-white -mt-4 border-0"
          />
          <GenericButton
            text="Edit Page"
            type="button"
            icon={<PencilSquareIcon className="h-4 w-4" />}
            onClick={navToEditPage}
            className="-mt-4 border-0"
          />
        </div>

        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200">
          {/* HEADER */}
          <div className="bg-sky-50 px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold tracking-wide text-gray-800">
                {page.title}
              </span>
              <span className="font-light tracking-wide text-gray-600">
                {`Page 
            ${pageIndex + 1} 
            of ${numPagesInChapter}`}
              </span>
            </div>
          </div>

          {/* CARD CONTENT */}
          <div className="px-4 py-5 sm:p-6">
            {page.type === PageTypeEnum.TRADITIONAL_TEXT_BASED_LESSON ? (
              <TraditionalTextPageContent
                traditionalTextBasedLessonPage={
                  page.traditionalTextBasedLessonPage!
                }
              />
            ) : page.type === PageTypeEnum.EXERCISE ? (
                <ExercisePageContent
                  exercisePage={page.exercisePage!}
                  role={user?.role ?? UserRoleEnum.STUDENT}
                />
            ) : page.type === PageTypeEnum.EXPLORATION ? (
              <></>
            ) : (
              <span className="text-red-600">Error: Page Not Found</span>
            )}
          </div>

          {/* FOOTER */}
          {numPagesInChapter > 1 && (
            <div className="bg-gray-100 px-4 py-4 sm:px-6">
              <div className="flex justify-between items-center">
                {pageIndex === 0 ? (
                  <div></div>
                ) : (
                  <GenericButton
                    text="Previous"
                    type="button"
                    icon={<ArrowLeftIcon className="h-4 w-4" />}
                    onClick={navToPreviousPage}
                    className={"text-zinc-500 bg-white border border-gray-200"}
                  />
                )}
                {pageIndex === numPagesInChapter - 1 ? (
                  <div></div>
                ) : (
                  <GenericButtonIconOnRight
                    text="Next"
                    type="button"
                    icon={<ArrowRightIcon className="h-4 w-4" />}
                    onClick={navToNextPage}
                    className={"text-zinc-500 bg-white border border-gray-200"}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <></>;
};

export default ViewPageWrapper;
