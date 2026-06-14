import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Check, Settings } from "lucide-react";

interface SettingsFilterTabProps {
  searchTerm: string;
}

export const SettingsFilterTab: React.FC<SettingsFilterTabProps> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [activeImportanceFilter, setActiveImportanceFilter] = useState<string>("all");
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);

  // Base list of all settings sub-pages/tabs from navigationSchema
  const settingsTabs = [
    { id: "setting_categories", label: "Category Settings", desc: "Main landing settings category dashboard", category: "general" },
    { id: "workspace", label: "Setting Explorer", desc: "Detailed dense navigation tree of settings", category: "general" },
    { id: "firm", label: "Firm Configuration", desc: "Company identity, compliance, and legal guidelines", category: "general" },
    { id: "general", label: "General Settings", desc: "Decimal formatting, financial periods, and regional defaults", category: "general" },
    { id: "ui", label: "UI Personalization", desc: "Theme paletting, visual density, animations, and typography", category: "ui" },
    { id: "formdetails", label: "Form Detail Specs", desc: "Screen forms and Touch targets behaviors", category: "ui" },
    { id: "navigation", label: "App Defaults", desc: "Landing screens and universal routings", category: "ui" },
    { id: "invoiceprint", label: "Invoice & Print Layouts", desc: "Chunky 3D invoice document layout designers", category: "ui" },
    { id: "vouchernumbering", label: "Voucher Numbering Schemes", desc: "Sequential and prefix numbering rules", category: "ui" },
    { id: "users", label: "User Accounts", desc: "Directory, secure profiles, and active session telemetry", category: "security" },
    { id: "alerts", label: "Alert Channels", desc: "Instant SMS/Mail gateways and real-time app flags", category: "security" },
    { id: "security", label: "Passwords & IP Security", desc: "MFA setups and network access restrictions", category: "security" },
    { id: "privacy", label: "Regulations & GDPRO", desc: "Statutory data consents and privacy frameworks", category: "security" },
    { id: "imports", label: "Excel & PDF Ingestion rules", desc: "Direct column corrections and failing flags", category: "data" },
    { id: "mapping", label: "Reconciliation Mapping", desc: "Master linking fallback templates", category: "data" },
    { id: "ai", label: "AI Engines", desc: "Intelligent auto-repair and verification transcription models", category: "data" },
    { id: "admin", label: "Database Maintenance", desc: "Index tunes, backups, and snapshot restores", category: "security" },
    { id: "data", label: "Universal Data Exporters", desc: "JSON/Excel bulk dumps and security keys", category: "data" },
    { id: "help", label: "Interactive Trainers", desc: "Faq sheets and workspace instruction guides", category: "support" },
    { id: "support", label: "Assistance Tickets", desc: "Real-time query resolution and support chats", category: "support" },
    { id: "about", label: "System Information", desc: "Legal disclosures and release logs", category: "support" },
  ];

  const categories = [
    { id: "general", label: "General Workspace" },
    { id: "ui", label: "UI & Format" },
    { id: "security", label: "Security & System" },
    { id: "data", label: "Data & Integration" },
    { id: "support", label: "Help & Support" },
  ];

  const loadState = () => {
    const loaded = localStorage.getItem("bharat_book_hidden_settings_tabs");
    if (loaded) {
      try {
        setHiddenTabs(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    } else {
      setHiddenTabs([]);
    }
  };

  // Load state from localStorage on mount
  useEffect(() => {
    loadState();
    window.addEventListener("bharat_book_uifilter_reload", loadState);
    return () => window.removeEventListener("bharat_book_uifilter_reload", loadState);
  }, []);

  // Save changes and fire dynamic update event to immediately refresh tabs
  const saveState = (updatedList: string[]) => {
    setHiddenTabs(updatedList);
    localStorage.setItem("bharat_book_hidden_settings_tabs", JSON.stringify(updatedList));
    // Trigger window event so any listening sidebar or settings views refresh immediately
    window.dispatchEvent(new Event("bharat_book_navigation_sync_trigger"));
    window.dispatchEvent(new Event("bharat_book_settings_tabs_trigger"));
  };

  const toggleTabVisibility = (id: string) => {
    // Prevent hiding uifilter or index so settings doesn't completely break
    if (id === "uifilter" || id === "setting_categories") return;
    
    const isHidden = hiddenTabs.includes(id);
    let newList: string[];
    if (isHidden) {
      newList = hiddenTabs.filter(x => x !== id);
    } else {
      newList = [...hiddenTabs, id];
    }
    saveState(newList);
  };

  useEffect(() => {
    const handleReset = () => saveState([]);
    const handleHideAll = () => {
      const nonEssential = settingsTabs
        .map(t => t.id)
        .filter(id => id !== "setting_categories" && id !== "uifilter");
      saveState(nonEssential);
    };
    
    window.addEventListener("bharat_book_uifilter_reset", handleReset);
    window.addEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    return () => {
      window.removeEventListener("bharat_book_uifilter_reset", handleReset);
      window.removeEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    };
  }, []);

  const filteredTabs = settingsTabs.filter(tab => {
    const matchSearch = tab.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        tab.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategoryFilter === "all" || tab.category === activeCategoryFilter;
    
    const isEssential = tab.id === "setting_categories" || tab.id === "general";
    const isBasic = isEssential || tab.id === "firm" || tab.id === "users";
    const isCustom = false;
    
    let matchImportance = true;
    if (activeImportanceFilter === "essential") matchImportance = isEssential;
    else if (activeImportanceFilter === "basic") matchImportance = isBasic;
    else if (activeImportanceFilter === "optional") matchImportance = !isBasic;
    else if (activeImportanceFilter === "custom") matchImportance = isCustom;
                           
    return matchSearch && matchCategory && matchImportance;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Category Filter Dropdown */}
      <div className="flex flex-row items-center gap-2 bg-gray-50 dark:bg-gray-800/45 p-2 rounded-xl border border-gray-150 dark:border-gray-800">
        <select
          value={activeCategoryFilter}
          onChange={(e) => setActiveCategoryFilter(e.target.value)}
          className="flex-1 sm:flex-none w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="all">{t("All Sections")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(cat.label)}
            </option>
          ))}
        </select>

        <select
          value={activeImportanceFilter}
          onChange={(e) => setActiveImportanceFilter(e.target.value)}
          className="flex-1 sm:flex-none w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="all">{t("All features")}</option>
          <option value="essential">{t("Essential only")}</option>
          <option value="basic">{t("Basic")}</option>
          <option value="optional">{t("Optional")}</option>
          <option value="custom">{t("Custom")}</option>
        </select>
      </div>

      {/* Grid of Toggle cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTabs.map((tab) => {
          const isHidden = hiddenTabs.includes(tab.id);
          const isEssential = tab.id === "setting_categories";
          return (
            <div
              key={tab.id}
              onClick={() => toggleTabVisibility(tab.id)}
              className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3 cursor-pointer select-none relative group overflow-hidden ${
                isHidden
                  ? "bg-gray-50/40 dark:bg-gray-900/10 border-gray-150 dark:border-gray-850 opacity-60 hover:opacity-100"
                  : "bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-600 shadow-2xs hover:shadow-xs"
              } ${isEssential ? "cursor-not-allowed opacity-85" : ""}`}
            >
              {/* Selector indicator block */}
              <div className={`shrink-0 w-4 h-4 mt-0.5 rounded-md border flex items-center justify-center transition-all ${
                isHidden 
                  ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-transparent" 
                  : isEssential
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-2xs"
                    : "border-blue-500 bg-blue-500 text-white shadow-2xs"
              }`}>
                {!isHidden && <Check className="w-3 h-3 stroke-[3px]" />}
              </div>

              <div className="flex-1 min-w-0">
                <h5 className={`text-xs font-bold leading-tight truncate ${isHidden ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-800 dark:text-white"}`}>
                  {t(tab.label)}
                </h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-tight font-semibold">
                  {t(tab.desc)}
                </p>
                {isEssential && (
                  <span className="inline-block mt-1 text-[8px] tracking-wide font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-1 py-0.2 rounded-md">
                    {t("Essential")}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredTabs.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800 rounded-xl">
            <p className="text-xs text-gray-400 font-bold">{t("No sub-pages matched your search.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
