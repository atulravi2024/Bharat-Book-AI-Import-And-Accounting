import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { INTERNAL_GEMINI_MODELS } from "../../../../../services/AIConfig";
import { AIToolsIcon } from "../../../../icons/IconComponents";

interface GoogleGeminiTabProps {
    aiSettings: any;
    setAiSettings: (settings: any) => void;
    showProviderService: boolean;
    showSystemModel: boolean;
    showChatbotModel: boolean;
    showBankingModel: boolean;
    showAuditModel: boolean;
    showVoucherModel: boolean;
}

export const GoogleGeminiTab: React.FC<GoogleGeminiTabProps> = ({
    aiSettings, setAiSettings,
    showProviderService,
    showSystemModel, showChatbotModel, showBankingModel, showAuditModel, showVoucherModel
}) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                    <AIToolsIcon className="!text-[18px] flex items-center justify-center" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Google Gemini Configuration")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Built-in Model Slots")}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {showProviderService && (
                    <div className="form-field-wrapper space-y-2 md:col-span-2 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Provider Service")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-905 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-default"
                            value="google"
                            disabled
                        >
                            <option value="google">{t("Google Gemini")}</option>
                        </select>
                    </div>
                )}
                {showSystemModel && (
                    <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Select Model (System Tasks)")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.internalModel}
                            onChange={(e) => setAiSettings({...aiSettings, internalModel: e.target.value})}
                        >
                            {INTERNAL_GEMINI_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Internal models are optimized for system parsing.")}</p>
                    </div>
                )}
                {showChatbotModel && (
                    <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="flex items-center justify-between form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            <span>{t("Chatbot Model")}</span>
                            <a 
                              href="https://ai.google.dev/gemini-api/docs/models/gemini" 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] underline lowercase"
                            >
                              {t("supported models")}
                            </a>
                        </label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.chatModel || 'gemini-2.5-flash'}
                            onChange={(e) => setAiSettings({...aiSettings, chatModel: e.target.value})}
                        >
                            {INTERNAL_GEMINI_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* This model powers the support chatbot.")}</p>
                    </div>
                )}
                {showBankingModel && (
                    <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Banking Import Model")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.bankingModel || 'gemini-2.5-flash'}
                            onChange={(e) => setAiSettings({...aiSettings, bankingModel: e.target.value})}
                        >
                            {INTERNAL_GEMINI_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Used specifically for parsing and sorting bank statements.")}</p>
                    </div>
                )}
                {showAuditModel && (
                    <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Audit Import Model")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.auditModel || 'gemini-2.5-flash'}
                            onChange={(e) => setAiSettings({...aiSettings, auditModel: e.target.value})}
                        >
                            {INTERNAL_GEMINI_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Performs systematic checklist checks, compliance audits, and tax rules mapping.")}</p>
                    </div>
                )}
                {showVoucherModel && (
                    <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Voucher Import Model")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.voucherModel || 'gemini-2.5-flash'}
                            onChange={(e) => setAiSettings({...aiSettings, voucherModel: e.target.value})}
                        >
                            {INTERNAL_GEMINI_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Secondary parsing engine mapping line items and receipts.")}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
