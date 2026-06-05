export interface InventoryEntryViewProps {
  defaultType?: string;
  itemMasters?: any[];
  warehouseMasters?: any[];
  ledgerMasters?: any[];
  partyMasters?: any[];
  vouchers?: any[];
  onUpdateItemMaster?: (item: any) => void;
  onAddItemMaster?: (item: any) => void;
  onSaveEntry?: (entry: any, isNew: boolean) => void;
  onDeleteEntry?: (id: string) => void;
  onOpenPrintSettings?: () => void;
}
