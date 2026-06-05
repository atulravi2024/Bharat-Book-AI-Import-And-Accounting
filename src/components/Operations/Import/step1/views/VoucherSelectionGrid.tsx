import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { VoucherType } from '../../../../../app/types';
import { 
  InventoryIcon, 
  TaxIcon, 
  AccountIcon, 
  VouchersIcon, 
  CategoryIcon, 
  UndoIcon, 
  MapIcon 
} from '../../../../icons/IconComponents';

interface VoucherSelectionGridProps {
  importCategory: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other';
  voucherType: VoucherType;
  setVoucherType: (type: VoucherType) => void;
}

export const VoucherSelectionGrid: React.FC<VoucherSelectionGridProps> = ({
  importCategory,
  voucherType,
  setVoucherType,
}) => {
  const { t } = useLanguage();

  const voucherItems = [
    { type: VoucherType.Purchase, icon: InventoryIcon, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', accent: 'bg-emerald-600', category: 'transaction_voucher' },
    { type: VoucherType.Sales, icon: TaxIcon, color: 'text-blue-600 bg-blue-50/50 border-blue-100', accent: 'bg-blue-600', category: 'transaction_voucher' },
    { type: VoucherType.Payment, icon: AccountIcon, color: 'text-purple-600 bg-purple-50/50 border-purple-100', accent: 'bg-purple-600', category: 'transaction_voucher' },
    { type: VoucherType.Receipt, icon: VouchersIcon, color: 'text-amber-600 bg-amber-50/50 border-amber-100', accent: 'bg-amber-600', category: 'transaction_voucher' },
    { type: VoucherType.Journal, icon: CategoryIcon, color: 'text-slate-600 bg-slate-50/50 border-slate-100', accent: 'bg-slate-600', category: 'transaction_voucher' },
    { type: VoucherType.Contra, icon: UndoIcon, color: 'text-rose-600 bg-rose-50/50 border-rose-100', accent: 'bg-rose-600', category: 'transaction_voucher' },
    { type: VoucherType.CreditNote, icon: UndoIcon, color: 'text-teal-600 bg-teal-50/50 border-teal-100', accent: 'bg-teal-600', category: 'transaction_voucher' },
    { type: VoucherType.DebitNote, icon: UndoIcon, color: 'text-pink-600 bg-pink-50/50 border-pink-100', accent: 'bg-pink-600', category: 'transaction_voucher' },

    { type: VoucherType.StockJournal, icon: CategoryIcon, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100', accent: 'bg-emerald-600', category: 'item_voucher' },
    { type: VoucherType.PhysicalStock, icon: InventoryIcon, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100', accent: 'bg-indigo-600', category: 'item_voucher' },
    { type: VoucherType.ItemConsumption, icon: TaxIcon, color: 'text-rose-600 bg-rose-50/50 border-rose-100', accent: 'bg-rose-600', category: 'item_voucher' },
    { type: VoucherType.ItemScrap, icon: UndoIcon, color: 'text-orange-600 bg-orange-50/50 border-orange-100', accent: 'bg-orange-600', category: 'item_voucher' },
    { type: VoucherType.Interlocation, icon: MapIcon, color: 'text-sky-600 bg-sky-50/50 border-sky-100', accent: 'bg-sky-600', category: 'item_voucher' },
    { type: VoucherType.RejectionIn, icon: UndoIcon, color: 'text-teal-600 bg-teal-50/50 border-teal-100', accent: 'bg-teal-600', category: 'item_voucher' },
    { type: VoucherType.RejectionOut, icon: UndoIcon, color: 'text-pink-600 bg-pink-50/50 border-pink-100', accent: 'bg-pink-600', category: 'item_voucher' },
  ];

  const filteredItems = voucherItems.filter(item => importCategory === 'voucher' || item.category === importCategory);

  return (
    <>
      <div className="flex items-center justify-between mb-5 px-1">
        <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">
          {importCategory === 'transaction_voucher' 
            ? t("Commercial & Accounting Vouchers") 
            : importCategory === 'item_voucher' 
            ? t("Warehouse & Inventory-Only Vouchers") 
            : t("System Classification")}
        </label>
        <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <button
            key={item.type}
            onClick={() => setVoucherType(item.type)}
            className={`group flex flex-col items-center justify-center p-3.5 rounded-[1.25rem] border transition-all duration-500 relative overflow-hidden cursor-pointer ${
              voucherType === item.type 
                ? `${item.color} ring-1 ring-offset-4 ring-blue-500/30 border-transparent shadow-[0_15px_30px_rgba(59,130,246,0.15)] scale-[1.05] z-10 font-black` 
                : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:bg-premium-slate-50 hover:text-blue-600 active:scale-95 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${voucherType === item.type ? `w-full ${item.accent}` : 'w-0 bg-blue-400'}`}></div>
            <item.icon className={`text-xl mb-2 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 ${voucherType === item.type ? 'scale-110 -translate-y-0.5' : ''}`} />
            <span className="text-[10px] uppercase tracking-tight line-clamp-1">{t(item.type)}</span>
          </button>
        ))}
      </div>
    </>
  );
};
