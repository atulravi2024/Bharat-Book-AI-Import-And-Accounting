import React from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';
import { useAdminSettings } from './hooks/useAdminSettings';
import { SystemDiagnosticsView } from './views/SystemDiagnosticsView';
import { SeedingView } from './views/SeedingView';
import { RegistryConsoleView } from './views/RegistryConsoleView';
import { PerformanceAndRepairView } from './views/PerformanceAndRepairView';
import { FeatureGatesView } from './views/FeatureGatesView';
import { BackupRestoreView } from './views/BackupRestoreView';
import { MasterSchemaCustomizerView } from './views/MasterSchemaCustomizerView';
import { SecurityAuditLogsView } from './views/SecurityAuditLogsView';
import { DangerZoneView } from './views/DangerZoneView';

export const AdminSettings: React.FC = () => {
    const {
        t,
        storageUsed,
        storagePercent,
        quotaTextColor,
        quotaIndicatorColor,
        calculateStorage,
        metricItems,
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
        showConfirm,
        setShowConfirm,
        handleBackup,
        handleRestore,
        handleSeedParties,
        handleSeedCatalogItems,
        handleSeedGeneralLedgers,
        handleSeedTransactionalVouchers,
        wipeData,
        loadJsonEditorKey,
        handleSelectKeyChange,
        handleSaveJson,
        runPerformanceProbe,
        handleDatabaseRepairAudit,
        handleToggleGate,
        handleSaveGates,
    } = useAdminSettings();

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100/80 shadow-sm dark:bg-gray-950 dark:border-gray-900 max-w-5xl mx-auto space-y-6">
            
            {/* Header section (Compact, Gorgeous & Modern) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-150/40 dark:border-gray-900 pb-5 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        {t("System Administration")}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-xl">
                        {t("Oversee Sandboxed Database storage allocation, execute core data seeding, adjust runtime system variables, run live IO thread latency tests, or make direct code object revisions.")}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50/55 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100/50 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/35 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 
                    <span>{t("Index Healthy")}</span>
                </div>
            </div>

            {/* Accordion / Collapsible Sections Container */}
            <div className="space-y-3.5">
                
                {/* 1. Diagnostics */}
                <SystemDiagnosticsView
                    t={t}
                    storageUsed={storageUsed}
                    storagePercent={storagePercent}
                    quotaTextColor={quotaTextColor}
                    quotaIndicatorColor={quotaIndicatorColor}
                    calculateStorage={calculateStorage}
                    metricItems={metricItems}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                />

                {/* 2. Automatic Sample Seeding */}
                <SeedingView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    handleSeedParties={handleSeedParties}
                    handleSeedCatalogItems={handleSeedCatalogItems}
                    handleSeedGeneralLedgers={handleSeedGeneralLedgers}
                    handleSeedTransactionalVouchers={handleSeedTransactionalVouchers}
                />

                {/* 3. Direct JSON Controller & Browser Editor */}
                <RegistryConsoleView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    selectedKey={selectedKey}
                    handleSelectKeyChange={handleSelectKeyChange}
                    loadJsonEditorKey={loadJsonEditorKey}
                    handleSaveJson={handleSaveJson}
                    editorValue={editorValue}
                    setEditorValue={setEditorValue}
                    editorError={editorError}
                    editorSuccess={editorSuccess}
                />

                {/* 4. Speed Test benchmarks & Index Optimizers */}
                <PerformanceAndRepairView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    benchmarkMs={benchmarkMs}
                    benchmarkRating={benchmarkRating}
                    benchmarkRunning={benchmarkRunning}
                    runPerformanceProbe={runPerformanceProbe}
                    handleDatabaseRepairAudit={handleDatabaseRepairAudit}
                />

                {/* 5. Custom Accessibility Feature Gates */}
                <FeatureGatesView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    featureGates={featureGates}
                    handleToggleGate={handleToggleGate}
                    gatesSaved={gatesSaved}
                    handleSaveGates={handleSaveGates}
                />

                {/* 6. Data Backup & Recovery */}
                <BackupRestoreView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    handleBackup={handleBackup}
                    handleRestore={handleRestore}
                />

                {/* 7. Active Master Schema Template Customizer */}
                <MasterSchemaCustomizerView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    activeSchemaTemplate={activeSchemaTemplate}
                    setActiveSchemaTemplate={setActiveSchemaTemplate}
                    setSystemLogs={setSystemLogs}
                />

                {/* 8. Access Control & Security Audit Logs */}
                <SecurityAuditLogsView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    systemLogs={systemLogs}
                    setSystemLogs={setSystemLogs}
                />

                {/* 9. Danger Zone */}
                <DangerZoneView
                    t={t}
                    expandedSection={expandedSection}
                    setExpandedSection={setExpandedSection}
                    showConfirm={showConfirm}
                    setShowConfirm={setShowConfirm}
                    wipeData={wipeData}
                />

            </div>
            
        </div>
    );
};
