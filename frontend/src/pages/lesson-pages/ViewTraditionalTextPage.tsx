import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTextPageByPageId } from "../../api/textPage";
import { LexOutput } from "../../rich-text-editor";
import { TraditionalTextBasedLessonPage } from "../../types/models";
import { useToast } from "../../wrappers/ToastProvider";

const ViewTraditionalTextPage: React.FC = () => {
  const { pageId } = useParams();
  const [traditionalTextPage, setTraditionalTextPage] =
    useState<TraditionalTextBasedLessonPage>();

  const { displayToast, ToastType } = useToast();

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
  }, []);

  if (traditionalTextPage && traditionalTextPage.page.chapter) {
    const pageIndex = traditionalTextPage.page.chapter.pages.findIndex(
      (p) => p.id === pageId
    );

    return (
      <div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-wide text-gray-800">
            {traditionalTextPage.page.title}
          </span>
          <span className="font-light tracking-wide text-gray-600">
            {`Page 
            ${pageIndex + 1} 
            of ${traditionalTextPage.page.chapter.pages.length}`}
          </span>
        </div>
        <LexOutput editorStateStr={traditionalTextPage.content} />
      </div>
    );
  }

  return <></>;
};

export default ViewTraditionalTextPage;
