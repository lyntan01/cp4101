export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  createdCourses: Course[];
  enrolledCourses: Course[];
  submissions: Submission[];
};

export enum UserRoleEnum {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export type Course = {
  id: string;
  name: string;
  description: string;
  teacher: User;
  students: User[];
  chapters: Chapter[];
  analytics?: Analytics;
};

export type Chapter = {
  id: string;
  name: string;
  learningOutcomes: string[];
  course: Course;
  courseId?: string;
  pages: Page[];
  generatedExercises: GeneratedExercise[];
};

export type Page = {
  id: string;
  title: string;
  chapter: Chapter;
  type: PageTypeEnum;
  createdAt: Date;
  traditionalTextBasedLessonPage?: TraditionalTextBasedLessonPage;
  exercisePage?: ExercisePage;
  explorationPage?: ExplorationPage;
};

export enum PageTypeEnum {
  TRADITIONAL_TEXT_BASED_LESSON = "TRADITIONAL_TEXT_BASED_LESSON",
  EXERCISE = "EXERCISE",
  EXPLORATION = "EXPLORATION",
}

export type TraditionalTextBasedLessonPage = {
  id: string;
  page: Page;
  content: string;
};

export type ExercisePage = {
  id: string;
  page: Page;
  exercise: Exercise;
};

export type Exercise = {
  id: string;
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
  exercisePage?: ExercisePage;
  generatedExercise?: GeneratedExercise;
  submissions: Submission[];
}

export type GeneratedExercise = {
  id: string;
  chapter: Chapter;
  exercise: Exercise;
}

export type Submission = {
  id: string;
  studentAnswer: string;
  generatedFeedback: string;
  teacherFeedback: string;
  submittedAt: Date;
  student: User;
  exercise: Exercise;
}

export type ExplorationPage = {
  id: string;
  page: Page;
  instructions: string;
  sandboxId: string;
};

export type Analytics = {
  id: string;
  percentStudentsUsedCodeSandbox: number;
  codeFeedbackOverview: string;
  course: Course;
};
