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

export const ProfileSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  return (
    <>
      {/* Accordion 2: Business Profile */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("businessProfile")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    Business Profile
                  </h3>
                  {activeAccordion === "businessProfile" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "businessProfile" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Business Constitution
                          </label>
                          <select
                            value={firmData.businessType}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                businessType: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="proprietorship">Sole Proprietorship</option>
                            <option value="partnership">Partnership</option>
                            <option value="llc">LLP / LLC</option>
                            <option value="pvt_ltd">Private Limited</option>
                            <option value="public_ltd">Public Limited</option>
                            <option value="trust">Trust / NGO</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Nature of Business
                          </label>
                          <select
                            value={firmData.businessNature}
                            onChange={(e) => {
                              const newNature = e.target.value;
                              const defaultDomain = DOMAIN_CATEGORIES[newNature]?.[0]?.value || "";
                              const defaultSubDomain = BUSINESS_SUBDOMAINS[defaultDomain]?.[0]?.value || "";
                              const defaultRole = BUSINESS_ROLES[newNature]?.[0]?.value || "";
      
                              setFirmData({
                                ...firmData,
                                businessNature: newNature,
                                businessDomain: defaultDomain,
                                businessSubDomain: defaultSubDomain,
                                businessRole: defaultRole,
                              });
                            }}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="product">Inventory / Product Based</option>
                            <option value="service">Service Provider</option>
                            <option value="professional">Professional / Consultation</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Sales Channel / E-Commerce
                          </label>
                          <select
                            value={firmData.isEcommerceInfo}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                isEcommerceInfo: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="offline">Offline / Physical Store Only</option>
                            <option value="online">Online / E-Commerce Only</option>
                            <option value="omnichannel">Both Online and Offline (Omnichannel)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Select the Business Type
                          </label>
                          <select
                            value={firmData.businessRole}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                businessRole: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            {BUSINESS_ROLES[firmData.businessNature]?.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            What business is involved?
                          </label>
                          <select
                            value={firmData.businessDomain}
                            onChange={(e) => {
                              const newDomain = e.target.value;
                              const defaultSubDomain = BUSINESS_SUBDOMAINS[newDomain]?.[0]?.value || "";
                              setFirmData({
                                ...firmData,
                                businessDomain: newDomain,
                                businessSubDomain: defaultSubDomain,
                              });
                            }}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            {DOMAIN_CATEGORIES[firmData.businessNature]?.map((domain) => (
                              <option key={domain.value} value={domain.value}>
                                {domain.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {BUSINESS_SUBDOMAINS[firmData.businessDomain] && (
                          <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                              Specific Business Type
                            </label>
                            <select
                              value={firmData.businessSubDomain}
                              onChange={(e) =>
                                setFirmData({
                                  ...firmData,
                                  businessSubDomain: e.target.value,
                                })
                              }
                              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                            >
                              {BUSINESS_SUBDOMAINS[firmData.businessDomain].map((subOption) => (
                                <option key={subOption.value} value={subOption.value}>
                                  {subOption.label}
                                </option>
                              ))}
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
