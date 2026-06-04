import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { useNotifications } from '../../../../../../context/NotificationContext';
import { ManagedUser, INITIAL_USERS, UserPermissions, ActivityLog } from '../types';

export const useCompanyDirectory = () => {
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

  // Form (Create / Edit User fields)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer'>('Editor');
  const [formDept, setFormDept] = useState('Finance');
  const [formStatus, setFormStatus] = useState<'Active' | 'Invited' | 'Suspended' | 'Permanently Disabled' | 'Archived' | 'Terminated' | 'Deactivated'>('Active');
  
  // Custom profile fields
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

  // Password Reset Fields
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<ManagedUser | null>(null);
  const [resetRole, setResetRole] = useState<'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer'>('Editor');
  const [resetDept, setResetDept] = useState('Finance');
  const [resetMethod, setResetMethod] = useState<'email' | 'manual'>('email');
  const [newPassword, setNewPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [passwordError, setPasswordError] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);

  // Click outside for dropdowns
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

  // Sync / Load Initial Users
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

  // Actions
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
    setNewPassword('password123');
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
                   permissions: {
                     vouchers: { read: true, create: true, edit: false, delete: false },
                     masters: { read: true, create: false, edit: false, delete: false },
                     reports: { read: true, create: false, edit: false, delete: false },
                     system: { read: false, create: false, edit: false, delete: false },
                     audits: { read: false, create: false, edit: false, delete: false }
                   },
                   activityLogs: []
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

  return {
    t,
    users,
    selectedUserId,
    setSelectedUserId,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    showExportMenu,
    setShowExportMenu,
    showImportMenu,
    setShowImportMenu,
    fileInputRef,
    exportDropdownRef,
    importDropdownRef,
    importType,
    isFormOpen,
    setIsFormOpen,
    editingUser,
    formName,
    setFormName,
    formEmail,
    setFormEmail,
    formPhone,
    setFormPhone,
    formRole,
    setFormRole,
    formDept,
    setFormDept,
    formStatus,
    setFormStatus,
    formDob,
    setFormDob,
    formGender,
    setFormGender,
    formAadhaar,
    setFormAadhaar,
    formVoterId,
    setFormVoterId,
    formPan,
    setFormPan,
    formDl,
    setFormDl,
    formProfilePhoto,
    setFormProfilePhoto,
    formLinkedStaffId,
    setFormLinkedStaffId,
    formInactivityTimeoutMinutes,
    setFormInactivityTimeoutMinutes,
    formMaxLoginAttempts,
    setFormMaxLoginAttempts,
    staffMasters,
    isResetPasswordOpen,
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
    handleTogglePermission,
    handleToggleStatus,
    handleDeleteUser,
    handleResetPassword,
    executePasswordReset,
    handleOpenForm,
    handleSaveFormUser,
    handleExport,
    handleImportClick,
    handleFileUpload,
    handleResendInvite,
    filteredUsers,
    getInitials,
    selectedUser,
    loggedInUser,
    canModifyTarget,
  };
};
