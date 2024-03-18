-- AlterTable
ALTER TABLE "File" ADD COLUMN     "exercisePageId" UUID,
ADD COLUMN     "explorationPageId" UUID;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_exercisePageId_fkey" FOREIGN KEY ("exercisePageId") REFERENCES "ExercisePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_explorationPageId_fkey" FOREIGN KEY ("explorationPageId") REFERENCES "ExplorationPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
