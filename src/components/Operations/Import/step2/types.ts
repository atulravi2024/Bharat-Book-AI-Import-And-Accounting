import { ParsedVoucher, VoucherField, VoucherType } from '../../../../app/types';

export interface Step2CorrectionProps {
  vouchers: ParsedVoucher[];
  onBack: () => void;
  onNext: (updatedVouchers: ParsedVoucher[]) => void;
  onSaveDraft: (vouchers: ParsedVoucher[]) => void;
  setVouchers: React.Dispatch<React.SetStateAction<ParsedVoucher[]>>;
  partyMasters: any[];
  ledgerMasters: any[];
  uomMasters: any[];
  itemMasters: any[];
  onAddParty: (name: string) => void;
  onAddLedger: (name: string) => void;
  onAddUom: (name: string) => void;
  onAddItem: (name: string) => void;
  voucherType: VoucherType;
  allVouchers?: ParsedVoucher[];
  onNavigateToMasters: () => void;
  activeTab?: 'unmap' | 'missing' | 'automate';
  onTabChange?: (tab: 'unmap' | 'missing' | 'automate') => void;
  importCategory?: 'voucher' | 'master' | 'ledger_master' | 'item_master' | 'transaction_voucher' | 'item_voucher' | 'bank' | 'tax_related' | 'settings' | 'other';
  locationMasters?: any[];
  bomMasters?: any[];
  stockGroupMasters?: any[];
  costCenterMasters?: any[];
  accountGroupMasters?: any[];
  categoryMasters?: any[];
  brandMasters?: any[];
  gradeMasters?: any[];
  gstMasters?: any[];
  skuMasters?: any[];
  priceListMasters?: any[];
  variantMasters?: any[];
  sizeMasters?: any[];
  colorMasters?: any[];
  customMasters?: Record<string, any[]>;
  contactMasters?: any[];
  setContactMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setCustomMasters?: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  setLedgerMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setItemMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setUomMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setPartyMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setLocationMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setBomMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setStockGroupMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setCostCenterMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setAccountGroupMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setCategoryMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setBrandMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setGradeMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setGstMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setSkuMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setPriceListMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setVariantMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setSizeMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setColorMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setWeightMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setVolumeMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  setDimensionMasters?: React.Dispatch<React.SetStateAction<any[]>>;
  onOtherImportSuccess?: (message: string) => void;
  initialSettings?: any;
}

export const allowedFieldsSchema: Record<string, string[]> = {
  [VoucherType.Purchase]: ['invoiceNumber', 'date', 'time', 'partyName', 'ledger', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.Sales]: ['invoiceNumber', 'date', 'time', 'partyName', 'ledger', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.DebitNote]: ['invoiceNumber', 'date', 'time', 'partyName', 'ledger', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.CreditNote]: ['invoiceNumber', 'date', 'time', 'partyName', 'ledger', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.Payment]: ['date', 'time', 'partyName', 'ledger', 'amount', 'referenceNo', 'bankDetails', 'narration'],
  [VoucherType.Receipt]: ['date', 'time', 'partyName', 'ledger', 'amount', 'referenceNo', 'bankDetails', 'narration'],
  [VoucherType.Journal]: ['date', 'time', 'debitLedger', 'creditLedger', 'amount', 'narration'],
  [VoucherType.Contra]: ['date', 'time', 'fromAccount', 'toAccount', 'amount', 'referenceNo', 'narration'],
  [VoucherType.BankStatement]: ['date', 'time', 'narration', 'referenceNo', 'amount', 'withdrawalAmount', 'depositAmount', 'closingBalance'],
  [VoucherType.StockJournal]: ['referenceNo', 'date', 'narration'],
  [VoucherType.PhysicalStock]: ['date', 'narration'],
  [VoucherType.ItemConsumption]: ['referenceNo', 'date', 'narration'],
  [VoucherType.ItemScrap]: ['referenceNo', 'date', 'narration'],
  [VoucherType.Interlocation]: ['referenceNo', 'date', 'narration'],
  [VoucherType.RejectionIn]: ['referenceNo', 'date', 'narration'],
  [VoucherType.RejectionOut]: ['referenceNo', 'date', 'narration']
};
