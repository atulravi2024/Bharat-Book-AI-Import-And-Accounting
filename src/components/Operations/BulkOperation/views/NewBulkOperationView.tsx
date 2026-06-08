import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface NewBulkOperationViewProps {}

export const NewBulkOperationView: React.FC<NewBulkOperationViewProps> = () => {
    const { addNotification } = useNotifications();
    const [items, setItems] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetch('/sample-data/bulk-operation/newSample.json')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, []);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(i => i.id));
        }
    };

    const handleProcess = () => {
        if (selectedIds.length === 0) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setItems(prev => prev.map(item => 
                selectedIds.includes(item.id) ? { ...item, status: 'Processed' } : item
            ));
            setSelectedIds([]);
            addNotification({
                title: 'Operation Successful',
                message: `Successfully processed ${selectedIds.length} items.`,
                type: 'Alert'
            });
        }, 1200);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        New Bulk Operation
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Select items to perform the new bulk operation and update their status.
                    </p>
                </div>
                <button
                    onClick={handleProcess}
                    disabled={selectedIds.length === 0 || isProcessing}
                    className={`
                        px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm
                        ${selectedIds.length === 0 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none hover:shadow-md hover:-translate-y-0.5'
                        }
                    `}
                >
                    {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                        <CheckCircle className="w-4 h-4" />
                    )}
                    Process Selected ({selectedIds.length})
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={items.length > 0 && selectedIds.length === items.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {items.map((item, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id} 
                                    className={`
                                        transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20
                                        ${selectedIds.includes(item.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}
                                    `}
                                >
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleToggleSelect(item.id)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {item.id}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold tracking-wide ${
                                            item.status === 'Processed' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {items.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
