
import React, { useState, useEffect } from 'react';
import { 
    PartyMaster, 
    LedgerMaster, 
    ContactMaster,
    LocationMaster,
    CostCenterMaster,
    AccountGroupMaster
} from '../../../app/types';
import { GeneralLedgersTab } from './Tabs/GeneralLedgersTab';
import { BankMastersTab } from './Tabs/BankMastersTab';
import { ContactsTab } from './Tabs/ContactsTab';
import { GroupsTab } from './Tabs/GroupsTab';
import { LocationsTab } from './Tabs/LocationsTab';
import { CostCentersTab } from './Tabs/CostCentersTab';
import { useLanguage } from '../../../context/LanguageContext';
import { HorizontalScrollArea } from '../../shared/HorizontalScrollArea';

interface LedgerMasterViewProps {
  initialTab?: 'parties' | 'vendors' | 'partners' | 'banks' | 'ledgers' | 'contacts' | 'locations' | 'costCenters' | 'accountGroups';
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

type MasterTab = 'parties' | 'vendors' | 'partners' | 'banks' | 'ledgers' | 'contacts' | 'locations' | 'costCenters' | 'accountGroups';

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
    const { t, formatNumber } = useLanguage();
    const validTabs: MasterTab[] = [
        'ledgers', 'banks', 'contacts', 
        'locations', 'costCenters', 'accountGroups'
    ];

    const parseTab = (t: string | undefined): MasterTab => {
        if (!t) return 'contacts';
        if (t === 'parties' || t === 'vendors' || t === 'partners') {
            return 'contacts';
        }
        return validTabs.includes(t as MasterTab) ? (t as MasterTab) : 'contacts';
    };

    const [activeTab, setActiveTab ] = useState<MasterTab>(parseTab(initialTab));

    useEffect(() => {
        const parsed = parseTab(initialTab);
        if (parsed !== activeTab) {
            setActiveTab(parsed);
        }
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
        const banks = (ledgerMasters || []).filter(m => m.group?.toLowerCase().includes('bank'));
        const ledgers = (ledgerMasters || []).filter(m => !m.group?.toLowerCase().includes('bank'));

        switch (activeTab) {
            case 'ledgers':
                return <GeneralLedgersTab data={ledgers} onSave={(newL) => setLedgerMasters([...newL, ...banks])} accountGroupMasters={accountGroupMasters} />;
            case 'banks':
                return <BankMastersTab data={banks} onSave={(newB) => setLedgerMasters([...newB, ...ledgers])} accountGroupMasters={accountGroupMasters} />;
            case 'contacts':
                return (
                    <ContactsTab 
                        data={contactMasters} 
                        onSave={setContactMasters} 
                        partyMasters={partyMasters}
                        setPartyMasters={setPartyMasters}
                    />
                );
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
        <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center pr-4 relative">
                    <HorizontalScrollArea className="flex-1 min-w-0">
                        <div className="flex">
                            {[
                                { id: 'contacts', label: 'Contacts' },
                                { id: 'ledgers', label: 'General Ledgers' },
                                { id: 'banks', label: 'Bank Masters' },
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
                                    {t(tab.label)}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                                </button>
                            ))}
                        </div>
                    </HorizontalScrollArea>
                </div>
                {renderActiveTab()}
            </div>
        </div>
    );
};
