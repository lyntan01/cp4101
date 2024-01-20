import { CourseDao } from "../dao/CourseDao";
import { Course, Prisma } from "@prisma/client";
import { UserDao } from "../dao/UserDao";

export class CourseService {
  constructor(
    private courseDao: CourseDao = new CourseDao(),
    private userDao: UserDao = new UserDao()
  ) {}

  public async createCourse(
    courseData: Prisma.CourseCreateInput
  ): Promise<Course | null> {
    // TODO: Check that teacherId is a teacher
    return this.courseDao.createCourse(courseData);
  }

  public async enrollStudents(
    studentIds: string[],
    courseId: string
  ): Promise<Course | null> {
    // Check if the course exists
    const course = await this.courseDao.getCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Enroll each student in the course
    for (const studentId of studentIds) {
      // TODO: Check that each studentId is a student
      await this.userDao.updateUser(studentId, {
        enrolledCourses: {
          connect: { id: courseId },
        },
      });
    }

    return this.courseDao.getCourseById(courseId);
  }

  public async getAllCourses(): Promise<Course[]> {
    return this.courseDao.getAllCourses();
  }

  public async getCourseById(courseId: string): Promise<Course | null> {
    return this.courseDao.getCourseById(courseId);
  }

  public async getCreatedCoursesByTeacherId(
    teacherId: string
  ): Promise<Course[]> {
    return this.courseDao.getCreatedCoursesByTeacherId(teacherId);
  }

  public async updateCourse(
    courseId: string,
    courseData: Prisma.CourseUpdateInput
  ): Promise<Course | null> {
    return this.courseDao.updateCourse(courseId, courseData);
  }

  public async deleteCourse(courseId: string): Promise<Course | null> {
    return this.courseDao.deleteCourse(courseId);
  }
}
