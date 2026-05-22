import React from 'react';
import { Lock, Shield, Info, Key } from 'lucide-react';

export const SuperAdminSettings = () => {
  // Super Admin Profile coordinates - Read-Only on UI, only changeable in source code.
  const profileName = 'Super Admin';
  const profileEmail = 'superadmin@bharatbook.com';
  const profilePhone = '+91 90000 00001';
  const profileDept = 'Core Security Governance';
  const profileBio = 'Root Authority. Absolute programmatic control, system locks, and database backup overrides. Security criteria can only be altered directly via raw source code recompilation.';

  return (
    <div className="relative max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
      <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
          SA
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest dark:text-white leading-none flex items-center mb-1">
            Super Admin Workspace Identity <Lock className="w-3 h-3 ml-2 text-rose-500" />
          </h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
            Core regulatory system master profile. Programmatically locked.
          </p>
        </div>
      </div>

      <div className="mb-8 p-5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex gap-4 items-start">
        <Shield className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
            🛡️ CORE SECURITY GOVERNANCE MANDATE
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 leading-relaxed">
            By regulation, Super Admin credentials maintain root ownership over system master ledgers. To safeguard enterprise integrity, <strong>no user interface or browser forms</strong> are allowed to alter or remove this profile. All modifications must be executed securely through code changes and compiled on secure servers.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Full Identity Name</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profileName} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Auth Email address</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profileEmail} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Secure Contact Number</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profilePhone} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Department Division</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profileDept} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2">Secure Profile Bio Summary</span>
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed italic pr-4">
            "{profileBio}"
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider flex items-center">
            <Key className="w-4 h-4 mr-1.5 text-blue-500" /> KERNEL_PROFILE_INTEGRITY: SECURE_LOCK_OK (100% UNEDITABLE)
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-3 px-4 rounded-xl border border-gray-100 dark:border-gray-900 shrink-0">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>To edit in codebase directly.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
