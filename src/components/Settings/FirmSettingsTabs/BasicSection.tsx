import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy } from 'lucide-react';
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

export const BasicSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  return (
    <>
      {/* Accordion 1: Basic Company Details */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("basicCompany")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    Basic Details
                  </h3>
                  {activeAccordion === "basicCompany" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "basicCompany" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Company Name"
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
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Trade Name / Brand Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Trade Name"
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
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Business Slogan / Tagline
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Business Slogan"
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
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Date of Incorporation
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
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Employee Count
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
                            <option value="">Select Size</option>
                            <option value="1-10">1-10 (Micro)</option>
                            <option value="11-50">11-50 (Small)</option>
                            <option value="51-200">51-200 (Medium)</option>
                            <option value="201-500">201-500 (Large)</option>
                            <option value="500+">500+ (Enterprise)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Annual Turnover
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
                            <option value="">Select Turnover Range</option>
                            <option value="<10L">Up to ₹10 Lakhs</option>
                            <option value="10L-50L">₹10 Lakhs - ₹50 Lakhs</option>
                            <option value="50L-5Cr">₹50 Lakhs - ₹5 Crores</option>
                            <option value="5Cr-50Cr">₹5 Crores - ₹50 Crores</option>
                            <option value=">50Cr">Above ₹50 Crores</option>
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
