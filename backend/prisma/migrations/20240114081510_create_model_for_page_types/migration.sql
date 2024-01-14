/*
  Warnings:

  - You are about to drop the column `content` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "TraditionalTextBasedLessonPage" (
    "id" UUID NOT NULL,

    CONSTRAINT "TraditionalTextBasedLessonPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSandboxPage" (
    "id" UUID NOT NULL,

    CONSTRAINT "CodeSandboxPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepByStepVisualizationPage" (
    "id" UUID NOT NULL,

    CONSTRAINT "StepByStepVisualizationPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealTimeCodeFeedbackPage" (
    "id" UUID NOT NULL,

    CONSTRAINT "RealTimeCodeFeedbackPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TraditionalTextBasedLessonPage" ADD CONSTRAINT "TraditionalTextBasedLessonPage_id_fkey" FOREIGN KEY ("id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSandboxPage" ADD CONSTRAINT "CodeSandboxPage_id_fkey" FOREIGN KEY ("id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepByStepVisualizationPage" ADD CONSTRAINT "StepByStepVisualizationPage_id_fkey" FOREIGN KEY ("id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealTimeCodeFeedbackPage" ADD CONSTRAINT "RealTimeCodeFeedbackPage_id_fkey" FOREIGN KEY ("id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
