import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useReducer, useRef } from "react";

interface State {
  email: string;
  code: string;
  resendCounter: number;
}

type Action =
  | { type: "decrease-resend-counter" }
  | {
      type: "set-email";
      value: string;
    }
  | {
      type: "set-code";
      value: string;
    }
  | {
      type: "set-resend-counter";
      value: number;
    };

const initialState: State = {
  email: "",
  code: "",
  resendCounter: 0,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-email":
      return { ...state, email: action.value };
    case "set-code":
      return { ...state, code: action.value };
    case "set-resend-counter":
      return { ...state, resendCounter: action.value };
    case "decrease-resend-counter":
      return { ...state, resendCounter: state.resendCounter - 1 };
    default:
      return state;
  }
};

const useConfirmSignUp = () => {
  const router = useRouter();
  const { handleLoadingState } = useLoadingBackdropContext();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();

  const [state, dispatch] = useReducer(reducer, initialState);
  const resendTimerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) dispatch({ type: "set-email", value: email });
    return () => {
      if (resendTimerId.current) clearInterval(resendTimerId.current);
    };
  }, []);

  useEffect(() => {
    if (state.resendCounter <= 0 && resendTimerId.current) {
      clearInterval(resendTimerId.current);
    }
  }, [state.resendCounter]);

  const onChangeTextField =
    (name: "email" | "code"): TextFieldChangeHandler =>
    (event) => {
      dispatch({ type: `set-${name}`, value: event.target.value });
    };

  const onConfirmSignUp: FormSubmitHandler = async (event) => {
    event.preventDefault();
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", state.email);
    formData.append("confirmationCode", state.code);

    const response = await fetch("/api/confirm-sign-up", {
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
    enqueueSnackbar("Registration completed, please login to your account.", {
      variant: "success",
    });
    router.push("/sign-in");
  };

  const onClickResendConfirmationCode = async () => {
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", state.email);

    const response = await fetch("/api/resend-confirmation-code", {
      body: formData,
      method: "POST",
    });

    if (response.status === 200) {
      enqueueSnackbar("Confirmation code sent, please check your email.", {
        variant: "success",
      });
      triggerResendTimer();
    } else {
      const body = await response.json();
      enqueueSnackbar(body.message || "Unknown error", { variant: "error" });
    }
    handleLoadingState(false);
  };

  const triggerResendTimer = () => {
    if (state.resendCounter === 0) {
      dispatch({ type: "set-resend-counter", value: 30 });
      resendTimerId.current = setInterval(() => {
        dispatch({ type: "decrease-resend-counter" });
      }, 1000);
    }
  };

  return {
    state,
    onChangeTextField,
    onConfirmSignUp,
    onClickResendConfirmationCode,
  };
};

export default useConfirmSignUp;
