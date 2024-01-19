import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Page } from "../types/models";

const URL = "/pages";

interface CreatePageData {
  name: string;
  courseId: string;
}

export async function createPage(
  data: CreatePageData
): Promise<AxiosResponse<Page>> {
  try {
    const response: AxiosResponse<Page> = await client.post(`${URL}/`, data);
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

export async function deletePage(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllPages(): Promise<AxiosResponse<Page[]>> {
  return client.get(`${URL}/`);
}

export async function getPageById(id: string): Promise<AxiosResponse<Page>> {
  return client.get(`${URL}/${id}`);
}
