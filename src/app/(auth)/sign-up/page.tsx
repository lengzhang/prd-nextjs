"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";

import AuthCardActions from "@/app/(auth)/AuthCardActions";

import useSignUp from "./useSignUp";

const SignUpPage = () => {
  const { state, onChangeTextField, onSwitchShowPassword, onSignUp } =
    useSignUp();
  return (
    <form onSubmit={onSignUp}>
      <Card>
        <CardHeader title="Sign up" />
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
              id="password"
              label="Password"
              variant="outlined"
              fullWidth
              size="small"
              value={state.password}
              onChange={onChangeTextField("password")}
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
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              fullWidth
              size="small"
              value={state.username}
              onChange={onChangeTextField("username")}
              type="text"
              required
            />
          </Stack>
        </CardContent>
        <AuthCardActions>
          <Stack width="100%" spacing={1}>
            <Button variant="outlined" fullWidth size="small" type="submit">
              Sign Up
            </Button>
            <Typography variant="caption" align="center">
              Already have an account? <Link href="/sign-in">Sign In</Link>
            </Typography>
          </Stack>
        </AuthCardActions>
      </Card>
    </form>
  );
};

export default SignUpPage;
