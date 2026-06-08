import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Database } from 'lucide-react';
import { STATE_DATA } from "../../../../../lib/states";
import { SearchableDropdown } from "../../../../ui/SearchableDropdown";
import { BUSINESS_SUBDOMAINS, DOMAIN_CATEGORIES, BUSINESS_ROLES } from "../../../../../lib/firmSettingsConstants";
import { useSearchFilter } from "../hooks/useSearchFilter";

interface Props {
  firmData: any;
  setFirmData: (data: any) => void;
  activeAccordion: string | null;
  toggleAccordion: (section: string) => void;
  bankOptions?: { id: string; name: string }[];
  ledgerMasters?: any[];
  searchTerm?: string;
  handleExportBackup?: () => void;
  handleRestoreBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFactoryReset?: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

export const SystemDataSection: React.FC<Props> = ({ 
  firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm,
  handleExportBackup, handleRestoreBackup, handleFactoryReset, fileInputRef
}) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("systemCompliance")) return null;
  const isExpanded = activeAccordion === "systemCompliance" || (Boolean(searchTerm) && isSectionVisible("systemCompliance"));
  return (
    <>
      {/* Accordion 15: System Data & Compliance */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("systemCompliance")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Database className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("System Backup")}
                    </h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        
                        {/* Action Logic Audit */}
                        <div className="space-y-2 flex items-center pt-8">
                          <input
                            type="checkbox"
                            id="enableAuditLog"
                            checked={firmData.enableAuditLog}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                enableAuditLog: e.target.checked,
                              })
                            }
                            className="form-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="enableAuditLog"
                            className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                          >
                            {t("Enable Action Logic Audit")}
                          </label>
                        </div>
      
                        {/* Format Validation */}
                        <div className="space-y-2 flex items-center pt-8">
                          <input
                            type="checkbox"
                            id="enforceFormatValidation"
                            checked={firmData.enforceFormatValidation}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                enforceFormatValidation: e.target.checked,
                              })
                            }
                            className="form-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="enforceFormatValidation"
                            className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                          >
                            {t("Enforce Strict Format Validation")}
                          </label>
                        </div>
      
                        {/* 3D Backup Reset Tooling */}
                        <div className="form-field-wrapper space-y-2 md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700 border-dashed">
                           <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                             3D Backup / Reset Tooling
                           </h4>
                           <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                             <button
                               onClick={handleExportBackup}
                               className="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                             >
                               {t("Export 3D Backup")}
                             </button>
                             <button
                               onClick={() => {
                                 if (fileInputRef && fileInputRef.current) {
                                   fileInputRef.current.click();
                                 } else {
                                   document.getElementById('globalHiddenFileInput')?.click();
                                 }
                               }}
                               className="px-6 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                             >
                               {t("Restore Backup")}
                             </button>
                             <button
                               onClick={handleFactoryReset}
                               className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                             >
                               {t("Factory Reset Tooling")}
                             </button>
                           </div>
                        </div>
      
{isFieldVisible("Data Retention Period") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Data Retention Period")}
                          </label>
                          <select
                            value={firmData.dataRetentionPeriod}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                dataRetentionPeriod: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="1_year">{t("1 Year")}</option>
                            <option value="3_years">{t("3 Years")}</option>
                            <option value="7_years">{t("7 Years")}</option>
                            <option value="indefinite">Indefinite (Keep forever)</option>
                          </select>
                        </div>
)}
                        
                        <div className="space-y-2 flex items-center pt-8">
                          <input
                            type="checkbox"
                            id="autoBackup"
                            checked={firmData.autoBackup}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                autoBackup: e.target.checked,
                              })
                            }
                            className="form-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="autoBackup"
                            className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                          >
                            {t("Enable Auto Scheduled Backup")}
                          </label>
                        </div>
      
                        {firmData.autoBackup && isFieldVisible("Auto Backup Frequency") && (
                          <div className="space-y-2">
                            <label className="form-label">
                              {t("Auto Backup Frequency")}
                            </label>
                            <select
                              value={firmData.backupFrequency}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  backupFrequency: e.target.value,
                                })
                              }
                              className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            >
                              <option value="daily">{t("Daily")}</option>
                              <option value="weekly">{t("Weekly")}</option>
                              <option value="monthly">{t("Monthly")}</option>
                            </select>
                          </div>
                        )}
      
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
    </>
  );
};
