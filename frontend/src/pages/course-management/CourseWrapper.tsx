import { User, UserRoleEnum } from "../../types/models";
import { useAuth } from "../../wrappers/AuthContext";
import StudentCourseManagement from "./StudentCourseManagement";
import TeacherCourseManagement from "./TeacherCourseManagement";

const CourseWrapper: React.FC = () => {
  const { user } = useAuth<User>();

  return user!.role === UserRoleEnum.TEACHER ? (
    <TeacherCourseManagement />
  ) : (
    <StudentCourseManagement />
  );
};

export default CourseWrapper;
