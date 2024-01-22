import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Page, TraditionalTextBasedLessonPage } from "../types/models";

const URL = "/text-pages";

export interface CreateTextPageData {
  title: string;
  content: string;
  chapterId: string;
}

export interface CreateOrUpdateTextPageResponse {
  id: string;
  content: string;
  pageId: string;
}

export interface UpdateTextPageData {
  textPageId: string;
  title: string;
  content: string;
}

export async function createTextPage(
  data: CreateTextPageData
): Promise<AxiosResponse<CreateOrUpdateTextPageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateTextPageResponse> =
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

export async function updateTextPage(
  data: UpdateTextPageData
): Promise<AxiosResponse<CreateOrUpdateTextPageResponse>> {
  try {
    const response: AxiosResponse<CreateOrUpdateTextPageResponse> =
      await client.put(`${URL}/${data.textPageId}`, data);
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

export async function deleteTextPage(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllTextPages(): Promise<
  AxiosResponse<TraditionalTextBasedLessonPage[]>
> {
  return client.get(`${URL}/`);
}

export async function getTextPageById(
  id: string
): Promise<AxiosResponse<TraditionalTextBasedLessonPage>> {
  return client.get(`${URL}/${id}`);
}

export async function getTextPageByPageId(
  id: string
): Promise<AxiosResponse<TraditionalTextBasedLessonPage>> {
  return client.get(`${URL}/page/${id}`);
}
