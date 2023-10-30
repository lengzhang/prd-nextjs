import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";
import { useLoadingBackdropContext } from "@/context/LoadingBackdropContext";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";

const useResetPassword = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { handleLoadingState } = useLoadingBackdropContext();
  const [email, setEmail] = useState("");

  const onChangeEmail: TextFieldChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const onSendVerificationCode: FormSubmitHandler = async (event) => {
    event.preventDefault();
    handleLoadingState(true);
    const formData = new FormData();
    formData.append("email", email);

    const response = await fetch("/api/forgot-password", {
      body: formData,
      method: "POST",
    });

    if (response.status === 200) {
      moveToConfirmResetPasswordPage();
    } else {
      const body = await response.json();
      enqueueSnackbar(body.message || "Unknown error", { variant: "error" });
    }

    handleLoadingState(false);
  };

  const moveToConfirmResetPasswordPage = () => {
    enqueueSnackbar("Confirmation code sent, please check your email.", {
      variant: "success",
    });
    const searchParams = new URLSearchParams();
    searchParams.set("email", email);
    router.push(`/confirm-reset-password?${searchParams.toString()}`);
  };

  return { email, onChangeEmail, onSendVerificationCode };
};

export default useResetPassword;
