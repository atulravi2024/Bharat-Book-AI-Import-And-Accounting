import { useState, useRef, useEffect } from "react";
import { initialMappingRules, runMappingSimulation } from "../../../../services/mappingService";
import { useNotifications } from "../../../../context/NotificationContext";
import { useLanguage } from "../../../../context/LanguageContext";
import {
  BANK_SHORT_CODES,
  BANK_IGNORE_WORDS,
} from "../../../../services/import-engine/phase4-enhancers/matching/bankCodes";
import {
  PAYMENT_MODES,
  PAYMENT_CHANNELS,
} from "../../../../services/import-engine/phase4-enhancers/matching/paymentModes";
import { IFSC_PREFIXES } from "../../../../services/import-engine/phase4-enhancers/matching/ifscCodes";

export const useSettingsState = (defaultTab: string | null, onTabChange?: (tab: string | null) => void, onAppModeChange?: (mode: string) => void) => {
  const { addNotification } = useNotifications();
  const { language, setLanguage, t } = useLanguage();

  const [activeModalDoc, setActiveModalDoc] = useState<{ title: string; content: string } | null>(null);
  const [updateStatus, setUpdateStatus] = useState<"idle" | "checking" | "latest">("idle");
  const [downloadStatus, setDownloadStatus] = useState<Record<string, "idle" | "downloading" | "completed">>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);
  const [isLegacyPanelExpanded, setIsLegacyPanelExpanded] = useState(false);
  const [displayId, setDisplayId] = useState("BBE-2026-IND");
  const [fiscalYear, setFiscalYear] = useState("April to March (Indian Standard)");
  const [appMode, setAppMode] = useState("demo");
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
  const [bankShortCodes, setBankShortCodes] = useState<string>(BANK_SHORT_CODES.join(", "));
  const [bankIgnoreWords, setBankIgnoreWords] = useState<string>(BANK_IGNORE_WORDS.join(", "));
  const [paymentModes, setPaymentModes] = useState<string>(PAYMENT_MODES.join(", "));
  const [paymentChannels, setPaymentChannels] = useState<string>(PAYMENT_CHANNELS.join(", "));
  const [ifscPrefixes, setIfscPrefixes] = useState<string>(IFSC_PREFIXES.join(", "));

  const [bankMappings, setBankMappings] = useState([
    { name: "Union Bank Current A/c", no: "314502010012345", type: "Current" },
    { name: "HDFC Bank Current A/c", no: "50200021344321", type: "Current" },
    { name: "ICICI Bank Savings A/c", no: "00040103998899", type: "Personal Savings" },
  ]);

  // Structural Extraction Settings
  const [sourceColumn, setSourceColumn] = useState("Narration");
  const [splitDelimiter, setSplitDelimiter] = useState("/");
  const [ignoreExtractionKeywords, setIgnoreExtractionKeywords] = useState("UPI, IMPS, NEFT, RTGS, TRANSFER, REF, TXN");
  const [partyNameLocation, setPartyNameLocation] = useState("Auto-Detect (AI Structural Parsing)");
  const [utrExtractorType, setUtrExtractorType] = useState("12-16 Digit Alphanumeric Sequence");
  const [accountNumberDetection, setAccountNumberDetection] = useState("Enabled (9+ Digits anywhere)");

  const [advancedParsingEnabled, setAdvancedParsingEnabled] = useState(false);
  const [mappingRules, setMappingRules] = useState<{ kw: string; led: string }[]>(initialMappingRules);
  const [customMappingRules, setCustomMappingRules] = useState<
    { id: string; keyword: string; targetField: "partyName" | "ledger" | "type"; targetValue: string; isRegex?: boolean; }[]
  >([]);
  const [bankChargesKeywords, setBankChargesKeywords] = useState("CHG, CHRG, FEE, COMMISSION");
  const [cashFlowKeywords, setCashFlowKeywords] = useState("CASH DEP, CASH WDL, ATM");
  const [selfTransferKeywords, setSelfTransferKeywords] = useState("SELF, INTERNET TXN");
  const [missingMasterAction, setMissingMasterAction] = useState("Prompt to Create");
  const [processingPriority, setProcessingPriority] = useState("Extract -> Match");
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [aliases, setAliases] = useState<{ from: string; to: string }[]>([
    { from: "ZOMATO MEDIA PVT L", to: "Zomato Ltd" },
    { from: "SWIGGY INSTAMART", to: "Bundl Tech" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toggles, setToggles] = useState({
    inApp_dailyAlerts: true, inApp_weeklyAnalysis: false, inApp_systemUpdateAlerts: true, inApp_stockThresholdAlerts: true,
    inApp_paymentOverdueAlerts: true, inApp_largeTransactionAlerts: true, inApp_unmappedAlerts: true, inApp_securityLoginAlerts: true,
    inApp_gstFilingReminders: true, inApp_incomeTaxReminders: true, inApp_bankSyncErrors: true, inApp_approvalRequests: true,
    inApp_dataAnomalyAlerts: true, inApp_taxComplianceAlerts: true, inApp_budgetUtilizationAlerts: true, inApp_cashflowAlerts: true,
    email_dailyAlerts: true, email_weeklyAnalysis: true, email_systemUpdateAlerts: true, email_stockThresholdAlerts: true,
    email_paymentOverdueAlerts: true, email_largeTransactionAlerts: true, email_unmappedAlerts: true, email_securityLoginAlerts: true,
    email_gstFilingReminders: true, email_incomeTaxReminders: true, email_bankSyncErrors: true, email_approvalRequests: true,
    email_dataAnomalyAlerts: false, email_taxComplianceAlerts: true, email_budgetUtilizationAlerts: false, email_cashflowAlerts: true,
    sms_dailyAlerts: false, sms_weeklyAnalysis: false, sms_systemUpdateAlerts: false, sms_stockThresholdAlerts: false,
    sms_paymentOverdueAlerts: false, sms_largeTransactionAlerts: false, sms_unmappedAlerts: false, sms_securityLoginAlerts: false,
    sms_gstFilingReminders: false, sms_incomeTaxReminders: false, sms_bankSyncErrors: false, sms_approvalRequests: false,
    sms_dataAnomalyAlerts: false, sms_taxComplianceAlerts: false, sms_budgetUtilizationAlerts: false, sms_cashflowAlerts: false,
    whatsapp_dailyAlerts: false, whatsapp_weeklyAnalysis: false, whatsapp_systemUpdateAlerts: false, whatsapp_stockThresholdAlerts: false,
    whatsapp_paymentOverdueAlerts: false, whatsapp_largeTransactionAlerts: false, whatsapp_unmappedAlerts: false, whatsapp_securityLoginAlerts: false,
    whatsapp_gstFilingReminders: false, whatsapp_incomeTaxReminders: false, whatsapp_bankSyncErrors: false, whatsapp_approvalRequests: false,
    whatsapp_dataAnomalyAlerts: false, whatsapp_taxComplianceAlerts: false, whatsapp_budgetUtilizationAlerts: false, whatsapp_cashflowAlerts: false,
    telegram_dailyAlerts: false, telegram_weeklyAnalysis: false, telegram_systemUpdateAlerts: false, telegram_stockThresholdAlerts: false,
    telegram_paymentOverdueAlerts: false, telegram_largeTransactionAlerts: false, telegram_unmappedAlerts: false, telegram_securityLoginAlerts: false,
    telegram_gstFilingReminders: false, telegram_incomeTaxReminders: false, telegram_bankSyncErrors: false, telegram_approvalRequests: false,
    telegram_dataAnomalyAlerts: false, telegram_taxComplianceAlerts: false, telegram_budgetUtilizationAlerts: false, telegram_cashflowAlerts: false,
    anonymousReporting: true, autoClassifyImports: true, autoCreateMissing: false, autoMatchLedgerGstin: true, smartNarrationCleanup: true,
    extractDateFromFileName: false, stripEntitySuffixes: false, mobileNumberExtractor: false, fuzzyLogic: false, continuousLearning: false,
    autoContraDetection: true, identifyMobileTransfer: true, autoDetectGstin: true, autoDetectPanTan: true, sectionBasicEnabled: true,
    sectionListEnabled: true, sectionPatternEnabled: false, sectionMappingListEnabled: true, sectionSandboxEnabled: false,
    subBankShortCodesEnabled: true, subBankIgnoreWordsEnabled: true, subPaymentModesEnabled: true, subPaymentChannelsEnabled: true,
    subIfscPrefixesEnabled: true,
  });

  const [sandboxInput, setSandboxInput] = useState("UPI/12345Z98X7/ZOMATO MEDIA PVT L/HDFC/PAYMENT/FOOD/9876543210");
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);
  const [bulkSandboxResults, setBulkSandboxResults] = useState<any[]>([]);

  const [aiSettings, setAiSettings] = useState({
    provider: "internal", 
    internalModel: "gemini-2.5-flash", 
    chatModel: "gemini-2.5-flash", 
    bankingModel: "gemini-2.5-flash",
    auditModel: "gemini-2.5-flash",
    voucherModel: "gemini-2.5-flash", 
    externalProvider: "9router", 
    apiKey: "", 
    model: "llama-3-70b", 
    baseUrl: "http://localhost:20128/v1",
    systemProvider: "internal",
    chatProvider: "internal",
    bankingProvider: "internal",
    auditProvider: "internal",
    voucherProvider: "internal",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<any>((defaultTab as any) || "setting_categories");

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  return {
    addNotification, language, setLanguage, t, activeModalDoc, setActiveModalDoc,
    updateStatus, setUpdateStatus, downloadStatus, setDownloadStatus, downloadProgress, setDownloadProgress,
    expandedRelease, setExpandedRelease, isLegacyPanelExpanded, setIsLegacyPanelExpanded, displayId, setDisplayId,
    fiscalYear, setFiscalYear, appMode, setAppMode, dateFormat, setDateFormat, timezone, setTimezone,
    theme, setTheme, autoLock, setAutoLock, density, setDensity, animations, setAnimations,
    soundEffects, setSoundEffects, keyboardShortcuts, setKeyboardShortcuts, weekStartsOn, setWeekStartsOn,
    paginationSize, setPaginationSize, showSystemInfo, setShowSystemInfo, bankShortCodes, setBankShortCodes,
    bankIgnoreWords, setBankIgnoreWords, paymentModes, setPaymentModes, paymentChannels, setPaymentChannels,
    ifscPrefixes, setIfscPrefixes, bankMappings, setBankMappings, sourceColumn, setSourceColumn,
    splitDelimiter, setSplitDelimiter, ignoreExtractionKeywords, setIgnoreExtractionKeywords, partyNameLocation, setPartyNameLocation,
    utrExtractorType, setUtrExtractorType, accountNumberDetection, setAccountNumberDetection, advancedParsingEnabled, setAdvancedParsingEnabled,
    mappingRules, setMappingRules, customMappingRules, setCustomMappingRules, bankChargesKeywords, setBankChargesKeywords,
    cashFlowKeywords, setCashFlowKeywords, selfTransferKeywords, setSelfTransferKeywords, missingMasterAction, setMissingMasterAction,
    processingPriority, setProcessingPriority, showAliasModal, setShowAliasModal, aliases, setAliases, fileInputRef,
    toggles, setToggles, sandboxInput, setSandboxInput, sandboxResult, setSandboxResult, bulkSandboxResults, setBulkSandboxResults,
    aiSettings, setAiSettings, isSaved, setIsSaved, activeTab, setActiveTab
  };
};
