import React from 'react';
import { ParsedVoucher } from '../../../types';

interface PurchaseRegisterProps {
  data: ParsedVoucher[];
}

export const PurchaseRegister: React.FC<PurchaseRegisterProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto animate-in fade-in duration-300">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px]">Date</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px]">Voucher No.</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px]">Particulars</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px]">Account</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right">Tax Value</th>
            <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map(v => (
            <tr key={v.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{String(v.date?.value || '-')}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{v.tempImportId || v.id.split('-')[0]}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{String(v.partyName?.value || v.narration?.value || 'N/A')}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{String(v.ledger?.value || v.debitLedger?.value || '-')}</td>
              <td className="px-4 py-3 text-right">₹{Number(v.tax?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">₹{Number(v.amount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No records found for this period.</td></tr>
          )}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
              <td colSpan={5} className="px-4 py-4 text-right uppercase text-[10px] tracking-widest text-gray-500">Total</td>
              <td className="px-4 py-4 text-right text-base text-blue-700 underline decoration-double shadow-inner">
                ₹{data.reduce((s, v) => s + Number(v.amount?.value || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};
