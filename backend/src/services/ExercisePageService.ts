import { PageDao } from '../dao/PageDao'
import { ExercisePageDao } from '../dao/ExercisePageDao'
import { ExercisePage, Prisma, PageType } from '@prisma/client'
import { CreateExercisePageData, UpdateExercisePageData } from '../types/page'

export class ExercisePageService {
  constructor(
    private exercisePageDao: ExercisePageDao = new ExercisePageDao(),
    private pageDao: PageDao = new PageDao()
  ) { }

  public async createExercisePage({
    title,
    chapterId,
    instructions,
    sandboxId,
    correctAnswer
  }: CreateExercisePageData): Promise<ExercisePage | null> {
    // Create the Page instance
    const page = await this.pageDao.createPage({
      title: title,
      chapterId: chapterId,
      type: PageType.EXERCISE
    })

    // Create the ExercisePage instance linked to the Page
    const exercisePage = this.exercisePageDao.createExercisePage({
      pageId: page.id,
      instructions: instructions,
      sandboxId: sandboxId,
      correctAnswer: correctAnswer
    })

    return exercisePage
  }

  public async getAllExercisePages(): Promise<ExercisePage[]> {
    return this.exercisePageDao.getAllExercisePages()
  }

  public async getExercisePageById(
    pageId: string
  ): Promise<ExercisePage | null> {
    return this.exercisePageDao.getExercisePageById(pageId)
  }

  public async getExercisePageByPageId(
    pageId: string
  ): Promise<ExercisePage | null> {
    return this.exercisePageDao.getExercisePageByPageId(pageId)
  }

  public async updateExercisePage({
    pageId,
    title,
    instructions,
    sandboxId,
    correctAnswer
  }: UpdateExercisePageData): Promise<ExercisePage | null> {
    // Update the Page instance
    await this.pageDao.updatePageByExercisePageId(pageId, {
      title: title
    })

    return this.exercisePageDao.updateExercisePage(pageId, {
      instructions: instructions,
      sandboxId: sandboxId,
      correctAnswer: correctAnswer
    })
  }

  public async deleteExercisePage(
    pageId: string
  ): Promise<ExercisePage | null> {
    // Delete the ExercisePage instance
    const exercisePage = await this.exercisePageDao.deleteExercisePage(pageId)

    // Then delete the Page instance
    const page = await this.pageDao.deletePage(exercisePage.pageId)

    return exercisePage
  }
}
