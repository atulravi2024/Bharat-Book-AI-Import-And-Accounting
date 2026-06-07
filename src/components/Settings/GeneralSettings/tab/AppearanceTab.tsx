import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

interface AppearanceTabProps {
  theme: string;
  setTheme: (val: string) => void;
  density: string;
  setDensity: (val: string) => void;
  animations: string;
  setAnimations: (val: string) => void;
  soundEffects: string;
  setSoundEffects: (val: string) => void;
  showTheme: boolean;
  showDensity: boolean;
  showAnimations: boolean;
  showSoundEffects: boolean;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({
  theme, setTheme,
  density, setDensity,
  animations, setAnimations,
  soundEffects, setSoundEffects,
  showTheme, showDensity, showAnimations, showSoundEffects
}) => {
  const { t } = useLanguage();

  return (
    <>
      {showTheme && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Theme Mode")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
            >
                <option value="system">{t("System Default")}</option>
                <option value="light">{t("Light Mode")}</option>
                <option value="dark">{t("Dark Mode")}</option>
            </select>
        </div>
      )}

      {showDensity && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Display Density")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
            >
                <option value="compact">{t("Compact (More Data)")}</option>
                <option value="standard">{t("Standard (Default)")}</option>
                <option value="comfortable">{t("Comfortable (Spacious)")}</option>
            </select>
            <p className="text-[9px] text-gray-505 font-bold uppercase tracking-widest mt-2">{t("Controls spacing across tables.")}</p>
        </div>
      )}

      {showAnimations && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("UI Animations")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={animations}
                onChange={(e) => setAnimations(e.target.value)}
            >
                <option value="enabled">{t("Enabled (Smooth)")}</option>
                <option value="disabled">{t("Disabled (Fast)")}</option>
            </select>
        </div>
      )}

      {showSoundEffects && (
        <div className="form-field-wrapper">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 block">{t("Sound Effects")}</label>
            <select 
                className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all cursor-pointer"
                value={soundEffects}
                onChange={(e) => setSoundEffects(e.target.value)}
            >
                <option value="enabled">{t("Enabled")}</option>
                <option value="disabled">{t("Disabled (Muted)")}</option>
            </select>
        </div>
      )}
    </>
  );
};
