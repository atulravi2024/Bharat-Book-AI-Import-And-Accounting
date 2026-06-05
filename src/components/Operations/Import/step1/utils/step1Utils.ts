import { VoucherType } from '../../../../../app/types';
import { MasterType } from '../types';

export const ledgerItemProps: Record<string, { color: string; border: string; bg: string; text: string; darkBg: string; darkBorder: string; darkText: string; iconColor: string }> = {
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

export const getActiveSettingStyles = (itemId: string): string => {
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

export const getThemeConfig = (
  importCategory: string,
  voucherType: VoucherType,
  masterType: MasterType,
  selectedSettingsSubpage: string = 'pref_general',
  selectedOtherCategory: string
) => {
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
      badge: 'text-cyan-605 bg-cyan-50 border-cyan-101/60 dark:text-cyan-400 dark:bg-cyan-950/40 dark:border-cyan-900/30',
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
      border: 'border-yellow-101',
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
