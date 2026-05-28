import React, { useState } from 'react';
import { useLanguage } from "../../context/LanguageContext";
import { 
  HelpCircle, Search, BookOpen, Sparkles, ChevronRight, CheckCircle, ArrowRight, 
  ShieldCheck, Database, RefreshCw, Settings, Sliders, Activity, Lock, Layers, 
  Cpu, FileCode, Check, AlertTriangle, Building, Globe, Mail, Printer, LayoutGrid, Eye, HelpCircle as HelpIcon, Clock 
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
  const { t } = useLanguage();
  const [activeSegment, setActiveSegment] = useState<'faq' | 'explorer' | 'trainer'>('explorer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  // Explorer Tab State
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [explorerGroups, setExplorerGroups] = useState({ config: false, data: false, security: false });
  const toggleExpGroup = (g: 'config' | 'data' | 'security') => setExplorerGroups(p => ({ ...p, [g]: !p[g] }));
  const [testUserRole, setTestUserRole] = useState<string>('Accountant');

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
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("Help Center")}</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Knowledge Hub & Intelligent Manual")}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-2 w-full md:w-auto mt-3 md:mt-0">
          <div className="flex items-center justify-between md:justify-start gap-2 font-mono text-[10px] bg-gray-50 dark:bg-gray-800/50 px-3 py-2 md:py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shrink-0">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">{t("BHARAT BOOK")}</span>
            <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-700 pl-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
              <span className="text-gray-700 dark:text-gray-300 font-bold tracking-tight">{t("SECURE MODE")}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0 gap-1 shadow-sm md:shadow-none">
             <button
               onClick={() => setActiveSegment('explorer')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeSegment === 'explorer' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Settings className="w-3 h-3" /> {t("Explorer")}
             </button>
             <button
               onClick={() => setActiveSegment('trainer')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeSegment === 'trainer' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <Sparkles className="w-3 h-3" /> {t("Trainer")}
             </button>
             <button
               onClick={() => setActiveSegment('faq')}
               className={`flex items-center gap-1.5 px-2 py-1.5 md:py-1 md:min-w-[90px] justify-center rounded-md text-[11px] font-bold transition-all ${
                 activeSegment === 'faq' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
               }`}
             >
               <BookOpen className="w-3 h-3" /> {t("Knowledge")}
             </button>
          </div>
        </div>
      </div>

      {/* SEGMENT 1: PREFERENCES EXPLORER */}
      {activeSegment === 'explorer' && (
        <div className="space-y-5">
          {/* Group 1: Configuration & UI */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${explorerGroups.config ? 'border-blue-200 dark:border-blue-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
             <button 
                onClick={() => toggleExpGroup('config')}
                className="w-full flex items-center justify-between p-5 focus:outline-none"
             >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg transition-colors ${explorerGroups.config ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
                      <Settings className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                      <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Configuration & UI")}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Firm Setup, Numbers & Visuals")}</p>
                   </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${explorerGroups.config ? 'rotate-90 text-blue-500' : ''}`} />
             </button>
             {explorerGroups.config && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                   {FEATURES_LIST.filter(f => ['firm', 'general', 'vouchernumbering', 'invoiceprint', 'navigation'].includes(f.id)).map(feat => {
                     const isExpanded = selectedFeatureId === feat.id;
                     const FeatureIcon = feat.icon;
                     return (
                        <div key={feat.id} className={`border rounded-lg transition-colors ${isExpanded ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-blue-200 cursor-pointer'}`}>
                           {/* Item button */}
                           <button onClick={() => setSelectedFeatureId(isExpanded ? '' : feat.id)} className="w-full p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none">
                              <div className="flex items-center gap-3">
                                 <div className={`p-2.5 rounded-md transition-colors ${isExpanded ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'}`}><FeatureIcon className="w-5 h-5" /></div>
                                 <div className="text-left">
                                    <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{feat.name}</h4>
                                 </div>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-blue-500' : ''}`} />
                           </button>
                           {/* Item details */}
                           {isExpanded && (
                              <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-3">
                                 <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{feat.description}</p>
                                 <div className="p-3 bg-white dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 font-semibold"><span className="font-bold uppercase text-[9px] text-blue-600 block mb-1">Concept:</span>{feat.concept}</div>
                              </div>
                           )}
                        </div>
                     );
                   })}
                </div>
             )}
          </div>

          {/* Group 2: Data & Imports */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${explorerGroups.data ? 'border-indigo-200 dark:border-indigo-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
             <button 
                onClick={() => toggleExpGroup('data')}
                className="w-full flex items-center justify-between p-5 focus:outline-none"
             >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg transition-colors ${explorerGroups.data ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'}`}>
                      <Database className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                      <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Data & Imports")}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Schemas, Aliases & AI Engine")}</p>
                   </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${explorerGroups.data ? 'rotate-90 text-indigo-500' : ''}`} />
             </button>
             {explorerGroups.data && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                   {FEATURES_LIST.filter(f => ['imports', 'mapping', 'ai', 'data', 'formdetails'].includes(f.id)).map(feat => {
                     const isExpanded = selectedFeatureId === feat.id;
                     const FeatureIcon = feat.icon;
                     return (
                        <div key={feat.id} className={`border rounded-lg transition-colors ${isExpanded ? 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200 cursor-pointer'}`}>
                           {/* Item button */}
                           <button onClick={() => setSelectedFeatureId(isExpanded ? '' : feat.id)} className="w-full p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none">
                              <div className="flex items-center gap-3">
                                 <div className={`p-2.5 rounded-md transition-colors ${isExpanded ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'}`}><FeatureIcon className="w-5 h-5" /></div>
                                 <div className="text-left">
                                    <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{feat.name}</h4>
                                 </div>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                           </button>
                           {/* Item details */}
                           {isExpanded && (
                              <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-3">
                                 <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{feat.description}</p>
                                 <div className="p-3 bg-white dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 font-semibold"><span className="font-bold uppercase text-[9px] text-indigo-600 block mb-1">Concept:</span>{feat.concept}</div>
                              </div>
                           )}
                        </div>
                     );
                   })}
                </div>
             )}
          </div>

          {/* Group 3: Security & Admins */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${explorerGroups.security ? 'border-amber-200 dark:border-amber-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
             <button 
                onClick={() => toggleExpGroup('security')}
                className="w-full flex items-center justify-between p-5 focus:outline-none"
             >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg transition-colors ${explorerGroups.security ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                      <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Security & Access")}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Privacy, Alerts & Directory")}</p>
                   </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${explorerGroups.security ? 'rotate-90 text-amber-500' : ''}`} />
             </button>
             {explorerGroups.security && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
                   {FEATURES_LIST.filter(f => ['users', 'alerts', 'security', 'privacy', 'admin'].includes(f.id)).map(feat => {
                     const isExpanded = selectedFeatureId === feat.id;
                     const FeatureIcon = feat.icon;
                     return (
                        <div key={feat.id} className={`border rounded-lg transition-colors ${isExpanded ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-amber-200 cursor-pointer'}`}>
                           {/* Item button */}
                           <button onClick={() => setSelectedFeatureId(isExpanded ? '' : feat.id)} className="w-full p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 focus:outline-none">
                              <div className="flex items-center gap-3">
                                 <div className={`p-2.5 rounded-md transition-colors ${isExpanded ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-amber-600 dark:text-amber-400'}`}><FeatureIcon className="w-5 h-5" /></div>
                                 <div className="text-left">
                                    <h4 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{feat.name}</h4>
                                 </div>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-amber-500' : ''}`} />
                           </button>
                           {/* Item details */}
                           {isExpanded && (
                              <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-3">
                                 <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{feat.description}</p>
                                 <div className="p-3 bg-white dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 font-semibold"><span className="font-bold uppercase text-[9px] text-amber-600 block mb-1">Concept:</span>{feat.concept}</div>
                              </div>
                           )}
                        </div>
                     );
                   })}
                </div>
             )}
          </div>
        </div>
      )}

      {/* SEGMENT 2: FAQS & KNOWLEDGE ARTICLES */}
      {activeSegment === 'faq' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Query titles, tagging keywords, fallback filters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900/50 text-[12px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 shadow-sm"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x">
              {['all', 'getting-started', 'vouchers', 'ai-engines', 'security'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 snap-center ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-2.5 mt-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-sans">{t("No matching articles")}</p>
                <p className="text-[10px] text-gray-400 mt-1">{t("Try another search term")}</p>
              </div>
            ) : (
              filteredArticles.map(art => {
                const isExpanded = expandedArticle === art.id;
                return (
                  <div
                    key={art.id}
                    className={`border rounded-lg transition-all ${
                      isExpanded
                        ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/10 dark:bg-blue-950/5 shadow-sm'
                        : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedArticle(isExpanded ? null : art.id)}
                      className="w-full p-3.5 text-left flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                            {art.category}
                          </span>
                        </div>
                        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mt-1 leading-tight">{art.title}</h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-0.5 max-w-[95%]">{art.summary}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform mt-1 shrink-0 ${isExpanded ? 'rotate-90 text-blue-500' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-4 pt-2 mb-2 border-t border-dashed border-gray-100 dark:border-gray-700 text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium space-y-3 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-900 p-4 border border-blue-50 dark:border-blue-900/20 rounded-md">
                          <p>{art.content}</p>
                        </div>
                        <div className="flex gap-2 pt-1 flex-wrap">
                          {art.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-[10px] uppercase font-bold text-gray-500">
                              #{t}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-4">
            
            {/* Feature 1: Mapping Trainer */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'mapping' ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'mapping' ? '' : 'mapping')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'mapping' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-blue-600'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Map Trainer Simulator")}</h4>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">{t("Learn interactive sheet alignments")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'mapping' ? 'rotate-90 text-blue-500' : ''}`} />
              </button>

              {selectedTrainerId === 'mapping' && (
              <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-4">
                <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                  Before the system can extract ledger records from Excel/CSV files, it matches sheet column names to internal accounting fields. Click a statement column on the left block then pair it on the ERP target list below to simulate:
                </p>

                <div className="border border-indigo-150/40 dark:border-indigo-900/30 bg-slate-50/50 dark:bg-gray-900/40 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-2 font-sans">
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
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-indigo-600 text-white border-transparent scale-105 shadow-sm shadow-indigo-100' 
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
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-2 font-sans">
                      2. Select matching ERP target field:
                    </label>
                    <div className="space-y-1.5">
                      {targetFields.map(field => {
                        const matchedColumn = Object.keys(matchedFields).find(k => matchedFields[k] === field.key);
                        const isTargetMatched = !!matchedColumn;
                        return (
                          <button
                            key={field.key}
                            onClick={() => handlePairFields(field.key)}
                            disabled={!selectedCol || isTargetMatched}
                            className={`w-full p-2.5 rounded-lg text-left text-[12px] font-semibold flex items-center justify-between border transition-all ${
                              isTargetMatched 
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-600 border-emerald-150'
                                : selectedCol 
                                  ? 'bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-slate-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-dashed border-indigo-200 animate-pulse' 
                                  : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <span>{field.label}</span>
                            {isTargetMatched ? (
                              <span className="text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded-sm text-emerald-700 uppercase">
                                ← {matchedColumn}
                              </span>
                            ) : selectedCol ? (
                              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-indigo-100/50 dark:border-indigo-920 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Mapped {Object.keys(matchedFields).length} of {sampleColumns.length} fields
                    </span>
                    {Object.keys(matchedFields).length > 0 && (
                      <button
                        onClick={resetSimulator}
                        className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> {t("Reset")}
                      </button>
                    )}
                  </div>
                </div>

                {Object.keys(matchedFields).length === sampleColumns.length && (
                  <div className="bg-emerald-500/10 border border-emerald-200 rounded-xl p-3.5 flex gap-2 text-emerald-700 dark:text-emerald-400 items-start animate-in zoom-in duration-300 mt-4">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider">{t("Perfect Alignment Learned!")}</p>
                      <p className="text-[10px] font-semibold leading-normal mt-0.5">
                        Bharat Book AI generates rules under **{"Mapping -> Mapping Rules"}** to save this alignment layout. Next uploads format instantly.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
            
            {/* Feature 2: Ledger Reconciliation */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'ledger' ? 'border-purple-200 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'ledger' ? '' : 'ledger')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'ledger' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-purple-600'}`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Ledger Reconciliation Trainer")}</h4>
                    <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-0.5">{t("Learn how vouchers get mapped")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'ledger' ? 'rotate-90 text-purple-500' : ''}`} />
              </button>
              
              {selectedTrainerId === 'ledger' && (
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                    {t("The AI matches raw bank transaction narratives strings against your Chart of Accounts. Here, you can test how the matching logic works behind the scenes before uploading files.")}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                       <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Raw Narration Input:</label>
                       <input 
                         type="text" 
                         value={rawNarration} 
                         onChange={(e) => setRawNarration(e.target.value)}
                         className="w-full rounded text-[13px] font-mono p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none flex items-center" 
                         placeholder="e.g. UPI/9812/DR-NET/CHQ/HDFC-OFFICE-RENT"
                       />
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-100 dark:border-purple-900">
                       <label className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400 block mb-2">Simulated Neural Match Result:</label>
                       {rawNarration.toUpperCase().includes('RENT') ? (
                          <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-emerald-500" />
                             <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200">Office Rent Account (Indirect Expense)</span>
                             <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase shadow-sm">98% Match</span>
                          </div>
                       ) : rawNarration.toUpperCase().includes('UPI') ? (
                          <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-blue-500" />
                             <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200">Suspense / Undefined UPI (Current Asset)</span>
                             <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase shadow-sm">65% Match</span>
                          </div>
                       ) : (
                          <div className="flex items-center gap-2">
                             <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">{t("No strong match found. Requires manual mapping.")}</span>
                             <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-black uppercase shadow-sm">12% Match</span>
                          </div>
                       )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Feature 3: Security Rules */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'security' ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'security' ? '' : 'security')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'security' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-amber-600'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Security Rules Trainer")}</h4>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-0.5">{t("Simulate role access boundaries")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'security' ? 'rotate-90 text-amber-500' : ''}`} />
              </button>
              
              {selectedTrainerId === 'security' && (
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                    {t("Users have different permission layers when dealing with vouchers, masters, and settings. Simulate access levels by switching the active user role below.")}
                  </p>
                  
                  <div className="mb-4">
                     <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate Active Role:</label>
                     <div className="flex gap-2">
                        {['Accountant', 'Manager', 'Administrator'].map(role => (
                           <button 
                             key={role}
                             onClick={() => setTestUserRole(role)}
                             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === role ? 'bg-amber-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                           >
                             {role}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{t("Draft Vouchers")}</span>
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">{t("Allowed")}</span>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{t("Post Vouchers to Production")}</span>
                        {testUserRole === 'Accountant' ? (
                           <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-[10px] font-black uppercase">{t("Denied")}</span>
                        ) : (
                           <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">{t("Allowed")}</span>
                        )}
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{t("Modify GST / System Settings")}</span>
                        {testUserRole === 'Administrator' ? (
                           <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">{t("Allowed")}</span>
                        ) : (
                           <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-[10px] font-black uppercase">{t("Denied")}</span>
                        )}
                     </div>
                  </div>
                </div>
              )}
            </div>


            {/* Feature 4: Confidence Score Threshold */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'confidence' ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'confidence' ? '' : 'confidence')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'confidence' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-emerald-600'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("AI Confidence Thresholds")}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Auto-Approval Logic")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'confidence' ? 'rotate-90 text-emerald-500' : ''}`} />
              </button>
              
              {selectedTrainerId === 'confidence' && (
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                    {t("The AI engine assigns a confidence score to every ledger prediction. If the score is higher than your firm's threshold, it goes to \"Auto-Approve\". Otherwise, it routes to \"Requires Manual Review\".")}
                  </p>
                  
                  <div className="mb-4">
                     <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate System Threshold:</label>
                     <div className="flex gap-2 mb-4">
                        {[50, 75, 90, 95].map(threshold => (
                           <button 
                             key={threshold}
                             onClick={() => setTestUserRole(`Threshold${threshold}`)}
                             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === `Threshold${threshold}` ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                           >
                             {threshold}%
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { txt: 'HDFC BANK FUND TRANSFER', score: 98 },
                      { txt: 'AMAZON WEB SERVICES CC ENDING 4022', score: 85 },
                      { txt: 'SWIGGY FOOD ORDER', score: 65 },
                      { txt: 'CASH DEPOSIT BRANCH 1234', score: 45 },
                    ].map(mockTx => {
                       const currentThreshMatch = testUserRole.startsWith('Threshold') ? parseInt(testUserRole.replace('Threshold', '')) : 75;
                       const isApproved = mockTx.score >= currentThreshMatch;
                       return (
                         <div key={mockTx.txt} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div>
                               <div className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{mockTx.txt}</div>
                               <div className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">Score: {mockTx.score}%</div>
                            </div>
                            {isApproved ? (
                               <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase shadow-sm">{t("Auto-Approve")}</span>
                            ) : (
                               <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase shadow-sm">{t("Manual Review")}</span>
                            )}
                         </div>
                       );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Feature 5: Shift Boundaries Simulator */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'shift' ? 'border-fuchsia-200 dark:border-fuchsia-900/50 bg-fuchsia-50/20 dark:bg-fuchsia-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'shift' ? '' : 'shift')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'shift' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-fuchsia-600'}`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Shift Constraint Simulator")}</h4>
                    <p className="text-[10px] text-fuchsia-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Temporal Access Rules")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'shift' ? 'rotate-90 text-fuchsia-500' : ''}`} />
              </button>
              
              {selectedTrainerId === 'shift' && (
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                    {t("The enterprise shield enforces shift constraints (e.g. 09:00 to 18:00 on Weekdays only). Test how the application responds when attempting to post vouchers outside simulated operational hours.")}
                  </p>
                  
                  <div className="mb-4">
                     <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate Current Time:</label>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { label: 'Weekday 10:00 AM', val: 'wd_10am' },
                          { label: 'Weekday 07:30 PM', val: 'wd_730pm' },
                          { label: 'Sunday 02:00 PM', val: 'we_2pm' },
                        ].map(st => (
                           <button 
                             key={st.val}
                             onClick={() => setTestUserRole(st.val)}
                             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === st.val ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                           >
                             {st.label}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="space-y-4 pt-2 border-t border-fuchsia-100 dark:border-fuchsia-900 border-dashed">
                    {testUserRole === 'wd_10am' || (!['wd_10am', 'wd_730pm', 'we_2pm'].includes(testUserRole)) ? (
                       <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Shift Active")}</div>
                            <div className="text-[11px] mt-1 font-semibold">{t("User can post entries, mapping rules, and run auto-imports smoothly. Full API access is granted.")}</div>
                          </div>
                       </div>
                    ) : testUserRole === 'wd_730pm' ? (
                       <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-start gap-3">
                          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("After-Hours Boundary Hit")}</div>
                            <div className="text-[11px] mt-1 font-semibold">Access restricted. System generates an Audit Incident log (Severity: Medium) - "Posting attempt outside user shift."</div>
                          </div>
                       </div>
                    ) : (
                       <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Weekend Lockdown Active")}</div>
                            <div className="text-[11px] mt-1 font-semibold">{t("The UI falls into Read-Only mode. High-Security lockdown triggered for weekend.")}</div>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Feature 6: Notification Routing Simulator */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'notifications' ? 'border-sky-200 dark:border-sky-900/50 bg-sky-50/20 dark:bg-sky-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'notifications' ? '' : 'notifications')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'notifications' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-sky-600'}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Alert Routing Simulator")}</h4>
                    <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Auto-Email Dispatches")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'notifications' ? 'rotate-90 text-sky-500' : ''}`} />
              </button>
              
              {selectedTrainerId === 'notifications' && (
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                    {t("The platform automatically dispatches emails to management upon large volume imports or suspicious voucher creation. Test the routing logic here.")}
                  </p>
                  
                  <div className="mb-4">
                     <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate System Event:</label>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { label: 'Bulk Import 500+', val: 'event_bulk' },
                          { label: 'Nightly Sync Complete', val: 'event_sync' },
                          { label: 'High-Value Voucher Detected', val: 'event_highval' },
                        ].map(st => (
                           <button 
                             key={st.val}
                             onClick={() => setTestUserRole(st.val)}
                             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === st.val ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                           >
                             {st.label}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="space-y-4 pt-2 border-t border-sky-100 dark:border-sky-900 border-dashed">
                    {testUserRole === 'event_bulk' ? (
                       <div className="p-3 rounded-lg border border-sky-200 bg-sky-50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-400 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Email Routed: Admin Team")}</div>
                            <div className="text-[11px] mt-1 font-semibold">Subject: "Bulk Import Alert: 500+ records successfully mapped."</div>
                          </div>
                       </div>
                    ) : testUserRole === 'event_sync' ? (
                       <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Silent Notification")}</div>
                            <div className="text-[11px] mt-1 font-semibold">{t("Logged to Audit table, no emails dispatched per preference settings.")}</div>
                          </div>
                       </div>
                    ) : testUserRole === 'event_highval' ? (
                       <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Email Routed: Finance Directors")}</div>
                            <div className="text-[11px] mt-1 font-semibold">Subject: "CRITICAL: High-Value Voucher over threshold requires multi-signature."</div>
                          </div>
                       </div>
                    ) : (
                       <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                          <div className="text-[11px] font-bold uppercase tracking-wider">{t("Select an event")}</div>
                       </div>
                    )}
                  </div>
                </div>
              )}
            </div>


            {/* Feature 7: Validation Schema Simulator */}
            <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'validation' ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50/20 dark:bg-orange-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <button 
                onClick={() => setSelectedTrainerId(selectedTrainerId === 'validation' ? '' : 'validation')}
                className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'validation' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-orange-600'}`}>
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Validation Schema Simulator")}</h4>
                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Ledger Data Integrity Checks")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'validation' ? 'rotate-90 text-orange-500' : ''}`} />
              </button>
              
              {selectedTrainerId === 'validation' && (
                <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                    {t("The platform rejects invalid voucher lines. Test the JSON schema validation mechanisms used to reject corrupt CSV records.")}
                  </p>
                  
                  <div className="mb-4">
                     <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate Raw Record payload:</label>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { label: 'Valid Record', val: 'rec_valid' },
                          { label: 'Missing Amount', val: 'rec_noamt' },
                          { label: 'Date Out of Sync', val: 'rec_baddate' },
                        ].map(st => (
                           <button 
                             key={st.val}
                             onClick={() => setTestUserRole(st.val)}
                             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === st.val ? 'bg-orange-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                           >
                             {st.label}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="space-y-4 pt-2 border-t border-orange-100 dark:border-orange-900 border-dashed">
                    {testUserRole === 'rec_valid' ? (
                       <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Record Passed")}</div>
                            <div className="text-[11px] mt-1 font-semibold">{t("Schema valid. The voucher is correctly formatted and goes into processing queue.")}</div>
                          </div>
                       </div>
                    ) : testUserRole === 'rec_noamt' ? (
                       <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Schema Error: Missing Required Field")}</div>
                            <div className="text-[11px] mt-1 font-semibold">Row 45: property `amount` is undefined or non-numeric. Import paused.</div>
                          </div>
                       </div>
                    ) : testUserRole === 'rec_baddate' ? (
                       <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-wider">{t("Constraint Error: Out of bounds")}</div>
                            <div className="text-[11px] mt-1 font-semibold">Row 112: The `txn_date` field is from a closed financial year (2020-2021). Rejected.</div>
                          </div>
                       </div>
                    ) : (
                       <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                          <div className="text-[11px] font-bold uppercase tracking-wider">{t("Select a raw payload")}</div>
                       </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
          
      {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 space-y-3">
              <h4 className="text-[12px] font-bold uppercase text-gray-950 dark:text-white tracking-wider">{t("Useful checklists")}</h4>
              
              <div className="space-y-2">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
                  <Mail className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("Email Recipient Audit")}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                      {t("Periodically review who is receiving the \"High-Value Voucher\" alerts to ensure correct hierarchy.")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
                  <LayoutGrid className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("Schema Error Review")}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                      {t("Monitor schema constraints rejection rates to identify if user training on templates is required.")}
                    </p>
                  </div>
                </div>
                
                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("AI Confidence Checks")}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                      {t("Routinely scan the \"Manual Review\" queue to train the AI and improve auto-approval precision.")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
                  <Lock className="w-3.5 h-3.5 text-fuchsia-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("Shift Boundary Audit")}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                      {t("Verify incident logs frequently if users attempt to bypass temporal shift barriers during weekends.")}
                    </p>
                  </div>
                </div>
                
                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
                  <Database className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("Ledger Auditing")}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                      {t("Double-check counterparty invoice references before posting vouchers.")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("Security Bounds")}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                      {t("Users restricted by timeframes cannot operate outside corporate hours.")}
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
