import { Request, Response, Router } from "express";
import { PageService } from "../services/PageService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";

const pageRouter = Router();
const pageService = new PageService();

/**
 * POST /pages/
 * Creates a new page.
 */
pageRouter.post("/", async (req: Request, res: Response) => {
  try {
    const pageData: Prisma.PageCreateInput = req.body;
    const newPage = await pageService.createPage(pageData);
    return res.status(201).json(newPage);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /pages/
 * Retrieves a list of all pages.
 */
pageRouter.get("/", async (req: Request, res: Response) => {
  try {
    const pages = await pageService.getAllPages();
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
 * PUT /pages/{pageId}
 * Updates a page's information by its unique ID.
 */
pageRouter.put(
  "/:pageId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const pageData: Prisma.PageUpdateInput = req.body;

      const updatedPage = await pageService.updatePage(pageId, pageData);

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
