import React, { useState, useEffect } from 'react';
import { SecurityIcon, SettingsIcon, CheckCircleIcon, UndoIcon } from '../icons/IconComponents';

export const AdminSettings: React.FC = () => {
    const [storageUsed, setStorageUsed] = useState<string>('0 KB');
    const [showConfirm, setShowConfirm] = useState<string | null>(null);
    const [stats, setStats] = useState({
        vouchers: 0,
        parties: 0,
        items: 0,
        ledgers: 0,
    });

    useEffect(() => {
        calculateStorage();
    }, []);

    const calculateStorage = () => {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                const item = localStorage.getItem(key);
                if (item) {
                    total += item.length * 2; // Rough estimation: 2 chars = 1 byte
                }
            }
        }
        const kb = (total / 1024).toFixed(2);
        const mb = (total / (1024 * 1024)).toFixed(2);
        setStorageUsed(total > 1024 * 1024 ? `${mb} MB` : `${kb} KB`);

        try {
            const v = JSON.parse(localStorage.getItem('bharat_book_all_vouchers_v2') || '[]');
            const p = JSON.parse(localStorage.getItem('bharat_book_party_masters') || '[]');
            const i = JSON.parse(localStorage.getItem('bharat_book_item_masters') || '[]');
            const l = JSON.parse(localStorage.getItem('bharat_book_ledger_masters') || '[]');
            setStats({
                vouchers: Array.isArray(v) ? v.length : 0,
                parties: Array.isArray(p) ? p.length : 0,
                items: Array.isArray(i) ? i.length : 0,
                ledgers: Array.isArray(l) ? l.length : 0,
            });
        } catch (e) {
            console.error("Failed to parse stats", e);
        }
    };

    const handleBackup = () => {
        const data: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                data[key] = localStorage.getItem(key) || '';
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bharat_book_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                Object.keys(data).forEach(key => {
                    if (key.startsWith('bharat_book')) {
                        localStorage.setItem(key, data[key]);
                    }
                });
                alert('Data restored successfully! The application will now reload.');
                window.location.reload();
            } catch (err) {
                alert('Failed to restore data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    const wipeData = (type: 'vouchers' | 'masters' | 'all' | 'cache') => {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bharat_book')) {
                if (type === 'all') {
                    keysToRemove.push(key);
                } else if (type === 'vouchers' && key.includes('_all_vouchers')) {
                    keysToRemove.push(key);
                } else if (type === 'masters' && key.includes('_masters')) {
                    keysToRemove.push(key);
                } else if (type === 'cache') {
                    // Remove draft and other non-critical state
                    if (key.includes('draft') || key.includes('purged') || key.includes('settings')) {
                        keysToRemove.push(key);
                    }
                }
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        alert(`Data (${type}) wiped successfully! The application will now reload.`);
        window.location.reload();
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
            <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">System Administration</h3>
                <p className="text-gray-500 dark:text-gray-400">Advanced tools for managing your application environment, data backups, and factory resets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-blue-600 dark:bg-gray-800">
                        <SecurityIcon />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Data Backup & Restore</h4>
                    <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Create full structural backups of all your application data, or restore from a previous backup file.</p>
                    
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleBackup}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
                        >
                            Download Full Backup
                        </button>
                        
                        <label className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-gray-50 transition dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                            <span>Restore Local Backup</span>
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={handleRestore}
                            />
                        </label>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            <SettingsIcon />
                        </div>
                        <div className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 shadow-sm border border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800">
                            Storage: {storageUsed}
                        </div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">System Diagnostics</h4>
                    <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Review your local storage utilization. Exceeding browser limits (usually 5MB) may cause data loss.</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col dark:bg-gray-800 dark:border-gray-800">
                            <span className="text-xs text-gray-500 font-medium dark:text-gray-400">Vouchers</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.vouchers}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col dark:bg-gray-800 dark:border-gray-800">
                            <span className="text-xs text-gray-500 font-medium dark:text-gray-400">Parties</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.parties}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col dark:bg-gray-800 dark:border-gray-800">
                            <span className="text-xs text-gray-500 font-medium dark:text-gray-400">Items</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.items}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col dark:bg-gray-800 dark:border-gray-800">
                            <span className="text-xs text-gray-500 font-medium dark:text-gray-400">Ledgers</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.ledgers}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => calculateStorage()}
                        className="w-full bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        Recalculate Usage
                    </button>
                </div>
            </div>

            <div className="bg-red-50/30 rounded-3xl p-8 border border-red-100 mb-8">
                <h4 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700/80 mb-6">These operations are irreversible. Please ensure you have taken a backup before proceeding with any data purge operation.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-red-100 dark:bg-gray-800">
                        <h5 className="font-bold text-gray-900 mb-1 dark:text-white">Clear Cache</h5>
                        <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">Removes drafts, settings, and cached states without deleting your data.</p>
                        {showConfirm === 'cache' ? (
                            <div className="flex gap-2">
                                <button onClick={() => wipeData('cache')} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg">Confirm</button>
                                <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg dark:bg-gray-800 dark:text-gray-300">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowConfirm('cache')} className="w-full bg-white text-red-600 border border-red-200 text-sm font-bold py-2 rounded-lg hover:bg-red-50 transition-colors dark:bg-gray-800">Wipe Cache</button>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-red-100 dark:bg-gray-800">
                        <h5 className="font-bold text-gray-900 mb-1 dark:text-white">Clear Transactions</h5>
                        <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">Removes all imported vouchers, journal entries, and bank statements.</p>
                        {showConfirm === 'vouchers' ? (
                            <div className="flex gap-2">
                                <button onClick={() => wipeData('vouchers')} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg">Confirm</button>
                                <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg dark:bg-gray-800 dark:text-gray-300">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowConfirm('vouchers')} className="w-full bg-white text-red-600 border border-red-200 text-sm font-bold py-2 rounded-lg hover:bg-red-50 transition-colors dark:bg-gray-800">Wipe Vouchers</button>
                        )}
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 border border-red-100 dark:bg-gray-800">
                        <h5 className="font-bold text-gray-900 mb-1 dark:text-white">Clear Master Data</h5>
                        <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">Removes all parties, ledgers, items, and inventory configurations.</p>
                        {showConfirm === 'masters' ? (
                            <div className="flex gap-2">
                                <button onClick={() => wipeData('masters')} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg">Confirm</button>
                                <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg dark:bg-gray-800 dark:text-gray-300">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowConfirm('masters')} className="w-full bg-white text-red-600 border border-red-200 text-sm font-bold py-2 rounded-lg hover:bg-red-50 transition-colors dark:bg-gray-800">Wipe Masters</button>
                        )}
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm shadow-red-100 dark:bg-gray-800">
                        <h5 className="font-bold text-red-700 mb-1">Factory Reset</h5>
                        <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">Wipes all transactions, masters, and settings. Resets sample states.</p>
                        {showConfirm === 'all' ? (
                            <div className="flex gap-2">
                                <button onClick={() => wipeData('all')} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg">Confirm</button>
                                <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg dark:bg-gray-800 dark:text-gray-300">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowConfirm('all')} className="w-full bg-red-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">Factory Reset</button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="border-t border-gray-100 pt-8 mt-8 flex items-center justify-between dark:border-gray-800">
                <div>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white">Application Version</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bharat Book Core v2.0.4 (AI Native Edition)</p>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2" /> System Healthy
                </div>
            </div>
        </div>
    );
};
