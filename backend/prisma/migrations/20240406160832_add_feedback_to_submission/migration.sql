/*
  Warnings:

  - Added the required column `generatedFeedback` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherFeedback` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "generatedFeedback" TEXT NOT NULL,
ADD COLUMN     "teacherFeedback" TEXT NOT NULL;
