import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Course, UserRoleEnum } from "../../../types/models";
import { classNames } from "../../../utils/classNames";
import { getCourseBgColor } from "../../../utils/courseColour";
import { getInitialsMaxTwoLetters } from "../../../utils/initials";

export type CourseCardProps = {
  course: Course;
  role: UserRoleEnum;
  setDeleteCourseId?: (deleteCourseId: string) => void;
  setIsDeleteModalOpen?: (isDeleteModalOpen: boolean) => void;
};

export const CourseCard = ({
  course,
  role,
  setDeleteCourseId,
  setIsDeleteModalOpen,
}: CourseCardProps) => {
  return (
    <li key={course.name} className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={classNames(
          getCourseBgColor(course.name),
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
        )}
      >
        {getInitialsMaxTwoLetters(course.name)}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a
            href={`courses/${course.id}`}
            className="font-medium text-gray-900 hover:text-gray-600"
          >
            {course.name}
          </a>
          <p className="text-gray-500">{course.description}</p>
          {/* <p className="text-gray-500">
                    {course.students?.length ?? 0} Members
                </p> */}
        </div>
        {role === UserRoleEnum.TEACHER && (
          <div className="flex-shrink-0 pr-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                if (setDeleteCourseId) {
                  setDeleteCourseId(course.id);
                }
                if (setIsDeleteModalOpen) {
                  setIsDeleteModalOpen(true);
                }
              }}
            >
              <span className="sr-only">Open options</span>
              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
};
