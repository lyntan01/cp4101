import { Request, Response, Router } from "express";
import { TraditionalTextBasedLessonPageService } from "../services/TraditionalTextBasedLessonPageService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";
import {
  CreateTraditionalTextBasedLessonPageData,
  UpdateTraditionalTextBasedLessonPageData,
} from "../types/page";
import { OpenAiService } from "../services/OpenAiService";

const traditionalTextBasedLessonPageRouter = Router();
const traditionalTextBasedLessonPageService =
  new TraditionalTextBasedLessonPageService();
const openAiService = new OpenAiService();

/**
 * POST /text-pages/
 * Creates a new traditional text-based lesson page.
 */
traditionalTextBasedLessonPageRouter.post(
  "/",
  async (req: Request, res: Response) => {
    try {
      const pageData: CreateTraditionalTextBasedLessonPageData = req.body;
      const newPage =
        await traditionalTextBasedLessonPageService.createTraditionalTextBasedLessonPage(
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
 * POST /text-pages/generate-lesson-page
 * Creates a new lesson page from chapter name and chapter learning outcomes.
 */
traditionalTextBasedLessonPageRouter.post(
  "/generate-lesson-page",
  async (req: Request, res: Response) => {
    try {
      const chapterData: {
        chapterId: string;
        chapterName: string;
        chapterLearningOutcomes: string[];
      } = req.body;
      const newLessonPage = await openAiService.generateLessonPage(chapterData);
      return res.status(201).json(newLessonPage);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

/**
 * GET /text-pages/
 * Retrieves a list of all traditional text-based lesson pages.
 */
traditionalTextBasedLessonPageRouter.get(
  "/",
  async (req: Request, res: Response) => {
    try {
      const pages =
        await traditionalTextBasedLessonPageService.getAllTraditionalTextBasedLessonPages();
      return res.status(200).json(pages);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /text-pages/{pageId}
 * Retrieves a traditional text-based lesson page by its unique ID.
 */
traditionalTextBasedLessonPageRouter.get(
  "/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const page =
        await traditionalTextBasedLessonPageService.getTraditionalTextBasedLessonPageById(
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
 * GET /text-pages/page/{pageId}
 * Retrieves a traditional text-based lesson page by the ID of the parent Page class.
 */
traditionalTextBasedLessonPageRouter.get(
  "/page/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const page =
        await traditionalTextBasedLessonPageService.getTraditionalTextBasedLessonPageByPageId(
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
 * PUT /text-pages/{pageId}
 * Updates a traditional text-based lesson page's information by its unique ID.
 */
traditionalTextBasedLessonPageRouter.put(
  "/:pageId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const pageData: UpdateTraditionalTextBasedLessonPageData = req.body;
      pageData.pageId = pageId;

      const updatedPage =
        await traditionalTextBasedLessonPageService.updateTraditionalTextBasedLessonPage(
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
 * DELETE /text-pages/{pageId}
 * Deletes a traditional text-based lesson page by its unique ID.
 */
traditionalTextBasedLessonPageRouter.delete(
  "/:pageId",
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;

      const deletedPage =
        await traditionalTextBasedLessonPageService.deleteTraditionalTextBasedLessonPage(
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

export default traditionalTextBasedLessonPageRouter;
