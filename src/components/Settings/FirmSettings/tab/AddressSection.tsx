import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, MapPin } from 'lucide-react';
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

export const AddressSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("addressDetails")) return null;
  const isExpanded = activeAccordion === "addressDetails" || (Boolean(searchTerm) && isSectionVisible("addressDetails"));
  return (
    <>
      {/* Accordion 4: Address Details */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("addressDetails")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Registered Address")}
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
{isFieldVisible("Registered Address") && (
                        <div className="form-field-wrapper space-y-2 md:col-span-2">
                          <label className="form-label">
                            {t("Registered Address")}
                          </label>
                          <textarea
                            placeholder={t("Enter full registered address")}
                            value={firmData.address}
                            onChange={(e) =>
                              setFirmData({ ...firmData, address: e.target.value })
                            }
                            rows={3}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("State / Province") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("State / Province")}
                          </label>
                          <select
                            value={firmData.state}
                            onChange={(e) => {
                              const newState = e.target.value;
                              const data = STATE_DATA[newState];
                              setFirmData({ 
                                ...firmData, 
                                state: newState,
                                stateCode: data ? data.code : firmData.stateCode,
                                district: data && data.districts.length > 0 ? data.districts[0] : "",
                              });
                            }}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="">{t("Select State")}</option>
                            {Object.keys(STATE_DATA).map((stateName) => (
                              <option key={stateName} value={stateName}>
                                {stateName}
                              </option>
                            ))}
                          </select>
                        </div>
)}
{isFieldVisible("District") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("District")}
                          </label>
                          {STATE_DATA[firmData.state]?.districts.length > 0 ? (
                            <select
                              value={firmData.district}
                              onChange={(e) => setFirmData({ ...firmData, district: e.target.value })}
                              className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                            >
                              {STATE_DATA[firmData.state].districts.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter District"
                              value={firmData.district}
                              onChange={(e) =>
                                setFirmData({ ...firmData, district: e.target.value })
                              }
                              className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                            />
                          )}
                        </div>
)}
{isFieldVisible("City") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("City")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter City"
                            value={firmData.city}
                            onChange={(e) =>
                              setFirmData({ ...firmData, city: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("State / UT Code (e.g., 27 for MH)") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            State / UT Code (e.g., 27 for MH)
                          </label>
                          <input
                            type="text"
                            placeholder="27"
                            value={firmData.stateCode}
                            onChange={(e) =>
                              setFirmData({ ...firmData, stateCode: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Pincode / ZIP Code") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Pincode / ZIP Code")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Pincode"
                            value={firmData.pincode}
                            onChange={(e) =>
                              setFirmData({ ...firmData, pincode: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Country") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Country")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Country"
                            value={firmData.country}
                            onChange={(e) =>
                              setFirmData({ ...firmData, country: e.target.value })
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
