import React, { useState, useEffect } from "react";
import { useLanguage } from '../../context/LanguageContext';
import {
  SettingsIcon,
  CheckCircleIcon,
  ExpandMoreIcon,
  AIToolsIcon,
  InfoIcon,
  UndoIcon,
  SaveIcon,
} from "../icons/IconComponents";

export const AppNavigationSettings: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"priority" | "routing">("priority");
  const [defaultPage, setDefaultPage] = useState("import");
  const [defaultSubPage, setDefaultSubPage] = useState("upload");
  const [defaultSubSubPage, setDefaultSubSubPage] = useState("");
  const [routingDefaults, setRoutingDefaults] = useState<
    Record<string, string>
  >({
    dashboard: "overview",
    import: "upload",
    "bulk-operation": "pricing",
    "ledger-master": "parties",
    "item-master": "items",
    bank: "bank",
    vouchers: "standard",
    "gst-report": "generate_gst",
    "tax-report": "kpis",
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
        const { page, subPage, subSubPage, routing } = JSON.parse(savedNav);
        if (page) setDefaultPage(page);
        if (subPage) setDefaultSubPage(subPage);
        if (subSubPage) setDefaultSubSubPage(subSubPage);
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
        subSubPage: defaultSubSubPage,
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
      { id: "tax-report", label: t("Tax Report"), icon: "🏛️" },
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
    "bulk-operation": [
      { id: 'pricing', label: t('Smart Pricing Strategy') },
      { id: 'anomaly-detection', label: t('AI Anomaly Detection') },
      { id: 'auto-reconcile', label: t('Smart Reconcile') },
      { id: 'smart-category', label: t('Auto Categorize') },
      { id: 'tax-updater', label: t('Bulk Tax Update') },
      { id: 'batch-approval', label: t('Batch Approvals') },
      { id: 'eway-batch', label: t('Batch E-Invoice') },
      { id: 'mass-archive', label: t('Mass Archival') },
      { id: 'date-repair', label: t('Date Repair') },
      { id: 'contact-group', label: t('Party Categorization') },
      { id: 'currency-reval', label: t('Currency Revaluation') },
      { id: 'gstin-align', label: t('GSTIN Verification') },
      { id: 'inventory-reval', label: t('Inventory Reval') },
      { id: 'new-operation', label: t('New') },
    ],
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
      { id: "items", label: t("Item Hub") },
      { id: "basic_items", label: t("Basic Item") },
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
    "tax-report": [
      { id: "kpis", label: t("Tax KPI") },
      { id: "advance-tax", label: t("Advance Tax") },
      { id: "tds-ledger", label: t("TDS Ledger") },
      { id: "tax-projection", label: t("Projections") },
      { id: "tds-tcs-calculator", label: t("TDS/TCS Calc") },
      { id: "presumptive-tax", label: t("Presumptive Tax") },
      { id: "depreciation-schedule", label: t("Asset Depreciation") },
      { id: "compliance-tracker", label: t("Expense Audit") },
      { id: "tax-loss-tracker", label: t("Losses Set-off") },
      { id: "lut-application", label: t("LUT Application") },
      { id: "eledger-simulator", label: t("e-Ledger Sim") },
      { id: "info", label: t("Workspace Guide") },
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
      { id: "ui", label: t("UI") },
      { id: "formdetails", label: t("Form Detail") },
      { id: "navigation", label: t("App Defaults") },
      { id: "invoiceprint", label: t("Invoice & Print") },
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

  const subSubPages: Record<string, { id: string; label: string }[]> = {
    // 1. Dashboard Subpages
    overview: [
      { id: "metrics", label: t("Key Performance Indicators") },
      { id: "revenue", label: t("Sales & Receipts Trend") },
      { id: "dues", label: t("Outstanding Receivables") },
      { id: "growth", label: t("YoY Growth Comparison") },
      { id: "cashflow", label: t("Cash & Bank Position") },
      { id: "vouchers", label: t("Recent Inflow/Outflow") },
    ],
    sales: [
      { id: "metrics", label: t("Key Sales Metrics") },
      { id: "details", label: t("Sales Register Details") },
      { id: "customers", label: t("Customer Wise Summary") },
      { id: "products", label: t("Item Variant Breakdowns") },
    ],
    purchase: [
      { id: "metrics", label: t("Key Purchase Metrics") },
      { id: "details", label: t("Purchase Register Details") },
      { id: "vendors", label: t("Vendor Wise Summary") },
      { id: "expenses", label: t("Direct/Indirect Expenses") },
    ],
    payment: [
      { id: "transactions", label: t("Payment Operations") },
      { id: "dues", label: t("Outstanding Payables") },
      { id: "advances", label: t("Advance Disbursements") },
      { id: "ledger_view", label: t("Account Payee Ledgers") },
    ],
    receipt: [
      { id: "transactions", label: t("Collection Operations") },
      { id: "dues", label: t("Outstanding Receivables") },
      { id: "advances", label: t("Advance Receipts") },
      { id: "ledger_view", label: t("Aged Debtor Ledgers") },
    ],
    receipts: [
      { id: "transactions", label: t("Collection Operations") },
      { id: "dues", label: t("Outstanding Receivables") },
      { id: "advances", label: t("Advance Receipts") },
      { id: "ledger_view", label: t("Aged Debtor Ledgers") },
    ],
    bank: [
      { id: "statement", label: t("Statement Ingestion") },
      { id: "reconciliation", label: t("Reconciliation Board") },
      { id: "matched", label: t("Automated Matches") },
      { id: "unidentified", label: t("Exception Registers") },
    ],
    journal: [
      { id: "entries", label: t("Journal Adjustments") },
      { id: "provisions", label: t("Prepaid & Provisional Entries") },
      { id: "audit", label: t("Regulatory Audits") },
    ],
    contra: [
      { id: "cash_transfers", label: t("Cash & Contra Transits") },
      { id: "bank_accounts", label: t("Bank-to-Bank Transits") },
    ],

    // 2. Transactions (Voucher Entry) Subpages
    debit_note: [
      { id: "returns", label: t("Purchase Returns") },
      { id: "reconciled", label: t("Dr Note Reconciliations") },
    ],
    credit_note: [
      { id: "returns", label: t("Sales Returns") },
      { id: "reconciled", label: t("Cr Note Reconciliations") },
    ],

    // 3. Inventory Trans Subpages
    stock_journal: [
      { id: "items_grid", label: t("Stock Items Grid") },
      { id: "godown", label: t("Warehouse & Location Selection") },
      { id: "valuation", label: t("Valuation & Rates") },
    ],
    physical_stock: [
      { id: "counting", label: t("Counting Records") },
      { id: "discrepancies", label: t("Discrepancy Audit") },
    ],
    consumption: [
      { id: "production_use", label: t("Production Consumptions") },
      { id: "general_use", label: t("General Store Consumption") },
    ],
    scrap: [
      { id: "loss_record", label: t("Scrap Register") },
      { id: "writeoff", label: t("Value Write-offs") },
    ],
    transfer: [
      { id: "transit_route", label: t("Stock in Transit") },
      { id: "destination", label: t("Receipt and Allocations") },
    ],
    rejections_in: [
      { id: "customer_returns", label: t("Customer Material Returned") },
      { id: "quality_control", label: t("Quality Audit Checklist") },
    ],
    rejections_out: [
      { id: "supplier_returns", label: t("Debit Memo Return Shipments") },
      { id: "discrepant", label: t("Discrepant Materials Logs") },
    ],

    // 4. Import Ingestion Pipeline
    upload: [
      { id: "type", label: t("Select Document Category") },
      { id: "choose", label: t("Choose Template File") },
      { id: "preview", label: t("Analyze Sample Data") },
      { id: "upload", label: t("Upload Excel/PDF Ingestion") },
      { id: "mapping", label: t("Verify Column Mapping") },
      { id: "settings", label: t("Configure Script Pipeline") },
    ],
    correction: [
      { id: "unmap", label: t("Unmapped Core Fields") },
      { id: "missing", label: t("Missing Ledger Masters") },
      { id: "automate", label: t("AI-repaired Alignments") },
    ],
    summary: [
      { id: "trends", label: t("Summary Charts & Trends") },
      { id: "tabular", label: t("Group Tabular Summary") },
      { id: "exceptions", label: t("Anomalies & Audit Trails") },
    ],
    success: [
      { id: "completion", label: t("Absorption Status") },
      { id: "logs", label: t("Transaction Telemetry") },
    ],

    // 5. Bulk Operation Subpages
    pricing: [
      { id: "margins", label: t("Focus Selling Margins") },
      { id: "tax_slabs", label: t("Tax Slab Base Index") },
    ],
    "anomaly-detection": [
      { id: "outliers", label: t("Highlight Core Outliers") },
      { id: "missing_gst", label: t("GSTIN Missing Gaps") },
    ],
    "auto-reconcile": [
      { id: "rules_reconciliation", label: t("Active Auto-matching Rules") },
      { id: "logs_simulation", label: t("Matching Simulation Engine") },
    ],
    "smart-category": [
      { id: "nlp_heuristics", label: t("Heuristic Text Groupers") },
      { id: "ai_association", label: t("Deep Association Trees") },
    ],
    "tax-updater": [
      { id: "rule_hsn", label: t("Update by HSN Code") },
      { id: "rule_item", label: t("Update by Item Group") },
    ],
    "batch-approval": [
      { id: "pending_approvals", label: t("Queue of Entries for Review") },
      { id: "approved_history", label: t("Audits of Prior Batches") },
    ],
    "eway-batch": [
      { id: "draft_invoices", label: t("Pending E-Invoices Ready") },
      { id: "active_eway", label: t("Registered NIC Transits") },
    ],
    "mass-archive": [
      { id: "compression", label: t("Consolidation Archives") },
      { id: "purging", label: t("Pruned Ledger Logs") },
    ],
    "date-repair": [
      { id: "offsets", label: t("Batch Date Offsets") },
      { id: "violations", label: t("Temporal Out-of-Sequence Gaps") },
    ],
    "contact-group": [
      { id: "categorize_party", label: t("Categorize Parties Segmentately") },
      { id: "mailing_lists", label: t("Unified Email Lists") },
    ],
    "currency-reval": [
      { id: "rates_list", label: t("Daily Exchange Indexes") },
      { id: "forex_gains", label: t("Unrealized Forex Ledger") },
    ],
    "gstin-align": [
      { id: "taxpayer_types", label: t("Register GSTR Inquiries") },
      { id: "status_registry", label: t("Active Taxpayer Registries") },
    ],
    "inventory-reval": [
      { id: "lifo_fifo", label: t("FIFO/LIFO Transition Indexes") },
      { id: "adjust_ledger", label: t("Asset Revaluation Adjustments") },
    ],
    "new-operation": [
      { id: "template_op", label: t("Create Custom Batch Script") },
      { id: "active_tasks", label: t("Background Task Schedulers") },
    ],

    // 6. Ledger Master Subpages
    parties: [
      { id: "profile", label: t("Business Profile") },
      { id: "address", label: t("Address Info") },
      { id: "banking", label: t("Finance & Banking Details") },
    ],
    vendors: [
      { id: "profile", label: t("Business Profile") },
      { id: "address", label: t("Address Info") },
      { id: "banking", label: t("Finance & Banking Details") },
    ],
    ledgers: [
      { id: "code", label: t("Code") },
      { id: "name", label: t("Name") },
      { id: "description", label: t("Description / Notes") },
      { id: "group", label: t("Group") },
      { id: "openingBalance", label: t("Opening Balance") },
    ],
    banks: [
      { id: "code", label: t("Code") },
      { id: "name", label: t("Name") },
      { id: "group", label: t("Group") },
      { id: "openingBalance", label: t("Opening Balance") },
      { id: "accNo", label: t("Account No") },
      { id: "ifsc", label: t("IFSC Code") },
      { id: "accType", label: t("Account Type") },
    ],
    contacts: [
      { id: "all", label: t("All Contacts") },
      { id: "staff", label: t("Staff") },
      { id: "customers", label: t("Customers") },
      { id: "vendors", label: t("Vendors") },
      { id: "partners", label: t("Partners") },
    ],
    accountGroups: [
      { id: "code", label: t("Code") },
      { id: "name", label: t("Name") },
      { id: "parent", label: t("Parent Group") },
      { id: "nature", label: t("Nature of Group") },
    ],
    locations: [
      { id: "code", label: t("Code") },
      { id: "name", label: t("Name") },
      { id: "address", label: t("Address") },
      { id: "pincode", label: t("Pin Code") },
    ],
    costCenters: [
      { id: "code", label: t("Code") },
      { id: "name", label: t("Name") },
      { id: "description", label: t("Description") },
    ],

    // 7. Item Master Subpages
    items: [
      { id: "profile", label: t("Core Identification") },
      { id: "tax_rates", label: t("Tax & Tariff Rules") },
      { id: "pricing", label: t("Standard Price List") },
      { id: "dimensions", label: t("Measurements & Weights") },
    ],
    bom: [
      { id: "components", label: t("Input Component List") },
      { id: "overhead", label: t("Manufacturing Overhead") },
      { id: "byproducts", label: t("Co-products & By-products") },
    ],
    warehouses: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
      { id: "audit", label: t("Revision Audits") },
    ],
    uoms: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    stockGroups: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    gst: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    brands: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    categories: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    assertionCategories: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    assertionCodes: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    colors: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    sizes: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    variants: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    dimensions: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    skus: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    priceList: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    weights: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    volumes: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],
    grades: [
      { id: "list", label: t("Available Entries") },
      { id: "add_new", label: t("Register New Entry") },
    ],

    // 8. Bank Voucher Actions
    classify: [
      { id: "unidentified", label: t("Core Unclassified") },
      { id: "mismatched", label: t("Threshold Outliers") },
    ],
    reconcile: [
      { id: "review_pending", label: t("Manual Reconciliation Grid") },
      { id: "suggestions", label: t("AI Reconciliation Suggestions") },
    ],
    "auto-matched": [
      { id: "rules_config", label: t("Auto-reconciliation Rules") },
      { id: "match_history", label: t("Matched Log Audits") },
    ],
    "missing-masters": [
      { id: "ledger_recon", label: t("Missing Account Setup Ledger") },
      { id: "item_recon", label: t("Missing Inventory Masters Setup") },
    ],
    unidentify: [
      { id: "logs", label: t("Unidentified Suspense Records") },
      { id: "manual_routing", label: t("Force Manual Debit/Credit") },
    ],

    // 9. Ledger Report Subpages
    standard: [
      { id: "monthly_summary", label: t("Monthly Inward/Outward Activity") },
      { id: "transaction_details", label: t("Detailed General Ledger List") },
      { id: "grouped_ledgers", label: t("Group-wise Ledger Summaries") },
      { id: "audit_log", label: t("User Alteration Records") },
    ],
    day_book: [
      { id: "daily_log", label: t("Daily Voucher Timeline") },
      { id: "ledger_splits", label: t("Cash versus Accrual splits") },
    ],
    audit_trail: [
      { id: "revisions", label: t("Compliance Chronological Log") },
      { id: "user_tracking", label: t("Telemetry Location & User Sessions") },
    ],

    // 10. GST Report Subpages
    generate_gst: [
      { id: "outward", label: t("Outward Supplies (GSTR-1)") },
      { id: "inward_reconcile", label: t("Inward Supplies & ITC (GSTR-2B)") },
    ],
    filing: [
      { id: "gstr1_filing", label: t("Filing Outward (GSTR-1)") },
      { id: "gstr3b_filing", label: t("Tax Settlement (GSTR-3B)") },
    ],
    invoice_detail: [
      { id: "b2b", label: t("Business-to-Business Invoices") },
      { id: "b2c", label: t("Consumer Direct Invoices") },
    ],
    hsn_detail: [
      { id: "hsn_goods", label: t("HSN Summary for Goods") },
      { id: "sac_services", label: t("SAC Summary for Services") },
    ],
    gstr2b_report: [
      { id: "matched_itc", label: t("Auto-matched Inward Credits") },
      { id: "gaps", label: t("Mismatched Inward Ledgers") },
    ],
    gstr3b_report: [
      { id: "payable_summary", label: t("Compute Consolidated Tax Liability") },
      { id: "offset_itc", label: t("ITC Input Credit Allocation") },
    ],
    gstr9_report: [
      { id: "consolidated", label: t("Annual Consolidated Statement") },
      { id: "audit_alignments", label: t("Statutory Tax Audits") },
    ],
    gstr9c_report: [
      { id: "reconciliation_audit", label: t("Annual Reconciliation Audits") },
    ],
    others_report: [
      { id: "itc_e_ledgers", label: t("GST Cash and Credit Ledgers") },
    ],

    // 11. Tax Report Subpages
    kpis: [
      { id: "overview_kpi", label: t("Quarterly Tax Indicators") },
      { id: "itc_util", label: t("Credit Utilization Trends") },
    ],
    "advance-tax": [
      { id: "advance_due", label: t("Advance Tax Estimation") },
      { id: "challan_match", label: t("Challan Records Matcher") },
    ],
    "tds-ledger": [
      { id: "tds_receivables", label: t("Tax Deducted by Buyers (26AS)") },
      { id: "tds_payables", label: t("Withholding Tax Deductions") },
    ],
    "tax-projection": [
      { id: "future_profitability", label: t("Estimated Profit Trend") },
      { id: "tax_brackets", label: t("Proposed Taxation Brackets") },
    ],
    "tds-tcs-calculator": [
      { id: "tds_calculator", label: t("Deduction Rates Engine") },
    ],
    "presumptive-tax": [
      { id: "section_44ad", label: t("Presumptive Taxation Schemes") },
    ],
    "depreciation-schedule": [
      { id: "it_act_rules", label: t("Income Tax Block Depreciation") },
      { id: "companies_act", label: t("Companies Act SLM/WDV Schedules") },
    ],
    "compliance-tracker": [
      { id: "non_deductible", label: t("Inadmissible Expense Audits") },
    ],
    "tax-loss-tracker": [
      { id: "prior_offsets", label: t("Business Loss Set-off Registers") },
    ],
    "lut-application": [
      { id: "exports_lut", label: t("Zero-Rated Export Bond Forms") },
    ],
    "eledger-simulator": [
      { id: "cash_credit_ledgers", label: t("NSDL Electronic Account Simulator") },
    ],
    info: [
      { id: "tax_manual", label: t("Regulatory Help Guidelines") },
    ],

    // 12. Item Report Subpages
    analysis: [
      { id: "rates_margin", label: t("Rate Analysis & Sales Margins") },
    ],
    movement: [
      { id: "movement_audit", label: t("Inward-Outward Movement Register") },
    ],
    aging: [
      { id: "aging_analysis", label: t("Aging Distribution Blocks") },
    ],
    reorder: [
      { id: "replenishment", label: t("Critical Target Levels") },
    ],
    category: [
      { id: "group_split", label: t("Product Inward Breakdown") },
    ],
    tax: [
      { id: "tax_split", label: t("VAT/GST Output Allocation") },
    ],
    brand: [
      { id: "brand_sales", label: t("Brand Performance Reports") },
    ],
    location: [
      { id: "warehouse_stocks", label: t("Inter-godown Ledger Position") },
    ],
    unit: [
      { id: "alt_units", label: t("Alternative Conversion Factors") },
    ],
    batch: [
      { id: "expiry_tracker", label: t("Lot/Batch Expiry Registers") },
    ],
    negative: [
      { id: "negative_balance", label: t("Overdraft Negative Inventories") },
    ],
    fast_moving: [
      { id: "velocity_rank", label: t("Velocity Ranks") },
    ],
    slow_moving: [
      { id: "stagnancy_rank", label: t("Stagnant & Slow Ranks") },
    ],
    profitability: [
      { id: "sku_gross_margins", label: t("SKU Gross Profit Margins") },
    ],
    valuation: [
      { id: "closing_valuation", label: t("Value Computation Metrics") },
    ],
    top_selling: [
      { id: "sales_volume", label: t("Volume Rankings") },
    ],
    dead_stock: [
      { id: "scrap_estimates", label: t("Write-off Projections") },
    ],
    reconciliation: [
      { id: "physical_match", label: t("Adjustment Audit Registers") },
    ],
    procurement: [
      { id: "lead_times", label: t("Lead-time and Delivery Logs") },
    ],
    lead_time: [
      { id: "logistics_sla", label: t("Supplier Transit Logs") },
    ],

    // 13. Financial Reports
    pl: [
      { id: "revenues_direct", label: t("Operating Revenues & Direct Cost") },
      { id: "indirects_ebitda", label: t("Operating Overhead & EBITDA") },
    ],
    bs: [
      { id: "assets_capital", label: t("Sources of Capital & Funding") },
      { id: "assets_fixed", label: t("Application of Funds & Assets") },
    ],
    cash_flow: [
      { id: "operations", label: t("Cash from Operating Activities") },
      { id: "investing", label: t("Cash from Investment Activities") },
      { id: "financing", label: t("Cash from Financing Activities") },
    ],
    bank_flow: [
      { id: "inflows", label: t("Detailed Bank Receipts Inward") },
      { id: "outflows", label: t("Detailed Bank Expenses Outward") },
    ],
    trial_balance: [
      { id: "balances_group", label: t("General Ledger Balances Grouped") },
    ],

    // 14. Settings Subpages
    ui: [
      { id: "color", label: t("Colors & Themes") },
      { id: "layout", label: t("Layout Density") },
      { id: "data", label: t("Data Fonts & Formats") },
      { id: "localization", label: t("Localization") },
      { id: "more", label: t("More Options") },
      { id: "maximum", label: t("Maximum Design") },
    ],
    firm: [
      { id: "basicCompany", label: t("Basic Details") },
      { id: "businessProfile", label: t("Profile Details") },
      { id: "primaryContacts", label: t("Primary Contacts") },
      { id: "alertDestinations", label: t("Alert Channels") },
      { id: "addressDetails", label: t("Registered Address") },
      { id: "statutoryTax", label: t("Tax Registrations") },
      { id: "businessLicenses", label: t("Business Licenses") },
      { id: "hrPayroll", label: t("Payroll Setup") },
      { id: "financial_general", label: t("Financial General") },
      { id: "financial_tax", label: t("Financial Taxation") },
      { id: "financial_formatting", label: t("Financial Formatting") },
      { id: "financial_advanced", label: t("Financial Advanced") },
      { id: "bank", label: t("Bank Details") },
      { id: "social", label: t("Social Presence") },
      { id: "operational", label: t("Operational Preferences") },
      { id: "billing", label: t("Billing Sales") },
      { id: "inventoryLogistics", label: t("Inventory Logistics") },
      { id: "branding", label: t("Branding Assets") },
      { id: "legal Remarks", label: t("Legal Remarks") },
      { id: "systemCompliance", label: t("System Backup") },
    ],
    general: [
      { id: "company", label: t("Company & Fiscal Year") },
      { id: "preferences", label: t("Decimal & Global Options") },
      { id: "defaults", label: t("Predefined Ledger defaults") },
    ],
    navigation: [
      { id: "priority", label: t("Main Landing Default") },
      { id: "routing", label: t("Contextual Routing Settings") },
    ],
    invoiceprint: [
      { id: "pdf_header", label: t("Invoice PDF Banner & Header") },
      { id: "letterhead", label: t("Standard Letterhead Margins") },
      { id: "receipt_print", label: t("POS & Invoice Receipt Print") },
    ],
    formdetails: [
      { id: "desktop", label: t("Desktop") },
      { id: "tablet", label: t("Tablet") },
      { id: "mobile", label: t("Mobile") },
      { id: "behaviors", label: t("Behaviors") },
    ],
    vouchernumbering: [
      { id: "accounting", label: t("Accounting Vouchers") },
      { id: "inventory", label: t("Inventory Vouchers") },
    ],
    users: [
      { id: "active-users", label: t("Active Users") },
      { id: "my-account", label: t("My Account") },
      { id: "directory", label: t("Company Directory") },
      { id: "group-rules", label: t("Group Rules") },
      { id: "profile", label: t("Super Admin") },
      { id: "help", label: t("User Help Center") },
    ],
    alerts: [
      { id: "sms_mail", label: t("SMS & Email Notification Gateways") },
      { id: "in_app", label: t("Real-time In-App Flags") },
    ],
    security: [
      { id: "passwords", label: t("Advanced Password Rules") },
      { id: "mfa", label: t("Multi-Factor Setup") },
      { id: "ip_restrict", label: t("Secure IP Access Restrictions") },
    ],
    privacy: [
      { id: "gdpr", label: t("Core Integrity Rules") },
      { id: "data_consent", label: t("Data Processing Consent Forms") },
    ],
    imports: [
      { id: "pipeline", label: t("Import Pipeline Defaults") },
      { id: "rules", label: t("Data Validation Failure Flags") },
    ],
    mapping: [
      { id: "column_align", label: t("Automatic Headers Auto-alignment") },
      { id: "master_link", label: t("Fallback Reconciliation Mapping") },
    ],
    ai: [
      { id: "ingestion", label: t("Transcription Ingestion Models") },
      { id: "verification", label: t("Auto-repair Verification Tuning") },
    ],
    admin: [
      { id: "db_tune", label: t("Database Index Tune") },
      { id: "backup_now", label: t("Manual Snapshots & Restore") },
    ],
    data: [
      { id: "exports", label: t("Universal Data Exporters") },
      { id: "api_keys", label: t("Custom Application API Integrations") },
    ],
    help: [
      { id: "explorer", label: t("Explorer") },
      { id: "trainer", label: t("Trainer") },
      { id: "faq", label: t("Knowledge") },
    ],
    support: [
      { id: "chat", label: t("Chatbot") },
      { id: "integrity", label: t("Integrity") },
      { id: "tickets", label: t("Tickets") },
    ],
    about: [
      { id: "about", label: t("System Info") },
      { id: "terms", label: t("Terms & Conditions") },
      { id: "release", label: t("Release Notes") },
      { id: "privacy", label: t("Privacy Policy") },
      { id: "license", label: t("License") },
    ],
  };

  const handlePageChange = (val: string) => {
    setDefaultPage(val);
    const subs = subPages[val];
    if (subs && subs.length > 0) {
      const firstSub = subs[0].id;
      setDefaultSubPage(firstSub);
      const options = subSubPages[firstSub];
      if (options && options.length > 0) {
        setDefaultSubSubPage(options[0].id);
      } else {
        setDefaultSubSubPage("");
      }
    } else {
      setDefaultSubPage("");
      setDefaultSubSubPage("");
    }
  };

  const handleSubPageChange = (val: string) => {
    setDefaultSubPage(val);
    const options = subSubPages[val];
    if (options && options.length > 0) {
      setDefaultSubSubPage(options[0].id);
    } else {
      setDefaultSubSubPage("");
    }
  };

  const handleReset = () => {
    const defaults = {
      page: "dashboard",
      subPage: "main",
      routing: {
        dashboard: "main",
        import: "upload",
        "bulk-operation": "pricing",
        "ledger-master": "parties",
        "item-master": "items",
        bank: "bank",
        vouchers: "standard",
        "gst-report": "generate_gst",
        "tax-report": "kpis",
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

  const tabs = [
    { id: "priority" as const, label: t("Startup Priority"), icon: SettingsIcon },
    { id: "routing" as const, label: t("Routing Rules"), icon: AIToolsIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row matching premium design style from AboutSettings */}
      <div className="flex flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <SettingsIcon className="!text-[20px] flex items-center justify-center text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("App Defaults")}</h2>
            <p className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Configure default startups and sidebar routing rules.")}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex justify-end items-center gap-3">
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full snap-x border border-gray-200/40 dark:border-gray-700/40 shrink-0">
             {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                      activeTab === tab.id 
                        ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm scale-[1.01]' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <Icon className={`!text-[15px] flex items-center justify-center transition-colors ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className="leading-none">{tab.label}</span>
                  </button>
                );
             })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
              title={t("Reset Defaults")}
            >
              <UndoIcon className="!text-[16px] flex items-center justify-center shrink-0" />
              <span className="leading-none">{t("Reset")}</span>
            </button>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <button
              onClick={handleSave}
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {isSaved ? <CheckCircleIcon className="!text-[16px] flex items-center justify-center shrink-0 animate-bounce" /> : <SaveIcon className="!text-[16px] flex items-center justify-center shrink-0" />}
              <span className="leading-none">{isSaved ? t("Saved") : t("Save")}</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "priority" && (
        /* Section 1: Application Entry Defaults */
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/60 dark:border-gray-800 shadow-sm relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20">
              <SettingsIcon className="!text-[18px] flex items-center justify-center text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                {t("Startup Priority")}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                {t("Global Entry Point")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Default Page Dropdown */}
            <div className="flex flex-col gap-2 bg-gray-50/50 dark:bg-gray-800/10 p-4 rounded-xl border border-gray-150 dark:border-gray-800/60">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <div className="w-1 h-2.5 bg-blue-600 rounded-full"></div>
                {t("Main Landing Category")}
              </label>
              <div className="relative">
                <select
                  value={defaultPage}
                  onChange={(e) => handlePageChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer h-10"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id} className="font-bold py-2">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-1 mt-1 justify-center">
                {pages.map((p) => (
                  <div
                    key={p.id}
                    title={p.label}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${defaultPage === p.id ? "bg-blue-600 w-3.5" : "bg-gray-200 dark:bg-gray-750"}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Default Subpage Dropdown */}
            <div className="flex flex-col gap-2 bg-gray-50/50 dark:bg-gray-800/10 p-4 rounded-xl border border-gray-150 dark:border-gray-800/60">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <div className="w-1 h-2.5 bg-blue-400 rounded-full"></div>
                {t("Target Sub-Section")}
              </label>
              <div className="relative">
                <select
                  value={defaultSubPage}
                  onChange={(e) => handleSubPageChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer h-10"
                >
                  {subPages[defaultPage]?.map((sp) => (
                    <option key={sp.id} value={sp.id} className="font-bold py-2">
                      {sp.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-right">
                {t("Access Section")}:{" "}
                <span className="text-blue-500">
                  {subPages[defaultPage]?.find((sp) => sp.id === defaultSubPage)?.label}
                </span>
              </p>
            </div>

            {/* Focus View Sub-Sub-tab Dropdown */}
            <div className="flex flex-col gap-2 bg-gray-50/50 dark:bg-gray-800/10 p-4 rounded-xl border border-gray-150 dark:border-gray-800/60 animate-in fade-in duration-300">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <div className="w-1 h-2.5 bg-purple-500 rounded-full"></div>
                {t("Focus View Subtab")}
              </label>
              <div className="relative">
                <select
                  value={defaultSubSubPage}
                  onChange={(e) => setDefaultSubSubPage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-850 border border-slate-200 dark:border-gray-700 rounded-lg px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer h-10"
                >
                  <option value="" className="font-bold py-2">--</option>
                  {subSubPages[defaultSubPage]?.map((ssp) => (
                    <option key={ssp.id} value={ssp.id} className="font-bold py-2">
                      {ssp.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-right">
                {t("Focus View")}:{" "}
                <span className="text-purple-500">
                  {subSubPages[defaultSubPage]?.find((ssp) => ssp.id === defaultSubSubPage)?.label || t("None")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "routing" && (
        /* Section 2: Contextual View Routing */
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/60 dark:border-gray-800 shadow-sm relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
              <AIToolsIcon className="!text-[18px] flex items-center justify-center text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                {t("Routing Intelligence")}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                {t("Automated Contextual Navigation")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {pages.map((page) => (
              <div
                key={page.id}
                className="p-4 bg-gray-50/40 dark:bg-gray-850/10 rounded-xl border border-gray-150 dark:border-gray-800/60 hover:border-blue-500/55 transition-all shadow-sm hover:shadow-md relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white dark:bg-gray-800 flex items-center justify-center rounded-lg border border-gray-150 dark:border-gray-700 shadow-sm text-[15px]">
                      {page.icon}
                    </div>
                    <div>
                      <h3 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-0.5">
                        {page.id}
                      </h3>
                      <h4 className="text-xs font-bold text-gray-850 dark:text-white tracking-tight">
                        {page.label}
                      </h4>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>

                <div className="space-y-2 relative z-10">
                  <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {t("Default Route")}
                  </label>
                  <div className="relative">
                    <select
                      value={routingDefaults[page.id] || ""}
                      onChange={(e) => updateRouting(page.id, e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-100 outline-none transition-all cursor-pointer h-9"
                    >
                      {subPages[page.id]?.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Tip */}
          <div className="mt-6 p-4 bg-blue-50/20 dark:bg-blue-500/5 rounded-xl border border-blue-100/20 dark:border-blue-500/10 flex gap-4 items-center relative z-10">
            <div className="w-10 h-10 rounded-lg bg-blue-100/50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-500/20 shrink-0">
              <InfoIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-250 uppercase tracking-[0.1em] mb-1">
                {t("Architectural Integrity")}
              </h4>
              <p className="text-[11px] text-blue-700/70 dark:text-blue-300/70 font-medium leading-relaxed max-w-2xl italic">
                {t('"These routing rules persist across user sessions, ensuring your workflow remains uninterrupted by creating dedicated direct-access pathways to your most critical data silos."')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
