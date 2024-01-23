import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Page } from "../types/models";

const URL = "/pages";

export async function deletePage(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllPages(): Promise<AxiosResponse<Page[]>> {
  return client.get(`${URL}/`);
}

export async function getPageById(id: string): Promise<AxiosResponse<Page>> {
  return client.get(`${URL}/${id}`);
}
