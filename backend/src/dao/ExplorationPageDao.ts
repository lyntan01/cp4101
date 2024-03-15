import {
  ExplorationPage,
  Prisma,
  PrismaClient,
} from "@prisma/client";

export class ExplorationPageDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createExplorationPage(
    pageData: Prisma.ExplorationPageUncheckedCreateInput
  ): Promise<ExplorationPage> {
    return this.prismaClient.explorationPage.create({
      data: pageData,
    });
  }

  public async getAllExplorationPages(): Promise<
    ExplorationPage[]
  > {
    return this.prismaClient.explorationPage.findMany();
  }

  public async getExplorationPageById(
    pageId: string
  ): Promise<ExplorationPage | null> {
    return this.prismaClient.explorationPage.findUnique({
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

  public async getExplorationPageByPageId(
    pageId: string
  ): Promise<ExplorationPage | null> {
    return this.prismaClient.explorationPage.findUnique({
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

  public async updateExplorationPage(
    explorationPageId: string,
    pageData: Prisma.ExplorationPageUpdateInput
  ): Promise<ExplorationPage | null> {
    return this.prismaClient.explorationPage.update({
      where: { id: explorationPageId },
      data: pageData,
    });
  }

  public async deleteExplorationPage(
    pageId: string
  ): Promise<ExplorationPage | null> {
    return this.prismaClient.explorationPage.delete({
      where: { id: pageId },
    });
  }
}
