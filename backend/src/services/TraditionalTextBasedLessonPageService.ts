import { PageDao } from "../dao/PageDao";
import { TraditionalTextBasedLessonPageDao } from "../dao/TraditionalTextBasedLessonPageDao";
import {
  TraditionalTextBasedLessonPage,
  Prisma,
  PageType,
} from "@prisma/client";
import { CreateTraditionalTextBasedLessonPageData } from "../types/page";

export class TraditionalTextBasedLessonPageService {
  constructor(
    private traditionalTextBasedLessonPageDao: TraditionalTextBasedLessonPageDao = new TraditionalTextBasedLessonPageDao(),
    private pageDao: PageDao = new PageDao()
  ) {}

  public async createTraditionalTextBasedLessonPage({
    title,
    chapterId,
    content,
  }: CreateTraditionalTextBasedLessonPageData): Promise<TraditionalTextBasedLessonPage | null> {
    // Create the Page instance
    const page = await this.pageDao.createPage({
      title: title,
      chapterId: chapterId,
      type: PageType.TRADITIONAL_TEXT_BASED_LESSON,
    });

    // Create the TraditionalTextBasedLessonPage instance linked to the Page
    const traditionalPage =
      this.traditionalTextBasedLessonPageDao.createTraditionalTextBasedLessonPage(
        { pageId: page.id, content: content }
      );

    return traditionalPage;
  }

  public async getAllTraditionalTextBasedLessonPages(): Promise<
    TraditionalTextBasedLessonPage[]
  > {
    return this.traditionalTextBasedLessonPageDao.getAllTraditionalTextBasedLessonPages();
  }

  public async getTraditionalTextBasedLessonPageById(
    pageId: string
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.traditionalTextBasedLessonPageDao.getTraditionalTextBasedLessonPageById(
      pageId
    );
  }

  public async getTraditionalTextBasedLessonPageByPageId(
    pageId: string
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.traditionalTextBasedLessonPageDao.getTraditionalTextBasedLessonPageByPageId(
      pageId
    );
  }

  public async updateTraditionalTextBasedLessonPage(
    pageId: string,
    pageData: Prisma.TraditionalTextBasedLessonPageUpdateInput
  ): Promise<TraditionalTextBasedLessonPage | null> {
    return this.traditionalTextBasedLessonPageDao.updateTraditionalTextBasedLessonPage(
      pageId,
      pageData
    );
  }

  public async deleteTraditionalTextBasedLessonPage(
    pageId: string
  ): Promise<TraditionalTextBasedLessonPage | null> {
    // Delete the TraditionalTextBasedLessonPage instance
    const traditionalPage =
      await this.traditionalTextBasedLessonPageDao.deleteTraditionalTextBasedLessonPage(
        pageId
      );

    // Then delete the Page instance
    const page = await this.pageDao.deletePage(traditionalPage.pageId);

    return traditionalPage;
  }
}
