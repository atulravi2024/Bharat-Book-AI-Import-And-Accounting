import React from 'react';
import { Mail, Phone, Briefcase, Shield, Lock, Info, CheckSquare, Square, Activity } from 'lucide-react';
import { ManagedUser, UserPermissions } from '../types';

interface UserDetailsViewProps {
  t: (key: string) => string;
  selectedUser: ManagedUser | undefined;
  getInitials: (fullName: string) => string;
  handleTogglePermission: (entity: keyof UserPermissions, action: 'read' | 'create' | 'edit' | 'delete') => void;
  getRoleLevel: (role: string) => number;
}

export const UserDetailsView: React.FC<UserDetailsViewProps> = ({
  t,
  selectedUser,
  getInitials,
  handleTogglePermission,
}) => {
  if (!selectedUser) return null;

  return (
    <div className="xl:col-span-7 space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        
        {/* Status card top row */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedUser.avatarColor} flex items-center justify-center text-white text-sm font-black shrink-0 mr-3`}>
              {getInitials(selectedUser.name)}
            </div>
            <div>
              <h4 className="font-black text-gray-900 dark:text-white text-sm truncate">
                {selectedUser.name}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center mt-0.5">
                <Lock className="w-3 h-3 mr-1" /> {selectedUser.role}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{t("Active Pulse")}</p>
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300 mt-0.5 flex items-center justify-end">
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${selectedUser.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></span>
              {selectedUser.lastActive}
            </p>
          </div>
        </div>

        {/* Contacts information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
          <div className="flex items-center bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
            <Mail className="w-4 h-4 mr-2.5 text-blue-600" />
            <span className="truncate">{selectedUser.email}</span>
          </div>
          <div className="flex items-center bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
            <Phone className="w-4 h-4 mr-2.5 text-emerald-600" />
            <span>{selectedUser.phone}</span>
          </div>
          <div className="flex items-center bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
            <Briefcase className="w-4 h-4 mr-2.5 text-indigo-600" />
            <span>{selectedUser.department} Department</span>
          </div>
          <div className="flex items-center bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
            <Shield className="w-4 h-4 mr-2.5 text-amber-600" />
            <span>{t("Workspace Admin Managed: Yes")}</span>
          </div>
        </div>

        {/* Organizational Security Details */}
        <div className="bg-slate-50/30 dark:bg-gray-900/10 p-4 rounded-2xl border border-dashed border-gray-200/50 dark:border-gray-700 mb-6 space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("Organizational Binding Security")}</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px] font-bold">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{t("Inactivity Timeout")}</span>
              <span className="text-gray-700 dark:text-gray-300">
                {(() => {
                  if (selectedUser.inactivityTimeoutMinutes !== undefined && selectedUser.inactivityTimeoutMinutes !== null && selectedUser.inactivityTimeoutMinutes !== 0) {
                    return `${selectedUser.inactivityTimeoutMinutes} Minutes (User Custom)`;
                  }
                  try {
                    const pols = localStorage.getItem('bharat_book_security_policies');
                    if (pols) {
                      const parsed = JSON.parse(pols);
                      if (parsed.roleInactivityTimeouts && parsed.roleInactivityTimeouts[selectedUser.role]) {
                        return `${parsed.roleInactivityTimeouts[selectedUser.role]} Minutes (Role Default)`;
                      }
                    }
                  } catch {}
                  return `${localStorage.getItem('bharat_book_inactivity_timeout_minutes') || '30'} Minutes (Inherited Global)`;
                })()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{t("Max Login Attempts")}</span>
              <span className="text-gray-700 dark:text-gray-300">
                {(() => {
                  if (selectedUser.maxLoginAttempts !== undefined && selectedUser.maxLoginAttempts !== null && selectedUser.maxLoginAttempts !== 0) {
                    return selectedUser.maxLoginAttempts === 999 ? 'Unlimited attempts (User Custom)' : `${selectedUser.maxLoginAttempts} Attempts (User Custom)`;
                  }
                  try {
                    const pols = localStorage.getItem('bharat_book_security_policies');
                    if (pols) {
                      const parsed = JSON.parse(pols);
                      if (parsed.roleMaxAttempts && parsed.roleMaxAttempts[selectedUser.role]) {
                        const limit = parsed.roleMaxAttempts[selectedUser.role];
                        return limit === 999 ? 'Unlimited attempts (Role Default)' : `${limit} Attempts (Role Default)`;
                      }
                    }
                  } catch {}
                  return '5 Attempts (Role Default)';
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Permissions Access Matrix Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-widest flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-blue-600" /> {t("Custom System Permissions Matrix")}
            </h4>
            {selectedUser.role === 'Super Admin' && (
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                🛡️ SUPER ADMIN LOGICAL ROOT LOCK
              </span>
            )}
          </div>

          {selectedUser.role === 'Super Admin' ? (
            <div className="p-4 bg-slate-50 dark:bg-gray-900 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("To guarantee uninterrupted enterprise governance, Super Admin privileges are non-configurable. This root administrator maintains absolute read, write, execution, and deleting permissions across all ERP modules.")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 text-left">
                    <th className="py-2.5 pl-1">{t("Module Area")}</th>
                    <th className="py-2.5 text-center">{t("Read/View")}</th>
                    <th className="py-2.5 text-center">{t("Create")}</th>
                    <th className="py-2.5 text-center">{t("Edit/Update")}</th>
                    <th className="py-2.5 text-center">{t("Delete")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 text-xs font-bold text-gray-700 dark:text-gray-300">
                  {(['vouchers', 'masters', 'reports', 'system', 'audits'] as Array<keyof UserPermissions>).map(entity => (
                    <tr key={entity} className="hover:bg-slate-50/40 dark:hover:bg-gray-700/20">
                      <td className="py-3.5 pl-1 capitalize">
                        {entity === 'system' ? 'System Settings & backups' : entity === 'audits' ? 'Security Audit Logs' : entity}
                      </td>
                      {(['read', 'create', 'edit', 'delete'] as const).map(action => {
                        const allowed = selectedUser.permissions[entity][action];
                        return (
                          <td key={action} className="text-center py-2.5">
                            <button
                              type="button"
                              onClick={() => handleTogglePermission(entity, action)}
                              className={`p-1.5 rounded-lg transition-colors inline-flex justify-center items-center ${
                                allowed 
                                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' 
                                  : 'text-gray-300 dark:text-gray-600 hover:bg-slate-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {allowed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-300 dark:text-gray-600" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Selected User Activity Logs Audit Stream */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
          <Activity className="w-4 h-4 mr-2 text-blue-600 font-sans" /> {t("Account Security Access Logs")}
        </h4>

        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 font-mono custom-scrollbar">
          {selectedUser.activityLogs.length === 0 ? (
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider text-center py-4">{t("No security logs compiled")}</p>
          ) : (
            selectedUser.activityLogs.map((log, index) => (
              <div key={index} className="text-[11px] border-b border-gray-50 dark:border-gray-700/50 pb-3 last:border-none font-mono">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  <span>{log.timestamp}</span>
                  <span>IP: {log.ip}</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-bold mt-1 uppercase tracking-wide text-[10px]">{log.action}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">{log.details}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
