export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export enum UserRole {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}
