import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { EXTERNAL_PROVIDERS } from "../../../../../services/AIConfig";

interface LocalHostProviderTabProps {
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

export const LocalHostProviderTab: React.FC<LocalHostProviderTabProps> = ({
    aiSettings, setAiSettings,
    showProviderService, showApiKey, showBaseUrl,
    showSystemModel, showChatbotModel, showBankingModel, showAuditModel, showVoucherModel,
    ExternalModelSelectComponent: ExternalModelSelect
}) => {
    const { t } = useLanguage();
    const localProviders = EXTERNAL_PROVIDERS.filter(p => ['ollama', 'lm_studio', 'vllm', '9router'].includes(p.id));

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Intro */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Local Host Model Configuration")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Local API Integration")}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showProviderService && (
                    <div className="form-field-wrapper space-y-2 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Provider Service")}</label>
                        <select 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                            value={aiSettings.externalProvider}
                            onChange={(e) => {
                                const p = EXTERNAL_PROVIDERS.find(x => x.id === e.target.value);
                                setAiSettings({
                                    ...aiSettings, 
                                    externalProvider: e.target.value,
                                    model: p?.defaultModel || '',
                                    internalModel: p?.defaultModel || '',
                                    chatModel: p?.defaultModel || '',
                                    bankingModel: p?.defaultModel || '',
                                    voucherModel: p?.defaultModel || '',
                                    baseUrl: p?.baseUrl || ''
                                });
                            }}
                        >
                            {localProviders.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {showApiKey && (
                    <div className="form-field-wrapper space-y-2 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {aiSettings.externalProvider === '9router' ? t('API Key (Managed)') : t('Secret API Key')}
                        </label>
                        <input 
                            type="password" 
                            className={`w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-650 ${aiSettings.externalProvider === '9router' ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-805' : ''}`}
                            value={aiSettings.externalProvider === '9router' ? '' : aiSettings.apiKey}
                            onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                            placeholder={aiSettings.externalProvider === '9router' ? "Plug & Play Enabled" : "sk-..."}
                            disabled={aiSettings.externalProvider === '9router'}
                        />
                    </div>
                )}

                {showBaseUrl && (
                    <div className="form-field-wrapper space-y-2 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200 md:col-span-2 lg:col-span-1">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Base URL Configuration")}</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-350 dark:placeholder:text-gray-650" 
                            value={aiSettings.baseUrl}
                            onChange={(e) => setAiSettings({...aiSettings, baseUrl: e.target.value})}
                            placeholder="http://localhost:11434/v1"
                        />
                    </div>
                )}
            </div>

            {/* Local Model slots */}
            {(showSystemModel || showChatbotModel || showBankingModel || showAuditModel || showVoucherModel) && (
                <div className="border-t border-gray-100 dark:border-gray-800/80 pt-6">
                    <h4 className="text-xs font-bold text-gray-905 dark:text-white mb-4 uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {t("Local Provider Model Slots")}
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
