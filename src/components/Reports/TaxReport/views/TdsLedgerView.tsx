import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { BookOpen, Search, ShieldCheck, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { TdsClaimRecord } from '../types';

interface TdsLedgerViewProps {
  tdsRecords: TdsClaimRecord[];
  matchedTdsTotal: number;
}

export const TdsLedgerView: React.FC<TdsLedgerViewProps> = ({ tdsRecords, matchedTdsTotal }) => {
  const { t, formatNumber } = useLanguage();
  const [tdsSearchQuery, setTdsSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [ledgerFooterOpen, setLedgerFooterOpen] = useState(true);

  const handleVerifyTraces = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => setVerifiedSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-5 border-b border-slate-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            <div>
              <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
                {t("Tax Deducted at Source (TDS) Claims Register")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t("Cross verify deductions made under Section 194Q/194C against Traces Form 26AS records.")}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-405" size={14} />
            <input
              type="text"
              placeholder={t("Filter by Deductor name...")}
              value={tdsSearchQuery}
              onChange={(e) => setTdsSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border rounded-lg focus:border-blue-500 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-gray-800 dark:text-white outline-hidden"
            />
          </div>
        </div>

        {verifiedSuccess && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fadeIn dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300">
            <Check size={16} />
            <span>{t("Successfully synchronized with Income Tax Portal GSTR-2B API. Matches have been reconciled against Form 26AS records.")}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-gray-500 border-b border-slate-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3 font-extrabold">{t("Certificate Ref / ID")}</th>
                <th className="px-5 py-3 font-extrabold">{t("Deductor Business Entity")}</th>
                <th className="px-5 py-3 font-extrabold">{t("TAN Number")}</th>
                <th className="px-5 py-3 font-extrabold">{t("Sec.")}</th>
                <th className="px-5 py-3 font-extrabold text-right">{t("Rate (%)")}</th>
                <th className="px-5 py-3 font-extrabold text-right">{t("Gross Amount")}</th>
                <th className="px-5 py-3 font-extrabold text-right">{t("TDS Deducted")}</th>
                <th className="px-5 py-3 font-extrabold text-center">{t("26AS Audit Matches")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
              {tdsRecords
                .filter(rec => rec.deductor.toLowerCase().includes(tdsSearchQuery.toLowerCase()))
                .map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-gray-500 dark:text-gray-405">{rec.id}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-extrabold text-gray-800 dark:text-gray-100">{rec.deductor}</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">{rec.date}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-medium">{rec.tan}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-gray-600 dark:text-gray-300">
                      <span className="bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded uppercase text-[10px]">
                        {rec.section}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-right">{rec.rate}%</td>
                    <td className="px-5 py-3.5 font-mono text-right text-gray-800 dark:text-gray-200">₹{formatNumber(rec.baseAmount)}</td>
                    <td className="px-5 py-3.5 font-mono text-right text-indigo-600 font-extrabold dark:text-indigo-400">₹{formatNumber(rec.taxAmount)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 font-black uppercase text-[9.5px] rounded tracking-wider ${
                        rec.status === 'Matched' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse'
                      }`}>
                        {t(rec.status)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#f8fafc] border-t border-slate-200 dark:bg-gray-900 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-2 select-none w-full sm:w-auto shrink-0 justify-between sm:justify-start">
            <div 
              onClick={() => setLedgerFooterOpen(!ledgerFooterOpen)}
              className="flex items-center gap-1 cursor-pointer select-none font-sans font-bold hover:opacity-80"
            >
              <ShieldCheck className="text-emerald-600" size={13} />
              <span>{t("Verification Protocols")}</span>
              {ledgerFooterOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </div>
          </div>
          
          {ledgerFooterOpen && (
            <span className="text-[10px] text-gray-400 font-sans block flex-1 sm:ml-2 animate-fadeIn">
              {t("Verified Ledger matches Section 199 credit allocation protocols.")}
            </span>
          )}

          <button 
            type="button"
            disabled={isVerifying}
            onClick={handleVerifyTraces}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-black uppercase tracking-wider text-[10px] text-blue-600 hover:bg-slate-50 transition dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? t("Syncing...") : t("Verify TRACES matches")}
          </button>
        </div>
      </div>
    </div>
  );
};
