import { TrashIcon } from "@heroicons/react/24/outline";
import { UserRoleEnum } from "../../../types/models";

export function Icon({
  id,
  open,
  deleteChapter,
  role,
}: {
  id: string;
  open: string[];
  deleteChapter: (chapterId: string) => void;
  role: UserRoleEnum;
}) {
  return (
    <div className="flex">
      {/* Arrow Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${
          open.includes(id) ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>

      {/* Delete Icon */}
      {role === UserRoleEnum.TEACHER && (
        <TrashIcon
          className="h-5 w-5 text-red-500 ml-2"
          onClick={() => deleteChapter(id)}
        />
      )}
    </div>
  );
}
