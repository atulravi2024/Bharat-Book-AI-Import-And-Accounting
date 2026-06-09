import React from 'react';
import { useLanguage } from "../../../../context/LanguageContext";

interface DataConsentTabProps {
  anonymousReporting: boolean;
  setAnonymousReporting: (val: boolean) => void;
  thirdPartyConsent: boolean;
  setThirdPartyConsent: (val: boolean) => void;
  aiModelIngestion: boolean;
  setAiModelIngestion: (val: boolean) => void;
  piiScrubbingLevel: string;
  setPiiScrubbingLevel: (val: string) => void;
  onRequestExport: () => void;

  showAnonymousReporting: boolean;
  showThirdPartyConsent: boolean;
  showAiModelIngestion: boolean;
  showPiiScrubbingLevel: boolean;
  showExportEnterprise: boolean;
}

export const DataConsentTab: React.FC<DataConsentTabProps> = ({
  anonymousReporting, setAnonymousReporting,
  thirdPartyConsent, setThirdPartyConsent,
  aiModelIngestion, setAiModelIngestion,
  piiScrubbingLevel, setPiiScrubbingLevel,
  onRequestExport,

  showAnonymousReporting,
  showThirdPartyConsent,
  showAiModelIngestion,
  showPiiScrubbingLevel,
  showExportEnterprise
}) => {
  const { t } = useLanguage();

  return (
    <>
      {showAnonymousReporting && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Anonymous usage reporting")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Anonymous Reporting")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Help improve the AI models by securely sharing purely structure-level extraction logic (no PII or custom data).")}
            </p>
          </div>
          <div 
            onClick={() => setAnonymousReporting(!anonymousReporting)} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0 ${anonymousReporting ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-750'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${anonymousReporting ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      )}

      {showThirdPartyConsent && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Third-Party Data Sharing")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("Third-Party Processing Consent")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Allow structural financial extracts to be temporarily routed through external regional providers for enhanced bank statement matching.")}
            </p>
          </div>
          <div 
            onClick={() => setThirdPartyConsent(!thirdPartyConsent)} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0 ${thirdPartyConsent ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-750'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${thirdPartyConsent ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      )}

      {showAiModelIngestion && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Model Fine-Tuning")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("AI Model Ingestion Consent")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Permit background reinforcement models to utilize corrected narration mappings solely for training localized translation weights.")}
            </p>
          </div>
          <div 
            onClick={() => setAiModelIngestion(!aiModelIngestion)} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0 ${aiModelIngestion ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-750'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${aiModelIngestion ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      )}

      {showPiiScrubbingLevel && (
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Data Scrubbing Mode")}</h4>
            <p className="text-xs text-gray-800 dark:text-gray-100 font-bold">{t("PII/Anonymization Scrubbing Levels")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-1 normal-case leading-normal">
              {t("Select depth profile for scrubbing Personally Identifiable Information (such as names, phone numbers) before cloud processing.")}
            </p>
          </div>
          <select 
            className="w-full md:w-56 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer shadow-sm shrink-0"
            value={piiScrubbingLevel}
            onChange={(e) => setPiiScrubbingLevel(e.target.value)}
          >
            <option value="Standard">{t("Standard Anonymization")}</option>
            <option value="High">{t("Highly Confidential (Strict)")}</option>
            <option value="Zero">{t("Military-grade Zero-Retention")}</option>
          </select>
        </div>
      )}

      {showExportEnterprise && (
        <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="max-w-xl">
            <h4 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t("Export Enterprise Data")}</h4>
            <p className="text-xs text-gray-500 font-bold dark:text-gray-400 leading-normal mb-1">{t("Download all your records in standard JSON/CSV format.")}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">
              {t("Ready for offline archiving or manual backups.")}
            </p>
          </div>
          <button 
            onClick={onRequestExport}
            className="px-5 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-all shadow-sm active:scale-95 shrink-0"
          >
            {t("Request Export")}
          </button>
        </div>
      )}
    </>
  );
};
