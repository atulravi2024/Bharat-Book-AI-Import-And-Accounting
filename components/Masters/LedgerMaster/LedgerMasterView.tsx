
import React, { useState, useMemo, useEffect } from 'react';
import { 
    MastersIcon, 
    AddIcon, 
    EditIcon, 
    DeleteIcon, 
    SearchIcon, 
    CancelIcon,
    VouchersIcon,
    FilterListIcon,
    SortIcon,
    ExpandMoreIcon,
    BrandIcon,
    CategoryIcon,
    BankIcon,
    WarningIcon
} from '../../icons/IconComponents';
import { 
    PartyMaster, 
    LedgerMaster, 
    ContactMaster,
    WarehouseMaster,
    CostCenterMaster,
    AccountGroupMaster
} from '../../../types';

interface LedgerMasterViewProps {
  initialTab?: 'parties' | 'vendors' | 'banks' | 'ledgers' | 'contacts' | 'warehouses' | 'costCenters' | 'accountGroups';
  partyMasters: PartyMaster[];
  ledgerMasters: LedgerMaster[];
  contactMasters: ContactMaster[];
  warehouseMasters: WarehouseMaster[];
  costCenterMasters: CostCenterMaster[];
  accountGroupMasters: AccountGroupMaster[];
  setPartyMasters: (masters: PartyMaster[]) => void;
  setLedgerMasters: (masters: LedgerMaster[]) => void;
  setContactMasters: (masters: ContactMaster[]) => void;
  setWarehouseMasters: (masters: WarehouseMaster[]) => void;
  setCostCenterMasters: (masters: CostCenterMaster[]) => void;
  setAccountGroupMasters: (masters: AccountGroupMaster[]) => void;
}

type MasterTab = 'parties' | 'vendors' | 'banks' | 'ledgers' | 'contacts' | 'warehouses' | 'costCenters' | 'accountGroups';

export const LedgerMasterView: React.FC<LedgerMasterViewProps> = ({
  partyMasters,
  ledgerMasters,
  contactMasters,
  warehouseMasters,
  costCenterMasters,
  accountGroupMasters,
  setPartyMasters,
  setLedgerMasters,
  setContactMasters,
  setWarehouseMasters,
  setCostCenterMasters,
  setAccountGroupMasters,
  initialTab
}) => {
    const [activeTab, setActiveTab] = useState<MasterTab>(initialTab || 'parties');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

    useEffect(() => {
        if (initialTab && initialTab !== activeTab) setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        const scrollToTab = () => {
            const el = document.getElementById(`ledger-master-tab-${activeTab}`);
            const container = el?.closest('.overflow-x-auto') as HTMLElement;
            if (el && container) {
                const cRect = container.getBoundingClientRect();
                const eRect = el.getBoundingClientRect();
                if (cRect.width === 0 || eRect.width === 0) return;
                
                const offset = (eRect.left + eRect.width / 2) - (cRect.left + cRect.width / 2);
                
                if (Math.abs(offset) > 2) {
                    container.scrollBy({ left: offset, behavior: 'smooth' });
                }
            }
        };

        scrollToTab();
        const t1 = setTimeout(scrollToTab, 100);
        const t2 = setTimeout(scrollToTab, 300);
        const t3 = setTimeout(scrollToTab, 500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [activeTab]);

    const filteredMasters = useMemo(() => {
        let rawList: any[] = [];
        if (activeTab === 'parties') rawList = (partyMasters || []).filter(m => m.type !== 'Vendor');
        else if (activeTab === 'vendors') rawList = (partyMasters || []).filter(m => m.type === 'Vendor');
        else if (activeTab === 'banks') rawList = (ledgerMasters || []).filter(m => m.group?.toLowerCase().includes('bank'));
        else if (activeTab === 'ledgers') rawList = (ledgerMasters || []).filter(m => !m.group?.toLowerCase().includes('bank'));
        else if (activeTab === 'contacts') rawList = contactMasters || [];
        else if (activeTab === 'warehouses') rawList = warehouseMasters || [];
        else if (activeTab === 'costCenters') rawList = costCenterMasters || [];
        else if (activeTab === 'accountGroups') rawList = accountGroupMasters || [];

        return rawList.filter(m => 
            String(m.name || m.code || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeTab, partyMasters, ledgerMasters, contactMasters, warehouseMasters, costCenterMasters, accountGroupMasters, searchTerm]);

    const openAddModal = () => {
        setEditingId(null);
        if (activeTab === 'parties') setFormData({ name: '', type: 'Customer' });
        else if (activeTab === 'vendors') setFormData({ name: '', type: 'Vendor' });
        else if (activeTab === 'banks') setFormData({ name: '', group: 'Bank Accounts' });
        else if (activeTab === 'ledgers') setFormData({ name: '', group: 'Indirect Expenses' });
        else setFormData({ name: '' });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name?.trim()) return;

        const updateList = (prev: any[], prefix: string, setter: (list: any[]) => void) => {
            const newList = editingId 
                ? prev.map(m => m.id === editingId ? { ...formData } : m)
                : [...prev, { ...formData, id: `${prefix}-${Date.now()}` }];
            setter(newList);
        };

        if (activeTab === 'parties' || activeTab === 'vendors') updateList(partyMasters, 'p', setPartyMasters);
        else if (activeTab === 'ledgers' || activeTab === 'banks') updateList(ledgerMasters, 'l', setLedgerMasters);
        else if (activeTab === 'contacts') updateList(contactMasters, 'c', setContactMasters);
        else if (activeTab === 'warehouses') updateList(warehouseMasters, 'w', setWarehouseMasters);
        else if (activeTab === 'costCenters') updateList(costCenterMasters, 'cc', setCostCenterMasters);
        else if (activeTab === 'accountGroups') updateList(accountGroupMasters, 'ag', setAccountGroupMasters);

        setIsModalOpen(false);
        setEditingId(null);
        setFormData({});
    };

    const confirmDelete = () => {
        if (!deleteConfirmation) return;
        const { id } = deleteConfirmation;
        const filterFn = (prev: any[]) => prev.filter(m => m.id !== id);

        if (activeTab === 'parties' || activeTab === 'vendors') setPartyMasters(filterFn(partyMasters));
        else if (activeTab === 'ledgers' || activeTab === 'banks') setLedgerMasters(filterFn(ledgerMasters));
        else if (activeTab === 'contacts') setContactMasters(filterFn(contactMasters));
        else if (activeTab === 'warehouses') setWarehouseMasters(filterFn(warehouseMasters));
        else if (activeTab === 'costCenters') setCostCenterMasters(filterFn(costCenterMasters));
        else if (activeTab === 'accountGroups') setAccountGroupMasters(filterFn(accountGroupMasters));
        
        setDeleteConfirmation(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto scrollbar-none justify-between items-center pr-4">
                    <div className="flex">
                        {[
                            { id: 'parties', label: 'Customers' },
                            { id: 'vendors', label: 'Vendors' },
                            { id: 'ledgers', label: 'General Ledgers' },
                            { id: 'banks', label: 'Bank Masters' },
                            { id: 'contacts', label: 'Contacts' },
                            { id: 'accountGroups', label: 'Groups' },
                            { id: 'warehouses', label: 'Locations' },
                            { id: 'costCenters', label: 'Cost Centers' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                id={`ledger-master-tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id as MasterTab)}
                                className={`px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center text-xs whitespace-nowrap"
                    >
                        <AddIcon className="mr-2" /> Add {activeTab.slice(0, -1)}
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/30">
                    <div className="relative flex-1 max-w-md">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Search in ${activeTab}...`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {filteredMasters.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / details</th>
                                    {(activeTab === 'parties' || activeTab === 'vendors') && (
                                        <>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Details</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tax Identification</th>
                                        </>
                                    )}
                                    {(activeTab === 'ledgers' || activeTab === 'banks') && (
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ledger Group</th>
                                    )}
                                    {activeTab === 'banks' && (
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Configuration</th>
                                    )}
                                    {(activeTab === 'ledgers' || activeTab === 'banks' || activeTab === 'parties' || activeTab === 'vendors') && (
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Balance</th>
                                    )}
                                    {(!(activeTab === 'parties' || activeTab === 'vendors' || activeTab === 'ledgers' || activeTab === 'banks')) && (
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>
                                    )}
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredMasters.map((m: any) => (
                                    <tr key={m.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                    {m.name?.[0]?.toUpperCase() || 'M'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm font-sans">{m.name}</div>
                                                    {(activeTab === 'parties' || activeTab === 'vendors') && <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">{m.type || 'Customer'}</div>}
                                                    {(!(activeTab === 'parties' || activeTab === 'vendors' || activeTab === 'ledgers' || activeTab === 'banks')) && m.group && <div className="text-[11px] text-gray-500 mt-0.5">{m.group}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        {(activeTab === 'parties' || activeTab === 'vendors') && (
                                            <>
                                                <td className="p-4 text-sm text-gray-700">
                                                    {m.contactPerson && <div className="font-medium text-gray-800">{m.contactPerson}</div>}
                                                    <div className="text-[11px] text-gray-500 font-mono mt-0.5">{m.phone || 'No phone'}</div>
                                                    {m.email && <div className="text-[11px] text-gray-500">{m.email}</div>}
                                                </td>
                                                <td className="p-4 text-sm text-gray-700">
                                                    <div className="font-mono bg-gray-50 px-2 py-1 rounded inline-block text-[11px] font-bold border border-gray-100">GSTIN: {m.gstin || 'Unregistered'}</div>
                                                    {m.panNo && <div className="text-[11px] text-gray-500 uppercase font-mono mt-1 ml-1">PAN: {m.panNo}</div>}
                                                </td>
                                            </>
                                        )}
                                        {(activeTab === 'ledgers' || activeTab === 'banks') && (
                                            <td className="p-4 text-sm text-gray-700">
                                                <span className="px-2 py-1 bg-gray-50 rounded-md text-[10px] font-bold uppercase tracking-wide text-gray-600 border border-gray-200 shadow-sm">{m.group || 'N/A'}</span>
                                            </td>
                                        )}
                                        {activeTab === 'banks' && (
                                            <td className="p-4 text-sm text-gray-700">
                                                <div className="font-mono text-gray-800 tracking-wide">{m.bankDetails?.accountNo || 'No account'}</div>
                                                {m.bankDetails?.ifsc && <div className="text-[11px] text-gray-500 uppercase font-mono mt-0.5 flex items-center">IFSC: {m.bankDetails.ifsc}</div>}
                                            </td>
                                        )}
                                        {(activeTab === 'ledgers' || activeTab === 'banks' || activeTab === 'parties' || activeTab === 'vendors') && (
                                            <td className="p-4 text-sm text-gray-700">
                                                <div className="font-mono font-medium text-gray-900">₹{m.openingBalance?.toFixed(2) || '0.00'}</div>
                                                <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${(m.balanceType === 'Cr' || m.balanceType === 'Credit') ? 'text-green-600' : 'text-red-500'}`}>
                                                    {m.balanceType || 'Debit'}
                                                </div>
                                            </td>
                                        )}
                                        {(!(activeTab === 'parties' || activeTab === 'vendors' || activeTab === 'ledgers' || activeTab === 'banks')) && (
                                            <td className="p-4 text-xs text-gray-500">{m.description || '-'}</td>
                                        )}
                                        <td className="p-4">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingId(m.id); setFormData(m); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95" title="Edit">
                                                    <EditIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteConfirmation({ isOpen: true, id: m.id, name: m.name })} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95" title="Delete">
                                                    <DeleteIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchIcon className="text-gray-300 text-3xl" />
                            </div>
                            <p className="text-gray-500">No {activeTab} found matching your search</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[1.25rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-bold text-xl text-gray-900 font-display flex items-center">
                                {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, activeTab.endsWith('s') ? -1 : undefined)}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full active:scale-95">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name *</label>
                                    <input 
                                        type="text" 
                                        value={formData.name || ''}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter name..."
                                        autoFocus
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Notes</label>
                                    <input 
                                        type="text" 
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add any extra details..."
                                    />
                                </div>

                                {(activeTab === 'parties' || activeTab === 'vendors') && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                            <select 
                                                value={formData.type || 'Customer'}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="Customer">Customer</option>
                                                <option value="Vendor">Vendor</option>
                                                <option value="Both">Both</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GSTIN</label>
                                            <input type="text" value={formData.gstin || ''} onChange={e => setFormData({...formData, gstin: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 27ABCDE1234F1Z5" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PAN Number</label>
                                            <input type="text" value={formData.panNo || ''} onChange={e => setFormData({...formData, panNo: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="ABCDE1234F" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Person</label>
                                            <input type="text" value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                            <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                            <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="example@email.com" />
                                        </div>
                                    </>
                                )}

                                {(activeTab === 'ledgers' || activeTab === 'banks') && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group</label>
                                            <select 
                                                value={formData.group || ''}
                                                onChange={e => setFormData({ ...formData, group: e.target.value })}
                                                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Opening Balance</label>
                                            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                                                <input 
                                                    type="number" 
                                                    value={formData.openingBalance || ''} 
                                                    onChange={e => setFormData({...formData, openingBalance: parseFloat(e.target.value) || 0})} 
                                                    className="w-full p-2 outline-none flex-1" 
                                                    placeholder="0.00" 
                                                />
                                                <select 
                                                    value={formData.balanceType || 'Debit'}
                                                    onChange={e => setFormData({...formData, balanceType: e.target.value})}
                                                    className="w-20 border-l border-gray-200 outline-none px-2 bg-gray-50"
                                                >
                                                    <option value="Debit">Dr</option>
                                                    <option value="Credit">Cr</option>
                                                </select>
                                            </div>
                                        </div>
                                        {activeTab === 'banks' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account No</label>
                                                    <input type="text" value={formData.bankDetails?.accountNo || ''} onChange={e => setFormData({...formData, bankDetails: { ...formData.bankDetails, accountNo: e.target.value }})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Account Number" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IFSC Code</label>
                                                    <input type="text" value={formData.bankDetails?.ifsc || ''} onChange={e => setFormData({...formData, bankDetails: { ...formData.bankDetails, ifsc: e.target.value }})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="IFSC Code" />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[1.25rem] p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <WarningIcon className="text-3xl" />
                        </div>
                        <h2 className="font-bold text-xl mb-2 font-display text-gray-900">Are you sure?</h2>
                        <p className="text-gray-500 text-sm mb-8">
                            You are about to delete <span className="font-bold text-gray-800">"{deleteConfirmation.name}"</span>. This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => setDeleteConfirmation(null)}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
