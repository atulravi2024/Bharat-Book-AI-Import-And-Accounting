import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Lock, Unlock, Clock, Users, ArrowUpRight, AlertTriangle, CheckCircle, Save,
  ChevronDown, ChevronUp, Search, Upload, Download, Trash2, RotateCcw, HelpCircle,
  Info, Sliders, ShieldCheck, Activity, UserCheck
} from 'lucide-react';
import { ManagedUser, INITIAL_USERS } from './UserSettings';
import { useLanguage } from "../../../context/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';

export const SecuritySettings: React.FC = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [currentUser, setCurrentUser] = useState<ManagedUser | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    // Layout states matching HEADER_SEARCH_UI and COLLAPSIBLE_SECTIONS
    const [activeTab, setActiveTab] = useState<'policies' | 'users'>('policies');
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [fileFormat, setFileFormat] = useState<'JSON' | 'CSV'>('JSON');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Session inactivity timeout (saved in bharat_book_inactivity_timeout_minutes)
    const [inactivityTimeout, setInactivityTimeout] = useState<string>(() => {
        return localStorage.getItem('bharat_book_inactivity_timeout_minutes') || '30';
    });

    // Custom role based limits policy
    const [roleMaxAttempts, setRoleMaxAttempts] = useState<Record<string, number>>(() => {
        try {
            const saved = localStorage.getItem('bharat_book_security_policies');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.roleMaxAttempts) return parsed.roleMaxAttempts;
            }
        } catch {}
        return {
            'Super Admin': 999, // unlimited safety fallback
            'Owner': 5,
            'Admin': 5,
            'Manager': 3,
            'Editor': 3,
            'Viewer': 3,
            'Developer': 5
        };
    });

    // Custom role based inactivity timeout policy
    const [roleInactivityTimeouts, setRoleInactivityTimeouts] = useState<Record<string, number>>(() => {
        try {
            const saved = localStorage.getItem('bharat_book_security_policies');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.roleInactivityTimeouts) return parsed.roleInactivityTimeouts;
            }
        } catch {}
        return {
            'Super Admin': 15,
            'Owner': 30,
            'Admin': 30,
            'Manager': 30,
            'Editor': 45,
            'Viewer': 60,
            'Developer': 30
        };
    });

    // Load users and find current logged in context
    useEffect(() => {
        const savedUsers = localStorage.getItem('bharat_book_managed_users');
        let parsedUsers: ManagedUser[] = [];
        if (savedUsers) {
            try {
                parsedUsers = JSON.parse(savedUsers);
            } catch {
                parsedUsers = INITIAL_USERS;
            }
        } else {
            parsedUsers = INITIAL_USERS;
        }
        setUsers(parsedUsers);

        // Find current logged in user
        const loggedInId = localStorage.getItem('bharat_book_current_logged_in_user_id');
        if (loggedInId) {
            const foundCurrent = parsedUsers.find(u => u.id === loggedInId);
            if (foundCurrent) {
                setCurrentUser(foundCurrent);
            } else if (loggedInId === 'usr-1' || loggedInId.includes('admin')) {
                // Fallback context for Super Admin
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
    }, []);

    // Helper functions for user role evaluation
    const getCurrentRole = (): string => {
        return currentUser ? currentUser.role : 'Viewer';
    };

    const canChangeRolePolicies = (): boolean => {
        const role = getCurrentRole();
        return role === 'Super Admin' || role === 'Owner' || role === 'Admin';
    };

    const canManageUserSecurity = (targetUser: ManagedUser): boolean => {
        const myRole = getCurrentRole();
        const targetRole = targetUser.role;

        if (myRole === 'Super Admin') {
            return true; // Root Super Admin can manage anyone
        }
        if (myRole === 'Owner') {
            return targetRole !== 'Super Admin'; // Owner manages anyone but Super Admin
        }
        if (myRole === 'Admin') {
            // Admin manages anyone except Super Admin, Owner, and another Admin
            return targetRole !== 'Super Admin' && targetRole !== 'Owner' && targetRole !== 'Admin';
        }
        return false; // Other roles can't edit anyone
    };

    // Save Inactivity and Role attempts policies
    const handleSaveGlobalPolicies = (updatedAttempts?: Record<string, number>, updatedTimeouts?: Record<string, number>) => {
        setSuccessMsg('');
        setErrorMsg('');

        if (!canChangeRolePolicies()) {
            setErrorMsg(t('Action Denied: You do not have sufficient permissions to update security policies.'));
            return;
        }

        const activeAttempts = updatedAttempts || roleMaxAttempts;
        const activeTimeouts = updatedTimeouts || roleInactivityTimeouts;

        // Save timeout
        localStorage.setItem('bharat_book_inactivity_timeout_minutes', inactivityTimeout);

        // Save policies
        const policyObj = {
            roleMaxAttempts: activeAttempts,
            roleInactivityTimeouts: activeTimeouts,
            lastUpdatedBy: currentUser?.name || 'Authorized Admin',
            updatedAt: Date.now()
        };
        localStorage.setItem('bharat_book_security_policies', JSON.stringify(policyObj));

        setSuccessMsg(t('Global security policies updated successfully.'));
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleTimeoutChange = (minutes: string) => {
        setInactivityTimeout(minutes);
        localStorage.setItem('bharat_book_inactivity_timeout_minutes', minutes);
        setSuccessMsg(`${t("Auto logout inactivity window set to")} ${minutes} ${t("minutes")}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleRoleAttemptUpdate = (role: string, val: number) => {
        const nextAttempts = { ...roleMaxAttempts, [role]: val };
        setRoleMaxAttempts(nextAttempts);
        handleSaveGlobalPolicies(nextAttempts, roleInactivityTimeouts);
    };

    const handleRoleTimeoutUpdate = (role: string, val: number) => {
        const nextTimeouts = { ...roleInactivityTimeouts, [role]: val };
        setRoleInactivityTimeouts(nextTimeouts);
        handleSaveGlobalPolicies(roleMaxAttempts, nextTimeouts);
    };

    // User-specific updates
    const handleResetUserAttempts = (targetUser: ManagedUser) => {
        setSuccessMsg('');
        setErrorMsg('');

        if (!canManageUserSecurity(targetUser)) {
            setErrorMsg(`${t("Insufficient Privileges: You cannot unlock or reset attempts for")} ${targetUser.name} (${targetUser.role}).`);
            return;
        }

        const updatedUsers = users.map(u => {
            if (u.id === targetUser.id) {
                return {
                    ...u,
                    failedLoginAttempts: 0,
                    isLockedOut: false
                };
            }
            return u;
        });

        localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setSuccessMsg(`${t("Lockout status cleared and failed attempts reset to 0 for")} ${targetUser.name}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleUserMaxAttemptsChange = (targetUser: ManagedUser, value: string) => {
        setSuccessMsg('');
        setErrorMsg('');

        if (!canManageUserSecurity(targetUser)) {
            setErrorMsg(`${t("Insufficient Privileges: You cannot decide limits for")} ${targetUser.name} (${targetUser.role}).`);
            return;
        }

        const customLimit = parseInt(value, 10);

        const updatedUsers = users.map(u => {
            if (u.id === targetUser.id) {
                return {
                    ...u,
                    maxLoginAttempts: customLimit === 0 ? undefined : customLimit
                };
            }
            return u;
        });

        localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setSuccessMsg(`${t("Custom login attempt policy updated for")} ${targetUser.name}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // Global Action Toolbar Handlers
    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            try {
                if (fileFormat === 'CSV') {
                    const lines = content.split('\n');
                    let importedAttempts = { ...roleMaxAttempts };
                    let importedTimeouts = { ...roleInactivityTimeouts };
                    lines.forEach(line => {
                        const parts = line.split(',');
                        if (parts.length >= 2) {
                            const key = parts[0].trim();
                            const val = parts[1].trim();
                            if (key === 'inactivityTimeout') {
                                setInactivityTimeout(val);
                                localStorage.setItem('bharat_book_inactivity_timeout_minutes', val);
                            } else if (key.startsWith('attempt_')) {
                                const r = key.replace('attempt_', '');
                                importedAttempts[r] = parseInt(val, 10);
                            } else if (key.startsWith('timeout_')) {
                                const r = key.replace('timeout_', '');
                                importedTimeouts[r] = parseInt(val, 10);
                            }
                        }
                    });
                    setRoleMaxAttempts(importedAttempts);
                    setRoleInactivityTimeouts(importedTimeouts);
                    handleSaveGlobalPolicies(importedAttempts, importedTimeouts);
                    setSuccessMsg(t("Security configuration imported from CSV successfully!"));
                } else {
                    const parsed = JSON.parse(content);
                    if (parsed.inactivityTimeout) {
                        setInactivityTimeout(parsed.inactivityTimeout);
                        localStorage.setItem('bharat_book_inactivity_timeout_minutes', parsed.inactivityTimeout);
                    }
                    if (parsed.roleMaxAttempts) setRoleMaxAttempts(parsed.roleMaxAttempts);
                    if (parsed.roleInactivityTimeouts) setRoleInactivityTimeouts(parsed.roleInactivityTimeouts);
                    if (parsed.users) {
                        const nextUsers = users.map(u => {
                            const imported = parsed.users.find((match: any) => match.id === u.id || match.email === u.email);
                            if (imported) {
                                return {
                                    ...u,
                                    maxLoginAttempts: imported.maxLoginAttempts,
                                    failedLoginAttempts: imported.failedLoginAttempts ?? u.failedLoginAttempts,
                                    isLockedOut: imported.isLockedOut ?? u.isLockedOut,
                                };
                            }
                            return u;
                        });
                        setUsers(nextUsers);
                        localStorage.setItem('bharat_book_managed_users', JSON.stringify(nextUsers));
                    }
                    setSuccessMsg(t("Security configuration imported from JSON successfully!"));
                }
                setTimeout(() => setSuccessMsg(''), 4000);
            } catch (err) {
                setErrorMsg(t("Failed to parse configurations file."));
                setTimeout(() => setErrorMsg(''), 4000);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleExportFile = () => {
        const configData = {
            inactivityTimeout,
            roleMaxAttempts,
            roleInactivityTimeouts,
            users: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                maxLoginAttempts: u.maxLoginAttempts,
                failedLoginAttempts: u.failedLoginAttempts,
                isLockedOut: u.isLockedOut
            }))
        };

        let content = '';
        const filename = `security_policies_export.${fileFormat.toLowerCase()}`;

        if (fileFormat === 'CSV') {
            content = 'key,value\n';
            content += `inactivityTimeout,${inactivityTimeout}\n`;
            Object.entries(roleMaxAttempts).forEach(([role, limit]) => {
                content += `attempt_${role},${limit}\n`;
            });
            Object.entries(roleInactivityTimeouts).forEach(([role, idle]) => {
                content += `timeout_${role},${idle}\n`;
            });
        } else {
            content = JSON.stringify(configData, null, 2);
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setSearchQuery('');
        const updatedUsers = users.map(u => ({
            ...u,
            maxLoginAttempts: undefined,
            failedLoginAttempts: 0,
            isLockedOut: false
        }));
        setUsers(updatedUsers);
        localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
        setSuccessMsg(t('All custom login overrides and lockout states have been cleared.'));
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleReset = () => {
        setInactivityTimeout('30');
        localStorage.setItem('bharat_book_inactivity_timeout_minutes', '30');
        const defaultAttempts = {
            'Super Admin': 999,
            'Owner': 5,
            'Admin': 5,
            'Manager': 3,
            'Editor': 3,
            'Viewer': 3,
            'Developer': 5
        };
        const defaultTimeouts = {
            'Super Admin': 15,
            'Owner': 30,
            'Admin': 30,
            'Manager': 30,
            'Editor': 45,
            'Viewer': 60,
            'Developer': 30
        };
        setRoleMaxAttempts(defaultAttempts);
        setRoleInactivityTimeouts(defaultTimeouts);

        const updatedUsers = users.map(u => ({
            ...u,
            maxLoginAttempts: undefined,
            failedLoginAttempts: 0,
            isLockedOut: false
        }));
        setUsers(updatedUsers);
        localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));

        // Save policies
        const policyObj = {
            roleMaxAttempts: defaultAttempts,
            roleInactivityTimeouts: defaultTimeouts,
            lastUpdatedBy: currentUser?.name || 'Super Admin',
            updatedAt: Date.now()
        };
        localStorage.setItem('bharat_book_security_policies', JSON.stringify(policyObj));

        setSuccessMsg(t('Security settings restored to factory defaults.'));
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleSaveConfig = () => {
        handleSaveGlobalPolicies();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    // Search Matching / Visibility Logic matching SEARCH_ARCHITECTURE and COLLAPSIBLE_SECTIONS
    const isSectionMatching = (secId: string): boolean => {
        if (!searchQuery) return false;
        const query = searchQuery.toLowerCase().trim();
        if (secId === 'session') {
            return ['timeout', 'inactivity', 'session', 'auto-logout', 'logout', 'minutes', 'duration'].some(k => k.includes(query) || query.includes(k));
        }
        if (secId === 'defaults') {
            return ['role', 'default', 'attempts', 'tries', 'admin', 'owner', 'manager', 'editor', 'viewer', 'developer'].some(k => k.includes(query) || query.includes(k));
        }
        if (secId === 'overrides') {
            const matchesUser = users.some(u => 
                u.name.toLowerCase().includes(query) || 
                u.email.toLowerCase().includes(query) || 
                u.role.toLowerCase().includes(query)
            );
            return matchesUser || ['override', 'user', 'lock', 'failed', 'unlock', 'portal', 'attempts'].some(k => k.includes(query) || query.includes(k));
        }
        return false;
    };

    const policyMatchCount = (isSectionMatching('session') ? 1 : 0) + (isSectionMatching('defaults') ? 1 : 0);
    const userMatchCount = isSectionMatching('overrides') ? 1 : 0;

    const isSessionExpanded = activeAccordion === 'session' || (Boolean(searchQuery) && isSectionMatching('session'));
    const isDefaultsExpanded = activeAccordion === 'defaults' || (Boolean(searchQuery) && isSectionMatching('defaults'));
    const isOverridesExpanded = activeAccordion === 'overrides' || (Boolean(searchQuery) && isSectionMatching('overrides'));

    const toggleAccordion = (section: string) => {
        setActiveAccordion(prev => prev === section ? null : section);
    };

    // Filtered users list based on searching
    const filteredUsers = users.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase().trim();
        return item.name.toLowerCase().includes(query) || 
               item.email.toLowerCase().includes(query) || 
               item.role.toLowerCase().includes(query);
    });

    const isToolbarHiddenOnMobile = isSearchFocused || !!searchQuery;
    const currentRoleLabel = getCurrentRole();

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-300">
            {/* 1. Header component fully matching UserSettings / AlertChannel with stacked rows layout on mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
                <div className="flex items-center gap-3 shrink-0 min-w-0 md:max-w-md">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl mr-1 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                        <Shield className="w-5 h-5" /> 
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight truncate">{t("Security Controls")}</h2>
                        <p className="text-[10px] xs:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate whitespace-nowrap" title={t("Manage security rules, lockout limits, and session timeouts")}>
                            {t("Manage security rules, lockout limits, and session timeouts")}
                        </p>
                    </div>
                </div>

                {/* Tab selections container */}
                <div className="min-w-0 flex-1 flex items-center">
                    <div 
                        ref={tabsContainerRef}
                        onWheel={handleWheel}
                        className="w-full sm:w-auto sm:ml-auto flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm overflow-x-auto custom-scrollbar max-w-full border border-gray-200/40 dark:border-gray-700/40 justify-start min-w-0 scroll-smooth"
                    >
                        <button 
                            onClick={() => { setActiveTab('policies'); setActiveAccordion(null); }}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'policies' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                            }`}
                        >
                            <Sliders className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'policies' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            <span>{t("Policies & Thresholds")}</span>
                            {searchQuery && policyMatchCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {policyMatchCount}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('users'); setActiveAccordion(null); }}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                                activeTab === 'users' 
                                ? 'bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/30'
                            }`}
                        >
                            <UserCheck className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'users' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            <span>{t("User Specific Locks")}</span>
                            {searchQuery && userMatchCount > 0 && (
                                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                                    {userMatchCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Compact Actions Toolbar with Search Filter fully matching HEADER_SEARCH_UI */}
            <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex-1 min-w-0 relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder={t("Filter security preferences...")} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="w-full pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-650 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            title={t("Clear")}
                        >
                            <svg className="w-3 h-3 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Interactive Config Utilities with temporary mobile focus collapse */}
                <div className={`flex-row flex-nowrap items-center justify-end gap-0.5 sm:gap-1 bg-transparent sm:bg-gray-50 dark:sm:bg-gray-900/50 sm:p-1 rounded-xl sm:border sm:border-gray-200 dark:sm:border-gray-700 shrink-0 overflow-x-auto custom-scrollbar ${isToolbarHiddenOnMobile ? "hidden sm:flex" : "flex"}`}>
                    <div className="relative inline-flex items-center shrink-0">
                        <select
                            value={fileFormat}
                            onChange={(e) => setFileFormat(e.target.value as 'JSON' | 'CSV')}
                            className="appearance-none pl-2.5 pr-6 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg border border-gray-200 dark:border-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm outline-none cursor-pointer leading-none flex items-center justify-center gap-1.5 shrink-0"
                            title={t("Simple Input and Output")}
                        >
                            <option value="JSON" className="bg-white dark:bg-gray-800">JSON</option>
                            <option value="CSV" className="bg-white dark:bg-gray-800">CSV</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-400 dark:text-gray-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Import Configurations")}
                    >
                        <Upload className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Import")}</span>
                    </button>

                    <button
                        onClick={handleExportFile}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Export Configurations")}
                    >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Export")}</span>
                    </button>

                    <button
                        onClick={handleClear}
                        className="hidden lg:flex px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 items-center justify-center gap-1.5 shrink-0"
                        title={t("Clear Custom Locks")}
                    >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Clear")}</span>
                    </button>

                    <button
                        onClick={handleReset}
                        className="px-2 sm:px-3 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                        title={t("Reset Defaults")}
                    >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden lg:inline leading-none">{t("Reset")}</span>
                    </button>

                    <div className="hidden sm:block w-px h-3.5 bg-gray-300 dark:bg-gray-600 mx-1 shrink-0"></div>

                    <button
                        onClick={handleSaveConfig}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 ${isSaved ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        title={isSaved ? t("Saved Configuration") : t("Save Configuration")}
                    >
                        {isSaved ? <CheckCircle className="w-3.5 h-3.5 shrink-0 animate-bounce text-emerald-600" /> : <Save className="w-3.5 h-3.5 shrink-0" />}
                        <span className="hidden lg:inline leading-none">{isSaved ? t("Saved") : t("Save")}</span>
                    </button>
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportFile} 
                accept={fileFormat === 'JSON' ? '.json' : '.csv'} 
                className="hidden" 
            />

            {/* 3. Success / Error Feedback notifications */}
            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs font-semibold">{successMsg}</p>
                </div>
            )}
            {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <p className="text-xs font-semibold">{errorMsg}</p>
                </div>
            )}

            {/* Active System Login Role Context Badge Bar */}
            <div className="p-3 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-150 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider flex items-center gap-1.5 sm:pl-1">
                    <Activity className="w-3.5 h-3.5 text-blue-500" /> 
                    {t("Active Administrator Role Context:")}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-md tracking-wider">
                    {currentRoleLabel}
                </span>
            </div>

            {/* 4. Single-Expand Collapsible Accordions with exact full-screen layout constraints */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                
                {/* TAB 1: Policies & Thresholds */}
                {activeTab === 'policies' && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        
                        {/* 4.1 Inactivity Session Timeout control accordion */}
                        <div className="overflow-hidden">
                            <button
                                onClick={() => toggleAccordion("session")}
                                className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Clock className="w-4 h-4" />
                                    </span>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                        {t("Session Timeout Configuration")}
                                    </h3>
                                </div>
                                {isSessionExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isSessionExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 sm:px-8 space-y-6 bg-white dark:bg-gray-850">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                                {t("Configure absolute idle duration timers to enforce automated browser-session lockouts and guard endpoints against unattended physical breaches.")}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gray-50/40 dark:bg-gray-900/20 p-4 sm:p-6 rounded-2xl border border-gray-150 dark:border-gray-800">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t("Timeout Limit")}</label>
                                                    <p className="text-[10px] text-gray-400">{t("Active browser context resets this limit automatically")}</p>
                                                </div>
                                                <select
                                                    value={inactivityTimeout}
                                                    onChange={(e) => handleTimeoutChange(e.target.value)}
                                                    className="w-full p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 hover:border-gray-350 dark:hover:border-gray-600 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 outline-none cursor-pointer leading-none transition-colors"
                                                >
                                                    <option value="10">{t("10 Minutes")}</option>
                                                    <option value="15">{t("15 Minutes")}</option>
                                                    <option value="30">{t("30 Minutes (Recommended)")}</option>
                                                    <option value="45">{t("45 Minutes")}</option>
                                                    <option value="60">{t("1 Hour")}</option>
                                                    <option value="120">{t("2 Hours")}</option>
                                                    <option value="360">{t("6 Hours")}</option>
                                                </select>
                                            </div>

                                            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed flex items-start gap-2 bg-blue-50/20 dark:bg-blue-900/5 p-4 rounded-xl border border-blue-100/30 dark:border-blue-900/20">
                                                <ArrowUpRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
                                                <span>{t("Security Enforcement Protocol: When a browser interface remains inactive without mouse movements, typing, touch sweeps, or scrolling operations for the specified duration, the session is forcefully invalidated and routed to the secure login lock screen.")}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 4.2 Role-Group Default Policies accordion */}
                        <div className="overflow-hidden">
                            <button
                                onClick={() => toggleAccordion("defaults")}
                                className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Users className="w-4 h-4" />
                                    </span>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                        {t("Role Default Limits & Rules")}
                                    </h3>
                                </div>
                                {isDefaultsExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isDefaultsExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 sm:px-8 space-y-6 bg-white dark:bg-gray-850 text-left">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                                {t("Maintain role-group level baseline profiles. When specific user-wise limits are not customized, the server inherits attempts thresholds and idle logouts according to these active role classifications.")}
                                            </p>

                                            <div className="space-y-3.5 divide-y divide-gray-100/50 dark:divide-gray-800/50">
                                                {Object.entries(roleMaxAttempts)
                                                .filter(([role]) => role !== 'Super Admin')
                                                .map(([role, limit]) => (
                                                    <div key={role} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 bg-white dark:bg-gray-850 first:pt-0 last:pb-0 gap-3">
                                                        <div className="space-y-0.5">
                                                            <span className="text-xs font-black text-gray-800 dark:text-gray-100 tracking-tight uppercase flex items-center gap-1.5">
                                                                <Sliders className="w-3 text-blue-500" /> {t(role)}
                                                            </span>
                                                            <p className="text-[10px] text-gray-400 font-medium">{t("Default baseline safety bounds")}</p>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {/* Login Tries Attempts */}
                                                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-905 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-800">
                                                                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("Tries:")}</span>
                                                                <select
                                                                    disabled={!canChangeRolePolicies()}
                                                                    value={limit}
                                                                    onChange={(e) => handleRoleAttemptUpdate(role, parseInt(e.target.value, 10))}
                                                                    className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer disabled:opacity-50"
                                                                >
                                                                    <option value="3">{t("3 Tries")}</option>
                                                                    <option value="5">{t("5 Tries")}</option>
                                                                    <option value="10">{t("10 Tries")}</option>
                                                                    <option value="15">{t("15 Tries")}</option>
                                                                    <option value="999">{t("Unlimited")}</option>
                                                                </select>
                                                            </div>
                                                            {/* Inactivity Threshold */}
                                                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-905 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-800">
                                                                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("Idle:")}</span>
                                                                <select
                                                                    disabled={!canChangeRolePolicies()}
                                                                    value={roleInactivityTimeouts[role] || 30}
                                                                    onChange={(e) => handleRoleTimeoutUpdate(role, parseInt(e.target.value, 10))}
                                                                    className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-200 outline-none cursor-pointer disabled:opacity-50"
                                                                >
                                                                    <option value="10">{t("10 Min")}</option>
                                                                    <option value="15">{t("15 Min")}</option>
                                                                    <option value="30">{t("30 Min")}</option>
                                                                    <option value="45">{t("45 Min")}</option>
                                                                    <option value="60">{t("1 Hour")}</option>
                                                                    <option value="120">{t("2 Hours")}</option>
                                                                    <option value="360">{t("6 Hours")}</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {!canChangeRolePolicies() && (
                                                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-xl border border-rose-100/40 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider text-center">
                                                    {t("Sufficient administrative level (Super Admin, Owner, or Admin) is required to fine-tune group default policies.")}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* TAB 2: User lockouts list & specific controls */}
                {activeTab === 'users' && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        <div className="overflow-hidden">
                            <button
                                onClick={() => toggleAccordion("overrides")}
                                className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                        {t("Active Portal Lockouts & Overrides")}
                                    </h3>
                                </div>
                                {isOverridesExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isOverridesExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 sm:px-8 space-y-6 bg-white dark:bg-gray-850">
                                            
                                            {/* Security Hierarchical guidelines message bubble */}
                                            <div className="p-4 bg-sky-50 dark:bg-sky-950/20 rounded-xl border border-sky-100 dark:border-sky-900/30 text-sky-800 dark:text-sky-300">
                                                <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-wider text-[10px]">
                                                    <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                                                    <span>{t("Lockout Security Rules Enforced")}</span>
                                                </div>
                                                <ul className="list-disc pl-5 space-y-1 text-[11px] font-semibold leading-relaxed">
                                                    <li>{t("Super Admin can configure overrides and unlock all users in the workspace")}</li>
                                                    <li>{t("Owner can manage any users except target Super Admin accounts")}</li>
                                                    <li>{t("Admin can manage security rules for Viewers, Editors, and Managers (strictly excluding Super Admin, Owner, and other Admins)")}</li>
                                                </ul>
                                            </div>

                                            {/* Userwise Controls Data Table */}
                                            <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                            <th className="p-4 pl-6">{t("User Profile")}</th>
                                                            <th className="p-4">{t("Role baseline")}</th>
                                                            <th className="p-4">{t("Custom Tries Limit")}</th>
                                                            <th className="p-4 text-center">{t("Failed Attempts")}</th>
                                                            <th className="p-4">{t("Account Lock Status")}</th>
                                                            <th className="p-4 pr-6 text-right">{t("Quick Actions")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                                                        {filteredUsers.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="p-8 text-center text-gray-500 font-bold uppercase tracking-wider">
                                                                    {t("No users found matching query")}
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            filteredUsers.map((item) => {
                                                                const editable = canManageUserSecurity(item);
                                                                const currentAttempts = item.failedLoginAttempts || 0;
                                                                const defaultLimit = roleMaxAttempts[item.role] || 5;
                                                                const activeLimit = item.maxLoginAttempts !== undefined && item.maxLoginAttempts !== null
                                                                    ? item.maxLoginAttempts
                                                                    : defaultLimit;

                                                                const isUserLocked = !!item.isLockedOut || (item.failedLoginAttempts && item.failedLoginAttempts >= activeLimit);

                                                                return (
                                                                    <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-gray-900/10 transition-colors">
                                                                        <td className="p-4 pl-6">
                                                                            <div>
                                                                                <p className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                                                                                    {item.name}
                                                                                    {item.id === currentUser?.id && (
                                                                                        <span className="text-[9px] bg-slate-100 dark:bg-gray-800 text-slate-500 font-black px-1.5 py-0.5 rounded uppercase">{t("You")}</span>
                                                                                    )}
                                                                                </p>
                                                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.email} • <span className="text-blue-500 font-bold uppercase tracking-wider text-[9px]">{item.role}</span></p>
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4">
                                                                            <div className="flex flex-col gap-0.5">
                                                                                <span className="font-mono text-[9px] text-gray-500 dark:text-gray-450 font-bold bg-gray-100/50 dark:bg-gray-900 px-1.5 py-0.5 rounded w-fit">
                                                                                    Limit: {defaultLimit === 999 ? 'Unlimited' : `${defaultLimit} tries`}
                                                                                </span>
                                                                                <span className="font-mono text-[9px] text-gray-450 dark:text-gray-450 font-bold bg-gray-100/50 dark:bg-gray-900 px-1.5 py-0.5 rounded w-fit">
                                                                                    Idle: {roleInactivityTimeouts[item.role] || 30}m
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-4">
                                                                            <select
                                                                                disabled={!editable}
                                                                                value={item.maxLoginAttempts || 0}
                                                                                onChange={(e) => handleUserMaxAttemptsChange(item, e.target.value)}
                                                                                className="p-1 px-2.5 bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-750 hover:border-gray-350 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 outline-none disabled:opacity-50 cursor-pointer"
                                                                            >
                                                                                <option value="0">{t("Default Role")}</option>
                                                                                <option value="3">{t("Max 3")}</option>
                                                                                <option value="5">{t("Max 5")}</option>
                                                                                <option value="10">{t("Max 10")}</option>
                                                                                <option value="15">{t("Max 15")}</option>
                                                                                <option value="999">{t("Unlimited")}</option>
                                                                            </select>
                                                                        </td>
                                                                        <td className="p-4 text-center font-mono font-bold">
                                                                            <span className={currentAttempts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}>
                                                                                {currentAttempts}
                                                                            </span>
                                                                            <span className="text-gray-300 mx-1">/</span>
                                                                            <span className="text-gray-400">
                                                                                {activeLimit === 999 ? '∞' : activeLimit}
                                                                            </span>
                                                                        </td>
                                                                        <td className="p-4">
                                                                            {isUserLocked ? (
                                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20">
                                                                                    <Lock className="w-3 h-3 shrink-0" /> {t("Locked Out")}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20">
                                                                                    <Unlock className="w-3 h-3 shrink-0" /> {t("Active / OK")}
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td className="p-4 pr-6 text-right">
                                                                            {editable ? (
                                                                                <button
                                                                                    onClick={() => handleResetUserAttempts(item)}
                                                                                    className={`py-1 px-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                                        isUserLocked 
                                                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:' 
                                                                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/60 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-750'
                                                                                    }`}
                                                                                >
                                                                                    {isUserLocked ? t('Unlock Portal') : t('Reset Tries')}
                                                                                </button>
                                                                            ) : (
                                                                                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center justify-end gap-1 select-none">
                                                                                    <Lock className="w-3 h-3 text-gray-300" /> {t("Role Restrict")}
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Security Optimization Advice Bubble */}
            <div className="bg-blue-50/40 dark:bg-blue-900/5 p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/20 flex gap-3 items-start animate-in fade-in">
                <HelpCircle className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t("Administrative Advice:")}</h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        {t("To ensure pristine workspace controls, periodically purge failed attempts limits or enforce default inactivations. Always set session times to less than 60 minutes for high security clearance roles.")}
                    </p>
                </div>
            </div>
        </div>
    );
};
