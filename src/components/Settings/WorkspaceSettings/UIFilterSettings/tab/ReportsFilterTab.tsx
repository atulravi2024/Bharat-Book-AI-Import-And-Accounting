import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Search, Eye, EyeOff, Layout, ChevronDown, ChevronUp, FileText, Check } from "lucide-react";

interface ReportSubpage {
  id: string; // Dynamic ID, e.g. item_summary, tax_kpis, vouchers_standard, gst_generate_gst
  rawId: string; // The short tab ID inside the view
  label: string;
  category: "item" | "tax" | "voucher" | "gst" | "financial" | "dashboard";
  desc: string;
}

export const ReportsFilterTab: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [activeImportanceFilter, setActiveImportanceFilter] = useState<string>("all");
  const [hiddenReports, setHiddenReports] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    item: true,
    tax: true,
    voucher: true,
    gst: true,
    financial: true,
    dashboard: true,
  });

  const loadState = () => {
    const loaded = localStorage.getItem("bharat_book_hidden_report_tabs");
    if (loaded) {
      try {
        setHiddenReports(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    } else {
      setHiddenReports([]);
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
    setHiddenReports(updatedList);
    localStorage.setItem("bharat_book_hidden_report_tabs", JSON.stringify(updatedList));
    // Dispatch events to hot-reload rendering tabs inside those reports!
    window.dispatchEvent(new Event("bharat_book_report_tabs_trigger"));
  };

  useEffect(() => {
    const handleReset = () => saveState([]);
    const handleHideAll = () => {
      saveState(reportSubpages.map(t => t.id));
    };
    
    window.addEventListener("bharat_book_uifilter_reset", handleReset);
    window.addEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    return () => {
      window.removeEventListener("bharat_book_uifilter_reset", handleReset);
      window.removeEventListener("bharat_book_uifilter_hide_all", handleHideAll);
    };
  }, []);

  const toggleReportVisibility = (id: string) => {
    const isHidden = hiddenReports.includes(id);
    let newList: string[];
    if (isHidden) {
      newList = hiddenReports.filter(x => x !== id);
    } else {
      newList = [...hiddenReports, id];
    }
    saveState(newList);
  };

  const showAllReports = () => {
    saveState([]);
  };

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  const reportSubpages: ReportSubpage[] = [
    // 1. Item Reports
    { id: "item_summary", rawId: "summary", label: "Stock Summary", category: "item", desc: "Consolidated list of stock quantities, values, and warehouses" },
    { id: "item_analysis", rawId: "analysis", label: "Rate Analysis", desc: "Compare pricing models, sales averages, and profits margin", category: "item" },
    { id: "item_movement", rawId: "movement", label: "Stock Movement", desc: "Auditing inflows and outflows per item with timeline details", category: "item" },
    { id: "item_aging", rawId: "aging", label: "Stock Aging", desc: "Aged inventories distribution blocks to trim dead capital", category: "item" },
    { id: "item_reorder", rawId: "reorder", label: "Reorder List", desc: "Alert highlights for critical targets and replenishments", category: "item" },
    { id: "item_category", rawId: "category", label: "Category View", desc: "Product inventories categorized segmentately", category: "item" },
    { id: "item_hsn", rawId: "hsn", label: "HSN/SAC Summary", desc: "Summary and details of stock matching tax HSN tariffs", category: "item" },
    { id: "item_tax", rawId: "tax", label: "Tax Rate Wise", desc: "GST tax rating wise product distribution grids", category: "item" },
    { id: "item_brand", rawId: "brand", label: "Brand Analysis", desc: "Verify brand performance, metrics, and margins", category: "item" },
    { id: "item_location", rawId: "location", label: "Location View", desc: "Inter-godown stocks and warehouse balance reports", category: "item" },
    { id: "item_unit", rawId: "unit", label: "Unit Wise", desc: "Alternate measurements and packaging conversion logs", category: "item" },
    { id: "item_batch", rawId: "batch", label: "Batch Wise", desc: "Lot numbers and expiration schedulers tracking", category: "item" },
    { id: "item_negative", rawId: "negative", label: "Negative Stock", desc: "Highlight overdraft and discrepancies in stock quantities", category: "item" },
    { id: "item_fast_moving", rawId: "fast_moving", label: "Fast Moving", desc: "High velocity products with peak turnover schedules", category: "item" },
    { id: "item_slow_moving", rawId: "slow_moving", label: "Slow Moving", desc: "Low turnover stagnant inventories tracker", category: "item" },
    { id: "item_profitability", rawId: "profitability", label: "Item Profitability", desc: "Gross profit margins tracking per SKU variant", category: "item" },
    { id: "item_valuation", rawId: "valuation", label: "Stock Valuation", desc: "FIFO, LIFO, and Weighted average values", category: "item" },
    { id: "item_top_selling", rawId: "top_selling", label: "Top Selling", desc: "Volume rank and sales counts of top assets", category: "item" },
    { id: "item_dead_stock", rawId: "dead_stock", label: "Dead Stock", desc: "Stops-waste by tracking complete zero-demand items", category: "item" },
    { id: "item_reconciliation", rawId: "reconciliation", label: "Reconciliation", desc: "Adjustments between physical counts and system registers", category: "item" },
    { id: "item_procurement", rawId: "procurement", label: "Procurement", desc: "Inward lead-times and supplier shipment audits", category: "item" },
    { id: "item_price_list", rawId: "price_list", label: "Price List", desc: "Static and active dynamic pricing guidelines", category: "item" },
    { id: "item_lead_time", rawId: "lead_time", label: "Lead Time", desc: "Supplier delay metrics and SLA timelines", category: "item" },

    // 2. Tax Reports
    { id: "tax_kpis", rawId: "kpis", label: "Tax KPIs", desc: "Direct tax index dashboards, projections, and trends", category: "tax" },
    { id: "tax_advance-tax", rawId: "advance-tax", label: "Advance Tax", desc: "Quarterly corporate advance tax corporate calculators", category: "tax" },
    { id: "tax_tds-ledger", rawId: "tds-ledger", label: "TDS Ledger", desc: "Withholding tax deductors trace matches with form 26AS", category: "tax" },
    { id: "tax_tax-projection", rawId: "tax-projection", label: "Projections", desc: "Income tax bracket simulations and estimates", category: "tax" },
    { id: "tax_tds-tcs-calculator", rawId: "tds-tcs-calculator", label: "TDS/TCS Calc", desc: "Auto-computed rates guidelines on transactions", category: "tax" },
    { id: "tax_presumptive-tax", rawId: "presumptive-tax", label: "Presumptive Tax", desc: "Section 44AD/44ADA statutory configurations", category: "tax" },
    { id: "tax_depreciation-schedule", rawId: "depreciation-schedule", label: "Asset Depreciation", desc: "Statutory depreciation schedules under Income Tax Act", category: "tax" },
    { id: "tax_compliance-tracker", rawId: "compliance-tracker", label: "Expense Audit", desc: "Highlight non-deductible disallowance expenses", category: "tax" },
    { id: "tax_tax-loss-tracker", rawId: "tax-loss-tracker", label: "Losses Set-off", desc: "Track forward carryover loss adjustments", category: "tax" },
    { id: "tax_lut-application", rawId: "lut-application", label: "LUT Application", desc: "Zero-rated export bond forms preparation", category: "tax" },
    { id: "tax_eledger-simulator", rawId: "eledger-simulator", label: "e-Ledger Sim", desc: "Electronic credit/cash ledger interactive tests", category: "tax" },
    { id: "tax_info", rawId: "info", label: "Workspace Guide", desc: "Compliance guidelines list and legal checklists", category: "tax" },

    // 3. Voucher Register / Ledger Reports
    { id: "voucher_standard", rawId: "standard", label: "General Ledger", desc: "Comprehensive transactional ledger list with trial matches", category: "voucher" },
    { id: "voucher_purchase", rawId: "purchase", label: "Purchase Register", desc: "Listing details and entries of all purchase vouchers", category: "voucher" },
    { id: "voucher_sales", rawId: "sales", label: "Sales Register", desc: "Listing details and entries of all sales vouchers", category: "voucher" },
    { id: "voucher_payment", rawId: "payment", label: "Payment Register", desc: "Listing details and entries of all payments cash out", category: "voucher" },
    { id: "voucher_receipt", rawId: "receipt", label: "Receipt Register", desc: "Listing details and entries of all collections cash in", category: "voucher" },
    { id: "voucher_journal", rawId: "journal", label: "Journal Register", desc: "Adjustment transactions ledger", category: "voucher" },
    { id: "voucher_contra", rawId: "contra", label: "Contra Register", desc: "Bank-to-bank and cash transit logs", category: "voucher" },
    { id: "voucher_debit_note", rawId: "debit_note", label: "Debit Note", desc: "Listing of purchases returns and values adjustments", category: "voucher" },
    { id: "voucher_credit_note", rawId: "credit_note", label: "Credit Note", desc: "Listing of sales returns and value adjustments", category: "voucher" },
    { id: "voucher_inventory", rawId: "inventory", label: "Inventory Register", desc: "Listing of stock vouchers and physical counts", category: "voucher" },
    { id: "voucher_day_book", rawId: "day_book", label: "Day Book", desc: "Sequential chronological feed of daily transactions", category: "voucher" },
    { id: "voucher_audit_trail", rawId: "audit_trail", label: "Audit Trail", desc: "Chronological list of ledger alterations by users", category: "voucher" },

    // 4. GST Reports
    { id: "gst_generate_gst", rawId: "generate_gst", label: "Generate GST", desc: "Compile GSTR-1 and GSTR-2B statutory details", category: "gst" },
    { id: "gst_gst_summary", rawId: "gst_summary", label: "GST Summary", desc: "Consolidated monthly tax summary dashboard", category: "gst" },
    { id: "gst_summary", rawId: "summary", label: "GSTR1 Summary", desc: "Outward supply invoice aggregates", category: "gst" },
    { id: "gst_filing", rawId: "filing", label: "GSTR1 Filing", desc: "Prepare outward GSTR-1 submission files", category: "gst" },
    { id: "gst_invoice_detail", rawId: "invoice_detail", label: "GSTR1 Invoice", desc: "Business-to-Business (B2B) breakdown", category: "gst" },
    { id: "gst_hsn_detail", rawId: "hsn_detail", label: "GSTR1 HSN", desc: "HSN-wise outward summaries list", category: "gst" },
    { id: "gst_gstr2b_report", rawId: "gstr2b_report", label: "GSTR-2B", desc: "Auto-matched inward input tax credits (ITC)", category: "gst" },
    { id: "gst_gstr3b_report", rawId: "gstr3b_report", label: "GSTR-3B", desc: "Consolidated liabilities offset summary", category: "gst" },
    { id: "gst_gstr9_report", rawId: "gstr9_report", label: "GSTR-9", desc: "Annual consolidated tax return compiler", category: "gst" },
    { id: "gst_gstr9c_report", rawId: "gstr9c_report", label: "GSTR-9C", desc: "Annual statutory reconciliation audit", category: "gst" },
    { id: "gst_cmp08_report_tab", rawId: "cmp08_report_tab", label: "CMP-08", desc: "Filing quarterly CMP challenger", category: "gst" },
    { id: "gst_gstr4_report_tab", rawId: "gstr4_report_tab", label: "GSTR-4", desc: "Annual Composition Return form compiler", category: "gst" },
    { id: "gst_gstr4a_report_tab", rawId: "gstr4a_report_tab", label: "GSTR-4A", desc: "Inward Composition supply summary list", category: "gst" },
    { id: "gst_cmp02_report_tab", rawId: "cmp02_report_tab", label: "CMP-02", desc: "Option opt-in composed schemes forms", category: "gst" },
    { id: "gst_cmp04_report_tab", rawId: "cmp04_report_tab", label: "CMP-04", desc: "Option opt-out withdraw composition forms", category: "gst" },
    { id: "gst_composition_rules_tab", rawId: "composition_rules_tab", label: "Composition Rules", desc: "Configuration setup of scheme options", category: "gst" },
    { id: "gst_regular_rules_tab", rawId: "regular_rules_tab", label: "Regular Rules", desc: "Parameters of regular taxpayers compliance", category: "gst" },
    { id: "gst_compliance_registries_tab", rawId: "compliance_registries_tab", label: "Compliance Registries", desc: "Statutory profile updates", category: "gst" },

    // 5. Financial Reports
    { id: "report_pl", rawId: "pl", label: "Profit & Loss", desc: "Corporate Income statement of revenues and expense margins", category: "financial" },
    { id: "report_bs", rawId: "bs", label: "Balance Sheet", desc: "Capital position statement of assets, equities, and liabilities", category: "financial" },
    { id: "report_cash_flow", rawId: "cash_flow", label: "Cash Flow", desc: "Cash flow statement of inflows and outflows", category: "financial" },
    { id: "report_bank_flow", rawId: "bank_flow", label: "Bank Flow Analysis", desc: "Interactive statement analysis of banking transactions", category: "financial" },
    { id: "report_trial_balance", rawId: "trial_balance", label: "Trial Balance", desc: "Dual entry consolidated ledger balance verification sheets", category: "financial" },
    { id: "report_sales", rawId: "sales", label: "Sales Register", desc: "Chronological sales registers listing details", category: "financial" },
    { id: "report_purchase", rawId: "purchase", label: "Purchase Register", desc: "Chronological purchase registers listing details", category: "financial" },

    // 6. Dashboard Analytics
    { id: "dash_overview", rawId: "dash_overview", label: "Dashboard: Overview", desc: "High-level metric cards, volume breakdowns", category: "dashboard" },
    { id: "dash_sales", rawId: "dash_sales", label: "Dashboard: Sales Analytics", desc: "In-depth invoices trackers and top sales", category: "dashboard" },
    { id: "dash_purchase", rawId: "dash_purchase", label: "Dashboard: Purchase Analytics", desc: "Supplier registers, inventory reorder levels", category: "dashboard" },
    { id: "dash_payment", rawId: "dash_payment", label: "Dashboard: Payment Vouchers", desc: "Outbound expenses flow and bank payment audit", category: "dashboard" },
    { id: "dash_receipts", rawId: "dash_receipts", label: "Dashboard: Receipt Vouchers", desc: "Inbound receipts records and customer collection", category: "dashboard" },
    { id: "dash_bank", rawId: "dash_bank", label: "Dashboard: Bank Statement", desc: "Bank statement transaction registers", category: "dashboard" },
    { id: "dash_journal", rawId: "dash_journal", label: "Dashboard: Journal Records", desc: "General journals, adjustments, debit notes", category: "dashboard" },
    { id: "dash_contra", rawId: "dash_contra", label: "Dashboard: Contra Entries", desc: "Cash deposits, cash withdrawals", category: "dashboard" },
  ];

  // Grouped subpages by category
  const categories = [
    { id: "item", label: "Item Reports", color: "text-amber-600 dark:text-amber-400" },
    { id: "tax", label: "Tax Reports", color: "text-blue-600 dark:text-blue-400" },
    { id: "voucher", label: "Voucher & Ledger Reports", color: "text-emerald-600 dark:text-emerald-400" },
    { id: "gst", label: "GST Reports", color: "text-fuchsia-600 dark:text-fuchsia-400" },
    { id: "financial", label: "Financial Reports", color: "text-rose-600 dark:text-rose-400" },
    { id: "dashboard", label: "Dashboard Subpages", color: "text-indigo-600 dark:text-indigo-400" }
  ];

  // Filter based on search criteria
  const activeSubpages = reportSubpages.filter(sub => {
    const matchesSearch = sub.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sub.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === "all" || sub.category === activeCategoryFilter;
    
    const isEssential = sub.id === "report_pl" || sub.id === "report_bs" || sub.id === "dash_overview";
    const isBasic = isEssential || sub.id === "report_tb" || sub.id === "report_daybook";
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
                  <FileText className={`w-4 h-4 ${cat.color}`} />
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
                    const isHidden = hiddenReports.includes(sub.id);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleReportVisibility(sub.id)}
                        className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3 cursor-pointer select-none relative group overflow-hidden ${
                          isHidden
                            ? "bg-gray-50/40 dark:bg-gray-900/10 border-gray-150 dark:border-gray-850 opacity-60 hover:opacity-100"
                            : "bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-600 shadow-2xs hover:shadow-xs"
                        }`}
                      >
                        {/* Selector indicator block */}
                        <div className={`shrink-0 w-4 h-4 mt-0.5 rounded-md border flex items-center justify-center transition-all ${
                          isHidden 
                            ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-transparent" 
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
            <p className="text-xs text-gray-400 font-bold">{t("No report sub-pages matched your search.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
