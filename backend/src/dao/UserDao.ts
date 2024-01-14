import { Prisma, PrismaClient, User } from "@prisma/client";

export class UserDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prismaClient.user.create({
      data: userData,
    });
  }

  public async getAllUsers(): Promise<User[]> {
    return this.prismaClient.user.findMany();
  }

  public async getUserById(userId: string): Promise<User | null> {
    return this.prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        createdCourses: true,
        enrolledCourses: true,
      },
    });
  }

  public async updateUser(
    userId: string,
    userData: Prisma.UserUpdateInput
  ): Promise<User | null> {
    return this.prismaClient.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  public async deleteUser(userId: string): Promise<User | null> {
    return this.prismaClient.user.delete({
      where: { id: userId },
    });
  }
}
