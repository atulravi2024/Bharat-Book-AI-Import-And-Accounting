import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, Lock, Shield, Info, CheckSquare, Square, Activity } from 'lucide-react';
import { ManagedUser, INITIAL_USERS } from './UserSettings';

export const ActiveUsersSettings = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);

  useEffect(() => {
    const db = localStorage.getItem('bharat_book_managed_users');
    if (db) {
      setUsers(JSON.parse(db));
    } else {
      setUsers(INITIAL_USERS);
    }
  }, []);

  const activeUsers = users.filter(u => u.status === 'Active');

  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
          <User className="mr-2 text-blue-600 w-4 h-4" /> Currently Active Users
        </h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
          System access granted
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeUsers.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-slate-50 dark:bg-gray-900 rounded-2xl">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No active users found</p>
          </div>
        ) : (
          activeUsers.map(user => (
            <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0`}>
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-gray-900 dark:text-white text-sm truncate">
                    {user.name}
                  </h4>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mt-1">
                    {user.role} Authority
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                  <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Mail className="w-3.5 h-3.5 mr-2 text-blue-500" /> {user.email}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Number</span>
                  <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Phone className="w-3.5 h-3.5 mr-2 text-emerald-500" /> {user.phone}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Department</span>
                  <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Briefcase className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {user.department} Team
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Session Status</span>
                  <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Activity className="w-3.5 h-3.5 mr-2 text-green-500" /> 
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest mr-2">Online</span>
                    {user.lastActive}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                 <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Module Access Permissions</h5>
                 <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="text-gray-400 block mb-1">Vouchers</span>
                      <div className="flex gap-1">
                        {user.permissions.vouchers.read ? <span className="bg-blue-50 text-blue-600 px-1 py-0.5 rounded">R</span> : null}
                        {user.permissions.vouchers.create ? <span className="bg-green-50 text-green-600 px-1 py-0.5 rounded">W</span> : null}
                        {user.permissions.vouchers.edit ? <span className="bg-amber-50 text-amber-600 px-1 py-0.5 rounded">E</span> : null}
                        {user.permissions.vouchers.delete ? <span className="bg-red-50 text-red-600 px-1 py-0.5 rounded">D</span> : null}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Masters</span>
                      <div className="flex gap-1">
                        {user.permissions.masters.read ? <span className="bg-blue-50 text-blue-600 px-1 py-0.5 rounded">R</span> : null}
                        {user.permissions.masters.create ? <span className="bg-green-50 text-green-600 px-1 py-0.5 rounded">W</span> : null}
                        {user.permissions.masters.edit ? <span className="bg-amber-50 text-amber-600 px-1 py-0.5 rounded">E</span> : null}
                        {user.permissions.masters.delete ? <span className="bg-red-50 text-red-600 px-1 py-0.5 rounded">D</span> : null}
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
