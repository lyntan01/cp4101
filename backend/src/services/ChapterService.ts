import { ChapterDao } from "../dao/ChapterDao";
import { Chapter, Prisma } from "@prisma/client";
import { PageDao } from "../dao/PageDao";

export class ChapterService {
  constructor(private chapterDao: ChapterDao = new ChapterDao(), private pageDao: PageDao = new PageDao()) {}

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
    const pages = await this.pageDao.getAllPagesByChapterId(chapterId);
    for (const page of pages) { 
      await this.pageDao.deletePage(page.id);
    }
    return this.chapterDao.deleteChapter(chapterId);
  }
}
