import { FC, MouseEventHandler } from "react";
import { Button, Stack } from "@mui/material";

const UploadFileSectionAction: FC<{
  isConfirmed: boolean;
  isDisabled: boolean;
  onClickUploadReport: (value: boolean) => MouseEventHandler;
}> = ({ isConfirmed, isDisabled, onClickUploadReport }) => {
  return (
    <Stack spacing={4} marginTop={1} direction="row" justifyContent="center">
      {isConfirmed ? (
        <>
          <Button
            fullWidth
            variant="contained"
            size="small"
            color="success"
            type="submit"
            disabled={isDisabled}
          >
            confirm
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="small"
            color="error"
            onClick={onClickUploadReport(false)}
          >
            cancel
          </Button>
        </>
      ) : (
        <Button
          fullWidth
          variant="contained"
          size="small"
          color="info"
          onClick={onClickUploadReport(true)}
          disabled={isDisabled}
        >
          upload report
        </Button>
      )}
    </Stack>
  );
};

export default UploadFileSectionAction;
