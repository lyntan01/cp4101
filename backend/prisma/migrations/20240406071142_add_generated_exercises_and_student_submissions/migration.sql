/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `ExercisePage` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `ExercisePage` table. All the data in the column will be lost.
  - You are about to drop the column `sandboxId` on the `ExercisePage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exerciseId]` on the table `ExercisePage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exerciseId` to the `ExercisePage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExercisePage" DROP COLUMN "correctAnswer",
DROP COLUMN "instructions",
DROP COLUMN "sandboxId",
ADD COLUMN     "exerciseId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Exercise" (
    "id" UUID NOT NULL,
    "instructions" TEXT NOT NULL,
    "sandboxId" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedExercise" (
    "id" UUID NOT NULL,
    "chapterId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,

    CONSTRAINT "GeneratedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" UUID NOT NULL,
    "studentAnswer" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" UUID NOT NULL,
    "exerciseId" UUID NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedExercise_exerciseId_key" ON "GeneratedExercise"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExercisePage_exerciseId_key" ON "ExercisePage"("exerciseId");

-- AddForeignKey
ALTER TABLE "ExercisePage" ADD CONSTRAINT "ExercisePage_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedExercise" ADD CONSTRAINT "GeneratedExercise_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedExercise" ADD CONSTRAINT "GeneratedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
