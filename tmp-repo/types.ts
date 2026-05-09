
export enum Confidence {
  High = '98%',
  Medium = '75%',
  Low = '45%',
}

export interface VoucherField {
  value: string | number;
  confidence: Confidence;
  suggestion?: string;
  isMismatch?: boolean;
}

export interface AuditLog {
  id: string;
  action: 'Created' | 'Modified' | 'Duplicated' | 'Deleted' | 'Exported' | 'AI Auto-Mapped' | 'Confirmed AI Map' | 'Manual Map';
  timestamp: string;
  user?: string;
  author?: string;
  details?: string;
  changes?: { field: string; oldValue: any; newValue: any }[];
}

export interface ParsedVoucher {
  id: string;
  type?: VoucherType;
  partyName?: VoucherField; // Optional, as some types don't need it
  date: VoucherField;
  time?: VoucherField;
  amount: VoucherField;
  tax?: VoucherField;
  ledger?: VoucherField;
  bankDetails?: VoucherField;
  referenceNo?: VoucherField;
  invoiceNumber?: VoucherField;
  paymentMode?: VoucherField;
  debitLedger?: VoucherField;
  creditLedger?: VoucherField;
  narration?: VoucherField;
  fromAccount?: VoucherField;
  toAccount?: VoucherField;
  withdrawalAmount?: VoucherField;
  depositAmount?: VoucherField;
  closingBalance?: VoucherField;
  items: {
    name: VoucherField;
    quantity: VoucherField;
    rate: VoucherField;
    uom?: VoucherField;
    hsn?: VoucherField;
    taxRate: VoucherField;
    taxType?: VoucherField;
    tax: VoucherField;
    cgst?: VoucherField;
    sgst?: VoucherField;
    igst?: VoucherField;
    total: VoucherField;
  }[];
  auditLogs?: AuditLog[];
  origin?: 'bank' | 'direct';
  tempImportId?: string;
  gstin?: VoucherField;
  mobileNumber?: VoucherField;
  aiSummary?: {
    summary: string;
    discrepancies: string[];
    keyExtraction?: {
      gst?: string;
      period?: string;
      urgency?: string;
      [key: string]: string | undefined;
    };
  };
}

export enum VoucherType {
  Sales = 'Sales',
  Purchase = 'Purchase',
  Payment = 'Payment',
  Receipt = 'Receipt',
  Journal = 'Journal',
  Contra = 'Contra',
  BankStatement = 'Bank Statement',
  CreditNote = 'Credit Note',
  DebitNote = 'Debit Note'
}

export type AppStep = 'upload' | 'correction' | 'summary' | 'success';

export interface CustomMappingRule {
  id: string;
  keyword: string;
  targetField: 'partyName' | 'ledger' | 'type';
  targetValue: string;
  isRegex?: boolean;
  priority?: number;
}

export interface ParsingSettings {
  ocrSensitivity: number; // 0 to 100
  aiModel: 'Gemini 1.5 Flash' | 'Gemini 1.5 Pro' | 'Vision Transformer-L';
  experimentalFeatures: boolean;
  customInstructions: string;
  customAiInstructions?: string;
  customMappingRules?: CustomMappingRule[];
  fiscalYearFormat?: 'Apr-Mar' | 'Jan-Dec';
  // Noise Lists
  bankShortCodes?: string;
  bankIgnoreWords?: string;
  paymentModes?: string;
  paymentChannels?: string;
  ifscPrefixes?: string;
}

export type MainView = 'dashboard' | 'ledger-master' | 'item-master' | 'vouchers' | 'bank' | 'import' | 'reports' | 'gst-report' | 'settings' | 'item-report' | 'bulk-operation' | 'voucher-entry' | 'inventory-entry';

export interface PartyMaster {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor' | 'Both';
  gstin?: string;
  panNo?: string;
  contactPerson?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  openingBalance?: number;
  creditDays?: number;
  bankName?: string;
  bankAccountNo?: string;
  ifscCode?: string;
}

export interface LedgerMaster {
  id: string;
  name: string;
  group: string;
  description?: string;
  taxRate?: number;
  openingBalance?: number;
  balanceType?: 'Debit' | 'Credit';
  isInventoryAffected?: boolean;
  bankDetails?: {
    accountNo?: string;
    ifsc?: string;
    bankName?: string;
    branchName?: string;
  };
}

export interface ItemMaster {
  id: string;
  name: string;
  hsnCode?: string;
  taxRate: number; // Percentage
  uom: string;
  category?: string;
  brand?: string;
  grade?: string; // Quality/Grade level
  assertionCode?: string;
  assertionCategory?: string;
  purchaseRate?: number;
  salesRate?: number;
  sku?: string;
  minStock?: number;
  description?: string;
}

export interface GradeMaster {
  id: string;
  name: string;
  description?: string;
  qualityScore?: number; // 1-10
}

export interface AssertionCategoryMaster {
  id: string;
  name: string;
  description?: string;
}

export interface AssertionCodeMaster {
  id: string;
  code: string;
  name: string;
  categoryId: string; // Linked Assertion Category
  description?: string;
}

export interface UomMaster {
  id: string;
  name: string;
  symbol: string;
}

export interface GstMaster {
  id: string;
  code: string; // GSTN / HSN Code
  rate: number;
  type: 'Goods' | 'Services';
  effectiveFrom?: string;
  reverseCharge?: boolean;
  cessRate?: number;
  description?: string;
}

export interface BrandMaster {
  id: string;
  name: string;
  origin?: string;
  manufacturer?: string;
  website?: string;
  tier?: 'Premium' | 'Economy' | 'Budget';
}

export interface CategoryMaster {
  id: string;
  name: string;
  description?: string;
  parentCategory?: string;
  hsnCode?: string; // Default HSN for category
  status?: 'Active' | 'Inactive';
}

export interface ContactMaster {
  id: string;
  name: string;
  contactType?: 'Internal' | 'External' | 'Contract';
  role?: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  linkedParty?: string;
  notes?: string;
}

export interface WarehouseMaster {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  contactPerson?: string;
  isActive: boolean;
}

export interface StockGroupMaster {
  id: string;
  name: string;
  parentGroup?: string;
  description?: string;
}

export interface CostCenterMaster {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface AccountGroupMaster {
  id: string;
  name: string;
  parentGroup?: string;
  nature: 'Assets' | 'Liabilities' | 'Expenses' | 'Income';
}

export interface ColorMaster {
  id: string;
  name: string;
  hex: string;
}

export interface SizeMaster {
  id: string;
  name: string;
  code: string;
}

export interface DimensionMaster {
  id: string;
  name: string;
  l: number;
  w: number;
  h: number;
  unit: string;
}
