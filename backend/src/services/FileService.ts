import { File, Prisma } from "@prisma/client";
import { FileDao } from "../dao/FileDao";

export class FileService {
  constructor(private fileDao: FileDao = new FileDao()) { }

  public async createFile(
    fileData: Prisma.FileUncheckedCreateInput
  ): Promise<File | null> {
    return this.fileDao.createFile(fileData);
  }

  public async getAllFiles(): Promise<File[]> {
    return this.fileDao.getAllFiles();
  }

  public async getFileById(fileId: string): Promise<File | null> {
    return this.fileDao.getFileById(fileId);
  }

  public async updateFile(
    fileId: string,
    fileData: Prisma.FileUpdateInput
  ): Promise<File | null> {
    return this.fileDao.updateFile(fileId, fileData);
  }

  public async deleteFile(fileId: string): Promise<File | null> {
    return this.fileDao.deleteFile(fileId);
  }
}
