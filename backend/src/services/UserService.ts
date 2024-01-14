import { UserDao } from "../dao/UserDao";
import { User, Prisma } from "@prisma/client";

export class UserService {
  constructor(private userDao: UserDao = new UserDao()) {}

  public async createUser(
    userData: Prisma.UserCreateInput
  ): Promise<User | null> {
    return this.userDao.createUser(userData);
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
    return this.userDao.updateUser(userId, userData);
  }

  public async deleteUser(userId: string): Promise<User | null> {
    return this.userDao.deleteUser(userId);
  }
}
