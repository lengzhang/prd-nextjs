"use client";

import { Box, Container } from "@mui/material";

import { LayoutComponent } from "@/app/types";
import { AuthContextProvider } from "@/context/AuthContext";
import PrivateAppBar from "./PrivateAppBar";

const PrivateLayout: LayoutComponent = ({ children }) => {
  return (
    <AuthContextProvider>
      <PrivateAppBar />
      <Container maxWidth="md" component={Box} marginTop={2}>
        {children}
      </Container>
    </AuthContextProvider>
  );
};

export default PrivateLayout;
