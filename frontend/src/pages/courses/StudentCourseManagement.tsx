import { User } from "../../types/models";
import { useAuth } from "../../wrappers/AuthContext";
import { CourseCard } from "./components/CourseCard";

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
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {enrolledCourses.length === 0 ? (
          <h2>No enrolled courses</h2>
        ) : (
          enrolledCourses.map((course) =>
            CourseCard({
              course,
              role: user!.role,
            })
          )
        )}
      </ul>
    </div>
  );
};

export default StudentCourseManagement;
