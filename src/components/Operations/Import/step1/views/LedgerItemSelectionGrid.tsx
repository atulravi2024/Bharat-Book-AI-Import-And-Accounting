import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { MasterType } from '../types';
import { 
  Users, 
  MapIcon, 
  Palette, 
  Hash, 
  Percent,
  Building
} from 'lucide-react';
import { 
  AccountIcon, 
  CategoryIcon, 
  InventoryIcon, 
  UomIcon, 
  TaxIcon, 
  BrandIcon, 
  SortIcon 
} from '../../../../icons/IconComponents';
import { ledgerItemProps } from '../utils/step1Utils';

interface LedgerItemSelectionGridProps {
  importCategory: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other';
  masterType: MasterType;
  setMasterType: (type: MasterType) => void;
}

export const LedgerItemSelectionGrid: React.FC<LedgerItemSelectionGridProps> = ({
  importCategory,
  masterType,
  setMasterType,
}) => {
  const { t } = useLanguage();

  const ledgerItems = [
    { id: 'contacts_staff', label: 'Staff Contacts', icon: Users },
    { id: 'contacts_customers', label: 'Customer Contacts', icon: Users },
    { id: 'contacts_vendors', label: 'Vendor Contacts', icon: Users },
    { id: 'contacts_partners', label: 'Partner Contacts', icon: Users },
    { id: 'ledgers', label: 'General Ledgers', icon: AccountIcon },
    { id: 'banks', label: 'Bank Masters', icon: Building },
    { id: 'accountGroups', label: 'Groups', icon: MapIcon },
    { id: 'locations', label: 'Locations', icon: MapIcon },
    { id: 'costCenters', label: 'Cost Centers', icon: CategoryIcon },
  ];

  const itemMasterItems = [
    { id: 'items', label: 'Item Hub', icon: InventoryIcon },
    { id: 'basic_items', label: 'Basic Item', icon: InventoryIcon },
    { id: 'bom', label: 'Bill of Materials', icon: CategoryIcon },
    { id: 'warehouses', label: 'Warehouses', icon: MapIcon },
    { id: 'uoms', label: 'UOMs', icon: UomIcon },
    { id: 'stockGroups', label: 'Stock Groups', icon: CategoryIcon },
    { id: 'gst', label: 'HSN', icon: TaxIcon },
    { id: 'brands', label: 'Brands', icon: BrandIcon },
    { id: 'categories', label: 'Categories', icon: CategoryIcon },
    { id: 'assertionCategories', label: 'Assertion Categories', icon: CategoryIcon },
    { id: 'assertionCodes', label: 'Assertion Codes', icon: CategoryIcon },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'sizes', label: 'Sizes', icon: SortIcon },
    { id: 'variants', label: 'Variants', icon: SortIcon },
    { id: 'dimensions', label: 'Dimensions', icon: MapIcon },
    { id: 'skus', label: 'SKUs', icon: Hash },
    { id: 'priceList', label: 'Price List', icon: Percent },
    { id: 'weights', label: 'Weights', icon: SortIcon },
    { id: 'volumes', label: 'Volumes', icon: CategoryIcon },
    { id: 'grades', label: 'Grades', icon: SortIcon },
  ];

  const currentItems = importCategory === 'ledger_master' ? ledgerItems : itemMasterItems;

  return (
    <>
      <div className="flex items-center justify-between mb-5 px-1">
        <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">
          {importCategory === 'ledger_master' ? t("Ledger Masters") : t("Item Masters")}
        </label>
        <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-300">
        {currentItems.map((item) => {
          const props = ledgerItemProps[item.id] || { color: 'text-blue-600', border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-750', darkBg: 'dark:bg-blue-900/20', darkBorder: 'dark:border-indigo-400', darkText: 'dark:text-blue-300', iconColor: 'text-blue-500' };
          const isSelected = masterType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setMasterType(item.id as any)}
              className={`group flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected 
                  ? `${props.bg} ${props.border} shadow-md ${props.text} ${props.darkBg} ${props.darkBorder} ${props.darkText}` 
                  : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100/80 hover:border-gray-250 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <item.icon className={`text-2xl mb-3 transition-transform duration-300 group-hover:scale-110 ${isSelected ? props.iconColor : 'text-gray-400'}`} />
              <span className="text-xs font-bold text-center leading-tight">{t(item.label)}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
