import { PageDao } from '../dao/PageDao'
import { ExercisePageDao } from '../dao/ExercisePageDao'
import { ExercisePage, PageType } from '@prisma/client'
import { CreateExercisePageData, UpdateExercisePageData } from '../types/page'
import { ExerciseDao } from '../dao/ExerciseDao';

export class ExercisePageService {
  constructor(
    private exercisePageDao: ExercisePageDao = new ExercisePageDao(),
    private pageDao: PageDao = new PageDao(),
    private exerciseDao: ExerciseDao = new ExerciseDao()
  ) { }

  public async createExercisePage({
    title,
    chapterId,
    instructions,
    sandboxId,
    correctAnswer
  }: CreateExercisePageData): Promise<ExercisePage | null> {
    // Step 1: Create the Page instance
    const page = await this.pageDao.createPage({
      title: title,
      chapterId: chapterId,
      type: PageType.EXERCISE
    });

    // Step 2: Create the Exercise instance
    const exercise = await this.exerciseDao.createExercise({
      instructions: instructions,
      sandboxId: sandboxId,
      correctAnswer: correctAnswer
    });

    // Step 3: Create the ExercisePage instance linked to the Page and Exercise
    const exercisePage = await this.exercisePageDao.createExercisePage({
      pageId: page.id,
      exerciseId: exercise.id
    });

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
    // Step 1: Update the Page instance
    await this.pageDao.updatePageByExercisePageId(pageId, {
      title: title
    });

    // Step 2: Retrieve the ExercisePage to get the associated Exercise ID
    const exercisePage = await this.exercisePageDao.getExercisePageByPageId(pageId);
    if (!exercisePage) {
      throw new Error("ExercisePage not found");
    }

    // Step 3: Update the Exercise instance
    await this.exerciseDao.updateExercise(exercisePage.exerciseId, {
      instructions: instructions,
      sandboxId: sandboxId,
      correctAnswer: correctAnswer
    });

    return this.exercisePageDao.getExercisePageByPageId(pageId);
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
