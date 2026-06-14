import React from "react";
import { SettingsViewProps } from "./types";
import { useSettingsState } from "./hooks/useSettingsState";
import { useSettingsLogic } from "./hooks/useSettingsLogic";
import { SettingsTabs } from "./views/SettingsTabs";

// Import all setting sections
import { GeneralSettings } from "../WorkspaceSettings/GeneralSettings";
import { UserSettings } from "../OrganizationSettings/UserSettings";
import { AlertChannel } from "../SupportSystemSettings/AlertChannel";
import { SecuritySettings } from "../OrganizationSettings/SecuritySettings";
import { PrivacySettings } from "../OrganizationSettings/PrivacySettings";
import { ImportSettings } from "../DataEngineSettings/ImportSettings";
import { MappingSettings } from "../DataEngineSettings/MappingSettings";
import { AISettings } from "../DataEngineSettings/AISettings";
import { AdminSettings } from "../OrganizationSettings/AdminSettings";
import { DataExplorer } from "../DataEngineSettings/DataExplorer";
import { AppNavigationSettings } from "../WorkspaceSettings/AppNavigationSettings";
import { VoucherNumberingSettings } from "../WorkspaceSettings/VoucherNumbering";
import { InvoicePrintSettings } from "../WorkspaceSettings/InvoicePrintSettings";
import { FormDetailSettings } from "../WorkspaceSettings/FormDetailSettings";
import { FirmSettings } from "../WorkspaceSettings/FirmSettings";
import { HelpSettings } from "../SupportSystemSettings/HelpSettings";
import { SupportSettings } from "../SupportSystemSettings/SupportSettings";
import { AboutSettings } from "../SupportSystemSettings/AboutSettings";
import { UISettings } from "../WorkspaceSettings/UISettings";
import { UIFilterSettings } from "../WorkspaceSettings/UIFilterSettings";
import { SettingExplorer } from "../WorkspaceSettings/SettingExplorer";
import { CategorySettingsFilter } from "../WorkspaceSettings/CategorySettingsFilter";

// Temporary import for remaining sections
import { InfoIcon, LayoutIcon } from "../../icons/IconComponents";
import { DownloadCloud, Check, X, Sparkles, Layers, ArrowRight, ArrowLeft, RefreshCw, Compass, ArrowUp, ArrowDown, LayoutGrid } from "lucide-react";

const walkthroughItemMap: Record<string, { parentId: string; parentTitle: string; tabId?: string; tabTitle?: string; overrideKey?: string }> = {
  // HIGH LEVEL SUBPAGES (type === "subpages")
  ui: { parentId: "ui", parentTitle: "UI Related" },
  uifilter: { parentId: "uifilter", parentTitle: "UI Filter" },
  formdetails: { parentId: "formdetails", parentTitle: "Form Detail" },
  invoiceprint: { parentId: "invoiceprint", parentTitle: "Invoice & Print" },
  general: { parentId: "general", parentTitle: "General Settings" },
  firm: { parentId: "firm", parentTitle: "Firm" },
  about: { parentId: "about", parentTitle: "About" },
  navigation: { parentId: "navigation", parentTitle: "App Defaults" },
  vouchernumbering: { parentId: "vouchernumbering", parentTitle: "Voucher Numbering" },
  workspace: { parentId: "workspace", parentTitle: "Setting Explorer" },
  imports: { parentId: "imports", parentTitle: "Import Rules" },
  mapping: { parentId: "mapping", parentTitle: "Mapping" },
  ai: { parentId: "ai", parentTitle: "AI Engines" },
  data: { parentId: "data", parentTitle: "Data Explorer" },
  users: { parentId: "users", parentTitle: "Users" },
  alerts: { parentId: "alerts", parentTitle: "Alert Channel" },
  security: { parentId: "security", parentTitle: "Security" },
  privacy: { parentId: "privacy", parentTitle: "Privacy" },
  admin: { parentId: "admin", parentTitle: "Admin" },
  help: { parentId: "help", parentTitle: "Help Center" },
  support: { parentId: "support", parentTitle: "Support" },

  // GRANULAR TABS (type === "tab")
  ui_sub_layout: { parentId: "ui", parentTitle: "UI Related", tabId: "ui_layout", tabTitle: "Layout & Density Tab", overrideKey: "bharat_book_ui_subtab" },
  ui_sub_colors: { parentId: "ui", parentTitle: "UI Related", tabId: "ui_color", tabTitle: "Colors & Theme Palette Tab", overrideKey: "bharat_book_ui_subtab" },
  ui_sub_formats: { parentId: "ui", parentTitle: "UI Related", tabId: "ui_data", tabTitle: "Data Formats Tab", overrideKey: "bharat_book_ui_subtab" },
  ui_sub_localization: { parentId: "ui", parentTitle: "UI Related", tabId: "ui_localization", tabTitle: "Language Locale Tab", overrideKey: "bharat_book_ui_subtab" },
  ui_sub_more: { parentId: "ui", parentTitle: "UI Related", tabId: "ui_more", tabTitle: "Animations & Transitions Tab", overrideKey: "bharat_book_ui_subtab" },
  ui_sub_maximum: { parentId: "ui", parentTitle: "UI Related", tabId: "ui_maximum", tabTitle: "Dense Layout Caps Tab", overrideKey: "bharat_book_ui_subtab" },
  
  uifilter_sub_masters: { parentId: "uifilter", parentTitle: "UI Filter", tabId: "masters", tabTitle: "Masters Tab", overrideKey: "bharat_book_uifilter_subtab" },
  uifilter_sub_transactions: { parentId: "uifilter", parentTitle: "UI Filter", tabId: "transactions", tabTitle: "Transactions Tab", overrideKey: "bharat_book_uifilter_subtab" },
  uifilter_sub_operations: { parentId: "uifilter", parentTitle: "UI Filter", tabId: "operations", tabTitle: "Operations Tab", overrideKey: "bharat_book_uifilter_subtab" },
  uifilter_sub_reports: { parentId: "uifilter", parentTitle: "UI Filter", tabId: "reports", tabTitle: "Reports Tab", overrideKey: "bharat_book_uifilter_subtab" },
  uifilter_sub_settings: { parentId: "uifilter", parentTitle: "UI Filter", tabId: "settings", tabTitle: "Settings Tab", overrideKey: "bharat_book_uifilter_subtab" },

  formdetails_sub_desktop: { parentId: "formdetails", parentTitle: "Form Detail Settings", tabId: "desktop", tabTitle: "Desktop Form Preview Tab", overrideKey: "bharat_book_formdetails_subtab" },
  formdetails_sub_tablet: { parentId: "formdetails", parentTitle: "Form Detail Settings", tabId: "tablet", tabTitle: "Tablet Form Touch Tab", overrideKey: "bharat_book_formdetails_subtab" },
  formdetails_sub_mobile: { parentId: "formdetails", parentTitle: "Form Detail Settings", tabId: "mobile", tabTitle: "Mobile Portability Tab", overrideKey: "bharat_book_formdetails_subtab" },
  formdetails_sub_behaviors: { parentId: "formdetails", parentTitle: "Form Detail Settings", tabId: "behaviors", tabTitle: "Event Handlers Tab", overrideKey: "bharat_book_formdetails_subtab" },

  print_sub_design: { parentId: "invoiceprint", parentTitle: "Invoice & Print Settings", tabId: "design", tabTitle: "Design Styles Sheet Tab", overrideKey: "bharat_book_invoiceprint_subtab" },
  print_sub_structure: { parentId: "invoiceprint", parentTitle: "Invoice & Print Settings", tabId: "structure", tabTitle: "Invoicing Layout Framework Tab", overrideKey: "bharat_book_invoiceprint_subtab" },
  print_sub_content: { parentId: "invoiceprint", parentTitle: "Invoice & Print Settings", tabId: "content", tabTitle: "Tax Columns & Descriptions Tab", overrideKey: "bharat_book_invoiceprint_subtab" },
  
  firm_sub_brand: { parentId: "firm", parentTitle: "Firm Configuration Settings", tabId: "identity", tabTitle: "Brand Identity Setup Tab", overrideKey: "bharat_book_firm_subtab" },
  firm_sub_contact: { parentId: "firm", parentTitle: "Firm Configuration Settings", tabId: "contacts", tabTitle: "Regional Office Contact Tab", overrideKey: "bharat_book_firm_subtab" },
  firm_sub_finance: { parentId: "firm", parentTitle: "Firm Configuration Settings", tabId: "finance", tabTitle: "Finance & Currency Details Tab", overrideKey: "bharat_book_firm_subtab" },
  firm_sub_legal: { parentId: "firm", parentTitle: "Firm Configuration Settings", tabId: "compliance", tabTitle: "Legal & Auditing Guidelines Tab", overrideKey: "bharat_book_firm_subtab" },
  firm_sub_ops: { parentId: "firm", parentTitle: "Firm Configuration Settings", tabId: "operations", tabTitle: "Operation Divisions Hub Tab", overrideKey: "bharat_book_firm_subtab" },
  firm_sub_system: { parentId: "firm", parentTitle: "Firm Configuration Settings", tabId: "system", tabTitle: "System Integration Links Tab", overrideKey: "bharat_book_firm_subtab" },
  
  gen_sub_sound: { parentId: "general", parentTitle: "General Settings", tabId: "appearance", tabTitle: "Appearance & Sound Tab", overrideKey: "bharat_book_general_subtab" },
  gen_sub_timezone: { parentId: "general", parentTitle: "General Settings", tabId: "regional", tabTitle: "Timezone & Locale Tab", overrideKey: "bharat_book_general_subtab" },
  gen_sub_safety: { parentId: "general", parentTitle: "General Settings", tabId: "system", tabTitle: "Auto-locks & Safeguards Tab", overrideKey: "bharat_book_general_subtab" },
  
  voucher_sub_account: { parentId: "vouchernumbering", parentTitle: "Voucher Numbering Settings", tabId: "accounting", tabTitle: "Accounting Vouchers Tab", overrideKey: "bharat_book_vouchernumbering_subtab" },
  voucher_sub_inventory: { parentId: "vouchernumbering", parentTitle: "Voucher Numbering Settings", tabId: "inventory", tabTitle: "Inventory Vouchers Tab", overrideKey: "bharat_book_vouchernumbering_subtab" },
  
  nav_sub_priority: { parentId: "navigation", parentTitle: "App Defaults Settings", tabId: "priority", tabTitle: "Landing & Startup Priority Tab", overrideKey: "bharat_book_navigation_subtab" },
  nav_sub_routing: { parentId: "navigation", parentTitle: "App Defaults Settings", tabId: "routing", tabTitle: "Custom Routing Adjusters Tab", overrideKey: "bharat_book_navigation_subtab" },

  alerts_sub_inApp: { parentId: "alerts", parentTitle: "Alert Channel Settings", tabId: "inApp", tabTitle: "In-App Notifications Tab", overrideKey: "bharat_book_alerts_subtab" },
  alerts_sub_email: { parentId: "alerts", parentTitle: "Alert Channel Settings", tabId: "email", tabTitle: "Email Alerts Tab", overrideKey: "bharat_book_alerts_subtab" },
  alerts_sub_sms: { parentId: "alerts", parentTitle: "Alert Channel Settings", tabId: "sms", tabTitle: "SMS Alerts Tab", overrideKey: "bharat_book_alerts_subtab" },
  alerts_sub_whatsapp: { parentId: "alerts", parentTitle: "Alert Channel Settings", tabId: "whatsapp", tabTitle: "WhatsApp Alerts Tab", overrideKey: "bharat_book_alerts_subtab" },
  alerts_sub_telegram: { parentId: "alerts", parentTitle: "Alert Channel Settings", tabId: "telegram", tabTitle: "Telegram Alerts Tab", overrideKey: "bharat_book_alerts_subtab" },

  users_sub_account: { parentId: "users", parentTitle: "User Directories", tabId: "my-account", tabTitle: "My Account Profile Tab", overrideKey: "bharat_book_users_subtab" },
  users_sub_directory: { parentId: "users", parentTitle: "User Directories", tabId: "directory", tabTitle: "Company Registry Tab", overrideKey: "bharat_book_users_subtab" },
  users_sub_profile: { parentId: "users", parentTitle: "User Directories", tabId: "profile", tabTitle: "SuperAdmin Controls Tab", overrideKey: "bharat_book_users_subtab" },
  users_sub_active: { parentId: "users", parentTitle: "User Directories", tabId: "active-users", tabTitle: "Live Active Sessions Tab", overrideKey: "bharat_book_users_subtab" },
  users_sub_rules: { parentId: "users", parentTitle: "User Directories", tabId: "group-rules", tabTitle: "Category Rules Tab", overrideKey: "bharat_book_users_subtab" },
  users_sub_help: { parentId: "users", parentTitle: "User Directories", tabId: "help", tabTitle: "Help Desk Portal Tab", overrideKey: "bharat_book_users_subtab" },

  security_sub_policies: { parentId: "security", parentTitle: "Security Management", tabId: "policies", tabTitle: "Security Guard Policies Tab", overrideKey: "bharat_book_security_subtab" },
  security_sub_users: { parentId: "security", parentTitle: "Security Management", tabId: "users", tabTitle: "User Security Settings Tab", overrideKey: "bharat_book_security_subtab" },

  privacy_sub_gdpr: { parentId: "privacy", parentTitle: "Data Protection Policies", tabId: "gdpr", tabTitle: "GDPR Guidelines Compliance Tab", overrideKey: "bharat_book_privacy_subtab" },
  privacy_sub_consent: { parentId: "privacy", parentTitle: "Data Protection Policies", tabId: "data_consent", tabTitle: "Data Consent Agreement Tab", overrideKey: "bharat_book_privacy_subtab" },

  mapping_sub_basic: { parentId: "mapping", parentTitle: "Data Fields Mapping", tabId: "basic", tabTitle: "Standard Ledger Rules Tab", overrideKey: "bharat_book_mapping_subtab" },
  mapping_sub_list: { parentId: "mapping", parentTitle: "Data Fields Mapping", tabId: "list", tabTitle: "Comprehensive Mapping List Tab", overrideKey: "bharat_book_mapping_subtab" },
  mapping_sub_pattern: { parentId: "mapping", parentTitle: "Data Fields Mapping", tabId: "pattern", tabTitle: "Fuzzy Auto-Match Rules Tab", overrideKey: "bharat_book_mapping_subtab" },
  mapping_sub_mappingList: { parentId: "mapping", parentTitle: "Data Fields Mapping", tabId: "mappingList", tabTitle: "Structured Key References Tab", overrideKey: "bharat_book_mapping_subtab" },
  mapping_sub_sandbox: { parentId: "mapping", parentTitle: "Data Fields Mapping", tabId: "sandbox", tabTitle: "Interactive Sandbox Terminal Tab", overrideKey: "bharat_book_mapping_subtab" },

  imports_sub_global: { parentId: "imports", parentTitle: "Excel Import Rules", tabId: "global", tabTitle: "Global Default Rules Tab", overrideKey: "bharat_book_imports_subtab" },
  imports_sub_vouchers: { parentId: "imports", parentTitle: "Excel Import Rules", tabId: "vouchers", tabTitle: "Voucher-Specific Modifiers Tab", overrideKey: "bharat_book_imports_subtab" },

  ai_sub_internal: { parentId: "ai", parentTitle: "AI Engines Information", tabId: "internal", tabTitle: "Google Gemini Cloud Client Tab", overrideKey: "bharat_book_ai_subtab" },
  ai_sub_external: { parentId: "ai", parentTitle: "AI Engines Information", tabId: "external", tabTitle: "Custom Gateway Providers Tab", overrideKey: "bharat_book_ai_subtab" },
  ai_sub_local: { parentId: "ai", parentTitle: "AI Engines Information", tabId: "local", tabTitle: "Local Offline Models Tab", overrideKey: "bharat_book_ai_subtab" },
  ai_sub_engine: { parentId: "ai", parentTitle: "AI Engines Information", tabId: "ai_engine", tabTitle: "Bharat Book Core AI Engine Tab", overrideKey: "bharat_book_ai_subtab" },
  ai_sub_keys: { parentId: "ai", parentTitle: "AI Engines Information", tabId: "api_keys", tabTitle: "Secure API Access Keys Tab", overrideKey: "bharat_book_ai_subtab" },

  support_sub_chat: { parentId: "support", parentTitle: "Operational Support Page", tabId: "chat", tabTitle: "Interactive Online Chat Tab", overrideKey: "bharat_book_support_subtab" },
  support_sub_integrity: { parentId: "support", parentTitle: "Operational Support Page", tabId: "integrity", tabTitle: "Workspace Integrity Tools Tab", overrideKey: "bharat_book_support_subtab" },
  support_sub_tickets: { parentId: "support", parentTitle: "Operational Support Page", tabId: "tickets", tabTitle: "Historical Support Tickets Tab", overrideKey: "bharat_book_support_subtab" },

  about_sub_about: { parentId: "about", parentTitle: "Company Profiles Info", tabId: "about", tabTitle: "About Bharat Book Info Tab", overrideKey: "bharat_book_about_subtab" },
  about_sub_release: { parentId: "about", parentTitle: "Company Profiles Info", tabId: "release", tabTitle: "Release Version Logs Tab", overrideKey: "bharat_book_about_subtab" },
  about_sub_privacy: { parentId: "about", parentTitle: "Company Profiles Info", tabId: "privacy", tabTitle: "License & Privacy Terms Tab", overrideKey: "bharat_book_about_subtab" },
  about_sub_license: { parentId: "about", parentTitle: "Company Profiles Info", tabId: "license", tabTitle: "Developer License Files Tab", overrideKey: "bharat_book_about_subtab" },
  about_sub_terms: { parentId: "about", parentTitle: "Company Profiles Info", tabId: "terms", tabTitle: "Terms of Service Agreement Tab", overrideKey: "bharat_book_about_subtab" },
};

const walkthroughThemeFamilies: Record<string, string> = {
  ui: "indigo",
  uifilter: "amber",
  formdetails: "fuchsia",
  invoiceprint: "cyan",
  general: "amber",
  firm: "teal",
  about: "rose",
  navigation: "violet",
  vouchernumbering: "orange",
  workspace: "sky",
  imports: "emerald",
  mapping: "amber",
  ai: "blue",
  data: "violet",
  users: "rose",
  alerts: "yellow",
  security: "red",
  privacy: "slate",
  admin: "pink",
  help: "green",
  support: "cyan"
};

const getWalkthroughThemedClasses = (parentId: string) => {
  const f = walkthroughThemeFamilies[parentId] || "indigo";

  // Pre-declared literal styling to support Tailwind design compilation perfectly
  let border = "border-indigo-500/45 text-indigo-400";
  let text = "text-indigo-400";
  let bgTen = "bg-indigo-500/10 border-indigo-500/25";
  let mainBtn = "bg-gradient-to-r from-indigo-600 to-indigo-705 hover:from-indigo-700 hover:to-indigo-805";
  let bgHoverMuted = "hover:bg-indigo-500/15";
  let p1Text = "text-indigo-300";

  if (f === "indigo") {
    border = "border-indigo-500/45"; text = "text-indigo-400"; bgTen = "bg-indigo-500/10 border-indigo-500/25";
    mainBtn = "bg-gradient-to-r from-indigo-600 to-indigo-705 hover:from-indigo-700 hover:to-indigo-805"; bgHoverMuted = "hover:bg-indigo-500/15"; p1Text = "text-indigo-300";
  } else if (f === "fuchsia") {
    border = "border-fuchsia-500/45"; text = "text-fuchsia-400"; bgTen = "bg-fuchsia-500/10 border-fuchsia-500/25";
    mainBtn = "bg-gradient-to-r from-fuchsia-600 to-fuchsia-705 hover:from-fuchsia-700 hover:to-fuchsia-805"; bgHoverMuted = "hover:bg-fuchsia-500/15"; p1Text = "text-fuchsia-300";
  } else if (f === "cyan") {
    border = "border-cyan-500/45"; text = "text-cyan-400"; bgTen = "bg-cyan-500/10 border-cyan-500/25";
    mainBtn = "bg-gradient-to-r from-cyan-600 to-cyan-705 hover:from-cyan-700 hover:to-cyan-805"; bgHoverMuted = "hover:bg-cyan-500/15"; p1Text = "text-cyan-300";
  } else if (f === "amber") {
    border = "border-amber-500/45"; text = "text-amber-400"; bgTen = "bg-amber-500/10 border-amber-500/25";
    mainBtn = "bg-gradient-to-r from-amber-600 to-amber-705 hover:from-amber-700 hover:to-amber-805"; bgHoverMuted = "hover:bg-amber-500/15"; p1Text = "text-amber-300";
  } else if (f === "teal") {
    border = "border-teal-500/45"; text = "text-teal-400"; bgTen = "bg-teal-500/10 border-teal-500/25";
    mainBtn = "bg-gradient-to-r from-teal-600 to-teal-705 hover:from-teal-700 hover:to-teal-850"; bgHoverMuted = "hover:bg-teal-500/15"; p1Text = "text-teal-300";
  } else if (f === "rose") {
    border = "border-rose-500/45"; text = "text-rose-400"; bgTen = "bg-rose-500/10 border-rose-500/25";
    mainBtn = "bg-gradient-to-r from-rose-600 to-rose-705 hover:from-rose-700 hover:to-rose-805"; bgHoverMuted = "hover:bg-rose-500/15"; p1Text = "text-rose-300";
  } else if (f === "violet") {
    border = "border-violet-500/45"; text = "text-violet-400"; bgTen = "bg-violet-500/10 border-violet-500/25";
    mainBtn = "bg-gradient-to-r from-violet-600 to-violet-705 hover:from-violet-700 hover:to-violet-805"; bgHoverMuted = "hover:bg-violet-500/15"; p1Text = "text-violet-300";
  } else if (f === "orange") {
    border = "border-orange-500/45"; text = "text-orange-400"; bgTen = "bg-orange-500/10 border-orange-500/25";
    mainBtn = "bg-gradient-to-r from-orange-600 to-orange-705 hover:from-orange-700 hover:to-orange-850"; bgHoverMuted = "hover:bg-orange-500/15"; p1Text = "text-orange-300";
  } else if (f === "sky") {
    border = "border-sky-500/45"; text = "text-sky-400"; bgTen = "bg-sky-500/10 border-sky-500/25";
    mainBtn = "bg-gradient-to-r from-sky-600 to-sky-705 hover:from-sky-700 hover:to-sky-850"; bgHoverMuted = "hover:bg-sky-500/15"; p1Text = "text-sky-300";
  } else if (f === "emerald") {
    border = "border-emerald-500/45"; text = "text-emerald-400"; bgTen = "bg-emerald-500/10 border-emerald-500/25";
    mainBtn = "bg-gradient-to-r from-emerald-600 to-emerald-705 hover:from-emerald-700 hover:to-emerald-850"; bgHoverMuted = "hover:bg-emerald-500/15"; p1Text = "text-emerald-300";
  } else if (f === "blue") {
    border = "border-blue-500/45"; text = "text-blue-400"; bgTen = "bg-blue-500/10 border-blue-500/25";
    mainBtn = "bg-gradient-to-r from-blue-600 to-blue-705 hover:from-blue-700 hover:to-blue-805"; bgHoverMuted = "hover:bg-blue-500/15"; p1Text = "text-blue-300";
  } else if (f === "yellow") {
    border = "border-yellow-500/45"; text = "text-yellow-400"; bgTen = "bg-yellow-500/10 border-yellow-500/25";
    mainBtn = "bg-gradient-to-r from-yellow-600 to-yellow-705 hover:from-yellow-700 hover:to-yellow-805"; bgHoverMuted = "hover:bg-yellow-500/15"; p1Text = "text-yellow-300";
  } else if (f === "red") {
    border = "border-red-500/45"; text = "text-red-400"; bgTen = "bg-red-500/10 border-red-500/25";
    mainBtn = "bg-gradient-to-r from-red-600 to-red-705 hover:from-red-700 hover:to-red-805"; bgHoverMuted = "hover:bg-red-500/15"; p1Text = "text-red-300";
  } else if (f === "slate") {
    border = "border-slate-500/45"; text = "text-slate-400"; bgTen = "bg-slate-500/10 border-slate-500/25";
    mainBtn = "bg-gradient-to-r from-slate-600 to-slate-705 hover:from-slate-700 hover:to-slate-805"; bgHoverMuted = "hover:bg-slate-500/15"; p1Text = "text-slate-300";
  } else if (f === "pink") {
    border = "border-pink-500/45"; text = "text-pink-400"; bgTen = "bg-pink-500/10 border-pink-500/25";
    mainBtn = "bg-gradient-to-r from-pink-600 to-pink-705 hover:from-pink-700 hover:to-pink-850"; bgHoverMuted = "hover:bg-pink-500/15"; p1Text = "text-pink-300";
  } else if (f === "green") {
    border = "border-green-500/45"; text = "text-green-400"; bgTen = "bg-green-500/10 border-green-500/25";
    mainBtn = "bg-gradient-to-r from-green-600 to-green-705 hover:from-green-700 hover:to-green-805"; bgHoverMuted = "hover:bg-green-500/15"; p1Text = "text-green-300";
  }

  return {
    family: f,
    border,
    text,
    bgTen,
    mainBtn,
    bgHoverMuted,
    p1Text
  };
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  setView,
  setActiveMasterTab,
  setReportBankActiveTab,
  defaultTab,
  onTabChange,
  ledgerMasters = [],
  onAppModeChange,
  onImportCategoryChange,
}) => {
  const state = useSettingsState(defaultTab || null, onTabChange, onAppModeChange);
  const actions = useSettingsLogic(state, onAppModeChange);

  const handleTabChange = (tab: any) => {
    state.setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // 🎓 Bharat Book Walkthrough State
  const [walkthrough, setWalkthrough] = React.useState<{
    itemId: string;
    step: 1 | 2 | 3;
    isActive: boolean;
  } | null>(null);

  React.useEffect(() => {
    const loadWalkthrough = () => {
      try {
        const val = localStorage.getItem("bharat_book_walkthrough_state");
        if (val) {
          setWalkthrough(JSON.parse(val));
        } else {
          setWalkthrough(null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadWalkthrough();
    window.addEventListener("bharat_book_walkthrough_state_change", loadWalkthrough);
    return () => {
      window.removeEventListener("bharat_book_walkthrough_state_change", loadWalkthrough);
    };
  }, []);

  // 🔗 Third level active tab router listener
  React.useEffect(() => {
    const handleOverrideTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        handleTabChange(customEvent.detail);
      }
    };
    window.addEventListener("bharat_book_active_tab_change", handleOverrideTab);
    return () => {
      window.removeEventListener("bharat_book_active_tab_change", handleOverrideTab);
    };
  }, []);

  // Toggle walkthrough placement: top vs bottom
  const [walkthroughPosition, setWalkthroughPosition] = React.useState<"top" | "bottom">(
    () => (localStorage.getItem("bharat_book_walkthrough_position") as "top" | "bottom") || "top"
  );

  const handleTogglePosition = () => {
    const nextPos = walkthroughPosition === "top" ? "bottom" : "top";
    localStorage.setItem("bharat_book_walkthrough_position", nextPos);
    setWalkthroughPosition(nextPos);
  };

  // Auto-scroll logic on walkthrough step or item change
  React.useEffect(() => {
    if (walkthrough && walkthrough.isActive) {
      const scrollTimer = setTimeout(() => {
        const el = document.getElementById("settings-content-wrapper");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 350, behavior: "smooth" });
        }
      }, 180);
      return () => clearTimeout(scrollTimer);
    }
  }, [walkthrough?.step, walkthrough?.itemId]);

  // Walkthrough helpers
  const handleWalkthroughPrev = () => {
    if (!walkthrough || walkthrough.step === 1) return;
    const nextData = { ...walkthrough, step: (walkthrough.step - 1) as 1 | 2 | 3 };
    localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(nextData));
    setWalkthrough(nextData);
  };

  const handleWalkthroughStepAction = () => {
    if (!walkthrough) return;
    const itemData = walkthroughItemMap[walkthrough.itemId];
    if (!itemData) return;

    if (walkthrough.step === 1) {
      // Step 1: Open particular subpage
      handleTabChange(itemData.parentId);
      
      const nextData = { ...walkthrough, step: 2 as const };
      localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(nextData));
      setWalkthrough(nextData);
    } else if (walkthrough.step === 2) {
      // Step 2: Go to page and activate tab
      if (itemData.tabId) {
        const key = itemData.overrideKey || `bharat_book_${itemData.parentId}_subtab`;
        localStorage.setItem(`${key}_override`, itemData.tabId);
        window.dispatchEvent(new Event(`${key}_trigger`));
        
        // If parent is ui, we can activate directly as well
        if (itemData.parentId === "ui") {
          handleTabChange(itemData.tabId);
        }
      }
      
      const nextData = { ...walkthrough, step: 3 as const };
      localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(nextData));
      setWalkthrough(nextData);
    } else {
      // Step 3: Complete
      localStorage.removeItem("bharat_book_walkthrough_state");
      setWalkthrough(null);
    }
  };

  const handleWalkthroughClose = () => {
    localStorage.removeItem("bharat_book_walkthrough_state");
    setWalkthrough(null);
  };

  const handleWalkthroughDirectEntry = () => {
    if (!walkthrough) return;
    const itemData = walkthroughItemMap[walkthrough.itemId];
    if (!itemData) return;

    // 1. Ingress Tab change immediately
    handleTabChange(itemData.parentId);

    // 2. Select sub tab immediately
    if (itemData.tabId) {
      const key = itemData.overrideKey || `bharat_book_${itemData.parentId}_subtab`;
      localStorage.setItem(`${key}_override`, itemData.tabId);
      window.dispatchEvent(new Event(`${key}_trigger`));
      
      if (itemData.parentId === "ui") {
        handleTabChange(itemData.tabId);
      }
    }

    // 3. Close the guided walkthrough
    localStorage.removeItem("bharat_book_walkthrough_state");
    setWalkthrough(null);
  };

  const currentWkItem = walkthrough ? walkthroughItemMap[walkthrough.itemId] : null;

  const themedDef = React.useMemo(() => {
    return getWalkthroughThemedClasses(currentWkItem?.parentId || "");
  }, [currentWkItem]);

  const availableSubItems = React.useMemo(() => {
    if (!currentWkItem) return [];
    return Object.entries(walkthroughItemMap)
      .filter(([_, val]) => val.parentId === currentWkItem.parentId && val.tabId)
      .map(([key, val]) => ({ key, ...val }));
  }, [currentWkItem]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 relative">
      <div className="flex flex-col space-y-6">
        <SettingsTabs activeTab={state.activeTab} handleTabChange={handleTabChange} t={state.t} />

        <div id="settings-content-wrapper" className="space-y-6">
          {state.activeTab === "setting_categories" && (
            <CategorySettingsFilter setActiveTab={handleTabChange} t={state.t} />
          )}

          {state.activeTab === "ai" && (
            <AISettings
              aiSettings={state.aiSettings}
              setAiSettings={state.setAiSettings}
              handleSave={actions.handleSave}
              isSaved={state.isSaved}
            />
          )}

          {state.activeTab === "general" && (
            <GeneralSettings
              theme={state.theme} setTheme={state.setTheme} language={state.language} setLanguage={state.setLanguage}
              dateFormat={state.dateFormat} setDateFormat={state.setDateFormat} timezone={state.timezone} setTimezone={state.setTimezone}
              autoLock={state.autoLock} setAutoLock={state.setAutoLock} density={state.density} setDensity={state.setDensity}
              animations={state.animations} setAnimations={state.setAnimations} soundEffects={state.soundEffects} setSoundEffects={state.setSoundEffects}
              keyboardShortcuts={state.keyboardShortcuts} setKeyboardShortcuts={state.setKeyboardShortcuts} weekStartsOn={state.weekStartsOn}
              setWeekStartsOn={state.setWeekStartsOn} paginationSize={state.paginationSize} setPaginationSize={state.setPaginationSize}
              showSystemInfo={state.showSystemInfo} setShowSystemInfo={state.setShowSystemInfo} displayId={state.displayId} setDisplayId={state.setDisplayId}
              appMode={state.appMode} setAppMode={state.setAppMode} handleSave={actions.handleSave} handleLoad={actions.handleLoad}
              handleReset={actions.handleReset} handleClear={actions.handleClear} handleDeleteAll={() => { localStorage.clear(); window.location.reload(); }}
              isSaved={state.isSaved}
            />
          )}

          {state.activeTab === "workspace" && <SettingExplorer />}

          {(state.activeTab === "ui" || state.activeTab?.startsWith("ui_")) && <UISettings defaultSubtab={state.activeTab} />}

          {state.activeTab === "uifilter" && <UIFilterSettings />}

          {state.activeTab === "vouchernumbering" && <VoucherNumberingSettings />}
          {state.activeTab === "invoiceprint" && <InvoicePrintSettings appMode={state.appMode} />}
          {state.activeTab === "formdetails" && <FormDetailSettings />}
          {state.activeTab === "firm" && <FirmSettings ledgerMasters={ledgerMasters} />}
          {state.activeTab === "users" && <UserSettings />}
          
          {state.activeTab === "alerts" && (
            <AlertChannel 
              toggles={state.toggles} 
              handleToggle={actions.handleToggle} 
              setToggles={state.setToggles}
              handleSave={actions.handleSave}
            />
          )}

          {state.activeTab === "security" && <SecuritySettings />}

          {state.activeTab === "privacy" && (
            <PrivacySettings toggles={state.toggles} handleToggle={actions.handleToggle} />
          )}

          {state.activeTab === "imports" && (
            <ImportSettings 
              toggles={state.toggles} 
              handleToggle={actions.handleToggle} 
              setView={setView}
              onImportCategoryChange={onImportCategoryChange}
            />
          )}

          {state.activeTab === "admin" && <AdminSettings />}
          {state.activeTab === "navigation" && <AppNavigationSettings />}
          {state.activeTab === "data" && <DataExplorer />}
          {state.activeTab === "help" && <HelpSettings />}
          
          {state.activeTab === "support" && <SupportSettings aiSettings={state.aiSettings} setAiSettings={state.setAiSettings} />}

          {state.activeTab === "mapping" && (
            <MappingSettings
              advancedParsingEnabled={state.advancedParsingEnabled} setAdvancedParsingEnabled={state.setAdvancedParsingEnabled}
              toggles={state.toggles} handleToggle={actions.handleToggle} customMappingRules={state.customMappingRules}
              setCustomMappingRules={state.setCustomMappingRules} bankMappings={state.bankMappings} setBankMappings={state.setBankMappings}
              bankChargesKeywords={state.bankChargesKeywords} setBankChargesKeywords={state.setBankChargesKeywords} cashFlowKeywords={state.cashFlowKeywords}
              setCashFlowKeywords={state.setCashFlowKeywords} selfTransferKeywords={state.selfTransferKeywords}
              setSelfTransferKeywords={state.setSelfTransferKeywords} mappingRules={state.mappingRules} setMappingRules={state.setMappingRules}
              missingMasterAction={state.missingMasterAction} setMissingMasterAction={state.setMissingMasterAction} processingPriority={state.processingPriority}
              setProcessingPriority={state.setProcessingPriority}
              sandboxInput={state.sandboxInput} setSandboxInput={state.setSandboxInput} runSandboxSimulator={actions.runSandboxSimulator}
              sandboxResult={state.sandboxResult} bulkSandboxResults={state.bulkSandboxResults} setBulkSandboxResults={state.setBulkSandboxResults} runBulkSimulator={actions.runBulkSimulator}
              sourceColumn={state.sourceColumn} setSourceColumn={state.setSourceColumn}
              splitDelimiter={state.splitDelimiter} setSplitDelimiter={state.setSplitDelimiter} ignoreExtractionKeywords={state.ignoreExtractionKeywords}
              setIgnoreExtractionKeywords={state.setIgnoreExtractionKeywords} partyNameLocation={state.partyNameLocation}
              setPartyNameLocation={state.setPartyNameLocation} utrExtractorType={state.utrExtractorType} setUtrExtractorType={state.setUtrExtractorType}
              accountNumberDetection={state.accountNumberDetection} setAccountNumberDetection={state.setAccountNumberDetection}
              bankShortCodes={state.bankShortCodes} setBankShortCodes={state.setBankShortCodes} bankIgnoreWords={state.bankIgnoreWords}
              setBankIgnoreWords={state.setBankIgnoreWords} paymentModes={state.paymentModes} setPaymentModes={state.setPaymentModes}
              paymentChannels={state.paymentChannels} setPaymentChannels={state.setPaymentChannels} ifscPrefixes={state.ifscPrefixes}
              setIfscPrefixes={state.setIfscPrefixes}
            />
          )}

          {state.activeTab === "about" && <AboutSettings />}

        </div>
      </div>

      {/* 🎓 BHARAT BOOK GUIDED WALKTHROUGH WIZARD FLOATING OVERLAY */}
      {walkthrough && currentWkItem && (
        <div 
          className={`fixed max-w-[340px] xs:max-w-sm w-[calc(100vw-2rem)] bg-gray-950 dark:bg-gray-900 border rounded-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] text-white z-50 animate-in duration-300 ${themedDef.border} ${
            walkthroughPosition === "top" 
              ? "top-24 right-6 md:right-8 slide-in-from-top-4" 
              : "bottom-6 right-6 md:right-8 slide-in-from-bottom-4"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Compass className={`w-5 h-5 shrink-0 animate-spin-slow ${themedDef.text}`} />
              <div>
                <h5 className={`text-[11px] font-black tracking-[0.1em] uppercase font-mono ${themedDef.text}`}>
                  {state.t("GUIDED WALKTHROUGH")}
                </h5>
                <p className="text-[10px] font-bold text-gray-400 capitalize">
                  {currentWkItem.parentTitle} {currentWkItem.tabTitle ? `› ${currentWkItem.tabTitle}` : ""}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleTabChange("setting_categories")}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer shadow-sm"
                title={state.t("Back to Category setting dashboard")}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">{state.t("Categories")}</span>
              </button>

              <button
                onClick={handleTogglePosition}
                className="p-1 hover:bg-gray-800/80 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-white"
                title={walkthroughPosition === "top" ? state.t("Pin to Bottom") : state.t("Pin to Top")}
              >
                {walkthroughPosition === "top" ? (
                  <ArrowDown className="w-4 h-4" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleWalkthroughClose}
                className="p-1 hover:bg-gray-800/80 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar steps */}
          <div className="grid grid-cols-3 gap-1.5 mb-4 font-mono text-[9px] font-extrabold text-center">
            <div className={`p-1 rounded transition-all duration-300 ${walkthrough.step >= 1 ? `${themedDef.mainBtn} text-white` : "bg-gray-800 text-gray-500"}`}>
              1. OPEN
            </div>
            <div className={`p-1 rounded transition-all duration-300 ${walkthrough.step >= 2 ? `${themedDef.mainBtn} text-white` : "bg-gray-800 text-gray-500"}`}>
              2. TAB
            </div>
            <div className={`p-1 rounded transition-all duration-300 ${walkthrough.step >= 3 ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-500"}`}>
              3. VIEW
            </div>
          </div>

          {/* Instructional Text */}
          <div className="bg-gray-905 dark:bg-black/30 border border-gray-850 rounded-xl p-3 mb-4 text-[11px] leading-relaxed text-gray-300 font-sans">
            {walkthrough.step === 1 && (
              <div className="space-y-2.5">
                <p>
                  {state.t("Step 1: Ingress Subpage Location. The first step launches the high-level sub-view container:")}{" "}
                  <span className={`font-bold px-1.5 py-0.5 border rounded ${themedDef.text} ${themedDef.bgTen}`}>{currentWkItem.parentTitle}</span>.{" "}
                  {state.t("Click the action key to auto-launch this workspace section.")}
                </p>
                {availableSubItems.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-800/60">
                    <label className={`block text-[9px] font-mono tracking-wider font-black uppercase mb-1 ${themedDef.text}`}>
                      {state.t("🎯 Target Page Option / Tab:")}
                    </label>
                    <select
                      id="walkthrough-step1-target-tab"
                      value={walkthrough.itemId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        const nextData = { ...walkthrough, itemId: nextId };
                        localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(nextData));
                        setWalkthrough(nextData);
                      }}
                      className={`w-full bg-gray-900 border rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer border-${themedDef.family}-500/30 hover:border-${themedDef.family}-500/50 text-${themedDef.family}-200 focus:ring-1 focus:ring-${themedDef.family}-500/30`}
                    >
                      <option value={currentWkItem.parentId}>
                        {state.t("Default View / Main Section")}
                      </option>
                      {availableSubItems.map((sub) => (
                        <option key={sub.key} value={sub.key}>
                          {sub.tabTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {walkthrough.step === 2 && (
              <div className="space-y-2.5">
                <p>
                  {state.t("Step 2: Molecular Tab Selector. In the active workspace, identify the tab selectors. We will programmatically configure and select the target subtab:")}{" "}
                  <span className={`font-bold px-1.5 py-0.5 border rounded ${themedDef.text} ${themedDef.bgTen}`}>
                    {currentWkItem.tabTitle || state.t("Main Section")}
                  </span>.{" "}
                  {state.t("Click below to snap-activate.")}
                </p>
                {availableSubItems.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-800/60">
                    <label className={`block text-[9px] font-mono tracking-wider font-black uppercase mb-1 ${themedDef.text}`}>
                      {state.t("⚙️ Switch Configuration Tab / Tag:")}
                    </label>
                    <select
                      id="walkthrough-step2-target-tab"
                      value={walkthrough.itemId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        const nextData = { ...walkthrough, itemId: nextId };
                        localStorage.setItem("bharat_book_walkthrough_state", JSON.stringify(nextData));
                        setWalkthrough(nextData);
                      }}
                      className={`w-full bg-gray-900 border rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer border-${themedDef.family}-500/30 hover:border-${themedDef.family}-500/50 text-${themedDef.family}-200 focus:ring-1 focus:ring-${themedDef.family}-500/30`}
                    >
                      <option value={currentWkItem.parentId}>
                        {state.t("Default View / Main Section")}
                      </option>
                      {availableSubItems.map((sub) => (
                        <option key={sub.key} value={sub.key}>
                          {sub.tabTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {walkthrough.step === 3 && (
              <p>
                {state.t("Step 3: Responsive Row Ingress check. Your setting tab is active! Observe the page layout header. Under Bharat Book core rules, the toolbar is compact without wrapping, reorganizing into a stacked dual rows on mobile. Enjoy your customized workspace!")}
              </p>
            )}
          </div>

           {/* Control Action buttons */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleWalkthroughPrev}
                disabled={walkthrough.step === 1}
                className="px-2.5 py-2 text-[10px] font-bold text-gray-400 hover:text-white dark:hover:text-white rounded-lg hover:bg-gray-800 flex items-center gap-1 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                <span>{state.t("Back")}</span>
              </button>

              <button
                onClick={() => handleTabChange("setting_categories")}
                className="px-2.5 py-2 text-[10px] font-extrabold bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title={state.t("Back to Category setting dashboard")}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden xs:inline">{state.t("Categories")}</span>
              </button>

              <button
                onClick={handleWalkthroughDirectEntry}
                className={`px-2.5 py-2 text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-transparent ${themedDef.text} ${themedDef.bgHoverMuted}`}
                title={state.t("Direct Entry - skip steps")}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{state.t("Direct")}</span>
              </button>
            </div>

            <button
              onClick={handleWalkthroughStepAction}
              className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm transition-all text-white cursor-pointer active:scale-95 ${
                walkthrough.step === 3
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  : themedDef.mainBtn
              }`}
            >
              <span>
                {walkthrough.step === 1 && state.t("Auto-Launch")}
                {walkthrough.step === 2 && state.t("Activate Tab")}
                {walkthrough.step === 3 && state.t("Complete & Close")}
              </span>
              {walkthrough.step < 3 ? <ArrowRight className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
