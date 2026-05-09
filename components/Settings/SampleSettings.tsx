import React, { useState } from 'react';
import { Settings, ChevronDown, Package, BookOpen, Receipt, Users, ExternalLink, BarChart3, ShieldCheck } from 'lucide-react';
import { MainView } from '../../types';

interface SampleSettingsProps {
    setView: (view: MainView) => void;
    setActiveMasterTab: (tab: string | null) => void;
    activeSamples: string[];
    onToggleSample: (id: string, forceState?: boolean) => void;
    setReportBankActiveTab?: (tab: string | null) => void;
}

export const SampleSettings: React.FC<SampleSettingsProps> = ({ setView, setActiveMasterTab, activeSamples, onToggleSample, setReportBankActiveTab }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    const masters: { 
        id: string; 
        title: string; 
        icon: any; 
        description: string; 
        subItems: { id: string; label: string; view?: MainView; noSample?: boolean; tab?: string; }[] 
    }[] = [
        { 
            id: 'ops', 
            title: 'Operations', 
            icon: ShieldCheck, 
            description: 'Data ingestion and bulk processing tools',
            subItems: [
                { id: 'import', label: 'Import Interface', view: 'import' as MainView, noSample: true },
                { id: 'bulk', label: 'Bulk Operation', view: 'bulk-operation' as MainView, noSample: true }
            ]
        },
        { 
            id: 'item', 
            title: 'Item Master', 
            icon: Package, 
            description: 'Manage inventory items and stock details',
            subItems: [
                { id: 'items', label: 'Items' },
                { id: 'stockGroups', label: 'Stock Groups' },
                { id: 'uoms', label: 'UOM Master' },
                { id: 'gst', label: 'HSN code' },
                { id: 'brands', label: 'Brands Master' },
                { id: 'categories', label: 'Categories Master' },
                { id: 'warehouses', label: 'Warehouses' },
                { id: 'skus', label: 'SKU Master' },
                { id: 'priceList', label: 'Price List Master' },
                { id: 'weights', label: 'Weight Master' },
                { id: 'volumes', label: 'Volume Master' },
                { id: 'colors', label: 'Color Master' },
                { id: 'sizes', label: 'Size Master' },
                { id: 'variants', label: 'Variant Master' },
                { id: 'dimensions', label: 'Dimensions Master' },
                { id: 'grades', label: 'Grades Master' },
                { id: 'assertionCategories', label: 'Assertion Category' },
                { id: 'assertionCodes', label: 'Assertion Code' }
            ]
        },
        { 
            id: 'ledger', 
            title: 'Ledger Master', 
            icon: BookOpen, 
            description: 'Configure ledger groups and accounts',
            subItems: [
                { id: 'parties', label: 'Parties' },
                { id: 'vendors', label: 'Vendors' },
                { id: 'accountGroups', label: 'Account Groups' },
                { id: 'ledgers', label: 'Ledgers' },
                { id: 'banks', label: 'Banks' },
                { id: 'costCenters', label: 'Cost Centers' },
                { id: 'contacts', label: 'Contacts Hub' }
            ]
        },
        { 
            id: 'bank_report_section', 
            title: 'Bank Report', 
            icon: BarChart3, 
            description: 'Bank statement reconciliation and status',
            subItems: [
                { id: 'bank_vouchers', label: 'Bank Report', view: 'bank' as MainView, tab: 'bank' },
                { id: 'raw_bank', label: 'Raw Bank', view: 'bank' as MainView, tab: 'bank' },
                { id: 'auto_match', label: 'Auto-Match', view: 'bank' as MainView, tab: 'auto-matched' },
                { id: 'missing_master', label: 'Missing Master', view: 'bank' as MainView, tab: 'missing-masters' },
                { id: 'unidentified', label: 'Un-identified', view: 'bank' as MainView, tab: 'unidentify' },
                { id: 'to_classify', label: 'To Classify', view: 'bank' as MainView, tab: 'classify' },
                { id: 'reconcile', label: 'Reconcile', view: 'bank' as MainView, tab: 'reconcile' }
            ]
        },
        { 
            id: 'ledger_report_section', 
            title: 'Ledger Report', 
            icon: BarChart3, 
            description: 'Voucher and transaction analysis',
            subItems: [
                { id: 'vouchers', label: 'Ledger Report', view: 'vouchers' as MainView },
                { id: 'day_book', label: 'Day Book', view: 'vouchers' as MainView },
                { id: 'journal_register', label: 'Journal Register', view: 'vouchers' as MainView },
                { id: 'debit_note_register', label: 'Debit Note Register', view: 'vouchers' as MainView },
                { id: 'credit_note_register', label: 'Credit Note Register', view: 'vouchers' as MainView }
            ]
        },
        { 
            id: 'item_report_section', 
            title: 'Item Report', 
            icon: BarChart3, 
            description: 'Stock summary and inventory movement',
            subItems: [
                { id: 'item_vouchers', label: 'Item Report', view: 'item-report' as MainView },
                { id: 'stock_summary', label: 'Stock Summary', view: 'item-report' as MainView },
                { id: 'item_movement', label: 'Item Movement', view: 'item-report' as MainView },
                { id: 'low_stock', label: 'Low Stock Alerts', view: 'item-report' as MainView },
                { id: 'inventory_valuation', label: 'Inventory Valuation', view: 'item-report' as MainView }
            ]
        },
        { 
            id: 'voucher_entry_section', 
            title: 'Transactions', 
            icon: BookOpen, 
            description: 'Voucher entry and accounting',
            subItems: [
                { id: 'sales_entry', label: 'Sales Entry', view: 'voucher-entry' as MainView, tab: 'sales' },
                { id: 'purchase_entry', label: 'Purchase Entry', view: 'voucher-entry' as MainView, tab: 'purchase' },
                { id: 'payment_entry', label: 'Payment Entry', view: 'voucher-entry' as MainView, tab: 'payment' },
                { id: 'receipt_entry', label: 'Receipt Entry', view: 'voucher-entry' as MainView, tab: 'receipt' },
                { id: 'journal_entry', label: 'Journal Entry', view: 'voucher-entry' as MainView, tab: 'journal' },
                { id: 'contra_entry', label: 'Contra Entry', view: 'voucher-entry' as MainView, tab: 'contra' },
                { id: 'debit_note_entry', label: 'Debit Note', view: 'voucher-entry' as MainView, tab: 'debit_note' },
                { id: 'credit_note_entry', label: 'Credit Note', view: 'voucher-entry' as MainView, tab: 'credit_note' }
            ]
        },
        { 
            id: 'inventory_entry_section', 
            title: 'Inventory Transactions', 
            icon: Package, 
            description: 'Stock journal and item movement entry',
            subItems: [
                { id: 'stock_journal_entry', label: 'Stock Journal', view: 'inventory-entry' as MainView, tab: 'stock_journal' },
                { id: 'physical_stock_entry', label: 'Physical Stock', view: 'inventory-entry' as MainView, tab: 'physical_stock' },
                { id: 'consumption_entry', label: 'Item Consumption', view: 'inventory-entry' as MainView, tab: 'consumption' },
                { id: 'scrap_entry', label: 'Item Scrap', view: 'inventory-entry' as MainView, tab: 'scrap' },
                { id: 'transfer_entry', label: 'Inter-Warehouse', view: 'inventory-entry' as MainView, tab: 'transfer' },
                { id: 'rejections_in_entry', label: 'Rejections In', view: 'inventory-entry' as MainView, tab: 'rejections_in' },
                { id: 'rejections_out_entry', label: 'Rejections Out', view: 'inventory-entry' as MainView, tab: 'rejections_out' }
            ]
        },
        { 
            id: 'financial_report_section', 
            title: 'Financial Report', 
            icon: BarChart3, 
            description: 'Balance Sheet, P&L, and Cash Flow',
            subItems: [
                { id: 'financial_vouchers', label: 'Financial Report', view: 'reports' as MainView, tab: 'pl' },
                { id: 'balance_sheet', label: 'Balance Sheet', view: 'reports' as MainView, tab: 'bs' },
                { id: 'profit_loss', label: 'Profit & Loss', view: 'reports' as MainView, tab: 'pl' },
                { id: 'cash_flow', label: 'Cash Flow', view: 'reports' as MainView, tab: 'cash_flow' },
                { id: 'bank_flow', label: 'Bank Flow', view: 'reports' as MainView, tab: 'bank_flow' },
                { id: 'trial_balance', label: 'Trial Balance', view: 'reports' as MainView, tab: 'trial_balance' },
                { id: 'sales_register', label: 'Sales Register', view: 'reports' as MainView, tab: 'sales' },
                { id: 'purchase_register', label: 'Purchase Register', view: 'reports' as MainView, tab: 'purchase' },
                { id: 'gstr1', label: 'GSTR-1 Summary', view: 'reports' as MainView, tab: 'gstr1' }
            ]
        },
    ];

    const handleRedirect = (item: any, masterId: string) => {
        const targetView = item.view || (masterId === 'item' ? 'item-master' : 'ledger-master');
        if (targetView === 'item-master' || targetView === 'ledger-master') {
            setActiveMasterTab(item.id);
        }
        if ((targetView === 'bank' || targetView === 'reports') && setReportBankActiveTab && item.tab) {
            setReportBankActiveTab(item.tab);
        }
        setView(targetView);
    };

    return (
        <div className="bg-white w-full">
            <div className="flex items-center gap-3 p-6 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                    <Settings size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Master Configuration</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage your master record preferences.</p>
                </div>
            </div>
            
            <div className="w-full">
                {masters.map((master) => {
                    const sampleItems = master.subItems.filter(s => !s.noSample);
                    const hasSampleData = sampleItems.length > 0;
                    const allActive = hasSampleData && sampleItems.every(sub => activeSamples.includes(sub.id));

                    return (
                        <div key={master.id} className={`overflow-hidden transition-all duration-300 border-b border-gray-100 ${expandedSection === master.id ? 'bg-white' : 'bg-white hover:bg-gray-50'}`}>
                            <button 
                                onClick={() => toggleSection(master.id)}
                                className="w-full flex items-center justify-between p-4 text-left transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${expandedSection === master.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-blue-600'}`}>
                                        <master.icon size={16} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-900">{master.title}</span>
                                        <p className="text-xs text-gray-400">{master.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {hasSampleData && (
                                        <div 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sampleItems.forEach(sub => {
                                                    onToggleSample(sub.id, !allActive);
                                                });
                                            }}
                                            className={`w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0 ${allActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            title={allActive ? "Disable all sample data" : "Enable all sample data"}
                                        >
                                            <div className={`bg-white w-3 h-3 rounded-full absolute top-1 shadow-sm transition-all ${allActive ? 'right-1' : 'left-1'}`}></div>
                                        </div>
                                    )}
                                    <div className={`p-1 rounded-full transition-transform duration-300 ${expandedSection === master.id ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </button>
                            
                            {expandedSection === master.id && (
                                <div className="px-6 pb-4 bg-white animate-in fade-in slide-in-from-top-1 duration-300">
                                    {master.subItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="py-3 px-4 flex items-center justify-between hover:bg-gray-50 rounded-lg group transition-colors cursor-pointer"
                                            onClick={() => handleRedirect(item, master.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs text-gray-700 font-medium">{item.label}</span>
                                                <div 
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
                                                >
                                                    <ExternalLink size={12} />
                                                </div>
                                            </div>
                                            {!item.noSample && (
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleSample(item.id);
                                                    }}
                                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0 ${activeSamples.includes(item.id) ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                >
                                                    <div className={`bg-white w-3 h-3 rounded-full absolute top-1 shadow-sm transition-all ${activeSamples.includes(item.id) ? 'right-1' : 'left-1'}`}></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
