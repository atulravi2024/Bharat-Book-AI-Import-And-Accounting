import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Search, Eye, ChevronDown, ChevronUp, Database, Check } from "lucide-react";

interface MasterSubpage {
  id: string; // e.g. ledger_contacts, item_items
  rawId: string; // raw ID e.g. contacts, items
  label: string;
  category: "ledger" | "item";
  desc: string;
}

export const MastersFilterTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [activeImportanceFilter, setActiveImportanceFilter] = useState<string>("all");
  const [hiddenMasters, setHiddenMasters] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ledger: true,
    item: true,
  });

  const loadState = () => {
    const loaded = localStorage.getItem("bharat_book_hidden_masters_tabs");
    if (loaded) {
      try {
        setHiddenMasters(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    } else {
      setHiddenMasters([]);
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
    setHiddenMasters(updatedList);
    localStorage.setItem("bharat_book_hidden_masters_tabs", JSON.stringify(updatedList));
    // Dispatch event to hot-reload rendering tabs inside those masters!
    window.dispatchEvent(new Event("bharat_book_masters_tabs_trigger"));
  };

  useEffect(() => {
    const handleReset = () => saveState([]);
    const handleHideAll = () => {
      // Keep essential safeties
      const nonEssential = mastersSubpages
        .map(t => t.id)
        .filter(id => id !== "ledger_contacts" && id !== "item_items");
      saveState(nonEssential);
    };
    
    window.addEventListener("bharat_book_uifilter_reset", handleReset);
    window.addEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    return () => {
      window.removeEventListener("bharat_book_uifilter_reset", handleReset);
      window.removeEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    };
  }, []);

  const toggleMasterVisibility = (id: string) => {
    // Keep contacts and items as essential safeguarding
    if (id === "ledger_contacts" || id === "item_items") return;

    const isHidden = hiddenMasters.includes(id);
    let newList: string[];
    if (isHidden) {
      newList = hiddenMasters.filter(x => x !== id);
    } else {
      newList = [...hiddenMasters, id];
    }
    saveState(newList);
  };

  const showAllMasters = () => {
    saveState([]);
  };

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  const mastersSubpages: MasterSubpage[] = [
    // 1. Ledger Master Subpages
    { id: "ledger_contacts", rawId: "contacts", label: "Contacts & Parties", category: "ledger", desc: "Party profiles, active accounts, and contact directory" },
    { id: "ledger_ledgers", rawId: "ledgers", label: "General Ledgers", category: "ledger", desc: "Chart of Accounts configurations and ledger masters" },
    { id: "ledger_banks", rawId: "banks", label: "Bank Masters", category: "ledger", desc: "Bank accounts settings and routing codes" },
    { id: "ledger_accountGroups", rawId: "accountGroups", label: "Account Groups", category: "ledger", desc: "Parent groups taxonomy classification" },
    { id: "ledger_locations", rawId: "locations", label: "Locations master", category: "ledger", desc: "Business branches and PIN code locations register" },
    { id: "ledger_costCenters", rawId: "costCenters", label: "Cost Centers", category: "ledger", desc: "Cost tracking centers and budget units" },

    // 2. Item Master Subpages
    { id: "item_items", rawId: "items", label: "Item Hub", category: "item", desc: "Comprehensive product master details" },
    { id: "item_basic_items", rawId: "basic_items", label: "Basic Item Info", category: "item", desc: "Simplified item registration panels" },
    { id: "item_bom", rawId: "bom", label: "Bill of Materials", category: "item", desc: "Manufacturing ingredients lists and assembly specs" },
    { id: "item_warehouses", rawId: "item_warehouses", label: "Warehouses / Godowns", category: "item", desc: "Inventory store rooms and material locations" },
    { id: "item_uoms", rawId: "uoms", label: "Units of Measure (UOM)", category: "item", desc: "Conversion rates and alternate multipliers" },
    { id: "item_stockGroups", rawId: "stockGroups", label: "Stock Groups", category: "item", desc: "Product classification groupings" },
    { id: "item_gst", rawId: "gst", label: "HSN / SAC Tariffs", category: "item", desc: "Tax tariff and HSN master rates matching" },
    { id: "item_brands", rawId: "brands", label: "Brands Master", category: "item", desc: "Aesthetic branding groups registration" },
    { id: "item_categories", rawId: "categories", label: "Category Tree", category: "item", desc: "Category classifications for items" },
    { id: "item_assertionCategories", rawId: "assertionCategories", label: "Assertion Categories", category: "item", desc: "Compliance and auditing category definitions" },
    { id: "item_assertionCodes", rawId: "assertionCodes", label: "Assertion Codes", category: "item", desc: "Tax regulatory assertions tracker" },
    { id: "item_colors", rawId: "colors", label: "Colors Variant", category: "item", desc: "Aesthetic color variant master list" },
    { id: "item_sizes", rawId: "sizes", label: "Sizes Variant", category: "item", desc: "Packaging size dimensions checklist" },
    { id: "item_variants", rawId: "variants", label: "Item Variants Matrix", category: "item", desc: "Item combined variants catalog" },
    { id: "item_dimensions", rawId: "dimensions", label: "Physical Dimensions", category: "item", desc: "Item size physical dimensions scales" },
    { id: "item_skus", rawId: "skus", label: "SKU configuration", category: "item", desc: "Universal Stock Keeping Units trackers" },
    { id: "item_priceList", rawId: "priceList", label: "Customer Price Lists", category: "item", desc: "Telescopic pricing rules matrix" },
    { id: "item_weights", rawId: "weights", label: "Gross/Net Weights", category: "item", desc: "Physical weight measurements setup" },
    { id: "item_volumes", rawId: "volumes", label: "Item Volumetric metrics", category: "item", desc: "Volume measurements metrics specification" },
    { id: "item_grades", rawId: "grades", label: "Quality Grades", category: "item", desc: "Grading indexes for physical stock items" }
  ];

  // Grouped subpages by category
  const categories = [
    { id: "ledger", label: "Ledger Masters", color: "text-emerald-600 dark:text-emerald-400" },
    { id: "item", label: "Item Masters", color: "text-amber-600 dark:text-amber-400" }
  ];

  // Filter based on search criteria
  const activeSubpages = mastersSubpages.filter(sub => {
    const matchesSearch = sub.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sub.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === "all" || sub.category === activeCategoryFilter;
    
    const isEssential = sub.id === "ledger_contacts" || sub.id === "item_items";
    const isBasic = isEssential || sub.id === "ledger_accounts" || sub.id === "item_groups";
    const isCustom = false; // Placeholder for custom features
    
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
                  <Database className={`w-4 h-4 ${cat.color}`} />
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
                    const isHidden = hiddenMasters.includes(sub.id);
                    const isEssential = sub.id === "ledger_contacts" || sub.id === "item_items";
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleMasterVisibility(sub.id)}
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
            <p className="text-xs text-gray-400 font-bold">{t("No master sub-pages matched your search.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
