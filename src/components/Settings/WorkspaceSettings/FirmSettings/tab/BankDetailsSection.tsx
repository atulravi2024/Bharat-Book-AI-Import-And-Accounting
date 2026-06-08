import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, CreditCard } from 'lucide-react';
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

export const BankDetailsSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters, searchTerm }) => {
  const { t } = useLanguage();
  const { isFieldVisible, isSectionVisible } = useSearchFilter(searchTerm);

  if (!isSectionVisible("bank")) return null;
  const isExpanded = activeAccordion === "bank" || (Boolean(searchTerm) && isSectionVisible("bank"));
  return (
    <>
      {/* Accordion 8: Bank Details */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("bank")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <CreditCard className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      {t("Bank Details")}
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
{isFieldVisible("Bank Name") && (
                        <div className="space-y-2 relative">
                          <label className="form-label">
                            {t("Bank Name")}
                          </label>
                          <SearchableDropdown
                            options={bankOptions}
                            value={firmData.bankName}
                            onChange={(value) => {
                              const selectedBankMaster = ledgerMasters.find(m => m.name === value);
                              if (selectedBankMaster && selectedBankMaster.bankDetails) {
                                  setFirmData({ 
                                    ...firmData, 
                                    bankName: value,
                                    accountNumber: selectedBankMaster.bankDetails.accountNo || firmData.accountNumber,
                                    ifscCode: selectedBankMaster.bankDetails.ifsc || firmData.ifscCode,
                                    swiftCode: selectedBankMaster.bankDetails.swiftCode || firmData.swiftCode,
                                    micrCode: selectedBankMaster.bankDetails.micrCode || firmData.micrCode,
                                    accountType: selectedBankMaster.bankDetails.accountType || firmData.accountType,
                                    branchName: selectedBankMaster.bankDetails.branchName || firmData.branchName,
                                    upiId: selectedBankMaster.bankDetails.upiId || firmData.upiId
                                  });
                              } else {
                                  setFirmData({ ...firmData, bankName: value });
                              }
                            }}
                            placeholder="Enter Bank Name or Select"
                            buttonClassName="w-full text-left p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Account Number") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Account Number")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Account Number"
                            value={firmData.accountNumber}
                            onChange={(e) =>
                              setFirmData({
                                ...firmData,
                                accountNumber: e.target.value,
                              })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("IFSC Code") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("IFSC Code")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter IFSC Code"
                            value={firmData.ifscCode}
                            onChange={(e) =>
                              setFirmData({ ...firmData, ifscCode: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("SWIFT Code") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("SWIFT Code")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter SWIFT Code"
                            value={firmData.swiftCode}
                            onChange={(e) =>
                              setFirmData({ ...firmData, swiftCode: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("MICR Code") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("MICR Code")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter MICR Code"
                            value={firmData.micrCode}
                            onChange={(e) =>
                              setFirmData({ ...firmData, micrCode: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("Account Type") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Account Type")}
                          </label>
                          <select
                            value={firmData.accountType}
                            onChange={(e) =>
                              setFirmData({ ...firmData, accountType: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="Savings">{t("Savings")}</option>
                            <option value="Current">{t("Current")}</option>
                            <option value="Overdraft">{t("Overdraft")}</option>
                            <option value="Cash Credit">{t("Cash Credit")}</option>
                          </select>
                        </div>
)}
{isFieldVisible("Branch Name") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("Branch Name")}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Branch Name"
                            value={firmData.branchName}
                            onChange={(e) =>
                              setFirmData({ ...firmData, branchName: e.target.value })
                            }
                            className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
)}
{isFieldVisible("UPI / VPA ID") && (
                        <div className="space-y-2">
                          <label className="form-label">
                            {t("UPI / VPA ID")}
                          </label>
                          <input
                            type="text"
                            placeholder="company@bank"
                            value={firmData.upiId}
                            onChange={(e) =>
                              setFirmData({ ...firmData, upiId: e.target.value })
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
