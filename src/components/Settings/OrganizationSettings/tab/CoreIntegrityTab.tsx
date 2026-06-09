import React from 'react';
import { useLanguage } from "../../../../context/LanguageContext";

interface CoreIntegrityTabProps {
  retentionPeriod: string;
  setRetentionPeriod: (val: string) => void;
  gdprCompliance: boolean;
  setGdprCompliance: (val: boolean) => void;
  doubleEncrypt: boolean;
  setDoubleEncrypt: (val: boolean) => void;
  sessionClearance: string;
  setSessionClearance: (val: string) => void;
  strictIpVerification: boolean;
  setStrictIpVerification: (val: boolean) => void;

  showRetention: boolean;
  showGdprCompliance: boolean;
  showDoubleEncrypt: boolean;
  showSessionClearance: boolean;
  showStrictIpVerification: boolean;
}

export const CoreIntegrityTab: React.FC<CoreIntegrityTabProps> = ({
  retentionPeriod, setRetentionPeriod,
  gdprCompliance, setGdprCompliance,
  doubleEncrypt, setDoubleEncrypt,
  sessionClearance, setSessionClearance,
  strictIpVerification, setStrictIpVerification,

  showRetention,
  showGdprCompliance,
  showDoubleEncrypt,
  showSessionClearance,
  showStrictIpVerification
}) => {
  const { t } = useLanguage();

  return (
    <>
      {showRetention && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Keep audit logs for")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Retention Period")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Duration to retain history of who uploaded maps and when AI changed its classification confidence.")}
            </p>
          </div>
          <select 
            className="w-full md:w-56 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer shadow-sm shrink-0"
            value={retentionPeriod}
            onChange={(e) => setRetentionPeriod(e.target.value)}
          >
            <option value="1 Year">{t("1 Year")}</option>
            <option value="3 Years">{t("3 Years")}</option>
            <option value="7 Years (Statutory)">7 Years (Statutory)</option>
            <option value="10 Years (Extended)">10 Years (Extended)</option>
            <option value="Permanent">{t("Permanent")}</option>
          </select>
        </div>
      )}

      {showGdprCompliance && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Core GDPR Rules")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Strict Privacy Integrity Mode")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Enforce strict end-to-end audit requirements to align with European GDPR privacy governance guidelines.")}
            </p>
          </div>
          <div 
            onClick={() => setGdprCompliance(!gdprCompliance)} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0 ${gdprCompliance ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-750'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${gdprCompliance ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      )}

      {showDoubleEncrypt && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Advanced Encryption")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Double Encrypt Backup Records")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Applies secondary high-entropy cryptographic keys over saved configuration models in local storage.")}
            </p>
          </div>
          <div 
            onClick={() => setDoubleEncrypt(!doubleEncrypt)} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0 ${doubleEncrypt ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-750'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${doubleEncrypt ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      )}

      {showSessionClearance && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Session Security")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Automated Session Clearance")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Specify intervals for purging temporary session caches and closing background ledger channels automatically.")}
            </p>
          </div>
          <select 
            className="w-full md:w-56 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer shadow-sm shrink-0"
            value={sessionClearance}
            onChange={(e) => setSessionClearance(e.target.value)}
          >
            <option value="1 Hour">{t("1 Hour")}</option>
            <option value="4 Hours">{t("4 Hours")}</option>
            <option value="12 Hours">{t("12 Hours")}</option>
            <option value="Never">{t("Never")}</option>
          </select>
        </div>
      )}

      {showStrictIpVerification && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Network Restriction")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Strict IP Routing Audit")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Requires strict client-side host and IP routing validation before syncing secure offline ledger keys.")}
            </p>
          </div>
          <div 
            onClick={() => setStrictIpVerification(!strictIpVerification)} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0 ${strictIpVerification ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-750'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${strictIpVerification ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      )}
    </>
  );
};
