import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { MainView } from '../../app/types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bell, 
  Search, 
  Trash2, 
  Check, 
  CheckCheck, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Clock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Inbox,
  Workflow,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Settings,
  ChevronDown
} from 'lucide-react';

interface NotificationDropdownProps {
  onViewChange?: (view: MainView) => void;
}

  const timeOptions = [
    { value: 'All', label: 'All Time' },
    { value: 'Today', label: 'Today' },
    { value: 'Yesterday', label: 'Yesterday' },
    { value: 'ThisWeek', label: 'This Week' },
    { value: 'LastCurrentWeek', label: 'Last Current Week' },
    { value: 'LastWeek', label: 'Last Week' },
    { value: 'ThisMonth', label: 'This Month' },
    { value: 'LastMonth', label: 'Last Month' },
    { value: 'CurrentQuarter', label: 'Current Quarter' },
  ];

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'System' | 'Alert' | 'Task'>('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('All');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulationOffset, setSimulationOffset] = useState<number>(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsUnread,
    markAllAsRead, 
    markAllAsUnread,
    removeNotification, 
    clearAll,
    addNotification 
  } = useNotifications();
  const { t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link && onViewChange) {
      onViewChange(link as MainView);
    }
    setIsOpen(false);
  };

  // Toggle single read/unread status on demand
  const handleToggleRead = (e: React.MouseEvent, id: string, currentlyRead: boolean) => {
    e.stopPropagation();
    if (currentlyRead) {
      markAsUnread(id);
    } else {
      markAsRead(id);
    }
  };

  // Sample Simulator Alerts to inject
  const simulateAlert = (type: 'System' | 'Alert' | 'Task' | 'Success', offsetDays = simulationOffset) => {
    const templates = {
      System: {
        title: 'Cloud Database Synced',
        message: 'Bharat Book cloud node master tables synchronized successfully with 4 local ledgers.',
        type: 'System' as const,
        link: 'dashboard' as const
      },
      Alert: {
        title: 'Presumptive Limit Flag',
        message: 'Advance tax planners estimate Section 44AE carriage fleet limit at maximum thresholds.',
        type: 'Alert' as const,
        link: 'tax-report' as const
      },
      Task: {
        title: 'Sign Zero-Rated Export RFD-11',
        message: 'Designated witness entries validated. Ready for final cryptographic verification.',
        type: 'Task' as const,
        link: 'tax-report' as const
      },
      Success: {
        title: 'Auto-Mapper Complete',
        message: 'Successfully mapped 12 new bank voucher items. Mismatches resolved.',
        type: 'System' as const,
        link: 'import' as const
      }
    };

    const targetTemplate = templates[type];
    
    // Compute retroactive creation date if offsetDays is specified
    let customDate = new Date();
    if (offsetDays > 0) {
      customDate.setDate(customDate.getDate() - offsetDays);
    }

    addNotification({
      title: t(targetTemplate.title) + (offsetDays > 0 ? ` (${offsetDays}d ago)` : ''),
      message: t(targetTemplate.message),
      type: targetTemplate.type,
      link: targetTemplate.link,
      createdAt: customDate.toISOString()
    });
  };

  // Helper colors for type classification
  const getColors = (type: string, isRead: boolean) => {
    switch(type) {
      case 'System': 
        return {
          border: 'border-l-blue-500',
          bg: isRead ? 'bg-slate-50/50 dark:bg-gray-800/30' : 'bg-blue-50/20 dark:bg-blue-950/10',
          tagBg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          icon: <Workflow className="w-3.5 h-3.5 text-blue-500" />
        };
      case 'Alert': 
        return {
          border: 'border-l-red-500',
          bg: isRead ? 'bg-slate-50/50 dark:bg-gray-800/30' : 'bg-red-55/10 dark:bg-red-950/10',
          tagBg: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-301',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        };
      case 'Task': 
        return {
          border: 'border-l-amber-500',
          bg: isRead ? 'bg-slate-50/50 dark:bg-gray-800/30' : 'bg-amber-50/10 dark:bg-amber-950/10',
          tagBg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-301',
          icon: <Clock className="w-3.5 h-3.5 text-amber-505" />
        };
      default: 
        return {
          border: 'border-l-slate-400',
          bg: isRead ? 'bg-slate-50/50 dark:bg-gray-800/30' : 'bg-slate-50 dark:bg-gray-700/20',
          tagBg: 'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-300',
          icon: <Bell className="w-3.5 h-3.5 text-slate-500" />
        };
    }
  };

  // Parse time grouping
  const getTimelineGroup = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    
    // Set hours to 0 to compare exact dates
    const dZero = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((nowZero.getTime() - dZero.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
      return t('Today');
    } else if (diffDays === 1) {
      return t('Yesterday');
    } else if (diffDays <= 7) {
      return t('This Week');
    } else if (diffDays <= 14) {
      return t('Last Week');
    } else if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      return t('This Month');
    } else {
      return t('Earlier');
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('Just now');
    if (diffMins < 60) return `${diffMins} ${t('m ago')}`;
    if (diffHours < 24) return `${diffHours} ${t('h ago')}`;
    return `${diffDays} ${t('d ago')}`;
  };

  // Filter and search computation
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n => {
        // Search term query match
        const matchesQuery = searchQuery.trim() === '' || 
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          n.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Tab type match
        const matchesType = selectedType === 'All' || n.type === selectedType;
        
        // Time filter match
        let matchesTime = true;
        const creationTime = new Date(n.createdAt).getTime();
        const now = new Date();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        if (selectedTimeFilter === 'Today') {
          matchesTime = creationTime >= startOfToday.getTime();
        } else if (selectedTimeFilter === 'Yesterday') {
          const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
          matchesTime = creationTime >= startOfYesterday.getTime() && creationTime < startOfToday.getTime();
        } else if (selectedTimeFilter === 'ThisWeek') {
          const currentDay = now.getDay();
          const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
          const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
          startOfWeek.setHours(0, 0, 0, 0);
          matchesTime = creationTime >= startOfWeek.getTime();
        } else if (selectedTimeFilter === 'LastCurrentWeek') {
          const startOfLast7Days = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTime = creationTime >= startOfLast7Days.getTime();
        } else if (selectedTimeFilter === 'LastWeek') {
          const currentDay = now.getDay();
          const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
          const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
          startOfThisWeek.setHours(0, 0, 0, 0);
          const startOfLastWeek = new Date(startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTime = creationTime >= startOfLastWeek.getTime() && creationTime < startOfThisWeek.getTime();
        } else if (selectedTimeFilter === 'ThisMonth') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          matchesTime = creationTime >= startOfMonth.getTime();
        } else if (selectedTimeFilter === 'LastMonth') {
          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          matchesTime = creationTime >= startOfLastMonth.getTime() && creationTime < startOfThisMonth.getTime();
        } else if (selectedTimeFilter === 'CurrentQuarter') {
          const currentQuarterMonth = Math.floor(now.getMonth() / 3) * 3;
          const startOfQuarter = new Date(now.getFullYear(), currentQuarterMonth, 1);
          matchesTime = creationTime >= startOfQuarter.getTime();
        }
        
        return matchesQuery && matchesType && matchesTime;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, searchQuery, selectedType, selectedTimeFilter]);

  // Group notifications for UI mapping
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: typeof filteredNotifications } = {};
    filteredNotifications.forEach(notif => {
      const g = getTimelineGroup(notif.createdAt);
      if (!groups[g]) groups[g] = [];
      groups[g].push(notif);
    });
    return groups;
  }, [filteredNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        id="notification-bell-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl text-gray-500 hover:bg-premium-slate-50 dark:hover:bg-gray-700/80 hover:text-indigo-600 transition-all font-sans"
        aria-label="Toggle notifications center"
      >
        <Bell size={20} className="scale-100 sm:scale-105 active:scale-95 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-gray-800"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay mask for small screens */}
          <div className="fixed inset-0 z-40 sm:hidden bg-slate-900/10 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2.5 sm:w-[420px] max-h-[85vh] sm:max-h-[580px] bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans border-t-2 border-t-indigo-500 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Header Block */}
            <div className="p-4 border-b border-slate-100 dark:border-gray-750 bg-slate-50/50 dark:bg-gray-900/30 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                    {t("Notifications Hub")}
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-mono text-[9px] font-black rounded-md tracking-wider">
                        {unreadCount} {t("ALERT")}
                      </span>
                    )}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2.5 flex-wrap">
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllAsRead()}
                      className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 bg-transparent border-none p-0 cursor-pointer"
                    >
                      <CheckCheck size={11} />
                      {t("Read All")}
                    </button>
                  )}
                  {notifications.length > unreadCount && (
                    <button 
                      onClick={() => markAllAsUnread()}
                      className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline inline-flex items-center gap-0.5 bg-transparent border-none p-0 cursor-pointer"
                    >
                      <EyeOff size={11} />
                      {t("Unread All")}
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => clearAll()}
                      className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 inline-flex items-center gap-0.5 bg-transparent border-none p-0 cursor-pointer"
                      title={t("Clear all notification logs")}
                    >
                      <Trash2 size={11} />
                      {t("Clear")}
                    </button>
                  )}
                </div>
              </div>

              {/* Search and Time Filter Dropdown Row */}
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
                  <input 
                    type="text"
                    placeholder={t("Search alerts...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-901 text-xs text-slate-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-[9px] font-black text-gray-400 dark:text-gray-500 hover:text-gray-700 bg-slate-100 dark:bg-gray-800 rounded px-1.5 py-0.5"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Time Filter Dropdown Button */}
                <div className="relative shrink-0" ref={timeDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold text-slate-705 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-505 transition-all select-none cursor-pointer text-nowrap"
                  >
                    <Clock size={12} className="text-indigo-500 shrink-0" />
                    <span>{t(timeOptions.find(o => o.value === selectedTimeFilter)?.label || 'All Time')}</span>
                    <ChevronDown size={12} className={`text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTimeDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-gray-850 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-xl z-55 overflow-hidden font-sans border-t-2 border-t-indigo-500 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                        {timeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSelectedTimeFilter(opt.value);
                              setIsTimeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between ${
                              selectedTimeFilter === opt.value
                                ? 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-450'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span>{t(opt.label)}</span>
                            {selectedTimeFilter === opt.value && <Check size={12} className="stroke-[2.5]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Segmented Category Filter Tab Rows */}
              <div className="flex bg-slate-100 dark:bg-gray-900/50 p-0.5 rounded-lg border border-slate-100 dark:border-gray-750 gap-0.5 w-full">
                {(['All', 'System', 'Alert', 'Task'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setSelectedType(tab)}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                      selectedType === tab 
                        ? 'bg-white text-indigo-600 dark:bg-gray-800 dark:text-indigo-400 shadow-2xs font-extrabold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {t(tab === 'All' ? 'All' : tab + 's')}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Grouped List View Area */}
            {!showSimulator ? (
              <div className="flex-1 overflow-y-auto max-h-[340px] custom-scrollbar min-h-[100px]">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-slate-300 mb-3">
                      <Inbox size={22} className="text-slate-400 dark:text-gray-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-gray-300">{t("Quiet inbox")}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 max-w-[260px]">
                      {searchQuery ? t("No notification log matches search filters.") : t("You are caught up! All compliance trackers and ERP sync queues are clean.")}
                    </p>
                    
                    {/* Simulation launcher helpers */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <button 
                        onClick={() => simulateAlert('Alert')}
                        className="px-2.5 py-1 text-[10px] bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 font-bold"
                      >
                        + {t("Simulate Alert")}
                      </button>
                      <button 
                        onClick={() => simulateAlert('Task')}
                        className="px-2.5 py-1 text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-600 rounded border border-amber-200 font-bold"
                      >
                        + {t("Simulate Task")}
                      </button>
                      <button 
                        onClick={() => simulateAlert('System')}
                        className="px-2.5 py-1 text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-600 rounded border border-blue-200 font-bold"
                      >
                        + {t("Simulate System")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-gray-700/40">
                    {Object.entries(groupedNotifications).map(([groupName, items]) => (
                      <div key={groupName} className="p-0.5">
                        {/* Section Timeline Header */}
                        <div className="px-3.5 py-1.5 bg-slate-50/50 dark:bg-gray-800/40 border-b border-t border-slate-100 dark:border-gray-700 text-[9px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider">
                          {groupName}
                        </div>
                        
                        {items.map((notif) => {
                          const style = getColors(notif.type, notif.isRead);
                          return (
                            <div 
                              key={notif.id} 
                              onClick={() => handleNotificationClick(notif.id, notif.link)}
                              className={`p-4 transition-all relative group block w-full text-left cursor-pointer border-l-4 ${style.border} ${style.bg} hover:bg-slate-50 dark:hover:bg-gray-700/60`}
                            >
                              <div className="flex items-start space-x-3.5">
                                {/* Left icon wrapper */}
                                <div className="shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-gray-905 border border-slate-100 dark:border-gray-700 shadow-3xs flex items-center justify-center">
                                  {style.icon}
                                </div>
                                
                                <div className="flex-1 min-w-0 pr-6">
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md ${style.tagBg}`}>
                                      {t(notif.type)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold font-mono">
                                      {formatRelativeTime(notif.createdAt)}
                                    </span>
                                  </div>
                                  
                                  <p className={`text-xs font-black mt-1.5 ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400'}`}>
                                    {notif.title}
                                  </p>
                                  
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {notif.message}
                                  </p>
  
                                  {/* Action button inside the message */}
                                  {notif.link && (
                                    <div className="mt-2.5">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-lg text-[10px] font-extrabold border border-indigo-150/30 dark:border-indigo-900/40">
                                        {notif.link === 'tax-report' ? t("Launch Tax Planner") :
                                         notif.link === 'gst-report' ? t("Inspect GST Details") :
                                         notif.link === 'import' ? t("Review Pipeline") :
                                         notif.link === 'voucher-entry' ? t("Record Voucher") : t("Resolve Action")}
                                        <ArrowRight size={10} />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
  
                              {/* Standard Action buttons overlay (mark read, delete) */}
                              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-150/90 dark:bg-gray-850/90 p-1 rounded-xl shadow-xs border border-slate-200/80 dark:border-gray-700/80 transition-all z-20">
                                <button
                                  onClick={(e) => handleToggleRead(e, notif.id, notif.isRead)}
                                  className={`p-1 rounded-md transition-all ${
                                    notif.isRead 
                                      ? 'text-gray-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-gray-800' 
                                      : 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/40 font-black'
                                  }`}
                                  title={notif.isRead ? t("Mark as unread") : t("Mark as read")}
                                >
                                  {notif.isRead ? (
                                    <EyeOff size={13} className="stroke-[2.5]" />
                                  ) : (
                                    <Eye size={13} className="stroke-[2.5]" />
                                  )}
                                </button>
                                
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                  title={t("Delete notification")}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
  
                              {/* Unread Glowing marker */}
                              {!notif.isRead && (
                                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:bg-indigo-500 dark:ring-indigo-950/50"></span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => setShowSimulator(false)}
                className="py-2.5 px-4 mx-4 my-2.5 text-left rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-200 dark:border-indigo-800/60 cursor-pointer hover:bg-indigo-150/50 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Inbox size={14} className="text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <p className="font-extrabold text-slate-800 dark:text-white leading-normal">{t("Alert logs collapsed")}</p>
                    <p className="text-[10px] text-gray-500 truncate leading-none mt-0.5">{t("Interactive Lab open. Tap to restore list.")}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 px-2.5 py-1 text-[9px] font-black text-indigo-700 dark:text-indigo-350 uppercase tracking-widest bg-white dark:bg-gray-800 shadow-2xs rounded-md border border-indigo-100 dark:border-indigo-900/60 hover:bg-slate-50"
                >
                  {t("Restore")}
                </button>
              </div>
            )}

            {/* Bottom Actions Simulator Footer Tray */}
            <div className="p-3 border-t border-slate-100 dark:border-gray-750 bg-slate-50 dark:bg-gray-900/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowSimulator(!showSimulator)}
                  className="text-[10px] text-gray-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white font-extrabold flex items-center gap-1 bg-transparent border-none p-1 cursor-pointer"
                >
                  <Sliders size={11} className={`${showSimulator ? 'rotate-90' : ''} transition-transform text-indigo-500`} />
                  {t("Interactive Simulations Tray")}
                </button>
                <div className="text-[9.5px] font-extrabold text-slate-400 font-mono">
                  {notifications.length} {t("Logged alerts")}
                </div>
              </div>
              {showSimulator && (
                <div className="p-2 bg-white dark:bg-gray-901 border border-slate-200 dark:border-gray-750 rounded-2xl flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between border-b pb-1.5 border-slate-100 dark:border-gray-800/80">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Sparkles size={10} className="text-amber-500" />
                      {t("ERP Trigger Laboratory")}
                    </span>
                    <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1 hover:cursor-help rounded-sm font-bold uppercase">{t("Sandbox Admin")}</span>
                  </div>
                  
                  {/* Age Offset Selector for Simulation */}
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-slate-100 dark:border-gray-800/60 text-[9.5px]">
                    <span className="font-extrabold text-slate-500 dark:text-gray-400">{t("Select Alert Age")}:</span>
                    <div className="flex gap-1">
                      {([
                        { value: 0, label: 'Now' },
                        { value: 1, label: 'Yesterday' },
                        { value: 5, label: '5d ago' },
                        { value: 15, label: '15d ago' },
                        { value: 45, label: '45d ago' }
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSimulationOffset(opt.value)}
                          className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-black tracking-normal transition-all cursor-pointer ${
                            simulationOffset === opt.value
                              ? 'bg-indigo-600 text-white shadow-3xs'
                              : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {t(opt.label)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                    <button 
                      type="button"
                      onClick={() => simulateAlert('Alert')}
                      className="py-1 px-2 text-[10px] font-bold bg-slate-50 active:bg-slate-100 hover:text-red-650 dark:bg-gray-800 dark:hover:bg-gray-750 text-slate-755 border border-slate-200 dark:border-gray-700 rounded-lg flex items-center gap-1 justify-center"
                    >
                      <AlertTriangle size={10} className="text-red-500" />
                      {t("Tax Mismatch")}
                    </button>
                    <button 
                      type="button"
                      onClick={() => simulateAlert('Task')}
                      className="py-1 px-2 text-[10px] font-bold bg-slate-50 active:bg-slate-100 hover:text-amber-655 dark:bg-gray-800 dark:hover:bg-gray-750 text-slate-755 border border-slate-200 dark:border-gray-700 rounded-lg flex items-center gap-1 justify-center"
                    >
                      <Clock size={10} className="text-amber-500" />
                      {t("RFD-11 LUT")}
                    </button>
                    <button 
                      type="button"
                      onClick={() => simulateAlert('System')}
                      className="py-1 px-2 text-[10px] font-bold bg-slate-50 active:bg-slate-100 hover:text-blue-655 dark:bg-gray-800 dark:hover:bg-gray-750 text-slate-755 border border-slate-200 dark:border-gray-700 rounded-lg flex items-center gap-1 justify-center"
                    >
                      <Workflow size={10} className="text-blue-500" />
                      {t("Sync Sync Nodes")}
                    </button>
                    <button 
                      type="button"
                      onClick={() => simulateAlert('Success')}
                      className="py-1 px-2 text-[10px] font-bold bg-slate-100 dark:bg-gray-700 text-slate-850 dark:text-gray-200 border border-transparent rounded-lg flex items-center gap-1 justify-center hover:bg-slate-200"
                    >
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      {t("Success Process")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
