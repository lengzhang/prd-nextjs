"use client";

import { FC, ReactNode, memo } from "react";

import useAuthContextProvider, { authContext } from "./useAuthContextProvider";

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { state, handleSignOut } = useAuthContextProvider();
  return (
    <authContext.Provider value={{ state, handleSignOut }}>
      {children}
    </authContext.Provider>
  );
};

export default memo(AuthContextProvider);
