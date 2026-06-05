import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { ShieldCheck, Crosshair, AlertCircle, RefreshCw, Layers, CheckCircle2, XCircle } from 'lucide-react';

interface ComplianceItem {
  id: string;
  category: string;
  provision: string;
  amount: number;
  dueDate: string;
  actualPaidDate: string;
  status: 'Compliant' | 'Disallowed' | 'Warning';
}

export const ComplianceTracker: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const [items, setItems] = useState<ComplianceItem[]>([
    { id: '1', category: 'MSME Outstanding Payables (Sec 43B(h))', provision: 'Requires payment within 15/45 days as per agreement', amount: 450000, dueDate: '2026-05-15', actualPaidDate: '2026-05-12', status: 'Compliant' },
    { id: '2', category: 'Employee Provident Fund Contribution', provision: 'Must clear before the 15th of preceding month', amount: 180000, dueDate: '2025-11-15', actualPaidDate: '2025-11-20', status: 'Disallowed' },
    { id: '3', category: 'GST Liability Outstanding', provision: 'Payment before the GSTR-3B filing due date', amount: 1250000, dueDate: '2026-06-20', actualPaidDate: '', status: 'Warning' },
    { id: '4', category: 'Advertising Contract Vendor (Sec 40A(3))', provision: 'Cash payment disallowed above ₹10,000 threshold', amount: 18000, dueDate: '2026-01-10', actualPaidDate: '2026-01-10', status: 'Disallowed' },
    { id: '5', category: 'TDS deduction on Professional Rent', provision: '30% disallowance under 40(a)(ia) if TDS missed', amount: 300000, dueDate: '2026-03-31', actualPaidDate: '2026-04-07', status: 'Compliant' },
  ]);

  const toggleStatus = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Compliant' ? 'Disallowed' : item.status === 'Disallowed' ? 'Warning' : 'Compliant';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const totalDisallowed = items
    .filter(i => i.status === 'Disallowed')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={18} />
          <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
            {t("Direct Tax Expense Audit Monitor (Section 43B / 40A)")}
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {t("Certain business expenditures are strictly disallowed during tax filings if they fail statutory compliance codes (for example, delayed payment of employee bonuses, PF, delayed payouts to MSMEs, or making large cash settlements). Check the audit status of your ledger vouchers below.")}
        </p>
      </div>

      {/* Compliance board split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Action Check list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 bg-gray-50 border-b border-slate-200 font-black text-gray-700 text-[10.5px] dark:bg-gray-901 dark:border-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {t("Statutory Expense Compliance Vouchers")}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-gray-700">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <span className="font-extrabold text-xs text-gray-800 dark:text-white block">{item.category}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold block uppercase tracking-wider">{item.provision}</span>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-gray-450 pt-1">
                    <span>{t("Due:")} {item.dueDate}</span>
                    {item.actualPaidDate && <span>{t("Paid:")} {item.actualPaidDate}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
                  <span className="font-black text-xs font-mono text-gray-800 dark:text-gray-200">₹{formatNumber(item.amount)}</span>
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`px-3 py-1 rounded text-[10px] uppercase font-black tracking-wider border select-none transition-all cursor-pointer ${
                      item.status === 'Compliant'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                        : item.status === 'Disallowed'
                        ? 'bg-red-50 text-red-705 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                        : 'bg-amber-50 text-amber-705 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}
                  >
                    {t(item.status)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Report Side metrics */}
        <div className="bg-slate-50 border border-slate-255 rounded-xl p-6 dark:bg-gray-901 dark:border-gray-750 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Crosshair className="text-red-600" size={15} />
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">{t("Tax Return Impact Audit")}</span>
            </div>
            <h4 className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">{t("Disallowed Expenditures sum")}</h4>
            
            <p className="text-2xl font-black font-mono text-red-600 dark:text-red-400 mt-4">
              ₹{formatNumber(totalDisallowed)}
            </p>

            <div className="mt-6 space-y-3.5 pt-5 border-t border-slate-200 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
              <div className="flex items-start gap-1.5 text-red-600 font-medium">
                <AlertCircle className="shrink-0 mt-0.5 animate-pulse" size={13} />
                <span>
                  {t("The sum above of disallowed expenditures will be dynamically added back to your taxable Net Operating Profit, thereby scaling up the corporate/individual tax base.")}
                </span>
              </div>
              <p>
                {t("Verify vouchers and complete pending statutory clearing by filling MSME dues or paying GSTR liabilities timely to maintain higher business profit deductions.")}
              </p>
            </div>
          </div>

          <button
            onClick={() => alert(t("Adding ₹" + formatNumber(totalDisallowed) + " back to corporate gross pre-tax income basis."))}
            className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} className="animate-spin-slow" />
            {t("Re-add Disallowance to Projections")}
          </button>
        </div>

      </div>

    </div>
  );
};
