
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
  isSample?: boolean;
  sampleSetId?: string;
  type?: VoucherType;
  partyName?: VoucherField; // Optional, as some types don't need it
  date: VoucherField;
  time?: VoucherField;
  amount: VoucherField;
  tax?: VoucherField;
  supplyType?: VoucherField;
  placeOfSupply?: VoucherField;
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
  DebitNote = 'Debit Note',
  StockJournal = 'Stock Journal',
  PhysicalStock = 'Physical Stock',
  ItemConsumption = 'Item Consumption',
  ItemScrap = 'Item Scrap',
  Interlocation = 'Interlocation',
  RejectionIn = 'Rejection In',
  RejectionOut = 'Rejection Out',
  GSTR1 = 'GSTR-1',
  GSTR3B = 'GSTR-3B',
  GSTR2A = 'GSTR-2A',
  GSTR2B = 'GSTR-2B',
  GSTR9 = 'GSTR-9',
  GSTR9A = 'GSTR-9A',
  GSTR9B = 'GSTR-9B',
  GSTR9C = 'GSTR-9C',
  GSTR4 = 'GSTR-4',
  GSTR4A = 'GSTR-4A',
  GSTR4B = 'GSTR-4B',
  CMP08 = 'CMP-08'
}

export type AppStep = 'upload' | 'processing' | 'correction' | 'summary' | 'success';

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
  aiModel: string;
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
  selectedOtherCategory?: string;
  customCategoryName?: string;
}

export type MainView = 'dashboard' | 'ledger-master' | 'item-master' | 'vouchers' | 'bank' | 'import' | 'reports' | 'gst-report' | 'settings' | 'item-report' | 'bulk-operation' | 'voucher-entry' | 'inventory-entry' | 'help' | 'support';

export interface PartyMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
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
  code?: string;
  status?: 'Active' | 'Inactive';
  group: string;
  description?: string;
  taxRate?: number;
  openingBalance?: number;
  balanceType?: 'Debit' | 'Credit';
  isInventoryAffected?: boolean;
  bankDetails?: {
    accountNo?: string;
    ifsc?: string;
    swiftCode?: string;
    micrCode?: string;
    accountType?: string;
    upiId?: string;
    bankName?: string;
    branchName?: string;
  };
}

export interface ItemMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  itemType?: 'Inventory' | 'Service' | 'Non-Inventory' | 'Assembly';
  hsnCode?: string;
  taxRate: number; // Percentage
  uom: string;
  category?: string;
  brand?: string;
  stockGroup?: string;
  grade?: string; // Quality/Grade level
  assertionCode?: string;
  assertionCategory?: string;
  
  // Pricing
  purchaseRate?: number;
  salesRate?: number;
  mrp?: number;
  wholesaleRate?: number;
  dealerRate?: number;
  
  // Identifiers
  sku?: string;
  partNumber?: string;
  barcode?: string;
  
  // Custom tracking / Valuation
  costingMethod?: 'FIFO' | 'LIFO' | 'Average' | 'Standard';
  minStock?: number;
  maxStock?: number;
  reorderLevel?: number;
  leadTime?: number; // In Days
  
  // Flags
  batchTracking?: boolean;
  expiryTracking?: boolean;
  serialTracking?: boolean;
  
  // E-commerce & Logistics
  isECommerceItem?: boolean;
  onlineStatus?: 'Active' | 'Draft' | 'Hidden';
  productUrl?: string; // Product URL (HTTPS anchor)
  dimensions?: { length?: number; width?: number; height?: number; unit?: string };
  weight?: { value?: number; unit?: string };
  
  // Wholesale & Packaging
  packSize?: number;
  outerCartonQuantity?: number;
  
  // Utensils & Material Specific
  material?: string;
  isFoodGrade?: boolean;
  isDishwasherSafe?: boolean;
  isMicrowaveSafe?: boolean;
  isOvenSafe?: boolean;
  
  // Industry specific
  drugLicenseRequired?: boolean;
  fssaiRequired?: boolean;
  prescriptionRequired?: boolean;
  warrantyPeriod?: string;
  
  // Relation
  substituteItemId?: string;
  
  // Basic info
  description?: string;
  function?: string;
  feature?: string;
  imageUrl?: string;
}

export interface BomMaster {
  id: string;
  name: string;
  code?: string;
  description?: string;
  itemId: string; // The parent item it produces
  quantityProduced: number;
  components: {
    itemId: string;
    quantity: number;
    uom: string;
    scrapPercentage?: number;
    instructions?: string;
  }[];
  routing?: {
    step: number;
    operation: string;
    workCenter?: string;
    setupTime?: number; // In hours/mins
    runTime?: number; // Per unit
    laborCostPerHour?: number;
    overheadCostPerHour?: number;
  }[];
  revision?: string;
  status?: 'Active' | 'Inactive';
  type?: 'Engineering' | 'Manufacturing';
  validFrom?: string;
  validTo?: string;
  isDefault?: boolean;
  isActive?: boolean;
  byProducts?: {
    itemId: string;
    quantity: number;
    uom: string;
  }[];
}

export interface GradeMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  description?: string;
  qualityScore?: number; // 1-10
}

export interface AssertionCategoryMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  description?: string;
}

export interface AssertionCodeMaster {
  id: string;
  code: string;
  status?: 'Active' | 'Inactive';
  name: string;
  categoryId: string; // Linked Assertion Category
  description?: string;
}

export interface UomMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  symbol: string;
  baseUom?: string; // Links to another UOM
  conversionFactor?: number; // e.g. 1 Box = 10 Pcs (Conversion factor 10)
}

export interface GstMaster {
  id: string;
  code: string; // GSTN / HSN Code
  status?: 'Active' | 'Inactive';
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
  code?: string;
  origin?: string;
  manufacturer?: string;
  website?: string;
  logoUrl?: string; // Brand Logo
  tier?: 'Premium' | 'Economy' | 'Budget';
  status?: 'Active' | 'Inactive';
}

export interface CategoryMaster {
  id: string;
  name: string;
  code?: string;
  description?: string;
  parentCategory?: string;
  hsnCode?: string; // Default HSN for category
  taxRate?: number; // Default Tax Rate for category
  isECommerceCategory?: boolean; // Show on web store
  status?: 'Active' | 'Inactive';
}

export interface ContactMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  contactType?: 'Internal' | 'External' | 'Contract';
  role?: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  linkedParty?: string;
  notes?: string;
}

export interface LocationMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  type?: 'Main' | 'Store' | 'Distribution' | 'Transit';
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  capacity?: number;
  contactPerson?: string;
  phone?: string;
}

export interface WarehouseMaster extends LocationMaster {}

export interface StockGroupMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  parentGroup?: string;
  defaultCostingMethod?: 'FIFO' | 'LIFO' | 'Average' | 'Standard';
  defaultTaxRate?: number;
  description?: string;
}

export interface CostCenterMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  category?: string;
  description?: string;
}

export interface AccountGroupMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  parentGroup?: string;
  nature: 'Assets' | 'Liabilities' | 'Expenses' | 'Income';
}

export interface ColorMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  hex: string;
  colorFamily?: string; // e.g., 'Red', 'Blue', 'Earth Tones'
}

export interface SizeMaster {
  id: string;
  name: string;
  code: string;
  status?: 'Active' | 'Inactive';
  sizeSystem?: string; // e.g., 'US', 'UK', 'EU', 'Universal'
  category?: string; // e.g., 'Apparel', 'Footwear'
}

export interface WeightMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  value: number;
  unit: string;
}

export interface VolumeMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  value: number;
  unit: string;
}

export interface SkuMaster {
  id: string;
  name: string;
  status?: 'Active' | 'Inactive';
  code?: string;
  skuCode?: string;
  itemCode?: string;
  barcode?: string;
  alias?: string;
  description?: string;
}

export interface PriceListMaster {
  id: string;
  name: string;
  status?: 'Active' | 'Inactive';
  code?: string;
  currency?: string;
  isDefault?: boolean;
  validFrom?: string;
  validTo?: string;
  description?: string;
}

export interface VariantMaster {
  id: string;
  name: string;
  status?: 'Active' | 'Inactive';
  code?: string;
  baseItemId?: string;
  colorId?: string;
  sizeId?: string;
  priceModifier?: number; // e.g. +$10 for XL
  skuCode?: string;
  description?: string;
}

export interface DimensionMaster {
  id: string;
  name: string;
  code?: string;
  status?: 'Active' | 'Inactive';
  l: number;
  w: number;
  h: number;
  unit: string;
  volume?: number; // Pre-calculated volume
}


