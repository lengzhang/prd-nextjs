export const PROFIT_LOSS_YTD_COMPARISON_REGEXP = /Profit & Loss YTD Comparison/;
export const CASH_BASIS_REGEXP = /Cash Basis/;
export const LABEL_NAME_MAPPER: Record<string, string> = {
  "Rental Income": "rentalIncome",
  "Total Income": "totalIncome",
  "Total Landscape and Gardening": "totalLandscapeAndGardening",
  "Property Management": "managementFees",
  "Management Fees": "managementFees",
  "Total Repairs and Maintenance": "totalRepairsAndMaintenance",
  "Total Utilities": "totalUtilities",
  "Total Expense": "totalExpense",
  "Net Ordinary Income": "netOrdinaryIncome",
  "Net Income": "netIncome",
};

export const NAME_LABEL_MAPPER = Object.keys(LABEL_NAME_MAPPER).reduce<
  Record<string, string>
>((acc, key) => {
  acc[LABEL_NAME_MAPPER[key]] = key;
  return acc;
}, {});

export const INCOME_FIELDS = ["totalIncome", "rentalIncome"];
export const EXPENSE_FIELDS = [
  "totalLandscapeAndGardening",
  "managementFees",
  "totalRepairsAndMaintenance",
  "totalUtilities",
  "totalExpense",
];
export const NET_FIELDS = ["netOrdinaryIncome", "netIncome"];
