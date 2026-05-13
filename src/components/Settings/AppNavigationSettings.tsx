import React, { useState, useEffect } from "react";
import {
  SettingsIcon,
  CheckCircleIcon,
  ExpandMoreIcon,
  AIToolsIcon,
  InfoIcon,
} from "../icons/IconComponents";

export const AppNavigationSettings: React.FC = () => {
  const [defaultPage, setDefaultPage] = useState("import");
  const [defaultSubPage, setDefaultSubPage] = useState("upload");
  const [routingDefaults, setRoutingDefaults] = useState<
    Record<string, string>
  >({
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
    settings: "firm",
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
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "voucher-entry", label: "Transactions", icon: "➕" },
    { id: "inventory-entry", label: "Inventory Trans.", icon: "📦" },
    { id: "import", label: "Import", icon: "📥" },
    { id: "bulk-operation", label: "Bulk Operation", icon: "⚡" },
    { id: "ledger-master", label: "Ledger Master", icon: "🏛️" },
    { id: "item-master", label: "Item Master", icon: "📦" },
    { id: "bank", label: "Bank Vouchers", icon: "🏦" },
    { id: "vouchers", label: "Ledger Report", icon: "📝" },
    { id: "gst-report", label: "GST Report", icon: "📊" },
    { id: "item-report", label: "Item Report", icon: "📉" },
    { id: "reports", label: "Financial Report", icon: "📑" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const subPages: Record<string, { id: string; label: string }[]> = {
    dashboard: [
      { id: "main", label: "Overview" },
      { id: "sales", label: "Sales" },
      { id: "purchase", label: "Purchase" },
      { id: "payment", label: "Payment" },
      { id: "receipts", label: "Receipt" },
      { id: "bank", label: "Bank Report" },
      { id: "journal", label: "Journal" },
      { id: "contra", label: "Contra" },
    ],
    "voucher-entry": [
      { id: "sales", label: "Sales Entry" },
      { id: "purchase", label: "Purchase Entry" },
      { id: "payment", label: "Payment Entry" },
      { id: "receipt", label: "Receipt Entry" },
      { id: "journal", label: "Journal Entry" },
      { id: "contra", label: "Contra Entry" },
      { id: "debit_note", label: "Debit Note" },
      { id: "credit_note", label: "Credit Note" },
    ],
    "inventory-entry": [
      { id: "stock_journal", label: "Stock Journal" },
      { id: "physical_stock", label: "Physical Stock" },
      { id: "consumption", label: "Item Consumption" },
      { id: "scrap", label: "Item Scrap" },
      { id: "transfer", label: "Inter-Location" },
      { id: "rejections_in", label: "Rejections In" },
      { id: "rejections_out", label: "Rejections Out" },
    ],
    import: [
      { id: "upload", label: "Upload" },
      { id: "correction", label: "Correction" },
      { id: "summary", label: "Summary" },
      { id: "success", label: "Success" },
    ],
    "bulk-operation": [{ id: "decide", label: "Bulk Action" }],
    "ledger-master": [
      { id: "parties", label: "Customers" },
      { id: "vendors", label: "Vendors" },
      { id: "ledgers", label: "General Ledgers" },
      { id: "banks", label: "Bank Masters" },
      { id: "contacts", label: "Contacts" },
      { id: "accountGroups", label: "Groups" },
      { id: "locations", label: "Locations" },
      { id: "costCenters", label: "Cost Centers" },
    ],
    "item-master": [
      { id: "items", label: "Items" },
      { id: "warehouse", label: "Warehouses" },
      { id: "uoms", label: "UOMs" },
      { id: "stockGroup", label: "Stock Groups" },
      { id: "gst", label: "HSN" },
      { id: "brands", label: "Brands" },
      { id: "categories", label: "Categories" },
      { id: "color", label: "Colors" },
      { id: "size", label: "Sizes" },
      { id: "variant", label: "Variants" },
      { id: "dimension", label: "Dimensions" },
      { id: "sku", label: "SKUs" },
      { id: "priceList", label: "Price List" },
      { id: "weight", label: "Weights" },
      { id: "volume", label: "Volumes" },
      { id: "grades", label: "Grades" },
    ],
    bank: [
      { id: "bank", label: "Bank" },
      { id: "classify", label: "To Classify" },
      { id: "reconcile", label: "Reconcile" },
      { id: "auto-matched", label: "Matched" },
      { id: "missing-masters", label: "Exceptions" },
      { id: "unidentify", label: "Unidentified" },
    ],
    vouchers: [
      { id: "standard", label: "General Ledger" },
      { id: "purchase", label: "Purchase Register" },
      { id: "sales", label: "Sales Register" },
      { id: "payment", label: "Payment Register" },
      { id: "receipt", label: "Receipt Register" },
      { id: "journal", label: "Journal Register" },
      { id: "contra", label: "Contra Register" },
      { id: "debit_note", label: "Debit Note" },
      { id: "credit_note", label: "Credit Note" },
      { id: "day_book", label: "Day Book" },
      { id: "audit_trail", label: "Audit Trail" },
    ],
    "gst-report": [
      { id: "generate_gst", label: "Generate GST" },
      { id: "summary", label: "Summary" },
      { id: "filing", label: "Filing" },
      { id: "invoice_detail", label: "Invoice Detail" },
      { id: "hsn_detail", label: "HSN Detail" },
      { id: "gstr2b_report", label: "GSTR-2B" },
      { id: "gstr3b_report", label: "GSTR-3B" },
      { id: "gstr9_report", label: "GSTR-9" },
      { id: "gstr9c_report", label: "GSTR-9C" },
      { id: "others_report", label: "Others" },
    ],
    "item-report": [
      { id: "summary", label: "Stock Summary" },
      { id: "analysis", label: "Rate Analysis" },
      { id: "movement", label: "Stock Movement" },
      { id: "aging", label: "Stock Aging" },
      { id: "reorder", label: "Reorder List" },
      { id: "category", label: "Category View" },
      { id: "hsn", label: "HSN/SAC Summary" },
      { id: "tax", label: "Tax Rate Wise" },
      { id: "brand", label: "Brand Analysis" },
      { id: "location", label: "Location View" },
      { id: "unit", label: "Unit Wise" },
      { id: "batch", label: "Batch Wise" },
      { id: "negative", label: "Negative Stock" },
      { id: "fast_moving", label: "Fast Moving" },
      { id: "slow_moving", label: "Slow Moving" },
      { id: "profitability", label: "Item Profitability" },
      { id: "valuation", label: "Stock Valuation" },
      { id: "top_selling", label: "Top Selling" },
      { id: "dead_stock", label: "Dead Stock" },
      { id: "reconciliation", label: "Reconciliation" },
      { id: "procurement", label: "Procurement" },
      { id: "price_list", label: "Price List" },
      { id: "lead_time", label: "Lead Time" },
    ],
    reports: [
      { id: "pl", label: "Profit & Loss" },
      { id: "bs", label: "Balance Sheet" },
      { id: "cash_flow", label: "Cash Flow" },
      { id: "bank_flow", label: "Bank Flow" },
      { id: "trial_balance", label: "Trial Balance" },
      { id: "sales", label: "Sales Register" },
      { id: "purchase", label: "Purchase Register" },
    ],
    settings: [
      { id: "firm", label: "Firm" },
      { id: "general", label: "General" },
      { id: "navigation", label: "App Defaults" },
      { id: "invoiceprint", label: "Invoice & Print" },
      { id: "formdetails", label: "Form Detail" },
      { id: "vouchernumbering", label: "Voucher Numbering" },
      { id: "users", label: "Users" },
      { id: "alerts", label: "Alerts" },
      { id: "security", label: "Security" },
      { id: "privacy", label: "Privacy" },
      { id: "imports", label: "Import Rules" },
      { id: "mapping", label: "Mapping" },
      { id: "ai", label: "AI Engines" },
      { id: "sample", label: "Sample" },
      { id: "admin", label: "Admin" },
      { id: "data", label: "Data Explorer" },
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
        settings: "firm",
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
              Navigation Architecture
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              App Entry & Routing Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-1 bg-white border border-gray-100 rounded-[1.25rem] shadow-sm dark:bg-gray-800 dark:border-gray-800">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest dark:hover:bg-gray-700"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-wider ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95"}`}
          >
            {isSaved ? (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Updated
              </>
            ) : (
              "Save Configuration"
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
              Startup Priority
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Global Entry Point
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Default Page Dropdown */}
          <div className="flex flex-col gap-4">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2 dark:text-gray-400">
              <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
              Main Landing Category
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
              Target Sub-Section
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
              Immediate access to:{" "}
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
              Sidebar Routing Intelligence
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Automated Contextual Navigation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
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
                  Default Route
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
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-[0.15em] mb-2">
              Architectural Integrity
            </h4>
            <p className="text-xs text-blue-700/60 font-medium leading-[1.8] max-w-2xl italic">
              "These routing rules persist across user sessions, ensuring your
              workflow remains uninterrupted by creating dedicated direct-access
              pathways to your most critical data silos."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
