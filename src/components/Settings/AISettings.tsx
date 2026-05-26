
import React from 'react';
import { AIToolsIcon, CheckCircleIcon } from '../icons/IconComponents';
import { EXTERNAL_PROVIDERS, INTERNAL_GEMINI_MODELS } from '../../services/AIConfig';
import { testAiConnection } from '../../services/geminiService';

interface AISettingsProps {
    aiSettings: {
        provider: string;
        internalModel: string;
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
    const [testStatus, setTestStatus] = React.useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

    const handleTestConnection = async () => {
        setTestStatus({ loading: true });
        const result = await testAiConnection(aiSettings);
        setTestStatus({ loading: false, success: result.success, message: result.message });
        
        if (result.success) {
            setTimeout(() => setTestStatus({ loading: false }), 5000);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all">
            {isSaved && (
                <div className="absolute top-4 right-4 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 z-10">
                    <CheckCircleIcon className="mr-2" /> Settings Saved
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <AIToolsIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Engine Configuration</h3>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Manage how the AI assistant connects to language models.</p>
                </div>
            </div>
            
            <div className="space-y-8">
                {/* Engine Selection */}
                <div className="bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Active Engine
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
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-6">Standard seamless integration. Zero configuration required, managed directly by the platform.</p>
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
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pr-6">Connect to OpenAI, Anthropic, or specialized routers using your own private API keys.</p>
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
                    <div className="form-grid !p-0 !border-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="form-field-wrapper space-y-2 md:col-span-1">
                            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Select Model (System Tasks)</label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.internalModel}
                                onChange={(e) => setAiSettings({...aiSettings, internalModel: e.target.value})}
                            >
                                {INTERNAL_GEMINI_MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">* Internal models are optimized for system parsing.</p>
                        </div>
                        <div className="form-field-wrapper space-y-2 md:col-span-1">
                            <label className="flex items-center justify-between form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                <span>Chatbot Model</span>
                                <a 
                                  href="https://ai.google.dev/gemini-api/docs/models/gemini" 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] underline lowercase"
                                >
                                  supported models
                                </a>
                            </label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.chatModel || 'gemini-2.5-flash'}
                                onChange={(e) => setAiSettings({...aiSettings, chatModel: e.target.value})}
                            >
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8B</option>
                                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash-Lite</option>
                                <option value="gemini-2.0-flash-lite-preview-02-05">Gemini 2.0 Flash-Lite Preview</option>
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            </select>
                            <p className="text-[11px] text-gray-400 pt-1 font-medium italic">* This model powers the support chatbot.</p>
                        </div>
                    </div>
                ) : (
                    <div className="form-grid !p-0 !border-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="form-field-wrapper space-y-2">
                            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Provider Service</label>
                            <select 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                value={aiSettings.externalProvider}
                                onChange={(e) => {
                                    const p = EXTERNAL_PROVIDERS.find(x => x.id === e.target.value);
                                    setAiSettings({
                                        ...aiSettings, 
                                        externalProvider: e.target.value,
                                        model: p?.defaultModel || '',
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
                                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${aiSettings.externalProvider === '9router' ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
                                value={aiSettings.externalProvider === '9router' ? '' : aiSettings.apiKey}
                                onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                                placeholder={aiSettings.externalProvider === '9router' ? "Plug & Play Enabled" : "sk-..."}
                                disabled={aiSettings.externalProvider === '9router'}
                            />
                        </div>

                        <div className="form-field-wrapper space-y-2">
                            <label className="flex items-center justify-between form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                <span>{aiSettings.externalProvider === '9router' ? 'Model Selection' : 'Model Identifier'}</span>
                                {aiSettings.externalProvider === '9router' && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black dark:bg-blue-900/50 dark:text-blue-300">AUTO</span>
                                )}
                            </label>
                            <input 
                                type="text" 
                                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${aiSettings.externalProvider === '9router' ? 'opacity-80' : ''}`} 
                                value={aiSettings.model}
                                onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
                                placeholder="e.g. gpt-4o, claude-3"
                                readOnly={aiSettings.externalProvider === '9router'}
                            />
                            {aiSettings.externalProvider !== '9router' && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {EXTERNAL_PROVIDERS.find(p => p.id === aiSettings.externalProvider)?.models.map(m => (
                                        <button 
                                            key={m}
                                            onClick={() => setAiSettings({...aiSettings, model: m})}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                                aiSettings.model === m 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-field-wrapper space-y-2">
                            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Base URL Configuration</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-600" 
                                value={aiSettings.baseUrl}
                                onChange={(e) => setAiSettings({...aiSettings, baseUrl: e.target.value})}
                                placeholder="https://api.openai.com/v1"
                            />
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed md:max-w-xl">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Security Note:</span> Your API keys are strictly stored on this device. They never traverse our servers except directly to your chosen provider.
                        </p>
                        {testStatus.message && (
                            <div className={`mt-4 p-3 rounded-xl text-xs font-bold border inline-flex items-center gap-2 ${testStatus.success ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                                {testStatus.success && <CheckCircleIcon className="w-4 h-4 shrink-0" />}
                                {testStatus.message}
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
                                    Connecting
                                </>
                            ) : 'Test'}
                        </button>
                        <button 
                            onClick={handleSave}
                            className="w-full px-4 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 active:scale-[0.98] transition-all flex items-center justify-center group"
                        >
                            <CheckCircleIcon className="mr-2 group-hover:scale-110 transition-transform" /> Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
