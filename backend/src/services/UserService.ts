import { UserDao } from "../dao/UserDao";
import { User, Prisma } from "@prisma/client";
import { UserLoginData } from "../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config.ts";
export class UserService {
  constructor(private userDao: UserDao = new UserDao()) {}

  public async registerUser(
    userData: Prisma.UserCreateInput
  ): Promise<User | null> {
    userData.password = await bcrypt.hash(userData.password, 10);
    return this.userDao.createUser(userData);
  }

  public async login(data: UserLoginData) {
    const user = await this.userDao.getUserByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error("Invalid credentials.");
    }

    // Generate a JWT token with necessary user details
    const token = jwt.sign(
      {
        id: user.id,
        // name: user.name,
        // email: user.email,
        // role: user.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: "4h" }
    );

    // Destructure user object to omit password and possibly other sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return { token, userData };
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userDao.getAllUsers();
  }

  public async getUserById(userId: string): Promise<User | null> {
    return this.userDao.getUserById(userId);
  }

  public async updateUser(
    userId: string,
    userData: Prisma.UserUpdateInput
  ): Promise<User | null> {
    userData.password = await bcrypt.hash(userData.password, 10);
    return this.userDao.updateUser(userId, userData);
  }

  public async deleteUser(userId: string): Promise<User | null> {
    return this.userDao.deleteUser(userId);
  }
}
