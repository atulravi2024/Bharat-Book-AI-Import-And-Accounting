
import { VoucherType, Confidence } from '../../types';

export const PAYMENT_MODE_PATTERNS = [];

export const REFERENCE_NO_PATTERNS = [
  /(?:UPI|IMPS|NEFT|RTGS|Ref|REF|Txn|CHQ|No|UTR)(?:[^\w]*?)(\b[a-zA-Z0-9]{6,16}\b)/i,
];

export interface KeywordRule {
  keywords: string[];
  type: VoucherType;
  ledger?: string;
  confidence: Confidence;
}

export const BANK_KEYWORD_RULES: KeywordRule[] = [
  { 
    keywords: ['CHG', 'CHRG', 'FEE', 'FEES', 'COMMISSION', 'CHARGES', 'BANK CHARGES', 'SERVICE CHG', 'BANK TRANSACTION CHARGE'], 
    type: VoucherType.Payment, 
    ledger: 'Bank Charges A/c',
    confidence: Confidence.High
  },
  {
    keywords: ['SMS CHARGE', 'SMS CHG', 'SMS FEE'],
    type: VoucherType.Payment,
    ledger: 'Bank Charges (SMS) A/c',
    confidence: Confidence.High
  },
  {
    keywords: ['ELECTRIC CHARGE', 'ELECTRICITY', 'POWER', 'LIGHT CHARGE'],
    type: VoucherType.Payment,
    ledger: 'Electricity Expenses',
    confidence: Confidence.High
  },
  { 
    keywords: ['CASH DEPOSIT', 'CASH WITHDRAWAL', 'ATM', 'CASH DEP', 'CASH WDL', 'CASH CHARGE'], 
    type: VoucherType.Contra, 
    ledger: 'Cash A/c',
    confidence: Confidence.High
  },
  {
    keywords: ['MACHINERY', 'EQUIPMENT', 'FIXED ASSET', 'COMPUTER', 'FURNITURE'],
    type: VoucherType.Payment,
    ledger: 'Investment/Fixed Assets',
    confidence: Confidence.High
  },
  { 
    keywords: ['SELF TRANSFER', 'INTERNAL TRANSFER', 'SWEEP', 'SELF', 'OWN A/C', 'OWN AC'], 
    type: VoucherType.Contra, 
    ledger: 'Internal Bank A/c',
    confidence: Confidence.High
  },
];

export const EXTRACTION_PATTERNS = [
    { name: 'UPI', regex: /UPI\/(?:P2A|P2M|DR|CR)\/\d+\/([A-Z\s0-9]{4,40})\//i }, 
    { name: 'IMPS', regex: /IMPS[/\-][A-Z0-9]+[/\-]([A-Z\s0-9]{4,40})(?:[/\-]|$)/i },
    { name: 'NEFT', regex: /NEFT[/\-][A-Z0-9]+[/\-]([A-Z\s0-9]{4,40})(?:[/\-]|$)/i },
];

export const EXCLUDED_WORDS = [
    'TRANSFER', 'PAYMENT', 'ONLINE', 'BANK', 'FROM', 'TOWARDS', 'DEBIT', 'CREDIT', 'SENT', 'RECEIVED',
    'HDFC', 'ICICI', 'SBIN', 'KOTAK', 'AXIS', 'YESB', 'UTIB', 'BARB', 'PUNB', 'INDB', 'IDBI', 'CANB', 'MAHB', 'UBIN', 'CNRB', 'IOBA',
    'ACCOUNT', 'ACC', 'NUMBER', 'NO', 'UTR', 'REF', 'ID', 'TXN', 'INTERNAL', 'SWEEP', 'REVERSAL',
    'NET', 'BANKING', 'MOBILE', 'APP', 'CMS', 'COLLECTION', 'BULK', 'NEFT', 'IMPS', 'RTGS', 'UPI',
    'THROUGH', 'VIA', 'BY', 'FOR', 'TO', 'THE', 'AND', 'WITH', 'BRANCH', 'STATRT', 'STATEMENT',
    'SAVINGS', 'CURRENT', 'CORP', 'LIMITED', 'PVT', 'LTD', 'CORPORATION', 'SERVICES', 'SOLUTIONS',
    'S/B', 'SB', 'A/C', 'AC', 'TRF', 'FT', 'INTERNAL', 'FEE', 'FEES', 'TAX', 'TAXES', 'GST', 'BANKING',
    'CITI', 'HSBC', 'STANDARD', 'CHARTERED', 'DEUTSCHE', 'FEDERAL', 'INDUSIND', 'IDFC', 'BANDHAN', 'PUNJAB', 'NATIONAL', 'CENTRAL', 'UNION', 'SYNDICATE', 'ALLAHABAD', 'ORIENTAL', 'ANDHRA', 'VIJAYA', 'DENA', 'SYNDICATE', 'OBC', 'UCO', 'SBI',
    'YES', 'YESBANK', 'BOB', 'CANARA', 'PAYTM', 'GPAY', 'PHONEPE', 'AIRTELPAY', 'MOBIKWIK', 'JIOPAY', 'BHIM'
];

export const NOISE_PREFIXES = [
    'UBIAV', 'AWC', 'MP', 'SP', 'BK', 'CB', 'ID', 'VI', 'TR', 'MB', 'MS', 'MR', 'MRS', 'MISS', 'DR', 'M/S',
    'INF', 'IBL', 'IC', 'IT', 'IM', 'ACCOUNT', 'ACC', 'NUMBER', 'NO', 'SAVINGS', 'SB', 'S/B', 'CURRENT',
    'A/C', 'AC', 'TRANSFER', 'TRF', 'UBIN', 'UTIB', 'BKDN', 'AB', 'P2A', 'P2M', 'DR', 'CR', 'SETTLEMENT',
    'UPI', 'IMPS', 'NEFT', 'RTGS', 'PAYMENT', 'ONLINE', 'PYMT', 'TXNID', 'UPIAR', 'UPIPR', 'RRN', 'TPAP'
];
