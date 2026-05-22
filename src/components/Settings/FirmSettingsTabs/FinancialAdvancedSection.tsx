import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Upload, CheckCircle2, Copy, Settings } from 'lucide-react';
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

export const FinancialAdvancedSection: React.FC<Props> = ({ firmData, setFirmData, activeAccordion, toggleAccordion, bankOptions, ledgerMasters }) => {
  return (
    <>
      {/* Accordion 10: Financial - Advanced */}
              <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleAccordion("financial_advanced")}
                  className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Settings className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                      Financial Advanced
                    </h3>
                  </div>
                  {activeAccordion === "financial_advanced" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {activeAccordion === "financial_advanced" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                        <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800">
      
                        <div className="form-field-wrapper form-grid md:col-span-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.showCurrencySymbol}
                                onChange={(e) => setFirmData({...firmData, showCurrencySymbol: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.showCurrencySymbol ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.showCurrencySymbol ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Show Currency Symbol</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.enableDiscount}
                                onChange={(e) => setFirmData({...firmData, enableDiscount: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableDiscount ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableDiscount ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable Discounts</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.enableTax}
                                onChange={(e) => setFirmData({...firmData, enableTax: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableTax ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableTax ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable Tax Columns</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.autoRoundOff}
                                onChange={(e) => setFirmData({...firmData, autoRoundOff: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.autoRoundOff ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.autoRoundOff ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Auto Round Off</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.allowBackdatedEntries}
                                onChange={(e) => setFirmData({...firmData, allowBackdatedEntries: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.allowBackdatedEntries ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.allowBackdatedEntries ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Allow Backdated Entries</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.enableBackdatedGracePeriod}
                                onChange={(e) => setFirmData({...firmData, enableBackdatedGracePeriod: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableBackdatedGracePeriod ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableBackdatedGracePeriod ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Backdated Grace Period</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.enableMultiCurrency}
                                onChange={(e) => setFirmData({...firmData, enableMultiCurrency: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableMultiCurrency ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableMultiCurrency ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable Multi-Currency</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.enableAutoTds}
                                onChange={(e) => setFirmData({...firmData, enableAutoTds: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableAutoTds ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableAutoTds ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Auto TDS Calculation</span>
                          </label>
      
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={firmData.requireVoucherApproval}
                                onChange={(e) => setFirmData({...firmData, requireVoucherApproval: e.target.checked})}
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${firmData.requireVoucherApproval ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.requireVoucherApproval ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Voucher Approval Worklow</span>
                          </label>
                        </div>
      
                        <div className="form-field-wrapper form-grid md:col-span-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Currency & Exchange</h4>
                            <div className="space-y-2">
                              <label className="form-label">
                                Exchange Rate Update
                              </label>
                              <select
                                disabled={!firmData.enableMultiCurrency}
                                value={firmData.exchangeRateUpdateMode}
                                onChange={(e) => setFirmData({ ...firmData, exchangeRateUpdateMode: e.target.value })}
                                className={`w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 ${!firmData.enableMultiCurrency ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <option value="manual">Manual Entry</option>
                                <option value="api">Auto via API (Real-time)</option>
                                <option value="daily">Auto via API (Daily Avg)</option>
                              </select>
                            </div>
                          </div>
      
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">TDS / TCS Compliance</h4>
                            <div className="form-grid gap-4">
                              <div className="space-y-2">
                                <label className="form-label">
                                  Default TDS Rate (%)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 10"
                                  value={firmData.defaultTdsRate}
                                  onChange={(e) => setFirmData({ ...firmData, defaultTdsRate: e.target.value })}
                                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="form-label">
                                  Threshold Limit
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 30000"
                                  value={firmData.tdsThresholdLimit}
                                  onChange={(e) => setFirmData({ ...firmData, tdsThresholdLimit: e.target.value })}
                                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                />
                              </div>
                            </div>
                          </div>
      
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Approval Control</h4>
                            <div className="space-y-2">
                              <label className="form-label">
                                Approval Threshold (₹)
                              </label>
                              <input
                                type="text"
                                disabled={!firmData.requireVoucherApproval}
                                placeholder="e.g. 50000"
                                value={firmData.approvalThresholdAmount}
                                onChange={(e) => setFirmData({ ...firmData, approvalThresholdAmount: e.target.value })}
                                className={`w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 ${!firmData.requireVoucherApproval ? 'opacity-50 cursor-not-allowed' : ''}`}
                              />
                            </div>
                          </div>
      
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Interest Calculation</h4>
                            <div className="form-grid gap-4">
                              <div className="space-y-2">
                                <label className="form-label">
                                  Late Interest (%)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 18"
                                  value={firmData.latePaymentInterestRate}
                                  onChange={(e) => setFirmData({ ...firmData, latePaymentInterestRate: e.target.value })}
                                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="form-label">
                                  Method
                                </label>
                                <select
                                  value={firmData.interestCalculationMethod}
                                  onChange={(e) => setFirmData({ ...firmData, interestCalculationMethod: e.target.value })}
                                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                >
                                  <option value="simple">Simple</option>
                                  <option value="compound_monthly">Compound (Mo)</option>
                                  <option value="compound_yearly">Compound (Yr)</option>
                                </select>
                              </div>
                            </div>
                          </div>
      
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Compliance & Closing</h4>
                            <div className="form-grid gap-4">
                              <div className="space-y-2">
                                <label className="form-label">
                                  Soft Close Date
                                </label>
                                <input
                                  type="date"
                                  value={firmData.softCloseDate}
                                  onChange={(e) => setFirmData({ ...firmData, softCloseDate: e.target.value })}
                                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="form-label">
                                  Hard Freeze Date
                                </label>
                                <input
                                  type="date"
                                  value={firmData.freezeDate}
                                  onChange={(e) => setFirmData({ ...firmData, freezeDate: e.target.value })}
                                  className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
      
                        <div className="form-field-wrapper form-grid md:col-span-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                          {firmData.enableBackdatedGracePeriod && (
                            <div className="space-y-2">
                              <label className="form-label">
                                Grace Period (Days)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={firmData.backdatedGraceDays}
                                onChange={(e) =>
                                  setFirmData({ ...firmData, backdatedGraceDays: e.target.value })
                                }
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                                placeholder="Example: 7 days"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
      
              
    </>
  );
};
