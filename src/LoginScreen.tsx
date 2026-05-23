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
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
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

    const checkPassword = user?.password ? user.password : 'password123';
    
    // Master override for superadmin locally to not get locked out
    const isMasterOverride = email.trim().toLowerCase() === 'superadmin@bharatbook.com' && password === 'password123';

    if (checkPassword !== password && !isMasterOverride) {
      setError('Invalid credentials provided.');
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

    // Allow user to login since condition is met
    localStorage.setItem('bharat_book_current_logged_in_user_id', user.id);
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
