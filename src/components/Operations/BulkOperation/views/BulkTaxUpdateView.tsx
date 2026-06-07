import React, { useState, useMemo } from 'react';
import { ItemMaster, ParsedVoucher } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Coins, 
    Layers, 
    RefreshCw, 
    Check, 
    TrendingDown, 
    AlertTriangle,
    SlidersHorizontal
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface BulkTaxUpdateViewProps {
    itemMasters: ItemMaster[];
    setItemMasters: (items: ItemMaster[]) => void;
    allVouchers: ParsedVoucher[];
    setAllVouchers: (vouchers: ParsedVoucher[]) => void;
}

export const BulkTaxUpdateView: React.FC<BulkTaxUpdateViewProps> = ({
    itemMasters,
    setItemMasters,
    allVouchers,
    setAllVouchers
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [selectedRateFilter, setSelectedRateFilter] = useState<number | 'all'>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [targetRate, setTargetRate] = useState<number>(18);
    const [isApplying, setIsApplying] = useState(false);

    // List of items filtered by current tax rate
    const filteredItems = useMemo(() => {
        return itemMasters.filter(item => {
            if (selectedRateFilter === 'all') return true;
            return item.taxRate === selectedRateFilter;
        });
    }, [itemMasters, selectedRateFilter]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleApplyTaxAdjustment = () => {
        if (selectedIds.length === 0) return;

        setIsApplying(true);
        setTimeout(() => {
            // Update selected Item Masters
            const updatedItems = itemMasters.map(item => {
                if (selectedIds.includes(item.id)) {
                    return { ...item, taxRate: targetRate };
                }
                return item;
            });

            setItemMasters(updatedItems);
            setIsApplying(false);
            setSelectedIds([]);

            addNotification({
                title: 'GST Slabs Corrected',
                message: `Successfully adjusted tax rates to ${targetRate}% GST across ${selectedIds.length} catalog items.`,
                type: 'Alert'
            });
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Coins className="text-indigo-500 w-6 h-6" />
                        Bulk GST Rate & Slab Updater
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Mass transition tax slabs and commodity codes across your stock registry
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-black uppercase text-gray-400 pl-2">Filter rate:</span>
                        <select 
                            value={String(selectedRateFilter)}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedRateFilter(val === 'all' ? 'all' : Number(val));
                                setSelectedIds([]);
                            }}
                            className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-200 border-0 focus:ring-0 cursor-pointer"
                        >
                            <option value="all">All Slabs</option>
                            <option value="5">5% GST</option>
                            <option value="12">12% GST</option>
                            <option value="18">18% GST</option>
                            <option value="28">28% GST</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 p-1.5 rounded-xl border border-indigo-100/30">
                        <span className="text-[10px] font-black uppercase text-indigo-500 pl-2">Set Target:</span>
                        <select 
                            value={targetRate}
                            onChange={(e) => setTargetRate(Number(e.target.value))}
                            className="bg-transparent text-xs font-bold text-indigo-700 dark:text-indigo-300 border-0 focus:ring-0 cursor-pointer"
                        >
                            <option value={0}>0% (Exempt)</option>
                            <option value={5}>5% GST</option>
                            <option value={12}>12% GST</option>
                            <option value={18}>18% GST</option>
                            <option value={28}>28% GST</option>
                        </select>
                    </div>

                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleApplyTaxAdjustment}
                            disabled={isApplying}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-100"
                        >
                            {isApplying ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Apply to {selectedIds.length} items</span>
                        </button>
                    )}
                </div>
            </div>

            {filteredItems.length > 0 ? (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-5">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(filteredItems.map(item => item.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Product Name</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Current HSN</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Cost Rate</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Tax Slab</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0 border-gray-150/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleToggleSelect(item.id)}
                                                className="accent-indigo-600 rounded"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                                {item.name}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                SKU: {item.sku || 'No SKU'} | Category: {item.category || 'General'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono font-semibold text-gray-500">
                                            {item.hsnCode || 'Unassigned'}
                                        </td>
                                        <td className="p-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                                            ₹{formatNumber(Number(item.purchaseRate || 0))}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`inline-block text-[11px] font-black tracking-wider px-2 py-1 rounded bg-indigo-50/55 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400`}>
                                                {item.taxRate}% GST
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
                        <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">No matching items found</p>
                    <p className="text-[11px] text-gray-400 max-w-xs mt-2">
                        Try changing the slab filter at the top right to locate registered inventory.
                    </p>
                </div>
            )}
        </div>
    );
};
