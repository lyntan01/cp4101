import { Request, Response, Router } from "express";
import { FileService } from "../services/FileService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";
import { OpenAiService } from "../services/OpenAiService";

const fileRouter = Router();
const fileService = new FileService();

/**
 * POST /files/
 * Creates a new file.
 */
fileRouter.post("/", async (req: Request, res: Response) => {
  try {
    const fileData: Prisma.FileCreateInput = req.body;
    const newFile = await fileService.createFile(fileData);
    return res.status(201).json(newFile);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /files/
 * Retrieves a list of all files.
 */
fileRouter.get("/", async (req: Request, res: Response) => {
  try {
    const files = await fileService.getAllFiles();
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /files/{fileId}
 * Retrieves a file by its unique ID.
 */
fileRouter.get("/:fileId", async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const file = await fileService.getFileById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    return res.status(200).json(file);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /files/{fileId}
 * Updates a file's information by its unique ID.
 */
fileRouter.put(
  "/:fileId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { fileId } = req.params;
      const fileData: Prisma.FileUpdateInput = req.body;

      const updatedFile = await fileService.updateFile(
        fileId,
        fileData
      );

      if (!updatedFile) {
        return res.status(404).json({ error: "File not found" });
      }

      return res.status(200).json(updatedFile);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /files/{fileId}
 * Deletes a file by its unique ID.
 */
fileRouter.delete("/:fileId", async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    const deletedFile = await fileService.deleteFile(fileId);

    if (!deletedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default fileRouter;
