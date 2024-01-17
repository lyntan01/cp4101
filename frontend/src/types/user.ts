export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
};

export enum UserRoleEnum {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}
