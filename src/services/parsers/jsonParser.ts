import { Confidence, ParsedVoucher, VoucherType, ParsingSettings } from '../../app/types';

/**
 * Standard JSON Parser for Bharat Book AI.
 * Handles structured JSON data.
 */
export const parseJsonFile = async (
  file: File,
  voucherType: VoucherType,
  createVoucherFromRow: Function,
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string,
  partyMasters: any[] = [],
  ledgerMasters: any[] = []
): Promise<ParsedVoucher[]> => {
  const text = await file.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error("Invalid JSON file format.");
  }

  // Ensure data is an array
  let rawRows: any[] = [];
  if (Array.isArray(data)) {
    rawRows = data;
  } else if (typeof data === 'object' && data !== null) {
    // Attempt to find the first array in the object
    const keyWithArray = Object.keys(data).find(key => Array.isArray(data[key]));
    if (keyWithArray) {
      rawRows = data[keyWithArray] as any[];
    } else {
      rawRows = [data]; // wrap single object
    }
  }

  if (rawRows.length === 0) {
    throw new Error("No data found in the selected JSON file.");
  }

  return rawRows.map((row, index) => {
    return createVoucherFromRow(row, index, voucherType, mapping, settings, sourceBank, partyMasters, ledgerMasters);
  });
};
