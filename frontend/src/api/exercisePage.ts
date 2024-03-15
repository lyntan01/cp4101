import axios, { AxiosResponse } from "axios";
import client from "./client";
import { ExercisePage } from "../types/models";

const URL = "/exercise-pages";

export interface CreateExercisePageData {
  title: string;
  chapterId: string;
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
}

export interface CreateOrUpdateExercisePageResponse { //  TO CHECK AND EDIT ACCORDINGLY
  id: string;
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
  pageId: string;
}

export interface UpdateExercisePageData {
  exercisePageId: string;
  title: string;
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
}

export interface GenerateExercisePageData {
  chapterId: string;
  chapterName: string;
  chapterLearningOutcomes: string[];
}

export interface GetExerciseStudentAnswerFeedbackData {
  exerciseInstructions: string;
  correctAnswer: string;
  studentAnswer: string;
}

export async function createExercisePage(
  data: CreateExercisePageData
): Promise<AxiosResponse<CreateOrUpdateExercisePageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateExercisePageResponse> =
      await client.post(`${URL}/`, data);
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

export async function updateExercisePage(
  data: UpdateExercisePageData
): Promise<AxiosResponse<CreateOrUpdateExercisePageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateExercisePageResponse> =
      await client.put(`${URL}/${data.exercisePageId}`, data);
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

export async function generateExercisePage(
  data: GenerateExercisePageData
): Promise<AxiosResponse<CreateOrUpdateExercisePageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateExercisePageResponse> =
      await client.post(`${URL}/generate-exercise-page`, data);
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

export async function getExerciseStudentAnswerFeedback(
  data: GetExerciseStudentAnswerFeedbackData
): Promise<AxiosResponse<string>> {
  try {
    const response: AxiosResponse<string> =
      await client.post(`${URL}/get-student-answer-feedback`, data);
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

export async function deleteExercisePage(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllExercisePages(): Promise<
  AxiosResponse<ExercisePage[]>
> {
  return client.get(`${URL}/`);
}

export async function getExercisePageById(
  id: string
): Promise<AxiosResponse<ExercisePage>> {
  return client.get(`${URL}/${id}`);
}

export async function getExercisePageByPageId(
  id: string
): Promise<AxiosResponse<ExercisePage>> {
  return client.get(`${URL}/page/${id}`);
}
