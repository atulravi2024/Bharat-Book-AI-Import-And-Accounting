import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  SettingsIcon,
  CheckCircleIcon,
  ExpandMoreIcon,
  AIToolsIcon,
  InfoIcon,
} from "../icons/IconComponents";

export const AppNavigationSettings: React.FC = () => {
  const { t } = useLanguage();
  const [defaultPage, setDefaultPage] = useState("import");
  const [defaultSubPage, setDefaultSubPage] = useState("upload");
  const [routingDefaults, setRoutingDefaults] = useState<
    Record<string, string>
  >({
    dashboard: "overview",
    import: "upload",
    "bulk-operation": "decide",
    "ledger-master": "parties",
    "item-master": "items",
    bank: "bank",
    vouchers: "standard",
    "gst-report": "generate_gst",
    "item-report": "analysis",
    "voucher-entry": "sales",
    "inventory-entry": "stock_journal",
    reports: "pl",
    settings: "about",
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNav = localStorage.getItem("bharat_book_navigation_defaults");
    if (savedNav) {
      try {
        const { page, subPage, routing } = JSON.parse(savedNav);
        if (page) setDefaultPage(page);
        if (subPage) setDefaultSubPage(subPage);
        if (routing) setRoutingDefaults(routing);
      } catch (e) {
        console.error("Failed to load navigation defaults", e);
      }
    }
  }, []);

  const updateRouting = (pageId: string, subPageId: string) => {
    setRoutingDefaults((prev) => ({
      ...prev,
      [pageId]: subPageId,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "bharat_book_navigation_defaults",
      JSON.stringify({
        page: defaultPage,
        subPage: defaultSubPage,
        routing: routingDefaults,
      }),
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      window.location.reload();
    }, 1000);
  };

    const pages = [
      { id: "dashboard", label: t("Dashboard"), icon: "📊" },
      { id: "voucher-entry", label: t("Transactions"), icon: "➕" },
      { id: "inventory-entry", label: t("Inventory Trans."), icon: "📦" },
      { id: "import", label: t("Import"), icon: "📥" },
      { id: "bulk-operation", label: t("Bulk Operation"), icon: "⚡" },
      { id: "ledger-master", label: t("Ledger Master"), icon: "🏛️" },
      { id: "item-master", label: t("Item Master"), icon: "📦" },
      { id: "bank", label: t("Bank Vouchers"), icon: "🏦" },
      { id: "vouchers", label: t("Ledger Report"), icon: "📝" },
      { id: "gst-report", label: t("GST Report"), icon: "📊" },
      { id: "item-report", label: t("Item Report"), icon: "📉" },
      { id: "reports", label: t("Financial Report"), icon: "📑" },
      { id: "settings", label: t("Settings"), icon: "⚙️" },
    ];

  const subPages: Record<string, { id: string; label: string }[]> = {
    help: [
      { id: "main", label: t("Help Hub") },
    ],
    support: [
      { id: "chat", label: t("AI Diagnostic Chat") },
      { id: "diagnostics", label: t("Systems Integrity Suite") },
      { id: "tickets", label: t("Submit & Track Tickets") },
    ],
    dashboard: [
      { id: "overview", label: t("Overview") },
      { id: "sales", label: t("Sales") },
      { id: "purchase", label: t("Purchase") },
      { id: "payment", label: t("Payment") },
      { id: "receipts", label: t("Receipt") },
      { id: "bank", label: t("Bank Report") },
      { id: "journal", label: t("Journal") },
      { id: "contra", label: t("Contra") },
    ],
    "voucher-entry": [
      { id: "sales", label: t("Sales Entry") },
      { id: "purchase", label: t("Purchase Entry") },
      { id: "payment", label: t("Payment Entry") },
      { id: "receipt", label: t("Receipt Entry") },
      { id: "journal", label: t("Journal Entry") },
      { id: "contra", label: t("Contra Entry") },
      { id: "debit_note", label: t("Debit Note") },
      { id: "credit_note", label: t("Credit Note") },
    ],
    "inventory-entry": [
      { id: "stock_journal", label: t("Stock Journal") },
      { id: "physical_stock", label: t("Physical Stock") },
      { id: "consumption", label: t("Item Consumption") },
      { id: "scrap", label: t("Item Scrap") },
      { id: "transfer", label: t("Inter-Location") },
      { id: "rejections_in", label: t("Rejections In") },
      { id: "rejections_out", label: t("Rejections Out") },
    ],
    import: [
      { id: "upload", label: t("Upload") },
      { id: "correction", label: t("Correction") },
      { id: "summary", label: t("Summary") },
      { id: "success", label: t("Success") },
    ],
    "bulk-operation": [{ id: "decide", label: t("Bulk Action") }],
    "ledger-master": [
      { id: "parties", label: t("Customers") },
      { id: "vendors", label: t("Vendors") },
      { id: "ledgers", label: t("General Ledgers") },
      { id: "banks", label: t("Bank Masters") },
      { id: "contacts", label: t("Contacts") },
      { id: "accountGroups", label: t("Groups") },
      { id: "locations", label: t("Locations") },
      { id: "costCenters", label: t("Cost Centers") },
    ],
    "item-master": [
      { id: "items", label: t("Items") },
      { id: "bom", label: t("Bill of Materials") },
      { id: "warehouses", label: t("Warehouses") },
      { id: "uoms", label: t("UOMs") },
      { id: "stockGroups", label: t("Stock Groups") },
      { id: "gst", label: t("HSN") },
      { id: "brands", label: t("Brands") },
      { id: "categories", label: t("Categories") },
      { id: "assertionCategories", label: t("Assertion Categories") },
      { id: "assertionCodes", label: t("Assertion Codes") },
      { id: "colors", label: t("Colors") },
      { id: "sizes", label: t("Sizes") },
      { id: "variants", label: t("Variants") },
      { id: "dimensions", label: t("Dimensions") },
      { id: "skus", label: t("SKUs") },
      { id: "priceList", label: t("Price List") },
      { id: "weights", label: t("Weights") },
      { id: "volumes", label: t("Volumes") },
      { id: "grades", label: t("Grades") },
    ],
    bank: [
      { id: "bank", label: t("Bank") },
      { id: "classify", label: t("To Classify") },
      { id: "reconcile", label: t("Reconcile") },
      { id: "auto-matched", label: t("Matched") },
      { id: "missing-masters", label: t("Exceptions") },
      { id: "unidentify", label: t("Unidentified") },
    ],
    vouchers: [
      { id: "standard", label: t("General Ledger") },
      { id: "purchase", label: t("Purchase Register") },
      { id: "sales", label: t("Sales Register") },
      { id: "payment", label: t("Payment Register") },
      { id: "receipt", label: t("Receipt Register") },
      { id: "journal", label: t("Journal Register") },
      { id: "contra", label: t("Contra Register") },
      { id: "debit_note", label: t("Debit Note") },
      { id: "credit_note", label: t("Credit Note") },
      { id: "day_book", label: t("Day Book") },
      { id: "audit_trail", label: t("Audit Trail") },
    ],
    "gst-report": [
      { id: "generate_gst", label: t("Generate GST") },
      { id: "summary", label: t("Summary") },
      { id: "filing", label: t("Filing") },
      { id: "invoice_detail", label: t("Invoice Detail") },
      { id: "hsn_detail", label: t("HSN Detail") },
      { id: "gstr2b_report", label: t("GSTR-2B") },
      { id: "gstr3b_report", label: t("GSTR-3B") },
      { id: "gstr9_report", label: t("GSTR-9") },
      { id: "gstr9c_report", label: t("GSTR-9C") },
      { id: "others_report", label: t("Others") },
    ],
    "item-report": [
      { id: "summary", label: t("Stock Summary") },
      { id: "analysis", label: t("Rate Analysis") },
      { id: "movement", label: t("Stock Movement") },
      { id: "aging", label: t("Stock Aging") },
      { id: "reorder", label: t("Reorder List") },
      { id: "category", label: t("Category View") },
      { id: "hsn", label: t("HSN/SAC Summary") },
      { id: "tax", label: t("Tax Rate Wise") },
      { id: "brand", label: t("Brand Analysis") },
      { id: "location", label: t("Location View") },
      { id: "unit", label: t("Unit Wise") },
      { id: "batch", label: t("Batch Wise") },
      { id: "negative", label: t("Negative Stock") },
      { id: "fast_moving", label: t("Fast Moving") },
      { id: "slow_moving", label: t("Slow Moving") },
      { id: "profitability", label: t("Item Profitability") },
      { id: "valuation", label: t("Stock Valuation") },
      { id: "top_selling", label: t("Top Selling") },
      { id: "dead_stock", label: t("Dead Stock") },
      { id: "reconciliation", label: t("Reconciliation") },
      { id: "procurement", label: t("Procurement") },
      { id: "price_list", label: t("Price List") },
      { id: "lead_time", label: t("Lead Time") },
    ],
    reports: [
      { id: "pl", label: t("Profit & Loss") },
      { id: "bs", label: t("Balance Sheet") },
      { id: "cash_flow", label: t("Cash Flow") },
      { id: "bank_flow", label: t("Bank Flow") },
      { id: "trial_balance", label: t("Trial Balance") },
      { id: "sales", label: t("Sales Register") },
      { id: "purchase", label: t("Purchase Register") },
    ],
    settings: [
      { id: "firm", label: t("Firm") },
      { id: "general", label: t("General") },
      { id: "navigation", label: t("App Defaults") },
      { id: "invoiceprint", label: t("Invoice & Print") },
      { id: "formdetails", label: t("Form Detail") },
      { id: "vouchernumbering", label: t("Voucher Numbering") },
      { id: "users", label: t("Users") },
      { id: "alerts", label: t("Alerts") },
      { id: "security", label: t("Security") },
      { id: "privacy", label: t("Privacy") },
      { id: "imports", label: t("Import Rules") },
      { id: "mapping", label: t("Mapping") },
      { id: "ai", label: t("AI Engines") },
      { id: "admin", label: t("Admin") },
      { id: "data", label: t("Data Explorer") },
      { id: "help", label: t("Help Center") },
      { id: "support", label: t("Support") },
      { id: "about", label: t("About") },
    ],
  };

  const handleReset = () => {
    const defaults = {
      page: "dashboard",
      subPage: "main",
      routing: {
        dashboard: "main",
        import: "upload",
        "bulk-operation": "decide",
        "ledger-master": "parties",
        "item-master": "items",
        bank: "bank",
        vouchers: "standard",
        "gst-report": "generate_gst",
        "item-report": "analysis",
        "voucher-entry": "sales",
        "inventory-entry": "stock_journal",
        reports: "pl",
        settings: "about",
      },
    };
    setDefaultPage(defaults.page);
    setDefaultSubPage(defaults.subPage);
    setRoutingDefaults(defaults.routing);
    localStorage.setItem(
      "bharat_book_navigation_defaults",
      JSON.stringify(defaults),
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Minimal Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 mb-2 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight leading-tight dark:text-white">
              {t("Navigation Architecture")}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {t("App Entry & Routing Intelligence")}
            </p>
          </div>
        </div>

          <div className="flex items-center gap-2.5 p-1 bg-white border border-gray-100 rounded-[1.25rem] shadow-sm dark:bg-gray-800 dark:border-gray-800">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest dark:hover:bg-gray-700"
            >
              {t("Reset Defaults")}
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-wider ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95"}`}
            >
              {isSaved ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  {t("Updated")}
                </>
              ) : (
                t("Save Configuration")
              )}
            </button>
          </div>
        </div>

        {/* Section 1: Application Entry Defaults */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group dark:bg-gray-800 dark:border-gray-800">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] grayscale pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <SettingsIcon className="w-48 h-48" />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight dark:text-white">
                {t("Startup Priority")}
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                {t("Global Entry Point")}
              </p>
            </div>
          </div>

          <div className="form-grid gap-12 relative z-10">
            {/* Default Page Dropdown */}
            <div className="flex flex-col gap-4">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2 dark:text-gray-400">
                <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                {t("Main Landing Category")}
              </label>
            <div className="relative">
              <select
                value={defaultPage}
                onChange={(e) => {
                  const val = e.target.value;
                  setDefaultPage(val);
                  if (subPages[val]) setDefaultSubPage(subPages[val][0].id);
                }}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-lg font-black text-gray-900 appearance-none cursor-pointer focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 outline-none transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
              >
                {pages.map((p) => (
                  <option key={p.id} value={p.id} className="font-bold py-2">
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ExpandMoreIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex gap-2 px-2">
              {pages.map((p) => (
                <div
                  key={p.id}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${defaultPage === p.id ? "bg-blue-600 w-6" : "bg-gray-200"} dark:bg-gray-700`}
                ></div>
              ))}
            </div>
          </div>

          {/* Default Subpage Dropdown */}
          <div className="flex flex-col gap-4">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2 dark:text-gray-400">
              <div className="w-1 h-3 bg-blue-400 rounded-full"></div>
              {t("Target Sub-Section")}
            </label>
            <div className="relative">
              <select
                value={defaultSubPage}
                onChange={(e) => setDefaultSubPage(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-lg font-black text-gray-900 appearance-none cursor-pointer focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 outline-none transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
              >
                {subPages[defaultPage]?.map((sp) => (
                  <option key={sp.id} value={sp.id} className="font-bold py-2">
                    {sp.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ExpandMoreIcon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2 text-right">
              {t("Immediate access to:")}{" "}
              {
                subPages[defaultPage]?.find((sp) => sp.id === defaultSubPage)
                  ?.label
              }
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Contextual View Routing */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group dark:bg-gray-800 dark:border-gray-800">
        <div className="absolute top-0 left-0 p-8 opacity-[0.03] grayscale pointer-events-none group-hover:scale-110 transition-transform duration-700 -scale-x-100">
          <AIToolsIcon className="w-48 h-48" />
        </div>

        <div className="flex items-center gap-4 mb-12 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
            <AIToolsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight dark:text-white">
              {t("Sidebar Routing Intelligence")}
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {t("Automated Contextual Navigation")}
            </p>
          </div>
        </div>

        <div className="form-grid gap-6 relative z-10">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:border-blue-200 transition-all group/card shadow-sm hover:shadow-xl hover:shadow-blue-50 relative overflow-hidden dark:bg-gray-800 dark:border-gray-800"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl border border-gray-100 group-hover/card:scale-110 transition-transform shadow-sm text-xl italic font-serif dark:border-gray-800">
                    {page.icon}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">
                      {page.id}
                    </h3>
                    <h4 className="text-sm font-black text-gray-900 tracking-tight dark:text-white">
                      {page.label}
                    </h4>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>

              <div className="space-y-3 relative z-10">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  {t("Default Route")}
                </label>
                <div className="relative">
                  <select
                    value={routingDefaults[page.id] || ""}
                    onChange={(e) => updateRouting(page.id, e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-xs font-black text-gray-800 appearance-none cursor-pointer focus:bg-white focus:border-blue-400 outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:border-blue-500"
                  >
                    {subPages[page.id]?.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover/card:text-blue-500 transition-colors">
                    <ExpandMoreIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-12 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex gap-6 items-center relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-blue-100/50 flex items-center justify-center text-blue-600 border border-blue-200 shrink-0">
            <InfoIcon className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-[0.15em] mb-2 dark:text-blue-200">
              {t("Architectural Integrity")}
            </h4>
            <p className="text-xs text-blue-700/60 font-medium leading-[1.8] max-w-2xl italic dark:text-blue-300">
              {t('"These routing rules persist across user sessions, ensuring your workflow remains uninterrupted by creating dedicated direct-access pathways to your most critical data silos."')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
