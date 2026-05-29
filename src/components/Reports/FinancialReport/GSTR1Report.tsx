import { useLanguage } from '../../../context/LanguageContext';
import React from 'react';
import { ParsedVoucher, VoucherType } from '../../../app/types';

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

interface GSTR1ReportProps {
  summary: GSTR1Summary;
}

export const GSTR1Report: React.FC<GSTR1ReportProps> = ({ summary }) => {
  const { t, formatNumber  } = useLanguage();

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="form-grid gap-6">
        {['B2B', 'B2B Credit Note', 'B2B Debit Note', 'B2C Small', 'B2C Large', 'Export', 'Exempt'].map((groupType) => {
          const groupInvoicesUntyped = summary.groupedInvoices[groupType];
          if (!groupInvoicesUntyped || groupInvoicesUntyped.length === 0) return null;
          
          const groupInvoices = groupInvoicesUntyped as ParsedVoucher[];
          
          return (
            <div key={groupType} className="bg-white border rounded-xl shadow-sm overflow-hidden mb-6 flex flex-col dark:bg-gray-800">
              <div 
                  className="px-4 py-3 border-b flex justify-between items-center" 
                  style={{ backgroundColor: groupType.includes('B2B') ? '#eef2ff' : groupType.includes('B2C') ? '#fff7ed' : groupType.includes('Export') ? '#d1fae5' : groupType.includes('Exempt') ? '#f3f4f6' : '#f9fafb' }}
              >
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider dark:text-gray-100">
                  {groupType === 'B2B Credit Note' ? 'B2B Credit Notes' : 
                   groupType === 'B2B Debit Note' ? 'B2B Debit Notes' : 
                   `${groupType} Invoices`} Summary
                </h3>
              </div>
      
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Type")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Date/No.")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Party/Particulars")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Taxable Value")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("CGST")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("SGST")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("IGST")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Total Tax")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {groupInvoices.map(v => {
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
                      const taxable = total - tax;
      
                      return (
                        <tr key={v.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                              groupType === 'B2B' ? 'bg-indigo-100 text-indigo-700' :
                              groupType === 'B2B Credit Note' ? 'bg-red-100 text-red-700' :
                              groupType === 'B2B Debit Note' ? 'bg-purple-100 text-purple-700' :
                              groupType === 'B2C Large' ? 'bg-orange-100 text-orange-700' :
                              groupType === 'B2C Small' ? 'bg-yellow-100 text-yellow-700' :
                              groupType === 'Export' ? 'bg-emerald-100 text-emerald-700' :
                              groupType === 'Exempt' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                            } dark:bg-gray-800 dark:text-gray-200`}>
                              {groupType === 'B2B Credit Note' ? 'B2B CN' : 
                               groupType === 'B2B Debit Note' ? 'B2B DN' : groupType}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900 dark:text-white">{String(v.date?.value || '-')}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5 dark:text-gray-400">{String(v.invoiceNumber?.value || v.id.split('-')[0])}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900 dark:text-white">{String(v.partyName?.value || '-')}</div>
                            <div className="text-[11px] text-gray-500 max-w-xs truncate mt-0.5 dark:text-gray-400" title={String(v.narration?.value || '-')}>
                              {String(v.narration?.value || '-')}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm">₹{formatNumber(Number(taxable), { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-gray-600 dark:text-gray-300">₹{formatNumber(Number(cgst), { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-gray-600 dark:text-gray-300">₹{formatNumber(Number(sgst), { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-gray-600 dark:text-gray-300">₹{formatNumber(Number(igst), { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-mono text-sm font-medium text-green-600">₹{formatNumber(Number(tax), { minimumFractionDigits: 2 })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {groupInvoices.map(v => {
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
                  const taxable = total - tax;

                  return (
                    <div key={v.id} className="p-4 flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold mb-1 ${
                            groupType === 'B2B' ? 'bg-indigo-100 text-indigo-700' :
                            groupType === 'B2B Credit Note' ? 'bg-red-100 text-red-700' :
                            groupType === 'B2B Debit Note' ? 'bg-purple-100 text-purple-700' :
                            groupType === 'B2C Large' ? 'bg-orange-100 text-orange-700' :
                            groupType === 'B2C Small' ? 'bg-yellow-100 text-yellow-700' :
                            groupType === 'Export' ? 'bg-emerald-100 text-emerald-700' :
                            groupType === 'Exempt' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                          } dark:bg-gray-800 dark:text-gray-200`}>
                            {groupType === 'B2B Credit Note' ? 'B2B CN' : 
                             groupType === 'B2B Debit Note' ? 'B2B DN' : groupType}
                          </span>
                          <div className="font-bold text-gray-900 dark:text-white">{String(v.partyName?.value || '-')}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 border px-2 py-1 rounded-md bg-gray-50 dark:text-white dark:bg-gray-900">{String(v.invoiceNumber?.value || v.id.split('-')[0])}</div>
                          <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">{String(v.date?.value || '-')}</div>
                        </div>
                      </div>
                      
                      <div className="form-grid bg-gray-50 p-3 rounded-lg gap-3 text-sm dark:bg-gray-900">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold uppercase dark:text-gray-400">{t("Taxable Value")}</span>
                          <span className="font-medium">₹{formatNumber(Number(taxable), { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <div className="form-grid border border-gray-100 p-3 rounded-lg gap-3 text-sm dark:border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold uppercase dark:text-gray-400">{t("CGST")}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-200">₹{formatNumber(Number(cgst), { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-gray-500 font-bold uppercase dark:text-gray-400">{t("SGST")}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-200">₹{formatNumber(Number(sgst), { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex flex-col mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-[10px] text-gray-500 font-bold uppercase dark:text-gray-400">{t("IGST")}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-200">₹{formatNumber(Number(igst), { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex flex-col text-right mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-[10px] text-gray-500 font-bold uppercase dark:text-gray-400">{t("Total Tax")}</span>
                          <span className="font-bold text-gray-900 dark:text-white">₹{formatNumber(Number(tax), { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {Object.keys(summary.groupedInvoices).length === 0 && (
          <div className="bg-white border rounded-xl shadow-sm p-12 text-center text-gray-400 dark:bg-gray-800">{t("No sales transactions recorded for this period.")}</div>
        )}
        
        {Object.entries(summary.groupedHsnData).map(([groupType, groupHsnDataUntyped]) => {
          const groupHsnData = groupHsnDataUntyped as any[];
          return (
            <div key={groupType} className="bg-white border rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center dark:bg-gray-900">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider dark:text-gray-100">
                  HSN/SAC Summary for {
                    groupType === 'B2B Credit Note' ? 'B2B Credit Notes' : 
                    groupType === 'B2B Debit Note' ? 'B2B Debit Notes' : 
                    groupType
                  }
                </h3>
              </div>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b dark:bg-gray-900">
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("HSN/SAC")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Type")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">{t("Description")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Qty")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("UOM")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("Taxable Value")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("CGST")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("SGST")}</th>
                      <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">{t("IGST")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {groupHsnData.map((hsn, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                        <td className="px-4 py-3 font-mono font-medium text-blue-600">{hsn.hsn}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            hsn.type === 'B2B' ? 'bg-indigo-100 text-indigo-700' : 
                            hsn.type === 'B2B Credit Note' ? 'bg-red-100 text-red-700' :
                            hsn.type === 'B2B Debit Note' ? 'bg-purple-100 text-purple-700' :
                            String(hsn.type || '').includes('B2C') ? 'bg-orange-100 text-orange-700' :
                            hsn.type === 'Export' ? 'bg-emerald-100 text-emerald-700' :
                            hsn.type === 'Exempt' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                          } dark:bg-gray-800 dark:text-gray-200`}>
                            {hsn.type === 'B2B Credit Note' ? 'B2B CN' : 
                             hsn.type === 'B2B Debit Note' ? 'B2B DN' : hsn.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 truncate max-w-[150px] dark:text-gray-400" title={hsn.desc}>{hsn.desc || '-'}</td>
                        <td className="px-4 py-3 text-right font-medium">{hsn.qty}</td>
                        <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">{hsn.uom}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">₹{formatNumber(Number(hsn.taxable), { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">₹{formatNumber(Number(hsn.cgst), { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">₹{formatNumber(Number(hsn.sgst), { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">₹{formatNumber(Number(hsn.igst), { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {groupHsnData.map((hsn, idx) => (
                  <div key={idx} className="p-4 flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-blue-600">{hsn.hsn}</span>
                        <span className="text-gray-800 text-sm mt-1 dark:text-gray-100">{hsn.desc || '-'}</span>
                        <span className={`w-fit mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                          hsn.type === 'B2B' ? 'bg-indigo-100 text-indigo-700' : 
                          hsn.type === 'B2B Credit Note' ? 'bg-red-100 text-red-700' :
                          hsn.type === 'B2B Debit Note' ? 'bg-purple-100 text-purple-700' :
                          String(hsn.type || '').includes('B2C') ? 'bg-orange-100 text-orange-700' :
                          hsn.type === 'Export' ? 'bg-emerald-100 text-emerald-700' :
                          hsn.type === 'Exempt' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        } dark:bg-gray-800 dark:text-gray-200`}>
                          {hsn.type === 'B2B Credit Note' ? 'B2B CN' : 
                           hsn.type === 'B2B Debit Note' ? 'B2B DN' : hsn.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{hsn.qty} {hsn.uom}</span>
                      </div>
                    </div>
                    
                    <div className="form-grid bg-gray-50 p-3 rounded-lg gap-3 text-xs dark:bg-gray-900">
                      <div className="flex flex-col">
                        <span className="text-gray-500 font-bold uppercase dark:text-gray-400">{t("Taxable Value")}</span>
                        <span className="font-medium text-gray-900 dark:text-white">₹{formatNumber(Number(hsn.taxable), { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="form-grid gap-2 px-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">{t("CGST")}</span>
                        <span className="text-[10px] font-medium">₹{formatNumber(Number(hsn.cgst), { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">{t("SGST")}</span>
                        <span className="text-[10px] font-medium">₹{formatNumber(Number(hsn.sgst), { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">{t("IGST")}</span>
                        <span className="text-[10px] font-medium">₹{formatNumber(Number(hsn.igst), { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {Object.keys(summary.groupedHsnData).length === 0 && (
          <div className="bg-white border rounded-xl shadow-sm p-12 text-center text-gray-400 dark:bg-gray-800">{t("No HSN/SAC data available.")}</div>
        )}
      </div>
    </div>
  );
};
