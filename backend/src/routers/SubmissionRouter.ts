import { Request, Response, Router } from "express";
import { SubmissionService } from "../services/SubmissionService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";

const submissionRouter = Router();
const submissionService = new SubmissionService();

/**
 * POST /submissions/
 * Creates a new submission.
 */
submissionRouter.post("/", async (req: Request, res: Response) => {
    try {
        const submissionData: Prisma.SubmissionUncheckedCreateInput = req.body;
        const newSubmission = await submissionService.createSubmission(submissionData);
        return res.status(201).json(newSubmission);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /submissions/
 * Retrieves a list of all submissions.
 */
submissionRouter.get("/", async (req: Request, res: Response) => {
    try {
        const submissions = await submissionService.getAllSubmissions();
        return res.status(200).json(submissions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /submissions/{submissionId}
 * Retrieves a submission by its unique ID.
 */
submissionRouter.get("/:submissionId", async (req: Request, res: Response) => {
    try {
        const { submissionId } = req.params;
        const submission = await submissionService.getSubmissionById(submissionId);

        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        return res.status(200).json(submission);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /submissions/{submissionId}
 * Updates a submission's information by its unique ID.
 */
submissionRouter.put(
    "/:submissionId",
    restrictBodyId,
    async (req: Request, res: Response) => {
        try {
            const { submissionId } = req.params;
            const submissionData: Prisma.SubmissionUpdateInput = req.body;

            const updatedSubmission = await submissionService.updateSubmission(submissionId, submissionData);

            if (!updatedSubmission) {
                return res.status(404).json({ error: "Submission not found" });
            }

            return res.status(200).json(updatedSubmission);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * DELETE /submissions/{submissionId}
 * Deletes a submission by its unique ID.
 */
submissionRouter.delete("/:submissionId", async (req: Request, res: Response) => {
    try {
        const { submissionId } = req.params;

        const deletedSubmission = await submissionService.deleteSubmission(submissionId);

        if (!deletedSubmission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

export default submissionRouter;
