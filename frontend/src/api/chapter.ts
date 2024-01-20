import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Chapter } from "../types/models";

const URL = "/chapters";

export interface CreateChapterData {
  name: string;
  courseId: string;
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
