import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Layers, RefreshCw, ChevronUp, ChevronDown, CheckCircle2, Sliders, Check } from 'lucide-react';

interface TaxLossRecord {
  id: string;
  sourceFy: string;
  lossHeads: string;
  openingAmount: number;
  availableSetOff: number;
  expiryFy: string;
}

export const TaxLossTracker: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const [infoOpen, setInfoOpen] = useState(true);

  // Simulated carried-forward loss ledgers
  const [losses, setLosses] = useState<TaxLossRecord[]>([
    { id: '1', sourceFy: 'FY 2022-23', lossHeads: t('Unabsorbed Business Loss (Sec 72)'), openingAmount: 850000, availableSetOff: 850000, expiryFy: 'AY 2031-32' },
    { id: '2', sourceFy: 'FY 2023-24', lossHeads: t('Short Term Capital Loss (Sec 74)'), openingAmount: 220000, availableSetOff: 120000, expiryFy: 'AY 2032-33' },
    { id: '3', sourceFy: 'FY 2024-25', lossHeads: t('Unabsorbed Depreciation allowance (Unlimited carry-forward)'), openingAmount: 1450000, availableSetOff: 1450000, expiryFy: t('No Expiry Limit') },
  ]);

  const [claimedSetoff, setClaimedSetoff] = useState<{ [key: string]: number }>({
    '1': 450000,
    '2': 0,
    '3': 0
  });

  const updateClaim = (id: string, maxAmt: number, val: number) => {
    const cleanVal = Math.min(maxAmt, Math.max(0, val));
    setClaimedSetoff(prev => ({ ...prev, [id]: cleanVal }));
  };

  const totalUsedSetoff = Object.values(claimedSetoff).reduce((sum, v) => sum + v, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Intro card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div 
          onClick={() => setInfoOpen(!infoOpen)}
          className="flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Sliders className="text-blue-600 dark:text-blue-400 animate-pulse" size={18} />
            <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
              {t("Carry-Forward & Set-Off of Losses Ledger (Sec 70-74)")}
            </h3>
          </div>
          <span className="text-gray-400">
            {infoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>

        {infoOpen && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-slate-100 pt-4 dark:border-gray-700 animate-fadeIn">
            {t("Direct tax laws allow businesses to reduce their current year's taxable profit by setting off losses that were incurred and registered in previous fiscal periods. Standard business losses can be carried forward for 8 consecutive assessment years, while unabsorbed depreciation enjoys an infinite lifecycle carry-forward benefit.")}
          </p>
        )}
      </div>

      {/* Main Ledger grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Losses Table lists */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 bg-gray-50 border-b border-slate-200 font-black text-gray-700 text-[10.5px] dark:bg-gray-901 dark:border-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {t("Carry-Forward Loss Ledgers & Active Set-Off Options")}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-[#f8fafc] text-gray-500 border-b border-slate-200 dark:bg-gray-900 dark:border-gray-750 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t("Source Year & Category")}</th>
                  <th className="px-5 py-3 font-semibold text-right">{t("Carried Balance Amount")}</th>
                  <th className="px-5 py-3 font-semibold text-right">{t("Max Available Set-off")}</th>
                  <th className="px-5 py-3 font-semibold text-right">{t("Regime Expiry")}</th>
                  <th className="px-5 py-3 text-center font-semibold">{t("Current Claim Set-Off (₹)")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                {losses.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-800 dark:text-white block">{record.lossHeads}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">{record.sourceFy}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-850 dark:text-gray-200 font-mono">
                      ₹{formatNumber(record.openingAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-blue-600 dark:text-indigo-400 font-mono">
                      ₹{formatNumber(record.availableSetOff)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-gray-500 dark:text-gray-400">
                      {record.expiryFy}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <input 
                        type="number"
                        value={claimedSetoff[record.id] ?? 0}
                        onChange={(e) => updateClaim(record.id, record.availableSetOff, parseInt(e.target.value) || 0)}
                        className="text-center w-28 p-1.5 font-mono text-xs font-bold border border-slate-200 dark:border-gray-700 rounded bg-transparent text-gray-850 dark:text-white focus:border-blue-500 text-right"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Set-off output result summary panel */}
        <div className="bg-slate-50 border border-slate-255 rounded-xl p-6 dark:bg-gray-901 dark:border-gray-750 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">{t("Reduction Allowance")}</span>
            <h4 className="text-sm font-black text-slate-800 dark:text-gray-150 uppercase tracking-wide">{t("Set-off Claimed Total")}</h4>
            <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-4 animate-scaleUp">
              - ₹{formatNumber(totalUsedSetoff)}
            </p>

            <p className="text-xs text-slate-500 leading-relaxed mt-6 pt-5 border-t border-slate-200 dark:border-gray-800 dark:text-gray-400">
              {t("This declared set-off amount will be directly adjusted against your current fiscal year projected business profits, effectively lowering your core corporate tax liability.")}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-gray-800 space-y-3">
            <button 
              onClick={() => alert(t("The selected losses of ₹" + formatNumber(totalUsedSetoff) + " have been set off and applied against taxable net operational profit!"))}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              {t("Apply Loss Set-Off Base")}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
