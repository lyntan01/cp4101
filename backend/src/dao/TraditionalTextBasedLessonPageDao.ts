import {
  TraditionalTextBasedLessonPage,
  Prisma,
  PrismaClient,
} from "@prisma/client";

export class TraditionalTextBasedLessonPageDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createTraditionalTextBasedLessonPage(
    pageData: Prisma.TraditionalTextBasedLessonPageUncheckedCreateInput
  ): Promise<TraditionalTextBasedLessonPage> {
    return this.prismaClient.traditionalTextBasedLessonPage.create({
      data: pageData,
    });
  }

  public async getAllTraditionalTextBasedLessonPages(): Promise<
    TraditionalTextBasedLessonPage[]
  > {
    return this.prismaClient.traditionalTextBasedLessonPage.findMany();
  }

  public async getTraditionalTextBasedLessonPageById(
    pageId: string
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.prismaClient.traditionalTextBasedLessonPage.findUnique({
      where: { id: pageId },
      include: {
        page: {
          include: {
            chapter: {
              include: {
                pages: true,
              },
            },
          },
        },
      },
    });
  }

  public async getTraditionalTextBasedLessonPageByPageId(
    pageId: string
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.prismaClient.traditionalTextBasedLessonPage.findUnique({
      where: { pageId: pageId },
      include: {
        page: {
          include: {
            chapter: {
              include: {
                pages: true,
              },
            },
          },
        },
      },
    });
  }

  public async updateTraditionalTextBasedLessonPage(
    traditionalTextBasedLessonPageId: string,
    pageData: Prisma.TraditionalTextBasedLessonPageUpdateInput
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.prismaClient.traditionalTextBasedLessonPage.update({
      where: { id: traditionalTextBasedLessonPageId },
      data: pageData,
    });
  }

  public async deleteTraditionalTextBasedLessonPage(
    pageId: string
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.prismaClient.traditionalTextBasedLessonPage.delete({
      where: { id: pageId },
    });
  }
}
