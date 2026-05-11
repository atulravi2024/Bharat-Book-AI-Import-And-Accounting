import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy } from 'lucide-react';
import { STATE_DATA } from "../../../lib/states";
import { SearchableDropdown } from "../../ui/SearchableDropdown";
import { BUSINESS_SUBDOMAINS, DOMAIN_CATEGORIES, BUSINESS_ROLES } from "../../../lib/firmSettingsConstants";

interface Props {
  firmData: any;
  setFirmData: (data: any) => void;
  activeAccordion: string | null;
  toggleAccordion: (section: string) => void;
  bankOptions?: { id: string; name: string }[];
  ledgerMasters?: any[];
}

export const HrPayrollSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  return (
    <>
      {/* Accordion 6: HR & Payroll Compliance */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("hrPayroll")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    HR Compliance
                  </h3>
                  {activeAccordion === "hrPayroll" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "hrPayroll" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
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
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            ESIC Number
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
      
              
    </>
  );
};
