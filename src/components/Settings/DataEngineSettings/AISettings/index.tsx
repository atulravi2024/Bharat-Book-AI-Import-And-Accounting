import React from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { useNotifications } from "../../../../context/NotificationContext";
import { Activity, Key } from 'lucide-react';
import { 
  AIToolsIcon, 
  CheckCircleIcon, 
  UndoIcon, 
  UploadIcon, 
  DownloadIcon, 
  ClearAllIcon, 
  SaveIcon, 
  SearchIcon,
  SettingsIcon
} from "../../../icons/IconComponents";
import { EXTERNAL_PROVIDERS, INTERNAL_GEMINI_MODELS } from "../../../../services/AIConfig";
import { testAiConnection } from "../../../../services/geminiService";

// Import modular tab components
import { GoogleGeminiTab } from "./tab/GoogleGeminiTab";
import { CustomProviderTab } from "./tab/CustomProviderTab";
import { LocalHostProviderTab } from "./tab/LocalHostProviderTab";
import { AIEngineTab } from "./tab/AIEngineTab";
import { APIKeysTab } from "./tab/APIKeysTab";

interface ExternalModelSelectProps {
    label: string;
    valueKey: 'internalModel' | 'chatModel' | 'bankingModel' | 'auditModel' | 'voucherModel';
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
        <div className="form-field-wrapper space-y-2 md:col-span-1 border border-gray-150 dark:border-gray-800 p-4 rounded-2xl bg-gray-50/10 dark:bg-gray-901/10 hover:shadow-sm transition-all duration-200">
            <label className="form-label text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{label}</label>
            
            {!showCustomInput ? (
                <select 
                    className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-medium text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
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
        auditModel?: string;
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
    const { addNotification } = useNotifications();

    // Resolve custom active cloud provider name
    let extProvId = aiSettings.externalProvider;
    const isExtProvLocal = ['ollama', 'lm_studio', 'vllm', '9router'].includes(extProvId);
    if (isExtProvLocal) {
        extProvId = 'openai';
    }
    const customProviderName = EXTERNAL_PROVIDERS.find(p => p.id === extProvId)?.name || 'OpenAI';

    // Resolve local active provider name
    let locProvId = aiSettings.externalProvider;
    const isLocProvCloud = !['ollama', 'lm_studio', 'vllm', '9router'].includes(locProvId);
    if (isLocProvCloud) {
        locProvId = '9router';
    }
    const localProviderName = EXTERNAL_PROVIDERS.find(p => p.id === locProvId)?.name || '9router';

    const [searchQuery, setSearchQuery] = React.useState("");
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    const [targetFormat, setTargetFormat] = React.useState<"json" | "csv">("json");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Track active sub-tab. It should synchronize back and forth with aiSettings.provider
    // but can also independently select the 'ai_engine' or 'api_keys' tab.
    const [activeSubTab, setActiveSubTab] = React.useState<"internal" | "external" | "local" | "ai_engine" | "api_keys">("internal");

    React.useEffect(() => {
        const checkOverride = () => {
            const override = localStorage.getItem('bharat_book_ai_subtab_override');
            if (override) {
                if (['internal', 'external', 'local', 'ai_engine', 'api_keys'].includes(override)) {
                    setActiveSubTab(override as any);
                    if (override === 'internal') {
                        setAiSettings(prev => ({ ...prev, provider: 'internal' }));
                    } else if (override === 'external') {
                        setAiSettings(prev => ({ ...prev, provider: 'external', systemProvider: 'external', chatProvider: 'external', bankingProvider: 'external', auditProvider: 'external', voucherProvider: 'external' }));
                    } else if (override === 'local') {
                        setAiSettings(prev => ({ ...prev, provider: 'local', systemProvider: 'local', chatProvider: 'local', bankingProvider: 'local', auditProvider: 'local', voucherProvider: 'local' }));
                    }
                }
                localStorage.removeItem('bharat_book_ai_subtab_override');
            }
        };
        checkOverride();
        window.addEventListener('bharat_book_ai_subtab_trigger', checkOverride);
        return () => window.removeEventListener('bharat_book_ai_subtab_trigger', checkOverride);
    }, []);

    // Sync sub-tab if aiSettings.provider changes (unless we are viewing ai_engine or api_keys tab)
    React.useEffect(() => {
        if (activeSubTab !== "ai_engine" && activeSubTab !== "api_keys" && aiSettings.provider !== activeSubTab) {
            setActiveSubTab(aiSettings.provider as any);
        }
    }, [aiSettings.provider]);

    // Handle initial auditModel field setup inside aiSettings to avoid undefined states
    React.useEffect(() => {
        if (!aiSettings.auditModel) {
            setAiSettings({
                ...aiSettings,
                auditModel: aiSettings.voucherModel || 'gemini-2.5-flash'
            });
        }
    }, [aiSettings]);

    const [testStatus, setTestStatus] = React.useState<{ 
        loading: boolean; 
        success?: boolean; 
        message?: string;
        details?: { name: string; success: boolean; modelId: string; error?: string }[];
    }>({ loading: false });

    // Handle Active AI connection testing
    const handleTestConnection = async () => {
        setTestStatus({ loading: true });
        // Create standard test profile
        const payloadToTest = {
            ...aiSettings,
            // Sync any fallback
            voucherModel: aiSettings.voucherModel || aiSettings.auditModel || 'gemini-2.5-flash'
        };
        const result = await testAiConnection(payloadToTest);
        setTestStatus({ 
            loading: false, 
            success: result.success, 
            message: result.message,
            details: result.details 
        });
    };

    // Combined JSON and CSV format importer
    const handleCombinedImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            try {
                let parsed: any = {};
                if (targetFormat === "csv" || file.name.endsWith(".csv")) {
                    const lines = content.split("\n");
                    lines.forEach((line) => {
                        const [key, ...rest] = line.split(",");
                        if (key && rest.length > 0) {
                            let val = rest.join(",").trim();
                            if (val.startsWith('"') && val.endsWith('"')) {
                                val = val.substring(1, val.length - 1);
                            }
                            parsed[key.trim()] = val;
                        }
                    });
                } else {
                    parsed = JSON.parse(content);
                }

                const newSettings = {
                    provider: parsed.provider || aiSettings.provider,
                    internalModel: parsed.internalModel || aiSettings.internalModel,
                    chatModel: parsed.chatModel || aiSettings.chatModel,
                    bankingModel: parsed.bankingModel || aiSettings.bankingModel,
                    auditModel: parsed.auditModel || aiSettings.auditModel,
                    voucherModel: parsed.voucherModel || aiSettings.voucherModel,
                    externalProvider: parsed.externalProvider || aiSettings.externalProvider,
                    apiKey: parsed.apiKey || aiSettings.apiKey,
                    model: parsed.model || aiSettings.model,
                    baseUrl: parsed.baseUrl || aiSettings.baseUrl,
                };

                setAiSettings(newSettings);
                addNotification?.({
                    title: 'Import Success',
                    message: 'AI configuration settings imported successfully.',
                    type: 'System',
                });
            } catch (err) {
                console.error("Failed to parse settings import", err);
                alert("Failed to parse AI Settings file.");
            }
        };
        reader.readAsText(file);
    };

    // Backup Export handler
    const handleExportBackup = () => {
        let content = "";
        let mimeType = "application/json";
        let filename = `ai_settings_${aiSettings.provider}_backup`;

        if (targetFormat === "csv") {
            mimeType = "text/csv";
            filename += ".csv";
            content = "key,value\n" + Object.entries(aiSettings)
                .map(([key, val]) => `${key},"${String(val).replace(/"/g, '""')}"`)
                .join("\n");
        } else {
            filename += ".json";
            content = JSON.stringify(aiSettings, null, 2);
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addNotification?.({
            title: 'Export Success',
            message: `${targetFormat.toUpperCase()} configuration export completed successfully.`,
            type: 'System',
        });
    };

    // Purge form fields
    const handleClear = () => {
        setAiSettings({
            ...aiSettings,
            apiKey: "",
            baseUrl: "",
            model: "",
        });
        addNotification?.({
            title: 'Fields Cleared',
            message: 'All API fields has been cleared.',
            type: 'System',
        });
    };

    // Factory Settings Restore
    const handleReset = () => {
        setAiSettings({
            provider: "internal",
            internalModel: "gemini-2.5-flash",
            chatModel: "gemini-2.5-flash",
            bankingModel: "gemini-2.5-flash",
            auditModel: "gemini-2.5-flash",
            voucherModel: "gemini-2.5-flash",
            externalProvider: "openai",
            apiKey: "",
            model: "gpt-4o",
            baseUrl: "https://api.openai.com/v1",
        });
        addNotification?.({
            title: 'Settings Reset',
            message: 'AI engines restored to factory default settings.',
            type: 'System',
        });
    };

    // Match filtering engine
    const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
        if (!searchQuery.trim()) return true;
        
        const words = searchQuery.toLowerCase().trim().split(/\s+/);
        const positiveTerms: string[] = [];
        const negativeTerms: string[] = [];

        for (const word of words) {
            if (word.startsWith('!') && word.length > 1) {
                negativeTerms.push(word.substring(1));
            } else if (word.startsWith('-') && word.length > 1) {
                negativeTerms.push(word.substring(1));
            } else if (word.trim()) {
                positiveTerms.push(word);
            }
        }

        const allTermsToCheck = [
            labelKey,
            t(labelKey),
            ...(extraTerms || [])
        ].map(term => term.toLowerCase());

        if (negativeTerms.length > 0) {
            const hasNegativeMatch = negativeTerms.some(neg =>
                allTermsToCheck.some(term => term.includes(neg))
            );
            if (hasNegativeMatch) return false;
        }

        if (positiveTerms.length > 0) {
            const hasAllPositiveMatches = positiveTerms.every(pos =>
                allTermsToCheck.some(term => term.includes(pos))
            );
            if (!hasAllPositiveMatches) return false;
        }

        return true;
    };

    const showSystemModel = isFieldVisible("Select Model (System Tasks)", ["system", "tasks", "internal", "external", "google", "gemini", "system tasks"]);
    const showChatbotModel = isFieldVisible("Chatbot Model", ["chat", "bot", "assistant", "chatbot model"]);
    const showBankingModel = isFieldVisible("Banking Import Model", ["bank", "statement", "banking", "import", "ranking input model"]);
    const showAuditModel = isFieldVisible("Audit Import Model", ["audit", "compliance", "tax", "audit import model", "audit model", "audit input model"]);
    const showVoucherModel = isFieldVisible("Voucher Import Model", ["voucher", "receipt", "import", "voucher input model"]);
    
    const showProviderService = isFieldVisible("Provider Service", ["provider", "external", "openai", "anthropic", "9router", "router", "google", "gemini"]);
    const showApiKey = isFieldVisible("Secret API Key", ["api", "key", "secret", "token"]);
    const showBaseUrl = isFieldVisible("Base URL Configuration", ["base", "url", "endpoint"]);

    const isSearching = searchQuery.trim() !== "";

    const hasInternalMatches = showProviderService || showSystemModel || showChatbotModel || showBankingModel || showAuditModel || showVoucherModel;
    const hasExternalMatches = showProviderService || showApiKey || showBaseUrl || showSystemModel || showChatbotModel || showBankingModel || showAuditModel || showVoucherModel;
    const hasLocalMatches = showProviderService || showApiKey || showBaseUrl || showSystemModel || showChatbotModel || showBankingModel || showAuditModel || showVoucherModel;
    const hasAnyMatch = hasInternalMatches || hasExternalMatches || hasLocalMatches;

    const internalMatchCount = isSearching ? ((showProviderService ? 1 : 0) + (showSystemModel ? 1 : 0) + (showChatbotModel ? 1 : 0) + (showBankingModel ? 1 : 0) + (showAuditModel ? 1 : 0) + (showVoucherModel ? 1 : 0)) : 0;
    const externalMatchCount = isSearching ? ((showProviderService ? 1 : 0) + (showApiKey ? 1 : 0) + (showBaseUrl ? 1 : 0) + (showSystemModel ? 1 : 0) + (showChatbotModel ? 1 : 0) + (showBankingModel ? 1 : 0) + (showAuditModel ? 1 : 0) + (showVoucherModel ? 1 : 0)) : 0;
    const localMatchCount = isSearching ? ((showProviderService ? 1 : 0) + (showApiKey ? 1 : 0) + (showBaseUrl ? 1 : 0) + (showSystemModel ? 1 : 0) + (showChatbotModel ? 1 : 0) + (showBankingModel ? 1 : 0) + (showAuditModel ? 1 : 0) + (showVoucherModel ? 1 : 0)) : 0;

    const switchToExternal = () => {
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
            internalModel: p?.defaultModel || '',
            chatModel: p?.defaultModel || '',
            bankingModel: p?.defaultModel || '',
            voucherModel: p?.defaultModel || '',
            baseUrl: p?.baseUrl || '',
            systemProvider: 'external',
            chatProvider: 'external',
            bankingProvider: 'external',
            auditProvider: 'external',
            voucherProvider: 'external'
        });
    };

    const switchToLocal = () => {
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
            internalModel: p?.defaultModel || '',
            chatModel: p?.defaultModel || '',
            bankingModel: p?.defaultModel || '',
            voucherModel: p?.defaultModel || '',
            baseUrl: p?.baseUrl || '',
            systemProvider: 'local',
            chatProvider: 'local',
            bankingProvider: 'local',
            auditProvider: 'local',
            voucherProvider: 'local'
        });
    };

    // Background Tab syncing / Auto-Aligning Protocol
    React.useEffect(() => {
        if (isSearching && activeSubTab !== 'api_keys') {
            if (activeSubTab === 'internal' && !hasInternalMatches) {
                if (hasExternalMatches) {
                    setActiveSubTab('external');
                    switchToExternal();
                } else if (hasLocalMatches) {
                    setActiveSubTab('local');
                    switchToLocal();
                }
            } else if (activeSubTab === 'external' && !hasExternalMatches) {
                if (hasInternalMatches) {
                    setActiveSubTab('internal');
                    setAiSettings({ ...aiSettings, provider: 'internal' });
                } else if (hasLocalMatches) {
                    setActiveSubTab('local');
                    switchToLocal();
                }
            } else if (activeSubTab === 'local' && !hasLocalMatches) {
                if (hasInternalMatches) {
                    setActiveSubTab('internal');
                    setAiSettings({ ...aiSettings, provider: 'internal' });
                } else if (hasExternalMatches) {
                    setActiveSubTab('external');
                    switchToExternal();
                }
            }
        }
    }, [searchQuery, hasInternalMatches, hasExternalMatches, hasLocalMatches, activeSubTab]);

    const tabs = [
        { id: "internal" as const, label: t("Google Gemini"), icon: AIToolsIcon },
        { id: "external" as const, label: t("Custom Provider"), icon: SettingsIcon },
        { id: "local" as const, label: t("Local Host Provider"), icon: SettingsIcon },
        { id: "ai_engine" as const, label: t("ActiveProvider"), icon: AIToolsIcon },
        { id: "api_keys" as const, label: t("API Keys"), icon: Key },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
            {/* Header Row 1: Title and Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
                <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
                    <div className="w-10 h-10 rounded-[0.6rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
                        <AIToolsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("AI Engines")}</h2>
                        <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Manage model providers and task settings.")}>
                            {t("Manage model providers and task settings.")}
                        </p>
                    </div>
                </div>

                <div className="min-w-0 flex-1 flex items-center">
                    <div className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start shrink-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            let isActive = activeSubTab === tab.id;
                            
                            const matchCount = 
                                tab.id === 'internal' ? internalMatchCount :
                                tab.id === 'external' ? externalMatchCount :
                                tab.id === 'local' ? localMatchCount :
                                0;
                            return (
                                <button
                                    key={tab.id}
                                    id={`settings-tab-ai-${tab.id}`}
                                    onClick={() => {
                                        setActiveSubTab(tab.id);
                                        if (tab.id === 'internal') {
                                            setAiSettings({ ...aiSettings, provider: 'internal' });
                                        } else if (tab.id === 'external') {
                                            switchToExternal();
                                        } else if (tab.id === 'local') {
                                            switchToLocal();
                                        }
                                        // Keeping activeSubTab to 'ai_engine' or 'api_keys' won't change aiSettings.provider instantly,
                                        // let their internal selection mechanisms drive that!
                                    }}
                                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                                        isActive 
                                            ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                                    }`}
                                >
                                    <Icon className={`!text-[15px] flex items-center justify-center transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                    <span className="leading-none">{tab.label}</span>
                                    {isSearching && tab.id !== 'ai_engine' && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                                            isActive 
                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                            {matchCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Header Row 2: Search and toolbar */}
            <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
                <div className="flex-1 min-w-0 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <SearchIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder={t("Search AI engine settings...")} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            title={t("Clear search")}
                        >
                            <svg className="w-3 h-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${(isSearchFocused || searchQuery) ? "hidden sm:flex" : "flex"}`}>
                    <input 
                        type="file"
                        accept={targetFormat === "json" ? ".json" : ".csv"}
                        ref={fileInputRef}
                        onChange={handleCombinedImport}
                        className="hidden"
                    />
                    <div className="relative inline-flex items-center shrink-0">
                        <select
                            value={targetFormat}
                            onChange={(e) => setTargetFormat(e.target.value as "json" | "csv")}
                            className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
                            title={t("Simple Input and Output")}
                        >
                            <option value="json" className="bg-white dark:bg-gray-800">{t("JSON")}</option>
                            <option value="csv" className="bg-white dark:bg-gray-800">{t("CSV")}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Import (JSON/CSV)")}
                    >
                        <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Import")}</span>
                    </button>
                    <button
                        onClick={handleExportBackup}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Export")}
                    >
                        <DownloadIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Export")}</span>
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 hidden lg:flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Clear All Fields")}
                    >
                        <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Clear")}</span>
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Reset")}
                    >
                        <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Reset")}</span>
                    </button>
                    <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
                    <button
                        onClick={handleSave}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        title={isSaved ? t("Saved") : t("Save")}
                    >
                        {isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce" /> : <SaveIcon className="!text-[14px] flex items-center justify-center shrink-0" />}
                        <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
                    </button>
                </div>
            </div>

            {/* Main Content Card Container Wrapper */}
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 min-h-[450px] space-y-6 relative">
                {isSaved && (
                    <div className="absolute top-4 right-4 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 z-10 font-sans">
                        <CheckCircleIcon className="mr-2" /> {t("Settings Saved")}
                    </div>
                )}

                {/* System-wide Active Provider Selection */}
                {activeSubTab === 'ai_engine' && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-500/10 rounded-2xl animate-in fade-in duration-300">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0"></span>
                                {t("Active Provider Selection")}
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
                                {t("Configure the active main provider engine for all background pipelines and AI tasks.")}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 max-w-sm w-full sm:w-auto shrink-0">
                            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">{t("ActiveProvider")}:</span>
                            <select 
                                className="w-full sm:w-56 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-850 rounded-xl font-bold text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm cursor-pointer"
                                value={aiSettings.provider}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'internal') {
                                        setAiSettings({ 
                                            ...aiSettings, 
                                            provider: 'internal',
                                            systemProvider: 'internal',
                                            chatProvider: 'internal',
                                            bankingProvider: 'internal',
                                            auditProvider: 'internal',
                                            voucherProvider: 'internal'
                                        });
                                    } else if (val === 'external') {
                                        switchToExternal();
                                    } else if (val === 'local') {
                                        switchToLocal();
                                    }
                                }}
                            >
                                <option value="internal">{t("Google Gemini")}</option>
                                <option value="external">{t("Custom Provider")}</option>
                                <option value="local">{t("Local Host Provider")}</option>
                            </select>
                        </div>
                    </div>
                )}

                {isSearching ? (
                    hasAnyMatch ? (
                        <div className="space-y-6">
                            {activeSubTab === 'internal' && (
                                <GoogleGeminiTab 
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                    showProviderService={showProviderService}
                                    showSystemModel={showSystemModel}
                                    showChatbotModel={showChatbotModel}
                                    showBankingModel={showBankingModel}
                                    showAuditModel={showAuditModel}
                                    showVoucherModel={showVoucherModel}
                                />
                            )}
                            {activeSubTab === 'external' && (
                                <CustomProviderTab 
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                    showProviderService={showProviderService}
                                    showApiKey={showApiKey}
                                    showBaseUrl={showBaseUrl}
                                    showSystemModel={showSystemModel}
                                    showChatbotModel={showChatbotModel}
                                    showBankingModel={showBankingModel}
                                    showAuditModel={showAuditModel}
                                    showVoucherModel={showVoucherModel}
                                    ExternalModelSelectComponent={ExternalModelSelect}
                                />
                            )}
                            {activeSubTab === 'local' && (
                                <LocalHostProviderTab 
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                    showProviderService={showProviderService}
                                    showApiKey={showApiKey}
                                    showBaseUrl={showBaseUrl}
                                    showSystemModel={showSystemModel}
                                    showChatbotModel={showChatbotModel}
                                    showBankingModel={showBankingModel}
                                    showAuditModel={showAuditModel}
                                    showVoucherModel={showVoucherModel}
                                    ExternalModelSelectComponent={ExternalModelSelect}
                                />
                            )}
                            {activeSubTab === 'ai_engine' && (
                                <AIEngineTab 
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                />
                            )}
                            {activeSubTab === 'api_keys' && (
                                <APIKeysTab 
                                    aiSettings={aiSettings}
                                    setAiSettings={setAiSettings}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
                            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 border border-gray-150 dark:border-gray-750">
                                <SearchIcon className="w-5 h-5 animate-pulse text-gray-400" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t("No settings found")}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{t("No AI settings matched your search query. Try typing another term.")}</p>
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="mt-5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95"
                            >
                                {t("Clear Search")}
                            </button>
                        </div>
                    )
                ) : (
                    <div className="space-y-6">
                        {activeSubTab === 'internal' && (
                            <GoogleGeminiTab 
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                                showProviderService={true}
                                showSystemModel={true}
                                showChatbotModel={true}
                                showBankingModel={true}
                                showAuditModel={true}
                                showVoucherModel={true}
                            />
                        )}
                        {activeSubTab === 'external' && (
                            <CustomProviderTab 
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                                showProviderService={true}
                                showApiKey={true}
                                showBaseUrl={true}
                                showSystemModel={true}
                                showChatbotModel={true}
                                showBankingModel={true}
                                showAuditModel={true}
                                showVoucherModel={true}
                                ExternalModelSelectComponent={ExternalModelSelect}
                            />
                        )}
                        {activeSubTab === 'local' && (
                            <LocalHostProviderTab 
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                                showProviderService={true}
                                showApiKey={true}
                                showBaseUrl={true}
                                showSystemModel={true}
                                showChatbotModel={true}
                                showBankingModel={true}
                                showAuditModel={true}
                                showVoucherModel={true}
                                ExternalModelSelectComponent={ExternalModelSelect}
                            />
                        )}
                        {activeSubTab === 'ai_engine' && (
                            <AIEngineTab 
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                        {activeSubTab === 'api_keys' && (
                            <APIKeysTab 
                                aiSettings={aiSettings}
                                setAiSettings={setAiSettings}
                            />
                        )}
                    </div>
                )}

                {/* Footer Validation & Connections Testing */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed md:max-w-xl font-sans">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{t("Security Note")}:</span> {t("Your API keys are strictly stored on this device. They never traverse our servers except directly to your chosen provider.")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        {testStatus.message && (
                            <div className={`p-3 rounded-xl border flex items-center gap-2 max-w-sm shrink-1 ${testStatus.success ? "bg-green-50/50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400" : "bg-red-50/50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"}`}>
                                {testStatus.success ? (
                                    <CheckCircleIcon className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                                ) : (
                                    <svg className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <span className="text-xs font-bold leading-tight truncate" title={testStatus.message}>{testStatus.message}</span>
                            </div>
                        )}
                        <button 
                            onClick={handleTestConnection}
                            disabled={testStatus.loading}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95 ${testStatus.loading ? "bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-850 dark:border-gray-800 cursor-not-allowed" : "bg-transparent border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 text-gray-750 dark:text-gray-300 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20"}`}
                        >
                            <Activity className={`w-3.5 h-3.5 shrink-0 ${testStatus.loading ? "animate-spin" : ""}`} />
                            <span>{testStatus.loading ? t("Testing Connect...") : t("Test Connection")}</span>
                        </button>
                    </div>
                </div>

                {/* Detailed connection tests mapping */}
                {testStatus.details && testStatus.details.length > 0 && (
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-800 rounded-xl space-y-2.5 animate-in slide-in-from-bottom-2 duration-300">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">{t("Integration Pipelines Verification Details")}:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {testStatus.details.map((m, i) => (
                                <div key={i} className={`p-3 rounded-lg border flex items-center justify-between text-xs font-medium bg-white dark:bg-gray-950/50 ${m.success ? "border-green-150/50 dark:border-green-900/10" : "border-red-150/50 dark:border-red-900/10"}`}>
                                    <div className="min-w-0 pr-2">
                                        <p className="text-gray-800 dark:text-gray-200 font-bold leading-tight truncate">{m.name}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate leading-normal mt-0.5" title={m.modelId}>{m.modelId}</p>
                                    </div>
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${m.success ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}>
                                        {m.success ? "OK" : "ERR"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
