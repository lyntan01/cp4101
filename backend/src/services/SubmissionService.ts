import { SubmissionDao } from "../dao/SubmissionDao";
import { Submission, Prisma } from "@prisma/client";
import { PageDao } from "../dao/PageDao";

export class SubmissionService {
    constructor(private submissionDao: SubmissionDao = new SubmissionDao(), private pageDao: PageDao = new PageDao()) { }

    public async createSubmission(
        submissionData: Prisma.SubmissionUncheckedCreateInput
    ): Promise<Submission | null> {
        return this.submissionDao.createSubmission(submissionData);
    }

    public async getAllSubmissions(): Promise<Submission[]> {
        return this.submissionDao.getAllSubmissions();
    }

    public async getSubmissionById(submissionId: string): Promise<Submission | null> {
        return this.submissionDao.getSubmissionById(submissionId);
    }

    public async updateSubmission(
        submissionId: string,
        submissionData: Prisma.SubmissionUpdateInput
    ): Promise<Submission | null> {
        return this.submissionDao.updateSubmission(submissionId, submissionData);
    }

    public async deleteSubmission(submissionId: string): Promise<Submission | null> {
        return this.submissionDao.deleteSubmission(submissionId);
    }
}
