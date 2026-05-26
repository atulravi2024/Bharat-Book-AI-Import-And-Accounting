import React from 'react';
import { SearchIcon, AddIcon, DeleteIcon, EditIcon } from '../../../icons/IconComponents';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { Edit2, Trash2 } from 'lucide-react';

export const StaffTab = ({
  searchTerm, setSearchTerm, data, filteredStaffData, onSave, 
  setIsModalOpen, setEditingId, setFormData, setDeleteConfirmation, 
  renderClassificationBadge, renderDetailsCell
}: any) => {
  return (
    <>
      <>
          <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
            <div className="relative max-w-md w-full mr-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Staff (Internal Contacts)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-4 text-sm"
              />
            </div>
            <div className="flex items-center">
              <ImportExportButtons
                data={data}
                onSave={onSave}
                entityName="ContactsTab"
              />
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    code: "",
                    unifiedType: "Staff",
                    contactType: "Internal",
                  });
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all"
              >
                <AddIcon className="lg:mr-2" />
                <span className="hidden lg:inline-block">Add Staff</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
            {filteredStaffData.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Code
                    </th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Staff Member
                    </th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Role & Department
                    </th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Contact Info
                    </th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Status & Joining
                    </th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Duties / Description
                    </th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                  {filteredStaffData.map((m: any) => {
                    const isActive = m.status !== "Inactive";
                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <td className="p-4 whitespace-nowrap text-xs text-gray-700 dark:text-gray-200 font-mono font-semibold">
                          {m.code || "-"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-9 h-9 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm ring-1 ring-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-900/50">
                              {m.photoUrl ? (
                                <img
                                  src={m.photoUrl}
                                  alt={m.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                m.name?.[0]?.toUpperCase() ||
                                m.code?.[0]?.toUpperCase() ||
                                "S"
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">
                                {m.name}
                              </div>
                              <div className="flex items-center space-x-1.5 mt-0.5 whitespace-nowrap">
                                <span className="text-[10px] text-gray-400 font-medium font-mono">
                                  Joined: {m.dateOfJoining || "N/A"}
                                </span>
                                {m.gender && (
                                  <span
                                    className={`px-1 py-0.5 border rounded text-[9px] font-bold flex items-center gap-0.5 ${
                                      m.gender === "Female"
                                        ? "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/50"
                                        : "bg-indigo-50 text-indigo-700 border-indigo-150 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-950/30"
                                    }`}
                                  >
                                    👤 {m.gender}
                                  </span>
                                )}
                                {m.bloodGroup && (
                                  <span className="px-1 py-0.5 bg-red-50 text-rose-700 border border-red-100 rounded text-[9px] font-bold flex items-center gap-0.5 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50">
                                    🩸 {m.bloodGroup}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-bold text-gray-800 dark:text-gray-100">
                              {m.designation || "Staff Associate"}
                            </div>
                            <div className="text-[11px] text-gray-500 font-medium">
                              {m.department || "General Operations"}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs">
                            {m.email && (
                              <div className="text-gray-700 dark:text-gray-300 font-medium">
                                {m.email}
                              </div>
                            )}
                            {m.phone && (
                              <div className="text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                                {m.phone}
                              </div>
                            )}

                            {(m.aadhaarCard ||
                              m.panCard ||
                              m.voterIdCard ||
                              m.drivingLicense) && (
                              <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-gray-100 dark:border-gray-800">
                                {m.aadhaarCard && (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[9px] font-mono dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                                    title="Aadhaar Card"
                                  >
                                    🆔 {m.aadhaarCard}
                                  </span>
                                )}
                                {m.panCard && (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-mono dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-800"
                                    title="PAN Card"
                                  >
                                    💳 {m.panCard}
                                  </span>
                                )}
                                {m.voterIdCard && (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[9px] font-mono dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800"
                                    title="Voter ID Card"
                                  >
                                    🗳️ {m.voterIdCard}
                                  </span>
                                )}
                                {m.drivingLicense && (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-mono dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                    title="Driving License"
                                  >
                                    🚗 {m.drivingLicense}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-bold rounded-md w-max border ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800"
                              }`}
                            >
                              {isActive ? "ACTIVE / WORKING" : "RESIGNED"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {m.contactType === "Contract"
                                ? "Contractor"
                                : "Full-time"}
                            </span>
                            {!isActive && m.resignationDate && (
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium font-mono">
                                Left: {m.resignationDate}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div
                            className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate"
                            title={m.description || m.notes || "-"}
                          >
                            {m.description || m.notes || "-"}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                                        <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                                            <button
                              onClick={() => {
                                setEditingId(m.id);
                                setFormData({
                                  ...m,
                                  unifiedType: "Staff",
                                  contactType: m.contactType || "Internal",
                                  streetAddress:
                                    m.streetAddress || m.address || "",
                                  district: m.district || "",
                                  city: m.city || "",
                                  state: m.state || "",
                                  country: m.country || "",
                                  zipCode: m.zipCode || m.pincode || "",
                                });
                                setIsModalOpen(true);
                              }}
                              className="mx-auto flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95"
                              title="Edit"
                            >
                              <Edit2 size={16} className="m-auto" />
                            </button>
                                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  id: m.id,
                                  name: m.name || m.code,
                                  type: "Staff",
                                })
                              }
                              className="mx-auto flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95"
                              title="Delete"
                            >
                              <Trash2 size={16} className="m-auto" />
                            </button>
                                        </div>
                                    </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
                  <SearchIcon className="text-gray-300 text-3xl" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No staff found in this sub-page
                </p>
              </div>
            )}
          </div>
        </>
</>
  );
};
