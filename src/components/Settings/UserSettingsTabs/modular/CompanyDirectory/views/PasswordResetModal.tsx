import React from 'react';
import { Key, AlertTriangle, ChevronDown, Lock } from 'lucide-react';
import { ManagedUser } from '../types';

interface PasswordResetModalProps {
  t: (key: string) => string;
  isResetPasswordOpen: boolean;
  setIsResetPasswordOpen: (open: boolean) => void;
  resetTargetUser: ManagedUser | null;
  resetRole: 'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer';
  setResetRole: (role: any) => void;
  resetDept: string;
  setResetDept: (dept: string) => void;
  resetMethod: 'email' | 'manual';
  setResetMethod: (method: 'email' | 'manual') => void;
  newPassword: string;
  setNewPassword: (pw: string) => void;
  confirmPassword: string;
  setConfirmPassword: (pw: string) => void;
  passwordError: string;
  requirePasswordChange: boolean;
  setRequirePasswordChange: (change: boolean) => void;
  generateSecurePassword: () => void;
  executePasswordReset: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  t,
  setIsResetPasswordOpen,
  resetTargetUser,
  resetRole,
  setResetRole,
  resetDept,
  setResetDept,
  resetMethod,
  setResetMethod,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  requirePasswordChange,
  setRequirePasswordChange,
  generateSecurePassword,
  executePasswordReset,
}) => {
  if (!resetTargetUser) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-2xl w-full border border-gray-100 dark:border-gray-700 shadow-2xl relative">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center">
          <Key className="mr-2 text-indigo-600 w-4 h-4" /> {t("Reset Identity Details")}
        </h3>
        
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-start gap-3 border border-amber-100 dark:border-amber-900/30">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-amber-800 dark:text-amber-400 leading-relaxed">
              {t("Resetting the password or modifying these settings will instantly terminate all active sessions for")} <span className="font-bold">{resetTargetUser.name}</span>. They will be required to log in with the new credentials.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Reset Method")}</label>
            <div className="relative">
              <select
                value={resetMethod}
                onChange={(e) => setResetMethod(e.target.value as 'email' | 'manual')}
                className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 pl-4 pr-10 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none cursor-pointer"
              >
                <option value="email">{t("Send Email Link")}</option>
                <option value="manual">{t("Set Manually")}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {resetMethod === 'manual' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Department")}</label>
                    <select
                      value={resetDept}
                      onChange={(e) => setResetDept(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
                    >
                      <option value="Developer">{t("Developer")}</option>
                      <option value="Finance">{t("Finance")}</option>
                      <option value="Sales">{t("Sales")}</option>
                      <option value="IT Operations">{t("IT Operations")}</option>
                      <option value="Audit">{t("Audit")}</option>
                      <option value="Management">{t("Management")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Job Role")}</label>
                    <select
                      value={resetRole}
                      onChange={(e) => setResetRole(e.target.value as any)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
                    >
                      <option value="Owner">{t("Owner")}</option>
                      <option value="Admin">{t("Admin")}</option>
                      <option value="Manager">{t("Manager")}</option>
                      <option value="Editor">{t("Editor")}</option>
                      <option value="Viewer">{t("Viewer")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 pl-1">
                      <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{t("New Password")}</label>
                      <button 
                        onClick={generateSecurePassword} 
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider"
                      >
                        {t("Auto-Generate")}
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Confirm New Password")}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-white dark:bg-gray-900 border ${passwordError ? 'border-red-400 focus:ring-red-200' : 'border-gray-100 dark:border-gray-700 focus:ring-indigo-200'} rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 outline-none shadow-sm`}
                        placeholder="Confirm new password"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-[10px] font-semibold mt-1.5 pl-1 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {passwordError}
                      </p>
                    )}
                  </div>
                  
                  <label className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group mt-2 bg-white dark:bg-gray-800">
                    <input 
                       type="checkbox" 
                       checked={requirePasswordChange} 
                       onChange={(e) => setRequirePasswordChange(e.target.checked)}
                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50 mt-0.5"
                    />
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-wider">{t("Require password change on login")}</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center leading-relaxed">
                {t("A secure password reset link valid for 24 hours will be sent to")}<br/>
                <strong className="text-gray-900 dark:text-white mt-1 block">{resetTargetUser.email}</strong>
              </p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4 font-sans">
            <button
              onClick={() => setIsResetPasswordOpen(false)}
              className="py-3 px-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={executePasswordReset}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
            >
              {t("Update Password")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
