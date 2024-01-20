import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/classNames";
import { User } from "../../types/models";
import { useAuth } from "../../wrappers/AuthContext";
import { getCourseBgColor } from "../../utils/courseColour";
import { getInitialsMaxTwoLetters } from "../../utils/initials";

const StudentCourseManagement: React.FC = () => {
  const { user } = useAuth<User>();
  const enrolledCourses = user!.enrolledCourses;

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold tracking-wide text-gray-500">
          Enrolled Courses
        </span>
      </div>
      <ul
        role="list"
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        {enrolledCourses.length === 0 ? (
          <h2>No enrolled courses</h2>
        ) : (
          enrolledCourses.map((course) => (
            <li
              key={course.name}
              className="col-span-1 flex rounded-md shadow-sm"
            >
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
                    // href={course.href}
                    className="font-medium text-gray-900 hover:text-gray-600"
                  >
                    {course.name}
                  </a>
                  <p className="text-gray-500">{course.description}</p>
                  {/* <p className="text-gray-500">{project.members} Members</p> */}
                </div>
                {/* <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div> */}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StudentCourseManagement;
