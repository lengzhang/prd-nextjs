import { useEffect, useReducer } from "react";
import { Action, State, UseAddressReportProps } from "./types";
import { ListResponseResult } from "@/app/api/reports/list-by-address/route";
import { OnClickHandler } from "@/app/types";
import { useSnackbar } from "notistack";

const initialState: State = {
  isLoading: false,
  keys: [],
  mapper: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-loading-state":
      return { ...state, isLoading: action.value };
    case "set-data":
      return { ...state, ...action.data };
    default:
      return state;
  }
};

const useAddressReport = ({ id, address }: UseAddressReportProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "set-loading-state", value: true });
      const key = `${id}/${address}`;

      const searchParams = new URLSearchParams();
      searchParams.append("key", key);
      const response = await fetch(
        `/api/reports/list-by-address?${searchParams.toString()}`
      );

      const data: ListResponseResult = await response.json();
      dispatch({ type: "set-data", data });
      dispatch({ type: "set-loading-state", value: false });
    };
    fetchData();
  }, [id, address]);

  const onClickDownloadPDF =
    (id: string): OnClickHandler =>
    async () => {
      dispatch({ type: "set-loading-state", value: true });
      const searchParams = new URLSearchParams();
      searchParams.append("key", `${id}/pdf`);

      const response = await fetch(
        `/api/reports/get-download-url?${searchParams.toString()}`
      );
      if (response.status !== 200) {
        const { message = "Unexpected service exception." } =
          await response.json();
        enqueueSnackbar(message, { variant: "error" });
      } else {
        const { url } = await response.json();
        window.open(url);
      }
      dispatch({ type: "set-loading-state", value: false });
    };

  return { state, onClickDownloadPDF };
};

export default useAddressReport;
