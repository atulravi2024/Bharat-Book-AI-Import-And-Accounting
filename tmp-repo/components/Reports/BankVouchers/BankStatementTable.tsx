import React from 'react';
import { ParsedVoucher, VoucherType, Confidence } from '../../../types';
import { 
    MoreHorizIcon, 
    EditIcon, 
    DeleteIcon, 
    ContentCopyIcon, 
    HistoryIcon,
    CheckCircleIcon,
    WarningIcon,
    MapIcon,
} from '../../icons/IconComponents';

interface BankStatementTableProps {
    vouchers: ParsedVoucher[];
    filteredVouchers: ParsedVoucher[];
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    onView: (voucher: ParsedVoucher) => void;
    onDuplicate: (voucher: ParsedVoucher) => void;
    setMappingVouchers: (vouchers: ParsedVoucher[]) => void;
    setSelectedAuditVoucher: (voucher: ParsedVoucher) => void;
    setDeleteConfirmation: (data: any) => void;
}

const ConfidenceIndicator = ({ confidence }: { confidence?: Confidence }) => {
    if (!confidence) return null;
    if (confidence === Confidence.High) return <div title="High Confidence" className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block ml-1 opacity-80" />;
    if (confidence === Confidence.Medium) return <div title="Medium Confidence" className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block ml-1 opacity-80" />;
    if (confidence === Confidence.Low) return <div title="Low Confidence" className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block ml-1 opacity-80" />;
    return null;
};

export const BankStatementTable: React.FC<BankStatementTableProps> = ({
    vouchers,
    filteredVouchers,
    selectedIds,
    setSelectedIds,
    expandedId,
    setExpandedId,
    onView,
    onDuplicate,
    setMappingVouchers,
    setSelectedAuditVoucher,
    setDeleteConfirmation
}) => {
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredVouchers.length && filteredVouchers.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredVouchers.map(v => v.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const hasLedgerOrParty = (v: ParsedVoucher) => {
        if (!v) return false;
        const hasParty = !!v.partyName?.value;
        const hasLedger = !!v.ledger?.value;
        const hasFromAccount = !!v.fromAccount?.value;
        const hasToAccount = !!v.toAccount?.value;
        return hasParty || hasFromAccount || hasToAccount || hasLedger;
    };

    const mappedName = (v: ParsedVoucher) => v.partyName?.value || v.toAccount?.value || v.fromAccount?.value;

    return (
        <div className="overflow-x-auto overflow-y-visible flex-1">
            <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                <thead className="bg-gray-50 text-gray-400">
                    <tr>
                        <th className="px-6 py-4 text-left w-10">
                            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" checked={selectedIds.length === filteredVouchers.length && filteredVouchers.length > 0} onChange={toggleSelectAll} />
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Import ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Time</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Mode</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Narration/Description</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Withdrawal</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Deposit</th>
                        <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {filteredVouchers.map(v => {
                        const isMapped = hasLedgerOrParty(v);
                        const name = mappedName(v);
                        return (
                            <React.Fragment key={v.id}>
                                <tr className={`${isMapped ? 'bg-indigo-50/10' : 'hover:bg-indigo-50/30'} transition-colors ${expandedId === v.id ? 'bg-indigo-50/40' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" checked={selectedIds.includes(v.id)} onChange={() => toggleSelect(v.id)} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600 font-bold cursor-pointer" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}>
                                        {v.tempImportId ? `#${v.tempImportId}` : `#${String(v.id || '').includes('copy') ? 'COPY' : (String(v.id || '').split('-')[1] || '---')}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {String(v.date?.value || '-')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                                        {v.time?.value || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {v.paymentMode?.value ? (
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                v.paymentMode.value === 'UPI' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                v.paymentMode.value === 'Cheque' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                v.paymentMode.value === 'Auto Debit' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                                {v.paymentMode.value}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 text-[10px]">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs cursor-pointer" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}>
                                        {isMapped ? (
                                            <div className="flex flex-col">
                                                <span className="font-bold text-indigo-700 truncate max-w-[150px] flex items-center" title={name}>
                                                    {name}
                                                    <ConfidenceIndicator confidence={v.partyName?.confidence || v.toAccount?.confidence || v.fromAccount?.confidence} />
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{v.narration?.value}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-800">{String(v.narration?.value || 'N/A')}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-red-600 font-mono whitespace-nowrap">
                                        <div className="flex items-center justify-end">
                                            {Number(v.withdrawalAmount?.value || 0) > 0 ? `₹${Number(v.withdrawalAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                                            <ConfidenceIndicator confidence={v.withdrawalAmount?.confidence} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-green-600 font-mono whitespace-nowrap">
                                        <div className="flex items-center justify-end">
                                            {Number(v.depositAmount?.value || 0) > 0 ? `₹${Number(v.depositAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                                            <ConfidenceIndicator confidence={v.depositAmount?.confidence} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button 
                                                onClick={() => setMappingVouchers([v])}
                                                title={isMapped ? "Edit Mapping" : "Map Transaction"}
                                                className={`p-1.5 rounded-full transition-colors ${
                                                    isMapped ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50 text-indigo-600'
                                                }`}
                                            >
                                                <MapIcon />
                                            </button>
                                            <button 
                                                onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                                                title="Expand Details"
                                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                                            >
                                                <MoreHorizIcon />
                                            </button>
                                            <button 
                                                onClick={() => onView(v)}
                                                title="View & Edit Full Voucher"
                                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button 
                                                onClick={() => onDuplicate(v)}
                                                title="Duplicate"
                                                className="p-1.5 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
                                            >
                                                <ContentCopyIcon />
                                            </button>
                                            <button 
                                                onClick={() => setSelectedAuditVoucher(v)}
                                                title="Audit Trail"
                                                className="p-1.5 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
                                            >
                                                <HistoryIcon />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteConfirmation({ isOpen: true, ids: [v.id], isBulk: false, message: 'Are you sure you want to delete this statement?' })}
                                                title="Delete"
                                                className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedId === v.id && (
                                    <tr className="bg-indigo-50/10 border-b border-indigo-100">
                                        <td colSpan={9} className="px-8 py-6">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Narration</label>
                                                        <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-gray-200">{v.narration?.value || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">AI Discrepancies</label>
                                                        {v.aiSummary?.discrepancies && v.aiSummary.discrepancies.length > 0 ? (
                                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                                                                {v.aiSummary.discrepancies.map((d, i) => (
                                                                    <div key={i} className="flex text-xs text-amber-800 items-start">
                                                                        <WarningIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
                                                                        <span>{d}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center text-xs text-green-700">
                                                                <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                                                No AI discrepancies found
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Transaction Type</label>
                                                        <p className="text-sm font-bold text-gray-800">{v.type}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Extracted Party</label>
                                                        <p className="text-sm font-bold text-indigo-700">{v.partyName?.value || 'Unidentified'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Extracted Ledger</label>
                                                        <p className="text-sm font-bold text-indigo-700">{v.ledger?.value || 'Unidentified'}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">REF / Invoice Number</label>
                                                        <p className="text-sm font-mono text-gray-700 bg-gray-100 p-2 rounded inline-block">{v.referenceNo?.value || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Client-Side Validation</label>
                                                        <div className="space-y-2">
                                                            <div className={`flex text-xs items-center ${String(v.date?.value).match(/^\d{4}-\d{2}-\d{2}$/)? 'text-green-600' : 'text-red-500 font-bold'}`}>
                                                                {String(v.date?.value).match(/^\d{4}-\d{2}-\d{2}$/) ? <CheckCircleIcon className="w-3" /> : <WarningIcon className="w-3" />}
                                                                <span className="ml-1">Date Format (YYYY-MM-DD): {String(v.date?.value).match(/^\d{4}-\d{2}-\d{2}$/) ? 'Valid' : 'Invalid'}</span>
                                                            </div>
                                                            <div className={`flex text-xs items-center ${isNaN(Number(v.withdrawalAmount?.value || v.depositAmount?.value)) ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                                                                {!isNaN(Number(v.withdrawalAmount?.value || v.depositAmount?.value)) ? <CheckCircleIcon className="w-3" /> : <WarningIcon className="w-3" />}
                                                                <span className="ml-1">Amount is Numeric: {!isNaN(Number(v.withdrawalAmount?.value || v.depositAmount?.value)) ? 'Valid' : 'Invalid'}</span>
                                                            </div>
                                                            <div className={`flex text-xs items-center ${['Payment', 'Receipt', 'Contra', 'Journal', 'Sales', 'Purchase'].includes(String(v.type)) ? 'text-green-600' : 'text-red-500 font-bold'}`}>
                                                                {['Payment', 'Receipt', 'Contra', 'Journal', 'Sales', 'Purchase'].includes(String(v.type)) ? <CheckCircleIcon className="w-3" /> : <WarningIcon className="w-3" />}
                                                                <span className="ml-1">Transaction Type: {['Payment', 'Receipt', 'Contra', 'Journal', 'Sales', 'Purchase'].includes(String(v.type)) ? 'Valid' : 'Invalid'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
