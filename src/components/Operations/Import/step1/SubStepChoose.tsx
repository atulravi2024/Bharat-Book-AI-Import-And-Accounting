import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherType } from '../../../../app/types';
import { MasterType } from './types';
import { 
  Percent, 
  Settings, 
  Building, 
  Users, 
  ShieldAlert, 
  Info, 
  LifeBuoy, 
  HelpCircle, 
  Sliders, 
  Navigation, 
  Hash, 
  Shield, 
  EyeOff, 
  Bell, 
  FileSpreadsheet, 
  Shuffle, 
  Cpu, 
  Printer, 
  FormInput, 
  Database,
  Palette
} from 'lucide-react';
import { 
    InfoIcon, 
    UndoIcon, 
    CategoryIcon, 
    InventoryIcon,
    TaxIcon,
    AccountIcon,
    VouchersIcon,
    UomIcon,
    MapIcon,
    BrandIcon,
    SortIcon
} from '../../../icons/IconComponents';

interface SubStepChooseProps {
  importCategory: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other';
  voucherType: VoucherType;
  setVoucherType: (type: VoucherType) => void;
  masterType: MasterType;
  setMasterType: (type: MasterType) => void;
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  bankMasters: any[];
  selectedOtherCategory: string;
  setSelectedOtherCategory: (category: string) => void;
  customCategoryName: string;
  setCustomCategoryName: (name: string) => void;
  selectedSettingsSubpage?: string;
  setSelectedSettingsSubpage?: (subpage: string) => void;
  setActiveTab?: (tab: 'type' | 'choose' | 'preview' | 'upload' | 'mapping' | 'settings') => void;
  taxSampleType?: 'with_data' | 'without_data';
  setTaxSampleType?: (type: 'with_data' | 'without_data') => void;
}

const ledgerItemProps: Record<string, { color: string; border: string; bg: string; text: string; darkBg: string; darkBorder: string; darkText: string; iconColor: string }> = {
  ledgers: { color: 'text-blue-600', border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-750', darkBg: 'dark:bg-blue-900/20', darkBorder: 'dark:border-blue-400', darkText: 'dark:text-blue-300', iconColor: 'text-blue-500' },
  parties: { color: 'text-indigo-600', border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-750', darkBg: 'dark:bg-indigo-900/20', darkBorder: 'dark:border-indigo-400', darkText: 'dark:text-indigo-300', iconColor: 'text-indigo-500' },
  vendors: { color: 'text-sky-600', border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-750', darkBg: 'dark:bg-sky-900/20', darkBorder: 'dark:border-sky-400', darkText: 'dark:text-sky-300', iconColor: 'text-sky-500' },
  partners: { color: 'text-teal-600', border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-750', darkBg: 'dark:bg-teal-900/20', darkBorder: 'dark:border-teal-400', darkText: 'dark:text-teal-300', iconColor: 'text-teal-500' },
  banks: { color: 'text-amber-600', border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-750', darkBg: 'dark:bg-amber-900/20', darkBorder: 'dark:border-amber-400', darkText: 'dark:text-amber-300', iconColor: 'text-amber-500' },
  contacts: { color: 'text-violet-600', border: 'border-violet-500', bg: 'bg-violet-50', text: 'text-violet-750', darkBg: 'dark:bg-violet-900/20', darkBorder: 'dark:border-violet-400', darkText: 'dark:text-violet-300', iconColor: 'text-violet-500' },
  contacts_staff: { color: 'text-violet-650', border: 'border-violet-500', bg: 'bg-violet-50/50', text: 'text-violet-800', darkBg: 'dark:bg-violet-955/20', darkBorder: 'dark:border-violet-500', darkText: 'dark:text-violet-300', iconColor: 'text-violet-550' },
  contacts_customers: { color: 'text-indigo-600', border: 'border-indigo-500', bg: 'bg-indigo-50/50', text: 'text-indigo-800', darkBg: 'dark:bg-indigo-950/20', darkBorder: 'dark:border-indigo-500', darkText: 'dark:text-indigo-300', iconColor: 'text-indigo-500' },
  contacts_vendors: { color: 'text-sky-600', border: 'border-sky-500', bg: 'bg-sky-50/50', text: 'text-sky-800', darkBg: 'dark:bg-sky-950/20', darkBorder: 'dark:border-sky-500', darkText: 'dark:text-sky-300', iconColor: 'text-sky-500' },
  contacts_partners: { color: 'text-teal-600', border: 'border-teal-500', bg: 'bg-teal-50/50', text: 'text-teal-850', darkBg: 'dark:bg-teal-955/20', darkBorder: 'dark:border-teal-500', darkText: 'dark:text-teal-300', iconColor: 'text-teal-500' },
  locations: { color: 'text-emerald-500', border: 'border-emerald-550', bg: 'bg-emerald-50', text: 'text-emerald-750', darkBg: 'dark:bg-emerald-900/20', darkBorder: 'dark:border-emerald-400', darkText: 'dark:text-emerald-300', iconColor: 'text-emerald-500' },
  costCenters: { color: 'text-purple-600', border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-750', darkBg: 'dark:bg-purple-900/20', darkBorder: 'dark:border-purple-400', darkText: 'dark:text-purple-300', iconColor: 'text-purple-500' },
  accountGroups: { color: 'text-cyan-600', border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-750', darkBg: 'dark:bg-cyan-900/20', darkBorder: 'dark:border-cyan-400', darkText: 'dark:text-cyan-300', iconColor: 'text-cyan-500' },

  items: { color: 'text-emerald-600', border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-750', darkBg: 'dark:bg-emerald-900/20', darkBorder: 'dark:border-emerald-400', darkText: 'dark:text-emerald-300', iconColor: 'text-emerald-500' },
  basic_items: { color: 'text-green-600', border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-750', darkBg: 'dark:bg-green-950/20', darkBorder: 'dark:border-green-400', darkText: 'dark:text-green-300', iconColor: 'text-green-500' },
  bom: { color: 'text-orange-600', border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-750', darkBg: 'dark:bg-orange-900/20', darkBorder: 'dark:border-orange-400', darkText: 'dark:text-orange-300', iconColor: 'text-orange-500' },
  warehouses: { color: 'text-blue-600', border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-750', darkBg: 'dark:bg-blue-900/20', darkBorder: 'dark:border-blue-400', darkText: 'dark:text-blue-300', iconColor: 'text-blue-500' },
  uoms: { color: 'text-amber-600', border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-750', darkBg: 'dark:bg-amber-900/20', darkBorder: 'dark:border-amber-400', darkText: 'dark:text-amber-300', iconColor: 'text-amber-500' },
  uom: { color: 'text-amber-600', border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-750', darkBg: 'dark:bg-amber-900/20', darkBorder: 'dark:border-amber-400', darkText: 'dark:text-amber-300', iconColor: 'text-amber-500' },
  godowns: { color: 'text-sky-600', border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-750', darkBg: 'dark:bg-sky-900/20', darkBorder: 'dark:border-sky-400', darkText: 'dark:text-sky-300', iconColor: 'text-sky-500' },
  gst: { color: 'text-rose-600', border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-750', darkBg: 'dark:bg-rose-900/20', darkBorder: 'dark:border-rose-400', darkText: 'dark:text-rose-300', iconColor: 'text-rose-500' },
  stockGroups: { color: 'text-pink-600', border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-750', darkBg: 'dark:bg-pink-900/20', darkBorder: 'dark:border-pink-400', darkText: 'dark:text-pink-300', iconColor: 'text-pink-500' },
  brands: { color: 'text-violet-600', border: 'border-violet-500', bg: 'bg-violet-50', text: 'text-violet-750', darkBg: 'dark:bg-violet-900/20', darkBorder: 'dark:border-violet-400', darkText: 'dark:text-violet-300', iconColor: 'text-violet-500' },
  categories: { color: 'text-fuchsia-600', border: 'border-fuchsia-500', bg: 'bg-fuchsia-50', text: 'text-fuchsia-750', darkBg: 'dark:bg-fuchsia-900/20', darkBorder: 'dark:border-fuchsia-400', darkText: 'dark:text-fuchsia-300', iconColor: 'text-fuchsia-500' },
  assertionCategories: { color: 'text-lime-600', border: 'border-lime-500', bg: 'bg-lime-50', text: 'text-lime-750', darkBg: 'dark:bg-lime-900/20', darkBorder: 'dark:border-lime-400', darkText: 'dark:text-lime-300', iconColor: 'text-lime-500' },
  assertionCodes: { color: 'text-emerald-700', border: 'border-emerald-600', bg: 'bg-emerald-50/50', text: 'text-emerald-800', darkBg: 'dark:bg-emerald-950/20', darkBorder: 'dark:border-emerald-500', darkText: 'dark:text-emerald-400', iconColor: 'text-emerald-600' },
  colors: { color: 'text-purple-605', border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-750', darkBg: 'dark:bg-purple-900/20', darkBorder: 'dark:border-purple-400', darkText: 'dark:text-purple-300', iconColor: 'text-purple-500' },
  sizes: { color: 'text-blue-500', border: 'border-blue-400', bg: 'bg-blue-50/30', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/10', darkBorder: 'dark:border-blue-505', darkText: 'dark:text-blue-400', iconColor: 'text-blue-500' },
  variants: { color: 'text-neutral-600', border: 'border-neutral-500', bg: 'bg-neutral-50', text: 'text-neutral-750', darkBg: 'dark:bg-neutral-900/20', darkBorder: 'dark:border-neutral-400', darkText: 'dark:text-neutral-300', iconColor: 'text-neutral-550' },
  dimensions: { color: 'text-indigo-600', border: 'border-indigo-500', bg: 'bg-indigo-50/30', text: 'text-indigo-750', darkBg: 'dark:bg-indigo-900/20', darkBorder: 'dark:border-indigo-400', darkText: 'dark:text-indigo-300', iconColor: 'text-indigo-500' },
  skus: { color: 'text-zinc-600', border: 'border-zinc-500', bg: 'bg-zinc-50', text: 'text-zinc-750', darkBg: 'dark:bg-zinc-900/20', darkBorder: 'dark:border-zinc-400', darkText: 'dark:text-zinc-300', iconColor: 'text-zinc-500' },
  priceList: { color: 'text-rose-600', border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-750', darkBg: 'dark:bg-rose-900/20', darkBorder: 'dark:border-rose-400', darkText: 'dark:text-rose-300', iconColor: 'text-rose-500' },
  priceLists: { color: 'text-rose-600', border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-750', darkBg: 'dark:bg-rose-900/20', darkBorder: 'dark:border-rose-400', darkText: 'dark:text-rose-300', iconColor: 'text-rose-500' },
  weights: { color: 'text-teal-600', border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-750', darkBg: 'dark:bg-teal-900/20', darkBorder: 'dark:border-teal-400', darkText: 'dark:text-teal-300', iconColor: 'text-teal-500' },
  volumes: { color: 'text-cyan-600', border: 'border-cyan-500', bg: 'bg-cyan-50/50', text: 'text-cyan-750', darkBg: 'dark:bg-cyan-900/20', darkBorder: 'dark:border-cyan-400', darkText: 'dark:text-cyan-400', iconColor: 'text-cyan-500' },
  grades: { color: 'text-teal-600', border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-750', darkBg: 'dark:bg-teal-900/20', darkBorder: 'dark:border-teal-400', darkText: 'dark:text-teal-300', iconColor: 'text-teal-500' },
};

const getActiveSettingStyles = (itemId: string) => {
  const activeColorMap: Record<string, string> = {
    pref_firm: 'bg-indigo-50 border-indigo-550/80 dark:bg-indigo-950/30 dark:border-indigo-550/80 shadow-[0_4px_20px_rgba(99,102,241,0.12)]',
    pref_users: 'bg-emerald-50 border-emerald-550/80 dark:bg-emerald-950/30 dark:border-emerald-550/80 shadow-[0_4px_20px_rgba(16,185,129,0.12)]',
    pref_admin: 'bg-red-50 border-red-500/80 dark:bg-red-950/30 dark:border-red-500/80 shadow-[0_4px_20px_rgba(239,68,68,0.12)]',
    pref_about: 'bg-blue-50 border-blue-550/80 dark:bg-blue-950/30 dark:border-blue-550/80 shadow-[0_4px_20px_rgba(59,130,246,0.12)]',
    pref_general: 'bg-purple-50 border-purple-550/80 dark:bg-purple-950/30 dark:border-purple-550/80 shadow-[0_4px_20px_rgba(168,85,247,0.12)]',
    pref_app_defaults: 'bg-cyan-50 border-cyan-550/80 dark:bg-cyan-950/30 dark:border-cyan-550/80 shadow-[0_4px_20px_rgba(6,182,212,0.12)]',
    pref_voucher_numbering: 'bg-amber-50 border-amber-550/80 dark:bg-amber-950/30 dark:border-amber-550/80 shadow-[0_4px_20px_rgba(245,158,11,0.12)]',
    pref_import_rules: 'bg-sky-50 border-sky-550/80 dark:bg-sky-950/30 dark:border-sky-550/80 shadow-[0_4px_20px_rgba(14,165,233,0.12)]',
    pref_mapping: 'bg-lime-50 border-lime-550/80 dark:bg-lime-950/30 dark:border-lime-550/80 shadow-[0_4px_20px_rgba(132,204,22,0.12)]',
    pref_ai_engines: 'bg-violet-50 border-violet-550/80 dark:bg-violet-950/30 dark:border-violet-550/80 shadow-[0_4px_20px_rgba(139,92,246,0.12)]',
    pref_data_explorer: 'bg-indigo-50 border-indigo-550/80 dark:bg-indigo-950/30 dark:border-indigo-550/80 shadow-[0_4px_20px_rgba(99,102,241,0.12)]',
    pref_invoice_print: 'bg-fuchsia-50 border-fuchsia-550/80 dark:bg-fuchsia-950/30 dark:border-fuchsia-550/80 shadow-[0_4px_20px_rgba(217,70,239,0.12)]',
    pref_form_detail: 'bg-rose-50 border-rose-550/80 dark:bg-rose-950/30 dark:border-rose-550/80 shadow-[0_4px_20px_rgba(244,63,94,0.12)]',
    pref_design_palette: 'bg-yellow-50 border-yellow-550/80 dark:bg-yellow-950/30 dark:border-yellow-550/80 shadow-[0_4px_20px_rgba(234,179,8,0.12)]',
    pref_security: 'bg-rose-50 border-rose-550/80 dark:bg-rose-950/30 dark:border-rose-550/80 shadow-[0_4px_20px_rgba(244,63,94,0.12)]',
    pref_privacy: 'bg-orange-50 border-orange-550/80 dark:bg-orange-950/30 dark:border-orange-550/80 shadow-[0_4px_20px_rgba(249,115,22,0.12)]',
    pref_alerts: 'bg-yellow-50 border-yellow-550/80 dark:bg-yellow-950/30 dark:border-yellow-550/80 shadow-[0_4px_20px_rgba(234,179,8,0.12)]',
    pref_support: 'bg-pink-50 border-pink-550/80 dark:bg-pink-950/30 dark:border-pink-550/80 shadow-[0_4px_20px_rgba(236,72,153,0.12)]',
    pref_help: 'bg-teal-50 border-teal-550/80 dark:bg-teal-950/30 dark:border-teal-550/80 shadow-[0_4px_20px_rgba(20,184,166,0.12)]',
  };
  return activeColorMap[itemId] || 'bg-blue-50 border-blue-500/80 dark:bg-blue-950/30 dark:border-blue-500/80 shadow-md';
};

export const SubStepChoose: React.FC<SubStepChooseProps> = ({
  importCategory,
  voucherType,
  setVoucherType,
  masterType,
  setMasterType,
  selectedBank,
  setSelectedBank,
  bankMasters,
  selectedOtherCategory,
  setSelectedOtherCategory,
  customCategoryName,
  setCustomCategoryName,
  selectedSettingsSubpage = 'pref_general',
  setSelectedSettingsSubpage,
  setActiveTab,
  taxSampleType = 'with_data',
  setTaxSampleType,
}) => {
  const { t } = useLanguage();

  const getTheme = () => {
    let colorKey = 'blue';
    if (importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher') {
      switch (voucherType) {
        case VoucherType.Purchase:
        case VoucherType.StockJournal:
          colorKey = 'emerald';
          break;
        case VoucherType.Sales:
          colorKey = 'blue';
          break;
        case VoucherType.Payment:
          colorKey = 'purple';
          break;
        case VoucherType.Receipt:
          colorKey = 'amber';
          break;
        case VoucherType.Journal:
          colorKey = 'slate';
          break;
        case VoucherType.Contra:
          colorKey = 'rose';
          break;
        case VoucherType.CreditNote:
        case VoucherType.RejectionIn:
          colorKey = 'teal';
          break;
        case VoucherType.DebitNote:
        case VoucherType.RejectionOut:
          colorKey = 'pink';
          break;
        case VoucherType.PhysicalStock:
          colorKey = 'indigo';
          break;
        case VoucherType.ItemConsumption:
          colorKey = 'rose';
          break;
        case VoucherType.ItemScrap:
          colorKey = 'orange';
          break;
        case VoucherType.Interlocation:
          colorKey = 'sky';
          break;
        default:
          colorKey = 'blue';
      }
    } else if (importCategory === 'ledger_master') {
      switch (masterType) {
        case 'ledgers':
          colorKey = 'blue';
          break;
        case 'parties':
          colorKey = 'indigo';
          break;
        case 'vendors':
          colorKey = 'sky';
          break;
        case 'partners':
          colorKey = 'teal';
          break;
        case 'banks':
          colorKey = 'amber';
          break;
        case 'contacts':
        case 'contacts_staff':
          colorKey = 'violet';
          break;
        case 'contacts_customers':
          colorKey = 'indigo';
          break;
        case 'contacts_vendors':
          colorKey = 'sky';
          break;
        case 'contacts_partners':
          colorKey = 'teal';
          break;
        case 'locations':
          colorKey = 'emerald';
          break;
        case 'costCenters':
          colorKey = 'purple';
          break;
        case 'accountGroups':
          colorKey = 'cyan';
          break;
        default:
          colorKey = 'blue';
      }
    } else if (importCategory === 'item_master') {
      switch (masterType) {
        case 'items':
          colorKey = 'emerald';
          break;
        case 'basic_items':
          colorKey = 'green';
          break;
        case 'bom':
          colorKey = 'orange';
          break;
        case 'warehouses':
          colorKey = 'blue';
          break;
        case 'uoms':
        case 'uom':
          colorKey = 'amber';
          break;
        case 'godowns':
          colorKey = 'sky';
          break;
        case 'gst':
          colorKey = 'rose';
          break;
        case 'stockGroups':
          colorKey = 'pink';
          break;
        case 'brands':
          colorKey = 'violet';
          break;
        case 'categories':
          colorKey = 'fuchsia';
          break;
        case 'assertionCategories':
          colorKey = 'lime';
          break;
        case 'assertionCodes':
          colorKey = 'emerald';
          break;
        case 'colors':
          colorKey = 'purple';
          break;
        case 'sizes':
          colorKey = 'blue';
          break;
        case 'variants':
          colorKey = 'zinc';
          break;
        case 'dimensions':
          colorKey = 'indigo';
          break;
        case 'skus':
          colorKey = 'neutral';
          break;
        case 'priceList':
        case 'priceLists':
          colorKey = 'rose';
          break;
        case 'weights':
          colorKey = 'teal';
          break;
        case 'volumes':
          colorKey = 'cyan';
          break;
        case 'grades':
          colorKey = 'teal';
          break;
        default:
          colorKey = 'blue';
      }
    } else if (importCategory === 'bank') {
      colorKey = 'indigo';
    } else if (importCategory === 'tax_related') {
      switch (voucherType) {
        case VoucherType.GSTR1:
          colorKey = 'blue';
          break;
        case VoucherType.GSTR3B:
          colorKey = 'indigo';
          break;
        case VoucherType.GSTR2A:
          colorKey = 'emerald';
          break;
        case VoucherType.GSTR2B:
          colorKey = 'purple';
          break;
        case VoucherType.GSTR9:
          colorKey = 'amber';
          break;
        case VoucherType.GSTR9A:
          colorKey = 'rose';
          break;
        case VoucherType.GSTR9B:
          colorKey = 'slate';
          break;
        case VoucherType.GSTR9C:
          colorKey = 'pink';
          break;
        case VoucherType.GSTR4:
          colorKey = 'cyan';
          break;
        case VoucherType.GSTR4A:
          colorKey = 'teal';
          break;
        case VoucherType.GSTR4B:
          colorKey = 'violet';
          break;
        case VoucherType.CMP08:
          colorKey = 'orange';
          break;
        default:
          colorKey = 'blue';
      }
    } else if (importCategory === 'settings') {
      const pageId = selectedSettingsSubpage || 'pref_general';
      if (pageId.includes('firm')) colorKey = 'indigo';
      else if (pageId.includes('users')) colorKey = 'emerald';
      else if (pageId.includes('admin')) colorKey = 'red';
      else if (pageId.includes('about')) colorKey = 'blue';
      else if (pageId.includes('general')) colorKey = 'purple';
      else if (pageId.includes('defaults')) colorKey = 'cyan';
      else if (pageId.includes('numbering')) colorKey = 'amber';
      else if (pageId.includes('rules')) colorKey = 'sky';
      else if (pageId.includes('mapping')) colorKey = 'lime';
      else if (pageId.includes('engines')) colorKey = 'violet';
      else if (pageId.includes('explorer')) colorKey = 'indigo';
      else if (pageId.includes('print')) colorKey = 'fuchsia';
      else if (pageId.includes('form_detail')) colorKey = 'rose';
      else if (pageId.includes('palette')) colorKey = 'yellow';
      else if (pageId.includes('security')) colorKey = 'rose';
      else if (pageId.includes('privacy')) colorKey = 'orange';
      else if (pageId.includes('alerts')) colorKey = 'yellow';
      else if (pageId.includes('support')) colorKey = 'pink';
      else if (pageId.includes('help')) colorKey = 'teal';
    } else if (importCategory === 'other') {
      switch (selectedOtherCategory) {
        case 'employees_payroll':
          colorKey = 'violet';
          break;
        case 'fixed_assets':
          colorKey = 'indigo';
          break;
        case 'currency_rates':
          colorKey = 'teal';
          break;
        case 'projects_wbs':
          colorKey = 'amber';
          break;
        case 'discount_rules':
          colorKey = 'rose';
          break;
        case 'barcodes_units':
          colorKey = 'sky';
          break;
        case 'custom_dirs':
          colorKey = 'emerald';
          break;
        case 'custom':
          colorKey = 'neutral';
          break;
        default:
          colorKey = 'blue';
      }
    }

    const themes: Record<string, {
      text: string;
      darkText: string;
      bg: string;
      darkBg: string;
      border: string;
      darkBorder: string;
      accent: string;
      gradient: string;
      badge: string;
      ring: string;
      glow: string;
    }> = {
      blue: {
        text: 'text-blue-600',
        darkText: 'dark:text-blue-400',
        bg: 'bg-blue-50/50',
        darkBg: 'dark:bg-blue-950/20',
        border: 'border-blue-100',
        darkBorder: 'dark:border-blue-900/40',
        accent: 'bg-blue-600',
        gradient: 'from-blue-500/0 via-blue-500/30 to-blue-500/0',
        badge: 'text-blue-600 bg-blue-50 border-blue-100/60 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-900/30',
        ring: 'ring-blue-500/20',
        glow: 'shadow-[0_4px_25px_rgba(59,130,246,0.06)]'
      },
      emerald: {
        text: 'text-emerald-600',
        darkText: 'dark:text-emerald-400',
        bg: 'bg-emerald-50/50',
        darkBg: 'dark:bg-emerald-950/20',
        border: 'border-emerald-100',
        darkBorder: 'dark:border-emerald-900/40',
        accent: 'bg-emerald-600',
        gradient: 'from-emerald-500/0 via-emerald-500/30 to-emerald-500/0',
        badge: 'text-emerald-600 bg-emerald-50 border-emerald-100/60 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-900/30',
        ring: 'ring-emerald-500/20',
        glow: 'shadow-[0_4px_25px_rgba(16,185,129,0.06)]'
      },
      indigo: {
        text: 'text-indigo-600',
        darkText: 'dark:text-indigo-400',
        bg: 'bg-indigo-50/50',
        darkBg: 'dark:bg-indigo-950/20',
        border: 'border-indigo-100',
        darkBorder: 'dark:border-indigo-900/40',
        accent: 'bg-indigo-600',
        gradient: 'from-indigo-500/0 via-indigo-500/30 to-indigo-500/0',
        badge: 'text-indigo-600 bg-indigo-50 border-indigo-100/60 dark:text-indigo-400 dark:bg-indigo-950/40 dark:border-indigo-900/30',
        ring: 'ring-indigo-500/20',
        glow: 'shadow-[0_4px_25px_rgba(99,102,241,0.06)]'
      },
      purple: {
        text: 'text-purple-600',
        darkText: 'dark:text-purple-400',
        bg: 'bg-purple-50/50',
        darkBg: 'dark:bg-purple-950/20',
        border: 'border-purple-100',
        darkBorder: 'dark:border-purple-900/40',
        accent: 'bg-purple-600',
        gradient: 'from-purple-500/0 via-purple-500/30 to-purple-500/0',
        badge: 'text-purple-600 bg-purple-50 border-purple-100/60 dark:text-purple-400 dark:bg-purple-950/40 dark:border-purple-900/30',
        ring: 'ring-purple-500/20',
        glow: 'shadow-[0_4px_25px_rgba(168,85,247,0.06)]'
      },
      amber: {
        text: 'text-amber-600',
        darkText: 'dark:text-amber-400',
        bg: 'bg-amber-50/50',
        darkBg: 'dark:bg-amber-950/20',
        border: 'border-amber-100',
        darkBorder: 'dark:border-amber-900/40',
        accent: 'bg-amber-600',
        gradient: 'from-amber-500/0 via-amber-500/30 to-amber-500/0',
        badge: 'text-amber-600 bg-amber-50 border-amber-100/60 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900/30',
        ring: 'ring-amber-500/20',
        glow: 'shadow-[0_4px_25px_rgba(245,158,11,0.06)]'
      },
      slate: {
        text: 'text-slate-600',
        darkText: 'dark:text-slate-400',
        bg: 'bg-slate-50/50',
        darkBg: 'dark:bg-slate-900/20',
        border: 'border-slate-100',
        darkBorder: 'dark:border-slate-800',
        accent: 'bg-slate-600',
        gradient: 'from-slate-500/0 via-slate-500/30 to-slate-500/0',
        badge: 'text-slate-600 bg-slate-50 border-slate-100/60 dark:text-slate-400 dark:bg-slate-900/40 dark:border-slate-800',
        ring: 'ring-slate-500/20',
        glow: 'shadow-[0_4px_25px_rgba(100,116,139,0.06)]'
      },
      rose: {
        text: 'text-rose-600',
        darkText: 'dark:text-rose-400',
        bg: 'bg-rose-50/50',
        darkBg: 'dark:bg-rose-950/20',
        border: 'border-rose-100',
        darkBorder: 'dark:border-rose-900/40',
        accent: 'bg-rose-600',
        gradient: 'from-rose-500/0 via-rose-500/30 to-rose-500/0',
        badge: 'text-rose-600 bg-rose-50 border-rose-100/60 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-900/30',
        ring: 'ring-rose-500/20',
        glow: 'shadow-[0_4px_25px_rgba(244,63,94,0.06)]'
      },
      teal: {
        text: 'text-teal-600',
        darkText: 'dark:text-teal-400',
        bg: 'bg-teal-50/50',
        darkBg: 'dark:bg-teal-950/20',
        border: 'border-teal-100',
        darkBorder: 'dark:border-teal-900/40',
        accent: 'bg-teal-600',
        gradient: 'from-teal-500/0 via-teal-500/30 to-teal-500/0',
        badge: 'text-teal-600 bg-teal-50 border-teal-100/60 dark:text-teal-400 dark:bg-teal-950/40 dark:border-teal-900/30',
        ring: 'ring-teal-500/20',
        glow: 'shadow-[0_4px_25px_rgba(20,184,166,0.06)]'
      },
      pink: {
        text: 'text-pink-600',
        darkText: 'dark:text-pink-400',
        bg: 'bg-pink-50/50',
        darkBg: 'dark:bg-pink-950/20',
        border: 'border-pink-100',
        darkBorder: 'dark:border-pink-900/40',
        accent: 'bg-pink-600',
        gradient: 'from-pink-500/0 via-pink-500/30 to-pink-500/0',
        badge: 'text-pink-600 bg-pink-50 border-pink-100/60 dark:text-pink-400 dark:bg-pink-950/40 dark:border-pink-900/30',
        ring: 'ring-pink-500/20',
        glow: 'shadow-[0_4px_25px_rgba(236,72,153,0.06)]'
      },
      orange: {
        text: 'text-orange-600',
        darkText: 'dark:text-orange-400',
        bg: 'bg-orange-50/50',
        darkBg: 'dark:bg-orange-950/20',
        border: 'border-orange-100',
        darkBorder: 'dark:border-orange-900/40',
        accent: 'bg-orange-600',
        gradient: 'from-orange-500/0 via-orange-500/30 to-orange-500/0',
        badge: 'text-orange-600 bg-orange-50 border-orange-100/60 dark:text-orange-400 dark:bg-orange-950/40 dark:border-orange-900/30',
        ring: 'ring-orange-500/20',
        glow: 'shadow-[0_4px_25px_rgba(249,115,22,0.06)]'
      },
      sky: {
        text: 'text-sky-600',
        darkText: 'dark:text-sky-400',
        bg: 'bg-sky-50/50',
        darkBg: 'dark:bg-sky-950/20',
        border: 'border-sky-100',
        darkBorder: 'dark:border-sky-900/40',
        accent: 'bg-sky-600',
        gradient: 'from-sky-500/0 via-sky-500/30 to-sky-500/0',
        badge: 'text-sky-600 bg-sky-50 border-sky-100/60 dark:text-sky-400 dark:bg-sky-950/40 dark:border-sky-900/30',
        ring: 'ring-sky-500/20',
        glow: 'shadow-[0_4px_25px_rgba(14,165,233,0.06)]'
      },
      cyan: {
        text: 'text-cyan-600',
        darkText: 'dark:text-cyan-400',
        bg: 'bg-cyan-50/50',
        darkBg: 'dark:bg-cyan-950/20',
        border: 'border-cyan-100',
        darkBorder: 'dark:border-cyan-900/40',
        accent: 'bg-cyan-600',
        gradient: 'from-cyan-500/0 via-cyan-500/30 to-cyan-500/0',
        badge: 'text-cyan-605 bg-cyan-50 border-cyan-100/60 dark:text-cyan-400 dark:bg-cyan-950/40 dark:border-cyan-900/30',
        ring: 'ring-cyan-500/20',
        glow: 'shadow-[0_4px_25px_rgba(6,182,212,0.06)]'
      },
      lime: {
        text: 'text-lime-600',
        darkText: 'dark:text-lime-400',
        bg: 'bg-lime-50/50',
        darkBg: 'dark:bg-lime-950/20',
        border: 'border-lime-100',
        darkBorder: 'dark:border-lime-900/40',
        accent: 'bg-lime-600',
        gradient: 'from-lime-500/0 via-lime-500/30 to-lime-500/0',
        badge: 'text-lime-600 bg-lime-50 border-lime-100/60 dark:text-lime-400 dark:bg-lime-950/40 dark:border-lime-900/30',
        ring: 'ring-lime-500/20',
        glow: 'shadow-[0_4px_25px_rgba(132,204,22,0.06)]'
      },
      violet: {
        text: 'text-violet-605',
        darkText: 'dark:text-violet-400',
        bg: 'bg-violet-50/50',
        darkBg: 'dark:bg-violet-950/20',
        border: 'border-violet-100',
        darkBorder: 'dark:border-violet-900/40',
        accent: 'bg-violet-600',
        gradient: 'from-violet-500/0 via-violet-500/30 to-violet-500/0',
        badge: 'text-violet-600 bg-violet-50 border-violet-100/60 dark:text-violet-400 dark:bg-violet-950/40 dark:border-violet-900/30',
        ring: 'ring-violet-500/20',
        glow: 'shadow-[0_4px_25px_rgba(139,92,246,0.06)]'
      },
      fuchsia: {
        text: 'text-fuchsia-600',
        darkText: 'dark:text-fuchsia-400',
        bg: 'bg-fuchsia-50/50',
        darkBg: 'dark:bg-fuchsia-950/20',
        border: 'border-fuchsia-100',
        darkBorder: 'dark:border-fuchsia-900/40',
        accent: 'bg-fuchsia-600',
        gradient: 'from-fuchsia-500/0 via-fuchsia-500/30 to-fuchsia-500/0',
        badge: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100/60 dark:text-fuchsia-400 dark:bg-fuchsia-950/40 dark:border-fuchsia-900/30',
        ring: 'ring-fuchsia-500/20',
        glow: 'shadow-[0_4px_25px_rgba(217,70,239,0.06)]'
      },
      yellow: {
        text: 'text-yellow-600',
        darkText: 'dark:text-yellow-400',
        bg: 'bg-yellow-50/50',
        darkBg: 'dark:bg-yellow-950/20',
        border: 'border-yellow-100',
        darkBorder: 'dark:border-yellow-900/30',
        accent: 'bg-yellow-500',
        gradient: 'from-yellow-500/0 via-yellow-500/30 to-yellow-500/0',
        badge: 'text-yellow-602 bg-yellow-50 border-yellow-101/60 dark:text-yellow-400 dark:bg-yellow-950/40 dark:border-yellow-900/30',
        ring: 'ring-yellow-500/20',
        glow: 'shadow-[0_4px_25px_rgba(234,179,8,0.06)]'
      },
      red: {
        text: 'text-red-650',
        darkText: 'dark:text-red-400',
        bg: 'bg-red-50/55',
        darkBg: 'dark:bg-red-950/20',
        border: 'border-red-100',
        darkBorder: 'dark:border-red-900/40',
        accent: 'bg-red-600',
        gradient: 'from-red-500/0 via-red-500/30 to-red-500/0',
        badge: 'text-red-600 bg-red-50 border-red-100/60 dark:text-red-450 dark:bg-red-950/40 dark:border-red-900/30',
        ring: 'ring-red-500/20',
        glow: 'shadow-[0_4px_25px_rgba(239,68,68,0.06)]'
      }
    };

    return themes[colorKey] || themes.blue;
  };

  const theme = getTheme();

  const settingsSubpages = [
    { id: 'pref_firm', label: t("Firm Import"), group: t("Management & Organization"), icon: Building, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50', accent: 'bg-indigo-600', desc: t("Address, contact details, regional taxes, and organizational profile configurations.") },
    { id: 'pref_users', label: t("User Account Import"), group: t("Management & Organization"), icon: Users, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50', accent: 'bg-emerald-600', desc: t("User directory records, operational roles, permissions, and group policies.") },
    { id: 'pref_admin', label: t("Admin Import"), group: t("Management & Organization"), icon: ShieldAlert, color: 'text-red-500 bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50', accent: 'bg-red-500', desc: t("Super admin privileges, direct database triggers, and master system tools.") },
    { id: 'pref_about', label: t("About Import"), group: t("Management & Organization"), icon: Info, color: 'text-blue-500 bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50', accent: 'bg-blue-500', desc: t("Application build details, local client configurations, and active package licenses.") },

    { id: 'pref_general', label: t("General Import"), group: t("System & Navigation Defaults"), icon: Sliders, color: 'text-purple-600 bg-purple-50/50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/50', accent: 'bg-purple-600', desc: t("System-wide language selections, notification banners, and background tasks.") },
    { id: 'pref_app_defaults', label: t("App Defaults Import"), group: t("System & Navigation Defaults"), icon: Navigation, color: 'text-cyan-600 bg-cyan-50/50 border-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-900/50', accent: 'bg-cyan-600', desc: t("Primary entry navigation paths, workspace layouts, and landing configurations.") },
    { id: 'pref_voucher_numbering', label: t("Voucher Numbering Import"), group: t("System & Navigation Defaults"), icon: Hash, color: 'text-amber-600 bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50', accent: 'bg-amber-600', desc: t("Sequence numbering protocols, custom auto-number structures per voucher type.") },

    { id: 'pref_import_rules', label: t("Import Rules Import"), group: t("Operations & Data Integration"), icon: FileSpreadsheet, color: 'text-sky-600 bg-sky-50/50 border-sky-100 dark:bg-sky-950/20 dark:border-sky-900/50', accent: 'bg-sky-600', desc: t("Validation requirements, OCR confidence bars, and standard posting constraints.") },
    { id: 'pref_mapping', label: t("Mapping Import"), group: t("Operations & Data Integration"), icon: Shuffle, color: 'text-lime-600 bg-lime-50/50 border-lime-100 dark:bg-lime-950/20 dark:border-lime-900/50', accent: 'bg-lime-600', desc: t("Static value aliases, field-to-field alignment rules, and automated auto-completions.") },
    { id: 'pref_ai_engines', label: t("AI Engines Import"), group: t("Operations & Data Integration"), icon: Cpu, color: 'text-violet-600 bg-violet-50/50 border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/50', accent: 'bg-violet-600', desc: t("Active LLM models, routing pipelines, extraction levels, and response parameters.") },
    { id: 'pref_data_explorer', label: t("Data Explorer Import"), group: t("Operations & Data Integration"), icon: Database, color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50', accent: 'bg-indigo-600', desc: t("Raw JSON schemas, data diagnostics, and database diagnostics tools.") },

    { id: 'pref_invoice_print', label: t("Invoice Print Import"), group: t("Aesthetics, Forms & Printing"), icon: Printer, color: 'text-fuchsia-600 bg-fuchsia-50/50 border-fuchsia-100 dark:bg-fuchsia-950/20 dark:border-fuchsia-900/50', accent: 'bg-fuchsia-600', desc: t("Aesthetic layout presets, custom logos, fonts, thermal page sizing, and signature templates.") },
    { id: 'pref_form_detail', label: t("Form Import"), group: t("Aesthetics, Forms & Printing"), icon: FormInput, color: 'text-rose-600 bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50', accent: 'bg-rose-600', desc: t("Active input elements, custom field parameters, and dynamic item layouts.") },
    { id: 'pref_design_palette', label: t("Visual Palette Import"), group: t("Aesthetics, Forms & Printing"), icon: Palette, color: 'text-yellow-600 bg-yellow-50/50 border-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-900/50', accent: 'bg-yellow-600', desc: t("Custom workspace color schema, luxury dense theme palettes, dark/light ambient rules.") },

    { id: 'pref_security', label: t("Security Import"), group: t("Security, Governance & Support"), icon: Shield, color: 'text-rose-600 bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50', accent: 'bg-rose-600', desc: t("Authentication restrictions, allowed network ranges, and strict lockouts.") },
    { id: 'pref_privacy', label: t("Privacy Import"), group: t("Security, Governance & Support"), icon: EyeOff, color: 'text-orange-600 bg-orange-50/50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/50', accent: 'bg-orange-600', desc: t("Confidentiality options, PII masking rules, and automated session clearances.") },
    { id: 'pref_alerts', label: t("Alert Channel Import"), group: t("Security, Governance & Support"), icon: Bell, color: 'text-yellow-600 bg-yellow-50/50 border-yellow-100 dark:bg-yellow-950/20 dark:border-yellow-900/50', accent: 'bg-yellow-505', desc: t("Email alert thresholds, real-time trigger rules, and system event notifications.") },
    { id: 'pref_support', label: t("Support Import"), group: t("Security, Governance & Support"), icon: LifeBuoy, color: 'text-pink-600 bg-pink-50/50 border-pink-100 dark:bg-pink-950/20 dark:border-pink-900/50', accent: 'bg-pink-600', desc: t("Technical service tickets, chat configuration settings, and system integration integrity logs.") },
    { id: 'pref_help', label: t("Help Center Import"), group: t("Security, Governance & Support"), icon: HelpCircle, color: 'text-teal-600 bg-teal-50/50 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/50', accent: 'bg-teal-600', desc: t("FAQ guides, documentation reference tables, and support category structures.") },
  ];

  const [lastSelectedSubpage, setLastSelectedSubpage] = useState(selectedSettingsSubpage);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all");

  if (selectedSettingsSubpage !== lastSelectedSubpage) {
    setLastSelectedSubpage(selectedSettingsSubpage);
    const matchedItem = settingsSubpages.find(item => item.id === selectedSettingsSubpage);
    if (matchedItem && selectedGroupFilter !== 'all') {
      setSelectedGroupFilter(matchedItem.group);
    }
  }

  return (
    <div className={`flex-1 bg-white dark:bg-gray-800 p-3 md:p-6 lg:p-8 rounded-2xl border transition-all duration-500 flex flex-col min-h-0 overflow-y-auto custom-scrollbar relative group/main shrink-0 text-left ${theme.glow} ${theme.border} ${theme.darkBorder}`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-500 ${theme.gradient}`}></div>

      <div className="flex items-center justify-between mb-6 shrink-0 text-left">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none font-display dark:text-white">
              {(importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher')
                ? (importCategory === 'transaction_voucher' ? t("Transaction Voucher Ingestion") : importCategory === 'item_voucher' ? t("Inventory Transaction Ingestion") : t("Voucher Classification"))
                : importCategory === 'ledger_master' 
                ? t("Ledger Masters") 
                : importCategory === 'item_master'
                ? t("Item Masters")
                : importCategory === 'bank' 
                ? t("Bank Selection") 
                : importCategory === 'tax_related'
                ? t("GST Compliance Forms")
                : importCategory === 'settings'
                ? t("Ingestion Control Settings")
                : t("Data Entry Origin")}
            </h2>
            <div className="flex items-center mt-2 space-x-2">
                <div className="flex -space-x-1">
                    {[1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full border border-white transition-all duration-300 ${i === 1 ? theme.accent : 'bg-gray-200 dark:bg-gray-700'}`}></div>)}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border transition-all duration-300 ${theme.badge}`}>{t("Pipeline Alpha")}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                  {(importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher')
                    ? (importCategory === 'transaction_voucher' ? t("Classify accounting & commercial document records") : importCategory === 'item_voucher' ? t("Classify stock, warehouse & material logs") : t("Classify document & ingest record"))
                    : importCategory === 'ledger_master'
                    ? t("Select ledger/accounts master data entity") 
                    : importCategory === 'item_master'
                    ? t("Select inventory/item master data entity") 
                    : importCategory === 'bank' 
                    ? t("Select bank for statement import") 
                    : importCategory === 'tax_related'
                    ? t("Select standard GSTR compliance sheet template")
                    : importCategory === 'settings'
                    ? t("Configure processing defaults and credentials")
                    : t("Select data type")}
                </p>
            </div>
         </div>
      </div>
      
      <div className="mb-6">
        {(importCategory === 'voucher' || importCategory === 'transaction_voucher' || importCategory === 'item_voucher') && (
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
              {[
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
              ]
              .filter(item => importCategory === 'voucher' || item.category === importCategory)
              .map((item) => (
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
        )}

        {(importCategory === 'ledger_master' || importCategory === 'item_master') && (
          <>
            <div className="flex items-center justify-between mb-5 px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">
                  {importCategory === 'ledger_master' ? t("Ledger Masters") : t("Item Masters")}
                </label>
                <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-300">
              {(importCategory === 'ledger_master' 
                ? [
                    { id: 'contacts_staff', label: 'Staff Contacts', icon: Users },
                    { id: 'contacts_customers', label: 'Customer Contacts', icon: Users },
                    { id: 'contacts_vendors', label: 'Vendor Contacts', icon: Users },
                    { id: 'contacts_partners', label: 'Partner Contacts', icon: Users },
                    { id: 'ledgers', label: 'General Ledgers', icon: AccountIcon },
                    { id: 'banks', label: 'Bank Masters', icon: Building },
                    { id: 'accountGroups', label: 'Groups', icon: MapIcon },
                    { id: 'locations', label: 'Locations', icon: MapIcon },
                    { id: 'costCenters', label: 'Cost Centers', icon: CategoryIcon },
                  ]
                : [
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
                  ]
              ).map((item) => {
                const props = ledgerItemProps[item.id] || { color: 'text-blue-600', border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/20', darkBorder: 'dark:border-blue-400', darkText: 'dark:text-blue-300', iconColor: 'text-blue-500' };
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
        )}
        
        {importCategory === 'bank' && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start">
              <InfoIcon className="text-indigo-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900">{t("Raw Bank Import")}</h4>
                <p className="text-xs text-indigo-700 mt-0.5">{t("Importing a bank statement will automatically extract individual transaction lines. These will be presented as individual vouchers for your review and ledger mapping.")}</p>
              </div>
            </div>

            <div className="form-field-wrapper">
              <label className="form-label px-1">{t("Select Bank Source (Mandatory)")}</label>
              <select 
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">{t("-- Choose Indian Major Bank --")}</option>
                {bankMasters.map(bank => (
                  <option key={bank.name} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {importCategory === 'tax_related' && (
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
              {[
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
              ].map((item) => (
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
        )}

        {importCategory === 'settings' && (
          <div className="space-y-8 animate-in slide-in-from-top-2 duration-300 text-left">
            <div className="flex items-center justify-between px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">
                  {t("Select settings, sub-pages")}
                </label>
                <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
            </div>

             {/* Quick dropdown select bar for speed selection */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/30 dark:from-gray-900/40 dark:to-gray-900/10 p-5 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1 text-left">
                <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded tracking-widest inline-block mb-1.5 label-test">
                  {t("Select settings, sub-pages")}
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {t("Active Group Filters instantly restrict available subpages listed underneath.")}
                </p>
              </div>

              <div className="w-full md:w-[420px] shrink-0 flex items-center gap-3">
                <span className="text-xs font-black text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {t("Choose Category:")}
                </span>
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => {
                    const newGroup = e.target.value;
                    setSelectedGroupFilter(newGroup);
                    if (newGroup !== 'all') {
                      // Dynamically update the selected settings subpage to the first page in the newly selected group
                      const groupItems = settingsSubpages.filter(item => item.group === newGroup);
                      if (groupItems.length > 0 && setSelectedSettingsSubpage) {
                        setSelectedSettingsSubpage(groupItems[0].id);
                      }
                    }
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer transition-all duration-200"
                >
                  <option value="all">{t("All (Show All)")}</option>
                  <option value={t("Management & Organization")}>{t("Management & Organization")}</option>
                  <option value={t("System & Navigation Defaults")}>{t("System & Navigation Defaults")}</option>
                  <option value={t("Operations & Data Integration")}>{t("Operations & Data Integration")}</option>
                  <option value={t("Aesthetics, Forms & Printing")}>{t("Aesthetics, Forms & Printing")}</option>
                  <option value={t("Security, Governance & Support")}>{t("Security, Governance & Support")}</option>
                </select>
              </div>
            </div>

            {/* Visual Interactive Cards with Category Group Tabs */}
            <div className="space-y-6">
              {(selectedGroupFilter === 'all'
                ? [
                    t("Management & Organization"),
                    t("System & Navigation Defaults"),
                    t("Operations & Data Integration"),
                    t("Aesthetics, Forms & Printing"),
                    t("Security, Governance & Support")
                  ]
                : [selectedGroupFilter]
              ).map((groupName) => {
                const groupItems = settingsSubpages.filter(item => item.group === groupName);
                if (groupItems.length === 0) return null;
                return (
                  <div key={groupName} className="space-y-3">
                    <h5 className="text-[10px] font-black tracking-wider uppercase text-gray-400 dark:text-gray-500 flex items-center px-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
                      {groupName}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupItems.map((item) => {
                        const isSelected = selectedSettingsSubpage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedSettingsSubpage && setSelectedSettingsSubpage(item.id)}
                            className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex cursor-pointer w-full ${
                              isSelected
                                ? getActiveSettingStyles(item.id) + ' scale-[1.01]'
                                : 'bg-white hover:bg-gray-50/50 border-gray-100 hover:border-gray-300/80 hover:shadow-sm dark:bg-gray-850 dark:border-gray-700/60 dark:hover:border-gray-600'
                            }`}
                          >
                            {/* Accent highlight strip on side */}
                            <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isSelected ? item.accent : 'bg-transparent'}`}></div>

                            <div className="flex gap-4 w-full">
                              {/* Icon container */}
                              <div className={`p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.color} flex items-center justify-center h-11 w-11`}>
                                <item.icon className="w-5 h-5" />
                              </div>

                              {/* Text details */}
                              <div className="flex-1 min-w-0 pr-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h6 className={`text-xs font-black truncate leading-tight ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {item.label}
                                  </h6>
                                  {isSelected && (
                                    <span className={`text-[10px] ${item.accent} text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase shrink-0 tracking-wide scale-90`}>
                                      {t("Active")}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Premium Guide notice */}
            <div className={`p-5 transition-all duration-500 rounded-2xl border ${theme.bg} ${theme.border} ${theme.darkBorder}`}>
              <div className="flex gap-4">
                <div className={`p-3 bg-white dark:bg-gray-800 rounded-xl border shadow-sm self-start shrink-0 transition-colors duration-500 ${theme.border} ${theme.darkBorder} ${theme.text} ${theme.darkText}`}>
                  <Settings className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-500 ${theme.text} ${theme.darkText}`}>
                    {t("Selected Pipeline Destination")}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                    {t("You have selected: ")} <strong className={`uppercase tracking-wider transition-colors duration-500 ${theme.text} ${theme.darkText}`}>{selectedSettingsSubpage.replace(/_/g, ' ').toUpperCase()}</strong>.
                    {t(" On the next pages, the parse matrix validation controls will align perfectly against the parameters and variables of this subpage configuration.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {importCategory === 'other' && (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1">
                <label className="block text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] opacity-40 dark:text-white">{t("Select Target Database Table")}</label>
                <div className="h-px flex-1 bg-gray-100 mx-6 dark:bg-gray-800"></div>
            </div>

            <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">{t("Active Import Target Category")}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {t("Select the structured table template you want to parse and ingest your miscellaneous data into.")}
                </p>
              </div>
              <div className="w-full md:w-72">
                <select
                  value={selectedOtherCategory}
                  onChange={(e) => setSelectedOtherCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer"
                >
                  <optgroup label={t("Miscellaneous Databases")}>
                    <option value="employees_payroll">{t("Employees & Payroll")}</option>
                    <option value="fixed_assets">{t("Fixed Asset Registry")}</option>
                    <option value="currency_rates">{t("Forex Rate Matrices")}</option>
                    <option value="projects_wbs">{t("Projects & Contract WBS")}</option>
                    <option value="barcodes_units">{t("Barcodes & Packaging Mappings")}</option>
                    <option value="discount_rules">{t("Discount & Promo Schemes")}</option>
                    <option value="custom_dirs">{t("Custom Directory Master")}</option>
                    <option value="custom">{t("Custom Category")}</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Quick Informational Guide Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: 'employees_payroll', label: 'Payroll & HR', grp: 'Enterprise', d: 'HR personal profiles & salary structures', col: 'from-violet-500/10 to-transparent' },
                { id: 'fixed_assets', label: 'Fixed Assets', grp: 'Asset Mgmt', d: 'Fixtures, equipment & depreciation', col: 'from-indigo-500/10 to-transparent' },
                { id: 'currency_rates', label: 'Forex Matrices', grp: 'Compliance', d: 'Multi-currency conversion tables', col: 'from-teal-500/10 to-transparent' },
                { id: 'projects_wbs', label: 'Projects WBS', grp: 'Operations', d: 'Client contract work breakdowns', col: 'from-amber-500/10 to-transparent' },
                { id: 'discount_rules', label: 'Discount Schemes', grp: 'Sales Slabs', d: 'Pricing markdowns & promo matrices', col: 'from-rose-500/10 to-transparent' },
              ].map((card) => {
                const isSelected = selectedOtherCategory === card.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedOtherCategory(card.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-550 bg-gradient-to-br from-blue-50/50 to-white dark:bg-gray-800 dark:border-blue-400' 
                        : 'border-gray-150 bg-white hover:border-blue-300 hover:bg-gray-50/50 dark:bg-gray-850 dark:border-gray-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                        {t(card.grp)}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      )}
                    </div>
                    <h5 className="text-xs font-extrabold text-gray-850 dark:text-white mt-1">{t(card.label)}</h5>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">{t(card.d)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
