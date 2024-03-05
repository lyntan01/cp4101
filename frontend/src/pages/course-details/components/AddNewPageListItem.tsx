import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTypeEnum } from "../../../types/models";
import { AddNewPageModal } from "./AddNewPageModal";

interface AddNewPageListItemProps {
  chapterId: string;
}

export const AddNewPageListItem: React.FC<AddNewPageListItemProps> = ({
  chapterId,
}) => {
  const [isAddNewPageModalOpen, setIsAddNewPageModalOpen] = useState(false);
  const navigate = useNavigate();

  const navigateToCreatePage = (pageType: PageTypeEnum) => { 
        if (pageType === PageTypeEnum.TRADITIONAL_TEXT_BASED_LESSON) {
            navigate(`/pages/create/text/${chapterId}`)
        } else if (pageType === PageTypeEnum.EXERCISE) {
            navigate(`/pages/create/exercise/${chapterId}`)
        } else if (pageType === PageTypeEnum.EXPLORATION) {
            navigate(`/pages/create/exploration/${chapterId}`)
        }

        setIsAddNewPageModalOpen(false);
    };

  return (
    <>
      <li
        key="add-page"
        className="relative flex justify-between gap-x-6 py-4 px-4 hover:bg-sky-50"
      >
        <div className="flex min-w-0 gap-x-4">
          <PlusCircleIcon
            className="h-5 w-5 flex-none text-indigo-600"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-auto">
            <button
              className="text-sm font-semibold text-center leading-6 text-indigo-600 hover:underline"
              onClick={() => setIsAddNewPageModalOpen(true)}
            >
              Add a new page
            </button>
          </div>
        </div>
      </li>
      {isAddNewPageModalOpen && (
        <AddNewPageModal
          setIsModalOpen={setIsAddNewPageModalOpen}
          navigateToCreatePage={navigateToCreatePage}
        />
      )}
    </>
  );
};
