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
  onImportCategoryChange?: (category: 'voucher' | 'master' | 'bank' | 'other') => void;
}

export type ImportCategory = 'voucher' | 'master' | 'bank' | 'other';
export type MasterType = 'ledgers' | 'items' | 'costCenters' | 'priceList';

export interface TemplateConfig {
  title: string;
  description: string;
  headers: string[];
  sampleRows: Record<string, string>[];
  instructions: string[];
}
