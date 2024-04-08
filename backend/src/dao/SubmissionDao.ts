import { Prisma, PrismaClient, Submission } from "@prisma/client";

export class SubmissionDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

  public async createSubmission(submissionData: Prisma.SubmissionUncheckedCreateInput): Promise<Submission> {
    return this.prismaClient.submission.create({
      data: submissionData,
    });
  }

  public async getAllSubmissions(): Promise<Submission[]> {
    return this.prismaClient.submission.findMany({
      include: {
        exercise: true,
        student: true,
      },
    });
  }

  public async getSubmissionById(submissionId: string): Promise<Submission | null> {
    return this.prismaClient.submission.findUnique({
      where: { id: submissionId },
      include: {
        exercise: true,
        student: true,
      },
    });
  }

  public async getLatestSubmissionByChapterIdAndStudentId(chapterId: string, studentId: string): Promise<Submission | null> {
    return this.prismaClient.submission.findFirst({
      where: {
        studentId: studentId,
        exercise: {
          exercisePage: {
            page: {
              chapterId: chapterId,
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        exercise: true,
        student: true,
      },
    });
  }

  public async getLatestSubmissionByExercisePageIdAndStudentId(exercisePageId: string, studentId: string): Promise<Submission | null> {
    return this.prismaClient.submission.findFirst({
      where: {
        studentId: studentId,
        exercise: {
          exercisePage: {
            id: exercisePageId,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        exercise: true,
        student: true,
      },
    });
  }

  public async updateSubmission(
    submissionId: string,
    submissionData: Prisma.SubmissionUpdateInput
  ): Promise<Submission | null> {
    return this.prismaClient.submission.update({
      where: { id: submissionId },
      data: submissionData,
    });
  }

  public async deleteSubmission(submissionId: string): Promise<Submission | null> {
    return this.prismaClient.submission.delete({
      where: { id: submissionId },
    });
  }
}
