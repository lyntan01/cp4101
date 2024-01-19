import { Request, Response, Router } from "express";
import { ChapterService } from "../services/ChapterService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";

const chapterRouter = Router();
const chapterService = new ChapterService();

/**
 * POST /chapters/
 * Creates a new chapter.
 */
chapterRouter.post("/", async (req: Request, res: Response) => {
  try {
    const chapterData: Prisma.ChapterCreateInput = req.body;
    const newChapter = await chapterService.createChapter(chapterData);
    return res.status(201).json(newChapter);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /chapters/
 * Retrieves a list of all chapters.
 */
chapterRouter.get("/", async (req: Request, res: Response) => {
  try {
    const chapters = await chapterService.getAllChapters();
    return res.status(200).json(chapters);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /chapters/{chapterId}
 * Retrieves a chapter by its unique ID.
 */
chapterRouter.get("/:chapterId", async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const chapter = await chapterService.getChapterById(chapterId);

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    return res.status(200).json(chapter);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /chapters/{chapterId}
 * Updates a chapter's information by its unique ID.
 */
chapterRouter.put(
  "/:chapterId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { chapterId } = req.params;
      const chapterData: Prisma.ChapterUpdateInput = req.body;

      const updatedChapter = await chapterService.updateChapter(
        chapterId,
        chapterData
      );

      if (!updatedChapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }

      return res.status(200).json(updatedChapter);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /chapters/{chapterId}
 * Deletes a chapter by its unique ID.
 */
chapterRouter.delete("/:chapterId", async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    const deletedChapter = await chapterService.deleteChapter(chapterId);

    if (!deletedChapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default chapterRouter;
