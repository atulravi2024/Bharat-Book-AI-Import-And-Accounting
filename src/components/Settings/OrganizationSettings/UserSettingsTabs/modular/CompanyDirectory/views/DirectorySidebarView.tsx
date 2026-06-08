import React from 'react';
import { User, Upload, ChevronDown, Download, Plus, Search, Send, Edit2, Unlock, Lock, Key, Trash2 } from 'lucide-react';
import { ManagedUser } from "../types";

interface DirectorySidebarViewProps {
  t: (key: string) => string;
  filteredUsers: ManagedUser[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  showImportMenu: boolean;
  setShowImportMenu: (show: boolean) => void;
  showExportMenu: boolean;
  setShowExportMenu: (show: boolean) => void;
  handleImportClick: (type: 'csv' | 'json') => void;
  handleExport: (type: 'csv' | 'json') => void;
  handleOpenForm: (user?: ManagedUser) => void;
  handleResendInvite: (user: ManagedUser) => void;
  handleToggleStatus: (userId: string) => void;
  handleResetPassword: (userId: string) => void;
  handleDeleteUser: (userId: string) => void;
  getInitials: (fullName: string) => string;
  loggedInUser: ManagedUser;
  importDropdownRef: React.RefObject<HTMLDivElement>;
  exportDropdownRef: React.RefObject<HTMLDivElement>;
}

export const DirectorySidebarView: React.FC<DirectorySidebarViewProps> = ({
  t,
  filteredUsers,
  selectedUserId,
  setSelectedUserId,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  showImportMenu,
  setShowImportMenu,
  showExportMenu,
  setShowExportMenu,
  handleImportClick,
  handleExport,
  handleOpenForm,
  handleResendInvite,
  handleToggleStatus,
  handleResetPassword,
  handleDeleteUser,
  getInitials,
  loggedInUser,
  importDropdownRef,
  exportDropdownRef,
}) => {
  return (
    <div className="xl:col-span-5 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      
      {/* Header operations row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
          <User className="mr-2 text-blue-600 w-4 h-4" /> {t("Team Directory")}
        </h3>
        <div className="flex items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
          
          <div className="relative" ref={importDropdownRef}>
            <button 
              onClick={() => setShowImportMenu(!showImportMenu)}
              className="py-1.5 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-sm shrink-0"
            >
              <Upload className="w-3.5 h-3.5 sm:mr-1" strokeWidth={3} />
              <span className="hidden sm:inline">{t("Import")}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showImportMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 animate-in slide-in-from-top-2">
                <button onClick={() => handleImportClick('csv')} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Import CSV")}</button>
                <button onClick={() => handleImportClick('json')} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Import JSON")}</button>
              </div>
            )}
          </div>

          <div className="relative hidden md:block" ref={exportDropdownRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="py-1.5 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5 sm:mr-1" strokeWidth={3} />
              <span className="hidden sm:inline">{t("Export")}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 animate-in slide-in-from-top-2">
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Export CSV")}</button>
                <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Export JSON")}</button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleOpenForm()}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={3} /> {t("Invite")}
          </button>
        </div>
      </div>

      {/* Filter bar options */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search user, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-900 mx-px border-none rounded-xl text-xs font-bold text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none dark:text-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1 pl-1">{t("Role Filter")}</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-2.5 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="all">{t("All Roles")}</option>
              <option value="super admin">{t("Super Admin")}</option>
              <option value="owner">{t("Owner")}</option>
              <option value="admin">{t("Admin")}</option>
              <option value="manager">{t("Manager")}</option>
              <option value="editor">{t("Editor")}</option>
              <option value="viewer">{t("Viewer")}</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1 pl-1">{t("Status Filter")}</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-2.5 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="all">{t("All Status")}</option>
              <option value="active">{t("Active")}</option>
              <option value="invited">{t("Invited")}</option>
              <option value="suspended">{t("Suspended")}</option>
              <option value="permanently disabled">{t("Permanently Disabled")}</option>
              <option value="archived">{t("Archived")}</option>
              <option value="terminated">{t("Terminated")}</option>
              <option value="deactivated">{t("Deactivated")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="max-h-[500px] overflow-auto pr-1 pb-2 custom-scrollbar">
        <div className="space-y-3 min-w-max md:min-w-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t("No matching users")}</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const isSelected = user.id === selectedUserId;
              const initials = getInitials(user.name);

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected 
                      ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50' 
                      : 'bg-gray-50/50 dark:bg-gray-900/30 border-transparent hover:border-gray-100 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center min-w-0 mr-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm mr-3.5`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-900 dark:text-white text-xs truncate leading-snug">
                          {user.name}
                        </p>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          user.status === 'Invited' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          user.status === 'Suspended' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          user.status === 'Permanently Disabled' ? 'bg-red-100 text-red-800 dark:bg-red-955/40 dark:text-red-400' :
                          user.status === 'Archived' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                          user.status === 'Terminated' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                          user.status === 'Deactivated' ? 'bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                          {user.role}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">
                          • {user.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    {user.status === 'Invited' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleResendInvite(user); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                        title="Resend invitation email"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    )}
                    {(user.role !== 'Super Admin' || loggedInUser.role === 'Super Admin') && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenForm(user); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                          title="Modify account information"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(user.id); }}
                          className={`p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 ${
                            user.status === 'Suspended' 
                              ? 'text-green-500 hover:text-green-600 hover:bg-green-50/50 dark:hover:bg-green-900/20' 
                              : 'text-amber-500 hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/20'
                          }`}
                          title={user.status === 'Suspended' ? 'Unsuspend User Account' : 'Suspend Account'}
                        >
                          {user.status === 'Suspended' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </button>
                        {(loggedInUser.role === 'Super Admin' || user.id === loggedInUser.id) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleResetPassword(user.id); }}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
                            title="Reset User Password"
                          >
                            <Key className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                          title="Delete User permanently"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
