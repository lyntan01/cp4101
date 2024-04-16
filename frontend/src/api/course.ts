import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Course } from "../types/models";

const URL = "/courses";

export interface CreateCourseData {
  name: string;
  description: string;
  teacherId: string;
}

export interface EnrollStudentsData {
  studentEmails: string[];
  courseId: string;
}

export interface RemoveStudentData {
  studentId: string;
  courseId: string;
}

export interface ChapterAnalytics {
  chapterId: string,
  chapterName: string,
  studentsWithExercisePageSubmissions: number,
  percentStudentsWithExercisePageSubmissions: number,
  studentsWithGeneratedExerciseSubmissions: number,
  avgSubmissionsPerStudent: number
}

export async function createCourse(
  data: CreateCourseData
): Promise<AxiosResponse<Course>> {
  try {
    const response: AxiosResponse<Course> = await client.post(`${URL}/`, data);
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

export async function enrollStudents(
  data: EnrollStudentsData
): Promise<AxiosResponse<Course>> {
  try {
    const response: AxiosResponse<Course> = await client.post(
      `${URL}/enrollStudents`,
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

export async function removeStudent(
  data: RemoveStudentData
): Promise<AxiosResponse<Course>> {
  try {
    const response: AxiosResponse<Course> = await client.post(
      `${URL}/removeStudent`,
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

export async function getCreatedCoursesByTeacherId(
  teacherId: string
): Promise<AxiosResponse<Course[]>> {
  return client.get(`${URL}/teacher/${teacherId}`);
}

export async function getChapterAnalytics(
  courseId: string,
  totalStudentsInCourse: number
): Promise<AxiosResponse<ChapterAnalytics[]>> {
  return client.get(`${URL}/analytics/${courseId}/${totalStudentsInCourse}`);
}

export async function deleteCourse(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/${id}`);
}

export async function getAllCourses(): Promise<AxiosResponse<Course[]>> {
  return client.get(`${URL}/`);
}

export async function getCourseById(
  id: string
): Promise<AxiosResponse<Course>> {
  return client.get(`${URL}/${id}`);
}
