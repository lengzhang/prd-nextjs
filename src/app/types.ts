import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  MouseEventHandler,
} from "react";

export type LayoutComponent = FC<{ children: React.ReactNode }>;

export type TextFieldChangeHandler = ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement
>;

export type FormSubmitHandler = FormEventHandler<HTMLFormElement>;
export type OnClickHandler = MouseEventHandler<HTMLButtonElement>;

export interface UserInfo {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string;
  updatedAt: number | null;
  createdAt: number | null;
}
