import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { SettingsIcon } from "../../icons/IconComponents";
import { 
    ChevronDown, ChevronUp, FileUp, ShoppingCart, Tag, CreditCard, Download, BookOpen, 
    Repeat, Landmark, Search, Upload, Trash2, RotateCcw, Save, CheckCircle, AlertTriangle, 
    Sliders, HelpCircle, Activity, Info, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    PurchaseImport, 
    SalesImport, 
    PaymentImport, 
    ReceiptImport, 
    JournalImport, 
    ContraImport, 
    BankImport 
} from "../../Operations/Import/imports/index";

export interface GlobalImportField {
    key: string;
    label: string;
    description: string;
    extraTerms: string[];
}

export const GLOBAL_IMPORT_FIELDS: GlobalImportField[] = [
    {
        key: 'autoCreateMissing',
        label: "Auto-create missing items",
        description: "Automatically create stock items for unrecognized entries.",
        extraTerms: ["stock", "item", "inventory", "missing"]
    },
    {
        key: 'autoMatchLedgerGstin',
        label: "Auto-match ledgers by GSTIN",
        description: "Prioritize GSTIN mapping over fuzzy name matching.",
        extraTerms: ["gstin", "tax", "ledger", "fuzzy", "match"]
    },
    {
        key: 'smartNarrationCleanup',
        label: "Smart Narration Cleanup",
        description: "Remove dates and payment handles from extracted narrations.",
        extraTerms: ["narration", "clean", "dates", "regex", "upi"]
    },
    {
        key: 'extractDateFromFileName',
        label: "FileName Date Extraction",
        description: "Automatically use the date from the imported file name if missing.",
        extraTerms: ["file", "name", "extracted", "date", "fallback"]
    },
    {
        key: 'stripEntitySuffixes',
        label: "Strip Business Entity Suffixes",
        description: "Automatically strip legal extensions (PVT LTD, CO, LLP, INC) to prevent duplicate ledgers during mapping.",
        extraTerms: ["pvt", "ltd", "co", "llp", "legal", "suffix", "suffixes"]
    },
    {
        key: 'fuzzyLogic',
        label: "Fuzzy Match Ledger Names",
        description: "Deploy advanced name-matching algorithm on exact names to resolve spelling variations gracefully.",
        extraTerms: ["fuzzy", "logic", "levenshtein", "typo", "spelling"]
    },
    {
        key: 'continuousLearning',
        label: "Continuous Learning Engine",
        description: "Let the import pipeline automatically memorize your manual corrections of ledger links for future sessions.",
        extraTerms: ["learning", "continuous", "feedback", "correct"]
    }
];

interface ImportSettingsProps {
    toggles: {
        autoClassifyImports: boolean;
        autoCreateMissing: boolean;
        autoMatchLedgerGstin: boolean;
        smartNarrationCleanup?: boolean;
        extractDateFromFileName?: boolean;
        stripEntitySuffixes?: boolean;
        fuzzyLogic?: boolean;
        continuousLearning?: boolean;
    };
    handleToggle: (key: any) => void;
    setView?: (view: any) => void;
    onImportCategoryChange?: (category: 'voucher' | 'transaction_voucher' | 'item_voucher' | 'ledger_master' | 'item_master' | 'bank' | 'tax_related' | 'settings' | 'other') => void;
}

export const ImportSettings: React.FC<ImportSettingsProps> = ({ 
  toggles, 
  handleToggle,
  setView,
  onImportCategoryChange
}) => {
    const { t } = useLanguage();
    
    // Layout states matching HEADER_SEARCH_UI, COLLAPSIBLE_SECTIONS, and SEARCH_ARCHITECTURE
    const [activeTab, setActiveTab] = useState<'global' | 'vouchers'>('global');

    useEffect(() => {
        const checkOverride = () => {
            const override = localStorage.getItem('bharat_book_imports_subtab_override');
            if (override) {
                let targetTab: any = null;
                if (override === 'pipeline') targetTab = 'global';
                else if (override === 'rules') targetTab = 'vouchers';
                else if (['global', 'vouchers'].includes(override)) {
                    targetTab = override;
                }
                if (targetTab) {
                    setActiveTab(targetTab);
                }
                localStorage.removeItem('bharat_book_imports_subtab_override');
            }
        };
        checkOverride();
        window.addEventListener('bharat_book_imports_subtab_trigger', checkOverride);
        return () => window.removeEventListener('bharat_book_imports_subtab_trigger', checkOverride);
    }, []);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const DEFAULT_IMPORT_CONFIGS = {
        purchase: { 
            autoMatchSupplier: true, 
            validateHSN: false, 
            autoCalculateTax: true,
            deductTDS: false,
            detectRCM: true
        },
        sales: { 
            autoGenerateInvoice: true, 
            mandatoryGSTIN: true, 
            roundingStrategy: 'normal',
            inventorySync: false,
            enforcePriceList: true
        },
        payment: { 
            autoBillMatching: true, 
            paymentLimitWarning: 50000,
            complianceLimitEnabled: true,
            chequeQueue: false
        },
        receipt: { 
            autoAllocation: false, 
            allowNegativeCash: false,
            autoCashDiscount: true,
            splitMultiInvoices: true
        },
        journal: { 
            autoBalanceEntries: true, 
            mandatoryNarration: false,
            taxJournalMatch: true,
            detectDuplicates: true
        },
        contra: { 
            autoBankDetect: true, 
            cashLimitAlert: 200000,
            autoExtraceCharges: false,
            forceNarration: true
        },
        bank: { 
            autoClassify: true, 
            skipDuplicates: true, 
            confidenceThreshold: 90,
            processUPI: true,
            matchInterest: true
        }
    };

    // Specific Import Settings Persistent State
    const [importConfigs, setImportConfigs] = useState(() => {
        const saved = localStorage.getItem('bharat_book_import_configs');
        if (saved) {
            try {
                return { ...DEFAULT_IMPORT_CONFIGS, ...JSON.parse(saved) };
            } catch {}
        }
        return DEFAULT_IMPORT_CONFIGS;
    });

    const updateConfig = (section: string, key: string, value: any) => {
        setImportConfigs((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleConfigToggle = (section: string, key: string) => {
        const currentVal = (importConfigs as any)[section][key];
        updateConfig(section, key, !currentVal);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    // Search Category Matching Engine
    const isSectionMatching = (secId: string): boolean => {
        if (!searchQuery) return false;
        const query = searchQuery.toLowerCase().trim();
        if (secId === 'global') {
            if ([
                'global', 'rules', 'ai', 'import'
            ].some(k => k.includes(query) || query.includes(k))) return true;

            return GLOBAL_IMPORT_FIELDS.some(field => {
                const labelMatch = t(field.label).toLowerCase().includes(query);
                const descMatch = t(field.description).toLowerCase().includes(query);
                const termsMatch = field.extraTerms.some(trm => trm.includes(query));
                return labelMatch || descMatch || termsMatch;
            });
        }
        if (secId === 'purchase') {
            return ['purchase', 'supplier', 'hsn', 'tax', 'tds', 'rcm', 'match', 'autoCalculateTax', 'deductTDS'].some(k => k.includes(query) || query.includes(k)) ||
            t("Purchase Import Configuration").toLowerCase().includes(query);
        }
        if (secId === 'sales') {
            return ['sales', 'invoice', 'gstin', 'rounding', 'inventory', 'price', 'autoGenerateInvoice', 'mandatoryGSTIN'].some(k => k.includes(query) || query.includes(k)) ||
            t("Sales Import Configuration").toLowerCase().includes(query);
        }
        if (secId === 'payment') {
            return ['payment', 'bill', 'matching', 'warning', 'compliance', 'cheque', 'limit', 'autoBillMatching'].some(k => k.includes(query) || query.includes(k)) ||
            t("Payment Import Configuration").toLowerCase().includes(query);
        }
        if (secId === 'receipt') {
            return ['receipt', 'allocation', 'negative', 'cash', 'discount', 'split', 'autoAllocation', 'allowNegativeCash'].some(k => k.includes(query) || query.includes(k)) ||
            t("Receipt Import Configuration").toLowerCase().includes(query);
        }
        if (secId === 'journal') {
            return ['journal', 'balance', 'narration', 'match', 'duplicates', 'autoBalanceEntries', 'mandatoryNarration'].some(k => k.includes(query) || query.includes(k)) ||
            t("Journal Import Configuration").toLowerCase().includes(query);
        }
        if (secId === 'contra') {
            return ['contra', 'bank', 'cash', 'charges', 'force', 'autoBankDetect', 'cashLimitAlert'].some(k => k.includes(query) || query.includes(k)) ||
            t("Contra Import Configuration").toLowerCase().includes(query);
        }
        if (secId === 'bank') {
            return ['bank', 'classify', 'duplicates', 'confidence', 'upi', 'interest', 'autoClassify', 'skipDuplicates'].some(k => k.includes(query) || query.includes(k)) ||
            t("Bank Import Configuration").toLowerCase().includes(query);
        }
        return false;
    };

    const isGlobalMatching = isSectionMatching('global');
    const voucherKeys = ['purchase', 'sales', 'payment', 'receipt', 'journal', 'contra', 'bank'];
    const matchingVoucherKeys = voucherKeys.filter(key => isSectionMatching(key));
    const hasVoucherMatching = matchingVoucherKeys.length > 0;

    const globalBadgeCount = searchQuery ? (isGlobalMatching ? 1 : 0) : 0;
    const voucherBadgeCount = searchQuery ? matchingVoucherKeys.length : 0;

    // Background Tab Switching Protocol
    useEffect(() => {
        if (!searchQuery) return;
        if (activeTab === 'global' && !isGlobalMatching && hasVoucherMatching) {
            setActiveTab('vouchers');
        } else if (activeTab === 'vouchers' && !hasVoucherMatching && isGlobalMatching) {
            setActiveTab('global');
        }
    }, [searchQuery]);

    // Field Visibility Evaluator
    const isFieldVisible = (labelKey: string, extraTerms: string[] = []): boolean => {
        if (!searchQuery.trim()) return true;
        
        const words = searchQuery.toLowerCase().trim().split(/\s+/);
        const positiveTerms: string[] = [];
        const negativeTerms: string[] = [];

        for (const word of words) {
            if (word.startsWith('!') && word.length > 1) {
                negativeTerms.push(word.substring(1));
            } else if (word.startsWith('-') && word.length > 1) {
                negativeTerms.push(word.substring(1));
            } else if (word.trim()) {
                positiveTerms.push(word);
            }
        }

        const allTermsToCheck = [
            labelKey,
            t(labelKey),
            ...(extraTerms || [])
        ].map(term => term.toLowerCase());

        if (negativeTerms.length > 0) {
            const hasNegativeMatch = negativeTerms.some(neg =>
                allTermsToCheck.some(term => term.includes(neg))
            );
            if (hasNegativeMatch) return false;
        }

        if (positiveTerms.length > 0) {
            const hasAllPositiveMatches = positiveTerms.every(pos =>
                allTermsToCheck.some(term => term.includes(pos))
            );
            if (!hasAllPositiveMatches) return false;
        }

        return true;
    };

    // Accordion Expansion Engine
    const isSectionExpanded = (sectionId: string): boolean => {
        if (searchQuery) {
            return isSectionMatching(sectionId);
        }
        return activeAccordion === sectionId;
    };

    const isSectionVisible = (sectionId: string): boolean => {
        if (!searchQuery) return true;
        return isSectionMatching(sectionId);
    };

    const toggleAccordion = (section: string) => {
        setActiveAccordion(prev => prev === section ? null : section);
    };

    const importTypes = [
        { 
            id: 'purchase', 
            title: 'Purchase Import Configuration', 
            icon: <ShoppingCart size={15} />, 
            component: <PurchaseImport settings={importConfigs.purchase} onToggle={(key) => handleConfigToggle('purchase', key)} /> 
        },
        { 
            id: 'sales', 
            title: 'Sales Import Configuration', 
            icon: <Tag size={15} />, 
            component: <SalesImport settings={importConfigs.sales} onToggle={(key) => handleConfigToggle('sales', key)} onSelect={(key, val) => updateConfig('sales', key, val)} /> 
        },
        { 
            id: 'payment', 
            title: 'Payment Import Configuration', 
            icon: <CreditCard size={15} />, 
            component: <PaymentImport settings={importConfigs.payment} onToggle={(key) => handleConfigToggle('payment', key)} onNumberChange={(key, val) => updateConfig('payment', key, val)} /> 
        },
        { 
            id: 'receipt', 
            title: 'Receipt Import Configuration', 
            icon: <Download size={15} />, 
            component: <ReceiptImport settings={importConfigs.receipt} onToggle={(key) => handleConfigToggle('receipt', key)} /> 
        },
        { 
            id: 'journal', 
            title: 'Journal Import Configuration', 
            icon: <BookOpen size={15} />, 
            component: <JournalImport settings={importConfigs.journal} onToggle={(key) => handleConfigToggle('journal', key)} /> 
        },
        { 
            id: 'contra', 
            title: 'Contra Import Configuration', 
            icon: <Repeat size={15} />, 
            component: <ContraImport settings={importConfigs.contra} onToggle={(key) => handleConfigToggle('contra', key)} onNumberChange={(key, val) => updateConfig('contra', key, val)} /> 
        },
        { 
            id: 'bank', 
            title: 'Bank Import Configuration', 
            icon: <Landmark size={15} />, 
            component: <BankImport settings={importConfigs.bank} onToggle={(key) => handleConfigToggle('bank', key)} onNumberChange={(key, val) => updateConfig('bank', key, val)} /> 
        },
    ];

    // Global Action Handlers
    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            try {
                if (fileFormat === 'CSV') {
                    const lines = content.split('\n');
                    let imported = { ...importConfigs };
                    lines.forEach(line => {
                        const parts = line.split(',');
                        if (parts.length >= 3) {
                            const section = parts[0].trim();
                            const key = parts[1].trim();
                            const val = parts[2].trim();
                            if ((imported as any)[section]) {
                                let parsedVal: any = val;
                                if (val === 'true') parsedVal = true;
                                else if (val === 'false') parsedVal = false;
                                else if (!isNaN(Number(val))) parsedVal = Number(val);
                                (imported as any)[section][key] = parsedVal;
                            }
                        }
                    });
                    setImportConfigs(imported);
                    localStorage.setItem('bharat_book_import_configs', JSON.stringify(imported));
                    setSuccessMsg(t("Import rules configuration imported from CSV successfully!"));
                } else {
                    const parsed = JSON.parse(content);
                    const targetConfig = parsed.importConfigs || parsed;
                    if (targetConfig.purchase || targetConfig.sales || targetConfig.bank) {
                        setImportConfigs(targetConfig);
                        localStorage.setItem('bharat_book_import_configs', JSON.stringify(targetConfig));
                        setSuccessMsg(t("Import rules configuration imported from JSON successfully!"));
                    } else {
                        throw new Error("Invalid schema");
                    }
                }
                setTimeout(() => setSuccessMsg(''), 4000);
            } catch (err) {
                setErrorMsg(t("Failed to parse configurations file."));
                setTimeout(() => setErrorMsg(''), 4000);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleExportFile = () => {
        let content = '';
        const filename = `import_rules_export.${fileFormat.toLowerCase()}`;

        if (fileFormat === 'CSV') {
            content = 'Section,Key,Value\n';
            Object.entries(importConfigs).forEach(([section, configObj]) => {
                Object.entries(configObj as any).forEach(([key, val]) => {
                    content += `${section},${key},${val}\n`;
                });
            });
        } else {
            content = JSON.stringify({ importConfigs }, null, 2);
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setSuccessMsg(t("Configuration exported successfully!"));
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleClear = () => {
        setSearchQuery('');
        const cleared = { ...DEFAULT_IMPORT_CONFIGS };
        Object.keys(cleared).forEach(section => {
            Object.keys((cleared as any)[section]).forEach(key => {
                const val = (cleared as any)[section][key];
                if (typeof val === 'boolean') (cleared as any)[section][key] = false;
            });
        });
        setImportConfigs(cleared);
        localStorage.setItem('bharat_book_import_configs', JSON.stringify(cleared));
        setSuccessMsg(t("All configurations cleared."));
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleReset = () => {
        setImportConfigs(DEFAULT_IMPORT_CONFIGS);
        localStorage.setItem('bharat_book_import_configs', JSON.stringify(DEFAULT_IMPORT_CONFIGS));
        setSuccessMsg(t("Configuration restored to factory defaults."));
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleSaveConfig = () => {
        localStorage.setItem('bharat_book_import_configs', JSON.stringify(importConfigs));
        setIsSaved(true);
        setSuccessMsg(t("Configurations saved successfully!"));
        setTimeout(() => {
            setIsSaved(false);
            setSuccessMsg('');
        }, 3000);
    };

    const isToolbarHiddenOnMobile = isSearchFocused || !!searchQuery;
    const showEmptyState = searchQuery && (
        (activeTab === 'global' && !isGlobalMatching) ||
        (activeTab === 'vouchers' && !hasVoucherMatching)
    );

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
            {/* 1. Subpage Header (Stacked two-row on mobile, 30% width-limit on desktop, flush tab alignments) */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                        <SettingsIcon className="w-5 h-5 animate-pulse" /> 
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Import Controls")}</h2>
                        <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Manage automatic voucher and transaction ingestion")}>
                            {t("Manage automatic voucher and transaction ingestion")}
                        </p>
                    </div>
                </div>

                {/* Flush right-hand Tab selection container */}
                <div className="min-w-0 flex-1 flex items-center">
                    <div 
                        ref={tabsContainerRef}
                        onWheel={handleWheel}
                        className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start min-w-0 scroll-smooth"
                    >
                        <button 
                            onClick={() => { setActiveTab('global'); setActiveAccordion(null); }}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'global' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <Sliders className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'global' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            <span>{t("Global Rules")}</span>
                            {searchQuery && globalBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {globalBadgeCount}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('vouchers'); setActiveAccordion(null); }}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'vouchers' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <Activity className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'vouchers' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            <span>{t("Voucher Specific")}</span>
                            {searchQuery && voucherBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {voucherBadgeCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Compact Actions Toolbar with Search Filter (Search expands full-row on mobile focus) */}
            <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in">
                <div className="flex-1 min-w-0 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder={t("Filter import parameters...")} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-350 transition-colors cursor-pointer"
                        >
                            <svg className="w-3 h-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Buttons controls bar with temporary search focus hidden class on mobile */}
                <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${isToolbarHiddenOnMobile ? "hidden sm:flex" : "flex"}`}>
                    <div className="relative inline-flex items-center shrink-0">
                        <select
                            value={fileFormat}
                            onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
                            className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-805 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-650 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
                            title={t("Simple Input and Output")}
                        >
                            <option value="JSON" className="bg-white dark:bg-gray-800">JSON</option>
                            <option value="CSV" className="bg-white dark:bg-gray-800">CSV</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Import Configurations")}
                    >
                        <Upload className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Import")}</span>
                    </button>

                    <button
                        onClick={handleExportFile}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Export Configurations")}
                    >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Export")}</span>
                    </button>

                    <button
                        onClick={handleClear}
                        className="hidden lg:flex px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Clear Settings")}
                    >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Clear")}</span>
                    </button>

                    <button
                        onClick={handleReset}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Reset Defaults")}
                    >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Reset")}</span>
                    </button>

                    <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>

                    <button
                        onClick={handleSaveConfig}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        title={isSaved ? t("Saved Configuration") : t("Save Configuration")}
                    >
                        {isSaved ? <CheckCircle className="w-3.5 h-3.5 shrink-0 animate-bounce text-emerald-600" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
                        <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
                    </button>
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportFile} 
                accept={fileFormat === 'JSON' ? '.json' : '.csv'} 
                className="hidden" 
            />

            {/* 3. Feedback Banner Notifications */}
            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs font-semibold">{successMsg}</p>
                </div>
            )}
            {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <p className="text-xs font-semibold">{errorMsg}</p>
                </div>
            )}

            {/* 4. Main Tabs Content Areas */}
            
            {/* If zero search matches found in the active classification tab */}
            {showEmptyState ? (
                <div className="p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-200/50 dark:border-gray-800 text-center space-y-4 max-w-lg mx-auto my-6 animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto border border-orange-100 dark:border-orange-900/30">
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">
                            {activeTab === 'global' ? t("No matches in Global Rules") : t("No matches in Voucher Specific Rules")}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {t("However, matching configurations exist in other tabs. Choose a categories block below to jump there:")}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {activeTab === 'global' && hasVoucherMatching && (
                            <button
                                onClick={() => setActiveTab('vouchers')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>{t("Voucher Specific Rules")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                                    {voucherBadgeCount}
                                </span>
                            </button>
                        )}
                        {activeTab === 'vouchers' && isGlobalMatching && (
                            <button
                                onClick={() => setActiveTab('global')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>{t("Global Rules")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                                    {globalBadgeCount}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {/* TAB A: Global AI Ingestion parameters (Styled with the premium 450px container wrapper) */}
                    {activeTab === 'global' && (
                        <motion.div
                            key="global"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 min-h-[450px] space-y-6"
                        >
                            <div className="border-b border-gray-100 dark:border-gray-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xs font-black text-gray-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-indigo-500" />
                                        {t("Global AI Import Rules")}
                                    </h3>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed mt-1">
                                        {t("Enforce strict automatic classification and matching thresholds across all ledger entry pipelines.")}
                                    </p>
                                </div>
                            </div>

                            {/* Configuration Import Portal card matches UserSettings schema */}
                            {setView && onImportCategoryChange && (
                                <div className="p-5 bg-gradient-to-r from-blue-50/50 via-blue-50/10 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-900/20 shadow-sm text-blue-600 self-start">
                                            <FileUp className="w-5 h-5 animate-pulse" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-blue-950 dark:text-blue-300">{t("Configuration Import Portal")}</h4>
                                            <p className="text-[11px] text-blue-700/85 dark:text-blue-400 mt-1 leading-relaxed max-w-xl font-medium">
                                                {t("Want to load custom environment backups, sensitivity ratings, Auto-Numbering preferences, or firm policies? Navigate directly to the Import wizard.")}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onImportCategoryChange('settings');
                                            setView('import');
                                        }}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer flex items-center"
                                    >
                                        <FileUp className="mr-2 w-4 h-4" />
                                        {t("Import Settings Profile")}
                                    </button>
                                </div>
                            )}

                            {/* Field-Level Filtering directly applied via isFieldVisible */}
                            <div className="space-y-1 divide-y divide-gray-100/60 dark:divide-gray-800/60">
                                {GLOBAL_IMPORT_FIELDS.map(field => {
                                    if (!isFieldVisible(field.label, field.extraTerms)) return null;

                                    const val = (toggles as any)[field.key];
                                    return (
                                        <div key={field.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                                            <div>
                                                <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t(field.label)}</p>
                                                <p className="text-[10px] text-gray-400 font-medium max-w-sm mt-0.5">{t(field.description)}</p>
                                            </div>
                                            <div onClick={() => handleToggle(field.key)} className={`${val ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0`}>
                                                <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${val ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB B: Voucher Specific accordions list */}
                    {activeTab === 'vouchers' && (
                        <motion.div
                            key="vouchers"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 min-h-[450px]"
                        >
                            {importTypes.map((type) => {
                                const isVisible = isSectionVisible(type.id);
                                const isExpanded = isSectionExpanded(type.id);

                                if (!isVisible) return null;

                                return (
                                    <div key={type.id} className="border-t border-gray-100 dark:border-gray-800 overflow-hidden first:border-t-0">
                                        {/* Accordion Trigger row with off-white bg triggers */}
                                        <button
                                            onClick={() => toggleAccordion(type.id)}
                                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 transition-colors cursor-pointer text-left focus:outline-none"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {type.icon}
                                                </span>
                                                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest text-[11px]">
                                                    {t(type.title)}
                                                </h3>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                                            )}
                                        </button>

                                        {/* Animated framer motion drop frame */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6 sm:px-8 space-y-6 bg-white dark:bg-gray-850 text-left border-t border-gray-100/50 dark:border-gray-800/50">
                                                        {type.component}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};
