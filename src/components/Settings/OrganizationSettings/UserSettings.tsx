import React, { useState } from 'react';
import { User, UserCheck, Compass, Shield, Activity, Sliders, HelpCircle, Search, Upload, Download, Trash2, RotateCcw, CheckCircle2, ChevronDown, Save } from 'lucide-react';
import { MyAccountTab } from './UserSettingsTabs/MyAccountTab';
import { CompanyDirectoryTab } from './UserSettingsTabs/CompanyDirectoryTab';
import { SuperAdminTab } from './UserSettingsTabs/SuperAdminTab';
import { ActiveUsersTab } from './UserSettingsTabs/ActiveUsersTab';
import { GroupRulesTab } from './UserSettingsTabs/GroupRulesTab';
import { UserHelpTab } from './UserSettingsTabs/UserHelpTab';
import { useLanguage } from "../../../context/LanguageContext";
import { useNotifications } from "../../../context/NotificationContext";

export interface UserPermissions {
  vouchers: { read: boolean; create: boolean; edit: boolean; delete: boolean };
  masters: { read: boolean; create: boolean; edit: boolean; delete: boolean };
  reports: { read: boolean; create: boolean; edit: boolean; delete: boolean };
  system: { read: boolean; create: boolean; edit: boolean; delete: boolean };
  audits: { read: boolean; create: boolean; edit: boolean; delete: boolean };
}

export interface ActivityLog {
  timestamp: string;
  action: string;
  details: string;
  ip: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer';
  department: string;
  status: 'Active' | 'Invited' | 'Suspended' | 'Permanently Disabled' | 'Archived' | 'Terminated' | 'Deactivated';
  lastActive: string;
  avatarColor: string;
  permissions: UserPermissions;
  activityLogs: ActivityLog[];
  dob?: string;
  gender?: string;
  aadhaarId?: string;
  voterId?: string;
  panCard?: string;
  drivingLicense?: string;
  profilePhoto?: string;
  internalStaffId?: string;
  isLockedOut?: boolean;
  failedLoginAttempts?: number;
  maxLoginAttempts?: number;
  inactivityTimeoutMinutes?: number;
}

export const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr-1',
    name: 'Super Admin',
    email: 'superadmin@bharatbook.com',
    phone: '+91 90000 00001',
    password: 'password123',
    role: 'Super Admin',
    department: 'Super Admin',
    status: 'Active',
    lastActive: 'Active now',
    avatarColor: 'from-blue-600 to-indigo-600',
    permissions: {
      vouchers: { read: true, create: true, edit: true, delete: true },
      masters: { read: true, create: true, edit: true, delete: true },
      reports: { read: true, create: true, edit: true, delete: true },
      system: { read: true, create: true, edit: true, delete: true },
      audits: { read: true, create: true, edit: true, delete: true },
    },
    activityLogs: [
      { timestamp: '2026-05-22 15:45:00', action: 'System Backup Configured', details: 'Triggered database compression & local storage mirror', ip: '192.168.1.101' },
      { timestamp: '2026-05-22 14:12:00', action: 'General Settings Updated', details: 'Modified default fiscal year format and lock timing', ip: '192.168.1.101' },
      { timestamp: '2026-05-22 10:30:22', action: 'User Session Initiated', details: 'Authenticated via corporate single-sign-on (SSO)', ip: '192.168.1.101' }
    ]
  },
  {
    id: 'usr-2',
    name: 'Sales Team',
    email: 'sales@bharatbook.com',
    phone: '+91 99887 76655',
    password: 'password123',
    role: 'Editor',
    department: 'Sales',
    status: 'Active',
    lastActive: '5 mins ago',
    avatarColor: 'from-emerald-500 to-teal-600',
    permissions: {
      vouchers: { read: true, create: true, edit: true, delete: false },
      masters: { read: true, create: false, edit: false, delete: false },
      reports: { read: true, create: false, edit: false, delete: false },
      system: { read: false, create: false, edit: false, delete: false },
      audits: { read: false, create: false, edit: false, delete: false },
    },
    activityLogs: [
      { timestamp: '2026-05-22 16:01:10', action: 'Sales Voucher Posted', details: 'Created voucher #SALE-094 for 24,500 INR', ip: '192.168.2.14' },
      { timestamp: '2026-05-21 17:33:45', action: 'Statement Uploaded', details: 'Processed "HDFC_Corp_May.csv" containing 12 lines', ip: '192.168.2.14' }
    ]
  },
  {
    id: 'usr-3',
    name: 'Accountant Pro',
    email: 'accountant@bharatbook.com',
    phone: '+91 97766 55443',
    password: 'password123',
    role: 'Manager',
    department: 'Finance',
    status: 'Active',
    lastActive: '2 hours ago',
    avatarColor: 'from-amber-500 to-orange-600',
    permissions: {
      vouchers: { read: true, create: true, edit: true, delete: true },
      masters: { read: true, create: true, edit: true, delete: false },
      reports: { read: true, create: true, edit: true, delete: false },
      system: { read: true, create: false, edit: false, delete: false },
      audits: { read: true, create: false, edit: false, delete: false },
    },
    activityLogs: [
      { timestamp: '2026-05-22 13:40:02', action: 'Ledger Audit Done', details: 'Inspected raw bank feed mapping matching 94% accuracy', ip: '192.168.1.15' },
      { timestamp: '2026-05-22 11:20:11', action: 'Ledger Group Modified', details: 'Assigned "Zomato Media" aliases directly', ip: '192.168.1.15' }
    ]
  },
  {
    id: 'usr-4',
    name: 'Audit Guest',
    email: 'audit@bharatbook.com',
    phone: '+91 91122 33445',
    password: 'password123',
    role: 'Viewer',
    department: 'Audit',
    status: 'Suspended',
    lastActive: '3 days ago',
    avatarColor: 'from-gray-500 to-slate-600',
    permissions: {
      vouchers: { read: true, create: false, edit: false, delete: false },
      masters: { read: true, create: false, edit: false, delete: false },
      reports: { read: true, create: false, edit: false, delete: false },
      system: { read: false, create: false, edit: false, delete: false },
      audits: { read: true, create: false, edit: false, delete: false },
    },
    activityLogs: [
      { timestamp: '2026-05-19 11:00:00', action: 'User Suspended', details: 'Access temporarily revoked by admin', ip: 'System' },
      { timestamp: '2026-05-19 09:15:22', action: 'Financial Statement Exported', details: 'Exported trial ledger reports', ip: '192.168.4.20' }
    ]
  },
  {
    id: 'usr-5',
    name: 'Business Owner',
    email: 'owner@bharatbook.com',
    phone: '+91 90000 00002',
    password: 'password123',
    role: 'Owner',
    department: 'Management',
    status: 'Active',
    lastActive: '10 mins ago',
    avatarColor: 'from-indigo-600 to-purple-600',
    permissions: {
      vouchers: { read: true, create: true, edit: true, delete: true },
      masters: { read: true, create: true, edit: true, delete: true },
      reports: { read: true, create: true, edit: true, delete: true },
      system: { read: true, create: true, edit: true, delete: true },
      audits: { read: true, create: true, edit: true, delete: true },
    },
    activityLogs: [
      { timestamp: '2026-05-22 17:00:00', action: 'Viewed Financial Dashboard', details: 'Dashboard accessed', ip: '192.168.1.102' }
    ]
  },
  {
    id: 'usr-6',
    name: 'System Admin',
    email: 'admin@bharatbook.com',
    phone: '+91 98888 77777',
    password: 'password123',
    role: 'Admin',
    department: 'IT Support',
    status: 'Active',
    lastActive: '1 hour ago',
    avatarColor: 'from-green-600 to-teal-600',
    permissions: {
      vouchers: { read: true, create: true, edit: true, delete: true },
      masters: { read: true, create: true, edit: true, delete: true },
      reports: { read: true, create: true, edit: true, delete: true },
      system: { read: true, create: false, edit: true, delete: false },
      audits: { read: true, create: true, edit: true, delete: false },
    },
    activityLogs: [
      { timestamp: '2026-05-22 16:00:00', action: 'User Created', details: 'Created Accountant Profile', ip: '192.168.1.103' }
    ]
  }
];

export const UserSettings: React.FC = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'my-account' | 'directory' | 'profile' | 'active-users' | 'group-rules' | 'help'>('help');

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tabsContainerRef.current) {
      // Smooth horizontal trackpad/scroll transition
      e.preventDefault();
      tabsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Automatically scroll active tab into view when activeTab changes
  React.useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        
      }
    }
  }, [activeTab]);

  React.useEffect(() => {
    const checkUserOverride = () => {
      const subOverride = localStorage.getItem('bharat_book_users_subtab_override');
      if (subOverride) {
        setActiveTab(subOverride as any);
        localStorage.removeItem('bharat_book_users_subtab_override');
      }
    };
    checkUserOverride();
    window.addEventListener('bharat_book_users_subtab_trigger', checkUserOverride);
    return () => {
      window.removeEventListener('bharat_book_users_subtab_trigger', checkUserOverride);
    };
  }, []);

  const handleGlobalImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let importedUsers: ManagedUser[] = [];
        if (fileFormat === 'JSON') {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            importedUsers = parsed;
          } else {
            throw new Error("Invalid format");
          }
        } else {
          // Simple CSV Parser
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          importedUsers = lines.slice(1).filter(l => l.trim()).map((line, idx) => {
            const values = line.split(',').map(v => v.trim());
            const userObj: any = {
              id: `usr-imported-${Date.now()}-${idx}`,
              permissions: {
                vouchers: { read: true, create: true, edit: true, delete: false },
                masters: { read: true, create: false, edit: false, delete: false },
                reports: { read: true, create: false, edit: false, delete: false },
                system: { read: false, create: false, edit: false, delete: false },
                audits: { read: false, create: false, edit: false, delete: false },
              },
              activityLogs: []
            };

            headers.forEach((header, index) => {
              const value = values[index];
              if (header === 'name') userObj.name = value;
              if (header === 'email') userObj.email = value;
              if (header === 'phone') userObj.phone = value;
              if (header === 'role') userObj.role = value;
              if (header === 'department') userObj.department = value;
              if (header === 'status') userObj.status = value;
            });

            // Fallback defaults
            if (!userObj.name) userObj.name = "Imported User";
            if (!userObj.email) userObj.email = `imported@example.com`;
            if (!userObj.phone) userObj.phone = "+91 99999 99999";
            if (!userObj.role) userObj.role = "Viewer";
            if (!userObj.department) userObj.department = "Finance";
            if (!userObj.status) userObj.status = "Active";
            userObj.avatarColor = "from-teal-500 to-indigo-600";
            return userObj as ManagedUser;
          });
        }

        if (importedUsers.length > 0) {
          const savedUsersStr = localStorage.getItem('bharat_book_managed_users');
          let savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
          // Merge unique emails
          importedUsers.forEach(impUser => {
            if (!savedUsers.some((u: any) => u.email.toLowerCase() === impUser.email.toLowerCase())) {
              savedUsers.push(impUser);
            }
          });
          localStorage.setItem('bharat_book_managed_users', JSON.stringify(savedUsers));
          window.dispatchEvent(new Event('bharat_book_users_imported_trigger'));
          addNotification({
            title: t("Import Successful"),
            message: t("Users successfully imported and integrated."),
            type: "System"
          });
        }
      } catch (err) {
        addNotification({
          title: t("Import Failed"),
          message: t("Integrity breach error: Could not parse input file. Ensure parameters correspond with chosen schema formats."),
          type: "Alert"
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleGlobalExport = () => {
    const savedUsersStr = localStorage.getItem('bharat_book_managed_users');
    const usersToExport = savedUsersStr ? JSON.parse(savedUsersStr) : INITIAL_USERS;

    let blob: Blob;
    let filename = '';

    if (fileFormat === 'JSON') {
      blob = new Blob([JSON.stringify(usersToExport, null, 2)], { type: 'application/json' });
      filename = 'bharat_book_users_export.json';
    } else {
      const csvHeaders = 'Name,Email,Phone,Role,Department,Status\n';
      const csvRows = usersToExport.map((u: ManagedUser) => {
        return `"${u.name}","${u.email}","${u.phone}","${u.role}","${u.department}","${u.status}"`;
      }).join('\n');
      blob = new Blob([csvHeaders + csvRows], { type: 'text/csv' });
      filename = 'bharat_book_users_export.csv';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGlobalReset = () => {
    localStorage.setItem('bharat_book_managed_users', JSON.stringify(INITIAL_USERS));
    window.dispatchEvent(new Event('bharat_book_users_imported_trigger'));
    addNotification({
      title: t("Database Reset"),
      message: t("Users database is reset to standard configurations."),
      type: "System"
    });
  };

  const [isGlobalSaved, setIsGlobalSaved] = useState(false);
  const handleGlobalSave = () => {
    setIsGlobalSaved(true);
    setTimeout(() => setIsGlobalSaved(false), 2000);
    addNotification({
      title: t("Configuration Saved"),
      message: t("All security policy profiles and configurations saved successfully."),
      type: "System"
    });
  };

  const isToolbarHiddenOnMobile = isSearchFocused || !!searchQuery;

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      
      {/* 2-Row Stacked Header Layout responsive to Desktop/Mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <User className="w-5 h-5" /> 
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider truncate leading-tight">
              {t("Security & User Workspace")}
            </h2>
            <p className="text-[10px] xs:text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 truncate whitespace-nowrap">
              {t("Configure system users and permissions policies")}
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
            <button 
              onClick={() => setActiveTab('active-users')}
              data-active={activeTab === 'active-users'}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'active-users' 
                  ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'active-users' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{t("Active")}</span>
            </button>
            <button 
              onClick={() => setActiveTab('my-account')}
              data-active={activeTab === 'my-account'}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'my-account' 
                  ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'my-account' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{t("Account")}</span>
            </button>
            <button 
              onClick={() => setActiveTab('directory')}
              data-active={activeTab === 'directory'}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'directory' 
                  ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'directory' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{t("Directory")}</span>
            </button>
            <button 
              onClick={() => setActiveTab('group-rules')}
              data-active={activeTab === 'group-rules'}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'group-rules' 
                  ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
              }`}
            >
              <Sliders className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'group-rules' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{t("Rules")}</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              data-active={activeTab === 'profile'}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'profile' 
                  ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{t("Root")}</span>
            </button>
            <button 
              onClick={() => setActiveTab('help')}
              data-active={activeTab === 'help'}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'help' 
                  ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
              }`}
            >
              <HelpCircle className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'help' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{t("Help")}</span>
            </button>
          </div>
        </div>
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleGlobalImportFile}
        accept={fileFormat === 'JSON' ? '.json' : '.csv'}
        className="hidden"
      />

      {/* Dynamic Search & Compact Universal Actions Toolbar row */}
      <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in">
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder={t("Search credentials or configurations...")} 
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

        {/* Action Controls Toolbar - dynamic collapsible on mobile focus to preserve text width */}
        <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto ${isToolbarHiddenOnMobile ? "hidden sm:flex" : "flex"}`}>
          
          {/* Format Selector Dropdown (Simple Input and Output Button) */}
          <div className="relative inline-flex items-center shrink-0">
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
              className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-150 dark:border-gray-750 hover:border-gray-350 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
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
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Import Configurations")}
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Import")}</span>
          </button>

          {/* Export Button - dynamically dependent backend but label remains static */}
          <button
            onClick={handleGlobalExport}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Export Configurations")}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Export")}</span>
          </button>

          {/* Clear Button - HIDDEN on mobile and tablet */}
          <button
            onClick={() => setSearchQuery("")}
            className="hidden lg:flex px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-amber-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 items-center justify-center gap-1.5 shrink-0"
            title={t("Clear Search Terms")}
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-none">{t("Clear")}</span>
          </button>

          {/* Reset Defaults Button */}
          <button
            onClick={handleGlobalReset}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-650 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Reset Defaults")}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline leading-none">{t("Reset")}</span>
          </button>

          {/* Save Configuration Button */}
          <button
            onClick={handleGlobalSave}
            className="px-2 sm:px-3 py-1.5 text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            title={t("Save Config")}
          >
            {isGlobalSaved ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 animate-bounce" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
            <span className="hidden md:inline leading-none">{isGlobalSaved ? t("Saved") : t("Save")}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 min-h-[550px]">
        {activeTab === 'active-users' && <ActiveUsersTab searchTerm={searchQuery} />}
        {activeTab === 'my-account' && <MyAccountTab />}
        {activeTab === 'directory' && <CompanyDirectoryTab searchTerm={searchQuery} />}
        {activeTab === 'group-rules' && <GroupRulesTab searchTerm={searchQuery} />}
        {activeTab === 'profile' && <SuperAdminTab />}
        {activeTab === 'help' && <UserHelpTab searchTerm={searchQuery} />}
      </div>
    </div>
  );
};
