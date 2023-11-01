import { FC } from "react";

import { Box, IconButton, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  EXPENSE_FIELDS,
  INCOME_FIELDS,
  NAME_LABEL_MAPPER,
  NET_FIELDS,
} from "@/components//UploadFileSection/constants";

import { ReportItem } from "@/app/types";
import { AddressReportProps, AddressReportTableProps } from "./types";

import useAddressReport from "./useAddressReport";

const getMinWidth = (str: string) => 7 * str.length + 75;

const AddressReportTable: FC<AddressReportTableProps> = ({
  keys,
  mapper,
  loading,
  onClickDownloadPDF,
}) => {
  const columns: GridColDef<ReportItem & { id: string }>[] = [
    {
      field: "Action",
      renderCell: (props) => (
        <IconButton size="small" onClick={onClickDownloadPDF(props.row.id)}>
          <PictureAsPdfIcon />
        </IconButton>
      ),
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "year",
      headerName: "Year",
      minWidth: getMinWidth("Year"),
      align: "right",
      headerAlign: "right",
    },
    {
      field: "month",
      headerName: "Month",
      minWidth: getMinWidth("Month"),
      align: "right",
      headerAlign: "right",
    },
    ...[...INCOME_FIELDS, ...EXPENSE_FIELDS, ...NET_FIELDS].map<GridColDef>(
      (field) => {
        const label = NAME_LABEL_MAPPER[field];
        return {
          field,
          headerName: label,
          description: label,
          type: "number",
          minWidth: getMinWidth(label),
          align: "right",
          headerAlign: "right",
        };
      }
    ),
  ];

  const rows = keys.map((key) => ({ id: key, ...mapper[key] }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      density="compact"
      loading={loading}
      autoHeight
    />
  );
};

const AddressReport: FC<AddressReportProps> = ({ id, address }) => {
  const { state, onClickDownloadPDF } = useAddressReport({ id, address });

  return (
    <Paper component={Box} padding={1}>
      <Typography variant="h6">{address}</Typography>
      <AddressReportTable
        keys={state.keys}
        mapper={state.mapper}
        onClickDownloadPDF={onClickDownloadPDF}
        loading={state.isLoading}
      />
    </Paper>
  );
};

export default AddressReport;
