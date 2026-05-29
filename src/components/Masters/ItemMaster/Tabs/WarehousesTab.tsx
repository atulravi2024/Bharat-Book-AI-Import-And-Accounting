import { useLanguage } from '../../../../context/LanguageContext';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useFormSettings } from "../../../../app/useFormSettings";

import { createPortal } from 'react-dom';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../icons/IconComponents';


interface WarehousesTabProps {
    data: any[];
    onSave: (items: any[]) => void;
}

export const WarehousesTab: React.FC<WarehousesTabProps> = ({ data, onSave }) => {
  const { t, formatNumber  } = useLanguage();

  const formSettings = useFormSettings();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

    const filteredData = useMemo(() => {  return (data || []).filter((m: any) => 
            String(m.name || m.code || m.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const handleSave = () => {
        if (!formData.name?.trim() && !formData.code?.trim()) return;
        const newList = editingId 
            ? data.map((m: any) => m.id === editingId ? { ...formData } : m)
            : [...data, { ...formData, id: `${Date.now()}` }];
        onSave(newList);
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({});
    };

    const confirmDelete = () => {
        if (!deleteConfirmation) return;
        onSave(data.filter((m: any) => m.id !== deleteConfirmation.id));
        setDeleteConfirmation(null);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
                <div className="relative max-w-md w-full mr-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder={t("Search Warehouses...")} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-10 pr-4 text-sm" />
                </div>
                <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="WarehousesTab" />
                    <button onClick={() => { setEditingId(null); setFormData({name:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="lg:mr-2" /> <span className="hidden lg:inline-block">{t("Add Warehouse")}</span></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Name")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Code")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Status")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Type")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Location")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Address")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Capacity")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Contact Person")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{t("Phone")}</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">{t("Actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{formData.status === 'Inactive' || m.status === 'Inactive' ? <div className="text-[10px] text-red-500 font-bold mt-1 uppercase">{t("DISABLED")}</div> : <div className="text-[10px] text-green-500 font-bold mt-1 uppercase">{t("ACTIVE")}</div>}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.type && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold dark:bg-purple-900/30 dark:text-purple-300">{m.type}</span>}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.location || '-'}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.address}{m.city ? `, ${m.city}` : ''}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.capacity && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{m.capacity}</span>}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.contactPerson}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.phone}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                                            <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="mx-auto flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95" title={t("Edit")}><Edit2 size={16} className="m-auto" /></button>
                                            <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name||m.code})} className="mx-auto flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95" title={t("Delete")}><Trash2 size={16} className="m-auto" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center flex flex-col justify-center items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
                            <SearchIcon className="text-gray-300 text-3xl" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">{t("No data found matching your search")}</p>
                    </div>
                )}
            </div>

            {isModalOpen && typeof document !== "undefined" && document.getElementById("main-content") ? createPortal(
   <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center ${formSettings.currentModalMode === 'fullscreen' ? 'p-0' : 'p-4 sm:p-6 md:p-8'}`}>
                    <div className={`bg-white w-full h-full overflow-hidden flex flex-col dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl animate-in zoom-in-95 ${formSettings.currentModalMode === 'fullscreen' ? 'rounded-none max-w-full max-h-full' : 'rounded-2xl max-w-5xl max-h-[90vh]'}`}>
                        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
                            <h2 className="font-bold text-base text-gray-900 flex items-center dark:text-white">
                                {editingId ? t('Edit') : t('Add')} {t('Warehouse')}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4">
                            <div className="form-grid gap-4">
                                <div className="form-field-wrapper col-span-1 md:col-span-2">
                                    <label className="form-label">{t("Name / Code *")}</label>
                                    <input type="text" value={formData.name || formData.code || ''} onChange={e => setFormData({...formData, name: e.target.value, code: e.target.value})} className="form-input" placeholder={t("Enter name or code...")} autoFocus />
                                </div>
                                <div className="form-field-wrapper col-span-1 md:col-span-2">
                                    <label className="form-label">{t("Description / Notes")}</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input" placeholder={t("Add any extra details...")} />
                                </div>
                                
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Warehouse Type")}</label>
            <select value={formData.type || 'Main'} onChange={e => setFormData({...formData, type: e.target.value})} className="form-input">
                <option value="Main">{t("Main Warehouse")}</option>
                <option value="Store">{t("Retail Store")}</option>
                <option value="Distribution">{t("Distribution Center")}</option>
                <option value="Transit">{t("In-Transit / Virtual")}</option>
            </select>
        </div>
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Location Name")}</label><input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="form-input bg-transparent" placeholder={t("e.g. North Wing")} /></div>
        
        <div className="form-field-wrapper col-span-1 md:col-span-2">
            <label className="form-label dark:text-gray-400">{t("Address Line")}</label>
            <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="form-input bg-transparent" placeholder={t("Street Address...")} />
        </div>
        
        <div className="form-field-wrapper form-grid gap-4 col-span-1 md:col-span-2">
            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("City")}</label><input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="form-input bg-transparent" placeholder={t("City")} /></div>
            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("State")}</label><input type="text" value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} className="form-input bg-transparent" placeholder={t("State")} /></div>
            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Pincode")}</label><input type="text" value={formData.pincode || ''} onChange={e => setFormData({...formData, pincode: e.target.value})} className="form-input bg-transparent" placeholder={t("Pincode")} /></div>
        </div>

        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Capacity")}</label><input type="number" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseFloat(e.target.value)})} className="form-input bg-transparent" placeholder={t("e.g. 5000")} /></div>
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Contact Person")}</label><input type="text" value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="form-input bg-transparent" placeholder={t("Name...")} /></div>
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Phone")}</label><input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="form-input bg-transparent" placeholder={t("Phone...")} /></div>
        
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">{t("Status")}</label>
            <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="form-input">
                <option value="Active">{t("Enable (Active)")}</option>
                <option value="Inactive">{t("Disable (Inactive)")}</option>
            </select>
        </div>
    
                            </div>
                        </div>

                        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800">
                             <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">{t("Cancel")}</button>
                             <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition">{t("Save Changes")}</button>
                        </div>
                    </div>
                </div>
            , document.getElementById("main-content")!) : null}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 dark:bg-gray-800">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <DeleteIcon className="text-3xl" />
                        </div>
                        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{t("Delete Warehouse?")}</h2>
                        <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">{t("Are you sure you want to delete")} "{deleteConfirmation.name}"?</p>
                        <div className="flex space-x-3">
                             <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">{t("Cancel")}</button>
                             <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition">{t("Delete")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
