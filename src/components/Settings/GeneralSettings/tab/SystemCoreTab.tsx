import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

interface SystemCoreTabProps {
  displayId: string;
  setDisplayId: (val: string) => void;
  appMode: string;
  setAppMode: (val: string) => void;
  showSystemInfo: string;
  setShowSystemInfo: (val: string) => void;
  autoLock: string;
  setAutoLock: (val: string) => void;
  paginationSize: string;
  setPaginationSize: (val: string) => void;
  keyboardShortcuts: string;
  setKeyboardShortcuts: (val: string) => void;
  showDisplayId: boolean;
  showAppMode: boolean;
  showSystemInfoField: boolean;
  showAutoLock: boolean;
  showPaginationSize: boolean;
  showKeyboardShortcuts: boolean;
}

export const SystemCoreTab: React.FC<SystemCoreTabProps> = ({
  displayId, setDisplayId,
  appMode, setAppMode,
  showSystemInfo, setShowSystemInfo,
  autoLock, setAutoLock,
  paginationSize, setPaginationSize,
  keyboardShortcuts, setKeyboardShortcuts,
  showDisplayId, showAppMode, showSystemInfoField, showAutoLock, showPaginationSize, showKeyboardShortcuts
}) => {
  const { t } = useLanguage();

  return (
    <>
      {showDisplayId && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Display ID Prefix")}</label>
            <input 
                type="text" 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all" 
                value={displayId}
                onChange={(e) => setDisplayId(e.target.value)}
            />
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2">{t("e.g. BBE-JV-001")}</p>
        </div>
      )}

      {showAppMode && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Application Mode")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={appMode}
                onChange={(e) => setAppMode(e.target.value)}
            >
                <option value="demo">{t("DEMO (Sandboxed)")}</option>
                <option value="working">{t("Production (Live)")}</option>
            </select>
        </div>
      )}

      {showSystemInfoField && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("System Info View")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={showSystemInfo}
                onChange={(e) => setShowSystemInfo(e.target.value)}
            >
                <option value="yes">{t("Show Details")}</option>
                <option value="no">{t("Hide Details")}</option>
            </select>
        </div>
      )}

      {showAutoLock && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Auto-Lock Timeout")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={autoLock}
                onChange={(e) => setAutoLock(e.target.value)}
            >
                <option value="5">{t("5 Minutes")}</option>
                <option value="15">{t("15 Minutes")}</option>
                <option value="30">{t("30 Minutes")}</option>
                <option value="60">{t("1 Hour")}</option>
                <option value="never">{t("Never")}</option>
            </select>
        </div>
      )}

      {showPaginationSize && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Pagination Size")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={paginationSize}
                onChange={(e) => setPaginationSize(e.target.value)}
            >
                <option value="10">{t("10 items")}</option>
                <option value="25">{t("25 items")}</option>
                <option value="50">{t("50 items")}</option>
                <option value="100">{t("100 items")}</option>
            </select>
        </div>
      )}

      {showKeyboardShortcuts && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Keyboard Shortcuts")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={keyboardShortcuts}
                onChange={(e) => setKeyboardShortcuts(e.target.value)}
            >
                <option value="enabled">{t("Enabled")}</option>
                <option value="disabled">{t("Disabled")}</option>
            </select>
        </div>
      )}
    </>
  );
};
