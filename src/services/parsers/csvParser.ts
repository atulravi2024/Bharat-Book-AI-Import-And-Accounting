import { Confidence, ParsedVoucher, VoucherType, ParsingSettings } from '../../app/types';

/**
 * Standard CSV Parser for Bharat Book AI.
 * Handles parsing, quotes wrapping, and comma separating in a distinct file pipeline.
 */
export const parseCsvFile = async (
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
  const rawRows = parseCSVText(text);

  if (rawRows.length === 0) {
    throw new Error("No data found in the selected CSV file.");
  }

  // Scan first 30 rows to find header row (highest density of common voucher keys)
  let headerRowIndex = 0;
  let maxScore = 0;
  
  const commonHeaders = [
    'date', 'particulars', 'description', 'narration', 'amount', 'withdrawal', 'deposit', 
    'balance', 'closing balance', 'credit', 'debit', 'chq', 'ref', 'reference'
  ];

  for (let i = 0; i < Math.min(rawRows.length, 30); i++) {
    const row = rawRows[i];
    let score = 0;
    for (const cell of row) {
      const lowerCell = String(cell).trim().toLowerCase();
      if (commonHeaders.some(h => lowerCell.includes(h))) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      headerRowIndex = i;
    }
  }

  const headers = rawRows[headerRowIndex].map(h => String(h).trim());
  const dataRows: any[] = [];

  for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (row.length === 0 || row.every(cell => String(cell).trim() === '')) {
      continue;
    }
    
    // Assemble cell array into key-value objects using headers
    const rowObj: Record<string, any> = {};
    headers.forEach((header, colIndex) => {
      if (header) {
        rowObj[header] = colIndex < row.length ? row[colIndex] : '';
      }
    });
    
    dataRows.push(rowObj);
  }

  if (dataRows.length === 0) {
    throw new Error("No transactions/records could be extracted from this CSV file.");
  }

  return dataRows.map((row, index) => {
    return createVoucherFromRow(row, index, voucherType, mapping, settings, sourceBank, partyMasters, ledgerMasters);
  });
};

/**
 * Parses raw CSV text into a 2D array of cells.
 * Properly handles quoted fields which contain embedded commas or newlines.
 */
function parseCSVText(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quotation marks
        currentCell += '"';
        i++; // skip duplicate quote
      } else {
        // Toggle quotes state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF of CRLF
      }
      row.push(currentCell.trim());
      lines.push(row);
      row = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell || row.length > 0) {
    row.push(currentCell.trim());
    lines.push(row);
  }

  // Filter out completely blank lines
  return lines.filter(r => r.length > 0 && r.some(cell => cell !== ''));
}
