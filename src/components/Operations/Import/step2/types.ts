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
}

export const allowedFieldsSchema: Record<string, string[]> = {
  [VoucherType.Purchase]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.Sales]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.DebitNote]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.CreditNote]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
  [VoucherType.Payment]: ['date', 'time', 'amount', 'referenceNo', 'bankDetails', 'narration'],
  [VoucherType.Receipt]: ['date', 'time', 'amount', 'referenceNo', 'bankDetails', 'narration'],
  [VoucherType.Journal]: ['date', 'time', 'debitLedger', 'creditLedger', 'amount', 'narration'],
  [VoucherType.Contra]: ['date', 'time', 'fromAccount', 'toAccount', 'amount', 'referenceNo', 'narration'],
  [VoucherType.BankStatement]: ['date', 'time', 'narration', 'referenceNo', 'amount', 'withdrawalAmount', 'depositAmount', 'closingBalance']
};
