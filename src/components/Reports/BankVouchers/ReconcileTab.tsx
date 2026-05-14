import React, { useState, useMemo } from 'react';
import { ParsedVoucher, Confidence } from '../../../types';
import { CheckCircleIcon, WarningIcon } from '../../icons/IconComponents';

interface ReconcileTabProps {
    vouchers: ParsedVoucher[];
    onMapVouchers?: (ids: string[], mappingData: any) => void;
}

export const ReconcileTab: React.FC<ReconcileTabProps> = ({ vouchers, onMapVouchers }) => {
    const bankEntries = useMemo(() => vouchers.filter(v => v.origin === 'bank' || v.type === 'Bank Statement' || !!v.withdrawalAmount || !!v.depositAmount), [vouchers]);
    const bookEntries = useMemo(() => vouchers.filter(v => v.origin !== 'bank' && v.type !== 'Bank Statement' && v.type !== 'Debit Note' && v.type !== 'Credit Note' && !v.withdrawalAmount && !v.depositAmount), [vouchers]);

    const [reconciledPairs, setReconciledPairs] = useState<Record<string, string>>({}); // bankId -> bookId
    
    // To get all reconciled IDs for quick check
    const reconciledBankIds = new Set(Object.keys(reconciledPairs));
    const reconciledBookIds = new Set(Object.values(reconciledPairs));

    const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

    const handleMatchSelected = () => {
        if (selectedBankId && selectedBookId) {
            setReconciledPairs(prev => ({ ...prev, [selectedBankId]: selectedBookId }));
            setSelectedBankId(null);
            setSelectedBookId(null);
        }
    };

    const handleAutoMatchAll = () => {
        const newPairs = { ...reconciledPairs };
        bankEntries.forEach(bank => {
            if (newPairs[bank.id]) return;
            const bankAmt = Number(bank.depositAmount?.value || bank.withdrawalAmount?.value || 0);
            
            // Find EXACT matching amount in books that is NOT matched
            const match = bookEntries.find(b => 
                !Object.values(newPairs).includes(b.id) && 
                Number(b.amount?.value || 0) === bankAmt
            );
            
            if (match) {
                newPairs[bank.id] = match.id;
            }
        });
        setReconciledPairs(newPairs);
    };

    const getDiscrepancies = (bank: ParsedVoucher, book: ParsedVoucher) => {
        const issues = [];
        const bankAmt = Number(bank.depositAmount?.value || bank.withdrawalAmount?.value || 0);
        const bookAmt = Number(book.amount?.value || 0);
        
        if (bankAmt !== bookAmt) {
            issues.push(`Amount mismatch: Bank ₹${bankAmt} vs Book ₹${bookAmt}`);
        }
        
        if (bank.date?.value && book.date?.value && bank.date.value !== book.date.value) {
            issues.push(`Date mismatch: Bank ${bank.date.value} vs Book ${book.date.value}`);
        }
        return issues;
    };

    const renderBookEntry = (v: ParsedVoucher) => {
        const isMatched = reconciledBookIds.has(v.id);
        const isSelected = selectedBookId === v.id;
        
        // Find if any bank entry matched to it has discrepancies
        let discrepancies: string[] = [];
        if (isMatched) {
            const bBankId = Object.keys(reconciledPairs).find(k => reconciledPairs[k] === v.id);
            if (bBankId) {
                const bBank = bankEntries.find(b => b.id === bBankId);
                if (bBank) discrepancies = getDiscrepancies(bBank, v);
            }
        }

        return (
            <div 
                key={v.id} 
                onClick={() => !isMatched && setSelectedBookId(isSelected ? null : v.id)}
                className={`p-3 border rounded-lg mb-3 shadow-sm transition-all cursor-pointer ${
                    isMatched ? (discrepancies.length > 0 ? 'border-amber-400 bg-amber-50' : 'border-green-300 bg-green-50') : 
                    isSelected ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 bg-white hover:border-indigo-300'
                } dark:border-gray-700 dark:bg-gray-800`}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{v.date?.value}</span>
                    <span className="text-sm font-black text-gray-800 dark:text-gray-100">₹{Number(v.amount?.value || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="text-sm font-bold text-indigo-700">{v.partyName?.value || v.ledger?.value || 'Unknown Party'}</div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-1 dark:text-gray-300">{v.narration?.value}</div>
                
                {isMatched && (
                    <div className="mt-2 text-xs font-bold flex flex-col gap-1 text-green-600">
                        <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> Reconciled</span>
                        {discrepancies.map((d, i) => (
                            <span key={i} className="flex items-center text-amber-700 text-[10px] bg-amber-100/50 p-1 rounded">
                                <WarningIcon className="w-3 h-3 mr-1" /> {d}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full h-full min-h-0 overflow-hidden bg-gray-50/50 p-2">
            <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div>
                     <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Reconciliation Workspace</h2>
                     <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Match bank transactions with book entries or create direct taxable adjustment entries.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleAutoMatchAll}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        Auto-Match Exact Amounts
                    </button>
                    <button 
                        disabled={!selectedBankId || !selectedBookId}
                        onClick={handleMatchSelected}
                        className={`px-4 py-2 font-bold text-xs rounded-lg transition-colors ${selectedBankId && selectedBookId ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} dark:bg-gray-800`}
                    >
                        Match Selected ({selectedBankId && selectedBookId ? 'Ready' : 'Select one from each'})
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                {/* Bank Column */}
                <div className="w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 bg-blue-50 flex items-center justify-between dark:border-gray-700">
                        <h3 className="font-bold text-blue-900">Bank Statement ({bankEntries.length})</h3>
                        <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded font-bold">{reconciledBankIds.size} Reconciled</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {bankEntries.map(v => {
                            const amount = Number(v.depositAmount?.value || v.withdrawalAmount?.value || 0);
                            const isDeposit = Number(v.depositAmount?.value || 0) > 0;
                            const isMatched = reconciledBankIds.has(v.id);
                            const isSelected = selectedBankId === v.id;
                            
                            let discrepancies: string[] = [];
                            if (isMatched) {
                                const matchedBookId = reconciledPairs[v.id];
                                const mBook = bookEntries.find(b => b.id === matchedBookId);
                                if (mBook) discrepancies = getDiscrepancies(v, mBook);
                            }

                            return (
                                <div 
                                    key={v.id} 
                                    onClick={() => !isMatched && setSelectedBankId(isSelected ? null : v.id)}
                                    className={`p-3 border rounded-lg mb-3 shadow-sm transition-all cursor-pointer ${
                                        isMatched ? (discrepancies.length > 0 ? 'border-amber-400 bg-amber-50' : 'border-green-300 bg-green-50') : 
                                        isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'
                                    } dark:border-gray-700 dark:bg-gray-800`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{v.date?.value}</span>
                                        <span className={`text-sm font-black ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
                                            {isDeposit ? '+' : '-'}₹{amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-800 mb-2 dark:text-gray-100">{v.narration?.value || v.partyName?.value}</div>
                                    
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                        {isMatched ? (
                                            <div className="text-xs font-bold flex flex-col gap-1 text-green-600">
                                                <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> Reconciled</span>
                                                {discrepancies.map((d, i) => (
                                                    <span key={i} className="flex items-center text-amber-700 text-[10px] bg-amber-100/50 p-1 rounded">
                                                        <WarningIcon className="w-3 h-3 mr-1" /> {d}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
                                                {!isSelected ? <span className="text-xs text-gray-400 italic">Click to select to match</span> : <span className="text-xs text-blue-600 font-bold">Selected</span>}
                                                <button 
                                                    className="text-[10px] whitespace-nowrap font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onMapVouchers) {
                                                            const isDeposit = amount > 0 && Number(v.depositAmount?.value || 0) > 0;
                                                            // Provide Contra entry logic per user request
                                                            onMapVouchers([v.id], { 
                                                                [v.id]: { 
                                                                    type: 'Contra', 
                                                                    ledger: { value: isDeposit ? 'Interest Income A/c' : 'Bank Charges A/c', confidence: Confidence.High },
                                                                    isAutoMap: false,
                                                                    isConfirmedAIMap: true
                                                                } 
                                                            });
                                                        }
                                                    }}
                                                >
                                                    + {isDeposit ? 'Interest (Contra)' : 'Charges (Contra)'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {bankEntries.length === 0 && <div className="text-sm text-gray-400 text-center py-8">No bank statement entries found.</div>}
                    </div>
                </div>

                {/* Books Column */}
                <div className="w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between dark:border-gray-700 dark:bg-gray-900">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">Ledger Vouchers (Books) ({bookEntries.length})</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-bold">{reconciledBookIds.size} Reconciled</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {bookEntries.map(v => renderBookEntry(v))}
                        {bookEntries.length === 0 && <div className="text-sm text-gray-400 text-center py-8">No voucher entries found.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

