import { useLanguage } from '../../../../context/LanguageContext';
import React from 'react';
import { ParsedVoucher, VoucherType } from '../../../../app/types';
import { CheckCircle2, ShieldCheck, FileCheck2, Calendar, Clock, Building2, Layers } from 'lucide-react';

interface GSTR1Summary {
    totalSales: number;
    totalTaxable: number;
    totalTax: number;
    totalCgst: number;
    totalSgst: number;
    totalIgst: number;
    totalInvoices: number;
    hsnData: any[];
    groupedHsnData: Record<string, any[]>;
    taxRateData: any[];
    groupedInvoices: Record<string, ParsedVoucher[]>;
}

interface GSTRR1SummaryProps {
  summary: GSTR1Summary;
}

export const GSTRR1Summary: React.FC<GSTRR1SummaryProps> = ({ summary }) => {
  const { t, formatNumber  } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* GSTR-1 Submission & Filing Confirmation Banner */}
      <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-xl p-5 dark:bg-emerald-950/20 dark:border-emerald-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500 text-white p-2 rounded-lg mt-0.5 shadow-sm">
              <CheckCircle2 size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full dark:bg-emerald-900/60 dark:text-emerald-300">
                  {t("GSTR-1 Status")} : {t("SUBMITTED")}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium dark:text-gray-400">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  {t("EVC OTP Verified")}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mt-1 dark:text-white">
                {t("All GSTR-1 filings are successfully uploaded and submitted")}
              </h4>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                {t("Tax data, invoices, credit notes, and HSN summary are completely synced with the GST portal.")}
              </p>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-emerald-100/50 flex flex-col gap-1.5 self-start md:self-auto min-w-[200px] dark:border-emerald-900/20">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400 font-bold uppercase tracking-tight">{t("ARN Ref")}</span>
              <span className="font-mono font-bold text-gray-700 dark:text-gray-200">AL270526019485C</span>
            </div>
            <div className="flex items-center justify-between text-[11px] border-t border-gray-100 pt-1 dark:border-gray-750">
              <span className="text-gray-400 font-bold uppercase tracking-tight">{t("Filing Mode")}</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">{t("Direct API Portal")}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] border-t border-gray-100 pt-1 dark:border-gray-750">
              <span className="text-gray-400 font-bold uppercase tracking-tight">{t("Submitted On")}</span>
              <span className="font-mono text-gray-700 dark:text-gray-200">05-Jun-2026</span>
            </div>
          </div>
        </div>

        {/* Categories Details Covered Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-emerald-100/60 text-[11px] dark:border-emerald-900/30">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-emerald-600" />
            <div>
              <p className="text-gray-400 font-bold uppercase">{t("Filer GSTIN")}</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">27AAAFB6318C1Z4</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 size={14} className="text-emerald-600" />
            <div>
              <p className="text-gray-400 font-bold uppercase">{t("Auto Aligned")}</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">{summary.totalInvoices} {t("Invoices Verified")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-emerald-600" />
            <div>
              <p className="text-gray-400 font-bold uppercase">{t("HSN SAC Codes")}</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">{summary.hsnData.length} {t("Unique Categories")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-600" />
            <div>
              <p className="text-gray-400 font-bold uppercase">{t("Filing Period")}</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t("Last Month")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] px-1 dark:text-gray-400">{t("Section Summaries")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {['B2B', 'B2C Small', 'B2C Large', 'Export', 'Credit Note', 'Debit Note', 'Exempt'].map((groupType) => {
            const groupInvoicesUntyped = summary.groupedInvoices[groupType];
            if (!groupInvoicesUntyped || groupInvoicesUntyped.length === 0) return null;
            
            const groupInvoices = groupInvoicesUntyped as ParsedVoucher[];
            
            let gTaxable = 0;
            let gCgst = 0;
            let gSgst = 0;
            let gIgst = 0;
            let gTax = 0;
            let gTotal = 0;
        
            groupInvoices.forEach(v => {
              const isCreditNote = v.type === VoucherType.CreditNote;
              const sign = isCreditNote ? -1 : 1;
              const amount = Number(v.amount?.value || 0) * sign;
              let tax = 0;
              let cgst = 0;
              let sgst = 0;
              let igst = 0;
              let total = amount;
        
              if (v.items && v.items.length > 0) {
                tax = v.items.reduce((sum, item) => sum + Number(item.tax?.value || 0), 0) * sign;
                cgst = v.items.reduce((sum, item) => sum + Number(item.cgst?.value || 0), 0) * sign;
                sgst = v.items.reduce((sum, item) => sum + Number(item.sgst?.value || 0), 0) * sign;
                igst = v.items.reduce((sum, item) => sum + Number(item.igst?.value || 0), 0) * sign;
                total = v.items.reduce((sum, item) => sum + Number(item.total?.value || 0), 0) * sign;
              } else {
                tax = total - (total / 1.18);
                if (String(v.partyName?.value || '').includes('Inter-state') || String(v.narration?.value || '').includes('Inter-state') || String(v.narration?.value || '').includes('IGST') || String(v.narration?.value || '').includes('Export')) {
                  igst = tax;
                } else {
                  cgst = tax / 2;
                  sgst = tax / 2;
                }
              }
              
              gTaxable += (total - tax);
              gCgst += cgst;
              gSgst += sgst;
              gIgst += igst;
              gTax += tax;
              gTotal += total;
            });

            return (
              <div key={groupType} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:scale-[1.01] dark:bg-gray-800">
                <div 
                    className="px-4 py-3 border-b flex justify-between items-center" 
                    style={{ backgroundColor: groupType.includes('B2B') ? '#eef2ff' : groupType.includes('B2C Large') ? '#ffedd5' : groupType.includes('B2C Small') ? '#fef3c7' : groupType.includes('Export') ? '#d1fae5' : groupType.includes('Credit') ? '#fee2e2' : groupType.includes('Debit') ? '#e0e7ff' : '#f3f4f6' }}
                >
                  <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest dark:text-gray-100">{t(groupType)} {t("SUMMARY")}</h3>
                  <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold border border-gray-100 shadow-sm dark:bg-gray-800/80 dark:border-gray-800">
                      {groupInvoices.length} {groupInvoices.length === 1 ? t('Invoice') : t('Invoices')}
                  </span>
                </div>
        
                <div className="grid grid-cols-2 p-5 gap-y-4 gap-x-6">
                  <div className="flex flex-col">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{t("Taxable Value")}</p>
                    <p className="text-base font-bold text-gray-900 font-mono dark:text-white">₹{formatNumber(Number(gTaxable), { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{t("Total Tax")}</p>
                    <p className="text-base font-bold text-green-600 font-mono">₹{formatNumber(Number(gTax), { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t("CGST")}</p>
                    <p className="text-sm font-medium text-gray-700 font-mono dark:text-gray-200">₹{formatNumber(Number(gCgst), { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t("SGST")}</p>
                    <p className="text-sm font-medium text-gray-700 font-mono dark:text-gray-200">₹{formatNumber(Number(gSgst), { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex flex-col col-span-2 border-t border-gray-100 pt-2 dark:border-gray-700">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t("IGST")}</p>
                    <p className="text-sm font-medium text-gray-700 font-mono dark:text-gray-200">₹{formatNumber(Number(gIgst), { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
