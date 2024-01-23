import { useState } from "react";

interface EnrollStudentModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  enrollStudent: (studentEmail: string) => void;
}

export const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({
  setIsModalOpen,
  enrollStudent,
}) => {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
        <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
          <div className="flex flex-col items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Enroll Student
            </h3>

            <div className="w-full mt-3 mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Student Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="email"
                  id="email"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-green-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  aria-invalid={true}
                  aria-describedby="email-error"
                />
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
              disabled={email.trim().length === 0}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  email.trim().length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                }`}
              onClick={() => enrollStudent(email)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
