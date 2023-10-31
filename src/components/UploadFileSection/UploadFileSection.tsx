import { FC } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import {
  EXPENSE_FIELDS,
  INCOME_FIELDS,
  NAME_LABEL_MAPPER,
  NET_FIELDS,
} from "./constants";
import useUploadFileSection from "./useUploadFileSection";

interface UploadFileSectionProps {
  file: File;
  onRemoveFile: () => void;
}

const Header: FC<{
  name: string;
  onRemoveFile: () => void;
  onOpenPDF: () => void;
  reprocessPDF: () => void;
}> = ({ name, onRemoveFile, onOpenPDF, reprocessPDF }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">{name}</Typography>
      <Stack direction="row" alignItems="center">
        <Tooltip title="Delete the report">
          <IconButton
            aria-label="delete the report"
            size="small"
            onClick={onRemoveFile}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open the PDF">
          <IconButton
            aria-label="open pdf in new tab"
            size="small"
            onClick={onOpenPDF}
            color="info"
          >
            <PictureAsPdfIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reprocess the PDF">
          <IconButton
            aria-label="reprocess the PDF"
            size="small"
            onClick={reprocessPDF}
            color="success"
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

const Action: FC<{
  isConfirmed: boolean;
  isDisabled: boolean;
  onClickUploadReport: (value: boolean) => () => void;
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

const UploadFileSection: FC<UploadFileSectionProps> = ({
  file,
  onRemoveFile,
}) => {
  const {
    state,
    processFile,
    onOpenPDF,
    onChangeField,
    onChangeDatePicker,
    onClickUploadReport,
    onClickConfirmUploadReport,
  } = useUploadFileSection(file);
  if (!state.done) return null;

  console.log(state.report);

  const shouldDisabled = () => {
    for (const key in state.report) {
      const value = (state.report as any)[key];
      if (`${value}` === "NaN" || value < 0) return true;
    }
    return false;
  };

  return (
    <Paper variant="outlined" component={Box} padding={1}>
      <form onSubmit={onClickConfirmUploadReport}>
        <Header
          name={file.name}
          onRemoveFile={onRemoveFile}
          onOpenPDF={onOpenPDF}
          reprocessPDF={processFile}
        />
        <Box>
          <Box marginTop={2}>
            <TextField
              label="Address"
              value={state.report.address}
              onChange={onChangeField("address")}
              size="small"
              fullWidth
              required
              disabled={state.confirmed}
            />
          </Box>
          <Box marginTop={2}>
            <DatePicker
              label="Report month"
              views={["month", "year"]}
              value={dayjs(`${state.report.year}-${state.report.month + 1}`)}
              format="YYYY-MM"
              slotProps={{ textField: { size: "small", required: true } }}
              disabled={state.confirmed}
              onChange={onChangeDatePicker}
            />
          </Box>
          {[INCOME_FIELDS, EXPENSE_FIELDS, NET_FIELDS].map((fields, index) => (
            <Grid
              key={index}
              container
              rowSpacing={2}
              columnSpacing={1}
              component={Box}
              marginTop={0}
            >
              {fields.map((key) => {
                const value = `${(state.report as any)[key]}`;
                return (
                  <Grid key={key} item xs={6} md={3}>
                    <TextField
                      label={NAME_LABEL_MAPPER[key]}
                      value={value}
                      onChange={onChangeField(key)}
                      size="small"
                      fullWidth
                      type="number"
                      error={value === "-1"}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      margin="none"
                      disabled={state.confirmed}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Box>
        <Action
          isConfirmed={state.confirmed}
          isDisabled={shouldDisabled()}
          onClickUploadReport={onClickUploadReport}
        />
      </form>
    </Paper>
  );
};

export default UploadFileSection;
