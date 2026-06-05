import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherType } from '../../../../app/types';
import { MasterType } from './types';
import { getThemeConfig } from './utils/step1Utils';
import { VoucherSelectionGrid } from './views/VoucherSelectionGrid';
import { LedgerItemSelectionGrid } from './views/LedgerItemSelectionGrid';
import { BankSelectionField } from './views/BankSelectionField';
import { TaxComplianceSelectionGrid } from './views/TaxComplianceSelectionGrid';
import { SettingsSelectionPanel } from './views/SettingsSelectionPanel';
import { OtherSelectionGrid } from './views/OtherSelectionGrid';

interface SubStepChooseProps {
  importCategory: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other';
  voucherType: VoucherType;
  setVoucherType: (type: VoucherType) => void;
  masterType: MasterType;
  setMasterType: (type: MasterType) => void;
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  bankMasters: any[];
  selectedOtherCategory: string;
  setSelectedOtherCategory: (category: string) => void;
  customCategoryName: string;
  setCustomCategoryName: (name: string) => void;
  selectedSettingsSubpage?: string;
  setSelectedSettingsSubpage?: (subpage: string) => void;
  setActiveTab?: (tab: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings') => void;
  taxSampleType?: 'with_data' | 'without_data';
  setTaxSampleType?: (type: 'with_data' | 'without_data') => void;
}

export const SubStepChoose: React.FC<SubStepChooseProps> = ({
  importCategory,
  voucherType,
  setVoucherType,
  masterType,
  setMasterType,
  selectedBank,
  setSelectedBank,
  bankMasters,
  selectedOtherCategory,
  setSelectedOtherCategory,
  customCategoryName,
  setCustomCategoryName,
  selectedSettingsSubpage = 'pref_general',
  setSelectedSettingsSubpage,
  setActiveTab,
  taxSampleType = 'with_data',
  setTaxSampleType,
}) => {
  const { t } = useLanguage();

  const theme = getThemeConfig(
    importCategory,
    voucherType,
    masterType,
    selectedSettingsSubpage,
    selectedOtherCategory
  );

  return (
    <div className={`flex-1 bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border transition-all duration-500 flex flex-col min-h-0 overflow-y-auto custom-scrollbar relative group/main shrink-0 text-left ${theme.glow} ${theme.border} ${theme.darkBorder}`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${theme.gradient}`}></div>

      <div className="flex items-center justify-between mb-6 shrink-0 text-left">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
              {(importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher')
                ? (importCategory === 'transaction_voucher' ? t("Transaction Voucher Ingestion") : importCategory === 'item_voucher' ? t("Inventory Transaction Ingestion") : t("Voucher Classification"))
                : importCategory === 'ledger_master' 
                ? t("Ledger Masters") 
                : importCategory === 'item_master'
                ? t("Item Masters")
                : importCategory === 'bank' 
                ? t("Bank Selection") 
                : importCategory === 'tax_related'
                ? t("GST Compliance Forms")
                : importCategory === 'settings'
                ? t("Ingestion Control Settings")
                : t("Data Entry Origin")}
            </h2>
            <div className="flex items-center mt-2 space-x-2">
                <div className="flex -space-x-1">
                    {[1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full border border-white transition-all duration-300 ${i === 1 ? theme.accent : 'bg-gray-200 dark:bg-gray-700'}`}></div>)}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border transition-all duration-300 ${theme.badge}`}>{t("Pipeline Alpha")}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                  {(importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher')
                    ? (importCategory === 'transaction_voucher' ? t("Classify accounting & commercial document records") : importCategory === 'item_voucher' ? t("Classify stock, warehouse & material logs") : t("Classify document & ingest record"))
                    : importCategory === 'ledger_master'
                    ? t("Select ledger/accounts master data entity") 
                    : importCategory === 'item_master'
                    ? t("Select inventory/item master data entity") 
                    : importCategory === 'bank' 
                    ? t("Select bank for statement import") 
                    : importCategory === 'tax_related'
                    ? t("Select standard GSTR compliance sheet template")
                    : importCategory === 'settings'
                    ? t("Configure processing defaults and credentials")
                    : t("Select data type")}
                </p>
            </div>
         </div>
      </div>
      
      <div className="mb-6">
        {(importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher') && (
          <VoucherSelectionGrid
            importCategory={importCategory}
            voucherType={voucherType}
            setVoucherType={setVoucherType}
          />
        )}

        {(importCategory === 'ledger_master' || importCategory === 'item_master') && (
          <LedgerItemSelectionGrid
            importCategory={importCategory}
            masterType={masterType}
            setMasterType={setMasterType}
          />
        )}
        
        {importCategory === 'bank' && (
          <BankSelectionField
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            bankMasters={bankMasters}
          />
        )}

        {importCategory === 'tax_related' && (
          <TaxComplianceSelectionGrid
            voucherType={voucherType}
            setVoucherType={setVoucherType}
            taxSampleType={taxSampleType}
            setTaxSampleType={setTaxSampleType}
          />
        )}

        {importCategory === 'settings' && (
          <SettingsSelectionPanel
            selectedSettingsSubpage={selectedSettingsSubpage}
            setSelectedSettingsSubpage={setSelectedSettingsSubpage}
            theme={theme}
          />
        )}

        {importCategory === 'other' && (
          <OtherSelectionGrid
            selectedOtherCategory={selectedOtherCategory}
            setSelectedOtherCategory={setSelectedOtherCategory}
            customCategoryName={customCategoryName}
            setCustomCategoryName={setCustomCategoryName}
          />
        )}
      </div>
    </div>
  );
};
