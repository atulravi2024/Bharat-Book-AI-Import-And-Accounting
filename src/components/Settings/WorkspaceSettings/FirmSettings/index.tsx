import React, { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { useFirmSettings } from "./hooks/useFirmSettings";
import { FirmSettingsProps } from "./types";
import { ALL_SEARCH_FIELDS } from "./constants";

import { BasicSection } from "./tab/BasicSection";
import { ProfileSection } from "./tab/ProfileSection";
import { ContactsSection } from "./tab/ContactsSection";
import { TaxRegistrationSection } from "./tab/TaxRegistrationSection";
import { LicensesSection } from "./tab/LicensesSection";
import { HrPayrollSection } from "./tab/HrPayrollSection";
import { FinancialGeneralSection } from "./tab/FinancialGeneralSection";
import { FinancialTaxationSection } from "./tab/FinancialTaxationSection";
import { FinancialFormattingSection } from "./tab/FinancialFormattingSection";
import { FinancialAdvancedSection } from "./tab/FinancialAdvancedSection";
import { BankDetailsSection } from "./tab/BankDetailsSection";
import { SocialWebSection } from "./tab/SocialWebSection";
import { OperationalSection } from "./tab/OperationalSection";
import { BillingSalesSection } from "./tab/BillingSalesSection";
import { InventoryLogisticsSection } from "./tab/InventoryLogisticsSection";
import { BrandingAssetsSection } from "./tab/BrandingAssetsSection";
import { LegalRemarksSection } from "./tab/LegalRemarksSection";
import { SystemDataSection } from "./tab/SystemDataSection";
import { AlertChannels } from "./tab/AlertChannels";

import { SearchIcon, UndoIcon, ClearAllIcon, UploadIcon, CheckCircleIcon, AdminIcon } from "../../../icons/IconComponents";
import { Download, Save, Trash2, RotateCcw, Upload, Building, ShieldCheck, Coins, Cog, MapPin, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FirmSettingsView: React.FC<FirmSettingsProps> = ({ ledgerMasters = [] }) => {
  const { t } = useLanguage();
  const state = useFirmSettings(ledgerMasters);
  const [activeTab, setActiveTab] = useState<"identity" | "contacts" | "finance" | "compliance" | "operations" | "system">("identity");
  const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  React.useEffect(() => {
    const checkOverride = () => {
      const override = localStorage.getItem('bharat_book_firm_subtab_override');
      if (override) {
        if (["identity", "contacts", "finance", "compliance", "operations", "system"].includes(override)) {
          setActiveTab(override as any);
        }
        localStorage.removeItem('bharat_book_firm_subtab_override');
      }
    };
    checkOverride();
    window.addEventListener('bharat_book_firm_subtab_trigger', checkOverride);
    return () => window.removeEventListener('bharat_book_firm_subtab_trigger', checkOverride);
  }, []);

  const tabs = [
    { id: "identity" as const, label: "Identity & Brand", icon: Building },
    { id: "contacts" as const, label: "Locations & Contact", icon: MapPin },
    { id: "finance" as const, label: "Finance & Banking", icon: Coins },
    { id: "compliance" as const, label: "Legal & Compliance", icon: ShieldCheck },
    { id: "operations" as const, label: "Operations & HR", icon: Briefcase },
    { id: "system" as const, label: "System Setup", icon: Cog },
  ];

  const sectionToTabMap: Record<string, "identity" | "contacts" | "finance" | "compliance" | "operations" | "system"> = {
    basicCompany: "identity",
    businessProfile: "identity",
    branding: "identity",
    social: "identity",

    primaryContacts: "contacts",
    alertDestinations: "contacts",

    financial_general: "finance",
    financial_tax: "finance",
    financial_formatting: "finance",
    financial_advanced: "finance",
    bank: "finance",

    statutoryTax: "compliance",
    businessLicenses: "compliance",
    "legal Remarks": "compliance",

    operational: "operations",
    billing: "operations",
    inventoryLogistics: "operations",
    hrPayroll: "operations",

    systemCompliance: "system",
  };

  const handleSearchChange = (val: string) => {
    state.setSearchTerm(val);
    if (!val.trim()) return;

    const query = val.toLowerCase().trim();
    const counts: Record<string, number> = { identity: 0, contacts: 0, finance: 0, compliance: 0, operations: 0, system: 0 };
    ALL_SEARCH_FIELDS.forEach(field => {
      const tab = sectionToTabMap[field.id];
      const translatedLabel = t(field.label).toLowerCase();
      if (translatedLabel.includes(query) || field.label.toLowerCase().includes(query) || field.id.toLowerCase().includes(query)) {
         if (tab) counts[tab]++;
      }
    });

    if (counts[activeTab] === 0) {
      if (counts.identity > 0) setActiveTab("identity");
      else if (counts.contacts > 0) setActiveTab("contacts");
      else if (counts.finance > 0) setActiveTab("finance");
      else if (counts.compliance > 0) setActiveTab("compliance");
      else if (counts.operations > 0) setActiveTab("operations");
      else if (counts.system > 0) setActiveTab("system");
    }
  };

  const isSearching = state.searchTerm.trim() !== "";
  const matchCounts: Record<string, number> = { identity: 0, contacts: 0, finance: 0, compliance: 0, operations: 0, system: 0 };
  
  if (isSearching) {
    const query = state.searchTerm.toLowerCase().trim();
    ALL_SEARCH_FIELDS.forEach(field => {
      const tab = sectionToTabMap[field.id];
      const translatedLabel = t(field.label).toLowerCase();
      if (translatedLabel.includes(query) || field.label.toLowerCase().includes(query) || field.id.toLowerCase().includes(query)) {
         if (tab) matchCounts[tab]++;
      }
    });
  }

  const hasAnyMatch = Object.values(matchCounts).some(c => c > 0);

  const SECTIONS = [
    { id: "basicCompany", label: t("Basic Details"), component: BasicSection },
    { id: "businessProfile", label: t("Profile Details"), component: ProfileSection },
    { id: "primaryContacts", label: t("Primary Contacts"), component: ContactsSection },
    { id: "alertDestinations", label: t("Alert Channels"), component: AlertChannels },
    { id: "statutoryTax", label: t("Tax Registrations"), component: TaxRegistrationSection },
    { id: "businessLicenses", label: t("Business Licenses"), component: LicensesSection },
    { id: "hrPayroll", label: t("Payroll Setup"), component: HrPayrollSection },
    { id: "financial_general", label: t("Financial General"), component: FinancialGeneralSection },
    { id: "financial_tax", label: t("Financial Taxation"), component: FinancialTaxationSection },
    { id: "financial_formatting", label: t("Financial Formatting"), component: FinancialFormattingSection },
    { id: "financial_advanced", label: t("Financial Advanced"), component: FinancialAdvancedSection },
    { id: "bank", label: t("Bank Details"), component: BankDetailsSection },
    { id: "social", label: t("Social Presence"), component: SocialWebSection },
    { id: "operational", label: t("Operational Preferences"), component: OperationalSection },
    { id: "billing", label: t("Billing Sales"), component: BillingSalesSection },
    { id: "inventoryLogistics", label: t("Inventory Logistics"), component: InventoryLogisticsSection },
    { id: "branding", label: t("Branding Assets"), component: BrandingAssetsSection },
    { id: "legal Remarks", label: t("Legal Remarks"), component: LegalRemarksSection },
    { id: "systemCompliance", label: t("System Backup"), component: SystemDataSection },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <AdminIcon className="!text-[20px] text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Firm Details")}</h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Configure profiles, taxes, and operations")}>
              {t("Configure profiles, taxes, and operations")}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex items-center">
          <div className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start shrink-0">
             {tabs.map((tab) => {
                const Icon = tab.icon;
                const matchCount = matchCounts[tab.id] || 0;
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
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span>{t(tab.label)}</span>
                    {isSearching && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {matchCount}
                      </span>
                    )}
                  </button>
                );
             })}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search firm settings...")} 
            value={state.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {state.searchTerm && (
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

        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || state.searchTerm) ? "hidden sm:flex" : "flex"}`}>
           <div className="relative inline-flex items-center shrink-0">
             <select
               value={targetFormat}
               onChange={(e) => setTargetFormat(e.target.value as "json" | "csv")}
               className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
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
             onClick={() => state.fileInputRef.current?.click()}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
             title={t("Import (JSON/CSV)")}
           >
             <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Import")}</span>
           </button>
           <button
             onClick={targetFormat === "json" ? state.handleExportBackup : state.handleExportCSV}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
             title={t("Export")}
           >
             <Download className="w-3.5 h-3.5 shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Export")}</span>
           </button>
           <button
             onClick={state.handleClear}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 hidden lg:flex items-center justify-center gap-1.5 shrink-0"
             title={t("Clear All Fields")}
           >
             <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Clear")}</span>
           </button>
           <button
             onClick={state.handleResetToDefault}
             className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
             title={t("Reset to Defaults")}
           >
             <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0" />
             <span className="hidden lg:inline leading-none">{t("Reset")}</span>
           </button>
           <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
           <button
             onClick={state.handleSave}
             className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${state.isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
             title={state.isSaved ? t("Saved Configuration") : t("Save Configuration")}
           >
             {state.isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
             <span className="hidden lg:inline leading-none">{state.isSaved ? t("Saved") : t("Save")}</span>
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <input
          type="file"
          accept={targetFormat === "json" ? ".json" : ".csv"}
          ref={state.fileInputRef}
          onChange={state.handleCombinedImport}
          className="hidden"
          id="globalHiddenFileInput"
        />

        {/* Tabbed Sections Content Rendering */}
        <div className="space-y-0 text-left min-h-[400px]">
          {isSearching ? (
             hasAnyMatch ? (
               matchCounts[activeTab] > 0 ? (
                 SECTIONS.filter(({ id }) => sectionToTabMap[id] === activeTab).map(({ id, component: Component }) => {
                   // We could filter sections if we wanted, but rendering them all keeps the UI identical
                   return (
                     <Component
                       key={id}
                       firmData={state.firmData}
                       setFirmData={state.setFirmData}
                       activeAccordion={state.activeAccordion}
                       toggleAccordion={state.toggleAccordion}
                       bankOptions={state.bankOptions}
                       ledgerMasters={ledgerMasters}
                       searchTerm={state.searchTerm}
                       {...(id === "systemCompliance"
                         ? {
                             handleExportBackup: state.handleExportBackup,
                             handleRestoreBackup: state.handleCombinedImport,
                             handleFactoryReset: state.handleFactoryReset,
                             fileInputRef: state.fileInputRef,
                           }
                         : {})}
                     />
                   );
                 })
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 dark:bg-gray-800/10 border-dashed border-gray-200 dark:border-gray-800 p-6 h-full min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 border border-blue-100/50 dark:border-blue-500/20">
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
               )
             ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300 min-h-[300px]">
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 border border-gray-150 dark:border-gray-750">
                    <SearchIcon className="w-5 h-5 animate-pulse text-gray-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No settings found")}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{t("No firm settings matched your search query. Try typing another term.")}</p>
                  <button 
                    onClick={() => handleSearchChange("")}
                    className="mt-5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    {t("Clear Search")}
                  </button>
                </div>
             )
          ) : (
            SECTIONS.filter(({ id }) => sectionToTabMap[id] === activeTab).map(({ id, component: Component }) => (
              <Component
                key={id}
                firmData={state.firmData}
                setFirmData={state.setFirmData}
                activeAccordion={state.activeAccordion}
                toggleAccordion={state.toggleAccordion}
                bankOptions={state.bankOptions}
                ledgerMasters={ledgerMasters}
                searchTerm={state.searchTerm}
                {...(id === "systemCompliance"
                  ? {
                      handleExportBackup: state.handleExportBackup,
                      handleRestoreBackup: state.handleCombinedImport,
                      handleFactoryReset: state.handleFactoryReset,
                      fileInputRef: state.fileInputRef,
                    }
                  : {})}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {state.confirmConfig?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => state.setConfirmConfig(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {state.confirmConfig.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 whitespace-pre-wrap">
                {state.confirmConfig.message}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => state.setConfirmConfig(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold text-sm transition-colors"
                >
                  {state.confirmConfig.cancelText}
                </button>
                <button
                  onClick={() => {
                    state.confirmConfig?.onConfirm();
                    state.setConfirmConfig(null);
                  }}
                  className={`px-4 py-2 text-white rounded-xl font-semibold text-sm transition-colors ${
                      state.confirmConfig.isDanger ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {state.confirmConfig.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.alertConfig?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => state.setAlertConfig(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-6 text-center"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {state.alertConfig.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {state.alertConfig.message}
              </p>
              <button
                onClick={() => state.setAlertConfig(null)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {t("OK")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
