import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Users } from 'lucide-react';
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

export const HrPayrollSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("hrPayroll")) return null;
  const isExpanded = activeAccordion === "hrPayroll" || (Boolean(searchTerm) && isSectionVisible("hrPayroll"));
  return (
    <>
      {/* Accordion 6: HR & Payroll Compliance */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("hrPayroll")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Users className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Payroll Setup")}
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
{isFieldVisible("EPF Number (Provident Fund)") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            EPF Number (Provident Fund)
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="e.g. MH/BAN/12345/000"
                              value={firmData.pfNumber}
                              onChange={(e) =>
                                setFirmData({ ...firmData, pfNumber: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.pfDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, pfDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
)}
{isFieldVisible("ESIC Number") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("ESIC Number")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="e.g. 31000123450001234"
                              value={firmData.esicNumber}
                              onChange={(e) =>
                                setFirmData({ ...firmData, esicNumber: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.esicDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, esicDate: e.target.value })
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
