import React, { useState, useMemo } from 'react';
import { ParsedVoucher } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    CheckCircle2, 
    XOctagon, 
    ShieldCheck, 
    RefreshCw, 
    HelpCircle, 
    TrendingUp,
    FileSpreadsheet
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface BatchVoucherApprovalViewProps {
    allVouchers: ParsedVoucher[];
    setAllVouchers: (vouchers: ParsedVoucher[]) => void;
}

export const BatchVoucherApprovalView: React.FC<BatchVoucherApprovalViewProps> = ({
    allVouchers,
    setAllVouchers
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Identify provisional entries (unauthorized or lacking audit clearance)
    const pendingVouchers = useMemo(() => {
        return allVouchers.filter(v => {
            const hasAudit = v.auditLogs && v.auditLogs.some(log => log.action === 'Confirmed AI Map');
            const narrationText = String(v.narration?.value || '').toUpperCase();
            return !hasAudit && !narrationText.includes('APPROVED') && !narrationText.includes('SECURE');
        });
    }, [allVouchers]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;

        setIsProcessing(true);
        setTimeout(() => {
            const updated = allVouchers.map(v => {
                if (selectedIds.includes(v.id)) {
                    const currentLogs = v.auditLogs || [];
                    return {
                        ...v,
                        narration: { 
                            value: `[BATCH SIGNED APPROVED] ${v.narration?.value || ''}`, 
                            confidence: '98%' as any 
                        },
                        auditLogs: [
                            ...currentLogs,
                            {
                                id: `log-${Date.now()}-${Math.random()}`,
                                action: 'Confirmed AI Map' as any,
                                timestamp: new Date().toLocaleString(),
                                user: 'Auditor Alpha',
                                details: 'Approved via Batch Authorization workshop'
                            }
                        ]
                    };
                }
                return v;
            });

            setAllVouchers(updated);
            setIsProcessing(false);
            setSelectedIds([]);

            addNotification({
                title: 'Batch Ledger Cleared',
                message: `Successfully audited, signed, and authorized ${selectedIds.length} vouchers in bulk.`,
                type: 'Alert'
            });
        }, 1200);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="text-indigo-500 w-6 h-6 animate-pulse" />
                        Batch Voucher Authorization
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Verify and sign pending ledger ledger postings instantly
                    </p>
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkApprove}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                    >
                        {isProcessing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Sign Pending ({selectedIds.length})</span>
                    </button>
                )}
            </div>

            {pendingVouchers.length > 0 ? (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-5">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={pendingVouchers.length > 0 && selectedIds.length === pendingVouchers.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(pendingVouchers.map(v => v.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Voucher Reference</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Posting Date</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Class Type</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Value Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingVouchers.map((v) => (
                                    <tr key={v.id} className="border-b last:border-0 border-gray-150/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(v.id)}
                                                onChange={() => handleToggleSelect(v.id)}
                                                className="accent-indigo-600 rounded"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                                {v.referenceNo?.value || 'PV-' + v.id.slice(0, 6).toUpperCase()}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                Party: {v.partyName?.value || 'General'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-semibold text-gray-500">
                                            {v.date?.value}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 uppercase">
                                                {v.type || 'Journal'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-xs font-black text-gray-900 dark:text-white">
                                            ₹{formatNumber(parseFloat(String(v.amount?.value || '0').replace(/,/g, '')))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                        <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">No Pending Vouchers Found</p>
                    <p className="text-[11px] text-gray-400 max-w-xs mt-2">
                        All transaction postings have cleared active security sign-off levels and are locked securely.
                    </p>
                </div>
            )}
        </div>
    );
};
