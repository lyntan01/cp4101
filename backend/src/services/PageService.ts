import { PageDao } from "../dao/PageDao";
import { Page } from "@prisma/client";

export class PageService {
  constructor(private pageDao: PageDao = new PageDao()) {}

  public async getAllPagesByChapterId(chapterId: string): Promise<Page[]> {
    return this.pageDao.getAllPagesByChapterId(chapterId);
  }

  public async getPageById(pageId: string): Promise<Page | null> {
    return this.pageDao.getPageById(pageId);
  }

  public async deletePage(pageId: string): Promise<Page | null> {
    return this.pageDao.deletePage(pageId);
  }
}
