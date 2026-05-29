import { useLanguage } from '../../../context/LanguageContext';
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
  const { t, formatNumber  } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-300">
      <div className="form-grid gap-8 border-b pb-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t("Revenue")}</h4>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{t("Total Sales")}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{formatNumber(Number(summary.revenue), { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-dashed">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{t("Total Revenue")}</span>
            <span className="text-sm font-bold text-gray-900 underline decoration-double dark:text-white">₹{formatNumber(Number(summary.revenue), { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest">{t("Cost of Goods Sold")}</h4>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{t("Purchases & Adj.")}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{formatNumber(Number(summary.cogs), { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-dashed">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{t("Total COGS")}</span>
            <span className="text-sm font-bold text-gray-900 underline decoration-double dark:text-white">₹{formatNumber(Number(summary.cogs), { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg dark:bg-gray-900">
        <span className="text-sm font-bold text-gray-700 uppercase dark:text-gray-200">{t("Gross Profit")}</span>
        <span className={`text-lg font-bold ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{formatNumber(Number(summary.grossProfit), { minimumFractionDigits: 2 })}</span>
      </div>

      <div className="space-y-4">
        <h4 className="form-label tracking-widest dark:text-gray-400">{t("Operating Expenses")}</h4>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{t("Administrative Expenses (Payments)")}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{formatNumber(Number(summary.operatingExpenses), { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-dashed">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{t("Total Expenses")}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{formatNumber(Number(summary.operatingExpenses), { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-blue-600 p-6 rounded-xl text-white shadow-lg">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">{t("Net Profit / Loss")}</p>
          <p className="text-2xl font-bold mt-1">₹{formatNumber(Number(summary.netProfit), { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <PieChartIcon size={32} />
        </div>
      </div>
    </div>
  );
};
