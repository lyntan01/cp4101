/*
  Warnings:

  - Added the required column `correctAnswer` to the `ExercisePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `ExercisePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sandboxId` to the `ExercisePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `ExplorationPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sandboxId` to the `ExplorationPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "learningOutcomes" TEXT[];

-- AlterTable
ALTER TABLE "ExercisePage" ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT NOT NULL,
ADD COLUMN     "sandboxId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExplorationPage" ADD COLUMN     "instructions" TEXT NOT NULL,
ADD COLUMN     "sandboxId" TEXT NOT NULL;
