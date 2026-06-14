import React, { useState } from 'react';
import { 
    Download, Upload, RefreshCw, Trash2, Database, Sliders, Shield, 
    FileText, Play, CheckCircle2, AlertTriangle, Disc, Wrench, Search as SearchIcon
} from 'lucide-react';
import { useAdminSettings } from './hooks/useAdminSettings';
import { FeatureGatesView } from './views/FeatureGatesView';
import { MasterSchemaCustomizerView } from './views/MasterSchemaCustomizerView';
import { SecurityAuditLogsView } from './views/SecurityAuditLogsView';
import { AdminIcon, ClearAllIcon, UploadIcon, UndoIcon, SaveIcon, CheckCircleIcon } from "../../../icons/IconComponents";

export const AdminSettings: React.FC = () => {
    const {
        t, storageUsed, showConfirm, setShowConfirm, expandedSection, setExpandedSection,
        activeSchemaTemplate, setActiveSchemaTemplate, systemLogs, setSystemLogs,
        selectedKey, editorValue, setEditorValue, editorError, editorSuccess,
        benchmarkMs, benchmarkRating, benchmarkRunning, featureGates, gatesSaved,
        storagePercent, quotaIndicatorColor, quotaTextColor, metricItems,
        handleBackup, handleRestore, handleSeedParties, handleSeedCatalogItems,
        handleSeedGeneralLedgers, handleSeedTransactionalVouchers, wipeData,
        handleSelectKeyChange, handleSaveJson, runPerformanceProbe,
        handleDatabaseRepairAudit, handleToggleGate, handleSaveGates,
        searchTerm, setSearchTerm, fileInputRef
    } = useAdminSettings();

    const [activeTab, setActiveTab] = useState<"operations" | "tools">("operations");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");
    const [isSaved, setIsSaved] = useState(false);

    const handleClear = () => {
        setEditorValue("[]");
        setSystemLogs(prev => [
            { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: 'JSON Editor registry cleared', user: 'Atul Ravi (SA)', status: 'Rotated' },
            ...prev
        ]);
    };

    const handleReset = () => {
        localStorage.removeItem('bharat_book_admin_feature_gates');
        setSystemLogs(prev => [
            { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: 'Gates restored to default configuration', user: 'Atul Ravi (SA)', status: 'Success' },
            ...prev
        ]);
        alert(t("Admin configurations reset to default. Please reload page if needed."));
        window.location.reload();
    };

    const handleSaveAll = () => {
        localStorage.setItem('bharat_book_admin_feature_gates', JSON.stringify(featureGates));
        setIsSaved(true);
        setSystemLogs(prev => [
            { time: new Date().toISOString().replace('T', ' ').substring(0, 19), event: 'Administrative settings committed', user: 'Atul Ravi (SA)', status: 'Complete' },
            ...prev
        ]);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const tabs = [
        { id: "operations" as const, label: "System Operations", icon: Database },
        { id: "tools" as const, label: "Developer Tools", icon: Wrench },
    ];

    const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
        if (!searchTerm.trim()) return true;
        
        const words = searchTerm.toLowerCase().trim().split(/\s+/);
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

    // Calculate match counts dynamically
    const getMatchCounts = () => {
        const counts = { operations: 0, tools: 0 };
        
        if (isFieldVisible("Sandbox LocalStorage Usage", ["Quota", "Storage"])) counts.operations++;
        if (isFieldVisible("Stats Metric Cards", ["Vouchers", "Parties", "Items", "Ledgers"])) counts.operations++;
        if (isFieldVisible("Sandbox Fast Ingestion Seeding", ["Hydrate Corporate Masters", "Hydrate Accounting Data"])) counts.operations++;
        if (isFieldVisible("Confirm Wipe Actions", ["Clear Vouchers", "Clear Masters", "Purge All"])) counts.operations++;
        if (isFieldVisible("Storage Performance Benchmark Audit", ["Repair DB"])) counts.operations++;

        if (isFieldVisible("Live JSON Registry Editor", ["Advanced"])) counts.tools++;
        if (isFieldVisible("Accessibility Feature Gates", ["Toggles", "Compact", "Density", "Audio", "Confirmation", "Skip", "popup", "Negative", "Stock", "contrast", "Border", "GST", "Rounding", "Apply"])) counts.tools++;
        if (isFieldVisible("Master Schema Customizer", ["Definitions", "GAAP", "GST", "B2C", "Retail", "Logistics", "Manufacturing", "transactions_v2", "party_profiles", "item_catalogs", "ledger_master_v3"])) counts.tools++;
        if (isFieldVisible("Security Audit Logs", ["Records", "Administrator Activity Registers", "Access Control & Security Audit Logs", "Atul Ravi (SA)", "Success", "Optimized", "Balanced", "Complete", "Rotated", "Flush", "Telemetry"])) counts.tools++;

        return counts;
    };

    const isSearching = searchTerm.trim() !== "";
    const matchCounts = isSearching ? getMatchCounts() : { operations: 0, tools: 0 };
    const hasAnyMatch = isSearching && (matchCounts.operations > 0 || matchCounts.tools > 0);

    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        if (!val.trim()) return;
        
        const counts = getMatchCounts();
        if (counts[activeTab] === 0) {
            if (counts.operations > 0) setActiveTab("operations");
            else if (counts.tools > 0) setActiveTab("tools");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
            {/* Standard Header Row 1: Title and Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
                <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
                    <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
                        <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Admin Developer Console")}</h2>
                        <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("System operations, sandbox testing, metadata hydration")}>
                            {t("System operations, sandbox testing, metadata hydration")}
                        </p>
                    </div>
                </div>

                <div className="min-w-0 flex-1 flex items-center">
                    <div className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start shrink-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const count = matchCounts[tab.id] || 0;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                                        activeTab === tab.id 
                                            ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                    <span>{t(tab.label)}</span>
                                    {isSearching && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                                            activeTab === tab.id 
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Standard Header Row 2: Search and Tools */}
            <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
                <div className="flex-1 min-w-0 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <SearchIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder={t("Search administrative settings...")} 
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => handleSearchChange("")}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            title={t("Clear search")}
                        >
                            <svg className="w-3 h-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || searchTerm) ? "hidden sm:flex" : "flex"}`}>
                    <div className="relative inline-flex items-center shrink-0">
                        <select
                            value={targetFormat}
                            onChange={(e) => setTargetFormat(e.target.value as "json" | "csv")}
                            className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
                            title={t("Simple Input and Output")}
                        >
                            <option value="json" className="bg-white dark:bg-gray-800">{t("JSON")}</option>
                            <option value="csv" className="bg-white dark:bg-gray-800">{t("CSV")}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Import")}
                    >
                        <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Import")}</span>
                    </button>
                    <button
                        onClick={handleBackup}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Export")}
                    >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Export")}</span>
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 hidden lg:flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Clear All Fields")}
                    >
                        <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Clear")}</span>
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-650 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Reset")}
                    >
                        <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Reset")}</span>
                    </button>
                    <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
                    <button
                        onClick={handleSaveAll}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        title={isSaved ? t("Saved") : t("Save")}
                    >
                        {isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce" /> : <SaveIcon className="!text-[14px] flex items-center justify-center shrink-0" />}
                        <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
                    </button>
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleRestore} 
                accept={targetFormat === "json" ? ".json" : ".csv"} 
                className="hidden" 
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 min-h-[450px] space-y-6 relative">
                {isSaved && (
                    <div className="absolute top-4 right-4 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 z-10">
                        <CheckCircleIcon className="mr-2" /> {t("Settings Saved")}
                    </div>
                )}
                {isSearching && !hasAnyMatch ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300 min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 border border-gray-150 dark:border-gray-750">
                            <SearchIcon className="w-5 h-5 animate-pulse text-gray-400" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No administrative tools found")}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{t("No admin settings matched your search query. Try typing another term.")}</p>
                        <button 
                            onClick={() => handleSearchChange("")}
                            className="mt-5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
                        >
                            {t("Clear Search")}
                        </button>
                    </div>
                ) : isSearching && matchCounts[activeTab] === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 border-dashed border-gray-200 dark:border-gray-800 p-6 h-full min-h-[300px]">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-100/50 dark:border-indigo-500/20">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t(`No matches in ${tabs.find(t => t.id === activeTab)?.label}`)}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("However, matches are found in other categories. Select a category below to see its matches:")}</p>
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                            {tabs.map(tab => matchCounts[tab.id] > 0 && (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-bold text-gray-750 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all active:scale-95">
                                    <tab.icon className="w-3.5 h-3.5" />
                                    <span>{t(tab.label)} ({matchCounts[tab.id]})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Operations Tab Content */}
                        {activeTab === "operations" && (
                            <>
                                {/* Storage Quota Progress Card */}
                                {isFieldVisible("Sandbox LocalStorage Usage", ["Quota", "Storage"]) && (
                                    <div className="p-4 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 shadow-xs">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                <Database className="w-3.5 h-3.5 text-gray-400" />
                                                {t("Sandbox LocalStorage Usage")}
                                            </span>
                                            <span className={`text-xs font-bold ${quotaTextColor}`}>
                                                {storageUsed} / 5.00 MB ({storagePercent.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-300 ${quotaIndicatorColor}`}
                                                style={{ width: `${storagePercent}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Stats Metric Cards Grid */}
                                {isFieldVisible("Stats Metric Cards", ["Vouchers", "Parties", "Items", "Ledgers"]) && (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {metricItems.map((item, idx) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={idx} className={`p-3.5 rounded-2xl border ${item.bg}`}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-400 font-medium">{t(item.label)}</span>
                                                        <Icon className={`w-4 h-4 ${item.color}`} />
                                                    </div>
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Data Hydration Seed Panels and Confirm Wipe Actions */}
                                {(isFieldVisible("Sandbox Fast Ingestion Seeding", ["Hydrate Corporate Masters", "Hydrate Accounting Data"]) || 
                                  isFieldVisible("Confirm Wipe Actions", ["Clear Vouchers", "Clear Masters", "Purge All"])) && (
                                    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 p-4 space-y-4">
                                        {isFieldVisible("Sandbox Fast Ingestion Seeding", ["Hydrate Corporate Masters", "Hydrate Accounting Data"]) && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">{t("Sandbox Fast Ingestion Seeding")}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border border-gray-100/50 dark:border-gray-900/60 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{t("Hydrate Corporate Masters")}</p>
                                                            <p className="text-[10px] text-gray-400">{t("Seeds 11 Corporate Enterprise & Catalog Master Items")}</p>
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            <button onClick={handleSeedParties} className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition">
                                                                + {t("Parties")}
                                                            </button>
                                                            <button onClick={handleSeedCatalogItems} className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition">
                                                                + {t("Catalog")}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border border-gray-100/50 dark:border-gray-900/60 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{t("Hydrate Accounting Data")}</p>
                                                            <p className="text-[10px] text-gray-400">{t("Seeds foundational general ledgers and 10 ERP transactions")}</p>
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            <button onClick={handleSeedGeneralLedgers} className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition">
                                                                + {t("Ledgers")}
                                                            </button>
                                                            <button onClick={handleSeedTransactionalVouchers} className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition">
                                                                + {t("Vouchers")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {isFieldVisible("Confirm Wipe Actions", ["Clear Vouchers", "Clear Masters", "Purge All"]) && (
                                            <div className="pt-2 border-t border-gray-100 dark:border-gray-900 flex flex-wrap gap-2 text-xs">
                                                {showConfirm ? (
                                                    <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 p-2 rounded-xl border border-rose-100/50 dark:border-rose-950/60 w-full justify-between animate-fade-in">
                                                        <span className="flex items-center gap-1.5 font-medium">
                                                            <AlertTriangle className="w-3.5 h-3.5" />
                                                            {t("Action permanently deletes data. Proceed?")}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => wipeData(showConfirm as any)} className="px-2.5 py-1 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 rounded-md text-white">
                                                                {t("Confirm Clear")}
                                                            </button>
                                                            <button onClick={() => setShowConfirm(null)} className="px-2.5 py-1 text-[10px] font-bold bg-gray-200 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300">
                                                                {t("Cancel")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 flex-wrap">
                                                        <button onClick={() => setShowConfirm('vouchers')} className="px-2.5 py-1.5 text-[10px] font-medium border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg transition flex items-center gap-1">
                                                            <Trash2 className="w-3 h-3" /> {t("Clear Vouchers Only")}
                                                        </button>
                                                        <button onClick={() => setShowConfirm('masters')} className="px-2.5 py-1.5 text-[10px] font-medium border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg transition flex items-center gap-1">
                                                            <Trash2 className="w-3 h-3" /> {t("Clear Masters Only")}
                                                        </button>
                                                        <button onClick={() => setShowConfirm('all')} className="px-2.5 py-1.5 text-[10px] font-semibold text-rose-700 bg-rose-100/55 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition">
                                                            {t("Purge All Sandbox Keys")}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Performance Benchmark Probe Console */}
                                {isFieldVisible("Storage Performance Benchmark Audit", ["Repair DB"]) && (
                                    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                <Disc className="w-3.5 h-3.5 text-gray-400" />
                                                {t("Storage Performance Benchmark Audit")}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {t("Measures thread writing & fetch latency bounds over 1800 serial database entries.")}
                                            </p>
                                            {benchmarkMs !== null && (
                                                <div className="pt-1.5 flex flex-wrap gap-2 text-[10px] font-semibold">
                                                    <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-100/40">
                                                        {t("Latency Probe")}: {benchmarkMs} ms
                                                    </span>
                                                    <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100/40">
                                                        {t("Output Rating")}: {benchmarkRating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button onClick={handleDatabaseRepairAudit} className="flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-semibold border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 rounded-lg transition">
                                                {t("Repair DB Integrity")}
                                            </button>
                                            <button onClick={runPerformanceProbe} disabled={benchmarkRunning} className="flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-xs flex items-center justify-center gap-1 disabled:opacity-50">
                                                <Play className="w-3 h-3 fill-current" />
                                                {benchmarkRunning ? t('Auditing...') : t('Run Performance Audit')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Tools Tab Content */}
                        {activeTab === "tools" && (
                            <>
                                {/* Live Interactive JSON Editor Engine */}
                                {isFieldVisible("Live JSON Registry Editor", ["Advanced"]) && (
                                    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 p-4 space-y-3">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">{t("Live JSON Registry Editor")}</h3>
                                            </div>
                                            <select value={selectedKey} onChange={handleSelectKeyChange} className="text-xs px-2.5 py-1.5 font-medium rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-hidden">
                                                <option value="bharat_book_all_vouchers_v2_v2">{t("Vouchers Ingestion Table")}</option>
                                                <option value="bharat_book_party_masters">{t("Party Corporate Directory")}</option>
                                                <option value="bharat_book_item_masters">{t("Item Catalog Data")}</option>
                                                <option value="bharat_book_ledger_masters">{t("Ledgers Chart of Accounts")}</option>
                                                <option value="bharat_book_admin_feature_gates">{t("Admin Global Feature Gates")}</option>
                                            </select>
                                        </div>
                                        <textarea rows={8} value={editorValue} onChange={(e) => setEditorValue(e.target.value)} className="w-full font-mono text-[11px] p-3 text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl leading-relaxed outline-hidden focus:border-indigo-500/50 transition whitespace-pre" />
                                        <div className="flex justify-end gap-2 items-center">
                                            {editorError && (
                                                <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> {editorError}
                                                </span>
                                            )}
                                            {editorSuccess && (
                                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" /> {t("Changes Committed to LocalStorage!")}
                                                </span>
                                            )}
                                            <button onClick={handleSaveJson} className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition">
                                                {t("Commit Changes")}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Subpage Accordion Section Tabs mapped to Tools */}
                                <div className="space-y-3">
                                    {isFieldVisible("Accessibility Feature Gates", ["Toggles", "Compact", "Density", "Audio", "Confirmation", "Skip", "popup", "Negative", "Stock", "contrast", "Border", "GST", "Rounding", "Apply"]) && (
                                        <FeatureGatesView
                                            t={t}
                                            expandedSection={(expandedSection === 'featureGates' || (isSearching && isFieldVisible("Accessibility Feature Gates", ["Toggles", "Compact", "Density", "Audio", "Confirmation", "Skip", "popup", "Negative", "Stock", "contrast", "Border", "GST", "Rounding", "Apply"]))) ? 'featureGates' : null}
                                            setExpandedSection={setExpandedSection}
                                            featureGates={featureGates}
                                            handleToggleGate={handleToggleGate}
                                            gatesSaved={gatesSaved}
                                            handleSaveGates={handleSaveGates}
                                        />
                                    )}
                                    
                                    {isFieldVisible("Master Schema Customizer", ["Definitions", "GAAP", "GST", "B2C", "Retail", "Logistics", "Manufacturing", "transactions_v2", "party_profiles", "item_catalogs", "ledger_master_v3"]) && (
                                        <MasterSchemaCustomizerView
                                            t={t}
                                            expandedSection={(expandedSection === 'schemaTemplate' || (isSearching && isFieldVisible("Master Schema Customizer", ["Definitions", "GAAP", "GST", "B2C", "Retail", "Logistics", "Manufacturing", "transactions_v2", "party_profiles", "item_catalogs", "ledger_master_v3"]))) ? 'schemaTemplate' : null}
                                            setExpandedSection={setExpandedSection}
                                            activeSchemaTemplate={activeSchemaTemplate}
                                            setActiveSchemaTemplate={setActiveSchemaTemplate}
                                            setSystemLogs={setSystemLogs}
                                        />
                                    )}
                                    
                                    {isFieldVisible("Security Audit Logs", ["Records", "Administrator Activity Registers", "Access Control & Security Audit Logs", "Atul Ravi (SA)", "Success", "Optimized", "Balanced", "Complete", "Rotated", "Flush", "Telemetry"]) && (
                                        <SecurityAuditLogsView
                                            t={t}
                                            expandedSection={(expandedSection === 'securityAudit' || (isSearching && isFieldVisible("Security Audit Logs", ["Records", "Administrator Activity Registers", "Access Control & Security Audit Logs", "Atul Ravi (SA)", "Success", "Optimized", "Balanced", "Complete", "Rotated", "Flush", "Telemetry"]))) ? 'securityAudit' : null}
                                            setExpandedSection={setExpandedSection}
                                            systemLogs={systemLogs}
                                            setSystemLogs={setSystemLogs}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
