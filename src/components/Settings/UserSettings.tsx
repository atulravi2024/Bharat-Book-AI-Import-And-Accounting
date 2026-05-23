import React, { useState } from 'react';
import { User, UserCheck, Compass, Shield, Activity } from 'lucide-react';
import { MyAccountSettings } from './MyAccountSettings';
import { CompanyDirectorySettings } from './CompanyDirectorySettings';
import { SuperAdminSettings } from './SuperAdminSettings';
import { ActiveUsersSettings } from './ActiveUsersSettings';

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
  role: 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer';
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
  avatarColor: string;
  permissions: UserPermissions;
  activityLogs: ActivityLog[];
}

export const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr-1',
    name: 'Super Admin',
    email: 'superadmin@bharatbook.com',
    phone: '+91 90000 00001',
    password: 'password123',
    role: 'Super Admin',
    department: 'Core Security Governance',
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
  const [activeTab, setActiveTab] = useState<'my-account' | 'directory' | 'profile' | 'active-users'>('active-users');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 xl:px-6 xl:py-4 gap-4 border-b border-gray-50 dark:border-gray-700/50">
        <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center whitespace-nowrap">
          <User className="mr-2 text-blue-600 w-5 h-5" /> 
          User Settings
        </h2>
      </div>

      {/* Sub Tabs */}
      <div className="flex px-4 sm:px-6 pt-2 space-x-2 border-b border-gray-100 dark:border-gray-700 pb-2 overflow-x-auto custom-scrollbar bg-slate-50 dark:bg-gray-800/80">
          <button 
              onClick={() => setActiveTab('active-users')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap flex items-center ${activeTab === 'active-users' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-700'}`}
          >
              <Activity className="w-4 h-4 mr-2" />
              Active Users
          </button>
          <button 
              onClick={() => setActiveTab('my-account')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap flex items-center ${activeTab === 'my-account' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-700'}`}
          >
              <UserCheck className="w-4 h-4 mr-2" />
              My Account
          </button>
          <button 
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap flex items-center ${activeTab === 'directory' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-700'}`}
          >
              <Compass className="w-4 h-4 mr-2" />
              Company Directory
          </button>
          <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap flex items-center ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-700'}`}
          >
              <Shield className="w-4 h-4 mr-2" />
              Super Admin
          </button>
      </div>

      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-gray-900 min-h-[500px]">
        {activeTab === 'active-users' && <ActiveUsersSettings />}
        {activeTab === 'my-account' && <MyAccountSettings />}
        {activeTab === 'directory' && <CompanyDirectorySettings />}
        {activeTab === 'profile' && <SuperAdminSettings />}
      </div>
    </div>
  );
};
