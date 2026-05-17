import React from 'react';

interface BSSummary {
  assets: { name: string; amount: number }[];
  liabilities: { name: string; amount: number }[];
  totalAssets: number;
  totalLiabilities: number;
}

interface BalanceSheetProps {
  summary: BSSummary;
}

export const BalanceSheet: React.FC<BalanceSheetProps> = ({ summary }) => {
  return (
    <div className="form-grid gap-0 overflow-hidden animate-in fade-in duration-300 border rounded-xl shadow-sm bg-white dark:bg-gray-800">
      <div className="flex flex-col border-r">
        <div className="px-4 py-3 bg-gray-50 border-b font-bold text-gray-700 uppercase tracking-wider text-xs dark:bg-gray-900 dark:text-gray-200">
          Liabilities
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody>
              {summary.liabilities.map((item, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{item.name}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {summary.liabilities.length === 0 && (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">No liabilities</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-4 bg-gray-50 border-t font-bold text-gray-900 flex justify-between uppercase text-xs dark:bg-gray-900 dark:text-white">
          <span>Total Liabilities</span>
          <span>₹{summary.totalLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="px-4 py-3 bg-gray-50 border-b font-bold text-gray-700 uppercase tracking-wider text-xs dark:bg-gray-900 dark:text-gray-200">
          Assets
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody>
              {summary.assets.map((item, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{item.name}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {summary.assets.length === 0 && (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">No assets</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-4 bg-gray-50 border-t font-bold text-gray-900 flex justify-between uppercase text-xs dark:bg-gray-900 dark:text-white">
          <span>Total Assets</span>
          <span>₹{summary.totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};
