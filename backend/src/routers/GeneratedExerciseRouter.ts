import { Request, Response, Router } from "express";
import { GeneratedExerciseService } from "../services/GeneratedExerciseService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";
import { OpenAiService } from "../services/OpenAiService";

const generatedExerciseRouter = Router();
const generatedExerciseService = new GeneratedExerciseService();
const openAiService = new OpenAiService();

/**
 * POST /generated-exercises/generate-new-exercise
 * Creates a new generated exercise based on chapter and students' previous exercise attempt.
 */
generatedExerciseRouter.post("/generate-new-exercise", async (req: Request, res: Response) => {
    try {
        const data: {
            chapterId: string;
            chapterName: string;
            chapterLearningOutcomes: string[];
            studentPreviousExerciseInstructions: string;
            studentPreviousExerciseAttempt?: string;
            studentPreviousExerciseFeedback?: string;
        } = req.body;
        const newGeneratedExercise = await openAiService.generateNewExercise(data);
        return res.status(201).json(newGeneratedExercise);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});

/**
 * GET /generated-exercises/
 * Retrieves a list of all generatedExercises.
 */
generatedExerciseRouter.get("/", async (req: Request, res: Response) => {
    try {
        const generatedExercises = await generatedExerciseService.getAllGeneratedExercises();
        return res.status(200).json(generatedExercises);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /generated-exercises/{generatedExerciseId}
 * Retrieves a generatedExercise by its unique ID.
 */
generatedExerciseRouter.get("/:generatedExerciseId", async (req: Request, res: Response) => {
    try {
        const { generatedExerciseId } = req.params;
        const generatedExercise = await generatedExerciseService.getGeneratedExerciseById(generatedExerciseId);

        if (!generatedExercise) {
            return res.status(404).json({ error: "GeneratedExercise not found" });
        }

        return res.status(200).json(generatedExercise);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /generated-exercises/{generatedExerciseId}
 * Updates a generatedExercise's information by its unique ID.
 */
generatedExerciseRouter.put(
    "/:generatedExerciseId",
    restrictBodyId,
    async (req: Request, res: Response) => {
        try {
            const { generatedExerciseId } = req.params;
            const generatedExerciseData: Prisma.GeneratedExerciseUpdateInput = req.body;

            const updatedGeneratedExercise = await generatedExerciseService.updateGeneratedExercise(generatedExerciseId, generatedExerciseData);

            if (!updatedGeneratedExercise) {
                return res.status(404).json({ error: "GeneratedExercise not found" });
            }

            return res.status(200).json(updatedGeneratedExercise);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * DELETE /generated-exercises/{generatedExerciseId}
 * Deletes a generatedExercise by its unique ID.
 */
generatedExerciseRouter.delete("/:generatedExerciseId", async (req: Request, res: Response) => {
    try {
        const { generatedExerciseId } = req.params;

        const deletedGeneratedExercise = await generatedExerciseService.deleteGeneratedExercise(generatedExerciseId);

        if (!deletedGeneratedExercise) {
            return res.status(404).json({ error: "GeneratedExercise not found" });
        }

        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

export default generatedExerciseRouter;
