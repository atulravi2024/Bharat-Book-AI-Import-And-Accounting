import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, PhoneCall } from 'lucide-react';
import { STATE_DATA } from "../../../lib/states";
import { SearchableDropdown } from "../../ui/SearchableDropdown";
import { BUSINESS_SUBDOMAINS, DOMAIN_CATEGORIES, BUSINESS_ROLES } from "../../../lib/firmSettingsConstants";
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  firmData: any;
  setFirmData: (data: any) => void;
  activeAccordion: string | null;
  toggleAccordion: (section: string) => void;
  bankOptions?: { id: string; name: string }[];
  ledgerMasters?: any[];
}

export const ContactsSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  const { t } = useLanguage();
  return (
    <>
      {/* Accordion 3: Primary Contacts */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("primaryContacts")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <PhoneCall className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Primary Contacts")}
                    </h3>
                  </div>
                  {activeAccordion === "primaryContacts" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "primaryContacts" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Primary Contact Name")}
                          </label>
                          <input
                            type="text"
                            placeholder={t("Enter Full Name")}
                            value={firmData.primaryContactName}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                primaryContactName: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Contact Designation")}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Director, Manager"
                            value={firmData.primaryContactDesignation}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                primaryContactDesignation: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Primary Email")}
                          </label>
                          <input
                            type="email"
                            placeholder="company@example.com"
                            value={firmData.email}
                            onChange={(e) =>
                              setFirmData({ ...firmData, email: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Phone Number")}
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 (234) 567-8901"
                            value={firmData.phone}
                            onChange={(e) =>
                              setFirmData({ ...firmData, phone: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("WhatsApp Business Number")}
                          </label>
                          <input
                            type="tel"
                            placeholder="Enter WhatsApp Number"
                            value={firmData.whatsapp}
                            onChange={(e) =>
                              setFirmData({ ...firmData, whatsapp: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Support Email")}
                          </label>
                          <input
                            type="email"
                            placeholder="support@example.com"
                            value={firmData.supportEmail}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                supportEmail: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Support Phone Number")}
                          </label>
                          <input
                            type="tel"
                            placeholder="Support contact"
                            value={firmData.supportPhone}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                supportPhone: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Website")}
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.example.com"
                            value={firmData.website}
                            onChange={(e) =>
                              setFirmData({ ...firmData, website: e.target.value })
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
