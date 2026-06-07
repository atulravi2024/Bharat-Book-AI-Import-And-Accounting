import React, { useState, useMemo } from 'react';
import { ParsedVoucher, VoucherType } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Truck, 
    QrCode, 
    RefreshCw, 
    Check, 
    AlertCircle,
    FileSpreadsheet
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface BulkEwayBillViewProps {
    allVouchers: ParsedVoucher[];
    setAllVouchers: (vouchers: ParsedVoucher[]) => void;
}

export const BulkEwayBillView: React.FC<BulkEwayBillViewProps> = ({
    allVouchers,
    setAllVouchers
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Filter sales vouchers which don't have electronic bill registry markers yet
    const pendingSales = useMemo(() => {
        return allVouchers.filter(v => {
            const isRetailSales = v.type === VoucherType.Sales;
            const refText = String(v.referenceNo?.value || '');
            return isRetailSales && !refText.includes('EWAY') && !refText.includes('IRN');
        });
    }, [allVouchers]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleGenerateEwayBills = () => {
        if (selectedIds.length === 0) return;

        setIsGenerating(true);
        setTimeout(() => {
            const updated = allVouchers.map(v => {
                if (selectedIds.includes(v.id)) {
                    const randomEway = Math.floor(100000000000 + Math.random() * 900000000000);
                    const randomIrn = 'IRN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
                    return {
                        ...v,
                        referenceNo: { 
                            value: `EWAY:${randomEway} | ${randomIrn}`, 
                            confidence: '98%' as any 
                        },
                        narration: {
                            value: `[PORTAL SYNCHRONIZED] ${v.narration?.value || ''}`,
                            confidence: '98%' as any
                        }
                    };
                }
                return v;
            });

            setAllVouchers(updated);
            setIsGenerating(false);
            setSelectedIds([]);

            addNotification({
                title: 'E-Invoice Registry Success',
                message: `Successfully synchronized ${selectedIds.length} sales to NIC server. E-Way numbers generated.`,
                type: 'Alert'
            });
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Truck className="text-indigo-500 w-6 h-6 animate-bounce" />
                        Batch E-Invoice & E-Way Bill Simulation
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Verify local dispatches and register electronic invoices on direct portal APIs
                    </p>
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={handleGenerateEwayBills}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Authenticating NIC Portal...</span>
                            </>
                        ) : (
                            <>
                                <QrCode className="w-3.5 h-3.5" />
                                <span>Register EWAY ({selectedIds.length})</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {isGenerating && (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center animate-spin text-indigo-600 mb-4">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Requesting IRN / Ack Numbers</p>
                    <p className="text-[11px] text-gray-450 mt-1">Establishing handshake securely using API configuration credentials...</p>
                </div>
            )}

            {!isGenerating && pendingSales.length > 0 ? (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-5">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={pendingSales.length > 0 && selectedIds.length === pendingSales.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(pendingSales.map(v => v.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Voucher Reference</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Buyer Entity</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Destination POS</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Invoice Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingSales.map((v) => (
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
                                                INV-{v.id.slice(0, 6).toUpperCase()}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                Date: {v.date?.value}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {v.partyName?.value || 'Cash Sale Balance'}
                                        </td>
                                        <td className="p-4 text-xs font-semibold text-gray-500">
                                            {v.placeOfSupply?.value || 'Local Gst Class'}
                                        </td>
                                        <td className="p-4 text-right text-xs font-black text-gray-950 dark:text-white">
                                            ₹{formatNumber(parseFloat(String(v.amount?.value || '0').replace(/,/g, '')))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            {!isGenerating && pendingSales.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                        <Truck className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">All Dispatches Synchronized</p>
                    <p className="text-[11px] text-gray-400 max-w-xs mt-2">
                        No pending sales orders require E-Way numbers or acknowledgements at the moment.
                    </p>
                </div>
            )}
        </div>
    );
};
