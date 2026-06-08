import React, { useState } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { HelpCircle, Shield, Sliders, UserCheck, Compass, SlidersHorizontal, Lock, Users, ChevronRight, Activity, BookOpen, Database, RefreshCw, Sparkles } from 'lucide-react';

interface UserHelpTabProps {
  searchTerm?: string;
}

export const UserHelpTab: React.FC<UserHelpTabProps> = ({ searchTerm = "" }) => {
  const { t, formatNumber } = useLanguage();
  // Sub-pages state
  const [activeTab, setActiveTab] = useState<'guides' | 'sandbox' | 'reference'>('guides');

  // Calculator Form State
  const [testRole, setTestRole] = useState<'Accountant' | 'Auditor' | 'Partner' | 'Guest'>('Accountant');
  const [testDept, setTestDept] = useState<'Finance' | 'Executive' | 'Operations' | 'Audit'>('Finance');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    faq: false,
    sandbox: false,
    roles: false,
    audit: false,
    troubleshooting: false,
    onboarding: false,
    importMappingWorkflow: false,
    aiMappingRules: false,
    reconciliationFails: false,
    systemCompliance: false
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = !!prev[key];
      const next: Record<string, boolean> = {};
      Object.keys(prev).forEach(k => {
        next[k] = false;
      });
      next[key] = !isCurrentlyExpanded;
      return next;
    });
  };

  const adminHelpData = [
    {
      id: 1,
      type: "Use Case",
      title: "Creating a Data Entry Clerk",
      content: "To create a profile that can only import and view vouchers but not approve or edit masters: Set the role to 'Accountant' and manually customize their profile by disabled 'Edit' and 'Delete' permissions across all schemas. Ensure MFA approval is enabled so their imports require manager sign-off.",
    },
    {
      id: 2,
      type: "Use Case",
      title: "Handling Department Transfers",
      content: "When an employee moves from 'Operations' to 'Finance', simply update their Department assigned in the Company Directory. The system automatically recalculates their policy matrix, immediately relaxing their upload limits and expanding their operational boundaries based on Finance group rules.",
    },
    {
      id: 3,
      type: "Use Case",
      title: "Revoking Access for Departures",
      content: "Immediately revoke access without deleting history by toggling the 'Account Status' to Suspended. This preserves their full upload trails and mapping templates for audit continuity, but severs their ability to log in.",
    },
    {
      id: 4,
      type: "Use Case",
      title: "Delegating Approval Authority",
      content: "If a manager is on short leave, assign a temporary 'Approval Delegate' role to a trusted senior team member within the same department. Make sure to set a specific expiration date or temporary spending cap on their override policy.",
    },
    {
      id: 5,
      type: "Use Case",
      title: "Troubleshooting 'Limit Exceeded' Errors",
      content: "Check the Sandbox matrix first. The user might have exceeded their daily upload quota or hit a single transaction cap defined restrictively by their department limits vs their assigned role. Review the 'Effective Bounds' simulator.",
    },
    {
      id: 6,
      type: "Use Case",
      title: "Managing External Auditors",
      content: "Assign external contract auditors the 'Auditor' role and limit their access strictly to the 'Audit' department. They can view statements safely and pull reports without any write or destructive permissions.",
    },
    {
      id: 7,
      type: "FAQ",
      title: "How do I restrict a user to read-only?",
      content: "Modify the user profile role to 'Guest' or set up a custom Department matrix under 'Group Rules'. Read-only is enforced by clearing 'Create', 'Edit', and 'Delete' checklist markers across Vouchers and Master schemas.",
    },
    {
      id: 8,
      type: "FAQ",
      title: "Why are role and dept rules combined restrictively?",
      content: "To prevent unauthorized security bypasses. If an Accountant (Role allowed max 5 Lakhs single limit) works in the Sales Department (Dept allowed max 2 Lakhs single limit), their effective capability is constrained to the lowest denominator (2 Lakhs maximum transactions).",
    },
    {
      id: 9,
      type: "FAQ",
      title: "How to manage staff linked accounts?",
      content: "In the Company Directory, click on any team member's card. Scroll to the 'Linked Staff Account' section, and map them to your designated Ledger/Contact Account. This links Excel importing statements directly under their operational entity.",
    },
    {
      id: 10,
      type: "Use Case",
      title: "Handling Temporary Holiday Access",
      content: "For users needing temporary elevated access during holiday seasons or tax deadlines, update their Department to one with higher limits and ensure an end date is tracked manually. When they report back, restore the Department.",
    },
    {
      id: 11,
      type: "FAQ",
      title: "What happens when a user forgets their MFA?",
      content: "Administrators can initiate an MFA reset link from the 'User Security' tab. This will prompt the user to register a new authenticator device upon their next login attempt.",
    },
    {
      id: 12,
      type: "Use Case",
      title: "Mapping Bulk Ledger Data Imports",
      content: "If a user is tasked with bulk migrating old legacy software datasets, set their role temporarily to 'Partner' to bypass transaction caps during the weekend or migration window, and then revert the role to 'Accountant' once verified.",
    }
  ];

  // Interactive permission evaluation simulation
  const evaluateMockPolicy = (role: string, dept: string) => {
    // Mimic the policy rules resolved restrictively from security.ts
    let maxTx = 500000; // 5 Lakhs fallback
    let dailyVoucher = 50; 
    let hoursStr = "Business Hours (09:00 AM - 06:00 PM)";
    let mfa = true;

    if (role === 'Partner' || dept === 'Executive') {
      maxTx = 0; // unlimited
      dailyVoucher = 0; // unlimited
      hoursStr = "Anytime (24/7 Portal Access)";
      mfa = false;
    } else if (role === 'Auditor' || dept === 'Audit') {
      maxTx = 1000000; // 10 Lakhs
      dailyVoucher = 200;
      hoursStr = "Weekdays Only (Mon-Fri)";
      mfa = true;
    } else if (role === 'Guest') {
      maxTx = 0; // blocked upload
      dailyVoucher = 0; // blocked upload
      hoursStr = "Business Hours (09:00 AM - 06:00 PM)";
      mfa = false;
    } else {
      // Accountant
      maxTx = 500000;
      dailyVoucher = 100;
      hoursStr = "Business Hours (09:00 AM - 06:00 PM)";
      mfa = true;
    }

    // Role-matrix
    const perms = {
      vouchers: { read: true, create: role !== 'Guest', edit: role === 'Accountant' || role === 'Partner', delete: role === 'Partner' },
      masters: { read: true, create: role === 'Partner', edit: role === 'Partner', delete: false },
      reports: { read: role !== 'Guest', create: false, edit: false, delete: false },
    };

    return { maxTx, dailyVoucher, hoursStr, mfa, perms };
  };

  const currentPolicy = evaluateMockPolicy(testRole, testDept);

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Sub-pages Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap rounded-t-lg border-b-2 ${activeTab === 'guides' ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
        >
          {t("Guides & FAQ")}
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap rounded-t-lg border-b-2 ${activeTab === 'sandbox' ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
        >
          {t("Security Sandbox")}
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap rounded-t-lg border-b-2 ${activeTab === 'reference' ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
        >
          {t("Admin Reference")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'guides' && (
            <>
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.faq ? 'border-indigo-200 dark:border-indigo-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('faq')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.faq ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Admin FAQ & Instructions")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Common questions and practical use cases")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.faq ? 'rotate-90 text-indigo-500' : ''}`} />
            </button>

            {expandedSections.faq && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-2.5">
                  {adminHelpData.map(item => {
                    const isExpanded = expandedFaq === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`border rounded-lg transition-all ${
                          isExpanded
                            ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/10 dark:bg-indigo-950/5 shadow-sm'
                            : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : item.id)}
                          className="w-full px-3.5 py-3 text-left flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1 pr-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${item.type === 'Use Case' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-slate-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}`}>
                              {t(item.type)}
                            </span>
                            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mt-1.5 leading-tight">{t(item.title)}</h3>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform mt-1.5 shrink-0 ${isExpanded ? 'rotate-90 text-indigo-500' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 mb-1 border-t border-dashed border-gray-100 dark:border-gray-700 text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium space-y-3 animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-gray-900 p-3.5 border border-indigo-50 dark:border-indigo-900/20 rounded-md">
                              <p>{t(item.content)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.importMappingWorkflow ? 'border-indigo-200 dark:border-indigo-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('importMappingWorkflow')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.importMappingWorkflow ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'}`}>
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Import Mapping & Data Integrity Protocols")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Advanced alignment manual, OCR parser specs, and schema integration")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.importMappingWorkflow ? 'rotate-90 text-indigo-500' : ''}`} />
            </button>

            {expandedSections.importMappingWorkflow && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200 space-y-4">
                
                {/* Step list info */}
                <div className="bg-slate-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 space-y-3">
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> {t("Core Import Pipeline Lifecycle")}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-gray-905 rounded-lg border border-gray-150 dark:border-gray-800">
                      <span className="font-bold text-gray-900 dark:text-white block mb-1">{t("1. Format Ingestion")}</span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">{t("Drag-and-drop CSV transcripts or legacy JSON schemas into the Import handler. Raw buffers encode character streams into local heap memory.")}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-905 rounded-lg border border-gray-150 dark:border-gray-800">
                      <span className="font-bold text-gray-900 dark:text-white block mb-1">{t("2. OCR Narration Matching")}</span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">{t("Our AI pattern matching scans narrations for key vendor strings (e.g. GST, Swiggy, Fuel) and pairs them with mapped ledger accounts.")}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-905 rounded-lg border border-gray-150 dark:border-gray-800">
                      <span className="font-bold text-gray-900 dark:text-white block mb-1">{t("3. Policy Validation")}</span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">Resolves limits, role clearance, and locking dates. Safe items commit instantly; over-limit items route as pending authorizations.</p>
                    </div>
                  </div>
                </div>

                {/* Schema specifications */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black uppercase text-gray-700 dark:text-gray-300 tracking-wider">File Format Layout Standard:</h5>
                  <div className="border border-gray-200 dark:border-gray-700/80 rounded-lg overflow-x-auto custom-scrollbar text-[11px] font-mono">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-4 bg-gray-50 dark:bg-gray-900 p-3.5 font-bold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700/80">
                        <div>{t("CSV Header Key")}</div>
                        <div>{t("Required Type")}</div>
                        <div>{t("Fallback Behavior")}</div>
                        <div>{t("Operational Description")}</div>
                      </div>
                      <div className="divide-y divide-gray-150 dark:divide-gray-800/60 bg-white dark:bg-gray-850 text-gray-600 dark:text-gray-400 font-medium">
                        <div className="grid grid-cols-4 p-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">{t("VoucherNo / ID")}</div>
                          <div>String (Alphanumeric)</div>
                          <div>{t("UUID auto-generation")}</div>
                          <div>{t("Unique voucher indexing number key")}</div>
                        </div>
                        <div className="grid grid-cols-4 p-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">Voucher_Date</div>
                          <div>Date (YYYY-MM-DD)</div>
                          <div>{t("Current System Date")}</div>
                          <div>{t("Fiscallity and timeframe lock checking")}</div>
                        </div>
                        <div className="grid grid-cols-4 p-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">Dr_Ledger</div>
                          <div>String (Existing Ledger)</div>
                          <div>"Sundry Balance Root"</div>
                          <div>{t("Debit targeting ledger account matching")}</div>
                        </div>
                        <div className="grid grid-cols-4 p-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">Cr_Ledger</div>
                          <div>String (Existing Ledger)</div>
                          <div>"Suspense Account"</div>
                          <div>{t("Credit targeting ledger account matching")}</div>
                        </div>
                        <div className="grid grid-cols-4 p-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">{t("Amount")}</div>
                          <div>{t("Number / Decimal")}</div>
                          <div>{t("Blocked / Error")}</div>
                          <div>Monetary size check (in INR Lakhs)</div>
                        </div>
                        <div className="grid grid-cols-4 p-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">Narration_String</div>
                          <div>String (Text field)</div>
                          <div>"Direct Import Entry"</div>
                          <div>{t("Inputs semantic labels for auto-rules")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exception handling guide */}
                <div className="border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/10 dark:bg-indigo-950/10 p-4 rounded-xl space-y-2">
                  <h6 className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> {t("High-Consequences Mappings Precautions")}
                  </h6>
                  <ul className="list-disc list-inside text-[11px] text-gray-600 dark:text-gray-400 space-y-1.5">
                    <li><strong className="text-gray-800 dark:text-gray-200">Double ledger mapping avoidance:</strong> {t("Never upload sheets where the debit and credit sides refer to the same active ledger entity, as it nullifies double-entry ledger parity checks.")}</li>
                    <li><strong className="text-gray-800 dark:text-gray-200">GST rates matching logic:</strong> When importing transactions containing tax tags, the rate parsed MUST match the master configuration (0%, 5%, 12%, 18%, or 28%). Custom fractional GST tax tags throw exceptions.</li>
                    <li><strong className="text-gray-800 dark:text-gray-200">Cross-Department balance limits:</strong> {t("Imported statements cannot forcefully overdraw a department's total daily spending cap unless they are queued-into partner escrow for administrative overriding.")}</li>
                  </ul>
                </div>

              </div>
            )}
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.aiMappingRules ? 'border-amber-200 dark:border-amber-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('aiMappingRules')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.aiMappingRules ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("AI Auto-Mapping & OCR Custom Rules Guide")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Automated narration parsers, regex matches, and taxonomy classifications")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.aiMappingRules ? 'rotate-90 text-amber-500' : ''}`} />
            </button>

            {expandedSections.aiMappingRules && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200 space-y-4">
                <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                  {t("The artificial intelligence workflow evaluates imports by processing standard banking memo text strings and mapping them directly to the matching company ledger cards. The rules use both machine learning weights and deterministic partner overlays to ensure seamless automated double entry.")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-100 dark:border-gray-750/70 p-3.5 rounded-lg bg-gray-50/50 dark:bg-gray-900/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">{t("Automated Keyword Maps")}</span>
                    <ul className="space-y-2 text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      <li>• <strong className="text-gray-800 dark:text-gray-200">Travel Expenses:</strong> {t("Picks up phrases matching")} <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Ola Cabs")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Uber India")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Railway IRCTC")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("IndiGo Air")}</code>.</li>
                      <li>• <strong className="text-gray-800 dark:text-gray-200">Meals & Staff Welfare:</strong> {t("Matches narration tags with")} <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Swiggy")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Zomato")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Catering Services")}</code>.</li>
                      <li>• <strong className="text-gray-800 dark:text-gray-200">Utility Bills:</strong> {t("Matches strings like")} <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Airtel fiber")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Bescom Power")}</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">{t("Tata Play")}</code>.</li>
                    </ul>
                  </div>

                  <div className="border border-gray-100 dark:border-gray-750/70 p-3.5 rounded-lg bg-gray-50/50 dark:bg-gray-900/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 block mb-2">{t("Confidence Score Levels")}</span>
                    <div className="space-y-2 text-[11px] text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-bold text-gray-850 dark:text-gray-150 block">🟢 High Confidence (&gt;85% Match)</span>
                        <p className="text-[10.5px]">{t("Directly posted into active ledgers automatically. Marked with a green check badge in user trails.")}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-850 dark:text-gray-150 block">🟡 Low Confidence (&lt;85% Match)</span>
                        <p className="text-[10.5px]">{t("Placed into 'Quarantine Ledger State'. Highlighted yellow, awaiting Partner review or ledger re-assignment.")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.reconciliationFails ? 'border-emerald-250 dark:border-emerald-800' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('reconciliationFails')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.reconciliationFails ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Double-Entry Reconciliation Protocols")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Balancing ledger imbalances, resolving circular errors, and suspense clearance")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.reconciliationFails ? 'rotate-90 text-emerald-500' : ''}`} />
            </button>

            {expandedSections.reconciliationFails && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200 space-y-4">
                
                {/* Imbalance instructions */}
                <div className="p-3.5 bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wide">
                    <Activity className="w-4 h-4 text-rose-500" /> {t("Resolving Debit-Credit Mismatches")}
                  </span>
                  <p className="text-[11.5px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    If an Excel or CSV file contains line items that do not balance out, follow this diagnostic sequence:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-gray-650 dark:text-gray-400 space-y-1.5 pl-1.5 font-medium">
                    <li>{t("Launch the")} <span className="font-mono text-gray-905 dark:text-gray-102">{t("Security Sandbox")}</span> {t("to ensure the performing operator has clear 'Write' and 'Update' permissions in the corresponding department.")}</li>
                    <li>Verify whether any numeric values utilize custom currency formatting (e.g. including commas or prefixing strings like INR or $). These should always be uploaded as pure floating numbers (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{t("50000.50")}</code>).</li>
                    <li>{t("Examine the suspense allocation logs. Unmapped ledgers default directly to the")} <span className="font-bold text-indigo-600 dark:text-indigo-400">{t("Suspense Clearing Account")}</span> {t("to preserve integrity rather than failing the build.")}</li>
                  </ol>
                </div>

                {/* Advanced reference lists */}
                <div className="border border-gray-100 dark:border-gray-750/70 p-4 rounded-xl space-y-2.5">
                  <h5 className="text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 tracking-wider">Troubleshooting Circular Reference Errors:</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal font-medium">
                    {t("Circular entries occur when an imported voucher credits and debits matching bank ledger nodes simultaneously (e.g. Bank to Bank transfers that aren't counter-balanced with contra-vouchers). These trigger an alert and are placed into the audit queue for Partner authorization reviews.")}
                  </p>
                </div>

              </div>
            )}
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.systemCompliance ? 'border-blue-200 dark:border-blue-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('systemCompliance')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.systemCompliance ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("System Compliance & Data Integrity Standards")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Audit trails, fiscal year locking, and internal control protocols")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.systemCompliance ? 'rotate-90 text-blue-500' : ''}`} />
            </button>

            {expandedSections.systemCompliance && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200 space-y-4">
                <div className="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100/30 dark:border-blue-800/30">
                  <h5 className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Activity className="w-3.5 h-3.5" /> {t("Core Integrity Controls")}
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase block mb-1">{t("Fiscal Year Locking")}</span>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">{t("Once a fiscal period is 'Closed' by a Partner, the system prevents all modifications to vouchers within that date range across all ledger masters to ensure balance sheet stability.")}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase block mb-1">{t("Immutable Audit Trails")}</span>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">Every modification—from simple narration edits to batch imports—is logged with timestamp, operator ID, and origin IP. Deleted vouchers are 'soft-removed', preserving their audit ID in historical compliance reports.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </>
          )}

          {activeTab === 'reference' && (
            <>
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.roles ? 'border-cyan-200 dark:border-cyan-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
              <button 
                onClick={() => toggleSection('roles')}
                className="w-full flex items-center justify-between p-5 focus:outline-none"
              >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.roles ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' : 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400'}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("User Role Definitions")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Overview of standard system personas")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.roles ? 'rotate-90 text-cyan-500' : ''}`} />
            </button>

            {expandedSections.roles && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3">
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-rose-500" /> {t("Partner / Admin")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Unrestricted access. Can edit company settings, delete ledgers, approve all transactions, and override any security restrictions.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-blue-500" /> {t("Accountant")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Standard operator. Can read, import, and draft transactions. Bound by transaction caps and upload limits. Requires approval above thresholds.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-500" /> {t("Auditor")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Elevated read-only access. Can view all data across the platform, pull financial reports, and inspect logs, but cannot alter any data.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-gray-400" /> {t("Guest")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Highly restricted access. Useful for interns or external reviewers. Limited by default to their mapped departmental scope.")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          </>
          )}

          {activeTab === 'guides' && (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.onboarding ? 'border-fuchsia-200 dark:border-fuchsia-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
              <button 
              onClick={() => toggleSection('onboarding')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.onboarding ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300' : 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Onboarding & Best Practices")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Guidelines for smooth user transitions")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.onboarding ? 'rotate-90 text-fuchsia-500' : ''}`} />
            </button>

            {expandedSections.onboarding && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3">
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">{t("Start with 'Guest' Access First")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Always create new remote contractors or temporary assistants with a 'Guest' role before adjusting. Then gradually increase permissions to 'Accountant' once they complete their initial review training.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">{t("Mapping Ownership")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Encourage senior operators to verify their specific Mapping Rules regularly. Best practice decrees setting an internal policy where Partners define the Master column layouts while Accountants adhere to them.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">{t("Committing to Real-Time Updates")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Advise team members to not leave voucher sheets drafted overnight. If system updates or bank changes occur next business day, stale mappings may fail verification blocks.")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Right: Security Matrix Override Sandbox and Compliance Guidelines */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === 'sandbox' && (
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.sandbox ? 'border-emerald-200 dark:border-emerald-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('sandbox')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.sandbox ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Security Matrix Sandbox")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Simulate Effective User Constraints")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.sandbox ? 'rotate-90 text-emerald-500' : ''}`} />
            </button>

            {expandedSections.sandbox && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-750">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-wider block">{t("1. Select Target Role")}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['Accountant', 'Auditor', 'Partner', 'Guest'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => setTestRole(role)}
                          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all border uppercase tracking-wider ${
                            testRole === role
                              ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-wider block">{t("2. Select Target Department")}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['Finance', 'Executive', 'Operations', 'Audit'] as const).map(dept => (
                        <button
                          key={dept}
                          onClick={() => setTestDept(dept)}
                          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all border uppercase tracking-wider ${
                            testDept === dept
                              ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Effectiveness Ledger */}
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-0 space-y-3">
                  <h5 className="text-[10px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">Effective Bounds:</h5>

                  <div className="space-y-1.5 text-[11px] font-semibold">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-md">
                      <span className="text-gray-500 uppercase tracking-wider text-[9px]">{t("Daily upload limit")}</span>
                      <span className="text-gray-900 dark:text-white uppercase tracking-wider">
                        {currentPolicy.dailyVoucher === 0 ? 'Unlimited' : `${currentPolicy.dailyVoucher} Vouchers`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-md">
                      <span className="text-gray-500 uppercase tracking-wider text-[9px]">{t("Max transaction size")}</span>
                      <span className="text-gray-900 dark:text-white uppercase tracking-wider">
                        {currentPolicy.maxTx === 0 ? 'Blocked / Unlimited' : `₹ ${formatNumber(Number(currentPolicy.maxTx))}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-md">
                      <span className="text-gray-500 uppercase tracking-wider text-[9px]">{t("Corporate Working Hours")}</span>
                      <span className="text-gray-900 dark:text-white uppercase tracking-wider text-[9px]">
                        {currentPolicy.hoursStr}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-md">
                      <span className="text-gray-500 uppercase tracking-wider text-[9px]">{t("Require approval MFA?")}</span>
                      <span className={currentPolicy.mfa ? 'text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[9px]' : 'text-gray-500 uppercase tracking-wider text-[9px]'}>
                        {currentPolicy.mfa ? 'Mandatory Check' : 'By-Passed'}
                      </span>
                    </div>
                  </div>

                  {/* Effective Permission indicators */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2 justify-center">
                    <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider ${currentPolicy.perms.vouchers.create ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                      Post Voucher: {currentPolicy.perms.vouchers.create ? 'Allow' : 'Block'}
                    </span>
                    <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider ${currentPolicy.perms.masters.create ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                      Create Master: {currentPolicy.perms.masters.create ? 'Allow' : 'Block'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {activeTab === 'reference' && (
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.audit ? 'border-amber-200 dark:border-amber-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <button 
              onClick={() => toggleSection('audit')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.audit ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Compliance & Audit")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Key instructions for data integrity")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.audit ? 'rotate-90 text-amber-500' : ''}`} />
            </button>

            {expandedSections.audit && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3">
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Audit Trails Are Immutable")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("System logs track every upload, modification, and deletion. Suspended users will still have their name next to historic imports.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Monthly Role Re-Evaluation")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("It's advised to review permissions for delegated users (Temporary Admins) automatically every month during standard system closure windows.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Approval Escrow")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("Transactions waiting for MFA or Manager Approval are kept in a pending database. If not approved within 7 days, they are auto-rejected.")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>

      </div>

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          <div className="lg:col-span-12 space-y-4">
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${expandedSections.troubleshooting ? 'border-red-200 dark:border-red-800/50' : 'border-gray-100 dark:border-gray-700'}`}>
              <button 
              onClick={() => toggleSection('troubleshooting')}
              className="w-full flex items-center justify-between p-5 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${expandedSections.troubleshooting ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Troubleshooting & Diagnostics")}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t("Resolve common permission conflicts")}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.troubleshooting ? 'rotate-90 text-red-500' : ''}`} />
            </button>

            {expandedSections.troubleshooting && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3">
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 'Insufficient Rights' Error on Import</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("This happens when a user attempts to upload a voucher type prohibited by their matrix. Use the 'Security Matrix Sandbox' above to mimic their exact position using Role and Department. Check if 'Post Voucher' evaluates to Block.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {t("Stuck in Pending State")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("If a user's transaction stays 'Pending', they've hit their transaction size limit or daily volume limit, and it requires Partner Approval. To fix immediately, an Administrator must manually approve it in the Dashboard.")}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {t("Ghosted Accounts / Missing Records")}</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{t("System logs track deleted records but they are hidden from the standard view. A Partner can view marked-for-deletion items in the System Log exports. Users cannot permanently destroy Ledger roots.")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      )}

    </div>
  );
};
