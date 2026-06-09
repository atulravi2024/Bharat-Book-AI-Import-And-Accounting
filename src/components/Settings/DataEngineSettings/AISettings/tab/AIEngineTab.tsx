import React from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { EXTERNAL_PROVIDERS } from "../../../../../services/AIConfig";
import { AIToolsIcon } from "../../../../icons/IconComponents";

interface AIEngineTabProps {
    aiSettings: {
        provider: string;
        internalModel: string;
        chatModel?: string;
        bankingModel?: string;
        auditModel?: string;
        voucherModel?: string;
        externalProvider: string;
        apiKey: string;
        model: string;
        baseUrl: string;
        systemProvider?: string;
        chatProvider?: string;
        bankingProvider?: string;
        auditProvider?: string;
        voucherProvider?: string;
    };
    setAiSettings: (settings: any) => void;
}

export const AIEngineTab: React.FC<AIEngineTabProps> = ({ aiSettings, setAiSettings }) => {
    const { t } = useLanguage();

    const selectedProviderId = aiSettings.provider; // 'internal' | 'external' | 'local'
    const isInternal = selectedProviderId === 'internal';

    // Resolve custom active cloud provider
    let extProvId = aiSettings.externalProvider;
    const isExtProvLocal = ['ollama', 'lm_studio', 'vllm', '9router'].includes(extProvId);
    if (isExtProvLocal) {
        extProvId = 'openai';
    }
    const customProviderName = EXTERNAL_PROVIDERS.find(p => p.id === extProvId)?.name || 'OpenAI';

    // Resolve local active provider
    let locProvId = aiSettings.externalProvider;
    const isLocProvCloud = !['ollama', 'lm_studio', 'vllm', '9router'].includes(locProvId);
    if (isLocProvCloud) {
        locProvId = '9router';
    }
    const localProviderName = EXTERNAL_PROVIDERS.find(p => p.id === locProvId)?.name || '9router';

    // Get current active resolved provider name
    const activeProviderTitle = isInternal 
        ? t("Google Gemini") 
        : (selectedProviderId === 'external' ? customProviderName : localProviderName);

    // Get active model IDs to display
    const currentModels = {
        internalModel: isInternal ? aiSettings.internalModel : (aiSettings.internalModel || aiSettings.model),
        chatModel: isInternal ? (aiSettings.chatModel || 'gemini-2.5-flash') : (aiSettings.chatModel || aiSettings.model),
        bankingModel: isInternal ? (aiSettings.bankingModel || 'gemini-2.5-flash') : (aiSettings.bankingModel || aiSettings.model),
        auditModel: isInternal ? (aiSettings.auditModel || 'gemini-2.5-flash') : (aiSettings.auditModel || aiSettings.model),
        voucherModel: isInternal ? (aiSettings.voucherModel || 'gemini-2.5-flash') : (aiSettings.voucherModel || aiSettings.model),
    };

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'internal') {
            setAiSettings({
                ...aiSettings,
                provider: 'internal'
            });
        } else if (val === 'external') {
            let nextProvider = aiSettings.externalProvider;
            const isLocal = ['ollama', 'lm_studio', 'vllm', '9router'].includes(nextProvider);
            if (isLocal) {
                nextProvider = 'openai';
            }
            const p = EXTERNAL_PROVIDERS.find(x => x.id === nextProvider);
            setAiSettings({
                ...aiSettings,
                provider: 'external',
                externalProvider: nextProvider,
                model: p?.defaultModel || '',
                baseUrl: p?.baseUrl || ''
            });
        } else if (val === 'local') {
            let nextProvider = aiSettings.externalProvider;
            const isCloud = !['ollama', 'lm_studio', 'vllm', '9router'].includes(nextProvider);
            if (isCloud) {
                nextProvider = '9router';
            }
            const p = EXTERNAL_PROVIDERS.find(x => x.id === nextProvider);
            setAiSettings({
                ...aiSettings,
                provider: 'local',
                externalProvider: nextProvider,
                model: p?.defaultModel || '',
                baseUrl: p?.baseUrl || ''
            });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Tab Header block matching parent headers */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                    <AIToolsIcon className="!text-[18px] flex items-center justify-center" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("ActiveProvider Configuration")}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t("Configure Pipelines Service Providers")}</p>
                </div>
            </div>

            {/* Standard Grid Layout Matching Other Setup Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. System Task */}
                <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {t("System Task")}
                        </label>
                        {(aiSettings.systemProvider || 'internal') === aiSettings.provider ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                {t("Synced")}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                {t("Override")}
                            </span>
                        )}
                    </div>
                    <select 
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                        value={aiSettings.systemProvider || 'internal'}
                        onChange={(e) => {
                            setAiSettings({
                                ...aiSettings,
                                systemProvider: e.target.value
                            });
                        }}
                    >
                        <option value="internal">{t("Google Gemini")}</option>
                        <option value="external">{t("Custom Provider")}</option>
                        <option value="local">{t("Local Host Provider")}</option>
                    </select>
                    <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Target provider for payload parsing & validation.")}</p>
                </div>

                {/* 2. Chatbot Model */}
                <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {t("Chatbot Model")}
                        </label>
                        {(aiSettings.chatProvider || 'internal') === aiSettings.provider ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                {t("Synced")}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                {t("Override")}
                            </span>
                        )}
                    </div>
                    <select 
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                        value={aiSettings.chatProvider || 'internal'}
                        onChange={(e) => {
                            setAiSettings({
                                ...aiSettings,
                                chatProvider: e.target.value
                            });
                        }}
                    >
                        <option value="internal">{t("Google Gemini")}</option>
                        <option value="external">{t("Custom Provider")}</option>
                        <option value="local">{t("Local Host Provider")}</option>
                    </select>
                    <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Powers conversation and user assistance tasks.")}</p>
                </div>

                {/* 3. Banking Import Modal */}
                <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {t("Banking Import Modal")}
                        </label>
                        {(aiSettings.bankingProvider || 'internal') === aiSettings.provider ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                {t("Synced")}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                {t("Override")}
                            </span>
                        )}
                    </div>
                    <select 
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                        value={aiSettings.bankingProvider || 'internal'}
                        onChange={(e) => {
                            setAiSettings({
                                ...aiSettings,
                                bankingProvider: e.target.value
                            });
                        }}
                    >
                        <option value="internal">{t("Google Gemini")}</option>
                        <option value="external">{t("Custom Provider")}</option>
                        <option value="local">{t("Local Host Provider")}</option>
                    </select>
                    <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Resolves statement classification ranks.")}</p>
                </div>

                {/* 4. Audit Import Modal */}
                <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {t("Audit Import Modal")}
                        </label>
                        {(aiSettings.auditProvider || 'internal') === aiSettings.provider ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                {t("Synced")}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                {t("Override")}
                            </span>
                        )}
                    </div>
                    <select 
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                        value={aiSettings.auditProvider || 'internal'}
                        onChange={(e) => {
                            setAiSettings({
                                ...aiSettings,
                                auditProvider: e.target.value
                            });
                        }}
                    >
                        <option value="internal">{t("Google Gemini")}</option>
                        <option value="external">{t("Custom Provider")}</option>
                        <option value="local">{t("Local Host Provider")}</option>
                    </select>
                    <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Performs tax compliance checker & general audit loops.")}</p>
                </div>

                {/* 5. Voucher Import Modal */}
                <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-900/10 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            {t("Voucher Import Modal")}
                        </label>
                        {(aiSettings.voucherProvider || 'internal') === aiSettings.provider ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                {t("Synced")}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                                {t("Override")}
                            </span>
                        )}
                    </div>
                    <select 
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                        value={aiSettings.voucherProvider || 'internal'}
                        onChange={(e) => {
                            setAiSettings({
                                ...aiSettings,
                                voucherProvider: e.target.value
                            });
                        }}
                    >
                        <option value="internal">{t("Google Gemini")}</option>
                        <option value="external">{t("Custom Provider")}</option>
                        <option value="local">{t("Local Host Provider")}</option>
                    </select>
                    <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Runs double-entry extractors and general ledger alignment.")}</p>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-sans">
                    💡 {t("To customize specific model IDs, switch to of the configuration tabs above (Google Gemini, Custom Provider, or Local Host Provider).")}
                </p>
            </div>
        </div>
    );
};
