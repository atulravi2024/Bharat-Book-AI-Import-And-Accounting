
export interface VoucherEntryViewProps {
  defaultType?: string;
  initialVoucher?: any;
  itemMasters?: any[];
  ledgerMasters?: any[];
  partyMasters?: any[];
  vouchers?: any[];
  onUpdateItemMaster?: (item: any) => void;
  onAddItemMaster?: (item: any) => void;
  onSaveEntry?: (entry: any, isNew: boolean) => void;
  onDeleteEntry?: (id: string) => void;
  onOpenPrintSettings?: () => void;
}


