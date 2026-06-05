import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { VoucherType } from '../../../../../app/types';
import { 
  TaxIcon, 
  InventoryIcon, 
  MapIcon, 
  VouchersIcon, 
  AccountIcon, 
  SortIcon, 
  CategoryIcon, 
  BrandIcon, 
  UomIcon 
} from '../../../../icons/IconComponents';

interface TaxComplianceSelectionGridProps {
  voucherType: VoucherType;
  setVoucherType: (type: VoucherType) => void;
  taxSampleType?: 'with_data' | 'without_data';
  setTaxSampleType?: (type: 'with_data' | 'without_data') => void;
}

export const TaxComplianceSelectionGrid: React.FC<TaxComplianceSelectionGridProps> = ({
  voucherType,
  setVoucherType,
  taxSampleType = 'with_data',
  setTaxSampleType,
}) => {
  const { t } = useLanguage();

  const taxItems = [
    { type: VoucherType.GSTR1, label: 'GSTR-1 (Outward Supplies Summary)', icon: TaxIcon, color: 'text-blue-600 bg-blue-50/50 border-blue-100', accent: 'bg-blue-600' },
    { type: VoucherType.GSTR3B, label: 'GSTR-3B (Monthly Self-Declared Summary)', icon: InventoryIcon, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100', accent: 'bg-indigo-600' },
    { type: VoucherType.GSTR2A, label: 'GSTR-2A (Dynamic Inward Feed)', icon: MapIcon, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', accent: 'bg-emerald-600' },
    { type: VoucherType.GSTR2B, label: 'GSTR-2B (Static Auto-drafted ITC)', icon: VouchersIcon, color: 'text-purple-600 bg-purple-50/50 border-purple-100', accent: 'bg-purple-600' },
    { type: VoucherType.GSTR9, label: 'GSTR-9 (GST Annual Return)', icon: AccountIcon, color: 'text-amber-600 bg-amber-50/50 border-amber-100', accent: 'bg-amber-600' },
    { type: VoucherType.GSTR9A, label: 'GSTR-9A (Composition Annual)', icon: SortIcon, color: 'text-rose-600 bg-rose-50/50 border-rose-100', accent: 'bg-rose-600' },
    { type: VoucherType.GSTR9B, label: 'GSTR-9B (E-commerce Annual)', icon: CategoryIcon, color: 'text-slate-600 bg-slate-50/50 border-slate-100', accent: 'bg-slate-600' },
    { type: VoucherType.GSTR9C, label: 'GSTR-9C (Reconciliation Report)', icon: BrandIcon, color: 'text-pink-600 bg-pink-50/50 border-pink-100', accent: 'bg-pink-600' },
    { type: VoucherType.GSTR4, label: 'GSTR-4 (Composition Annual Return)', icon: TaxIcon, color: 'text-cyan-600 bg-cyan-50/50 border-cyan-100', accent: 'bg-cyan-600' },
    { type: VoucherType.GSTR4A, label: 'GSTR-4A (Composition Inward Auto-drafted)', icon: MapIcon, color: 'text-teal-600 bg-teal-50/50 border-teal-100', accent: 'bg-teal-600' },
    { type: VoucherType.GSTR4B, label: 'GSTR-4B (Composition Inward Register)', icon: VouchersIcon, color: 'text-violet-600 bg-violet-50/50 border-violet-100', accent: 'bg-violet-600' },
    { type: VoucherType.CMP08, label: 'CMP-08 (Composition Quarterly Challan)', icon: UomIcon, color: 'text-orange-600 bg-orange-50/50 border-orange-100', accent: 'bg-orange-600' }
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-3">
          <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white shrink-0">
            {t("GST Return & Compliance Formats")}
          </label>
          <div className="hidden sm:block h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("Data Mode")}:</span>
            <select
              id="tax-sample-type-select-header"
              value={taxSampleType}
              onChange={(e) => setTaxSampleType && setTaxSampleType(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-extrabold focus:ring-1 focus:ring-blue-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-750 dark:text-white cursor-pointer transition-all"
            >
              <option value="without_data">{t("Blank (Default)")}</option>
              <option value="with_data">{t("Preferred (Sample with Mock Data)")}</option>
            </select>
          </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {taxItems.map((item) => (
          <button
            key={item.type}
            onClick={() => setVoucherType(item.type)}
            className={`group flex flex-col items-center justify-center p-5 rounded-[1.25rem] border transition-all duration-500 relative overflow-hidden cursor-pointer ${
              voucherType === item.type 
                ? `${item.color} ring-1 ring-offset-4 ring-blue-500/30 border-transparent shadow-[0_15px_30px_rgba(59,130,246,0.15)] scale-[1.03] z-10 font-bold` 
                : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:bg-premium-slate-50 hover:text-blue-600 active:scale-95 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${voucherType === item.type ? `w-full ${item.accent}` : 'w-0 bg-blue-400'}`}></div>
            <item.icon className={`text-2xl mb-3 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 ${voucherType === item.type ? 'scale-110 -translate-y-0.5 text-blue-600' : ''}`} />
            <span className="text-[12px] font-black text-gray-900 dark:text-gray-100 group-hover:text-blue-600 truncate max-w-full px-1">{item.type}</span>
            <p className="text-[10px] text-gray-400 mt-1 text-center line-clamp-1">{t(item.label)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
