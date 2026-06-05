import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Calculator, RefreshCw, Layers, ChevronUp, ChevronDown } from 'lucide-react';
import { TaxRegime } from '../types';

interface TaxProjectionEngineProps {
  salesRevenue: number;
  setSalesRevenue: (val: number) => void;
  otherIncome: number;
  setOtherIncome: (val: number) => void;
  operatingExpenses: number;
  setOperatingExpenses: (val: number) => void;
  depreciationSec32: number;
  setDepreciationSec32: (val: number) => void;
  deductionsUnderVI: number;
  setDeductionsUnderVI: (val: number) => void;
  taxRegime: TaxRegime;
  setTaxRegime: (val: TaxRegime) => void;

  // Reckoner calculated variables
  grossProfit: number;
  netTaxableIncome: number;
  taxRatePercent: number;
  totalTaxComputed: number;
  matchedTdsTotal: number;
  outstandingAdvanceTax: number;
}

export const TaxProjectionEngine: React.FC<TaxProjectionEngineProps> = ({
  salesRevenue,
  setSalesRevenue,
  otherIncome,
  setOtherIncome,
  operatingExpenses,
  setOperatingExpenses,
  depreciationSec32,
  setDepreciationSec32,
  deductionsUnderVI,
  setDeductionsUnderVI,
  taxRegime,
  setTaxRegime,
  grossProfit,
  netTaxableIncome,
  taxRatePercent,
  totalTaxComputed,
  matchedTdsTotal,
  outstandingAdvanceTax,
}) => {
  const { t, formatNumber } = useLanguage();
  const [regimeOpen, setRegimeOpen] = useState(true);
  const [adviceOpen, setAdviceOpen] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Projection form controls (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-4">
        <div className="flex items-center gap-2 mb-2 border-b pb-3 dark:border-gray-750 justify-between">
          <div className="flex items-center gap-1.5">
            <Calculator className="text-blue-600" size={16} />
            <h3 className="text-xs font-black uppercase text-gray-850 dark:text-indigo-400 tracking-wider font-sans">
              {t("Interactive Projection Dashboard")}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setSalesRevenue(45000000);
              setOtherIncome(1200000);
              setOperatingExpenses(31500000);
              setDepreciationSec32(1800000);
              setDeductionsUnderVI(450000);
            }}
            className="p-1 px-2 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 border border-dashed rounded cursor-pointer transition-all border-slate-200 dark:border-gray-700 font-bold"
            title={t("Restore original model forecast values")}
          >
            <RefreshCw size={10} />
            <span>{t("Reset Forecast")}</span>
          </button>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block">{t("Adjust Gross Receipts / Sales Revenue (₹)")}</label>
          <input
            type="range"
            min={20000000}
            max={150000000}
            step={500000}
            value={salesRevenue}
            onChange={(e) => setSalesRevenue(Number(e.target.value))}
            className="w-full mt-2 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-gray-700"
          />
          <div className="flex justify-between mt-1 text-[11px] font-mono">
            <span className="text-gray-400">₹2 Cr</span>
            <span className="text-blue-600 font-black">₹{formatNumber(salesRevenue)}</span>
            <span className="text-gray-400">₹15 Cr</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">{t("Operating Expenses (OPEX)")}</label>
            <input
              type="number"
              value={operatingExpenses}
              onChange={(e) => setOperatingExpenses(Number(e.target.value))}
              className="w-full text-xs font-mono font-black mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">{t("Other Non-Operating Income")}</label>
            <input
              type="number"
              value={otherIncome}
              onChange={(e) => setOtherIncome(Number(e.target.value))}
              className="w-full text-xs font-mono font-black mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">{t("Section 32 Depreciation Allowance")}</label>
            <input
              type="number"
              value={depreciationSec32}
              onChange={(e) => setDepreciationSec32(Number(e.target.value))}
              className="w-full text-xs font-mono font-black mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">{t("Chapter VI-A Deductions Claims")}</label>
            <input
              type="number"
              value={deductionsUnderVI}
              onChange={(e) => setDeductionsUnderVI(Number(e.target.value))}
              className="w-full text-xs font-mono font-black mt-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
          <div 
            onClick={() => setRegimeOpen(!regimeOpen)} 
            className="flex justify-between items-center cursor-pointer select-none mb-2 hover:opacity-85"
          >
            <label className="text-[10px] uppercase font-black text-gray-800 dark:text-indigo-400 block">{t("Corporate Income Tax Regime Choice")}</label>
            <span className="text-slate-400">
              {regimeOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </div>
          
          {regimeOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
              <div
                onClick={() => setTaxRegime('sec115baa')}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start gap-2.5 ${
                  taxRegime === 'sec115baa'
                    ? 'border-blue-500 bg-blue-50/10 dark:bg-gray-900'
                    : 'border-slate-200 hover:bg-slate-50/50 dark:border-gray-700 dark:hover:bg-slate-900/10'
                }`}
              >
                <input
                  type="radio"
                  checked={taxRegime === 'sec115baa'}
                  onChange={() => {}}
                  className="mt-1 pointer-events-none"
                />
                <div className="text-[11px]">
                  <p className="font-extrabold text-gray-800 dark:text-gray-100">{t("Section 115BAA (Flat Corporate)")}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{t("Concessional corporate flat 22% rate without specified exemptions or incentives.")}</p>
                </div>
              </div>

              <div
                onClick={() => setTaxRegime('regular')}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start gap-2.5 ${
                  taxRegime === 'regular'
                    ? 'border-blue-500 bg-blue-50/10 dark:bg-gray-900'
                    : 'border-slate-200 hover:bg-slate-50/50 dark:border-gray-700 dark:hover:bg-slate-900/10'
                }`}
              >
                <input
                  type="radio"
                  checked={taxRegime === 'regular'}
                  onChange={() => {}}
                  className="mt-1 pointer-events-none"
                />
                <div className="text-[11px]">
                  <p className="font-extrabold text-gray-800 dark:text-gray-100">{t("Regular Corporate regime")}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{t("Standard tax rate of 30% flat allowing Section 10AA & Section 35AD incentives claims.")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ledger offsets visualization (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-4">
        <h3 className="text-xs font-black uppercase text-gray-800 dark:text-indigo-400 tracking-wider flex items-center gap-1.5 mb-2 font-sans">
          <Layers size={15} />
          {t("Pro-forma Tax Reckoner Summary")}
        </h3>

        <div className="space-y-3 font-mono text-[11px] text-gray-650 dark:text-gray-300">
          <div className="flex justify-between border-b pb-2 dark:border-gray-700 border-slate-200">
            <span>{t("Corporate Gross Revenue:")}</span>
            <span className="font-extrabold text-gray-800 dark:text-gray-100">₹{formatNumber(grossProfit)}</span>
          </div>
          <div className="flex justify-between border-b pb-2 dark:border-gray-700 border-slate-200">
            <span>{t("(-) Deductions / OPEX:")}</span>
            <span className="text-rose-500 font-extrabold">₹{formatNumber(operatingExpenses + depreciationSec32 + deductionsUnderVI)}</span>
          </div>
          <div className="flex justify-between border-b pb-2 dark:border-gray-700 border-slate-200 font-bold">
            <span className="text-gray-800 dark:text-gray-100 font-sans">{t("Computed Taxable Net Income:")}</span>
            <span className="text-gray-800 dark:text-gray-200">₹{formatNumber(netTaxableIncome)}</span>
          </div>
          <div className="flex justify-between border-b pb-2 dark:border-gray-700 border-slate-200 font-bold">
            <span>{t("Effective rate multiplier:")}</span>
            <span className="text-blue-600 dark:text-blue-400 font-black">{taxRatePercent}%</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-slate-800 dark:text-slate-100 border-t pt-3 border-dashed border-slate-200 dark:border-gray-700">
            <span className="font-sans font-extrabold">{t("Simulated Gross Tax Charge:")}</span>
            <span className="text-rose-500">₹{formatNumber(Math.round(totalTaxComputed))}</span>
          </div>
          <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="font-sans font-medium">{t("(-) TDS Credit offset claiming:")}</span>
            <span>₹{formatNumber(matchedTdsTotal)}</span>
          </div>
          <div className="flex justify-between pt-3.5 border-t border-slate-200 font-black text-gray-950 dark:text-white dark:border-gray-700">
            <span className="font-sans font-bold">{t("Net Advance Tax Due:")}</span>
            <span className="text-sm">₹{formatNumber(Math.round(outstandingAdvanceTax))}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 dark:bg-gray-900 dark:border-gray-700 text-[10px] text-gray-500 leading-relaxed block dark:text-gray-400">
          <div 
            onClick={() => setAdviceOpen(!adviceOpen)}
            className="flex justify-between items-center cursor-pointer select-none mb-1.5"
          >
            <span className="font-extrabold text-blue-600 dark:text-blue-450 block uppercase tracking-wider font-sans">{t("Tax liability advice")}</span>
            <span className="text-slate-400 hover:text-slate-600">
              {adviceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </div>
          
          {adviceOpen && (
            <div className="animate-fadeIn mt-1">
              {t("This summary has been updated dynamically using Sandbox mathematical coefficients. We advise cross compiling these estimations directly with your GST statutory sheets before making deposit challans.")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
