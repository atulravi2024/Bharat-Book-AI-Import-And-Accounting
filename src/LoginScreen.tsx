import React, { useState, useEffect } from 'react';
import { Shield, Lock } from 'lucide-react';
import { ManagedUser, INITIAL_USERS } from './components/Settings/UserSettings';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [email, setEmail] = useState('superadmin@bharatbook.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [inactivityNotice, setInactivityNotice] = useState(false);
  const [timeoutMinutes, setTimeoutMinutes] = useState('30');

  useEffect(() => {
    const saved = localStorage.getItem('bharat_book_managed_users');
    let loadedUsers: ManagedUser[] = [];
    if (saved) {
      try {
         loadedUsers = JSON.parse(saved);
      } catch {
         loadedUsers = INITIAL_USERS;
      }
    } else {
      loadedUsers = INITIAL_USERS;
    }
    
    // Ensure Super Admin and Admin are always available if someone deletes/loses them
    let needsSave = false;
    INITIAL_USERS.forEach(initialUser => {
       if (!loadedUsers.find(u => u.id === initialUser.id)) {
           loadedUsers.push(initialUser);
           needsSave = true;
       }
    });

    if (needsSave || !saved) {
       localStorage.setItem('bharat_book_managed_users', JSON.stringify(loadedUsers));
    }

    setUsers(loadedUsers);

    // Check for inactivity flag
    const inactiveFlag = localStorage.getItem('bharat_book_logout_due_to_inactivity');
    if (inactiveFlag === 'true') {
      setInactivityNotice(true);
      const minutes = localStorage.getItem('bharat_book_inactivity_timeout_minutes') || '30';
      setTimeoutMinutes(minutes);
      localStorage.removeItem('bharat_book_logout_due_to_inactivity');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInactivityNotice(false); // Clear inactivity message upon trying to login
    
    let user = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    
    // Fallback for hardcoded superadmin if not in local users
    if (!user && email.trim().toLowerCase() === 'superadmin@bharatbook.com') {
       user = INITIAL_USERS.find(u => u.role === 'Super Admin');
    }

    // Auto-fix if someone changed superadmin role maliciously or via bug
    if (user && user.id === 'usr-1') {
       user.role = 'Super Admin';
       user.name = 'Super Admin';
       user.email = 'superadmin@bharatbook.com';
       // Update in localStorage so other components see the fix!
       let updatedUsers = [...users];
       const existingIndex = updatedUsers.findIndex(u => u.id === 'usr-1');
       if (existingIndex >= 0) {
         updatedUsers[existingIndex] = user!;
       } else {
         updatedUsers.push(user!);
       }
       localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
    }

    if (!user) {
      setError('System Error: User profile could not be found.');
      return;
    }

    // Lockout verification
    if (user.isLockedOut) {
      setError('Your account is locked out due to too many failed login attempts. Please contact Admin or Owner to unlock your account.');
      return;
    }

    const checkPassword = user?.password ? user.password : 'password123';
    
    // Master override for superadmin locally to not get locked out
    const isMasterOverride = email.trim().toLowerCase() === 'superadmin@bharatbook.com' && password === 'password123';

    if (checkPassword !== password && !isMasterOverride) {
      // Access role-based security policies for max unsuccessful login attempts
      let savedPolicies: any = {};
      try {
        const pols = localStorage.getItem('bharat_book_security_policies');
        if (pols) savedPolicies = JSON.parse(pols);
      } catch {}

      const roleDefaults: Record<string, number> = savedPolicies.roleMaxAttempts || {
        'Super Admin': 999, // Super Admins should usually have infinite or very large attempts fallback
        'Owner': 5,
        'Admin': 5,
        'Manager': 3,
        'Editor': 3,
        'Viewer': 3,
        'Developer': 5
      };

      const limit = user.maxLoginAttempts !== undefined && user.maxLoginAttempts !== null && user.maxLoginAttempts !== 0
        ? user.maxLoginAttempts
        : (roleDefaults[user.role] || 5);

      const attempts = (user.failedLoginAttempts || 0) + 1;
      const isLockedNow = attempts >= limit;

      const updatedUsers = users.map(u => {
        if (u.id === user!.id) {
          return {
            ...u,
            failedLoginAttempts: attempts,
            isLockedOut: isLockedNow
          };
        }
        return u;
      });

      localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      if (isLockedNow) {
        setError(`Incorrect password. Account is now LOCKED OUT after ${attempts}/${limit} continuous failed login attempts.`);
      } else {
        setError(`Invalid credentials. Incorrect password. Attempts count: ${attempts} of ${limit} before total account lockout.`);
      }
      return;
    }
    
    const hasAdminOrOwner = users.some(u => u.role === 'Owner' || u.role === 'Admin');

    if (!hasAdminOrOwner && user.role !== 'Super Admin') {
      setError('System requires an active Owner or Admin. Please contact Super Admin.');
      return;
    }

    if (user.status === 'Suspended') {
      setError('Your access is suspended. Please contact Admin or Owner.');
      return;
    }

    if (user.status === 'Permanently Disabled') {
      setError('Your access is permanently disabled. Please contact system administrators.');
      return;
    }

    if (user.status === 'Archived') {
      setError('Your user profile has been archived. Active workspace access is no longer permitted.');
      return;
    }

    if (user.status === 'Terminated') {
      setError('This account is terminated. Workspace access has been revoked.');
      return;
    }

    if (user.status === 'Deactivated') {
      setError('Your account is currently deactivated. Please contact an Administrator to reactivate.');
      return;
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts && user.failedLoginAttempts > 0) {
      const updatedUsers = users.map(u => {
        if (u.id === user!.id) {
          return {
            ...u,
            failedLoginAttempts: 0
          };
        }
        return u;
      });
      localStorage.setItem('bharat_book_managed_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }

    // Allow user to login since condition is met
    localStorage.setItem('bharat_book_current_logged_in_user_id', user.id);
    localStorage.setItem('bharat_book_session_start', Date.now().toString());

    // Record session history
    const sessionId = Date.now().toString();
    const sessionRecord = {
      id: sessionId,
      userId: user.id,
      loginTime: Date.now(),
      logoutTime: null,
      ipAddress: "192.168.1.104" // Mock IP as requested
    };
    const existingSessions = JSON.parse(localStorage.getItem('bharat_book_sessions') || '[]');
    existingSessions.push(sessionRecord);
    localStorage.setItem('bharat_book_sessions', JSON.stringify(existingSessions));
    localStorage.setItem('bharat_book_current_session_id', sessionId);

    onLogin(user.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <h2 className="text-xl font-black text-center text-gray-900 dark:text-white mb-2 uppercase tracking-tight">System Access</h2>
        <p className="text-xs font-bold text-center text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">Please authenticate to continue (default password: password123)</p>

        {inactivityNotice && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900/50 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in-95">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">Session Expired</p>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-1">
                You have been auto-logged out due to {timeoutMinutes} minutes of inactivity. Please authenticate again to access the portal.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-red-900 dark:text-red-200 uppercase tracking-widest">Login Failed</p>
              <p className="text-xs font-medium text-red-600 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. superadmin@bharatbook.com"
              className="w-full bg-slate-50 dark:bg-gray-900 border-none p-4 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2 pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-gray-900 border-none p-4 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={!email || !password}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all"
          >
            Authenticate Portal
          </button>
        </form>
      </div>
    </div>
  );
};
