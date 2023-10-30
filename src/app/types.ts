import { ChangeEventHandler, FC, FormEventHandler } from "react";

export type LayoutComponent = FC<{ children: React.ReactNode }>;

export type TextFieldChangeHandler = ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement
>;

export type FormSubmitHandler = FormEventHandler<HTMLFormElement>;

export interface UserInfo {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string;
  updatedAt: number | null;
  createdAt: number | null;
}
