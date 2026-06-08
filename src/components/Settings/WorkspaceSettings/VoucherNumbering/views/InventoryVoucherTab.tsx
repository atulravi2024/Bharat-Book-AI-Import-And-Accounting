import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VoucherSetting } from "../types";

interface InventoryVoucherTabProps {
    settings: Record<string, VoucherSetting>;
    collapsedStates: Record<string, boolean>;
    handleSettingChange: (type: string, field: string, value: any) => void;
    toggleCollapse: (id: string, e: React.MouseEvent) => void;
    searchTerm?: string;
}

export const InventoryVoucherTab: React.FC<InventoryVoucherTabProps> = ({
    settings,
    collapsedStates,
    handleSettingChange,
    toggleCollapse,
    searchTerm = ""
}) => {
    const { t } = useLanguage();

    const voucherTypes = [
        { id: 'stock_journal', label: t('Stock Journal') },
        { id: 'transfer', label: t('Material Transfer') },
        { id: 'physical_stock', label: t('Physical Stock') },
        { id: 'consumption', label: t('Item Consumption') },
        { id: 'scrap', label: t('Item Scrap') },
        { id: 'rejections_in', label: t('Rejections In') },
        { id: 'rejections_out', label: t('Rejections Out') },
    ];

    const resetPatterns = [
        { id: 'never', label: 'Never' },
        { id: 'daily', label: 'Daily' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' }
    ];

    const filteredVouchers = voucherTypes.filter(type => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const labelMatch = type.label.toLowerCase().includes(term);
        const idMatch = type.id.toLowerCase().includes(term);
        const currentSettings = settings[type.id];
        const prefixMatch = currentSettings?.prefix?.toLowerCase().includes(term) || false;
        const suffixMatch = currentSettings?.suffix?.toLowerCase().includes(term) || false;
        return labelMatch || idMatch || prefixMatch || suffixMatch;
    });

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col">
                {filteredVouchers.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-gray-450 dark:text-gray-500 font-medium text-xs">
                        {t("No voucher types match your search.")}
                    </div>
                ) : (
                    filteredVouchers.map((type, idx) => {
                        const currentSettings = settings[type.id] || {
                            prefix: '',
                            suffix: '',
                            startAt: 1,
                            resetPattern: 'yearly',
                            autoGenerate: true,
                            padding: 3
                        };
                        const isCollapsed = searchTerm ? false : (collapsedStates[type.id] !== false); // collapsed by default

                    return (
                        <div 
                            key={type.id} 
                            className="bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0 dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:border-gray-800"
                        >
                            <div 
                                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer"
                                onClick={(e) => toggleCollapse(type.id, e)}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-400 hover:text-purple-600 transition-colors">
                                        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-800 tracking-wide dark:text-gray-100">{type.label}</h4>
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center space-x-2 cursor-pointer z-10" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-xs font-bold text-gray-500 tracking-wider mr-2 dark:text-gray-400">{t("Auto Generate")}</span>
                                        <input 
                                            type="checkbox" 
                                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            checked={currentSettings.autoGenerate}
                                            onChange={(e) => handleSettingChange(type.id, 'autoGenerate', e.target.checked)}
                                        />
                                    </label>
                                </div>
                            </div>
                            
                            {!isCollapsed && (
                                <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/50 dark:bg-gray-950 dark:border-gray-800/80">
                                        {currentSettings.autoGenerate ? (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t("Prefix")}</label>
                                                        <input 
                                                            type="text" 
                                                            value={currentSettings.prefix || ''}
                                                            onChange={(e) => handleSettingChange(type.id, 'prefix', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
                                                            placeholder="e.g. SJ/"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t("Starting No.")}</label>
                                                        <input 
                                                            type="number" 
                                                            value={currentSettings.startAt || 1}
                                                            onChange={(e) => handleSettingChange(type.id, 'startAt', parseInt(e.target.value) || 1)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
                                                            placeholder="1"
                                                            min="1"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t("Zero Padding")}</label>
                                                        <input 
                                                            type="number" 
                                                            value={currentSettings.padding !== undefined ? currentSettings.padding : 3}
                                                            onChange={(e) => handleSettingChange(type.id, 'padding', parseInt(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
                                                            placeholder="3"
                                                            min="0"
                                                            max="10"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t("Suffix")}</label>
                                                        <input 
                                                            type="text" 
                                                            value={currentSettings.suffix || ''}
                                                            onChange={(e) => handleSettingChange(type.id, 'suffix', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
                                                            placeholder="e.g. /23-24"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">{t("Restart")}</label>
                                                        <select 
                                                            value={currentSettings.resetPattern || 'yearly'}
                                                            onChange={(e) => handleSettingChange(type.id, 'resetPattern', e.target.value)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
                                                        >
                                                            {resetPatterns.map(pattern => (
                                                                <option key={pattern.id} value={pattern.id}>{t(pattern.label)}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50/50 to-purple-100/10 dark:from-purple-900/10 dark:to-transparent border border-purple-100/50 dark:border-purple-900/30 rounded-xl flex items-center justify-between shadow-xs">
                                                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-hidden">
                                                        <span className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded dark:bg-purple-950 dark:text-purple-400 shrink-0">{t("Preview")}</span>
                                                        <div className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wider truncate w-full text-center sm:text-left">
                                                            <span className="text-gray-400 dark:text-gray-500">{currentSettings.prefix}</span>
                                                            <span className="text-purple-600 dark:text-purple-400 font-extrabold">{String(currentSettings.startAt || 1).padStart(currentSettings.padding !== undefined ? currentSettings.padding : 3, '0')}</span>
                                                            <span className="text-gray-400 dark:text-gray-500">{currentSettings.suffix}</span>
                                                        </div>
                                                    </div>
                                                    <span className="hidden sm:block text-[8px] text-gray-400 uppercase tracking-widest font-black whitespace-nowrap pl-2">{t("Auto-generated")}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center py-6 text-gray-400 font-medium text-xs">
                                                {t("Manual numbering is enabled. Turn on Auto Generate to configure numbering patterns.")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
            </div>
        </div>
    );
};
