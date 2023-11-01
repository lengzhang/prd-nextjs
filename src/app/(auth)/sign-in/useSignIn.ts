import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useReducer } from "react";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

type Action =
  | { type: "set-email"; value: string }
  | { type: "set-password"; value: string }
  | { type: "switch-show-password" };

const initialState: State = {
  email: "",
  password: "",
  showPassword: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-email":
      return { ...state, email: action.value };
    case "set-password":
      return { ...state, password: action.value };
    case "switch-show-password":
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
};

const useSignIn = () => {
  const router = useRouter();
  const { handleLoadingState } = useLoadingBackdropContext();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeEmail: TextFieldChangeHandler = (event) => {
    dispatch({ type: "set-email", value: event.target.value });
  };

  const onChangePassword: TextFieldChangeHandler = (event) => {
    dispatch({ type: "set-password", value: event.target.value });
  };

  const onSwitchShowPassword = () => {
    dispatch({ type: "switch-show-password" });
  };

  const onSingIn: FormSubmitHandler = async (event) => {
    event.preventDefault();
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", state.email);
    formData.append("password", state.password);

    const response = await fetch("/api/sign-in", {
      body: formData,
      method: "POST",
    });

    const body = await response.json();
    if (response.status === 200) {
      enqueueSnackbar(body.message || "Sign in success.", {
        variant: "success",
      });
      router.push("/");
    } else {
      switch (body.message) {
        case "User is not confirmed.":
          moveToConfirmSignUpPage();
          break;
        default:
          enqueueSnackbar(body.message || "Unknown error", {
            variant: "error",
          });
      }
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

  return {
    state,
    onChangeEmail,
    onChangePassword,
    onSwitchShowPassword,
    onSingIn,
  };
};

export default useSignIn;
