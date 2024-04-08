import axios, { AxiosResponse } from "axios";
import client from "./client";
import { Submission } from "../types/models";

const URL = "/submissions";

export async function editTeacherFeedback(
    submissionId: string,
    teacherFeedback: string
): Promise<AxiosResponse<Submission>> {
    try {
        const response: AxiosResponse<Submission> =
            await client.put(`${URL}/${submissionId}`, {
                teacherFeedback: teacherFeedback
            });
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

export async function getLatestSubmissionByChapterIdAndStudentId(
    chapterId: string,
    studentId: string
): Promise<AxiosResponse<Submission>> {
    return client.get(`${URL}/latest/${chapterId}/${studentId}`);
}

export async function getAllSubmissions(): Promise<AxiosResponse<Submission[]>> {
    return client.get(`${URL}/`);
}

export async function getSubmissionById(
    id: string
): Promise<AxiosResponse<Submission>> {
    return client.get(`${URL}/${id}`);
}

