
import React, { useMemo } from 'react';
import { Download, Printer, Search, Filter, AlertCircle, Info } from 'lucide-react';
import { ParsedVoucher, VoucherType } from '../../../app/types';

interface StockSubPageProps {
  title: string;
  description?: string;
  onExport: () => void;
  vouchers: ParsedVoucher[];
  reportType: string;
}

export const StockSubPage: React.FC<StockSubPageProps> = ({ title, description, onExport, vouchers, reportType }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const reportData = useMemo(() => {
    const itemMap = new Map<string, {
      name: string;
      stockIn: number;
      stockOut: number;
      lastDate: string;
      category: string;
      brand: string;
      hsn: string;
      uom: string;
      taxRate: number;
      valuation: number;
    }>();

    vouchers.forEach(v => {
      if (!v.items) return;
      v.items.forEach(item => {
        const name = String(item.name?.value || 'Unknown');
        if (!itemMap.has(name)) {
          itemMap.set(name, {
            name,
            stockIn: 0,
            stockOut: 0,
            lastDate: String(v.date?.value || ''),
            category: String(v.ledger?.value || 'General'),
            brand: 'Standard',
            hsn: String(item.hsn?.value || 'N/A'),
            uom: String(item.uom?.value || 'PCS'),
            taxRate: Number(item.taxRate?.value || 0),
            valuation: 0
          });
        }
        const record = itemMap.get(name)!;
        const qty = Number(item.quantity?.value || 0);
        const rate = Number(item.rate?.value || 0);
        
        if (v.type === VoucherType.Purchase || v.type === VoucherType.Receipt) {
          record.stockIn += qty;
          record.valuation += (qty * rate);
        } else if (v.type === VoucherType.Sales || v.type === VoucherType.Payment) {
          record.stockOut += qty;
        }
        
        if (String(v.date?.value || '') > record.lastDate) {
          record.lastDate = String(v.date?.value || '');
        }
      });
    });

    let list = Array.from(itemMap.values()).map(item => ({
      ...item,
      currentStock: item.stockIn - item.stockOut
    }));

    // Specific filters based on reportType
    if (reportType === 'negative') {
      list = list.filter(item => item.currentStock < 0);
    } else if (reportType === 'fast_moving') {
      list = list.sort((a, b) => b.stockOut - a.stockOut).slice(0, 10);
    } else if (reportType === 'slow_moving') {
      list = list.filter(item => item.stockOut === 0 && item.stockIn > 0);
    } else if (reportType === 'aging') {
      // Simple mockup aging
      list = list.map(item => ({ ...item, days: Math.floor(Math.random() * 180) }));
    }

    if (searchTerm) {
      list = list.filter(item => String(item.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return list;
  }, [vouchers, reportType, searchTerm]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{description}</p>}
        </div>
        <div className="flex space-x-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-9 pr-4 text-sm focus:border-transparent min-w-[200px]"
            />
          </div>
          <button 
            onClick={onExport}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300"
            title="Download Report"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-300"
            title="Print Report"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {reportData.length > 0 ? (
        <div className="overflow-x-auto border border-gray-100 rounded-xl dark:border-gray-800">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest">Item Name</th>
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest">Category</th>
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest text-right">In</th>
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest text-right">Out</th>
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest text-right">Balance</th>
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest">HSN</th>
                <th className="px-4 py-3 font-black text-gray-400 uppercase text-[9px] tracking-widest text-right">Tax (%)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-100">{item.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide dark:text-gray-400">{item.category}</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-mono dark:text-gray-300">{item.stockIn}</td>
                  <td className="px-4 py-3 text-right text-gray-600 font-mono dark:text-gray-300">{item.stockOut}</td>
                  <td className={`px-4 py-3 text-right font-bold font-mono ${item.currentStock < 0 ? 'text-red-500' : 'text-blue-600'}`}>
                    {item.currentStock} {item.uom}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{item.hsn}</td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-indigo-500">{item.taxRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
             <Filter className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-100">{title} Ready for Processing</h3>
          <p className="text-gray-500 max-w-sm dark:text-gray-400">
            No transaction data found for this report type. Connect your live ERP or upload more vouchers to populate this data.
          </p>
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
             Sync Live Data
          </button>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl flex items-start">
        <Info className="text-indigo-500 mr-3 shrink-0" size={18} />
        <p className="text-[10px] text-indigo-700 font-medium leading-relaxed uppercase tracking-wider">
          AI INSIGHT: This report is dynamically generated from parsed vouchers and may differ from your book balances if all transactions are not imported.
        </p>
      </div>
    </div>
  );
};
