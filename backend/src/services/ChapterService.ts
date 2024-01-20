import { ChapterDao } from "../dao/ChapterDao";
import { Chapter, Prisma } from "@prisma/client";

export class ChapterService {
  constructor(private chapterDao: ChapterDao = new ChapterDao()) {}

  public async createChapter(
    chapterData: Prisma.ChapterCreateInput
  ): Promise<Chapter | null> {
    return this.chapterDao.createChapter(chapterData);
  }

  public async getAllChapters(): Promise<Chapter[]> {
    return this.chapterDao.getAllChapters();
  }

  public async getChapterById(chapterId: string): Promise<Chapter | null> {
    return this.chapterDao.getChapterById(chapterId);
  }

  public async getChaptersByCourseId(courseId: string): Promise<Chapter[]> {
    return this.chapterDao.getChaptersByCourseId(courseId);
  }

  public async updateChapter(
    chapterId: string,
    chapterData: Prisma.ChapterUpdateInput
  ): Promise<Chapter | null> {
    return this.chapterDao.updateChapter(chapterId, chapterData);
  }

  public async deleteChapter(chapterId: string): Promise<Chapter | null> {
    return this.chapterDao.deleteChapter(chapterId);
  }
}
