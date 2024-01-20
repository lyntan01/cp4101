import { Tab } from "@headlessui/react";
import { classNames } from "../../utils/classNames";
import { Course, UserRoleEnum } from "../../types/models";
import { useState } from "react";
import { EnrollStudentModal } from "./components/EnrollStudentModal";
import { enrollStudents, removeStudent } from "../../api/course";
import { useToast } from "../../wrappers/ToastProvider";

interface StudentsManagementPageProps {
  key: number;
  course: Course;
  role: UserRoleEnum;
}

export const StudentsManagementPage = ({
  key,
  course,
  role,
}: StudentsManagementPageProps) => {
  const [isEnrollStudentModalOpen, setIsEnrollStudentModalOpen] =
    useState(false);
  const { displayToast, ToastType } = useToast();

  const enrollStudent = async (studentEmail: string) => {
    try {
      await enrollStudents({
        studentEmails: [studentEmail.trim()],
        courseId: course.id,
      });
      displayToast("Student enrolled successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Student could not be enrolled: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    } finally {
      setIsEnrollStudentModalOpen(false);
    }
  };

  const unenrollStudent = async (studentId: string) => {
    try {
      await removeStudent({
        studentId: studentId,
        courseId: course.id,
      });
      displayToast("Student removed successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Student could not be removed: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    }
  };

  return (
    <>
      <Tab.Panel
        key={key}
        className={classNames(
          "rounded-xl bg-white p-3",
          "ring-white/60 ring-offset-2 ring-offset-blue-400"
        )}
      >
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-6 text-gray-900">
                Students
              </h1>
            </div>
            {role === UserRoleEnum.TEACHER && (
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setIsEnrollStudentModalOpen(true)}
                >
                  Add student
                </button>
              </div>
            )}
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                        {role === UserRoleEnum.TEACHER && (
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only"></span>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {course.students.length === 0 ? (
                        <tr>
                          <td
                            colSpan={2}
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6 text-center"
                          >
                            No students enrolled in this course yet.
                          </td>
                        </tr>
                      ) : (
                        course.students.map((student) => (
                          <tr key={student.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {student.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {student.email}
                            </td>
                            {role === UserRoleEnum.TEACHER && (
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  type="button"
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={() => {
                                    unenrollStudent(student.id);
                                  }}
                                >
                                  Unenroll
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tab.Panel>
      {isEnrollStudentModalOpen && (
        <EnrollStudentModal
          setIsModalOpen={setIsEnrollStudentModalOpen}
          enrollStudent={enrollStudent}
        />
      )}
    </>
  );
};
