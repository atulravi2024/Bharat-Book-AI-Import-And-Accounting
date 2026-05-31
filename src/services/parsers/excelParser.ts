import * as XLSX from 'xlsx';
import { Confidence, ParsedVoucher, VoucherType, ParsingSettings } from '../../app/types';

/**
 * Standard Excel Parser for Bharat Book AI.
 * Handles both modern .xlsx and older .xls formats.
 */
export const parseExcelFile = async (
  file: File,
  voucherType: VoucherType,
  createVoucherFromRow: Function,
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string,
  partyMasters: any[] = [],
  ledgerMasters: any[] = []
): Promise<ParsedVoucher[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Find the actual header row (many statements have pre-headers or extraneous text lines)
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
  let headerRowIndex = 0;
  let maxScore = 0;
  
  const commonHeaders = [
    'date', 'particulars', 'description', 'narration', 'amount', 'withdrawal', 'deposit', 
    'balance', 'closing balance', 'credit', 'debit', 'chq', 'ref', 'reference'
  ];

  for (let i = 0; i < Math.min(rawRows.length, 30); i++) {
    const row = rawRows[i];
    if (!Array.isArray(row)) continue;
    
    let score = 0;
    for (const cell of row) {
      if (typeof cell === 'string') {
        const lowerCell = cell.trim().toLowerCase();
        if (commonHeaders.some(h => lowerCell.includes(h))) {
          score++;
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      headerRowIndex = i;
    }
  }
  
  const rangeStart = maxScore > 1 ? headerRowIndex : 0;
  const rows = XLSX.utils.sheet_to_json(worksheet, { range: rangeStart, defval: '' }) as any[];

  // Filter out truly empty rows
  const dataRows = rows.filter(row => 
    Object.values(row).some(val => val !== null && val !== undefined && val !== '')
  );

  if (dataRows.length === 0) {
    throw new Error("No transactions/records could be extracted from this Excel file.");
  }

  return dataRows.map((row, index) => {
    return createVoucherFromRow(row, index, voucherType, mapping, settings, sourceBank, partyMasters, ledgerMasters);
  });
};
