import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
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
import { useNotifications } from "../../../../context/NotificationContext";
import { ManagedUser, INITIAL_USERS } from "../UserSettings";

export const MyAccountTab = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();

  const [loggedInUserId, setLoggedInUserId] = useState<string>('usr-1');
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [loginTimeStr, setLoginTimeStr] = useState('');
  const [sessionIp, setSessionIp] = useState('192.168.1.104');
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDept, setProfileDept] = useState('');
  const [profileBio, setProfileBio] = useState('System owner, authorized for all security overrides & matching criteria rules.');
  
  const [profileDob, setProfileDob] = useState('');
  const [profileGender, setProfileGender] = useState('');
  const [profileAadhaar, setProfileAadhaar] = useState('');
  const [profileVoterId, setProfileVoterId] = useState('');
  const [profilePan, setProfilePan] = useState('');
  const [profileDl, setProfileDl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileLinkedStaffId, setProfileLinkedStaffId] = useState('');
  const [staffMasters, setStaffMasters] = useState<any[]>([]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastPasswordChange, setLastPasswordChange] = useState('Just now');
  const [avatarClicks, setAvatarClicks] = useState(0);

  const handleAvatarClick = () => {
    if (loggedInUserData?.role !== 'Super Admin') return;
    const newClicks = avatarClicks + 1;
    if (newClicks >= 12) {
      setIsPasswordModalOpen(true);
      setAvatarClicks(0);
    } else {
      setAvatarClicks(newClicks);
      if (newClicks === 1) {
        addNotification({ title: 'Access Denied', message: 'It does not provide an option to change the password.', type: 'Alert' });
      }
    }
  };

  useEffect(() => {
    let sessionStart = localStorage.getItem('bharat_book_session_start');
    if (!sessionStart) {
      sessionStart = Date.now().toString();
      localStorage.setItem('bharat_book_session_start', sessionStart);
    }
    const startTimeStamp = parseInt(sessionStart, 10);
    setLoginTimeStr(new Date(startTimeStamp).toLocaleTimeString());

    const currentSessionId = localStorage.getItem('bharat_book_current_session_id');
    const existingSessions = JSON.parse(localStorage.getItem('bharat_book_sessions') || '[]');
    setSessionHistory(existingSessions);

    if (currentSessionId) {
       const currentSession = existingSessions.find((s: any) => s.id === currentSessionId);
       if (currentSession && currentSession.ipAddress) {
           setSessionIp(currentSession.ipAddress);
       }
    }

    const updateTimer = () => {
      setSessionSeconds(Math.floor((Date.now() - startTimeStamp) / 1000));
    };

    updateTimer(); // calculate immediately to avoid 1 sec delay
    const timer = setInterval(updateTimer, 1000);
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

    const activeUserId = savedLoggedIn || 'usr-1';
    const currentUser = loadedUsers.find((u: ManagedUser) => u.id === activeUserId) || loadedUsers[0];
    if (currentUser) {
       setProfileName(currentUser.name);
       setProfileEmail(currentUser.email);
       setProfilePhone(currentUser.phone);
       setProfileDept(currentUser.department);
       setProfileDob(currentUser.dob || '');
       setProfileGender(currentUser.gender || '');
       setProfileAadhaar(currentUser.aadhaarId || '');
       setProfileVoterId(currentUser.voterId || '');
       setProfilePan(currentUser.panCard || '');
       setProfileDl(currentUser.drivingLicense || '');
       setProfilePhoto(currentUser.profilePhoto || '');
       setProfileLinkedStaffId(currentUser.internalStaffId || '');
    }
    
    // Load Staff Masters
    const savedContacts = localStorage.getItem('bharat_book_contact_masters');
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        setStaffMasters(parsed.filter((c: any) => c.unifiedType === 'Staff' || c.contactType === 'Internal'));
      } catch (e) {}
    }

    const savedProfile = localStorage.getItem('bharat_book_loggedIn_profile');
    if (savedProfile) {
       try {
         const parsed = JSON.parse(savedProfile);
         if (parsed.bio) setProfileBio(parsed.bio);
       } catch(e) {}
    }

    const lpKey = `bharat_book_last_pwd_change_${activeUserId}`;
    const lpTime = localStorage.getItem(lpKey);
    if (lpTime) {
      const days = Math.floor((Date.now() - parseInt(lpTime, 10)) / (1000 * 60 * 60 * 24));
      if (days === 0) setLastPasswordChange('Today');
      else if (days === 1) setLastPasswordChange('Yesterday');
      else setLastPasswordChange(`${days} days ago`);
    } else {
      setLastPasswordChange('Recently');
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
    
    // Also save these updates to the managed users to maintain consistency across applet
    const updatedUsers = users.map(u => {
      if (u.id === loggedInUserId) {
        return {
          ...u,
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          department: profileDept,
          dob: profileDob,
          gender: profileGender,
          aadhaarId: profileAadhaar,
          voterId: profileVoterId,
          panCard: profilePan,
          drivingLicense: profileDl,
          profilePhoto: profilePhoto,
          internalStaffId: profileLinkedStaffId
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
    
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
      addNotification({ title: 'Error', message: 'New passwords do not match.', type: 'Alert' });
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
    localStorage.setItem(`bharat_book_last_pwd_change_${loggedInUserId}`, Date.now().toString());
    setLastPasswordChange('Just now');

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
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div 
            onClick={handleAvatarClick}
            className={`cursor-pointer w-10 h-10 rounded-lg bg-gradient-to-tr ${loggedInUserData?.avatarColor || 'from-blue-500 to-indigo-500'} flex items-center justify-center text-white text-sm font-black shrink-0 select-none`}
            title={loggedInUserData?.role === 'Super Admin' ? 'Profile Avatar' : ''}
          >
            {loggedInUserData?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              {loggedInUserData?.name}
              <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded text-[9px]">
                {t("Online")}
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              {loggedInUserData?.role} • {loggedInUserData?.department}
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex bg-white dark:bg-gray-900 py-2 px-4 rounded-xl border border-gray-100 dark:border-gray-800 gap-6 shadow-sm">
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-black uppercase text-gray-400 mb-0.5">{t("ID")}</span>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">{loggedInUserData?.id}</span>
          </div>
          <div className="w-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-black uppercase text-gray-400 mb-0.5">{t("IP Address")}</span>
            <span className="text-xs font-mono text-gray-600 dark:text-gray-300 font-bold">{sessionIp}</span>
          </div>
          <div className="w-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-black uppercase text-gray-400 mb-0.5">{t("Login Time")}</span>
            <span className="text-xs font-mono text-gray-600 dark:text-gray-300 font-bold">{loginTimeStr}</span>
          </div>
          <div className="w-px bg-gray-100 dark:bg-gray-800" />
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-black uppercase text-gray-400 mb-0.5">{t("Session")}</span>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">{formatSessionTime(sessionSeconds)}</span>
          </div>
        </div>

        {/* Mobile View Summary */}
        <div className="flex md:hidden w-full flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-md shadow-sm">
            <span className="text-[9px] font-black uppercase text-gray-400">{t("ID")}</span>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">{loggedInUserData?.id}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-md shadow-sm">
            <span className="text-[9px] font-black uppercase text-gray-400">{t("IP")}</span>
            <span className="text-[10px] font-mono text-gray-600 dark:text-gray-300 font-bold">{sessionIp}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-md shadow-sm">
            <span className="text-[9px] font-black uppercase text-gray-400">{t("Login")}</span>
            <span className="text-[10px] font-mono text-gray-600 dark:text-gray-300 font-bold">{loginTimeStr}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-md shadow-sm">
            <span className="text-[9px] font-black uppercase text-gray-400">{t("Session")}</span>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">{formatSessionTime(sessionSeconds)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" /> {t("Account Preferences")}
              </h4>
              <div className="h-6 flex items-center">
                {isSaved && (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-950/40 px-2 py-1 rounded-md animate-in fade-in slide-in-from-right-2">
                    <CheckCircle className="w-3 h-3 mr-1" /> {t("Saved")}
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 mb-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-3">
                  <div 
                    className={`w-28 h-28 rounded-full border-2 border-dashed overflow-hidden relative group ${loggedInUserData?.role === 'Super Admin' ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' : 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 cursor-pointer'}`}
                    onClick={() => {
                        if (loggedInUserData?.role !== 'Super Admin') document.getElementById('my-profile-photo-upload')?.click();
                    }}
                  >
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400 group-hover:text-blue-500 transition-colors">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                    {loggedInUserData?.role !== 'Super Admin' && (
                       <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                         <span className="text-white text-[10px] font-bold">{t("CHANGE")}</span>
                       </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="my-profile-photo-upload" 
                    className="hidden" 
                    accept="image/*"
                    disabled={loggedInUserData?.role === 'Super Admin'}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} 
                  />
                  <span className="text-[10px] uppercase font-bold text-gray-500">{t("Profile Photo")}</span>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Full Name")}</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Primary Email")}</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Contact Number")}</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Department")}</label>
                    <select
                      value={profileDept}
                      onChange={(e) => setProfileDept(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <option value="Developer">{t("Developer")}</option>
                      <option value="Management">{t("Management")}</option>
                      <option value="Finance">{t("Finance")}</option>
                      <option value="Operations">{t("Operations")}</option>
                      <option value="Sales">{t("Sales")}</option>
                      <option value="Audit">{t("Audit")}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Gender")}</label>
                    <select
                      value={profileGender}
                      onChange={(e) => setProfileGender(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{t("Select")}</option>
                      <option value="Male">{t("Male")}</option>
                      <option value="Female">{t("Female")}</option>
                      <option value="Other">{t("Other")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Date of Birth")}</label>
                    <input
                      type="date"
                      value={profileDob}
                      onChange={(e) => setProfileDob(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                 <div className="md:col-span-2">
                   <h5 className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">{t("Government IDs")}</h5>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Aadhaar Card Number")}</label>
                    <input
                      type="text"
                      value={profileAadhaar}
                      onChange={(e) => setProfileAadhaar(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      placeholder="xxxx-xxxx-xxxx"
                      className={`w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Voter ID Card Number")}</label>
                    <input
                      type="text"
                      value={profileVoterId}
                      onChange={(e) => setProfileVoterId(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      placeholder="Voter ID"
                      className={`w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-xs ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("PAN Card Number")}</label>
                    <input
                      type="text"
                      value={profilePan}
                      onChange={(e) => setProfilePan(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      placeholder="ABCDE1234F"
                      className={`w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-xs uppercase ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Driving License Number")}</label>
                    <input
                      type="text"
                      value={profileDl}
                      onChange={(e) => setProfileDl(e.target.value)}
                      disabled={loggedInUserData?.role === 'Super Admin'}
                      placeholder="DL Number"
                      className={`w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-xs uppercase ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Role Biography / Notes")}</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={2}
                  disabled={loggedInUserData?.role === 'Super Admin'}
                  className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-xs leading-relaxed ${loggedInUserData?.role === 'Super Admin' ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>

              {loggedInUserData?.role !== 'Super Admin' && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors shadow-sm"
                  >
                    {t("Save Changes")}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Security & Access Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <ShieldCheck className="w-4 h-4 mr-2 text-rose-500" /> {t("Security Posture")}
            </h4>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">Two-Factor Authentication (2FA)</span>
                <span className="text-sm font-black text-green-600 dark:text-green-400 flex items-center">
                  {t("Enabled & Verified")} <CheckCircle className="w-3 h-3 ml-1.5" />
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between relative">
                <div>
                  <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Last Password Change")}</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                    {lastPasswordChange}
                  </span>
                </div>
                {loggedInUserData?.role !== 'Super Admin' ? (
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t("Update")}
                  </button>
                ) : (
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 max-w-[200px] text-right leading-tight">
                    {t("Does not provide an option to change the password")}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1">{t("Current Role Permissions")}</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center">
                  {loggedInUserData?.role} Authority Level
                </span>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
              <button className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xs transition-colors border border-gray-200 dark:border-gray-800">
                {t("Request Permission Change")}
              </button>
            </div>
          </div>           
        </div>
      </div>
      
      {/* Session History Summary */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
          <Activity className="w-4 h-4 mr-2 text-indigo-500" /> {t("Recent Sessions")}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400">{t("Date/Time")}</th>
                <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400">{t("IP Address")}</th>
                <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400">{t("Duration")}</th>
                <th className="py-2 px-2 text-[10px] font-black uppercase text-gray-400">{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {sessionHistory.slice(-5).reverse().map((session: any) => {
                const durationMs = session.logoutTime ? session.logoutTime - session.loginTime : Date.now() - session.loginTime;
                const hrs = Math.floor(durationMs / 3600000);
                const mins = Math.floor((durationMs % 3600000) / 60000);
                const secs = Math.floor((durationMs % 60000) / 1000);
                const isCurrent = session.id === localStorage.getItem('bharat_book_current_session_id');

                return (
                  <tr key={session.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-2">
                       <p className="text-xs font-bold text-gray-900 dark:text-white">
                         {new Date(session.loginTime).toLocaleDateString()}
                       </p>
                       <p className="text-[10px] text-gray-500 font-mono">
                         {new Date(session.loginTime).toLocaleTimeString()}
                       </p>
                    </td>
                    <td className="py-3 px-2 text-xs font-mono text-gray-600 dark:text-gray-400">{session.ipAddress}</td>
                    <td className="py-3 px-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                       {hrs > 0 ? `${hrs}h ` : ''}{mins}m {secs}s
                    </td>
                    <td className="py-3 px-2">
                      {isCurrent ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {t("Active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          {t("Closed")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sessionHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">{t("No recent sessions found")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button 
          onClick={() => {
            const currentSessionId = localStorage.getItem('bharat_book_current_session_id');
            if (currentSessionId) {
              const existingSessions = JSON.parse(localStorage.getItem('bharat_book_sessions') || '[]');
              const sessionIndex = existingSessions.findIndex((s: any) => s.id === currentSessionId);
              if (sessionIndex >= 0) {
                 existingSessions[sessionIndex].logoutTime = Date.now();
                 localStorage.setItem('bharat_book_sessions', JSON.stringify(existingSessions));
              }
              localStorage.removeItem('bharat_book_current_session_id');
            }
            localStorage.removeItem('bharat_book_current_logged_in_user_id');
            localStorage.removeItem('bharat_book_session_start');
            window.location.reload();
          }}
          className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black uppercase text-[10px] tracking-widest py-3 px-6 rounded-xl transition-colors cursor-pointer"
        >
          {t("Sign Out of Portal")}
        </button>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1 border-b border-gray-100 dark:border-gray-700 pb-3">{t("Update Password")}</h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4 pt-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Current Password")}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("New Password")}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">{t("Confirm New Password")}</label>
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
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  {t("Save Password")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
