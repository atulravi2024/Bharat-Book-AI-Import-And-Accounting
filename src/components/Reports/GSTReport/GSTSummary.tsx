import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ParsedVoucher, VoucherType } from '../../../app/types';
import { 
  TrendingUp, TrendingDown, Layers, Activity, FileCode, CheckCircle2, 
  HelpCircle, RefreshCw, AlertCircle, Calculator, ShieldCheck, ArrowRight,
  Info
} from 'lucide-react';

interface GSTSummaryProps {
  vouchers: ParsedVoucher[];
}

export const GSTSummary: React.FC<GSTSummaryProps> = ({ vouchers }) => {
  const { t, formatNumber } = useLanguage();
  const [reconciling, setReconciling] = useState(false);
  const [showApiPreview, setShowApiPreview] = useState(false);
  const [activeJsonTab, setActiveJsonTab] = useState<'request' | 'response'>('request');
  const [defaults, setDefaults] = useState<any>(null);

  // Fetch customizable Fallbacks/Templates dynamically from JSON configuration
  useEffect(() => {
    fetch('/sample-data/reports/gst_summary_defaults.json')
      .then(res => res.json())
      .then(data => setDefaults(data))
      .catch(err => console.error('Failed to load GST summary dynamic defaults:', err));
  }, []);

  // Compute stats based on actual vouchers
  const stats = useMemo(() => {
    let salesValue = 0;
    let salesTax = 0;
    let salesCgst = 0;
    let salesSgst = 0;
    let salesIgst = 0;

    let purchaseValue = 0;
    let purchaseTax = 0;
    let purchaseCgst = 0;
    let purchaseSgst = 0;
    let purchaseIgst = 0;

    vouchers.forEach(v => {
      const isSalesType = v.type === VoucherType.Sales || v.type === VoucherType.DebitNote;
      const isCreditNote = v.type === VoucherType.CreditNote;
      const isPurchaseType = v.type === VoucherType.Purchase;
      
      const multiplier = isCreditNote ? -1 : 1;

      if (isSalesType || isCreditNote) {
        let amount = Number(v.amount?.value || 0) * multiplier;
        let tax = 0;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        if (v.items && v.items.length > 0) {
          tax = v.items.reduce((sum, item) => sum + Number(item.tax?.value || 0), 0) * multiplier;
          cgst = v.items.reduce((sum, item) => sum + Number(item.cgst?.value || 0), 0) * multiplier;
          sgst = v.items.reduce((sum, item) => sum + Number(item.sgst?.value || 0), 0) * multiplier;
          igst = v.items.reduce((sum, item) => sum + Number(item.igst?.value || 0), 0) * multiplier;
        } else {
          tax = amount - (amount / 1.18);
          const pNameStr = String(v.partyName?.value || '');
          const narrStr = String(v.narration?.value || '');
          if (pNameStr.includes('Inter-state') || narrStr.includes('Inter-state') || narrStr.includes('IGST') || narrStr.includes('Export')) {
            igst = tax;
          } else {
            cgst = tax / 2;
            sgst = tax / 2;
          }
        }

        salesValue += (amount - tax);
        salesTax += tax;
        salesCgst += cgst;
        salesSgst += sgst;
        salesIgst += igst;
      } else if (isPurchaseType) {
        let amount = Number(v.amount?.value || 0);
        let tax = 0;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        if (v.items && v.items.length > 0) {
          tax = v.items.reduce((sum, item) => sum + Number(item.tax?.value || 0), 0);
          cgst = v.items.reduce((sum, item) => sum + Number(item.cgst?.value || 0), 0);
          sgst = v.items.reduce((sum, item) => sum + Number(item.sgst?.value || 0), 0);
          igst = v.items.reduce((sum, item) => sum + Number(item.igst?.value || 0), 0);
        } else {
          tax = amount - (amount / 1.18);
          const pNameStr = String(v.partyName?.value || '');
          const narrStr = String(v.narration?.value || '');
          if (pNameStr.includes('Inter-state') || narrStr.includes('Inter-state') || narrStr.includes('IGST')) {
            igst = tax;
          } else {
            cgst = tax / 2;
            sgst = tax / 2;
          }
        }

        purchaseValue += (amount - tax);
        purchaseTax += tax;
        purchaseCgst += cgst;
        purchaseSgst += sgst;
        purchaseIgst += igst;
      }
    });

    // Make sure we have fallback values if vouchers are empty (for better aesthetic demo consistency)
    if (salesValue === 0) {
      salesValue = defaults?.fallbacks?.salesValue ?? 185000;
      salesTax = defaults?.fallbacks?.salesTax ?? 33300;
      salesCgst = defaults?.fallbacks?.salesCgst ?? 16650;
      salesSgst = defaults?.fallbacks?.salesSgst ?? 16650;
      salesIgst = defaults?.fallbacks?.salesIgst ?? 0;
    }
    if (purchaseValue === 0) {
      purchaseValue = defaults?.fallbacks?.purchaseValue ?? 95000;
      purchaseTax = defaults?.fallbacks?.purchaseTax ?? 17100;
      purchaseCgst = defaults?.fallbacks?.purchaseCgst ?? 8550;
      purchaseSgst = defaults?.fallbacks?.purchaseSgst ?? 8550;
      purchaseIgst = defaults?.fallbacks?.purchaseIgst ?? 0;
    }

    const netCgst = Math.max(0, salesCgst - purchaseCgst);
    const netSgst = Math.max(0, salesSgst - purchaseSgst);
    const netIgst = Math.max(0, salesIgst - purchaseIgst);
    const netLiability = netCgst + netSgst + netIgst;

    return {
      salesValue,
      salesTax,
      salesCgst,
      salesSgst,
      salesIgst,
      purchaseValue,
      purchaseTax,
      purchaseCgst,
      purchaseSgst,
      purchaseIgst,
      netCgst,
      netSgst,
      netIgst,
      netLiability
    };
  }, [vouchers, defaults]);

  // Handle manual Simulation of portal reconciliation
  const triggerReconciliation = () => {
    setReconciling(true);
    setTimeout(() => {
      setReconciling(false);
    }, 1500);
  };

  // Raw API JSON generator
  const sampleJsonRequest = {
    gstin: defaults?.apiPayloadTemplates?.gstin ?? "27AAAFB6318C1Z4",
    fp: defaults?.apiPayloadTemplates?.fp ?? "062026",
    version: defaults?.apiPayloadTemplates?.version ?? "GSTR1_API_v2.1",
    summary: {
      b2b_sales_val: stats.salesValue,
      cgst_payable: stats.salesCgst,
      sgst_payable: stats.salesSgst,
      igst_payable: stats.salesIgst,
      itc_eligible_cgst: stats.purchaseCgst,
      itc_eligible_sgst: stats.purchaseSgst,
    },
    invoices: vouchers.map((v, idx) => ({
      inv_no: v.invoiceNumber?.value || `INV-2026-${String(idx + 1).padStart(3, '0')}`,
      inv_date: v.date?.value || "05-06-2026",
      val: Number(v.amount?.value || 0),
      pos: "27",
      rchrg: "N",
      itms: v.items?.map((item, i) => ({
        num: i + 1,
        itm_det: {
          rt: Number(item.taxRate?.value || 18),
          txval: Number(item.total?.value || 0) - Number(item.tax?.value || 0),
          camt: Number(item.cgst?.value || 0),
          samt: Number(item.sgst?.value || 0),
        }
      }))
    })).slice(0, 2) // Just slice first 2 for demonstration
  };

  const sampleJsonResponse = defaults?.apiPayloadTemplates?.response ?? {
    status: "SUCCESS",
    code: "GSTR1_VAL_000",
    message: "GSTR-1 schema validation success. Ready to transmit with OTP authentication.",
    data: {
      referenceId: "REF-9831948123-C",
      arn: "AL270526019485C",
      acknowledgement_date: "2026-06-05T02:40:00Z",
      mismatch_count: 0,
      auto_reconciled_percentage: "100%"
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ⚠️ Technical Demo Mode Context Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 dark:bg-amber-950/20 dark:border-amber-900/40">
        <div className="flex gap-3">
          <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              ⚠️ {t("UI Simulation Overview")}
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
              {t("GST Summary Sandbox Banner Alert")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Outward Credit */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md dark:bg-indigo-950/40 dark:text-indigo-400">
              {t("Outward Liability")}
            </span>
            <TrendingUp size={18} className="text-indigo-600" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-tight">{t("Sales Taxable Value")}</p>
          <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">
            ₹{formatNumber(stats.salesValue, { minimumFractionDigits: 2 })}
          </p>
          <div className="border-t border-gray-100 dark:border-gray-750 mt-3 pt-3 flex justify-between text-xs text-gray-500">
            <span>CGST: ₹{formatNumber(stats.salesCgst, { minimumFractionDigits: 2 })}</span>
            <span>SGST: ₹{formatNumber(stats.salesSgst, { minimumFractionDigits: 2 })}</span>
            <span>IGST: ₹{formatNumber(stats.salesIgst, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Input Tax Credit */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md dark:bg-emerald-950/40 dark:text-emerald-400">
              {t("Inward ITC")}
            </span>
            <TrendingDown size={18} className="text-emerald-600" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-tight">{t("Eligible Input Credit")}</p>
          <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">
            ₹{formatNumber(stats.purchaseTax, { minimumFractionDigits: 2 })}
          </p>
          <div className="border-t border-gray-100 dark:border-gray-750 mt-3 pt-3 flex justify-between text-xs text-gray-500">
            <span>CGST: ₹{formatNumber(stats.purchaseCgst, { minimumFractionDigits: 2 })}</span>
            <span>SGST: ₹{formatNumber(stats.purchaseSgst, { minimumFractionDigits: 2 })}</span>
            <span>IGST: ₹{formatNumber(stats.purchaseIgst, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Net Cash Payable */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md dark:bg-rose-950/40 dark:text-rose-400">
              {t("Net GSTR-3B")}
            </span>
            <Calculator size={18} className="text-rose-600" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-tight">{t("Expected Ledger Cash Liability")}</p>
          <p className="text-xl font-bold font-mono text-rose-600 mt-1">
            ₹{formatNumber(stats.netLiability, { minimumFractionDigits: 2 })}
          </p>
          <div className="border-t border-gray-100 dark:border-gray-750 mt-3 pt-3 flex justify-between text-xs text-gray-500">
            <span>CGST: ₹{formatNumber(stats.netCgst, { minimumFractionDigits: 2 })}</span>
            <span>SGST: ₹{formatNumber(stats.netSgst, { minimumFractionDigits: 2 })}</span>
            <span>IGST: ₹{formatNumber(stats.netIgst, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Reconciliation Comparison Status Meter */}
      <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-blue-600 animate-pulse" />
              {t("GSTR-1 Vs GSTR-2B Auto-Reconciliation Report")}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {t("Matches sales record with supplier uploaded purchases to prevent double taxation leaks.")}
            </p>
          </div>
          <button 
            onClick={triggerReconciliation}
            disabled={reconciling}
            className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-all cursor-pointer dark:border-blue-900/60 dark:text-blue-400"
          >
            <RefreshCw size={12} className={reconciling ? "animate-spin" : ""} />
            {reconciling ? t("Reconciling...") : t("Run AutoMatch Audit")}
          </button>
        </div>

        {/* Progress Bar Display */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-500 uppercase">{t("Books Reconciliation Accuracy Score")}</span>
            <span className="text-emerald-600 font-mono">100.00% {t("Sync Accuracy")}</span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden dark:bg-gray-700">
            <div className="bg-emerald-500 h-full rounded-full w-[100%] transition-all duration-1000" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-[11px] text-gray-500 border-t border-gray-100 dark:border-gray-750 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t("Full Match:")} <strong>{vouchers.length || 7} {t("Invoices")}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
              <span>{t("Mismatch / Partially Paid:")} <strong>0 {t("Records")}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
              <span>{t("Missing Supplier PAN:")} <strong>0 {t("Issues Found")}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Government GSP Schema API Viewer */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden font-mono text-xs text-gray-300">
        <div className="bg-gray-950 px-5 py-3 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
            <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] ml-2 flex items-center gap-1.5">
              <FileCode size={14} className="text-blue-500" />
              {t("GSTN Sandbox API Payload Simulator")}
            </span>
          </div>
          <div className="flex bg-gray-900 p-0.5 rounded-md border border-gray-800 gap-1 self-start sm:self-auto">
            <button
              onClick={() => setActiveJsonTab('request')}
              className={`px-3 py-1 rounded text-[10px] font-bold ${activeJsonTab === 'request' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t("GSP REQUEST SCHEMA")}
            </button>
            <button
              onClick={() => setActiveJsonTab('response')}
              className={`px-3 py-1 rounded text-[10px] font-bold ${activeJsonTab === 'response' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {t("GSTN API RESPONSE")}
            </button>
          </div>
        </div>

        <div className="p-5 max-h-[220px] overflow-y-auto overflow-x-auto text-blue-300 custom-scrollbar block">
          {activeJsonTab === 'request' ? (
            <pre className="whitespace-pre">{JSON.stringify(sampleJsonRequest, null, 2)}</pre>
          ) : (
            <pre className="whitespace-pre text-emerald-400">{JSON.stringify(sampleJsonResponse, null, 2)}</pre>
          )}
        </div>
        <div className="bg-gray-950/60 p-3 px-5 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
          <span>{t("Target URL:")} <code>POST https://sandbox.gspapi.co.in/gstr1/upload</code></span>
          <span className="flex items-center gap-1 text-emerald-500">
            <ShieldCheck size={12} className="stroke-[2.5]" /> {t("Sec-Signature Match")}
          </span>
        </div>
      </div>
    </div>
  );
};
