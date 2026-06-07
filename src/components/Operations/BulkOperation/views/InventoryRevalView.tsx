import React, { useState, useMemo } from 'react';
import { ItemMaster } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Activity, 
    Check, 
    RefreshCw, 
    TrendingDown, 
    TrendingUp, 
    Boxes,
    Layers 
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface InventoryRevalViewProps {
    itemMasters: ItemMaster[];
    setItemMasters: (items: ItemMaster[]) => void;
}

export const InventoryRevalView: React.FC<InventoryRevalViewProps> = ({
    itemMasters,
    setItemMasters
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [markupPercent, setMarkupPercent] = useState<number>(0);
    const [isRevaluing, setIsRevaluing] = useState(false);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleApplyInventoryReval = () => {
        if (selectedIds.length === 0 || markupPercent === 0) return;

        setIsRevaluing(true);
        setTimeout(() => {
            // Apply reval to standard costing coefficients (purchaseRate)
            const multiplier = 1 + markupPercent / 100;
            const updated = itemMasters.map(item => {
                if (selectedIds.includes(item.id)) {
                    const originalRate = Number(item.purchaseRate || 0);
                    const newRate = Number((originalRate * multiplier).toFixed(2));
                    return {
                        ...item,
                        purchaseRate: newRate,
                        description: `[BULK COST REVALUED BY ${markupPercent}%: New cost sets to ₹${newRate}] ${item.description || ''}`
                    };
                }
                return item;
            });

            setItemMasters(updated);
            setIsRevaluing(false);
            setSelectedIds([]);
            setMarkupPercent(0);

            addNotification({
                title: 'Ledger Carrying Cost Realignment',
                message: `Successfully adjusted inventory standard costs across ${selectedIds.length} catalog commodities by ${markupPercent}%.`,
                type: 'Alert'
            });
        }, 1200);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Boxes className="text-indigo-500 w-6 h-6 animate-pulse" />
                        Automated Stock Ledger Cost Revaluation
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Apply global markups or asset depreciation write-downs to your standardized carrying costs
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-black uppercase text-gray-400 pl-2">Adjustment (±%):</span>
                        <input 
                            type="number"
                            step="0.5"
                            value={markupPercent}
                            onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                            className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-100 w-16 border-0 focus:ring-0"
                            placeholder="e.g. +5 or -2.5"
                        />
                    </div>

                    {selectedIds.length > 0 && markupPercent !== 0 && (
                        <button
                            onClick={handleApplyInventoryReval}
                            disabled={isRevaluing}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-100"
                        >
                            {isRevaluing ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Revalue {selectedIds.length} Assets</span>
                        </button>
                    )}
                </div>
            </div>

            {itemMasters.length > 0 ? (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-5">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={itemMasters.length > 0 && selectedIds.length === itemMasters.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(itemMasters.map(item => item.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Particular</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Standard Cost Unit</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Adjusted carrying cost Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemMasters.map((item) => {
                                    const origCost = Number(item.purchaseRate || 0);
                                    const previewCost = markupPercent !== 0 && selectedIds.includes(item.id)
                                        ? Number((origCost * (1 + markupPercent / 100)).toFixed(2))
                                        : origCost;
                                    const isDiff = origCost !== previewCost;

                                    return (
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
                                                <div className="text-xs font-black text-gray-950 dark:text-white">
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                    Category: {item.category || 'Standard Goods'} | unit: {item.uom}
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-bold text-gray-500">
                                                ₹{formatNumber(origCost)}
                                            </td>
                                            <td className="p-4 text-right">
                                                {isDiff ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <span className="text-[10px] text-gray-400 line-through">₹{formatNumber(origCost)}</span>
                                                        <span className={`text-xs font-black ${markupPercent > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            ₹{formatNumber(previewCost)}
                                                        </span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${markupPercent > 0 ? 'bg-green-50 text-emerald-700' : 'bg-red-50 text-rose-700'}`}>
                                                            {markupPercent > 0 ? `+${markupPercent}%` : `${markupPercent}%`}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">₹{formatNumber(origCost)}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                        <Layers className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Inventory Stock empty</p>
                </div>
            )}
        </div>
    );
};
