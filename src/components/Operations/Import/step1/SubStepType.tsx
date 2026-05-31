import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    VouchersIcon, 
    AccountIcon, 
    BankIcon, 
    CategoryIcon,
} from '../../../icons/IconComponents';

interface SubStepTypeProps {
  importCategory: 'voucher' | 'master' | 'bank' | 'other';
  setImportCategory: (category: 'voucher' | 'master' | 'bank' | 'other') => void;
}

export const SubStepType: React.FC<SubStepTypeProps> = ({
  importCategory,
  setImportCategory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border border-premium-slate-100 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none min-h-0 overflow-y-auto custom-scrollbar relative shrink-0">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-6 shrink-0 text-left">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
              {t("Select Import Type")}
            </h2>
            <div className="flex items-center mt-2 space-x-2">
               <div className="h-1 w-6 bg-blue-600 rounded-full"></div>
               <div className="h-1 w-1.5 bg-blue-200 rounded-full dark:bg-blue-900/50"></div>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setImportCategory('voucher')}
          className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            importCategory === 'voucher' 
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
        >
          <VouchersIcon className={`w-10 h-10 mb-3 ${importCategory === 'voucher' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Vouchers")}</h3>
          <p className="text-xs text-gray-500 mt-1">{t("Invoices, Receipts")}</p>
        </button>

        <button
          onClick={() => setImportCategory('master')}
          className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            importCategory === 'master' 
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
        >
          <AccountIcon className={`w-10 h-10 mb-3 ${importCategory === 'master' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Masters")}</h3>
          <p className="text-xs text-gray-500 mt-1">{t("Ledgers, Items")}</p>
        </button>

        <button
          onClick={() => setImportCategory('bank')}
          className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            importCategory === 'bank' 
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
        >
          <BankIcon className={`w-10 h-10 mb-3 ${importCategory === 'bank' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Bank Transaction")}</h3>
          <p className="text-xs text-gray-500 mt-1">{t("Statements")}</p>
        </button>

        <button
          onClick={() => setImportCategory('other')}
          className={`p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            importCategory === 'other' 
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm dark:bg-blue-900/20 dark:border-blue-400' 
              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
        >
          <CategoryIcon className={`w-10 h-10 mb-3 ${importCategory === 'other' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t("Other")}</h3>
          <p className="text-xs text-gray-500 mt-1">{t("Miscellaneous data")}</p>
        </button>
      </div>
    </div>
  );
};
