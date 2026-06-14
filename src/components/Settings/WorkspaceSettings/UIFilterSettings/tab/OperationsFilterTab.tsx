import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Search, Eye, ChevronDown, ChevronUp, Cpu, Check } from "lucide-react";

interface OpsSubpage {
  id: string; // e.g. ops_upload, ops_pricing
  rawId: string; // raw ID e.g. upload, pricing
  label: string;
  category: "import" | "bulk" | "home";
  desc: string;
}

export const OperationsFilterTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [activeImportanceFilter, setActiveImportanceFilter] = useState<string>("all");
  const [hiddenOperations, setHiddenOperations] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    import: true,
    bulk: true,
    home: true,
  });

  const loadState = () => {
    const loaded = localStorage.getItem("bharat_book_hidden_operations_tabs");
    if (loaded) {
      try {
        setHiddenOperations(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    } else {
      setHiddenOperations([]);
    }
  };

  // Load state from localStorage on mount
  useEffect(() => {
    loadState();
    window.addEventListener("bharat_book_uifilter_reload", loadState);
    return () => window.removeEventListener("bharat_book_uifilter_reload", loadState);
  }, []);

  // Save changes to localStorage and dispatch event
  const saveState = (updatedList: string[]) => {
    setHiddenOperations(updatedList);
    localStorage.setItem("bharat_book_hidden_operations_tabs", JSON.stringify(updatedList));
    // Dispatch event to hot-reload rendering tabs inside those views!
    window.dispatchEvent(new Event("bharat_book_operations_tabs_trigger"));
  };

  useEffect(() => {
    const handleReset = () => saveState([]);
    const handleHideAll = () => {
      // Keep essential safeguarding
      const nonEssential = opsSubpages
        .map(t => t.id)
        .filter(id => id !== "ops_upload" && id !== "ops_pricing" && id !== "home_hub");
      saveState(nonEssential);
    };
    
    window.addEventListener("bharat_book_uifilter_reset", handleReset);
    window.addEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    return () => {
      window.removeEventListener("bharat_book_uifilter_reset", handleReset);
      window.removeEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    };
  }, []);

  const toggleOpsVisibility = (id: string) => {
    // Keep upload, pricing, and home_hub as essential safeguarding
    if (id === "ops_upload" || id === "ops_pricing" || id === "home_hub") return;

    const isHidden = hiddenOperations.includes(id);
    let newList: string[];
    if (isHidden) {
      newList = hiddenOperations.filter(x => x !== id);
    } else {
      newList = [...hiddenOperations, id];
    }
    saveState(newList);
  };

  const showAllOperations = () => {
    saveState([]);
  };

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  const opsSubpages: OpsSubpage[] = [
    // 1. Inward Import Pipeline Options
    { id: "ops_upload", rawId: "upload", label: "Upload & Preview", category: "import", desc: "Interactive file selector and first raw-level previews list" },
    { id: "ops_correction", rawId: "correction", label: "Alignment Mapper", category: "import", desc: "AI-repaired field structure maps aligning inputs" },
    { id: "ops_summary", rawId: "summary", label: "Verification Trends", category: "import", desc: "Trend summary maps and record validation reviews" },
    { id: "ops_success", rawId: "success", label: "Processing Outcomes", category: "import", desc: "Completed absorption statistics and transaction IDs" },

    // 2. Transaction Bulk Operations
    { id: "ops_pricing", rawId: "pricing", label: "Smart Pricing Strategy", category: "bulk", desc: "Telescopic margin levels bulk updating" },
    { id: "ops_anomaly", rawId: "anomaly", label: "AI Anomaly Detection", category: "bulk", desc: "Auto-check anomalies and tax discrepancies in real-time" },
    { id: "ops_reconcile", rawId: "reconcile", label: "Smart Reconcile Engine", category: "bulk", desc: "Bulk rule matching and electronic reconciliation" },
    { id: "ops_category", rawId: "category", label: "Auto Categorize", category: "bulk", desc: "Cluster items automatically using neural logic" },
    { id: "ops_tax", rawId: "tax", label: "Bulk Tax Update", category: "bulk", desc: "Change GST tax ratings for many items at once safely" },
    { id: "ops_approval", rawId: "approval", label: "Batch Approvals Queue", category: "bulk", desc: "Approve transactions drafts batches" },
    { id: "ops_eway", rawId: "eway", label: "Batch E-Invoice", category: "bulk", desc: "Confirm Nic credentials and print batch receipts" },
    { id: "ops_archive", rawId: "archive", label: "Mass Archival", category: "bulk", desc: "Pack previous years databases into static offline vaults" },
    { id: "ops_date", rawId: "date", label: "Sequence Date Repair", category: "bulk", desc: "Repair voucher numbers sequence timeline offsets" },
    { id: "ops_group", rawId: "group", label: "Party Segment Categorizer", category: "bulk", desc: "Classify multiple parties into segments instantly" },
    { id: "ops_currency", rawId: "currency", label: "Currency Reval", category: "bulk", desc: "Verify daily foreign trade balances pricing differences" },
    { id: "ops_gstin", rawId: "gstin", label: "GSTIN Match Verifier", category: "bulk", desc: "Batch verification checklists of buyer profiles" },
    { id: "ops_inventory", rawId: "inventory", label: "Inventory Valuation Reval", category: "bulk", desc: "Adjust valuation indexes in bulk instantly" },
    { id: "ops_custom", rawId: "custom", label: "Custom Bulk Scheduler", category: "bulk", desc: "Build automated batch script schedules" },

    // 3. Home Subpages
    { id: "home_hub", rawId: "home_hub", label: "Home: Index / Hub", category: "home", desc: "Main welcome center, user greetings and configuration defaults." },
    { id: "home_info", rawId: "home_info", label: "Home: Info Statistics", category: "home", desc: "Real-time synchronization logs and high-level data analysis." },
    { id: "home_telemetry", rawId: "home_telemetry", label: "Home: Activity Log", category: "home", desc: "Workspace size metrics, audit records, and export trackers." },
    { id: "home_security", rawId: "home_security", label: "Home: Workspace Security", category: "home", desc: "Compliance standards, translation, data cleanup and protection." }
  ];

  // Grouped subpages by category
  const categories = [
    { id: "import", label: "Excel & JSON Import Pipeline", color: "text-indigo-600 dark:text-indigo-400" },
    { id: "bulk", label: "Transaction Bulk Operations", color: "text-rose-600 dark:text-rose-400" },
    { id: "home", label: "Home & Hub Subpages", color: "text-blue-600 dark:text-blue-400" }
  ];

  // Filter based on search criteria
  const activeSubpages = opsSubpages.filter(sub => {
    const matchesSearch = sub.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sub.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === "all" || sub.category === activeCategoryFilter;
    
    const isEssential = sub.id === "ops_upload" || sub.id === "home_hub";
    const isBasic = isEssential || sub.id === "ops_pricing" || sub.id === "ops_bulk_delete";
    const isCustom = false;
    
    let matchesImportance = true;
    if (activeImportanceFilter === "essential") matchesImportance = isEssential;
    else if (activeImportanceFilter === "basic") matchesImportance = isBasic;
    else if (activeImportanceFilter === "optional") matchesImportance = !isBasic;
    else if (activeImportanceFilter === "custom") matchesImportance = isCustom;
                              
    return matchesSearch && matchesCategory && matchesImportance;
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

      {/* Accordions group list */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const catSubs = activeSubpages.filter(s => s.category === cat.id);
          const isExpanded = expandedSections[cat.id];
          
          if (catSubs.length === 0) return null;

          return (
            <div key={cat.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-800 overflow-hidden shadow-2xs">
              {/* Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleSection(cat.id)}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-gray-850/50 border-b border-gray-200/60 dark:border-gray-800/60 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <Cpu className={`w-4 h-4 ${cat.color}`} />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">{t(cat.label)}</span>
                  <span className="text-[10px] font-mono font-bold bg-gray-200/60 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                    {catSubs.length}
                  </span>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catSubs.map((sub) => {
                    const isHidden = hiddenOperations.includes(sub.id);
                    const isEssential = sub.id === "ops_upload" || sub.id === "ops_pricing" || sub.id === "home_hub";
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleOpsVisibility(sub.id)}
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
                            {t(sub.label)}
                          </h5>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-tight font-semibold">
                            {t(sub.desc)}
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
                </div>
              )}
            </div>
          );
        })}

        {activeSubpages.length === 0 && (
          <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800 rounded-xl">
            <p className="text-xs text-gray-400 font-bold">{t("No operations matched your search.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
