import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { 
    Terminal, Play, ArrowRight, CheckCircle, AlertTriangle, HelpCircle, 
    Lightbulb, Info, Trash2, RotateCcw, Download, Sparkles, Activity, FileSpreadsheet, Search, Hash, Shield, Cpu, RefreshCw,
    ChevronDown, ChevronUp, Check, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SandboxSectionProps {
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
    sandboxMode?: 'single' | 'bulk';
    setSandboxMode?: (mode: 'single' | 'bulk') => void;
    sandboxInput: string;
    setSandboxInput: (val: string) => void;
    runSandboxSimulator: () => void;
    sandboxResult: any;
    runBulkSimulator: (inputs: string[]) => void;
    bulkSandboxResults: any[];
    setBulkSandboxResults: (results: any[]) => void;
    searchTerm?: string;
}

export const SandboxSection: React.FC<SandboxSectionProps> = ({
    isOpen,
    toggles,
    handleToggle,
    sandboxInput,
    setSandboxInput,
    runSandboxSimulator,
    sandboxResult,
    runBulkSimulator,
    bulkSandboxResults,
    setBulkSandboxResults,
    searchTerm = ''
}) => {
    const { t } = useLanguage();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [bulkText, setBulkText] = useState('');
    const [bulkFilter, setBulkFilter] = useState('');

    // Single presets
    const singlePresets = [
        { label: t("UPI Food Payment"), text: "UPI/ZOMATO MEDIA PVT LTD/9876543210@PAYTM/REF/UTR918273645" },
        { label: t("Bank Charges"), text: "BANK CHG/RTGS CHGS INDIVIDUAL/2026-06/COMM" },
        { label: t("ATM Cash Withdrawal"), text: "CASH WITHDRAWAL/ATM-AXIS-0912/CASHIER" },
        { label: t("Salary Inflow"), text: "NEFT/HDFC SALARY INFLOW/NETBANK/REF017" },
        { label: t("Personal Transfer"), text: "IMPS/TRF TO ATUL RAVI/PERSONAL EXPENSES/REF-9921" }
    ];

    const bulkPresetText = [
        "UPI/9988776655@OKAXIS/ZOMATO CORPORATE/UTR0092182",
        "CASH WITHDRAWAL/ATM-AXIS-0912/CASHIER",
        "RTGS INTEGRATED SERVICES COMM/MAPPING-COMM-202",
        "NEFT/HDFC HOUSING LOAN EFT/HDFC0012/REF-01",
        "IMPS/SALARY CREDITED SEP/ADMIN/10291929312",
        "INTEREST CREDIT TAXABLE SAVINGS AC/Q226",
        "UPI/OLA CABS TRAVEL EXPENSES/OLA@YBL/UTR-99",
        "CGST AND SGST APPLIED ON CHARGES",
        "CHQ DEP NO 918273 IN COLLATERAL AC",
        "UPI/SWIGGY PREMIUM FOODS/SWIGGY@PAYTM/992"
    ].join('\n');

    // Run simulator automatically when text changes in single mode
    useEffect(() => {
        if (sandboxInput.trim()) {
            const timer = setTimeout(() => {
                runSandboxSimulator();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [sandboxInput]);

    const handleApplySinglePreset = (text: string) => {
        setSandboxInput(text);
    };

    const handleLoadBulkPreset = () => {
        setBulkText(bulkPresetText);
    };

    const handleClearBulk = () => {
        setBulkText('');
        setBulkSandboxResults([]);
    };

    const handleClearSingle = () => {
        setSandboxInput('');
    };

    const handleRunBulk = () => {
        const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length > 0) {
            runBulkSimulator(lines);
        }
    };

    const exportBulkToCSV = () => {
        if (!bulkSandboxResults.length) return;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Raw Narration,Simulated Mapped Party,Confidence,Simulation Status\n";
        bulkSandboxResults.forEach(r => {
            const rawEscaped = (r.narration || "").replace(/"/g, '""');
            const partyEscaped = (r.partyName || "").replace(/"/g, '""');
            const statusEscaped = (r.status || "").replace(/"/g, '""');
            csvContent += `"${rawEscaped}","${partyEscaped}","${r.confidence || ''}","${statusEscaped}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bharat_book_bulk_sandbox_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter results
    const filteredBulkResults = bulkSandboxResults.filter((r: any) => {
        const query = bulkFilter.toLowerCase().trim();
        if (!query) return true;
        return (r.narration || '').toLowerCase().includes(query) || 
               (r.partyName || '').toLowerCase().includes(query) || 
               (r.status || '').toLowerCase().includes(query) || 
               (r.confidence || '').toLowerCase().includes(query);
    });

    // Accordion Toggle
    const toggleAccordion = (key: string) => {
        setActiveAccordion(prev => {
            const next = prev === key ? null : key;
            if (next) localStorage.setItem('bharat_book_accordion_sandbox', next);
            else localStorage.removeItem('bharat_book_accordion_sandbox');
            return next;
        });
    };

    // Filter matching logic based on search queries
    const isSectionVisible = (secKey: string) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase().trim();
        if (secKey === 'single') {
            return t("Single Element Trace").toLowerCase().includes(q) ||
                   t("Parser Input Trace").toLowerCase().includes(q) ||
                   t("UPI Food Payment").toLowerCase().includes(q) ||
                   t("Bank Charges").toLowerCase().includes(q) ||
                   t("ATM Cash Withdrawal").toLowerCase().includes(q) ||
                   t("Salary Inflow").toLowerCase().includes(q) ||
                   t("Personal Transfer").toLowerCase().includes(q) ||
                   "zomato bank chg rtg salary imps atul ravi".includes(q);
        }
        if (secKey === 'bulk') {
            return t("Bulk Stream Processor").toLowerCase().includes(q) ||
                   t("Multi-Narration Stream").toLowerCase().includes(q) ||
                   t("Load Example Set").toLowerCase().includes(q) ||
                   "ola cabs swiggy collateral cgst sgst stream compiler".includes(q) ||
                   (bulkFilter && bulkFilter.toLowerCase().includes(q));
        }
        return false;
    };

    const isSingleExpanded = activeAccordion === 'single' || (Boolean(searchTerm) && isSectionVisible('single'));
    const isBulkExpanded = activeAccordion === 'bulk' || (Boolean(searchTerm) && isSectionVisible('bulk'));

    if (!isOpen) return null;

    return (
        <div className="animate-in fade-in duration-200">
            {/* Main Title and descriptive inline callout inside a padded block */}
            <div className="p-6 sm:p-8 pb-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide dark:text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    {t("Sandbox Simulator Terminal")}
                </h3>
                <p className="text-[11px] text-gray-500 font-normal leading-relaxed mt-1 dark:text-gray-400">
                    {t("Test and simulate parsing rules against custom mock transaction narratives in real-time before applying changes.")}
                </p>
            </div>

            {/* Accordion container rendering edge-to-edge */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {/* 1. Single Element Trace Accordion */}
                {isSectionVisible('single') && (
                    <div className="overflow-hidden">
                        {/* Header Row */}
                        <button
                            onClick={() => toggleAccordion('single')}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-left font-bold outline-none"
                        >
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-105/10">
                                <Terminal className="w-4 h-4" />
                            </span>
                            <div>
                                <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    {t("Single Element Trace")}
                                    {sandboxInput.trim() && (
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    )}
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                    {t("Trace entity, UTR and category resolution in real-time.")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {sandboxInput.trim() && sandboxResult && (
                                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border font-mono ${sandboxResult.color}`}>
                                    {sandboxResult.status} ({sandboxResult.confidence})
                                </span>
                            )}
                            {isSingleExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                    </button>

                    {/* Animated Content Slot */}
                    <AnimatePresence initial={false}>
                        {isSingleExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800 text-left border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 lg:grid-cols-12">
                                    
                                    {/* Left Input Section */}
                                    <div className="lg:col-span-5 space-y-4">
                                        <div className="bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-405 dark:text-gray-400">
                                                    {t("Parser Input Trace")}
                                                </h4>
                                                {sandboxInput && (
                                                    <button 
                                                        onClick={handleClearSingle}
                                                        className="text-[9px] uppercase font-black tracking-widest text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                                                    >
                                                        {t("Clear")}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white dark:bg-gray-850 p-3 pr-10 border border-gray-200 dark:border-gray-755 rounded-xl text-xs font-bold font-mono tracking-tight text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-105 transition-all shadow-inner"
                                                    placeholder={t("Paste raw narration line here...")}
                                                    value={sandboxInput}
                                                    onChange={(e) => setSandboxInput(e.target.value)}
                                                />
                                                <button
                                                    onClick={runSandboxSimulator}
                                                    className="absolute right-2 top-2 p-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all active:scale-95 border border-blue-100 cursor-pointer"
                                                    title={t("Trigger Run")}
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                </button>
                                            </div>

                                            {/* Presets */}
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">
                                                    {t("Quick Trigger Presets")}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {singlePresets.map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleApplySinglePreset(item.text)}
                                                            className={`text-[9px] font-black px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                                                                sandboxInput === item.text 
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                                                : 'bg-white hover:bg-blue-50/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-750 hover:border-blue-200 dark:bg-gray-800'
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status header toggles */}
                                        <div className="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-150 dark:border-gray-750 space-y-3 shadow-xs">
                                            <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                                                {t("Pipeline Resolution Configured")}
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                    <span>{t("Continuous Machine Learning")}</span>
                                                    <span className={toggles.continuousLearning ? "text-emerald-600 font-black" : "text-gray-400"}>
                                                        {toggles.continuousLearning ? t("ONLINE") : t("OFFLINE")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                    <span>{t("Fuzzy Match Logic Engine")}</span>
                                                    <span className={toggles.fuzzyLogic ? "text-emerald-600 font-black" : "text-gray-400"}>
                                                        {toggles.fuzzyLogic ? t("ACTIVE") : t("SUSPENDED")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                    <span>{t("Mobile Contact Number Extractor")}</span>
                                                    <span className={toggles.mobileNumberExtractor ? "text-emerald-600 font-black" : "text-gray-400"}>
                                                        {toggles.mobileNumberExtractor ? t("ENABLED") : t("DISABLED")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Tracing Bento Grid */}
                                    <div className="lg:col-span-7">
                                        {!sandboxInput.trim() || !sandboxResult ? (
                                            <div className="h-full min-h-[220px] border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 dark:bg-gray-900/10">
                                                <Terminal className="w-8 h-8 text-gray-300 dark:text-gray-700 animate-pulse mb-2.5" />
                                                <h4 className="text-[12px] font-extrabold text-gray-800 dark:text-gray-200">{t("Awaiting Narrative Trace")}</h4>
                                                <p className="text-[10px] text-gray-450 dark:text-gray-400 max-w-sm mt-1 leading-relaxed">
                                                    {t("Paste transaction string on left or click presets to see real-time pipeline compile details.")}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 animate-in fade-in duration-200">
                                                {/* Header Trace Status */}
                                                <div className="p-4 bg-gray-50/50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-750 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                    <div>
                                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{t("Pipeline Resolve Tag")}</p>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase border mt-1.5 tracking-wider ${sandboxResult.color}`}>
                                                            {sandboxResult.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="text-right">
                                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">{t("Match Score")}</p>
                                                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 leading-none font-mono">{sandboxResult.confidence}</p>
                                                        </div>
                                                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 flex items-center justify-center text-blue-650">
                                                            <Cpu className="w-4 h-4 animate-spin-slow" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Grid Cards */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                    {/* Party Block */}
                                                    <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-750 p-4 rounded-xl space-y-2 shadow-xs">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">{t("Simulated Party / Ledger Name")}</span>
                                                        <div className="flex justify-between items-center text-xs font-black tracking-tight font-mono text-blue-700 dark:text-blue-300">
                                                            <span>{sandboxResult.partyKey}</span>
                                                            <span className="text-[9px] font-black bg-blue-50/50 dark:bg-blue-950/20 px-1 py-0.2 rounded font-mono">
                                                                {sandboxResult.partyKeyConf}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${sandboxResult.partyKeyConf}%` }}></div>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 font-medium">
                                                            {t("Formatted name:")} <strong className="text-gray-800 dark:text-white font-bold">{sandboxResult.personName || "UNKNOWN"}</strong>
                                                        </p>
                                                    </div>

                                                    {/* Category Block */}
                                                    <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-750 p-4 rounded-xl space-y-2 shadow-xs">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">{t("Classified Ledger Account")}</span>
                                                        <div className="flex justify-between items-center text-xs font-black tracking-tight font-mono text-emerald-700 dark:text-emerald-400">
                                                            <span>{sandboxResult.category}</span>
                                                            <span className="text-[9px] font-black bg-emerald-50/50 dark:bg-emerald-950/20 px-1 py-0.2 rounded font-mono">
                                                                {sandboxResult.categoryConf}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${sandboxResult.categoryConf}%` }}></div>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 font-medium">
                                                            {t("Inferred Voucher:")} <strong className="text-gray-800 dark:text-white font-bold">{sandboxResult.voucherType}</strong>
                                                        </p>
                                                    </div>

                                                    {/* Reference Block */}
                                                    <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-750 p-4 rounded-xl space-y-2 shadow-xs">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">{t("UTR / Transaction Reference")}</span>
                                                        <div className="flex justify-between items-center text-xs font-black tracking-tight font-mono text-gray-700 dark:text-gray-200">
                                                            <span>{sandboxResult.reference || "None Extracted"}</span>
                                                            <span className="text-[9px] font-black bg-gray-50 dark:bg-gray-800 px-1 py-0.2 rounded font-mono text-gray-450">
                                                                {sandboxResult.referenceConf}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                                            <div className="bg-gray-400 h-full rounded-full" style={{ width: `${sandboxResult.referenceConf}%` }}></div>
                                                        </div>
                                                        <p className="text-[10px] text-gray-450 dark:text-gray-400 leading-none">
                                                            {t("Unique reference structures parsed.")}
                                                        </p>
                                                    </div>

                                                    {/* Bank Routing Block */}
                                                    <div className="bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-750 p-4 rounded-xl space-y-2 shadow-xs">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">{t("Identified Route & Bank")}</span>
                                                        <div className="flex justify-between items-center text-xs font-black tracking-tight font-mono text-purple-700 dark:text-purple-300 zoom-in duration-75">
                                                            <span>{sandboxResult.bankName !== "Not Found" ? `${sandboxResult.bankName}` : "Gateway Direct"}</span>
                                                            <span className="text-[9px] font-black bg-purple-50/50 dark:bg-purple-950/20 px-1 py-0.2 rounded font-mono">
                                                                {Math.max(sandboxResult.bankNameConf || 0, sandboxResult.txnTypeConf || 0)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                                            <div className="bg-purple-650 h-full rounded-full" style={{ width: `${Math.max(sandboxResult.bankNameConf || 0, sandboxResult.txnTypeConf || 0)}%` }}></div>
                                                        </div>
                                                        <p className="text-[10px] text-gray-555 font-medium leading-normal">
                                                            {t("Type:")} <strong className="text-gray-800 dark:text-white font-bold">{sandboxResult.txnType}</strong>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Mini Metadata Grid */}
                                                <div className="p-3.5 bg-gray-50 dark:bg-gray-850/40 border border-gray-150 dark:border-gray-750 rounded-xl space-y-2 text-[10px]">
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">{t("Sub-Level Parser Metadata")}</span>
                                                    <div className="grid grid-cols-2 gap-3 font-semibold pb-1.5 text-gray-600 dark:text-gray-300">
                                                        <div>
                                                            <span className="text-gray-400 block font-normal text-[9px]">{t("Phone / Pay Account:")}</span>
                                                            <span className="font-mono text-gray-800 dark:text-white text-[10px]">
                                                                {sandboxResult.mobile !== "Not Found" ? sandboxResult.mobile : t("No contact parsed")}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 block font-normal text-[9px]">{t("Target Virtual Account:")}</span>
                                                            <span className="font-mono text-gray-800 dark:text-white text-[10px]">
                                                                {sandboxResult.bankAccount !== "Not Found" ? sandboxResult.bankAccount : t("No account identifier")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-gray-150/40 dark:border-gray-800 pt-1.5">
                                                        <span className="text-gray-400 block text-[9px] font-normal">{t("Remaining Token:")}</span>
                                                        <span className="font-mono block text-gray-800 dark:text-white text-xs mt-0.5 font-bold truncate">
                                                            {sandboxResult.senderReceiverDetails}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* 2. Bulk Stream Processor Accordion */}
            {isSectionVisible('bulk') && (
                <div className="overflow-hidden">
                    {/* Header Row */}
                    <button
                        onClick={() => toggleAccordion('bulk')}
                        className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-left font-bold outline-none"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-105/10">
                                <Activity className="w-4 h-4" />
                            </span>
                            <div>
                                <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    {t("Bulk Stream Processor")}
                                    {bulkSandboxResults.length > 0 && (
                                        <span className="text-[9px] bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded font-black font-mono">
                                            {bulkSandboxResults.length}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                    {t("Execute high-density parallel mapping runs from bulk transaction lists.")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {bulkText && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-amber-650 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    {t("Stream Ready")}
                                </span>
                            )}
                            {isBulkExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                    </button>

                    {/* Animated Content Slot */}
                    <AnimatePresence initial={false}>
                        {isBulkExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 sm:px-8 bg-white dark:bg-gray-800 text-left border-t border-gray-100 dark:border-gray-800 space-y-6 pb-8">
                                    
                                    {/* Stream Area */}
                                    <div className="p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-105 dark:border-gray-800 rounded-xl space-y-4">
                                        <div className="flex justify-between items-center flex-wrap gap-2">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                                                    {t("Multi-Narration Stream")}
                                                </h4>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 pb-1">
                                                    {t("Enter raw narrative lists (one transaction per line) to test resolution matches in batch processing.")}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={handleLoadBulkPreset}
                                                    className="px-2.5 py-1.5 bg-white border border-gray-250 hover:border-blue-200 rounded-lg text-[9px] font-black text-gray-650 hover:text-blue-650 shadow-sm transition-all cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                    {t("Load Example")}
                                                </button>
                                                {bulkText && (
                                                    <button
                                                        onClick={handleClearBulk}
                                                        className="px-2.5 py-1.5 bg-orange-50 border border-orange-100 hover:border-orange-200 rounded-lg text-[9px] font-black text-orange-700 shadow-sm transition-all cursor-pointer dark:bg-orange-955/20"
                                                    >
                                                        {t("Clear All")}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <textarea
                                            className="w-full bg-white dark:bg-gray-855 p-3.5 border border-gray-200 dark:border-gray-755 rounded-xl text-[11px] font-mono font-bold leading-normal outline-none focus:ring-2 focus:ring-blue-105 transition-all shadow-inner h-32 text-gray-800 dark:text-gray-200"
                                            placeholder={t("Paste bulk transactions here (one narrative per line)...")}
                                            value={bulkText}
                                            onChange={(e) => setBulkText(e.target.value)}
                                        />

                                        <div className="flex justify-end pt-1">
                                            <button
                                                onClick={handleRunBulk}
                                                disabled={!bulkText.trim()}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                                                    bulkText.trim()
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                                    : 'bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 shadow-none'
                                                }`}
                                            >
                                                <Play className="w-3 h-3 fill-current" />
                                                {t("Compile Stream")}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Batch Metrics Output */}
                                    {bulkSandboxResults.length > 0 && (
                                        <div className="space-y-4 animate-in fade-in duration-200">
                                            
                                            {/* Summary Row */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div className="bg-white dark:bg-gray-850 p-4 border border-gray-150 dark:border-gray-755 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide leading-none">{t("Transactions Parsed")}</p>
                                                        <p className="text-lg font-black text-gray-850 dark:text-white mt-2 leading-none font-mono">{bulkSandboxResults.length}</p>
                                                    </div>
                                                    <div className="p-2 bg-blue-50/50 text-blue-605 dark:bg-blue-950/20 rounded-lg">
                                                        <Hash className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                                <div className="bg-white dark:bg-gray-850 p-4 border border-gray-150 dark:border-gray-755 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide leading-none">{t("Auto-Matched Passes")}</p>
                                                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-450 mt-2 leading-none font-mono">
                                                            {bulkSandboxResults.filter(r => parseInt(r.confidence || '0') >= 80).length}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-emerald-50/50 text-emerald-605 dark:bg-emerald-950/20 rounded-lg">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                                <div className="bg-white dark:bg-gray-850 p-4 border border-gray-150 dark:border-gray-755 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide leading-none">{t("Needs Manual Audit")}</p>
                                                        <p className="text-lg font-black text-rose-600 dark:text-rose-450 mt-2 leading-none font-mono">
                                                            {bulkSandboxResults.filter(r => parseInt(r.confidence || '0') < 80).length}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-rose-50/50 text-rose-605 dark:bg-rose-950/20 rounded-lg">
                                                        <AlertTriangle className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Filters & Actions row */}
                                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-gray-50/50 dark:bg-gray-850/50 p-2 border border-gray-150 dark:border-gray-800 rounded-xl">
                                                <div className="relative flex-1 min-w-0">
                                                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                                        <Search className="w-3 h-3 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder={t("Filter simulated results...")}
                                                        value={bulkFilter}
                                                        onChange={(e) => setBulkFilter(e.target.value)}
                                                        className="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg text-[10px] font-bold outline-none focus:ring-1 focus:ring-blue-105 transition-all text-gray-800 dark:text-gray-200"
                                                    />
                                                    {bulkFilter && (
                                                        <button
                                                            onClick={() => setBulkFilter('')}
                                                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            <svg className="w-2.5 h-2.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={exportBulkToCSV}
                                                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 border border-blue-200 text-blue-700 dark:text-blue-300 rounded-lg text-[10px] font-black flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                                                >
                                                    <FileSpreadsheet className="w-3.5 h-3.5" />
                                                    {t("Export CSV Report")}
                                                </button>
                                            </div>

                                            {/* Results Grid Table */}
                                            <div className="overflow-x-auto border border-gray-155 dark:border-gray-750 rounded-xl bg-white dark:bg-gray-800">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-50/75 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-750 text-[9px] font-black text-gray-400 uppercase tracking-widest cursor-default">
                                                            <th className="py-2.5 px-3">{t("Raw Bank Narration Stream")}</th>
                                                            <th className="py-2.5 px-3">{t("Derived Party / Mapping Key")}</th>
                                                            <th className="py-2.5 px-3 text-center">{t("Confidence Score")}</th>
                                                            <th className="py-2.5 px-3 text-right">{t("Resolution Status")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-750 text-[10px] font-bold text-gray-600 dark:text-gray-300 font-sans">
                                                        {filteredBulkResults.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4} className="text-center py-6 text-gray-400 font-medium font-sans">
                                                                    {t("No stream records match your filter.")}
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            filteredBulkResults.map((result: any, idx: number) => {
                                                                const confNum = parseInt(result.confidence || '0');
                                                                const confColor = confNum >= 80 
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                                                    : confNum >= 50 
                                                                        ? 'bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-955/20 dark:text-amber-400' 
                                                                        : 'bg-rose-50 text-rose-700 border-rose-150 dark:bg-rose-955/20 dark:text-rose-400';
                                                                
                                                                return (
                                                                    <tr key={idx} className="hover:bg-gray-55/30 transition-colors">
                                                                        <td className="py-2 px-3 font-mono text-[10px] max-w-xs truncate" title={result.narration}>
                                                                            {result.narration}
                                                                        </td>
                                                                        <td className="py-2 px-3 font-black text-gray-850 dark:text-white font-mono text-xs">
                                                                            {result.partyName || "UNKNOWN"}
                                                                        </td>
                                                                        <td className="py-2 px-3 text-center">
                                                                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded font-mono text-[9px] font-black border ${confColor}`}>
                                                                                {result.confidence}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2 px-3 text-right">
                                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${result.color || 'bg-gray-50 text-gray-500 border-gray-150'}`}>
                                                                                {result.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
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
