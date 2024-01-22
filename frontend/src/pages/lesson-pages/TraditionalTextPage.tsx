import { useParams } from "react-router-dom";
import { LexOutput } from "../../rich-text-editor";
import { getPageById } from "../../api/page";
import { useEffect, useState } from "react";
import { Page } from "../../types/models";
import { useToast } from "../../wrappers/ToastProvider";

const TraditionalTextPage: React.FC = () => {
  const { pageId } = useParams();
  const [page, setPage] = useState<Page>();

  const { displayToast, ToastType } = useToast();

  const getPage = async () => {
    try {
      const response = await getPageById(pageId ?? "");
      setPage(response.data);
    } catch (error) {
      displayToast(
        "Course could not be retrieved from the server.",
        ToastType.ERROR
      );
      console.log(error);
    }
  };

  useEffect(() => {
    getPage();
  }, []);

  if (page && page.traditionalTextBasedLessonPage) {
    return (
      <div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-wide text-gray-800">
            {page.title}
          </span>
          <span className="font-light tracking-wide text-gray-600">
            Page {page.chapter?.pages.indexOf(page)} of{" "}
            {page.chapter?.pages.length}
          </span>
        </div>
        <LexOutput
          editorStateStr={page.traditionalTextBasedLessonPage.content}
        />
      </div>
    );
  }

  return <></>;
};

export default TraditionalTextPage;
