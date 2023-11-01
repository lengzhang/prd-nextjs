"use client";

import { FC, ReactNode } from "react";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { SnackbarProvider, closeSnackbar } from "notistack";

const SnackBarWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SnackbarProvider
      autoHideDuration={6000}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      action={(snackbarId) => (
        <IconButton
          onClick={() => closeSnackbar(snackbarId)}
          size="small"
          style={{ color: "white" }}
        >
          <CancelIcon fontSize="small" />
        </IconButton>
      )}
      dense
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackBarWrapper;
