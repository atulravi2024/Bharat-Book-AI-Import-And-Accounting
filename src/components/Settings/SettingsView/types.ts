import { MainView, LedgerMaster } from "../../../app/types";

export interface SettingsViewProps {
  setView: (view: MainView) => void;
  setActiveMasterTab: (tab: string | null) => void;
  setReportBankActiveTab?: (tab: string | null) => void;
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
  ledgerMasters?: LedgerMaster[];
  onAppModeChange?: (mode: string) => void;
  onImportCategoryChange?: (category: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other') => void;
}
