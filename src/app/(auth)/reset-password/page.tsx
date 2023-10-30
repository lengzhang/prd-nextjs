"use client";

import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";

import AuthCardHeader from "@/app/(auth)/AuthCardHeader";
import AuthCardActions from "@/app/(auth)/AuthCardActions";

import useResetPassword from "./useResetPassword";

const ResetPasswordPage = () => {
  const { email, onChangeEmail, onSendVerificationCode } = useResetPassword();
  return (
    <form onSubmit={onSendVerificationCode}>
      <Card>
        <AuthCardHeader
          title="Reset password"
          subheader="Please enter your email to receive the verification code."
        />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              value={email}
              onChange={onChangeEmail}
              type="email"
              required
            />
          </Stack>
        </CardContent>
        <AuthCardActions>
          <Stack width="100%" spacing={1}>
            <Button variant="outlined" fullWidth size="small" type="submit">
              Send verification code
            </Button>
            <Typography variant="caption" align="center">
              <Link href="/sign-in">Back to sign in</Link>
            </Typography>
          </Stack>
        </AuthCardActions>
      </Card>
    </form>
  );
};

export default ResetPasswordPage;
