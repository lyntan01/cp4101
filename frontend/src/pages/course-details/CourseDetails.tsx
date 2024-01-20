import { useNavigate, useParams } from "react-router-dom";
import { Course } from "../../types/models";
import { Fragment, useEffect, useState } from "react";
import { getCourseById } from "../../api/course";
import { useToast } from "../../wrappers/ToastProvider";
import { Tab } from "@headlessui/react";
import { classNames } from "../../utils/classNames";
import {
  ChartPieIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { CourseOverview } from "./CourseOverview";
import { StudentsManagementPage } from "./StudentsManagementPage";
import { ChaptersManagementPage } from "./ChaptersManagementPage";
import { AnalyticsPage } from "./AnalyticsPage";

const CourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course>();

  const { displayToast, ToastType } = useToast();

  const getCourse = async () => {
    try {
      const response = await getCourseById(courseId ?? "");
      setCourse(response.data);
    } catch (error) {
      displayToast(
        "Course could not be retrieved from the server.",
        ToastType.ERROR
      );
      console.log(error);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold tracking-wide text-gray-800">
          {course?.name}
        </span>
      </div>
      <Tabs />
    </div>
  );
};

const navigation = [
  { name: "Overview", icon: HomeIcon },
  { name: "Students", icon: UsersIcon },
  { name: "Chapters", icon: DocumentDuplicateIcon },
  { name: "Analytics", icon: ChartPieIcon },
];

function Tabs() {
  return (
    <Tab.Group vertical defaultIndex={0}>
      <div className="flex mt-8">
        <Tab.List className="w-1/5 pr-6 pt-3 flex space-x-1 rounded-xl p-1">
          <nav className="flex flex-1 flex-col" aria-label="Sidebar">
            <ul className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <Tab key={item.name} as={Fragment}>
                  {({ selected }) => {
                    return (
                      <div
                        className={classNames(
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          selected
                            ? "bg-gray-100 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            selected
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                    );
                  }}
                </Tab>
              ))}
            </ul>
          </nav>
        </Tab.List>
        <Tab.Panels className="w-4/5 pl-6">
          <CourseOverview key={0} />
          <StudentsManagementPage key={1} />
          <ChaptersManagementPage key={2} />
          <AnalyticsPage key={3} />
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
}

export default CourseDetails;
