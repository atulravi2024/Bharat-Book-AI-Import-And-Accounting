import { useLanguage } from '../../../context/LanguageContext';

import React from 'react';
import { Download, Printer, Search, TrendingUp, TrendingDown, Package } from 'lucide-react';

interface SummaryReportProps {
  data: any[];
  onExport: () => void;
}

export const SummaryReport: React.FC<SummaryReportProps> = ({ data, onExport }) => {
  const { t, formatNumber  } = useLanguage();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t("Current Stock Summary")}</h2>
        <div className="flex space-x-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t("Filter items...")} 
              className="form-input pl-9 pr-4 text-sm"
            />
          </div>
          <button 
            onClick={onExport}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b dark:bg-gray-900">
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Item Name")}</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Inward Qty")}</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Outward Qty")}</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right font-mono dark:text-gray-300">{t("Clos. Stock")}</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-center dark:text-gray-300">{t("Unit")}</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Value (Basis)")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const inwardQty = item.totalPurchaseQty || 0;
              const outwardQty = item.totalSalesQty || 0;
              const closing = inwardQty - outwardQty;
              const color = closing > 0 ? 'text-green-600' : closing < 0 ? 'text-red-600' : 'text-gray-400';
              return (
                <tr key={idx} className="border-b hover:bg-gray-100/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center dark:text-gray-100">
                    <Package className="mr-2 text-gray-300" size={14} />
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{formatNumber(Number(inwardQty))}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-500 dark:text-gray-400">{formatNumber(Number(outwardQty))}</td>
                  <td className={`px-4 py-3 text-right font-bold font-mono ${color}`}>{formatNumber(Number(closing))}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400 italic">{t("PCS")}</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-medium dark:text-gray-300">₹{formatNumber(closing * (item.avgPurchaseRate || 0), { maximumFractionDigits: 0 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
