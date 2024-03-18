-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "exercisePageId" UUID NOT NULL,
    "explorationPageId" UUID NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_exercisePageId_fkey" FOREIGN KEY ("exercisePageId") REFERENCES "ExercisePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_explorationPageId_fkey" FOREIGN KEY ("explorationPageId") REFERENCES "ExplorationPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
