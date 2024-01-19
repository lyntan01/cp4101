import { PageDao } from "../dao/PageDao";
import { Page, Prisma } from "@prisma/client";

export class PageService {
  constructor(private pageDao: PageDao = new PageDao()) {}

  public async createPage(
    pageData: Prisma.PageCreateInput
  ): Promise<Page | null> {
    return this.pageDao.createPage(pageData);
  }

  public async getAllPages(): Promise<Page[]> {
    return this.pageDao.getAllPages();
  }

  public async getPageById(pageId: string): Promise<Page | null> {
    return this.pageDao.getPageById(pageId);
  }

  public async updatePage(
    pageId: string,
    pageData: Prisma.PageUpdateInput
  ): Promise<Page | null> {
    return this.pageDao.updatePage(pageId, pageData);
  }

  public async deletePage(pageId: string): Promise<Page | null> {
    return this.pageDao.deletePage(pageId);
  }
}
