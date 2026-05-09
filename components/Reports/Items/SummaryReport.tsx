
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
        <h2 className="text-lg font-bold text-gray-800">Current Stock Summary</h2>
        <div className="flex space-x-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter items..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <button 
            onClick={onExport}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px]">Item Name</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right">Inward Qty</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right">Outward Qty</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right font-mono">Clos. Stock</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-center">Unit</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right">Value (Basis)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const closing = item.totalQty - (item.outwardQty || 0);
              const color = closing > 0 ? 'text-green-600' : closing < 0 ? 'text-red-600' : 'text-gray-400';
              return (
                <tr key={idx} className="border-b hover:bg-gray-100/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center">
                    <Package className="mr-2 text-gray-300" size={14} />
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{item.totalQty.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-500">{item.outwardQty || 0}</td>
                  <td className={`px-4 py-3 text-right font-bold font-mono ${color}`}>{closing.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400 italic">PCS</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-medium">₹{(closing * item.avgPurchaseRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
