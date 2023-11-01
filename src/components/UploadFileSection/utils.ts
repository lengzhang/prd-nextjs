"use client";

import { MONTHS } from "@/utils/constants";
import * as pdfjs from "pdfjs-dist";
import { PDFDocumentProxy, TextItem } from "pdfjs-dist/types/src/display/api";
import {
  CASH_BASIS_REGEXP,
  LABEL_NAME_MAPPER,
  PROFIT_LOSS_YTD_COMPARISON_REGEXP,
} from "./constants";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const readPDFFromBuffer = async (buffer: ArrayBuffer) => {
  const pdf = await pdfjs.getDocument(buffer).promise;
  return pdf;
};

export const getTextItemsFromPDF = async (
  pdf: PDFDocumentProxy
): Promise<TextItem[] | null> => {
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const index = textContent.items.findIndex((v) =>
      PROFIT_LOSS_YTD_COMPARISON_REGEXP.test((v as TextItem).str)
    );
    if (index === -1) continue;
    return textContent.items
      .filter((content) => (content as TextItem).str.trim().length !== 0)
      .map((v) => ({ ...v, str: (v as TextItem).str.trim() }) as TextItem);
  }
  return null;
};

const roundCoordinate = (value: any) => {
  const num = parseInt(value);
  const prefix = Math.floor(num / 10) * 10;
  const lastDigit = num % 10;
  if (lastDigit <= 2) return prefix;
  if (lastDigit <= 5) return prefix + 5;
  if (lastDigit <= 7) return prefix + 5;
  return prefix + 10;
};

export const processTextItems = (textItems: TextItem[]) => {
  // Sort text items by coordinate
  const items = textItems
    .map(({ str, transform }) => ({
      str,
      x: roundCoordinate(transform[4]),
      y: roundCoordinate(transform[5]),
    }))
    .sort((a, b) => (b.y === a.y ? a.x - b.x : b.y - a.y));

  const cashBasisIndex = items.findIndex((v) => CASH_BASIS_REGEXP.test(v.str));
  const [month, year] = items[cashBasisIndex + 1].str.split(" ");
  const obj: Record<string, string | number> = {
    address: items[1].str,
    month: MONTHS.findIndex((v) => v === month),
    year: parseInt(year),
  };
  for (let i = 0; i < items.length; i++) {
    const str = items[i].str;

    if (!LABEL_NAME_MAPPER[str]) continue;
    const value = Number(items[i + 1].str.replace(",", ""));
    obj[LABEL_NAME_MAPPER[str]] = value;
  }
  return obj;
};
