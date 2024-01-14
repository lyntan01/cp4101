import { Request, Response, NextFunction, Router } from "express";
import { UserService } from "../services/UserService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";

const userRouter = Router();
const userService = new UserService();

/**
 * POST /users/
 * Creates a new user.
 */
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const userData: Prisma.UserCreateInput = req.body;
    const newUser = await userService.createUser(userData);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /users/
 * Retrieves a list of all users.
 */
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /users/{userId}
 * Retrieves a user by its unique ID.
 */
userRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /users/{userId}
 * Updates a user's information by its unique ID.
 */
userRouter.put(
  "/:userId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userData: Prisma.UserUpdateInput = req.body;

      const updatedUser = await userService.updateUser(userId, userData);

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /users/{userId}
 * Deletes a user by its unique ID.
 */
userRouter.delete("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default userRouter;
