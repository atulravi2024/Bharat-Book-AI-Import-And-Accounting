import { useLanguage } from '../../../../context/LanguageContext';
import React from 'react';
import { SearchIcon, AddIcon, DeleteIcon, EditIcon } from '../../../icons/IconComponents';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { Edit2, Trash2 } from 'lucide-react';
import { HorizontalScrollArea } from '../../../shared/HorizontalScrollArea';

export const AllContactsTab = ({
  searchTerm, setSearchTerm, allContactsCombined, filteredAllContacts, 
  setIsModalOpen, setEditingId, setFormData, setDeleteConfirmation, 
  renderClassificationBadge, renderDetailsCell
}: any) => {
  const { t, formatNumber  } = useLanguage();

  return (
    <>
      {/* ALL Contacts Unified View */}
      
        <>
          <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
            <div className="relative max-w-md w-full mr-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("Search all staff, customers, vendors, and partners...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-4 text-sm"
              />
            </div>
            <div className="flex items-center">
              <ImportExportButtons
                data={allContactsCombined}
                onSave={() => {}}
                entityName="AllContactsCombined"
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
                <span className="hidden lg:inline-block">{t("Add Contact")}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
            {filteredAllContacts.length > 0 ? (
              <HorizontalScrollArea className="w-full">
                <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("Code")}</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("Name")}</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("Classification")}</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("Details / Description")}</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                  {filteredAllContacts.map((m: any) => (
                    <tr
                      key={m.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">
                        {m.code || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm ring-1 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-900/50">
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
                              "C"
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">
                              {m.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {renderClassificationBadge(m)}
                      </td>
                      <td className="p-4">{renderDetailsCell(m)}</td>
                      <td className="p-4 align-middle">
                                        <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                                            <button
                            onClick={() => {
                              setEditingId(m.id);
                              const isStaff = m.unifiedType === "Staff";
                              setFormData({
                                ...m,
                                unifiedType: m.unifiedType,
                                contactType: m.contactType || "Internal",
                                type:
                                  m.type ||
                                  (m.unifiedType === "Partner"
                                    ? "Both"
                                    : m.unifiedType),
                                streetAddress:
                                  m.streetAddress ||
                                  (isStaff ? m.address || "" : ""),
                                district: m.district || "",
                                city: m.city || (isStaff ? "" : m.city || ""),
                                state:
                                  m.state || (isStaff ? "" : m.state || ""),
                                country: m.country || "",
                                zipCode:
                                  m.zipCode || (isStaff ? "" : m.pincode || ""),
                              });
                              setIsModalOpen(true);
                            }}
                            className="mx-auto flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95"
                            title={t("Edit")}
                          >
                            <Edit2 size={16} className="m-auto" />
                          </button>
                                            <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                id: m.id,
                                name: m.name || m.code,
                                type: m.unifiedType,
                              })
                            }
                            className="mx-auto flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95"
                            title={t("Delete")}
                          >
                            <Trash2 size={16} className="m-auto" />
                          </button>
                                        </div>
                                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </HorizontalScrollArea>
            ) : (
              <div className="p-12 text-center flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
                  <SearchIcon className="text-gray-300 text-3xl" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">{t("No contacts found")}</p>
              </div>
            )}
          </div>
        </>
</>
  );
};
