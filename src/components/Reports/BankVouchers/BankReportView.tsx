import { useLanguage } from '../../../context/LanguageContext';
import React, { useState, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Printer } from 'lucide-react';
import { ParsedVoucher, VoucherType, PartyMaster, LedgerMaster, AuditLog, Confidence } from '../../../app/types';
import { 
    BankIcon,
    SearchIcon,
    DownloadIcon,
    DeleteIcon,
    EditIcon,
    MoreHorizIcon,
    VisibilityIcon,
    ContentCopyIcon,
    HistoryIcon,
    WarningIcon,
    CheckCircleIcon,
    CancelIcon,
    AccountIcon,
    MapIcon,
} from '../../icons/IconComponents';

import { ReconcileTab } from './ReconcileTab';
import { MappingDialog } from './MappingDialog';
import { BankStatementTable } from './BankStatementTable';
import { BankReportModals } from './BankReportModals';
import { matchVoucher, matchVoucherAsync } from '../../../services/matching';

import { ImportExportButtons } from '../../shared/ImportExportButtons';

interface BankReportViewProps {
  vouchers: ParsedVoucher[];
  partyMasters: PartyMaster[];
  ledgerMasters: LedgerMaster[];
  onDuplicate: (voucher: ParsedVoucher) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkEdit?: (ids: string[]) => void;
  onMapVouchers?: (ids: string[], data: any) => void;
  onView: (voucher: ParsedVoucher) => void;
  onImportVoucher: (type: VoucherType) => void;
  onNavigateToMasters: () => void;
  onCreatePartyMaster?: (name: string) => void;
  onCreateLedgerMaster?: (name: string) => void;
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
  setVouchers?: (data: any[]) => void;
}

export const BankReportView: React.FC<BankReportViewProps> = ({ 
    vouchers, 
    partyMasters,
    ledgerMasters,
    onDuplicate, 
    onDelete, 
    onBulkDelete,
    onBulkEdit,
    onMapVouchers,
    onView,
    onImportVoucher,
    onNavigateToMasters,
    onCreatePartyMaster,
    onCreateLedgerMaster,
    defaultTab,
    onTabChange,
    setVouchers
}) => {
  const { t, formatNumber  } = useLanguage();

    vouchers = vouchers || [];
    partyMasters = partyMasters || [];
    ledgerMasters = ledgerMasters || [];

    const [activeTab, setActiveTab] = useState<'bank' | 'classify' | 'reconcile' | 'auto-matched' | 'missing-masters' | 'unidentify'>((defaultTab as any) || 'bank');
    
    useEffect(() => {
        if (defaultTab && defaultTab !== activeTab) {
            setActiveTab(defaultTab as any);
        }
    }, [defaultTab, activeTab]);

    useEffect(() => {
        const scrollToTab = () => {
            const el = document.getElementById(`bank-tab-${activeTab}`);
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

    const handleTabClick = (tab: any) => {
        setActiveTab(tab);
        if (onTabChange) onTabChange(tab);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [mappingVouchers, setMappingVouchers] = useState<ParsedVoucher[]>([]);
    const [selectedAuditVoucher, setSelectedAuditVoucher] = useState<ParsedVoucher | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ 
        isOpen: boolean; 
        ids: string[]; 
        isBulk: boolean;
        message: string;
    } | null>(null);
    const [isRunningAI, setIsRunningAI] = useState(false);
    const [showAIConfirm, setShowAIConfirm] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const derivesFromBank = (v: ParsedVoucher) => v && (v.origin === 'bank' || v.type === VoucherType.BankStatement || !!v.withdrawalAmount || !!v.depositAmount);
    
    const hasLedgerOrParty = (v: ParsedVoucher) => {
        if (!v) return false;
        // If it's bank-derived, use the isMismatch flag which is set by the matching engine
        if (v.partyName?.value) return !v.partyName.isMismatch;
        if (v.ledger?.value) return !v.ledger.isMismatch;
        if (v.toAccount?.value) return !v.toAccount.isMismatch;
        if (v.fromAccount?.value) return !v.fromAccount.isMismatch;
        return false;
    };

    const getExtractedName = (v: ParsedVoucher) => {
        if (!v) return '';
        return v.partyName?.value || v.ledger?.value || v.toAccount?.value || v.fromAccount?.value || '';
    };

    const hasIdentifiedName = (v: ParsedVoucher) => !!getExtractedName(v);

    const matchesMaster = (v: ParsedVoucher) => {
        if (!v) return false;
        if (v.partyName?.value) return !v.partyName.isMismatch;
        if (v.ledger?.value) return !v.ledger.isMismatch;
        if (v.toAccount?.value) return !v.toAccount.isMismatch;
        if (v.fromAccount?.value) return !v.fromAccount.isMismatch;
        return false;
    };

    const isBankRaw = (v: ParsedVoucher) => derivesFromBank(v);
    const isToClassify = (v: ParsedVoucher) => derivesFromBank(v) && !hasLedgerOrParty(v);

    const runAutoMatch = useCallback(async (forceReMatch = false) => {
        setIsRunningAI(true);
        const autoMapIds: string[] = [];
        const autoMappings: Record<string, any> = {};
        
        const listToProcess = vouchers.filter(v => derivesFromBank(v) && (forceReMatch || !hasLedgerOrParty(v)));
        
        const results = await Promise.all(
            listToProcess.map(async (v) => {
                const newMapping = await matchVoucherAsync(v, partyMasters, ledgerMasters);
                return { id: v.id, mapping: newMapping };
            })
        );
        
        results.forEach(({ id, mapping }) => {
            if (Object.keys(mapping).length > 0) {
                const values = Object.values(mapping);
                const hasHigh = values.some(m => m && (m as any).confidence === Confidence.High);
                const hasLowOrMismatch = values.some(m => m && ((m as any).confidence === Confidence.Low || (m as any).isMismatch));

                if (forceReMatch || (hasHigh && !hasLowOrMismatch)) {
                    autoMappings[id] = { ...mapping, isAutoMap: true };
                    autoMapIds.push(id);
                }
            }
        });

        if (autoMapIds.length > 0 && onMapVouchers) {
            onMapVouchers(autoMapIds, autoMappings);
        }
        
        setIsRunningAI(false);
    }, [vouchers, partyMasters, ledgerMasters, onMapVouchers]);

    useEffect(() => {
        if (activeTab === 'classify') {
            runAutoMatch(); 
        }
        // Only run when switching to this tab
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const filteredVouchers = vouchers.filter(v => {
        if (!v || !derivesFromBank(v)) return false;
        
        if (v.sampleSetId) {
            if (activeTab === 'bank' && !['bank_vouchers', 'raw_bank'].includes(v.sampleSetId)) return false;
            if (activeTab === 'classify' && v.sampleSetId !== 'to_classify') return false;
            if (activeTab === 'auto-matched' && v.sampleSetId !== 'auto_match') return false;
            if (activeTab === 'missing-masters' && v.sampleSetId !== 'missing_master') return false;
            if (activeTab === 'unidentify' && v.sampleSetId !== 'unidentified') return false;
            // reconcile is handled separately, but just in case:
            if (activeTab === 'reconcile' && v.sampleSetId !== 'reconcile') return false;
        }

        let matchesTab = false;
        if (activeTab === 'bank') matchesTab = isBankRaw(v);
        else if (activeTab === 'classify') matchesTab = isToClassify(v);
        else if (activeTab === 'reconcile') matchesTab = false;
        else if (activeTab === 'auto-matched') {
            const hasName = hasIdentifiedName(v);
            const isMatched = matchesMaster(v);
            matchesTab = hasName && isMatched;
        }
        else if (activeTab === 'missing-masters') {
            const hasName = hasIdentifiedName(v);
            const isMatched = matchesMaster(v);
            matchesTab = hasName && !isMatched;
        }
        else if (activeTab === 'unidentify') {
            matchesTab = !hasIdentifiedName(v);
        }
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = String(v.partyName?.value || v.narration?.value || '').toLowerCase().includes(searchLower) ||
            String(v.id || '').toLowerCase().includes(searchLower) ||
            String(v.ledger?.value || '').toLowerCase().includes(searchLower) ||
            String(v.paymentMode?.value || '').toLowerCase().includes(searchLower);
        return matchesTab && matchesSearch;
    });

    const handleBulkExport = () => {
        const selectedVouchers = vouchers.filter(v => selectedIds.includes(v.id));
        const data = selectedVouchers.map(v => ({
            Date: v.date?.value,
            ID: v.tempImportId || v.id,
            Type: v.type,
            "Payment Mode": v.paymentMode?.value || "",
            Party: v.partyName?.value || v.narration?.value,
            Amount: v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "BankStatements");
        XLSX.writeFile(wb, `BharatBook_BankExport_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleBulkDelete = () => {
        if (onBulkDelete) {
            setDeleteConfirmation({
                isOpen: true,
                ids: selectedIds,
                isBulk: true,
                message: `Are you sure you want to delete ${selectedIds.length} statements? This action cannot be undone.`
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteConfirmation) return;
        
        if (deleteConfirmation.isBulk) {
            if (onBulkDelete) {
                onBulkDelete(deleteConfirmation.ids);
                setSelectedIds([]);
            }
        } else {
            onDelete(deleteConfirmation.ids[0]);
        }
        setDeleteConfirmation(null);
    };

    const completeSave = (data: any[]) => {
        if (!setVouchers) return;
        const nonBank = vouchers.filter(v => v.type !== VoucherType.BankStatement && v.origin !== 'bank');
        setVouchers([...nonBank, ...data]);
    };

    const bankVouchers = vouchers.filter(v => derivesFromBank(v));

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500 print-area">
            <div className="mb-2 border-b border-gray-200 flex-shrink-0 overflow-x-auto overflow-y-hidden custom-scrollbar dark:border-gray-700 no-print">
                <nav className="-mb-px flex space-x-8 min-w-max px-2" aria-label="Tabs">
                    {['bank', 'auto-matched', 'missing-masters', 'unidentify', 'classify', 'reconcile'].map((tab) => (
                        <button
                            key={tab}
                            id={`bank-tab-${tab}`}
                            onClick={() => {
                                handleTabClick(tab as any);
                                setSelectedIds([]);
                            }}
                            className={`
                                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-colors capitalize
                                ${activeTab === tab 
                                    ? 'border-indigo-500 text-indigo-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                             dark:text-gray-400`}
                        >
                            {tab === 'bank' ? t('Raw Bank') : tab === 'classify' ? t('To Classify') : tab === 'reconcile' ? t('Reconcile') : tab === 'auto-matched' ? t('Auto-Matched') : tab === 'missing-masters' ? t('Missing Masters') : t('Unidentify')}
                        </button>
                    ))}
                </nav>
            </div>
            
            {activeTab !== 'reconcile' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative flex-1 flex flex-col min-h-0 dark:bg-gray-800 dark:border-gray-700">
                    {selectedIds.length > 0 && (
                        <div className="absolute top-0 inset-x-0 bg-indigo-600 text-white p-3 z-30 flex items-center justify-between animate-in slide-in-from-top duration-300 no-print">
                            <div className="flex items-center text-sm font-bold">
                                <span className="bg-indigo-800 px-2 py-1 rounded mr-3">{selectedIds.length}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => setMappingVouchers(vouchers.filter(v => selectedIds.includes(v.id)))} title="Bulk Map" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Map"><MapIcon className="text-xl" /></button>
                                <button onClick={() => onBulkEdit?.(selectedIds)} title="Bulk Edit" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Edit"><EditIcon className="text-xl" /></button>
                                <button onClick={handleBulkExport} title="Bulk Export" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Export"><DownloadIcon className="text-xl" /></button>
                                <button onClick={handleBulkDelete} title="Bulk Delete" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Delete"><DeleteIcon className="text-xl" /></button>
                                <button onClick={() => setSelectedIds([])} title="Cancel" className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg transition-all" aria-label="Cancel"><CancelIcon className="text-xl" /></button>
                            </div>
                        </div>
                    )}
                    <div className="p-4 border-b border-gray-100 flex-shrink-0 flex items-center justify-between dark:border-gray-800 no-print">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative max-w-md w-full">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder={t("Search statements...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                                />
                            </div>
                            <ImportExportButtons data={bankVouchers} onSave={completeSave} entityName="BankStatements" />
                            <button onClick={(e) => { e.currentTarget.blur(); setTimeout(() => window.print(), 100); }} className="bg-white text-gray-700 border border-gray-200 px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-sm whitespace-nowrap hover:bg-gray-50 active:scale-95 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:dark:bg-gray-700">
                                <Printer className="text-[18px] leading-none lg:mr-2" />
                                <span className="hidden lg:inline-block">{t("Print")}</span>
                            </button>
                        </div>
                        <button 
                            disabled={isRunningAI || vouchers.length === 0}
                            onClick={() => setShowAIConfirm(true)} 
                            className={`font-bold px-4 py-2 text-xs rounded-lg uppercase tracking-wider flex items-center border transition-all ml-4 whitespace-nowrap ${
                                isRunningAI || vouchers.length === 0
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 shadow-sm active:scale-95'
                            } dark:bg-gray-800 dark:border-gray-700`}
                        >
                           {isRunningAI ? (
                               <>
                                   <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2" />
                                   Processing...
                               </>
                           ) : (
                               <>⚡ Run AI Auto-Match</>
                           )}
                        </button>
                    </div>
                    <BankStatementTable 
                        vouchers={vouchers}
                        filteredVouchers={filteredVouchers}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                        onView={onView}
                        onDuplicate={onDuplicate}
                        setMappingVouchers={setMappingVouchers}
                        setSelectedAuditVoucher={setSelectedAuditVoucher}
                        setDeleteConfirmation={setDeleteConfirmation}
                    />
                </div>
            )}
            
            {activeTab === 'reconcile' && (
                <ReconcileTab vouchers={vouchers.filter(v => !v.sampleSetId || v.sampleSetId === 'reconcile')} onMapVouchers={onMapVouchers} />
            )}
            
            <BankReportModals 
                selectedAuditVoucher={selectedAuditVoucher}
                setSelectedAuditVoucher={setSelectedAuditVoucher}
                deleteConfirmation={deleteConfirmation}
                setDeleteConfirmation={setDeleteConfirmation}
                confirmDelete={confirmDelete}
                showAIConfirm={showAIConfirm}
                setShowAIConfirm={setShowAIConfirm}
                runAutoMatch={runAutoMatch}
                isRunningAI={isRunningAI}
            />

            {mappingVouchers.length > 0 && (
                <MappingDialog 
                    vouchers={mappingVouchers}
                    isOpen={mappingVouchers.length > 0}
                    onClose={() => setMappingVouchers([])}
                    onMap={(ids, data) => { 
                        onMapVouchers?.(ids, data);
                        setSelectedIds([]); 
                    }}
                    partyMasters={partyMasters}
                    ledgerMasters={ledgerMasters}
                    onCreatePartyMaster={onCreatePartyMaster}
                    onCreateLedgerMaster={onCreateLedgerMaster}
                />
            )}
        </div>
    );
};
