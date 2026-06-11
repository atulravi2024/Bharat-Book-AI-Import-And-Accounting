import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { SearchIcon, CheckCircleIcon, UploadIcon, DownloadIcon, UndoIcon, ClearAllIcon, SaveIcon } from "../../icons/IconComponents";
import { Shield, FileText } from "lucide-react";
import { CoreIntegrityTab } from "./tab/CoreIntegrityTab";
import { DataConsentTab } from "./tab/DataConsentTab";

interface PrivacySettingsProps {
    toggles: {
        anonymousReporting: boolean;
    };
    handleToggle: (key: any) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ toggles, handleToggle }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [targetFormat, setTargetFormat] = useState<"json" | "csv">("json");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeSubTab, setActiveSubTab ] = useState<"gdpr" | "data_consent">("gdpr");

  useEffect(() => {
    const checkOverride = () => {
      const override = localStorage.getItem('bharat_book_privacy_subtab_override');
      if (override) {
        if (override === "gdpr" || override === "compliance") setActiveSubTab("gdpr");
        else if (override === "data_consent" || override === "consent") setActiveSubTab("data_consent");
        localStorage.removeItem('bharat_book_privacy_subtab_override');
      }
    };
    checkOverride();
    window.addEventListener('bharat_book_privacy_subtab_trigger', checkOverride);
    return () => window.removeEventListener('bharat_book_privacy_subtab_trigger', checkOverride);
  }, []);
  const [isSaved, setIsSaved] = useState(false);

  // Privacy specific settings states
  const [retentionPeriod, setRetentionPeriod] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).retentionPeriod || "7 Years (Statutory)";
    } catch (e) {}
    return "7 Years (Statutory)";
  });
  const [gdprCompliance, setGdprCompliance] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).gdprCompliance !== false;
    } catch (e) {}
    return true;
  });
  const [doubleEncrypt, setDoubleEncrypt] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).doubleEncrypt || false;
    } catch (e) {}
    return false;
  });
  const [sessionClearance, setSessionClearance] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).sessionClearance || "Never";
    } catch (e) {}
    return "Never";
  });
  const [strictIpVerification, setStrictIpVerification] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).strictIpVerification || false;
    } catch (e) {}
    return false;
  });
  const [anonymousReporting, setAnonymousReportingLocal] = useState(() => toggles.anonymousReporting);
  const [thirdPartyConsent, setThirdPartyConsent] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).thirdPartyConsent || false;
    } catch (e) {}
    return false;
  });
  const [aiModelIngestion, setAiModelIngestion] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).aiModelIngestion !== false;
    } catch (e) {}
    return true;
  });
  const [piiScrubbingLevel, setPiiScrubbingLevel] = useState(() => {
    try {
      const saved = localStorage.getItem("bharat_book_privacy_settings");
      if (saved) return JSON.parse(saved).piiScrubbingLevel || "High";
    } catch (e) {}
    return "High";
  });

  // Sync anonymous reporting with global context
  useEffect(() => {
    setAnonymousReportingLocal(toggles.anonymousReporting);
  }, [toggles.anonymousReporting]);

  const setAnonymousReporting = (val: boolean) => {
    setAnonymousReportingLocal(val);
    if (val !== toggles.anonymousReporting) {
      handleToggle("anonymousReporting");
    }
  };

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

  const showRetention = isFieldVisible("Keep audit logs for", ["audit", "retention", "logs", "duration", "history", "keep audit logs for", "retention period"]);
  const showGdprCompliance = isFieldVisible("Strict Privacy Integrity Mode", ["gdpr", "compliance", "integrity", "rules", "strict privacy Integrity mode", "core gdpr rules"]);
  const showDoubleEncrypt = isFieldVisible("Double Encrypt Backup Records", ["encrypt", "backup", "security", "double encrypt", "advanced encryption"]);
  const showSessionClearance = isFieldVisible("Automated Session Clearance", ["session", "clearance", "lock", "idle", "timeout", "automated session clearance", "session security"]);
  const showStrictIpVerification = isFieldVisible("Strict IP Routing Audit", ["ip", "verification", "access", "strict ip", "network restriction"]);

  const showAnonymousReporting = isFieldVisible("Anonymous Reporting", ["anonymous", "reporting", "improvement", "usage", "anonymous usage reporting"]);
  const showThirdPartyConsent = isFieldVisible("Third-Party Processing Consent", ["third-party", "consent", "sharing", "data sharing", "third-party data sharing", "third-party processing consent"]);
  const showAiModelIngestion = isFieldVisible("AI Model Ingestion Consent", ["ai", "model", "ingestion", "gemini", "model training", "model fine-tuning", "ai model ingestion consent"]);
  const showPiiScrubbingLevel = isFieldVisible("PII/Anonymization Scrubbing Levels", ["pii", "scrubbing", "anonymization", "masking", "data scrubbing mode", "pii/anonymization scrubbing levels"]);
  const showExportEnterprise = isFieldVisible("Export Enterprise Data", ["export", "enterprise", "download", "records", "json", "csv", "request export"]);

  const isSearching = searchQuery.trim() !== "";

  const hasGdprMatches = showRetention || showGdprCompliance || showDoubleEncrypt || showSessionClearance || showStrictIpVerification;
  const hasConsentMatches = showAnonymousReporting || showThirdPartyConsent || showAiModelIngestion || showPiiScrubbingLevel || showExportEnterprise;
  const hasAnyMatch = hasGdprMatches || hasConsentMatches;

  const gdprMatchCount = isSearching ? ((showRetention ? 1 : 0) + (showGdprCompliance ? 1 : 0) + (showDoubleEncrypt ? 1 : 0) + (showSessionClearance ? 1 : 0) + (showStrictIpVerification ? 1 : 0)) : 0;
  const consentMatchCount = isSearching ? ((showAnonymousReporting ? 1 : 0) + (showThirdPartyConsent ? 1 : 0) + (showAiModelIngestion ? 1 : 0) + (showPiiScrubbingLevel ? 1 : 0) + (showExportEnterprise ? 1 : 0)) : 0;

  // Background sync alignment auto-switching
  useEffect(() => {
    if (isSearching) {
      if (activeSubTab === "gdpr" && !hasGdprMatches) {
        if (hasConsentMatches) {
          setActiveSubTab("data_consent");
        }
      } else if (activeSubTab === "data_consent" && !hasConsentMatches) {
        if (hasGdprMatches) {
          setActiveSubTab("gdpr");
        }
      }
    }
  }, [searchQuery, hasGdprMatches, hasConsentMatches, activeSubTab]);

  const handleSave = () => {
    const settings = {
      retentionPeriod,
      gdprCompliance,
      doubleEncrypt,
      sessionClearance,
      strictIpVerification,
      thirdPartyConsent,
      aiModelIngestion,
      piiScrubbingLevel
    };
    localStorage.setItem("bharat_book_privacy_settings", JSON.stringify(settings));
    window.dispatchEvent(new Event("bharat_book_settings_updated"));
    
    // Ensure parent's anonymousReporting is synchronized in localStorage backing setting
    const globalSettingsStr = localStorage.getItem("bharat_book_app_settings");
    if (globalSettingsStr) {
      try {
        const globalSettings = JSON.parse(globalSettingsStr);
        if (!globalSettings.toggles) {
          globalSettings.toggles = {};
        }
        globalSettings.toggles.anonymousReporting = anonymousReporting;
        localStorage.setItem("bharat_book_app_settings", JSON.stringify(globalSettings));
      } catch (err) {}
    }

    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); }, 1500);
  };

  const handleReset = () => {
    setRetentionPeriod("7 Years (Statutory)");
    setGdprCompliance(true);
    setDoubleEncrypt(false);
    setSessionClearance("Never");
    setStrictIpVerification(false);
    setAnonymousReporting(true);
    setThirdPartyConsent(false);
    setAiModelIngestion(true);
    setPiiScrubbingLevel("High");
  };

  const handleClear = () => {
    setRetentionPeriod("1 Year");
    setGdprCompliance(false);
    setDoubleEncrypt(false);
    setSessionClearance("Never");
    setStrictIpVerification(false);
    setAnonymousReporting(false);
    setThirdPartyConsent(false);
    setAiModelIngestion(false);
    setPiiScrubbingLevel("Standard");
  };

  const handleCombinedImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        let parsed: any = {};
        if (file.name.endsWith(".csv")) {
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

        if (parsed.retentionPeriod !== undefined) setRetentionPeriod(parsed.retentionPeriod);
        if (parsed.gdprCompliance !== undefined) setGdprCompliance(parsed.gdprCompliance === true || parsed.gdprCompliance === "true");
        if (parsed.doubleEncrypt !== undefined) setDoubleEncrypt(parsed.doubleEncrypt === true || parsed.doubleEncrypt === "true");
        if (parsed.sessionClearance !== undefined) setSessionClearance(parsed.sessionClearance);
        if (parsed.strictIpVerification !== undefined) setStrictIpVerification(parsed.strictIpVerification === true || parsed.strictIpVerification === "true");
        if (parsed.anonymousReporting !== undefined) setAnonymousReporting(parsed.anonymousReporting === true || parsed.anonymousReporting === "true");
        if (parsed.thirdPartyConsent !== undefined) setThirdPartyConsent(parsed.thirdPartyConsent === true || parsed.thirdPartyConsent === "true");
        if (parsed.aiModelIngestion !== undefined) setAiModelIngestion(parsed.aiModelIngestion === true || parsed.aiModelIngestion === "true");
        if (parsed.piiScrubbingLevel !== undefined) setPiiScrubbingLevel(parsed.piiScrubbingLevel);
      } catch (err) {
        console.error("Failed to parse privacy files", err);
        alert("Failed to parse privacy configuration file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportBackup = () => {
    const data = {
      retentionPeriod,
      gdprCompliance,
      doubleEncrypt,
      sessionClearance,
      strictIpVerification,
      anonymousReporting,
      thirdPartyConsent,
      aiModelIngestion,
      piiScrubbingLevel
    };

    let content = "";
    let mimeType = "application/json";
    let filename = "privacy_settings_backup";

    if (targetFormat === "csv") {
      mimeType = "text/csv";
      filename += ".csv";
      content = "key,value\n" + Object.entries(data)
        .map(([key, val]) => `${key},"${String(val).replace(/"/g, '""')}"`)
        .join("\n");
    } else {
      filename += ".json";
      content = JSON.stringify(data, null, 2);
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
  };

  const tabs = [
    { id: "gdpr" as const, label: t("Core Integrity Rules"), icon: Shield },
    { id: "data_consent" as const, label: t("Data Processing Consent Forms"), icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Header Row 1: Title and Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 sm:max-w-[30%] min-w-0">
          <div className="w-10 h-10 rounded-[0.6rem] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-500/20">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Privacy & Compliance")}</h2>
            <p className="block text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate whitespace-nowrap mt-0.5">{t("Configure logs and processing consents")}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 flex justify-start sm:justify-end items-center">
          <div className="w-full sm:w-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar border border-gray-200/40 dark:border-gray-700/40 shrink-0 justify-end">
             {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                const matchCount = tab.id === 'gdpr' ? gdprMatchCount : consentMatchCount;
                return (
                 <button
                   key={tab.id}
                   id={`settings-tab-privacy-${tab.id}`}
                   onClick={() => setActiveSubTab(tab.id)}
                   className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 snap-start ${
                     isActive 
                       ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm scale-[1.01]' 
                       : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30'
                   }`}
                 >
                   <Icon className={`w-3.5 h-3.5 flex items-center justify-center transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                   <span className="leading-none">{tab.label}</span>
                   {isSearching && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                          isActive 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                          {matchCount}
                      </span>
                   )}
                 </button>
                )
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
            placeholder={t("Search privacy controls...")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
              className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
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
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Import (JSON/CSV)")}
          >
            <UploadIcon className="!text-[14px] flex items-center justify-center shrink-0 shadow-none border-none p-0 bg-transparent" />
            <span className="hidden lg:inline leading-none">{t("Import")}</span>
          </button>
          <button
            onClick={handleExportBackup}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Export")}
          >
            <DownloadIcon className="!text-[14px] flex items-center justify-center shrink-0 shadow-none border-none p-0 bg-transparent" />
            <span className="hidden lg:inline leading-none">{t("Export")}</span>
          </button>
          <button
            onClick={handleClear}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent shadow-sm active:scale-95 hidden lg:flex items-center justify-center gap-1.5 shrink-0"
            title={t("Clear All Fields")}
          >
            <ClearAllIcon className="!text-[14px] flex items-center justify-center shrink-0 shadow-none border-none p-0 bg-transparent" />
            <span className="hidden lg:inline leading-none">{t("Clear")}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Reset")}
          >
            <UndoIcon className="!text-[14px] flex items-center justify-center shrink-0 shadow-none border-none p-0 bg-transparent" />
            <span className="hidden lg:inline leading-none">{t("Reset")}</span>
          </button>
          <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>
          <button
            onClick={handleSave}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/35 dark:text-emerald-400" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"}`}
            title={isSaved ? t("Saved") : t("Save")}
          >
            {isSaved ? <CheckCircleIcon className="!text-[14px] flex items-center justify-center shrink-0 animate-bounce cursor-pointer text-emerald-600 dark:text-emerald-400 p-0 bg-transparent" /> : <SaveIcon className="!text-[13px] flex items-center justify-center shrink-0 shadow-none border-none p-0 bg-transparent text-white" />}
            <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
          </button>
        </div>
      </div>

      {/* Main Content Card Container Wrapper */}
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 min-h-[450px] space-y-6 relative">
          {isSaved && (
              <div className="absolute top-4 right-4 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400 z-10 font-sans">
                  <CheckCircleIcon className="mr-2" /> {t("Settings Saved")}
              </div>
          )}

          {!hasAnyMatch ? (
             <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 min-h-[300px] animate-in fade-in duration-300">
                <Shield className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                <h4 className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-wider">{t("No matches found in any privacy controls")}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1 leading-normal">
                   {t("Please clear or refine your search input query to display the privacy parameters again.")}
                </p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-750 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl shadow-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-900 active:scale-95"
                >
                  {t("Clear Search")}
                </button>
             </div>
          ) : (
             <>
                {activeSubTab === "gdpr" && (
                    <div className="space-y-6">
                        {!hasGdprMatches ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-750 min-h-[250px] animate-in fade-in duration-300">
                                <Shield className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("No matches in Core Integrity Rules")}</h4>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm mt-1 leading-normal">
                                    {t("However, matches are found in other categories. Select a category below to see its matches:")}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    {hasConsentMatches && (
                                        <button 
                                            onClick={() => setActiveSubTab("data_consent")}
                                            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100/80 text-blue-700 dark:bg-blue-900/25 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            {t("Data Processing Consent Forms")} ({consentMatchCount})
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <CoreIntegrityTab 
                                retentionPeriod={retentionPeriod}
                                setRetentionPeriod={setRetentionPeriod}
                                gdprCompliance={gdprCompliance}
                                setGdprCompliance={setGdprCompliance}
                                doubleEncrypt={doubleEncrypt}
                                setDoubleEncrypt={setDoubleEncrypt}
                                sessionClearance={sessionClearance}
                                setSessionClearance={setSessionClearance}
                                strictIpVerification={strictIpVerification}
                                setStrictIpVerification={setStrictIpVerification}
                                showRetention={showRetention}
                                showGdprCompliance={showGdprCompliance}
                                showDoubleEncrypt={showDoubleEncrypt}
                                showSessionClearance={showSessionClearance}
                                showStrictIpVerification={showStrictIpVerification}
                            />
                        )}
                    </div>
                )}

                {activeSubTab === "data_consent" && (
                    <div className="space-y-6">
                        {!hasConsentMatches ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-750 min-h-[250px] animate-in fade-in duration-300">
                                <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("No matches in Data Processing Consent")}</h4>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm mt-1 leading-normal">
                                    {t("However, matches are found in other categories. Select a category below to see its matches:")}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    {hasGdprMatches && (
                                        <button 
                                            onClick={() => setActiveSubTab("gdpr")}
                                            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100/80 text-blue-700 dark:bg-blue-900/25 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                                        >
                                            <Shield className="w-3.5 h-3.5" />
                                            {t("Core Integrity Rules")} ({gdprMatchCount})
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <DataConsentTab 
                                anonymousReporting={anonymousReporting}
                                setAnonymousReporting={setAnonymousReporting}
                                thirdPartyConsent={thirdPartyConsent}
                                setThirdPartyConsent={setThirdPartyConsent}
                                aiModelIngestion={aiModelIngestion}
                                setAiModelIngestion={setAiModelIngestion}
                                piiScrubbingLevel={piiScrubbingLevel}
                                setPiiScrubbingLevel={setPiiScrubbingLevel}
                                onRequestExport={handleExportBackup}
                                showAnonymousReporting={showAnonymousReporting}
                                showThirdPartyConsent={showThirdPartyConsent}
                                showAiModelIngestion={showAiModelIngestion}
                                showPiiScrubbingLevel={showPiiScrubbingLevel}
                                showExportEnterprise={showExportEnterprise}
                            />
                        )}
                    </div>
                )}
             </>
          )}
      </div>
    </div>
  );
};
