import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Chapter } from "../types/models";

const URL = "/chapters";

export interface GenerateChaptersData {
  courseId: string;
  courseName: string;
  courseLearningOutcomes: string;
  numChapters: number;
}
export interface CreateChapterData {
  name: string;
  learningOutcomes: string[];
  courseId: string;
}

export interface EditChapterData {
  name?: string;
  learningOutcomes?: string[];
}

export async function generateChapters(
  data: GenerateChaptersData
): Promise<AxiosResponse<Chapter[]>> {
  try {
    const response: AxiosResponse<Chapter[]> = await client.post(
      `${URL}/generate`,
      data
    );
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

export async function createChapter(
  data: CreateChapterData
): Promise<AxiosResponse<Chapter>> {
  try {
    const response: AxiosResponse<Chapter> = await client.post(`${URL}/`, data);
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

export async function editChapter(
  chapterId: string,
  data: EditChapterData
): Promise<AxiosResponse<Chapter>> {
  try {
    const response: AxiosResponse<Chapter> = await client.put(`${URL}/${chapterId}`, data);
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

export async function deleteChapter(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllChapters(): Promise<AxiosResponse<Chapter[]>> {
  return client.get(`${URL}/`);
}

export async function getChapterById(
  id: string
): Promise<AxiosResponse<Chapter>> {
  return client.get(`${URL}/${id}`);
}

export async function getAllChaptersByCourseId(
  courseId: string
): Promise<AxiosResponse<Chapter[]>> {
  return client.get(`${URL}/course/${courseId}`);
}
