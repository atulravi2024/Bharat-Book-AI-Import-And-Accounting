import React, { useState, useMemo } from 'react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../icons/IconComponents';

interface PriceListTabProps {
    data: any[];
    onSave: (items: any[]) => void;
}

export const PriceListTab: React.FC<PriceListTabProps> = ({ data, onSave }) => {
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
                    <input type="text" placeholder="Search Price List..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={() => { setEditingId(null); setFormData({name:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-bold flex items-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="sm:mr-2" /> <span className="hidden sm:inline-block">Add Price List
                </span></button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Description / Type</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Currency</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Default</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Industry</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Group</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Valid From</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Valid To</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Base List</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Adjustment</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.status === 'Active' ? (
                <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold text-[10px] uppercase">Active</span>
            ) : m.status === 'Draft' ? (
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold text-[10px] uppercase">Draft</span>
            ) : m.status === 'Inactive' ? (
                <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[10px] uppercase">Inactive</span>
            ) : null}
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.description || m.type || 'Sales'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.currency && <span className="font-mono text-[10px] uppercase font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">{m.currency}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.isDefault && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Yes</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.industry && <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">{m.industry}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.applicableGroup && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">{m.applicableGroup}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.validFrom || '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.validTo || '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.basePriceList ? (data?.find(p=>p.id === m.basePriceList)?.name || 'Base') : '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.basePriceList && m.adjustmentType !== 'None' && m.adjustmentValue ? (
                <span className={`font-bold inline-flex items-center px-1.5 py-0.5 rounded ${m.adjustmentValue > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {m.adjustmentValue > 0 ? '+' : ''}{m.adjustmentValue}{m.adjustmentType === 'Percentage' ? '%' : ` ${m.currency || ''}`}
                </span>
            ) : m.basePriceList ? (
                <span className="text-gray-400 font-medium italic">Exact Match</span>
            ) : (
                <span className="text-gray-400 font-medium italic">-</span>
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
                                {editingId ? 'Edit' : 'Add'} Price List
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name / Code *</label>
                                    <input type="text" value={formData.name || formData.code || ''} onChange={e => setFormData({...formData, name: e.target.value, code: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="Enter Price List Name..." autoFocus />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Type</label>
                                    <select value={formData.type || 'Sales'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white">
                                        <option value="Sales">Sales (Selling Price)</option>
                                        <option value="Purchase">Purchase (Buying Price)</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Currency</label>
                                    <input type="text" value={formData.currency || 'INR'} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="e.g. INR, USD..." />
                                </div>
                                
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Notes</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="Add any extra details..." />
                                </div>

                                {/* Applicability Section */}
                                <div className="col-span-1 md:col-span-2 mt-4 mb-2">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700 text-sm">Applicability & Validity</h4>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Industry / Domain Focus</label>
                                    <select value={formData.industry || 'General'} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white">
                                        <option value="General">General Business / Standard</option>
                                        <option value="Healthcare">Healthcare (Doctors, Clinics, IPD/OPD)</option>
                                        <option value="Retail">Retail (Clothes, Bartan, Walk-ins)</option>
                                        <option value="Wholesale">Wholesale & Distribution (B2B)</option>
                                        <option value="Ecommerce">E-Commerce & Online Stores</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Customer/Supplier Group</label>
                                    <input list="customerGroups" type="text" value={formData.applicableGroup || ''} onChange={e => setFormData({...formData, applicableGroup: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="e.g. Retail, B2B, OPD..." />
                                    <datalist id="customerGroups">
                                        <option value="Retail Customers" />
                                        <option value="B2B / Wholesalers" />
                                        <option value="Dealers / Distributors" />
                                        <option value="E-Commerce / Online" />
                                        <option value="Patients (OPD)" />
                                        <option value="Patients (IPD)" />
                                        <option value="Insurance Panels" />
                                        <option value="VIP / Members" />
                                        <option value="Corporate / Institutional" />
                                    </datalist>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Valid From</label>
                                    <input type="date" value={formData.validFrom || ''} onChange={e => setFormData({...formData, validFrom: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Valid To</label>
                                    <input type="date" value={formData.validTo || ''} onChange={e => setFormData({...formData, validTo: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Status</label>
                                    <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white">
                                        <option value="Active">Active</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Pricing Strategy Section */}
                                <div className="col-span-1 md:col-span-2 mt-4 mb-2">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700 text-sm">Pricing Calculation Rules</h4>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Base Price List</label>
                                    <select value={formData.basePriceList || ''} onChange={e => setFormData({...formData, basePriceList: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white">
                                        <option value="">None (Standalone)</option>
                                        {data?.map((pl: any) => pl.id !== formData.id && (
                                            <option key={pl.id} value={pl.id}>{pl.name || pl.code}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Adjustment Type</label>
                                    <select value={formData.adjustmentType || 'None'} onChange={e => setFormData({...formData, adjustmentType: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" disabled={!formData.basePriceList}>
                                        <option value="None">No Adjustment</option>
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Amount">Fixed Amount</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Adjustment Value (+/-)</label>
                                    <input type="number" value={formData.adjustmentValue || ''} onChange={e => setFormData({...formData, adjustmentValue: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="e.g. -10 for 10% discount" disabled={!formData.basePriceList || formData.adjustmentType === 'None'} />
                                </div>
                                
                                <div className="col-span-1 flex flex-col justify-end pb-2">
                                    <label className="flex items-center space-x-2 cursor-pointer p-2 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                                        <input type="checkbox" checked={formData.isDefault || false} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 bg-transparent" />
                                        <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Set as Default Price List</span>
                                    </label>
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
                        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Delete Price List?</h2>
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
