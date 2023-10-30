"use client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Stack,
} from "@mui/material";

import AuthCardActions from "@/app/(auth)/AuthCardActions";

import useConfirmSignUp from "./useConfirmSignUp";

const ConfirmSignUpPage = () => {
  const {
    state,
    onChangeTextField,
    onConfirmSignUp,
    onClickResendConfirmationCode,
  } = useConfirmSignUp();
  return (
    <form onSubmit={onConfirmSignUp}>
      <Card>
        <CardHeader
          title="Confirm sign up"
          subheader="Please use the verification code from your email to complete the registration."
        />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              value={state.email}
              onChange={onChangeTextField("email")}
              type="email"
              required
            />
            <TextField
              id="code"
              label="Verification code"
              variant="outlined"
              fullWidth
              size="small"
              value={state.code}
              onChange={onChangeTextField("code")}
              type="text"
              required
            />
          </Stack>
        </CardContent>
        <AuthCardActions>
          <Stack width="100%" spacing={1} paddingBottom={1}>
            <Button variant="outlined" fullWidth size="small" type="submit">
              Confirm
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={onClickResendConfirmationCode}
              disabled={state.resendCounter > 0}
            >
              Resend confirmation code
              {state.resendCounter > 0 ? ` in ${state.resendCounter}s` : ""}
            </Button>
          </Stack>
        </AuthCardActions>
      </Card>
    </form>
  );
};

export default ConfirmSignUpPage;
