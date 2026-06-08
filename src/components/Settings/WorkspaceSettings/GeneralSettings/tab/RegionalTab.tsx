import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";

interface RegionalTabProps {
  language: string;
  setLanguage: (val: string) => void;
  dateFormat: string;
  setDateFormat: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  weekStartsOn: string;
  setWeekStartsOn: (val: string) => void;
  showLanguage: boolean;
  showDateFormat: boolean;
  showTimezone: boolean;
  showWeekStartsOn: boolean;
}

export const RegionalTab: React.FC<RegionalTabProps> = ({
  language, setLanguage,
  dateFormat, setDateFormat,
  timezone, setTimezone,
  weekStartsOn, setWeekStartsOn,
  showLanguage, showDateFormat, showTimezone, showWeekStartsOn
}) => {
  const { t } = useLanguage();

  return (
    <>
      {showLanguage && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Display Language")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="en">{t("English")}</option>
                <option value="hi">{t("Hindi")}</option>
                <option value="hinglish">{t("Hinglish")}</option>
            </select>
        </div>
      )}

      {showDateFormat && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Date Format")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
            >
                <option value="DD/MM/YYYY">{t("DD/MM/YYYY")}</option>
                <option value="MM/DD/YYYY">{t("MM/DD/YYYY")}</option>
                <option value="YYYY-MM-DD">{t("YYYY-MM-DD")}</option>
            </select>
        </div>
      )}

      {showTimezone && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Default Timezone")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
            >
                <option value="Asia/Kolkata">{t("Asia/Kolkata (IST)")}</option>
                <option value="UTC">{t("UTC / GMT")}</option>
                <option value="America/New_York">{t("America/New_York")}</option>
                <option value="Europe/London">{t("Europe/London")}</option>
            </select>
        </div>
      )}

      {showWeekStartsOn && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Start Week On")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-[11px] font-bold text-gray-850 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={weekStartsOn}
                onChange={(e) => setWeekStartsOn(e.target.value)}
            >
                <option value="sunday">{t("Sunday")}</option>
                <option value="monday">{t("Monday")}</option>
            </select>
        </div>
      )}
    </>
  );
};
