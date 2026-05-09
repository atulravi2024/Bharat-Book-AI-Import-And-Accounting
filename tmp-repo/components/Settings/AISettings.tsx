
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
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative">
            {isSaved && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center animate-in fade-in slide-in-from-top-2">
                    <CheckCircleIcon className="mr-2" /> Settings Saved!
                </div>
            )}
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                <AIToolsIcon className="mr-3 text-blue-600" /> AI Engine Configuration
            </h3>
            
            <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest">Active System</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setAiSettings({...aiSettings, provider: 'internal'})}
                            className={`p-4 rounded-2xl border-2 transition-all text-left ${aiSettings.provider === 'internal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                        >
                            <p className="font-bold text-sm text-gray-900">Google Gemini (Internal)</p>
                            <p className="text-[10px] text-gray-500 font-medium">Standard system model. Managed by platform.</p>
                        </button>
                        <button 
                            onClick={() => setAiSettings({...aiSettings, provider: 'external'})}
                            className={`p-4 rounded-2xl border-2 transition-all text-left ${aiSettings.provider === 'external' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                        >
                            <p className="font-bold text-sm text-gray-900">Custom Provider (External)</p>
                            <p className="text-[10px] text-gray-500 font-medium">Use your own API keys for more control.</p>
                        </button>
                    </div>
                </div>

                {aiSettings.provider === 'internal' ? (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Gemini Model</label>
                            <select 
                                className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                                value={aiSettings.internalModel}
                                onChange={(e) => setAiSettings({...aiSettings, internalModel: e.target.value})}
                            >
                                {INTERNAL_GEMINI_MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <p className="mt-2 text-[10px] text-gray-400 font-medium italic">
                                * Internal models are managed by the platform environment.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Provider Type</label>
                                <select 
                                    className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
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

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    {aiSettings.externalProvider === '9router' ? 'API Key (Not Required)' : 'API Key'}
                                </label>
                                <input 
                                    type="password" 
                                    className={`w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-gray-300 ${aiSettings.externalProvider === '9router' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    value={aiSettings.externalProvider === '9router' ? '' : aiSettings.apiKey}
                                    onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                                    placeholder={aiSettings.externalProvider === '9router' ? "Plug & Play" : "Enter your private API key"}
                                    disabled={aiSettings.externalProvider === '9router'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    {aiSettings.externalProvider === '9router' ? 'Model (Automatic)' : 'Model'}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className={`w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none ${aiSettings.externalProvider === '9router' ? 'opacity-80' : ''}`} 
                                        value={aiSettings.model}
                                        onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
                                        placeholder="Custom model id"
                                        readOnly={aiSettings.externalProvider === '9router'}
                                    />
                                    {aiSettings.externalProvider === '9router' && (
                                        <p className="mt-1 text-[9px] text-blue-500 font-black uppercase tracking-tighter">Automatic Balanced Routing</p>
                                    )}
                                    {aiSettings.externalProvider !== '9router' && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {EXTERNAL_PROVIDERS.find(p => p.id === aiSettings.externalProvider)?.models.map(m => (
                                                <button 
                                                    key={m}
                                                    onClick={() => setAiSettings({...aiSettings, model: m})}
                                                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${aiSettings.model === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-400'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Endpoint URL</label>
                                <input 
                                    type="text" 
                                    className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none" 
                                    value={aiSettings.baseUrl}
                                    onChange={(e) => setAiSettings({...aiSettings, baseUrl: e.target.value})}
                                    placeholder="https://api.example.com/v1"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-premium-slate-100 space-y-4">
                    {testStatus.message && (
                        <div className={`p-3 rounded-xl text-[11px] font-bold border ${testStatus.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {testStatus.message}
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 font-bold max-w-xs uppercase leading-relaxed">
                            Configuration is stored locally. API keys never leave your browser except to the chosen provider.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleTestConnection}
                                disabled={testStatus.loading}
                                className={`px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center ${testStatus.loading ? 'bg-gray-100 text-gray-400' : 'bg-premium-slate-100 text-premium-slate-700 hover:bg-premium-slate-200 shadow-sm'}`}
                            >
                                {testStatus.loading ? 'Testing...' : 'Test Connection'}
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all flex items-center"
                            >
                                <CheckCircleIcon className="mr-3" /> Save Intelligence Config
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
