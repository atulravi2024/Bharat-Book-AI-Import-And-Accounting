import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, BarChart3, TrendingUp, Sparkles, Scale, AlertCircle,
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import { TaxTab, TaxRegime } from '../types';

interface KpiDashboardViewProps {
  grossProfit: number;
  taxRegime: TaxRegime;
  taxRatePercent: number;
  totalTaxComputed: number;
  outstandingAdvanceTax: number;
  matchedTdsTotal: number;
  netTaxableIncome: number;
  setActiveTab: (tab: TaxTab) => void;
  formatNumber: (num: number) => string;
}

export const KpiDashboardView: React.FC<KpiDashboardViewProps> = ({
  grossProfit,
  taxRegime,
  taxRatePercent,
  totalTaxComputed,
  outstandingAdvanceTax,
  matchedTdsTotal,
  netTaxableIncome,
  setActiveTab,
  formatNumber,
}) => {
  const { t } = useLanguage();
  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const [ledgerOpen, setLedgerOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(true);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Sub-header Info Alert inside page */}
      {showInfoAlert && (
        <div className="p-4 bg-blue-50/45 border border-blue-200/50 rounded-xl flex items-start justify-between gap-3 px-4 py-3.5 dark:bg-blue-950/15 dark:border-blue-900/40 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <Sparkles className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={17} />
            <div>
              <h4 className="text-xs font-black uppercase text-blue-800 dark:text-blue-300 tracking-wider">
                {t("Tax Executive Analytics Center")}
              </h4>
              <p className="text-[11.5px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {t("This consolidated panel processes active sandbox calculations on gross receipts, statutory regime offsets, and outstanding advance liabilities. Modify coefficients in specific modules to assess real-time recalculations.")}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setShowInfoAlert(false)}
            className="text-gray-400 hover:text-gray-650 cursor-pointer p-0.5"
            title={t("Dismiss banner")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Grid of the 4 Key Performance Indicators (KPIs) with increased height and outstanding high-contrast fidelity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI Card 1: Projected Revenue */}
        <div 
          onClick={() => setActiveTab('tax-projection')}
          className="p-4 sm:p-5 lg:p-6 min-h-[160px] bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl text-left shadow-xs hover:shadow-md hover:-translate-y-1 transform transition-all duration-300 ease-out dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t("Projected Total Revenue")}</span>
              <TrendingUp size={14} className="text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 font-mono break-all">₹{formatNumber(grossProfit)}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] text-gray-500 dark:text-gray-400 border-t border-slate-100 dark:border-gray-750 pt-3">
            <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">{t("prev. quarters cumulative")}</span>
            <span className="bg-emerald-50 text-emerald-750 px-2.5 py-0.5 rounded-full font-black font-mono text-[11px] border border-emerald-200 inline-flex items-center dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 shadow-2xs">
              ↑ 12.0%
            </span>
          </div>
        </div>

        {/* KPI Card 2: Active Regime */}
        <div 
          onClick={() => setActiveTab('tax-projection')}
          className="p-4 sm:p-5 lg:p-6 min-h-[160px] bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl text-left shadow-xs hover:shadow-md hover:-translate-y-1 transform transition-all duration-300 ease-out dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t("Active Tax Regime")}</span>
              <ShieldCheck size={14} className="text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm sm:text-base font-black text-slate-800 dark:text-gray-100 mt-2 leading-snug">
              {taxRegime === 'sec115baa' ? t('Section 115BAA') : t('Regular Corporate')}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] text-blue-600 dark:text-blue-400 font-bold border-t border-slate-100 dark:border-gray-750 pt-3">
            <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-0.5">{t("Effective multiplier")}</span>
            <span className="bg-blue-50 text-blue-750 px-2.5 py-0.5 rounded-full font-black font-mono text-[11px] border border-blue-200 inline-flex items-center dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 shadow-2xs font-sans">
              {taxRatePercent}%
            </span>
          </div>
        </div>

        {/* KPI Card 3: Computed Liability */}
        <div 
          onClick={() => setActiveTab('tax-projection')}
          className="p-4 sm:p-5 lg:p-6 min-h-[160px] bg-white border border-slate-205 border-l-4 border-l-rose-500 rounded-xl text-left shadow-xs hover:shadow-md hover:-translate-y-1 transform transition-all duration-300 ease-out dark:bg-gray-800 dark:border-gray-750 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t("Computed Total Tax Liability")}</span>
              <Scale size={14} className="text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-500 mt-2 font-mono break-all">₹{formatNumber(totalTaxComputed)}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] text-gray-500 dark:text-gray-400 border-t border-slate-100 dark:border-gray-750 pt-3">
            <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">{t("Tax weight ratio")}</span>
            <span className="bg-rose-50 text-rose-750 px-2.5 py-0.5 rounded-full font-black font-mono text-[11px] border border-rose-200 inline-flex items-center dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 shadow-2xs font-sans">
              {(grossProfit > 0 ? ((totalTaxComputed / grossProfit) * 100).toFixed(1) : '0')}%
            </span>
          </div>
        </div>

        {/* KPI Card 4: Advance Tax Outstanding */}
        <div 
          onClick={() => setActiveTab('advance-tax')}
          className="p-4 sm:p-5 lg:p-6 min-h-[160px] bg-white border border-slate-205 border-l-4 border-l-indigo-600 rounded-xl text-left shadow-xs hover:shadow-md hover:-translate-y-1 transform transition-all duration-300 ease-out dark:bg-gray-800 dark:border-gray-705 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t("Advance Tax Outstanding")}</span>
              <CheckCircle2 size={14} className="text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-400 mt-2 font-mono break-all">₹{formatNumber(outstandingAdvanceTax)}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] text-indigo-600 dark:text-indigo-350 font-semibold border-t border-slate-100 dark:border-gray-750 pt-3">
            <span className="text-[9.5px] font-bold text-gray-400 tracking-wider uppercase flex items-center gap-0.5">{t("Unpaid margin due")}</span>
            <span className="bg-indigo-50 text-indigo-750 px-2.5 py-0.5 rounded-full font-black font-mono text-[11px] border border-indigo-200 inline-flex items-center dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50 shadow-2xs font-sans">
              {(totalTaxComputed > 0 ? Math.round((outstandingAdvanceTax / totalTaxComputed) * 100) : 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Row & Navigation shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Math reconciliation model ledger card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between overflow-hidden">
          <div>
            <div 
              onClick={() => setLedgerOpen(!ledgerOpen)} 
              className="flex justify-between items-center cursor-pointer pb-2 hover:opacity-85 select-none"
            >
              <h3 className="text-xs font-black uppercase text-gray-800 dark:text-indigo-400 tracking-wider flex items-center gap-2 font-sans">
                <BarChart3 size={15} className="text-indigo-600" />
                {t("Pro-forma Analytics Reconciliation Ledger")}
              </h3>
              <span className="text-slate-400">
                {ledgerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            
            {ledgerOpen && (
              <div className="animate-fadeIn">
                <p className="text-[11px] text-gray-400 mb-5 leading-relaxed">
                  {t("Detailed math pipeline showing regulatory deductions offsets and cumulative Credits from matched TDS registries.")}
                </p>
                
                <div className="space-y-3.5 font-mono text-xs text-gray-650 dark:text-gray-300">
                  <div className="flex justify-between border-b border-dashed pb-2.5 dark:border-gray-750 border-slate-150">
                    <span className="text-gray-500">{t("Gross Operational Receipts (Sales + Other):")}</span>
                    <span className="font-extrabold text-gray-850 dark:text-gray-100">₹{formatNumber(grossProfit)}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-2.5 dark:border-gray-750 border-slate-150">
                    <span className="text-gray-500">{t("(-) Gross Permitted Exemptions (Deductions):")}</span>
                    <span className="text-rose-500 font-extrabold">₹{formatNumber(grossProfit - netTaxableIncome)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2.5 dark:border-gray-750 border-slate-150 font-bold">
                    <span className="text-gray-850 dark:text-gray-100 font-sans">{t("Computed Taxable Profit base:")}</span>
                    <span className="text-gray-800 dark:text-white">₹{formatNumber(netTaxableIncome)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2.5 dark:border-gray-750 border-slate-150">
                    <span className="text-gray-500">{t("Regime Effective Multiplier Coefficient:")}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">{taxRatePercent}%</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed pb-2.5 dark:border-gray-750 border-slate-150 font-bold">
                    <span className="text-gray-500 font-sans">{t("Gross Simulated Corporate Liability:")}</span>
                    <span className="text-rose-500 font-black">₹{formatNumber(Math.round(totalTaxComputed))}</span>
                  </div>
                  <div className="flex justify-between pb-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="font-sans font-medium">{t("(-) Deducted Credit Offset (TDS Form 26AS):")}</span>
                    <span>₹{formatNumber(matchedTdsTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {ledgerOpen && (
            <div className="mt-6 border-t border-slate-150 dark:border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 p-3 rounded-lg dark:bg-gray-900/30 animate-fadeIn">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                {t("Audit Status: Live sandbox verified against Section 199 database policies.")}
              </span>
              <div className="font-mono text-xs font-black text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-md">
                <span>{t("Net Advance Tax:")}</span>
                <span>₹{formatNumber(Math.round(outstandingAdvanceTax))}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Module Navigation Pathways (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-205 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between overflow-hidden">
          <div>
            <div 
              onClick={() => setModulesOpen(!modulesOpen)} 
              className="flex justify-between items-center cursor-pointer pb-2 hover:opacity-85 select-none"
            >
              <h3 className="text-xs font-black uppercase text-gray-800 dark:text-indigo-400 tracking-wider flex items-center gap-1.5 font-sans">
                <Sparkles size={15} className="text-blue-600" />
                {t("Explore Corporate Modules")}
              </h3>
              <span className="text-slate-400">
                {modulesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            
            {modulesOpen && (
              <div className="animate-fadeIn">
                <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
                  {t("Navigate directly to workspace modules to manage active parameters and submit legislative forms.")}
                </p>

                <div className="space-y-3">
                  {/* Path 1: Advance Tax */}
                  <div 
                    onClick={() => setActiveTab('advance-tax')}
                    className="p-3 border border-slate-150 hover:border-blue-300 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-all dark:border-gray-700 dark:hover:bg-gray-900/40 group font-sans"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-855 dark:text-white">{t("Advance Tax Calendar Planner")}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{t("Review 4 quarterly statutory payment milestones.")}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-440 group-hover:text-blue-500 group-hover:translate-x-1 transform transition-all" />
                  </div>

                  {/* Path 2: Projections */}
                  <div 
                    onClick={() => setActiveTab('tax-projection')}
                    className="p-3 border border-slate-150 hover:border-blue-300 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-all dark:border-gray-700 dark:hover:bg-gray-900/40 group font-sans"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-855 dark:text-white">{t("Recalculate Projections Engine")}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{t("Adjust gross sales, OPEX, and flat corporate regimes.")}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-440 group-hover:text-blue-500 group-hover:translate-x-1 transform transition-all" />
                  </div>

                  {/* Path 3: TDS matching */}
                  <div 
                    onClick={() => setActiveTab('tds-ledger')}
                    className="p-3 border border-slate-150 hover:border-blue-300 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-all dark:border-gray-700 dark:hover:bg-gray-900/40 group font-sans"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-855 dark:text-white">{t("Reconcile TDS Ledger claims")}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{t("Audit Traces Form 26AS matching registry counts.")}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-440 group-hover:text-blue-500 group-hover:translate-x-1 transform transition-all" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {modulesOpen && (
            <div className="mt-5 p-3 rounded-lg bg-indigo-50/30 border border-indigo-100 dark:bg-slate-900/50 dark:border-gray-750 flex items-start gap-2 text-[10px] text-gray-500 leading-normal font-sans animate-fadeIn">
              <AlertCircle className="text-indigo-500 shrink-0 mt-0.5" size={13} />
              <span>
                {t("These active calculations are computed on standard coefficients. Taxpayers are advised to cross reference with official GST portal records.")}
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
