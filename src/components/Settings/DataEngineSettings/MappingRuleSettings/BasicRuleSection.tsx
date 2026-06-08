import React, { useState } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { 
    SlidersHorizontal, HelpCircle, Shield, AlertTriangle, 
    CheckCircle, Settings, Layers, Workflow, Check, ArrowRight,
    Search, Cpu, Play, Code, AlertCircle, ChevronUp, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BasicRuleSectionProps {
    isOpen: boolean;
    toggleSection?: () => void;
    toggles: {
        stripEntitySuffixes: boolean;
        mobileNumberExtractor: boolean;
        fuzzyLogic: boolean;
        continuousLearning: boolean;
        autoContraDetection: boolean;
        identifyMobileTransfer: boolean;
        autoDetectGstin: boolean;
        autoDetectPanTan: boolean;
    };
    handleToggle: (key: any) => void;
    missingMasterAction: string;
    setMissingMasterAction: (val: string) => void;
    processingPriority: string;
    setProcessingPriority: (val: string) => void;
    searchTerm?: string;
}

export const BasicRuleSection: React.FC<BasicRuleSectionProps> = ({
    isOpen,
    toggles,
    handleToggle,
    missingMasterAction,
    setMissingMasterAction,
    processingPriority,
    setProcessingPriority,
    searchTerm = ''
}) => {
    const { t } = useLanguage();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleAccordion = (key: string) => {
        setActiveAccordion(prev => {
            const next = prev === key ? null : key;
            if (next) localStorage.setItem('bharat_book_accordion_basic', next);
            else localStorage.removeItem('bharat_book_accordion_basic');
            return next;
        });
    };

    // Execution sequence flow chart
    const getFlowPriorityList = () => {
        if (processingPriority === 'AliasFirst') {
            return [
                { step: 1, name: t("Custom Aliases"), desc: t("Runs strict exact-match aliases first to find mapped party.") },
                { step: 2, name: t("Pattern Rules"), desc: t("Applies advanced regex extraction structures.") },
                { step: 3, name: t("Fuzzy Match Logic"), desc: t("Calculates Levenshtein distance string similarity score.") }
            ];
        } else if (processingPriority === 'PatternFirst') {
            return [
                { step: 1, name: t("Pattern Rules"), desc: t("Applies advanced regex extraction structures first.") },
                { step: 2, name: t("Custom Aliases"), desc: t("Checks custom specific word mapping configurations.") },
                { step: 3, name: t("Fuzzy Match Logic"), desc: t("Calculates Levenshtein distance string similarity score.") }
            ];
        } else { // Balance / Adaptive
            return [
                { step: 1, name: t("Adaptive Engine"), desc: t("Scores and executes Aliases and Patterns in dynamic parallel.") },
                { step: 2, name: t("Fuzzy Match Logic"), desc: t("Triggers string distance fallback when standard lookups miss.") }
            ];
        }
    };

    const runRulesExplanation = () => {
        const parts = getFlowPriorityList();
        return (
            <div className="space-y-2 mt-3 bg-gray-50/50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-4 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-blue-600" />
                    {t("Active Pipeline Resolution Flow")}
                </p>
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {parts.map((p, idx) => (
                        <React.Fragment key={p.step}>
                            <div className="flex-1 p-2.5 bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-lg hover:border-gray-250 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black flex items-center justify-center border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30">
                                        {p.step}
                                    </span>
                                    <h5 className="text-[11px] font-black text-gray-800 dark:text-gray-200">{p.name}</h5>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed dark:text-gray-400">{p.desc}</p>
                            </div>
                            {idx < parts.length - 1 && (
                                <div className="hidden md:flex items-center text-gray-300 shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    // Accordion visibility and expansion
    const isSectionVisible = (secKey: string) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase().trim();
        if (secKey === 'priority') {
            return [
                'execution', 'priority', 'resolution', 'strategy', 'alias', 'pattern', 'adaptive', 'parallel', 'scoring', 'strategy'
            ].some(k => k.includes(q)) || t("Execution Priority Resolution").toLowerCase().includes(q) || processingPriority.toLowerCase().includes(q);
        }
        if (secKey === 'fallback') {
            return [
                'missing', 'master', 'fallback', 'behavior', 'ledger', 'suspense', 'action', 'stop', 'alert', 'autopost', 'skip'
            ].some(k => k.includes(q)) || t("Missing Master Fallback Behavior").toLowerCase().includes(q) || missingMasterAction.toLowerCase().includes(q);
        }
        if (secKey === 'engines') {
            return [
                'automated', 'parsing', 'engines', 'contra', 'detection', 'upi', 'mobile', 'transfer', 'gstin', 'pan', 'tan'
            ].some(k => k.includes(q)) || t("Automated Parsing Engines").toLowerCase().includes(q);
        }
        return false;
    };

    const isPriorityVisible = isSectionVisible('priority');
    const isPriorityExpanded = activeAccordion === 'priority' || (Boolean(searchTerm) && isPriorityVisible);

    const isFallbackVisible = isSectionVisible('fallback');
    const isFallbackExpanded = activeAccordion === 'fallback' || (Boolean(searchTerm) && isFallbackVisible);

    const isEnginesVisible = isSectionVisible('engines');
    const isEnginesExpanded = activeAccordion === 'engines' || (Boolean(searchTerm) && isEnginesVisible);

    return (
        <div className="animate-in fade-in duration-200">
            {/* Header section with descriptive inline callout inside a padded block */}
            <div className="p-6 sm:p-8 pb-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    {t("Core Processing Configurations")}
                </h3>
                <p className="text-[11px] text-gray-500 font-normal leading-relaxed mt-1 dark:text-gray-400">
                    {t("Configure high-level parameters governing ledger lookup hierarchy, auto-creation fallback rules, and Indian accounting engine behaviors.")}
                </p>
            </div>

            {/* Accordion List Container with Edge-to-Edge display */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                
                {/* 1. Execution Priority Accordion */}
                {isPriorityVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("priority")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Layers className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Execution Priority Resolution")}
                                </h3>
                            </div>
                            {isPriorityExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isPriorityExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-800 space-y-4">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Select the structured algorithm priority list for narrative extraction check loops.")}
                                        </p>
                                        
                                        {/* Priority Selector Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all hover:bg-gray-50/50 ${
                                                processingPriority === 'AliasFirst'
                                                ? 'bg-blue-50/30 border-blue-300 dark:bg-blue-950/10 dark:border-blue-800'
                                                : 'border-gray-150 dark:border-gray-750'
                                            }`}>
                                                <input 
                                                    type="radio" 
                                                    name="processingPriority" 
                                                    value="AliasFirst" 
                                                    className="mt-0.5"
                                                    checked={processingPriority === 'AliasFirst'}
                                                    onChange={(e) => setProcessingPriority(e.target.value)}
                                                />
                                                <div>
                                                    <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Alias Priority Strategy")}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed dark:text-gray-400">
                                                        {t("Checks exact manual lookup pairs first before falling back to system generic regex strings.")}
                                                    </p>
                                                </div>
                                            </label>

                                            <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all hover:bg-gray-50/50 ${
                                                processingPriority === 'PatternFirst'
                                                ? 'bg-blue-50/30 border-blue-300 dark:bg-blue-950/10 dark:border-blue-800'
                                                : 'border-gray-150 dark:border-gray-750'
                                            }`}>
                                                <input 
                                                    type="radio" 
                                                    name="processingPriority" 
                                                    value="PatternFirst" 
                                                    className="mt-0.5"
                                                    checked={processingPriority === 'PatternFirst'}
                                                    onChange={(e) => setProcessingPriority(e.target.value)}
                                                />
                                                <div>
                                                    <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Regex Pattern Priority")}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed dark:text-gray-400">
                                                        {t("Launches structured extraction layouts first to grab references, then applies aliases representing found labels.")}
                                                    </p>
                                                </div>
                                            </label>

                                            <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all hover:bg-gray-50/50 ${
                                                processingPriority === 'Balance'
                                                ? 'bg-blue-50/30 border-blue-300 dark:bg-blue-950/10 dark:border-blue-800'
                                                : 'border-gray-150 dark:border-gray-750'
                                            }`}>
                                                <input 
                                                    type="radio" 
                                                    name="processingPriority" 
                                                    value="Balance" 
                                                    className="mt-0.5"
                                                    checked={processingPriority === 'Balance'}
                                                    onChange={(e) => setProcessingPriority(e.target.value)}
                                                />
                                                <div>
                                                    <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Adaptive Parallel Scoring")}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed dark:text-gray-400">
                                                        {t("Dynamic weights run multiple lookups simultaneously, choosing the result offering the highest confidence rating.")}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        {runRulesExplanation()}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 2. Fallbacks Behavior Accordion */}
                {isFallbackVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("fallback")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <AlertCircle className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Missing Master Fallback Behavior")}
                                </h3>
                            </div>
                            {isFallbackExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isFallbackExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-800 space-y-4">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Set the default system behavior when a mapped party is resolved, but the correspondending Ledger account does not exist inside your master records.")}
                                        </p>

                                        <div>
                                            <select
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 p-3 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-105 outline-none cursor-pointer"
                                                value={missingMasterAction}
                                                onChange={(e) => setMissingMasterAction(e.target.value)}
                                            >
                                                <option value="StopPrompt">{t("Stop & Alert - Block execution for manual verification")}</option>
                                                <option value="AutoCreate">{t("Auto-Create Temp Ledger - Insert placeholder with tag 'Pending Approval'")}</option>
                                                <option value="SuspenseFallback">{t("Post to Suspense Account - Record transaction in temporary ledger")}</option>
                                                <option value="SkipRecord">{t("Omit Record - Log omission and continue with remaining stream")}</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2 p-3 bg-orange-50/40 dark:bg-orange-950/15 border border-orange-100 dark:border-orange-900/30 rounded-xl items-start">
                                            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                            <div className="text-[10px] text-orange-850 dark:text-orange-300 font-semibold leading-relaxed">
                                                {missingMasterAction === 'StopPrompt' && t("High Security: Halting execution ensures strict accounting correctness, preventing any unapproved voucher postings.")}
                                                {missingMasterAction === 'AutoCreate' && t("Standard Operations: Auto-creating placeholders prevents manual batch interruptions but requires review before final ledger reconciliation.")}
                                                {missingMasterAction === 'SuspenseFallback' && t("Balanced Fallback: Suspense posting is helpful for immediate matching, routing unmapped items into the default suspense voucher ledger.")}
                                                {missingMasterAction === 'SkipRecord' && t("Warning: Skipping records can lead to ledger gaps! Ideal only for pre-filtered transactions that require isolated processing.")}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 3. Automated Parsing Engines Accordion */}
                {isEnginesVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("engines")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                    <Cpu className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Automated Parsing Engines")}
                                </h3>
                            </div>
                            {isEnginesExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isEnginesExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-800 space-y-4">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Configure background algorithm plugins to identify Indian identifiers, tax certificates, and dual-entry banking configurations.")}
                                        </p>

                                        {/* Interactive Toggle List */}
                                        <div className="divide-y divide-gray-100 dark:divide-gray-750">
                                            
                                            {/* Auto Contra Detection Row */}
                                            <div className="py-3.5 flex items-center justify-between gap-4">
                                                <div className="max-w-md">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Auto Contra Detection")}</p>
                                                        <span className="text-[8px] bg-blue-55 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-black font-mono leading-none">CORE</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Flags transfers occurring directly between your company bank accounts or cash drawers to establish double-sided vouchers.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('autoContraDetection')} 
                                                    className={`${toggles.autoContraDetection ? 'bg-blue-600 font-black' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.autoContraDetection ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>

                                            {/* Mobile / UPI Extract Identifier Row */}
                                            <div className="py-3.5 flex items-center justify-between gap-4">
                                                <div className="max-w-md">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Identify UPI / Mobile Transfers")}</p>
                                                        <span className="text-[8px] bg-blue-55 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-black font-mono leading-none">INDIA</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Triggers deep verification triggers on 10-digit phone numbers and @ UPI handles (IMPS/UPI) to isolate routing channels.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('identifyMobileTransfer')} 
                                                    className={`${toggles.identifyMobileTransfer ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.identifyMobileTransfer ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>

                                            {/* Goods & Services Tax (GSTIN) Scanner */}
                                            <div className="py-3.5 flex items-center justify-between gap-4">
                                                <div className="max-w-md">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Auto-Detect GSTIN Codes")}</p>
                                                        <span className="text-[8px] bg-purple-55 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-black font-mono leading-none">TAX</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Parses narrative strings for 15-character Indian statewise GSTIN values to group matching tax ledger postings.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('autoDetectGstin')} 
                                                    className={`${toggles.autoDetectGstin ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.autoDetectGstin ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>

                                            {/* PAN / TAN Code Scanner */}
                                            <div className="py-3.5 flex items-center justify-between gap-4">
                                                <div className="max-w-md">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[11.5px] font-black text-gray-850 dark:text-gray-200">{t("Extract PAN / TAN Records")}</p>
                                                        <span className="text-[8px] bg-purple-55 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-black font-mono leading-none tracking-wide">IT</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Detects standard 10-character Income Tax Permanent Account Numbers or Deduction numbers inside commercial accounts.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('autoDetectPanTan')} 
                                                    className={`${toggles.autoDetectPanTan ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.autoDetectPanTan ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};
