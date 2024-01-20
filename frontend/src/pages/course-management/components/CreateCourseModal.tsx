import { useState } from "react";
import { CreateCourseData } from "../../../api/course";

interface CreateCourseModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  createCourse: (createCourseData: CreateCourseData) => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  setIsModalOpen,
  createCourse,
}) => {
  const [createCourseData, setCreateCourseData] = useState<CreateCourseData>({
    name: "",
    description: "",
    teacherId: "",
  });

  const isCourseDataInvalid = () => {
    return (
      createCourseData.name.trim().length === 0 ||
      createCourseData.description.trim().length === 0
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Create Course
            </h3>

            <div className="w-full mt-3 mb-3">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Course Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    createCourseData.name.trim().length === 0
                      ? "ring-red-300 text-red-900 focus:ring-red-500"
                      : "ring-gray-300 text-gray-900 focus:ring-green-500"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="e.g. React Basics"
                  value={createCourseData.name}
                  onChange={(e) => {
                    setCreateCourseData({
                      ...createCourseData,
                      name: e.target.value,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="title-error"
                />
              </div>
              {createCourseData.name.trim().length === 0 && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="title-error"
                >
                  Course name cannot be empty.
                </p>
              )}
            </div>

            <div className="w-full mb-3">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Course Description
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="description"
                  id="description"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    createCourseData.description.trim().length === 0
                      ? "ring-red-300 text-red-900 focus:ring-red-500"
                      : "ring-gray-300 text-gray-900 focus:ring-green-500"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder="Describe your course"
                  value={createCourseData.description}
                  onChange={(e) => {
                    setCreateCourseData({
                      ...createCourseData,
                      description: e.target.value,
                    });
                  }}
                  aria-invalid={true}
                  aria-describedby="description-error"
                />
              </div>
              {createCourseData.description.trim().length === 0 && (
                <p
                  className="absolute b-0 text-sm text-red-600"
                  id="description-error"
                >
                  Course description cannot be empty.
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={isCourseDataInvalid()}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  isCourseDataInvalid()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                }`}
              onClick={() => createCourse(createCourseData)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
