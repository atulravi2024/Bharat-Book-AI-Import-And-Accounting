import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherType } from '../../../../app/types';
import { 
    InfoIcon, 
    UndoIcon, 
    CategoryIcon,
    InventoryIcon,
    TaxIcon,
    AccountIcon,
    VouchersIcon
} from '../../../icons/IconComponents';

interface SubStepChooseProps {
  importCategory: 'voucher' | 'master' | 'bank' | 'other';
  voucherType: VoucherType;
  setVoucherType: (type: VoucherType) => void;
  masterType: 'ledgers' | 'items' | 'costCenters' | 'priceList';
  setMasterType: (type: 'ledgers' | 'items' | 'costCenters' | 'priceList') => void;
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  bankMasters: any[];
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
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col min-h-0 overflow-y-auto custom-scrollbar relative group/main shrink-0 text-left">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="flex items-center justify-between mb-6 shrink-0 text-left">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
              {importCategory === 'voucher' ? t("Voucher Classification") : importCategory === 'master' ? t("Master Data Type") : importCategory === 'bank' ? t("Bank Selection") : t("Data Entry Origin")}
            </h2>
            <div className="flex items-center mt-2 space-x-2">
                <div className="flex -space-x-1">
                    {[1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full border border-white ${i === 1 ? 'bg-blue-400' : 'bg-gray-200'} dark:bg-gray-700`}></div>)}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-600/80 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50">{t("Pipeline Alpha")}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                  {importCategory === 'voucher' ? t("Classify document & ingest record") : importCategory === 'master' ? t("Select master data entity") : importCategory === 'bank' ? t("Select bank for statement import") : t("Select data type")}
                </p>
            </div>
         </div>
      </div>
      
      <div className="mb-6">
        {importCategory === 'voucher' && (
          <>
            <div className="flex items-center justify-between mb-5 px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">{t("System Classification")}</label>
                <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
            </div>
            <div className="form-grid gap-4">
              {[
                { type: VoucherType.Purchase, icon: InventoryIcon, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', accent: 'bg-emerald-600' },
                { type: VoucherType.Sales, icon: TaxIcon, color: 'text-blue-600 bg-blue-50/50 border-blue-100', accent: 'bg-blue-600' },
                { type: VoucherType.Payment, icon: AccountIcon, color: 'text-purple-600 bg-purple-50/50 border-purple-100', accent: 'bg-purple-600' },
                { type: VoucherType.Receipt, icon: VouchersIcon, color: 'text-amber-600 bg-amber-50/50 border-amber-100', accent: 'bg-amber-600' },
                { type: VoucherType.Journal, icon: CategoryIcon, color: 'text-slate-600 bg-slate-50/50 border-slate-100', accent: 'bg-slate-600' },
                { type: VoucherType.Contra, icon: UndoIcon, color: 'text-rose-600 bg-rose-50/50 border-rose-100', accent: 'bg-rose-600' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setVoucherType(item.type)}
                  className={`group flex flex-col items-center justify-center p-3.5 rounded-[1.25rem] border transition-all duration-500 relative overflow-hidden cursor-pointer ${
                    voucherType === item.type 
                      ? `${item.color} ring-1 ring-offset-4 ring-blue-500/30 border-transparent shadow-[0_15px_30px_rgba(59,130,246,0.15)] scale-[1.08] z-10` 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:bg-premium-slate-50 hover:text-blue-600 active:scale-95 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${voucherType === item.type ? `w-full ${item.accent}` : 'w-0 bg-blue-400'}`}></div>
                  <item.icon className={`text-xl mb-2 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 ${voucherType === item.type ? 'scale-110 -translate-y-0.5' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.type}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {importCategory === 'master' && (
          <>
            <div className="flex items-center justify-between mb-5 px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">{t("Master Entity Type")}</label>
                <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'ledgers', label: 'Ledgers', icon: AccountIcon },
                { id: 'items', label: 'Items', icon: InventoryIcon },
                { id: 'costCenters', label: 'Cost Centers', icon: CategoryIcon },
                { id: 'priceList', label: 'Price List', icon: TaxIcon },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMasterType(item.id as any)}
                  className={`group flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    masterType === item.id 
                      ? 'bg-blue-50 border-blue-500 shadow-md text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                      : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <item.icon className={`text-2xl mb-3 ${masterType === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                  <span className="text-sm font-bold">{t(item.label)}</span>
                </button>
              ))}
            </div>
          </>
        )}
        
        {importCategory === 'bank' && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start">
              <InfoIcon className="text-indigo-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900">{t("Raw Bank Import")}</h4>
                <p className="text-xs text-indigo-700 mt-0.5">{t("Importing a bank statement will automatically extract individual transaction lines. These will be presented as individual vouchers for your review and ledger mapping.")}</p>
              </div>
            </div>

            <div className="form-field-wrapper">
              <label className="form-label px-1">{t("Select Bank Source (Mandatory)")}</label>
              <select 
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">{t("-- Choose Indian Major Bank --")}</option>
                {bankMasters.map(bank => (
                  <option key={bank.name} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {importCategory === 'other' && (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 dark:bg-gray-800/50 dark:border-gray-700">
              <CategoryIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium text-sm text-center">{t("You are configuring a miscellaneous import. Just proceed to the next step to upload your generic data.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
