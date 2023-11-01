"use client";

import { Box, Container, ThemeProvider, createTheme } from "@mui/material";

import { LayoutComponent } from "@/app/types";
import { AuthContextProvider } from "@/context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PrivateAppBar from "./PrivateAppBar";
import { LoadingBackdropContextProvider } from "@/context/LoadingBackdropContext";

const PrivateLayout: LayoutComponent = ({ children }) => {
  return (
    <ThemeProvider
      theme={createTheme({
        typography: { button: { textTransform: "none" } },
      })}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LoadingBackdropContextProvider>
          <AuthContextProvider>
            <PrivateAppBar />
            <Container maxWidth="md" component={Box} marginTop={2}>
              {children}
            </Container>
          </AuthContextProvider>
        </LoadingBackdropContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default PrivateLayout;
