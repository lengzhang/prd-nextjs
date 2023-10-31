import { FC } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import {
  EXPENSE_FIELDS,
  INCOME_FIELDS,
  NAME_LABEL_MAPPER,
  NET_FIELDS,
} from "./constants";
import useUploadFileSection from "./useUploadFileSection";
import UploadFileSectionHeader from "./UploadFileSectionHeader";
import UploadFileSectionAction from "./UploadFileSectionAction";

interface UploadFileSectionProps {
  file: File;
  onRemoveFile: () => void;
}

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
  } = useUploadFileSection(file, onRemoveFile);

  if (state.status === "processing") return null;

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
        <UploadFileSectionHeader
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
        {state.isUploading ? (
          <Box marginTop={1}>
            <LinearProgress />
          </Box>
        ) : (
          <UploadFileSectionAction
            isConfirmed={state.confirmed}
            isDisabled={shouldDisabled()}
            onClickUploadReport={onClickUploadReport}
          />
        )}
      </form>
    </Paper>
  );
};

export default UploadFileSection;
