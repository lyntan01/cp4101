/*
  Warnings:

  - You are about to drop the column `exercisePageId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `explorationPageId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_exercisePageId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_explorationPageId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "exercisePageId",
DROP COLUMN "explorationPageId";
