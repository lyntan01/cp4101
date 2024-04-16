import { PrismaClient } from "@prisma/client";
import { ChapterAnalytics } from "../types/analytics";

export class AnalyticsService {
    constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

    public async computeChapterAnalytics(courseId: string, totalStudentsInCourse: number): Promise<ChapterAnalytics[]> {
        // Step 1: Fetch chapters with pages and generated exercises
        const chapters = await this.prismaClient.chapter.findMany({
            where: { courseId: courseId },
            include: {
                pages: {
                    include: {
                        exercisePage: {
                            include: {
                                exercise: {
                                    include: {
                                        submissions: true,
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        type: 'EXERCISE',
                    },
                },
                generatedExercises: {
                    include: {
                        exercise: {
                            include: {
                                submissions: true,
                            }
                        }
                    }
                },
            },
        });

        // Step 2: Computer chapter analytics
        return chapters.map(chapter => {
            // Tracking submissions and students for ExercisePages
            const exercisePageSubmissions = new Set();
            const studentsWithExercisePageSubmissions = new Set();

            // Tracking submissions and students for GeneratedExercises
            const generatedExerciseSubmissions = new Set();
            const studentsWithGeneratedExerciseSubmissions = new Set();

            // Process ExercisePages
            chapter.pages.forEach(page => {
                if (page.exercisePage) {
                    page.exercisePage.exercise.submissions.forEach(submission => {
                        exercisePageSubmissions.add(submission.id);
                        studentsWithExercisePageSubmissions.add(submission.studentId);
                    });
                }
            });

            // Process GeneratedExercises
            chapter.generatedExercises.forEach(genExercise => {
                genExercise.exercise.submissions.forEach(submission => {
                    generatedExerciseSubmissions.add(submission.id);
                    studentsWithGeneratedExerciseSubmissions.add(submission.studentId);
                });
            });

            return {
                chapterId: chapter.id,
                chapterName: chapter.name,
                studentsWithExercisePageSubmissions: studentsWithExercisePageSubmissions.size,
                percentStudentsWithExercisePageSubmissions: Math.round((studentsWithExercisePageSubmissions.size / totalStudentsInCourse) * 100), // rounded to nearest integer
                studentsWithGeneratedExerciseSubmissions: studentsWithGeneratedExerciseSubmissions.size,
                avgSubmissionsPerStudent: (exercisePageSubmissions.size / studentsWithExercisePageSubmissions.size)
            };
        });
    }
}
