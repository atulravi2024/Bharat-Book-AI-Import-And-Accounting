import { useLanguage } from '../../../context/LanguageContext';

import React, { useState, useMemo } from 'react';
import { ParsedVoucher, VoucherType } from '../../../app/types';
import { ArrowBackIcon, CheckCircleIcon, DownloadIcon, PrintIcon, CancelIcon } from '../../icons/IconComponents';
import { parseNumericValue } from '../../../services/aiService';

interface Step3SummaryProps {
  vouchers: ParsedVoucher[];
  voucherType: VoucherType;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const Step3Summary: React.FC<Step3SummaryProps> = ({ vouchers, voucherType, onBack, onSubmit, isLoading, onCancel }) => {
  const { t, formatNumber } = useLanguage();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const summary = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    let totalTax = 0;
    
    (vouchers || []).forEach(v => {
      if (!v) return;
      
      const isBank = v.type === VoucherType.BankStatement || voucherType === VoucherType.BankStatement;
      
      if (isBank) {
        totalDebit += parseNumericValue(v.withdrawalAmount?.value);
        totalCredit += parseNumericValue(v.depositAmount?.value);
      } else {
        const val = parseNumericValue(v.amount?.value);
        totalDebit += val;
        totalCredit += val;
      }
      
      totalTax += parseNumericValue(v.tax?.value);
    });

    return {
      numberOfVouchers: vouchers?.length || 0,
      totalDebit,
      totalCredit,
      gst: totalTax,
      igst: 0, // Placeholder
      cgst: totalTax / 2, // Placeholder
      sgst: totalTax / 2, // Placeholder
      isBalanced: voucherType === VoucherType.BankStatement ? (totalDebit > 0 || totalCredit > 0) : (totalDebit === totalCredit)
    };
  }, [vouchers, voucherType]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex-1 overflow-y-auto scrollbar-thin dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1 dark:text-gray-100">Submit & Final Preview</h2>
                <p className="text-gray-500 text-xs sm:mb-4 dark:text-gray-400">{t("Please confirm the final summary before creating vouchers.")}</p>
            </div>
            <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex-1 sm:flex-none justify-center dark:text-gray-300 dark:hover:bg-gray-600">
                    <DownloadIcon className="mr-2 text-base" /> Export
                </button>
                <button className="flex items-center px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex-1 sm:flex-none justify-center dark:text-gray-300 dark:hover:bg-gray-600">
                    <PrintIcon className="mr-2 text-base" /> Print
                </button>
            </div>
        </div>

        <div className="form-grid gap-4 sm:gap-6 mt-4 sm:mt-0">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg dark:bg-gray-900">
            <h3 className="font-semibold text-lg text-gray-800 mb-4 dark:text-gray-100">{t("Voucher Details")}</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("Voucher Type")}</span><span className="font-medium text-gray-900 dark:text-white">{voucherType}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("No. of Vouchers")}</span><span className="font-medium text-gray-900 dark:text-white">{summary.numberOfVouchers}</span></div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg dark:bg-gray-900">
            <h3 className="font-semibold text-lg text-gray-800 mb-4 dark:text-gray-100">{t("Amount Summary")}</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("Total Debit")}</span><span className="font-medium text-gray-900 dark:text-white">{summary.totalDebit.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("Total Credit")}</span><span className="font-medium text-gray-900 dark:text-white">{summary.totalCredit.toFixed(2)}</span></div>
              <div className={`flex justify-between font-bold border-t pt-3 mt-2 ${summary.isBalanced ? 'text-green-600' : 'text-amber-600'}`}>
                <span>{voucherType === VoucherType.BankStatement ? 'Processed' : 'Balanced'}</span>
                <span>{summary.isBalanced ? '✓' : '!'}</span>
              </div>
            </div>
          </div>
          {(voucherType === VoucherType.Purchase || voucherType === VoucherType.Sales) && (
            <div className="form-field-wrapper lg:col-span-2 bg-gray-50 p-4 sm:p-6 rounded-lg dark:bg-gray-900">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 dark:text-gray-100">{t("Tax Summary")}</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("Total GST")}</span><span className="font-medium text-gray-900 dark:text-white">₹{summary.gst.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("CGST")}</span><span className="font-medium text-gray-900 dark:text-white">₹{summary.cgst.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t("SGST")}</span><span className="font-medium text-gray-900 dark:text-white">₹{summary.sgst.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="form-input h-4 w-4 text-blue-600 border-gray-300 rounded dark:border-gray-600"
            />
            <span className="ml-3 text-gray-700 dark:text-gray-200">{t("I confirm the accuracy of these entries.")}</span>
          </label>
        </div>
      </div>
      
      <div className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 md:py-3 shadow-[0_-10px_25px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_25px_-12px_rgba(0,0,0,0.8)] mt-auto flex-shrink-0 w-full mb-0 rounded-b-none">
        <div className="flex justify-between px-1">
          {!isLoading ? (
            <button
              onClick={onBack}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <ArrowBackIcon className="mr-2" />
              Back
            </button>
          ) : (
             <button
              onClick={onCancel}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <CancelIcon className="mr-2" />
              Cancel Submission
            </button>
          )}
          <button
            onClick={onSubmit}
            disabled={!isConfirmed || isLoading}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
                <>
                  <CheckCircleIcon className="mr-2" />
                  Submit & Create Vouchers
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
