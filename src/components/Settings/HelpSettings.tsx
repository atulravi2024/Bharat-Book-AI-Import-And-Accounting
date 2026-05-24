import React, { useState } from 'react';
import { 
  HelpCircle, Search, BookOpen, Sparkles, ChevronRight, CheckCircle, ArrowRight, 
  ShieldCheck, Database, RefreshCw, Settings, Sliders, Activity, Lock, Layers, 
  Cpu, FileCode, Check, AlertTriangle, Building, Globe, Mail, Printer, LayoutGrid, Eye, HelpCircle as HelpIcon 
} from 'lucide-react';

interface Article {
  id: string;
  category: 'getting-started' | 'vouchers' | 'ai-engines' | 'security';
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

const ARTICLES: Article[] = [
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

// Definition for all 15 settings modules so user can browse and comprehend
interface FeatureDefinition {
  id: string;
  name: string;
  tabKey: string;
  icon: React.ComponentType<any>;
  description: string;
  parameters: string[];
  checklist: string[];
  concept: string;
}

export const HelpSettings: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'faq' | 'explorer' | 'trainer'>('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticle, setExpandedArticle] = useState<string | null>('art-1');

  // Explorer Tab State
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('vouchernumbering');

  // Interactive Trainer States
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [matchedFields, setMatchedFields] = useState<Record<string, string>>({});

  // 1. Voucher Numbering Simulator States
  const [simPrefix, setSimPrefix] = useState('BB-JV-');
  const [simPadding, setSimPadding] = useState(5);
  const [simStartSeq, setSimStartSeq] = useState(1);
  const [simSuffix, setSimSuffix] = useState('-2026');

  // 2. Bank Narration Cleanser States
  const [rawNarration, setRawNarration] = useState('UPI/9812/DR-NET/CHQ/HDFC-OFFICE-RENT');
  const [cleanUPI, setCleanUPI] = useState(true);
  const [cleanCHQ, setCleanCHQ] = useState(true);
  const [cleansedIgnore, setCleansedIgnore] = useState('DR-NET');

  // 3. AI confidence estimator States
  const [aiEngine, setAiEngine] = useState<'gemini' | '9router' | 'local'>('gemini');
  const [aiTemperature, setAiTemperature] = useState(0.2);

  // 4. Working hours simulator states
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('18:00');
  const [simulatedTime, setSimulatedTime] = useState('14:30');

  // 5. GSTIN State extractor
  const [gstinValue, setGstinValue] = useState('27AAAAA1111A1Z1');

  // 6. Theme and Layout Toggle
  const [simLayoutDensity, setSimLayoutDensity] = useState<'comfort' | 'compact'>('comfort');
  const [simInvoiceThemeColor, setSimInvoiceThemeColor] = useState('#2563eb');

  const sampleColumns = ['Tran Date', 'Chq No.', 'Particulars', 'Withdrawal (Dr)', 'Deposit (Cr)'];
  const targetFields = [
    { key: 'voucherDate', label: 'Voucher Date (Header)' },
    { key: 'chequeNumber', label: 'Cheque/Ref Number' },
    { key: 'particulars', label: 'Particulars / Party description' },
    { key: 'debit', label: 'Debit Amount' },
    { key: 'credit', label: 'Credit Amount' }
  ];

  const FEATURES_LIST: FeatureDefinition[] = [
    {
      id: 'firm',
      name: 'Firm Profile & GST Setup',
      tabKey: 'firm',
      icon: Building,
      description: 'Define the corporate profile of your reporting business entity. Stores core identification tags used for balance sheet headers and ledger master linking.',
      concept: 'Provides details like GSTIN, permanent PAN registration codes, default registered state locations, and business tax classifications.',
      parameters: ['Legal Trade Title', 'GSTIN (Invoices sync)', 'Company Address', 'PAN/TAN registration'],
      checklist: [
        'Input pristine 15-character regulatory GSTIN.',
        'Align state location boundaries (used to auto-calculate SGST vs IGST brackets).',
        'Upload verified company signatories for voucher reports.'
      ]
    },
    {
      id: 'general',
      name: 'General Prefs & Financials',
      tabKey: 'general',
      icon: Settings,
      description: 'Configure standard decimal rounding scales, reporting currencies, regional locales, and corporate account lock dates.',
      concept: 'Establishes how standard values are compiled. Restricts postings before specific dates to secure historic ledgers.',
      parameters: ['Locale Formatting (e.g. en-IN)', 'Rounding Precision', 'Ledger Lock Date', 'Default Accounting Start'],
      checklist: [
        'Set rounding threshold to 2 points for GST filing compliance.',
        'Choose native currency formats (INR or Custom symbols).',
        'Set closing ledger dates to protect completed fiscal blocks.'
      ]
    },
    {
      id: 'navigation',
      name: 'App Navigation Settings',
      tabKey: 'navigation',
      icon: Layers,
      description: 'Configure layout-wide sidebar components, quick-access dashboards, toggle unused subsystems, and layout templates.',
      concept: 'Allows managers to customize workspace aesthetics, hiding redundant reports and tailoring workflow efficiency.',
      parameters: ['Sidebar Subsystems Toggle', 'Default Entry Screen', 'Layout Ribbon Controls'],
      checklist: [
        'Toggle off the Inventory subsystem if dealing with pure service ledgers.',
        'Pin frequent Reports directly to main navigation tracks.',
        'Set start page to "Quick Import" for single-click statement parsing.'
      ]
    },
    {
      id: 'vouchernumbering',
      name: 'Voucher Auto-Numbering',
      tabKey: 'vouchernumbering',
      icon: FileCode,
      description: 'Control how sequential registration codes are generated across Voucher classes (Sales, Payment, Receipt, Journal).',
      concept: 'Generates secure, customizable sequence identifiers based on prefixes, calendars, suffixes, and padding structures.',
      parameters: ['Sequence Prefix (JV/)', 'Numeric Width Padding', 'Restart resets (Yearly/Daily)', 'Suffix blocks (-2026)'],
      checklist: [
        'Define a clear prefix for each voucher type (e.g., PV/ for Payments).',
        'Apply numeric width padding of 4 or 5 characters to avoid alignment gaps.',
        'Verify restarting sequentials match the financial reporting period.'
      ]
    },
    {
      id: 'invoiceprint',
      name: 'Invoice Styles & Printing',
      tabKey: 'invoiceprint',
      icon: Printer,
      description: 'Modify look and layout configuration of invoices. Choose colors, header scales, metadata positioning, and bank detail blocks.',
      concept: 'Tailor print margins, customize signature cards, and design professional customer sheets.',
      parameters: ['Print Palette', 'Fonts Pairing', 'Bank Information Block', 'Footer T&C terms'],
      checklist: [
        'Select custom matching palettes (Royal Blue, Executive Charcoal).',
        'Toggle direct Bank details on print templates to accelerate wire receipts.',
        'Integrate dynamic signature authorization text lines.'
      ]
    },
    {
      id: 'formdetails',
      name: 'Form Custom Fields',
      tabKey: 'formdetails',
      icon: Sliders,
      description: 'Configure additional metadata capture on standard entry screens. Toggle extra attributes like vehicle lists or carrier numbers.',
      concept: 'Enable multi-layered data arrays directly on vouchers for deeper report filtering and tracking.',
      parameters: ['HSN/SAC Fields Toggle', 'Vehicle reference number', 'Challan ID tracking', 'Dynamic notes lines'],
      checklist: [
        'Enable HSN details for strict tax reporting validation.',
        'Append shipping vehicle references for logistic compliance sheets.',
        'Activate dynamic memo variables for audit documentation records.'
      ]
    },
    {
      id: 'users',
      name: 'User Directory & Subtabs',
      tabKey: 'users',
      icon: Activity,
      description: 'Invite members, manage enterprise emails, delegate user roles, and define group scope rules.',
      concept: 'Assign secure role classes: Auditor, Accountant, Admin, or Viewer. Regulate boundaries on the "subpage user" channel.',
      parameters: ['Managed Members Logs', 'Active Invite Links', 'Group Rules Policy Matrix'],
      checklist: [
        'Configure the specific user profile page on the localized "subpage user".',
        'Assign target limits to Junior Accountant records.',
        'Inspect session logs to isolate stale access tokens.'
      ]
    },
    {
      id: 'alerts',
      name: 'Alerts & System Hooks',
      tabKey: 'alerts',
      icon: ArrowRight,
      description: 'Deploy real-time automated system hooks. Trigger email summaries, SMS alerts, and login threat notifications.',
      concept: 'Keeps staff updated on transaction limits, bulk failures, security exceptions, or system updates.',
      parameters: ['Hook email servers', 'Bulk Import Warnings', 'Threat notification boundaries'],
      checklist: [
        'Connect active email servers to auto-receive daily import summaries.',
        'Establish SMS trigger parameters for High Priority transactions.',
        'Turn on audit-failure alerts to detect rogue offline logs.'
      ]
    },
    {
      id: 'security',
      name: 'Security Logs & Limits',
      tabKey: 'security',
      icon: Lock,
      description: 'Enforce strict administrative safety guardrails. Define lock-out hours, inactivity timeouts, and minimum password complexities.',
      concept: 'Protects the integrity of accounting ledgers from rogue operations, setting boundaries for operational teams.',
      parameters: ['Maximum transaction caps', 'Hour lock periods (Mon-Fri only)', 'Inactivity Auto-Logout duration'],
      checklist: [
        'Enforce 15-minute automatic inactivity logouts for auditor terminals.',
        'Restrict general postings during weekends to prevent compliance issues.',
        'Cap unapproved entry adjustments to $25,000 values.'
      ]
    },
    {
      id: 'privacy',
      name: 'Privacy & Masking Controls',
      tabKey: 'privacy',
      icon: ShieldCheck,
      description: 'Deploy counterparty identity obfuscation rules. Strip sensitive banking account details on general report displays.',
      concept: 'Safeguard identity hashes, fulfill corporate security requirements, and mask tax records on print previews.',
      parameters: ['Account number mask (X-pattern)', 'Supplier phone obfuscation', 'Session cookie permissions'],
      checklist: [
        'Mask the middle digits of bank account numbers in reports to secure details.',
        'Enable name-scrambling fields for testing dummy uploads.',
        'Check strict GDPR corporate policies on regional cache storage.'
      ]
    },
    {
      id: 'imports',
      name: 'Import Schemas & Rules',
      tabKey: 'imports',
      icon: Database,
      description: 'Specify dynamic rules for handling statement imports. Configures duplicate row checkers, missing value falls, and CSV parsing encodings.',
      concept: 'Controls pre-processing limits before transaction lines are sent to mapping engines.',
      parameters: ['Row Duplicate Checker', 'UTF Encodings', 'Mandatory Column Validator'],
      checklist: [
        'Set strict duplicate row checkers by linking matching Date, Amount, and Reference.',
        'Specify Latin-1/UTF-8 character overrides for localized bank statements.',
        'Identify specific column tags that trigger row skip rules.'
      ]
    },
    {
      id: 'mapping',
      name: 'Narration Mapping & Cleansing',
      tabKey: 'mapping',
      icon: Sliders,
      description: 'Define search-term criteria and keywords to evaluate statement narration structures, cleansing messy transaction strings automatically.',
      concept: 'Matches raw statements to specific Ledger Masters based on shortcodes, exclusions, and IFSC codes.',
      parameters: ['Ignore Narration Noise list', 'IFSC Registry Mapping', 'Exact Keyword triggers (Mappings)'],
      checklist: [
        'Add standardized bank noise tokens ("CMS/", "UTIB/") to the ignore list.',
        'Store static mapping keys (e.g. "OFFICE" triggers "Rent Expense").',
        'Configure the Suspense fallback ledger for unresolvable descriptions.'
      ]
    },
    {
      id: 'ai',
      name: 'AI Match Engine Config',
      tabKey: 'ai',
      icon: Cpu,
      description: 'Select routing configurations for translation parsers, adjusting generative temperatures, timeout scales, and fallback limits.',
      concept: 'Sets whether transaction lines are matched locally, via Gemini 1.5 server clusters, or the 9Router endpoint.',
      parameters: ['Active AI Service Routing', 'LLM LLama/Gemini Selection', 'Parsing Confidence caps'],
      checklist: [
        'Choose internal Gemini engines for highest counterparty text matching quality.',
        'Set confidence requirements (e.g., skip parsing if match probability is below 70%).',
        'Validate localized proxy server latency speeds.'
      ]
    },
    {
      id: 'admin',
      name: 'System Maintenance',
      tabKey: 'admin',
      icon: RefreshCw,
      concept: 'Backup structural caches, download recovery schemas, and flush workspace memory caches.',
      description: 'Maintain the healthy, clean performance of accounting databases.',
      parameters: ['JSON Export Caches', 'Purge Temporary States', 'Factory Workspace Reset'],
      checklist: [
        'Export monthly JSON configuration backups to backup storage.',
        'Purge historical UI state flags before major statement parsing trials.',
        'Run memory defragmentation on client database objects.'
      ]
    },
    {
      id: 'data',
      name: 'Data Explorer',
      tabKey: 'data',
      icon: FileCode,
      description: 'Inspect row-level data structures, state models, and configuration variables directly within a developer terminal layout.',
      concept: 'Real-time JSON monitoring of ledger stores and cached statement items.',
      parameters: ['JSON State inspector', 'Key-Value Memory maps', 'Audit tracking schemas'],
      checklist: [
        'Examine current active voucher objects in raw JSON.',
        'Isolate configuration typos using direct tree schema inspection.',
        'Verify metadata rules are perfectly stored in browser local storage.'
      ]
    }
  ];

  const handleDragCol = (colName: string) => {
    setSelectedCol(colName);
  };

  const handlePairFields = (fieldKey: string) => {
    if (!selectedCol) return;
    setMatchedFields(prev => ({
      ...prev,
      [selectedCol]: fieldKey
    }));
    setSelectedCol(null);
  };

  const resetSimulator = () => {
    setMatchedFields({});
    setSelectedCol(null);
  };

  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === 'all') return matchesSearch;
    return art.category === selectedCategory && matchesSearch;
  });

  // Pick Selected Feature details
  const selectedFeature = FEATURES_LIST.find(f => f.id === selectedFeatureId) || FEATURES_LIST[0];
  const FeatureIcon = selectedFeature.icon;

  // Compile Simulated Voucher Numbering
  const compiledSimVoucher = () => {
    const numericPart = String(simStartSeq).padStart(simPadding, '0');
    return `${simPrefix}${numericPart}${simSuffix}`;
  };

  // Compile Cleansed Narration outputs
  const compileCleansedNarrationOutput = () => {
    let result = rawNarration;
    if (cleanUPI) result = result.replace(/UPI\/\d*\/|UPI\//gi, '');
    if (cleanCHQ) result = result.replace(/CHQ\/\d*\/|CHQ\//gi, '');
    if (cleansedIgnore.trim()) {
      const escaped = cleansedIgnore.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b|${escaped}\\/?`, 'gi');
      result = result.replace(regex, '');
    }
    return result.replace(/\/+/g, '/').replace(/^\/|\/$/g, '').trim();
  };

  // Compile Simulated AI confidence score
  const getSimulatedAiMatchingOutput = () => {
    if (aiEngine === 'gemini') {
      const confidence = Math.round(98 - (aiTemperature * 15));
      return { confidence, duration: '45ms', response: 'Extremely Accurate (Neural Matching Rule Established)' };
    } else if (aiEngine === '9router') {
      const confidence = Math.round(92 - (aiTemperature * 20));
      return { confidence, duration: '120ms', response: 'High Accuracy (External API Cluster Routing)' };
    } else {
      return { confidence: 64, duration: '2ms', response: 'Medium Accuracy (Dictionary String Key Matching)' };
    }
  };

  // Compile Simulated working hours check
  const getWorkingHoursSimulationStatus = () => {
    const [simHr, simMin] = simulatedTime.split(':').map(Number);
    const [startHr, startMin] = workStart.split(':').map(Number);
    const [endHr, endMin] = workEnd.split(':').map(Number);

    const simTotal = simHr * 60 + simMin;
    const startTotal = startHr * 60 + startMin;
    const endTotal = endHr * 60 + endMin;

    if (simTotal >= startTotal && simTotal <= endTotal) {
      return { allowed: true, text: 'ACCESS GRANTED (Within Working Security Hours Bounds)' };
    } else {
      return { allowed: false, text: 'SECURITY VIOLATION! VOUCHERS LOCKED (Operational Security Clock Breach)' };
    }
  };

  // Compile GST state code details
  const getGSTINStateCodeSimulation = () => {
    const stateCode = gstinValue.trim().substring(0, 2);
    const statesMap: Record<string, string> = {
      '27': 'Maharashtra (MH)',
      '07': 'Delhi (DL)',
      '29': 'Karnataka (KA)',
      '33': 'Tamil Nadu (TN)',
      '09': 'Uttar Pradesh (UP)',
      '19': 'West Bengal (WB)',
      '24': 'Gujarat (GJ)'
    };
    return statesMap[stateCode] || 'Unknown State Code (Validates fallback tax rule mappings)';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Compact Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-4 sm:p-6 text-white shadow-md flex items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-100" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase leading-none">
              Help Center
            </h1>
            <p className="text-[10px] sm:text-[11px] text-blue-100 mt-1 font-bold tracking-wider leading-none">
              Knowledge Hub & Intelligent Manual
            </p>
          </div>
        </div>
        <div className="relative z-10 hidden sm:flex items-center gap-2 font-mono text-[10px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-blue-200">BHARAT BOOK</span>
          <span className="w-1 h-1 bg-emerald-400 rounded-full" />
          <span className="text-white font-bold">INFO LEVEL SECURE</span>
        </div>
      </div>

      {/* Main Module Segment Selectors */}
      <div className="flex p-1 bg-gray-150 dark:bg-gray-950 rounded-2xl w-full max-w-2xl border border-gray-100 dark:border-gray-905">
        <button
          onClick={() => setActiveSegment('explorer')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            activeSegment === 'explorer' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
        >
          <Settings className="w-4 h-4" /> 
          Preferences Explorer
        </button>
        <button
          onClick={() => setActiveSegment('trainer')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            activeSegment === 'trainer' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> 
          Mapping Trainer
        </button>
        <button
          onClick={() => setActiveSegment('faq')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            activeSegment === 'faq' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> 
          Knowledge Articles
        </button>
      </div>

      {/* SEGMENT 1: PREFERENCES EXPLORER (Highlights ALL 15 preference tabs in full detail) */}
      {activeSegment === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation/Features List Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-750 flex flex-col h-full max-h-[750px]">
            <div className="mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Preference Modules</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Explore all 15 active system controls</p>
            </div>
            
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {FEATURES_LIST.map(feat => {
                const IsSelected = selectedFeatureId === feat.id;
                const IconComp = feat.icon;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setSelectedFeatureId(feat.id)}
                    className={`w-full p-3 rounded-xl text-left border flex items-center gap-3 transition-all ${
                      IsSelected 
                        ? 'bg-blue-600 text-white border-transparent shadow shadow-blue-100' 
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${IsSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-gray-800'}`}>
                      <IconComp className={`w-4 h-4 ${IsSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-black uppercase tracking-wider leading-tight">{feat.name}</p>
                      <p className={`text-[9px] truncate tracking-normal font-medium ${IsSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        Settings tab: {feat.tabKey}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Feature Deep Dive Panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
              
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-50 dark:border-gray-700 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-100/40">
                    <FeatureIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300 border border-blue-100/20">
                      Settings Tab: {selectedFeature.tabKey}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white uppercase tracking-normal mt-0.5">{selectedFeature.name}</h2>
                  </div>
                </div>
              </div>

              {/* Comprehensive Feature Description */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Core Functional Scope</h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                  {selectedFeature.description}
                </p>
                <div className="p-4 bg-slate-50 dark:bg-gray-950/60 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  <span className="font-bold text-gray-800 dark:text-gray-200 block uppercase text-[9px] tracking-widest mb-1 text-blue-600">Accounting Concept:</span>
                  {selectedFeature.concept}
                </div>
              </div>

              {/* LIVE PLAYGROUND SIMULATORS (Based on Selected Setting Function) */}
              <div className="p-5 bg-gradient-to-b from-indigo-50/20 to-indigo-100/10 dark:from-indigo-950/10 dark:to-indigo-900/10 rounded-2xl border border-indigo-100/30 space-y-4">
                <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Configuration Simulator</h4>
                </div>

                {/* Voucher Numbering Simulator */}
                {selectedFeature.id === 'vouchernumbering' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Toggle starting sequentials to inspect output registration formats:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-indigo-100/20">
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Prefix</label>
                        <input type="text" value={simPrefix} onChange={e => setSimPrefix(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Padding Width</label>
                        <input type="number" min={2} max={8} value={simPadding} onChange={e => setSimPadding(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-gray-950 border p-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Start seq</label>
                        <input type="number" min={1} value={simStartSeq} onChange={e => setSimStartSeq(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-gray-950 border p-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Suffix</label>
                        <input type="text" value={simSuffix} onChange={e => setSimSuffix(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                    </div>
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/40 rounded-xl flex justify-between items-center text-xs font-mono">
                      <span className="text-indigo-700 font-black tracking-widest text-[10px] uppercase">Generated ID Output:</span>
                      <span className="font-bold text-indigo-900 dark:text-white bg-white dark:bg-gray-950 px-3 py-1 rounded border border-indigo-100">{compiledSimVoucher()}</span>
                    </div>
                  </div>
                )}

                {/* Mapping Cleanser Simulator */}
                {selectedFeature.id === 'mapping' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Simulate raw narration text-filters before ledger match checks:</p>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-indigo-100/20 space-y-3">
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Raw Narration Input</label>
                        <input type="text" value={rawNarration} onChange={e => setRawNarration(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                      <div className="flex flex-wrap gap-4 pt-1">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer">
                          <input type="checkbox" checked={cleanUPI} onChange={e => setCleanUPI(e.target.checked)} className="rounded" /> Strip "UPI/" noise
                        </label>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer">
                          <input type="checkbox" checked={cleanCHQ} onChange={e => setCleanCHQ(e.checked)} className="rounded" /> Strip "CHQ/" codes
                        </label>
                        <div className="flex-1 min-w-[120px]">
                          <input type="text" placeholder="Custom Ignore Word" value={cleansedIgnore} onChange={e => setCleansedIgnore(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border px-2 py-0.5 text-[10px] font-bold rounded" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/40 rounded-xl flex justify-between items-center text-xs font-mono">
                      <span className="text-indigo-700 font-black tracking-widest text-[10px] uppercase font-sans">Cleansed Candidate Output:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-950 px-3 py-1 rounded border border-indigo-100">{compileCleansedNarrationOutput() || '(Empty - input cleared)'}</span>
                    </div>
                  </div>
                )}

                {/* AI Classifier engine simulator */}
                {selectedFeature.id === 'ai' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Adjust temperature limits to balance matching consistency vs random creativity:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-gray-900 p-3 rounded-xl border border-indigo-100/20">
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">AI Engine Model</label>
                        <select value={aiEngine} onChange={e => setAiEngine(e.target.value as any)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1 text-xs text-gray-700 dark:text-gray-300 font-bold rounded">
                          <option value="gemini">Google Gemini 1.5 Cluster</option>
                          <option value="9router">9Router External Endpoint</option>
                          <option value="local">Local Matching Dictionary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Temperature ({aiTemperature})</label>
                        <input type="range" min={0} max={1} step={0.1} value={aiTemperature} onChange={e => setAiTemperature(Number(e.target.value))} className="w-full" />
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/40 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-indigo-700 font-black uppercase font-sans">Simulated Confidence Rate:</span>
                        <span className="font-bold text-blue-600">{getSimulatedAiMatchingOutput().confidence}% Confidence</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-150">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${getSimulatedAiMatchingOutput().confidence}%` }} />
                      </div>
                      <p className="text-[9px] text-gray-400 italic text-right font-medium">{getSimulatedAiMatchingOutput().response} in {getSimulatedAiMatchingOutput().duration}</p>
                    </div>
                  </div>
                )}

                {/* Security Limits & operational Hours simulator */}
                {selectedFeature.id === 'security' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Test lock-outs by tweaking simulation times against allowable work periods:</p>
                    <div className="grid grid-cols-3 gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-indigo-100/20">
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Shift Start</label>
                        <input type="time" value={workStart} onChange={e => setWorkStart(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Shift End</label>
                        <input type="time" value={workEnd} onChange={e => setWorkEnd(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Simulated time</label>
                        <input type="time" value={simulatedTime} onChange={e => setSimulatedTime(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1 text-xs text-gray-700 dark:text-gray-300 font-bold rounded" />
                      </div>
                    </div>
                    <div className={`p-3 border rounded-xl flex items-center justify-between text-xs font-black ${
                      getWorkingHoursSimulationStatus().allowed 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                    }`}>
                      <span className="text-[10px] font-serif tracking-widest uppercase">System Evaluation limit:</span>
                      <span className="font-mono text-[10px] font-bold">{getWorkingHoursSimulationStatus().text}</span>
                    </div>
                  </div>
                )}

                {/* GSTIN State Code extractor */}
                {selectedFeature.id === 'firm' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Verify state ledger binding by inputting a mock GSTIN code:</p>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-indigo-100/20">
                      <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Mock 15-character GSTID code</label>
                      <input type="text" maxLength={15} value={gstinValue} onChange={e => setGstinValue(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold rounded text-center tracking-widest uppercase" />
                    </div>
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/40 rounded-xl flex justify-between items-center text-xs font-mono">
                      <span className="text-indigo-700 font-black tracking-widest text-[10px] uppercase font-sans">Extracted Registered State Location:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-950 px-3 py-1 rounded border border-indigo-100">{getGSTINStateCodeSimulation()}</span>
                    </div>
                  </div>
                )}

                {/* Invoice Printing Layout mock */}
                {selectedFeature.id === 'invoiceprint' && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Modify corporate styling variables to simulate print sheets:</p>
                    <div className="grid grid-cols-2 gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-indigo-100/20">
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Brand Ascent Color</label>
                        <div className="flex gap-1.5 mt-0.5">
                          {['#2563eb', '#dc2626', '#16a34a', '#4f46e5', '#db2777'].map(col => (
                            <button key={col} onClick={() => setSimInvoiceThemeColor(col)} className="w-6 h-6 rounded-lg transition-transform hover:scale-110 border" style={{ backgroundColor: col, borderColor: simInvoiceThemeColor === col ? '#000' : 'transparent' }} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Grid Margin Density</label>
                        <select value={simLayoutDensity} onChange={e => setSimLayoutDensity(e.target.value as any)} className="w-full bg-slate-50 dark:bg-gray-950 border p-1 text-xs text-gray-700 dark:text-gray-300 font-bold rounded">
                          <option value="comfort">Business Space (Comfortable)</option>
                          <option value="compact">Data Heavy (Tight Grid)</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl space-y-3 shadow-inner">
                      <div className="flex justify-between items-center border-b pb-1.5" style={{ borderBottomColor: simInvoiceThemeColor }}>
                        <span className="text-[10px] font-black tracking-tight" style={{ color: simInvoiceThemeColor }}>BHARAT BOOK AI BILL</span>
                        <span className="text-[8px] text-gray-400 font-mono">Invoice #INV-2101</span>
                      </div>
                      <div className={`space-y-1 ${simLayoutDensity === 'compact' ? 'py-0.5' : 'py-3'}`}>
                        <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-905 rounded" />
                        <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-905 rounded" />
                      </div>
                      <div className="flex justify-end pt-1 bg-slate-50 dark:bg-gray-900 text-[10px] font-bold p-1 rounded">
                        <span style={{ color: simInvoiceThemeColor }}>TAX ACCRUAL ACCORDING</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* General explanation placeholder simulator for generic fallback modules */}
                {!['vouchernumbering', 'mapping', 'ai', 'security', 'firm', 'invoiceprint'].includes(selectedFeature.id) && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Generic preference parameter auditor:</p>
                    <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl space-y-2 font-semibold">
                      <div className="flex justify-between text-[11px] text-gray-500 border-b pb-1">
                        <span>Active Database Node Location</span>
                        <span className="font-mono text-emerald-600 font-bold">CLIENT_LOCAL_MEMORY</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 border-b pb-1">
                        <span>Dynamic Parameter Compliance Status</span>
                        <span className="font-mono text-blue-600 font-bold">VERIFIED_ACTIVE</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Security Level Status</span>
                        <span className="font-mono text-purple-600 font-bold">SHA-256 ENCRYPTED</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Setting Parameters details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center">
                    <Sliders className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    Key Settings Properties
                  </h4>
                  <ul className="space-y-2">
                    {selectedFeature.parameters.map(param => (
                      <li key={param} className="p-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        {param}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Administrative Checklist
                  </h4>
                  <ul className="space-y-2">
                    {selectedFeature.checklist.map((step, idx) => (
                      <li key={idx} className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-start gap-2 leading-relaxed">
                        <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-emerald-100">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SEGMENT 2: FAQS & KNOWLEDGE ARTICLES */}
      {activeSegment === 'faq' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Query titles, tagging keywords, fallback filters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'getting-started', 'vouchers', 'ai-engines', 'security'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-3 mt-4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-sans">No articles match your filters</p>
                <p className="text-[10px] text-gray-400 mt-1">Try searching for other terms like 'limit', '9router', or 'suspense'</p>
              </div>
            ) : (
              filteredArticles.map(art => {
                const isExpanded = expandedArticle === art.id;
                return (
                  <div
                    key={art.id}
                    className={`border rounded-2xl transition-all ${
                      isExpanded
                        ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/10 dark:bg-blue-950/5'
                        : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedArticle(isExpanded ? null : art.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                            {art.category}
                          </span>
                          {art.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{art.title}</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{art.summary}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform mt-1 ${isExpanded ? 'rotate-90 text-blue-500' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-5 pt-1 border-t border-dashed border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed space-y-3 animate-in fade-in duration-200">
                        <div className="prose prose-sm dark:prose-invert">
                          <p>{art.content}</p>
                        </div>
                        <div className="flex gap-2 pt-2 flex-wrap">
                          {art.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-[10px] text-gray-500">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SEGMENT 3: MAPPING TRAINER SIMULATOR */}
      {activeSegment === 'trainer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-105 dark:bg-blue-950 rounded-2xl text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-gray-900 dark:text-indigo-200 tracking-wider">Map Trainer Simulator</h3>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest pl-0.5">Learn interactive sheet alignments</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
              Before the system can extract ledger records from Excel/CSV files, it matches sheet column names to internal accounting fields. Click a statement column on the left block then pair it on the ERP target list below to simulate:
            </p>

            <div className="border border-indigo-150/40 dark:border-indigo-900/30 bg-slate-50/50 dark:bg-gray-900/40 rounded-2xl p-5 space-y-5">
              
              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2 font-sans">
                  1. Choose a Statement column:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sampleColumns.map(col => {
                    const isMatched = !!matchedFields[col];
                    const isSelected = selectedCol === col;
                    return (
                      <button
                        key={col}
                        onClick={() => handleDragCol(col)}
                        disabled={isMatched}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-transparent scale-105 shadow-md shadow-indigo-100' 
                            : isMatched 
                              ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 border-emerald-100 dark:border-emerald-900/40' 
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                        }`}
                      >
                        {col} {isMatched ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2 font-sans">
                  2. Select matching ERP target field:
                </label>
                <div className="space-y-2">
                  {targetFields.map(field => {
                    const matchedColumn = Object.keys(matchedFields).find(k => matchedFields[k] === field.key);
                    const isTargetMatched = !!matchedColumn;
                    return (
                      <button
                        key={field.key}
                        onClick={() => handlePairFields(field.key)}
                        disabled={!selectedCol || isTargetMatched}
                        className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                          isTargetMatched 
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-600 border-emerald-150'
                            : selectedCol 
                              ? 'bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-slate-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-dashed border-indigo-200 animate-pulse' 
                              : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <span>{field.label}</span>
                        {isTargetMatched ? (
                          <span className="text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-700 uppercase">
                            ← {matchedColumn}
                          </span>
                        ) : selectedCol ? (
                          <ArrowRight className="w-4 h-4 text-indigo-400" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-indigo-100/50 dark:border-indigo-920 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Mapped {Object.keys(matchedFields).length} of {sampleColumns.length} fields
                </span>
                {Object.keys(matchedFields).length > 0 && (
                  <button
                    onClick={resetSimulator}
                    className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Trainer
                  </button>
                )}
              </div>

            </div>

            {Object.keys(matchedFields).length === sampleColumns.length && (
              <div className="bg-emerald-500/10 border border-emerald-200 rounded-3xl p-4 flex gap-3 text-emerald-700 dark:text-emerald-400 items-start animate-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wider">Perfect Alignment Learned!</p>
                  <p className="text-[11px] font-semibold leading-normal mt-0.5">
                    Bharat Book AI generates rules under **{"Mapping -> Mapping Rules"}** to save this alignment layout. Next uploads of this type clean columns in milliseconds.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-950 dark:text-white tracking-wider">Useful checklists</h4>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl flex gap-3 items-start">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-gray-850 dark:text-white uppercase tracking-tight">Ledger Auditing Guidelines</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-semibold leading-relaxed mt-0.5">
                      Double-check counterparty invoice references against real GST codes before posting imported vouchers into production ledger databases.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl flex gap-3 items-start">
                  <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-gray-850 dark:text-white uppercase tracking-tight">Operational Security Bounds</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-semibold leading-relaxed mt-0.5">
                      Users bound by workspace timeframes cannot log into portlets after corporate hours. If your terminal locks, request administrative changes immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
