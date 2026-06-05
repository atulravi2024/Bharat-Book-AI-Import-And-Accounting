import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useFirmSettings } from "./hooks/useFirmSettings";
import { FirmSettingsProps } from "./types";
import { ALL_SEARCH_FIELDS } from "./constants";

import { BasicSection } from "../FirmSettingsTabs/BasicSection";
import { ProfileSection } from "../FirmSettingsTabs/ProfileSection";
import { ContactsSection } from "../FirmSettingsTabs/ContactsSection";
import { AddressSection } from "../FirmSettingsTabs/AddressSection";
import { TaxRegistrationSection } from "../FirmSettingsTabs/TaxRegistrationSection";
import { LicensesSection } from "../FirmSettingsTabs/LicensesSection";
import { HrPayrollSection } from "../FirmSettingsTabs/HrPayrollSection";
import { FinancialGeneralSection } from "../FirmSettingsTabs/FinancialGeneralSection";
import { FinancialTaxationSection } from "../FirmSettingsTabs/FinancialTaxationSection";
import { FinancialFormattingSection } from "../FirmSettingsTabs/FinancialFormattingSection";
import { FinancialAdvancedSection } from "../FirmSettingsTabs/FinancialAdvancedSection";
import { BankDetailsSection } from "../FirmSettingsTabs/BankDetailsSection";
import { SocialWebSection } from "../FirmSettingsTabs/SocialWebSection";
import { OperationalSection } from "../FirmSettingsTabs/OperationalSection";
import { BillingSalesSection } from "../FirmSettingsTabs/BillingSalesSection";
import { InventoryLogisticsSection } from "../FirmSettingsTabs/InventoryLogisticsSection";
import { BrandingAssetsSection } from "../FirmSettingsTabs/BrandingAssetsSection";
import { LegalRemarksSection } from "../FirmSettingsTabs/LegalRemarksSection";
import { SystemDataSection } from "../FirmSettingsTabs/SystemDataSection";
import { AlertChannels } from "../FirmSettingsTabs/AlertChannels";

import { AdminIcon, CheckCircleIcon } from "../../icons/IconComponents";
import { Search, Download, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FirmSettingsView: React.FC<FirmSettingsProps> = ({ ledgerMasters = [] }) => {
  const { t } = useLanguage();
  const state = useFirmSettings(ledgerMasters);

  const SECTIONS = [
    { id: "basicCompany", label: t("Basic Details"), component: BasicSection },
    { id: "businessProfile", label: t("Profile Details"), component: ProfileSection },
    { id: "primaryContacts", label: t("Primary Contacts"), component: ContactsSection },
    { id: "alertDestinations", label: t("Alert Channels"), component: AlertChannels },
    { id: "addressDetails", label: t("Registered Address"), component: AddressSection },
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
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <input
        type="file"
        accept=".json,.csv"
        ref={state.fileInputRef}
        onChange={state.handleCombinedImport}
        className="hidden"
        id="globalHiddenFileInput"
      />
      <div className="flex flex-col xl:flex-row items-center justify-between p-4 xl:p-6 gap-4 border-b border-gray-50 dark:border-gray-700/50">
        <div className="flex items-center w-full xl:w-auto shrink-0 justify-between md:justify-start gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center whitespace-nowrap">
            <AdminIcon className="mr-3 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
            {t("Firm Details")}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center w-full gap-4">
            <div className="relative w-full md:flex-1" ref={state.searchDropdownRef}>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t("Search settings...")}
                value={state.searchTerm}
                onChange={(e) => {
                  state.setSearchTerm(e.target.value);
                  state.setShowDropdown(true);
                }}
                onFocus={() => {
                  if (state.searchTerm.trim() !== "") state.setShowDropdown(true);
                }}
                className="form-input pl-10 pr-4 focus:border-transparent text-sm font-medium"
              />
              {state.showDropdown && state.searchTerm.trim() !== "" && (
                <div className="absolute top-14 left-0 right-0 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50">
                  {ALL_SEARCH_FIELDS.filter(field =>
                     field.label.toLowerCase().includes(state.searchTerm.toLowerCase())
                  ).map((field, idx) => (
                    <button
                      key={idx}
                      onClick={() => state.handleSearchSelect(field)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    >
                      <span className="font-bold">{field.label}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 block">in {SECTIONS.find(s => s.id === field.id)?.label || t("Settings")}</span>
                    </button>
                  ))}
                  {ALL_SEARCH_FIELDS.filter(field => field.label.toLowerCase().includes(state.searchTerm.toLowerCase())).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
                      {t("No settings found matching")} "{state.searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-nowrap items-center gap-2 w-full md:w-auto shrink-0 justify-center">
              <div className="flex shrink-0 items-center bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                 <button
                    onClick={() => state.fileInputRef.current?.click()}
                    title={t("Import (JSON/CSV)")}
                    className="px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" /> <span className="hidden xl:inline">{t("Import")}</span>
                 </button>
                 <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                 <button
                    onClick={state.handleExportBackup}
                    title={t("Export JSON")}
                    className="px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" /> <span className="hidden xl:inline">{t("JSON")}</span>
                 </button>
                 <button
                    onClick={state.handleExportCSV}
                    title={t("Export CSV")}
                    className="px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" /> <span className="hidden xl:inline">{t("CSV")}</span>
                 </button>
              </div>

              <button
                onClick={state.handleClear}
                title={t("Clear All Fields")}
                className="shrink-0 p-2 xl:px-4 xl:py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-orange-500 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-sm active:scale-95 group"
              >
                <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors xl:mr-2" />
                <span className="hidden xl:inline">{t("Clear")}</span>
              </button>

              <button
                onClick={state.handleResetToDefault}
                title={t("Reset to Defaults")}
                className="shrink-0 p-2 xl:px-4 xl:py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-red-500 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-sm active:scale-95 group"
              >
                <RotateCcw className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors xl:mr-2" />
                <span className="hidden xl:inline">{t("Reset")}</span>
              </button>

              <button
                onClick={state.handleSave}
                title={t("Save Configuration")}
                className={`shrink-0 p-2.5 xl:px-6 xl:py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-md active:scale-95 ${
                  state.isSaved
                    ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none"
                }`}
              >
                {state.isSaved ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 xl:mr-2" />
                    <span className="hidden xl:inline">{t("Saved!")}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 xl:mr-2" />
                    <span className="hidden xl:inline">{t("Save")}</span>
                  </>
                )}
              </button>
            </div>
        </div>
      </div>

      <div className="space-y-0 text-left">
        {SECTIONS.map(({ id, component: Component }) => (
          <Component
            key={id}
            firmData={state.firmData}
            setFirmData={state.setFirmData}
            activeAccordion={state.activeAccordion}
            toggleAccordion={state.toggleAccordion}
            bankOptions={state.bankOptions}
            ledgerMasters={ledgerMasters}
            {...(id === "systemCompliance"
              ? {
                  handleExportBackup: state.handleExportBackup,
                  handleRestoreBackup: state.handleCombinedImport,
                  handleFactoryReset: state.handleFactoryReset,
                  fileInputRef: state.fileInputRef,
                }
              : {})}
          />
        ))}
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
