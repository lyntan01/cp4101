import { Course, Prisma, PrismaClient } from "@prisma/client";

export class CourseDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createCourse(
    courseData: Prisma.CourseCreateInput
  ): Promise<Course> {
    return this.prismaClient.course.create({
      data: courseData,
    });
  }

  public async getAllCourses(): Promise<Course[]> {
    return this.prismaClient.course.findMany();
  }

  public async getCourseById(courseId: string): Promise<Course | null> {
    return this.prismaClient.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        students: true,
        chapters: true,
      },
    });
  }

  public async getCreatedCoursesByTeacherId(
    teacherId: string
  ): Promise<Course[]> {
    return this.prismaClient.course.findMany({
      where: { teacherId: teacherId },
      include: {
        teacher: true,
        students: true,
        chapters: true,
      },
    });
  }

  public async updateCourse(
    courseId: string,
    courseData: Prisma.CourseUpdateInput
  ): Promise<Course | null> {
    return this.prismaClient.course.update({
      where: { id: courseId },
      data: courseData,
    });
  }

  public async deleteCourse(courseId: string): Promise<Course | null> {
    return this.prismaClient.course.delete({
      where: { id: courseId },
    });
  }
}
