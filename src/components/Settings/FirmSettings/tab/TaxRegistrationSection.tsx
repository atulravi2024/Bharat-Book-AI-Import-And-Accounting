import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Percent } from 'lucide-react';
import { STATE_DATA } from "../../../../lib/states";
import { SearchableDropdown } from "../../../ui/SearchableDropdown";
import { BUSINESS_SUBDOMAINS, DOMAIN_CATEGORIES, BUSINESS_ROLES } from "../../../../lib/firmSettingsConstants";
import { useSearchFilter } from "../hooks/useSearchFilter";

interface Props {
  firmData: any;
  setFirmData: (data: any) => void;
  activeAccordion: string | null;
  toggleAccordion: (section: string) => void;
  bankOptions?: { id: string; name: string }[];
  ledgerMasters?: any[];
  searchTerm?: string;
}

export const TaxRegistrationSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("statutoryTax")) return null;
  const isExpanded = activeAccordion === "statutoryTax" || (Boolean(searchTerm) && isSectionVisible("statutoryTax"));
  return (
    <>
      {/* Accordion 5: Statutory & Tax Registrations */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("statutoryTax")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Percent className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Tax Registration")}
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
{isFieldVisible("GSTIN / Tax ID") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("GSTIN / Tax ID")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter GSTIN"
                              value={firmData.gstin}
                              onChange={(e) =>
                                setFirmData({ ...firmData, gstin: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.gstinDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, gstinDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
)}
{isFieldVisible("PAN Number") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("PAN Number")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter PAN"
                              value={firmData.pan}
                              onChange={(e) =>
                                setFirmData({ ...firmData, pan: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.panDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, panDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
)}
{isFieldVisible("TAN Number") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("TAN Number")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter TAN"
                              value={firmData.tanNumber}
                              onChange={(e) =>
                                setFirmData({ ...firmData, tanNumber: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.tanDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, tanDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
)}
{isFieldVisible("LUT Number (For Exports)") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("LUT Number (For Exports)")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="e.g. AD270321000123"
                              value={firmData.lutNumber}
                              onChange={(e) =>
                                setFirmData({ ...firmData, lutNumber: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.lutDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, lutDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
)}
{isFieldVisible("Professional Tax (PT) Reg No.") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Professional Tax (PT) Reg No.")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              value={firmData.ptNumber}
                              onChange={(e) =>
                                setFirmData({ ...firmData, ptNumber: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.ptDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, ptDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
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
