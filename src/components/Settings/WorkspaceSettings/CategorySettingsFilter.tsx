import React, { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { 
  Paintbrush, 
  Settings, 
  LayoutGrid, 
  Database, 
  ShieldAlert, 
  Search, 
  ArrowRight, 
  Layers, 
  FileText, 
  Cpu, 
  Users, 
  Bell, 
  EyeOff, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  Info,
  List,
  Grid,
  Map,
  BookOpen,
  Sliders,
  Maximize,
  Coins,
  ShieldCheck,
  Building,
  MapPin,
  Briefcase,
  Layers as LayersIcon,
  Volume2,
  Lock,
  Activity,
  Workflow
} from "lucide-react";

interface CategorySettingsFilterProps {
  setActiveTab: (tab: string) => void;
  t: (key: string) => string;
}

export interface SettingItem {
  id: string;
  title: string;
  category: "all" | "ui" | "general" | "layout" | "data" | "security";
  desc: string;
  icon: React.ComponentType<any>;
  badge: string;
  status: string;
  details: string;
  type: "subpages" | "tab";
  onClickCustom?: () => void;
  theme: {
    bg: string;
    border: string;
    icon: string;
    badge: string;
    btn: string;
  };
}

// Dynamically generate individual card footer actions with unique color mappings
export const getCardButtonStyles = (bgClass: string) => {
  const match = bgClass.match(/bg-(\w+)-/);
  const f = match ? match[1] : "indigo";

  // Map each primary theme category color to its complementary/secondary action accent
  const complementaryColors: Record<string, string> = {
    indigo: "violet",
    fuchsia: "rose",
    cyan: "sky",
    amber: "orange",
    teal: "emerald",
    rose: "pink",
    violet: "indigo",
    orange: "amber",
    sky: "blue",
    emerald: "teal",
    blue: "sky",
    yellow: "amber",
    red: "orange",
    slate: "emerald",
    pink: "fuchsia",
    green: "teal"
  };
  const g = complementaryColors[f] || "indigo";

  // Dense solid filled styling for the Direct Entry button (f)
  // Ensures these buttons feel like fully-fledged, chunky, solid-filled 3D actions!
  const getSolidDirectBtnStyles = (color: string) => {
    if (color === "yellow") {
      return "bg-yellow-500 dark:bg-yellow-500 text-gray-950 font-black border border-yellow-600/40 hover:bg-yellow-600 hover:border-yellow-750 hover:shadow-md transition-all duration-300 transform active:scale-97 active:translate-y-[0.5px] shadow-sm";
    }
    return `bg-${color}-600 dark:bg-${color}-600 text-white font-black border border-${color}-700/40 hover:bg-${color}-700 hover:border-${color}-800 hover:shadow-md dark:hover:bg-${color}-500 dark:hover:border-${color}-500 transition-all duration-300 transform active:scale-97 active:translate-y-[0.5px] shadow-sm`;
  };

  const getDirectIconStyles = (color: string) => {
    if (color === "yellow") return "text-yellow-950 group-hover/direct:scale-115 group-hover/lst-direct:scale-115 transition-transform duration-300";
    return `text-${color}-100 group-hover/direct:text-white group-hover/lst-direct:text-white group-hover/direct:scale-115 group-hover/lst-direct:scale-115 transition-transform duration-300`;
  };

  // Chunky, opaque, beautifully-highlighted solid filled action for the Guided Walk button (g)
  // No longer transparent, these are elegantly filled with soft solid backgrounds to prevent looking like plain text!
  const getSolidGuidedBtnStyles = (color: string) => {
    if (color === "yellow") {
      return "bg-yellow-100 text-yellow-950 border border-yellow-350 hover:bg-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-750 hover:text-gray-950 hover:border-yellow-600 shadow-sm active:scale-97 transition-all duration-300 transform";
    }
    return `bg-${color}-100/90 text-${color}-900 border border-${color}-300/80 hover:bg-${color}-600 hover:text-white hover:border-${color}-600 dark:bg-${color}-950/70 dark:text-${color}-200 dark:border-${color}-800/80 dark:hover:bg-${color}-500 dark:hover:text-white dark:hover:border-${color}-500 shadow-sm active:scale-97 transition-all duration-300 transform`;
  };

  const getGuidedIconStyles = (color: string) => {
    if (color === "yellow") return "text-yellow-800 group-hover/guided:text-gray-950 group-hover/lst-guided:text-gray-950 group-hover/guided:scale-115 group-hover/lst-guided:scale-115 transition-transform duration-300";
    return `text-${color}-600 dark:text-${color}-400 group-hover/guided:text-white group-hover/lst-guided:text-white group-hover/guided:scale-115 group-hover/lst-guided:scale-115 transition-transform duration-300`;
  };

  return {
    direct: {
      fBtn: getSolidDirectBtnStyles(f),
      fIcon: getDirectIconStyles(f)
    },
    guided: {
      gBtn: getSolidGuidedBtnStyles(g),
      gIcon: getGuidedIconStyles(g)
    }
  };
};

export const CategorySettingsFilter: React.FC<CategorySettingsFilterProps> = ({ setActiveTab, t }) => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ui" | "general" | "layout" | "data" | "security" >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState<"all" | "subpages" | "tab">("all");

  React.useEffect(() => {
    const applyOverride = () => {
      const override = localStorage.getItem("bharat_book_setting_categories_subtab_override");
      if (override) {
        if (override === "subpages" || override === "tab") {
          setTypeFilter(override);
          setSelectedCategory("all");
        } else if (["ui", "general", "layout", "data", "security"].includes(override)) {
          setSelectedCategory(override as any);
          setTypeFilter("all");
        } else {
          setSelectedCategory("all");
          setTypeFilter("all");
        }
      }
    };

    applyOverride();

    window.addEventListener("bharat_book_setting_categories_subtab_trigger", applyOverride);
    return () => {
      window.removeEventListener("bharat_book_setting_categories_subtab_trigger", applyOverride);
    };
  }, []);

  const subpages: SettingItem[] = [
    // ==========================================
    // 📄 CURRENT SUBPAGES (type: "subpage")
    // ==========================================
    { 
      id: "ui", 
      title: t("UI Settings"), 
      category: "ui", 
      desc: t("Customize interface density (compact/spacious), layout theme palette, and global font family."),
      icon: Paintbrush,
      badge: t("Appearance"),
      status: t("Active"),
      details: t("Compact, Standard, Spacious densities. Classic Amber-Blue, Coal, Cobalt, and Emerald themes."),
      type: "subpages",
      theme: {
        bg: "bg-indigo-50/40 dark:bg-indigo-950/20",
        border: "border-indigo-100 dark:border-indigo-900/40 hover:border-indigo-400/60 dark:hover:border-indigo-700/60",
        icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
        badge: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        btn: "hover:bg-indigo-600 text-indigo-700 hover:text-white dark:text-indigo-400 border-indigo-100 dark:border-indigo-900"
      }
    },
    { 
      id: "formdetails", 
      title: t("Form Detail"), 
      category: "ui", 
      desc: t("Configure form layouts, specific behavior rules, and presentation widths for responsive devices."),
      icon: LayoutGrid,
      badge: t("Layouts"),
      status: t("Optimized"),
      details: t("Customize desktop, tablet, and mobile grid spans, margins, and inline autocomplete lists."),
      type: "subpages",
      theme: {
        bg: "bg-fuchsia-50/40 dark:bg-fuchsia-950/20",
        border: "border-fuchsia-100 dark:border-fuchsia-900/40 hover:border-fuchsia-400/60 dark:hover:border-fuchsia-700/60",
        icon: "bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400",
        badge: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
        btn: "hover:bg-fuchsia-600 text-fuchsia-700 hover:text-white dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-900"
      }
    },
    { 
      id: "invoiceprint", 
      title: t("Invoice & Print"), 
      category: "ui", 
      desc: t("Manage document print layouts, letterhead margins, PDF header designs, and direct bill templates."),
      icon: FileText,
      badge: t("Templates"),
      status: t("Active"),
      details: t("Test custom print rendering, backup print JSON configurations, customize tax display parameters."),
      type: "subpages",
      theme: {
        bg: "bg-cyan-50/40 dark:bg-cyan-950/20",
        border: "border-cyan-100 dark:border-cyan-900/40 hover:border-cyan-400/60 dark:hover:border-cyan-700/60",
        icon: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400",
        badge: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        btn: "hover:bg-cyan-600 text-cyan-700 hover:text-white dark:text-cyan-400 border-cyan-100 dark:border-cyan-900"
      }
    },
    { 
      id: "general", 
      title: t("General"), 
      category: "general", 
      desc: t("Configure application system options, date styles, local timezones, and keyboard shortcut states."),
      icon: Settings,
      badge: t("System"),
      status: t("Active"),
      details: t("Date formats (DD/MM/YYYY, YYYY-MM-DD), dynamic local sound effects, auto-lock timeouts (mins)."),
      type: "subpages",
      theme: {
        bg: "bg-amber-50/40 dark:bg-amber-950/20",
        border: "border-amber-100 dark:border-amber-900/40 hover:border-amber-400/60 dark:hover:border-amber-700/60",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
        btn: "hover:bg-amber-600 text-amber-700 hover:text-white dark:text-amber-400 border-amber-100 dark:border-amber-900"
      }
    },
    { 
      id: "firm", 
      title: t("Firm Configuration"), 
      category: "general", 
      desc: t("Update organization branding indices, address specifications, fiscal year ranges, and basic info."),
      icon: Layers,
      badge: t("Company"),
      status: t("Setup Done"),
      details: t("Set Indian / Standard fiscal accounting periods, brand contact lines, base currency variables."),
      type: "subpages",
      theme: {
        bg: "bg-teal-50/40 dark:bg-teal-950/20",
        border: "border-teal-100 dark:border-teal-900/40 hover:border-teal-400/60 dark:hover:border-teal-700/60",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
        badge: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100 dark:border-teal-900"
      }
    },
    { 
      id: "about", 
      title: t("About App"), 
      category: "general", 
      desc: t("View system software credentials, release annotations, active licensing, and framework specifications."),
      icon: Info,
      badge: t("Metadata"),
      status: t("v2.0.4"),
      details: t("Verify workspace compile environment metrics, view local developer notes and licensing parameters."),
      type: "subpages",
      theme: {
        bg: "bg-rose-50/45 dark:bg-rose-950/20",
        border: "border-rose-100 dark:border-rose-900/40 hover:border-rose-400/60 dark:hover:border-rose-700/60",
        icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        badge: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
        btn: "hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 border-rose-100 dark:border-rose-900"
      }
    },
    { 
      id: "navigation", 
      title: t("App Navigation Defaults"), 
      category: "layout", 
      desc: t("Specify default startup landing pages, priority menu structures, and custom contextual routes."),
      icon: Layers,
      badge: t("App Rules"),
      status: t("Configured"),
      details: t("Define main landing overrides, configure startup priorities, adjust redirect behaviors."),
      type: "subpages",
      theme: {
        bg: "bg-violet-50/40 dark:bg-violet-950/20",
        border: "border-violet-100 dark:border-violet-900/40 hover:border-violet-400/65 dark:hover:border-violet-700/65",
        icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
        badge: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
        btn: "hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-400 border-violet-100 dark:border-violet-900"
      }
    },
    { 
      id: "vouchernumbering", 
      title: t("Voucher Numbering"), 
      category: "layout", 
      desc: t("Automate generation sequences for sales, purchase, and general ledger journal vouchers."),
      icon: FileText,
      badge: t("Sequences"),
      status: t("Automated"),
      details: t("Adjust prefixes, suffixes, numbering padding lengths, suffix years format, restart frequencies."),
      type: "subpages",
      theme: {
        bg: "bg-orange-50/40 dark:bg-orange-950/20",
        border: "border-orange-100 dark:border-orange-900/40 hover:border-orange-400/60 dark:hover:border-orange-700/60",
        icon: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
        badge: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
        btn: "hover:bg-orange-600 text-orange-700 hover:text-white dark:text-orange-400 border-orange-100 dark:border-orange-900"
      }
    },
    { 
      id: "workspace", 
      title: t("Setting Explorer"), 
      category: "data", 
      desc: t("Dynamically search, tag, and discover specific credentials or configurations instantly across subpages."),
      icon: Search,
      badge: t("Discovery"),
      status: t("Ready"),
      details: t("Universal instant key-value and parameter configurations search, active keyword highlighter."),
      type: "subpages",
      theme: {
        bg: "bg-sky-50/40 dark:bg-sky-950/20",
        border: "border-sky-100 dark:border-sky-900/40 hover:border-sky-400/60 dark:hover:border-sky-700/60",
        icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
        badge: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
        btn: "hover:bg-sky-600 text-sky-700 hover:text-white dark:text-sky-400 border-sky-100 dark:border-sky-900"
      }
    },
    { 
      id: "imports", 
      title: t("Import Rules"), 
      category: "data", 
      desc: t("Define structured ledger ingestion rules, schema file headers, and Excel sheet configuration profiles."),
      icon: Database,
      badge: t("Pipeline"),
      status: t("Active"),
      details: t("Control multi-stage pipelines (Stage 1 validation, Stage 2 AI processor), automate ledger checks."),
      type: "subpages",
      theme: {
        bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
        border: "border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-400/60 dark:hover:border-emerald-700/60",
        icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
        badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        btn: "hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-400 border-emerald-100 dark:border-emerald-900"
      }
    },
    { 
      id: "mapping", 
      title: t("Mapping Rules"), 
      category: "data", 
      desc: t("Configure advanced keyword extractions, UTR detection indices, ledger mapping rules, and regex matchers."),
      icon: Map,
      badge: t("Auto Align"),
      status: t("Adaptive"),
      details: t("Simulator sandbox for test narration checks, bank custom keywords lists, IFSC patterns detector."),
      type: "subpages",
      theme: {
        bg: "bg-amber-50/40 dark:bg-amber-950/20",
        border: "border-amber-100 dark:border-amber-900/40 hover:border-amber-400/60 dark:hover:border-amber-700/60",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
        btn: "hover:bg-amber-600 text-amber-700 hover:text-white dark:text-amber-400 border-amber-100 dark:border-amber-900"
      }
    },
    { 
      id: "ai", 
      title: t("AI Engines"), 
      category: "data", 
      desc: t("Configure Gemini models for deep auto-classification, audit loops, and intelligent voucher processing."),
      icon: Cpu,
      badge: t("Gemini AI"),
      status: t("Model Active"),
      details: t("Toggle Flash vs Pro models, direct model diagnostic tests, external gateway router routing controls."),
      type: "subpages",
      theme: {
        bg: "bg-blue-50/40 dark:bg-blue-950/20",
        border: "border-blue-100 dark:border-blue-900/40 hover:border-blue-400/65 dark:hover:border-blue-700/65",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100 dark:border-blue-900"
      }
    },
    { 
      id: "data", 
      title: t("Data Explorer"), 
      category: "data", 
      desc: t("Directly access database structures, inspect JSON schemas, download system state dumps, and view schemas."),
      icon: Database,
      badge: t("Inspect"),
      status: t("Developer Mode"),
      details: t("Download active localized backups, view direct technical ledger schemas and tabular arrays."),
      type: "subpages",
      theme: {
        bg: "bg-violet-50/40 dark:bg-violet-950/20",
        border: "border-violet-100 dark:border-violet-900/40 hover:border-violet-400/60 dark:hover:border-violet-700/60",
        icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
        badge: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
        btn: "hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-400 border-violet-100 dark:border-violet-900"
      }
    },
    { 
      id: "users", 
      title: t("Users & Keys Desk"), 
      category: "security", 
      desc: t("Manage personnel login credentials, active roles matrix, division access, mapping system policies."),
      icon: Users,
      badge: t("Access Controls"),
      status: t("6 Online"),
      details: t("Modify Super Administrator, Division Managers, Operators policies, read live logins geo IP data."),
      type: "subpages",
      theme: {
        bg: "bg-rose-50/40 dark:bg-rose-950/20",
        border: "border-rose-100 dark:border-rose-900/40 hover:border-rose-400/65 dark:hover:border-rose-700/65",
        icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        badge: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
        btn: "hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 border-rose-100 dark:border-rose-900"
      }
    },
    { 
      id: "alerts", 
      title: t("Alert Channels"), 
      category: "security", 
      desc: t("Sync real-time event updates to in-app notification docks, Telegram boxes, SMS, or WhatsApp routers."),
      icon: Bell,
      badge: t("Broadcast"),
      status: t("Enabled"),
      details: t("Configure large ledger transactions alarm, bank Sync connection error flags, custom daily reports."),
      type: "subpages",
      theme: {
        bg: "bg-yellow-50/40 dark:bg-yellow-950/20",
        border: "border-yellow-100 dark:border-yellow-900/40 hover:border-yellow-400/60 dark:hover:border-yellow-700/60",
        icon: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
        badge: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        btn: "hover:bg-yellow-600 text-yellow-700 hover:text-white dark:text-yellow-400 border-yellow-100 dark:border-yellow-900"
      }
    },
    { 
      id: "security", 
      title: t("Security Protocols"), 
      category: "security", 
      desc: t("Enforce multi-factor verification, set strict session idle timeouts, review system access reports."),
      icon: ShieldAlert,
      badge: t("Cyber Warden"),
      status: t("Enforced"),
      details: t("Enable brute force IP lock rules, configure strict encryption layers, verify login telemetry."),
      type: "subpages",
      theme: {
        bg: "bg-red-50/40 dark:bg-red-950/20",
        border: "border-red-100 dark:border-red-900/40 hover:border-red-400/60 dark:hover:border-red-700/60",
        icon: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
        badge: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
        btn: "hover:bg-red-600 text-red-700 hover:text-white dark:text-red-400 border-red-100 dark:border-red-900"
      }
    },
    { 
      id: "privacy", 
      title: t("Privacy & Logs Choice"), 
      category: "security", 
      desc: t("Manage localized data collections, anonymous diagnostic reporting pipelines, and server metrics syncs."),
      icon: EyeOff,
      badge: t("Governance"),
      status: t("Private Mode"),
      details: t("Disable user telemetry tracking, configure regional server caching intervals, wipe active session cookies."),
      type: "subpages",
      theme: {
        bg: "bg-slate-50/40 dark:bg-slate-950/20",
        border: "border-slate-100 dark:border-slate-900/40 hover:border-slate-400/60 dark:hover:border-slate-700/60",
        icon: "bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400",
        badge: "text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20",
        btn: "hover:bg-slate-600 text-slate-700 hover:text-white dark:text-slate-400 border-slate-100 dark:border-slate-900"
      }
    },
    { 
      id: "admin", 
      title: t("System Admin Utilities"), 
      category: "security", 
      desc: t("Take manual state backup keys, clear cache memory pools, restart virtual nodes, trigger database syncs."),
      icon: Settings,
      badge: t("Terminal"),
      status: t("Root Active"),
      details: t("Download absolute system environment snapshot files, inspect active memory caches sizes parameters."),
      type: "subpages",
      theme: {
        bg: "bg-pink-50/40 dark:bg-pink-950/20",
        border: "border-pink-100 dark:border-pink-900/40 hover:border-pink-400/60 dark:hover:border-pink-700/60",
        icon: "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400",
        badge: "text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/20",
        btn: "hover:bg-pink-600 text-pink-700 hover:text-white dark:text-pink-400 border-pink-100 dark:border-pink-900"
      }
    },
    { 
      id: "help", 
      title: t("Help Center Docs"), 
      category: "security", 
      desc: t("Comprehensive, localized user guidelines, import step-by-step guides, troubleshooting index."),
      icon: BookOpen,
      badge: t("Manual"),
      status: t("Up to date"),
      details: t("Review Stage 1 vs Stage 2 descriptions, video guides, manual glossary indexing tables."),
      type: "subpages",
      theme: {
        bg: "bg-green-50/40 dark:bg-green-950/20",
        border: "border-green-100 dark:border-green-900/40 hover:border-green-400/60 dark:hover:border-green-700/60",
        icon: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
        badge: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
        btn: "hover:bg-green-600 text-green-700 hover:text-white dark:text-green-400 border-green-100 dark:border-green-900"
      }
    },
    { 
      id: "support", 
      title: t("Technical Support Desk"), 
      category: "security", 
      desc: t("Open immediate technical tickets, trigger diagnostics to division supervisors, view SLA logs."),
      icon: HelpCircle,
      badge: t("SLA Desk"),
      status: t("24/7 Available"),
      details: t("Direct support channel integration, automated diagnostic report attachment generator tool."),
      type: "subpages",
      theme: {
        bg: "bg-purple-50/40 dark:bg-purple-950/20",
        border: "border-purple-100 dark:border-purple-900/40 hover:border-purple-400/60 dark:hover:border-purple-700/60",
        icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
        badge: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
        btn: "hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-400 border-purple-100 dark:border-indigo-900"
      }
    },

    // ==========================================
    // 🗂️ NEW GRANULAR TABS (type: "tab")
    // ==========================================
    {
      id: "ui_sub_layout",
      title: t("Layout & Density Tab"),
      category: "ui",
      desc: t("Adjust display density parameters including Compact, Standard, and Spacious layout spacing and alignments."),
      icon: Sliders,
      badge: t("UI Tab"),
      status: t("Responsive"),
      details: t("Perfect desktop/mobile adaptive layouts padding scaling, grid sizing, custom borders spacing."),
      type: "tab",
      onClickCustom: () => { setActiveTab("ui_layout"); },
      theme: {
        bg: "bg-pink-50/20 dark:bg-pink-900/10",
        border: "border-pink-200/50 dark:border-pink-850 shadow-xs hover:border-pink-400",
        icon: "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400",
        badge: "text-pink-600 bg-pink-500/10 border-pink-500/20",
        btn: "hover:bg-pink-600 text-pink-700 hover:text-white dark:text-pink-400 border-pink-100/55 dark:border-pink-900/50"
      }
    },
    {
      id: "ui_sub_colors",
      title: t("Colors & Theme Palette Tab"),
      category: "ui",
      desc: t("Select and customize beautiful visual color aesthetics including Coal, Cobalt Deep Blue, and Emerald Palettes."),
      icon: Paintbrush,
      badge: t("UI Tab"),
      status: t("6 Palettes"),
      details: t("Toggle eye-save darkness layers, customize gradients, adjust focus borders hue values."),
      type: "tab",
      onClickCustom: () => { setActiveTab("ui_color"); },
      theme: {
        bg: "bg-purple-50/20 dark:bg-purple-900/10",
        border: "border-purple-200/50 dark:border-purple-850 shadow-xs hover:border-purple-400",
        icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
        badge: "text-purple-600 bg-purple-500/10 border-purple-500/20",
        btn: "hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-400 border-purple-100/55 dark:border-purple-900/50"
      }
    },
    {
      id: "ui_sub_formats",
      title: t("Data Display Formats Tab"),
      category: "ui",
      desc: t("Regulate decimal point precision configurations, select standard numeric values, and local currency system symbols."),
      icon: Coins,
      badge: t("UI Tab"),
      status: t("Flexible"),
      details: t("Tweak how active cells represent amounts with localized Indian comma separators (Lakhs/Crores)."),
      type: "tab",
      onClickCustom: () => { setActiveTab("ui_data"); },
      theme: {
        bg: "bg-blue-50/20 dark:bg-blue-900/10",
        border: "border-blue-200/50 dark:border-blue-850 shadow-xs hover:border-blue-400",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100/55 dark:border-blue-900/50"
      }
    },
    {
      id: "ui_sub_localization",
      title: t("Localization Preferences Tab"),
      category: "ui",
      desc: t("Establish primary languages, select responsive backup fonts, and toggle Indian Hindi translation grids."),
      icon: BookOpen,
      badge: t("UI Tab"),
      status: t("Localized"),
      details: t("Manage dual-language parameters, configure dictionary local fallbacks, verify UTF-8 symbols."),
      type: "tab",
      onClickCustom: () => { setActiveTab("ui_localization"); },
      theme: {
        bg: "bg-emerald-50/20 dark:bg-emerald-900/10",
        border: "border-emerald-200/50 dark:border-emerald-850 shadow-xs hover:border-emerald-400",
        icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
        badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        btn: "hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-400 border-emerald-100/55 dark:border-emerald-900/50"
      }
    },
    {
      id: "ui_sub_more",
      title: t("More Options & Triggers Tab"),
      category: "ui",
      desc: t("Configure dynamic sidebar interactive tabs, enable hover effect configurations, adjust list scrolling heights."),
      icon: Sliders,
      badge: t("UI Tab"),
      status: t("Verified"),
      details: t("Configure visual shortcuts, modify list toolbars spacing, streamline panel switching animations."),
      type: "tab",
      onClickCustom: () => { setActiveTab("ui_more"); },
      theme: {
        bg: "bg-teal-50/20 dark:bg-teal-900/10",
        border: "border-teal-200/50 dark:border-teal-850 shadow-xs hover:border-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
        badge: "text-teal-600 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100/55 dark:border-teal-900/50"
      }
    },
    {
      id: "ui_sub_maximum",
      title: t("Maximum Design Options Tab"),
      category: "ui",
      desc: t("Access experimental advanced layout settings, typography micro-scaling ratios, and layout container caps."),
      icon: Maximize,
      badge: t("UI Tab"),
      status: t("Ultimate"),
      details: t("Test container padding multipliers, verify layout debug elements, tweak border shadow density."),
      type: "tab",
      onClickCustom: () => { setActiveTab("ui_maximum"); },
      theme: {
        bg: "bg-fuchsia-50/20 dark:bg-fuchsia-900/10",
        border: "border-fuchsia-200/50 dark:border-fuchsia-850 shadow-xs hover:border-fuchsia-400",
        icon: "bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400",
        badge: "text-fuchsia-600 bg-fuchsia-500/10 border-fuchsia-500/20",
        btn: "hover:bg-fuchsia-600 text-fuchsia-700 hover:text-white dark:text-fuchsia-400 border-fuchsia-100/55 dark:border-fuchsia-900/50"
      }
    },
    {
      id: "print_sub_design",
      title: t("Printed Layout Design Tab"),
      category: "ui",
      desc: t("Select default billing format fonts, adjust page margin dimensions, and upload brand watermark elements."),
      icon: FileText,
      badge: t("Print Tab"),
      status: t("Design"),
      details: t("Adjust document header sizing, set dynamic branding margins, verify layout aspect ratios."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_invoiceprint_subtab_override', 'design'); setActiveTab('invoiceprint'); },
      theme: {
        bg: "bg-cyan-50/20 dark:bg-cyan-900/10",
        border: "border-cyan-200/50 dark:border-cyan-850 shadow-xs hover:border-cyan-400",
        icon: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400",
        badge: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
        btn: "hover:bg-cyan-600 text-cyan-705 hover:text-white dark:text-cyan-400 border-cyan-100/55 dark:border-cyan-900/50"
      }
    },
    {
      id: "print_sub_structure",
      title: t("Invoice PDF Structure Tab"),
      category: "ui",
      desc: t("Determine active data column structures, manage serial index listing borders, and format tax totals."),
      icon: LayoutGrid,
      badge: t("Print Tab"),
      status: t("Draft Ready"),
      details: t("Enable separate cess columns, config total summary container widths, adjust line item boundaries."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_invoiceprint_subtab_override', 'structure'); setActiveTab('invoiceprint'); },
      theme: {
        bg: "bg-amber-50/20 dark:bg-amber-900/10",
        border: "border-amber-200/50 dark:border-amber-850 shadow-xs hover:border-amber-400",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "text-amber-600 bg-amber-500/10 border-amber-500/20",
        btn: "hover:bg-amber-600 text-amber-700 hover:text-white dark:text-amber-400 border-amber-100/55 dark:border-amber-900/50"
      }
    },
    {
      id: "print_sub_content",
      title: t("Invoice Content Details Tab"),
      category: "ui",
      desc: t("Edit mandatory banking information terms, write legal declaration notes, and add sign parameters."),
      icon: FileText,
      badge: t("Print Tab"),
      status: t("Active"),
      details: t("Tweak fallback payment messages, store regulatory declaration copy, adjust font scale rules."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_invoiceprint_subtab_override', 'content'); setActiveTab('invoiceprint'); },
      theme: {
        bg: "bg-indigo-50/20 dark:bg-indigo-900/10",
        border: "border-indigo-200/50 dark:border-indigo-850 shadow-xs hover:border-indigo-400",
        icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
        badge: "text-indigo-600 bg-indigo-505/10 border-indigo-500/20",
        btn: "hover:bg-indigo-600 text-indigo-700 hover:text-white dark:text-indigo-400 border-indigo-100/55 dark:border-indigo-900/50"
      }
    },
    {
      id: "firm_sub_brand",
      title: t("Firm Identity & Branding Tab"),
      category: "general",
      desc: t("Maintain registered corporate headings, upload dynamic business logos, and formulate slogans."),
      icon: Building,
      badge: t("Firm Tab"),
      status: t("Verified"),
      details: t("Verify company name display settings, setup dark theme logo assets, verify brand margins."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_firm_subtab_override', 'identity'); setActiveTab('firm'); },
      theme: {
        bg: "bg-orange-50/20 dark:bg-orange-900/10",
        border: "border-orange-200/50 dark:border-orange-850 shadow-xs hover:border-orange-400",
        icon: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
        badge: "text-orange-600 bg-orange-500/10 border-orange-500/20",
        btn: "hover:bg-orange-600 text-orange-700 hover:text-white dark:text-orange-400 border-orange-100/55 dark:border-orange-900/50"
      }
    },
    {
      id: "firm_sub_contact",
      title: t("Locations & Contact Setup Tab"),
      category: "general",
      desc: t("Update official commercial addresses, support hotline phone lines, and billing inbox credentials."),
      icon: MapPin,
      badge: t("Firm Tab"),
      status: t("Ready"),
      details: t("Configure regional offices directories, map physical coordinates, verify geo postal limits."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_firm_subtab_override', 'contacts'); setActiveTab('firm'); },
      theme: {
        bg: "bg-rose-50/20 dark:bg-rose-900/10",
        border: "border-rose-200/50 dark:border-rose-850 shadow-xs hover:border-rose-400",
        icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        badge: "text-rose-600 bg-rose-500/10 border-rose-500/20",
        btn: "hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 border-rose-100/55 dark:border-rose-900/50"
      }
    },
    {
      id: "firm_sub_finance",
      title: t("Company Finance & Banking Tab"),
      category: "general",
      desc: t("Record company banking options, register official bank branch names, and declare fiscal periods."),
      icon: Coins,
      badge: t("Firm Tab"),
      status: t("Configured"),
      details: t("Tweak localized invoice prefix settings, map current cash balances tracking ledger lines."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_firm_subtab_override', 'finance'); setActiveTab('firm'); },
      theme: {
        bg: "bg-emerald-50/20 dark:bg-emerald-900/10",
        border: "border-emerald-200/50 dark:border-emerald-850 shadow-xs hover:border-emerald-400",
        icon: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
        badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        btn: "hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-400 border-emerald-100/55 dark:border-emerald-950/50"
      }
    },
    {
      id: "firm_sub_legal",
      title: t("Tax Compliance & Licenses Tab"),
      category: "general",
      desc: t("Configure formal GSTIN credentials, statutory tax structures, and business operating licenses."),
      icon: ShieldCheck,
      badge: t("Firm Tab"),
      status: t("Audit OK"),
      details: t("Activate real-time GST verification triggers, set up PAN declarations, store tax registration codes."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_firm_subtab_override', 'compliance'); setActiveTab('firm'); },
      theme: {
        bg: "bg-red-50/20 dark:bg-red-900/10",
        border: "border-red-200/50 dark:border-red-850 shadow-xs hover:border-red-400",
        icon: "bg-red-100 dark:bg-red-900/50 text-red-650 dark:text-red-400",
        badge: "text-red-650 bg-red-500/10 border-red-500/20",
        btn: "hover:bg-red-600 text-red-700 hover:text-white dark:text-red-400 border-red-100/55 dark:border-red-900/50"
      }
    },
    {
      id: "firm_sub_ops",
      title: t("Operations & Shift Policies Tab"),
      category: "general",
      desc: t("Maintain plant shift working periods, active logistics parameters, and operational checklists."),
      icon: Briefcase,
      badge: t("Firm Tab"),
      status: t("Active"),
      details: t("Tweak personnel division policies, adjust dispatch warehouse priority guidelines, track compliance."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_firm_subtab_override', 'operations'); setActiveTab('firm'); },
      theme: {
        bg: "bg-slate-50/20 dark:bg-slate-900/10",
        border: "border-slate-200/50 dark:border-slate-850 shadow-xs hover:border-slate-400",
        icon: "bg-slate-100 dark:bg-slate-900/50 text-slate-650 dark:text-slate-400",
        badge: "text-slate-605 bg-slate-500/10 border-slate-500/20",
        btn: "hover:bg-slate-600 text-slate-705 hover:text-white dark:text-slate-400 border-slate-100/55 dark:border-slate-900/50"
      }
    },
    {
      id: "firm_sub_system",
      title: t("Internal Systems Setup Tab"),
      category: "general",
      desc: t("Review live background connectivity syncs, manage API gateway flags, and execute direct health checks."),
      icon: Settings,
      badge: t("Firm Tab"),
      status: t("Standard"),
      details: t("Toggle network telemetry alerts, monitor database memory pools parameters, trace active logs."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_firm_subtab_override', 'system'); setActiveTab('firm'); },
      theme: {
        bg: "bg-blue-50/20 dark:bg-blue-900/10",
        border: "border-blue-200/50 dark:border-blue-850 shadow-xs hover:border-blue-400",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100/55 dark:border-blue-900/50"
      }
    },
    {
      id: "gen_sub_sound",
      title: t("System Appearance & Sounds Tab"),
      category: "general",
      desc: t("Turn on dynamic layout audio cues, adjust visual page transition speeds, and select baseline skin."),
      icon: Volume2,
      badge: t("General Tab"),
      status: t("Active"),
      details: t("Enable haptic notifications tones, select fade/zoom animations parameters, set text scale values."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_general_subtab_override', 'appearance'); setActiveTab('general'); },
      theme: {
        bg: "bg-indigo-50/20 dark:bg-indigo-900/10",
        border: "border-indigo-200/50 dark:border-indigo-850 shadow-xs hover:border-indigo-400",
        icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-650 dark:text-indigo-400",
        badge: "text-indigo-650 bg-indigo-500/10 border-indigo-500/20",
        btn: "hover:bg-indigo-600 text-indigo-705 hover:text-white dark:text-indigo-400 border-indigo-100/55 dark:border-indigo-900/50"
      }
    },
    {
      id: "gen_sub_timezone",
      title: t("Regional & Calendar Defaults Tab"),
      category: "general",
      desc: t("Define standard corporate time zone offsets, adapt billing calendar week-start offsets, and format time."),
      icon: Activity,
      badge: t("General Tab"),
      status: t("UTC Standard"),
      details: t("Select official clock systems, format chronological intervals, manage local GMT differentials."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_general_subtab_override', 'regional'); setActiveTab('general'); },
      theme: {
        bg: "bg-teal-50/10 dark:bg-teal-900/10",
        border: "border-teal-200/50 dark:border-teal-850 shadow-xs hover:border-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
        badge: "text-teal-650 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100/55 dark:border-teal-900/50"
      }
    },
    {
      id: "gen_sub_safety",
      title: t("Timeout, Shortcuts & Safety Tab"),
      category: "general",
      desc: t("Configure idle login lock limits, adapt diagnostic command keys, and tweak automated caches clear logs."),
      icon: Lock,
      badge: t("General Tab"),
      status: t("Active"),
      details: t("Set lock triggers minutes intervals, verify keystroke default sequences, clean memory pools."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_general_subtab_override', 'system'); setActiveTab('general'); },
      theme: {
        bg: "bg-amber-50/10 dark:bg-amber-900/10",
        border: "border-amber-200/50 dark:border-amber-850 shadow-xs hover:border-amber-400",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "text-amber-650 bg-amber-500/10 border-amber-500/20",
        btn: "hover:bg-amber-600 text-amber-700 hover:text-white dark:text-amber-400 border-amber-100/55 dark:border-amber-900/50"
      }
    },
    {
      id: "voucher_sub_account",
      title: t("Accounting Voucher Sequences Tab"),
      category: "layout",
      desc: t("Integrate automatic prefix structures and restart conditions for sales bills and cash book indexes."),
      icon: FileText,
      badge: t("Vouchers Tab"),
      status: t("Automated"),
      details: t("Configure dynamic serial lengths, insert fiscal suffix strings, manage purchase invoice restart limits."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_vouchernumbering_subtab_override', 'accounting'); setActiveTab('vouchernumbering'); },
      theme: {
        bg: "bg-orange-50/10 dark:bg-orange-900/10",
        border: "border-orange-200/50 dark:border-orange-850 shadow-xs hover:border-orange-400",
        icon: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
        badge: "text-orange-650 bg-orange-500/10 border-orange-500/20",
        btn: "hover:bg-orange-600 text-orange-705 hover:text-white dark:text-orange-300 border-orange-100/55 dark:border-orange-900/55"
      }
    },
    {
      id: "voucher_sub_inventory",
      title: t("Inventory Voucher Sequences Tab"),
      category: "layout",
      desc: t("Format sequence parameters for store delivery vouchers, material transfer cards, and challan codes."),
      icon: LayersIcon,
      badge: t("Vouchers Tab"),
      status: t("Pre-assigned"),
      details: t("Customize warehouse receipt prefixes, regulate store ordering padding sequences, set boundaries."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_vouchernumbering_subtab_override', 'inventory'); setActiveTab('vouchernumbering'); },
      theme: {
        bg: "bg-yellow-50/10 dark:bg-yellow-905/10",
        border: "border-yellow-200/50 dark:border-yellow-850 shadow-xs hover:border-yellow-400",
        icon: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
        badge: "text-yellow-650 bg-yellow-500/10 border-yellow-500/20",
        btn: "hover:bg-yellow-600 text-yellow-705 hover:text-white dark:text-yellow-300 border-yellow-101/55 dark:border-yellow-900/55"
      }
    },
    {
      id: "nav_sub_priority",
      title: t("Landing & Startup Priority Tab"),
      category: "layout",
      desc: t("Specify active primary view panels, priority navigation paths, and first-screen widgets configurations."),
      icon: Map,
      badge: t("Navigation Tab"),
      status: t("Active"),
      details: t("Tweak system loading benchmarks, default division folders, adjust starting focus states."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_navigation_subtab_override', 'priority'); setActiveTab('navigation'); },
      theme: {
        bg: "bg-violet-50/10 dark:bg-violet-900/10",
        border: "border-violet-200/50 dark:border-violet-850 shadow-xs hover:border-violet-400",
        icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-650 dark:text-violet-400",
        badge: "text-violet-655 bg-violet-500/10 border-violet-500/20",
        btn: "hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-400 border-violet-100/55 dark:border-violet-900/50"
      }
    },
    {
      id: "nav_sub_routing",
      title: t("Custom Routing Adjusters Tab"),
      category: "layout",
      desc: t("Formulate direct workspace short-routing, manage panel sync behavior triggers, and routing paths."),
      icon: Workflow,
      badge: t("Navigation Tab"),
      status: t("Verified"),
      details: t("Define automatic error redirect targets, synchronize user preferences transitions parameters."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_navigation_subtab_override', 'routing'); setActiveTab('navigation'); },
      theme: {
        bg: "bg-cyan-50/10 dark:bg-cyan-900/10",
        border: "border-cyan-200/50 dark:border-cyan-850 shadow-xs hover:border-cyan-400",
        icon: "bg-cyan-100 dark:bg-cyan-950/20 text-cyan-650 dark:text-cyan-400",
        badge: "text-cyan-655 bg-cyan-500/10 border-cyan-500/20",
        btn: "hover:bg-cyan-600 text-cyan-705 hover:text-white dark:text-cyan-400 border-cyan-101/55 dark:border-cyan-950/50"
      }
    },
    {
      id: "formdetails_sub_desktop",
      title: t("Desktop Form Preview Tab"),
      category: "ui",
      desc: t("Configure specific field arrangements, input labels, columns ratios, and shortcuts on desktop display viewport setups."),
      icon: LayoutGrid,
      badge: t("Forms Tab"),
      status: t("Full Layout"),
      details: t("Check field alignments margins, tweak ledger grids sizes parameters, verify auto-locking flags."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_formdetails_subtab_override', 'desktop'); setActiveTab('formdetails'); },
      theme: {
        bg: "bg-fuchsia-50/20 dark:bg-fuchsia-900/10",
        border: "border-fuchsia-200/50 dark:border-fuchsia-850 shadow-xs hover:border-fuchsia-400",
        icon: "bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400",
        badge: "text-fuchsia-600 bg-fuchsia-500/10 border-fuchsia-500/20",
        btn: "hover:bg-fuchsia-600 text-fuchsia-700 hover:text-white dark:text-fuchsia-400 border-fuchsia-100/55 dark:border-fuchsia-900/50"
      }
    },
    {
      id: "formdetails_sub_tablet",
      title: t("Tablet Form Touch Tab"),
      category: "ui",
      desc: t("Adapt active grid touch heights parameters, expand touch buttons click targets radii, adjust landscape ratios."),
      icon: Sliders,
      badge: t("Forms Tab"),
      status: t("Medium Spacing"),
      details: t("Enforce finger targets click sizing margins 44px, configure sliding gesture actions, trace logs."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_formdetails_subtab_override', 'tablet'); setActiveTab('formdetails'); },
      theme: {
        bg: "bg-indigo-50/20 dark:bg-indigo-900/10",
        border: "border-indigo-200/50 dark:border-indigo-850 shadow-xs hover:border-indigo-400",
        icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-650 dark:text-indigo-400",
        badge: "text-indigo-650 bg-indigo-500/10 border-indigo-500/20",
        btn: "hover:bg-indigo-600 text-indigo-705 hover:text-white dark:text-indigo-400 border-indigo-100/55 dark:border-indigo-900/50"
      }
    },
    {
      id: "formdetails_sub_mobile",
      title: t("Mobile Portability Tab"),
      category: "ui",
      desc: t("Enforce single-column vertical stacked views, auto-collapse sidebar panels options, scale header fonts sizes."),
      icon: Activity,
      badge: t("Forms Tab"),
      status: t("Compact Stack"),
      details: t("Auto hide uncritical telemetry rows, maximize cell touch target bounds, verify responsive transitions."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_formdetails_subtab_override', 'mobile'); setActiveTab('formdetails'); },
      theme: {
        bg: "bg-purple-50/20 dark:bg-purple-900/10",
        border: "border-purple-200/50 dark:border-purple-850 shadow-xs hover:border-purple-400",
        icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
        badge: "text-purple-600 bg-purple-500/10 border-purple-500/20",
        btn: "hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-400 border-purple-100/55 dark:border-purple-900/50"
      }
    },
    {
      id: "formdetails_sub_behaviors",
      title: t("Event Handlers Tab"),
      category: "ui",
      desc: t("Specify keyboard tab navigation sequence, define active fields autofocus, turn on keystroke macro binds."),
      icon: Workflow,
      badge: t("Forms Tab"),
      status: t("Adaptive logic"),
      details: t("Bind specific billing layouts to prompt actions, adjust numeric formatting autocomplete parameters."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_formdetails_subtab_override', 'behaviors'); setActiveTab('formdetails'); },
      theme: {
        bg: "bg-teal-50/10 dark:bg-teal-900/10",
        border: "border-teal-200/50 dark:border-teal-850 shadow-xs hover:border-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-650 dark:text-teal-400",
        badge: "text-teal-650 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100/55 dark:border-teal-900/50"
      }
    },
    {
      id: "alerts_sub_inApp",
      title: t("In-App Notifications Tab"),
      category: "security",
      desc: t("Manage dynamic alerts popping, toast sound levels parameters, active top-right bell badges layouts."),
      icon: Bell,
      badge: t("Alerts Tab"),
      status: t("Live Broadcast"),
      details: t("Configure sound duration, set notification categories matching, toggle persistent warning cards."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_alerts_subtab_override', 'inApp'); setActiveTab('alerts'); },
      theme: {
        bg: "bg-yellow-50/20 dark:bg-yellow-905/10",
        border: "border-yellow-200/50 dark:border-yellow-850 shadow-xs hover:border-yellow-400",
        icon: "bg-yellow-105 dark:bg-yellow-901/40 text-yellow-650 dark:text-yellow-400",
        badge: "text-yellow-650 bg-yellow-500/10 border-yellow-500/20",
        btn: "hover:bg-yellow-600 text-yellow-705 hover:text-white dark:text-yellow-300 border-yellow-101/55 dark:border-yellow-905/50"
      }
    },
    {
      id: "alerts_sub_email",
      title: t("Email Alerts Tab"),
      category: "security",
      desc: t("Configure secure system SMTP mailing servers, specify corporate default inboxes, and email triggers."),
      icon: FileText,
      badge: t("Alerts Tab"),
      status: t("Inbound SMTP"),
      details: t("Input mailing hosts passwords, adjust transaction summaries dispatch times schedules, verify health."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_alerts_subtab_override', 'email'); setActiveTab('alerts'); },
      theme: {
        bg: "bg-cyan-50/10 dark:bg-cyan-900/10",
        border: "border-cyan-200/50 dark:border-cyan-850 shadow-xs hover:border-cyan-400",
        icon: "bg-cyan-100 dark:bg-cyan-950/20 text-cyan-650 dark:text-cyan-400",
        badge: "text-cyan-655 bg-cyan-500/10 border-cyan-500/20",
        btn: "hover:bg-cyan-600 text-cyan-705 hover:text-white dark:text-cyan-400 border-cyan-101/55 dark:border-cyan-950/50"
      }
    },
    {
      id: "alerts_sub_sms",
      title: t("SMS Alerts Tab"),
      category: "security",
      desc: t("Activate backup Twilio gateway channels, declare urgent alert parameters schedules, edit billing SMS template texts."),
      icon: Sliders,
      badge: t("Alerts Tab"),
      status: t("SMS Active"),
      details: t("Input account secrets, verify local SMS layouts character limits strings, execute connection check."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_alerts_subtab_override', 'sms'); setActiveTab('alerts'); },
      theme: {
        bg: "bg-pink-50/20 dark:bg-pink-900/10",
        border: "border-pink-200/50 dark:border-pink-850 shadow-xs hover:border-pink-400",
        icon: "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400",
        badge: "text-pink-600 bg-pink-500/10 border-pink-500/20",
        btn: "hover:bg-pink-600 text-pink-700 hover:text-white dark:text-pink-400 border-pink-100/55 dark:border-pink-900/50"
      }
    },
    {
      id: "alerts_sub_whatsapp",
      title: t("WhatsApp Alerts Tab"),
      category: "security",
      desc: t("Link corporate Meta Business API directories, customize customer invoice text loops, adjust webhook syncs."),
      icon: Activity,
      badge: t("Alerts Tab"),
      status: t("Meta Active"),
      details: t("Store secure access tokens parameters, layout tax column descriptions, debug instant dispatches."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_alerts_subtab_override', 'whatsapp'); setActiveTab('alerts'); },
      theme: {
        bg: "bg-emerald-50/20 dark:bg-emerald-900/10",
        border: "border-emerald-200/50 dark:border-emerald-850 shadow-xs hover:border-emerald-400",
        icon: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
        badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        btn: "hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-400 border-emerald-100/55 dark:border-emerald-950/50"
      }
    },
    {
      id: "alerts_sub_telegram",
      title: t("Telegram Alerts Tab"),
      category: "security",
      desc: t("Setup Telegram robot alerts flags, register regional operator chat boxes, store alert telemetry IDs."),
      icon: Map,
      badge: t("Alerts Tab"),
      status: t("Bot Ready"),
      details: t("Test notification dispatches, customize diagnostic telemetry columns layout, adjust rate limits."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_alerts_subtab_override', 'telegram'); setActiveTab('alerts'); },
      theme: {
        bg: "bg-sky-50/20 dark:bg-sky-900/10",
        border: "border-sky-200/50 dark:border-sky-850 shadow-xs hover:border-sky-400",
        icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
        badge: "text-sky-600 bg-sky-500/10 border-sky-500/20",
        btn: "hover:bg-sky-600 text-sky-700 hover:text-white dark:text-sky-400 border-sky-100/55 dark:border-sky-900/50"
      }
    },
    {
      id: "users_sub_account",
      title: t("My Account Profile Tab"),
      category: "security",
      desc: t("Update user credentials details, manage password verification prompts, select security keys."),
      icon: Users,
      badge: t("Users Tab"),
      status: t("Verified"),
      details: t("Toggle 2-factor authentication, set up session automatic logouts limits, trace key logins."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_users_subtab_override', 'my-account'); setActiveTab('users'); },
      theme: {
        bg: "bg-blue-50/20 dark:bg-blue-900/10",
        border: "border-blue-200/50 dark:border-blue-850 shadow-xs hover:border-blue-400",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100/55 dark:border-blue-900/50"
      }
    },
    {
      id: "users_sub_directory",
      title: t("Company Registry Tab"),
      category: "security",
      desc: t("Read and update corporate employee tables, insert new operator credentials rosters, alter roles."),
      icon: BookOpen,
      badge: t("Users Tab"),
      status: t("6 Members"),
      details: t("Assign specific division folders access, verify email targets, manage supervisor tags."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_users_subtab_override', 'directory'); setActiveTab('users'); },
      theme: {
        bg: "bg-violet-50/20 dark:bg-violet-900/10",
        border: "border-violet-200/50 dark:border-violet-850 shadow-xs hover:border-violet-400",
        icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-605 dark:text-violet-400",
        badge: "text-violet-605 bg-violet-500/10 border-violet-500/20",
        btn: "hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-400 border-violet-100/55 dark:border-violet-900/50"
      }
    },
    {
      id: "users_sub_profile",
      title: t("SuperAdmin Controls Tab"),
      category: "security",
      desc: t("Configure global workspace security rules, manage division operations variables, lock records."),
      icon: ShieldCheck,
      badge: t("Users Tab"),
      status: t("Enforced"),
      details: t("Store global configuration preferences parameters, inspect ledger logs directories paths."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_users_subtab_override', 'profile'); setActiveTab('users'); },
      theme: {
        bg: "bg-red-50/20 dark:bg-red-900/10",
        border: "border-red-200/50 dark:border-red-850 shadow-xs hover:border-red-400",
        icon: "bg-red-100 dark:bg-red-900/50 text-red-650 dark:text-red-400",
        badge: "text-red-650 bg-red-500/10 border-red-500/20",
        btn: "hover:bg-red-600 text-red-700 hover:text-white dark:text-red-400 border-red-100/55 dark:border-red-900/50"
      }
    },
    {
      id: "users_sub_active",
      title: t("Live Active Sessions Tab"),
      category: "security",
      desc: t("Monitor active connected logins, read geoposition IP labels, audit live access devices."),
      icon: Activity,
      badge: t("Users Tab"),
      status: t("Active Logs"),
      details: t("Force sign-out security locks, trace active connection ping durations, verify telemetry."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_users_subtab_override', 'active-users'); setActiveTab('users'); },
      theme: {
        bg: "bg-teal-50/10 dark:bg-teal-900/10",
        border: "border-teal-200/50 dark:border-teal-850 shadow-xs hover:border-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
        badge: "text-teal-650 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100/55 dark:border-teal-900/50"
      }
    },
    {
      id: "users_sub_rules",
      title: t("Category Rules Tab"),
      category: "security",
      desc: t("Establish strict user roles templates, regulate automated mapping priorities, set lockouts."),
      icon: Sliders,
      badge: t("Users Tab"),
      status: t("Roles Matrix"),
      details: t("Define administrative limits profiles, manage bulk ledger data alterations rules safety."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_users_subtab_override', 'group-rules'); setActiveTab('users'); },
      theme: {
        bg: "bg-amber-50/10 dark:bg-amber-900/10",
        border: "border-amber-200/50 dark:border-amber-850 shadow-xs hover:border-amber-400",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "text-amber-655 bg-amber-500/10 border-amber-500/20",
        btn: "hover:bg-amber-600 text-amber-700 hover:text-white dark:text-amber-400 border-amber-100/55 dark:border-amber-900/50"
      }
    },
    {
      id: "users_sub_help",
      title: t("Help Desk Portal Tab"),
      category: "security",
      desc: t("Provide direct employee onboarding screens, load FAQ indexes matrices, launch support."),
      icon: HelpCircle,
      badge: t("Users Tab"),
      status: t("Active Link"),
      details: t("Review multi-user login structures details, diagnostic system logs checklist parameters."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_users_subtab_override', 'help'); setActiveTab('users'); },
      theme: {
        bg: "bg-rose-50/20 dark:bg-rose-900/10",
        border: "border-rose-200/50 dark:border-rose-850 shadow-xs hover:border-rose-400",
        icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        badge: "text-rose-600 bg-rose-500/10 border-rose-500/20",
        btn: "hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 border-rose-100/55 dark:border-rose-900/50"
      }
    },
    {
      id: "security_sub_policies",
      title: t("Security Guard Policies Tab"),
      category: "security",
      desc: t("Enforce dynamic strong login password rules, tweak multi-factor protocols options, adjust lock times."),
      icon: ShieldAlert,
      badge: t("Security Tab"),
      status: t("High Security"),
      details: t("Select verification parameters, monitor IP access credentials blacklist matrices, trace leaks."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_security_subtab_override', 'policies'); setActiveTab('security'); },
      theme: {
        bg: "bg-red-50/20 dark:bg-red-900/10",
        border: "border-red-200/50 dark:border-red-850 shadow-xs hover:border-red-400",
        icon: "bg-red-100 dark:bg-red-900/50 text-red-650 dark:text-red-400",
        badge: "text-red-650 bg-red-500/10 border-red-500/20",
        btn: "hover:bg-red-600 text-red-700 hover:text-white dark:text-red-400 border-red-100/55 dark:border-red-900/50"
      }
    },
    {
      id: "security_sub_users",
      title: t("User Security Settings Tab"),
      category: "security",
      desc: t("Audit particular operator encryption keys, review personnel hardware access tokens."),
      icon: Users,
      badge: t("Security Tab"),
      status: t("Enforced"),
      details: t("Force active sessions reset commands, review operational login times schedules, secure nodes."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_security_subtab_override', 'users'); setActiveTab('security'); },
      theme: {
        bg: "bg-orange-50/20 dark:bg-orange-900/10",
        border: "border-orange-200/50 dark:border-orange-850 shadow-xs hover:border-orange-400",
        icon: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
        badge: "text-orange-600 bg-orange-500/10 border-orange-500/20",
        btn: "hover:bg-orange-600 text-orange-700 hover:text-white dark:text-orange-400 border-orange-100/55 dark:border-orange-900/50"
      }
    },
    {
      id: "privacy_sub_gdpr",
      title: t("GDPR Guidelines Compliance Tab"),
      category: "security",
      desc: t("Maintain customer data retention policies, specify auto archiving frequencies, erase logs cache."),
      icon: FileText,
      badge: t("Privacy Tab"),
      status: t("GDPR Compliant"),
      details: t("Verify regional database server locations parameters, wipe inactive cookie identifiers."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_privacy_subtab_override', 'gdpr'); setActiveTab('privacy'); },
      theme: {
        bg: "bg-slate-50/20 dark:bg-slate-900/10",
        border: "border-slate-200/50 dark:border-slate-850 shadow-xs hover:border-slate-400",
        icon: "bg-slate-100 dark:bg-slate-900/50 text-slate-650 dark:text-slate-400",
        badge: "text-slate-605 bg-slate-500/10 border-slate-500/20",
        btn: "hover:bg-slate-600 text-slate-705 hover:text-white dark:text-slate-400 border-slate-100/55 dark:border-slate-900/50"
      }
    },
    {
      id: "privacy_sub_consent",
      title: t("Data Consent Agreement Tab"),
      category: "security",
      desc: t("Inspect active consent tables, form diagnostic preferences statements, toggle usage triggers."),
      icon: ShieldCheck,
      badge: t("Privacy Tab"),
      status: t("Draft OK"),
      details: t("Toggle anonymous analytical diagnostics feedback triggers, backup compliance agreements."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_privacy_subtab_override', 'data_consent'); setActiveTab('privacy'); },
      theme: {
        bg: "bg-blue-50/20 dark:bg-blue-900/10",
        border: "border-blue-200/50 dark:border-blue-850 shadow-xs hover:border-blue-400",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100/55 dark:border-blue-900/50"
      }
    },
    {
      id: "mapping_sub_basic",
      title: t("Standard Ledger Rules Tab"),
      category: "data",
      desc: t("Regulate baseline mapping filters patterns, specify account keys priorities, align values."),
      icon: Coins,
      badge: t("Mapping Tab"),
      status: t("Default OK"),
      details: t("Configure base cash receipts structures columns layout, assign regional division accounts."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_mapping_subtab_override', 'basic'); setActiveTab('mapping'); },
      theme: {
        bg: "bg-emerald-50/20 dark:bg-emerald-900/10",
        border: "border-emerald-200/50 dark:border-emerald-850 shadow-xs hover:border-emerald-400",
        icon: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
        badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        btn: "hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-400 border-emerald-100/55 dark:border-emerald-950/50"
      }
    },
    {
      id: "mapping_sub_list",
      title: t("Comprehensive Mapping List Tab"),
      category: "data",
      desc: t("Read and search through bulk fields associations records, delete redundant pattern indicators."),
      icon: List,
      badge: t("Mapping Tab"),
      status: t("Active Records"),
      details: t("Analyze auto match confidence scores percentages, download csv ledger references list."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_mapping_subtab_override', 'list'); setActiveTab('mapping'); },
      theme: {
        bg: "bg-indigo-50/20 dark:bg-indigo-900/10",
        border: "border-indigo-200/50 dark:border-indigo-850 shadow-xs hover:border-indigo-400",
        icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-650 dark:text-indigo-400",
        badge: "text-indigo-650 bg-indigo-500/10 border-indigo-500/20",
        btn: "hover:bg-indigo-600 text-indigo-705 hover:text-white dark:text-indigo-400 border-indigo-100/55 dark:border-indigo-900/50"
      }
    },
    {
      id: "mapping_sub_pattern",
      title: t("Fuzzy Auto-Match Rules Tab"),
      category: "data",
      desc: t("Tweak intelligent regular expression matching systems rules, select word distance algorithms."),
      icon: Sparkles,
      badge: t("Mapping Tab"),
      status: t("Fuzzy Active"),
      details: t("Tweak matching parameters default limits margins, align custom ledger transaction prefixes."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_mapping_subtab_override', 'pattern'); setActiveTab('mapping'); },
      theme: {
        bg: "bg-purple-50/20 dark:bg-purple-900/10",
        border: "border-purple-200/50 dark:border-purple-850 shadow-xs hover:border-purple-400",
        icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
        badge: "text-purple-600 bg-purple-500/10 border-purple-500/20",
        btn: "hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-400 border-purple-100/55 dark:border-purple-900/50"
      }
    },
    {
      id: "mapping_sub_mappingList",
      title: t("Structured Key References Tab"),
      category: "data",
      desc: t("Maintain precise static key mapping bindings, store tax ledger links codes, link bank Sync keys."),
      icon: Database,
      badge: t("Mapping Tab"),
      status: t("Structured"),
      details: t("Inspect current mapping structures parameters, declare manual currency code conversions."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_mapping_subtab_override', 'mappingList'); setActiveTab('mapping'); },
      theme: {
        bg: "bg-rose-50/20 dark:bg-rose-900/10",
        border: "border-rose-200/50 dark:border-rose-850 shadow-xs hover:border-rose-400",
        icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        badge: "text-rose-600 bg-rose-500/10 border-rose-500/20",
        btn: "hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 border-rose-100/55 dark:border-rose-900/50"
      }
    },
    {
      id: "mapping_sub_sandbox",
      title: t("Interactive Sandbox Terminal Tab"),
      category: "data",
      desc: t("Input dummy Excel text strings to inspect auto matching outcomes, verify algorithm layouts."),
      icon: Sliders,
      badge: t("Mapping Tab"),
      status: t("Interactive"),
      details: t("Test fuzzy pattern mappings, audit exact classification confidence grades instantly, trace error."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_mapping_subtab_override', 'sandbox'); setActiveTab('mapping'); },
      theme: {
        bg: "bg-yellow-50/10 dark:bg-yellow-905/10",
        border: "border-yellow-200/50 dark:border-yellow-850 shadow-xs hover:border-yellow-400",
        icon: "bg-yellow-105 dark:bg-yellow-901/40 text-yellow-650 dark:text-yellow-400",
        badge: "text-yellow-650 bg-yellow-500/10 border-yellow-500/20",
        btn: "hover:bg-yellow-600 text-yellow-705 hover:text-white dark:text-yellow-300 border-yellow-101/55 dark:border-yellow-905/50"
      }
    },
    {
      id: "imports_sub_global",
      title: t("Global Default Rules Tab"),
      category: "data",
      desc: t("Establish general Excel ingestion rules, toggle auto balancing columns, select formats."),
      icon: Sliders,
      badge: t("Imports Tab"),
      status: t("Global Config"),
      details: t("Configure general spreadsheet decimal truncating limits, verify auto-routing settings."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_imports_subtab_override', 'global'); setActiveTab('imports'); },
      theme: {
        bg: "bg-amber-50/10 dark:bg-amber-900/10",
        border: "border-amber-200/50 dark:border-amber-850 shadow-xs hover:border-amber-400",
        icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        badge: "text-amber-655 bg-amber-500/10 border-amber-500/20",
        btn: "hover:bg-amber-600 text-amber-700 hover:text-white dark:text-amber-400 border-amber-100/55 dark:border-amber-900/50"
      }
    },
    {
      id: "imports_sub_vouchers",
      title: t("Voucher-Specific Modifiers Tab"),
      category: "data",
      desc: t("Regulate ledger rules tailored specially for journal cash vouchers imports sheets setups."),
      icon: FileText,
      badge: t("Imports Tab"),
      status: t("Vouchers Active"),
      details: t("Tweak individual purchase and sale bill conversion limits parameters, select templates."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_imports_subtab_override', 'vouchers'); setActiveTab('imports'); },
      theme: {
        bg: "bg-teal-50/10 dark:bg-teal-900/10",
        border: "border-teal-200/50 dark:border-teal-850 shadow-xs hover:border-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-650 dark:text-teal-400",
        badge: "text-teal-650 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100/55 dark:border-teal-900/50"
      }
    },
    {
      id: "ai_sub_internal",
      title: t("Google Gemini Cloud Client Tab"),
      category: "data",
      desc: t("Integrate native server-side Gemini 2.5 Active models API, choose specific classification parameters."),
      icon: Cpu,
      badge: t("AI Tab"),
      status: t("Gemini 2.5 Active"),
      details: t("Enforce strict secure proxy keys routing, audit response limits parameters, check connection."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_ai_subtab_override', 'internal'); setActiveTab('ai'); },
      theme: {
        bg: "bg-blue-50/40 dark:bg-blue-950/20",
        border: "border-blue-100 dark:border-blue-900/40 hover:border-blue-400/65 dark:hover:border-blue-700/65",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100 dark:border-blue-900"
      }
    },
    {
      id: "ai_sub_external",
      title: t("Custom Gateway Providers Tab"),
      category: "data",
      desc: t("Link corporate OpenAI, Anthropic, or specialized 9Router custom API servers to process files."),
      icon: Settings,
      badge: t("AI Tab"),
      status: t("External Gateway"),
      details: t("Verify custom server BaseURL directories paths, configure authorization header tokens parameters."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_ai_subtab_override', 'external'); setActiveTab('ai'); },
      theme: {
        bg: "bg-fuchsia-50/20 dark:bg-fuchsia-900/10",
        border: "border-fuchsia-200/50 dark:border-fuchsia-850 shadow-xs hover:border-fuchsia-400",
        icon: "bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400",
        badge: "text-fuchsia-600 bg-fuchsia-500/10 border-fuchsia-500/20",
        btn: "hover:bg-fuchsia-600 text-fuchsia-700 hover:text-white dark:text-fuchsia-400 border-fuchsia-100/55 dark:border-fuchsia-900/50"
      }
    },
    {
      id: "ai_sub_local",
      title: t("Local Offline Models Tab"),
      category: "data",
      desc: t("Activate connection with local offline Ollama or LMStudio hosts, process sensitive documents locally."),
      icon: Database,
      badge: t("AI Tab"),
      status: t("Offline Ready"),
      details: t("Test localhost 11434 sync speeds, verify LLM offline capabilities, store privacy flags."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_ai_subtab_override', 'local'); setActiveTab('ai'); },
      theme: {
        bg: "bg-violet-50/20 dark:bg-violet-900/10",
        border: "border-violet-200/50 dark:border-violet-850 shadow-xs hover:border-violet-400",
        icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-605 dark:text-violet-400",
        badge: "text-violet-605 bg-violet-500/10 border-violet-500/20",
        btn: "hover:bg-violet-600 text-violet-700 hover:text-white dark:text-violet-400 border-violet-100/55 dark:border-violet-900/50"
      }
    },
    {
      id: "ai_sub_engine",
      title: t("Bharat Book Core AI Engine Tab"),
      category: "data",
      desc: t("Switch between different smart engines defaults, enable banking transaction patterns matching."),
      icon: Cpu,
      badge: t("AI Tab"),
      status: t("Core Active"),
      details: t("Calibrate exact prompt multipliers values, activate real-time auto correct audits, track speeds."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_ai_subtab_override', 'ai_engine'); setActiveTab('ai'); },
      theme: {
        bg: "bg-indigo-50/20 dark:bg-indigo-900/10",
        border: "border-indigo-200/50 dark:border-indigo-850 shadow-xs hover:border-indigo-400",
        icon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-650 dark:text-indigo-400",
        badge: "text-indigo-650 bg-indigo-500/10 border-indigo-500/20",
        btn: "hover:bg-indigo-600 text-indigo-705 hover:text-white dark:text-indigo-400 border-indigo-100/55 dark:border-indigo-900/50"
      }
    },
    {
      id: "ai_sub_keys",
      title: t("Secure API Access Keys Tab"),
      category: "data",
      desc: t("Enter custom platform API access keys, encrypt credentials data, manage environment keys."),
      icon: Lock,
      badge: t("AI Tab"),
      status: t("Encrypted OK"),
      details: t("Ensure secure server-side client environment is configured inside workspace parameters."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_ai_subtab_override', 'api_keys'); setActiveTab('ai'); },
      theme: {
        bg: "bg-rose-50/20 dark:bg-rose-900/10",
        border: "border-rose-200/50 dark:border-rose-850 shadow-xs hover:border-rose-400",
        icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        badge: "text-rose-600 bg-rose-500/10 border-rose-500/20",
        btn: "hover:bg-rose-600 text-rose-700 hover:text-white dark:text-rose-400 border-rose-100/55 dark:border-rose-900/50"
      }
    },
    {
      id: "support_sub_chat",
      title: t("Interactive Online Chat Tab"),
      category: "security",
      desc: t("Open live conversation screen, transmit active diagnostic snapshots, review operator tips."),
      icon: HelpCircle,
      badge: t("Support Tab"),
      status: t("24/7 Live"),
      details: t("Direct chat client integrations, review SLA response time guarantees parameters list."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_support_subtab_override', 'chat'); setActiveTab('support'); },
      theme: {
        bg: "bg-emerald-50/20 dark:bg-emerald-900/10",
        border: "border-emerald-200/50 dark:border-emerald-850 shadow-xs hover:border-emerald-400",
        icon: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
        badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        btn: "hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-400 border-emerald-100/55 dark:border-emerald-950/50"
      }
    },
    {
      id: "support_sub_integrity",
      title: t("Workspace Integrity Tools Tab"),
      category: "security",
      desc: t("Verify client software files hashes, clean corrupt local storage keys, repair system cache."),
      icon: ShieldCheck,
      badge: t("Support Tab"),
      status: t("All System Green"),
      details: t("Execute absolute ledger database structure repair routines, reset active session triggers."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_support_subtab_override', 'integrity'); setActiveTab('support'); },
      theme: {
        bg: "bg-purple-50/20 dark:bg-purple-900/10",
        border: "border-purple-200/50 dark:border-purple-850 shadow-xs hover:border-purple-400",
        icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
        badge: "text-purple-600 bg-purple-500/10 border-purple-500/20",
        btn: "hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-400 border-purple-100/55 dark:border-purple-900/50"
      }
    },
    {
      id: "support_sub_tickets",
      title: t("Historical Support Tickets Tab"),
      category: "security",
      desc: t("Examine past resolved issues list, download operational audit summaries files, read advice notes."),
      icon: List,
      badge: t("Support Tab"),
      status: t("Resolved Logs"),
      details: t("Trace supervisor responses durations, read direct division feedback logs parameters list."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_support_subtab_override', 'tickets'); setActiveTab('support'); },
      theme: {
        bg: "bg-yellow-50/20 dark:bg-yellow-905/10",
        border: "border-yellow-200/50 dark:border-yellow-850 shadow-xs hover:border-yellow-400",
        icon: "bg-yellow-105 dark:bg-yellow-901/40 text-yellow-650 dark:text-yellow-400",
        badge: "text-yellow-650 bg-yellow-500/10 border-yellow-500/20",
        btn: "hover:bg-yellow-600 text-yellow-705 hover:text-white dark:text-yellow-300 border-yellow-101/55 dark:border-yellow-905/50"
      }
    },
    {
      id: "about_sub_about",
      title: t("About Bharat Book Info Tab"),
      category: "security",
      desc: t("Review commercial corporate details, explore product design philosophies, contact info."),
      icon: BookOpen,
      badge: t("About Tab"),
      status: t("v4.5 Stable"),
      details: t("Trace primary systems metadata parameters, check developer licenses profiles information."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_about_subtab_override', 'about'); setActiveTab('about'); },
      theme: {
        bg: "bg-teal-50/10 dark:bg-teal-900/10",
        border: "border-teal-200/50 dark:border-teal-850 shadow-xs hover:border-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400",
        badge: "text-teal-650 bg-teal-500/10 border-teal-500/20",
        btn: "hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-400 border-teal-100/55 dark:border-teal-900/50"
      }
    },
    {
      id: "about_sub_release",
      title: t("Release Version Logs Tab"),
      category: "security",
      desc: t("Track technical updates chronologies, view newly added features logs, inspect bug fixes matrices."),
      icon: Activity,
      badge: t("About Tab"),
      status: t("Up to date"),
      details: t("Trace software release history timeline events, check core libraries dependencies listings."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_about_subtab_override', 'release'); setActiveTab('about'); },
      theme: {
        bg: "bg-blue-50/20 dark:bg-blue-900/10",
        border: "border-blue-200/50 dark:border-blue-850 shadow-xs hover:border-blue-400",
        icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        badge: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        btn: "hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 border-blue-100/55 dark:border-blue-900/50"
      }
    },
    {
      id: "about_sub_privacy",
      title: t("License & Privacy Terms Tab"),
      category: "security",
      desc: t("Read formal corporate digital safety covenants, examine server diagnostic logging boundaries."),
      icon: EyeOff,
      badge: t("About Tab"),
      status: t("Published"),
      details: t("Download localized security standards folders, review compliance criteria audits reports."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_about_subtab_override', 'privacy'); setActiveTab('about'); },
      theme: {
        bg: "bg-slate-50/20 dark:bg-slate-900/10",
        border: "border-slate-200/50 dark:border-slate-850 shadow-xs hover:border-slate-400",
        icon: "bg-slate-100 dark:bg-slate-900/50 text-slate-650 dark:text-slate-400",
        badge: "text-slate-605 bg-slate-500/10 border-slate-500/20",
        btn: "hover:bg-slate-600 text-slate-705 hover:text-white dark:text-slate-400 border-slate-100/55 dark:border-slate-900/50"
      }
    },
    {
      id: "about_sub_license",
      title: t("Developer License Files Tab"),
      category: "security",
      desc: t("Directly access public package copyright folders, inspect open source software credentials lists."),
      icon: FileText,
      badge: t("About Tab"),
      status: t("Complete"),
      details: t("Review dual-licensing corporate policies agreements, retrieve third-party attributions tables."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_about_subtab_override', 'license'); setActiveTab('about'); },
      theme: {
        bg: "bg-cyan-50/10 dark:bg-cyan-900/10",
        border: "border-cyan-200/50 dark:border-cyan-850 shadow-xs hover:border-cyan-400",
        icon: "bg-cyan-100 dark:bg-cyan-950/20 text-cyan-650 dark:text-cyan-400",
        badge: "text-cyan-655 bg-cyan-500/10 border-cyan-500/20",
        btn: "hover:bg-cyan-600 text-cyan-705 hover:text-white dark:text-cyan-400 border-cyan-101/55 dark:border-cyan-950/50"
      }
    },
    {
      id: "about_sub_terms",
      title: t("Terms of Service Agreement Tab"),
      category: "security",
      desc: t("Legal framework boundaries declaration, user obligations definitions, system limits parameters."),
      icon: ShieldAlert,
      badge: t("About Tab"),
      status: t("Enforced"),
      details: t("Verify statutory compliance guidelines tables, inspect company governance frameworks."),
      type: "tab",
      onClickCustom: () => { localStorage.setItem('bharat_book_about_subtab_override', 'terms'); setActiveTab('about'); },
      theme: {
        bg: "bg-red-50/20 dark:bg-red-900/10",
        border: "border-red-200/50 dark:border-red-850 shadow-xs hover:border-red-400",
        icon: "bg-red-100 dark:bg-red-900/50 text-red-650 dark:text-red-400",
        badge: "text-red-650 bg-red-500/10 border-red-500/20",
        btn: "hover:bg-red-600 text-red-700 hover:text-white dark:text-red-400 border-red-100/55 dark:border-red-900/50"
      }
    }
  ];

  const getCountFor = (catId: string) => {
    return subpages.filter(sp => {
      const matchesCategory = catId === "all" || sp.category === catId;
      const matchesType = typeFilter === "all" || sp.type === typeFilter;
      return matchesCategory && matchesType;
    }).length;
  };

  const categories = [
    { id: "all", label: typeFilter === "subpages" ? t("Subpages Panel") : typeFilter === "tab" ? t("Interactive Tabs") : t("All Settings Panel"), count: getCountFor("all"), icon: LayoutGrid, color: "from-blue-600 to-indigo-700" },
    { id: "ui", label: t("UI Related"), count: getCountFor("ui"), icon: Paintbrush, color: "from-purple-500 to-pink-600" },
    { id: "general", label: t("General Settings"), count: getCountFor("general"), icon: Settings, color: "from-amber-500 to-orange-600" },
    { id: "layout", label: t("Layout & Defaults"), count: getCountFor("layout"), icon: Layers, color: "from-cyan-500 to-teal-600" },
    { id: "data", label: t("Data, Mapping & AI"), count: getCountFor("data"), icon: Database, color: "from-emerald-500 to-green-600" },
    { id: "security", label: t("Security, Users & System"), count: getCountFor("security"), icon: ShieldAlert, color: "from-rose-500 to-red-600" },
  ];

  const filteredSubpages = subpages.filter(sp => {
    const matchesCategory = selectedCategory === "all" || sp.category === selectedCategory;
    const matchesType = typeFilter === "all" || sp.type === typeFilter;
    const matchesSearch = searchQuery.trim() === "" || 
      sp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sp.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row matching SettingExplorer premium style and Mobile stack layout */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden justify-between">
        <div className="flex items-center gap-3 shrink-0 sm:max-w-[45%] md:max-w-[50%]">
          <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
            <LayoutGrid className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">
              {t("Category Settings")}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate whitespace-nowrap">
              {t("Comprehensive registry configuration, workspace properties, and micro-tab workflows.")}
            </p>
          </div>
        </div>

        {/* Header Selection Alignment Directive flush right */}
        <div className="min-w-0 flex-1 flex justify-end">
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar w-auto border border-gray-200/40 dark:border-gray-700/40 shrink-0 justify-end">
            {[
              { id: "all", label: t("All Levels") },
              { id: "subpages", label: t("Subpages") },
              { id: "tab", label: t("Tab") }
            ].map((tab) => {
              const isActive = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setTypeFilter(tab.id as any); setSelectedCategory("all"); }}
                  className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start cursor-pointer ${
                    isActive 
                      ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm font-black' 
                      : 'text-gray-505 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <span className="leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Compact Action Controls Header Row */}
      <div className="bg-white dark:bg-gray-900 p-2 sm:p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm flex flex-row items-center justify-between gap-3 overflow-hidden">
        {/* Search Input Widget */}
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Filter settings by page, keyword, details or badge...")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-750 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/35 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* View Mode Switcher Toggle Button */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-250 dark:border-gray-750 shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            title={t("Grid View")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-black text-xs" : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            title={t("List View")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-black text-xs" : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scope Details Descriptive row */}
      <div className="text-[10px] xs:text-[11px] px-1 text-gray-500 dark:text-gray-400 font-bold truncate whitespace-nowrap">
        {typeFilter === "all" && t("Displaying all workspace configurations (20 high-level subpages, 22 granular subtabs)")}
        {typeFilter === "subpages" && t("Displaying administrative high-level subpages configurations")}
        {typeFilter === "tab" && t("Displaying molecular tab configurations inside settings pages")}
      </div>

      {/* Category Pills Navigation Selection Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between h-[85px] relative overflow-hidden group select-none ${
                isActive 
                  ? "bg-slate-900 border-gray-800 shadow-md text-white scale-[1.02] ring-2 ring-blue-500/20 dark:bg-gray-850 dark:border-gray-700" 
                  : "bg-white border-gray-200/60 hover:border-blue-400/40 text-gray-700 dark:bg-gray-800/65 dark:border-gray-700/80 dark:text-gray-350 dark:hover:border-gray-650 shadow-xs hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center justify-between w-full relative z-10">
                <div className={`p-1.5 rounded-lg ${isActive ? "bg-blue-600/25 text-blue-400" : "bg-gray-100 dark:bg-gray-700/60 text-gray-550"}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-blue-500/25 text-blue-300" : "bg-gray-50 dark:bg-gray-905/65 text-gray-500"}`}>
                  {cat.count}
                </span>
              </div>
              <div className="relative z-10 mt-2">
                <h3 className="text-[11.5px] font-bold tracking-tight truncate leading-none">
                  {cat.label}
                </h3>
              </div>
              {isActive && (
                <div className={`absolute right-0 bottom-0 top-0 w-1 bg-gradient-to-b ${cat.color}`}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid or List of Filtered Subpages Cards */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubpages.length > 0 ? (
            filteredSubpages.map((sp) => {
              const IconComponent = sp.icon;
              const { direct, guided } = getCardButtonStyles(sp.theme.bg || "");
              return (
                <div
                  key={sp.id}
                  className={`rounded-2xl border ${sp.theme.bg} ${sp.theme.border} shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 group overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
                >
                  {/* Card Top Section */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-xl ${sp.theme.icon} border border-black/[0.04]`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          sp.type === "subpages" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-purple-500/10 text-purple-650 border-purple-500/20"
                        }`}>
                          {sp.type === "subpages" ? t("Subpage") : t("Tab")}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${sp.theme.badge}`}>
                          {sp.badge}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-black text-gray-950 dark:text-gray-50 tracking-tight mb-1 inline-flex items-center gap-1">
                        {sp.title}
                      </h4>
                      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm line-clamp-3">
                        {sp.desc}
                      </p>
                    </div>

                    {/* Micro Specs Drawer / Specs Panel */}
                    <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/40">
                      <div className="flex items-start gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 mt-1.5 shrink-0"></div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 leading-normal line-clamp-2">
                          {sp.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Both Methods action panel */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/45 dark:bg-gray-900/15">
                    {/* Method 1: Direct Entry */}
                    <button
                      id={`btn-direct-${sp.id}`}
                      onClick={() => {
                        if (sp.type === "tab" && sp.onClickCustom) {
                          sp.onClickCustom();
                        } else {
                          setActiveTab(sp.id);
                        }
                      }}
                      className={`py-2 px-3 text-[11px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer group/direct ${direct.fBtn}`}
                      title={t("Instant Direct Redirect Route")}
                    >
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${direct.fIcon} transition-transform duration-200`} />
                      <span>{t("Direct entry")}</span>
                    </button>

                    {/* Method 2: Guided Setup */}
                    <button
                      id={`btn-guided-${sp.id}`}
                      onClick={() => {
                        const walkthroughData = {
                          itemId: sp.id,
                          step: 1,
                          isActive: true
                        };
                        localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(walkthroughData));
                        window.dispatchEvent(new Event("bharat_book_walkthrough_state_change"));
                      }}
                      className={`py-2 px-3 text-[11px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer group/guided ${guided.gBtn}`}
                      title={t("Interactive Step Dialog Route")}
                    >
                      <Layers className={`w-3.5 h-3.5 shrink-0 ${guided.gIcon} transition-transform duration-205`} />
                      <span>{t("Guided walk")}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-200/50 dark:border-gray-700/60 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 animate-pulse" />
              </div>
              <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                {t("No items match your criteria in selected type")}
              </h5>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold max-w-xs leading-normal">
                {t("Try swapping between All, Subpages, and Interactive Tabs filters, or refitting the search query text inside workspace filter.")}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Rich List View (Modern Compact Row Layout) */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/60 overflow-hidden divide-y divide-gray-150 dark:divide-gray-700/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {filteredSubpages.length > 0 ? (
            filteredSubpages.map((sp) => {
              const IconComponent = sp.icon;
              const { direct, guided } = getCardButtonStyles(sp.theme.bg || "");
              return (
                <div 
                  key={sp.id}
                  className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 animate-in fade-in">
                    {/* Compact themed icon */}
                    <div className={`p-2 rounded-xl mt-0.5 ${sp.theme.icon} border border-black/[0.04] shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-[13px] font-black text-gray-950 dark:text-gray-50 group-hover:text-blue-600 transition-colors">
                          {sp.title}
                        </h4>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          sp.type === "subpages" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-purple-500/10 text-purple-650 border-purple-500/20"
                        }`}>
                          {sp.type === "subpages" ? t("Subpage") : t("Tab")}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${sp.theme.badge}`}>
                          {sp.badge}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">
                          {sp.status}
                        </span>
                      </div>
                      
                      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-normal max-w-xl md:max-w-2xl">
                        {sp.desc}
                      </p>
                      
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 italic mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                        {sp.details}
                      </p>
                    </div>
                  </div>

                  {/* Both Actions in List View */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                    {/* Method 1: Direct */}
                    <button
                      id={`list-btn-direct-${sp.id}`}
                      onClick={() => {
                        if (sp.type === "tab" && sp.onClickCustom) {
                          sp.onClickCustom();
                        } else {
                          setActiveTab(sp.id);
                        }
                      }}
                      className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer group/lst-direct ${direct.fBtn}`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${direct.fIcon}`} />
                      <span>{t("Direct")}</span>
                    </button>

                    {/* Method 2: Guided */}
                    <button
                      id={`list-btn-guided-${sp.id}`}
                      onClick={() => {
                        const walkthroughData = {
                          itemId: sp.id,
                          step: 1,
                          isActive: true
                        };
                        localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(walkthroughData));
                        window.dispatchEvent(new Event("bharat_book_walkthrough_state_change"));
                      }}
                      className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer group/lst-guided ${guided.gBtn}`}
                    >
                      <Layers className={`w-3.5 h-3.5 shrink-0 ${guided.gIcon}`} />
                      <span>{t("Guided")}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 dark:bg-gray-850 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 animate-pulse" />
              </div>
              <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                {t("No settings subpages match your criteria")}
              </h5>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold max-w-xs leading-normal">
                {t("Try refitting search query spellings or resetting category buttons to show all results.")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
