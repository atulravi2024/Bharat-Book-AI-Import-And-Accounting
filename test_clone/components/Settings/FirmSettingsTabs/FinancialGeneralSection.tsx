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

export const FinancialGeneralSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  return (
    <>
      {/* Accordion 7: Financial - General */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("financial_general")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    Financial - General
                  </h3>
                  {activeAccordion === "financial_general" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "financial_general" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Financial Year
                          </label>
                          <select
                            value={firmData.financialYear}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                financialYear: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="apr-mar">April - March</option>
                            <option value="jan-dec">January - December</option>
                            <option value="jul-jun">July - June</option>
                            <option value="oct-sep">October - September</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Base Currency
                          </label>
                          <select
                            value={firmData.baseCurrency}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                baseCurrency: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="INR">INR - Indian Rupee (₹)</option>
                            <option value="USD">USD - US Dollar ($)</option>
                            <option value="EUR">EUR - Euro (€)</option>
                            <option value="GBP">GBP - British Pound (£)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Date Format
                          </label>
                          <select
                            value={firmData.dateFormat}
                            onChange={(e) =>
                              setFirmData({ ...firmData, dateFormat: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Accounting Method
                          </label>
                          <select
                            value={firmData.accountingMethod}
                            onChange={(e) =>
                              setFirmData({ ...firmData, accountingMethod: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="cash">Cash Accounting</option>
                            <option value="accrual">Accrual Accounting</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
    </>
  );
};
