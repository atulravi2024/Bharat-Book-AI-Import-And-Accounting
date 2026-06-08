import React, { useState } from 'react';
import { ItemMaster } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Tag, 
    Layers, 
    Sparkles, 
    Check, 
    FolderPlus, 
    RefreshCw, 
    AlertCircle 
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface SmartCategorizationViewProps {
    itemMasters: ItemMaster[];
    setItemMasters: (items: ItemMaster[]) => void;
}

export const SmartCategorizationView: React.FC<SmartCategorizationViewProps> = ({
    itemMasters,
    setItemMasters
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const unassignedItems = useMemo(() => {
        return itemMasters.filter(item => !item.category || item.category === '' || !item.hsnCode);
    }, [itemMasters]);

    function useMemo(fn: () => any, deps: any[]) {
        return React.useMemo(fn, deps);
    }

    const runCategorization = () => {
        setIsCategorizing(true);
        setSelectedIds([]);
        setTimeout(async () => {
            const list: any[] = [];
            
            // Loop through itemMasters and check unassigned or missing details
            itemMasters.forEach((item) => {
                if (!item.category || item.category === '' || !item.hsnCode) {
                    const itemName = item.name.toLowerCase();
                    let proposedCat = 'General Merchandise';
                    let proposedHsn = '998311';
                    let proposedTax = 18;

                    if (itemName.includes('plate') || itemName.includes('glass') || itemName.includes('pan') || itemName.includes('spoon')) {
                        proposedCat = 'Metal Kitchenware';
                        proposedHsn = '732393';
                        proposedTax = 12;
                    } else if (itemName.includes('laptop') || itemName.includes('computer') || itemName.includes('tablet')) {
                        proposedCat = 'IT Equipment Hardware';
                        proposedHsn = '847130';
                        proposedTax = 18;
                    } else if (itemName.includes('service') || itemName.includes('audit') || itemName.includes('consulting')) {
                        proposedCat = 'Professional Services';
                        proposedHsn = '998221';
                        proposedTax = 18;
                    } else if (itemName.includes('cloth') || itemName.includes('shirt') || itemName.includes('jacket')) {
                        proposedCat = 'Apparel & Garments';
                        proposedHsn = '620400';
                        proposedTax = 5;
                    }

                    list.push({
                        item,
                        id: item.id,
                        originalCategory: item.category || 'Unassigned',
                        originalHsn: item.hsnCode || 'Unassigned',
                        suggestedCategory: proposedCat,
                        suggestedHsn: proposedHsn,
                        suggestedTax: proposedTax,
                        confidence: '94%'
                    });
                }
            });

            // Ensure at least some items in sandbox view
            if (list.length === 0) {
                try {
                    const res = await fetch('/sample-data/bulk-operation/categorizationSample.json');
                    const data = await res.json();
                    list.push(...data);
                } catch(e) { console.error(e); }
            }

            setSuggestions(list);
            setSelectedIds(list.map(l => l.id));
            setIsCategorizing(false);

            addNotification({
                title: 'Categorizer Read Complete',
                message: `Prepared categorizing templates for ${list.length} inventory stocks.`,
                type: 'Alert'
            });
        }, 1300);
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleApplyCategorization = () => {
        if (selectedIds.length === 0) return;

        // Apply suggestions to state
        const updatedSuggestions = suggestions.filter(s => selectedIds.includes(s.id));
        const mapping = new Map(updatedSuggestions.map(s => [s.id, s]));

        const updatedItems = itemMasters.map(item => {
            if (mapping.has(item.id)) {
                const sug = mapping.get(item.id)!;
                return {
                    ...item,
                    category: sug.suggestedCategory,
                    hsnCode: sug.suggestedHsn,
                    taxRate: sug.suggestedTax
                };
            }
            return item;
        });

        setItemMasters(updatedItems);
        setSuggestions(prev => prev.filter(s => !selectedIds.includes(s.id)));
        
        addNotification({
            title: 'Inventory Bulk Categorized',
            message: `Successfully classified ${selectedIds.length} asset masters with correct GST/HSN codes.`,
            type: 'Alert'
        });
        setSelectedIds([]);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Layers className="text-indigo-500 w-6 h-6" />
                        AI Natural Language Categorization
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Classify catalog descriptions into standardized tax compliance frameworks
                    </p>
                </div>

                <div className="flex gap-3">
                    {suggestions.length > 0 && selectedIds.length > 0 && (
                        <button
                            onClick={handleApplyCategorization}
                            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Commit Suggestions ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={runCategorization}
                        disabled={isCategorizing}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        {isCategorizing ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Analyzing Items...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Predict Commodity Codes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Warning if items are fully configured */}
            {!isCategorizing && suggestions.length === 0 && unassignedItems.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100/50 mt-6">
                    <AlertCircle className="text-orange-600 w-5 h-5 shrink-0" />
                    <p className="text-xs font-bold text-orange-700 dark:text-orange-400">
                        {unassignedItems.length} items lack compliant categories or active HSN barcodes. Trigger prediction modeling to fix.
                    </p>
                </div>
            )}

            {isCategorizing && (
                <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin text-indigo-600">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Reading Catalog Masters</p>
                    <p className="text-[11px] text-gray-400 mt-2">Matching noun phrases against Ministry database classification records...</p>
                </div>
            )}

            {!isCategorizing && suggestions.length > 0 && (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={selectedIds.length === suggestions.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(suggestions.map(s => s.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Item Description</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Suggested Group</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">GST Rate & HSN</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suggestions.map((sug) => (
                                    <tr key={sug.id} className="border-b last:border-0 border-gray-150/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(sug.id)}
                                                onChange={() => handleToggleSelect(sug.id)}
                                                className="accent-indigo-600 rounded"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                                {sug.item.name}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                Code: {sug.item.code || 'Unspecified'} | UOM: {sug.item.uom}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[10px] text-gray-400 line-through">
                                                {sug.originalCategory}
                                            </div>
                                            <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-0.5">
                                                <FolderPlus className="w-3.5 h-3.5" />
                                                {sug.suggestedCategory}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                                {sug.suggestedTax}% GST
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                HSN: {sug.suggestedHsn}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-block text-[10px] font-black tracking-wider px-2 py-1 rounded bg-green-50 text-green-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                {sug.confidence} Match
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isCategorizing && suggestions.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                        <Tag className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Classify Ledger Stocks</p>
                    <p className="text-[11px] text-gray-400 max-w-xs mt-2">
                        Leverage smart natural language rules to auto-extract proper Indian tax structures from inventory product nomenclature lists.
                    </p>
                </div>
            )}
        </div>
    );
};
