import { useLanguage } from '../../../context/LanguageContext';
import React from 'react';
import { ParsedVoucher } from '../../../app/types';

interface BankFlowProps {
  data: ParsedVoucher[];
}

export const BankFlow: React.FC<BankFlowProps> = ({ data }) => {
  const { t, formatNumber  } = useLanguage();

  return (
    <div className="overflow-x-auto animate-in fade-in duration-300">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-50 border-b dark:bg-gray-900">
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Date")}</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Particulars")}</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("REF / Invoice No.")}</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Withdrawal")}</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Deposit")}</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Balance")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map(v => (
            <tr key={v.id} className="border-b hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
              <td className="px-4 py-3">{String(v.date?.value || '-')}</td>
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                <div>{String(v.partyName?.value || v.narration?.value || 'N/A')}</div>
                <div className="text-[10px] text-gray-400 font-normal">{String(v.bankDetails?.value || '')}</div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{String(v.referenceNo?.value || '-')}</td>
              <td className="px-4 py-3 text-right text-red-600">
                {Number(v.withdrawalAmount?.value || 0) > 0 ? `₹${formatNumber(Number(Number(v.withdrawalAmount?.value)), { minimumFractionDigits: 2 })}` : '-'}
              </td>
              <td className="px-4 py-3 text-right text-green-600">
                {Number(v.depositAmount?.value || 0) > 0 ? `₹${formatNumber(Number(Number(v.depositAmount?.value)), { minimumFractionDigits: 2 })}` : '-'}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                ₹{formatNumber(Number(Number(v.closingBalance?.value || 0)), { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">{t("No bank records found for this period.")}</td></tr>
          )}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <tr className="bg-gray-50 font-bold border-t-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
              <td colSpan={3} className="px-4 py-4 text-right uppercase text-[10px] tracking-widest text-gray-500 dark:text-gray-400">{t("Total Movements")}</td>
              <td className="px-4 py-4 text-right text-red-700">
                ₹{formatNumber(data.reduce((s, v) => s + Number(v.withdrawalAmount?.value || 0), 0), { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-right text-green-700">
                ₹{formatNumber(data.reduce((s, v) => s + Number(v.depositAmount?.value || 0), 0), { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-right text-blue-700 underline decoration-double">
                {/* Net movement */}
                ₹{formatNumber(data.reduce((s, v) => s + Number(v.depositAmount?.value || 0), 0) - data.reduce((s, v) => s + Number(v.withdrawalAmount?.value || 0), 0), { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};
