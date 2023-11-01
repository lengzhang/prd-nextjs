"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";

import AuthCardHeader from "@/app/(auth)/AuthCardHeader";
import AuthCardActions from "@/app/(auth)/AuthCardActions";

import useConfirmResetPassword from "./useConfirmForgotPassword";

const ConfirmResetPasswordPage = () => {
  const {
    state,
    count,
    onChangeTextField,
    onSwitchShowPassword,
    onConfirmResetPassword,
    onClickResendConfirmationCode,
  } = useConfirmResetPassword();

  return (
    <form onSubmit={onConfirmResetPassword}>
      <Card>
        <AuthCardHeader
          title="Confirm reset password"
          subheader="Please use the verification code to reset your password."
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
            <TextField
              id="new_password"
              label="New password"
              variant="outlined"
              fullWidth
              size="small"
              value={state.newPassword}
              onChange={onChangeTextField("new-password")}
              type={state.showPassword ? "text" : "password"}
              required
              InputProps={{
                endAdornment: (
                  <IconButton onClick={onSwitchShowPassword} size="small">
                    {state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Stack>
        </CardContent>
        <AuthCardActions>
          <Stack width="100%" spacing={1}>
            <Button variant="outlined" fullWidth size="small" type="submit">
              Confirm
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={onClickResendConfirmationCode}
              disabled={count > 0}
            >
              Resend confirmation code
              {count > 0 ? ` in ${count}s` : ""}
            </Button>
          </Stack>
        </AuthCardActions>
      </Card>
    </form>
  );
};

export default ConfirmResetPasswordPage;
