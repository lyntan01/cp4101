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
        traditionalTextBasedLessonPage: true,
        codeSandboxPage: true,
        stepByStepVisualizationPage: true,
        realTimeCodeFeedbackPage: true,
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

  public async deletePage(pageId: string): Promise<Page | null> {
    return this.prismaClient.page.delete({
      where: { id: pageId },
    });
  }
}
