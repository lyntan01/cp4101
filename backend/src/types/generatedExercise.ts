import { GeneratedExercise } from "@prisma/client";

export type GeneratedExerciseWithExercise = GeneratedExercise & {
    exercise: {
        id: string;
        instructions: string;
        sandboxId: string;
        correctAnswer: string;
    };
};
