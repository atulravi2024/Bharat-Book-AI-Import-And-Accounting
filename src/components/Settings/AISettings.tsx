
import React from 'react';
import { useLanguage } from "../../context/LanguageContext";
import { Activity } from 'lucide-react';
import { AIToolsIcon, CheckCircleIcon } from '../icons/IconComponents';
import { EXTERNAL_PROVIDERS, INTERNAL_GEMINI_MODELS } from '../../services/AIConfig';
import { testAiConnection } from '../../services/geminiService';

interface ExternalModelSelectProps {
    label: string;
    valueKey: 'internalModel' | 'chatModel' | 'bankingModel' | 'voucherModel';
    note: string;
    aiSettings: any;
    setAiSettings: (settings: any) => void;
}

const ExternalModelSelect: React.FC<ExternalModelSelectProps> = ({
    label, valueKey, note, aiSettings, setAiSettings
}) => {
  const { t } = useLanguage();
    const selectedProvider = EXTERNAL_PROVIDERS.find(p => p.id === aiSettings.externalProvider) || EXTERNAL_PROVIDERS[0];
    const modelsList = selectedProvider.models || [];
    
    // Ensure we have a default value
    const currentValue = aiSettings[valueKey] || aiSettings.model || selectedProvider.defaultModel || 'gpt-4o';
    
    // Check if the current value is in the predefined list
    const isCustomValue = !modelsList.includes(currentValue);
    
    // State to track if custom input is showing
    const [showCustomInput, setShowCustomInput] = React.useState(isCustomValue);
    
    // When provider changes, update custom input visibility
    React.useEffect(() => {
        setShowCustomInput(!modelsList.includes(aiSettings[valueKey] || ''));
    }, [aiSettings.externalProvider, aiSettings[valueKey], modelsList]);

    return (
        <div className="form-field-wrapper space-y-2 md:col-span-1">
            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{label}</label>
            
            {!showCustomInput ? (
                <select 
                    className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                    value={currentValue}
                    onChange={(e) => {
                        if (e.target.value === '__custom__') {
                            setShowCustomInput(true);
                        } else {
                            setAiSettings({...aiSettings, [valueKey]: e.target.value});
                        }
                    }}
                    disabled={aiSettings.externalProvider === '9router'}
                >
                    {modelsList.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                    {aiSettings.externalProvider !== '9router' && (
                        <option value="__custom__">✏️ Custom Model ID...</option>
                    )}
                </select>
            ) : (
                <div className="flex gap-2 relative">
                    <input 
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm pr-12"
                        value={currentValue === '__custom__' ? '' : currentValue}
                        onChange={(e) => setAiSettings({...aiSettings, [valueKey]: e.target.value})}
                        placeholder="e.g. gpt-4o"
                    />
                    <button 
                        type="button"
                        onClick={() => {
                            setShowCustomInput(false);
                            setAiSettings({...aiSettings, [valueKey]: modelsList[0] || 'gpt-4o'});
                        }}
                        className="absolute right-3 top-3 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-bold"
                    >
                        {t("List")}
                    </button>
                </div>
            )}
            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{note}</p>
        </div>
    );
};

interface AISettingsProps {
    aiSettings: {
        provider: string;
        internalModel: string;
        chatModel?: string;
        bankingModel?: string;
        voucherModel?: string;
        externalProvider: string;
        apiKey: string;
        model: string;
        baseUrl: string;
    };
    setAiSettings: (settings: any) => void;
    handleSave: () => void;
    isSaved: boolean;
}

export const AISettings: React.FC<AISettingsProps> = ({
    aiSettings, setAiSettings,
    handleSave, isSaved
}) => {
    const { t } = useLanguage();
    const [testStatus, setTestStatus] = React.useState<{ 
        loading: boolean; 
        success?: boolean; 
        message?: string;
        details?: { name: string; success: boolean; modelId: string; error?: string }[];
    }>({ loading: false });

    const handleTestConnection = async () => {
        setTestStatus({ loading: true });
        const result = await testAiConnection(aiSettings);
        setTestStatus({ 
            loading: false, 
            success: result.success, 
            message: result.message,
            details: result.details 
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all">
            {isSaved && (
                <div className="absolute top-4 right-4 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 z-10">
                    <CheckCircleIcon className="mr-2" /> {t("Settings Saved")}
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <AIToolsIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("AI Engine Configuration")}</h3>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{t("Manage how the AI assistant connects to language models.")}</p>
                </div>
            </div>
            
            <div className="space-y-8">
                {/* Engine Selection */}
                <div className="bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {t("Active Engine")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => setAiSettings({...aiSettings, provider: 'internal'})}
                            className={`relative h-full p-5 sm:p-6 rounded-xl border-2 transition-all flex flex-col text-left group overflow-hidden ${
                                aiSettings.provider === 'internal' 
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' 
                                : 'border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500'
                            }`}
                        >
                            <h5 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Google Gemini (Built-in)</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-6">{t("Standard seamless integration. Zero configuration required, managed directly by the platform.")}</p>
                            {aiSettings.provider === 'internal' && (
                                <div className="absolute top-5 right-5 text-blue-600 dark:text-blue-400 animate-in zoom-in">
                                    <CheckCircleIcon />
                                </div>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setAiSettings({...aiSettings, provider: 'external'})}
                            className={`relative h-full p-5 sm:p-6 rounded-xl border-2 transition-all flex flex-col text-left group overflow-hidden ${
                                aiSettings.provider === 'external' 
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' 
                                : 'border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500'
                            }`}
                        >
                            <h5 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Custom Provider (External)</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-6">{t("Connect to OpenAI, Anthropic, or specialized routers using your own private API keys.")}</p>
                            {aiSettings.provider === 'external' && (
                                <div className="absolute top-5 right-5 text-blue-600 dark:text-blue-400 animate-in zoom-in">
                                    <CheckCircleIcon />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Engine Configuration */}
                {aiSettings.provider === 'internal' ? (
                    <div className="form-grid !p-0 !border-0 animate-in slide-in-from-bottom-4 fade-in duration-300 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <div className="form-field-wrapper space-y-2 md:col-span-1">
                            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Select Model (System Tasks)")}</label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.internalModel}
                                onChange={(e) => setAiSettings({...aiSettings, internalModel: e.target.value})}
                            >
                                {INTERNAL_GEMINI_MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">{t("* Internal models are optimized for system parsing.")}</p>
                        </div>
                        <div className="form-field-wrapper space-y-2 md:col-span-1">
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
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.chatModel || 'gemini-2.5-flash'}
                                onChange={(e) => setAiSettings({...aiSettings, chatModel: e.target.value})}
                            >
                                {INTERNAL_GEMINI_MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">* This model powers the support chatbot.</p>
                        </div>

                        {/* Model for Banking Import */}
                        <div className="form-field-wrapper space-y-2 md:col-span-1 border-t border-gray-100 dark:border-gray-700/50 pt-4">
                            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Banking Import Model")}</label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.bankingModel || 'gemini-2.5-flash'}
                                onChange={(e) => setAiSettings({...aiSettings, bankingModel: e.target.value})}
                            >
                                {INTERNAL_GEMINI_MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">* Used specifically for parsing and sorting bank statements.</p>
                        </div>

                        {/* Model for Other Voucher Imports */}
                        <div className="form-field-wrapper space-y-2 md:col-span-1 border-t border-gray-100 dark:border-gray-700/50 pt-4">
                            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Voucher Import Model")}</label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.voucherModel || 'gemini-2.5-flash'}
                                onChange={(e) => setAiSettings({...aiSettings, voucherModel: e.target.value})}
                            >
                                {INTERNAL_GEMINI_MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">* Secondary parsing engine mapping line items and receipts.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="form-field-wrapper space-y-2">
                                <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Provider Service")}</label>
                                <select 
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
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
                                    {EXTERNAL_PROVIDERS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field-wrapper space-y-2">
                                <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                    {aiSettings.externalProvider === '9router' ? 'API Key (Managed)' : 'Secret API Key'}
                                </label>
                                <input 
                                    type="password" 
                                    className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${aiSettings.externalProvider === '9router' ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
                                    value={aiSettings.externalProvider === '9router' ? '' : aiSettings.apiKey}
                                    onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                                    placeholder={aiSettings.externalProvider === '9router' ? "Plug & Play Enabled" : "sk-..."}
                                    disabled={aiSettings.externalProvider === '9router'}
                                />
                            </div>

                            <div className="form-field-wrapper space-y-2 md:col-span-2 lg:col-span-1">
                                <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Base URL Configuration")}</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-600" 
                                    value={aiSettings.baseUrl}
                                    onChange={(e) => setAiSettings({...aiSettings, baseUrl: e.target.value})}
                                    placeholder="https://api.openai.com/v1"
                                />
                            </div>
                        </div>

                        {/* Model dropdown list by detail */}
                        <div className="border-t border-gray-100 dark:border-gray-800/80 pt-6">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> {t("Custom Provider Model Slots")}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                <ExternalModelSelect 
                                    label="Select Model (System Tasks)"
                                    valueKey="internalModel"
                                    note="* Used for background parsing and generic prompt mappings."
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                />
                                <ExternalModelSelect 
                                    label="Chatbot Model"
                                    valueKey="chatModel"
                                    note="* Powers the active system chatbot."
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                />
                                <ExternalModelSelect 
                                    label="Banking Import Model"
                                    valueKey="bankingModel"
                                    note="* Highly optimized model for statements scanning and categorization."
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                />
                                <ExternalModelSelect 
                                    label="Audit Import Model"
                                    valueKey="voucherModel"
                                    note="* Handles line item receipts and audit extraction logic."
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed md:max-w-xl">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Security Note:</span> {t("Your API keys are strictly stored on this device. They never traverse our servers except directly to your chosen provider.")}
                        </p>
                        {testStatus.message && (
                            <div className={`mt-4 p-4 rounded-2xl border flex flex-col gap-3 text-xs ${
                                testStatus.success 
                                ? 'bg-green-50/50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
                                : 'bg-red-50/50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                            }`}>
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    {testStatus.success ? (
                                        <CheckCircleIcon className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0">!</span>
                                    )}
                                    <span>{testStatus.message}</span>
                                </div>
                                
                                {testStatus.details && testStatus.details.length > 0 && (
                                    <div className="border-t border-dashed border-gray-200/50 dark:border-gray-700/50 pt-2.5 mt-1 space-y-2">
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">{t("Model Performance Verification")}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {testStatus.details.map((detail, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-white/70 dark:bg-gray-900/40 rounded-lg border border-gray-100 dark:border-gray-800/60 gap-4">
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{detail.name}</span>
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate">{detail.modelId}</span>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                                        detail.success 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                                    }`}>
                                                        {detail.success ? '● Success' : '● Failed'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 w-full sm:w-[320px] md:w-[380px] xl:w-[400px] shrink-0">
                        <button 
                            onClick={handleTestConnection}
                            disabled={testStatus.loading}
                            className={`w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
                                testStatus.loading 
                                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {testStatus.loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t("Connecting")}
                                </>
                            ) : (
                                <>
                                    <Activity className="w-4 h-4 mr-2 shrink-0" />
                                    {t("Test")}
                                </>
                            )}
                        </button>
                        <button 
                            onClick={handleSave}
                            className="w-full px-4 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 active:scale-[0.98] transition-all flex items-center justify-center group"
                        >
                            <CheckCircleIcon className="mr-2 group-hover:scale-110 transition-transform" /> {t("Save")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
