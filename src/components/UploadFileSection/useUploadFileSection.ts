import { useEffect, useReducer } from "react";
import {
  getTextItemsFromPDF,
  processTextItems,
  readPDFFromBuffer,
} from "./utils";
import { FormSubmitHandler, TextFieldChangeHandler } from "@/app/types";
import dayjs from "dayjs";

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
  done: boolean;
  report: ReportItem;
  confirmed: boolean;
}

type Action =
  | { type: "process-failed" }
  | { type: "set-report"; value: ReportItem }
  | { type: "update-field"; key: string; value: string | number }
  | { type: "update-confirm-status"; value: boolean };

const initialState: State = {
  status: "processing",
  done: false,
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
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "process-failed":
      return { ...state, status: "error" };
    case "set-report":
      return {
        ...state,
        status: "done",
        done: true,
        report: { ...action.value },
      };
    case "update-field":
      return {
        ...state,
        report: { ...state.report, [action.key]: action.value },
      };

    case "update-confirm-status":
      return { ...state, confirmed: action.value };
    default:
      return state;
  }
};

const useUploadFileSection = (file: File) => {
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
    // console.log(value?.get());
    if (!value) return;
    dispatch({ type: "update-field", key: "year", value: value.get("year") });
    dispatch({ type: "update-field", key: "month", value: value.get("month") });
  };

  const onClickUploadReport = (value: boolean) => () => {
    dispatch({ type: "update-confirm-status", value });
  };

  const onClickConfirmUploadReport: FormSubmitHandler = (event) => {
    event.preventDefault();
    console.log(event.target);
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
