import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Hash } from 'lucide-react';
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

export const FinancialFormattingSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 9: Financial - Formatting */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("financial_formatting")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Hash className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Financial Formatting")}
                    </h3>
                  </div>
                  {activeAccordion === "financial_formatting" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "financial_formatting" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Currency Symbol Position")}
                          </label>
                          <select
                            value={firmData.currencySymbolPosition}
                            onChange={(e) =>
                              setFirmData({ ...firmData, currencySymbolPosition: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="prefix">Prefix (e.g. ₹100)</option>
                            <option value="suffix">Suffix (e.g. 100 ₹)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Decimal Precision")}
                          </label>
                          <select
                            value={firmData.decimalPlaces}
                            onChange={(e) =>
                              setFirmData({ ...firmData, decimalPlaces: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="0">0 (e.g. 100)</option>
                            <option value="1">1 (e.g. 100.0)</option>
                            <option value="2">2 (e.g. 100.00)</option>
                            <option value="3">3 (e.g. 100.000)</option>
                            <option value="4">4 (e.g. 100.0000)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Rounding Method")}
                          </label>
                          <select
                            value={firmData.roundingMethod}
                            onChange={(e) =>
                              setFirmData({ ...firmData, roundingMethod: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="nearest">{t("Round to Nearest")}</option>
                            <option value="up">{t("Round Up")}</option>
                            <option value="down">{t("Round Down")}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Number System")}
                          </label>
                          <select
                            value={firmData.numberGroupingStyle}
                            onChange={(e) =>
                              setFirmData({ ...firmData, numberGroupingStyle: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="indian">Indian (1,23,456.00)</option>
                            <option value="international">International (123,456.00)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Thousand Separator")}
                          </label>
                          <select
                            value={firmData.thousandSeparator}
                            onChange={(e) =>
                              setFirmData({ ...firmData, thousandSeparator: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value=",">Comma (,)</option>
                            <option value=".">Dot (.)</option>
                            <option value=" ">Space ( )</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Decimal Separator")}
                          </label>
                          <select
                            value={firmData.decimalSeparator}
                            onChange={(e) =>
                              setFirmData({ ...firmData, decimalSeparator: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value=".">Dot (.)</option>
                            <option value=",">Comma (,)</option>
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
