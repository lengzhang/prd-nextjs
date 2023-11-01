"use client";

import { Backdrop, CircularProgress } from "@mui/material";
import { createContext, FC, ReactNode, useContext, useState } from "react";

interface LoadingBackdropContext {
  isLoading: boolean;
  handleLoadingState: (value?: boolean) => void;
}
export const loadingBackdropContext = createContext<LoadingBackdropContext>({
  isLoading: false,
  handleLoadingState: () => {},
});

export const useLoadingBackdropContext = () =>
  useContext(loadingBackdropContext);

interface LoadingBackdropContextProviderProps {
  children: ReactNode;
}

const LoadingBackdropContextProvider: FC<
  LoadingBackdropContextProviderProps
> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingState = (value?: boolean) => {
    if (value === undefined) {
      setIsLoading((prev) => !prev);
    } else {
      setIsLoading(value);
    }
  };

  return (
    <loadingBackdropContext.Provider value={{ isLoading, handleLoadingState }}>
      {children}
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </loadingBackdropContext.Provider>
  );
};

export default LoadingBackdropContextProvider;
