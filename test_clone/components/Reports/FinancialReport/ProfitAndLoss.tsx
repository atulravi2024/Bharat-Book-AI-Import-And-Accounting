import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';

interface PLSummary {
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
}

interface ProfitAndLossProps {
  summary: PLSummary;
}

export const ProfitAndLoss: React.FC<ProfitAndLossProps> = ({ summary }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Revenue</h4>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Total Sales</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{summary.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-dashed">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Total Revenue</span>
            <span className="text-sm font-bold text-gray-900 underline decoration-double dark:text-white">₹{summary.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Cost of Goods Sold</h4>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Purchases & Adj.</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{summary.cogs.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-dashed">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Total COGS</span>
            <span className="text-sm font-bold text-gray-900 underline decoration-double dark:text-white">₹{summary.cogs.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg dark:bg-gray-900">
        <span className="text-sm font-bold text-gray-700 uppercase dark:text-gray-200">Gross Profit</span>
        <span className={`text-lg font-bold ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{summary.grossProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">Operating Expenses</h4>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Administrative Expenses (Payments)</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{summary.operatingExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-dashed">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Total Expenses</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{summary.operatingExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-blue-600 p-6 rounded-xl text-white shadow-lg">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Net Profit / Loss</p>
          <p className="text-2xl font-bold mt-1">₹{summary.netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <PieChartIcon size={32} />
        </div>
      </div>
    </div>
  );
};
