import { Article } from "../types";

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    category: 'getting-started',
    title: '1. Getting Started with Bharat Book AI ERP',
    summary: 'A comprehensive onboarding blueprint to auto-importing external bank statements, setting up baseline preferences, and posting verified financial ledger vouchers.',
    content: 'Bharat Book AI is an enterprise-grade automated accounting platform that orchestrates the flow of importing messy bank statement spreadsheets, identifying logical transactions, tracking stock item movements, and posting compliant general ledger vouchers. To start your journey: (1) Navigate to the "Import" view under Operations in the sidebar. (2) Upload your banking Excel or CSV statement. (3) Align columns using the Interactive Column Mapper tool (which matches your raw file fields like Date, description, and running balance with internal ERP schema parameters). (4) Run the neural matching ledger cleanser. The system cross-references party records to propose accurate Credit or Debit entries, ready for one-click posting. It is designed to save up to 90% of manual entry times for busy finance and accounting departments.',
    tags: ['import', 'getting started', 'reconciliation', 'ledger entry']
  },
  {
    id: 'art-2',
    category: 'getting-started',
    title: '2. The Operational Intelligence Dashboard',
    summary: 'Mastering the primary real-time business cockpit, financial trend indicators, activity feeds, and GST calculations.',
    content: 'The Dashboard acts as the primary visual control center for your entire reporting business block. It comprises four functional parts: (1) Key Performance Indicators (KPIs): Dynamic summaries of total sales accruals, purchase liabilities, cash-on-hand ratio, and accumulated GST liabilities in real-time. (2) Financial Trend Charts: Modern interactive Recharts depicting monthly credit vs debit flows, tax margins, and inventory stock valuations. (3) Actionable Item List: Alerts identifying raw statements requiring manual ledger matching, low-confidence entries, and unapproved draft vouchers. (4) System-Wide Audit Feeds: A live stream recording user entries, login instances, and automated rule executions. This cockpit offers executives comprehensive financial transparency in a glance.',
    tags: ['dashboard', 'analytics', 'charts', 'kpi tracking']
  },
  {
    id: 'art-3',
    category: 'getting-started',
    title: '3. Statement Loader & Interactive Column Extractor',
    summary: 'An advanced manual for importing statement sheets, managing drag-drop loaders, and configuring schema variables.',
    content: 'The "Import" tab is a custom-engineered reconciliation pipeline. When a user drags or uploads a bank statement (CSV, XLS, XLSX formats): (1) Pre-Processor: The engine checks headers for known formats. If unrecognized, users can drag and drop raw statement columns on target ERP fields (such as Ledger Name, Transaction Date, Chq/Ref Number, Dr/Cr Amount). (2) Candidate Row Preview: The statement parses in real-time, showing a highly interactive tabular draft sheet. Each row has smart tags assessing parsing consistency. (3) Account Matching Indicator: The engine marks suggested ledgers with confidence ratings. (4) In-place Master Creation: If a party name is unfamiliar, administrators can register a party profile on-the-spot with default tax state codes without dismissing the current load session.',
    tags: ['import', 'statement loader', 'mapping helper', 'reconciliation']
  },
  {
    id: 'art-4',
    category: 'vouchers',
    title: '4. Understanding Missing Ledger Fallback Logic',
    summary: 'How the matching engine behaves when no exact master record matches imported counterparty particulars.',
    content: 'During transaction line evaluations, our AI engine compares the raw narration against the Ledger Master registry. Since raw descriptions are often messy (e.g., "NEFT/99812/MOHIT-REPAIR"), exact matches can fail. You can adjust the system-wide fallback settings inside "Import Schemas & Rules": (1) "Silently Create New Party": The app auto-proposes a default trade master incorporating the cleansed party string. (2) "Prompt to Create": Highlighted caution badges appear in the reviewed feed, clicking which presents a modal to specify custom accounts, default GST rates, and PAN cards inline. (3) "Fallback to Suspense Ledger": Directs unresolvable lines into a designated Suspense Account. This guarantees accounting books remain in balance while flags wait for manual reconciliation reviews.',
    tags: ['ledgers', 'masters', 'suspense', 'fallback logic']
  },
  {
    id: 'art-5',
    category: 'vouchers',
    title: '5. Manual double-entry books & multi-line transactions',
    summary: 'How to use the manual Transactions view to post receipts, payments, purchases, sales, and adjusting journals.',
    content: 'For manual transactions, the "Transactions" view provides a sleek, dual-currency multi-line journal entry ledger. Supported voucher types: (1) Receipt Voucher (RC): Credits cash or bank assets while debiting accounts receivable or income. (2) Payment Voucher (PV): Debits expense accounts or payables while crediting bank assets. (3) Journal Voucher (JV): Crucial for year-end adjustments, depreciation charges, or inter-ledger transfers. (4) Sales & Purchase Vouchers: Accrue income or liabilities with custom state codes. The module keeps track of running totals, checking that the cumulative Debits equal the cumulative Credits down to the penny. The system bars users from posting an out-of-balance journal, preventing reporting errors before databases commit state.',
    tags: ['transactions', 'double entry', 'vouchers', 'journal voucher']
  },
  {
    id: 'art-6',
    category: 'vouchers',
    title: '6. Inventory entry & warehouse stock movements',
    summary: 'Configuring physical goods receipt notes, warehouse stock transfers, valuations, and tax rates.',
    content: 'The "Inventory Trans." entry tab registers physical coordinate adjustments. While standard vouchers record cash accounts, this view is optimized for stock ledgers: (1) Goods inward / Outbound: Records stock arrivals or sales shipments, integrating with item masters to fetch HSN codes and default CGST/SGST ratios. (2) Internal Stock Transfers: Relocates quantities between warehouse locations. (3) Automatic Valuation Valuation cards: Computes item cost on "Weighted Average Cost" or "FIFO" criteria in real-time. (4) Unit of Measurement (UOM) variables: Resolves custom quantities (e.g. PCS, KGS, BUNDLES). Tracking these movements safeguards materials, manages stock balances, and prevents discrepancies between stock sheets and balance statements.',
    tags: ['inventory', 'stock entry', 'warehouse', 'tax rates']
  },
  {
    id: 'art-7',
    category: 'vouchers',
    title: '7. Comprehensive Ledger & Stock Item Master Registries',
    summary: 'Managing trade counterparties, default state codes, HSN tax classifications, and units of measurement.',
    content: 'Master records provide the foundational static database utilized for all transactions. Under "Masters" in the sidebar: (1) Ledger Master: Registers accounts (Cash, Bank, Debtors, Creditors, Asset, Liability, Revenue, Expense). Each debtor/creditor profile maintains billing addresses, registered PAN identifiers (for tax tracking), and state location codes. State Codes are highly critical: they dictate whether sales to that party trigger localized State-Central GST (CGST+SGST) or overseas Interstate GST (IGST) during calculations. (2) Item Master: Manages physical product codes. Tracks name strings, standard unit identifiers, 8-digit HSN codes for regulatory tax audit filings, and tax tiers (e.g., 5%, 12%, 18%, 28%). Keeping these records updated ensures seamless automated invoice processing.',
    tags: ['ledger master', 'item master', 'gstin', 'hsn codes']
  },
  {
    id: 'art-8',
    category: 'ai-engines',
    title: '8. Configuring Gemini and 9Router Models',
    summary: 'How to adjust routing profiles between internal Google Gemini models and custom 9Router API gateways.',
    content: 'Bharat Book AI supports pluggable LLM matching engines to identify transactional intent from bank statement narrations. Under "AI Match Engine Config" inside settings: (1) Internal (Google Gemini 1.5): Standard routing option utilizing server-side Gemini models. It demonstrates supreme precision, interpreting highly cryptic strings (e.g., "POS 2405 AT AP-AMAZON-RETAILS") to determine the ledger is "Office Supply Expense" and the counterparty is "Amazon Retail". (2) External (9Router Gateway): Allows enterprise-wide custom endpoint mappings. (3) Local Match dictionary: Fails back to local regular expression libraries if external APIs are unreachable or offline. Adjusting LLM Temperature parameter controls confidence bounds: low temperatures (0.1–0.3) provide highly consistent matches while high temperatures allow broader, semantic matching.',
    tags: ['gemini', '9router', 'llm', 'api keys', 'ai settings']
  },
  {
    id: 'art-9',
    category: 'ai-engines',
    title: '9. Bank Narration Cleansers and Mapping Rule Editors',
    summary: 'Optimizing classification quality by managing short codes, noise word filters, and IFSC mappings.',
    content: 'A major obstacle in financial document matching is raw narration clutter (such as branch codes, UTN references, and IFSC prefixes: e.g. "UTIB00192A0/CMS/CHQ-991/NEFT"). To solve this, Bharat Book incorporates a twin-track text pre-processing suit: (1) Noise Ignore Words (e.g., "CMS", "NEFT", "DR", "CR", "IMPS", "CHQ"). The engine strips these matches instantly. (2) Bank Short Codes: Translates abbreviations (e.g. "INF" to "Infosys Account", "RTGS" to ""). (3) IFSC Prefix Matching: Isolates the start codes to pinpoint bank origin and routes transactions to specific bank clearing ledgers. Under Preferences -> Mapping, administrators can fine-tune these parameters, lifting auto-matching precision score from 62% to over 98%.',
    tags: ['cleansing', 'string filters', 'mapping rules', 'narration cleanser']
  },
  {
    id: 'art-10',
    category: 'security',
    title: '10. The Advanced Reports & GSTR-1 Accrual Suite',
    summary: 'A detailed handbook to Trial Balances, Balance Sheets, Profit & Loss summaries, GSTR tax spreadsheets, and stock ledger cards.',
    content: 'Bharat Book packs a suite of real-time analytical reports. Accessible under "Report": (1) Financial Report: Instantly aggregates debit and credit posting logs to render Trial Balance lists. It generates live, multi-period Balance Sheets and Profit & Loss income declarations. (2) Ledger Report: Provides historical ledger cards with adjustable calendars, running cumulative totals, and transaction source links. (3) Bank Vouchers Report: Focuses primarily on cash/bank clearing accounts, pairing transaction histories with associated import batches. (4) GST Report: Features compliance checking tools creating GSTR-1 and GSTR-2 format sheets. It tracks IGST, SGST, and CGST allocations side-by-side, validating party tax codes against registered state boundaries to avoid compliance fees. (5) Item Report: Renders inventory stock ledgers showing inward and outward flows.',
    tags: ['reports', 'gstr-1', 'trial balance', 'balance sheet', 'gst report']
  },
  {
    id: 'art-11',
    category: 'security',
    title: '11. Batch Operations and Mass Voucher Management',
    summary: 'Executing lightning-fast bulk corrections, global status transitions, and advanced grid filtration reviews.',
    content: 'When reconciling thousands of statement rows, updating transactions one-by-one is tedious. The "Bulk Operation" view provides a mass correction workshop: (1) Structured Search Filters: Target transaction lists by dates, voucher class types (PV/RC/JV), specific ledger codes, or AI confidence categories (e.g. "Confidences below 70%"). (2) Mass Status Change: Changes active vouchers from "Draft" status to "Approved" with a single click. (3) Multi-select Delete: Batches corrupted uploads or double postings for fast removal. (4) Global Ledger Transfer: Replaces an assigned ledger (e.g., "Office Exp") with another (e.g. "Rent Exp") across all highlighted lines. Working in bulk protects database integrity and resolves errors in seconds.',
    tags: ['bulk operations', 'batch edits', 'mass filters', 'voucher approval']
  },
  {
    id: 'art-12',
    category: 'security',
    title: '12. Enterprise Access Polices & Work Session Limits',
    summary: 'Adjusting working hour constraints, department permission maps, inactivity logout thresholds, and security audits.',
    content: 'To safeguard accounting registries from unauthorized edits, Bharat Book incorporates an Administrative Protection Shield inside Settings -> Security: (1) Role & Department Authorization Matrix: Assigns unique rights to users (e.g. Accountant, Auditor, Viewers). Juniors can draft vouchers but cannot post to production. (2) Shift Constraint Locks: Enforces specific operational time boundaries (e.g. Mondays to Fridays from 09:00 to 18:00 only). If a user attempts to edit a ledger outside of this simulated timeframe, the endpoint blocks the modification and records a security incident log. (3) Session Idle Limits: Logs out active terminals if no motion is caught on screen for 10–30 minutes, securing unattended hardware in public or shared offices.',
    tags: ['security', 'working hours', 'role mapping', 'audit logs', 'access controls']
  }
];
