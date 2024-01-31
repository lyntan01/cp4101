/*
  Warnings:

  - The values [CODE_SANDBOX,STEP_BY_STEP_VISUALIZATION,REAL_TIME_CODE_FEEDBACK] on the enum `PageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `percentStudentsUsedRealTimeFeedback` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `percentStudentsViewedStepByStep` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the `CodeSandboxPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RealTimeCodeFeedbackPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StepByStepVisualizationPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PageType_new" AS ENUM ('TRADITIONAL_TEXT_BASED_LESSON', 'EXERCISE', 'EXPLORATION');
ALTER TABLE "Page" ALTER COLUMN "type" TYPE "PageType_new" USING ("type"::text::"PageType_new");
ALTER TYPE "PageType" RENAME TO "PageType_old";
ALTER TYPE "PageType_new" RENAME TO "PageType";
DROP TYPE "PageType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CodeSandboxPage" DROP CONSTRAINT "CodeSandboxPage_pageId_fkey";

-- DropForeignKey
ALTER TABLE "RealTimeCodeFeedbackPage" DROP CONSTRAINT "RealTimeCodeFeedbackPage_pageId_fkey";

-- DropForeignKey
ALTER TABLE "StepByStepVisualizationPage" DROP CONSTRAINT "StepByStepVisualizationPage_pageId_fkey";

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "percentStudentsUsedRealTimeFeedback",
DROP COLUMN "percentStudentsViewedStepByStep";

-- DropTable
DROP TABLE "CodeSandboxPage";

-- DropTable
DROP TABLE "RealTimeCodeFeedbackPage";

-- DropTable
DROP TABLE "StepByStepVisualizationPage";

-- CreateTable
CREATE TABLE "ExercisePage" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,

    CONSTRAINT "ExercisePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorationPage" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,

    CONSTRAINT "ExplorationPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExercisePage_pageId_key" ON "ExercisePage"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "ExplorationPage_pageId_key" ON "ExplorationPage"("pageId");

-- AddForeignKey
ALTER TABLE "ExercisePage" ADD CONSTRAINT "ExercisePage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorationPage" ADD CONSTRAINT "ExplorationPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
