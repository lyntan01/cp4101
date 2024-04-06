import { Prisma, PrismaClient, GeneratedExercise } from "@prisma/client";

export class GeneratedExerciseDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createGeneratedExercise(generatedExerciseData: Prisma.GeneratedExerciseCreateInput): Promise<GeneratedExercise> {
    return this.prismaClient.generatedExercise.create({
      data: generatedExerciseData,
    });
  }

  public async getAllGeneratedExercises(): Promise<GeneratedExercise[]> {
    return this.prismaClient.generatedExercise.findMany();
  }

  public async getGeneratedExerciseById(generatedExerciseId: string): Promise<GeneratedExercise | null> {
    return this.prismaClient.generatedExercise.findUnique({
      where: { id: generatedExerciseId },
      include: {
        exercise: true,
        chapter: true,
      },
    });
  }

  public async getGeneratedExercisesByChapterId(chapterId: string): Promise<GeneratedExercise[]> {
    return this.prismaClient.generatedExercise.findMany({
      where: { chapterId: chapterId },
      include: {
        exercise: true,
        chapter: true,
      },
    });
  }

  public async updateGeneratedExercise(
    generatedExerciseId: string,
    generatedExerciseData: Prisma.GeneratedExerciseUpdateInput
  ): Promise<GeneratedExercise | null> {
    return this.prismaClient.generatedExercise.update({
      where: { id: generatedExerciseId },
      data: generatedExerciseData,
    });
  }

  public async deleteGeneratedExercise(generatedExerciseId: string): Promise<GeneratedExercise | null> {
    return this.prismaClient.generatedExercise.delete({
      where: { id: generatedExerciseId },
    });
  }
}
