import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Search, Eye, ChevronDown, ChevronUp, FileCode, Check } from "lucide-react";

interface TransSubpage {
  id: string; // e.g. trans_sales, trans_stock_journal, trans_bank_reconcile
  rawId: string; // raw ID e.g. sales, stock_journal, reconcile
  label: string;
  category: "voucher" | "inventory" | "bank";
  desc: string;
}

export const TransactionsFilterTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [activeImportanceFilter, setActiveImportanceFilter] = useState<string>("all");
  const [hiddenTransactions, setHiddenTransactions] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    voucher: true,
    inventory: true,
    bank: true,
  });

  const loadState = () => {
    const loaded = localStorage.getItem("bharat_book_hidden_transactions_tabs");
    if (loaded) {
      try {
        setHiddenTransactions(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    } else {
      setHiddenTransactions([]);
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
    setHiddenTransactions(updatedList);
    localStorage.setItem("bharat_book_hidden_transactions_tabs", JSON.stringify(updatedList));
    // Dispatch event to hot-reload rendering tabs inside those views!
    window.dispatchEvent(new Event("bharat_book_transactions_tabs_trigger"));
  };

  useEffect(() => {
    const handleReset = () => saveState([]);
    const handleHideAll = () => {
      // Keep essential safeguarding
      const nonEssential = transSubpages
        .map(t => t.id)
        .filter(id => id !== "trans_sales" && id !== "trans_bank_bank");
      saveState(nonEssential);
    };
    
    window.addEventListener("bharat_book_uifilter_reset", handleReset);
    window.addEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    return () => {
      window.removeEventListener("bharat_book_uifilter_reset", handleReset);
      window.removeEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    };
  }, []);

  const toggleTransVisibility = (id: string) => {
    // Keep sales and bank as essential safeties
    if (id === "trans_sales" || id === "trans_bank_bank") return;

    const isHidden = hiddenTransactions.includes(id);
    let newList: string[];
    if (isHidden) {
      newList = hiddenTransactions.filter(x => x !== id);
    } else {
      newList = [...hiddenTransactions, id];
    }
    saveState(newList);
  };

  const showAllTransactions = () => {
    saveState([]);
  };

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  const transSubpages: TransSubpage[] = [
    // 1. Voucher Entry
    { id: "trans_sales", rawId: "sales", label: "Sales Entry", category: "voucher", desc: "Sales invoicing and billing transaction creation" },
    { id: "trans_purchase", rawId: "purchase", label: "Purchase Entry", category: "voucher", desc: "Inward supply purchase registers creation" },
    { id: "trans_payment", rawId: "payment", label: "Payment Entry", category: "voucher", desc: "Cash or Bank disbursements voucher" },
    { id: "trans_receipt", rawId: "receipt", label: "Receipt Entry", category: "voucher", desc: "Inward collection of receivables voucher" },
    { id: "trans_journal", rawId: "journal", label: "Journal Entry", category: "voucher", desc: "Statutory adjustments and ledger balancing entries" },
    { id: "trans_contra", rawId: "contra", label: "Contra Entry", category: "voucher", desc: "Bank-to-bank deposits and cash transit entries" },
    { id: "trans_debit_note", rawId: "debit_note", label: "Debit Note", category: "voucher", desc: "Purchase returns or pricing depreciation note" },
    { id: "trans_credit_note", rawId: "credit_note", label: "Credit Note", category: "voucher", desc: "Sales returns or pricing appreciation note" },

    // 2. Inventory Entry
    { id: "trans_stock_journal", rawId: "stock_journal", label: "Stock Journal", category: "inventory", desc: "Inter-location raw materials adjustment entries" },
    { id: "trans_physical_stock", rawId: "physical_stock", label: "Physical Stock", category: "inventory", desc: "Adjustments between physical stock counts and records" },
    { id: "trans_consumption", rawId: "consumption", label: "Item Consumption", category: "inventory", desc: "Record raw components consumed in assembly or projects" },
    { id: "trans_scrap", rawId: "scrap", label: "Item Scrap", category: "inventory", desc: "Record damaged scrap ingredients and waste value drops" },
    { id: "trans_transfer", rawId: "transfer", label: "Inter-Location", category: "inventory", desc: "Log tracking for stock items in transit across warehouses" },
    { id: "trans_rejections_in", rawId: "rejections_in", label: "Rejections In", category: "inventory", desc: "Customer material returns pending physical audits" },
    { id: "trans_rejections_out", rawId: "rejections_out", label: "Rejections Out", category: "inventory", desc: "Supplier material reject returns dispatched out" },

    // 3. Bank Log Ingestions
    { id: "trans_bank_bank", rawId: "bank", label: "Bank Stat. Ingest", category: "bank", desc: "Import bank statement CSV logs" },
    { id: "trans_bank_classify", rawId: "classify", label: "To Classify", category: "bank", desc: "Awaiting ledger categorization transaction queue" },
    { id: "trans_bank_reconcile", rawId: "reconcile", label: "Reconcile Board", desc: "Manual reconcile statement matching screens", category: "bank" },
    { id: "trans_bank_auto-matched", rawId: "auto-matched", label: "Matched Logs", desc: "Review automated matching system outputs", category: "bank" },
    { id: "trans_bank_missing-masters", rawId: "missing-masters", label: "Exceptions Register", desc: "Lists unresolved gaps from non-existent ledgers", category: "bank" },
    { id: "trans_bank_unidentify", rawId: "unidentify", label: "Suspense Trace Log", desc: "Trace logs of unidentified suspense transaction entries", category: "bank" }
  ];

  // Grouped subpages by category
  const categories = [
    { id: "voucher", label: "Voucher Entry", color: "text-blue-600 dark:text-blue-400" },
    { id: "inventory", label: "Inventory Entry", color: "text-amber-600 dark:text-amber-400" },
    { id: "bank", label: "Bank Reconciliation", color: "text-emerald-600 dark:text-emerald-400" }
  ];

  // Filter based on search criteria
  const activeSubpages = transSubpages.filter(sub => {
    const matchesSearch = sub.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sub.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === "all" || sub.category === activeCategoryFilter;
    
    const isEssential = sub.id === "trans_sales" || sub.id === "trans_bank_bank";
    const isBasic = isEssential || sub.id === "trans_purchase" || sub.id === "trans_receipts";
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
                  <FileCode className={`w-4 h-4 ${cat.color}`} />
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
                    const isHidden = hiddenTransactions.includes(sub.id);
                    const isEssential = sub.id === "trans_sales" || sub.id === "trans_bank_bank";
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleTransVisibility(sub.id)}
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
            <p className="text-xs text-gray-400 font-bold">{t("No trans-actions matched your search.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
