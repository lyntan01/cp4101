import { File, Prisma } from "@prisma/client";
import { FileDao } from "../dao/FileDao";

export class FileService {
  constructor(private fileDao: FileDao = new FileDao()) { }

  public async createFile(
    FileData: Prisma.FileCreateInput
  ): Promise<File | null> {
    return this.fileDao.createFile(FileData);
  }

  public async getAllFiles(): Promise<File[]> {
    return this.fileDao.getAllFiles();
  }

  public async getFileById(FileId: string): Promise<File | null> {
    return this.fileDao.getFileById(FileId);
  }

  public async updateFile(
    FileId: string,
    FileData: Prisma.FileUpdateInput
  ): Promise<File | null> {
    return this.fileDao.updateFile(FileId, FileData);
  }

  public async deleteFile(FileId: string): Promise<File | null> {
    return this.fileDao.deleteFile(FileId);
  }
}
