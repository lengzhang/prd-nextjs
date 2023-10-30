import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";
import useCountTimer from "@/hooks/useCountTimer";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useReducer, useRef } from "react";

interface State {
  email: string;
  code: string;
  newPassword: string;
  showPassword: boolean;
}

type Action =
  | {
      type: "set-email" | "set-code" | "set-new-password";
      value: string;
    }
  | { type: "switch-show-password" };

const initialState: State = {
  email: "",
  code: "",
  newPassword: "",
  showPassword: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-email":
      return { ...state, email: action.value };
    case "set-code":
      return { ...state, code: action.value };
    case "set-new-password":
      return { ...state, newPassword: action.value };
    case "switch-show-password":
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
};

const useConfirmResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const { handleLoadingState } = useLoadingBackdropContext();

  const { count, triggerTimer } = useCountTimer({
    from: 30,
    to: 0,
    diff: -1,
    delay: 1000,
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) dispatch({ type: "set-email", value: email });
  }, []);

  const onChangeTextField =
    (name: "email" | "new-password" | "code"): TextFieldChangeHandler =>
    (event) => {
      dispatch({ type: `set-${name}`, value: event.target.value });
    };

  const onSwitchShowPassword = () => {
    dispatch({ type: "switch-show-password" });
  };

  const onConfirmResetPassword: FormSubmitHandler = async (event) => {
    event.preventDefault();
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", state.email);
    formData.append("password", state.newPassword);
    formData.append("confirmationCode", state.code);

    const response = await fetch("/api/confirm-forgot-password", {
      body: formData,
      method: "POST",
    });

    if (response.status === 200) {
      moveToSignInPage();
    } else {
      const body = await response.json();
      enqueueSnackbar(body.message || "Unknown error", { variant: "error" });
    }

    handleLoadingState(false);
  };

  const moveToSignInPage = () => {
    enqueueSnackbar("Reset password completed, please login to your account.", {
      variant: "success",
    });
    router.push("/sign-in");
  };

  const onClickResendConfirmationCode = async () => {
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", state.email);

    const response = await fetch("/api/forgot-password", {
      body: formData,
      method: "POST",
    });

    if (response.status === 200) {
      enqueueSnackbar("Confirmation code sent, please check your email.", {
        variant: "success",
      });
      triggerTimer();
    } else {
      const body = await response.json();
      enqueueSnackbar(body.message || "Unknown error", { variant: "error" });
    }
    handleLoadingState(false);
  };

  return {
    state,
    count,
    onChangeTextField,
    onSwitchShowPassword,
    onConfirmResetPassword,
    onClickResendConfirmationCode,
  };
};

export default useConfirmResetPassword;
