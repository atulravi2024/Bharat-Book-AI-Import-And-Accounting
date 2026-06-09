import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { EXTERNAL_PROVIDERS } from "../../../../../services/AIConfig";

interface CustomProviderTabProps {
    aiSettings: any;
    setAiSettings: (settings: any) => void;
    showProviderService: boolean;
    showApiKey: boolean;
    showBaseUrl: boolean;
    showSystemModel: boolean;
    showChatbotModel: boolean;
    showBankingModel: boolean;
    showAuditModel: boolean;
    showVoucherModel: boolean;
    ExternalModelSelectComponent: React.ComponentType<any>;
}

export const CustomProviderTab: React.FC<CustomProviderTabProps> = ({
    aiSettings, setAiSettings,
    showProviderService, showApiKey, showBaseUrl,
    showSystemModel, showChatbotModel, showBankingModel, showAuditModel, showVoucherModel,
    ExternalModelSelectComponent: ExternalModelSelect
}) => {
    const { t } = useLanguage();
    const cloudProviders = EXTERNAL_PROVIDERS.filter(p => !['ollama', 'lm_studio', 'vllm', '9router'].includes(p.id));

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Intro */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Custom Model Configuration")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("External API Integration")}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showProviderService && (
                    <div className="form-field-wrapper space-y-2 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Provider Service")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-905 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.externalProvider}
                            onChange={(e) => {
                                const p = EXTERNAL_PROVIDERS.find(x => x.id === e.target.value);
                                const savedKey = aiSettings[`apiKey_${e.target.value}`] || "";
                                setAiSettings({
                                    ...aiSettings, 
                                    externalProvider: e.target.value,
                                    model: p?.defaultModel || '',
                                    internalModel: p?.defaultModel || '',
                                    chatModel: p?.defaultModel || '',
                                    bankingModel: p?.defaultModel || '',
                                    voucherModel: p?.defaultModel || '',
                                    baseUrl: p?.baseUrl || '',
                                    apiKey: savedKey
                                });
                            }}
                        >
                            {cloudProviders.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {showApiKey && (
                    <div className="form-field-wrapper space-y-2 border border-gray-150 dark:border-gray-800/80 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {t('Secret API Key')}
                        </label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-650"
                            value={aiSettings.apiKey}
                            onChange={(e) => setAiSettings({
                                ...aiSettings, 
                                apiKey: e.target.value,
                                [`apiKey_${aiSettings.externalProvider}`]: e.target.value
                            })}
                            placeholder="sk-..."
                        />
                    </div>
                )}

                {showBaseUrl && (
                    <div className="form-field-wrapper space-y-2 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200 md:col-span-2 lg:col-span-1">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Base URL Configuration")}</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-650" 
                            value={aiSettings.baseUrl}
                            onChange={(e) => setAiSettings({...aiSettings, baseUrl: e.target.value})}
                            placeholder="https://api.openai.com/v1"
                        />
                    </div>
                )}
            </div>

            {/* Custom Model list slots */}
            {(showSystemModel || showChatbotModel || showBankingModel || showAuditModel || showVoucherModel) && (
                <div className="border-t border-gray-100 dark:border-gray-800/80 pt-6">
                    <h4 className="text-xs font-bold text-gray-905 dark:text-white mb-4 uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {t("Custom Provider Model Slots")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                        {showSystemModel && (
                            <ExternalModelSelect 
                                label={t("Select Model (System Tasks)")}
                                valueKey="internalModel"
                                note={t("* Used for background parsing and generic prompt mappings.")}
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                        {showChatbotModel && (
                            <ExternalModelSelect 
                                label={t("Chatbot Model")}
                                valueKey="chatModel"
                                note={t("* Powers the active system chatbot.")}
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                        {showBankingModel && (
                            <ExternalModelSelect 
                                label={t("Banking Import Model")}
                                valueKey="bankingModel"
                                note={t("* Highly optimized model for statements scanning and categorization.")}
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                        {showAuditModel && (
                            <ExternalModelSelect 
                                label={t("Audit Import Model")}
                                valueKey="auditModel"
                                note={t("* Performs systematic checklist checks, compliance audits, and tax rules mapping.")}
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                        {showVoucherModel && (
                            <ExternalModelSelect 
                                label={t("Voucher Import Model")}
                                valueKey="voucherModel"
                                note={t("* Standard engine extracting ledger journals, double-entry rows and debit codes.")}
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
