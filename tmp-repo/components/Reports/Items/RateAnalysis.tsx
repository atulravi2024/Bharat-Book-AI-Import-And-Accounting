
import React from 'react';
import { Download, Printer } from 'lucide-react';

interface RateAnalysisProps {
  data: any[];
  onExport: () => void;
}

export const RateAnalysis: React.FC<RateAnalysisProps> = ({ data, onExport }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-800">Item Rate Analysis (Purchase vs Sales)</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onExport}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Download Report"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Print Report"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px]">Item / Product Name</th>
              <th className="px-4 py-3 font-bold text-teal-600 uppercase text-[10px] text-right">Last Pur. Rate</th>
              <th className="px-4 py-3 font-bold text-teal-600 uppercase text-[10px] text-right">Avg Pur. Rate</th>
              <th className="px-4 py-3 font-bold text-blue-600 uppercase text-[10px] text-right">Last Sale Rate</th>
              <th className="px-4 py-3 font-bold text-blue-600 uppercase text-[10px] text-right">Avg Sale Rate</th>
              <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right">Margin (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const margin = item.avgSalesRate > 0 ? ((item.avgSalesRate - item.avgPurchaseRate) / item.avgSalesRate) * 100 : 0;
              return (
                <tr key={idx} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-right text-teal-700 font-bold">₹{item.lastPurchaseRate.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                  <td className="px-4 py-3 text-right text-teal-600/80">₹{item.avgPurchaseRate.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                  <td className="px-4 py-3 text-right text-blue-700 font-bold">₹{item.lastSalesRate.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                  <td className="px-4 py-3 text-right text-blue-600/80">₹{item.avgSalesRate.toLocaleString('en-IN', { minimumFractionDigits: 1 })}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${margin >= 20 ? 'bg-green-100 text-green-700' : margin >= 5 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No item data found in vouchers.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
