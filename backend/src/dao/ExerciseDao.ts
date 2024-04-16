import { Prisma, PrismaClient, Exercise } from "@prisma/client";

export class ExerciseDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createExercise(exerciseData: Prisma.ExerciseCreateInput): Promise<Exercise> {
    return this.prismaClient.exercise.create({
      data: exerciseData,
    });
  }

  public async getAllExercises(): Promise<Exercise[]> {
    return this.prismaClient.exercise.findMany();
  }

  public async getExerciseById(exerciseId: string): Promise<Exercise | null> {
    return this.prismaClient.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        submissions: true,
      },
    });
  }

  public async updateExercise(
    exerciseId: string,
    exerciseData: Prisma.ExerciseUpdateInput
  ): Promise<Exercise | null> {
    return this.prismaClient.exercise.update({
      where: { id: exerciseId },
      data: exerciseData,
    });
  }

  public async deleteExercise(exerciseId: string): Promise<Exercise | null> {
    return this.prismaClient.exercise.delete({
      where: { id: exerciseId },
    });
  }
}
