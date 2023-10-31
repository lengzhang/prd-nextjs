import { FC } from "react";

import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const UploadFileSectionHeader: FC<{
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

export default UploadFileSectionHeader;
