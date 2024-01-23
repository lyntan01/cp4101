import { Request, Response, Router } from "express";
import { PageService } from "../services/PageService";

const pageRouter = Router();
const pageService = new PageService();

/**
 * GET /pages/chapter/:chapterId
 * Retrieves a list of all pages in a chapter.
 */
pageRouter.get("/chapter/:chapterId", async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const pages = await pageService.getAllPagesByChapterId(chapterId);
    return res.status(200).json(pages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /pages/{pageId}
 * Retrieves a page by its unique ID.
 */
pageRouter.get("/:pageId", async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const page = await pageService.getPageById(pageId);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.status(200).json(page);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /pages/{pageId}
 * Deletes a page by its unique ID.
 */
pageRouter.delete("/:pageId", async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    const deletedPage = await pageService.deletePage(pageId);

    if (!deletedPage) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default pageRouter;
