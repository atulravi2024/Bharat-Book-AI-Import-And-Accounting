import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Wallet, Landmark, ArrowRight, CornerDownRight, RefreshCw, Loader2, Sparkles, AlertCircle, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { LedgerBalances, Liabilities, ChallanForm } from './types';

export const ELedgerSimulator: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [challanOpen, setChallanOpen] = useState(true);
  const [telemetryOpen, setTelemetryOpen] = useState(true);

  // Online Ledgers mock balances
  const [cashLedger, setCashLedger] = useState<LedgerBalances>({
    igst: 150000,
    cgst: 45000,
    sgst: 45000,
    cess: 0
  });

  const [creditLedger, setCreditLedger] = useState<LedgerBalances>({
    igst: 280000,
    cgst: 112000,
    sgst: 112000,
    cess: 12000
  });

  // Outstanding liabilities before offsets
  const [outstandingLiability, setOutstandingLiability] = useState<Liabilities>({
    igst: 180000,
    cgst: 68000,
    sgst: 68000
  });

  const [challanForm, setChallanForm] = useState<ChallanForm>({
    head: 'IGST',
    amt: '150000'
  });

  const [offsetConsole, setOffsetConsole] = useState<string[]>([
    "🟢 System Ready. Liabilities loaded.",
    "👉 Click 'Trigger Sec 49 Auto-Offset' to simulate legal offsets."
  ]);
  const [offsetApplied, setOffsetApplied] = useState(false);

  const handleGenChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmt = Number(challanForm.amt) || 0;
    if (depositAmt <= 0) return;

    setLoading(true);
    setTimeout(() => {
      const head = challanForm.head;
      if (head === 'IGST') {
        setCashLedger(prev => ({ ...prev, igst: prev.igst + depositAmt }));
      } else if (head === 'CGST') {
        setCashLedger(prev => ({ ...prev, cgst: prev.cgst + depositAmt }));
      } else if (head === 'SGST') {
        setCashLedger(prev => ({ ...prev, sgst: prev.sgst + depositAmt }));
      } else {
        setCashLedger(prev => ({ ...prev, cess: prev.cess + depositAmt }));
      }
      setLoading(false);
      setOffsetConsole(prev => [
        `🔵 [PMT-06 Deposit Receipt] Credited ₹${formatNumber(depositAmt)} into Electronic Cash Ledger (${head}).`,
        ...prev
      ]);
    }, 1000);
  };

  const triggerAutoOffset = () => {
    let consolLog: string[] = [];
    consolLog.push("🟢 Initiating Section 49 Auto-Reckoner Offset Sequence...");
    
    let pendingIgst = outstandingLiability.igst;
    let pendingCgst = outstandingLiability.cgst;
    let pendingSgst = outstandingLiability.sgst;

    let workingCredit = { ...creditLedger };
    let workingCash = { ...cashLedger };

    // STEP 1: Settle IGST Liability against IGST Credit
    if (pendingIgst > 0 && workingCredit.igst > 0) {
      const igstCharged = Math.min(pendingIgst, workingCredit.igst);
      pendingIgst -= igstCharged;
      workingCredit.igst -= igstCharged;
      consolLog.push(`✓ Submerged ₹${formatNumber(igstCharged)} IGST liability against IGST input credit.`);
    }

    // STEP 2: IGST credit can absorb CGST or SGST
    if (workingCredit.igst > 0) {
      if (pendingCgst > 0) {
        const cgstAbsorbed = Math.min(pendingCgst, workingCredit.igst);
        pendingCgst -= cgstAbsorbed;
        workingCredit.igst -= cgstAbsorbed;
        consolLog.push(`✓ Allocated ₹${formatNumber(cgstAbsorbed)} IGST residual credit to Central Tax (CGST) liability.`);
      }
      if (pendingSgst > 0 && workingCredit.igst > 0) {
        const sgstAbsorbed = Math.min(pendingSgst, workingCredit.igst);
        pendingSgst -= sgstAbsorbed;
        workingCredit.igst -= sgstAbsorbed;
        consolLog.push(`✓ Allocated ₹${formatNumber(sgstAbsorbed)} IGST leftover credit to State Tax (SGST) liability.`);
      }
    }

    // STEP 3: CGST Liability offset against CGST Credit
    if (pendingCgst > 0 && workingCredit.cgst > 0) {
      const cgstSelf = Math.min(pendingCgst, workingCredit.cgst);
      pendingCgst -= cgstSelf;
      workingCredit.cgst -= cgstSelf;
      consolLog.push(`✓ Offset ₹${formatNumber(cgstSelf)} CGST liability against CGST credit ledger.`);
    }

    // STEP 4: SGST Liability offset against SGST Credit
    if (pendingSgst > 0 && workingCredit.sgst > 0) {
      const sgstSelf = Math.min(pendingSgst, workingCredit.sgst);
      pendingSgst -= sgstSelf;
      workingCredit.sgst -= sgstSelf;
      consolLog.push(`✓ Offset ₹${formatNumber(sgstSelf)} SGST liability against SGST credit ledger.`);
    }

    // STEP 5: Settle leftover liabilities using online cash balances
    if (pendingIgst > 0 && workingCash.igst > 0) {
      const paidIgsh = Math.min(pendingIgst, workingCash.igst);
      pendingIgst -= paidIgsh;
      workingCash.igst -= paidIgsh;
      consolLog.push(`✓ Settled remaining IGST ₹${formatNumber(paidIgsh)} with Electronic Cash balances.`);
    }

    if (pendingCgst > 0 && workingCash.cgst > 0) {
      const paidCgsh = Math.min(pendingCgst, workingCash.cgst);
      pendingCgst -= paidCgsh;
      workingCash.cgst -= paidCgsh;
      consolLog.push(`✓ Settled remaining CGST ₹${formatNumber(paidCgsh)} with Central Cash balances.`);
    }

    if (pendingSgst > 0 && workingCash.sgst > 0) {
      const paidSgsh = Math.min(pendingSgst, workingCash.sgst);
      pendingSgst -= paidSgsh;
      workingCash.sgst -= paidSgsh;
      consolLog.push(`✓ Settled remaining SGST ₹${formatNumber(paidSgsh)} with State Cash balances.`);
    }

    // Update working balances
    setCreditLedger(workingCredit);
    setCashLedger(workingCash);
    setOutstandingLiability({ igst: pendingIgst, cgst: pendingCgst, sgst: pendingSgst });

    consolLog.push("🏆 Section 49 ledger reconciliation offset complete.");
    setOffsetConsole(consolLog);
    setOffsetApplied(true);
  };

  const resetAllSimulator = () => {
    setCashLedger({ igst: 150000, cgst: 45000, sgst: 45000, cess: 0 });
    setCreditLedger({ igst: 280000, cgst: 112000, sgst: 112000, cess: 12000 });
    setOutstandingLiability({ igst: 180000, cgst: 68000, sgst: 68000 });
    setOffsetConsole([
      "🟢 System Reset. Liabilities reloaded.",
      "👉 Click 'Trigger Sec 49 Auto-Offset' to simulate legal offsets."
    ]);
    setOffsetApplied(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 flex items-center dark:text-gray-100">
          <Wallet className="mr-2 text-indigo-600 animate-pulse" size={24} />
          {t("e-Ledger Sandbox Console & Simulator")}
        </h2>
        <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">
          {t("Simulate Section 49 statutory offset protocols. Post online challan cash additions, offset ITC claims credit logs, and run auto-offset engines.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ledgers Overview Card Controls (Left, 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-extrabold text-[#2f3542] text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 dark:text-indigo-400">
              <Landmark size={15} />
              {t("Online Electronic GST Ledgers Balance Sheets")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cash Ledger */}
              <div className="p-4 bg-indigo-50/20 rounded-xl border border-indigo-200 dark:bg-gray-900 dark:border-gray-700">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#2f3542] dark:text-indigo-400">{t("Electronic Cash Ledger")}</span>
                <p className="text-[9.5px] text-gray-400 mt-0.5">{t("Remited cash for tax, interest & penalty offsets.")}</p>
                <div className="space-y-2 mt-4 font-mono text-[11px]">
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500">IGST:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(cashLedger.igst)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500">CGST:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(cashLedger.cgst)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500">SGST:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(cashLedger.sgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CESS:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(cashLedger.cess)}</span>
                  </div>
                </div>
                <div className="border-t pt-2 mt-3 text-right">
                  <span className="text-[9.5px] uppercase font-bold text-indigo-705 dark:text-indigo-400 mr-2">{t("Net Deposit:")}</span>
                  <span className="text-xs font-bold text-indigo-700 font-mono">
                    ₹{formatNumber(cashLedger.igst + cashLedger.cgst + cashLedger.sgst + cashLedger.cess)}
                  </span>
                </div>
              </div>

              {/* Credit Ledger */}
              <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-200 dark:bg-gray-900 dark:border-gray-700">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-900 dark:text-emerald-450">{t("Electronic Credit Ledger (ITC)")}</span>
                <p className="text-[9.5px] text-gray-400 mt-0.5">{t("Reconciled GSTR-2B Input Tax Credits claims.")}</p>
                <div className="space-y-2 mt-4 font-mono text-[11px]">
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500">IGST:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(creditLedger.igst)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500">CGST:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(creditLedger.cgst)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500">SGST:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(creditLedger.sgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CESS:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">₹{formatNumber(creditLedger.cess)}</span>
                  </div>
                </div>
                <div className="border-t pt-2 mt-3 text-right">
                  <span className="text-[9.5px] uppercase font-bold text-emerald-700 dark:text-emerald-400 mr-2">{t("Net ITC Credit:")}</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    ₹{formatNumber(creditLedger.igst + creditLedger.cgst + creditLedger.sgst + creditLedger.cess)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Challan Generator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div 
              onClick={() => setChallanOpen(!challanOpen)} 
              className="flex justify-between items-center cursor-pointer select-none mb-3 hover:opacity-85"
            >
              <h3 className="font-extrabold text-[#2f3542] text-xs uppercase tracking-wider dark:text-indigo-400">{t("Form PMT-06 Sandbox Cash Challan Deposit")}</h3>
              <span className="text-slate-400">
                {challanOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </span>
            </div>
            
            {challanOpen && (
              <form onSubmit={handleGenChallan} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-fadeIn">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500">{t("Target Tax Head Account")}</label>
                  <select
                    value={challanForm.head}
                    onChange={(e) => setChallanForm({ ...challanForm, head: e.target.value as any })}
                    className="w-full text-xs font-bold mt-1 px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-white outline-hidden focus:border-indigo-500 border-slate-200"
                  >
                    <option value="IGST">Integrated Tax (IGST)</option>
                    <option value="CGST">Central Tax (CGST)</option>
                    <option value="SGST">State Tax (SGST)</option>
                    <option value="Cess">Cess Levy (Cess)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500">{t("Deposit Amount (₹)")}</label>
                  <input
                    type="number"
                    value={challanForm.amt}
                    onChange={(e) => setChallanForm({ ...challanForm, amt: e.target.value })}
                    required
                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-white outline-hidden focus:border-indigo-500 border-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                  {t("Deposit via Sandbox NetBanking")}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* System Offset Engine Console (Right, 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Outstanding Liabilities Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-extrabold text-[#2f3542] text-xs uppercase tracking-wider mb-3 dark:text-indigo-400">{t("Form GSTR-3B Monthly Liabilities Draft")}</h3>
            
            <div className="divide-y text-xs font-mono dark:divide-gray-700">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">{t("Integrated Tax IGST Liability:")}</span>
                <span className={`font-bold ${outstandingLiability.igst > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>₹{formatNumber(outstandingLiability.igst)}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">{t("Central Tax CGST Liability:")}</span>
                <span className={`font-bold ${outstandingLiability.cgst > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>₹{formatNumber(outstandingLiability.cgst)}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">{t("State Tax SGST Liability:")}</span>
                <span className={`font-bold ${outstandingLiability.sgst > 0 ? 'text-rose-500' : 'text-emerald-605'}`}>₹{formatNumber(outstandingLiability.sgst)}</span>
              </div>
              <div className="flex justify-between py-2.5 border-t font-black pt-3">
                <span className="font-sans font-bold text-gray-800 dark:text-gray-200">{t("Outstanding Net Obligations:")}</span>
                <span className={`font-mono text-sm ${outstandingLiability.igst + outstandingLiability.cgst + outstandingLiability.sgst > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{formatNumber(outstandingLiability.igst + outstandingLiability.cgst + outstandingLiability.sgst)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={triggerAutoOffset}
                disabled={outstandingLiability.igst + outstandingLiability.cgst + outstandingLiability.sgst === 0 && offsetApplied}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles size={13} />
                {t("Trigger Sec 49 Auto-Offset")}
              </button>
              <button
                type="button"
                onClick={resetAllSimulator}
                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-slate-200 text-gray-500 rounded-lg text-xs transition dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
                title={t("Reset Liabilities Simulation values")}
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Console logger */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-inner">
            <div 
              onClick={() => setTelemetryOpen(!telemetryOpen)}
              className="flex justify-between items-center cursor-pointer select-none mb-2 border-b border-gray-800 pb-1.5"
            >
              <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-1.5">
                <span>{t("SYSTEM AUTO-RECKONER TELEMETRY LOGS")}</span>
                <span className="animate-ping w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              </h4>
              <span className="text-gray-500 hover:text-gray-300">
                {telemetryOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </span>
            </div>
            
            {telemetryOpen && (
              <div className="space-y-1.5 font-mono text-[10px] text-gray-305 max-h-[160px] overflow-y-auto leading-relaxed animate-fadeIn">
                {offsetConsole.map((line, i) => (
                  <div key={i} className="flex gap-2 text-left">
                    <span className="text-gray-600 flex-shrink-0 animate-pulse">$&gt;</span>
                    <span className="text-gray-300 select-all">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
