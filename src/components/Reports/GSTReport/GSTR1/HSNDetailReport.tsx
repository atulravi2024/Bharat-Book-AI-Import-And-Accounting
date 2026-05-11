import React, { useState, useMemo } from 'react';
import { ParsedVoucher } from '../../../../types';
import { Search } from 'lucide-react';

interface HSNDetailReportProps {
  summary: {
    hsnData: any[];
    totalTaxable: number;
    totalTax: number;
  };
}

export const HSNDetailReport: React.FC<HSNDetailReportProps> = ({ summary }) => {
  const [filter, setFilter] = useState<'All' | 'B2B' | 'B2C'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHsn = useMemo(() => {
    return summary.hsnData.filter(h => {
      const matchesSearch = h.hsn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (h.desc || '').toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      if (filter === 'All') return true;
      if (filter === 'B2B') return h.type === 'B2B' || h.type === 'B2B Credit Note' || h.type === 'B2B Debit Note';
      if (filter === 'B2C') return h.type.includes('B2C') || h.type === 'B2C';
      return true;
    });
  }, [summary.hsnData, filter, searchTerm]);

  const b2bNormalHsn = filteredHsn.filter(h => h.type === 'B2B');
  const b2bCreditNoteHsn = filteredHsn.filter(h => h.type === 'B2B Credit Note');
  const b2bDebitNoteHsn = filteredHsn.filter(h => h.type === 'B2B Debit Note');
  const b2cHsn = filteredHsn.filter(h => h.type.includes('B2C') || h.type === 'B2C');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit dark:bg-gray-800">
          {['All', 'B2B', 'B2C'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt as any)}
              className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-tighter transition-all ${filter === opt ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} dark:bg-gray-800`}
            >
              {opt} Detail
            </button>
          ))}
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                type="text" 
                placeholder="Search HSN or Description..." 
                className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-all outline-none md:w-64 dark:bg-gray-900 dark:focus:bg-gray-700"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-8">
        {(filter === 'All' || filter === 'B2B') && b2bNormalHsn.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">B2B HSN SUMMARY</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100 dark:border-gray-800">
                                <th className="px-4 py-3">HSN Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-right">Qty</th>
                                <th className="px-4 py-3 text-right">Taxable</th>
                                <th className="px-4 py-3 text-right">Tax</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {b2bNormalHsn.map((h, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{h.hsn}</td>
                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px] dark:text-gray-400" title={h.desc}>{h.desc || '-'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{h.qty} {h.uom}</td>
                                    <td className="px-4 py-3 text-right">₹{h.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-green-600">₹{h.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {(filter === 'All' || filter === 'B2B') && b2bCreditNoteHsn.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">B2B CREDIT NOTE HSN SUMMARY</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100 dark:border-gray-800">
                                <th className="px-4 py-3">HSN Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-right">Qty</th>
                                <th className="px-4 py-3 text-right">Taxable</th>
                                <th className="px-4 py-3 text-right">Tax</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {b2bCreditNoteHsn.map((h, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-4 py-3 font-mono font-bold text-red-600">{h.hsn}</td>
                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px] dark:text-gray-400" title={h.desc}>{h.desc || '-'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{h.qty} {h.uom}</td>
                                    <td className="px-4 py-3 text-right">₹{h.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-green-600">₹{h.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {(filter === 'All' || filter === 'B2B') && b2bDebitNoteHsn.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div className="px-4 py-2 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">B2B DEBIT NOTE HSN SUMMARY</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100 dark:border-gray-800">
                                <th className="px-4 py-3">HSN Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-right">Qty</th>
                                <th className="px-4 py-3 text-right">Taxable</th>
                                <th className="px-4 py-3 text-right">Tax</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {b2bDebitNoteHsn.map((h, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-4 py-3 font-mono font-bold text-purple-600">{h.hsn}</td>
                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px] dark:text-gray-400" title={h.desc}>{h.desc || '-'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{h.qty} {h.uom}</td>
                                    <td className="px-4 py-3 text-right">₹{h.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-green-600">₹{h.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {(filter === 'All' || filter === 'B2C') && b2cHsn.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">B2C HSN SUMMARY</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 font-bold uppercase border-b border-gray-100 dark:border-gray-800">
                                <th className="px-4 py-3">HSN Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-right">Qty</th>
                                <th className="px-4 py-3 text-right">Taxable</th>
                                <th className="px-4 py-3 text-right">Tax</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {b2cHsn.map((h, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{h.hsn}</td>
                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px] dark:text-gray-400" title={h.desc}>{h.desc || '-'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{h.qty} {h.uom}</td>
                                    <td className="px-4 py-3 text-right">₹{h.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-3 text-right text-green-600">₹{h.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {filteredHsn.length === 0 && (
            <div className="p-12 border-2 border-dashed rounded-2xl text-center text-gray-400 font-medium">
                No HSN records found for the selected filter and search.
            </div>
        )}
      </div>
    </div>
  );
};
