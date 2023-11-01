import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useReducer } from "react";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
  username: string;
}

type Action =
  | { type: "set-email"; value: string }
  | { type: "set-password"; value: string }
  | { type: "switch-show-password" }
  | { type: "set-username"; value: string };

const initialState: State = {
  email: "",
  password: "",
  showPassword: false,
  username: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-email":
      return { ...state, email: action.value };
    case "set-password":
      return { ...state, password: action.value };
    case "switch-show-password":
      return { ...state, showPassword: !state.showPassword };
    case "set-username":
      return { ...state, username: action.value };
    default:
      return state;
  }
};

const useSignUp = () => {
  const router = useRouter();
  const { handleLoadingState } = useLoadingBackdropContext();
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeTextField =
    (name: "email" | "password" | "username"): TextFieldChangeHandler =>
    (event) => {
      dispatch({ type: `set-${name}`, value: event.target.value });
    };

  const onSwitchShowPassword = () => {
    dispatch({ type: "switch-show-password" });
  };

  const onSignUp: FormSubmitHandler = async (event) => {
    event.preventDefault();
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", state.email);
    formData.append("password", state.password);
    formData.append("username", state.username);

    const response = await fetch("/api/sign-up", {
      body: formData,
      method: "POST",
    });

    if (response.status === 200) {
      moveToConfirmSignUpPage();
    } else {
      const body = await response.json();
      enqueueSnackbar(body.message || "Unknown error", { variant: "error" });
    }
    handleLoadingState(false);
  };

  const moveToConfirmSignUpPage = () => {
    enqueueSnackbar("Please confirm your account before login.", {
      variant: "info",
    });
    const searchParams = new URLSearchParams();
    searchParams.set("email", state.email);
    router.push(`/confirm-sign-up?${searchParams.toString()}`);
  };

  return { state, onChangeTextField, onSwitchShowPassword, onSignUp };
};

export default useSignUp;
