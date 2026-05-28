import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Receipt } from 'lucide-react';
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

export const BillingSalesSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 11: Billing & Sales Preferences */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("billing")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Receipt className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Billing Sales")}
                    </h3>
                  </div>
                  {activeAccordion === "billing" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "billing" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Invoice Prefix")}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. INV-"
                            value={firmData.invoicePrefix}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                invoicePrefix: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Quotation Prefix")}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. QTN-"
                            value={firmData.quotationPrefix}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                quotationPrefix: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Default Payment Terms")}
                          </label>
                          <select
                            value={firmData.paymentTerms}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                paymentTerms: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="Due on Receipt">{t("Due on Receipt")}</option>
                            <option value="Net 15">{t("Net 15")}</option>
                            <option value="Net 30">{t("Net 30")}</option>
                            <option value="Net 45">{t("Net 45")}</option>
                            <option value="Net 60">{t("Net 60")}</option>
                            <option value="Net 90">{t("Net 90")}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Late Payment Penalty Rate")}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1.5% per month"
                            value={firmData.latePaymentPenalty}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                latePaymentPenalty: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="form-field-wrapper space-y-2 md:col-span-2 flex items-center">
                          <input
                            type="checkbox"
                            id="taxInclusivePricing"
                            checked={firmData.taxInclusivePricing}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                taxInclusivePricing: e.target.checked,
                              })
                            }
                            className="form-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="taxInclusivePricing"
                            className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                          >
                            {t("Prices are Tax Inclusive by default")}
                          </label>
                        </div>
                        <div className="form-field-wrapper space-y-2 md:col-span-2">
                          <label className="form-label">
                            {t("Default Terms and Conditions")}
                          </label>
                          <textarea
                            placeholder="1. Goods once sold will not be taken back."
                            value={firmData.defaultTerms}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                defaultTerms: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
      
              
    </>
  );
};
