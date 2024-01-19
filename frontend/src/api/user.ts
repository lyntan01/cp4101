import axios, { AxiosResponse } from "axios";
import client from "./client";
import { User, UserRoleEnum } from "../types/user";

const URL = "/users";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
}

interface LoginData {
  email: string;
  password: string;
}

interface LogoutResponse {
  message: string;
}

export async function registerUser(
  data: RegisterUserData
): Promise<AxiosResponse<User>> {
  try {
    const response: AxiosResponse<User> = await client.post(
      `${URL}/register`,
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

export async function loginUser(data: LoginData): Promise<AxiosResponse<User>> {
  try {
    const response: AxiosResponse<User> = await client.post(
      `${URL}/login`,
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

export async function logoutUser(): Promise<AxiosResponse<LogoutResponse>> {
  return client.post(`${URL}/logout`);
}

export async function fetchUser(): Promise<AxiosResponse<User>> {
  return client.get(`${URL}/check-auth`);
}

export async function deleteUser(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/delete/${id}`);
}

export async function getAllUsers(): Promise<AxiosResponse<User[]>> {
  return client.get(`${URL}/getAllUsers`);
}
