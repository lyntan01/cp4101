import { useEffect, useState } from "react";
import { User } from "../../types/models";
import { useAuth } from "../../wrappers/AuthContext";
import { CourseCard } from "./components/CourseCard";
import { useToast } from "../../wrappers/ToastProvider";
import {
  CreateCourseData,
  createCourse as createCourseApi,
  deleteCourse as deleteCourseApi,
} from "../../api/course";
import { CreateCourseModal } from "./components/CreateCourseModal";
import { DeleteCourseModal } from "./components/DeleteCourseModal";

const TeacherCourseManagement: React.FC = () => {
  const { user } = useAuth<User>();
  const createdCourses = user!.createdCourses;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState("");

  const { displayToast, ToastType } = useToast();

  const createCourse = async (createCourseData: CreateCourseData) => {
    try {
      createCourseData.name = createCourseData.name.trim();
      createCourseData.description = createCourseData.description.trim();
      createCourseData.teacherId = user!.id;
      await createCourseApi(createCourseData);

      displayToast("Course created successfully.", ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Course could not be created: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const deleteCourse = async () => {
    try {
      await deleteCourseApi(deleteCourseId);
      displayToast("Course deleted successfully.", ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          "Course could not be deleted: Unknown error.",
          ToastType.ERROR
        );
      }
      console.log(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold tracking-wide text-gray-500">
          Created Courses
        </span>
        <button
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-slate-600 border border-transparent rounded-md hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500"
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-0.5"
            viewBox="0 0 16 16"
          >
            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
          </svg>
          Create Course
        </button>
      </div>
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {createdCourses.length === 0 ? (
          <h2>No courses created yet.</h2>
        ) : (
          createdCourses.map((course) =>
            CourseCard({
              course,
              role: user!.role,
              setDeleteCourseId,
              setIsDeleteModalOpen,
            })
          )
        )}
      </ul>

      {isCreateModalOpen && (
        <CreateCourseModal
          setIsModalOpen={setIsCreateModalOpen}
          createCourse={createCourse}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteCourseModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteCourse={deleteCourse}
        />
      )}
    </div>
  );
};

export default TeacherCourseManagement;
