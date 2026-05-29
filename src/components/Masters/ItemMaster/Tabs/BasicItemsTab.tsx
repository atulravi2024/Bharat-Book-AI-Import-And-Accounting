import React, { useState, useMemo } from 'react';
import { useFormSettings } from "../../../../app/useFormSettings";

import { createPortal } from 'react-dom';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../icons/IconComponents';
import { Edit2, Trash2 } from 'lucide-react';


interface BasicItemsTabProps {
    data: any[];
    onSave: (items: any[]) => void;
    uomMasters?: any[];
    categoryMasters?: any[];
}

export const BasicItemsTab: React.FC<BasicItemsTabProps> = ({ data, onSave, uomMasters = [], categoryMasters = [] }) => {
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
        if (!formData.name?.trim()) return;
        const newList = editingId 
            ? data.map((m: any) => m.id === editingId ? { ...formData } : m)
            : [...data, { ...formData, id: `ITM-${Date.now()}` }];
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
                    <input type="text" placeholder="Search Basic Items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-10 pr-4 text-sm" />
                </div>
                <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="BasicItemsTab" />
                    <button onClick={() => { setEditingId(null); setFormData({name:'', uom: '', code: ''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="lg:mr-2" /> <span className="hidden lg:inline-block">Add Item
                </span></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Category</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">UOM</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Price</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code || '-'}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200"><span className="bg-gray-100 px-2 py-1 rounded text-xs dark:bg-gray-800">{m.category || '-'}</span></td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.uom || '-'}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.price || m.salesRate ? `₹${m.price || m.salesRate}` : '-'}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                        {m.status === 'Active' || !m.status ? (
                                            <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold text-[10px] uppercase">Active</span>
                                        ) : (
                                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold text-[10px] uppercase">Inactive</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center justify-center space-x-2 w-full h-full m-auto">
                                            <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95 mx-auto" title="Edit">
                                                <Edit2 size={16} className="m-auto" />
                                            </button>
                                            <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name||m.code})} className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95 mx-auto" title="Delete">
                                                <Trash2 size={16} className="m-auto" />
                                            </button>
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
                        <p className="text-gray-500 dark:text-gray-400">No data found matching your search</p>
                    </div>
                )}
            </div>

            {isModalOpen && typeof document !== "undefined" && document.getElementById("main-content") ? createPortal(
   <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center ${formSettings.currentModalMode === 'fullscreen' ? 'p-0' : 'p-4 sm:p-6 md:p-8'}`}>
                    <div className={`bg-white w-full h-full overflow-hidden flex flex-col dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl animate-in zoom-in-95 ${formSettings.currentModalMode === 'fullscreen' ? 'rounded-none max-w-full max-h-full' : 'rounded-2xl max-w-5xl max-h-[90vh]'}`}>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-900 font-display tracking-tight dark:text-white">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><CancelIcon /></button>
                        </div>
                        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col space-y-4">
                            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Name *</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input bg-transparent font-sans text-sm" placeholder="e.g. Premium Widget" /></div>
                            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Code</label><input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="form-input bg-transparent font-mono text-sm uppercase" placeholder="e.g. WDG-001" /></div>
                            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Category</label>
                                <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="form-input font-sans text-sm">
                                    <option value="">Select Category...</option>
                                    {categoryMasters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">UOM</label>
                                <select value={formData.uom || ''} onChange={e => setFormData({...formData, uom: e.target.value})} className="form-input font-sans text-sm">
                                    <option value="">Select UOM...</option>
                                    {uomMasters.map(u => <option key={u.id} value={u.name}>{u.name} ({u.symbol || u.code})</option>)}
                                </select>
                            </div>
                            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Price / Sales Rate</label><input type="number" value={formData.price || formData.salesRate || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="form-input bg-transparent font-mono text-sm" placeholder="0.00" /></div>
                            <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Status</label>
                                <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="form-input font-sans text-sm">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-800">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={!formData.name?.trim()} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors">Save Item</button>
                        </div>
                    </div>
                </div>
            , document.getElementById("main-content")!) : null}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col dark:bg-gray-900 border border-red-100 dark:border-red-900/30 zoom-in-95 duration-200">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 dark:bg-red-500/10"><DeleteIcon className="w-8 h-8" /></div>
                            <h2 className="text-xl font-bold text-gray-900 font-display mb-2 dark:text-white">Delete Item?</h2>
                            <p className="text-gray-500 text-sm mb-6 dark:text-gray-400">Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">{deleteConfirmation.name}</span>? This action cannot be undone.</p>
                            <div className="flex w-full space-x-3">
                                <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md shadow-red-500/20 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
