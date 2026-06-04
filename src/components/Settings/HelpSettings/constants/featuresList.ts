import { 
  Building, Settings, Layers, FileCode, Printer, Sliders, Activity, 
  ArrowRight, Lock, ShieldCheck, Database, Cpu, RefreshCw 
} from 'lucide-react';
import { FeatureDefinition } from '../types';

export const FEATURES_LIST: FeatureDefinition[] = [
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
    name: 'Imports & Rules',
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
