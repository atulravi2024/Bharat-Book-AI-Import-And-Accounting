import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { SettingsIcon } from "../../icons/IconComponents";
import { 
    SlidersHorizontal, BookOpen, Sparkles, Layers, Terminal, Search, Upload, 
    Download, Trash2, RotateCcw, Save, CheckCircle, AlertTriangle, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BasicRuleSection } from './MappingRuleSettings/BasicRuleSection.tsx';
import { ListRuleSection } from './MappingRuleSettings/ListRuleSection.tsx';
import { PatternRuleSection } from './MappingRuleSettings/PatternRuleSection.tsx';
import { MappingListSection } from './MappingRuleSettings/MappingListSection.tsx';
import { SandboxSection } from './MappingRuleSettings/SandboxSection.tsx';

interface MappingSettingsProps {
    advancedParsingEnabled: boolean;
    setAdvancedParsingEnabled: (val: boolean) => void;
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
    customMappingRules: {id: string, keyword: string, targetField: 'partyName' | 'ledger' | 'type', targetValue: string, priority?: number, isRegex?: boolean}[];
    setCustomMappingRules: (rules: any) => void;
    bankMappings: {name: string, no: string, type: string}[];
    setBankMappings: (mappings: any) => void;
    bankChargesKeywords: string;
    setBankChargesKeywords: (val: string) => void;
    cashFlowKeywords: string;
    setCashFlowKeywords: (val: string) => void;
    selfTransferKeywords: string;
    setSelfTransferKeywords: (val: string) => void;
    mappingRules: {kw: string, led: string}[];
    setMappingRules: (rules: any) => void;
    missingMasterAction: string;
    setMissingMasterAction: (val: string) => void;
    processingPriority: string;
    setProcessingPriority: (val: string) => void;
    sandboxInput: string;
    setSandboxInput: (val: string) => void;
    runSandboxSimulator: () => void;
    sandboxResult: any;
    runBulkSimulator: (inputs: string[]) => void;
    bulkSandboxResults: any[];
    setBulkSandboxResults: (results: any[]) => void;
    sourceColumn: string;
    setSourceColumn: (val: string) => void;
    splitDelimiter: string;
    setSplitDelimiter: (val: string) => void;
    ignoreExtractionKeywords: string;
    setIgnoreExtractionKeywords: (val: string) => void;
    partyNameLocation: string;
    setPartyNameLocation: (val: string) => void;
    utrExtractorType: string;
    setUtrExtractorType: (val: string) => void;
    accountNumberDetection: string;
    setAccountNumberDetection: (val: string) => void;
    bankShortCodes: string;
    setBankShortCodes: (val: string) => void;
    bankIgnoreWords: string;
    setBankIgnoreWords: (val: string) => void;
    paymentModes: string;
    setPaymentModes: (val: string) => void;
    paymentChannels: string;
    setPaymentChannels: (val: string) => void;
    ifscPrefixes: string;
    setIfscPrefixes: (val: string) => void;
}

export const MappingSettings: React.FC<MappingSettingsProps> = ({
    advancedParsingEnabled, setAdvancedParsingEnabled,
    toggles, handleToggle,
    customMappingRules, setCustomMappingRules,
    bankMappings, setBankMappings,
    bankChargesKeywords, setBankChargesKeywords,
    cashFlowKeywords, setCashFlowKeywords,
    selfTransferKeywords, setSelfTransferKeywords,
    mappingRules, setMappingRules,
    missingMasterAction, setMissingMasterAction,
    processingPriority, setProcessingPriority,
    sandboxInput, setSandboxInput,
    runSandboxSimulator,
    sandboxResult,
    runBulkSimulator,
    bulkSandboxResults,
    setBulkSandboxResults,
    sourceColumn, setSourceColumn,
    splitDelimiter, setSplitDelimiter,
    ignoreExtractionKeywords, setIgnoreExtractionKeywords,
    partyNameLocation, setPartyNameLocation,
    utrExtractorType, setUtrExtractorType,
    accountNumberDetection, setAccountNumberDetection,
    bankShortCodes, setBankShortCodes,
    bankIgnoreWords, setBankIgnoreWords,
    paymentModes, setPaymentModes,
    paymentChannels, setPaymentChannels,
    ifscPrefixes, setIfscPrefixes
}) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'basic' | 'list' | 'pattern' | 'mappingList' | 'sandbox'>('basic');

    React.useEffect(() => {
        const checkOverride = () => {
            const override = localStorage.getItem('bharat_book_mapping_subtab_override');
            if (override) {
                let targetTab: any = null;
                if (override === 'column_align') targetTab = 'basic';
                else if (override === 'master_link') targetTab = 'list';
                else if (['basic', 'list', 'pattern', 'mappingList', 'sandbox'].includes(override)) {
                    targetTab = override;
                }
                if (targetTab) {
                    setActiveTab(targetTab);
                }
                localStorage.removeItem('bharat_book_mapping_subtab_override');
            }
        };
        checkOverride();
        window.addEventListener('bharat_book_mapping_subtab_trigger', checkOverride);
        return () => window.removeEventListener('bharat_book_mapping_subtab_trigger', checkOverride);
    }, []);
    const [successMsg, setSuccessMsg] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');
    const [isSaved, setIsSaved] = React.useState(false);
    const [fileFormat, setFileFormat] = React.useState<'JSON' | 'CSV'>('JSON');
    
    const localFileInputRef = React.useRef<HTMLInputElement>(null);
    const tabsContainerRef = React.useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    const isSectionMatching = (secId: string, query: string) => {
        if (!query) return false;
        
        const words = query.toLowerCase().trim().split(/\s+/);
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

        let targets: string[] = [];
        if (secId === 'basic') {
            targets = [
                'basic', 'default', 'rule', 'rules', 'contra', 'detection', 'auto', 'mobile', 'transfer', 'gstin', 'pan', 'tan', 'master', 'action', 'priority', 'processing',
                t("Basic Rules"),
                t("Auto Contra Detection"),
                t("Identify Mobile Transfer"),
                t("Auto Detect GSTIN"),
                t("Auto Detect PAN TAN"),
                missingMasterAction,
                processingPriority
            ];
        } else if (secId === 'list') {
            targets = [
                'list', 'lists', 'exclusion', 'exclusions', 'short', 'code', 'codes', 'ignore', 'payment', 'mode', 'modes', 'channel', 'channels', 'ifsc', 'prefix', 'prefixes', 'bank',
                t("List Exclusions"),
                bankShortCodes,
                bankIgnoreWords,
                paymentModes,
                paymentChannels,
                ifscPrefixes
            ];
        } else if (secId === 'pattern') {
            targets = [
                'pattern', 'extraction', 'advanced', 'parse', 'parsing', 'delimiter', 'source', 'column', 'party', 'utr', 'account', 'alias', 'aliases', 'regexp', 'regex',
                t("Advanced Parsing & Extraction"),
                sourceColumn,
                splitDelimiter,
                ignoreExtractionKeywords,
                partyNameLocation,
                utrExtractorType,
                accountNumberDetection
            ];
        } else if (secId === 'mappingList') {
            targets = [
                'mapping', 'mappings', 'custom', 'charge', 'charges', 'cash', 'flow', 'self', 'transfer', 'keyword', 'keywords',
                t("Custom Settings List"),
                bankChargesKeywords,
                cashFlowKeywords,
                selfTransferKeywords
            ];
        } else if (secId === 'sandbox') {
            targets = [
                'sandbox', 'simulator', 'bulk', 'test', 'run', 'preview', 'trial',
                t("Simulator Sandbox")
            ];
        }

        const lowerTargets = targets.map(t => (t || '').toLowerCase());

        if (negativeTerms.length > 0) {
            const hasNegativeMatch = negativeTerms.some(neg =>
                lowerTargets.some(target => target.includes(neg))
            );
            if (hasNegativeMatch) return false;
        }

        if (positiveTerms.length > 0) {
            const hasAllPositive = positiveTerms.every(pos =>
                lowerTargets.some(target => target.includes(pos))
            );
            if (!hasAllPositive) return false;
        }

        return true;
    };

    const basicBadgeCount = searchQuery ? (isSectionMatching('basic', searchQuery) ? 1 : 0) : 0;
    const listBadgeCount = searchQuery ? (isSectionMatching('list', searchQuery) ? 1 : 0) : 0;
    const patternBadgeCount = searchQuery ? (isSectionMatching('pattern', searchQuery) ? 1 : 0) : 0;
    const mappingListBadgeCount = searchQuery ? (isSectionMatching('mappingList', searchQuery) ? 1 : 0) : 0;
    const sandboxBadgeCount = searchQuery ? (isSectionMatching('sandbox', searchQuery) ? 1 : 0) : 0;

    const hasBasicMatching = basicBadgeCount > 0;
    const hasListMatching = listBadgeCount > 0;
    const hasPatternMatching = patternBadgeCount > 0;
    const hasMappingListMatching = mappingListBadgeCount > 0;
    const hasSandboxMatching = sandboxBadgeCount > 0;

    const anyMatchesExist = hasBasicMatching || hasListMatching || hasPatternMatching || hasMappingListMatching || hasSandboxMatching;

    const isShowingSection = (secId: 'basic' | 'list' | 'pattern' | 'mappingList' | 'sandbox') => {
        if (!searchQuery) return activeTab === secId;
        return isSectionMatching(secId, searchQuery);
    };

    const isToolbarHiddenOnMobile = isSearchFocused || !!searchQuery;
    const showEmptyState = searchQuery && !isSectionMatching(activeTab, searchQuery);

    const handleSaveConfig = () => {
        const settings = {
            bankMappings, bankShortCodes, bankIgnoreWords, paymentModes, paymentChannels, ifscPrefixes,
            toggles, missingMasterAction, processingPriority, bankChargesKeywords, cashFlowKeywords,
            selfTransferKeywords, customMappingRules, sourceColumn, splitDelimiter, ignoreExtractionKeywords,
            partyNameLocation, utrExtractorType, accountNumberDetection
        };
        const previousSettingsStr = localStorage.getItem("bharat_book_app_settings");
        const previousSettings = previousSettingsStr ? JSON.parse(previousSettingsStr) : {};
        
        const mergedSettings = { ...previousSettings, ...settings };
        localStorage.setItem("bharat_book_app_settings", JSON.stringify(mergedSettings));
        window.dispatchEvent(new Event("bharat_book_settings_updated"));
        
        setIsSaved(true);
        setSuccessMsg(t("Mapping settings saved successfully!"));
        setTimeout(() => {
            setIsSaved(false);
            setSuccessMsg('');
        }, 3000);
    };

    const handleClear = () => {
        setSearchQuery('');
        setBankChargesKeywords('');
        setCashFlowKeywords('');
        setSelfTransferKeywords('');
        setBankShortCodes('');
        setBankIgnoreWords('');
        setPaymentModes('');
        setPaymentChannels('');
        setIfscPrefixes('');
        setCustomMappingRules([]);
        setBankMappings([]);
        setSuccessMsg(t("Mapping configurations cleared."));
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleReset = () => {
        setBankChargesKeywords('charges, commission, chgs, fee');
        setCashFlowKeywords('cash, withdrawal, deposit');
        setSelfTransferKeywords('self, transfer, internal');
        setBankShortCodes('HDFC, ICICI, SBI, AXIS');
        setBankIgnoreWords('payment, transfer, neft, rtgs, imps');
        setPaymentModes('ONLINE, CHEQUE, CASH');
        setPaymentChannels('upi, netbanking, branch');
        setIfscPrefixes('HDFC, ICIC, SBIN, UTIB');
        setCustomMappingRules([]);
        setBankMappings([]);
        setSuccessMsg(t("Restored mapping presets to defaults."));
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleExportFile = () => {
        const settings = {
            bankMappings, bankShortCodes, bankIgnoreWords, paymentModes, paymentChannels, ifscPrefixes,
            toggles, missingMasterAction, processingPriority, bankChargesKeywords, cashFlowKeywords,
            selfTransferKeywords, customMappingRules, sourceColumn, splitDelimiter, ignoreExtractionKeywords,
            partyNameLocation, utrExtractorType, accountNumberDetection
        };
        let content = '';
        const filename = `mapping_rules_export.${fileFormat.toLowerCase()}`;

        if (fileFormat === 'CSV') {
            content = 'Key,Value\n';
            Object.entries(settings).forEach(([key, val]) => {
                const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
                content += `${key},"${valStr.replace(/"/g, '""')}"\n`;
            });
        } else {
            content = JSON.stringify(settings, null, 2);
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setSuccessMsg(t("Mapping configurations exported successfully!"));
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            try {
                if (file.name.endsWith('.csv') || fileFormat === 'CSV') {
                    const lines = content.split('\n');
                    lines.forEach((line) => {
                        const index = line.indexOf(',');
                        if (index === -1) return;
                        const key = line.substring(0, index).trim();
                        let val = line.substring(index + 1).trim();
                        if (val.startsWith('"') && val.endsWith('"')) {
                            val = val.substring(1, val.length - 1).replace(/""/g, '"');
                        }
                        try {
                            if (key === 'bankMappings') setBankMappings(JSON.parse(val));
                            else if (key === 'customMappingRules') setCustomMappingRules(JSON.parse(val));
                            else if (key === 'bankChargesKeywords') setBankChargesKeywords(val);
                            else if (key === 'cashFlowKeywords') setCashFlowKeywords(val);
                            else if (key === 'selfTransferKeywords') setSelfTransferKeywords(val);
                            else if (key === 'bankShortCodes') setBankShortCodes(val);
                            else if (key === 'bankIgnoreWords') setBankIgnoreWords(val);
                            else if (key === 'paymentModes') setPaymentModes(val);
                            else if (key === 'paymentChannels') setPaymentChannels(val);
                            else if (key === 'ifscPrefixes') setIfscPrefixes(val);
                            else if (key === 'sourceColumn') setSourceColumn(val);
                            else if (key === 'splitDelimiter') setSplitDelimiter(val);
                            else if (key === 'ignoreExtractionKeywords') setIgnoreExtractionKeywords(val);
                            else if (key === 'partyNameLocation') setPartyNameLocation(val);
                            else if (key === 'utrExtractorType') setUtrExtractorType(val);
                            else if (key === 'accountNumberDetection') setAccountNumberDetection(val);
                        } catch (itemErr) {
                            if (key === 'bankChargesKeywords') setBankChargesKeywords(val);
                            else if (key === 'cashFlowKeywords') setCashFlowKeywords(val);
                            else if (key === 'selfTransferKeywords') setSelfTransferKeywords(val);
                            else if (key === 'bankShortCodes') setBankShortCodes(val);
                            else if (key === 'bankIgnoreWords') setBankIgnoreWords(val);
                            else if (key === 'paymentModes') setPaymentModes(val);
                            else if (key === 'paymentChannels') setPaymentChannels(val);
                            else if (key === 'ifscPrefixes') setIfscPrefixes(val);
                        }
                    });
                    setSuccessMsg(t("Mapping configuration loaded from CSV successfully!"));
                } else {
                    const parsed = JSON.parse(content);
                    if (parsed.bankShortCodes !== undefined) setBankShortCodes(parsed.bankShortCodes);
                    if (parsed.bankIgnoreWords !== undefined) setBankIgnoreWords(parsed.bankIgnoreWords);
                    if (parsed.paymentModes !== undefined) setPaymentModes(parsed.paymentModes);
                    if (parsed.paymentChannels !== undefined) setPaymentChannels(parsed.paymentChannels);
                    if (parsed.ifscPrefixes !== undefined) setIfscPrefixes(parsed.ifscPrefixes);
                    if (parsed.bankChargesKeywords !== undefined) setBankChargesKeywords(parsed.bankChargesKeywords);
                    if (parsed.cashFlowKeywords !== undefined) setCashFlowKeywords(parsed.cashFlowKeywords);
                    if (parsed.selfTransferKeywords !== undefined) setSelfTransferKeywords(parsed.selfTransferKeywords);
                    if (parsed.customMappingRules !== undefined) setCustomMappingRules(parsed.customMappingRules);
                    if (parsed.bankMappings !== undefined) setBankMappings(parsed.bankMappings);
                    if (parsed.sourceColumn !== undefined) setSourceColumn(parsed.sourceColumn);
                    if (parsed.splitDelimiter !== undefined) setSplitDelimiter(parsed.splitDelimiter);
                    if (parsed.ignoreExtractionKeywords !== undefined) setIgnoreExtractionKeywords(parsed.ignoreExtractionKeywords);
                    if (parsed.partyNameLocation !== undefined) setPartyNameLocation(parsed.partyNameLocation);
                    if (parsed.utrExtractorType !== undefined) setUtrExtractorType(parsed.utrExtractorType);
                    if (parsed.accountNumberDetection !== undefined) setAccountNumberDetection(parsed.accountNumberDetection);
                    setSuccessMsg(t("Mapping configuration loaded from JSON successfully!"));
                }
                setTimeout(() => setSuccessMsg(''), 3000);
            } catch (err) {
                setErrorMsg(t("Failed to parse configuration file."));
                setTimeout(() => setErrorMsg(''), 3000);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
            {/* 1. Subpage Header Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                        <SettingsIcon className="w-5 h-5 animate-pulse" /> 
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Mapping & Narration Parsing")}</h2>
                        <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Define rule pipelines and run sandbox simulations.")}>
                            {t("Define rule pipelines and run sandbox simulations.")}
                        </p>
                    </div>
                </div>

                {/* Flush right Tab Selections */}
                <div className="min-w-0 flex-1 flex items-center">
                    <div 
                        ref={tabsContainerRef}
                        onWheel={handleWheel}
                        className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start min-w-0 scroll-smooth"
                    >
                        <button 
                            onClick={() => setActiveTab('basic')}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'basic' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <SlidersHorizontal className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'basic' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span>{t("Basic Rules")}</span>
                            {searchQuery && basicBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {basicBadgeCount}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={() => setActiveTab('list')}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'list' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <BookOpen className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'list' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span>{t("Lists & Exclusions")}</span>
                            {searchQuery && listBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {listBadgeCount}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={() => setActiveTab('pattern')}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'pattern' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <Sparkles className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'pattern' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span>{t("Patterns")}</span>
                            {searchQuery && patternBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {patternBadgeCount}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={() => setActiveTab('mappingList')}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'mappingList' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <Layers className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'mappingList' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span>{t("Direct Mappings")}</span>
                            {searchQuery && mappingListBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {mappingListBadgeCount}
                                </span>
                            )}
                        </button>

                        <button 
                            onClick={() => setActiveTab('sandbox')}
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'sandbox' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                            }`}
                        >
                            <Terminal className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'sandbox' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span>{t("Sandbox")}</span>
                            {searchQuery && sandboxBadgeCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {sandboxBadgeCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Compact Actions & Search Inline Row */}
            <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in">
                <div className="flex-1 min-w-0 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder={t("Filter mapping rules...")} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-355 transition-colors cursor-pointer"
                        >
                            <svg className="w-3 h-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${isToolbarHiddenOnMobile ? "hidden sm:flex" : "flex"}`}>
                    <div className="relative inline-flex items-center shrink-0">
                        <select
                            value={fileFormat}
                            onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
                            className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-805 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-650 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
                            title={t("Format Source")}
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
                        onClick={() => localFileInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Import Mapping Rules")}
                    >
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">{t("Import")}</span>
                    </button>

                    <button
                        onClick={handleExportFile}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Export Mapping Rules")}
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">{t("Export")}</span>
                    </button>

                    <button
                        onClick={handleClear}
                        className="hidden lg:flex px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Clear All Mapping Configurations")}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">{t("Clear")}</span>
                    </button>

                    <button
                        onClick={handleReset}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        title={t("Reset Presets to Defaults")}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">{t("Reset")}</span>
                    </button>

                    <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>

                    <button
                        onClick={handleSaveConfig}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        title={isSaved ? t("Saved Configuration") : t("Save")}
                    >
                        {isSaved ? <CheckCircle className="w-3.5 h-3.5 animate-bounce text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
                        <span className="hidden lg:inline">{isSaved ? t("Saved") : t("Save")}</span>
                    </button>
                </div>
            </div>

            <input 
                type="file" 
                ref={localFileInputRef} 
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

            {/* 4. Filter Redirections / Empty States matching search inputs */}
            {showEmptyState ? (
                <div className="p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-200/50 dark:border-gray-800 text-center space-y-4 max-w-lg mx-auto my-6 animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 text-orange-505 rounded-2xl flex items-center justify-center mx-auto border border-orange-100 dark:border-orange-900/30">
                        <AlertTriangle className="w-6 h-6 animate-bounce text-orange-550" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">
                            {t("No matches in current tab")}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {t("Matches are available in other categories. Click a block below to jump there instantly:")}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {hasBasicMatching && (
                            <button
                                onClick={() => setActiveTab('basic')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-105 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95 animate-in fade-in"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>{t("Basic Rules")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">1</span>
                            </button>
                        )}
                        {hasListMatching && (
                            <button
                                onClick={() => setActiveTab('list')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-105 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95 animate-in fade-in"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{t("Lists & Exclusions")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">1</span>
                            </button>
                        )}
                        {hasPatternMatching && (
                            <button
                                onClick={() => setActiveTab('pattern')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-105 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95 animate-in fade-in"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{t("Patterns")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">1</span>
                            </button>
                        )}
                        {hasMappingListMatching && (
                            <button
                                onClick={() => setActiveTab('mappingList')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-105 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95 animate-in fade-in"
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span>{t("Direct Mappings")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">1</span>
                            </button>
                        )}
                        {hasSandboxMatching && (
                            <button
                                onClick={() => setActiveTab('sandbox')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-105 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer shadow-sm active:scale-95 animate-in fade-in"
                            >
                                <Terminal className="w-3.5 h-3.5" />
                                <span>{t("Sandbox")}</span>
                                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-black">1</span>
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* 5. Main Responsive Content Area */
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 min-h-[450px]">
                    <AnimatePresence mode="wait">
                        {isShowingSection('basic') && (
                            <motion.div
                                key="basic"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -3 }}
                                transition={{ duration: 0.15 }}
                            >
                                <BasicRuleSection 
                                    isOpen={true}
                                    toggleSection={() => {}}
                                    toggles={toggles}
                                    handleToggle={handleToggle}
                                    missingMasterAction={missingMasterAction}
                                    setMissingMasterAction={setMissingMasterAction}
                                    processingPriority={processingPriority}
                                    setProcessingPriority={setProcessingPriority}
                                    searchTerm={searchQuery}
                                />
                            </motion.div>
                        )}

                        {isShowingSection('list') && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -3 }}
                                transition={{ duration: 0.15 }}
                            >
                                <ListRuleSection 
                                    isOpen={true}
                                    toggleSection={() => {}}
                                    toggles={toggles}
                                    handleToggle={handleToggle}
                                    bankShortCodes={bankShortCodes}
                                    setBankShortCodes={setBankShortCodes}
                                    bankIgnoreWords={bankIgnoreWords}
                                    setBankIgnoreWords={setBankIgnoreWords}
                                    paymentModes={paymentModes}
                                    setPaymentModes={setPaymentModes}
                                    paymentChannels={paymentChannels}
                                    setPaymentChannels={setPaymentChannels}
                                    ifscPrefixes={ifscPrefixes}
                                    setIfscPrefixes={setIfscPrefixes}
                                    searchTerm={searchQuery}
                                />
                            </motion.div>
                        )}

                        {isShowingSection('pattern') && (
                            <motion.div
                                key="pattern"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -3 }}
                                transition={{ duration: 0.15 }}
                            >
                                <PatternRuleSection 
                                    isOpen={true}
                                    toggleSection={() => {}}
                                    toggles={toggles}
                                    handleToggle={handleToggle}
                                    advancedParsingEnabled={advancedParsingEnabled}
                                    setAdvancedParsingEnabled={setAdvancedParsingEnabled}
                                    sourceColumn={sourceColumn}
                                    setSourceColumn={setSourceColumn}
                                    splitDelimiter={splitDelimiter}
                                    setSplitDelimiter={setSplitDelimiter}
                                    ignoreExtractionKeywords={ignoreExtractionKeywords}
                                    setIgnoreExtractionKeywords={setIgnoreExtractionKeywords}
                                    partyNameLocation={partyNameLocation}
                                    setPartyNameLocation={setPartyNameLocation}
                                    utrExtractorType={utrExtractorType}
                                    setUtrExtractorType={setUtrExtractorType}
                                    accountNumberDetection={accountNumberDetection}
                                    setAccountNumberDetection={setAccountNumberDetection}
                                    searchTerm={searchQuery}
                                />
                            </motion.div>
                        )}

                        {isShowingSection('mappingList') && (
                            <motion.div
                                key="mappingList"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -3 }}
                                transition={{ duration: 0.15 }}
                            >
                                <MappingListSection 
                                    isOpen={true}
                                    toggleSection={() => {}}
                                    toggles={toggles}
                                    handleToggle={handleToggle}
                                    customMappingRules={customMappingRules}
                                    setCustomMappingRules={setCustomMappingRules}
                                    bankMappings={bankMappings}
                                    setBankMappings={setBankMappings}
                                    bankChargesKeywords={bankChargesKeywords}
                                    setBankChargesKeywords={setBankChargesKeywords}
                                    cashFlowKeywords={cashFlowKeywords}
                                    setCashFlowKeywords={setCashFlowKeywords}
                                    selfTransferKeywords={selfTransferKeywords}
                                    setSelfTransferKeywords={setSelfTransferKeywords}
                                    mappingRules={mappingRules}
                                    setMappingRules={setMappingRules}
                                    searchTerm={searchQuery}
                                />
                            </motion.div>
                        )}

                        {isShowingSection('sandbox') && (
                            <motion.div
                                key="sandbox"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -3 }}
                                transition={{ duration: 0.15 }}
                            >
                                <SandboxSection 
                                    isOpen={true}
                                    toggleSection={() => {}}
                                    toggles={toggles}
                                    handleToggle={handleToggle}
                                    sandboxMode={sandboxInput ? 'single' : 'bulk'}
                                    setSandboxMode={() => {}}
                                    sandboxInput={sandboxInput}
                                    setSandboxInput={setSandboxInput}
                                    runSandboxSimulator={runSandboxSimulator}
                                    sandboxResult={sandboxResult}
                                    runBulkSimulator={runBulkSimulator}
                                    bulkSandboxResults={bulkSandboxResults}
                                    setBulkSandboxResults={setBulkSandboxResults}
                                    searchTerm={searchQuery}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
