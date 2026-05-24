import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, Clock, Users, ArrowUpRight, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { ManagedUser, INITIAL_USERS } from './UserSettings';

export const SecuritySettings: React.FC = () => {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [currentUser, setCurrentUser] = useState<ManagedUser | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

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

    // "The owner and admin can set this according to the user role."
    // (And Super Admin as well since they are the ultimate root role)
    const canChangeRolePolicies = (): boolean => {
        const role = getCurrentRole();
        return role === 'Super Admin' || role === 'Owner' || role === 'Admin';
    };

    // Restriction rules:
    // "- The super admin can decide each user.
    //  - The owner can decide each user, but not the super admin.
    //  - The admin can decide each user other than the super admin and owner and admin."
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
            setErrorMsg('Action Denied: You do not have sufficient permissions to update security policies.');
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

        setSuccessMsg('Global security policies updated successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleTimeoutChange = (minutes: string) => {
        setInactivityTimeout(minutes);
        localStorage.setItem('bharat_book_inactivity_timeout_minutes', minutes);
        setSuccessMsg(`Auto logout inactivity window set to ${minutes} minutes.`);
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
            setErrorMsg(`Insufficient Privileges: You cannot unlock or reset attempts for ${targetUser.name} (${targetUser.role}).`);
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
        setSuccessMsg(`Lockout status cleared and failed attempts reset to 0 for ${targetUser.name}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleUserMaxAttemptsChange = (targetUser: ManagedUser, value: string) => {
        setSuccessMsg('');
        setErrorMsg('');

        if (!canManageUserSecurity(targetUser)) {
            setErrorMsg(`Insufficient Privileges: You cannot decide limits for ${targetUser.name} (${targetUser.role}).`);
            return;
        }

        // Parse to custom attempts count override (0 means inherit default)
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
        setSuccessMsg(`Custom login attempt policy updated for ${targetUser.name}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const currentRoleLabel = getCurrentRole();

    return (
        <div className="space-y-6">
            {/* Header / Active Role Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                        <Shield className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-tight">Security & Access Management Panel</h3>
                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mt-0.5">Maintain roles, session timers, and login attempts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-700 rounded-xl">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Context:</span>
                    <span className="text-[10px] uppercase font-black bg-blue-600 text-white px-2 py-0.5 rounded-md tracking-wider">
                        {currentRoleLabel}
                    </span>
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

            {/* Section 1: Inactivity and Policy Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1.1 Inactivity Timer Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:bg-gray-800 dark:border-gray-700">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Inactivity Auto-Logout Timeout
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mb-6">
                        Automatically terminate active system sessions after continuous idle time to defend against physical desk-based endpoint breaches.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-slate-100 dark:border-gray-800 flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Set Timeout Threshold</label>
                            <select
                                value={inactivityTimeout}
                                onChange={(e) => handleTimeoutChange(e.target.value)}
                                className="p-2.5 px-4 bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-700 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-300 outline-none text-right cursor-pointer"
                            >
                                <option value="10">10 Minutes</option>
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes (Recommended)</option>
                                <option value="45">45 Minutes</option>
                                <option value="60">1 Hour</option>
                                <option value="120">2 Hours</option>
                                <option value="360">6 Hours</option>
                            </select>
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed pl-1 flex items-start gap-1.5">
                            <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>This setting runs dynamically on the frontend. Active browser inputs (key presses, mouse operations, scroll, touch) continuously reset the timeout.</span>
                        </div>
                    </div>
                </div>

                {/* 1.2 Role Groups Security Threshold */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:bg-gray-800 dark:border-gray-700">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        Role-Group Default Policies
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mb-6">
                        Establish defense policies per user classification. Select default inactivity session timeouts and default login attempt counts for role-wise groups.
                    </p>

                    <div className="space-y-3.5">
                        {Object.entries(roleMaxAttempts)
                        .filter(([role]) => role !== 'Super Admin') // Super admin default limit has separate high safety threshold
                        .map(([role, limit]) => (
                            <div key={role} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-dashed border-slate-100 dark:border-gray-800 last:border-0 gap-2">
                                <span className="text-xs font-black text-slate-700 dark:text-gray-300 tracking-tight uppercase">{role}</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Default Attempts selection */}
                                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-gray-900 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-gray-800">
                                        <span className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-wider">Attempts:</span>
                                        <select
                                            disabled={!canChangeRolePolicies()}
                                            value={limit}
                                            onChange={(e) => handleRoleAttemptUpdate(role, parseInt(e.target.value, 10))}
                                            className="bg-transparent text-[11px] font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="3">3 Tries</option>
                                            <option value="5">5 Tries</option>
                                            <option value="10">10 Tries</option>
                                            <option value="15">15 Tries</option>
                                            <option value="999">Unlimited</option>
                                        </select>
                                    </div>
                                    {/* Default Inactivity Timeout selection */}
                                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-gray-900 px-2.5 py-1 rounded-xl border border-slate-100 dark:border-gray-800">
                                        <span className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-wider">Timeout:</span>
                                        <select
                                            disabled={!canChangeRolePolicies()}
                                            value={roleInactivityTimeouts[role] || 30}
                                            onChange={(e) => handleRoleTimeoutUpdate(role, parseInt(e.target.value, 10))}
                                            className="bg-transparent text-[11px] font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="10">10 Min</option>
                                            <option value="15">15 Min</option>
                                            <option value="30">30 Min</option>
                                            <option value="45">45 Min</option>
                                            <option value="60">1 Hour</option>
                                            <option value="120">2 Hours</option>
                                            <option value="360">6 Hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!canChangeRolePolicies() && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold mt-2 text-center pl-1 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-xl">
                                Only Super Admin, Owner, or Admin can configure global role-group lockout rules.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: User specific login decision table */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-600" />
                            User Specific Security Decisions
                        </h4>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                            Fine tune security thresholds. Enforce individual login attempt controls, unlock locked-out portals, and monitor suspicious access counts.
                        </p>
                    </div>
                    
                    <div className="text-[10px] bg-sky-50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-300 p-3 rounded-xl border border-sky-100 dark:border-sky-900/30 max-w-sm">
                        <p className="font-bold uppercase tracking-wider text-[9px] text-sky-900 dark:text-sky-200 mb-1">Hierarchy Rules Enforced:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Super Admin decides all users</li>
                            <li>Owner decides everyone except Super Admin</li>
                            <li>Admin decides non-manager, and roles except Admin, Owner, Super Admin</li>
                        </ul>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-gray-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-gray-900/70 border-b border-slate-100 dark:border-gray-800 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                <th className="p-4 pl-6">User Context</th>
                                <th className="p-4">Global Role Defaults</th>
                                <th className="p-4">Custom Desired Limit</th>
                                <th className="p-4">Failed Counts</th>
                                <th className="p-4">Lock Status</th>
                                <th className="p-4 pr-6 text-right">Protection Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-gray-800 text-xs">
                            {users.map((item) => {
                                const editable = canManageUserSecurity(item);
                                const currentAttempts = item.failedLoginAttempts || 0;
                                const defaultLimit = roleMaxAttempts[item.role] || 5;
                                const activeLimit = item.maxLoginAttempts !== undefined && item.maxLoginAttempts !== null
                                    ? item.maxLoginAttempts
                                    : defaultLimit;

                                const isUserLocked = !!item.isLockedOut || (item.failedLoginAttempts && item.failedLoginAttempts >= activeLimit);

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                    {item.name}
                                                    {item.id === currentUser?.id && (
                                                        <span className="text-[9px] bg-slate-100 dark:bg-gray-800 text-slate-500 font-extrabold px-1.5 py-0.5 rounded uppercase">You</span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.email} • <span className="text-blue-500 text-[9px] font-bold uppercase tracking-wider">{item.role}</span></p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400 font-bold bg-slate-50 dark:bg-gray-900 px-2 py-0.5 rounded-md w-fit">
                                                    Limit: {defaultLimit === 999 ? 'Unlimited' : `${defaultLimit} tries`}
                                                </span>
                                                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-400 font-semibold bg-slate-50 dark:bg-gray-900 px-2 py-0.5 rounded-md w-fit">
                                                    Idle: {roleInactivityTimeouts[item.role] || 30}m
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                disabled={!editable}
                                                value={item.maxLoginAttempts || 0}
                                                onChange={(e) => handleUserMaxAttemptsChange(item, e.target.value)}
                                                className="p-1 px-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-300 outline-none disabled:opacity-50"
                                            >
                                                <option value="0">Inherit Default</option>
                                                <option value="3">Max 3 tries</option>
                                                <option value="5">Max 5 tries</option>
                                                <option value="10">Max 10 tries</option>
                                                <option value="15">Max 15 tries</option>
                                                <option value="999">Unlimited</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-mono text-xs font-bold ${currentAttempts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                                                    {currentAttempts}
                                                </span>
                                                <span className="text-gray-300">/</span>
                                                <span className="font-mono text-xs text-slate-500">
                                                    {activeLimit === 999 ? '∞' : activeLimit}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {isUserLocked ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30">
                                                    <Lock className="w-3 h-3 shrink-0" /> Locked Out
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                                                    <Unlock className="w-3 h-3 shrink-0" /> Active / OK
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            {editable ? (
                                                <button
                                                    onClick={() => handleResetUserAttempts(item)}
                                                    className={`p-2 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        isUserLocked 
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-50' 
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-750'
                                                    }`}
                                                >
                                                    {isUserLocked ? 'Unlock Portal' : 'Reset Attempts'}
                                                </button>
                                            ) : (
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                                                    <Lock className="w-3 h-3 text-slate-300" /> Insufficient Level
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
