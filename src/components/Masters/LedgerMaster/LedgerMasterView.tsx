
import React, { useState, useEffect } from 'react';
import { 
    PartyMaster, 
    LedgerMaster, 
    ContactMaster,
    LocationMaster,
    CostCenterMaster,
    AccountGroupMaster
} from '../../../types';
import { CustomersTab } from './Tabs/CustomersTab';
import { VendorsTab } from './Tabs/VendorsTab';
import { GeneralLedgersTab } from './Tabs/GeneralLedgersTab';
import { BankMastersTab } from './Tabs/BankMastersTab';
import { ContactsTab } from './Tabs/ContactsTab';
import { GroupsTab } from './Tabs/GroupsTab';
import { LocationsTab } from './Tabs/LocationsTab';
import { CostCentersTab } from './Tabs/CostCentersTab';

interface LedgerMasterViewProps {
  initialTab?: 'parties' | 'vendors' | 'banks' | 'ledgers' | 'contacts' | 'locations' | 'costCenters' | 'accountGroups';
  partyMasters: PartyMaster[];
  ledgerMasters: LedgerMaster[];
  contactMasters: ContactMaster[];
  locationMasters: LocationMaster[];
  costCenterMasters: CostCenterMaster[];
  accountGroupMasters: AccountGroupMaster[];
  setPartyMasters: (masters: PartyMaster[]) => void;
  setLedgerMasters: (masters: LedgerMaster[]) => void;
  setContactMasters: (masters: ContactMaster[]) => void;
  setLocationMasters: (masters: LocationMaster[]) => void;
  setCostCenterMasters: (masters: CostCenterMaster[]) => void;
  setAccountGroupMasters: (masters: AccountGroupMaster[]) => void;
}

type MasterTab = 'parties' | 'vendors' | 'banks' | 'ledgers' | 'contacts' | 'locations' | 'costCenters' | 'accountGroups';

export const LedgerMasterView: React.FC<LedgerMasterViewProps> = ({
  partyMasters,
  ledgerMasters,
  contactMasters,
  locationMasters,
  costCenterMasters,
  accountGroupMasters,
  setPartyMasters,
  setLedgerMasters,
  setContactMasters,
  setLocationMasters,
  setCostCenterMasters,
  setAccountGroupMasters,
  initialTab
}) => {
    const [activeTab, setActiveTab] = useState<MasterTab>(initialTab || 'parties');

    useEffect(() => {
        if (initialTab && initialTab !== activeTab) setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        const scrollToTab = () => {
            const el = document.getElementById(`ledger-master-tab-${activeTab}`);
            const container = el?.closest('.overflow-x-auto') as HTMLElement;
            if (el && container) {
                const cRect = container.getBoundingClientRect();
                const eRect = el.getBoundingClientRect();
                if (cRect.width === 0 || eRect.width === 0) return;
                
                const offset = (eRect.left + eRect.width / 2) - (cRect.left + cRect.width / 2);
                
                if (Math.abs(offset) > 2) {
                    container.scrollBy({ left: offset, behavior: 'smooth' });
                }
            }
        };

        scrollToTab();
        const t1 = setTimeout(scrollToTab, 100);
        const t2 = setTimeout(scrollToTab, 300);
        const t3 = setTimeout(scrollToTab, 500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [activeTab]);

    const renderActiveTab = () => {
        const customers = (partyMasters || []).filter(m => m.type !== 'Vendor');
        const vendors = (partyMasters || []).filter(m => m.type === 'Vendor');
        const banks = (ledgerMasters || []).filter(m => m.group?.toLowerCase().includes('bank'));
        const ledgers = (ledgerMasters || []).filter(m => !m.group?.toLowerCase().includes('bank'));

        switch (activeTab) {
            case 'parties':
                return <CustomersTab data={customers} onSave={(newC) => setPartyMasters([...newC, ...vendors])} />;
            case 'vendors':
                return <VendorsTab data={vendors} onSave={(newV) => setPartyMasters([...newV, ...customers])} />;
            case 'ledgers':
                return <GeneralLedgersTab data={ledgers} onSave={(newL) => setLedgerMasters([...newL, ...banks])} />;
            case 'banks':
                return <BankMastersTab data={banks} onSave={(newB) => setLedgerMasters([...newB, ...ledgers])} />;
            case 'contacts':
                return <ContactsTab data={contactMasters} onSave={setContactMasters} />;
            case 'accountGroups':
                return <GroupsTab data={accountGroupMasters} onSave={setAccountGroupMasters} />;
            case 'locations':
                return <LocationsTab data={locationMasters} onSave={setLocationMasters} />;
            case 'costCenters':
                return <CostCentersTab data={costCenterMasters} onSave={setCostCenterMasters} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <header className="mb-8 text-left">
                <h1 className="text-3xl font-black text-gray-900 font-display dark:text-white">Relational Master Directory</h1>
                <p className="text-gray-500 mt-2 font-medium dark:text-gray-400">Configure and manage your financial ecosystem: parties, ledgers, and organizational units.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto custom-scrollbar justify-between items-center pr-4">
                    <div className="flex">
                        {[
                            { id: 'parties', label: 'Customers' },
                            { id: 'vendors', label: 'Vendors' },
                            { id: 'ledgers', label: 'General Ledgers' },
                            { id: 'banks', label: 'Bank Masters' },
                            { id: 'contacts', label: 'Contacts' },
                            { id: 'accountGroups', label: 'Groups' },
                            { id: 'locations', label: 'Locations' },
                            { id: 'costCenters', label: 'Cost Centers' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                id={`ledger-master-tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id as MasterTab)}
                                className={`px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                {renderActiveTab()}
            </div>
        </div>
    );
};
