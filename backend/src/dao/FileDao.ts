import { Prisma, PrismaClient, File } from "@prisma/client";

export class FileDao {
    constructor(private prismaClient: PrismaClient = new PrismaClient()) { }

    public async createFile(fileData: Prisma.FileCreateInput): Promise<File> {
        return this.prismaClient.file.create({
            data: fileData,
        });
    }

    public async getAllFiles(): Promise<File[]> {
        return this.prismaClient.file.findMany();
    }

    public async getFileById(fileId: string): Promise<File | null> {
        return this.prismaClient.file.findUnique({
            where: { id: fileId },
            include: {
                exercisePage: true,
                explorationPage: true,
            },
        });
    }

    public async updateFile(
        fileId: string,
        fileData: Prisma.FileUpdateInput
    ): Promise<File | null> {
        return this.prismaClient.file.update({
            where: { id: fileId },
            data: fileData,
        });
    }

    public async deleteFile(fileId: string): Promise<File | null> {
        return this.prismaClient.file.delete({
            where: { id: fileId },
        });
    }
}
