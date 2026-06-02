import { VoucherType, ParsingSettings } from '../../../../app/types';

export interface UseStep1UploadLogicProps {
  onNext: (
    file: File, 
    voucherType: VoucherType, 
    mapping?: Record<string, string>, 
    settings?: ParsingSettings, 
    sourceBank?: string
  ) => void;
  isLoading: boolean;
  initialSettings?: ParsingSettings;
  initialVoucherType?: VoucherType;
  ledgerMasters?: any[];
  activeTab?: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings';
  onTabChange?: (tab: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings') => void;
  onImportCategoryChange?: (category: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other') => void;
}

export type ImportCategory = 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other';
export type MasterType = 
  | 'ledgers' 
  | 'parties' 
  | 'vendors'
  | 'partners'
  | 'banks'
  | 'contacts'
  | 'contacts_staff'
  | 'contacts_customers'
  | 'contacts_vendors'
  | 'contacts_partners'
  | 'locations'
  | 'costCenters' 
  | 'accountGroups' 
  | 'items' 
  | 'basic_items'
  | 'bom'
  | 'warehouses'
  | 'uoms'
  | 'uom' 
  | 'godowns' 
  | 'gst' 
  | 'stockGroups' 
  | 'brands' 
  | 'grades' 
  | 'categories'
  | 'assertionCategories'
  | 'assertionCodes'
  | 'colors' 
  | 'sizes' 
  | 'variants' 
  | 'dimensions'
  | 'skus'
  | 'priceList'
  | 'priceLists'
  | 'weights'
  | 'volumes';

export interface TemplateConfig {
  title: string;
  description: string;
  headers: string[];
  sampleRows: Record<string, string>[];
  instructions: string[];
}
