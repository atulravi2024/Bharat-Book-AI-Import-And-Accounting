
import * as XLSX from 'xlsx';
import { Confidence, ParsedVoucher, VoucherType, ParsingSettings } from '../app/types';
import { extractValidName } from './NameExtractor';
import { parseExcelFile } from './import-engine/phase1-parsers/excelParser';
import { parseCsvFile } from './import-engine/phase1-parsers/csvParser';
import { parsePdfFile } from './import-engine/phase1-parsers/pdfParser';
import { parseImageFile } from './import-engine/phase1-parsers/imageParser';
import { parseJsonFile } from './import-engine/phase1-parsers/jsonParser';
import { parseXmlFile } from './import-engine/phase1-parsers/xmlParser';

import { runImportPipeline } from './import-engine';

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
export const getModelDisplayName = (modelId?: string): string => {
  if (!modelId) return 'Gemini 1.5 Flash';
  const mapping: Record<string, string> = {
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-3.5-flash': 'Gemini 3.5 Flash',
    'gemini-3.1-pro-preview': 'Gemini 3.1 Pro Preview',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-2.0-flash-thinking-exp': 'Gemini 2.0 Flash Thinking',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'gemini-1.5-flash-8b': 'Gemini 1.5 Flash-8B',
    'vllm': 'vLLM (Private Host)',
    'Gemini 1.5 Flash': 'Gemini 1.5 Flash',
    'Gemini 1.5 Pro': 'Gemini 1.5 Pro',
    'Vision Transformer-L': 'Vision Transformer-L'
  };
  return mapping[modelId] || modelId;
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

  // Route processing dynamically based on exact file extension
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.xlsm')) {
    try {
      return await parseExcelFile(
        file,
        voucherType,
        createVoucherFromRow,
        mapping,
        settings,
        sourceBank,
        partyMasters,
        ledgerMasters
      );
    } catch (error) {
      console.error("Error in Excel Parser pipeline:", error);
      throw error;
    }
  }

  if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    try {
      return await parseCsvFile(
        file,
        voucherType,
        createVoucherFromRow,
        mapping,
        settings,
        sourceBank,
        partyMasters,
        ledgerMasters
      );
    } catch (error) {
      console.error("Error in CSV Parser pipeline:", error);
      throw error;
    }
  }

  if (fileName.endsWith('.pdf')) {
    try {
      return await parsePdfFile(
        file,
        voucherType,
        createMockVoucher,
        mapping,
        settings,
        sourceBank
      );
    } catch (error) {
      console.error("Error in PDF Parser pipeline:", error);
      throw error;
    }
  }

  if (
    fileName.endsWith('.png') || 
    fileName.endsWith('.jpg') || 
    fileName.endsWith('.jpeg') || 
    fileName.endsWith('.webp') ||
    fileName.endsWith('.tiff') ||
    fileName.endsWith('.bmp') ||
    fileName.endsWith('.img')
  ) {
    try {
      return await parseImageFile(
        file,
        voucherType,
        createMockVoucher,
        mapping,
        settings,
        sourceBank
      );
    } catch (error) {
      console.error("Error in Image Parser pipeline:", error);
      throw error;
    }
  }

  if (fileName.endsWith('.json')) {
    try {
      return await parseJsonFile(
        file,
        voucherType,
        createVoucherFromRow,
        mapping,
        settings,
        sourceBank,
        partyMasters,
        ledgerMasters
      );
    } catch (error) {
      console.error("Error in JSON Parser pipeline:", error);
      throw error;
    }
  }

  if (fileName.endsWith('.xml')) {
    try {
      return await parseXmlFile(
        file,
        voucherType,
        createVoucherFromRow,
        mapping,
        settings,
        sourceBank,
        partyMasters,
        ledgerMasters
      );
    } catch (error) {
      console.error("Error in XML Parser pipeline:", error);
      throw error;
    }
  }

  // Fallback / Default Mock Logic for non-excel or unsupported file versions
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate different outcomes based on voucher type for variety
      const numberOfVouchers = Math.floor(Math.random() * 3) + 1;
      const vouchers: ParsedVoucher[] = Array.from({ length: numberOfVouchers }, (_, i) => 
        createMockVoucher(i, voucherType, mapping, settings, sourceBank)
      );
      resolve(vouchers);
    }, (settings?.aiModel === 'Gemini 1.5 Pro' || settings?.aiModel === 'gemini-1.5-pro' || settings?.aiModel === 'gemini-2.0-flash-thinking-exp') ? 4000 : 2000);
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


function createVoucherFromRow(
  row: any,
  index: number,
  voucherType: VoucherType,
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string,
  partyMasters: any[] = [],
  ledgerMasters: any[] = []
): ParsedVoucher {
  const isMasterImport = settings?.selectedOtherCategory && [
    'ledgers', 'banks', 'contacts', 'contacts_staff', 'contacts_customers', 'contacts_vendors', 'contacts_partners', 'accountGroups', 'locations', 'costCenters',
    'items', 'basic_items', 'bom', 'uom', 'uoms', 'stockGroups', 'categories', 'stockCategories', 'godowns', 'warehouses',
    'brands', 'variants', 'sizes', 'colors', 'gst', 'skus', 'grades', 'priceLists',
    'employees_payroll', 'fixed_assets', 'currency_rates', 'projects_wbs', 'barcodes_units', 'discount_rules', 'custom_dirs', 'custom'
  ].includes(settings.selectedOtherCategory);

  const isBankStatement = voucherType === VoucherType.BankStatement;
  const dataType = isMasterImport ? 'master' : (isBankStatement ? 'bank_transaction' : 'voucher');
  const specificType = isMasterImport ? settings.selectedOtherCategory : (isBankStatement ? sourceBank : voucherType);

  // Run Phase 2 (Mapping), Phase 3 (Cleaning), Phase 4 (Enhancement)
  const pipelineResult = runImportPipeline(row, dataType, specificType, mapping);

  // Helper to map keys based on user-provided mapping or common patterns
  const getValue = (field: string) => {
    // 1. Pipeline has highest priority
    if (pipelineResult[field] !== undefined && pipelineResult[field] !== null && pipelineResult[field] !== '') {
      return pipelineResult[field];
    }
    
    // Pipeline uses 'description' for bank narration and 'particulars' for vouchers, unify it
    if (field === 'narration' && pipelineResult.description) return pipelineResult.description;
    if (field === 'narration' && pipelineResult.particulars) return pipelineResult.particulars;
    if (field === 'partyName' && pipelineResult.particulars) return pipelineResult.particulars;
    if (field === 'invoiceNumber' && pipelineResult.voucherNumber) return pipelineResult.voucherNumber;
    if (field === 'amount' && pipelineResult.amount !== undefined) return pipelineResult.amount;
    if (field === 'withdrawalAmount' && pipelineResult.withdrawal !== undefined) return pipelineResult.withdrawal;
    if (field === 'depositAmount' && pipelineResult.deposit !== undefined) return pipelineResult.deposit;
    if (field === 'closingBalance' && pipelineResult.balance !== undefined) return pipelineResult.balance;
    if (field === 'referenceNo' && pipelineResult.reference) return pipelineResult.reference;

    // 2. Original legacy mapping logic 
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

  if (isMasterImport) {
    voucher.partyName = getFieldInfo('partyName', pipelineResult.name || getValue('name') || getValue('ledgerName') || getValue('ContactName') || getValue('ItemName') || '');
    voucher.referenceNo = getFieldInfo('referenceNo', pipelineResult.code || getValue('code') || getValue('sku') || getValue('ContactID') || getValue('ItemID') || '');
    voucher.supplyType = getFieldInfo('supplyType', pipelineResult.group || getValue('group') || getValue('under') || getValue('parent') || getValue('category') || '');
    voucher.amount = getFieldInfo('amount', parseNumericValue(pipelineResult.openingBalance || pipelineResult.value || getValue('openingBalance') || getValue('balance') || getValue('value') || getValue('Opening Balance') || 0));
    voucher.narration = getFieldInfo('narration', getValue('description') || getValue('notes') || '');
  }

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

      if (voucherType === VoucherType.Payment || voucherType === VoucherType.Receipt) {
        const pName = getValue('partyName') || getValue('particulars');
        if (pName) voucher.partyName = getFieldInfo('partyName', pName);
        
        const led = getValue('ledger') || getValue('particulars');
        if (led) voucher.ledger = getFieldInfo('ledger', led);
      }

      if (voucherType === VoucherType.Contra) {
        voucher.fromAccount = getFieldInfo('fromAccount', getValue('fromAccount'));
        voucher.toAccount = getFieldInfo('toAccount', getValue('toAccount'));
      }
    } else if (
      voucherType === VoucherType.Purchase || 
      voucherType === VoucherType.Sales || 
      voucherType === VoucherType.CreditNote || 
      voucherType === VoucherType.DebitNote
    ) {
      voucher.invoiceNumber = getFieldInfo('invoiceNumber', getValue('invoiceNumber') || getValue('creditNoteNumber') || getValue('debitNoteNumber') || getValue('creditNoteNo') || getValue('debitNoteNo'));
      voucher.narration = getFieldInfo('narration', getValue('narration'));
      voucher.partyName = getFieldInfo('partyName', getValue('partyName') || getValue('supplierName') || getValue('customerName') || getValue('particulars'));
      voucher.ledger = getFieldInfo('ledger', getValue('ledger'));
      voucher.tax = getFieldInfo('tax', getValue('tax') || getValue('taxAmount'));
      voucher.supplyType = getFieldInfo('supplyType', getValue('supplyType'));
      voucher.placeOfSupply = getFieldInfo('placeOfSupply', getValue('placeOfSupply'));
    } else if (
      voucherType === VoucherType.StockJournal ||
      voucherType === VoucherType.PhysicalStock ||
      voucherType === VoucherType.ItemConsumption ||
      voucherType === VoucherType.ItemScrap ||
      voucherType === VoucherType.Interlocation ||
      voucherType === VoucherType.RejectionIn ||
      voucherType === VoucherType.RejectionOut
    ) {
      voucher.referenceNo = getFieldInfo('referenceNo', getValue('ReferenceNo') || getValue('referenceNo') || getValue('ScrapReference') || getValue('TransferID') || getValue('RejectionID') || getValue('rejectionId'));
      voucher.narration = getFieldInfo('narration', getValue('Narration') || getValue('narration') || getValue('Reason') || getValue('ReasonForRejection') || getValue('remarks'));
      voucher.partyName = getFieldInfo('partyName', getValue('PartyName') || getValue('partyName') || getValue('AuditorName') || getValue('TransitCarrier'));
      
      const itemName = getValue('ItemName') || getValue('itemName');
      let itemQty = parseNumericValue(getValue('QuantityIn') || getValue('QuantityOut') || getValue('ActualStockCount') || getValue('QuantityConsumed') || getValue('QuantityScrapped') || getValue('QuantityTransferred') || getValue('QuantityRejected') || getValue('quantity') || getValue('qty') || 0);
      let itemRate = parseNumericValue(getValue('Rate') || getValue('rate') || getValue('UnitCost') || getValue('unitCost') || getValue('ScrapValueCollected') || getValue('scrapValueCollected') || 0);
      
      if (itemName || itemQty !== 0) {
        voucher.items = [
          {
            name: { value: itemName || 'Default Item', confidence: Confidence.High },
            quantity: { value: itemQty, confidence: Confidence.High },
            rate: { value: itemRate, confidence: Confidence.High },
            uom: { value: getValue('UOM') || getValue('uom') || 'PCS', confidence: Confidence.Medium },
            taxRate: { value: parseNumericValue(getValue('taxRate') || getValue('tax_rate') || 0), confidence: Confidence.High },
            tax: { value: 0, confidence: Confidence.High },
            total: { value: itemQty * itemRate, confidence: Confidence.High }
          }
        ];
        voucher.amount.value = itemQty * itemRate;
        voucher.amount.confidence = Confidence.High;
      }
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

function createMockVoucher(
  index: number, 
  voucherType: VoucherType, 
  mapping?: Record<string, string>,
  settings?: ParsingSettings,
  sourceBank?: string
): ParsedVoucher {
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
    summary: `AI simulation for ${voucherType}. Processed using ${getModelDisplayName(settings?.aiModel)}. Key details include ${isPurchase || isSales ? 'inventory line items' : 'ledger distribution'} and tax validation.`,
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

  if (voucherType === VoucherType.CreditNote) {
    return {
      ...baseVoucher,
      invoiceNumber: getFieldInfo('invoiceNumber', `CN-${Math.floor(Math.random() * 10000)}`),
      partyName: getFieldInfo('partyName', 'Suresh Automation Pvt Ltd'),
      ledger: getFieldInfo('ledger', 'Sales Return A/c'),
      narration: getFieldInfo('narration', 'Goods returned by customer due to model mismatch'),
      tax: {
        value: 450,
        confidence: Confidence.High,
        isMismatch: false,
        suggestion: 'Standard 18% CGST/SGST return computed.'
      },
      supplyType: getFieldInfo('supplyType', 'Intrastate B2B'),
      placeOfSupply: getFieldInfo('placeOfSupply', 'Delhi (07)'),
      items: [
        {
          name: { value: 'Product B', confidence: Confidence.High },
          quantity: { value: 5, confidence: Confidence.High },
          rate: { value: 500, confidence: Confidence.Medium },
          taxRate: { value: 18, confidence: Confidence.High },
          taxType: { value: 'CGST/SGST', confidence: Confidence.High },
          tax: { value: 450, confidence: Confidence.Medium },
          total: { value: 2950, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.DebitNote) {
    return {
      ...baseVoucher,
      invoiceNumber: getFieldInfo('invoiceNumber', `DN-${Math.floor(Math.random() * 10000)}`),
      partyName: getFieldInfo('partyName', 'Bharat Book Agency'),
      ledger: getFieldInfo('ledger', 'Purchase Return A/c'),
      narration: getFieldInfo('narration', 'Purchase return to supplier for damaged binding/covers'),
      tax: {
        value: 210,
        confidence: Confidence.High,
        isMismatch: false,
        suggestion: 'Standard 5% IGST return computed.'
      },
      supplyType: getFieldInfo('supplyType', 'Interstate B2B'),
      placeOfSupply: getFieldInfo('placeOfSupply', 'Maharashtra (27)'),
      items: [
        {
          name: { value: 'Premium Accounting Books', confidence: Confidence.High },
          quantity: { value: 10, confidence: Confidence.High },
          rate: { value: 420, confidence: Confidence.Medium },
          taxRate: { value: 5, confidence: Confidence.High },
          taxType: { value: 'IGST', confidence: Confidence.High },
          tax: { value: 210, confidence: Confidence.Medium },
          total: { value: 4410, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.StockJournal) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `STK-XFER-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Core factory raw material transfer to assembly lines'),
      amount: getFieldInfo('amount', 11000),
      items: [
        {
          name: { value: 'Structural Steel Sheets (Grade B)', confidence: Confidence.High },
          quantity: { value: 50, confidence: Confidence.High },
          rate: { value: 220, confidence: Confidence.High },
          uom: { value: 'PCS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 11000, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.PhysicalStock) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `AUDIT-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Bi-weekly warehousing physical count & balance validation audit'),
      amount: getFieldInfo('amount', 67500),
      items: [
        {
          name: { value: 'ABS Plastic Granules Compound', confidence: Confidence.High },
          quantity: { value: 450, confidence: Confidence.High },
          rate: { value: 150, confidence: Confidence.High },
          uom: { value: 'KGS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 67500, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.ItemConsumption) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `CONS-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Raw materials consumption logged for Project Orion construction phase'),
      amount: getFieldInfo('amount', 102000),
      items: [
        {
          name: { value: 'Aluminium Profiles Extruded T-Slot', confidence: Confidence.High },
          quantity: { value: 1200, confidence: Confidence.High },
          rate: { value: 85, confidence: Confidence.High },
          uom: { value: 'MTRS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 102000, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.ItemScrap) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `SCRP-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Defective molding line reject write-off and scrap disposal logging'),
      amount: getFieldInfo('amount', 15300),
      items: [
        {
          name: { value: 'Polyamide Granules Reclaimed', confidence: Confidence.High },
          quantity: { value: 340, confidence: Confidence.High },
          rate: { value: 45, confidence: Confidence.High },
          uom: { value: 'KGS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 15300, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.Interlocation) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `LOC-XFER-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Inter-warehouse standard relocation: Sector-4 Hub to Retail distribution store room'),
      amount: getFieldInfo('amount', 36250),
      items: [
        {
          name: { value: 'Pneumatic Actuator Cylinders 100mm', confidence: Confidence.High },
          quantity: { value: 25, confidence: Confidence.High },
          rate: { value: 1450, confidence: Confidence.High },
          uom: { value: 'PCS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 36250, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.RejectionIn) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `REJIN-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Defective specifications size return from customer - Nippon Electronics Ltd'),
      amount: getFieldInfo('amount', 21000),
      items: [
        {
          name: { value: 'High-Tensile Threaded Bolts', confidence: Confidence.High },
          quantity: { value: 1500, confidence: Confidence.High },
          rate: { value: 14, confidence: Confidence.High },
          uom: { value: 'PCS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 21000, confidence: Confidence.High }
        }
      ]
    };
  }

  if (voucherType === VoucherType.RejectionOut) {
    return {
      ...baseVoucher,
      referenceNo: getFieldInfo('referenceNo', `REJOUT-${Math.floor(Math.random() * 10000)}`),
      narration: getFieldInfo('narration', 'Supplier reject return containing bad raw material cast slabs to vendor'),
      amount: getFieldInfo('amount', 49600),
      items: [
        {
          name: { value: 'Defective Raw Steel Slab Castings', confidence: Confidence.High },
          quantity: { value: 80, confidence: Confidence.High },
          rate: { value: 620, confidence: Confidence.High },
          uom: { value: 'PCS', confidence: Confidence.Medium },
          taxRate: { value: 0, confidence: Confidence.High },
          tax: { value: 0, confidence: Confidence.High },
          total: { value: 49600, confidence: Confidence.High }
        }
      ]
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
