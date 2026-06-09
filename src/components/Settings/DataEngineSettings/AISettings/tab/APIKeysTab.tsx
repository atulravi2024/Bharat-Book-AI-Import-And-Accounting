import React, { useState } from 'react';
import { useLanguage } from "../../../../../context/LanguageContext";
import { EXTERNAL_PROVIDERS } from "../../../../../services/AIConfig";
import { Key, Eye, EyeOff, Copy, Clipboard, Trash2, Search, Check, Zap, HelpCircle } from 'lucide-react';

interface APIKeysTabProps {
    aiSettings: any;
    setAiSettings: (settings: any) => void;
}

export const APIKeysTab: React.FC<APIKeysTabProps> = ({ aiSettings, setAiSettings }) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // List of providers that require cloud API keys
    const cloudProviders = EXTERNAL_PROVIDERS.filter(p => 
        !['ollama', 'lm_studio', 'vllm', '9router'].includes(p.id)
    );

    const toggleKeyVisibility = (id: string) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleKeyChange = (id: string, value: string) => {
        const updated = {
            ...aiSettings,
            [`apiKey_${id}`]: value
        };
        // Sync active provider key dynamically
        if (aiSettings.provider === 'external' && aiSettings.externalProvider === id) {
            updated.apiKey = value;
        }
        setAiSettings(updated);
    };

    const handleCopy = (id: string, value: string) => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handlePaste = async (id: string) => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                handleKeyChange(id, text);
            }
        } catch (err) {
            // Fallback warning context
            console.warn("Clipboard reading failed, please paste with Ctrl+V/Cmd+V", err);
        }
    };

    const handleClearKey = (id: string) => {
        handleKeyChange(id, "");
    };

    const handleActivateProvider = (id: string) => {
        const providerObj = cloudProviders.find(p => p.id === id);
        if (!providerObj) return;

        const savedKey = aiSettings[`apiKey_${id}`] || "";

        setAiSettings({
            ...aiSettings,
            provider: 'external',
            externalProvider: id,
            model: providerObj.defaultModel || '',
            internalModel: providerObj.defaultModel || '',
            chatModel: providerObj.defaultModel || '',
            bankingModel: providerObj.defaultModel || '',
            voucherModel: providerObj.defaultModel || '',
            baseUrl: providerObj.baseUrl || '',
            apiKey: savedKey,
            systemProvider: 'external',
            chatProvider: 'external',
            bankingProvider: 'external',
            auditProvider: 'external',
            voucherProvider: 'external'
        });
    };

    const filteredProviders = cloudProviders.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const configuredKeysCount = cloudProviders.filter(p => !!aiSettings[`apiKey_${p.id}`]).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                        <Key className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{t("Key Registry / API Credentials")}</h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                            {t("Manage and preload API keys for all compatible models")}
                        </p>
                    </div>
                </div>

                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {configuredKeysCount} / {cloudProviders.length} {t("Keys Configured")}
                    </span>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input 
                    type="text" 
                    placeholder={t("Filter keys by provider name or description...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
            </div>

            {/* Grid display for providers and key spaces */}
            <div className="grid grid-cols-1 gap-4">
                {filteredProviders.length > 0 ? (
                    filteredProviders.map((provider) => {
                        const currentKey = aiSettings[`apiKey_${provider.id}`] || "";
                        const isActive = aiSettings.provider === 'external' && aiSettings.externalProvider === provider.id;
                        const isVisible = visibleKeys[provider.id] || false;

                        return (
                            <div 
                                key={provider.id} 
                                className={`group p-4 rounded-2xl border transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-indigo-50/15 border-indigo-200 shadow-sm dark:bg-indigo-950/5 dark:border-indigo-800/60' 
                                        : 'bg-white/50 dark:bg-gray-900/25 border-gray-150 dark:border-gray-800 hover:border-gray-250 dark:hover:border-gray-700'
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left: Metadata */}
                                    <div className="lg:max-w-xs xl:max-w-sm w-full space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-extrabold text-gray-900 dark:text-white">{provider.name}</span>
                                            {isActive && (
                                                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/30 animate-pulse">
                                                    <Zap className="w-2.5 h-2.5 fill-indigo-600 dark:fill-indigo-400" />
                                                    {t("Active")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                                            {provider.description}
                                        </p>
                                    </div>

                                    {/* Middle: API Key Entry Fields & Helper Controls */}
                                    <div className="flex-1 min-w-0 flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <input 
                                                type={isVisible ? "text" : "password"}
                                                className="w-full pl-3 pr-24 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-mono text-gray-950 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                                value={currentKey}
                                                onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                                                placeholder={`sk-... (${provider.name} Key)`}
                                            />
                                            
                                            {/* Smart Inner Actions: Hide/Show & Clear & Copy & Paste */}
                                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleKeyVisibility(provider.id)}
                                                    className="p-1 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                                    title={isVisible ? t("Hide Key") : t("Show Key")}
                                                >
                                                    {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                                
                                                {currentKey && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(provider.id, currentKey)}
                                                            className={`p-1 rounded-md transition-colors ${copiedId === provider.id ? 'text-green-600 hover:bg-green-50' : 'hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                            title={copiedId === provider.id ? t("Copied") : t("Copy Key")}
                                                        >
                                                            {copiedId === provider.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleClearKey(provider.id)}
                                                            className="p-1 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                                                            title={t("Clear Key")}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {!currentKey && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePaste(provider.id)}
                                                        className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-md transition-colors"
                                                        title={t("Paste from clipboard")}
                                                    >
                                                        <Clipboard className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Activation Actions */}
                                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                                        <button
                                            type="button"
                                            onClick={() => handleActivateProvider(provider.id)}
                                            disabled={isActive}
                                            className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase transition-all shadow-sm ${
                                                isActive 
                                                    ? 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/10 cursor-default border border-indigo-500/20' 
                                                    : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-950 dark:hover:bg-gray-850 dark:border-gray-800 dark:text-gray-300 hover:border-gray-300 active:scale-95'
                                            }`}
                                        >
                                            {isActive ? t("Current Selected") : t("Select Provider")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/20">
                        <HelpCircle className="w-8 h-8 text-gray-400 mb-2.5" />
                        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">{t("No providers match your filter")}</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                            {t("Try clarifying your keyword search or clear the search input to list all cloud providers.")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
