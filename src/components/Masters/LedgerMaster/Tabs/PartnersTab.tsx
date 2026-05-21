import React, { useState, useMemo } from 'react';
import { ImportExportButtons } from '../../../shared/ImportExportButtons';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../icons/IconComponents';

interface PartnersTabProps {
    data: any[];
    onSave: (items: any[]) => void;
}

export const PartnersTab: React.FC<PartnersTabProps> = ({ data, onSave }) => {
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
                    <input type="text" placeholder="Search Partners..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input pl-10 pr-4 text-sm" />
                </div>
                <div className="flex items-center">
                    <ImportExportButtons data={data} onSave={onSave} entityName="PartnersTab" />
                    <button onClick={() => { 
                        setEditingId(null); 
                        const count = (data || []).length + 1;
                        const nextCode = `PRT-${String(count).padStart(3, '0')}`;
                        setFormData({ name: "", type: "Both", code: nextCode, status: "Active" }); 
                        setIsModalOpen(true); 
                    }} className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                        <AddIcon className="lg:mr-2" /> <span className="hidden lg:inline-block">Add Partner</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Details</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tax Identification</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Balance</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code || '-'}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'P'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</div>
                                                <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mt-0.5 dark:text-indigo-400">Bilateral Partner</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        {m.contactPerson && <div className="font-medium text-gray-800 dark:text-gray-100">{m.contactPerson}</div>}
                                        <div className="text-[11px] text-gray-500 font-mono mt-0.5 dark:text-gray-400">{m.phone || 'No phone'}</div>
                                        {m.email && <div className="text-[11px] text-gray-500 dark:text-gray-400">{m.email}</div>}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="font-mono bg-gray-50 px-2 py-1 rounded inline-block text-[11px] font-bold border border-gray-100 dark:bg-gray-900 dark:border-gray-800">GSTIN: {m.gstin || 'Unregistered'}</div>
                                        {m.panNo && <div className="text-[11px] text-gray-500 uppercase font-mono mt-1 ml-1 dark:text-gray-400">PAN: {m.panNo}</div>}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="font-mono font-medium text-gray-900 dark:text-white">₹{m.openingBalance?.toFixed(2) || '0.00'}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${(m.balanceType === 'Cr' || m.balanceType === 'Credit') ? 'text-green-600' : 'text-red-500'}`}>
                                            {m.balanceType || 'Debit'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => { setEditingId(m.id); setFormData(m); setIsModalOpen(true); }} className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-all active:scale-95" title="Edit"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirmation({ isOpen: true, id: m.id, name: m.name || m.code })} className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-all active:scale-95" title="Delete"><DeleteIcon className="w-4 h-4" /></button>
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
                        <p className="text-gray-500 dark:text-gray-400">No Partners found</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[1.25rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh] dark:bg-gray-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
                            <h2 className="font-bold text-xl text-gray-900 flex items-center dark:text-white">
                                {editingId ? 'Edit' : 'Add'} Partner
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
                            <div className="form-grid gap-4">
                                <div className="form-field-wrapper col-span-1">
                                    <label className="form-label text-xs">Code *</label>
                                    <input type="text" value={formData.code || ""} onChange={e => setFormData({ ...formData, code: e.target.value })} className="form-input bg-white dark:bg-gray-900 font-mono" placeholder="Enter code..." autoFocus />
                                </div>
                                <div className="form-field-wrapper col-span-1">
                                    <label className="form-label">Name *</label>
                                    <input type="text" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Enter name..." />
                                </div>
                                <div className="form-field-wrapper col-span-1 md:col-span-2">
                                    <label className="form-label">Description / Notes</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input" placeholder="Dual purpose customer & vendor details..." />
                                </div>
                                
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Type</label>
                                    <select 
                                        value={formData.type || 'Both'} 
                                        disabled
                                        className="form-input opacity-70 bg-gray-50 dark:bg-gray-900"
                                    >
                                        <option value="Both">Both (Customer & Vendor)</option>
                                    </select>
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">GSTIN</label>
                                    <input type="text" value={formData.gstin || ''} onChange={e => setFormData({ ...formData, gstin: e.target.value })} className="form-input" placeholder="e.g. 27ABCDE1234F1Z5" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">PAN Number</label>
                                    <input type="text" value={formData.panNo || ''} onChange={e => setFormData({ ...formData, panNo: e.target.value })} className="form-input" placeholder="ABCDE1234F" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Contact Person</label>
                                    <input type="text" value={formData.contactPerson || ''} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} className="form-input" placeholder="John Doe" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Phone</label>
                                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="+91..." />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Email</label>
                                    <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="example@email.com" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Address Line</label>
                                    <input type="text" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input" placeholder="Street Address" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">City</label>
                                    <input type="text" value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} className="form-input" placeholder="City" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">State / Region</label>
                                    <input type="text" value={formData.state || ''} onChange={e => setFormData({ ...formData, state: e.target.value })} className="form-input" placeholder="State" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Pincode / ZIP</label>
                                    <input type="text" value={formData.pincode || ''} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="form-input" placeholder="ZIP Code" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Credit Days</label>
                                    <input type="number" value={formData.creditDays || ''} onChange={e => setFormData({ ...formData, creditDays: parseInt(e.target.value) || 0 })} className="form-input" placeholder="30" />
                                </div>
                                <div className="form-field-wrapper">
                                    <label className="form-label dark:text-gray-400">Opening Balance</label>
                                    <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-800 dark:border-gray-700">
                                        <input 
                                            type="number" 
                                            value={formData.openingBalance || ''} 
                                            onChange={e => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })} 
                                            className="w-full p-2 outline-none flex-1 bg-transparent text-gray-900 dark:text-white" 
                                            placeholder="0.00" 
                                        />
                                        <select 
                                            value={formData.balanceType || 'Debit'}
                                            onChange={e => setFormData({ ...formData, balanceType: e.target.value })}
                                            className="w-20 border-l border-gray-200 outline-none px-2 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                                        >
                                            <option value="Debit">Dr</option>
                                            <option value="Credit">Cr</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-field-wrapper col-span-1 md:col-span-2 pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Banking Details</h3>
                                    <div className="form-grid gap-4">
                                        <div className="form-field-wrapper">
                                            <label className="form-label dark:text-gray-400">Bank Name</label>
                                            <input type="text" value={formData.bankName || ''} onChange={e => setFormData({ ...formData, bankName: e.target.value })} className="form-input bg-transparent" placeholder="Bank Name" />
                                        </div>
                                        <div className="form-field-wrapper">
                                            <label className="form-label dark:text-gray-400">Account Number</label>
                                            <input type="text" value={formData.bankAccountNo || ''} onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })} className="form-input bg-transparent" placeholder="Acc No" />
                                        </div>
                                        <div className="form-field-wrapper">
                                            <label className="form-label dark:text-gray-400">IFSC / Swift Code</label>
                                            <input type="text" value={formData.ifscCode || ''} onChange={e => setFormData({ ...formData, ifscCode: e.target.value })} className="form-input bg-transparent" placeholder="IFSC" />
                                        </div>
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
                        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Delete Partner?</h2>
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
