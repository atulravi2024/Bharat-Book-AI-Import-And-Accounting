import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Calculator, Sparkles, Trash2, Info, CheckCircle, Clock, ChevronUp, ChevronDown } from 'lucide-react';

export type CalcType = 'TDS' | 'TCS';

export interface TdsLiabilityResult {
  base: number;
  rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface TcsLiabilityResult {
  gross: number;
  returned: number;
  net: number;
  rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

interface PostLogEntry {
  id: string;
  timestamp: string;
  type: 'TDS' | 'TCS';
  gross: number;
  net: number;
  liability: number;
  details: string;
}

export const TdsTcsCalculator: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const [calcType, setCalcType] = useState<CalcType>('TDS');
  const [logsOpen, setLogsOpen] = useState(true);

  // TDS Inputs
  const [tdsBase, setTdsBase] = useState('1500000');
  const [tdsType, setTdsType] = useState<'intra' | 'inter'>('intra');
  const [tdsAuthority, setTdsAuthority] = useState('Government Dept');

  // TCS Inputs
  const [tcsGross, setTcsGross] = useState('2800000');
  const [tcsReturns, setTcsReturns] = useState('300000');
  const [tcsType, setTcsType] = useState<'intra' | 'inter'>('intra');

  // Dynamic feedback status
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Logs state
  const [calcLogs, setCalcLogs] = useState<PostLogEntry[]>([
    {
      id: "LOG-01",
      timestamp: "12:04 PM",
      type: "TDS",
      gross: 1500000,
      net: 1500000,
      liability: 30000,
      details: "Central / State Government Department | Intra-State (1% CGST + 1% SGST)"
    }
  ]);

  const calculatedTds = (): TdsLiabilityResult => {
    const baseVal = Number(tdsBase) || 0;
    const tdsRate = 0.02; // 2% fixed
    const totalDeduction = Math.round(baseVal * tdsRate);

    if (tdsType === 'intra') {
      return {
        base: baseVal,
        rate: 2,
        cgst: Math.round(totalDeduction / 2),
        sgst: Math.round(totalDeduction / 2),
        igst: 0,
        total: totalDeduction
      };
    } else {
      return {
        base: baseVal,
        rate: 2,
        cgst: 0,
        sgst: 0,
        igst: totalDeduction,
        total: totalDeduction
      };
    }
  };

  const calculatedTcs = (): TcsLiabilityResult => {
    const grossVal = Number(tcsGross) || 0;
    const returnVal = Number(tcsReturns) || 0;
    const netVal = Math.max(0, grossVal - returnVal);
    const tcsRate = 0.01; // 1% net
    const totalCollection = Math.round(netVal * tcsRate);

    if (tcsType === 'intra') {
      return {
        gross: grossVal,
        returned: returnVal,
        net: netVal,
        rate: 1,
        cgst: Math.round(totalCollection / 2),
        sgst: Math.round(totalCollection / 2),
        igst: 0,
        total: totalCollection
      };
    } else {
      return {
        gross: grossVal,
        returned: returnVal,
        net: netVal,
        rate: 1,
        cgst: 0,
        sgst: 0,
        igst: totalCollection,
        total: totalCollection
      };
    }
  };

  const handlePostCalcToLog = () => {
    let newEntry: PostLogEntry;
    const todayStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (calcType === 'TDS') {
      const res = calculatedTds();
      let authDetail = "Govt Agency";
      if (tdsAuthority === 'Government PSU') authDetail = "Public Sector PSU";
      if (tdsAuthority === 'Local Authority') authDetail = "Local Body/Municipality";
      if (tdsAuthority === 'Government Aided Society') authDetail = "Govt Society";

      newEntry = {
        id: `TDS-${Date.now().toString().slice(-4)}`,
        timestamp: todayStr,
        type: 'TDS',
        gross: res.base,
        net: res.base,
        liability: res.total,
        details: `${authDetail} | ${tdsType === 'intra' ? t('Intra-State (1% CGST + 1% SGST)') : t('Inter-State (2% IGST)')}`
      };
    } else {
      const res = calculatedTcs();
      newEntry = {
        id: `TCS-${Date.now().toString().slice(-4)}`,
        timestamp: todayStr,
        type: 'TCS',
        gross: res.gross,
        net: res.net,
        liability: res.total,
        details: `E-Comm Marketplace | ${tcsType === 'intra' ? t('Intra-State (0.5% + 0.5%)') : t('Inter-State (1% IGST)')}`
      };
    }

    setCalcLogs([newEntry, ...calcLogs]);
    setStatusMessage(t("Calculation result successfully logged into dynamic workspace history log!"));
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const deleteLog = (id: string) => {
    setCalcLogs(calcLogs.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic inline notification instead of native popup */}
      {statusMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-850 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs">
          <CheckCircle size={16} className="text-emerald-550 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Calculator Body Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm">
              {calcType === 'TDS' ? t("GST TDS (Section 51) Estimator") : t("GST TCS (Section 52) Operator Estimator")}
            </h3>
          </div>
          <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setCalcType('TDS')}
              className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${calcType === 'TDS' ? 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {t("TDS (Sec 51) Deductions")}
            </button>
            <button
              type="button"
              onClick={() => setCalcType('TCS')}
              className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${calcType === 'TCS' ? 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {t("TCS (Sec 52) Marketplace")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Inputs Column */}
          <div className="space-y-4">
            {calcType === 'TDS' ? (
              <>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-455 tracking-wider">{t("Supply Contract Base Value (₹)")}</label>
                  <input
                    type="number"
                    value={tdsBase}
                    onChange={(e) => setTdsBase(e.target.value)}
                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">{t("Must exceed ₹2.5 Lakhs contract threshold value u/s 51")}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-455 tracking-wider">{t("Type of Supply Jurisdiction")}</label>
                  <select
                    value={tdsType}
                    onChange={(e) => setTdsType(e.target.value as any)}
                    className="w-full text-xs font-bold mt-1 px-3 py-2.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 animate-fadeIn border-slate-200"
                  >
                    <option value="intra">{t("Intra-State Supply (CGST 1% + SGST 1%)")}</option>
                    <option value="inter">{t("Inter-State Supply (IGST 2%)")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-455 tracking-wider">{t("Deducting Authority Nature")}</label>
                  <select
                    value={tdsAuthority}
                    onChange={(e) => setTdsAuthority(e.target.value)}
                    className="w-full text-xs mt-1 px-3 py-2.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
                  >
                    <option value="Government Dept">{t("Central / State Government Department")}</option>
                    <option value="Government PSU">{t("Public Sector Undertaking (PSU)")}</option>
                    <option value="Local Authority">{t("Municipal Corporation / Local Body")}</option>
                    <option value="Government Aided Society">{t("Society established by Govt u/s Societies Act")}</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-455 tracking-wider">{t("Gross Supplies Value sold via E-Comm (₹)")}</label>
                  <input
                    type="number"
                    value={tcsGross}
                    onChange={(e) => setTcsGross(e.target.value)}
                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-455 tracking-wider">{t("Deduct Supply Sales Returns / Credits (₹)")}</label>
                  <input
                    type="number"
                    value={tcsReturns}
                    onChange={(e) => setTcsReturns(e.target.value)}
                    className="w-full text-xs font-mono font-bold mt-1 px-3 py-2 border rounded-lg focus:border-indigo-500 outline-hidden dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-455 tracking-wider">{t("TCS Transaction State Category")}</label>
                  <select
                    value={tcsType}
                    onChange={(e) => setTcsType(e.target.value as any)}
                    className="w-full text-xs font-bold mt-1 px-3 py-2.5 border rounded-lg focus:border-indigo-500 outline-hidden bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 border-slate-200"
                  >
                    <option value="intra">{t("Intra-State Channel (CGST 0.5% + SGST 0.5%)")}</option>
                    <option value="inter">{t("Inter-State Channel (IGST 1.0%)")}</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Results Output Column */}
          <div className="bg-gray-50/50 p-5 rounded-xl border border-slate-200 dark:bg-gray-900/45 dark:border-gray-700 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 block font-sans">
                {t("Tax Liability Result Calculation")}
              </h4>
              
              <div className="space-y-2 border-b pb-4 dark:border-gray-700 font-mono">
                <div className="flex justify-between text-xs text-gray-550 dark:text-gray-400 font-sans">
                  <span>{calcType === 'TDS' ? t("Statutory TDS Rate") : t("Statutory TCS Rate")}</span>
                  <span className="font-bold text-gray-700 dark:text-white">
                    {calcType === 'TDS' ? '2.0% Fixed u/s 51' : '1.0% Net supplies u/s 52'}
                  </span>
                </div>
                {calcType === 'TCS' && (
                  <div className="flex justify-between text-xs text-gray-550 dark:text-gray-400 font-sans">
                    <span>{t("Net Taxable Turnover")}</span>
                    <span className="font-mono font-bold text-gray-850 dark:text-gray-100">
                      ₹{formatNumber(calculatedTcs().net)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-550 dark:text-gray-400">
                  <span className="font-sans text-gray-400">{t("CGST Component")}</span>
                  <span className="text-gray-800 dark:text-gray-100">
                    ₹{formatNumber(calcType === 'TDS' ? calculatedTds().cgst : calculatedTcs().cgst)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-550 dark:text-gray-400">
                  <span className="font-sans text-gray-400">{t("SGST Component")}</span>
                  <span className="text-gray-800 dark:text-gray-100">
                    ₹{formatNumber(calcType === 'TDS' ? calculatedTds().sgst : calculatedTcs().sgst)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-550 dark:text-gray-400">
                  <span className="font-sans text-gray-400">{t("IGST Component")}</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    ₹{formatNumber(calcType === 'TDS' ? calculatedTds().igst : calculatedTcs().igst)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{calcType === 'TDS' ? t("Total TDS Levy (₹)") : t("Total TCS Levy (₹)")}</span>
                <span className="text-xl font-mono font-black text-indigo-700 dark:text-indigo-400">
                  ₹{formatNumber(calcType === 'TDS' ? calculatedTds().total : calculatedTcs().total)}
                </span>
              </div>

              <div className="p-3.5 bg-indigo-50/50 rounded-lg text-[11px] text-indigo-900 leading-relaxed dark:bg-indigo-950/20 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30">
                {calcType === 'TDS' ? (
                  <p>ℹ️ <strong>{t("Compliance Limit Check:")}</strong> {t("TDS is strictly required on government client orders where base value of direct individual contract exceeds ₹2,50,000.")}</p>
                ) : (
                  <p>ℹ️ <strong>{t("Operator Rule Check:")}</strong> {t("TCS collected at 1% of net returns supplies u/s 52 must be remitted by the marketplace within 10 days of the next calendar month.")}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePostCalcToLog}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles size={14} />
              {t("Log Calculation into Dynamic Session Trace")}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic History Logs table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div 
          onClick={() => setLogsOpen(!logsOpen)}
          className="p-4 bg-gray-50 border-b border-slate-200 font-bold text-gray-700 text-[10.5px] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 uppercase tracking-widest flex justify-between items-center cursor-pointer select-none"
        >
          <span className="font-sans">{t("Active Calculator Workspace Sessions Log")}</span>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold dark:bg-indigo-900/40 dark:text-indigo-350 font-sans">
              {calcLogs.length} {t("Logged Runs")}
            </span>
            <span className="text-gray-400">
              {logsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </div>
        </div>
        
        {logsOpen && (
          <div className="animate-fadeIn">
            {calcLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-[#f8fafc]/50 text-gray-500 border-b border-slate-200 dark:bg-gray-900 dark:border-gray-700">
                    <tr className="uppercase tracking-wider text-[10px]">
                      <th className="px-5 py-3 text-center font-extrabold">{t("Reference ID")}</th>
                      <th className="px-5 py-3 font-extrabold">{t("Calculation Type")}</th>
                      <th className="px-5 py-3 text-right font-extrabold">{t("Gross Supplied Value")}</th>
                      <th className="px-5 py-3 text-right font-extrabold">{t("Net Inward / Base")}</th>
                      <th className="px-5 py-3 text-right font-extrabold">{t("Deducted Lib (Remitable)")}</th>
                      <th className="px-5 py-3 font-extrabold">{t("Configuration Properties")}</th>
                      <th className="px-5 py-3 text-center font-extrabold">{t("Timestamp")}</th>
                      <th className="px-5 py-3 text-center font-extrabold">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {calcLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/20">
                        <td className="px-5 py-3.5 text-center font-bold text-gray-500 font-mono text-[10px] bg-gray-50/50 dark:bg-gray-900/10">{log.id}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            log.type === 'TDS' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-350' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-350'
                          }`}>{log.type}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-gray-800 dark:text-gray-200">₹{formatNumber(log.gross)}</td>
                        <td className="px-5 py-3.5 text-right font-mono text-gray-500 dark:text-gray-400">₹{formatNumber(log.net)}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-extrabold text-indigo-600 dark:text-indigo-400">₹{formatNumber(log.liability)}</td>
                        <td className="px-5 py-3.5 text-gray-500 italic max-w-xs truncate dark:text-gray-400">{log.details}</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-gray-400 text-[10px] font-mono">{log.timestamp}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => deleteLog(log.id)}
                            className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition text-gray-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 italic text-xs dark:text-gray-500">{t("Workspace logs are empty. Post calculations to populate entries.")}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
