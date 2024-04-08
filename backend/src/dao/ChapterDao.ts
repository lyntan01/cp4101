import { Chapter, Prisma, PrismaClient } from "@prisma/client";

export class ChapterDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createChapter(
    chapterData: Prisma.ChapterCreateInput
  ): Promise<Chapter> {
    return this.prismaClient.chapter.create({
      data: chapterData,
    });
  }

  public async getAllChapters(): Promise<Chapter[]> {
    return this.prismaClient.chapter.findMany();
  }

  public async getChapterById(chapterId: string): Promise<Chapter | null> {
    return this.prismaClient.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true,
        pages: true,
      },
    });
  }

  public async getChaptersByCourseId(courseId: string): Promise<Chapter[]> {
    return this.prismaClient.chapter.findMany({
      where: { courseId },
      include: {
        pages: true,
        generatedExercises: true,
      },
    });
  }

  public async updateChapter(
    chapterId: string,
    chapterData: Prisma.ChapterUpdateInput
  ): Promise<Chapter | null> {
    return this.prismaClient.chapter.update({
      where: { id: chapterId },
      data: chapterData,
    });
  }

  public async deleteChapter(chapterId: string): Promise<Chapter | null> {
    return this.prismaClient.chapter.delete({
      where: { id: chapterId },
    });
  }
}
