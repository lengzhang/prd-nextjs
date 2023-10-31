import { MouseEventHandler, useEffect, useReducer } from "react";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

import {
  getTextItemsFromPDF,
  processTextItems,
  readPDFFromBuffer,
} from "./utils";
import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";

interface ReportItem {
  address: string;
  month: number;
  year: number;
  rentalIncome: number;
  totalIncome: number;
  totalLandscapeAndGardening: number;
  managementFees: number;
  totalRepairsAndMaintenance: number;
  totalUtilities: number;
  totalExpense: number;
  netOrdinaryIncome: number;
  netIncome: number;
}

interface State {
  status: "processing" | "done" | "error";
  report: ReportItem;
  confirmed: boolean;
  isUploading: boolean;
}

type Action =
  | { type: "process-failed" }
  | { type: "set-report"; value: ReportItem }
  | { type: "update-field"; key: string; value: string | number }
  | { type: "update-confirm-status"; value: boolean }
  | { type: "set-upload-status"; value: boolean };

const initialState: State = {
  status: "processing",
  report: {
    address: "",
    month: 0,
    year: 0,
    rentalIncome: 0,
    totalIncome: 0,
    totalLandscapeAndGardening: 0,
    managementFees: 0,
    totalRepairsAndMaintenance: 0,
    totalUtilities: 0,
    totalExpense: 0,
    netOrdinaryIncome: 0,
    netIncome: 0,
  },
  confirmed: false,
  isUploading: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "process-failed":
      return { ...state, status: "error" };
    case "set-report":
      return { ...state, status: "done", report: { ...action.value } };
    case "update-field":
      return {
        ...state,
        report: { ...state.report, [action.key]: action.value },
      };
    case "update-confirm-status":
      return { ...state, confirmed: action.value };
    case "set-upload-status":
      return { ...state, isUploading: action.value };
    default:
      return state;
  }
};

const useUploadFileSection = (file: File, removeFile: () => void) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    processFile();
  }, []);

  const processFile = async () => {
    const buffer = await file.arrayBuffer();
    const pdf = await readPDFFromBuffer(buffer);
    const textItems = await getTextItemsFromPDF(pdf);
    if (!textItems) {
      dispatch({ type: "process-failed" });
      return;
    }
    const report = await processTextItems(textItems);
    dispatch({
      type: "set-report",
      value: { ...initialState.report, ...report },
    });
  };

  const onOpenPDF = () => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const onChangeField =
    (key: string): TextFieldChangeHandler =>
    (event) => {
      const str = event.target.value;
      const value = key === "address" ? str : parseFloat(str);
      dispatch({ type: "update-field", key, value });
    };

  const onChangeDatePicker = (value: dayjs.Dayjs | null) => {
    if (!value) return;
    dispatch({ type: "update-field", key: "year", value: value.get("year") });
    dispatch({ type: "update-field", key: "month", value: value.get("month") });
  };

  const onClickUploadReport =
    (value: boolean): MouseEventHandler =>
    (event) => {
      event.preventDefault();
      dispatch({ type: "update-confirm-status", value });
    };

  const onClickConfirmUploadReport: FormSubmitHandler = async (event) => {
    event.preventDefault();
    if (!state.confirmed || state.isUploading) return;
    dispatch({ type: "set-upload-status", value: true });
    const formData = new FormData();
    formData.append("address", state.report.address);
    formData.append("year", state.report.year.toString());
    formData.append("month", state.report.month.toString());

    const response = await fetch("/api/reports/upload", {
      body: formData,
      method: "POST",
    });

    if (response.status !== 200) {
      const { message = "Unexpected service exception." } =
        await response.json();
      enqueueSnackbar(message, { variant: "error" });
      return;
    }

    const {
      jsonSignedUrl,
      pdfSignedUrl,
    }: { jsonSignedUrl: string; pdfSignedUrl: string } = await response.json();
    if (!jsonSignedUrl || !pdfSignedUrl) {
      enqueueSnackbar("Signed url is invalid.", { variant: "error" });
      return;
    }

    const jsonSignedUrlResponse = await fetch(jsonSignedUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.report),
    });

    if (jsonSignedUrlResponse.status !== 200) {
      const { message = "JSON report upload failed." } =
        await jsonSignedUrlResponse.json();
      enqueueSnackbar(message, { variant: "error" });
      return;
    }

    const pdfSignedUrlResponse = await fetch(pdfSignedUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: file,
    });

    if (pdfSignedUrlResponse.status !== 200) {
      const { message = "PDF file upload failed." } =
        await pdfSignedUrlResponse.json();
      enqueueSnackbar(message, { variant: "error" });
      return;
    }

    dispatch({ type: "set-upload-status", value: false });
    enqueueSnackbar("Report upload success.", { variant: "success" });
    removeFile();
  };

  return {
    state,
    processFile,
    onOpenPDF,
    onChangeField,
    onChangeDatePicker,
    onClickUploadReport,
    onClickConfirmUploadReport,
  };
};

export default useUploadFileSection;
