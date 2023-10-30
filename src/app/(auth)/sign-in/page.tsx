"use client";

import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import Link from "next/link";

import AuthCardHeader from "@/app/(auth)/AuthCardHeader";
import AuthCardActions from "@/app/(auth)/AuthCardActions";

import useSignIn from "./useSignIn";

const LoginPage = () => {
  const {
    state,
    onChangeEmail,
    onChangePassword,
    onSwitchShowPassword,
    onSingIn,
  } = useSignIn();

  return (
    <form onSubmit={onSingIn}>
      <Card>
        <AuthCardHeader title="Sign in" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              value={state.email}
              onChange={onChangeEmail}
              type="email"
              required
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              fullWidth
              size="small"
              value={state.password}
              onChange={onChangePassword}
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
              Login
            </Button>
            <Typography variant="caption" align="center">
              Do not have an account? <Link href="/sign-up">Sign up</Link>
            </Typography>
            <Typography variant="caption" align="center">
              Forgot your password?{" "}
              <Link href="/reset-password">Reset password</Link>
            </Typography>
          </Stack>
        </AuthCardActions>
      </Card>
    </form>
  );
};

export default LoginPage;
