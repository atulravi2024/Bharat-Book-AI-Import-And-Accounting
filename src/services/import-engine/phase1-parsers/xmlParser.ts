import { Confidence, ParsedVoucher, VoucherType, ParsingSettings } from '../../../app/types';

/**
 * Standard XML Parser for Bharat Book AI.
 * Handles XML structure using the browser's DOMParser.
 */
export const parseXmlFile = async (
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
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");

  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Invalid XML file format.");
  }

  // A very basic XML to Array of Objects.
  // We assume repeating child elements under the root.
  const root = xmlDoc.documentElement;
  const rawRows: any[] = [];

  for (let i = 0; i < root.children.length; i++) {
    const node = root.children[i];
    const rowObj: Record<string, any> = {};
    for (let j = 0; j < node.children.length; j++) {
      const child = node.children[j];
      rowObj[child.tagName] = child.textContent;
    }
    rawRows.push(rowObj);
  }

  if (rawRows.length === 0) {
    throw new Error("No data found in the selected XML file.");
  }

  return rawRows.map((row, index) => {
    return createVoucherFromRow(row, index, voucherType, mapping, settings, sourceBank, partyMasters, ledgerMasters);
  });
};
