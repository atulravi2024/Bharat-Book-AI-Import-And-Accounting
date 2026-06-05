import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Calculator, HelpCircle, ChevronDown, ChevronUp, Landmark, ShieldAlert, Sparkles, Check, Download } from 'lucide-react';

export const PresumptiveTaxPlanner: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const [activeSection, setActiveSection] = useState<'44ad' | '44ada' | '44ae'>('44ad');
  const [infoOpen, setInfoOpen] = useState(true);

  // SECTION 44AD State
  const [turnoverDigital, setTurnoverDigital] = useState<number>(3500000);
  const [turnoverCash, setTurnoverCash] = useState<number>(500000);
  const [customProfitRate, setCustomProfitRate] = useState<number>(0); // If they want to claim more than the min statutory rate
  
  // SECTION 44ADA State
  const [receiptsProfessional, setReceiptsProfessional] = useState<number>(1800000);
  
  // SECTION 44AE State
  const [heavyVehiclesCount, setHeavyVehiclesCount] = useState<number>(2);
  const [heavyVehiclesMonths, setHeavyVehiclesMonths] = useState<number>(12);
  const [lightVehiclesCount, setLightVehiclesCount] = useState<number>(3);
  const [lightVehiclesMonths, setLightVehiclesMonths] = useState<number>(12);

  // Calculations for Sec 44AD
  const minProfitDigital = (turnoverDigital * 6) / 100;
  const minProfitCash = (turnoverCash * 8) / 100;
  const minStatutoryProfit44AD = minProfitDigital + minProfitCash;
  const chosenProfit44AD = Math.max(minStatutoryProfit44AD, (turnoverDigital + turnoverCash) * (customProfitRate / 100));

  // Calculations for Sec 44ADA
  const minStatutoryProfit44ADA = (receiptsProfessional * 50) / 100;

  // Calculations for Sec 44AE
  // Heavy: Rs 1,000 per ton per month
  // Medium/Light: Rs 7,500 per month
  const heavyProfit = heavyVehiclesCount * heavyVehiclesMonths * 12000; // assumed avg 12 ton heavy capacity
  const lightProfit = lightVehiclesCount * lightVehiclesMonths * 7500;
  const totalProfit44AE = heavyProfit + lightProfit;

  return (
    <div className="space-y-6">
      {/* Dynamic Intro Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div 
          onClick={() => setInfoOpen(!infoOpen)}
          className="flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-650 dark:text-yellow-400" size={18} />
            <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
              {t("Presumptive Taxation Sandbox (Sec 44AD/ADA/AE)")}
            </h3>
          </div>
          <span className="text-gray-400">
            {infoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>

        {infoOpen && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-slate-100 pt-4 dark:border-gray-700 animate-fadeIn space-y-2">
            <p>
              {t("Presumptive taxation helps micro-enterprises, small service providers, professionals, and carriage operators report their income on a set percentage benchmark. You do not need to maintain complex books of accounts (under Section 44AA) or undergo audit (under Section 44AB).")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-gray-900 rounded-lg border border-slate-100 dark:border-gray-800">
                <span className="font-extrabold text-blue-600 block text-[10px] uppercase tracking-wider">Sec 44AD: Business</span>
                <span className="block mt-1 font-medium">{t("Allowed for turnover up to ₹2 Crore (or ₹3 Crore if digital receipts >95%). Reports 6% for digital & 8% for cash receipts.")}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-gray-900 rounded-lg border border-slate-100 dark:border-gray-800">
                <span className="font-extrabold text-indigo-600 block text-[10px] uppercase tracking-wider">Sec 44ADA: Professionals</span>
                <span className="block mt-1 font-medium">{t("Allowed for receipts up to ₹50 Lakhs (or ₹75 Lakhs if digital receipts >95%). Reports 50% flat as presumptive profit.")}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-gray-900 rounded-lg border border-slate-100 dark:border-gray-800">
                <span className="font-extrabold text-emerald-600 block text-[10px] uppercase tracking-wider">Sec 44AE: Transport operators</span>
                <span className="block mt-1 font-medium">{t("Allowed for carriage operators owning up to 10 cargo vehicles at any time. Standard rates per truck month model.")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selector Tabs */}
      <div 
        className="flex flex-nowrap overflow-x-auto custom-scrollbar bg-slate-100 dark:bg-gray-900 p-1 rounded-lg border border-slate-100 dark:border-gray-800 w-full max-w-full whitespace-nowrap scroll-smooth select-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <button
          onClick={() => setActiveSection('44ad')}
          className={`flex-shrink-0 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
            activeSection === '44ad'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400'
              : 'text-gray-400 hover:text-gray-650 dark:text-gray-500'
          }`}
        >
          {t("Section 44AD (Retailers & Traders)")}
        </button>
        <button
          onClick={() => setActiveSection('44ada')}
          className={`flex-shrink-0 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
            activeSection === '44ada'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400'
              : 'text-gray-400 hover:text-gray-650 dark:text-gray-500'
          }`}
        >
          {t("Section 44ADA (Designers & consults)")}
        </button>
        <button
          onClick={() => setActiveSection('44ae')}
          className={`flex-shrink-0 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
            activeSection === '44ae'
              ? 'bg-white text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400'
              : 'text-gray-400 hover:text-gray-650 dark:text-gray-500'
          }`}
        >
          {t("Section 44AE (Carriage Fleets)")}
        </button>
      </div>

      {/* Main calculation workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Parameters Box */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-gray-700">
            <Calculator className="text-gray-400" size={16} />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-200">
              {activeSection === '44ad' && t("Turnover Breakdown & Receivables")}
              {activeSection === '44ada' && t("Professional Gross Receipts")}
              {activeSection === '44ae' && t("Fleets & Cargo Vehicles Registry")}
            </span>
          </div>

          {activeSection === '44ad' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-wider text-gray-400 dark:text-gray-500">{t("Gross Turnover via Banking/UPI/NEFT (₹)")}</label>
                  <input
                    type="number"
                    value={turnoverDigital}
                    onChange={(e) => setTurnoverDigital(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">{t("Statutory benchmark presumptive tax rate: 6%")}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-wider text-gray-400 dark:text-gray-500">{t("Gross Turnover via Cash/Unregulated (₹)")}</label>
                  <input
                    type="number"
                    value={turnoverCash}
                    onChange={(e) => setTurnoverCash(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">{t("Statutory benchmark presumptive tax rate: 8%")}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-gray-400 dark:text-gray-500">{t("Option: Custom Claim Profit Rate (%) (Leave 0 to use minimum statutory rate)")}</label>
                <input
                  type="number"
                  value={customProfitRate}
                  onChange={(e) => setCustomProfitRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeSection === '44ada' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-gray-400 dark:text-gray-500">{t("Gross Receipts from Professional Services (₹)")}</label>
                <input
                  type="number"
                  value={receiptsProfessional}
                  onChange={(e) => setReceiptsProfessional(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white"
                />
                <p className="text-[9px] text-gray-400 mt-1">{t("Statutory minimum presumptive profit benchmark: 50% of receipts")}</p>
              </div>
            </div>
          )}

          {activeSection === '44ae' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-slate-50 dark:bg-gray-900 border rounded-lg border-slate-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-3">{t("Heavy Goods Carriage Vehicles")}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-gray-550">{t("Count of Heavy Trucks (Capacity >12 Tons)")}</label>
                      <input
                        type="number"
                        value={heavyVehiclesCount}
                        onChange={(e) => setHeavyVehiclesCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full text-xs font-mono mt-1 px-2.5 py-1.5 border rounded-md dark:bg-gray-950 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-gray-550">{t("Total Active Operating Months in Year")}</label>
                      <input
                        type="number"
                        max="12"
                        value={heavyVehiclesMonths}
                        onChange={(e) => setHeavyVehiclesMonths(Math.min(12, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full text-xs font-mono mt-1 px-2.5 py-1.5 border rounded-md dark:bg-gray-950 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-3">{t("Lighter/Medium Goods carriages")}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-gray-550">{t("Count of Lighter Trucks (Capacity <=12 Tons)")}</label>
                      <input
                        type="number"
                        value={lightVehiclesCount}
                        onChange={(e) => setLightVehiclesCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full text-xs font-mono mt-1 px-2.5 py-1.5 border rounded-md dark:bg-gray-950 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-gray-550">{t("Total Active Operating Months in Year")}</label>
                      <input
                        type="number"
                        max="12"
                        value={lightVehiclesMonths}
                        onChange={(e) => setLightVehiclesMonths(Math.min(12, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full text-xs font-mono mt-1 px-2.5 py-1.5 border rounded-md dark:bg-gray-950 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Notice */}
          <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2.5 dark:bg-amber-950/20 dark:border-amber-900/50">
            <ShieldAlert className="text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" size={15} />
            <div className="text-[10px] text-amber-800 dark:text-amber-350 leading-normal">
              <strong>{t("Presumptive Audit Threshold Warning:")}</strong>{' '}
              {activeSection === '44ad' && t("If presumptive business profit declared is below 6% (or 8%), or turnover exceeds ₹3 Crore, maintaining regular audited books under GST & Income Tax is legally mandatory.")}
              {activeSection === '44ada' && t("If premium presumptive digital profit declared is below 50% of the gross professional receipts, accounts must be audited under Sec 44AB by a certified Chartered Accountant.")}
              {activeSection === '44ae' && t("Owning more than 10 carriage trucks at any time during the fiscal year eliminates eligibility for the Section 44AE scheme.")}
            </div>
          </div>
        </div>

        {/* Output Metrics Side panel */}
        <div className="bg-slate-50 rounded-xl border border-slate-250 p-6 dark:bg-gray-900 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-gray-500">{t("Compliance Estimator")}</span>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-gray-200 mt-1 uppercase tracking-wider mb-4">{t("Summary Results")}</h3>

            <div className="space-y-4">
              {activeSection === '44ad' && (
                <>
                  <div className="border-b border-dashed border-slate-200 pb-3 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Gross Declared Turnover")}</span>
                    <p className="text-lg font-black font-mono text-gray-850 dark:text-white mt-1">
                      ₹{formatNumber(turnoverDigital + turnoverCash)}
                    </p>
                  </div>
                  <div className="border-b border-dashed border-slate-200 pb-3 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Statutory 44AD Minimum Profit")}</span>
                    <p className="text-sm font-black font-mono text-gray-850 dark:text-white mt-1">
                      ₹{formatNumber(minStatutoryProfit44AD)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Chosen Presumptive Profit claim")}</span>
                    <p className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                      ₹{formatNumber(chosenProfit44AD)}
                    </p>
                  </div>
                </>
              )}

              {activeSection === '44ada' && (
                <>
                  <div className="border-b border-dashed border-slate-200 pb-3 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Professional Receipts")}</span>
                    <p className="text-lg font-black font-mono text-gray-850 dark:text-white mt-1">
                      ₹{formatNumber(receiptsProfessional)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Statutory Minimum flat 50% Profit")}</span>
                    <p className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                      ₹{formatNumber(minStatutoryProfit44ADA)}
                    </p>
                  </div>
                </>
              )}

              {activeSection === '44ae' && (
                <>
                  <div className="border-b border-dashed border-slate-200 pb-3 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Heavy Goods Presumptive Income")}</span>
                    <p className="text-sm font-black font-mono text-gray-850 dark:text-white mt-1">
                      ₹{formatNumber(heavyProfit)}
                    </p>
                  </div>
                  <div className="border-b border-dashed border-slate-200 pb-3 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Other Carriage Vehicle Presumptive Income")}</span>
                    <p className="text-sm font-black font-mono text-gray-850 dark:text-white mt-1">
                      ₹{formatNumber(lightProfit)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">{t("Total Presumptive Profits (Sec 44AE)")}</span>
                    <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                      ₹{formatNumber(totalProfit44AE)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-gray-850 space-y-3">
            <button 
              onClick={() => alert(t("Presumptive calculation settings exported to system profile."))}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer"
            >
              <Check size={14} />
              {t("Adopt Selected Regime Figures")}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
