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
  course: Course;
  pages: Page[];
};

export type Page = {
  id: string;
  title: string;
  chapter: Chapter;
  type: PageTypeEnum;
  traditionalTextBasedLessonPage?: TraditionalTextBasedLessonPage;
  codeSandboxPage?: CodeSandboxPage;
  stepByStepVisualizationPage?: StepByStepVisualizationPage;
  realTimeCodeFeedbackPage?: RealTimeCodeFeedbackPage;
};

export enum PageTypeEnum {
  TRADITIONAL_TEXT_BASED = "TRADITIONAL_TEXT_BASED",
  CODE_SANDBOX = "CODE_SANDBOX",
  STEP_BY_STEP_VISUALIZATION = "STEP_BY_STEP_VISUALIZATION",
  REAL_TIME_CODE_FEEDBACK = "REAL_TIME_CODE_FEEDBACK",
}

export type TraditionalTextBasedLessonPage = {
  id: string;
  page: Page;
  content: string;
};

export type CodeSandboxPage = {
  id: string;
  page: Page;
  // additional fields for CodeSandboxPage
};

export type StepByStepVisualizationPage = {
  id: string;
  page: Page;
  // additional fields for StepByStepVisualizationPage
};

export type RealTimeCodeFeedbackPage = {
  id: string;
  page: Page;
  // additional fields for RealTimeCodeFeedbackPage
};

export type Analytics = {
  id: string;
  percentStudentsUsedCodeSandbox: number;
  percentStudentsViewedStepByStep: number;
  percentStudentsUsedRealTimeFeedback: number;
  codeFeedbackOverview: string;
  course: Course;
};
