import axios, { AxiosResponse } from "axios";
import client from "./client";
import { ExplorationPage } from "../types/models";

const URL = "/exploration-pages";

export interface CreateExplorationPageData {
  title: string;
  chapterId: string;
  instructions: string;
  sandboxId: string;
}

export interface CreateOrUpdateExplorationPageResponse { //  TO CHECK AND EDIT ACCORDINGLY
  id: string;
  instructions: string;
  sandboxId: string;
  pageId: string;
}

export interface UpdateExplorationPageData {
  explorationPageId: string;
  title: string;
  instructions: string;
  sandboxId: string;
}

export interface GenerateExplorationPageData {
  chapterId: string;
  chapterName: string;
  chapterLearningOutcomes: string[];
}

export interface GetExplorationStudentAttemptFeedbackData {
  explorationInstructions: string;
  studentDescription: string;
  studentAnswer: string;
}

export async function createExplorationPage(
  data: CreateExplorationPageData
): Promise<AxiosResponse<CreateOrUpdateExplorationPageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateExplorationPageResponse> =
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

export async function updateExplorationPage(
  data: UpdateExplorationPageData
): Promise<AxiosResponse<CreateOrUpdateExplorationPageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateExplorationPageResponse> =
      await client.put(`${URL}/${data.explorationPageId}`, data);
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

export async function generateExplorationPage(
  data: GenerateExplorationPageData
): Promise<AxiosResponse<CreateOrUpdateExplorationPageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateExplorationPageResponse> =
      await client.post(`${URL}/generate-exploration-page`, data);
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

export async function getExplorationStudentAttemptFeedback(
  data: GetExplorationStudentAttemptFeedbackData
): Promise<AxiosResponse<string>> {
  try {
    const response: AxiosResponse<string> =
      await client.post(`${URL}/get-student-attempt-feedback`, data);
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

export async function deleteExplorationPage(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllExplorationPages(): Promise<
  AxiosResponse<ExplorationPage[]>
> {
  return client.get(`${URL}/`);
}

export async function getExplorationPageById(
  id: string
): Promise<AxiosResponse<ExplorationPage>> {
  return client.get(`${URL}/${id}`);
}

export async function getExplorationPageByPageId(
  id: string
): Promise<AxiosResponse<ExplorationPage>> {
  return client.get(`${URL}/page/${id}`);
}
