import { Request, Response, Router } from "express";
import { ExplorationPageService } from "../services/ExplorationPageService";
import { restrictBodyId } from "../middleware/validationMiddleware";
import {
  CreateExplorationPageData,
  UpdateExplorationPageData,
} from "../types/page";
import { OpenAiService } from "../services/OpenAiService";

const explorationPageRouter = Router();
const explorationPageService =
  new ExplorationPageService();
const openAiService = new OpenAiService();

/**
 * POST /exploration-pages/
 * Creates a new exploration page.
 */
explorationPageRouter.post(
  "/",
  async (req: Request, res: Response) => {
    try {
      const pageData: CreateExplorationPageData = req.body;
      const newPage =
        await explorationPageService.createExplorationPage(
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
 * POST /exploration-pages/generate-exploration-page
 * Creates a new exploration page from chapter name and chapter learning outcomes.
 */
explorationPageRouter.post(
  "/generate-exploration-page",
  async (req: Request, res: Response) => {
    try {
      const chapterData: {
        chapterId: string;
        chapterName: string;
        chapterLearningOutcomes: string[];
      } = req.body;
      const newExplorationPage = await openAiService.generateExplorationPage(chapterData);
      return res.status(201).json(newExplorationPage);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

/**
 * POST /exploration-pages/get-student-attempt-feedback
 * Retrieves generated feedback for student's attempt for an exploration prompt.
 */
explorationPageRouter.post(
  "/get-student-attempt-feedback",
  async (req: Request, res: Response) => {
    try {
      const explorationAnswerData: {
        explorationInstructions: string;
        studentDescription: string;
        studentAnswer: string;
        // Add files to the prompt?
      } = req.body;
      const feedback = await openAiService.getExplorationStudentAttemptFeedback(explorationAnswerData);
      return res.status(201).json(feedback);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

/**
 * GET /exploration-pages/
 * Retrieves a list of all exploration pages.
 */
explorationPageRouter.get(
  "/",
  async (req: Request, res: Response) => {
    try {
      const pages =
        await explorationPageService.getAllExplorationPages();
      return res.status(200).json(pages);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /exploration-pages/{pageId}
 * Retrieves a exploration page by its unique ID.
 */
explorationPageRouter.get(
  "/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const page =
        await explorationPageService.getExplorationPageById(
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
 * GET /exploration-pages/page/{pageId}
 * Retrieves a exploration page by the ID of the parent Page class.
 */
explorationPageRouter.get(
  "/page/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const page =
        await explorationPageService.getExplorationPageByPageId(
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
 * PUT /exploration-pages/{pageId}
 * Updates a exploration page's information by its unique ID.
 */
explorationPageRouter.put(
  "/:pageId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const pageData: UpdateExplorationPageData = req.body;
      pageData.pageId = pageId;

      const updatedPage =
        await explorationPageService.updateExplorationPage(
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
 * DELETE /exploration-pages/{pageId}
 * Deletes a exploration page by its unique ID.
 */
explorationPageRouter.delete(
  "/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;

      const deletedPage =
        await explorationPageService.deleteExplorationPage(
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

export default explorationPageRouter;
