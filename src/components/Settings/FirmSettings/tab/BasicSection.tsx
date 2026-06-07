import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Building } from 'lucide-react';
import { STATE_DATA } from "../../../../lib/states";
import { SearchableDropdown } from "../../../ui/SearchableDropdown";
import { BUSINESS_SUBDOMAINS, DOMAIN_CATEGORIES, BUSINESS_ROLES } from "../../../../lib/firmSettingsConstants";
import { useLanguage } from '../../../../context/LanguageContext';
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

export const BasicSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);
  
  if (!isSectionVisible("basicCompany")) return null;
  const isExpanded = activeAccordion === "basicCompany" || (Boolean(searchTerm) && isSectionVisible("basicCompany"));
  return (
    <>
      {/* Accordion 1: Basic Company Details */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("basicCompany")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Building className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Basic Details")}
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
{isFieldVisible("Company Name") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Company Name")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("Enter Company Name")}
                            value={firmData.companyName}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                companyName: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Trade Name / Brand Name") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Trade Name / Brand Name")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("Enter Trade Name")}
                            value={firmData.tradeName}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                tradeName: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Business Slogan / Tagline") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Business Slogan / Tagline")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("Enter Business Slogan")}
                            value={firmData.businessSlogan}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                businessSlogan: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Date of Incorporation") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Date of Incorporation")}
                          </label>
                          <input
                            type="date"
                            value={firmData.dateOfIncorporation}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                dateOfIncorporation: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Employee Count") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Employee Count")}
                          </label>
                          <select
                            value={firmData.employeeCount}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                employeeCount: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="">{t("Select Size")}</option>
                            <option value="1-10">1-10 (Micro)</option>
                            <option value="11-50">11-50 (Small)</option>
                            <option value="51-200">51-200 (Medium)</option>
                            <option value="201-500">201-500 (Large)</option>
                            <option value="500+">500+ (Enterprise)</option>
                          </select>
                        </div>
)}
{isFieldVisible("Annual Turnover") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Annual Turnover")}
                          </label>
                          <select
                            value={firmData.annualTurnover}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                annualTurnover: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="">{t("Select Turnover Range")}</option>
                            <option value="<10L">{t("Up to ₹10 Lakhs")}</option>
                            <option value="10L-50L">{t("₹10 Lakhs - ₹50 Lakhs")}</option>
                            <option value="50L-5Cr">{t("₹50 Lakhs - ₹5 Crores")}</option>
                            <option value="5Cr-50Cr">{t("₹5 Crores - ₹50 Crores")}</option>
                            <option value=">50Cr">{t("Above ₹50 Crores")}</option>
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
