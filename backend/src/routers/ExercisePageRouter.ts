import { Request, Response, Router } from "express";
import { ExercisePageService } from "../services/ExercisePageService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";
import {
  CreateExercisePageData,
  UpdateExercisePageData,
} from "../types/page";
import { OpenAiService } from "../services/OpenAiService";

const exercisePageRouter = Router();
const exercisePageService =
  new ExercisePageService();
const openAiService = new OpenAiService();

/**
 * POST /exercise-pages/
 * Creates a new exercise page.
 */
exercisePageRouter.post(
  "/",
  async (req: Request, res: Response) => {
    try {
      const pageData: CreateExercisePageData = req.body;
      const newPage =
        await exercisePageService.createExercisePage(
          pageData
        );
      return res.status(201).json(newPage);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

/**
 * POST /exercise-pages/generate-exercise-page
 * Creates a new exercise page from chapter name and chapter learning outcomes.
 */
exercisePageRouter.post(
  "/generate-exercise-page",
  async (req: Request, res: Response) => {
    try {
      const chapterData: {
        chapterId: string;
        chapterName: string;
        chapterLearningOutcomes: string[];
      } = req.body;
      const newExercisePage = await openAiService.generateExercisePage(chapterData);
      return res.status(201).json(newExercisePage);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

/**
 * POST /exercise-pages/get-student-answer-feedback
 * Retrieves generated feedback for student's answer for an exercise.
 */
exercisePageRouter.post(
  "/get-student-answer-feedback",
  async (req: Request, res: Response) => {
    try {
      const exerciseAnswerData: {
        exerciseInstructions: string;
        correctAnswer: string;
        studentAnswer: string;
      } = req.body;
      const feedback = await openAiService.getExerciseStudentAnswerFeedback(exerciseAnswerData);
      return res.status(201).json(feedback);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

/**
 * GET /exercise-pages/
 * Retrieves a list of all exercise pages.
 */
exercisePageRouter.get(
  "/",
  async (req: Request, res: Response) => {
    try {
      const pages =
        await exercisePageService.getAllExercisePages();
      return res.status(200).json(pages);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /exercise-pages/{pageId}
 * Retrieves a exercise page by its unique ID.
 */
exercisePageRouter.get(
  "/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const page =
        await exercisePageService.getExercisePageById(
          pageId
        );

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      return res.status(200).json(page);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /exercise-pages/page/{pageId}
 * Retrieves a exercise page by the ID of the parent Page class.
 */
exercisePageRouter.get(
  "/page/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const page =
        await exercisePageService.getExercisePageByPageId(
          pageId
        );

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      return res.status(200).json(page);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * PUT /exercise-pages/{pageId}
 * Updates a exercise page's information by its unique ID.
 */
exercisePageRouter.put(
  "/:pageId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const pageData: UpdateExercisePageData = req.body;
      pageData.pageId = pageId;

      const updatedPage =
        await exercisePageService.updateExercisePage(
          pageData
        );

      if (!updatedPage) {
        return res.status(404).json({ error: "Page not found" });
      }

      return res.status(200).json(updatedPage);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /exercise-pages/{pageId}
 * Deletes a exercise page by its unique ID.
 */
exercisePageRouter.delete(
  "/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;

      const deletedPage =
        await exercisePageService.deleteExercisePage(
          pageId
        );

      if (!deletedPage) {
        return res.status(404).json({ error: "Page not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

export default exercisePageRouter;
