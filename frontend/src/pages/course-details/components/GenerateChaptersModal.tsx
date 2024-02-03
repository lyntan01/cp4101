import { useState } from "react";

interface GenerateChaptersModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  generateChapters: (numChapters: number, learningOutcomes: string) => void;
  courseName: string;
}

export const GenerateChaptersModal: React.FC<GenerateChaptersModalProps> = ({
  setIsModalOpen,
  generateChapters,
  courseName,
}) => {
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [numChapters, setNumChapters] = useState(1);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Generate Course Outline with AI
            </h3>

            <div className="space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="courseName"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Course Name
                </label>
                <div className="mt-2 sm:col-span-2">
                  <div className="flex rounded-md items-center sm:text-sm sm:max-w-md">
                    {courseName}
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="learningOutcomes"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Learning Outcomes
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="learningOutcomes"
                    name="learningOutcomes"
                    rows={3}
                    className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={learningOutcomes}
                    onChange={(e) => setLearningOutcomes(e.target.value)}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a brief description of the intended learning outcomes
                    of this course.
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="numChapters"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Number of Chapters
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="1"
                    id="numChapters"
                    name="numChapters"
                    className="block w-24 max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={numChapters}
                    onChange={(e) => setNumChapters(parseInt(e.target.value))}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Minimum: 1, Maximum: 20
                  </p>
                </div>
              </div>
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
              disabled={
                numChapters < 1 ||
                numChapters > 20 ||
                learningOutcomes.trim().length === 0
              }
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  numChapters < 1 ||
                  numChapters > 20 ||
                  learningOutcomes.trim().length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                }`}
              onClick={() => generateChapters(numChapters, learningOutcomes)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
