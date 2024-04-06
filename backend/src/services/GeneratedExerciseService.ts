import { GeneratedExerciseDao } from '../dao/GeneratedExerciseDao'
import { GeneratedExercise, Prisma } from '@prisma/client'
import { ExerciseDao } from '../dao/ExerciseDao'

export class GeneratedExerciseService {
    constructor(
        private generatedExerciseDao: GeneratedExerciseDao = new GeneratedExerciseDao(),
        private exerciseDao: ExerciseDao = new ExerciseDao()
    ) { }

    public async createGeneratedExercise({
        chapterId,
        instructions,
        sandboxId,
        correctAnswer
    }: {
        chapterId: string
        instructions: string
        sandboxId: string
        correctAnswer: string
    }): Promise<GeneratedExercise | null> {
        // Step 1: Create the Exercise instance
        const exercise = await this.exerciseDao.createExercise({
            instructions: instructions,
            sandboxId: sandboxId,
            correctAnswer: correctAnswer
        })

        if (!exercise) {
            throw new Error('Failed to create Exercise')
        }

        // Step 2: Create the GeneratedExercise instance linked to the Exercise
        const generatedExercise =
            await this.generatedExerciseDao.createGeneratedExercise({
                chapterId: chapterId,
                exerciseId: exercise.id
            })

        return generatedExercise
    }

    public async getAllGeneratedExercises(): Promise<GeneratedExercise[]> {
        return this.generatedExerciseDao.getAllGeneratedExercises()
    }

    public async getGeneratedExerciseById(
        generatedExerciseId: string
    ): Promise<GeneratedExercise | null> {
        return this.generatedExerciseDao.getGeneratedExerciseById(
            generatedExerciseId
        )
    }

    public async updateGeneratedExercise(
        generatedExerciseId: string,
        generatedExerciseData: Prisma.GeneratedExerciseUpdateInput
    ): Promise<GeneratedExercise | null> {
        return this.generatedExerciseDao.updateGeneratedExercise(
            generatedExerciseId,
            generatedExerciseData
        )
    }

    public async deleteGeneratedExercise(
        generatedExerciseId: string
    ): Promise<GeneratedExercise | null> {
        return this.generatedExerciseDao.deleteGeneratedExercise(
            generatedExerciseId
        )
    }
}
