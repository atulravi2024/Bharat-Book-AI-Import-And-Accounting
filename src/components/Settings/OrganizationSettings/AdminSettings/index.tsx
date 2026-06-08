import React, { useRef } from 'react';
import { 
    Download, Upload, RefreshCw, Trash2, Database, Sliders, Shield, 
    FileText, Play, CheckCircle2, AlertTriangle, Disc, Wrench
} from 'lucide-react';
import { useAdminSettings } from './hooks/useAdminSettings';
import { FeatureGatesView } from './views/FeatureGatesView';
import { MasterSchemaCustomizerView } from './views/MasterSchemaCustomizerView';
import { SecurityAuditLogsView } from './views/SecurityAuditLogsView';

export const AdminSettings: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        t,
        storageUsed,
        showConfirm,
        setShowConfirm,
        expandedSection,
        setExpandedSection,
        activeSchemaTemplate,
        setActiveSchemaTemplate,
        systemLogs,
        setSystemLogs,
        selectedKey,
        editorValue,
        setEditorValue,
        editorError,
        editorSuccess,
        benchmarkMs,
        benchmarkRating,
        benchmarkRunning,
        featureGates,
        gatesSaved,
        storagePercent,
        quotaIndicatorColor,
        quotaTextColor,
        metricItems,
        handleBackup,
        handleRestore,
        handleSeedParties,
        handleSeedCatalogItems,
        handleSeedGeneralLedgers,
        handleSeedTransactionalVouchers,
        wipeData,
        handleSelectKeyChange,
        handleSaveJson,
        runPerformanceProbe,
        handleDatabaseRepairAudit,
        handleToggleGate,
        handleSaveGates,
    } = useAdminSettings();

    return (
        <div className="space-y-6">
            {/* Main Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-905">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        Admin Developer Console
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        System operations, sandbox testing, metadata hydration, and performance audits.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleBackup}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export Backup
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/85 transition flex items-center gap-1.5"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        Import Restore
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleRestore} 
                        accept=".json" 
                        className="hidden" 
                    />
                </div>
            </div>

            {/* Storage Quota Progress Card */}
            <div className="p-4 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-gray-400" />
                        Sandbox LocalStorage Usage
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

            {/* Stats Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metricItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className={`p-3.5 rounded-2xl border ${item.bg}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                                <Icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Data Hydration Seed Panels */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Sandbox Fast Ingestion Seeding</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border border-gray-100/50 dark:border-gray-900/60 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Hydrate Corporate Masters</p>
                            <p className="text-[10px] text-gray-400">Seeds 11 Corporate Enterprise & Catalog Master Items</p>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                onClick={handleSeedParties}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                            >
                                + Parties
                            </button>
                            <button
                                onClick={handleSeedCatalogItems}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                            >
                                + Catalog
                            </button>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border border-gray-100/50 dark:border-gray-900/60 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Hydrate Accounting Data</p>
                            <p className="text-[10px] text-gray-400">Seeds foundational general ledgers and 10 ERP transactions</p>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                onClick={handleSeedGeneralLedgers}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                            >
                                + Ledgers
                            </button>
                            <button
                                onClick={handleSeedTransactionalVouchers}
                                className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                            >
                                + Vouchers
                            </button>
                        </div>
                    </div>
                </div>

                {/* Confirm Wipe Actions */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-900 flex flex-wrap gap-2 text-xs">
                    {showConfirm ? (
                        <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 p-2 rounded-xl border border-rose-100/50 dark:border-rose-950/60 w-full justify-between animate-fade-in">
                            <span className="flex items-center gap-1.5 font-medium">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Action permanently deletes data. Proceed?
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => wipeData(showConfirm as any)}
                                    className="px-2.5 py-1 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 rounded-md text-white"
                                >
                                    Confirm Clear
                                </button>
                                <button
                                    onClick={() => setShowConfirm(null)}
                                    className="px-2.5 py-1 text-[10px] font-bold bg-gray-200 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConfirm('vouchers')}
                                className="px-2.5 py-1.5 text-[10px] font-medium border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg transition flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" /> Clear Vouchers Only
                            </button>
                            <button
                                onClick={() => setShowConfirm('masters')}
                                className="px-2.5 py-1.5 text-[10px] font-medium border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg transition flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" /> Clear Masters Only
                            </button>
                            <button
                                onClick={() => setShowConfirm('all')}
                                className="px-2.5 py-1.5 text-[10px] font-semibold text-rose-700 bg-rose-100/55 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition"
                            >
                                Purge All Sandbox Keys
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Interactive JSON Editor Engine */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Live JSON Registry Editor</h3>
                    </div>
                    <select
                        value={selectedKey}
                        onChange={handleSelectKeyChange}
                        className="text-xs px-2.5 py-1.5 font-medium rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-hidden"
                    >
                        <option value="bharat_book_all_vouchers_v2_v2">Vouchers Ingestion Table</option>
                        <option value="bharat_book_party_masters">Party Corporate Directory</option>
                        <option value="bharat_book_item_masters">Item Catalog Data</option>
                        <option value="bharat_book_ledger_masters">Ledgers Chart of Accounts</option>
                        <option value="bharat_book_admin_feature_gates">Admin Global Feature Gates</option>
                    </select>
                </div>

                <textarea
                    rows={8}
                    value={editorValue}
                    onChange={(e) => setEditorValue(e.target.value)}
                    className="w-full font-mono text-[11px] p-3 text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl leading-relaxed outline-hidden focus:border-indigo-500/50 transition whitespace-pre"
                />

                <div className="flex justify-end gap-2 items-center">
                    {editorError && (
                        <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {editorError}
                        </span>
                    )}
                    {editorSuccess && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                            Changes Committed to LocalStorage!
                        </span>
                    )}
                    <button
                        onClick={handleSaveJson}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white shadow-xs transition"
                    >
                        Commit Changes
                    </button>
                </div>
            </div>

            {/* Performance Benchmark Probe Console */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5 text-gray-400" />
                        Storage Performance Benchmark Audit
                    </p>
                    <p className="text-[10px] text-gray-400">
                        Measures thread writing & fetch latency bounds over 1800 serial database entries.
                    </p>
                    {benchmarkMs !== null && (
                        <div className="pt-1.5 flex flex-wrap gap-2 text-[10px] font-semibold">
                            <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-100/40">
                                Latency Probe: {benchmarkMs} ms
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100/40">
                                Output Rating: {benchmarkRating}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={handleDatabaseRepairAudit}
                        className="flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-semibold border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/10 rounded-lg transition"
                    >
                        Repair DB Integrity
                    </button>
                    <button
                        onClick={runPerformanceProbe}
                        disabled={benchmarkRunning}
                        className="flex-1 md:flex-initial px-3.5 py-1.5 text-xs font-bold bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg transition shadow-xs flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        {benchmarkRunning ? 'Auditing...' : 'Run Performance Audit'}
                    </button>
                </div>
            </div>

            {/* Subpage Accordion Section Tabs */}
            <div className="space-y-3">
                <FeatureGatesView 
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    featureGates={featureGates}
                    handleToggleGate={handleToggleGate}
                    gatesSaved={gatesSaved}
                    handleSaveGates={handleSaveGates}
                />
                
                <MasterSchemaCustomizerView 
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    activeSchemaTemplate={activeSchemaTemplate}
                    setActiveSchemaTemplate={setActiveSchemaTemplate}
                    setSystemLogs={setSystemLogs}
                />
                
                <SecurityAuditLogsView 
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    systemLogs={systemLogs}
                    setSystemLogs={setSystemLogs}
                />
            </div>
        </div>
    );
};
