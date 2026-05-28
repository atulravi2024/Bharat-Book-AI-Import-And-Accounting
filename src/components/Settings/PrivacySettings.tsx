
import React from 'react';
import { useLanguage } from "../../context/LanguageContext";
import { InfoIcon } from '../icons/IconComponents';

interface PrivacySettingsProps {
    toggles: {
        anonymousReporting: boolean;
    };
    handleToggle: (key: any) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ toggles, handleToggle }) => {
  const { t } = useLanguage();
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center dark:text-white">
                <InfoIcon className="mr-3 text-blue-600" /> {t("Privacy & Compliance")}
            </h3>
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest dark:text-white">{t("Data Retention")}</h4>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t("Keep audit logs for")}</p>
                                <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1 dark:text-gray-400">{t("Duration to retain history of who uploaded maps and when AI changed its classification confidence.")}</p>
                            </div>
                            <select className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 focus:ring-1 focus:ring-blue-100 dark:bg-gray-800 dark:border-gray-700">
                                <option>{t("1 Year")}</option>
                                <option>{t("3 Years")}</option>
                                <option>7 Years (Statutory)</option>
                                <option>10 Years (Extended)</option>
                                <option>{t("Permanent")}</option>
                            </select>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div>
                                <p className="text-xs text-gray-800 font-bold dark:text-gray-100">{t("Anonymous usage reporting")}</p>
                                <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1 dark:text-gray-400">{t("Help improve the AI models by securely sharing purely structure-level extraction logic (no PII or custom data).")}</p>
                            </div>
                            <div onClick={() => handleToggle('anonymousReporting')} className={`${toggles.anonymousReporting ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all`}>
                                <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${toggles.anonymousReporting ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between dark:bg-gray-900 dark:border-gray-800">
                    <div>
                        <p className="font-bold text-gray-900 text-sm dark:text-white">{t("Export Enterprise Data")}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">{t("Download all your records in standard JSON/CSV format.")}</p>
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">{t("Request Export")}</button>
                </div>
            </div>
        </div>
    );
};
