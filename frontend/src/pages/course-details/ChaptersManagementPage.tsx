import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import {
  generateChapters as generateChaptersApi,
  createChapter as createChapterApi,
  deleteChapter as deleteChapterApi,
  getAllChaptersByCourseId,
} from "../../api/chapter";
import { deletePage as deletePageApi } from "../../api/page";
import { Chapter, Course, UserRoleEnum } from "../../types/models";
import { classNames } from "../../utils/classNames";
import { useToast } from "../../wrappers/ToastProvider";
import { ChapterAccordion } from "./components/ChapterAccordion";
import { CreateChapterModal } from "./components/CreateChapterModal";
import { GenerateChaptersModal } from "./components/GenerateChaptersModal";

interface ChaptersManagementPageProps {
  key: number;
  course: Course;
  role: UserRoleEnum;
}

export const ChaptersManagementPage = ({
  key,
  course,
  role,
}: ChaptersManagementPageProps) => {
  const [isGenerateChaptersModalOpen, setIsGenerateChaptersModalOpen] =
    useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { displayToast, ToastType } = useToast();

  const fetchChapters = async () => {
    try {
      const response = await getAllChaptersByCourseId(course.id);
      setChapters(response.data);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Chapters could not be fetched: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    }
  };

  const generateChapters = async (
    numChapters: number,
    courseLearningOutcomes: string
  ) => {
    try {
      const response = await generateChaptersApi({
        courseId: course.id,
        courseName: course.name,
        courseLearningOutcomes: courseLearningOutcomes,
        numChapters: numChapters,
      });
      console.log(response.data); // TO DELETE
      displayToast("Chapters generated successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Chapters could not be generated: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    } finally {
      setIsGenerateChaptersModalOpen(false);
    }
  };

  const createChapter = async (chapterName: string) => {
    try {
      await createChapterApi({
        name: chapterName.trim(),
        courseId: course.id,
      });
      displayToast("Chapter created successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Chapter could not be created: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const deleteChapter = async (chapterId: string) => {
    // TODO: Add a delete modal instead of deleting directly
    try {
      await deleteChapterApi(chapterId);
      displayToast("Chapter deleted successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Chapter could not be deleted: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    }
  };

  const deletePage = async (pageId: string) => {
    // TODO: Add a delete modal instead of deleting directly
    try {
      await deletePageApi(pageId);
      displayToast("Page deleted successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Page could not be deleted: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [
    isCreateModalOpen,
    isGenerateChaptersModalOpen,
    deleteChapter,
    deletePage,
  ]);

  return (
    <>
      <Tab.Panel
        key={key}
        className={classNames(
          "rounded-xl bg-white p-3",
          "ring-white/60 ring-offset-2 ring-offset-blue-400"
        )}
      >
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-6 text-gray-900">
                Chapters
              </h1>
            </div>
            {role === UserRoleEnum.TEACHER && (
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-2">
                {chapters.length === 0 && (
                  <button
                    type="button"
                    disabled={chapters.length > 0}
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setIsGenerateChaptersModalOpen(true)}
                  >
                    Generate Chapters
                  </button>
                )}
                <button
                  type="button"
                  className="block rounded-md bg-gray-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add chapter
                </button>
              </div>
            )}
          </div>
        </div>
        <ChapterAccordion
          chapters={chapters}
          role={role}
          deleteChapter={deleteChapter}
          deletePage={deletePage}
        />
      </Tab.Panel>
      {isGenerateChaptersModalOpen && (
        <GenerateChaptersModal
          setIsModalOpen={setIsGenerateChaptersModalOpen}
          generateChapters={generateChapters}
          courseName={course.name}
        />
      )}
      {isCreateModalOpen && (
        <CreateChapterModal
          setIsModalOpen={setIsCreateModalOpen}
          createChapter={createChapter}
        />
      )}
    </>
  );
};
