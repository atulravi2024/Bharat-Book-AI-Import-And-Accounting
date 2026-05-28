import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Globe } from 'lucide-react';
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

export const SocialWebSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 9: Social & Web Presence */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("social")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Globe className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Social Presence")}
                    </h3>
                  </div>
                  {activeAccordion === "social" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "social" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("LinkedIn Page")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/company/your-company"
                            value={firmData.linkedIn}
                            onChange={(e) =>
                              setFirmData({ ...firmData, linkedIn: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Twitter / X Handle")}
                          </label>
                          <input
                            type="text"
                            placeholder="@company_handle"
                            value={firmData.twitter}
                            onChange={(e) =>
                              setFirmData({ ...firmData, twitter: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Facebook Page")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://facebook.com/your-company"
                            value={firmData.facebook}
                            onChange={(e) =>
                              setFirmData({ ...firmData, facebook: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Instagram Handle")}
                          </label>
                          <input
                            type="text"
                            placeholder="@your_company"
                            value={firmData.instagram}
                            onChange={(e) =>
                              setFirmData({ ...firmData, instagram: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("YouTube Channel")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://youtube.com/@your-company"
                            value={firmData.youtube}
                            onChange={(e) =>
                              setFirmData({ ...firmData, youtube: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("WhatsApp Number")}
                          </label>
                          <input
                            type="text"
                            placeholder="+91 98765 43210"
                            value={firmData.whatsapp}
                            onChange={(e) =>
                              setFirmData({ ...firmData, whatsapp: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
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
