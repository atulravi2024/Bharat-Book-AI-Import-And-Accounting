import React from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { Lock, Shield, Info, Key } from 'lucide-react';

export const SuperAdminTab = () => {
  const { t } = useLanguage();
  // Super Admin Profile coordinates - Read-Only on UI, only changeable in source code.
  const profileName = 'Super Admin';
  const profileEmail = 'superadmin@bharatbook.com';
  const profilePhone = '+91 90000 00001';
  const profileDept = 'Super Admin';
  const profileBio = 'Root Authority. Absolute programmatic control, system locks, and database backup overrides. Security criteria can only be altered directly via raw source code recompilation.';
  const lastLogin = 'Today, 10:14 AM (UTC)';
  const localIP = '192.168.1.104 (VLAN 10)';
  const publicIP = '203.0.113.45 (Static Route)';
  const macAddress = '00:1B:44:11:3A:B7 (Physical Layer)';
  const timeZone = 'UTC+00:00 (Coordinated Universal Time)';
  const defaultLoginRetry = '3 Attempts (Auto-Syslock)';
  const twoFactorAuth = 'Enabled (YubiKey Bio)';
  const encryptionProtocol = 'AES-256-GCM / TLS 1.3';
  const rootLedgerAccess = 'Unrestricted (R/W/E/D)';
  const sessionTimeout = '15 Minutes (Strict)';
  const clearanceLevel = 'Level 5 (Omnipotent)';
  const databaseShard = 'Primary Master DB-01';
  const emergencyOverride = 'Enabled (Nuclear Option)';
  const failoverLocation = 'AWS-AP-SOUTH-1-DR';
  const tokenHash = 'SHA-512 : a7b8...9f01';
  const kernelVersion = 'Linux 5.15.0-generic';
  const hostOS = 'Ubuntu 22.04.3 LTS (Jammy Jellyfish)';
  const currentUpTime = '45 Days, 12 Hrs, 4 Mins';
  const networkTopology = 'Zero-Trust Architecture (ZTA)';
  const auditLoggingLevel = 'Verbose (Level: TRACE)';

  return (
    <div className="relative max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0">
            {t("SA")}
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest dark:text-white leading-none flex items-center mb-1">
              {t("Super Admin Workspace Identity")} <Lock className="w-3 h-3 ml-2 text-rose-500" />
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
              {t("Core regulatory system master profile. Programmatically locked.")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 px-3 py-1.5 rounded-lg shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-green-700 dark:text-green-400">{t("System Online")}</span>
        </div>
      </div>

      <div className="mb-8 p-5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex gap-4 items-start">
        <Shield className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
            🛡️ CORE SECURITY GOVERNANCE MANDATE
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 leading-relaxed">
            By regulation, Super Admin credentials maintain root ownership over system master ledgers. To safeguard enterprise integrity, <strong>{t("no user interface or browser forms")}</strong> {t("are allowed to alter or remove this profile. All modifications must be executed securely through code changes and compiled on secure servers.")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group lg:col-span-2">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Full Identity Name")}</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profileName} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group lg:col-span-2">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Auth Email address")}</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center break-all">
              {profileEmail} <Lock className="w-3 h-3 ml-1.5 text-gray-400 shrink-0" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group md:col-span-2 lg:col-span-1">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Secure Contact Number")}</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profilePhone} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group md:col-span-2 lg:col-span-1">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Department Division")}</span>
            <span className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {profileDept} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group lg:col-span-2">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Last System Login")}</span>
            <span className="text-sm flex flex-col gap-1 font-black text-gray-800 dark:text-white">
              <div className="flex items-center">{lastLogin} <Lock className="w-3 h-3 ml-1.5 text-gray-400" /></div>
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group lg:col-span-2">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">System Details (Local / Public IP)</span>
            <span className="text-xs font-mono font-bold text-gray-800 dark:text-white flex items-center gap-3">
              {localIP} <span className="text-gray-300 dark:text-gray-600">|</span> {publicIP} <Lock className="w-3 h-3 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("MAC Address")}</span>
            <span className="text-xs font-mono font-bold text-gray-800 dark:text-white flex items-center">
              {macAddress} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Time Zone")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {timeZone} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("2FA Verification Status")}</span>
            <span className="text-sm font-black text-green-600 dark:text-green-400 flex items-center">
              {twoFactorAuth} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Default Login Retry Limit")}</span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center">
              {defaultLoginRetry} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Data Encryption Info")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {encryptionProtocol} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Global System Permissions")}</span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center">
              {rootLedgerAccess} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Security Clearance Level")}</span>
            <span className="text-xs font-black text-fuchsia-600 dark:text-fuchsia-400 flex items-center">
              {clearanceLevel} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Connected Database Node")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {databaseShard} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Emergency Protocols")}</span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center">
              {emergencyOverride} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Disaster Failover Region")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {failoverLocation} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Idle Session Timeout")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {sessionTimeout} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Last Auth Token Hash")}</span>
            <span className="text-xs font-mono font-bold text-gray-800 dark:text-white flex items-center">
              {tokenHash} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Kernel Version")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {kernelVersion} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Host OS")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {hostOS} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Current Uptime")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {currentUpTime} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Network Topology")}</span>
            <span className="text-[11px] font-black text-gray-800 dark:text-white flex items-center">
              {networkTopology} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Audit Logging Level")}</span>
            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 flex items-center">
              {auditLoggingLevel} <Lock className="w-3 h-3 ml-1.5 text-gray-400" />
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2">{t("Secure Profile Bio Summary")}</span>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed italic pr-4">
              "{profileBio}"
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">{t("Recent Root Interventions")}</span>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500">{t("2026-05-24 14:02 UTC")}</span>
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">{t("Enforced Global 2FA Auth")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500">{t("2026-05-22 09:15 UTC")}</span>
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">{t("Revoked Suspicious Admin Token")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500">{t("2026-05-20 18:30 UTC")}</span>
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">Database Snapshot Executed (Manual)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
             <span className="block text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-1">{t("System Wide Lock Down")}</span>
             <p className="text-[10px] text-red-500 uppercase font-semibold">{t("Immediate suspension of all non-Super Admin traffic over the network.")}</p>
          </div>
          <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors shadow flex items-center shrink-0">
             <Lock className="w-4 h-4 mr-2" />
             {t("Initiate Code Red")}
          </button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider flex items-center">
            <Key className="w-4 h-4 mr-1.5 text-blue-500" /> KERNEL_PROFILE_INTEGRITY: SECURE_LOCK_OK (100% UNEDITABLE)
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-3 px-4 rounded-xl border border-gray-100 dark:border-gray-900 shrink-0">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{t("To edit in codebase directly.")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
