
import React, { useState, useEffect, useMemo } from 'react';
import { ParsedVoucher, VoucherType, PartyMaster, LedgerMaster, Confidence } from '../../../app/types';

import { 
    CancelIcon, 
    CheckCircleIcon, 
    MapIcon, 
    InfoIcon,
    WarningIcon,
    AccountIcon,
    SearchIcon
} from '../../icons/IconComponents';

interface MappingDialogProps {
    vouchers: ParsedVoucher[];
    isOpen: boolean;
    onClose: () => void;
    onMap: (ids: string[], mappingData: any) => void;
    partyMasters: PartyMaster[];
    ledgerMasters: LedgerMaster[];
    onCreatePartyMaster?: (name: string) => void;
    onCreateLedgerMaster?: (name: string) => void;
}

export const MappingDialog: React.FC<MappingDialogProps> = ({
    vouchers, isOpen, onClose, onMap, partyMasters, ledgerMasters, onCreatePartyMaster, onCreateLedgerMaster
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mappings, setMappings] = useState<Record<string, any>>({});
    
    // Current voucher context
    const currentVoucher = vouchers[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === vouchers.length - 1;

    // Mapping state for current
    const [targetParty, setTargetParty] = useState('');
    const [targetLedger, setTargetLedger] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [applyToAll, setApplyToAll] = useState(vouchers.length > 1);

    // Load saved mapping or auto-detect
    useEffect(() => {
        if (!currentVoucher) return;
        const saved = mappings[currentVoucher.id];
        if (saved) {
            setTargetParty(saved.partyName || '');
            setTargetLedger(saved.ledger || '');
        } else {
            const desc = String(currentVoucher.narration?.value || '').toLowerCase();
            
            // Suggest party/ledger
            const aiParty = currentVoucher.partyName?.value;
            const aiLedger = currentVoucher.ledger?.value;
            
            const matchedParty = partyMasters.find(p => desc.includes(String(p.name || '').toLowerCase()));
            setTargetParty(String(aiParty || matchedParty?.name || ''));
            
            const matchedLedger = ledgerMasters.find(l => desc.includes(String(l.name || '').toLowerCase()));
            setTargetLedger(String(aiLedger || matchedLedger?.name || ''));
        }
        setSearchTerm('');
    }, [currentVoucher, partyMasters, ledgerMasters, mappings]);

    const [selectionType, setSelectionType] = useState<'party' | 'vendor' | 'ledger'>('party');

    const handleTypeChange = (type: 'party' | 'vendor' | 'ledger') => {
        setSelectionType(type);
        setTargetParty('');
        setTargetLedger('');
    };

    const getActiveMasters = (): any[] => {
        if (selectionType === 'ledger') return ledgerMasters;
        return partyMasters.filter(p => !p.type || p.type === 'Both' || p.type === (selectionType === 'party' ? 'Customer' : 'Vendor'));
    };

    const activeSuggestions = useMemo(() => {
        if (!currentVoucher) return [];
        const query = (selectionType === 'ledger' ? targetLedger : targetParty).toLowerCase().trim();
        const desc = String(currentVoucher.narration?.value || '').toLowerCase();
        const masters = getActiveMasters();
        
        if (query) {
            // Priority 1: Match the current query entered in the search box
            return masters
                .filter(m => String(m.name || '').toLowerCase().includes(query))
                .slice(0, 5); // Show more suggestions if they are typing
        }

        // Priority 2: Fallback to auto-detection from narration if query is empty
        return masters
            .filter(m => String(m.name || '').toLowerCase().includes(desc) || desc.includes(String(m.name || '').toLowerCase()))
            .slice(0, 3);
    }, [selectionType, partyMasters, ledgerMasters, currentVoucher, targetParty, targetLedger]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMasterName, setNewMasterName] = useState('');

    const handleCreateNew = () => {
        const name = selectionType === 'ledger' ? targetLedger : targetParty;
        if (name) {
            setNewMasterName(name);
            setShowCreateModal(true);
        }
    };

    const confirmCreateMaster = () => {
        if (selectionType === 'ledger' && onCreateLedgerMaster) {
            onCreateLedgerMaster(newMasterName);
            setTargetLedger(newMasterName);
        } else if (onCreatePartyMaster) {
            onCreatePartyMaster(newMasterName);
            setTargetParty(newMasterName);
        }
        setShowCreateModal(false);
    };

    if (!isOpen || vouchers.length === 0) return null;

    const saveCurrentMapping = () => {
        setMappings(prev => ({
            ...prev,
            [currentVoucher.id]: {
                partyName: targetParty || targetLedger,
                ledger: targetLedger,
                narration: currentVoucher.narration?.value,
                bankDetails: currentVoucher.bankDetails?.value,
            }
        }));
    };

    const handleNext = () => {
        saveCurrentMapping();
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        saveCurrentMapping();
        setCurrentIndex(prev => prev - 1);
    };

    const handleFinish = () => {
        const currentMapping = {
            partyName: targetParty || targetLedger,
            ledger: targetLedger,
            narration: currentVoucher.narration?.value,
            bankDetails: currentVoucher.bankDetails?.value,
        };
        
        let finalMappings = {
            ...mappings,
            [currentVoucher.id]: currentMapping
        };

        if (applyToAll && vouchers.length > 1) {
            finalMappings = {};
            vouchers.forEach(v => {
                finalMappings[v.id] = {
                    partyName: targetParty || targetLedger,
                    ledger: targetLedger,
                    narration: v.narration?.value,
                    bankDetails: v.bankDetails?.value,
                };
            });
        }
        
        onMap(Object.keys(finalMappings), finalMappings);
        onClose();
    };  return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-gray-800">
                <div className="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
                    <div className="flex items-center">
                        <MapIcon className="mr-3 text-2xl" />
                        <div>
                            <h3 className="text-lg font-bold">Classify Transaction</h3>
                            <p className="text-xs opacity-80 font-bold uppercase tracking-widest mt-0.5">Party / Ledger Mapping</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><CancelIcon /></button>
                </div>

                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
                    {/* Transaction Preview */}
                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex-shrink-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                {currentIndex + 1} / {vouchers.length}
                            </div>
                            <div className="text-xs font-bold text-indigo-600">{String(currentVoucher.date?.value)}</div>
                        </div>
                        <div className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 dark:text-gray-100">{String(currentVoucher.narration?.value)}</div>
                        <div className="text-lg font-black text-indigo-700 font-mono">
                            ₹{Number(currentVoucher.amount?.value || currentVoucher.depositAmount?.value || currentVoucher.withdrawalAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Target Selection */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                {(['party', 'vendor', 'ledger'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => handleTypeChange(t)}
                                        className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full border transition-all ${selectionType === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'} dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="form-field-wrapper">
<label className="form-label">{selectionType} Name</label>
                                <input 
                                    className="w-full p-2 mt-1 border rounded-lg text-sm" 
                                    value={selectionType === 'ledger' ? targetLedger : targetParty}
                                    onChange={(e) => selectionType === 'ledger' ? setTargetLedger(e.target.value) : setTargetParty(e.target.value)}
                                    placeholder={`Search ${selectionType}...`}
                                />
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    {activeSuggestions.map((s, idx) => (
                                        <button key={`${s.id}-${idx}`} onClick={() => selectionType === 'ledger' ? setTargetLedger(s.name) : setTargetParty(s.name)} className="text-[9px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded dark:bg-gray-800">{s.name}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {((selectionType !== 'ledger' && targetParty && !partyMasters.some(p => String(p.name || '').toLowerCase() === targetParty.toLowerCase())) || 
                          (selectionType === 'ledger' && targetLedger && !ledgerMasters.some(l => String(l.name || '').toLowerCase() === targetLedger.toLowerCase()))) && (
                            <div className="flex items-center space-x-2 mt-2">
                               <div className="text-[10px] text-amber-600 font-bold">{selectionType} not in masters.</div>
                               <button 
                                   onClick={handleCreateNew}
                                   className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-bold transition-all"
                               >
                                   + Create New
                               </button>
                            </div>
                        )}
                        
                        {vouchers.length > 1 && (
                            <div className="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <input 
                                    type="checkbox" 
                                    id="applyToAll" 
                                    checked={applyToAll} 
                                    onChange={(e) => setApplyToAll(e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2 h-4 w-4 dark:border-gray-600"
                                />
                                <label htmlFor="applyToAll" className="text-sm font-bold text-gray-700 dark:text-gray-200">Apply to all {vouchers.length} selected statements</label>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-start bg-amber-50 p-3 rounded-xl border border-amber-100 mt-2">
                        <InfoIcon className="text-amber-500 mr-2 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                            Mapping will move this entry to the "Classify" tab for further processing.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex space-x-3 dark:bg-gray-900">
                    <button 
                        onClick={onClose}
                        className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        Discard
                    </button>
                    <div className="flex-1 flex justify-end space-x-2">
                        {!isFirst && (
                            <button onClick={handlePrev} className="px-4 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all dark:bg-gray-800">Previous</button>
                        )}
                        {!isLast ? (
                            <button 
                                onClick={handleNext}
                                disabled={!targetParty && !targetLedger}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                onClick={handleFinish}
                                disabled={!targetParty && !targetLedger}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
                            >
                                Finish & Apply
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mini Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 dark:bg-gray-800">
                        <h4 className="text-lg font-bold mb-1 text-gray-800 dark:text-gray-100">Create New {selectionType === 'ledger' ? 'Ledger' : 'Party'}</h4>
                        <p className="text-xs text-gray-500 mb-4 tracking-tight dark:text-gray-400">This will permanently add the master to your records.</p>
                        
                        <label className="form-label dark:text-gray-400">Master Name</label>
                        <input 
                            className="w-full text-base font-bold text-indigo-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-1 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-900 dark:border-gray-700"
                            value={newMasterName}
                            onChange={(e) => setNewMasterName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmCreateMaster()}
                            autoFocus
                        />
                        
                        <div className="flex space-x-3 justify-end mt-2">
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-all dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmCreateMaster}
                                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow disabled:opacity-50"
                                disabled={!newMasterName.trim()}
                            >
                                Create & Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
