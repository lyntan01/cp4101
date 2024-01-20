/*
  Warnings:

  - A unique constraint covering the columns `[pageId]` on the table `CodeSandboxPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pageId]` on the table `RealTimeCodeFeedbackPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pageId]` on the table `StepByStepVisualizationPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pageId]` on the table `TraditionalTextBasedLessonPage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pageId` to the `CodeSandboxPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `RealTimeCodeFeedbackPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `StepByStepVisualizationPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `TraditionalTextBasedLessonPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `TraditionalTextBasedLessonPage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CodeSandboxPage" DROP CONSTRAINT "CodeSandboxPage_id_fkey";

-- DropForeignKey
ALTER TABLE "RealTimeCodeFeedbackPage" DROP CONSTRAINT "RealTimeCodeFeedbackPage_id_fkey";

-- DropForeignKey
ALTER TABLE "StepByStepVisualizationPage" DROP CONSTRAINT "StepByStepVisualizationPage_id_fkey";

-- DropForeignKey
ALTER TABLE "TraditionalTextBasedLessonPage" DROP CONSTRAINT "TraditionalTextBasedLessonPage_id_fkey";

-- AlterTable
ALTER TABLE "CodeSandboxPage" ADD COLUMN     "pageId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RealTimeCodeFeedbackPage" ADD COLUMN     "pageId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "StepByStepVisualizationPage" ADD COLUMN     "pageId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TraditionalTextBasedLessonPage" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "pageId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CodeSandboxPage_pageId_key" ON "CodeSandboxPage"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "RealTimeCodeFeedbackPage_pageId_key" ON "RealTimeCodeFeedbackPage"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "StepByStepVisualizationPage_pageId_key" ON "StepByStepVisualizationPage"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "TraditionalTextBasedLessonPage_pageId_key" ON "TraditionalTextBasedLessonPage"("pageId");

-- AddForeignKey
ALTER TABLE "TraditionalTextBasedLessonPage" ADD CONSTRAINT "TraditionalTextBasedLessonPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSandboxPage" ADD CONSTRAINT "CodeSandboxPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepByStepVisualizationPage" ADD CONSTRAINT "StepByStepVisualizationPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealTimeCodeFeedbackPage" ADD CONSTRAINT "RealTimeCodeFeedbackPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
