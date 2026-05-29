import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  User, Plus, Search, Check, Trash2, Edit2, Mail, Phone, Briefcase, Lock, Unlock, 
  Shield, Activity, Settings, UserCheck, UserX, CheckSquare, Square, Info, Key, AlertTriangle, Compass, Download, Send, Upload, ChevronDown 
} from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { ManagedUser, INITIAL_USERS, UserPermissions, ActivityLog } from '../UserSettings';

export const CompanyDirectoryTab = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('usr-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const importDropdownRef = useRef<HTMLDivElement>(null);
  const [importType, setImportType] = useState<'csv' | 'json'>('csv');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (importDropdownRef.current && !importDropdownRef.current.contains(event.target as Node)) {
        setShowImportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Editor state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // Create / Edit User fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer'>('Editor');
  const [formDept, setFormDept] = useState('Finance');
  const [formStatus, setFormStatus] = useState<'Active' | 'Invited' | 'Suspended' | 'Permanently Disabled' | 'Archived' | 'Terminated' | 'Deactivated'>('Active');
  
  // New customized profile fields
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState('');
  const [formAadhaar, setFormAadhaar] = useState('');
  const [formVoterId, setFormVoterId] = useState('');
  const [formPan, setFormPan] = useState('');
  const [formDl, setFormDl] = useState('');
  const [formProfilePhoto, setFormProfilePhoto] = useState('');
  const [formLinkedStaffId, setFormLinkedStaffId] = useState('');
  const [formInactivityTimeoutMinutes, setFormInactivityTimeoutMinutes] = useState<string>('0');
  const [formMaxLoginAttempts, setFormMaxLoginAttempts] = useState<string>('0');

  const [staffMasters, setStaffMasters] = useState<any[]>([]);

  // Password reset state
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<ManagedUser | null>(null);
  const [resetRole, setResetRole] = useState<'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer'>('Editor');
  const [resetDept, setResetDept] = useState('Finance');
  const [resetMethod, setResetMethod] = useState<'email' | 'manual'>('email');
  const [newPassword, setNewPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [passwordError, setPasswordError] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);

  const generateSecurePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for(let i = 0; i < 12; i++) {
       pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setConfirmPassword(pass);
    setPasswordError('');
  };

  useEffect(() => {
    const saved = localStorage.getItem('bharat_book_managed_users');
    let loadedUsers: ManagedUser[] = [];
    if (saved) {
      try {
        loadedUsers = JSON.parse(saved);
      } catch (e) {
        loadedUsers = INITIAL_USERS;
      }
    } else {
      loadedUsers = INITIAL_USERS;
      localStorage.setItem('bharat_book_managed_users', JSON.stringify(INITIAL_USERS));
    }

    let needsSave = false;
    INITIAL_USERS.forEach(initialUser => {
       if (!loadedUsers.find(u => u.id === initialUser.id)) {
           loadedUsers.push(initialUser);
           needsSave = true;
       }
    });

    if (needsSave) {
       localStorage.setItem('bharat_book_managed_users', JSON.stringify(loadedUsers));
    }

    setUsers(loadedUsers);

    // Load Staff Masters
    const savedContacts = localStorage.getItem('bharat_book_contact_masters');
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        setStaffMasters(parsed.filter((c: any) => c.unifiedType === 'Staff' || c.contactType === 'Internal'));
      } catch (e) {}
    }
  }, []);

  const saveUsersToStorage = (updatedUsers: ManagedUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
  };

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const currentLoggedInUserId = localStorage.getItem('bharat_book_current_logged_in_user_id');
  const loggedInUser = users.find(u => u.id === currentLoggedInUserId) || users[0] || ({ id: 'fallback', name: 'Unknown', email: '', phone: '', status: 'Active', role: 'Viewer', activityLogs: [] } as unknown as ManagedUser);

  const getRoleLevel = (role: string) => {
    switch (role) {
      case 'Super Admin': return 0;
      case 'Owner': return 1;
      case 'Admin': return 2;
      case 'Manager': return 3;
      case 'Editor': return 4;
      case 'Viewer': return 5;
      default: return 6;
    }
  };

  const canModifyTarget = (targetRole: string) => {
    if (loggedInUser.role === 'Super Admin') return true;
    if (targetRole === 'Super Admin') return false;
    return getRoleLevel(loggedInUser.role) < getRoleLevel(targetRole);
  };

  const handleTogglePermission = (entity: keyof UserPermissions, action: 'read' | 'create' | 'edit' | 'delete') => {
    if (!selectedUser) return;
    if (selectedUser.role === 'Super Admin') {
      addNotification({
        title: 'Action Restrained',
        message: 'Super Admin permissions cannot be restricted or edited to avoid system lockouts.',
        type: 'Alert'
      });
      return;
    }
    if (!canModifyTarget(selectedUser.role)) {
      addNotification({
        title: 'Permission Denied',
        message: 'You do not have permission to modify this user.',
        type: 'Alert'
      });
      return;
    }

    const updated = users.map(u => {
      if (u.id === selectedUser.id) {
        const permissions = { ...u.permissions };
        permissions[entity] = {
          ...permissions[entity],
          [action]: !permissions[entity][action]
        };
        return { ...u, permissions };
      }
      return u;
    });

    saveUsersToStorage(updated);
    addNotification({
      title: 'Permissions Adjusted',
      message: `Modified ${selectedUser.name}'s permissions for ${entity}.${action}.`,
      type: 'System'
    });
  };

  // Status Toggling
  const handleToggleStatus = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.role === 'Super Admin') {
      addNotification({
        title: 'Forbidden Action',
        message: 'The workspace Super Admin account cannot be suspended.',
        type: 'Alert'
      });
      return;
    }
    if (!canModifyTarget(target.role)) {
      addNotification({
        title: 'Permission Denied',
        message: 'You do not have permission to change the status of this user.',
        type: 'Alert'
      });
      return;
    }

    const newStatus: "Active" | "Suspended" = target.status === 'Active' ? 'Suspended' : 'Active';
    const updated = users.map(u => {
      if (u.id === userId) {
        const log: ActivityLog = {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: newStatus === 'Suspended' ? 'User Suspended' : 'User Re-activated',
          details: `Manual status change to ${newStatus}`,
          ip: 'System Admin'
        };
        return {
          ...u,
          status: newStatus,
          activityLogs: [log, ...u.activityLogs]
        };
      }
      return u;
    });

    saveUsersToStorage(updated);
    addNotification({
      title: newStatus === 'Suspended' ? 'User Suspended' : 'User Activated',
      message: `${target.name} has been set to ${newStatus}.`,
      type: 'Alert'
    });
  };

  // Delete User
  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.role === 'Super Admin') {
      addNotification({
        title: 'Forbidden Action',
        message: 'The workspace Super Admin cannot be removed.',
        type: 'Alert'
      });
      return;
    }
    if (!canModifyTarget(target.role)) {
      addNotification({
        title: 'Permission Denied',
        message: 'You do not have permission to delete this user.',
        type: 'Alert'
      });
      return;
    }

    const filtered = users.filter(u => u.id !== userId);
    saveUsersToStorage(filtered);
    if (selectedUserId === userId) {
      setSelectedUserId(filtered[0]?.id || 'usr-1');
    }

    addNotification({
      title: 'User Removed',
      message: `${target.name} account was deleted.`,
      type: 'Alert'
    });
  };

  const handleResetPassword = (userId: string) => {
    if (loggedInUser.role !== 'Super Admin' && loggedInUser.id !== userId) {
      addNotification({
        title: 'Permission Denied',
        message: 'Only a Super Admin can reset other users\' passwords.',
        type: 'Alert'
      });
      return;
    }
    const target = users.find(u => u.id === userId);
    if (!target) return;
    
    if (target.role === 'Super Admin') {
      addNotification({
        title: 'Forbidden Action',
        message: 'The workspace Super Admin password cannot be reset from this interface.',
        type: 'Alert'
      });
      return;
    }
    
    setResetTargetUser(target);
    setResetRole(target.role);
    setResetDept(target.department);
    setNewPassword('password123'); // Default password
    setConfirmPassword('password123');
    setPasswordError('');
    setIsResetPasswordOpen(true);
  };

  const executePasswordReset = () => {
    if (!resetTargetUser) return;

    if (resetMethod === 'manual') {
      if (!newPassword.trim()) {
        setPasswordError('Password cannot be empty');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      const updated = users.map(u => u.id === resetTargetUser.id ? { ...u, password: newPassword, role: resetRole, department: resetDept } : u);
      saveUsersToStorage(updated);
      
      addNotification({
        title: 'Password Updated',
        message: `The password for ${resetTargetUser.name} has been successfully updated.`,
        type: 'System'
      });
    } else {
      addNotification({
        title: 'Password Reset Link Sent',
        message: `A secure password reset link has been dispatched to ${resetTargetUser.email}.`,
        type: 'System'
      });
    }
    
    setIsResetPasswordOpen(false);
  };

  const handleOpenForm = (user?: ManagedUser) => {
    if (user) {
      if (!canModifyTarget(user.role) && user.id !== loggedInUser.id) {
         addNotification({
           title: 'Permission Denied',
           message: 'You do not have permission to edit this profile based on your role.',
           type: 'Alert'
         });
         return;
      }
      setEditingUser(user);
      setFormName(user.name);
      setFormEmail(user.email);
      setFormPhone(user.phone);
      setFormRole(user.role);
      setFormDept(user.department);
      setFormStatus(user.status);
      setFormDob(user.dob || '');
      setFormGender(user.gender || '');
      setFormAadhaar(user.aadhaarId || '');
      setFormVoterId(user.voterId || '');
      setFormPan(user.panCard || '');
      setFormDl(user.drivingLicense || '');
      setFormProfilePhoto(user.profilePhoto || '');
      setFormLinkedStaffId(user.internalStaffId || '');
      setFormInactivityTimeoutMinutes(user.inactivityTimeoutMinutes !== undefined ? String(user.inactivityTimeoutMinutes) : '0');
      setFormMaxLoginAttempts(user.maxLoginAttempts !== undefined ? String(user.maxLoginAttempts) : '0');
    } else {
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormRole('Editor');
      setFormDept('Finance');
      setFormStatus('Active');
      setFormDob('');
      setFormGender('');
      setFormAadhaar('');
      setFormVoterId('');
      setFormPan('');
      setFormDl('');
      setFormProfilePhoto('');
      setFormLinkedStaffId('');
      setFormInactivityTimeoutMinutes('0');
      setFormMaxLoginAttempts('0');
    }
    setIsFormOpen(true);
  };

  const handleSaveFormUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      alert('Please fill out Name and Email.');
      return;
    }

    if (!canModifyTarget(formRole) && !(editingUser && editingUser.id === loggedInUser.id && formRole === editingUser.role)) {
       addNotification({
         title: 'Permission Denied',
         message: `You cannot create or upgrade a user to the "${formRole}" role based on your permission level.`,
         type: 'Alert'
       });
       return;
    }

    if (editingUser) {
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          const log: ActivityLog = {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            action: 'Account Details Modified',
            details: `Updated info: role=${formRole}, department=${formDept}`,
            ip: '192.168.1.101'
          };
          return {
            ...u,
            name: formName,
            email: formEmail,
            phone: formPhone,
            role: formRole,
            department: formDept,
            status: formStatus,
            dob: formDob,
            gender: formGender,
            aadhaarId: formAadhaar,
            voterId: formVoterId,
            panCard: formPan,
            drivingLicense: formDl,
            profilePhoto: formProfilePhoto,
            internalStaffId: formLinkedStaffId,
            inactivityTimeoutMinutes: formInactivityTimeoutMinutes && formInactivityTimeoutMinutes !== '0' ? parseInt(formInactivityTimeoutMinutes, 10) : undefined,
            maxLoginAttempts: formMaxLoginAttempts && formMaxLoginAttempts !== '0' ? parseInt(formMaxLoginAttempts, 10) : undefined,
            activityLogs: [log, ...u.activityLogs]
          };
        }
        return u;
      });
      saveUsersToStorage(updated);
      addNotification({
        title: 'User Updated',
        message: `Successfully saved profile updates for ${formName}.`,
        type: 'System'
      });
    } else {
      const colors = [
        'from-blue-500 to-indigo-600',
        'from-pink-500 to-rose-600',
        'from-purple-500 to-violet-600',
        'from-cyan-500 to-blue-600',
        'from-orange-500 to-red-600',
        'from-teal-500 to-emerald-600'
      ];
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        name: formName,
        email: formEmail,
        password: 'password123',
        phone: formPhone || '+91 99999 99999',
        role: formRole,
        department: formDept,
        status: 'Invited',
        lastActive: 'Invitation Pending',
        avatarColor: selectedColor,
        dob: formDob,
        gender: formGender,
        aadhaarId: formAadhaar,
        voterId: formVoterId,
        panCard: formPan,
        drivingLicense: formDl,
        profilePhoto: formProfilePhoto,
        internalStaffId: formLinkedStaffId,
        inactivityTimeoutMinutes: formInactivityTimeoutMinutes && formInactivityTimeoutMinutes !== '0' ? parseInt(formInactivityTimeoutMinutes, 10) : undefined,
        maxLoginAttempts: formMaxLoginAttempts && formMaxLoginAttempts !== '0' ? parseInt(formMaxLoginAttempts, 10) : undefined,
        permissions: {
          vouchers: { read: true, create: formRole !== 'Viewer', edit: formRole !== 'Viewer' && formRole !== 'Editor', delete: false },
          masters: { read: true, create: formRole === 'Admin' || formRole === 'Manager', edit: formRole === 'Admin' || formRole === 'Manager', delete: false },
          reports: { read: true, create: false, edit: false, delete: false },
          system: { read: formRole === 'Admin', create: false, edit: false, delete: false },
          audits: { read: formRole === 'Admin' || formRole === 'Manager', create: false, edit: false, delete: false }
        },
        activityLogs: [
          {
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            action: 'Account Invited',
            details: `Corporate invite dispatched to ${formEmail}`,
            ip: 'System Portal'
          }
        ]
      };

      const updated = [...users, newUser];
      saveUsersToStorage(updated);
      setSelectedUserId(newUser.id);
      
      addNotification({
        title: 'Invitation Dispatched',
        message: `Invite securely sent to ${formEmail}. Verification pending setup.`,
        type: 'Alert'
      });
    }

    setIsFormOpen(false);
  };

  const handleExport = (type: 'csv' | 'json') => {
    setShowExportMenu(false);
    if (type === 'csv') {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Last Active'];
      const rows = users.map(u => [
        u.id, 
        `"${u.name}"`, 
        u.email, 
        u.phone, 
        u.role, 
        u.department, 
        u.status, 
        `"${u.lastActive}"`
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(e => e.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `company_directory_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addNotification({
        title: 'Directory Exported',
        message: 'The company directory has been successfully exported as CSV.',
        type: 'System'
      });
    } else {
      const jsonContent = JSON.stringify(users, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `company_directory_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addNotification({
        title: 'Directory Exported',
        message: 'The company directory has been successfully exported as JSON.',
        type: 'System'
      });
    }
  };

  const handleImportClick = (type: 'csv' | 'json') => {
    setShowImportMenu(false);
    setImportType(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (importType === 'json') {
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed)) {
            // Basic validation
            const validUsers = parsed.filter(u => u.id && u.name && u.email);
            if (validUsers.length > 0) {
              setUsers(prev => {
                const newUsers = [...prev];
                validUsers.forEach(vu => {
                  if (!newUsers.find(nu => nu.id === vu.id)) {
                    newUsers.push(vu as ManagedUser);
                  }
                });
                return newUsers;
              });
              addNotification({
                title: 'Import Successful',
                message: `Successfully imported ${validUsers.length} users from JSON.`,
                type: 'System'
              });
            }
          }
        } else if (importType === 'csv') {
           const lines = result.split('\n');
           if (lines.length > 1) {
             const newUsersArray: any[] = [];
             for (let i = 1; i < lines.length; i++) {
               const row = lines[i].split(',');
               if (row.length >= 3) {
                 const newId = row[0].replace(/"/g, '').trim() || `usr-import-${Date.now()}-${i}`;
                 newUsersArray.push({
                   id: newId,
                   name: (row[1] || '').replace(/"/g, '').trim() || 'Imported User',
                   email: (row[2] || '').trim(),
                   phone: (row[3] || '').trim(),
                   role: (row[4] || 'User').trim(),
                   department: (row[5] || 'Operations').trim(),
                   status: (row[6] || 'Active').trim() as any,
                   lastActive: (row[7] || 'New').replace(/"/g, '').trim(),
                   avatarColor: 'from-gray-400 to-gray-500',
                   permissions: { vouchers: [], reports: [], ledgers: [], settings: false },
                   recentActivity: []
                 });
               }
             }
             if (newUsersArray.length > 0) {
               setUsers(prev => {
                  const currentIds = new Set(prev.map(p => p.id));
                  const combined = [...prev];
                  newUsersArray.forEach(nu => {
                     if (!currentIds.has(nu.id)) {
                        combined.push(nu as ManagedUser);
                     }
                  });
                  return combined;
               });
               addNotification({
                  title: 'Import Successful',
                  message: `Successfully imported ${newUsersArray.length} users from CSV.`,
                  type: 'System'
               });
             }
           }
        }
      } catch (err) {
        addNotification({
          title: 'Import Failed',
          message: 'There was an error parsing the file. Please check the format.',
          type: 'Alert'
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResendInvite = (user: ManagedUser) => {
    addNotification({
      title: 'Invitation Resent',
      message: `A new invitation email has been sent to ${user.email}.`,
      type: 'System'
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery) ||
                          u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => getRoleLevel(a.role) - getRoleLevel(b.role));

  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* User Directory Subpanel (Left 5 cols) */}
        <div className="xl:col-span-5 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
              <User className="mr-2 text-blue-600 w-4 h-4" /> {t("Team Directory")}
            </h3>
            <div className="flex items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept={importType === 'csv' ? '.csv' : '.json'} 
                className="hidden" 
              />
              <div className="relative" ref={importDropdownRef}>
                <button 
                  onClick={() => setShowImportMenu(!showImportMenu)}
                  className="py-1.5 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-sm shrink-0"
                  title="Import directory data"
                >
                  <Upload className="w-3.5 h-3.5 sm:mr-1" strokeWidth={3} />
                  <span className="hidden sm:inline">{t("Import")}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                {showImportMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 animate-in slide-in-from-top-2">
                     <button onClick={() => { handleImportClick('csv'); setShowImportMenu(false); }} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Import CSV")}</button>
                     <button onClick={() => { handleImportClick('json'); setShowImportMenu(false); }} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Import JSON")}</button>
                  </div>
                )}
              </div>
              <div className="relative hidden md:block" ref={exportDropdownRef}>
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="py-1.5 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center justify-center transition-all shadow-sm shrink-0"
                  title="Export directory data"
                >
                  <Download className="w-3.5 h-3.5 sm:mr-1" strokeWidth={3} />
                  <span className="hidden sm:inline">{t("Export")}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 animate-in slide-in-from-top-2">
                     <button onClick={() => { handleExport('csv'); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Export CSV")}</button>
                     <button onClick={() => { handleExport('json'); setShowExportMenu(false); }} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">{t("Export JSON")}</button>
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

          {/* Filter Bar */}
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
                <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1 mb-1 pl-1">{t("Status Filter")}</label>
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

          {/* User Cards Grid */}
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
                            user.status === 'Permanently Disabled' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400' :
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

        {/* User Details & Permissions (Right 7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          
          {selectedUser && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
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

              {/* Organizational Binding Block */}
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
          )}

          {/* Selected User Activity Logs Audit Stream */}
          {selectedUser && (
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
          )}
        </div>
      </div>

      {/* Invite / Edit User modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto pt-10 pb-10">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-4xl w-full border border-gray-100 dark:border-gray-700 shadow-2xl relative my-auto">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center">
              <User className="mr-2 text-blue-600 w-4 h-4" /> {editingUser ? 'Modify credentials' : 'Invite New Team member'}
            </h3>

            <form onSubmit={handleSaveFormUser} className="space-y-6">
              
              {/* Linked Staff Member Section */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 pl-1">
                  Linked Staff Master Account (Internal Context)
                </label>
                <select
                  value={formLinkedStaffId}
                  onChange={(e) => {
                    setFormLinkedStaffId(e.target.value);
                    const staff = staffMasters.find(s => s.id === e.target.value);
                    if (staff) {
                      setFormName(staff.name || formName);
                      setFormEmail(staff.email || formEmail);
                      setFormPhone(staff.phone || formPhone);
                      if (staff.department) setFormDept(staff.department);
                      setFormGender(staff.gender || formGender);
                      setFormDob(staff.dateOfBirth || formDob);
                      setFormAadhaar(staff.aadhaarCard || formAadhaar);
                      setFormVoterId(staff.voterIdCard || formVoterId);
                      setFormPan(staff.panCard || formPan);
                      setFormDl(staff.drivingLicense || formDl);
                      setFormProfilePhoto(staff.photoUrl || formProfilePhoto);
                    }
                  }}
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-300 outline-none text-xs cursor-pointer"
                >
                  <option value="">-- Disconnected / Standalone Account --</option>
                  {staffMasters.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.code}) - {staff.designation || 'Staff'} - {staff.department}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 pl-1 font-medium bg-transparent">{t("Connecting a staff master will auto-fill profile details")}</p>
              </div>
              
              {/* Photo Upload & Main details */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden relative group cursor-pointer" onClick={() => document.getElementById('profile-photo-upload')?.click()}>
                    {formProfilePhoto ? (
                      <img src={formProfilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400 group-hover:text-blue-500 transition-colors">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                       <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    id="profile-photo-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setFormProfilePhoto(ev.target?.result as string);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} 
                  />
                  <span className="text-[10px] uppercase font-bold text-gray-500">{t("Profile Photo")}</span>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Full Identity Name")}</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Email address")}</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. rahul@bharatbook.com"
                      className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Contact Phone")}</label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +91 99000 88000"
                      className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Gender")}</label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                      >
                        <option value="">{t("Select")}</option>
                        <option value="Male">{t("Male")}</option>
                        <option value="Female">{t("Female")}</option>
                        <option value="Other">{t("Other")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Date of Birth")}</label>
                      <input
                        type="date"
                        value={formDob}
                        onChange={(e) => setFormDob(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t("Government IDs")}</h4>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Aadhaar Card Number")}</label>
                    <input
                      type="text"
                      value={formAadhaar}
                      onChange={(e) => setFormAadhaar(e.target.value)}
                      placeholder="xxxx-xxxx-xxxx"
                      className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Voter ID Card Number")}</label>
                    <input
                      type="text"
                      value={formVoterId}
                      onChange={(e) => setFormVoterId(e.target.value)}
                      placeholder="Voter ID"
                      className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("PAN Card Number")}</label>
                    <input
                      type="text"
                      value={formPan}
                      onChange={(e) => setFormPan(e.target.value)}
                      placeholder="ABCDE1234F"
                      className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs shadow-sm uppercase uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Driving License Number")}</label>
                    <input
                      type="text"
                      value={formDl}
                      onChange={(e) => setFormDl(e.target.value)}
                      placeholder="DL Number"
                      className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs shadow-sm uppercase uppercase"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t("Organizational Binding")}</h4>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Security Role")}</label>
                    <select
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value as any)}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm cursor-pointer"
                      >
                        <option value="Super Admin">{t("Super Admin")}</option>
                        <option value="Owner">{t("Owner")}</option>
                        <option value="Admin">{t("Admin")}</option>
                        <option value="Manager">{t("Manager")}</option>
                        <option value="Editor">{t("Editor")}</option>
                        <option value="Viewer">{t("Viewer")}</option>
                      </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Department")}</label>
                    <select
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm cursor-pointer"
                      >
                        <option value="Super Admin">{t("Super Admin")}</option>
                        <option value="Developer">{t("Developer")}</option>
                        <option value="Finance">{t("Finance")}</option>
                        <option value="Sales">{t("Sales")}</option>
                        <option value="IT Operations">{t("IT Operations")}</option>
                        <option value="Audit">{t("Audit")}</option>
                        <option value="Management">{t("Management")}</option>
                      </select>
                  </div>
                  
                  {editingUser && (
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Access Status")}</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm cursor-pointer"
                      >
                        <option value="Active">{t("Active")}</option>
                        <option value="Invited">{t("Invited")}</option>
                        <option value="Suspended">{t("Suspended")}</option>
                        <option value="Permanently Disabled">{t("Permanently Disabled")}</option>
                        <option value="Archived">{t("Archived")}</option>
                        <option value="Terminated">{t("Terminated")}</option>
                        <option value="Deactivated">{t("Deactivated")}</option>
                      </select>
                    </div>
                  )}

                  {/* Individual Inactivity Session Timeout */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Inactivity Session Timeout")}</label>
                    <select
                      disabled={editingUser ? !(loggedInUser.role === 'Super Admin' || (loggedInUser.role === 'Owner' && editingUser.role !== 'Super Admin') || (loggedInUser.role === 'Admin' && editingUser.role !== 'Super Admin' && editingUser.role !== 'Owner' && editingUser.role !== 'Admin')) : false}
                      value={formInactivityTimeoutMinutes}
                      onChange={(e) => setFormInactivityTimeoutMinutes(e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <option value="0">Default (Inherit Group/Global)</option>
                      <option value="10">{t("10 Minutes")}</option>
                      <option value="15">{t("15 Minutes")}</option>
                      <option value="30">{t("30 Minutes")}</option>
                      <option value="45">{t("45 Minutes")}</option>
                      <option value="60">1 Hour (60 Minutes)</option>
                      <option value="120">2 Hours (120 Minutes)</option>
                      <option value="360">6 Hours (360 Minutes)</option>
                    </select>
                  </div>

                  {/* Individual Max Login Attempts Override */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Max Login Attempts Override")}</label>
                    <select
                      disabled={editingUser ? !(loggedInUser.role === 'Super Admin' || (loggedInUser.role === 'Owner' && editingUser.role !== 'Super Admin') || (loggedInUser.role === 'Admin' && editingUser.role !== 'Super Admin' && editingUser.role !== 'Owner' && editingUser.role !== 'Admin')) : false}
                      value={formMaxLoginAttempts}
                      onChange={(e) => setFormMaxLoginAttempts(e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-[10px] font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <option value="0">Default (Inherit Role Default)</option>
                      <option value="3">{t("3 Attempts before Lockout")}</option>
                      <option value="5">{t("5 Attempts before Lockout")}</option>
                      <option value="10">{t("10 Attempts before Lockout")}</option>
                      <option value="15">{t("15 Attempts before Lockout")}</option>
                      <option value="999">{t("Unlimited Attempts Allowed")}</option>
                    </select>
                    {editingUser && !(loggedInUser.role === 'Super Admin' || (loggedInUser.role === 'Owner' && editingUser.role !== 'Super Admin') || (loggedInUser.role === 'Admin' && editingUser.role !== 'Super Admin' && editingUser.role !== 'Owner' && editingUser.role !== 'Admin')) && (
                      <p className="text-[9px] text-red-500 dark:text-red-400 font-semibold mt-1">
                        {t("Only higher roles are authorized to decide security restrictions.")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6 font-sans">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-3 px-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
                >
                  {editingUser ? 'Save Updates' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Password Reset Modal */}
      {isResetPasswordOpen && resetTargetUser && (
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
      )}
    </>
  );
};
