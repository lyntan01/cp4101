import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTextPageByPageId } from "../../api/textPage";
import { LexOutput } from "../../rich-text-editor";
import { TraditionalTextBasedLessonPage } from "../../types/models";
import { useToast } from "../../wrappers/ToastProvider";
import {
  BackButton,
  GenericButton,
  GenericButtonIconOnRight,
} from "../../components/buttons";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const ViewTraditionalTextPage: React.FC = () => {
  const { pageId } = useParams();
  const [traditionalTextPage, setTraditionalTextPage] =
    useState<TraditionalTextBasedLessonPage>();

  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();

  const getTraditionalTextPage = async () => {
    try {
      const traditionalTextPageResponse = await getTextPageByPageId(
        pageId ?? ""
      );
      setTraditionalTextPage(traditionalTextPageResponse.data);
    } catch (error) {
      displayToast(
        "Text Page could not be retrieved from the server.",
        ToastType.ERROR
      );
      console.log(error);
    }
  };

  useEffect(() => {
    getTraditionalTextPage();
  }, [pageId]);

  if (traditionalTextPage && traditionalTextPage.page.chapter) {
    const pageIndex = traditionalTextPage.page.chapter.pages.findIndex(
      (p) => p.id === pageId
    );
    const numPagesInChapter = traditionalTextPage.page.chapter.pages.length;

    const navToPreviousPage = () => {
      const prevPageId =
        traditionalTextPage?.page.chapter.pages[pageIndex - 1].id;
      navigate(`/pages/${prevPageId}`);
    };

    const navToNextPage = () => {
      const nextPageId =
        traditionalTextPage?.page.chapter.pages[pageIndex + 1].id;
      navigate(`/pages/${nextPageId}`);
    };

    return (
      <div className="pb-10">
        <BackButton className="bg-white text-zinc-500 shadow-none -mt-4 mb-2" />
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200">
          <div className="bg-sky-50 px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold tracking-wide text-gray-800">
                {traditionalTextPage.page.title}
              </span>
              <span className="font-light tracking-wide text-gray-600">
                {`Page 
            ${pageIndex + 1} 
            of ${numPagesInChapter}`}
              </span>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <LexOutput
              key={pageId}
              editorStateStr={traditionalTextPage.content}
            />
          </div>
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

export default ViewTraditionalTextPage;
