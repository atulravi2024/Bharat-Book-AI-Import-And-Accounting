import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Package } from 'lucide-react';
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
}

export const InventoryLogisticsSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("inventoryLogistics")) return null;
  const isExpanded = activeAccordion === "inventoryLogistics" || (Boolean(searchTerm) && isSectionVisible("inventoryLogistics"));
  return (
    <>
      {/* Accordion 12: Inventory & Logistics */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("inventoryLogistics")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Package className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Inventory Logistics")}
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
{isFieldVisible("Inventory Valuation Method") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Inventory Valuation Method")}
                          </label>
                          <select
                            value={firmData.inventoryValuation}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                inventoryValuation: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="FIFO">First In, First Out (FIFO)</option>
                            <option value="LIFO">Last In, First Out (LIFO)</option>
                            <option value="AVERAGE">{t("Weighted Average Cost")}</option>
                          </select>
                        </div>
)}
                        <div className="space-y-2 flex items-center pt-8">
                          <input
                            type="checkbox"
                            id="enableNegativeStock"
                            checked={firmData.enableNegativeStock}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                enableNegativeStock: e.target.checked,
                              })
                            }
                            className="form-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="enableNegativeStock"
                            className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                          >
                            {t("Enable Negative Stock Billing")}
                          </label>
                        </div>
{isFieldVisible("Preferred Shipping Partner") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Preferred Shipping Partner")}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. FedEx, BlueDart, DTDC"
                            value={firmData.shippingPartner}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                shippingPartner: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Standard Delivery Time") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Standard Delivery Time")}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2-3 Business Days"
                            value={firmData.deliveryTime}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                deliveryTime: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
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
