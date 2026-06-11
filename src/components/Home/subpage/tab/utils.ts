import { 
  Cpu, 
  PlusCircle, 
  Database, 
  Layers, 
  Activity,
  ShieldCheck,
  Inbox,
  Lock,
  Plus,
  FolderOpen,
  Settings2,
  ListTodo,
  FileSearch,
  BookOpen,
  PieChart,
  Users,
  LineChart,
  UserCheck,
  Layout,
  Scale,
  Trash2,
  History,
  MapPin,
  Globe,
  TrendingUp,
  BarChart3,
  CreditCard,
  Building,
  FileCode,
  AlertCircle,
  Package,
  Receipt,
  ShoppingCart,
  Percent,
  Calculator,
  UserPlus,
  LayoutGrid,
  Zap,
  RotateCw,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Terminal,
  ShieldAlert,
  Sparkles,
  FileText
} from 'lucide-react';

export const mainIcons: Record<string, any> = {
  "index": Layers, "dashboard": PieChart, "voucher-entry": PlusCircle, "inventory-entry": Database,
  "import": Cpu, "bulk-operation": Activity, "ledger-master": BookOpen, "item-master": FolderOpen,
  "bank": ShieldCheck, "vouchers": FileText, "gst-report": Inbox, "tax-report": LineChart,
  "item-report": Activity, "reports": FileSearch, "settings": Settings2, "help": BookOpen, "support": Users,
};

export const mainColors: Record<string, string> = {
  "index": "from-blue-500 to-indigo-600", "dashboard": "from-purple-500 to-pink-600",
  "voucher-entry": "from-emerald-500 to-teal-600", "inventory-entry": "from-amber-500 to-orange-600",
  "import": "from-blue-500 to-indigo-600", "bulk-operation": "from-cyan-500 to-blue-600",
  "ledger-master": "from-slate-600 to-slate-800", "item-master": "from-amber-500 to-orange-600",
  "bank": "from-emerald-500 to-teal-600", "vouchers": "from-purple-500 to-pink-600",
  "gst-report": "from-indigo-500 to-blue-600", "tax-report": "from-teal-500 to-emerald-600",
  "item-report": "from-orange-500 to-amber-600", "reports": "from-slate-600 to-slate-800",
  "settings": "from-gray-600 to-gray-800", "help": "from-blue-400 to-blue-600", "support": "from-purple-400 to-purple-600",
};

export const subIcons: Record<string, any> = {
  "hub": Layers, "info": Activity, "telemetry": Cpu, "security": Lock,
  "overview": PieChart, "sales": LineChart, "purchase": ShoppingCart, "payment": CreditCard, "receipts": Receipt, "journal": FileText, "contra": RotateCw,
  "sales-entry": Plus, "purchase-entry": ShoppingCart, "payment-entry": CreditCard, "receipt-entry": Receipt, "debit_note": ShieldCheck, "credit_note": ShieldCheck,
  "inventory-entry": Database, "vouchers-list": ListTodo, "pending-vouchers": Clock, "approved-vouchers": CheckCircle2,
  "stock_journal": Layers, "physical_stock": CheckCircle2, "consumption": Trash2, "scrap": AlertCircle, "transfer": Globe, "rejections_in": RotateCw,
  "upload": Database, "correction": FileSearch, "summary": PieChart, "success": CheckCircle2,
  "pricing": Percent, "anomaly-detection": ShieldAlert, "auto-reconcile": Zap, "tax-updater": Scale, "batch-approval": UserCheck,
  "parties": Users, "vendors": Building, "ledgers": BookOpen, "banks": Building, "contacts": Users, "locations": MapPin, "items": Package, "bom": Settings2,
  "standard": FileText, "day_book": Clock, "audit_trail": History, "pl": BarChart3, "bs": Briefcase, "gst-report": FileCode, "tax-report": Calculator,
  "settings": Settings2, "firm": Building, "general": Settings2, "ui": Layout, "formdetails": FileCode, "users": Users, "security-settings": Lock, "ai": Sparkles
};

export const tabIcons: Record<string, any> = {
  "metrics": Activity, "revenue": TrendingUp, "dues": AlertCircle, "growth": LineChart, "cashflow": CreditCard, "statement": FileText,
  "transactions": ListTodo, "entries": FileSearch, "returns": RotateCw, "items_grid": LayoutGrid, "counting": Search, "audit": History,
  "mapping": Layers, "logs": Terminal, "margins": Percent, "outliers": ShieldAlert, "profile": UserPlus, "address": MapPin, "banking": Building,
  "pdf_header": FileCode, "color": Sparkles, "layout": Layout, "passwords": Lock, "gdpr": ShieldCheck, "api_keys": Terminal,
  "sales_ledger": BookOpen, "purchase_ledger": ShoppingCart, "bank_ledger": Building, "tax_ledger": Scale, "stock_list": Package, "price_list": Percent
};

export const subThemes: Record<string, { gradient: string; text: string; bg: string; hover: string }> = {
  "hub": { gradient: "from-blue-500 to-indigo-600", text: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30", hover: "hover:bg-blue-100 dark:hover:bg-blue-900/50" },
  "info": { gradient: "from-cyan-500 to-blue-600", text: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/30", hover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/50" },
  "telemetry": { gradient: "from-purple-500 to-pink-600", text: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/30", hover: "hover:bg-purple-100 dark:hover:bg-purple-900/50" },
  "security": { gradient: "from-slate-600 to-slate-800", text: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800", hover: "hover:bg-slate-100 dark:hover:bg-slate-700" },
  "overview": { gradient: "from-blue-400 to-indigo-500", text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30", hover: "hover:bg-blue-100 dark:hover:bg-blue-900/50" },
  "sales": { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30", hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50" },
  "purchase": { gradient: "from-amber-500 to-orange-600", text: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30", hover: "hover:bg-amber-100 dark:hover:bg-amber-900/50" },
  "payment": { gradient: "from-pink-500 to-rose-600", text: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-900/30", hover: "hover:bg-pink-100 dark:hover:bg-pink-900/50" },
  "receipts": { gradient: "from-emerald-400 to-teal-500", text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30", hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50" },
  "journal": { gradient: "from-violet-500 to-purple-600", text: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/30", hover: "hover:bg-violet-100 dark:hover:bg-violet-900/50" },
  "contra": { gradient: "from-orange-400 to-red-500", text: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/30", hover: "hover:bg-orange-100 dark:hover:bg-orange-900/50" }
};

export const tabThemes: Record<string, { gradient: string; text: string; bg: string; hover: string }> = {
  "metrics": { gradient: "from-blue-500 to-indigo-600", text: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30", hover: "hover:bg-blue-100 dark:hover:bg-blue-900/50" },
  "revenue": { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30", hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50" },
  "dues": { gradient: "from-rose-500 to-pink-600", text: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/30", hover: "hover:bg-rose-100 dark:hover:bg-rose-900/50" },
  "growth": { gradient: "from-indigo-500 to-purple-600", text: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/30", hover: "hover:bg-indigo-105" },
  "cashflow": { gradient: "from-cyan-500 to-blue-600", text: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/30", hover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/50" },
  "mapping": { gradient: "from-amber-500 to-orange-600", text: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30", hover: "hover:bg-amber-100 dark:hover:bg-amber-900/50" },
  "logs": { gradient: "from-gray-500 to-gray-700", text: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-800", hover: "hover:bg-gray-100 dark:hover:bg-gray-700" },
  "audit": { gradient: "from-amber-400 to-orange-500", text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30", hover: "hover:bg-amber-100 dark:hover:bg-amber-900/50" }
};

export const colorThemes = [
  { gradient: "from-blue-500 to-indigo-600", text: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30", hover: "hover:bg-blue-100 dark:hover:bg-blue-900/50" },
  { gradient: "from-cyan-500 to-blue-600", text: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/30", hover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/50" },
  { gradient: "from-purple-500 to-pink-600", text: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/30", hover: "hover:bg-purple-100 dark:hover:bg-purple-900/50" },
  { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30", hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50" },
  { gradient: "from-amber-500 to-orange-600", text: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30", hover: "hover:bg-amber-100 dark:hover:bg-amber-900/50" },
  { gradient: "from-pink-500 to-rose-600", text: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-900/30", hover: "hover:bg-pink-100 dark:hover:bg-pink-900/50" },
  { gradient: "from-violet-500 to-purple-600", text: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/30", hover: "hover:bg-violet-100 dark:hover:bg-violet-900/50" },
  { gradient: "from-orange-400 to-red-500", text: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/30", hover: "hover:bg-orange-100 dark:hover:bg-orange-900/50" },
  { gradient: "from-teal-500 to-emerald-600", text: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/30", hover: "hover:bg-teal-100 dark:hover:bg-teal-900/50" },
  { gradient: "from-rose-500 to-pink-600", text: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/30", hover: "hover:bg-rose-100 dark:hover:bg-rose-900/50" },
  { gradient: "from-indigo-500 to-blue-600", text: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/30", hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/50" },
  { gradient: "from-sky-500 to-indigo-600", text: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/30", hover: "hover:bg-sky-100 dark:hover:bg-sky-900/50" },
  { gradient: "from-slate-500 to-slate-700", text: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800", hover: "hover:bg-slate-100 dark:hover:bg-slate-700" }
];

export const availableIconsArray = [
  Cpu, Database, Layers, Activity, ShieldCheck, FileText, Sparkles, Inbox, Lock, Plus, FolderOpen,
  Settings2, ListTodo, FileSearch, BookOpen, PieChart, Users, LineChart, UserCheck, Layout, Scale, Trash2, History, MapPin,
  Globe, TrendingUp, BarChart3, CreditCard, Building, FileCode, AlertCircle, Package, Receipt, ShoppingCart, Percent,
  Calculator, UserPlus, LayoutGrid, Zap, RotateCw, Search, CheckCircle2, Clock, Briefcase, Terminal, ShieldAlert
];

export const getHash = (id: string, max: number, salt: number = 0) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash) + salt;
  }
  return Math.abs(hash) % max;
};

export const getSubTheme = (id: string) => subThemes[id] || colorThemes[getHash(id, colorThemes.length, 1)];
export const getTabTheme = (id: string) => tabThemes[id] || colorThemes[getHash(id, colorThemes.length, 2)];
export const getSubIcon = (id: string) => subIcons[id] || availableIconsArray[getHash(id, availableIconsArray.length, 3)];
export const getTabIcon = (id: string) => tabIcons[id] || availableIconsArray[getHash(id, availableIconsArray.length, 4)];

