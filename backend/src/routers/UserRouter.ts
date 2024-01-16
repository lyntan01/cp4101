import { Request, Response, NextFunction, Router } from "express";
import { UserService } from "../services/UserService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";
import jwt from "jsonwebtoken";
import { UserLoginData } from "../types/user";
import { JWT_SECRET_KEY } from "../config/config.ts";

const userRouter = Router();
const userService = new UserService();

/**
 * POST /users/register
 * Creates a new user.
 */
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const userData: Prisma.UserCreateInput = req.body;
    const newUser = await userService.registerUser(userData);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * POST /users/login
 * Logs in a user using their email and password, returns a cookie that lasts 4 hours, containing the JWT Token
 */
userRouter.post("/login", async (req, res) => {
  try {
    const input = req.body as UserLoginData;
    const { token, userData } = await userService.login(input);

    res.cookie("jwtToken_login", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure in production
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000, // 4 hours (needs to be same expiry as the JWT token)
    });

    res.status(200).json(userData); // send user data in the response body
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /users/logout
 * removes the cookie for the user who sent in the request
 */
userRouter.post("/logout", (req, res) => {
  res
    .clearCookie("jwtToken_login", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure in production
      sameSite: "strict",
    })
    .status(200)
    .send({ message: "Logout successful" });
});

/**
 * GET /users/check-auth
 * Checks the token in the cookie and return the user information
 */
userRouter.get("/check-auth", (req, res) => {
  const token = req.cookies.jwtToken_Admin;

  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(403).send({ message: "Invalid token" });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id } = decoded;

        try {
          // Query the database to retrieve the user by id
          const user = await userService.getUserById(id);

          if (!user) {
            res.status(404).send({ message: "User not found" });
          } else {
            // Destructure user object to omit password and possibly other sensitive fields
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userData } = user;
            res.status(200).send(userData); //returns user information without password
          }
        } catch (error) {
          // Handle database errors or any other errors that might occur
          res.status(500).send({ message: "Internal Server Error" });
        }
      }
    });
  } else {
    res.status(401).send({ message: "No token provided" });
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
