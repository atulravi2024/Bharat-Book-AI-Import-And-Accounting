import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Percent, Settings } from 'lucide-react';
import { 
    VouchersIcon, 
    AccountIcon, 
    BankIcon, 
    CategoryIcon,
    InventoryIcon,
} from '../../../icons/IconComponents';

interface SubStepTypeProps {
  importCategory: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other';
  setImportCategory: (category: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other') => void;
}

export const SubStepType: React.FC<SubStepTypeProps> = ({
  importCategory,
  setImportCategory,
}) => {
  const { t } = useLanguage();

  const getThemeColors = () => {
    switch (importCategory) {
      case 'transaction_voucher':
        return {
          icon: 'text-purple-600 dark:text-purple-400',
          activeBg: 'bg-purple-50/40 dark:bg-purple-950/20',
          activeBorder: 'border-purple-500 dark:border-purple-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(168,85,247,0.08)]',
          gradient: 'from-purple-500/0 via-purple-500/30 to-purple-500/0',
          indicator: 'bg-purple-600'
        };
      case 'item_voucher':
        return {
          icon: 'text-emerald-600 dark:text-emerald-400',
          activeBg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
          activeBorder: 'border-emerald-500 dark:border-emerald-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(16,185,129,0.08)]',
          gradient: 'from-emerald-500/0 via-emerald-500/30 to-emerald-500/0',
          indicator: 'bg-emerald-600'
        };
      case 'ledger_master':
        return {
          icon: 'text-blue-600 dark:text-blue-400',
          activeBg: 'bg-blue-50/40 dark:bg-blue-950/20',
          activeBorder: 'border-blue-500 dark:border-blue-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(59,130,246,0.08)]',
          gradient: 'from-blue-500/0 via-blue-500/30 to-blue-500/0',
          indicator: 'bg-blue-600'
        };
      case 'item_master':
        return {
          icon: 'text-amber-600 dark:text-amber-400',
          activeBg: 'bg-amber-50/40 dark:bg-amber-950/20',
          activeBorder: 'border-amber-500 dark:border-amber-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(245,158,11,0.08)]',
          gradient: 'from-amber-500/0 via-amber-500/30 to-amber-500/0',
          indicator: 'bg-amber-600'
        };
      case 'bank':
        return {
          icon: 'text-indigo-600 dark:text-indigo-400',
          activeBg: 'bg-indigo-50/40 dark:bg-indigo-950/20',
          activeBorder: 'border-indigo-500 dark:border-indigo-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(99,102,241,0.08)]',
          gradient: 'from-indigo-500/0 via-indigo-500/30 to-indigo-500/0',
          indicator: 'bg-indigo-600'
        };
      case 'tax_related':
        return {
          icon: 'text-teal-600 dark:text-teal-400',
          activeBg: 'bg-teal-50/40 dark:bg-teal-950/20',
          activeBorder: 'border-teal-500 dark:border-teal-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(20,184,166,0.08)]',
          gradient: 'from-teal-500/0 via-teal-500/30 to-teal-500/0',
          indicator: 'bg-teal-600'
        };
      case 'settings':
        return {
          icon: 'text-rose-600 dark:text-rose-400',
          activeBg: 'bg-rose-50/40 dark:bg-rose-950/20',
          activeBorder: 'border-rose-500 dark:border-rose-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(244,63,94,0.08)]',
          gradient: 'from-rose-500/0 via-rose-500/30 to-rose-500/0',
          indicator: 'bg-rose-600'
        };
      case 'other':
      default:
        return {
          icon: 'text-slate-600 dark:text-slate-400',
          activeBg: 'bg-slate-50/40 dark:bg-slate-900/30',
          activeBorder: 'border-slate-500 dark:border-slate-400/85',
          shadow: 'shadow-[0_10px_25px_rgba(100,116,139,0.08)]',
          gradient: 'from-slate-500/0 via-slate-500/30 to-slate-500/0',
          indicator: 'bg-slate-600'
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border transition-all duration-500 min-h-0 overflow-y-auto custom-scrollbar relative shrink-0 border-premium-slate-100 dark:border-gray-700 ${themeColors.shadow}`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${themeColors.gradient}`}></div>
      
      <div className="flex items-center justify-between mb-6 shrink-0 text-left">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
              {t("Select Import Type")}
            </h2>
            <div className="flex items-center mt-2 space-x-2">
               <div className={`h-1 w-6 rounded-full transition-colors duration-300 ${themeColors.indicator}`}></div>
               <div className="h-1 w-1.5 bg-blue-200 rounded-full dark:bg-blue-900/50"></div>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6 w-full">
        <button
          onClick={() => setImportCategory('transaction_voucher')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'transaction_voucher' 
              ? 'bg-white border-purple-500 shadow-purple-100 dark:bg-purple-950/30 dark:border-purple-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-purple-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-700'
          }`}
        >
          <AccountIcon className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'transaction_voucher' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-gray-400 group-hover:text-purple-500 group-hover:scale-110 dark:group-hover:text-purple-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'transaction_voucher' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-905 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-300'}`}>{t("Transaction Voucher")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("Ledger & accounts only: Payment, Receipt, Journal, Contra")}</p>
        </button>

        <button
          onClick={() => setImportCategory('item_voucher')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'item_voucher' 
              ? 'bg-white border-emerald-500 shadow-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-emerald-700'
          }`}
        >
          <InventoryIcon className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'item_voucher' ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-gray-400 group-hover:text-emerald-500 group-hover:scale-110 dark:group-hover:text-emerald-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'item_voucher' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-905 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'}`}>{t("Item Voucher")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("With inventory lines: Purchase, Sales, CN/DN")}</p>
        </button>

        <button
          onClick={() => setImportCategory('ledger_master')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'ledger_master' 
              ? 'bg-white border-blue-500 shadow-blue-100 dark:bg-blue-950/30 dark:border-blue-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-blue-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700'
          }`}
        >
          <AccountIcon className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'ledger_master' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 group-hover:text-blue-500 group-hover:scale-110 dark:group-hover:text-blue-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'ledger_master' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-902 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300'}`}>{t("Ledger Master")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("Ledgers, Parties, Cost Centers & Accounts")}</p>
        </button>

        <button
          onClick={() => setImportCategory('item_master')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'item_master' 
              ? 'bg-white border-amber-500 shadow-amber-100 dark:bg-amber-950/30 dark:border-amber-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-amber-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-amber-700'
          }`}
        >
          <InventoryIcon className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'item_master' ? 'text-amber-600 dark:text-amber-400 scale-110' : 'text-gray-400 group-hover:text-amber-500 group-hover:scale-110 dark:group-hover:text-amber-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'item_master' ? 'text-amber-700 dark:text-amber-400' : 'text-gray-902 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-300'}`}>{t("Item Master")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("Stock Items, UOM, Godowns, GST Tax Rates")}</p>
        </button>

        <button
          onClick={() => setImportCategory('bank')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'bank' 
              ? 'bg-white border-indigo-500 shadow-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-700'
          }`}
        >
          <BankIcon className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'bank' ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-gray-400 group-hover:text-indigo-500 group-hover:scale-110 dark:group-hover:text-indigo-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'bank' ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-902 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'}`}>{t("Bank Statement")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("Bank Statement Ledger logs")}</p>
        </button>

        <button
          onClick={() => setImportCategory('tax_related')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'tax_related' 
              ? 'bg-white border-teal-500 shadow-teal-100 dark:bg-teal-950/30 dark:border-teal-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-teal-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-teal-700'
          }`}
        >
          <Percent className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'tax_related' ? 'text-teal-600 dark:text-teal-400 scale-110' : 'text-gray-400 group-hover:text-teal-500 group-hover:scale-110 dark:group-hover:text-teal-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'tax_related' ? 'text-teal-700 dark:text-teal-400' : 'text-gray-902 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-300'}`}>{t("Tax Related")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("All tax inputs: GSTR-1, 2, 2A, 2B, 9, 9A, 9B, 9C and many other GST formats")}</p>
        </button>

        <button
          onClick={() => setImportCategory('settings')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'settings' 
              ? 'bg-white border-rose-500 shadow-rose-100 dark:bg-rose-950/30 dark:border-rose-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-rose-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-rose-700'
          }`}
        >
          <Settings className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'settings' ? 'text-rose-600 dark:text-rose-400 scale-110' : 'text-gray-400 group-hover:text-rose-500 group-hover:scale-110 dark:group-hover:text-rose-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'settings' ? 'text-rose-700 dark:text-rose-400' : 'text-gray-902 dark:text-gray-100 group-hover:text-rose-600 dark:group-hover:text-rose-300'}`}>{t("Configuration Import")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("Import configuration profiles for specific system subpages and modules")}</p>
        </button>

        <button
          onClick={() => setImportCategory('other')}
          className={`relative p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border-2 group shadow-sm hover:shadow-xl ${
            importCategory === 'other' 
              ? 'bg-white border-slate-500 shadow-slate-100 dark:bg-slate-950/30 dark:border-slate-500 scale-[1.03] z-10' 
              : 'bg-white border-gray-100 text-gray-500 hover:border-slate-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-slate-700'
          }`}
        >
          <CategoryIcon className={`w-10 h-10 mb-3 transition-transform duration-300 ${importCategory === 'other' ? 'text-slate-600 dark:text-slate-400 scale-110' : 'text-gray-400 group-hover:text-slate-500 group-hover:scale-110 dark:group-hover:text-slate-400'}`} />
          <h3 className={`font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300 ${importCategory === 'other' ? 'text-slate-700 dark:text-slate-400' : 'text-gray-902 dark:text-gray-100 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>{t("Other")}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">{t("Custom categories & unstructured files")}</p>
        </button>
      </div>
    </div>
  );
};
