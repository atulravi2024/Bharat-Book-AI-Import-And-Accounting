import React, { useState } from 'react';
import { HelpCircle, Shield, Sliders, UserCheck, Compass, SlidersHorizontal, Lock, Users } from 'lucide-react';

export const UserHelpSettings: React.FC = () => {
  // Calculator Form State
  const [testRole, setTestRole] = useState<'Accountant' | 'Auditor' | 'Partner' | 'Guest'>('Accountant');
  const [testDept, setTestDept] = useState<'Finance' | 'Executive' | 'Operations' | 'Audit'>('Finance');

  // Interactive permission evaluation simulation
  const evaluateMockPolicy = (role: string, dept: string) => {
    // Mimic the policy rules resolved restrictively from security.ts
    let maxTx = 500000; // 5 Lakhs fallback
    let dailyVoucher = 50; 
    let hoursStr = "Business Hours (09:00 AM - 06:00 PM)";
    let mfa = true;

    if (role === 'Partner' || dept === 'Executive') {
      maxTx = 0; // unlimited
      dailyVoucher = 0; // unlimited
      hoursStr = "Anytime (24/7 Portal Access)";
      mfa = false;
    } else if (role === 'Auditor' || dept === 'Audit') {
      maxTx = 1000000; // 10 Lakhs
      dailyVoucher = 200;
      hoursStr = "Weekdays Only (Mon-Fri)";
      mfa = true;
    } else if (role === 'Guest') {
      maxTx = 0; // blocked upload
      dailyVoucher = 0; // blocked upload
      hoursStr = "Business Hours (09:00 AM - 06:00 PM)";
      mfa = false;
    } else {
      // Accountant
      maxTx = 500000;
      dailyVoucher = 100;
      hoursStr = "Business Hours (09:00 AM - 06:00 PM)";
      mfa = true;
    }

    // Role-matrix
    const perms = {
      vouchers: { read: true, create: role !== 'Guest', edit: role === 'Accountant' || role === 'Partner', delete: role === 'Partner' },
      masters: { read: true, create: role === 'Partner', edit: role === 'Partner', delete: false },
      reports: { read: role !== 'Guest', create: false, edit: false, delete: false },
    };

    return { maxTx, dailyVoucher, hoursStr, mfa, perms };
  };

  const currentPolicy = evaluateMockPolicy(testRole, testDept);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Decorative Title Banner */}
      <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 rounded-3xl p-5 text-white border border-indigo-950/40 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mb-10" />
        <div className="relative z-10 flex gap-4 items-center">
          <div className="p-3 bg-indigo-600/30 border border-indigo-500/20 rounded-2rem text-indigo-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">User Administration Help Desk</h3>
            <p className="text-[10px] text-indigo-300 font-bold uppercase mt-0.5 tracking-widest">Help guidelines & policy matrix analyzer for team profiles</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Role FAQs specific to User administration */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700/60 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">Admin FAQ & Instructions</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">How do I restrict a user to read-only?</span>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                  Modify the user profile role to "Guest" or set up a custom Department matrix under **Group Rules**. Read-only is enforced by clearing "Create", "Edit", and "Delete" checklist markers across Vouchers and Master schemas.
                </p>
              </div>

              <div className="space-y-1 border-t border-gray-50 dark:border-gray-700/50 pt-3">
                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Why are role and department rules combined restrictively?</span>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                  To prevent unauthorized security bypasses. If an Accountant (Role allowed max 5 Lakhs single limit) works in the Sales Department (Dept allowed max 2 Lakhs single limit), their effective capability is constrained to the lowest denominator (2 Lakhs maximum transactions).
                </p>
              </div>

              <div className="space-y-1 border-t border-gray-50 dark:border-gray-700/50 pt-3">
                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">How to manage staff linked accounts?</span>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                  In the **Company Directory**, click on any team member's card. Scroll to the "Linked Staff Account" section, and map them to your designated Ledger/Contact Account. This links Excel importing statements directly under their operational entity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security Matrix Override Sandbox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-indigo-50/10 via-indigo-50/5 to-transparent dark:from-indigo-950/5 dark:to-transparent rounded-3xl p-5 border border-indigo-100/50 dark:border-indigo-900/30 space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase text-indigo-950 dark:text-indigo-200 tracking-wider">Security Matrix Sandbox</h4>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest pl-0.5">Simulate Effective User Constraints</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block">1. Select Target Role</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['Accountant', 'Auditor', 'Partner', 'Guest'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setTestRole(role)}
                      className={`py-1.5 rounded-lg text-[9px] font-black transition-all border uppercase tracking-wider ${
                        testRole === role
                          ? 'bg-indigo-600 text-white border-transparent shadow'
                          : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-150 hover:bg-gray-50 dark:border-gray-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider block">2. Select Target Department</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['Finance', 'Executive', 'Operations', 'Audit'] as const).map(dept => (
                    <button
                      key={dept}
                      onClick={() => setTestDept(dept)}
                      className={`py-1.5 rounded-lg text-[9px] font-black transition-all border uppercase tracking-wider ${
                        testDept === dept
                          ? 'bg-indigo-600 text-white border-transparent shadow'
                          : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-150 hover:bg-gray-50 dark:border-gray-700'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Effectiveness Ledger */}
            <div className="bg-white/90 dark:bg-gray-900/60 rounded-2xl p-4 border border-indigo-100/30 space-y-3">
              <h5 className="text-[9px] font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest">Effective Group Rule Bounds:</h5>

              <div className="space-y-2 text-[10px] font-bold">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950 px-2.5 py-1.5 rounded">
                  <span className="text-gray-400 uppercase tracking-widest text-[8px]">Daily upload limit</span>
                  <span className="text-gray-800 dark:text-white uppercase tracking-wider">
                    {currentPolicy.dailyVoucher === 0 ? 'Unlimited' : `${currentPolicy.dailyVoucher} Vouchers`}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950 px-2.5 py-1.5 rounded">
                  <span className="text-gray-400 uppercase tracking-widest text-[8px]">Max transaction size</span>
                  <span className="text-gray-800 dark:text-white uppercase tracking-wider">
                    {currentPolicy.maxTx === 0 ? 'Blocked / Unlimited' : `₹ ${currentPolicy.maxTx.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950 px-2.5 py-1.5 rounded">
                  <span className="text-gray-400 uppercase tracking-widest text-[8px]">Corporate Working Hours</span>
                  <span className="text-gray-800 dark:text-white uppercase tracking-wider text-[9px]">
                    {currentPolicy.hoursStr}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-950 px-2.5 py-1.5 rounded">
                  <span className="text-gray-400 uppercase tracking-widest text-[8px]">Require approval MFA?</span>
                  <span className={currentPolicy.mfa ? 'text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[9px]' : 'text-gray-500 uppercase tracking-wider text-[9px]'}>
                    {currentPolicy.mfa ? 'Mandatory Check' : 'By-Passed'}
                  </span>
                </div>
              </div>

              {/* Effective Permission indicators */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex gap-2 justify-center">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${currentPolicy.perms.vouchers.create ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  Post Voucher: {currentPolicy.perms.vouchers.create ? 'Allow' : 'Block'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${currentPolicy.perms.masters.create ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  Create Master: {currentPolicy.perms.masters.create ? 'Allow' : 'Block'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
