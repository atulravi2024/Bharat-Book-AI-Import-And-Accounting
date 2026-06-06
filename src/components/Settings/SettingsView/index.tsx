import React from "react";
import { SettingsViewProps } from "./types";
import { useSettingsState } from "./hooks/useSettingsState";
import { useSettingsLogic } from "./hooks/useSettingsLogic";
import { SettingsTabs } from "./views/SettingsTabs";

// Import all setting sections
import { GeneralSettings } from "../GeneralSettings";
import { UserSettings } from "../UserSettings";
import { AlertChannel } from "../AlertChannel";
import { SecuritySettings } from "../SecuritySettings";
import { PrivacySettings } from "../PrivacySettings";
import { ImportSettings } from "../ImportSettings";
import { MappingSettings } from "../MappingSettings";
import { AISettings } from "../AISettings";
import { AdminSettings } from "../AdminSettings";
import { DataExplorer } from "../DataExplorer";
import { AppNavigationSettings } from "../AppNavigationSettings";
import { VoucherNumberingSettings } from "../VoucherNumberingSettings";
import { InvoicePrintSettings } from "../InvoicePrintSettings";
import { FormDetailSettings } from "../FormDetailSettings";
import { FirmSettings } from "../FirmSettings";
import { HelpSettings } from "../HelpSettings";
import { SupportSettings } from "../SupportSettings";

// Temporary import for remaining sections
import { InfoIcon, LayoutIcon } from "../../icons/IconComponents";
import { DownloadCloud, Check } from "lucide-react";

export const SettingsView: React.FC<SettingsViewProps> = ({
  setView,
  setActiveMasterTab,
  setReportBankActiveTab,
  defaultTab,
  onTabChange,
  ledgerMasters = [],
  onAppModeChange,
  onImportCategoryChange,
}) => {
  const state = useSettingsState(defaultTab || null, onTabChange, onAppModeChange);
  const actions = useSettingsLogic(state, onAppModeChange);

  const handleTabChange = (tab: any) => {
    state.setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col space-y-6">
        <SettingsTabs activeTab={state.activeTab} handleTabChange={handleTabChange} t={state.t} />

        <div className="space-y-6">
          {state.activeTab === "ai" && (
            <AISettings
              aiSettings={state.aiSettings}
              setAiSettings={state.setAiSettings}
              handleSave={actions.handleSave}
              isSaved={state.isSaved}
            />
          )}

          {state.activeTab === "general" && (
            <GeneralSettings
              theme={state.theme} setTheme={state.setTheme} language={state.language} setLanguage={state.setLanguage}
              dateFormat={state.dateFormat} setDateFormat={state.setDateFormat} timezone={state.timezone} setTimezone={state.setTimezone}
              autoLock={state.autoLock} setAutoLock={state.setAutoLock} density={state.density} setDensity={state.setDensity}
              animations={state.animations} setAnimations={state.setAnimations} soundEffects={state.soundEffects} setSoundEffects={state.setSoundEffects}
              keyboardShortcuts={state.keyboardShortcuts} setKeyboardShortcuts={state.setKeyboardShortcuts} weekStartsOn={state.weekStartsOn}
              setWeekStartsOn={state.setWeekStartsOn} paginationSize={state.paginationSize} setPaginationSize={state.setPaginationSize}
              showSystemInfo={state.showSystemInfo} setShowSystemInfo={state.setShowSystemInfo} displayId={state.displayId} setDisplayId={state.setDisplayId}
              appMode={state.appMode} setAppMode={state.setAppMode} handleSave={actions.handleSave} handleLoad={actions.handleLoad}
              handleReset={actions.handleReset} handleClear={actions.handleClear} handleDeleteAll={() => { localStorage.clear(); window.location.reload(); }}
              isSaved={state.isSaved}
            />
          )}

          {state.activeTab === "vouchernumbering" && <VoucherNumberingSettings />}
          {state.activeTab === "invoiceprint" && <InvoicePrintSettings appMode={state.appMode} />}
          {state.activeTab === "formdetails" && <FormDetailSettings />}
          {state.activeTab === "firm" && <FirmSettings ledgerMasters={ledgerMasters} />}
          {state.activeTab === "users" && <UserSettings />}
          
          {state.activeTab === "alerts" && (
            <AlertChannel toggles={state.toggles} handleToggle={actions.handleToggle} />
          )}

          {state.activeTab === "security" && <SecuritySettings />}

          {state.activeTab === "privacy" && (
            <PrivacySettings toggles={state.toggles} handleToggle={actions.handleToggle} />
          )}

          {state.activeTab === "imports" && (
            <ImportSettings 
              toggles={state.toggles} 
              handleToggle={actions.handleToggle} 
              setView={setView}
              onImportCategoryChange={onImportCategoryChange}
            />
          )}

          {state.activeTab === "admin" && <AdminSettings />}
          {state.activeTab === "navigation" && <AppNavigationSettings />}
          {state.activeTab === "data" && <DataExplorer />}
          {state.activeTab === "help" && <HelpSettings />}
          
          {state.activeTab === "support" && <SupportSettings aiSettings={state.aiSettings} setAiSettings={state.setAiSettings} />}

          {state.activeTab === "mapping" && (
            <MappingSettings
              advancedParsingEnabled={state.advancedParsingEnabled} setAdvancedParsingEnabled={state.setAdvancedParsingEnabled}
              toggles={state.toggles} handleToggle={actions.handleToggle} customMappingRules={state.customMappingRules}
              setCustomMappingRules={state.setCustomMappingRules} bankMappings={state.bankMappings} setBankMappings={state.setBankMappings}
              bankChargesKeywords={state.bankChargesKeywords} setBankChargesKeywords={state.setBankChargesKeywords} cashFlowKeywords={state.cashFlowKeywords}
              setCashFlowKeywords={state.setCashFlowKeywords} selfTransferKeywords={state.selfTransferKeywords}
              setSelfTransferKeywords={state.setSelfTransferKeywords} mappingRules={state.mappingRules} setMappingRules={state.setMappingRules}
              missingMasterAction={state.missingMasterAction} setMissingMasterAction={state.setMissingMasterAction} processingPriority={state.processingPriority}
              setProcessingPriority={state.setProcessingPriority} aliases={state.aliases} setAliases={state.setAliases}
              fileInputRef={state.fileInputRef} showAliasModal={state.showAliasModal} setShowAliasModal={state.setShowAliasModal}
              sandboxInput={state.sandboxInput} setSandboxInput={state.setSandboxInput} runSandboxSimulator={actions.runSandboxSimulator}
              sandboxResult={state.sandboxResult} bulkSandboxResults={state.bulkSandboxResults} setBulkSandboxResults={state.setBulkSandboxResults} runBulkSimulator={actions.runBulkSimulator}
              sourceColumn={state.sourceColumn} setSourceColumn={state.setSourceColumn}
              splitDelimiter={state.splitDelimiter} setSplitDelimiter={state.setSplitDelimiter} ignoreExtractionKeywords={state.ignoreExtractionKeywords}
              setIgnoreExtractionKeywords={state.setIgnoreExtractionKeywords} partyNameLocation={state.partyNameLocation}
              setPartyNameLocation={state.setPartyNameLocation} utrExtractorType={state.utrExtractorType} setUtrExtractorType={state.setUtrExtractorType}
              accountNumberDetection={state.accountNumberDetection} setAccountNumberDetection={state.setAccountNumberDetection}
              bankShortCodes={state.bankShortCodes} setBankShortCodes={state.setBankShortCodes} bankIgnoreWords={state.bankIgnoreWords}
              setBankIgnoreWords={state.setBankIgnoreWords} paymentModes={state.paymentModes} setPaymentModes={state.setPaymentModes}
              paymentChannels={state.paymentChannels} setPaymentChannels={state.setPaymentChannels} ifscPrefixes={state.ifscPrefixes}
              setIfscPrefixes={state.setIfscPrefixes}
            />
          )}

          {state.activeTab === "about" && (
             <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Applet</h3>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                            <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900 dark:text-white">Bharat Book AI Import System</h4>
                           <p className="text-sm text-gray-500">Version 2.0.4 (Build 2026.1)</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          This system handles advanced AI-driven bank statement imports and parsing for the Bharat Book platform. It supports parsing raw CSV and JSON formats, applying structural ML and noise extraction directly in-browser.
                      </p>
                  </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
