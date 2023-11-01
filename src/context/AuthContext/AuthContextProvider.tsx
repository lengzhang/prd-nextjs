"use client";

import { FC, ReactNode, memo } from "react";

import useAuthContextProvider, { authContext } from "./useAuthContextProvider";

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const value = useAuthContextProvider();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export default memo(AuthContextProvider);
