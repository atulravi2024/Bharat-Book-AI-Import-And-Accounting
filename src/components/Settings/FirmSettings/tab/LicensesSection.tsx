import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Award } from 'lucide-react';
import { STATE_DATA } from "../../../../lib/states";
import { SearchableDropdown } from "../../../ui/SearchableDropdown";
import { BUSINESS_SUBDOMAINS, DOMAIN_CATEGORIES, BUSINESS_ROLES } from "../../../../lib/firmSettingsConstants";

interface Props {
  firmData: any;
  setFirmData: (data: any) => void;
  activeAccordion: string | null;
  toggleAccordion: (section: string) => void;
  bankOptions?: { id: string; name: string }[];
  ledgerMasters?: any[];
}

export const LicensesSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 5B: Business & Operational Licenses */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("businessLicenses")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Award className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Operational Licenses")}
                    </h3>
                  </div>
                  {activeAccordion === "businessLicenses" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "businessLicenses" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("CIN (Corporate Identity Number)")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter CIN"
                              value={firmData.cin}
                              onChange={(e) =>
                                setFirmData({ ...firmData, cin: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.cinDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, cinDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("MSME / Udyam Number")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter MSME/Udyam"
                              value={firmData.msmeNo}
                              onChange={(e) =>
                                setFirmData({ ...firmData, msmeNo: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.msmeDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, msmeDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("IEC (Import Export Code)")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter IEC Code"
                              value={firmData.iecCode}
                              onChange={(e) =>
                                setFirmData({ ...firmData, iecCode: e.target.value })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.iecDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, iecDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Trade License Number")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter Trade License"
                              value={firmData.tradeLicense}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  tradeLicense: e.target.value,
                                })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.tradeLicenseDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, tradeLicenseDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("FSSAI License Number (If Applicable)")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              placeholder="Enter FSSAI"
                              value={firmData.fssaiNumber}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  fssaiNumber: e.target.value,
                                })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.fssaiDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, fssaiDate: e.target.value })
                              }
                              className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Drug License No. (If applicable)")}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <input
                              type="text"
                              value={firmData.drugLicense}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  drugLicense: e.target.value,
                                })
                              }
                              className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                            />
                            <input
                              type="date"
                              title="Registration Date"
                              value={firmData.drugLicenseDate}
                              onChange={(e) =>
                                setFirmData({ ...firmData, drugLicenseDate: e.target.value })
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
