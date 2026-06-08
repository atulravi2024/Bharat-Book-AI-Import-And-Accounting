import React, { useState } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { 
    BookOpen, HelpCircle, X, Plus, Info, RefreshCw, 
    ArrowUpRight, Landmark, FileText, CreditCard, Radio, Shield, Sparkles, ChevronUp, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ListRuleSectionProps {
    isOpen: boolean;
    toggleSection?: () => void;
    toggles: any;
    handleToggle: (key: any) => void;
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
    searchTerm?: string;
}

export const ListRuleSection: React.FC<ListRuleSectionProps> = ({
    isOpen,
    bankShortCodes,
    setBankShortCodes,
    bankIgnoreWords,
    setBankIgnoreWords,
    paymentModes,
    setPaymentModes,
    paymentChannels,
    setPaymentChannels,
    ifscPrefixes,
    setIfscPrefixes,
    searchTerm = ''
}) => {
    const { t } = useLanguage();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    // Standard pre-defined lists for easy comparison / seed loading
    const PRESETS = {
        bankCodes: ["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "PNB", "BOB", "YESB", "HSBC", "CITI"],
        ignoreWords: ["PVT", "LTD", "PVT.", "LTD.", "PRIVATE", "LIMITED", "CO", "CORP", "INC", "SERVICES", "INDIA"],
        paymentModes: ["UPI", "IMPS", "NEFT", "RTGS", "NACH", "CHQ", "DD", "CASH", "ATM"],
        paymentChannels: ["PAYTM", "PHONEPE", "GPAY", "BHIM", "RAZORPAY", "AUTOPE", "CRED", "STRIPE", "PAYPAL", "AMAZONPAY"],
        ifscPrefixes: ["HDFC", "ICIC", "SBIN", "UTIB", "KKBK", "PUNB", "BARB", "YESB", "IBKL", "CNRB"]
    };

    // Keep temporary typed values
    const [inputs, setInputs] = useState({
        bankCodes: '',
        ignoreWords: '',
        paymentModes: '',
        paymentChannels: '',
        ifscPrefixes: ''
    });

    if (!isOpen) return null;

    const toggleAccordion = (key: string) => {
        setActiveAccordion(prev => {
            const next = prev === key ? null : key;
            if (next) localStorage.setItem('bharat_book_accordion_list', next);
            else localStorage.removeItem('bharat_book_accordion_list');
            return next;
        });
    };

    // Helper: Parse comma separated string into unique trimmed elements
    const getPills = (str: string) => {
        if (!str) return [];
        return str.split(',')
                  .map(item => item.trim())
                  .filter(item => item.length > 0);
    };

    // Helper: Add tag
    const handleAddTag = (category: 'bankCodes' | 'ignoreWords' | 'paymentModes' | 'paymentChannels' | 'ifscPrefixes', val: string) => {
        const trimmed = val.trim().toUpperCase();
        if (!trimmed) return;

        let currentStr = '';
        let setter: (v: string) => void;

        switch (category) {
            case 'bankCodes':
                currentStr = bankShortCodes;
                setter = setBankShortCodes;
                break;
            case 'ignoreWords':
                currentStr = bankIgnoreWords;
                setter = setBankIgnoreWords;
                break;
            case 'paymentModes':
                currentStr = paymentModes;
                setter = setPaymentModes;
                break;
            case 'paymentChannels':
                currentStr = paymentChannels;
                setter = setPaymentChannels;
                break;
            case 'ifscPrefixes':
                currentStr = ifscPrefixes;
                setter = setIfscPrefixes;
                break;
        }

        const list = getPills(currentStr);
        if (!list.includes(trimmed)) {
            const updated = [...list, trimmed].join(', ');
            setter(updated);
        }

        setInputs(prev => ({ ...prev, [category]: '' }));
    };

    // Helper: Remove tag
    const handleRemoveTag = (category: 'bankCodes' | 'ignoreWords' | 'paymentModes' | 'paymentChannels' | 'ifscPrefixes', tag: string) => {
        let currentStr = '';
        let setter: (v: string) => void;

        switch (category) {
            case 'bankCodes':
                currentStr = bankShortCodes;
                setter = setBankShortCodes;
                break;
            case 'ignoreWords':
                currentStr = bankIgnoreWords;
                setter = setBankIgnoreWords;
                break;
            case 'paymentModes':
                currentStr = paymentModes;
                setter = setPaymentModes;
                break;
            case 'paymentChannels':
                currentStr = paymentChannels;
                setter = setPaymentChannels;
                break;
            case 'ifscPrefixes':
                currentStr = ifscPrefixes;
                setter = setIfscPrefixes;
                break;
        }

        const list = getPills(currentStr);
        const filtered = list.filter(item => item !== tag);
        setter(filtered.join(', '));
    };

    // Helper: Restore whole category override
    const handleLoadCategoryPreset = (category: 'bankCodes' | 'ignoreWords' | 'paymentModes' | 'paymentChannels' | 'ifscPrefixes') => {
        let presetList: string[] = [];
        let setter: (v: string) => void;

        switch (category) {
            case 'bankCodes':
                presetList = PRESETS.bankCodes;
                setter = setBankShortCodes;
                break;
            case 'ignoreWords':
                presetList = PRESETS.ignoreWords;
                setter = setBankIgnoreWords;
                break;
            case 'paymentModes':
                presetList = PRESETS.paymentModes;
                setter = setPaymentModes;
                break;
            case 'paymentChannels':
                presetList = PRESETS.paymentChannels;
                setter = setPaymentChannels;
                break;
            case 'ifscPrefixes':
                presetList = PRESETS.ifscPrefixes;
                setter = setIfscPrefixes;
                break;
        }

        setter(presetList.join(', '));
    };

    const handleClearCategory = (category: 'bankCodes' | 'ignoreWords' | 'paymentModes' | 'paymentChannels' | 'ifscPrefixes') => {
        let setter: (v: string) => void;
        switch (category) {
            case 'bankCodes': setter = setBankShortCodes; break;
            case 'ignoreWords': setter = setBankIgnoreWords; break;
            case 'paymentModes': setter = setPaymentModes; break;
            case 'paymentChannels': setter = setPaymentChannels; break;
            case 'ifscPrefixes': setter = setIfscPrefixes; break;
        }
        setter('');
    };

    // Filter matching logic based on search query
    const isSectionVisible = (secKey: string) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase().trim();
        if (secKey === 'bank-identity') {
            return t("Bank Identity Signifiers").toLowerCase().includes(q) || 
                   getPills(bankShortCodes).some(tag => tag.toLowerCase().includes(q)) ||
                   "standard bank identifier tags found in stream files".includes(q);
        }
        if (secKey === 'ignore-words') {
            return t("Clutter Suffix Ignore Registry").toLowerCase().includes(q) || 
                   getPills(bankIgnoreWords).some(tag => tag.toLowerCase().includes(q)) ||
                   "corporate abbreviations stripped off the tail".includes(q);
        }
        if (secKey === 'payment-modes') {
            return t("Channel Payment Modes").toLowerCase().includes(q) || 
                   getPills(paymentModes).some(tag => tag.toLowerCase().includes(q)) ||
                   "standard financial routing modes mapped".includes(q);
        }
        if (secKey === 'payment-channels') {
            return t("Commercial Gateway Channels").toLowerCase().includes(q) || 
                   getPills(paymentChannels).some(tag => tag.toLowerCase().includes(q)) ||
                   "digital wallet and upi aggregator keys".includes(q);
        }
        if (secKey === 'ifsc-prefixes') {
            return t("Indian Financial System Code (IFSC) Gateway Prefixes").toLowerCase().includes(q) || 
                   getPills(ifscPrefixes).some(tag => tag.toLowerCase().includes(q)) ||
                   "standard branch alphanumeric starting codes".includes(q);
        }
        return false;
    };

    const isBankVisible = isSectionVisible('bank-identity');
    const isBankExpanded = activeAccordion === 'bank-identity' || (Boolean(searchTerm) && isBankVisible);

    const isIgnoreVisible = isSectionVisible('ignore-words');
    const isIgnoreExpanded = activeAccordion === 'ignore-words' || (Boolean(searchTerm) && isIgnoreVisible);

    const isModesVisible = isSectionVisible('payment-modes');
    const isModesExpanded = activeAccordion === 'payment-modes' || (Boolean(searchTerm) && isModesVisible);

    const isChannelsVisible = isSectionVisible('payment-channels');
    const isChannelsExpanded = activeAccordion === 'payment-channels' || (Boolean(searchTerm) && isChannelsVisible);

    const isIfscVisible = isSectionVisible('ifsc-prefixes');
    const isIfscExpanded = activeAccordion === 'ifsc-prefixes' || (Boolean(searchTerm) && isIfscVisible);

    return (
        <div className="animate-in fade-in duration-205">
            {/* Tab Header explanation banner with padded header container */}
            <div className="p-6 sm:p-8 pb-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    {t("Lists & Exclusion Registries")}
                </h3>
                <p className="text-[11px] text-gray-500 font-normal leading-relaxed mt-1 dark:text-gray-400">
                    {t("Add, delete, or re-seed standardized keywords to skip noise during name extraction and filter transaction categories.")}
                </p>
            </div>

            {/* Collapsible Accordion Container with Edge-to-Edge display */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                
                {/* 1. Bank Short Codes Accordion */}
                {isBankVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("bank-identity")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Landmark className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Bank Identity Signifiers")}
                                </h3>
                            </div>
                            {isBankExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isBankExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400 max-w-xl">
                                                {t("Standard bank identifier tags found in stream files (e.g., HDFC, SBI). These are stripped or factored out of target party names during processing.")}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleLoadCategoryPreset('bankCodes')}
                                                    className="text-[9px] uppercase font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                                                >
                                                    {t("Sync Presets")}
                                                </button>
                                                <button
                                                    onClick={() => handleClearCategory('bankCodes')}
                                                    className="text-[9px] uppercase font-black text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    {t("Clear")}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tag pills container */}
                                        <div className="flex flex-wrap gap-1.5 p-4 min-h-[70px] bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl max-h-[140px] overflow-y-auto">
                                            {getPills(bankShortCodes).length === 0 ? (
                                                <span className="text-[10px] text-gray-400 font-bold self-center mx-auto">{t("No active elements. Add custom keys below.")}</span>
                                            ) : (
                                                getPills(bankShortCodes).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-[10px] font-black text-gray-805 dark:text-gray-200 shadow-sm">
                                                        {tag}
                                                        <X 
                                                            onClick={() => handleRemoveTag('bankCodes', tag)}
                                                            className="w-3 h-3 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" 
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        {/* Add tags input */}
                                        <div className="flex gap-2 max-w-md">
                                            <input
                                                type="text"
                                                placeholder={t("Type bank code (e.g. AXIS)...")}
                                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-105 flex-1"
                                                value={inputs.bankCodes}
                                                onChange={(e) => setInputs(prev => ({ ...prev, bankCodes: e.target.value }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddTag('bankCodes', inputs.bankCodes);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddTag('bankCodes', inputs.bankCodes)}
                                                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 2. Clutter/Suffix Ignore Words Accordion */}
                {isIgnoreVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("ignore-words")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <FileText className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Clutter Suffix Ignore Registry")}
                                </h3>
                            </div>
                            {isIgnoreExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isIgnoreExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400 max-w-xl">
                                                {t("Corporate abbreviations and clutter words stripped off the tail of extracted text to consolidate entity account names (e.g., PVT, LTD, INC).")}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleLoadCategoryPreset('ignoreWords')}
                                                    className="text-[9px] uppercase font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                                                >
                                                    {t("Sync Presets")}
                                                </button>
                                                <button
                                                    onClick={() => handleClearCategory('ignoreWords')}
                                                    className="text-[9px] uppercase font-black text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    {t("Clear")}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 p-4 min-h-[70px] bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl max-h-[140px] overflow-y-auto">
                                            {getPills(bankIgnoreWords).length === 0 ? (
                                                <span className="text-[10px] text-gray-400 font-bold self-center mx-auto">{t("No active elements. Add custom keys below.")}</span>
                                            ) : (
                                                getPills(bankIgnoreWords).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-[10px] font-black text-gray-805 dark:text-gray-200 shadow-sm">
                                                        {tag}
                                                        <X 
                                                            onClick={() => handleRemoveTag('ignoreWords', tag)}
                                                            className="w-3 h-3 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" 
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex gap-2 max-w-md">
                                            <input
                                                type="text"
                                                placeholder={t("Type ignore suffix (e.g. CORP)...")}
                                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-105 flex-1"
                                                value={inputs.ignoreWords}
                                                onChange={(e) => setInputs(prev => ({ ...prev, ignoreWords: e.target.value }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddTag('ignoreWords', inputs.ignoreWords);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddTag('ignoreWords', inputs.ignoreWords)}
                                                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 3. Electronic Payment Modes Accordion */}
                {isModesVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("payment-modes")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                    <CreditCard className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Channel Payment Modes")}
                                </h3>
                            </div>
                            {isModesExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isModesExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-855 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400 max-w-xl">
                                                {t("Standard financial routing modes (e.g., UPI, NEFT, IMPS, CHQ) used to automatically infer and map matching payment voucher ledger entries.")}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleLoadCategoryPreset('paymentModes')}
                                                    className="text-[9px] uppercase font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                                                >
                                                    {t("Sync Presets")}
                                                </button>
                                                <button
                                                    onClick={() => handleClearCategory('paymentModes')}
                                                    className="text-[9px] uppercase font-black text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    {t("Clear")}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 p-4 min-h-[70px] bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl max-h-[140px] overflow-y-auto">
                                            {getPills(paymentModes).length === 0 ? (
                                                <span className="text-[10px] text-gray-400 font-bold self-center mx-auto">{t("No active elements. Add custom keys below.")}</span>
                                            ) : (
                                                getPills(paymentModes).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-[10px] font-black text-gray-805 dark:text-gray-200 shadow-sm">
                                                        {tag}
                                                        <X 
                                                            onClick={() => handleRemoveTag('paymentModes', tag)}
                                                            className="w-3 h-3 text-gray-400 hover:text-red-655 cursor-pointer transition-colors" 
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex gap-2 max-w-md">
                                            <input
                                                type="text"
                                                placeholder={t("Type payment mode...")}
                                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-105 flex-1"
                                                value={inputs.paymentModes}
                                                onChange={(e) => setInputs(prev => ({ ...prev, paymentModes: e.target.value }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddTag('paymentModes', inputs.paymentModes);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddTag('paymentModes', inputs.paymentModes)}
                                                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 4. Commercial Gateway Channels Accordion */}
                {isChannelsVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("payment-channels")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <Radio className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Commercial Gateway Channels")}
                                </h3>
                            </div>
                            {isChannelsExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isChannelsExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-855 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400 max-w-xl">
                                                {t("Merchant aggregators and commercial transactional gateways (e.g. RAZORPAY, STRIPE, PHONEPE) detected to bypass separate ledger postings.")}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleLoadCategoryPreset('paymentChannels')}
                                                    className="text-[9px] uppercase font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                                                >
                                                    {t("Sync Presets")}
                                                </button>
                                                <button
                                                    onClick={() => handleClearCategory('paymentChannels')}
                                                    className="text-[9px] uppercase font-black text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    {t("Clear")}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 p-4 min-h-[70px] bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl max-h-[140px] overflow-y-auto">
                                            {getPills(paymentChannels).length === 0 ? (
                                                <span className="text-[10px] text-gray-400 font-bold self-center mx-auto">{t("No active elements. Add custom keys below.")}</span>
                                            ) : (
                                                getPills(paymentChannels).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-[10px] font-black text-gray-805 dark:text-gray-200 shadow-sm">
                                                        {tag}
                                                        <X 
                                                            onClick={() => handleRemoveTag('paymentChannels', tag)}
                                                            className="w-3 h-3 text-gray-400 hover:text-red-655 cursor-pointer transition-colors" 
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex gap-2 max-w-md">
                                            <input
                                                type="text"
                                                placeholder={t("Type payment channel...")}
                                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-105 flex-1"
                                                value={inputs.paymentChannels}
                                                onChange={(e) => setInputs(prev => ({ ...prev, paymentChannels: e.target.value }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddTag('paymentChannels', inputs.paymentChannels);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddTag('paymentChannels', inputs.paymentChannels)}
                                                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 5. IFSC Code Gateways Accordion */}
                {isIfscVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("ifsc-prefixes")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                                    <Shield className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Indian Financial System Code (IFSC) Gateway Prefixes")}
                                </h3>
                            </div>
                            {isIfscExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isIfscExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-855 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400 max-w-xl">
                                                {t("First four characters of Indian branch code lists (e.g. SBIN, HDFC, UTIB). Helpful for recognizing branch origins inside RTGS/NEFT transaction messages.")}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleLoadCategoryPreset('ifscPrefixes')}
                                                    className="text-[9px] uppercase font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded transition-colors cursor-pointer"
                                                >
                                                    {t("Sync Presets")}
                                                </button>
                                                <button
                                                    onClick={() => handleClearCategory('ifscPrefixes')}
                                                    className="text-[9px] uppercase font-black text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    {t("Clear")}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 p-4 min-h-[70px] bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl overflow-y-auto w-full">
                                            {getPills(ifscPrefixes).length === 0 ? (
                                                <span className="text-[10px] text-gray-400 font-bold self-center mx-auto">{t("No active elements. Add custom keys below.")}</span>
                                            ) : (
                                                getPills(ifscPrefixes).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[10px] font-black text-gray-805 dark:text-gray-200 shadow-sm">
                                                        {tag}
                                                        <X 
                                                            onClick={() => handleRemoveTag('ifscPrefixes', tag)}
                                                            className="w-3 h-3 text-gray-400 hover:text-red-655 cursor-pointer transition-colors" 
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex gap-2 max-w-md">
                                            <input
                                                type="text"
                                                placeholder={t("Type IFSC code branch (e.g. SBIN)...")}
                                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-150 flex-1"
                                                value={inputs.ifscPrefixes}
                                                onChange={(e) => setInputs(prev => ({ ...prev, ifscPrefixes: e.target.value }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddTag('ifscPrefixes', inputs.ifscPrefixes);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddTag('ifscPrefixes', inputs.ifscPrefixes)}
                                                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                                            >
                                                <Plus className="w-4 h-4 text-white" />
                                            </button>
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
