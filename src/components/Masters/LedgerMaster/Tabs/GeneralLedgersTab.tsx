import React, { useState, useMemo } from 'react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../icons/IconComponents';

interface GeneralLedgersTabProps {
    data: any[];
    onSave: (items: any[]) => void;
}

export const GeneralLedgersTab: React.FC<GeneralLedgersTabProps> = ({ data, onSave }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

    const filteredData = useMemo(() => {
        return (data || []).filter((m: any) => 
            String(m.name || m.code || m.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const handleSave = () => {
        if (!formData.name?.trim() && !formData.code?.trim()) return;
        const newList = editingId 
            ? data.map((m: any) => m.id === editingId ? { ...formData } : m)
            : [...data, { ...formData, id: `item-${Date.now()}` }];
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
                    <input type="text" placeholder="Search General Ledgers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={() => { setEditingId(null); setFormData(
                    {name: ""}
                ); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-bold flex items-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="sm:mr-2" /> <span className="hidden sm:inline-block">Add General Ledger
                </span></button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ledger Group</th>
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Balance</th>
    
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
        {m.group && <div className="text-[11px] text-gray-500 mt-0.5 dark:text-gray-400">{m.group}</div>}
    
                                            </div>
                                        </div>
                                    </td>
                                    
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <span className="px-2 py-1 bg-gray-50 rounded-md text-[10px] font-bold uppercase tracking-wide text-gray-600 border border-gray-200 shadow-sm dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700">{m.group || 'N/A'}</span>
        </td>
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="font-mono font-medium text-gray-900 dark:text-white">₹{m.openingBalance?.toFixed(2) || '0.00'}</div>
            <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${(m.balanceType === 'Cr' || m.balanceType === 'Credit') ? 'text-green-600' : 'text-red-500'}`}>
                {m.balanceType || 'Debit'}
            </div>
        </td>
    
                                    <td className="p-4">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95" title="Edit"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name||m.code})} className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95" title="Delete"><DeleteIcon className="w-4 h-4" /></button>
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
                                {editingId ? 'Edit' : 'Add'} General Ledger
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name / Code *</label>
                                    <input type="text" value={formData.name || formData.code || ''} onChange={e => setFormData({...formData, name: e.target.value, code: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="Enter name or code..." autoFocus />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Notes</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="Add any extra details..." />
                                </div>
                                
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Group</label>
            <select 
                value={formData.group || ''}
                onChange={e => setFormData({ ...formData, group: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
                <optgroup label="Assets">
                    <option value="Bank Accounts">Bank Accounts</option>
                    <option value="Cash-in-Hand">Cash-in-Hand</option>
                    <option value="Sundry Debtors">Sundry Debtors</option>
                    <option value="Fixed Assets">Fixed Assets</option>
                    <option value="Current Assets">Current Assets</option>
                </optgroup>
                <optgroup label="Liabilities">
                    <option value="Sundry Creditors">Sundry Creditors</option>
                    <option value="Duties & Taxes">Duties & Taxes</option>
                    <option value="Current Liabilities">Current Liabilities</option>
                    <option value="Capital Account">Capital Account</option>
                    <option value="Loans (Liability)">Loans (Liability)</option>
                </optgroup>
                <optgroup label="Income & Expenses">
                    <option value="Sales Accounts">Sales Accounts</option>
                    <option value="Purchase Accounts">Purchase Accounts</option>
                    <option value="Direct Incomes">Direct Incomes</option>
                    <option value="Direct Expenses">Direct Expenses</option>
                    <option value="Indirect Incomes">Indirect Incomes</option>
                    <option value="Indirect Expenses">Indirect Expenses</option>
                </optgroup>
            </select>
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Opening Balance</label>
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-800 dark:border-gray-700">
                <input 
                    type="number" 
                    value={formData.openingBalance || ''} 
                    onChange={e => setFormData({...formData, openingBalance: parseFloat(e.target.value) || 0})} 
                    className="w-full p-2 outline-none flex-1 bg-transparent text-gray-900 dark:text-white" 
                    placeholder="0.00" 
                />
                <select 
                    value={formData.balanceType || 'Debit'}
                    onChange={e => setFormData({...formData, balanceType: e.target.value})}
                    className="w-20 border-l border-gray-200 outline-none px-2 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                >
                    <option value="Debit">Dr</option>
                    <option value="Credit">Cr</option>
                </select>
            </div>
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
                        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Delete General Ledger?</h2>
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
