import { ManagedUser, UserPermissions } from "../components/Settings/OrganizationSettings/UserSettings";

export interface EffectivePolicy {
  inactivityTimeoutMinutes: number;
  maxLoginAttempts: number;
  dailyVoucherLimit: number;
  maxTransactionAmount: number;
  workHoursMode: 'any' | 'business' | 'weekdays';
  requireMfaApproval: boolean;
  permissions: UserPermissions;
}

// Predefined fallback permissions
const getBlankPermissions = (isSuper: boolean): UserPermissions => ({
  vouchers: { read: isSuper, create: isSuper, edit: isSuper, delete: isSuper },
  masters: { read: isSuper, create: isSuper, edit: isSuper, delete: isSuper },
  reports: { read: isSuper, create: isSuper, edit: isSuper, delete: isSuper },
  system: { read: isSuper, create: isSuper, edit: isSuper, delete: isSuper },
  audits: { read: isSuper, create: isSuper, edit: isSuper, delete: isSuper },
});

export const getCurrentUser = (): ManagedUser | null => {
  try {
    const loggedInId = localStorage.getItem('bharat_book_current_logged_in_user_id');
    const savedUsers = localStorage.getItem('bharat_book_managed_users');
    if (!loggedInId) return null;

    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      const found = parsed.find((u: any) => u.id === loggedInId);
      if (found) return found;
    }

    // fallback for Super Admin if id matches root
    if (loggedInId === 'usr-1') {
      return {
        id: 'usr-1',
        name: 'Super Admin',
        email: 'superadmin@bharatbook.com',
        phone: '+91 90000 00001',
        role: 'Super Admin',
        department: 'Developer',
        status: 'Active',
        lastActive: 'Active now',
        avatarColor: 'from-blue-600 to-indigo-600',
        permissions: getBlankPermissions(true),
        activityLogs: []
      };
    }
  } catch (e) {
    console.error('Error fetching current user:', e);
  }
  return null;
};

export const getEffectivePolicy = (): EffectivePolicy => {
  const user = getCurrentUser();
  const isSuper = user?.role === 'Super Admin';

  const defaultPolicy: EffectivePolicy = {
    inactivityTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    dailyVoucherLimit: 0,
    maxTransactionAmount: 0,
    workHoursMode: 'any',
    requireMfaApproval: false,
    permissions: getBlankPermissions(isSuper)
  };

  if (!user) return defaultPolicy;
  if (isSuper) {
    // Super admin is always unlimited and unrestricted
    return {
      inactivityTimeoutMinutes: 15, // standard super admin timeout
      maxLoginAttempts: 999,
      dailyVoucherLimit: 0,
      maxTransactionAmount: 0,
      workHoursMode: 'any',
      requireMfaApproval: false,
      permissions: getBlankPermissions(true)
    };
  }

  try {
    // Load rules
    const savedPolsStr = localStorage.getItem('bharat_book_security_policies');
    let savedPols: any = {};
    if (savedPolsStr) {
      savedPols = JSON.parse(savedPolsStr);
    }

    const roleRule = savedPols[`role_rule_${user.role}`];
    const deptRule = savedPols[`dept_rule_${user.department}`];

    // Restrictive evaluation helpers
    const resolveNumber = (roleVal: number | undefined, deptVal: number | undefined, normalFallback: number): number => {
      const r = roleVal || 0;
      const d = deptVal || 0;
      if (r === 0 && d === 0) return normalFallback;
      if (r === 0) return d;
      if (d === 0) return r;
      return Math.min(r, d); // pick more restrictive limit
    };

    const resolveVoucherLimit = (roleVal: number | undefined, deptVal: number | undefined): number => {
      const r = roleVal !== undefined ? roleVal : 0;
      const d = deptVal !== undefined ? deptVal : 0;
      if (r === 0 && d === 0) return 0;
      if (r === 0) return d;
      if (d === 0) return r;
      return Math.min(r, d); // strict lowest daily limit
    };

    const resolveTransactionAmount = (roleVal: number | undefined, deptVal: number | undefined): number => {
      const r = roleVal !== undefined ? roleVal : 0;
      const d = deptVal !== undefined ? deptVal : 0;
      if (r === 0 && d === 0) return 0;
      if (r === 0) return d;
      if (d === 0) return r;
      return Math.min(r, d); // strict lowest max limit
    };

    const resolveHours = (rMode: string | undefined, dMode: string | undefined): 'any' | 'business' | 'weekdays' => {
      if (rMode === 'business' || dMode === 'business') return 'business';
      if (rMode === 'weekdays' || dMode === 'weekdays') return 'weekdays';
      return 'any';
    };

    const mfaRequired = !!(roleRule?.requireMfaApproval || deptRule?.requireMfaApproval);

    // Resolve permissions cell-by-cell most restrictively (if both specifies, use AND. Else fallback)
    const resolveCell = (
      entity: keyof UserPermissions,
      action: 'read' | 'create' | 'edit' | 'delete'
    ): boolean => {
      // If user has specific overrides from direct settings, respect them
      if (user.permissions && user.permissions[entity]) {
        return !!user.permissions[entity][action];
      }

      const rVal = roleRule?.permissions?.[entity]?.[action];
      const dVal = deptRule?.permissions?.[entity]?.[action];

      // If either group rule blocks config explicitly, we block
      if (rVal !== undefined && dVal !== undefined) {
        return rVal && dVal;
      }
      if (rVal !== undefined) return rVal;
      if (dVal !== undefined) return dVal;

      return defaultPolicy.permissions[entity][action];
    };

    const resolvedPermissions: UserPermissions = {
      vouchers: {
        read: resolveCell('vouchers', 'read'),
        create: resolveCell('vouchers', 'create'),
        edit: resolveCell('vouchers', 'edit'),
        delete: resolveCell('vouchers', 'delete'),
      },
      masters: {
        read: resolveCell('masters', 'read'),
        create: resolveCell('masters', 'create'),
        edit: resolveCell('masters', 'edit'),
        delete: resolveCell('masters', 'delete'),
      },
      reports: {
        read: resolveCell('reports', 'read'),
        create: resolveCell('reports', 'create'),
        edit: resolveCell('reports', 'edit'),
        delete: resolveCell('reports', 'delete'),
      },
      system: {
        read: resolveCell('system', 'read'),
        create: resolveCell('system', 'create'),
        edit: resolveCell('system', 'edit'),
        delete: resolveCell('system', 'delete'),
      },
      audits: {
        read: resolveCell('audits', 'read'),
        create: resolveCell('audits', 'create'),
        edit: resolveCell('audits', 'edit'),
        delete: resolveCell('audits', 'delete'),
      },
    };

    const finalPolicy: EffectivePolicy = {
      inactivityTimeoutMinutes: resolveNumber(roleRule?.inactivityTimeoutMinutes, deptRule?.inactivityTimeoutMinutes, 30),
      maxLoginAttempts: resolveNumber(roleRule?.maxLoginAttempts, deptRule?.maxLoginAttempts, 5),
      dailyVoucherLimit: resolveVoucherLimit(roleRule?.dailyVoucherLimit, deptRule?.dailyVoucherLimit),
      maxTransactionAmount: resolveTransactionAmount(roleRule?.maxTransactionAmount, deptRule?.maxTransactionAmount),
      workHoursMode: resolveHours(roleRule?.workHoursMode, deptRule?.workHoursMode),
      requireMfaApproval: mfaRequired,
      permissions: resolvedPermissions
    };

    return finalPolicy;
  } catch (e) {
    console.error('Error resolving effective security policies:', e);
  }

  return defaultPolicy;
};

// Check if current hours are allowed under the policy
export const isWithinAllowedHours = (mode: 'any' | 'business' | 'weekdays'): { allowed: boolean; reason?: string } => {
  if (mode === 'any') return { allowed: true };

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  const hours = now.getHours();

  if (mode === 'weekdays') {
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) {
      return { 
        allowed: false, 
        reason: 'Weekdays Only Policy: Corporate ERP access is blocked during weekends to safeguard ledger logs.' 
      };
    }
  }

  if (mode === 'business') {
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) {
      return { 
        allowed: false, 
        reason: 'Business Hours Policy: Portal access is restricted to working business days (Mon-Fri).' 
      };
    }
    const isBusinessHours = hours >= 9 && hours < 18;
    if (!isBusinessHours) {
      return { 
        allowed: false, 
        reason: 'Business Hours Policy: Safe ERP operations are constrained between 09:00 AM and 06:00 PM.' 
      };
    }
  }

  return { allowed: true };
};

// Calculate count of vouchers created today by current user
export const getVouchersPostedTodayCount = (allVouchers: any[]): number => {
  const user = getCurrentUser();
  if (!user) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  
  return allVouchers.filter(v => {
    // If voucher has date value matching today, and auditLog shows current user or created by system during active session
    const isToday = v.date?.value === todayStr;
    const isPostedByUser = v.auditLogs?.some((log: any) => 
      String(log.user || log.author || '').toLowerCase().includes(user.name.toLowerCase()) ||
      String(log.user || log.author || '').toLowerCase().includes('user')
    );
    return isToday && isPostedByUser;
  }).length;
};
