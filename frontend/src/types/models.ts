export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  createdCourses: Course[];
  enrolledCourses: Course[];
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
};

export type Page = {
  id: string;
  title: string;
  chapter: Chapter;
  type: PageTypeEnum;
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
  instructions: string;
  sandboxId: string;
  correctAnswer: string;
  files: File[];
};

export type ExplorationPage = {
  id: string;
  page: Page;
  instructions: string;
  sandboxId: string;
  files: File[];
};

export type File = {
  id: string;
  name: string;
  code: string;
  exercisePage?: ExercisePage;
  explorationPage?: ExplorationPage;
};

export type Analytics = {
  id: string;
  percentStudentsUsedCodeSandbox: number;
  codeFeedbackOverview: string;
  course: Course;
};
