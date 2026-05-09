import React from 'react';
import { ParsedVoucher, VoucherType } from '../../../../types';

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
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 px-1 dark:text-gray-400">Section Summaries</h3>
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
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest dark:text-gray-100">{groupType} SUMMARY</h3>
                <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold border border-gray-100 shadow-sm dark:bg-gray-800/80 dark:border-gray-800">
                    {groupInvoices.length} {groupInvoices.length === 1 ? 'Invoice' : 'Invoices'}
                </span>
              </div>
      
              <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="flex flex-col">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Taxable Value</p>
                  <p className="text-base font-bold text-gray-900 font-mono dark:text-white">₹{gTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Tax</p>
                  <p className="text-base font-bold text-green-600 font-mono">₹{gTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">CGST</p>
                  <p className="text-sm font-medium text-gray-700 font-mono dark:text-gray-200">₹{gCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">SGST</p>
                  <p className="text-sm font-medium text-gray-700 font-mono dark:text-gray-200">₹{gSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">IGST</p>
                  <p className="text-sm font-medium text-gray-700 font-mono dark:text-gray-200">₹{gIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
