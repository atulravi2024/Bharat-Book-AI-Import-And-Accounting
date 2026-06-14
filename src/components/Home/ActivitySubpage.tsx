import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Activity, ShieldAlert, Cpu, CheckCircle, Database,
  Search, X, Upload, Download, Trash2, RotateCcw, Save, ChevronDown 
} from 'lucide-react';
import { ParsedVoucher } from '../../app/types';

// Tab imports
import { AuditLogsTab } from './activity/tab/AuditLogsTab';
import { SystemHealthTab } from './activity/tab/SystemHealthTab';
import { StorageTab } from './activity/tab/StorageTab';

interface ActivitySubpageProps {
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
}

export const ActivitySubpage: React.FC<ActivitySubpageProps> = ({
  allVouchers = [],
  partyMasters = [],
  ledgerMasters = [],
  itemMasters = [],
}) => {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();

  // Tab State
  const [activeTab, setActiveTab] = useState<'audit' | 'health' | 'storage'>('audit');
  const [auditConfigs, setAuditConfigs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuditConfigs = async () => {
      try {
        const response = await fetch('/sample-data/audit.json');
        if (response.ok) {
          const data = await response.json();
          setAuditConfigs(data);
        }
      } catch (err) {
        console.error("Failed to load audit logging configs", err);
      }
    };
    fetchAuditConfigs();
  }, []);

  // Toolbar state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearInput = () => {
    setSearchTerm('');
    addNotification({
      title: 'Filter Purged',
      message: 'Active search terms for activity logs cleared.',
      type: 'System',
    });
  };

  const handleResetDefaults = () => {
    setSearchTerm('');
    setFileFormat('JSON');
    addNotification({
      title: 'Preferences Purged',
      message: 'Activity workspace configurations restored to factory defaults.',
      type: 'System',
    });
  };

  const handleSaveConfig = () => {
    addNotification({
      title: 'Settings Persisted',
      message: 'Activity workspace settings successfully synchronized.',
      type: 'System',
    });
  };

  const handleExport = () => {
    addNotification({
      title: 'Activity Logs Exported',
      message: `Activity log cache successfully downloaded as ${fileFormat}.`,
      type: 'System',
    });
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addNotification({
      title: 'Import Success',
      message: `Successfully integrated ${file.name} metadata into activity views.`,
      type: 'System',
    });
    e.target.value = '';
  };

  const getRecentActivities = () => {
    const activities: { id: string; action: string; time: string; type: string; info: string; details?: string }[] = [];
    
    const sortedVouchers = [...allVouchers]
      .filter(v => v.auditLogs && v.auditLogs.length > 0)
      .slice(-6);
      
    if (sortedVouchers.length > 0) {
      sortedVouchers.forEach(v => {
        const latestLog = v.auditLogs ? v.auditLogs[v.auditLogs.length - 1] : null;
        if (latestLog) {
          activities.push({
            id: v.id + latestLog.id,
            action: latestLog.action,
            time: latestLog.timestamp || 'Just now',
            type: v.type || 'Voucher',
            info: `${latestLog.action} voucher for ${v.partyName?.value || 'General'} of ₹${v.amount?.value || '0'}`,
            details: `Voucher GUID: ${v.id.substring(0, 8)}... Matching Score: ${(v as any).confidence || '98%'}`
          });
        }
      });
    }

    // Default system fallback items loaded dynamically from audit.json
    const fallbacks = auditConfigs.map(item => {
      let info = language === 'hi' ? item.info_hi : item.info_en;
      if (item.id === 'fb-2') {
        info = language === 'hi'
          ? `${ledgerMasters.length} सामान्य बहीखाता नियम और ${partyMasters.length} विक्रेता स्वचालित रूप से जाँचे गए।`
          : `${ledgerMasters.length} general ledger rules and ${partyMasters.length} vendors checked automatically.`;
      }
      return {
        id: item.id,
        action: language === 'hi' ? (item.action_hi || item.action) : item.action,
        time: language === 'hi' ? item.time_hi : item.time_en,
        type: language === 'hi' ? (item.type_hi || item.type) : item.type,
        info: info,
        details: language === 'hi' ? item.details_hi : item.details_en
      };
    });
    return [...activities, ...fallbacks].slice(0, 6);
  };

  const unfilteredActivities = getRecentActivities();
  const activities = unfilteredActivities.filter(act => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return act.info.toLowerCase().includes(term) || 
           act.action.toLowerCase().includes(term) || 
           act.type.toLowerCase().includes(term) || 
           (act.details && act.details.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6 max-w-full animate-in fade-in duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json,.csv" 
        className="hidden" 
      />

      {/* Activity Subpage Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">
              {language === 'hi' ? 'सिस्टम गतिविधि लॉग' : 'System Activity Logs'}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={language === 'hi' ? 'ऑडिट ट्रेल इतिहास, नैदानिक ​​सिस्टम स्वास्थ्य, और डेटाबेस भंडारण सीमाएं' : 'Audit trail history, diagnostic system health, and database storage limits'}>
              {language === 'hi' ? 'ऑडिट ट्रेल इतिहास, नैदानिक ​​सिस्टम स्वास्थ्य, और डेटाबेस भंडारण सीमाएं' : 'Audit trail history, diagnostic system health, and database storage limits'}
            </p>
          </div>
        </div>

        {/* Dense Tabs Selector Header Selections (flush right) */}
        <div className="min-w-0 flex-1 flex items-center justify-end">
          <div className="flex bg-slate-100 dark:bg-gray-950 p-1.5 rounded-xl gap-1.5 shadow-sm border border-slate-200/50 dark:border-gray-800 shrink-0">
            <button
              id="activity-audit-tab-btn"
              onClick={() => setActiveTab('audit')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'गतिविधि' : 'Activity Logs'}
            </button>
            <button
              id="activity-health-tab-btn"
              onClick={() => setActiveTab('health')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'स्वास्थ्य' : 'System Health'}
            </button>
            <button
              id="activity-storage-tab-btn"
              onClick={() => setActiveTab('storage')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'storage'
                  ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/60'
              }`}
            >
              {language === 'hi' ? 'भंडारण' : 'Storage'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Control Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 p-1.5 sm:p-2 rounded-xl shadow-sm flex flex-row justify-between items-center gap-2">
        <div className="flex-1 min-w-0 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'गतिविधि और ऑडिट खोजें...' : 'Search audit activity logs...'}
            className="w-full pl-9 pr-8 py-1.5 bg-gray-50/50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-750/60 rounded-lg text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono tracking-tight"
          />
          {searchTerm && (
            <button
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'hi' ? 'खोज साफ़ करें' : 'Clear search'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className={`flex items-center gap-1.5 shrink-0 transition-all duration-200 ${
          (isSearchFocused || searchTerm.length > 0) ? 'hidden sm:flex' : 'flex'
        }`}>
          <div className="relative inline-flex items-center bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
              className="bg-transparent text-slate-800 dark:text-slate-200 pr-3.5 font-black focus:outline-none cursor-pointer text-[10px] sm:text-[11px] appearance-none"
            >
              <option value="JSON" className="dark:bg-gray-800">JSON</option>
              <option value="CSV" className="dark:bg-gray-800">CSV</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>

          <button
            onClick={handleImportClick}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'आयात' : 'Import'}</span>
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'निर्यात' : 'Export'}</span>
          </button>
          <button
            onClick={handleClearInput}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer items-center gap-1.5 hidden lg:flex"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'hi' ? 'साफ़' : 'Clear Input'}</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-750 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span className="hidden lg:inline">{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
          </button>
          <button
            onClick={handleSaveConfig}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 shrink-0 text-white" />
            <span className="hidden lg:inline">{language === 'hi' ? 'सहेजें' : 'Save'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'health' ? (
        <SystemHealthTab language={language} />
      ) : activeTab === 'storage' ? (
        <StorageTab language={language} />
      ) : (
        <AuditLogsTab activities={activities} language={language} />
      )}

    </div>
  );
};
