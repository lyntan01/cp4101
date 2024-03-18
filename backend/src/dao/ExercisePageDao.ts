import {
  ExercisePage,
  Prisma,
  PrismaClient,
} from "@prisma/client";

export class ExercisePageDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createExercisePage(
    pageData: Prisma.ExercisePageUncheckedCreateInput
  ): Promise<ExercisePage> {
    return this.prismaClient.exercisePage.create({
      data: pageData,
    });
  }

  public async getAllExercisePages(): Promise<
    ExercisePage[]
  > {
    return this.prismaClient.exercisePage.findMany();
  }

  public async getExercisePageById(
    pageId: string
  ): Promise<ExercisePage | null> {
    return this.prismaClient.exercisePage.findUnique({
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
        files: true,
      },
    });
  }

  public async getExercisePageByPageId(
    pageId: string
  ): Promise<ExercisePage | null> {
    return this.prismaClient.exercisePage.findUnique({
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
        files: true,
      },
    });
  }

  public async updateExercisePage(
    exercisePageId: string,
    pageData: Prisma.ExercisePageUpdateInput
  ): Promise<ExercisePage | null> {
    return this.prismaClient.exercisePage.update({
      where: { id: exercisePageId },
      data: pageData,
    });
  }

  public async deleteExercisePage(
    pageId: string
  ): Promise<ExercisePage | null> {
    const response = await this.prismaClient.$transaction(async (prisma) => {
      // Delete files if they exist
      await prisma.file.deleteMany({
        where: { exercisePageId: pageId },
      });

      // Finally, delete the ExercisePage
      return this.prismaClient.exercisePage.delete({
        where: { id: pageId },
      });
    });

    return response;
  }
}
