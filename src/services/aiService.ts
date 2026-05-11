
import * as XLSX from 'xlsx';
import { Confidence, ParsedVoucher, VoucherType, ParsingSettings } from '../types';
import { extractValidName } from './NameExtractor';

// This is a service to process voucher files.
// For Bank Statements and Excel files, it uses direct parsing.
// For other types, it currently simulates AI processing.

export const getFiscalYearDates = (format = 'April to March (Indian Standard)') => {
  const now = new Date();
  const year = now.getFullYear();
  let startMonth = 3; // April (0-indexed)
  
  if (format.includes('January')) startMonth = 0;
  if (format.includes('July')) startMonth = 6;
  if (format.includes('October')) startMonth = 9;

  let fiscalStartYear = year;
  let fiscalEndYear = year + 1;

  if (now.getMonth() < startMonth) {
    fiscalStartYear = year - 1;
    fiscalEndYear = year;
  } else {
    // Current year is the start year
    if (format.includes('January')) {
        fiscalEndYear = year;
    }
  }

  const from = new Date(fiscalStartYear, startMonth, 1);
  const to = new Date(fiscalEndYear, startMonth === 0 ? 11 : startMonth - 1, startMonth === 0 ? 31 : (new Date(fiscalEndYear, startMonth, 0).getDate()));

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  return {
    from: formatDate(from),
    to: formatDate(to)
  };
};
export const parseVoucherFile = async (
  file: File, 
  voucherType: VoucherType, 
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string,
  partyMasters: any[] = [],
  ledgerMasters: any[] = []
): Promise<ParsedVoucher[]> => {
  const fileName = file.name.toLowerCase();
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');

  if (isExcel) {
    try {
      // Small delay to show loading state as users expect some "processing" time for data verification
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Find the actual header row (many bank statements have pre-headers or metadata)
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

      // Filter out truly empty rows that might be picked up
      const dataRows = rows.filter(row => 
        Object.values(row).some(val => val !== null && val !== undefined && val !== '')
      );

      if (dataRows.length > 0) {
        return dataRows.map((row, index) => {
          return createVoucherFromRow(row, index, voucherType, mapping, settings, sourceBank, partyMasters, ledgerMasters);
        });
      }
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      // Fall through to mock logic
    }
  }

  // Fallback / Default Mock Logic for non-excel or failed parsing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate different outcomes based on voucher type for variety
      const numberOfVouchers = Math.floor(Math.random() * 3) + 1;
      const vouchers: ParsedVoucher[] = Array.from({ length: numberOfVouchers }, (_, i) => 
        createMockVoucher(i, voucherType, mapping, settings, sourceBank)
      );
      resolve(vouchers);
    }, settings?.aiModel === 'Gemini 1.5 Pro' ? 4000 : 2000);
  });
};

// Helper to parse strings with currency symbols, commas, etc., into numbers
export const parseNumericValue = (val: any): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  
  // Strip non-numeric characters except for the decimal point and minus sign
  // We keep the first minus sign if it exists at the start
  const str = String(val).trim();
  const sanitized = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(sanitized);
  
  return isNaN(parsed) ? 0 : parsed;
};


const createVoucherFromRow = (
  row: any,
  index: number,
  voucherType: VoucherType,
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string,
  partyMasters: any[] = [],
  ledgerMasters: any[] = []
): ParsedVoucher => {
  // Helper to map keys based on user-provided mapping or common patterns
  const getValue = (field: string) => {
    const mappedKey = mapping?.[field];
    if (mappedKey && row[mappedKey] !== undefined) return row[mappedKey];
    
    // Fallback to common bank statement column names
    const commonNames: Record<string, string[]> = {
      date: ['Date', 'Transaction Date', 'Txn Date', 'Value Date', 'Posting Date', 'Dated', 'Tran Date'],
      time: ['Time', 'Transaction Time', 'Txn Time', 'Timestamp'],
      narration: ['Description', 'Narration', 'Particulars', 'Transaction Details', 'Remarks', 'Memo', 'Transaction Remarks'],
      referenceNo: ['Reference No', 'Ref No', 'Cheque No', 'Chq No', 'Ref.', 'UTR', 'Transaction ID', 'Instrument No', 'Cheque/Ref No'],
      withdrawalAmount: ['Withdrawal', 'Debit', 'Withdraw', 'Payment', 'Dr', 'Payment Amount', 'Out', 'Debit Amount', 'Withdrawal Amt'],
      depositAmount: ['Deposit', 'Credit', 'Received', 'Cr', 'Receipt Amount', 'In', 'Credit Amount', 'Deposit Amt'],
      closingBalance: ['Balance', 'Closing Balance', 'Available Balance', 'Running Balance', 'Final Balance'],
      amount: ['Amount', 'Value', 'Transaction Amount', 'Net Amount'],
      gstin: ['GSTIN', 'GST No', 'GST Number', 'GST'],
      mobileNumber: ['Mobile', 'Mobile No', 'Mobile Number', 'Phone', 'Phone No', 'Phone Number', 'Contact No']
    };

    if (commonNames[field]) {
      // Case-insensitive check with trim
      const rowKeys = Object.keys(row);
      for (const name of commonNames[field]) {
        const foundKey = rowKeys.find(k => k.trim().toLowerCase() === name.toLowerCase());
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') return row[foundKey];
      }
    }

    return row[field];
  };

  const getFieldInfo = (key: string, val: any) => {
    const isAmountFallbackMapped = key === 'amount' && (!!mapping?.['depositAmount'] || !!mapping?.['withdrawalAmount']);
    const wasMapped = !!mapping?.[key] || isAmountFallbackMapped;
    
    // Check if value is truly present and valid
    const hasValue = val !== undefined && val !== null && String(val).trim() !== '';
    
    return {
      value: hasValue ? val : '',
      confidence: hasValue ? (wasMapped ? Confidence.High : Confidence.Medium) : Confidence.Low,
      suggestion: wasMapped ? 'Extracted using user-provided column mapping' : (hasValue ? 'Extracted from matched column' : undefined)
    };
  };

  const isBankStatement = voucherType === VoucherType.BankStatement;
  
  const rawDate = getValue('date');
  const rawTimeColumnValue = getValue('time');
  
  let finalDate = rawDate;
  let finalTime = '';

  // Logic to separate date and time
  const dateStr = String(rawDate || '').trim();
  const timeColStr = String(rawTimeColumnValue || '').trim();

  // Helper to format time to 12-hour AM/PM
  const formatTo12Hour = (timeStr: string): string => {
    if (!timeStr || timeStr.trim() === '') return '';
    
    // Check if it's already in AM/PM format
    if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
      return timeStr.trim();
    }

    // Try to parse HH:mm or HH:mm:ss
    const match = timeStr.match(/(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?/);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    }
    return timeStr.trim();
  };

  // 1. Initial assignment from columns
  finalDate = dateStr;
  finalTime = formatTo12Hour(timeColStr);

  // 2. Check if date column actually contains both date and time
  if (dateStr.includes(' ')) {
    const parts = dateStr.split(/\s+/);
    const potentialDate = parts[0];
    const potentialTime = formatTo12Hour(parts.slice(1).join(' '));

    if (!finalTime) {
      finalDate = potentialDate;
      finalTime = potentialTime;
    } else {
      finalDate = potentialDate;
    }
  }

  // 3. Final cleanup
  if (finalTime.toLowerCase() === 'null' || finalTime.toLowerCase() === 'undefined') {
    finalTime = '';
  }

  const voucher: ParsedVoucher = {
    id: `v-${Date.now()}-${index}`,
    type: voucherType,
    date: getFieldInfo('date', finalDate),
    time: { 
      value: finalTime, 
      confidence: finalTime ? Confidence.High : Confidence.Low,
      suggestion: finalTime ? 'Auto-formatted to 12h' : 'No time found'
    },
    amount: getFieldInfo('amount', Math.abs(parseNumericValue(getValue('amount') || getValue('depositAmount') || getValue('withdrawalAmount')) || 0)),
    items: [],
    origin: isBankStatement ? 'bank' : 'direct',
  };

  // Generate AI Summary for real parsing
  const discrepancies: string[] = [];
  if (voucher.amount?.confidence === Confidence.Low) discrepancies.push('Transaction amount could not be confidently identified.');
  if (voucher.date?.confidence === Confidence.Low) discrepancies.push('Date extraction has low confidence; check for format compatibility.');
  
  voucher.aiSummary = {
    summary: `Structured ${voucherType} voucher extracted from ${isBankStatement ? 'bank statement' : 'Excel spreadsheet'}. ${voucher.amount.value ? `Amount ₹${Number(voucher.amount.value).toLocaleString()}` : 'Amount pending review'}.`,
    discrepancies
  };

  // Set initial bank details if global sourceBank is set
  if (sourceBank && (voucherType === VoucherType.BankStatement || voucherType === VoucherType.Payment || voucherType === VoucherType.Receipt || voucherType === VoucherType.Contra)) {
    voucher.bankDetails = getFieldInfo('bankDetails', sourceBank);
  }

  if (!isBankStatement) {
    if (voucherType === VoucherType.Payment || voucherType === VoucherType.Receipt || voucherType === VoucherType.Contra || voucherType === VoucherType.Journal) {
      voucher.narration = getFieldInfo('narration', getValue('narration'));
      voucher.referenceNo = getFieldInfo('referenceNo', getValue('referenceNo'));
      
      const bDetails = getValue('bankDetails');
      if (bDetails) voucher.bankDetails = getFieldInfo('bankDetails', bDetails);
      
      const mappedMode = getValue('paymentMode') || getValue('paymentType');
      if (mappedMode) {
        voucher.paymentMode = getFieldInfo('paymentMode', mappedMode);
      }
      
      if (voucherType === VoucherType.Journal) {
        voucher.debitLedger = getFieldInfo('debitLedger', getValue('debitLedger'));
        voucher.creditLedger = getFieldInfo('creditLedger', getValue('creditLedger'));
      }
    } else if (voucherType === VoucherType.Purchase || voucherType === VoucherType.Sales) {
      voucher.invoiceNumber = getFieldInfo('invoiceNumber', getValue('invoiceNumber'));
      voucher.narration = getFieldInfo('narration', getValue('narration'));
    }
  }

  if (isBankStatement) {
    voucher.narration = getFieldInfo('narration', getValue('narration'));
    voucher.withdrawalAmount = getFieldInfo('withdrawalAmount', Math.abs(parseNumericValue(getValue('withdrawalAmount'))));
    voucher.depositAmount = getFieldInfo('depositAmount', Math.abs(parseNumericValue(getValue('depositAmount'))));
    voucher.closingBalance = getFieldInfo('closingBalance', parseNumericValue(getValue('closingBalance')));
    voucher.referenceNo = getFieldInfo('referenceNo', getValue('referenceNo'));
    
    // Attempt extracting explicitly mapped or column-based metadata fields
    const mappedGstin = getValue('gstin');
    if (mappedGstin) {
      voucher.gstin = getFieldInfo('gstin', mappedGstin);
    }
    const mappedMobile = getValue('mobileNumber');
    if (mappedMobile) {
      voucher.mobileNumber = getFieldInfo('mobileNumber', mappedMobile);
    }
    
    // Automatically identify payment mode or use mapped value
    const mappedMode = getValue('paymentMode');
    if (mappedMode) {
      voucher.paymentMode = getFieldInfo('paymentMode', mappedMode);
    }
    
    // Automatic Voucher Type Selection
    const w = parseNumericValue(voucher.withdrawalAmount.value);
    const d = parseNumericValue(voucher.depositAmount.value);
    const descStr = String(voucher.narration?.value || '').toUpperCase();
    const descLower = descStr.toLowerCase();
    
    // 0. Extract Entities
    const extGstinMatch = descStr.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/i);
    const extAccMatch = descStr.match(/\b\d{9,18}\b/);
    if (extGstinMatch) {
        // Just extract for narration hints if needed, but don't set partyName
    }

    // 1. Identify Bank Charges, Contra/Cash/Self
    const narration = String(voucher.narration?.value || '');
    const upperNarration = narration.toUpperCase();
    
    const isBankCharge = upperNarration.match(/\b(CHG|CHRG|FEE|FEES|COMMISSION|CHARGES)\b/i) || upperNarration.includes('BANK CHARGES');
    const isCashInvolved = upperNarration.match(/\b(CASH DEPOSIT|CASH WITHDRAWAL|ATM)\b/i);
    const isSelfTransfer = upperNarration.match(/\b(SELF TRANSFER|INTERNAL TRANSFER|SWEEP|SELF|OWN A\/C)\b/i);
    
    if (isBankCharge) {
      voucher.type = VoucherType.Payment;
    } else if (isCashInvolved || isSelfTransfer) {
      voucher.type = VoucherType.Contra;
      // For Contra in bank statements, one side is always the source bank
      if (sourceBank) {
        if (d > 0) {
          // Deposit: Bank is "to", Cash/Self is "from"
          voucher.toAccount = { value: sourceBank, confidence: Confidence.High };
          voucher.fromAccount = { value: isCashInvolved ? 'Cash A/c' : 'Self Account', confidence: Confidence.Medium };
        } else if (w > 0) {
          // Withdrawal: Bank is "from", Cash/Self is "to"
          voucher.fromAccount = { value: sourceBank, confidence: Confidence.High };
          voucher.toAccount = { value: isCashInvolved ? 'Cash A/c' : 'Self Account', confidence: Confidence.Medium };
        }
      }
    } else if (d > 0) {
      voucher.type = VoucherType.Receipt;
    } else if (w > 0) {
      voucher.type = VoucherType.Payment;
    }

    // 2. Apply Custom Mapping Rules from Settings
    if (settings?.customMappingRules) {
      const sortedRules = [...settings.customMappingRules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
      for (const rule of sortedRules) {
        let isMatch = false;
        if (rule.isRegex) {
          try {
            const regex = new RegExp(rule.keyword, 'i');
            isMatch = regex.test(descStr);
          } catch (e) {
            console.error("Invalid regex in custom rule:", rule.keyword);
          }
        } else {
          isMatch = descStr.includes(rule.keyword.toUpperCase());
        }

        if (isMatch) {
          if (rule.targetField === 'type' && Object.values(VoucherType).includes(rule.targetValue as VoucherType)) {
             voucher.type = rule.targetValue as VoucherType;
          }
        }
      }
    }
    
    // 3. Extract Detailed Metadata (Mobile, A/C, UTR, GSTIN)
    // Aggressive cleaning for Party Name extraction
    const cleanForParty = (text: string) => {
      if (!text) return '';
      
      const extractionOptions = {
        bankShortCodes: settings?.bankShortCodes ? settings.bankShortCodes.split(',').map(s => s.trim().toUpperCase()) : undefined,
        bankIgnoreWords: settings?.bankIgnoreWords ? settings.bankIgnoreWords.split(',').map(s => s.trim().toUpperCase()) : undefined,
        paymentModes: settings?.paymentModes ? settings.paymentModes.split(',').map(s => s.trim().toUpperCase()) : undefined,
        paymentChannels: settings?.paymentChannels ? settings.paymentChannels.split(',').map(s => s.trim().toUpperCase()) : undefined,
        ifscPrefixes: settings?.ifscPrefixes ? settings.ifscPrefixes.split(',').map(s => s.trim().toUpperCase()) : undefined,
      };

      return extractValidName(text, extractionOptions) || '';
    };

    const suggestedParty = cleanForParty(narration);
    if (suggestedParty) {
      voucher.partyName = { 
        value: suggestedParty, 
        confidence: Confidence.Medium, 
        suggestion: 'Cleaned name from narration' 
      };
    }

    // 4. Fix Amount Redundancy
    const finalAmount = w || d;
    if (finalAmount > 0) {
      voucher.amount.value = finalAmount;
      voucher.amount.confidence = Confidence.High;
      voucher.amount.isMismatch = false;
    }

    return voucher;
  }

  return voucher;
};

const createMockVoucher = (
  index: number, 
  voucherType: VoucherType, 
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string
): ParsedVoucher => {
  const isPurchase = voucherType === VoucherType.Purchase;
  
  // Custom logic to reflect if a mapping was used for a field
  const getFieldInfo = (key: string, defaultValue: string | number) => {
    const wasMapped = !!mapping?.[key];
    
    // Simulate OCR sensitivity affecting confidence
    const sensitivityBonus = (settings?.ocrSensitivity || 75) / 100;
    const baseConfidence = wasMapped ? 0.9 : 0.6;
    
    // Simulate influence of custom instructions
    let instructionBonus = 0;
    if (settings?.customInstructions) {
        const instr = settings.customInstructions.toLowerCase();
        if ((key === 'date' && instr.includes('date')) || 
            (key === 'partyName' && instr.includes('party')) ||
            (key === 'amount' && instr.includes('amount'))) {
            instructionBonus = 0.1;
        }
    }

    const finalScore = baseConfidence * sensitivityBonus + instructionBonus + (Math.random() * 0.2);

    let confidence = Confidence.Medium;
    if (finalScore > 0.8) confidence = Confidence.High;
    else if (finalScore < 0.4) confidence = Confidence.Low;

    return {
      value: defaultValue,
      confidence,
      suggestion: wasMapped ? 'Extracted using user-provided column mapping' : undefined
    };
  };

  const isSales = voucherType === VoucherType.Sales;
  const isPayment = voucherType === VoucherType.Payment;
  const isReceipt = voucherType === VoucherType.Receipt;
  const isJournal = voucherType === VoucherType.Journal;
  const isContra = voucherType === VoucherType.Contra;
  const isBankStatement = voucherType === VoucherType.BankStatement;
  
  const baseVoucher = {
    id: `voucher-${index + 1}-${Date.now()}`,
    type: voucherType,
    date: getFieldInfo('date', new Date().toISOString().split('T')[0]),
    time: getFieldInfo('time', new Date().toLocaleTimeString('en-IN', { hour12: false })),
    amount: getFieldInfo('amount', isBankStatement ? (Math.floor(Math.random() * 9000) + 1000) : 1180),
    items: [],
    bankDetails: sourceBank ? getFieldInfo('bankDetails', sourceBank) : undefined
  };

  // Generate AI Summary for mock/AI simulation
  const discrepancies: string[] = [];
  if (isPurchase || isSales) discrepancies.push('Tax mismatch detected: Calculated GST (18%) differs from document value.');
  if (settings?.ocrSensitivity && settings.ocrSensitivity < 50) discrepancies.push('Low OCR sensitivity may have resulted in partial character skipping.');
  
  (baseVoucher as any).aiSummary = {
    summary: `AI simulation for ${voucherType}. Processed using ${settings?.aiModel || 'Gemini 1.5 Flash'}. Key details include ${isPurchase || isSales ? 'inventory line items' : 'ledger distribution'} and tax validation.`,
    discrepancies
  };

  // Build specific fields depending on type
  if (isPurchase || isSales) {
    return {
      ...baseVoucher,
      invoiceNumber: getFieldInfo('invoiceNumber', `INV-${Math.floor(Math.random() * 10000)}`),
      tax: {
        value: 180,
        confidence: Confidence.Low,
        isMismatch: true,
        suggestion: '18% GST on 1000 should be 180. Document shows 170.',
      },
      items: [
        {
          name: { value: 'Product A', confidence: Confidence.High },
          quantity: { value: 2, confidence: Confidence.High },
          rate: { value: 500, confidence: Confidence.Medium },
          taxRate: { value: 18, confidence: Confidence.High },
          taxType: { value: Math.random() > 0.3 ? 'CGST/SGST' : 'IGST', confidence: Confidence.High },
          tax: { value: 180, confidence: Confidence.Medium },
          total: { value: 1180, confidence: Confidence.High },
        },
      ],
    };
  }

  if (isPayment || isReceipt) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `REF-${Math.floor(Math.random() * 10000)}`),
      bankDetails: getFieldInfo('bankDetails', 'HDFC Bank - 00123456789'),
      narration: getFieldInfo('narration', `Being payment ${isPayment ? 'made' : 'received'}`),
    };
  }

  if (isJournal) {
    return {
      ...baseVoucher,
      debitLedger: getFieldInfo('debitLedger', 'Rent Expense A/c'),
      creditLedger: getFieldInfo('creditLedger', 'Prepaid Rent A/c'),
      narration: getFieldInfo('narration', 'Rent taxable adjustment entry'),
    };
  }

  if (isContra) {
    return {
      ...baseVoucher,
      fromAccount: getFieldInfo('fromAccount', 'Cash A/c'),
      toAccount: getFieldInfo('toAccount', 'HDFC Bank A/c'),
      referenceNo: getFieldInfo('referenceNo', `DEP-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Cash deposit into bank'),
    };
  }

  if (isBankStatement) {
    const isWithdrawal = Math.random() > 0.5;
    const desc = isWithdrawal ? 'Rent Payment' : 'Google Cloud Services';
    const withdrawal = isWithdrawal ? Math.floor(Math.random() * 50000) : 0;
    const deposit = isWithdrawal ? 0 : Math.floor(Math.random() * 50000);
    
    // Refined auto-identify type per user rules
    const lowerDesc = desc.toLowerCase();
    const isCashInvolved = lowerDesc.includes('cash') || 
                           lowerDesc.includes('atm') || 
                           lowerDesc.includes('self');
    
    const suggestedType = isCashInvolved 
                          ? VoucherType.Contra 
                          : (deposit > 0 ? VoucherType.Receipt : VoucherType.Payment);

    return {
      ...baseVoucher,
      type: suggestedType,
      narration: getFieldInfo('narration', desc),
      withdrawalAmount: getFieldInfo('withdrawalAmount', withdrawal),
      depositAmount: getFieldInfo('depositAmount', deposit),
      closingBalance: getFieldInfo('closingBalance', Math.floor(Math.random() * 500000)),
      referenceNo: getFieldInfo('referenceNo', `TRN-${Math.floor(Math.random() * 10000)}`),
      items: []
    };
  }

  return baseVoucher;
};
