import React, { useState, useEffect, useRef } from "react";
import {
  initialMappingRules,
  runMappingSimulation,
} from "../../services/mappingService";
import {
  SettingsIcon,
  CheckCircleIcon,
  AccountIcon,
  NotificationsIcon,
  SecurityIcon,
  InfoIcon,
  AIToolsIcon,
  AdminIcon,
  CodeIcon,
  LayoutIcon,
} from "../icons/IconComponents";
import { GeneralSettings } from "./GeneralSettings";
import { UserSettings } from "./UserSettings";
import { AlertSettings } from "./AlertSettings";
import { SecuritySettings } from "./SecuritySettings";
import { PrivacySettings } from "./PrivacySettings";
import { ImportSettings } from "./ImportSettings";
import { MappingSettings } from "./MappingSettings";
import { AISettings } from "./AISettings";
import { SampleSettings } from "./SampleSettings";
import { AdminSettings } from "./AdminSettings";
import { DataExplorer } from "./DataExplorer";
import { AppNavigationSettings } from "./AppNavigationSettings";
import { VoucherNumberingSettings } from "./VoucherNumberingSettings";
import { InvoicePrintSettings } from "./InvoicePrintSettings";
import { FormDetailSettings } from "./FormDetailSettings";
import { FirmSettings } from "./FirmSettings";

// Import default noise lists
import {
  BANK_SHORT_CODES,
  BANK_IGNORE_WORDS,
} from "../../services/matching/bankCodes";
import {
  PAYMENT_MODES,
  PAYMENT_CHANNELS,
} from "../../services/matching/paymentModes";
import { IFSC_PREFIXES } from "../../services/matching/ifscCodes";

import { MainView, LedgerMaster } from "../../types";

export interface SettingsViewProps {
  setView: (view: MainView) => void;
  setActiveMasterTab: (tab: string | null) => void;
  activeSamples: string[];
  onToggleSample: (id: string, forceState?: boolean) => void;
  setReportBankActiveTab?: (tab: string | null) => void;
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
  ledgerMasters?: LedgerMaster[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  setView,
  setActiveMasterTab,
  activeSamples,
  onToggleSample,
  setReportBankActiveTab,
  defaultTab,
  onTabChange,
  ledgerMasters = [],
}) => {
  const [workspaceName, setWorkspaceName] = useState("Bharat Book Enterprise");
  const [displayId, setDisplayId] = useState("BBE-2026-IND");
  const [fiscalYear, setFiscalYear] = useState(
    "April to March (Indian Standard)",
  );
  const [appMode, setAppMode] = useState("demo");
  const [language, setLanguage] = useState("en-IN");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [theme, setTheme] = useState("system");
  const [autoLock, setAutoLock] = useState("15");
  const [density, setDensity] = useState("standard");
  const [animations, setAnimations] = useState("enabled");
  const [soundEffects, setSoundEffects] = useState("disabled");
  const [keyboardShortcuts, setKeyboardShortcuts] = useState("enabled");
  const [weekStartsOn, setWeekStartsOn] = useState("sunday");
  const [paginationSize, setPaginationSize] = useState("50");

  // Noise Lists
  const [bankShortCodes, setBankShortCodes] = useState<string>(
    BANK_SHORT_CODES.join(", "),
  );
  const [bankIgnoreWords, setBankIgnoreWords] = useState<string>(
    BANK_IGNORE_WORDS.join(", "),
  );
  const [paymentModes, setPaymentModes] = useState<string>(
    PAYMENT_MODES.join(", "),
  );
  const [paymentChannels, setPaymentChannels] = useState<string>(
    PAYMENT_CHANNELS.join(", "),
  );
  const [ifscPrefixes, setIfscPrefixes] = useState<string>(
    IFSC_PREFIXES.join(", "),
  );

  const [bankMappings, setBankMappings] = useState([
    { name: "Union Bank Current A/c", no: "314502010012345", type: "Current" },
    { name: "HDFC Bank Current A/c", no: "50200021344321", type: "Current" },
    {
      name: "ICICI Bank Savings A/c",
      no: "00040103998899",
      type: "Personal Savings",
    },
  ]);

  // Structural Extraction Settings
  const [sourceColumn, setSourceColumn] = useState("Narration");
  const [splitDelimiter, setSplitDelimiter] = useState("/");
  const [ignoreExtractionKeywords, setIgnoreExtractionKeywords] = useState(
    "UPI, IMPS, NEFT, RTGS, TRANSFER, REF, TXN",
  );
  const [partyNameLocation, setPartyNameLocation] = useState(
    "Auto-Detect (AI Structural Parsing)",
  );
  const [utrExtractorType, setUtrExtractorType] = useState(
    "12-16 Digit Alphanumeric Sequence",
  );
  const [accountNumberDetection, setAccountNumberDetection] = useState(
    "Enabled (9+ Digits anywhere)",
  );

  const [advancedParsingEnabled, setAdvancedParsingEnabled] = useState(false);
  const [mappingRules, setMappingRules] =
    useState<{ kw: string; led: string }[]>(initialMappingRules);
  const [customMappingRules, setCustomMappingRules] = useState<
    {
      id: string;
      keyword: string;
      targetField: "partyName" | "ledger" | "type";
      targetValue: string;
      isRegex?: boolean;
    }[]
  >([]);
  const [bankChargesKeywords, setBankChargesKeywords] = useState(
    "CHG, CHRG, FEE, COMMISSION",
  );
  const [cashFlowKeywords, setCashFlowKeywords] = useState(
    "CASH DEP, CASH WDL, ATM",
  );
  const [selfTransferKeywords, setSelfTransferKeywords] =
    useState("SELF, INTERNET TXN");
  const [missingMasterAction, setMissingMasterAction] =
    useState("Prompt to Create");
  const [processingPriority, setProcessingPriority] =
    useState("Extract -> Match");
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [aliases, setAliases] = useState<{ from: string; to: string }[]>([
    { from: "ZOMATO MEDIA PVT L", to: "Zomato Ltd" },
    { from: "SWIGGY INSTAMART", to: "Bundl Tech" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toggles, setToggles] = useState({
    dailyAlerts: true,
    unmappedAlerts: true,
    weeklyAnalysis: false,
    anonymousReporting: true,
    autoClassifyImports: true,
    autoCreateMissing: false,
    autoMatchLedgerGstin: true,
    smartNarrationCleanup: true,
    extractDateFromFileName: false,
    stripEntitySuffixes: false,
    mobileNumberExtractor: false,
    fuzzyLogic: false,
    continuousLearning: false,
    autoContraDetection: true,
    identifyMobileTransfer: true,
    autoDetectGstin: true,
    autoDetectPanTan: true,
    sectionBasicEnabled: true,
    sectionListEnabled: true,
    sectionPatternEnabled: false,
    sectionMappingListEnabled: true,
    sectionSandboxEnabled: false,
    subBankShortCodesEnabled: true,
    subBankIgnoreWordsEnabled: true,
    subPaymentModesEnabled: true,
    subPaymentChannelsEnabled: true,
    subIfscPrefixesEnabled: true,
  });

  const [sandboxInput, setSandboxInput] = useState(
    "UPI/12345Z98X7/ZOMATO MEDIA PVT L/HDFC/PAYMENT/FOOD/9876543210",
  );
  const [sandboxResult, setSandboxResult] = useState<{
    partyKey: string;
    personName: string;
    category: string;
    reference: string;
    status: string;
    color: string;
    mobile: string;
    bankAccount: string;
    bankName: string;
    txnType: string;
    voucherType: string;
    senderReceiverDetails: string;
    confidence: string;
    partyKeyConf: number;
    personNameConf: number;
    categoryConf: number;
    referenceConf: number;
    mobileConf: number;
    bankAccountConf: number;
    bankNameConf: number;
    txnTypeConf: number;
    voucherTypeConf: number;
    senderReceiverDetailsConf: number;
  } | null>(null);

  const [bulkSandboxResults, setBulkSandboxResults] = useState<any[]>([]);

  const runSandboxSimulator = () => {
    const result = runMappingSimulation(sandboxInput, {
      mappingRules,
      aliases,
      bankChargesKeywords,
      cashFlowKeywords,
      selfTransferKeywords,
      toggles,
      // Pass structural extraction settings
      sourceColumn,
      splitDelimiter,
      ignoreExtractionKeywords,
      partyNameLocation,
      utrExtractorType,
      accountNumberDetection,
      // Pass noise lists
      bankShortCodes,
      bankIgnoreWords,
      paymentModes,
      paymentChannels,
      ifscPrefixes,
    });
    setSandboxResult(result);
  };

  const runBulkSimulator = (inputs: string[]) => {
    const results = inputs
      .filter((input) => input.trim().length > 0)
      .map((input) => {
        const result = runMappingSimulation(input, {
          mappingRules,
          aliases,
          bankChargesKeywords,
          cashFlowKeywords,
          selfTransferKeywords,
          toggles,
          sourceColumn,
          splitDelimiter,
          ignoreExtractionKeywords,
          partyNameLocation,
          utrExtractorType,
          accountNumberDetection,
          // Pass noise lists
          bankShortCodes,
          bankIgnoreWords,
          paymentModes,
          paymentChannels,
          ifscPrefixes,
        });
        return {
          narration: input,
          partyName: result.partyKey,
          confidence: result.confidence,
          status: result.status,
          color: result.color,
        };
      });
    setBulkSandboxResults(results);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => {
      const newValue = !prev[key];
      const newState = { ...prev, [key]: newValue };

      // Cascade logic for "Basic Rule" section
      if (key === "sectionBasicEnabled") {
        newState.autoContraDetection = newValue;
        newState.identifyMobileTransfer = newValue;
        newState.autoDetectGstin = newValue;
        newState.autoDetectPanTan = newValue;
      }
      // Cascade logic for "List Rule" section
      else if (key === "sectionListEnabled") {
        newState.subBankShortCodesEnabled = newValue;
        newState.subBankIgnoreWordsEnabled = newValue;
        newState.subPaymentModesEnabled = newValue;
        newState.subPaymentChannelsEnabled = newValue;
        newState.subIfscPrefixesEnabled = newValue;
      }
      // Cascade logic for "Pattern Rule" section
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

  const [aiSettings, setAiSettings] = useState({
    provider: "internal", // 'internal' | 'external'
    internalModel: "gemini-1.5-flash",
    externalProvider: "9router",
    apiKey: "",
    model: "llama-3-70b",
    baseUrl: "http://localhost:20128/v1",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "users"
    | "alerts"
    | "security"
    | "privacy"
    | "imports"
    | "mapping"
    | "ai"
    | "sample"
    | "admin"
    | "data"
    | "navigation"
    | "invoiceprint"
    | "formdetails"
    | "firm"
  >((defaultTab as any) || "general");

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab as any);
    }
  }, [defaultTab, activeTab]);

  useEffect(() => {
    const scrollToTab = () => {
      const el = document.getElementById(`settings-tab-${activeTab}`);
      const container = el?.closest(".overflow-x-auto") as HTMLElement;
      if (el && container) {
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (cRect.width === 0 || eRect.width === 0) return;

        const offset =
          eRect.left + eRect.width / 2 - (cRect.left + cRect.width / 2);

        if (Math.abs(offset) > 2) {
          container.scrollBy({ left: offset, behavior: "smooth" });
        }
      }
    };

    scrollToTab();
    const t1 = setTimeout(scrollToTab, 100);
    const t2 = setTimeout(scrollToTab, 300);
    const t3 = setTimeout(scrollToTab, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeTab]);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const loadFromLocalStorage = () => {
    const savedSettings = localStorage.getItem("bharat_book_app_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.workspaceName) setWorkspaceName(parsed.workspaceName);
        else if (parsed.companyName) setWorkspaceName(parsed.companyName);
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
        if (parsed.bankMappings) setBankMappings(parsed.bankMappings);

        // Load Noise Lists
        if (parsed.bankShortCodes) setBankShortCodes(parsed.bankShortCodes);
        if (parsed.bankIgnoreWords) setBankIgnoreWords(parsed.bankIgnoreWords);
        if (parsed.paymentModes) setPaymentModes(parsed.paymentModes);
        if (parsed.paymentChannels) setPaymentChannels(parsed.paymentChannels);
        if (parsed.ifscPrefixes) setIfscPrefixes(parsed.ifscPrefixes);

        if (parsed.toggles)
          setToggles((prev) => ({ ...prev, ...parsed.toggles }));
        if (parsed.aliases) setAliases(parsed.aliases);
        if (
          parsed.missingMasterAction === "Silently Create New Party" ||
          !parsed.missingMasterAction
        ) {
          setMissingMasterAction("Prompt to Create");
        } else {
          setMissingMasterAction(parsed.missingMasterAction);
        }

        if (
          parsed.processingPriority ===
            "1. Extract from Statement -> 2. Match with Master (Recommended)" ||
          !parsed.processingPriority
        ) {
          setProcessingPriority("Extract -> Match");
        } else {
          setProcessingPriority(parsed.processingPriority);
        }
        if (parsed.bankChargesKeywords)
          setBankChargesKeywords(parsed.bankChargesKeywords);
        if (parsed.cashFlowKeywords)
          setCashFlowKeywords(parsed.cashFlowKeywords);
        if (parsed.selfTransferKeywords)
          setSelfTransferKeywords(parsed.selfTransferKeywords);
        if (parsed.customMappingRules)
          setCustomMappingRules(parsed.customMappingRules);
        if (parsed.aiSettings) setAiSettings(parsed.aiSettings);

        // Load Structural Settings
        if (parsed.sourceColumn) setSourceColumn(parsed.sourceColumn);
        if (parsed.splitDelimiter) setSplitDelimiter(parsed.splitDelimiter);
        if (parsed.ignoreExtractionKeywords)
          setIgnoreExtractionKeywords(parsed.ignoreExtractionKeywords);
        if (parsed.partyNameLocation)
          setPartyNameLocation(parsed.partyNameLocation);
        if (parsed.utrExtractorType)
          setUtrExtractorType(parsed.utrExtractorType);
        if (parsed.accountNumberDetection)
          setAccountNumberDetection(parsed.accountNumberDetection);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
        // Load defaults from sample-data if NO local storage settings exist
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
                // Strip quotes if any
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1);
                }
                parsed[key.trim()] = val;
              }
            });
          } else {
            parsed = JSON.parse(content);
          }

          if (parsed.workspaceName) setWorkspaceName(parsed.workspaceName);
          else if (parsed.companyName) setWorkspaceName(parsed.companyName);
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
    setWorkspaceName("Bharat Book Enterprise");
    setDisplayId("BBE-2026-IND");
    setFiscalYear("April to March (Indian Standard)");
    setAppMode("demo");
    setLanguage("en-IN");
    setDateFormat("DD/MM/YYYY");
    setTimezone("Asia/Kolkata");
    setTheme("system");
    setAutoLock("15");
    setDensity("standard");
    setAnimations("enabled");
    setSoundEffects("disabled");
    setKeyboardShortcuts("enabled");
    setWeekStartsOn("sunday");
    setPaginationSize("50");
  };

  const handleClear = () => {
    setWorkspaceName("");
    setDisplayId("");
    setFiscalYear("");
    setAppMode("");
    setLanguage("");
    setDateFormat("");
    setTimezone("");
    setTheme("");
    setAutoLock("");
    setDensity("");
    setAnimations("");
    setSoundEffects("");
    setKeyboardShortcuts("");
    setWeekStartsOn("");
    setPaginationSize("");
  };

  const handleSave = () => {
    const settings = {
      workspaceName,
      displayId,
      fiscalYear,
      appMode,
      language,
      dateFormat,
      timezone,
      theme,
      autoLock,
      density,
      animations,
      soundEffects,
      keyboardShortcuts,
      weekStartsOn,
      paginationSize,
      bankMappings,
      bankShortCodes,
      bankIgnoreWords,
      paymentModes,
      paymentChannels,
      ifscPrefixes,
      toggles,
      aliases,
      missingMasterAction,
      processingPriority,
      bankChargesKeywords,
      cashFlowKeywords,
      selfTransferKeywords,
      customMappingRules,
      aiSettings,
      // Save Structural Settings
      sourceColumn,
      splitDelimiter,
      ignoreExtractionKeywords,
      partyNameLocation,
      utrExtractorType,
      accountNumberDetection,
    };
    localStorage.setItem("bharat_book_app_settings", JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-none mb-2">
          System Configuration
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium font-sans">
          Manage your enterprise preferences and audit settings
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden custom-scrollbar pb-1 custom-scrollbar">
          <div className="flex flex-row space-x-2 min-w-max px-1">
            <button
              id="settings-tab-firm"
              onClick={() => handleTabChange("firm")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "firm" ? "bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50 border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <AdminIcon className="mr-3" /> Firm
            </button>
            <button
              id="settings-tab-general"
              onClick={() => handleTabChange("general")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "general" ? "bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50 border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <SettingsIcon className="mr-3" /> General
            </button>
            <button
              id="settings-tab-navigation"
              onClick={() => handleTabChange("navigation")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "navigation" ? "bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50 border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <SettingsIcon className="mr-3" /> App Defaults
            </button>
            <button
              id="settings-tab-vouchernumbering"
              onClick={() => handleTabChange("vouchernumbering")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "vouchernumbering" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> Voucher Numbering
            </button>
            <button
              id="settings-tab-invoiceprint"
              onClick={() => handleTabChange("invoiceprint")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "invoiceprint" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <LayoutIcon className="mr-3" /> Invoice & Print
            </button>
            <button
              id="settings-tab-formdetails"
              onClick={() => handleTabChange("formdetails")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "formdetails" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <LayoutIcon className="mr-3" /> Form Detail
            </button>
            <button
              id="settings-tab-users"
              onClick={() => handleTabChange("users")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <AccountIcon className="mr-3" /> Users
            </button>
            <button
              id="settings-tab-alerts"
              onClick={() => handleTabChange("alerts")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "alerts" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <NotificationsIcon className="mr-3" /> Alerts
            </button>
            <button
              id="settings-tab-security"
              onClick={() => handleTabChange("security")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "security" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SecurityIcon className="mr-3" /> Security
            </button>
            <button
              id="settings-tab-privacy"
              onClick={() => handleTabChange("privacy")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "privacy" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <InfoIcon className="mr-3" /> Privacy
            </button>
            <button
              id="settings-tab-imports"
              onClick={() => handleTabChange("imports")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "imports" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> Import Rules
            </button>
            <button
              id="settings-tab-mapping"
              onClick={() => handleTabChange("mapping")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "mapping" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> Mapping
            </button>
            <button
              id="settings-tab-ai"
              onClick={() => handleTabChange("ai")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "ai" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <AIToolsIcon className="mr-3" /> AI Engines
            </button>
            <button
              id="settings-tab-sample"
              onClick={() => handleTabChange("sample")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "sample" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> Sample
            </button>
            <button
              id="settings-tab-admin"
              onClick={() => handleTabChange("admin")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "admin" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <AdminIcon className="mr-3" /> Admin
            </button>
            <button
              id="settings-tab-data"
              onClick={() => handleTabChange("data")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "data" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <CodeIcon className="mr-3" /> Data Explorer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === "ai" && (
            <AISettings
              aiSettings={aiSettings}
              setAiSettings={setAiSettings}
              handleSave={handleSave}
              isSaved={isSaved}
            />
          )}

          {activeTab === "sample" && (
            <SampleSettings
              setView={setView}
              setActiveMasterTab={setActiveMasterTab}
              activeSamples={activeSamples}
              onToggleSample={onToggleSample}
              setReportBankActiveTab={setReportBankActiveTab}
            />
          )}

          {activeTab === "general" && (
            <GeneralSettings
              workspaceName={workspaceName}
              setWorkspaceName={setWorkspaceName}
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              dateFormat={dateFormat}
              setDateFormat={setDateFormat}
              timezone={timezone}
              setTimezone={setTimezone}
              autoLock={autoLock}
              setAutoLock={setAutoLock}
              density={density}
              setDensity={setDensity}
              animations={animations}
              setAnimations={setAnimations}
              soundEffects={soundEffects}
              setSoundEffects={setSoundEffects}
              keyboardShortcuts={keyboardShortcuts}
              setKeyboardShortcuts={setKeyboardShortcuts}
              weekStartsOn={weekStartsOn}
              setWeekStartsOn={setWeekStartsOn}
              paginationSize={paginationSize}
              setPaginationSize={setPaginationSize}
              displayId={displayId}
              setDisplayId={setDisplayId}
              appMode={appMode}
              setAppMode={setAppMode}
              handleSave={handleSave}
              handleLoad={handleLoad}
              handleReset={handleReset}
              handleClear={handleClear}
              isSaved={isSaved}
            />
          )}

          {activeTab === "vouchernumbering" && <VoucherNumberingSettings />}

          {activeTab === "invoiceprint" && <InvoicePrintSettings />}

          {activeTab === "formdetails" && <FormDetailSettings />}

          {activeTab === "firm" && <FirmSettings ledgerMasters={ledgerMasters} />}

          {activeTab === "users" && <UserSettings />}

          {activeTab === "alerts" && (
            <AlertSettings toggles={toggles} handleToggle={handleToggle} />
          )}

          {activeTab === "security" && <SecuritySettings />}

          {activeTab === "privacy" && (
            <PrivacySettings toggles={toggles} handleToggle={handleToggle} />
          )}

          {activeTab === "imports" && (
            <ImportSettings toggles={toggles} handleToggle={handleToggle} />
          )}

          {activeTab === "admin" && <AdminSettings />}

          {activeTab === "navigation" && <AppNavigationSettings />}

          {activeTab === "data" && <DataExplorer />}

          {activeTab === "mapping" && (
            <MappingSettings
              advancedParsingEnabled={advancedParsingEnabled}
              setAdvancedParsingEnabled={setAdvancedParsingEnabled}
              toggles={toggles}
              handleToggle={handleToggle}
              customMappingRules={customMappingRules}
              setCustomMappingRules={setCustomMappingRules}
              bankMappings={bankMappings}
              setBankMappings={setBankMappings}
              bankChargesKeywords={bankChargesKeywords}
              setBankChargesKeywords={setBankChargesKeywords}
              cashFlowKeywords={cashFlowKeywords}
              setCashFlowKeywords={setCashFlowKeywords}
              selfTransferKeywords={selfTransferKeywords}
              setSelfTransferKeywords={setSelfTransferKeywords}
              mappingRules={mappingRules}
              setMappingRules={setMappingRules}
              missingMasterAction={missingMasterAction}
              setMissingMasterAction={setMissingMasterAction}
              processingPriority={processingPriority}
              setProcessingPriority={setProcessingPriority}
              aliases={aliases}
              setAliases={setAliases}
              fileInputRef={fileInputRef}
              showAliasModal={showAliasModal}
              setShowAliasModal={setShowAliasModal}
              sandboxInput={sandboxInput}
              setSandboxInput={setSandboxInput}
              runSandboxSimulator={runSandboxSimulator}
              sandboxResult={sandboxResult}
              runBulkSimulator={runBulkSimulator}
              bulkSandboxResults={bulkSandboxResults}
              setBulkSandboxResults={setBulkSandboxResults}
              // Structural Settings Props
              sourceColumn={sourceColumn}
              setSourceColumn={setSourceColumn}
              splitDelimiter={splitDelimiter}
              setSplitDelimiter={setSplitDelimiter}
              ignoreExtractionKeywords={ignoreExtractionKeywords}
              setIgnoreExtractionKeywords={setIgnoreExtractionKeywords}
              partyNameLocation={partyNameLocation}
              setPartyNameLocation={setPartyNameLocation}
              utrExtractorType={utrExtractorType}
              setUtrExtractorType={setUtrExtractorType}
              accountNumberDetection={accountNumberDetection}
              setAccountNumberDetection={setAccountNumberDetection}
              // Pass noise lists
              bankShortCodes={bankShortCodes}
              setBankShortCodes={setBankShortCodes}
              bankIgnoreWords={bankIgnoreWords}
              setBankIgnoreWords={setBankIgnoreWords}
              paymentModes={paymentModes}
              setPaymentModes={setPaymentModes}
              paymentChannels={paymentChannels}
              setPaymentChannels={setPaymentChannels}
              ifscPrefixes={ifscPrefixes}
              setIfscPrefixes={setIfscPrefixes}
            />
          )}

          <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-2">
              Version Information
            </h3>
            <p className="text-xs text-blue-700 font-medium italic opacity-75">
              Bharat Book AI - Professional Edition v2.4.0
            </p>
            <div className="mt-4 p-4 bg-white/50 rounded-xl text-[10px] font-bold text-blue-600 uppercase tracking-widest dark:bg-gray-800/50">
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
