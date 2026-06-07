import React, { useState } from 'react';
import { PartyMaster } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Users, 
    ShieldAlert, 
    BadgePercent, 
    Check, 
    RefreshCw, 
    ShieldCheck, 
    Sliders 
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface ContactGroupingViewProps {
    partyMasters: PartyMaster[];
    setPartyMasters: (parties: PartyMaster[]) => void;
}

export const ContactGroupingView: React.FC<ContactGroupingViewProps> = ({
    partyMasters,
    setPartyMasters
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [creditDays, setCreditDays] = useState<number>(30);
    const [selectedTier, setSelectedTier] = useState<string>('Tier-1 Wholesaler');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleApplyPartyPolicy = () => {
        if (selectedIds.length === 0) return;

        setIsUpdating(true);
        setTimeout(() => {
            // Apply updates
            const updated = partyMasters.map(p => {
                if (selectedIds.includes(p.id)) {
                    return {
                        ...p,
                        creditDays: creditDays,
                        contactPerson: `[BULK TIER ASSIGNED: ${selectedTier}] ${p.contactPerson || ''}`
                    };
                }
                return p;
            });

            setPartyMasters(updated);
            setIsUpdating(false);
            setSelectedIds([]);

            addNotification({
                title: 'Party Policy Synced',
                message: `Successfully set ${creditDays} Net credit days & assigned "${selectedTier}" classification to ${selectedIds.length} counterparties.`,
                type: 'Alert'
            });
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="text-indigo-500 w-6 h-6" />
                        Bulk Contact Categorization & commercial Policy Rules
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Configure payment terms, wholesale margins, and credit ceilings in bulk
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-black uppercase text-gray-400 pl-2">Credit limit:</span>
                        <select 
                            value={creditDays}
                            onChange={(e) => setCreditDays(Number(e.target.value))}
                            className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-200 border-0 focus:ring-0 cursor-pointer"
                        >
                            <option value={15}>Net 15 Days</option>
                            <option value={30}>Net 30 Days</option>
                            <option value={45}>Net 45 Days</option>
                            <option value={60}>Net 60 Days</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 p-1.5 rounded-xl border border-indigo-100/30">
                        <span className="text-[10px] font-black uppercase text-indigo-500 pl-2">Tier class:</span>
                        <select 
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                            className="bg-transparent text-xs font-bold text-indigo-700 dark:text-indigo-300 border-0 focus:ring-0 cursor-pointer"
                        >
                            <option value="Tier-1 Wholesaler">Partner Wholesaler</option>
                            <option value="Tier-2 Distributor">Regional Distributor</option>
                            <option value="Retail Client">Consolidated Retailer</option>
                            <option value="Exempt Supplier">Exempt Trade Vendor</option>
                        </select>
                    </div>

                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleApplyPartyPolicy}
                            disabled={isUpdating}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-100"
                        >
                            {isUpdating ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Save to {selectedIds.length} buyers</span>
                        </button>
                    )}
                </div>
            </div>

            {partyMasters.length > 0 ? (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-5">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={partyMasters.length > 0 && selectedIds.length === partyMasters.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(partyMasters.map(p => p.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Trade Description / Business Legal Name</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Registered GSTIN</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Default Terms</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partyMasters.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0 border-gray-150/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(p.id)}
                                                onChange={() => handleToggleSelect(p.id)}
                                                className="accent-indigo-600 rounded"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                                {p.name}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                State: {p.state || 'Local Region'} | Contacts: {p.phone || 'Undisclosed'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono font-semibold text-gray-500">
                                            {p.gstin || 'UNREGISTERED'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="inline-block text-[11px] font-black tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {p.creditDays ? `${p.creditDays} Net Days` : 'Cash Terms (Immediate)'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                        <Sliders className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Buyers array is vacant</p>
                </div>
            )}
        </div>
    );
};
