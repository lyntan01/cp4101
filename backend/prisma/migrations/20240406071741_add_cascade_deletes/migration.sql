-- DropForeignKey
ALTER TABLE "ExercisePage" DROP CONSTRAINT "ExercisePage_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "GeneratedExercise" DROP CONSTRAINT "GeneratedExercise_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "GeneratedExercise" DROP CONSTRAINT "GeneratedExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_exerciseId_fkey";

-- AddForeignKey
ALTER TABLE "ExercisePage" ADD CONSTRAINT "ExercisePage_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedExercise" ADD CONSTRAINT "GeneratedExercise_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedExercise" ADD CONSTRAINT "GeneratedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
