import React, { useState, useEffect } from 'react';
import { SettingsIcon, CheckCircleIcon } from '../icons/IconComponents';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { defaultVoucherSettings } from '../../services/voucherNumbering';

export const VoucherNumberingSettings: React.FC = () => {
    const defaultSettings = defaultVoucherSettings;

    const [settings, setSettings] = useState<any>(defaultSettings);
    const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = localStorage.getItem('bharat_book_voucher_numbering');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (e) {
                console.error("Failed to parse voucher numbering settings");
            }
        }
        
        // Initial collapse states (all collapsed by default)
        const initialCollapsed: Record<string, boolean> = {};
        Object.keys(defaultSettings).forEach(key => {
            initialCollapsed[key] = true;
        });
        setCollapsedStates(initialCollapsed);
    }, []);

    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        localStorage.setItem('bharat_book_voucher_numbering', JSON.stringify(settings));
    };

    const handleSettingChange = (type: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const toggleCollapse = (id: string, e: React.MouseEvent) => {
        // Prevent toggle if clicking on the checkbox
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') {
            return;
        }
        setCollapsedStates(prev => {
            const isCurrentlyCollapsed = prev[id] !== false; // handle undefined as true
            if (isCurrentlyCollapsed) {
                // Expanding this one, collapse all others
                const newState: Record<string, boolean> = {};
                Object.keys(defaultSettings).forEach(key => {
                    newState[key] = key === id ? false : true;
                });
                return newState;
            } else {
                // Collapsing this one
                return { ...prev, [id]: true };
            }
        });
    };

    const resetPatterns = [
        { id: 'never', label: 'Never' },
        { id: 'daily', label: 'Daily' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' }
    ];

    const voucherGroups = [
        {
            title: "Accounting Vouchers",
            types: [
                { id: 'sales', label: 'Sales' },
                { id: 'purchase', label: 'Purchase' },
                { id: 'payment', label: 'Payment' },
                { id: 'receipt', label: 'Receipt' },
                { id: 'journal', label: 'Journal' },
                { id: 'contra', label: 'Contra' },
                { id: 'debit_note', label: 'Debit Note' },
                { id: 'credit_note', label: 'Credit Note' },
            ]
        },
        {
            title: "Inventory Vouchers",
            types: [
                { id: 'stock_journal', label: 'Stock Journal' },
                { id: 'transfer', label: 'Material Transfer' },
                { id: 'physical_stock', label: 'Physical Stock' },
                { id: 'consumption', label: 'Item Consumption' },
                { id: 'scrap', label: 'Item Scrap' },
                { id: 'rejections_in', label: 'Rejections In' },
                { id: 'rejections_out', label: 'Rejections Out' },
            ]
        }
    ];

    return (
        <div className="bg-white rounded-3xl pb-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col h-full overflow-hidden dark:bg-gray-800 dark:border-gray-800">
            <div className="flex justify-between items-start mb-8 p-6 md:p-8 pb-0">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 flex items-center dark:text-gray-100">
                        <SettingsIcon className="mr-3 text-blue-600" /> Voucher Numbering Settings
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 font-medium dark:text-gray-400">Configure automatic voucher numbering for different transaction types.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
                        isSaved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                    }`}
                >
                    {isSaved ? <><CheckCircleIcon className="mr-2" /> Saved!</> : 'Save Settings'}
                </button>
            </div>

            <div className="space-y-8 px-0">
                {voucherGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-0">
                        <h3 className="text-lg font-black text-gray-800 border-b border-gray-200 px-6 md:px-8 py-3 bg-gray-50 uppercase tracking-wide dark:text-gray-100 dark:border-gray-700 dark:bg-gray-900">{group.title}</h3>
                        <div className="flex flex-col">
                            {group.types.map((type, idx) => {
                                const currentSettings = settings[type.id] || defaultSettings[type.id as keyof typeof defaultSettings];
                                const isCollapsed = collapsedStates[type.id];
                                const isLast = idx === group.types.length - 1;
                                
                                return (
                                    <div key={type.id} className={`bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 ${isLast ? '' : ''} dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-800`}>
                                        <div 
                                            className="w-full px-6 md:px-8 py-4 flex items-center justify-between cursor-pointer"
                                            onClick={(e) => toggleCollapse(type.id, e)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                                </button>
                                                <h4 className="text-md font-bold text-gray-800 tracking-wide dark:text-gray-100">{type.label}</h4>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="flex items-center space-x-2 cursor-pointer z-10" onClick={(e) => e.stopPropagation()}>
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 dark:text-gray-400">Auto Generate</span>
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                                        checked={currentSettings.autoGenerate}
                                                        onChange={(e) => handleSettingChange(type.id, 'autoGenerate', e.target.checked)}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        
                                        {!isCollapsed && (
                                            <div className="px-6 md:px-8 pb-6 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                                    {currentSettings.autoGenerate ? (
                                                        <>
                                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1 dark:text-gray-400">Prefix</label>
                                                                    <input 
                                                                        type="text" 
                                                                        value={currentSettings.prefix || ''}
                                                                        onChange={(e) => handleSettingChange(type.id, 'prefix', e.target.value)}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                                                                        placeholder="e.g. SAL/"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1 dark:text-gray-400">Starting No.</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={currentSettings.startAt || 1}
                                                                        onChange={(e) => handleSettingChange(type.id, 'startAt', parseInt(e.target.value) || 1)}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                                                                        placeholder="1"
                                                                        min="1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1 dark:text-gray-400">Zero Padding</label>
                                                                    <input 
                                                                        type="number" 
                                                                        value={currentSettings.padding !== undefined ? currentSettings.padding : 3}
                                                                        onChange={(e) => handleSettingChange(type.id, 'padding', parseInt(e.target.value) || 0)}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                                                                        placeholder="3"
                                                                        min="0"
                                                                        max="10"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1 dark:text-gray-400">Suffix</label>
                                                                    <input 
                                                                        type="text" 
                                                                        value={currentSettings.suffix || ''}
                                                                        onChange={(e) => handleSettingChange(type.id, 'suffix', e.target.value)}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                                                                        placeholder="e.g. /23-24"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1 dark:text-gray-400">Restart</label>
                                                                    <select 
                                                                        value={currentSettings.resetPattern || 'yearly'}
                                                                        onChange={(e) => handleSettingChange(type.id, 'resetPattern', e.target.value)}
                                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                                                                    >
                                                                        {resetPatterns.map(pattern => (
                                                                            <option key={pattern.id} value={pattern.id}>{pattern.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 p-2 bg-gradient-to-r from-blue-50 to-indigo-50/30 border border-blue-100/50 rounded-lg flex items-center justify-between shadow-sm">
                                                                <div className="flex items-center gap-2 w-full sm:w-auto overflow-hidden">
                                                                    <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 bg-blue-100/50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded shrink-0">Preview</span>
                                                                    <div className="font-mono text-sm font-bold text-slate-700 tracking-wider truncate w-full text-center sm:text-left">
                                                                        <span className="text-slate-400">{currentSettings.prefix}</span>
                                                                        <span className="text-blue-600 font-black">{String(currentSettings.startAt || 1).padStart(currentSettings.padding !== undefined ? currentSettings.padding : 3, '0')}</span>
                                                                        <span className="text-slate-400">{currentSettings.suffix}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="hidden sm:block text-[8px] text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap pl-2">Auto-generated</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center justify-center py-6 text-gray-400 font-medium text-sm">
                                                            Manual numbering is enabled. Turn on Auto Generate to configure numbering patterns.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

