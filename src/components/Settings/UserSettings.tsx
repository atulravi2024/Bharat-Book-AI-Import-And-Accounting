import React, { useState } from 'react';
import { User, UserCheck, Compass, Shield, Activity, Sliders, HelpCircle } from 'lucide-react';
import { MyAccountTab } from './UserSettingsTabs/MyAccountTab';
import { CompanyDirectoryTab } from './UserSettingsTabs/CompanyDirectoryTab';
import { SuperAdminTab } from './UserSettingsTabs/SuperAdminTab';
import { ActiveUsersTab } from './UserSettingsTabs/ActiveUsersTab';
import { GroupRulesTab } from './UserSettingsTabs/GroupRulesTab';
import { UserHelpTab } from './UserSettingsTabs/UserHelpTab';
import { useLanguage } from '../../context/LanguageContext';

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
  const [activeTab, setActiveTab] = useState<'my-account' | 'directory' | 'profile' | 'active-users' | 'group-rules' | 'help'>('help');

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

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-none border border-gray-100 dark:border-gray-700/80 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-gray-100 dark:border-gray-700/50">
        <div>
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
            <span className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-2.5 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
              <User className="w-5 h-5" /> 
            </span>
            {t("Security & User Workspace")}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 pl-1">{t("Configure profile thresholds, directories, & group policy permissions")}</p>
        </div>
        <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100/30 px-3 py-1.5 rounded-xl">
          <span>{t("ROOT PRIVILEGES COMPLIANCE APPLIED")}</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex px-6 py-3 space-x-2 border-b border-gray-100 dark:border-gray-700/50 overflow-x-auto custom-scrollbar bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm">
          <button 
              onClick={() => setActiveTab('active-users')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center shrink-0 border ${
                activeTab === 'active-users' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/45 border-transparent' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700 border-transparent hover:border-slate-100'
              }`}
          >
              <Activity className="w-4 h-4 mr-2" />
              {t("Active Users")}
          </button>
          <button 
              onClick={() => setActiveTab('my-account')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center shrink-0 border ${
                activeTab === 'my-account' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/45 border-transparent' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700 border-transparent hover:border-slate-100'
              }`}
          >
              <UserCheck className="w-4 h-4 mr-2" />
              {t("My Account")}
          </button>
          <button 
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center shrink-0 border ${
                activeTab === 'directory' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/45 border-transparent' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700 border-transparent hover:border-slate-100'
              }`}
          >
              <Compass className="w-4 h-4 mr-2" />
              {t("Company Directory")}
          </button>
          <button 
              onClick={() => setActiveTab('group-rules')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center shrink-0 border ${
                activeTab === 'group-rules' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/45 border-transparent' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700 border-transparent hover:border-slate-100'
              }`}
          >
              <Sliders className="w-4 h-4 mr-2" />
              {t("Group Rules")}
          </button>
          <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center shrink-0 border ${
                activeTab === 'profile' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/45 border-transparent' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700 border-transparent hover:border-slate-100'
              }`}
          >
              <Shield className="w-4 h-4 mr-2" />
              {t("Super Admin")}
          </button>
          <button 
              onClick={() => setActiveTab('help')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center shrink-0 border ${
                activeTab === 'help' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/45 border-transparent' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700 border-transparent hover:border-slate-100'
              }`}
          >
              <HelpCircle className="w-4 h-4 mr-2" />
              {t("User Help Center")}
          </button>
      </div>
 
      <div className="p-6 bg-slate-50/40 dark:bg-gray-900/30 min-h-[550px] transition-all">
        {activeTab === 'active-users' && <ActiveUsersTab />}
        {activeTab === 'my-account' && <MyAccountTab />}
        {activeTab === 'directory' && <CompanyDirectoryTab />}
        {activeTab === 'group-rules' && <GroupRulesTab />}
        {activeTab === 'profile' && <SuperAdminTab />}
        {activeTab === 'help' && <UserHelpTab />}
      </div>
    </div>
  );
};
