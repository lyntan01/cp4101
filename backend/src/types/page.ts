export interface CreateTraditionalTextBasedLessonPageData {
  title: string;
  chapterId: string;
  content: string;
}

export interface UpdateTraditionalTextBasedLessonPageData {
  pageId: string;
  title: string;
  content: string;
}

export interface CreateExercisePageData {
  title: string;
  chapterId: string;
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
}

export interface UpdateExercisePageData {
  exercisePageId: string;
  title: string;
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
}

export interface CreateExplorationPageData {
  title: string;
  chapterId: string;
  instructions: string;
  sandboxId: string;
}

export interface UpdateExplorationPageData {
  pageId: string;
  title: string;
  instructions: string;
  sandboxId: string;
}

