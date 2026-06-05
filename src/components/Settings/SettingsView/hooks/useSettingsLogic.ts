import { useEffect } from "react";
import { runMappingSimulation } from "../../../../services/mappingService";

export const useSettingsLogic = (state: any, onAppModeChange?: (mode: string) => void) => {
  const {
    activeTab, setActiveTab, setDisplayId, setFiscalYear, setAppMode, setLanguage, setDateFormat,
    setTimezone, setTheme, setAutoLock, setDensity, setAnimations, setSoundEffects, setKeyboardShortcuts,
    setWeekStartsOn, setPaginationSize, setShowSystemInfo, setBankMappings, setBankShortCodes, setBankIgnoreWords,
    setPaymentModes, setPaymentChannels, setIfscPrefixes, setToggles, setAliases, setMissingMasterAction,
    setProcessingPriority, setBankChargesKeywords, setCashFlowKeywords, setSelfTransferKeywords, setCustomMappingRules,
    setAiSettings, setSourceColumn, setSplitDelimiter, setIgnoreExtractionKeywords, setPartyNameLocation,
    setUtrExtractorType, setAccountNumberDetection, setMappingRules, setAdvancedParsingEnabled, addNotification, setIsSaved, appMode, language,
    displayId, fiscalYear, dateFormat, timezone, theme, autoLock, density, animations, soundEffects, keyboardShortcuts,
    weekStartsOn, paginationSize, showSystemInfo, bankMappings, bankShortCodes, bankIgnoreWords, paymentModes,
    paymentChannels, ifscPrefixes, toggles, aliases, missingMasterAction, processingPriority, bankChargesKeywords,
    cashFlowKeywords, selfTransferKeywords, customMappingRules, aiSettings, sourceColumn, splitDelimiter,
    ignoreExtractionKeywords, partyNameLocation, utrExtractorType, accountNumberDetection, mappingRules,
    sandboxInput, setSandboxResult, setBulkSandboxResults
  } = state;

  useEffect(() => {
    const checkAndApplyOverride = () => {
      const override = localStorage.getItem('bharat_book_settings_active_tab_override');
      if (override) {
        if (['my-account', 'directory', 'group-rules', 'profile', 'active-users', 'help'].includes(override)) {
          setActiveTab('users');
          localStorage.setItem('bharat_book_users_subtab_override', override);
          setTimeout(() => {
             window.dispatchEvent(new Event('bharat_book_users_subtab_trigger'));
          }, 50);
        } else {
          setActiveTab(override as any);
        }
        localStorage.removeItem('bharat_book_settings_active_tab_override');
      }
    };
    checkAndApplyOverride();
    window.addEventListener('bharat_book_settings_tab_trigger', checkAndApplyOverride);
    return () => {
      window.removeEventListener('bharat_book_settings_tab_trigger', checkAndApplyOverride);
    };
  }, [setActiveTab]);

  useEffect(() => {
    const scrollToTab = () => {
      const el = document.getElementById(`settings-tab-${activeTab}`);
      const container = el?.closest(".overflow-x-auto") as HTMLElement;
      if (el && container) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (cRect.width === 0 || eRect.width === 0) return;

        const offset = eRect.left + eRect.width / 2 - (cRect.left + cRect.width / 2);

        if (Math.abs(offset) > 2) {
          container.scrollBy({ left: offset, behavior: "smooth" });
        }
      }
    };

    scrollToTab();
    const t1 = setTimeout(scrollToTab, 100);
    const t2 = setTimeout(scrollToTab, 300);
    const t3 = setTimeout(scrollToTab, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [activeTab]);

  const loadFromLocalStorage = () => {
    const savedSettings = localStorage.getItem("bharat_book_app_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.displayId) setDisplayId(parsed.displayId);
        if (parsed.fiscalYear) setFiscalYear(parsed.fiscalYear);
        if (parsed.appMode) setAppMode(parsed.appMode);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.autoLock) setAutoLock(parsed.autoLock);
        if (parsed.density) setDensity(parsed.density);
        if (parsed.animations) setAnimations(parsed.animations);
        if (parsed.soundEffects) setSoundEffects(parsed.soundEffects);
        if (parsed.keyboardShortcuts) setKeyboardShortcuts(parsed.keyboardShortcuts);
        if (parsed.weekStartsOn) setWeekStartsOn(parsed.weekStartsOn);
        if (parsed.paginationSize) setPaginationSize(parsed.paginationSize);
        if (parsed.showSystemInfo) setShowSystemInfo(parsed.showSystemInfo);
        if (parsed.bankMappings) setBankMappings(parsed.bankMappings);

        if (parsed.bankShortCodes) setBankShortCodes(parsed.bankShortCodes);
        if (parsed.bankIgnoreWords) setBankIgnoreWords(parsed.bankIgnoreWords);
        if (parsed.paymentModes) setPaymentModes(parsed.paymentModes);
        if (parsed.paymentChannels) setPaymentChannels(parsed.paymentChannels);
        if (parsed.ifscPrefixes) setIfscPrefixes(parsed.ifscPrefixes);

        if (parsed.toggles) setToggles((prev: any) => ({ ...prev, ...parsed.toggles }));
        if (parsed.aliases) setAliases(parsed.aliases);
        if (parsed.missingMasterAction === "Silently Create New Party" || !parsed.missingMasterAction) {
          setMissingMasterAction("Prompt to Create");
        } else {
          setMissingMasterAction(parsed.missingMasterAction);
        }

        if (parsed.processingPriority === "1. Extract from Statement -> 2. Match with Master (Recommended)" || !parsed.processingPriority) {
          setProcessingPriority("Extract -> Match");
        } else {
          setProcessingPriority(parsed.processingPriority);
        }
        if (parsed.bankChargesKeywords) setBankChargesKeywords(parsed.bankChargesKeywords);
        if (parsed.cashFlowKeywords) setCashFlowKeywords(parsed.cashFlowKeywords);
        if (parsed.selfTransferKeywords) setSelfTransferKeywords(parsed.selfTransferKeywords);
        if (parsed.customMappingRules) setCustomMappingRules(parsed.customMappingRules);
        if (parsed.aiSettings) setAiSettings(parsed.aiSettings);

        if (parsed.sourceColumn) setSourceColumn(parsed.sourceColumn);
        if (parsed.splitDelimiter) setSplitDelimiter(parsed.splitDelimiter);
        if (parsed.ignoreExtractionKeywords) setIgnoreExtractionKeywords(parsed.ignoreExtractionKeywords);
        if (parsed.partyNameLocation) setPartyNameLocation(parsed.partyNameLocation);
        if (parsed.utrExtractorType) setUtrExtractorType(parsed.utrExtractorType);
        if (parsed.accountNumberDetection) setAccountNumberDetection(parsed.accountNumberDetection);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
        const loadDefaultNoiseLists = async () => {
            try {
                const [bankRefResp, mappingResp] = await Promise.all([
                    fetch('/sample-data/ledger-master/bank_reference.json'),
                    fetch('/sample-data/ledger-master/default_mapping_rules.json')
                ]);
                
                if (bankRefResp.ok) {
                    const data = await bankRefResp.json();
                    setBankShortCodes(data.bankShortCodes?.join(", ") || "");
                    setBankIgnoreWords(data.bankIgnoreWords?.join(", ") || "");
                    setPaymentModes(data.paymentModes?.join(", ") || "");
                    setPaymentChannels(data.paymentChannels?.join(", ") || "");
                    setIfscPrefixes(data.ifscPrefixes?.join(", ") || "");
                }
                
                if (mappingResp.ok) {
                    const rules = await mappingResp.json();
                    setMappingRules(rules);
                }
            } catch (e) {
                console.error("Failed to load default noise lists", e);
            }
        };
        loadDefaultNoiseLists();
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const handleToggle = (key: string) => {
    setToggles((prev: any) => {
      const newValue = !prev[key];
      const newState = { ...prev, [key]: newValue };

      if (key === "sectionBasicEnabled") {
        newState.autoContraDetection = newValue;
        newState.identifyMobileTransfer = newValue;
        newState.autoDetectGstin = newValue;
        newState.autoDetectPanTan = newValue;
      }
      else if (key === "sectionListEnabled") {
        newState.subBankShortCodesEnabled = newValue;
        newState.subBankIgnoreWordsEnabled = newValue;
        newState.subPaymentModesEnabled = newValue;
        newState.subPaymentChannelsEnabled = newValue;
        newState.subIfscPrefixesEnabled = newValue;
      }
      else if (key === "sectionPatternEnabled") {
        newState.stripEntitySuffixes = newValue;
        newState.mobileNumberExtractor = newValue;
        newState.fuzzyLogic = newValue;
        newState.continuousLearning = newValue;
        setAdvancedParsingEnabled(newValue);
      }
      return newState;
    });
  };

  const handleSave = () => {
    const settings = {
      displayId, fiscalYear, appMode, language, dateFormat, timezone, theme, autoLock, density, animations,
      soundEffects, keyboardShortcuts, weekStartsOn, paginationSize, showSystemInfo, bankMappings, bankShortCodes,
      bankIgnoreWords, paymentModes, paymentChannels, ifscPrefixes, toggles, aliases, missingMasterAction,
      processingPriority, bankChargesKeywords, cashFlowKeywords, selfTransferKeywords, customMappingRules, aiSettings,
      sourceColumn, splitDelimiter, ignoreExtractionKeywords, partyNameLocation, utrExtractorType, accountNumberDetection,
    };
    const previousSettingsStr = localStorage.getItem("bharat_book_app_settings");
    const previousSettings = previousSettingsStr ? JSON.parse(previousSettingsStr) : {};
    const previousAppMode = previousSettings.appMode || "demo";

    localStorage.setItem("bharat_book_app_settings", JSON.stringify(settings));
    window.dispatchEvent(new Event("bharat_book_settings_updated"));
    if (onAppModeChange && appMode !== previousAppMode) {
      onAppModeChange(appMode);
    }
    
    addNotification({
      title: 'Settings Saved',
      message: 'Your system preferences have been updated successfully.',
      type: 'System',
    });
    
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); }, 1500);
  };

  const handleLoad = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.csv";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
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

          if (parsed.displayId) setDisplayId(parsed.displayId);
          if (parsed.fiscalYear) setFiscalYear(parsed.fiscalYear);
          if (parsed.appMode) setAppMode(parsed.appMode);
          if (parsed.language) setLanguage(parsed.language);
          if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
          if (parsed.timezone) setTimezone(parsed.timezone);
          if (parsed.theme) setTheme(parsed.theme);
          if (parsed.autoLock) setAutoLock(parsed.autoLock);
          if (parsed.density) setDensity(parsed.density);
          if (parsed.animations) setAnimations(parsed.animations);
          if (parsed.soundEffects) setSoundEffects(parsed.soundEffects);
          if (parsed.keyboardShortcuts) setKeyboardShortcuts(parsed.keyboardShortcuts);
          if (parsed.weekStartsOn) setWeekStartsOn(parsed.weekStartsOn);
          if (parsed.paginationSize) setPaginationSize(parsed.paginationSize);
          
        } catch (err) {
          console.error("Failed to parse file", err);
          alert("Failed to parse file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    setDisplayId("BBE-2026-IND"); setFiscalYear("April to March (Indian Standard)"); setAppMode("demo"); setLanguage("en");
    setDateFormat("DD/MM/YYYY"); setTimezone("Asia/Kolkata"); setTheme("system"); setAutoLock("15"); setDensity("standard");
    setAnimations("enabled"); setSoundEffects("disabled"); setKeyboardShortcuts("enabled"); setWeekStartsOn("sunday");
    setPaginationSize("50"); setShowSystemInfo("yes");
  };

  const handleClear = () => {
    setDisplayId(""); setFiscalYear(""); setAppMode(""); setLanguage("en"); setDateFormat(""); setTimezone("");
    setTheme(""); setAutoLock(""); setDensity(""); setAnimations(""); setSoundEffects(""); setKeyboardShortcuts("");
    setWeekStartsOn(""); setPaginationSize(""); setShowSystemInfo("");
  };

  const runSandboxSimulator = () => {
    const result = runMappingSimulation(sandboxInput, {
      mappingRules, aliases, bankChargesKeywords, cashFlowKeywords, selfTransferKeywords, toggles,
      sourceColumn, splitDelimiter, ignoreExtractionKeywords, partyNameLocation, utrExtractorType,
      accountNumberDetection, bankShortCodes, bankIgnoreWords, paymentModes, paymentChannels, ifscPrefixes,
    });
    setSandboxResult(result);
  };

  const runBulkSimulator = (inputs: string[]) => {
    const results = inputs
      .filter((input) => input.trim().length > 0)
      .map((input) => {
        const result = runMappingSimulation(input, {
          mappingRules, aliases, bankChargesKeywords, cashFlowKeywords, selfTransferKeywords, toggles,
          sourceColumn, splitDelimiter, ignoreExtractionKeywords, partyNameLocation, utrExtractorType,
          accountNumberDetection, bankShortCodes, bankIgnoreWords, paymentModes, paymentChannels, ifscPrefixes,
        });
        return {
          narration: input, partyName: result.partyKey, confidence: result.confidence, status: result.status, color: result.color,
        };
      });
    setBulkSandboxResults(results);
  };

  return {
    handleToggle, handleSave, handleLoad, handleReset, handleClear, runSandboxSimulator, runBulkSimulator
  };
};
