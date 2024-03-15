import { PageDao } from '../dao/PageDao'
import { ExplorationPageDao } from '../dao/ExplorationPageDao'
import { ExplorationPage, PageType } from '@prisma/client'
import { CreateExplorationPageData, UpdateExplorationPageData } from '../types/page'

export class ExplorationPageService {
  constructor(
    private explorationPageDao: ExplorationPageDao = new ExplorationPageDao(),
    private pageDao: PageDao = new PageDao()
  ) { }

  public async createExplorationPage({
    title,
    chapterId,
    instructions,
    sandboxId,
  }: CreateExplorationPageData): Promise<ExplorationPage | null> {
    // Create the Page instance
    const page = await this.pageDao.createPage({
      title: title,
      chapterId: chapterId,
      type: PageType.EXPLORATION
    })

    // Create the ExplorationPage instance linked to the Page
    const explorationPage = this.explorationPageDao.createExplorationPage({
      pageId: page.id,
      instructions: instructions,
      sandboxId: sandboxId,
    })

    return explorationPage
  }

  public async getAllExplorationPages(): Promise<ExplorationPage[]> {
    return this.explorationPageDao.getAllExplorationPages()
  }

  public async getExplorationPageById(
    pageId: string
  ): Promise<ExplorationPage | null> {
    return this.explorationPageDao.getExplorationPageById(pageId)
  }

  public async getExplorationPageByPageId(
    pageId: string
  ): Promise<ExplorationPage | null> {
    return this.explorationPageDao.getExplorationPageByPageId(pageId)
  }

  public async updateExplorationPage({
    pageId,
    title,
    instructions,
    sandboxId,
  }: UpdateExplorationPageData): Promise<ExplorationPage | null> {
    // Update the Page instance
    await this.pageDao.updatePageByExplorationPageId(pageId, {
      title: title
    })

    return this.explorationPageDao.updateExplorationPage(pageId, {
      instructions: instructions,
      sandboxId: sandboxId,
    })
  }

  public async deleteExplorationPage(
    pageId: string
  ): Promise<ExplorationPage | null> {
    // Delete the ExplorationPage instance
    const explorationPage = await this.explorationPageDao.deleteExplorationPage(pageId)

    // Then delete the Page instance
    const page = await this.pageDao.deletePage(explorationPage.pageId)

    return explorationPage
  }
}
