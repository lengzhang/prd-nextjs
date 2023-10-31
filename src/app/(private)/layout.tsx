"use client";

import { Box, Container } from "@mui/material";

import { LayoutComponent } from "@/app/types";
import { AuthContextProvider } from "@/context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PrivateAppBar from "./PrivateAppBar";

const PrivateLayout: LayoutComponent = ({ children }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthContextProvider>
        <PrivateAppBar />
        <Container maxWidth="md" component={Box} marginTop={2}>
          {children}
        </Container>
      </AuthContextProvider>
    </LocalizationProvider>
  );
};

export default PrivateLayout;
