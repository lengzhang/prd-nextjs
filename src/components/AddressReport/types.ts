import { ListResponseResult } from "@/app/api/reports/list-by-address/route";
import { OnClickHandler } from "@/app/types";

export interface AddressReportProps {
  id: string;
  address: string;
}

export interface AddressReportTableProps extends ListResponseResult {
  loading: boolean;
  onClickDownloadPDF: (id: string) => OnClickHandler;
}

export type UseAddressReportProps = AddressReportProps;

export interface State extends ListResponseResult {
  isLoading: boolean;
}

export type Action =
  | { type: "set-loading-state"; value: boolean }
  | { type: "set-data"; data: ListResponseResult };
