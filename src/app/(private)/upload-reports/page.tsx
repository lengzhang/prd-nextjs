"use client";

import styled from "@emotion/styled";
import { Box, Button, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import useUploadReports from "./useUploadReports";
import UploadFileSection from "@/components/UploadFileSection";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadReportsPage = () => {
  const { state, onSelectReports, onRemoveFile } = useUploadReports();

  return (
    <>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Select reports
        <VisuallyHiddenInput
          type="file"
          multiple
          accept=".pdf"
          onChange={onSelectReports}
        />
      </Button>
      <Box marginTop={2}>
        <Stack spacing={2}>
          {Object.keys(state.files).map((key) => {
            const file = state.files[key];
            return (
              <UploadFileSection
                key={key}
                file={file}
                onRemoveFile={onRemoveFile(key)}
              />
            );
          })}
        </Stack>
      </Box>
    </>
  );
};

export default UploadReportsPage;
