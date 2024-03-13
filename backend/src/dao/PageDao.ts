import { Page, Prisma, PrismaClient } from "@prisma/client";

export class PageDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createPage(
    pageData: Prisma.PageUncheckedCreateInput
  ): Promise<Page> {
    return this.prismaClient.page.create({
      data: pageData,
    });
  }

  public async getAllPages(): Promise<Page[]> {
    return this.prismaClient.page.findMany();
  }

  public getAllPagesByChapterId(chapterId: string): Promise<Page[]> {
    return this.prismaClient.page.findMany({
      where: { chapterId: chapterId },
    });
  }

  public async getPageById(pageId: string): Promise<Page | null> {
    return this.prismaClient.page.findUnique({
      where: { id: pageId },
      include: {
        chapter: {
          include: {
            pages: true,
          },
        },
        traditionalTextBasedLessonPage: true,
        exercisePage: true,
        explorationPage: true,
      },
    });
  }

  public async updatePage(
    pageId: string,
    pageData: Prisma.PageUpdateInput
  ): Promise<Page | null> {
    return this.prismaClient.page.update({
      where: { id: pageId },
      data: pageData,
    });
  }

  public async updatePageByTraditionalTextBasedLessonPageId(
    pageId: string,
    pageData: Prisma.PageUpdateInput
  ): Promise<Page | null> {
    // First, find the Page associated with the TraditionalTextBasedLessonPage
    const traditionalTextPage =
      await this.prismaClient.traditionalTextBasedLessonPage.findUnique({
        where: { id: pageId },
        include: { page: true },
      });

    if (!traditionalTextPage) {
      return null;
    }

    // Then, update the Page using the ID
    return this.prismaClient.page.update({
      where: { id: traditionalTextPage.pageId },
      data: pageData,
    });
  }

  public async updatePageByExercisePageId(
    pageId: string,
    pageData: Prisma.PageUpdateInput
  ): Promise<Page | null> {
    // First, find the Page associated with the ExercisePage
    const exercisePage =
      await this.prismaClient.exercisePage.findUnique({
        where: { id: pageId },
        include: { page: true },
      });

    if (!exercisePage) {
      return null;
    }

    // Then, update the Page using the ID
    return this.prismaClient.page.update({
      where: { id: exercisePage.pageId },
      data: pageData,
    });
  }

  public async deletePage(pageId: string): Promise<Page | null> {
    const response = await this.prismaClient.$transaction(async (prisma) => {
      // Delete TraditionalTextBasedLessonPage if it exists
      await prisma.traditionalTextBasedLessonPage.deleteMany({
        where: { pageId },
      });

      // Delete ExercisePage if it exists
      await prisma.exercisePage.deleteMany({
        where: { pageId },
      });

      // Delete ExplorationPage if it exists
      await prisma.explorationPage.deleteMany({
        where: { pageId },
      });

      // Finally, delete the Page
      return prisma.page.delete({
        where: { id: pageId },
      });
    });

    return response;
  }
}
