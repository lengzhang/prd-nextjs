"use client";

import styled from "@emotion/styled";
import { Container } from "@mui/material";

import { LayoutComponent } from "@/app/types";
import { LoadingBackdropContextProvider } from "@/context/LoadingBackdropContext";

const AuthBackground = styled.div({
  width: "100vw",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "lightgray",
});

const AuthLayout: LayoutComponent = ({ children }) => {
  return (
    <LoadingBackdropContextProvider>
      <AuthBackground>
        <Container maxWidth="xs">{children}</Container>
      </AuthBackground>
    </LoadingBackdropContextProvider>
  );
};

export default AuthLayout;
