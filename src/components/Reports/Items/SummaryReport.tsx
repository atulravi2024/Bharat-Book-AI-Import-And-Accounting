
import React from 'react';
import { Download, Printer, Search, TrendingUp, TrendingDown, Package } from 'lucide-react';

interface SummaryReportProps {
  data: any[];
  onExport: () => void;
}

export const SummaryReport: React.FC<SummaryReportProps> = ({ data, onExport }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Current Stock Summary</h2>
        <div className="flex space-x-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter items..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:border-gray-700"
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
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">Item Name</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">Inward Qty</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">Outward Qty</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right font-mono dark:text-gray-300">Clos. Stock</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-center dark:text-gray-300">Unit</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">Value (Basis)</th>
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
                  <td className="px-4 py-3 text-right font-mono">{inwardQty.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-500 dark:text-gray-400">{outwardQty.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-right font-bold font-mono ${color}`}>{closing.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400 italic">PCS</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-medium dark:text-gray-300">₹{(closing * (item.avgPurchaseRate || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
