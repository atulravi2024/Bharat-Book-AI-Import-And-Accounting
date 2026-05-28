import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import releaseNotesText from "./documents/release_notes.txt?raw";
// @ts-ignore
import licenseAgreementText from "./documents/license_agreement.txt?raw";
// @ts-ignore
import privacyPolicyText from "./documents/privacy_policy.txt?raw";
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
import { AlertChannel } from "./AlertChannel";
import { SecuritySettings } from "./SecuritySettings";
import { PrivacySettings } from "./PrivacySettings";
import { ImportSettings } from "./ImportSettings";
import { MappingSettings } from "./MappingSettings";
import { AISettings } from "./AISettings";
import { AdminSettings } from "./AdminSettings";
import { DataExplorer } from "./DataExplorer";
import { AppNavigationSettings } from "./AppNavigationSettings";
import { VoucherNumberingSettings } from "./VoucherNumberingSettings";
import { InvoicePrintSettings } from "./InvoicePrintSettings";
import { FormDetailSettings } from "./FormDetailSettings";
import { FirmSettings } from "./FirmSettings";
import { useNotifications } from "../../context/NotificationContext";
import { 
  HelpCircle, 
  LifeBuoy, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  History, 
  Check, 
  AlertCircle, 
  DownloadCloud 
} from "lucide-react";
import { HelpSettings } from "./HelpSettings";
import { SupportSettings } from "./SupportSettings";

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

import { useLanguage } from "../../context/LanguageContext";

export interface SettingsViewProps {
  setView: (view: MainView) => void;
  setActiveMasterTab: (tab: string | null) => void;
  setReportBankActiveTab?: (tab: string | null) => void;
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
  ledgerMasters?: LedgerMaster[];
  onAppModeChange?: (mode: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  setView,
  setActiveMasterTab,
  setReportBankActiveTab,
  defaultTab,
  onTabChange,
  ledgerMasters = [],
  onAppModeChange,
}) => {
  const { addNotification } = useNotifications();
  const [activeModalDoc, setActiveModalDoc] = useState<{ title: string; content: string } | null>(null);
  
  // States for dynamic about-tab features
  const [updateStatus, setUpdateStatus] = useState<"idle" | "checking" | "latest">("idle");
  const [downloadStatus, setDownloadStatus] = useState<Record<string, "idle" | "downloading" | "completed">>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);
  const [isLegacyPanelExpanded, setIsLegacyPanelExpanded] = useState(false);
  const [displayId, setDisplayId] = useState("BBE-2026-IND");
  const [fiscalYear, setFiscalYear] = useState(
    "April to March (Indian Standard)",
  );
  const [appMode, setAppMode] = useState("demo");
  const { language, setLanguage, t } = useLanguage();
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
  const [showSystemInfo, setShowSystemInfo] = useState("yes");

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
    // In-App
    inApp_dailyAlerts: true,
    inApp_weeklyAnalysis: false,
    inApp_systemUpdateAlerts: true,
    inApp_stockThresholdAlerts: true,
    inApp_paymentOverdueAlerts: true,
    inApp_largeTransactionAlerts: true,
    inApp_unmappedAlerts: true,
    inApp_securityLoginAlerts: true,
    inApp_gstFilingReminders: true,
    inApp_incomeTaxReminders: true,
    inApp_bankSyncErrors: true,
    inApp_approvalRequests: true,
    inApp_dataAnomalyAlerts: true,
    inApp_taxComplianceAlerts: true,
    inApp_budgetUtilizationAlerts: true,
    inApp_cashflowAlerts: true,
    
    // Email
    email_dailyAlerts: true,
    email_weeklyAnalysis: true,
    email_systemUpdateAlerts: true,
    email_stockThresholdAlerts: true,
    email_paymentOverdueAlerts: true,
    email_largeTransactionAlerts: true,
    email_unmappedAlerts: true,
    email_securityLoginAlerts: true,
    email_gstFilingReminders: true,
    email_incomeTaxReminders: true,
    email_bankSyncErrors: true,
    email_approvalRequests: true,
    email_dataAnomalyAlerts: false,
    email_taxComplianceAlerts: true,
    email_budgetUtilizationAlerts: false,
    email_cashflowAlerts: true,
    
    // SMS
    sms_dailyAlerts: false,
    sms_weeklyAnalysis: false,
    sms_systemUpdateAlerts: false,
    sms_stockThresholdAlerts: false,
    sms_paymentOverdueAlerts: false,
    sms_largeTransactionAlerts: false,
    sms_unmappedAlerts: false,
    sms_securityLoginAlerts: false,
    sms_gstFilingReminders: false,
    sms_incomeTaxReminders: false,
    sms_bankSyncErrors: false,
    sms_approvalRequests: false,
    sms_dataAnomalyAlerts: false,
    sms_taxComplianceAlerts: false,
    sms_budgetUtilizationAlerts: false,
    sms_cashflowAlerts: false,
    
    // WhatsApp
    whatsapp_dailyAlerts: false,
    whatsapp_weeklyAnalysis: false,
    whatsapp_systemUpdateAlerts: false,
    whatsapp_stockThresholdAlerts: false,
    whatsapp_paymentOverdueAlerts: false,
    whatsapp_largeTransactionAlerts: false,
    whatsapp_unmappedAlerts: false,
    whatsapp_securityLoginAlerts: false,
    whatsapp_gstFilingReminders: false,
    whatsapp_incomeTaxReminders: false,
    whatsapp_bankSyncErrors: false,
    whatsapp_approvalRequests: false,
    whatsapp_dataAnomalyAlerts: false,
    whatsapp_taxComplianceAlerts: false,
    whatsapp_budgetUtilizationAlerts: false,
    whatsapp_cashflowAlerts: false,

    // Telegram
    telegram_dailyAlerts: false,
    telegram_weeklyAnalysis: false,
    telegram_systemUpdateAlerts: false,
    telegram_stockThresholdAlerts: false,
    telegram_paymentOverdueAlerts: false,
    telegram_largeTransactionAlerts: false,
    telegram_unmappedAlerts: false,
    telegram_securityLoginAlerts: false,
    telegram_gstFilingReminders: false,
    telegram_incomeTaxReminders: false,
    telegram_bankSyncErrors: false,
    telegram_approvalRequests: false,
    telegram_dataAnomalyAlerts: false,
    telegram_taxComplianceAlerts: false,
    telegram_budgetUtilizationAlerts: false,
    telegram_cashflowAlerts: false,
    
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
    internalModel: "gemini-2.5-flash",
    chatModel: "gemini-2.5-flash",
    bankingModel: "gemini-2.5-flash",
    voucherModel: "gemini-2.5-flash",
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
    | "vouchernumbering"
    | "invoiceprint"
    | "formdetails"
    | "firm"
    | "help"
    | "support"
    | "about"
  >((defaultTab as any) || "about");

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab as any);
    }
  }, [defaultTab, activeTab]);

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
  }, []);

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
    setDisplayId("BBE-2026-IND");
    setFiscalYear("April to March (Indian Standard)");
    setAppMode("demo");
    setLanguage("en");
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
    setShowSystemInfo("yes");
  };

  const handleClear = () => {
    setDisplayId("");
    setFiscalYear("");
    setAppMode("");
    setLanguage("en");
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
    setShowSystemInfo("");
  };

  const handleSave = () => {
    const settings = {
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
      showSystemInfo,
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
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden custom-scrollbar pb-1 custom-scrollbar">
          <div className="flex flex-row space-x-2 min-w-max px-1">
            <button
              id="settings-tab-firm"
              onClick={() => handleTabChange("firm")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "firm" ? "bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50 border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <AdminIcon className="mr-3" /> {t("Firm")}
            </button>
            <button
              id="settings-tab-general"
              onClick={() => handleTabChange("general")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "general" ? "bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50 border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <SettingsIcon className="mr-3" /> {t("General")}
            </button>
            <button
              id="settings-tab-navigation"
              onClick={() => handleTabChange("navigation")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "navigation" ? "bg-blue-600 text-white shadow-lg dark:shadow-blue-900/50 border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <SettingsIcon className="mr-3" /> {t("App Defaults")}
            </button>
            <button
              id="settings-tab-vouchernumbering"
              onClick={() => handleTabChange("vouchernumbering")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "vouchernumbering" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> {t("Voucher Numbering")}
            </button>
            <button
              id="settings-tab-invoiceprint"
              onClick={() => handleTabChange("invoiceprint")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "invoiceprint" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <LayoutIcon className="mr-3" /> {t("Invoice & Print")}
            </button>
            <button
              id="settings-tab-formdetails"
              onClick={() => handleTabChange("formdetails")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "formdetails" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <LayoutIcon className="mr-3" /> {t("Form Detail")}
            </button>
            <button
              id="settings-tab-users"
              onClick={() => handleTabChange("users")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <AccountIcon className="mr-3" /> {t("Users")}
            </button>
            <button
              id="settings-tab-alerts"
              onClick={() => handleTabChange("alerts")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "alerts" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <NotificationsIcon className="mr-3" /> {t("Alert Channel")}
            </button>
            <button
              id="settings-tab-security"
              onClick={() => handleTabChange("security")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "security" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SecurityIcon className="mr-3" /> {t("Security")}
            </button>
            <button
              id="settings-tab-privacy"
              onClick={() => handleTabChange("privacy")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "privacy" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <InfoIcon className="mr-3" /> {t("Privacy")}
            </button>
            <button
              id="settings-tab-imports"
              onClick={() => handleTabChange("imports")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "imports" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> {t("Import Rules")}
            </button>
            <button
              id="settings-tab-mapping"
              onClick={() => handleTabChange("mapping")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "mapping" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <SettingsIcon className="mr-3" /> {t("Mapping")}
            </button>
            <button
              id="settings-tab-ai"
              onClick={() => handleTabChange("ai")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "ai" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <AIToolsIcon className="mr-3" /> {t("AI Engines")}
            </button>
            <button
              id="settings-tab-admin"
              onClick={() => handleTabChange("admin")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "admin" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <AdminIcon className="mr-3" /> {t("Admin")}
            </button>
            <button
              id="settings-tab-data"
              onClick={() => handleTabChange("data")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "data" ? "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-transparent" : "bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"} dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
            >
              <CodeIcon className="mr-3" /> {t("Data Explorer")}
            </button>
            <button
              id="settings-tab-help"
              onClick={() => handleTabChange("help")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "help" ? "bg-blue-600 text-white shadow-lg border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <HelpCircle className="mr-3 w-4 h-4" /> {t("Help Center")}
            </button>
            <button
              id="settings-tab-support"
              onClick={() => handleTabChange("support")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "support" ? "bg-blue-600 text-white shadow-lg border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <LifeBuoy className="mr-3 w-4 h-4" /> {t("Support")}
            </button>
            <button
              id="settings-tab-about"
              onClick={() => handleTabChange("about")}
              className={`flex-shrink-0 flex items-center p-3 px-6 rounded-2xl transition-all font-sans font-bold text-sm whitespace-nowrap ${activeTab === "about" ? "bg-blue-600 text-white shadow-lg border border-transparent" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent"}`}
            >
              <InfoIcon className="mr-3 w-4 h-4" /> {t("About")}
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

          {activeTab === "general" && (
            <GeneralSettings
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
              showSystemInfo={showSystemInfo}
              setShowSystemInfo={setShowSystemInfo}
              displayId={displayId}
              setDisplayId={setDisplayId}
              appMode={appMode}
              setAppMode={setAppMode}
              handleSave={handleSave}
              handleLoad={handleLoad}
              handleReset={handleReset}
              handleClear={handleClear}
              handleDeleteAll={() => { localStorage.clear(); window.location.reload(); }}
              isSaved={isSaved}
            />
          )}

          {activeTab === "vouchernumbering" && <VoucherNumberingSettings />}

          {activeTab === "invoiceprint" && <InvoicePrintSettings appMode={appMode} />}

          {activeTab === "formdetails" && <FormDetailSettings />}

          {activeTab === "firm" && <FirmSettings ledgerMasters={ledgerMasters} />}

          {activeTab === "users" && <UserSettings />}

          {activeTab === "alerts" && (
            <AlertChannel toggles={toggles} handleToggle={handleToggle} />
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

          {activeTab === "help" && <HelpSettings />}

          {activeTab === "support" && <SupportSettings aiSettings={aiSettings} setAiSettings={setAiSettings} />}

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

          {activeTab === "about" && (
            <div className="space-y-6">
              {/* Header Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 border border-blue-400 dark:border-blue-500 overflow-hidden p-1.5">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-white"
                  >
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                    />
                    <path 
                      d="M7 12.2L10.5 15.7L17 9.2" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {t("Bharat Book AI")}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-2">
                  {t("Professional Edition")}
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-bold font-mono tracking-wider">
                    {t("Version 2.4.0")}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-xs font-bold font-mono tracking-wider border border-blue-100 dark:border-blue-800">
                    {t("Build 2404.19")}
                  </span>
                </div>
                
                <div className="w-full max-w-lg mb-6 space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-center">
                      {t("The most advanced AI-powered accounting software designed explicitly for Indian businesses. Featuring seamless GST compliance, intelligent categorization, and state-of-the-art reconciliation capabilities.")}
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setActiveModalDoc({ title: "Release Notes", content: releaseNotesText })}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {t("Release Notes")}
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <button 
                      onClick={() => setActiveModalDoc({ title: "License Agreement", content: licenseAgreementText })}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {t("License Agreement")}
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <button 
                      onClick={() => setActiveModalDoc({ title: "Privacy Policy", content: privacyPolicyText })}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {t("Privacy Policy")}
                    </button>
                  </div>
                </div>

                {/* Check for Updates Action Area */}
                <div className="w-full max-w-lg border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
                  <div className="flex flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 w-full min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-950 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                        {updateStatus === "checking" ? "Checking Server Protocols..." : "Updates Management"}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-450 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                        {updateStatus === "checking" 
                          ? "Connecting to Delhi distribution network..." 
                          : updateStatus === "latest" 
                          ? "System Up-to-Date: All compliance patches are current." 
                          : "Verify system compliance files on cloud servers."}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (updateStatus !== "idle") return;
                        setUpdateStatus("checking");
                        setTimeout(() => {
                          setUpdateStatus("latest");
                          addNotification({
                            title: "System Update",
                            message: "Bharat Book AI is running on the latest stable distribution version 2.4.0.",
                            type: "System",
                          });
                          setTimeout(() => setUpdateStatus("idle"), 5000);
                        }, 1800);
                      }}
                      disabled={updateStatus === "checking"}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all shadow-sm shrink-0 whitespace-nowrap ${
                        updateStatus === "checking" 
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${updateStatus === "checking" ? "animate-spin" : ""}`} />
                      {updateStatus === "checking" ? "Checking..." : updateStatus === "latest" ? "System Up-to-Date" : "Check for Update"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Previous Legacy Releases Archive Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Collapsible Panel Header */}
                <button
                  type="button"
                  onClick={() => setIsLegacyPanelExpanded(!isLegacyPanelExpanded)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/35 transition-colors text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      {t("Legacy Releases & previous downloads")}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    <span>{isLegacyPanelExpanded ? "Hide Panel" : "View Panel"}</span>
                    {isLegacyPanelExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                {/* Collapsible Panel Content */}
                {isLegacyPanelExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                      {t("Need to test a legacy database or rollback your client binaries? Locate previously compiled distributions, Indian localization patches, and download archived installers directly.")}
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          version: "2.3.5",
                          date: "March 15, 2026",
                          build: "Build 2351.44",
                          desc: "Stabilized 9-column pre-mapping tools and CSV templates. Integrated telemetry suite rules alongside audit trail constraints.",
                          notes: [
                            "Added custom B2C invoice state sorting checks.",
                            "Optimized SQLite memory allocations for background journal processing.",
                            "Initial delivery of offline-data hold toggles."
                          ]
                        },
                        {
                          version: "2.2.0",
                          date: "December 10, 2025",
                          build: "Build 2201.02",
                          desc: "Brought custom IGST vs CGST routing parameters under automated narration parsing pipelines.",
                          notes: [
                            "Resolved critical parsing glitches with Indian IFSC codes containing slash variables.",
                            "Implemented standard GSTR-1 state code checks on checkout.",
                            "Embedded manual ledger mapping dictionary features into Preferences."
                          ]
                        },
                        {
                          version: "2.0.4",
                          date: "October 02, 2025",
                          build: "Build 2040.11",
                          desc: "The initial enterprise release carrying AI-powered narrative prediction model integrations.",
                          notes: [
                            "Deployed primary company directory authorization gates (Auditor, Accountant, Viewer).",
                            "Designed responsive Balance Sheet, trial ledger totals, and voucher printers.",
                            "Created standard encrypted JSON exports and backups suite."
                          ]
                        },
                        {
                          version: "2.0.0",
                          date: "July 01, 2025",
                          build: "Build 2000.01",
                          desc: "Major framework advancement introducing a centralized settings control panel and the Indian Tax Code dictionary.",
                          notes: [
                            "Introduced the modular settings navigation layout for multi-faceted system preferences.",
                            "Integrated the local database indexers for blazing fast invoice and voucher fetching.",
                            "Added automatic Indian state-to-code maps to simplify GSTR-1 preparation workflows."
                          ]
                        },
                        {
                          version: "1.9.5",
                          date: "May 18, 2025",
                          build: "Build 1950.08",
                          desc: "Optimized sample-dataset injection routine with automated trial-balance checks and invoice layout updates.",
                          notes: [
                            "Added inline invoice print preview customization tools with fine-tuned margin and height adjustments.",
                            "Refined bank statement reconciling models with better narration keyword matching patterns.",
                            "Stabilized localized validation behaviors for pan-India fiscal periods."
                          ]
                        },
                        {
                          version: "1.8.0",
                          date: "March 11, 2025",
                          build: "Build 1800.52",
                          desc: "Enhanced service telemetry, diagnostic audit trails, and multi-user authentication safeguards.",
                          notes: [
                            "Launched the system diagnostic/integrity testing interface within User Settings.",
                            "Configured robust CSV and TXT import pipelines with real-time error feedback grids.",
                            "Implemented standard AES-256 local database snapshot backup generators."
                          ]
                        },
                        {
                          version: "1.5.0",
                          date: "December 05, 2024",
                          build: "Build 1500.10",
                          desc: "Optimized server-side pagination controllers and detailed ledger reports export modules.",
                          notes: [
                            "Completed high-speed PDF export routines for general ledgers and trial balance worksheets.",
                            "Resolved multi-device UI viewport boundary clipping anomalies on mobile dashboard lists.",
                            "Optimized the overall memory allocations during concurrent Excel sheet uploads."
                          ]
                        },
                        {
                          version: "1.0.0",
                          date: "August 01, 2024",
                          build: "Build 1000.00",
                          desc: "Initial public launch of Bharat Book AI's comprehensive digital bookkeeping platform.",
                          notes: [
                            "Deployed Core Voucher Entry system including Receipts, Payments, Sales, and Purchase types.",
                            "Built standard double-entry Ledger mapping engine with automatic ledger creation workflows.",
                            "Configured basic security, role-based controls, and system preferences options."
                          ]
                        }
                      ].map((rel) => {
                        const progress = downloadProgress[rel.version] || 0;
                        const status = downloadStatus[rel.version] || "idle";
                        const isExpanded = expandedRelease === rel.version;

                        return (
                          <div 
                            key={rel.version}
                            className="bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-250 hover:border-gray-300 dark:hover:border-gray-700"
                          >
                            {/* Summary Header */}
                            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-black text-gray-900 dark:text-white">
                                    Version {rel.version}
                                  </span>
                                  <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-450 px-1.5 py-0.5 rounded font-mono font-medium">
                                    {rel.build}
                                  </span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                                    • {rel.date}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-lg">
                                  {rel.desc}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Expand Changelog Details Button */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedRelease(isExpanded ? null : rel.version)}
                                  className="p-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 transition-colors"
                                >
                                  {isExpanded ? "Hide Logs" : "View Logs"}
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                {/* Download Action Wrapper */}
                                <button
                                  type="button"
                                  disabled={status === "downloading"}
                                  onClick={() => {
                                    if (status === "downloading") return;
                                    setDownloadStatus(prev => ({ ...prev, [rel.version]: "downloading" }));
                                    setDownloadProgress(prev => ({ ...prev, [rel.version]: 0 }));
                                    
                                    let currentPct = 0;
                                    const timer = setInterval(() => {
                                      currentPct += 20;
                                      setDownloadProgress(prev => ({ ...prev, [rel.version]: currentPct }));
                                      
                                      if (currentPct >= 100) {
                                        clearInterval(timer);
                                        setDownloadStatus(prev => ({ ...prev, [rel.version]: "completed" }));
                                        addNotification({
                                          title: "Download Successful",
                                          message: `Archived software installer BharatBook_${rel.version}_Setup.zip downloaded successfully.`,
                                          type: "System",
                                        });
                                        // Reset state back to idle after 5 seconds to let them test again
                                        setTimeout(() => {
                                          setDownloadStatus(prev => ({ ...prev, [rel.version]: "idle" }));
                                          setDownloadProgress(prev => ({ ...prev, [rel.version]: 0 }));
                                        }, 5000);
                                      }
                                    }, 350);
                                  }}
                                  className={`p-2 px-3 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                                    status === "downloading"
                                      ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 cursor-not-allowed"
                                      : status === "completed"
                                      ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                      : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-650 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                                  }`}
                                >
                                  {status === "downloading" ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                                      <span>Downloading ({progress}%)</span>
                                    </>
                                  ) : status === "completed" ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span>Downloaded (.zip)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-3 h-3 text-blue-500" />
                                      <span>{t("Download Installer")}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Animated Downloader Progress Bar */}
                            {status === "downloading" && (
                              <div className="w-full bg-gray-200 dark:bg-gray-800 h-1">
                                <div 
                                  className="bg-blue-600 h-1 transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}

                            {/* Collapsible Release Notes Details */}
                            {isExpanded && (
                              <div className="p-4 bg-gray-100/50 dark:bg-gray-950/30 border-t border-gray-150 dark:border-gray-800/80 text-xs text-gray-600 dark:text-gray-350 space-y-2">
                                <p className="font-bold text-[11px] text-gray-800 dark:text-gray-300">
                                  Detailed Release Changelog:
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                                  {rel.notes.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeModalDoc && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] transition-opacity duration-300"
              onClick={() => setActiveModalDoc(null)}
            >
              <div 
                className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {activeModalDoc.title}
                  </h3>
                  <button 
                    onClick={() => setActiveModalDoc(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500 dark:text-gray-400 font-bold"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900">
                  <pre className="whitespace-pre-wrap font-sans text-sm md:text-xs">
                    {activeModalDoc.content}
                  </pre>
                </div>
                
                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end bg-gray-50/50 dark:bg-gray-800/50">
                  <button 
                    onClick={() => setActiveModalDoc(null)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    {t("Close")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
