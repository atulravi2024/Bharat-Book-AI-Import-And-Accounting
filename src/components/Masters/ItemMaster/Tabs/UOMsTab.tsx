import React, { useState, useMemo } from 'react';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../icons/IconComponents';


interface UOMsTabProps {
    data: any[];
    onSave: (items: any[]) => void;
}

export const UOMsTab: React.FC<UOMsTabProps> = ({ data, onSave }) => {
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
                    <input type="text" placeholder="Search UOMs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-10 pr-4 text-sm" />
                </div>
                <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="UOMsTab" />
                    <button onClick={() => { setEditingId(null); setFormData({name:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="lg:mr-2" /> <span className="hidden lg:inline-block">Add UOM
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
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Symbol</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Conversion</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono"><span className="bg-gray-100 px-2 py-1 rounded text-xs dark:bg-gray-800">{m.symbol || '-'}</span></td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.baseUom ? (
                <div className="text-xs">
                    <span className="font-bold">1 {m.symbol || m.name}</span> = <span className="text-blue-600 font-bold dark:text-blue-400">{m.conversionFactor || 1} {m.baseUom}</span>
                </div>
            ) : (
                <span className="text-xs text-gray-400 italic">Base Unit</span>
            )}
        </td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.status === 'Active' || !m.status ? (
                <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold text-[10px] uppercase">Active</span>
            ) : (
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold text-[10px] uppercase">Inactive</span>
            )}
        </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95" title="Edit"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name||m.code})} className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95" title="Delete"><DeleteIcon className="w-4 h-4" /></button>
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[1.25rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh] dark:bg-gray-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
                            <h2 className="font-bold text-xl text-gray-900 flex items-center dark:text-white">
                                {editingId ? 'Edit' : 'Add'} UOM
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4">
                            <div className="form-grid gap-4">
                                <div className="form-field-wrapper col-span-1">
<label className="form-label">Code *</label>
<input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="form-input bg-transparent font-mono" placeholder="Enter code..." autoFocus />
</div>
<div className="form-field-wrapper col-span-1">
<label className="form-label">Name *</label>
<input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" placeholder="Enter name..." />
</div>
                                <div className="form-field-wrapper col-span-1 md:col-span-2">
                                    <label className="form-label">Description / Notes</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input" placeholder="Add any extra details..." />
                                </div>
                                
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Symbol</label>
            <input type="text" value={formData.symbol || ''} onChange={e => setFormData({...formData, symbol: e.target.value})} className="form-input bg-transparent" placeholder="e.g. KG, PCS..." />
        </div>
        
        <div className="form-field-wrapper col-span-1 md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Unit Conversion</h3>
            <p className="text-xs text-gray-500 mb-4">Set this if this unit is a multiple or fraction of another base unit (e.g., 1 Box = 10 Pcs).</p>
            <div className="form-grid gap-4">
                <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Base UOM</label>
                    <select value={formData.baseUom || ''} onChange={e => setFormData({...formData, baseUom: e.target.value})} className="form-input">
                        <option value="">None (This is a Base Unit)</option>
                        {data.filter(u => u.id !== editingId).map((u: any) => (
                            <option key={u.id} value={u.symbol || u.name}>{u.name} {u.symbol ? `(${u.symbol})` : ''}</option>
                        ))}
                    </select>
                </div>
                {formData.baseUom && (
                    <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Conversion Factor</label>
                        <div className="flex items-center">
                            <span className="text-sm font-medium mr-2 whitespace-nowrap">1 {formData.symbol || formData.name || 'Unit'} =</span>
                            <input type="number" value={formData.conversionFactor || ''} onChange={e => setFormData({...formData, conversionFactor: parseFloat(e.target.value)})} className="form-input w-24 bg-transparent text-center font-bold" placeholder="1.0" />
                            <span className="text-sm font-medium ml-2">{formData.baseUom}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    
                            
        <div className="form-field-wrapper">
<label className="form-label dark:text-gray-400">Status</label>
            <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="form-input bg-white dark:bg-gray-800">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>

</div>
                        </div>

                        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800">
                             <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">Cancel</button>
                             <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 dark:bg-gray-800">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <DeleteIcon className="text-3xl" />
                        </div>
                        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Delete UOM?</h2>
                        <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">Are you sure you want to delete "{deleteConfirmation.name}"?</p>
                        <div className="flex space-x-3">
                             <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">Cancel</button>
                             <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
