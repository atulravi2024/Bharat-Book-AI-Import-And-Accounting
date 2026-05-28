import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Coins } from 'lucide-react';
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

export const FinancialTaxationSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 8: Financial - Taxation */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("financial_tax")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Coins className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Financial Taxation")}
                    </h3>
                  </div>
                  {activeAccordion === "financial_tax" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "financial_tax" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Tax Filing Frequency")}
                          </label>
                          <select
                            value={firmData.taxFilingFrequency}
                            onChange={(e) =>
                              setFirmData({ ...firmData, taxFilingFrequency: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="monthly">{t("Monthly")}</option>
                            <option value="quarterly">{t("Quarterly")}</option>
                            <option value="annually">{t("Annually")}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Default Tax System")}
                          </label>
                          <select
                            value={firmData.defaultTaxCategory}
                            onChange={(e) =>
                              setFirmData({ ...firmData, defaultTaxCategory: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="GST">GST (India)</option>
                            <option value="VAT">{t("VAT")}</option>
                            <option value="SalesTax">{t("Sales Tax")}</option>
                            <option value="Exempt">{t("Tax Exempt")}</option>
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
