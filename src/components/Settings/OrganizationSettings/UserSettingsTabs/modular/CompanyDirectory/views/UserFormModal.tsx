import React from 'react';
import { User, Upload } from 'lucide-react';
import { ManagedUser } from "../types";

interface UserFormModalProps {
  t: (key: string) => string;
  editingUser: ManagedUser | null;
  setIsFormOpen: (open: boolean) => void;
  handleSaveFormUser: (e: React.FormEvent) => void;
  formLinkedStaffId: string;
  setFormLinkedStaffId: (id: string) => void;
  staffMasters: any[];
  formName: string;
  setFormName: (name: string) => void;
  formEmail: string;
  setFormEmail: (email: string) => void;
  formPhone: string;
  setFormPhone: (phone: string) => void;
  formGender: string;
  setFormGender: (gender: string) => void;
  formDob: string;
  setFormDob: (dob: string) => void;
  formAadhaar: string;
  setFormAadhaar: (aadhaar: string) => void;
  formVoterId: string;
  setFormVoterId: (voterId: string) => void;
  formPan: string;
  setFormPan: (pan: string) => void;
  formDl: string;
  setFormDl: (dl: string) => void;
  formRole: 'Developer' | 'Super Admin' | 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer';
  setFormRole: (role: any) => void;
  formDept: string;
  setFormDept: (dept: string) => void;
  formStatus: 'Active' | 'Invited' | 'Suspended' | 'Permanently Disabled' | 'Archived' | 'Terminated' | 'Deactivated';
  setFormStatus: (status: any) => void;
  formInactivityTimeoutMinutes: string;
  setFormInactivityTimeoutMinutes: (time: string) => void;
  formMaxLoginAttempts: string;
  setFormMaxLoginAttempts: (attempts: string) => void;
  loggedInUser: ManagedUser;
  formProfilePhoto: string;
  setFormProfilePhoto: (photo: string) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  t,
  editingUser,
  setIsFormOpen,
  handleSaveFormUser,
  formLinkedStaffId,
  setFormLinkedStaffId,
  staffMasters,
  formName,
  setFormName,
  formEmail,
  setFormEmail,
  formPhone,
  setFormPhone,
  formGender,
  setFormGender,
  formDob,
  setFormDob,
  formAadhaar,
  setFormAadhaar,
  formVoterId,
  setFormVoterId,
  formPan,
  setFormPan,
  formDl,
  setFormDl,
  formRole,
  setFormRole,
  formDept,
  setFormDept,
  formStatus,
  setFormStatus,
  formInactivityTimeoutMinutes,
  setFormInactivityTimeoutMinutes,
  formMaxLoginAttempts,
  setFormMaxLoginAttempts,
  loggedInUser,
  formProfilePhoto,
  setFormProfilePhoto,
}) => {
  return (
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
              <div 
                className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden relative group cursor-pointer" 
                onClick={() => document.getElementById('profile-photo-upload')?.click()}
              >
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
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs shadow-sm uppercase shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5 pl-1">{t("Driving License Number")}</label>
                <input
                  type="text"
                  value={formDl}
                  onChange={(e) => setFormDl(e.target.value)}
                  placeholder="DL Number"
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-xs shadow-sm uppercase shadow-sm"
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

              {/* Inactivity Session Timeout */}
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

              {/* Max Login Attempts Override */}
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
  );
};
