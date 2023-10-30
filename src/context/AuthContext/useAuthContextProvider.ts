"use client";

import { UserInfo } from "@/app/types";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, createContext, useContext } from "react";
import { useLoadingBackdropContext } from "../LoadingBackdropContext";
import { useSnackbar } from "notistack";

interface State {
  user: UserInfo | null;
}

type Action = { type: "set-user"; value: UserInfo };

export const initialState: State = {
  user: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-user":
      return { ...state, user: action.value };

    default:
      return state;
  }
};

export const authContext = createContext<
  ReturnType<typeof useAuthContextProvider>
>({
  state: initialState,
  handleSignOut: async () => {},
});

export const useAuthContext = () => useContext(authContext);

const useAuthContextProvider = () => {
  const router = useRouter();
  const { handleLoadingState } = useLoadingBackdropContext();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    handleLoadingState(true);

    const response = await fetch("/api/get-user", { method: "GET" });

    if (response.status === 200) {
      const userInfo: UserInfo = await response.json();
      dispatch({ type: "set-user", value: userInfo });
    } else {
      const body = await response.json();
      if (body.message) {
        enqueueSnackbar(body.message, { variant: "error" });
      } else {
        enqueueSnackbar("Please login first.", { variant: "info" });
      }
      router.push("/sign-in");
    }

    handleLoadingState(false);
  };

  const handleSignOut = async () => {
    handleLoadingState(true);

    const response = await fetch("/api/sign-out", { method: "GET" });

    const body = await response.json();
    if (response.status === 200) {
      enqueueSnackbar(body.message || "Sign out success.", {
        variant: "success",
      });
      router.push("/sign-in");
    } else {
      enqueueSnackbar(body.message || "Unknown error", { variant: "error" });
    }

    handleLoadingState(false);
  };

  return { state, handleSignOut };
};

export default useAuthContextProvider;
