import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { InfoIcon } from '../../../../icons/IconComponents';

interface BankSelectionFieldProps {
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  bankMasters: any[];
}

export const BankSelectionField: React.FC<BankSelectionFieldProps> = ({
  selectedBank,
  setSelectedBank,
  bankMasters,
}) => {
  const { t } = useLanguage();

  return (
    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start">
        <InfoIcon className="text-indigo-500 mr-3 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-indigo-900">{t("Raw Bank Import")}</h4>
          <p className="text-xs text-indigo-700 mt-0.5">
            {t("Importing a bank statement will automatically extract individual transaction lines. These will be presented as individual vouchers for your review and ledger mapping.")}
          </p>
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
  );
};
