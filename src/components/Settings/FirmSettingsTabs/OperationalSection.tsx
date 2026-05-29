import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Sliders } from 'lucide-react';
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

export const OperationalSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 10: Operational Settings */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("operational")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Sliders className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Operational Settings")}
                    </h3>
                  </div>
                  {activeAccordion === "operational" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "operational" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Timezone")}
                          </label>
                          <select
                            value={firmData.timezone}
                            onChange={(e) =>
                              setFirmData({ ...firmData, timezone: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                            <option value="UTC">{t("UTC")}</option>
                            <option value="America/New_York">EST (America/New_York)</option>
                            <option value="Europe/London">GMT (Europe/London)</option>
                            <option value="Australia/Sydney">AEST (Australia/Sydney)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Working Days")}
                          </label>
                          <select
                            value={firmData.workingDays}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                workingDays: e.target.value,
                                ...(e.target.value !== "Custom" ? { customWorkingDays: "" } : {})
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="Monday-Friday">{t("Monday - Friday")}</option>
                            <option value="Monday-Saturday">{t("Monday - Saturday")}</option>
                            <option value="Monday-Sunday">Monday - Sunday (All Days)</option>
                            <option value="Custom">{t("Custom")}</option>
                          </select>
                        </div>
      
                        {firmData.workingDays === "Custom" && (
                          <div className="form-field-wrapper space-y-2 md:col-span-2">
                            <label className="form-label">
                              {t("Custom Working Days")}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Mon, Wed, Fri"
                              value={firmData.customWorkingDays || ""}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  customWorkingDays: e.target.value,
                                })
                              }
                              className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          </div>
                        )}
      
                        <div className="form-field-wrapper space-y-2 md:col-span-2">
                          <label className="form-label">
                            {t("Working Hours")}
                          </label>
                          <div className="form-grid gap-4">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">{t("From")}</span>
                              <input
                                type="time"
                                value={firmData.workingHoursStart || "09:00"}
                                onChange={(e) => {
                                  const start = e.target.value;
                                  setFirmData({
                                    ...firmData,
                                    workingHoursStart: start,
                                    workingHours: `${start} to ${firmData.workingHoursEnd || '18:00'}`
                                  });
                                }}
                                className="w-full p-4 pl-14 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                              />
                            </div>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">{t("To")}</span>
                              <input
                                type="time"
                                value={firmData.workingHoursEnd || "18:00"}
                                onChange={(e) => {
                                  const end = e.target.value;
                                  setFirmData({
                                    ...firmData,
                                    workingHoursEnd: end,
                                    workingHours: `${firmData.workingHoursStart || '09:00'} to ${end}`
                                  });
                                }}
                                className="w-full p-4 pl-10 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-field-wrapper space-y-2 md:col-span-2">
                          <label className="form-label">
                            {t("Holidays")}
                          </label>
                          <textarea
                            placeholder="e.g. Holi, Diwali, Christmas..."
                            value={firmData.holidays}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                holidays: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200 resize-y min-h-[60px]"
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
