import axios, { AxiosResponse } from "axios";
import client from "./client";
import { GeneratedExercise } from "../types/models";

const URL = "/generated-exercises";

export interface CreateGeneratedExerciseData {
    chapterId: string;
    chapterName: string;
    chapterLearningOutcomes: string[];
    studentPreviousExerciseInstructions: string;
    studentPreviousExerciseAttempt?: string;
    studentPreviousExerciseFeedback?: string;
}

export interface CreateGeneratedExerciseResponse { //  TO CHECK AND EDIT ACCORDINGLY
    id: string; // ID of the GeneratedExercise
    chapterId: string;
    exercise: {
        id: string; // ID of the associated Exercise
        instructions: string;
        sandboxId: string;
        correctAnswer: string;
    };
}

export async function generateNewExercise(
    data: CreateGeneratedExerciseData
): Promise<AxiosResponse<CreateGeneratedExerciseResponse>> {
    try {
        const response: AxiosResponse<CreateGeneratedExerciseResponse> =
            await client.post(`${URL}/generate-new-exercise`, data);
        return response;
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 400
        ) {
            throw error.response.data.error;
        } else {
            throw error;
        }
    }
}

export async function getGeneratedExerciseById(
    id: string
): Promise<AxiosResponse<GeneratedExercise>> {
    return client.get(`${URL}/${id}`);
}