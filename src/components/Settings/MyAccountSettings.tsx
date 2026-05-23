import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Briefcase, 
  Settings, 
  Activity, 
  Clock, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { ManagedUser, INITIAL_USERS } from './UserSettings';

export const MyAccountSettings = () => {
  const { addNotification } = useNotifications();

  const [loggedInUserId, setLoggedInUserId] = useState<string>('usr-1');
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDept, setProfileDept] = useState('');
  const [profileBio, setProfileBio] = useState('System owner, authorized for all security overrides & matching criteria rules.');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('bharat_book_current_logged_in_user_id');
    if (savedLoggedIn) {
      setLoggedInUserId(savedLoggedIn);
    }
    
    const db = localStorage.getItem('bharat_book_managed_users');
    let loadedUsers = INITIAL_USERS;
    if (db) {
       try { loadedUsers = JSON.parse(db); } catch(e) {}
    }
    setUsers(loadedUsers);

    const currentUser = loadedUsers.find((u: ManagedUser) => u.id === (savedLoggedIn || 'usr-1')) || loadedUsers[0];
    if (currentUser) {
       setProfileName(currentUser.name);
       setProfileEmail(currentUser.email);
       setProfilePhone(currentUser.phone);
       setProfileDept(currentUser.department);
    }
    
    const savedProfile = localStorage.getItem('bharat_book_loggedIn_profile');
    if (savedProfile) {
       try {
         const parsed = JSON.parse(savedProfile);
         if (parsed.bio) setProfileBio(parsed.bio);
       } catch(e) {}
    }
  }, []);

  const loggedInUserData = users.find(u => u.id === loggedInUserId) || INITIAL_USERS[0];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      department: profileDept,
      bio: profileBio
    };
    
    localStorage.setItem('bharat_book_loggedIn_profile', JSON.stringify(profile));
    
    // Fire in-app dynamic header update event
    window.dispatchEvent(new Event('bharat_book_profile_updated'));

    addNotification({
      title: 'Profile Updated',
      message: 'Your personal workspace profile information was successfully archived.',
      type: 'System'
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addNotification({ title: 'Error', message: 'New passwords do not match.', type: 'Warning' });
      return;
    }
    
    const updatedUsers = users.map(u => {
      if (u.id === loggedInUserId) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));

    setTimeout(() => {
      addNotification({ title: 'Success', message: 'Password updated successfully.', type: 'System' });
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Header Info card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${loggedInUserData?.avatarColor || 'from-blue-500 to-indigo-500'} flex items-center justify-center text-white text-sm font-black`}>
            {loggedInUserData?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              {loggedInUserData?.name}
              <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded text-[9px]">
                Online
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              {loggedInUserData?.role} • {loggedInUserData?.department}
            </p>
          </div>
        </div>
        
        <div className="flex bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-700 gap-4">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center">
             ID: <span className="text-blue-600 dark:text-blue-400 ml-1">{loggedInUserData?.id}</span>
          </p>
          <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4 gap-1">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center">
              IP: <span className="font-mono text-gray-500 ml-1">192.168.1.104</span>
            </p>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center">
              Session: <span className="font-mono text-gray-500 ml-1">{formatSessionTime(sessionSeconds)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <User className="w-4 h-4 mr-2 text-blue-600" /> Account Preferences
            </h4>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Primary Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Contact Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Department</label>
                  <select
                    value={profileDept}
                    onChange={(e) => setProfileDept(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  >
                    <option value="Management">Management</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Audit">Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Role Biography / Notes</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2 relative">
                {isSaved && (
                  <div className="absolute right-44 top-1/2 -translate-y-1/2 flex items-center text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Saved
                  </div>
                )}
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security & Access Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <ShieldCheck className="w-4 h-4 mr-2 text-rose-500" /> Security Posture
            </h4>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Two-Factor Authentication (2FA)</span>
                <span className="text-sm font-black text-green-600 dark:text-green-400 flex items-center">
                  Enabled & Verified <CheckCircle className="w-3 h-3 ml-1.5" />
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Last Password Change</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                    45 days ago
                  </span>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Current Role Permissions</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center">
                  {loggedInUserData?.role} Authority Level
                </span>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
              <button className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xs transition-colors border border-gray-200 dark:border-gray-800">
                Request Permission Change
              </button>
            </div>
          </div>           
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button 
          onClick={() => {
            localStorage.removeItem('bharat_book_current_logged_in_user_id');
            window.location.reload();
          }}
          className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black uppercase text-[10px] tracking-widest py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          Sign Out of Portal
        </button>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1 border-b border-gray-100 dark:border-gray-700 pb-3">Update Password</h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4 pt-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
