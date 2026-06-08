import React, { useState, useEffect } from "react";
import { InfoIcon, CheckCircleIcon } from "../../icons/IconComponents";
import { FileText, Shield, Key, Cpu, Globe, Database, Scale } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

const contentCache = new Map<string, string>();

export const AboutSettings: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"about" | "release" | "privacy" | "license" | "terms">(() => {
    const override = localStorage.getItem('bharat_book_about_subtab_override');
    if (override === "about" || override === "release" || override === "privacy" || override === "license" || override === "terms") {
      localStorage.removeItem('bharat_book_about_subtab_override');
      return override;
    }
    try {
      const saved = localStorage.getItem('bharat_book_navigation_defaults');
      if (saved) {
        const { page, subPage, subSubPage } = JSON.parse(saved);
        if (page === 'settings' && subPage === 'about' && (subSubPage === "about" || subSubPage === "release" || subSubPage === "privacy" || subSubPage === "license" || subSubPage === "terms")) {
          return subSubPage as any;
        }
      }
    } catch (e) {}
    return "about";
  });
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: ReturnType<typeof setTimeout>;

    const fetchContent = async () => {
      if (activeTab === "about") return;
      
      let filePath = "";
      const langSuffix = language === "hi" ? "_hi" : language === "hinglish" ? "_hinglish" : "_en";

      if (activeTab === "release") {
        filePath = `/about-software/release_notes${langSuffix}.txt`;
      } else if (activeTab === "privacy") {
        filePath = `/about-software/privacy_policy${langSuffix}.txt`;
      } else if (activeTab === "license") {
        filePath = `/about-software/license_agreement${langSuffix}.txt`;
      } else if (activeTab === "terms") {
        filePath = `/about-software/terms_conditions${langSuffix}.txt`;
      }

      if (contentCache.has(filePath)) {
          setContent(contentCache.get(filePath)!);
          return;
      }

      // Only show loading spinner if request takes longer than 150ms to prevent jitter/flickering
      loadingTimeout = setTimeout(() => {
          if (isMounted) setIsLoading(true);
      }, 150);

      try {
        const response = await fetch(filePath);
        if (response.ok) {
          const text = await response.text();
          if (isMounted) {
             setContent(text);
             contentCache.set(filePath, text);
          }
        } else {
            const fallbackPath = filePath.replace(langSuffix, "_en");
            const fallbackResponse = await fetch(fallbackPath);
            if (fallbackResponse.ok) {
               const text = await fallbackResponse.text();
               if (isMounted) {
                   setContent(text);
                   contentCache.set(filePath, text); // Cache against the original request path too
               }
            } else {
               if (isMounted) setContent("Content not found.");
            }
        }
      } catch (err) {
        if (isMounted) setContent("Error loading content.");
      } finally {
        clearTimeout(loadingTimeout);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchContent();
    
    return () => {
        isMounted = false;
        clearTimeout(loadingTimeout);
    };
  }, [activeTab, language]);

  const DotIcon = ({ className }: { className?: string }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  );

  const tabs = [
    { id: "about" as const, label: "System Info", icon: DotIcon },
    { id: "terms" as const, label: "Terms & Conditions", icon: Scale },
    { id: "release" as const, label: "Release Notes", icon: FileText },
    { id: "privacy" as const, label: "Privacy Policy", icon: Shield },
    { id: "license" as const, label: "License", icon: Key },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Compact Header Row */}
      <div className="flex flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <InfoIcon className="!text-[20px] flex items-center justify-center text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{t("About the Applet")}</h2>
            <p className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t("Application build details and documentation")}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex justify-end items-center gap-3">
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 shrink-0">
             {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                     activeTab === tab.id 
                       ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                       : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                   }`}
                 >
                   <Icon className={`!text-[15px] flex items-center justify-center transition-colors ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                   <span className="leading-none">{t(tab.label)}</span>
                 </button>
                )
             })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 min-h-[550px] rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col">
        {activeTab === "about" ? (
          <div className="p-6 md:p-8 flex-1">
             <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/50 transform hover:scale-105 transition-transform overflow-hidden relative">
                     <CheckCircleIcon className="!text-[48px] absolute text-white flex items-center justify-center leading-none" />
                 </div>
                 <div>
                     <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Bharat Book AI</h4>
                     <div className="mt-2 flex items-center gap-2">
                         <span className="text-xs px-2.5 py-1 rounded-md font-bold tracking-wide bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">Build 2026.1.1</span>
                         <span className="text-xs text-gray-400 font-mono">v2.0.4</span>
                     </div>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                     <div className="flex items-center gap-3 mb-5">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                             <Cpu className="w-4 h-4" />
                         </div>
                         <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Engine</h5>
                     </div>
                     <div className="space-y-2 mt-auto">
                        <SpecItem label="Client Framework" value="React 18 / Vite" />
                        <SpecItem label="Styling Library" value="Tailwind CSS 3.4" />
                        <SpecItem label="State Management" value="Zustand / Context" />
                     </div>
                 </div>

                 <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                     <div className="flex items-center gap-3 mb-5">
                         <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                             <Globe className="w-4 h-4" />
                         </div>
                         <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Environment</h5>
                     </div>
                     <div className="space-y-2 mt-auto">
                        <SpecItem label="Language Target" value={<span className="uppercase">{language}</span>} />
                        <SpecItem label="Resolution Flow" value="Responsive Web" />
                        <SpecItem label="Host Platform" value="Standard Web" />
                     </div>
                 </div>

                 <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                     <div className="flex items-center gap-3 mb-5">
                         <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                             <Database className="w-4 h-4" />
                         </div>
                         <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Storage & AI</h5>
                     </div>
                     <div className="space-y-2 mt-auto">
                        <SpecItem label="Data Persistence" value="Offline-First Mode" />
                        <SpecItem label="Parsing Support" value="Excel / CSV / JSON" />
                        <SpecItem 
                          label="AI Engine Status" 
                          value={
                              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" /> Gemini Pro
                              </span>
                          } 
                        />
                     </div>
                 </div>
             </div>

             <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Bharat Book System Summary</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                     This system handles advanced AI-driven bank statement imports, invoice parsing, and ledger management for the Bharat Book platform. 
                     It supports parsing raw Excel, CSV, and JSON formats, applying structural Machine Learning algorithms, and automated noise extraction directly within the browser without requiring external data transmission for sensitive financial records.
                 </p>
             </div>
          </div>
        ) : (
          <div className="p-6">
              <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                  {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 space-y-4">
                          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                          <span className="text-xs font-bold tracking-widest uppercase">Loading Document...</span>
                      </div>
                  ) : (
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed selection:bg-blue-100 selection:text-blue-900 max-w-4xl">
                          {content}
                      </pre>
                  )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SpecItem = ({ label, value }: { label: React.ReactNode, value: React.ReactNode }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800/50 last:border-0 last:pb-0">
        <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
);


