import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Image } from 'lucide-react';
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

export const BrandingAssetsSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("branding")) return null;
  const isExpanded = activeAccordion === "branding" || (Boolean(searchTerm) && isSectionVisible("branding"));
  return (
    <>
      {/* Accordion 13: Branding & Assets */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("branding")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Image className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Branding Assets")}
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
{isFieldVisible("Company Logo URL") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Company Logo URL")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/logo.png"
                            value={firmData.logoUrl}
                            onChange={(e) =>
                              setFirmData({ ...firmData, logoUrl: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Theme Color") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Theme Color")}
                          </label>
                          <div className="flex space-x-4 items-center">
                            <input
                              type="color"
                              value={firmData.themeColor}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  themeColor: e.target.value,
                                })
                              }
                              className="w-12 h-12 p-1 bg-gray-50 border-none rounded-2xl cursor-pointer"
                            />
                            <input
                              type="text"
                              value={firmData.themeColor}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  themeColor: e.target.value,
                                })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
)}
{isFieldVisible("Authorized Signature URL") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Authorized Signature URL")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/signature.png"
                            value={firmData.signatureUrl}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                signatureUrl: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Company Stamp URL") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Company Stamp URL")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/stamp.png"
                            value={firmData.stampUrl}
                            onChange={(e) =>
                              setFirmData({ ...firmData, stampUrl: e.target.value })
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
