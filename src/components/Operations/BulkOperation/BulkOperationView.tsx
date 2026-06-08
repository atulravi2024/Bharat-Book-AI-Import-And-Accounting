import React, { useState, useEffect, useRef } from 'react';
import { ItemMaster, ParsedVoucher, PartyMaster, LedgerMaster, GstMaster } from '../../../app/types';
import { useLanguage } from '../../../context/LanguageContext';
import { SystemDecideView } from './SystemDecideView';
import { AnomalyDetectionView } from './views/AnomalyDetectionView';
import { AutoReconciliationView } from './views/AutoReconciliationView';
import { SmartCategorizationView } from './views/SmartCategorizationView';
import { BulkTaxUpdateView } from './views/BulkTaxUpdateView';
import { BatchVoucherApprovalView } from './views/BatchVoucherApprovalView';
import { BulkEwayBillView } from './views/BulkEwayBillView';
import { MassDataArchivalView } from './views/MassDataArchivalView';
import { DateOffsetRepairView } from './views/DateOffsetRepairView';
import { ContactGroupingView } from './views/ContactGroupingView';
import { CurrencyRevaluationView } from './views/CurrencyRevaluationView';
import { GstinVerifyAlignView } from './views/GstinVerifyAlignView';
import { InventoryRevalView } from './views/InventoryRevalView';
import { NewBulkOperationView } from './views/NewBulkOperationView';

interface BulkOperationViewProps {
    itemMasters: ItemMaster[];
    setItemMasters: (items: ItemMaster[]) => void;
    allVouchers: ParsedVoucher[];
    setAllVouchers: (vouchers: ParsedVoucher[]) => void;
    partyMasters: PartyMaster[];
    setPartyMasters: (parties: PartyMaster[]) => void;
    ledgerMasters: LedgerMaster[];
    setLedgerMasters: (ledgers: LedgerMaster[]) => void;
    gstMasters: GstMaster[];
    setGstMasters: (gsts: GstMaster[]) => void;
    defaultTab?: string | null;
    onTabChange?: (tab: string) => void;
}

export const BulkOperationView: React.FC<BulkOperationViewProps> = ({ 
    itemMasters, 
    setItemMasters,
    allVouchers,
    setAllVouchers,
    partyMasters,
    setPartyMasters,
    ledgerMasters,
    setLedgerMasters,
    gstMasters,
    setGstMasters,
    defaultTab,
    onTabChange
}) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTabLocal] = useState(defaultTab || 'pricing');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
        if (defaultTab && defaultTab !== activeTab) {
            setActiveTabLocal(defaultTab);
        }
    }, [defaultTab]);

    useEffect(() => {
        const activeButtonElement = tabsRef.current[activeTab];
        if (activeButtonElement && scrollContainerRef.current) {
            // Horizontal scroll tracking without shifting the entire page
            const container = scrollContainerRef.current;
            const buttonRect = activeButtonElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const scrollLeft = activeButtonElement.offsetLeft - container.offsetWidth / 2 + activeButtonElement.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [activeTab]);

    const setActiveTab = (tab: string) => {
        setActiveTabLocal(tab);
        if (onTabChange) onTabChange(tab);
    };

    const navItems = [
        { id: 'pricing', label: 'Smart Pricing Strategy' },
        { id: 'anomaly-detection', label: 'AI Anomaly Detection' },
        { id: 'auto-reconcile', label: 'Smart Reconcile' },
        { id: 'smart-category', label: 'Auto Categorize' },
        { id: 'tax-updater', label: 'Bulk Tax Update' },
        { id: 'batch-approval', label: 'Batch Approvals' },
        { id: 'eway-batch', label: 'Batch E-Invoice' },
        { id: 'mass-archive', label: 'Mass Archival' },
        { id: 'date-repair', label: 'Date Repair' },
        { id: 'contact-group', label: 'Party Categorization' },
        { id: 'currency-reval', label: 'Currency Revaluation' },
        { id: 'gstin-align', label: 'GSTIN Verification' },
        { id: 'inventory-reval', label: 'Inventory Reval' },
        { id: 'new-operation', label: 'New' }
    ];

    return (
        <div className="w-full h-full flex flex-col bg-gray-50/30 dark:bg-gray-900/10">
            {/* Header Navigation */}
            <div className="bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700/50 sticky top-0 z-15">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div 
                        ref={scrollContainerRef}
                        className="flex space-x-1 sm:space-x-8 overflow-x-auto custom-scrollbar no-scrollbar py-1 scroll-smooth"
                    >
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                ref={(el) => { tabsRef.current[item.id] = el; }}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    whitespace-nowrap py-3 sm:py-4 px-3 sm:px-1 border-b-2 font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all
                                    ${activeTab === item.id
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'pricing' && (
                    <SystemDecideView 
                        itemMasters={itemMasters}
                        setItemMasters={setItemMasters}
                    />
                )}
                {activeTab === 'anomaly-detection' && (
                    <AnomalyDetectionView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                        partyMasters={partyMasters}
                    />
                )}
                {activeTab === 'auto-reconcile' && (
                    <AutoReconciliationView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'smart-category' && (
                    <SmartCategorizationView 
                        itemMasters={itemMasters}
                        setItemMasters={setItemMasters}
                    />
                )}
                {activeTab === 'tax-updater' && (
                    <BulkTaxUpdateView 
                        itemMasters={itemMasters}
                        setItemMasters={setItemMasters}
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'batch-approval' && (
                    <BatchVoucherApprovalView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'eway-batch' && (
                    <BulkEwayBillView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'mass-archive' && (
                    <MassDataArchivalView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'date-repair' && (
                    <DateOffsetRepairView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'contact-group' && (
                    <ContactGroupingView 
                        partyMasters={partyMasters}
                        setPartyMasters={setPartyMasters}
                    />
                )}
                {activeTab === 'currency-reval' && (
                    <CurrencyRevaluationView 
                        allVouchers={allVouchers}
                        setAllVouchers={setAllVouchers}
                    />
                )}
                {activeTab === 'gstin-align' && (
                    <GstinVerifyAlignView 
                        partyMasters={partyMasters}
                        setPartyMasters={setPartyMasters}
                    />
                )}
                {activeTab === 'inventory-reval' && (
                    <InventoryRevalView 
                        itemMasters={itemMasters}
                        setItemMasters={setItemMasters}
                    />
                )}
                {activeTab === 'new-operation' && (
                    <NewBulkOperationView />
                )}
            </div>
        </div>
    );
};

