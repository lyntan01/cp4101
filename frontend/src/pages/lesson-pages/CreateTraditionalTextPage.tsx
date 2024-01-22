import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChapterById } from "../../api/chapter";
import { CreateTextPageData, createTextPage } from "../../api/textPage";
import { LexEditor } from "../../rich-text-editor";
import { Chapter } from "../../types/models";
import { useToast } from "../../wrappers/ToastProvider";

const CreateTraditionalTextPage: React.FC = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState<Chapter>();
  const [traditionalTextPageData, setTraditionalTextPageData] =
    useState<CreateTextPageData>({
      title: "Sample Title 2",
      content: "",
      chapterId: chapterId ?? "",
    });

  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();

  const fetchChapter = async () => {
    try {
      const response = await getChapterById(chapterId ?? "");
      setChapter(response.data);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Chapter could not be fetched: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const newPageResponse = await createTextPage(traditionalTextPageData);
      displayToast("Text lesson page created successfully.", ToastType.INFO);
      navigate(`/pages/${newPageResponse.data.pageId}`);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Text lesson page could not be created: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold tracking-wide text-gray-800">
          Create new text lesson page
        </span>
        <span className="font-light tracking-wide text-gray-600">
          in {chapter?.name}
        </span>
      </div>
      <LexEditor
        onChange={(value) =>
          setTraditionalTextPageData({
            ...traditionalTextPageData,
            content: value,
          })
        }
        editorStateStr={traditionalTextPageData.content}
      />
      <button onClick={() => handleSubmit()}>Create</button>
    </div>
  );
};

export default CreateTraditionalTextPage;
