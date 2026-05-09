import React, { useMemo, useState } from 'react';
import { ParsedVoucher, VoucherType } from '../../../../types';
import { Search } from 'lucide-react';

interface InvoiceDetailReportProps {
  vouchers: ParsedVoucher[];
}

export const InvoiceDetailReport: React.FC<InvoiceDetailReportProps> = ({ vouchers }) => {
  const [viewFilter, setViewFilter] = useState<'Both' | 'Party' | 'Invoice'>('Both');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVouchers = useMemo(() => {
    if (!searchTerm) return vouchers;
    const term = searchTerm.toLowerCase();
    return vouchers.filter(v => 
      String(v.partyName?.value || '').toLowerCase().includes(term) ||
      String(v.invoiceNumber?.value || '').toLowerCase().includes(term) ||
      String(v.narration?.value || '').toLowerCase().includes(term)
    );
  }, [vouchers, searchTerm]);

  const partyWiseData = useMemo(() => {
    const map = new Map<string, { party: string, count: number, taxable: number, tax: number, total: number, cgst: number, sgst: number, igst: number }>();
    
    filteredVouchers.forEach(v => {
      const party = String(v.partyName?.value || 'Unknown Party');
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

      if (!map.has(party)) {
        map.set(party, { party, count: 0, taxable: 0, tax: 0, total: 0, cgst: 0, sgst: 0, igst: 0 });
      }
      const record = map.get(party)!;
      record.count += 1;
      record.taxable += taxable;
      record.tax += tax;
      record.total += total;
      record.cgst += cgst;
      record.sgst += sgst;
      record.igst += igst;
    });
    
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredVouchers]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit dark:bg-gray-800">
          {['Both', 'Party', 'Invoice'].map((opt) => (
            <button
              key={opt}
              onClick={() => setViewFilter(opt as any)}
              className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-tighter transition-all ${viewFilter === opt ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
            >
              {opt === 'Both' ? 'Show All' : opt + ' Wise'}
            </button>
          ))}
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                type="text" 
                placeholder="Search Invoice, Party, or Narration..." 
                className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-all outline-none md:w-80 dark:bg-gray-900 dark:focus:bg-gray-700"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Party Wise Summary */}
      {(viewFilter === 'Both' || viewFilter === 'Party') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 dark:text-gray-400">Party-wise Aggregated Details</h3>
            <span className="text-[10px] font-bold text-gray-400">{partyWiseData.length} Parties matching</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-800">
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <th className="px-4 py-3">Party Name</th>
                            <th className="px-4 py-3 text-center">Inv Count</th>
                            <th className="px-4 py-3 text-right">Taxable Value</th>
                            <th className="px-4 py-3 text-right">GST (Total)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {partyWiseData.map((d, i) => (
                            <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight dark:text-white">{d.party}</div>
                                </td>
                                <td className="px-4 py-3 text-center font-bold bg-gray-50/30 text-blue-600">{d.count}</td>
                                <td className="px-4 py-3 text-right font-mono">₹{d.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-4 py-3 text-right font-mono text-green-600">₹{d.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </section>
      )}

      {/* Invoice Details Table */}
      {(viewFilter === 'Both' || viewFilter === 'Invoice') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 dark:text-gray-400">GSTR1 Invoice level Report</h3>
            <span className="text-[10px] font-bold text-gray-400">{filteredVouchers.length} Invoices Found</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md dark:bg-gray-800 dark:border-gray-800">
              <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                      <thead>
                          <tr className="bg-gray-900 text-white font-bold uppercase">
                              <th className="px-4 py-4 border-r border-gray-800">Date</th>
                              <th className="px-4 py-4 border-r border-gray-800">Inv No.</th>
                              <th className="px-4 py-4 border-r border-gray-800">Party / Particulars</th>
                              <th className="px-4 py-4 text-right border-r border-gray-800">Taxable</th>
                              <th className="px-4 py-4 text-right border-r border-gray-800 text-green-400">GST</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {filteredVouchers.map(v => {
                               const isCreditNote = v.type === VoucherType.CreditNote;
                               const sign = isCreditNote ? -1 : 1;
                               const amount = Number(v.amount?.value || 0) * sign;
                               let tax = 0;
                               let total = amount;
                               if (v.items && v.items.length > 0) {
                                  tax = v.items.reduce((sum, item) => sum + Number(item.tax?.value || 0), 0) * sign;
                                  total = v.items.reduce((sum, item) => sum + Number(item.total?.value || 0), 0) * sign;
                               } else {
                                  tax = total - (total / 1.18);
                               }
                               const taxable = total - tax;

                               return (
                                  <tr key={v.id} className="hover:bg-blue-50/30 transition-colors">
                                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 font-medium dark:text-gray-400">{String(v.date?.value || '-')}</td>
                                      <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">{String(v.invoiceNumber?.value || v.id.split('-')[0])}</td>
                                      <td className="px-4 py-3">
                                          <div className="font-bold text-gray-800 uppercase tracking-tight dark:text-gray-100">{String(v.partyName?.value || '-')}</div>
                                          <div className="text-[10px] text-gray-400 truncate max-w-xs">{String(v.narration?.value || '-')}</div>
                                      </td>
                                      <td className="px-4 py-3 text-right font-mono">₹{taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                      <td className="px-4 py-3 text-right font-mono text-green-600">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                  </tr>
                               );
                          })}
                      </tbody>
                  </table>
                  {filteredVouchers.length === 0 && (
                    <div className="p-12 text-center text-gray-400 font-medium bg-white dark:bg-gray-800">
                      No invoices match the current search filters.
                    </div>
                  )}
              </div>
          </div>
        </section>
      )}
    </div>
  );
};
