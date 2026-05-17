
import React, { useState, useMemo } from 'react';
import { 
    CheckCircleIcon, 
    AutoFixHighIcon, 
    SettingsIcon, 
    TrendingUpIcon,
    InventoryIcon,
    ArrowForwardIcon,
    SaveIcon
} from '../../icons/IconComponents';
import { motion } from 'motion/react';
import { ItemMaster } from '../../../types';


interface SystemDecideViewProps {
    itemMasters: ItemMaster[];
    setItemMasters: (items: ItemMaster[]) => void;
}

export const SystemDecideView: React.FC<SystemDecideViewProps> = ({ itemMasters, setItemMasters }) => {
    const [profitPercentage, setProfitPercentage] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedItems, setProcessedItems] = useState<ItemMaster[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const stats = useMemo(() => {
        const totalItems = itemMasters.length;
        const lowMarginItems = itemMasters.filter(i => {
            const margin = i.purchaseRate && i.salesRate ? ((i.salesRate - i.purchaseRate) / i.purchaseRate) * 100 : 0;
            return margin < profitPercentage;
        }).length;
        
        return { totalItems, lowMarginItems };
    }, [itemMasters, profitPercentage]);

    const handleApplyProfit = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const updated = itemMasters.map(item => {
                if (item.purchaseRate) {
                    const newSalesRate = Math.round(item.purchaseRate * (1 + profitPercentage / 100) * 100) / 100;
                    return { ...item, salesRate: newSalesRate };
                }
                return item;
            });
            setProcessedItems(updated);
            setIsProcessing(false);
        }, 1500);
    };

    const handleConfirm = () => {
        setItemMasters(processedItems);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setProcessedItems([]);
        }, 3000);
    };  return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="form-grid gap-8">
                {/* Control Panel */}
                <div className="form-field-wrapper lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <SettingsIcon />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">Strategy Settings</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="form-field-wrapper">
<label className="form-label mb-4">Target Profit Margin</label>
                                <div className="flex items-center space-x-4">
                                    <input 
                                        type="range" 
                                        min="2" 
                                        max="50" 
                                        step="2"
                                        className="flex-1 accent-indigo-600 h-1.5 bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-800" 
                                        value={profitPercentage}
                                        onChange={(e) => setProfitPercentage(Number(e.target.value))}
                                    />
                                    <span className="w-12 text-center font-black text-indigo-600 bg-indigo-50 py-1 rounded-lg border border-indigo-100 tracking-tighter">{profitPercentage}%</span>
                                </div>
                                <div className="flex justify-between mt-3 px-1 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Conserv</span>
                                    <span>Agrsv</span>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-0.5 text-orange-500">
                                        <TrendingUpIcon className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-orange-700 uppercase tracking-widest mb-1">Impact Analysis</p>
                                        <p className="text-xs text-orange-600/80 leading-relaxed">
                                            {stats.lowMarginItems} items currently have a margin below your {profitPercentage}% target.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleApplyProfit}
                                disabled={isProcessing}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <AutoFixHighIcon />
                                        <span>Run Price Logic</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="form-field-wrapper lg:col-span-2">
                    {processedItems.length > 0 ? (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                        <InventoryIcon />
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">Preview Changes</h2>
                                </div>
                                <button 
                                    onClick={handleConfirm}
                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center space-x-2 transition-all shadow-lg shadow-green-100"
                                >
                                    <SaveIcon className="text-sm" />
                                    <span>Apply To Masters</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 max-h-[500px] custom-scrollbar">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-white pb-4 block dark:bg-gray-800">
                                        <tr className="flex text-left border-b border-gray-100 pb-2 dark:border-gray-800">
                                            <th className="flex-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Name</th>
                                            <th className="w-24 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Cost</th>
                                            <th className="w-24 text-center"></th>
                                            <th className="w-24 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">New Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="block pt-4 space-y-2">
                                        {processedItems.slice(0, 50).map((item, idx) => {
                                            const original = itemMasters.find(m => m.id === item.id);
                                            const isChanged = original?.salesRate !== item.salesRate;
                                            
                                            return (
                                                <tr key={item.id || idx} className={`flex items-center p-3 rounded-xl transition-colors ${isChanged ? 'bg-blue-50/30' : ''}`}>
                                                    <td className="flex-1">
                                                        <div className="text-xs font-bold text-gray-900 dark:text-white">{item.name}</div>
                                                        <div className="text-[10px] font-medium text-gray-400">{item.sku || 'No SKU'}</div>
                                                    </td>
                                                    <td className="w-24 text-right text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        ₹{item.purchaseRate?.toLocaleString()}
                                                    </td>
                                                    <td className="w-24 flex justify-center text-gray-300">
                                                        <ArrowForwardIcon className="text-sm" />
                                                    </td>
                                                    <td className="w-24 text-right text-xs font-black text-indigo-600">
                                                        ₹{item.salesRate?.toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {processedItems.length > 50 && (
                                            <div className="text-center py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                And {processedItems.length - 50} more items...
                                            </div>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center p-20 h-full text-center dark:bg-gray-900 dark:border-gray-700">
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-gray-200 shadow-sm mb-6 dark:bg-gray-800">
                                <AutoFixHighIcon className="text-4xl" />
                            </div>
                            <h3 className="text-base font-black text-gray-400 uppercase tracking-widest mb-2">Ready for Analysis</h3>
                            <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-medium">
                                Configure your profit targets on the left and run the logic to preview suggested price adjustments for your inventory.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showSuccess && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-10 right-10 flex items-center space-x-3 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50"
                >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="text-white text-lg" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest">Update Successful</p>
                        <p className="text-[10px] font-medium text-gray-400">Master prices have been adjusted successfully.</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
