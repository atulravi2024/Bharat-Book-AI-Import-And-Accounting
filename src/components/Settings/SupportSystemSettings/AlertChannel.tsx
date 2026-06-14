import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationsIcon } from "../../icons/IconComponents";
import { useLanguage } from "../../../context/LanguageContext";
import { 
  Search, 
  Upload, 
  Download, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Save, 
  Info,
  Cpu,
  DollarSign,
  ClipboardList,
  Lock
} from 'lucide-react';

interface AlertItem {
  key: string;
  title: string;
  description: string;
  category: 'system' | 'financial' | 'compliance' | 'security';
}

const ALERT_ITEMS: AlertItem[] = [
  // System & Operations
  { key: 'dailyAlerts', title: 'Daily Summary Alerts', description: 'Receive a morning digest of imported vouchers and ledger entries.', category: 'system' },
  { key: 'weeklyAnalysis', title: 'Weekly Deep Analysis', description: 'Summarized financial growth metrics and activity for the past week.', category: 'system' },
  { key: 'systemUpdateAlerts', title: 'System & Backup', description: 'Instant notifications for data backup status and application updates.', category: 'system' },
  { key: 'bankSyncErrors', title: 'Bank Sync Errors', description: 'Alerts when auto-syncing with connected bank accounts fails.', category: 'system' },

  // Financial & Inventory
  { key: 'budgetUtilizationAlerts', title: 'Budget Utilization', description: 'Alerts when expenses exceed a certain threshold of allocated budgets.', category: 'financial' },
  { key: 'cashflowAlerts', title: 'Cash Flow & Balances', description: 'Get notified of critically low bank balances or abnormally high cash retention.', category: 'financial' },
  { key: 'stockThresholdAlerts', title: 'Low Stock Threshold', description: 'Triggers when a tracked item drops below its defined safety limit.', category: 'financial' },
  { key: 'largeTransactionAlerts', title: 'Large Transaction', description: 'Notifications for abnormally high value vouchers or transactions.', category: 'financial' },

  // Automation & Compliance
  { key: 'gstFilingReminders', title: 'GST Filing Reminders', description: 'Automated reminders for impending GST filing due dates.', category: 'compliance' },
  { key: 'incomeTaxReminders', title: 'Income Tax & Advance Tax', description: 'Reminders for Advance Tax installments and Income Tax Return filing due dates.', category: 'compliance' },
  { key: 'taxComplianceAlerts', title: 'Tax Compliance', description: 'Alerts for e-Invoice generation failures and TDS/TCS threshold limits.', category: 'compliance' },
  { key: 'paymentOverdueAlerts', title: 'Payment Overdue', description: 'Alerts for customers with outstanding and late invoice payments.', category: 'compliance' },

  // Security & Data
  { key: 'unmappedAlerts', title: 'Unmapped Vendor', description: 'Triggers when unknown or new vendors are found during standard imports.', category: 'security' },
  { key: 'dataAnomalyAlerts', title: 'Data Anomaly & Duplicates', description: 'Detect duplicate voucher numbers or suspiciously similar transactions.', category: 'security' },
  { key: 'approvalRequests', title: 'Pending Approvals', description: 'Notifications for items requiring Maker-Checker validation.', category: 'security' },
  { key: 'securityLoginAlerts', title: 'Unusual Login', description: 'Security warnings for login attempts from unfamiliar devices or locations.', category: 'security' },
];

interface AlertChannelProps {
  toggles: {
    [key: string]: boolean;
  };
  handleToggle: (key: string) => void;
  setToggles?: React.Dispatch<React.SetStateAction<any>>;
  handleSave?: () => void;
}

export const AlertChannel: React.FC<AlertChannelProps> = ({ 
  toggles, 
  handleToggle,
  setToggles,
  handleSave
}) => {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<'inApp' | 'email' | 'sms' | 'whatsapp' | 'telegram'>('inApp');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [isSavedLocal, setIsSavedLocal] = useState(false);

  // Collapsible category accordions state - single-expand accordion pattern
  // All accordion categories are collapsed by default (null) as requested.
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setActiveAccordion(prev => prev === category ? null : category);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Wheel translations for scrolling the subtabs horizontally
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tabsContainerRef.current) {
      e.preventDefault();
      tabsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Auto-scroll active subtab into focus
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        
      }
    }
  }, [subTab]);

  // Support subtab override trigger
  useEffect(() => {
    const handleOverride = () => {
      const override = localStorage.getItem('bharat_book_alerts_subtab_override');
      if (override) {
        if (['inApp', 'email', 'sms', 'whatsapp', 'telegram'].includes(override)) {
          setSubTab(override as any);
        }
        localStorage.removeItem('bharat_book_alerts_subtab_override');
      }
    };
    handleOverride();
    window.addEventListener('bharat_book_alerts_subtab_trigger', handleOverride);
    return () => window.removeEventListener('bharat_book_alerts_subtab_trigger', handleOverride);
  }, []);

  // Toolbar state toggling logic for mobile search focus expansion
  const isToolbarHiddenOnMobile = isSearchFocused || !!searchQuery;

  // Import alert channel toggles
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        let importedToggles: any = {};
        if (fileFormat === 'CSV') {
          const lines = content.split('\n');
          lines.forEach(line => {
            const [key, val] = line.split(',');
            if (key) {
              importedToggles[key.trim()] = val?.trim() === 'true';
            }
          });
        } else {
          importedToggles = JSON.parse(content);
        }

        if (setToggles) {
          setToggles(prev => ({
            ...prev,
            ...importedToggles
          }));
          alert(t("Notification channels imported successfully!"));
        }
      } catch (err) {
        alert(t("Failed to parse configurations file."));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export alert channel toggles
  const handleExportFile = () => {
    const exportData: Record<string, boolean> = {};
    const prefixes = ['inApp', 'email', 'sms', 'whatsapp', 'telegram'];
    
    Object.keys(toggles).forEach(key => {
      if (prefixes.some(pref => key.startsWith(pref + '_'))) {
        exportData[key] = toggles[key];
      }
    });

    let content = '';
    const filename = `alert_channels_export.${fileFormat.toLowerCase()}`;
    
    if (fileFormat === 'CSV') {
      content = 'key,value\n' + Object.entries(exportData)
        .map(([k, v]) => `${k},${v}`)
        .join('\n');
    } else {
      content = JSON.stringify(exportData, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset alert channel toggles to default values
  const handleReset = () => {
    if (setToggles) {
      setToggles(prev => {
        const next = { ...prev };
        ALERT_ITEMS.forEach(item => {
          next[`inApp_${item.key}`] = true;
          // default email alerts
          if ([
            'dailyAlerts', 'weeklyAnalysis', 'systemUpdateAlerts', 'stockThresholdAlerts', 
            'paymentOverdueAlerts', 'largeTransactionAlerts', 'unmappedAlerts', 'securityLoginAlerts', 
            'gstFilingReminders', 'incomeTaxReminders', 'bankSyncErrors', 'approvalRequests', 
            'taxComplianceAlerts', 'cashflowAlerts'
          ].includes(item.key)) {
            next[`email_${item.key}`] = true;
          } else {
            next[`email_${item.key}`] = false;
          }
          // sms/whatsapp/telegram default to false
          next[`sms_${item.key}`] = false;
          next[`whatsapp_${item.key}`] = false;
          next[`telegram_${item.key}`] = false;
        });
        return next;
      });
      alert(t("Notification rules reset to default configurations."));
    }
  };

  // Clear alert channel toggles (make everything false)
  const handleClear = () => {
    if (setToggles) {
      setToggles(prev => {
        const next = { ...prev };
        ALERT_ITEMS.forEach(item => {
          next[`inApp_${item.key}`] = false;
          next[`email_${item.key}`] = false;
          next[`sms_${item.key}`] = false;
          next[`whatsapp_${item.key}`] = false;
          next[`telegram_${item.key}`] = false;
        });
        return next;
      });
      alert(t("All notification rules have been cleared."));
    }
  };

  // Save current configurations
  const handleSaveConfig = () => {
    if (handleSave) {
      handleSave();
      setIsSavedLocal(true);
      setTimeout(() => setIsSavedLocal(false), 1500);
    }
  };

  // Search filtering logic of the alerts
  const filteredAlerts = ALERT_ITEMS.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesTitle = t(item.title).toLowerCase().includes(query) || item.title.toLowerCase().includes(query);
    const matchesDesc = t(item.description).toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
    return matchesTitle || matchesDesc;
  });

  const systemAlerts = filteredAlerts.filter(item => item.category === 'system');
  const financialAlerts = filteredAlerts.filter(item => item.category === 'financial');
  const complianceAlerts = filteredAlerts.filter(item => item.category === 'compliance');
  const securityAlerts = filteredAlerts.filter(item => item.category === 'security');

  const renderToggle = (prefix: string, key: string, title: string, subtitle: string) => {
    const fullKey = `${prefix}_${key}`;
    const isActive = !!toggles[fullKey];
    return (
      <div key={fullKey} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-all hover:bg-gray-100/50 dark:hover:bg-gray-850">
        <div className="mr-4">
          <p className="font-bold text-gray-900 text-sm dark:text-white leading-tight">{title}</p>
          <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400 leading-snug">{subtitle}</p>
        </div>
        <div 
          onClick={() => handleToggle(fullKey)} 
          className={`${isActive ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-all flex-shrink-0`}
          id={`alert-toggle-${fullKey}`}
        >
          <div className={`bg-white w-3 h-3 rounded-full absolute top-1 ${isActive ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      
      {/* 2-Row Stacked Header Layout responsive to Desktop/Mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <NotificationsIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider truncate leading-tight">
              {t("Notification Rules & Channels")}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-450 font-bold uppercase tracking-wider mt-0.5 truncate whitespace-nowrap">
              {t("Configure automated warming and notification integrations")}
            </p>
          </div>
        </div>

        {/* Flush right alignments matching margins */}
        <div className="min-w-0 flex-1 flex items-center">
          <div 
            ref={tabsContainerRef}
            onWheel={handleWheel}
            className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start min-w-0 scroll-smooth"
          >
            {(['inApp', 'email', 'sms', 'whatsapp', 'telegram'] as const).map((tab) => {
              const label = tab === 'inApp' ? t("In-App") : 
                            tab === 'email' ? t("Email") : 
                            tab === 'sms' ? t("SMS") : 
                            tab === 'whatsapp' ? t("WhatsApp") : t("Telegram");
              const isActive = subTab === tab;
              return (
                <button 
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  data-active={isActive}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept={fileFormat === 'JSON' ? '.json' : '.csv'}
        className="hidden"
      />

      {/* Dynamic Search & Compact Actions Toolbar row */}
      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search notification rules and triggers...")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                title={t("Clear search")}
            >
              <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Controls Toolbar - dynamic collapsible on mobile focus */}
        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto ${isToolbarHiddenOnMobile ? "hidden sm:flex" : "flex"}`}>
          
          {/* Format Selector Dropdown (Simple Input and Output Button) */}
          <div className="relative inline-flex items-center shrink-0">
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
              className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-150 dark:border-gray-750 hover:border-gray-350 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
              title={t("Simple Input and Output")}
            >
              <option value="JSON" className="bg-white dark:bg-gray-850">JSON</option>
              <option value="CSV" className="bg-white dark:bg-gray-850">CSV</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Import Configurations")}
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Import")}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportFile}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Export Configurations")}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Export")}</span>
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="hidden lg:flex px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-amber-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 items-center justify-center gap-1.5 shrink-0"
            title={t("Clear All Configurations")}
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-none">{t("Clear")}</span>
          </button>

          {/* Reset Defaults Button */}
          <button
            onClick={handleReset}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-655 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Reset Defaults")}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Reset")}</span>
          </button>

          {/* Save Configuration Button */}
          <button
            onClick={handleSaveConfig}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Save Config")}
          >
            {isSavedLocal ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
            <span className="hidden md:inline leading-none">{isSavedLocal ? t("Saved") : t("Save")}</span>
          </button>
        </div>
      </div>

      {/* Main Content Card Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 min-h-[450px] space-y-6">

        {/* Provider Info Dynamic Banner per channel */}
        <div className="p-4 rounded-2xl border transition-all duration-300 border-gray-150 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10">
        {subTab === 'email' && (
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/40 p-1 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-0.5">{t("Free Email Plan")}</p>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
                {t("For Indian users, the system can utilize the free tier of providers like Resend or SendGrid (100 free daily emails). Alternatively, configure your own Gmail/SMTP for a 100% free solution.")}
              </p>
            </div>
          </div>
        )}
        {subTab === 'sms' && (
          <div className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/40 p-1 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-0.5">{t("Free SMS Plan")}</p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                {t("We support MSG91 or Fast2SMS for enterprise use. For an \"Always Free\" plan, you can integrate the \"SMSGateway.me\" app to route texts safely through your personal Android device's mobile plan at zero marginal cost.")}
              </p>
            </div>
          </div>
        )}
        {subTab === 'whatsapp' && (
          <div className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/40 p-1 flex items-start gap-3">
            <Info className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-green-900 dark:text-green-300 mb-0.5">{t("Free WhatsApp Plan")}</p>
              <p className="text-[11px] text-green-800/80 dark:text-green-400/80 leading-relaxed">
                {t("Leverage the official \"WhatsApp Cloud API\" (Meta). It provisions 1,000 free service-tier messages every month for business support conversations, which easily handles standard use cases in India for free.")}
              </p>
            </div>
          </div>
        )}
        {subTab === 'telegram' && (
          <div className="bg-cyan-50/50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800/40 p-1 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-cyan-900 dark:text-cyan-300 mb-0.5">{t("Free Telegram Plan")}</p>
              <p className="text-[11px] text-cyan-800/80 dark:text-cyan-400/80 leading-relaxed">
                {t("Telegram provides a 100% free Bot API. By using the Telegram Bot API, you can send unlimited messages, alerts, and summaries to your business groups or personal numbers without any cost.")}
              </p>
            </div>
          </div>
        )}
        {subTab === 'inApp' && (
          <div className="bg-slate-50 dark:bg-gray-850 border-gray-150 dark:border-gray-750 p-1 flex items-start gap-3">
            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-750 dark:text-gray-300 mb-0.5">{t("In-App Real-Time Alerts")}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("Fully integrated real-time desktop notification sockets. Displays inside the general notification center layout and updates dynamically with zero latency.")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Filtered Toggle Dashboard of Categories */}
      <div className="min-h-[450px] w-full space-y-4">
        
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/30 dark:bg-gray-900/10 border border-dashed border-gray-200 dark:border-gray-750 rounded-2xl p-6">
            <div className="p-4 bg-gray-105 dark:bg-gray-800 rounded-full text-gray-400 dark:text-gray-500 mb-3">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{t("No matching alert keys or triggers found")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t("Try adjusting your search filters to find specific notification rules.")}</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            
            {/* System & Operational Alerts Accordion */}
            {systemAlerts.length > 0 && (() => {
              const isOpen = activeAccordion === "system" || !!searchQuery;
              return (
                <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-150 dark:border-gray-750/80 overflow-hidden shadow-xs transition-all">
                  <button
                    onClick={() => toggleCategory("system")}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 bg-gray-50/30 dark:bg-gray-900/20 cursor-pointer outline-none transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-105/30 dark:border-indigo-950">
                        <Cpu className="w-4 h-4" />
                      </span>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest leading-none">
                          {t("System & Operations")}
                        </h4>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1.5">
                          {systemAlerts.length} {t("Alert Triggers")}
                        </span>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-t border-gray-150 dark:border-gray-750 bg-white/50 dark:bg-gray-900/10">
                          {systemAlerts.map(item => renderToggle(subTab, item.key, t(item.title), t(item.description)))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* Financial & Inventory Alerts Accordion */}
            {financialAlerts.length > 0 && (() => {
              const isOpen = activeAccordion === "financial" || !!searchQuery;
              return (
                <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-150 dark:border-gray-750/80 overflow-hidden shadow-xs transition-all">
                  <button
                    onClick={() => toggleCategory("financial")}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 bg-gray-50/30 dark:bg-gray-900/20 cursor-pointer outline-none transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-105/30 dark:border-emerald-950">
                        <DollarSign className="w-4 h-4" />
                      </span>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest leading-none">
                          {t("Financial & Inventory")}
                        </h4>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1.5">
                          {financialAlerts.length} {t("Alert Triggers")}
                        </span>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-t border-gray-150 dark:border-gray-750 bg-white/50 dark:bg-gray-900/10">
                          {financialAlerts.map(item => renderToggle(subTab, item.key, t(item.title), t(item.description)))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* Automation & Compliance Alerts Accordion */}
            {complianceAlerts.length > 0 && (() => {
              const isOpen = activeAccordion === "compliance" || !!searchQuery;
              return (
                <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-150 dark:border-gray-750/80 overflow-hidden shadow-xs transition-all">
                  <button
                    onClick={() => toggleCategory("compliance")}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 bg-gray-50/30 dark:bg-gray-900/20 cursor-pointer outline-none transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-105/30 dark:border-amber-950">
                        <ClipboardList className="w-4 h-4" />
                      </span>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest leading-none">
                          {t("Automation & Compliance")}
                        </h4>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1.5">
                          {complianceAlerts.length} {t("Alert Triggers")}
                        </span>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-t border-gray-150 dark:border-gray-750 bg-white/50 dark:bg-gray-900/10">
                          {complianceAlerts.map(item => renderToggle(subTab, item.key, t(item.title), t(item.description)))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* Security & Data Alerts Accordion */}
            {securityAlerts.length > 0 && (() => {
              const isOpen = activeAccordion === "security" || !!searchQuery;
              return (
                <div className="bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-150 dark:border-gray-750/80 overflow-hidden shadow-xs transition-all">
                  <button
                    onClick={() => toggleCategory("security")}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 bg-gray-50/30 dark:bg-gray-900/20 cursor-pointer outline-none transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-105/30 dark:border-rose-950">
                        <Lock className="w-4 h-4" />
                      </span>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest leading-none">
                          {t("Security & Data")}
                        </h4>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1.5">
                          {securityAlerts.length} {t("Alert Triggers")}
                        </span>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-450 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-t border-gray-150 dark:border-gray-750 bg-white/50 dark:bg-gray-900/10">
                          {securityAlerts.map(item => renderToggle(subTab, item.key, t(item.title), t(item.description)))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

          </div>
        )}

      </div>

      </div>
      
      {/* Bottom Optimization Tip card */}
      <div className="bg-blue-50/40 dark:bg-blue-900/5 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
        <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center">
          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center mr-2 text-[10px] font-black">i</span>
          {t("Smart Delivery Optimization")}
        </h4>
        <p className="text-xs text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
          {t("We batch non-critical notifications together into digests to prevent alert fatigue. Critical events, such as security warnings and high-value transactions, bypass batching and are delivered immediately to ensure safety.")}
        </p>
      </div>

    </div>
  );
};
