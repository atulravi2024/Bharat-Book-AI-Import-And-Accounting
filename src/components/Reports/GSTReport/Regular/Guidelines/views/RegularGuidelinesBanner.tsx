import React from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';

interface RegularGuidelinesBannerProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export const RegularGuidelinesBanner: React.FC<RegularGuidelinesBannerProps> = ({ isCollapsed, onToggle }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs dark:bg-gray-800 dark:border-gray-800 space-y-2 relative overflow-hidden transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950/40 dark:text-indigo-400">
                        {t("Normal Taxpayer Guidelines")}
                    </span>
                    <h3 className="text-xl font-bold text-gray-850 dark:text-gray-100 mt-1">
                        {t("Regular Statutory Guidelines Desk")}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onToggle}
                    className="self-start sm:self-center px-2.5 py-1 text-[10px] font-extrabold text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-750 dark:hover:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md transition-colors flex items-center gap-1.5"
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${isCollapsed ? 'bg-indigo-600' : 'bg-emerald-500'}`}></span>
                    {isCollapsed ? t("Show Guidelines Intro") : t("Collapse Info")}
                </button>
            </div>
            {!isCollapsed && (
                <p className="text-xs text-gray-500 pt-2 border-t border-gray-50 dark:border-gray-750 animate-fadeIn font-normal">
                    {t("Explore regular returns, input tax credit eligibility limits, invoice parameters like e-invoicing limits, mandatory registration limits, and reverse charge instructions.")}
                </p>
            )}
        </div>
    );
};
