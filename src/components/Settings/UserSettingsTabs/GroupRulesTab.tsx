import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { 
  Shield, 
  Clock, 
  Users, 
  Lock, 
  FileSpreadsheet, 
  Building, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  Coins, 
  Sliders, 
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  RefreshCw,
  Info
} from 'lucide-react';
import { ManagedUser, INITIAL_USERS, UserPermissions } from '../UserSettings';

interface GroupPolicy {
  inactivityTimeoutMinutes: number; // 0 means inherit global
  maxLoginAttempts: number;         // 0 means inherit default
  dailyVoucherLimit: number;        // 0 means unlimited
  maxTransactionAmount: number;     // 0 means unlimited
  workHoursMode: 'any' | 'business' | 'weekdays';
  requireMfaApproval: boolean;
  permissions: UserPermissions;
}

// Generate secure predefined defaults for each group role or department
const createDefaultPermissions = (groupName: string, isRole: boolean): UserPermissions => {
  const blankPermissions: UserPermissions = {
    vouchers: { read: false, create: false, edit: false, delete: false },
    masters: { read: false, create: false, edit: false, delete: false },
    reports: { read: false, create: false, edit: false, delete: false },
    system: { read: false, create: false, edit: false, delete: false },
    audits: { read: false, create: false, edit: false, delete: false },
  };

  if (isRole) {
    if (groupName === 'Super Admin' || groupName === 'Owner' || groupName === 'Admin' || groupName === 'Developer') {
      return {
        vouchers: { read: true, create: true, edit: true, delete: true },
        masters: { read: true, create: true, edit: true, delete: true },
        reports: { read: true, create: true, edit: true, delete: true },
        system: { read: true, create: true, edit: true, delete: true },
        audits: { read: true, create: true, edit: true, delete: true },
      };
    }
    if (groupName === 'Manager') {
      return {
        vouchers: { read: true, create: true, edit: true, delete: false },
        masters: { read: true, create: true, edit: true, delete: false },
        reports: { read: true, create: true, edit: false, delete: false },
        system: { read: false, create: false, edit: false, delete: false },
        audits: { read: true, create: false, edit: false, delete: false },
      };
    }
    if (groupName === 'Editor') {
      return {
        vouchers: { read: true, create: true, edit: true, delete: false },
        masters: { read: true, create: true, edit: false, delete: false },
        reports: { read: true, create: false, edit: false, delete: false },
        system: { read: false, create: false, edit: false, delete: false },
        audits: { read: false, create: false, edit: false, delete: false },
      };
    }
    if (groupName === 'Viewer') {
      return {
        vouchers: { read: true, create: false, edit: false, delete: false },
        masters: { read: true, create: false, edit: false, delete: false },
        reports: { read: true, create: false, edit: false, delete: false },
        system: { read: false, create: false, edit: false, delete: false },
        audits: { read: false, create: false, edit: false, delete: false },
      };
    }
  } else {
    // Department Specific Default Profiles
    if (groupName === 'Finance' || groupName === 'Audit' || groupName === 'Management') {
      return {
        vouchers: { read: true, create: true, edit: true, delete: true },
        masters: { read: true, create: true, edit: true, delete: false },
        reports: { read: true, create: true, edit: true, delete: false },
        system: { read: false, create: false, edit: false, delete: false },
        audits: { read: true, create: false, edit: false, delete: false },
      };
    }
    if (groupName === 'Sales') {
      return {
        vouchers: { read: true, create: true, edit: false, delete: false },
        masters: { read: true, create: false, edit: false, delete: false },
        reports: { read: true, create: false, edit: false, delete: false },
        system: { read: false, create: false, edit: false, delete: false },
        audits: { read: false, create: false, edit: false, delete: false },
      };
    }
  }

  // Pure strict baseline fallback
  return {
    vouchers: { read: true, create: false, edit: false, delete: false },
    masters: { read: true, create: false, edit: false, delete: false },
    reports: { read: true, create: false, edit: false, delete: false },
    system: { read: false, create: false, edit: false, delete: false },
    audits: { read: false, create: false, edit: false, delete: false },
  };
};

export const GroupRulesTab: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ManagedUser | null>(null);
  const [activePane, setActivePane] = useState<'role' | 'department'>('role');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Expand states for permission matrices of each card to keep page beautifully minimal
  const [expandedMatrices, setExpandedMatrices] = useState<Record<string, boolean>>({});

  // Loaded policies
  const [rolePolicies, setRolePolicies] = useState<Record<string, GroupPolicy>>({});
  const [deptPolicies, setDeptPolicies] = useState<Record<string, GroupPolicy>>({});

  useEffect(() => {
    // 1. Load users to display statistics
    const savedUsers = localStorage.getItem('bharat_book_managed_users');
    let loadedUsers: ManagedUser[] = [];
    if (savedUsers) {
      try {
        loadedUsers = JSON.parse(savedUsers);
      } catch {
        loadedUsers = INITIAL_USERS;
      }
    } else {
      loadedUsers = INITIAL_USERS;
    }
    setUsers(loadedUsers);

    // 2. Load current user context
    const loggedInId = localStorage.getItem('bharat_book_current_logged_in_user_id');
    if (loggedInId) {
      const foundCurrent = loadedUsers.find(u => u.id === loggedInId);
      if (foundCurrent) {
        setCurrentUser(foundCurrent);
      } else if (loggedInId === 'usr-1' || loggedInId.includes('admin')) {
        setCurrentUser({
          id: 'usr-1',
          name: 'Super Admin',
          email: 'superadmin@bharatbook.com',
          phone: '+91 90000 00001',
          role: 'Super Admin',
          department: 'Developer',
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
          activityLogs: []
        });
      }
    }

    // 3. Load group-wise policy rules from localStorage
    try {
      const savedPoliciesStr = localStorage.getItem('bharat_book_security_policies');
      let savedPolicies: any = {};
      if (savedPoliciesStr) {
        savedPolicies = JSON.parse(savedPoliciesStr);
      }

      // Initialize Roles standard defaults or loaded ones
      const defaultRoleAttempts = savedPolicies.roleMaxAttempts || {
        'Super Admin': 999,
        'Owner': 5,
        'Admin': 5,
        'Manager': 3,
        'Editor': 3,
        'Viewer': 3,
        'Developer': 5
      };

      const defaultRoleTimeouts = savedPolicies.roleInactivityTimeouts || {
        'Super Admin': 15,
        'Owner': 30,
        'Admin': 30,
        'Manager': 30,
        'Editor': 45,
        'Viewer': 60,
        'Developer': 30
      };

      const loadedRoles: Record<string, GroupPolicy> = {};
      const rolesList = ['Super Admin', 'Owner', 'Admin', 'Manager', 'Editor', 'Viewer', 'Developer'];
      
      rolesList.forEach(r => {
        const key = `role_rule_${r}`;
        let ruleObj: any = {};
        if (savedPolicies[key]) {
          ruleObj = savedPolicies[key];
        } else {
          // Fallback init
          try {
            const rawStored = localStorage.getItem(`bharat_book_policy_role_${r}`);
            if (rawStored) ruleObj = JSON.parse(rawStored);
          } catch {}
        }

        loadedRoles[r] = {
          inactivityTimeoutMinutes: ruleObj.inactivityTimeoutMinutes !== undefined ? ruleObj.inactivityTimeoutMinutes : (defaultRoleTimeouts[r] || 30),
          maxLoginAttempts: ruleObj.maxLoginAttempts !== undefined ? ruleObj.maxLoginAttempts : (defaultRoleAttempts[r] || 5),
          dailyVoucherLimit: ruleObj.dailyVoucherLimit || 0,
          maxTransactionAmount: ruleObj.maxTransactionAmount || 0,
          workHoursMode: ruleObj.workHoursMode || 'any',
          requireMfaApproval: !!ruleObj.requireMfaApproval,
          permissions: ruleObj.permissions || createDefaultPermissions(r, true)
        };
      });
      setRolePolicies(loadedRoles);

      // Initialize Departments standard defaults or loaded ones
      const loadedDepts: Record<string, GroupPolicy> = {};
      const deptsList = ['Finance', 'Sales', 'IT Support', 'Audit', 'Developer', 'Management'];
      
      deptsList.forEach(d => {
        const key = `dept_rule_${d}`;
        let ruleObj: any = {};
        if (savedPolicies[key]) {
          ruleObj = savedPolicies[key];
        } else {
          try {
            const rawStored = localStorage.getItem(`bharat_book_policy_dept_${d}`);
            if (rawStored) ruleObj = JSON.parse(rawStored);
          } catch {}
        }

        loadedDepts[d] = {
          inactivityTimeoutMinutes: ruleObj.inactivityTimeoutMinutes || 0, // 0 inherits global/role default
          maxLoginAttempts: ruleObj.maxLoginAttempts || 0,
          dailyVoucherLimit: ruleObj.dailyVoucherLimit || 0,
          maxTransactionAmount: ruleObj.maxTransactionAmount || 0,
          workHoursMode: ruleObj.workHoursMode || 'any',
          requireMfaApproval: !!ruleObj.requireMfaApproval,
          permissions: ruleObj.permissions || createDefaultPermissions(d, false)
        };
      });
      setDeptPolicies(loadedDepts);

    } catch (e) {
      console.error("Error loading group rules", e);
    }
  }, []);

  const getMyRole = (): string => {
    return currentUser ? currentUser.role : 'Viewer';
  };

  const isAuthorizedToEdit = (): boolean => {
    const role = getMyRole();
    return role === 'Super Admin' || role === 'Owner' || role === 'Admin';
  };

  const saveAllState = (updatedRoles: Record<string, GroupPolicy>, updatedDepts: Record<string, GroupPolicy>) => {
    try {
      if (!isAuthorizedToEdit()) {
        setErrorMsg('Action Denied: You do not have sufficient privileges to change system group rules.');
        return;
      }

      // Read current policies to not wipe out top-level global settings we have
      let currentPolicies: any = {};
      try {
        const raw = localStorage.getItem('bharat_book_security_policies');
        if (raw) currentPolicies = JSON.parse(raw);
      } catch {}

      // Update role limits in legacy format as well for sync compatibility with other tabs
      const roleMaxAttempts: Record<string, number> = { ...currentPolicies.roleMaxAttempts };
      const roleInactivityTimeouts: Record<string, number> = { ...currentPolicies.roleInactivityTimeouts };

      Object.entries(updatedRoles).forEach(([role, policy]) => {
        roleMaxAttempts[role] = policy.maxLoginAttempts;
        roleInactivityTimeouts[role] = policy.inactivityTimeoutMinutes;
        
        // Save verbose rules in object format inside policies
        currentPolicies[`role_rule_${role}`] = policy;
      });

      Object.entries(updatedDepts).forEach(([dept, policy]) => {
        currentPolicies[`dept_rule_${dept}`] = policy;
      });

      currentPolicies.roleMaxAttempts = roleMaxAttempts;
      currentPolicies.roleInactivityTimeouts = roleInactivityTimeouts;
      currentPolicies.lastGroupRuleUpdate = Date.now();
      currentPolicies.lastGroupRuleUpdatedBy = currentUser?.name || 'Administrator';

      localStorage.setItem('bharat_book_security_policies', JSON.stringify(currentPolicies));
      
      // Also write simple feedback notification that it saved locally
      setSuccessMsg('Group rule policies synchronized and saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to save group policy configurations.');
    }
  };

  const updateRoleProperty = (roleName: string, key: keyof GroupPolicy, value: any) => {
    const nextRoles = {
      ...rolePolicies,
      [roleName]: {
        ...rolePolicies[roleName],
        [key]: value
      }
    };
    setRolePolicies(nextRoles);
    saveAllState(nextRoles, deptPolicies);
  };

  const updateDeptProperty = (deptName: string, key: keyof GroupPolicy, value: any) => {
    const nextDepts = {
      ...deptPolicies,
      [deptName]: {
        ...deptPolicies[deptName],
        [key]: value
      }
    };
    setDeptPolicies(nextDepts);
    saveAllState(rolePolicies, nextDepts);
  };

  // Toggle specific access flags inside role rule
  const toggleRolePermissionCell = (roleName: string, entity: keyof UserPermissions, action: 'read' | 'create' | 'edit' | 'delete') => {
    if (!isAuthorizedToEdit() || roleName === 'Super Admin') return;

    const currentPerms = { ...rolePolicies[roleName].permissions };
    currentPerms[entity] = {
      ...currentPerms[entity],
      [action]: !currentPerms[entity][action]
    };

    updateRoleProperty(roleName, 'permissions', currentPerms);
  };

  // Toggle specific access flags inside department rule
  const toggleDeptPermissionCell = (deptName: string, entity: keyof UserPermissions, action: 'read' | 'create' | 'edit' | 'delete') => {
    if (!isAuthorizedToEdit()) return;

    const currentPerms = { ...deptPolicies[deptName].permissions };
    currentPerms[entity] = {
      ...currentPerms[entity],
      [action]: !currentPerms[entity][action]
    };

    updateDeptProperty(deptName, 'permissions', currentPerms);
  };

  // Direct deployment of the custom permissions matrix to all current members in the database
  const propagateGroupPermissionsToMembers = (type: 'role' | 'dept', groupName: string, permissions: UserPermissions) => {
    try {
      if (!isAuthorizedToEdit()) {
        setErrorMsg('Action Denied: You do not have sufficient privileges to sync group profiles.');
        return;
      }

      const savedUsersStr = localStorage.getItem('bharat_book_managed_users');
      let loadedUsers: ManagedUser[] = [];
      if (savedUsersStr) {
        try {
          loadedUsers = JSON.parse(savedUsersStr);
        } catch {
          loadedUsers = INITIAL_USERS;
        }
      } else {
        loadedUsers = INITIAL_USERS;
      }

      let affectedCount = 0;
      const updatedUsers = loadedUsers.map(user => {
        const matchesGroup = type === 'role'
          ? user.role === groupName
          : user.department.toLowerCase() === groupName.toLowerCase();

        if (matchesGroup && user.role !== 'Super Admin') {
          affectedCount++;
          return {
            ...user,
            permissions: { ...permissions }
          };
        }
        return user;
      });

      localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      setSuccessMsg(`Instant Sync Success: Overwrote and deployed layout permissions to all ${affectedCount} active matching group members!`);
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg('Critical failure while propagating group level rules down to active users.');
    }
  };

  // Quick statistics calculation
  const getGroupUserCount = (type: 'role' | 'dept', groupName: string) => {
    return users.filter(u => {
      if (type === 'role') return u.role === groupName;
      return u.department.toLowerCase() === groupName.toLowerCase();
    }).length;
  };

  const toggleAccordion = (groupName: string) => {
    setExpandedMatrices(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const getAuthorizedLvl = (): string => {
    if (!isAuthorizedToEdit()) return 'Read-Only Mode';
    return `${getMyRole()} (Full Read/Write Authorities)`;
  };

  return (
    <div className="space-y-6">
      {/* Visual Header / Active Role Bar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <Sliders className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-tight">{t("Group Policy & Rule Controller")}</h3>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mt-0.5">{t("Configure unified security, operational, and financial rules group-wise")}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 self-start md:self-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Authority:</span>
            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider ${isAuthorizedToEdit() ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white'}`}>
              {getAuthorizedLvl()}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications Alert Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-2.5xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-2.5xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <p className="text-xs font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Conceptual Guide Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-indigo-100/40 dark:border-indigo-900/40 rounded-3xl">
        <div className="flex items-start gap-4">
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 shrink-0" />
          <div>
            <h4 className="text-xs font-black uppercase text-indigo-950 dark:text-indigo-200 tracking-wider">{t("How Group Rules Apply")}</h4>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 font-medium leading-relaxed">
              Instead of micro-managing settings for individual users, you can deploy policies directly to **Roles (e.g., Manager, Editor)** and **Departments (e.g., Finance, Sales)**.
              When a user belongs to a group, they inherit that group's rule. If both role-wise and department-wise policies apply, the system prioritizes the more restrictive security threshold.
            </p>
          </div>
        </div>
      </div>

      {/* Selector Tabs for Group Classifications */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 pb-px gap-3">
        <button
          onClick={() => setActivePane('role')}
          className={`pb-3 px-1 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activePane === 'role' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <Users className="w-4 h-4" />
          {t("Role-Wise Groups")}
        </button>
        <button
          onClick={() => setActivePane('department')}
          className={`pb-3 px-1 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activePane === 'department' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <Building className="w-4 h-4" />
          {t("Department-Wise Groups")}
        </button>
      </div>

      {/* Primary Configuration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {activePane === 'role' && (Object.entries(rolePolicies) as [string, GroupPolicy][]).map(([roleName, policy]) => {
          const userCount = getGroupUserCount('role', roleName);
          const isSuperAdmin = roleName === 'Super Admin';
          const isExpanded = !!expandedMatrices[roleName];

          return (
            <div 
              key={roleName} 
              className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-750 p-6 shadow-sm space-y-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
            >
              {/* Badge for User Count */}
              <div className="absolute top-4 right-4 text-[9px] bg-slate-100 dark:bg-gray-900 font-extrabold text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {userCount} {userCount === 1 ? 'member' : 'members'}
              </div>

              {/* Card Meta details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    {roleName} Group
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Rules automatically apply to all {roleName}s</p>
                </div>

                {/* Configurations Fields Stack */}
                <div className="space-y-3 pt-1">
                  
                  {/* 1. Inactivity Timeout */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {t("Inactivity Autologout")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit() || isSuperAdmin}
                      value={policy.inactivityTimeoutMinutes}
                      onChange={(e) => updateRoleProperty(roleName, 'inactivityTimeoutMinutes', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="10">{t("10 Minutes")}</option>
                      <option value="15">{t("15 Minutes")}</option>
                      <option value="30">{t("30 Minutes")}</option>
                      <option value="45">{t("45 Minutes")}</option>
                      <option value="60">{t("1 Hour")}</option>
                      <option value="120">{t("2 Hours")}</option>
                      <option value="360">{t("6 Hours")}</option>
                    </select>
                  </div>

                  {/* 2. Lockout attempt limits */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      {t("Login Defend Count")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit() || isSuperAdmin}
                      value={policy.maxLoginAttempts}
                      onChange={(e) => updateRoleProperty(roleName, 'maxLoginAttempts', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="3">{t("3 continuous failed")}</option>
                      <option value="5">{t("5 continuous failed")}</option>
                      <option value="10">{t("10 continuous failed")}</option>
                      <option value="15">{t("15 continuous failed")}</option>
                      <option value="999">{t("Unlimited Safety")}</option>
                    </select>
                  </div>

                  {/* 3. Daily voucher creation count restriction */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-gray-400" />
                      {t("Daily Upload Limit")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit() || isSuperAdmin}
                      value={policy.dailyVoucherLimit}
                      onChange={(e) => updateRoleProperty(roleName, 'dailyVoucherLimit', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="0">{t("Unlimited Posts")}</option>
                      <option value="10">{t("Max 10 / day")}</option>
                      <option value="50">{t("Max 50 / day")}</option>
                      <option value="100">{t("Max 100 / day")}</option>
                      <option value="300">{t("Max 300 / day")}</option>
                    </select>
                  </div>

                  {/* 4. Financial amount peak restriction per transaction */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-gray-400" />
                      {t("Max Single Trxn Limit")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit() || isSuperAdmin}
                      value={policy.maxTransactionAmount}
                      onChange={(e) => updateRoleProperty(roleName, 'maxTransactionAmount', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="0">Unlimited (No Ceiling)</option>
                      <option value="25000">₹ 25,000 INR</option>
                      <option value="100000">₹ 1,00,000 INR</option>
                      <option value="500000">₹ 5,00,000 INR</option>
                      <option value="2000000">₹ 20,00,000 INR</option>
                    </select>
                  </div>

                  {/* 5. Access Hours constraints */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {t("Working Hour Windows")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit() || isSuperAdmin}
                      value={policy.workHoursMode}
                      onChange={(e) => updateRoleProperty(roleName, 'workHoursMode', e.target.value as any)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="any">{t("24 / 7 Accessible")}</option>
                      <option value="business">Business hr (9am-6pm)</option>
                      <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                    </select>
                  </div>

                  {/* Custom Permission Matrix Accordion Trigger */}
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-700/50 mt-1">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(roleName)}
                      className="w-full flex items-center justify-between p-3 bg-indigo-50/30 hover:bg-indigo-50/60 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-2xl font-bold text-xs transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        {t("Custom System Permissions Matrix")}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Permission Grid */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/60 dark:bg-gray-900/50 border border-slate-100 dark:border-gray-850 rounded-2.5xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {isSuperAdmin ? (
                        <div className="p-3 bg-slate-100 dark:bg-gray-905 rounded-xl flex gap-2">
                          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                            {t("Super Admin maintains absolute read, create, edit, and deleting privileges across all backend corporate ERP modules. These logical keys are automatically locked down.")}
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[320px] border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700 text-[9px] uppercase font-black text-gray-400 dark:text-gray-500 text-left">
                                <th className="pb-2">{t("Section Area")}</th>
                                <th className="pb-2 text-center">{t("Read")}</th>
                                <th className="pb-2 text-center">{t("Create")}</th>
                                <th className="pb-2 text-center">{t("Edit")}</th>
                                <th className="pb-2 text-center">{t("Del")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[11px] font-bold text-gray-700 dark:text-gray-300">
                              {(['vouchers', 'masters', 'reports', 'system', 'audits'] as Array<keyof UserPermissions>).map(entity => (
                                <tr key={entity} className="hover:bg-slate-105/30">
                                  <td className="py-2.5 capitalize pr-1">
                                    {entity === 'system' ? 'Settings' : entity === 'audits' ? 'Audits' : entity}
                                  </td>
                                  {(['read', 'create', 'edit', 'delete'] as const).map(action => {
                                    const allowed = !!(policy.permissions && policy.permissions[entity] && policy.permissions[entity][action]);
                                    return (
                                      <td key={action} className="text-center py-2">
                                        <button
                                          type="button"
                                          disabled={!isAuthorizedToEdit()}
                                          onClick={() => toggleRolePermissionCell(roleName, entity, action)}
                                          className={`p-1 rounded-md transition-colors inline-flex justify-center items-center disabled:opacity-40 ${
                                            allowed 
                                              ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40' 
                                              : 'text-gray-300 dark:text-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
                                          }`}
                                        >
                                          {allowed ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
                                        </button>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Cascade Propagation Button */}
                          <div className="pt-4 border-t border-gray-150 dark:border-gray-800">
                            <button
                              type="button"
                              onClick={() => propagateGroupPermissionsToMembers('role', roleName, policy.permissions)}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Propagate permissions to all current {roleName}s
                            </button>
                            <p className="text-[9px] text-gray-400 font-bold mt-1.5 text-center uppercase tracking-widest pl-1">
                              Will overwrite matrices for all {userCount} group users
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {isSuperAdmin && (
                <p className="text-[10px] text-gray-400 font-bold bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-xl text-center mt-3">
                  🛠️ Note: Super Admin rules are strictly locked to prevent accidental lockouts of the primary core.
                </p>
              )}
            </div>
          );
        })}

        {activePane === 'department' && (Object.entries(deptPolicies) as [string, GroupPolicy][]).map(([deptName, policy]) => {
          const userCount = getGroupUserCount('dept', deptName);
          const isExpanded = !!expandedMatrices[deptName];

          return (
            <div 
              key={deptName} 
              className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-750 p-6 shadow-sm space-y-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
            >
              {/* Badge for User Count */}
              <div className="absolute top-4 right-4 text-[9px] bg-slate-100 dark:bg-gray-900 font-extrabold text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                {userCount} {userCount === 1 ? 'member' : 'members'}
              </div>

              {/* Card Meta details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-500" />
                    {deptName} Group
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 font-sans">{t("Rules automatically apply to all departmental members")}</p>
                </div>

                {/* Configurations Fields Stack */}
                <div className="space-y-3 pt-1">
                  
                  {/* 1. Inactivity Timeout */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {t("Inactivity Timeout")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit()}
                      value={policy.inactivityTimeoutMinutes}
                      onChange={(e) => updateDeptProperty(deptName, 'inactivityTimeoutMinutes', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="0">Default (Inherit)</option>
                      <option value="10">{t("10 Minutes")}</option>
                      <option value="15">{t("15 Minutes")}</option>
                      <option value="30">{t("30 Minutes")}</option>
                      <option value="45">{t("45 Minutes")}</option>
                      <option value="60">{t("1 Hour")}</option>
                      <option value="120">{t("2 Hours")}</option>
                      <option value="360">{t("6 Hours")}</option>
                    </select>
                  </div>

                  {/* 2. Lockout attempts limit */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      {t("Lockout Threshold")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit()}
                      value={policy.maxLoginAttempts}
                      onChange={(e) => updateDeptProperty(deptName, 'maxLoginAttempts', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="0">Default (Inherit)</option>
                      <option value="3">{t("3 Tries limit")}</option>
                      <option value="5">{t("5 Tries limit")}</option>
                      <option value="10">{t("10 Tries limit")}</option>
                      <option value="15">{t("15 Tries limit")}</option>
                      <option value="999">{t("Unlimited Safety")}</option>
                    </select>
                  </div>

                  {/* 3. Daily voucher creation count restriction */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-gray-400" />
                      {t("Daily Upload Limit")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit()}
                      value={policy.dailyVoucherLimit}
                      onChange={(e) => updateDeptProperty(deptName, 'dailyVoucherLimit', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="0">Default (Inherit)</option>
                      <option value="10">{t("Max 10 / day")}</option>
                      <option value="50">{t("Max 50 / day")}</option>
                      <option value="100">{t("Max 100 / day")}</option>
                      <option value="300">{t("Max 300 / day")}</option>
                    </select>
                  </div>

                  {/* 4. Financial amount peak restriction per transaction */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-gray-400" />
                      {t("Max Transaction limit")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit()}
                      value={policy.maxTransactionAmount}
                      onChange={(e) => updateDeptProperty(deptName, 'maxTransactionAmount', parseInt(e.target.value, 10))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="0">Default (Inherit)</option>
                      <option value="25000">₹ 25,000 INR</option>
                      <option value="100000">₹ 1,00,000 INR</option>
                      <option value="500000">₹ 5,00,000 INR</option>
                      <option value="2000000">₹ 20,00,000 INR</option>
                    </select>
                  </div>

                  {/* 5. Access Hours constraints */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-gray-900/35 rounded-2xl border border-slate-100/60 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {t("Working Hours Only")}
                    </span>
                    <select
                      disabled={!isAuthorizedToEdit()}
                      value={policy.workHoursMode}
                      onChange={(e) => updateDeptProperty(deptName, 'workHoursMode', e.target.value as any)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer text-right min-w-[120px] disabled:opacity-50"
                    >
                      <option value="any">{t("24 / 7 Unlimited")}</option>
                      <option value="business">Business hr (9am-6pm)</option>
                      <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                    </select>
                  </div>

                  {/* Custom Permission Matrix Accordion Trigger */}
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-700/50 mt-1">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(deptName)}
                      className="w-full flex items-center justify-between p-3 bg-emerald-50/30 hover:bg-emerald-50/60 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-bold text-xs transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        {t("Custom System Permissions Matrix")}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Permission Grid */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/60 dark:bg-gray-900/50 border border-slate-100 dark:border-gray-850 rounded-2.5xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[320px] border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-[9px] uppercase font-black text-gray-400 dark:text-gray-500 text-left">
                              <th className="pb-2">{t("Section Area")}</th>
                              <th className="pb-2 text-center">{t("Read")}</th>
                              <th className="pb-2 text-center">{t("Create")}</th>
                              <th className="pb-2 text-center">{t("Edit")}</th>
                              <th className="pb-2 text-center">{t("Del")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[11px] font-bold text-gray-700 dark:text-gray-300">
                            {(['vouchers', 'masters', 'reports', 'system', 'audits'] as Array<keyof UserPermissions>).map(entity => (
                              <tr key={entity} className="hover:bg-slate-105/30">
                                <td className="py-2.5 capitalize pr-1">
                                  {entity === 'system' ? 'Settings' : entity === 'audits' ? 'Audits' : entity}
                                </td>
                                {(['read', 'create', 'edit', 'delete'] as const).map(action => {
                                  const allowed = !!(policy.permissions && policy.permissions[entity] && policy.permissions[entity][action]);
                                  return (
                                    <td key={action} className="text-center py-2">
                                      <button
                                        type="button"
                                        disabled={!isAuthorizedToEdit()}
                                        onClick={() => toggleDeptPermissionCell(deptName, entity, action)}
                                        className={`p-1 rounded-md transition-colors inline-flex justify-center items-center disabled:opacity-40 ${
                                          allowed 
                                            ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40' 
                                            : 'text-gray-300 dark:text-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
                                        }`}
                                      >
                                        {allowed ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Cascade Propagation Button */}
                        <div className="pt-4 border-t border-gray-150 dark:border-gray-800">
                          <button
                            type="button"
                            onClick={() => propagateGroupPermissionsToMembers('dept', deptName, policy.permissions)}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all shadow-sm shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-95"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Propagate permissions to all {deptName}s
                          </button>
                          <p className="text-[9px] text-gray-400 font-bold mt-1.5 text-center uppercase tracking-widest pl-1">
                            Will overwrite matrices for all {userCount} group users
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          {t("Active group policies are evaluated in real-time. Any changes will instantly cascade down to logged-in user group contexts.")}
        </span>
      </div>
    </div>
  );
};
