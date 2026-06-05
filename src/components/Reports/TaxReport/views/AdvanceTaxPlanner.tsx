import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Calendar, AlertCircle, ArrowUpRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Instalment } from '../types';

interface AdvanceTaxPlannerProps {
  outstandingAdvanceTax: number;
}

export const AdvanceTaxPlanner: React.FC<AdvanceTaxPlannerProps> = ({ outstandingAdvanceTax }) => {
  const { t, formatNumber } = useLanguage();
  const [warningOpen, setWarningOpen] = useState(true);

  // Advance Tax Instalments Timeline (Section 211)
  const instalments: Instalment[] = [
    { title: t('1st Installment'), date: '15-Jun-2026', cumulativePercent: 15, key: 'jun' },
    { title: t('2nd Installment'), date: '15-Sep-2026', cumulativePercent: 45, key: 'sep' },
    { title: t('3rd Installment'), date: '15-Dec-2026', cumulativePercent: 75, key: 'dec' },
    { title: t('4th Installment'), date: '15-Mar-2027', cumulativePercent: 100, key: 'mar' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={18} />
            <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
              {t("Advance Tax Statutory Compliance Schedule (Section 211)")}
            </h3>
          </div>
          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded dark:bg-blue-900/40 dark:text-blue-200 self-start sm:self-auto">
            {t("Rule Under Income Tax Act, 1961")}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-6 dark:text-gray-400 leading-relaxed">
          {t("Every company whose estimated net tax liability exceeds ₹10,000 for the fiscal year must deposit Advance Tax in four designated installments. Interest under 234B & 234C applies in cases of default.")}
        </p>

        {/* Timelines Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {instalments.map((inst, index) => {
            const targetAmt = (outstandingAdvanceTax * inst.cumulativePercent) / 100;
            // The first installment is standardly "Next up" based on 2026-06 date metadata
            const isFirst = index === 0;

            return (
              <div 
                key={index} 
                className={`p-5 min-h-[175px] rounded-xl relative overflow-hidden transition-all duration-300 transform border flex flex-col justify-between ${
                  isFirst 
                    ? 'bg-gradient-to-br from-blue-50/30 to-blue-50/10 border-blue-300 dark:from-blue-950/40 dark:to-blue-950/10 dark:border-blue-900 shadow-md hover:shadow-lg hover:-translate-y-1' 
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-gray-800/90 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Elevated high-contrast statutory percentage badge - perfectly aligned and clear to the human eye */}
                <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-md text-xs font-black font-mono border select-none shadow-3xs transition-all duration-200 ${
                  isFirst
                    ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:text-white'
                    : 'bg-slate-550/10 text-slate-800 border-slate-250 dark:bg-gray-900 dark:text-indigo-300 dark:border-gray-700'
                }`}>
                  {inst.cumulativePercent}%
                </div>
                
                <div>
                  <div className="flex items-center gap-1.5 pr-14">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isFirst ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {inst.title}
                    </span>
                    {isFirst && (
                      <span className="text-[8px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5 animate-pulse">
                        {t("Next")}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-800 font-extrabold mt-1.5 block font-mono dark:text-gray-200">{inst.date}</p>
                </div>
                
                <div className="mt-4 flex-1 flex flex-col justify-end">
                  <div>
                    <span className="text-[9px] uppercase font-black text-gray-400 block dark:text-gray-500 tracking-wider">{t("Cumulative target payment:")}</span>
                    <p className="text-[15px] font-black text-gray-900 font-mono dark:text-white mt-0.5">
                      ₹{formatNumber(Math.round(targetAmt))}
                    </p>
                  </div>
 
                  {/* Progress bar visual indicating cumulative target milestone */}
                  <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 dark:bg-gray-900 border border-slate-205/10">
                    <div 
                      className={`h-1.5 rounded-full ${
                        isFirst ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-400 dark:bg-slate-500'
                      }`} 
                      style={{ width: `${inst.cumulativePercent}%` }}
                    ></div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 dark:border-gray-750 pt-2.5 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-sans">
                    <span>{t("Liability target:")}</span>
                    <span className={`font-black font-mono text-[10px] ${
                      isFirst ? 'text-blue-600 dark:text-blue-450' : 'text-gray-650 dark:text-gray-300'
                    }`}>
                      {inst.cumulativePercent}% {t("claims")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Warning with Collapsible Toggle */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
          <div 
            onClick={() => setWarningOpen(!warningOpen)} 
            className="flex justify-between items-center cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-bold">
              <AlertCircle size={16} className="shrink-0 animate-pulse" />
              <span>{t("Compliance Warning Note - Delay Penalties")}</span>
            </div>
            <span className="text-amber-600 hover:text-amber-850 dark:text-amber-400">
              {warningOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
          
          {warningOpen && (
            <div className="mt-2 text-xs text-gray-650 dark:text-gray-300 leading-relaxed text-[11px] pl-6 animate-fadeIn">
              {t("Shortfalls in individual quarters (less than 12% in Q1, 36% in Q2, 75% in Q3, 100% in Q4) will trigger mandatory Section 234C simple interest Penalties of 1% per month on the deficit amount.")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
