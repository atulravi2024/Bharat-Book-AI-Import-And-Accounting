import React, { useState, useMemo } from 'react';
import { ParsedVoucher, VoucherType } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Coins, 
    ArrowRightLeft, 
    TrendingDown, 
    TrendingUp, 
    Check, 
    RefreshCw, 
    Calculator 
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface CurrencyRevaluationViewProps {
    allVouchers: ParsedVoucher[];
    setAllVouchers: (vouchers: ParsedVoucher[]) => void;
}

export const CurrencyRevaluationView: React.FC<CurrencyRevaluationViewProps> = ({
    allVouchers,
    setAllVouchers
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [usdRate, setUsdRate] = useState<number>(83.5);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBooking, setIsBooking] = useState(false);
    const [fxBalances, setFxBalances] = useState<any[]>([]);

    React.useEffect(() => {
        fetch('/sample-data/bulk-operation/currencySample.json')
            .then(r => r.json())
            .then(setFxBalances)
            .catch(console.error);
    }, []);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleBookFxGainLoss = () => {
        if (selectedIds.length === 0) return;

        setIsBooking(true);
        setTimeout(() => {
            // Book Forex adjustment simulation: create a new Journal Voucher 
            const targets = fxBalances.filter(f => selectedIds.includes(f.id));
            let totalGainLoss = 0;
            targets.forEach(t => {
                const diff = (usdRate - t.historicalRate) * t.foreignAmount;
                totalGainLoss += diff;
            });

            const newVoucher: ParsedVoucher = {
                id: `fx-adj-${Date.now()}`,
                type: VoucherType.Journal,
                date: { value: new Date().toISOString().split('T')[0], confidence: '98%' as any },
                amount: { value: String(Math.abs(totalGainLoss).toFixed(2)), confidence: '98%' as any },
                partyName: { value: 'Exchange Difference Ledger', confidence: '98%' as any },
                referenceNo: { value: 'FX-ADJ-BULK', confidence: '98%' as any },
                narration: { 
                    value: `[FOREX REVALUATION ADJUSTMENT] booked adjusting difference of ₹${formatNumber(totalGainLoss)} across ${selectedIds.length} outstanding listings at spot rate ₹${usdRate}/USD`, 
                    confidence: '98%' as any 
                },
                items: [],
                auditLogs: [
                    {
                        id: `log-${Date.now()}`,
                        action: 'Confirmed AI Map' as any,
                        timestamp: new Date().toLocaleTimeString(),
                        user: 'System Adjuster',
                        details: `Forex adjustment calculated at USD/${usdRate}`
                    }
                ]
            };

            setAllVouchers([newVoucher, ...allVouchers]);
            setIsBooking(false);
            setSelectedIds([]);

            addNotification({
                title: 'Forex Ledger Balanced',
                message: `Booked Forex Adjustment Journal Voucher for ₹${formatNumber(totalGainLoss)} (USD conversion at ₹${usdRate}).`,
                type: 'Alert'
            });
        }, 1200);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calculator className="text-indigo-500 w-6 h-6 animate-pulse" />
                        Multi-Currency spot rate Revaluations
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Revalue outstanding foreign trade balances by active spot rates
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-black uppercase text-gray-400 pl-2">Spot USD / INR:</span>
                        <input 
                            type="number"
                            step="0.05"
                            value={usdRate}
                            onChange={(e) => setUsdRate(parseFloat(e.target.value) || 0)}
                            className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-100 w-16 border-0 focus:ring-0"
                        />
                    </div>

                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBookFxGainLoss}
                            disabled={isBooking}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-100"
                        >
                            {isBooking ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Book Forex Entries ({selectedIds.length})</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-8 space-y-6">
                <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input 
                                        type="checkbox"
                                        checked={selectedIds.length === fxBalances.length}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedIds(fxBalances.map(f => f.id));
                                            else setSelectedIds([]);
                                        }}
                                        className="accent-indigo-600"
                                    />
                                </th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Exporter / Supplier Particulars</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">O/S Currency Rate</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ref Historical INR</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Spot INR Revalued</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Forex Gain / Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fxBalances.map((item) => {
                                const historicalInr = item.foreignAmount * item.historicalRate;
                                const spotInr = item.foreignAmount * usdRate;
                                const diff = spotInr - historicalInr;
                                const isGain = diff >= 0;

                                return (
                                    <tr key={item.id} className="border-b last:border-0 border-gray-150/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleToggleSelect(item.id)}
                                                className="accent-indigo-600 rounded"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-black text-gray-900 dark:text-white">
                                                {item.party}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                                Invoice: {item.invoiceRef} | O/S: {item.currency} ${formatNumber(item.foreignAmount)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-gray-500">
                                            {item.currency} at ₹{item.historicalRate}
                                        </td>
                                        <td className="p-4 text-xs font-semibold text-gray-500">
                                            ₹{formatNumber(historicalInr)}
                                        </td>
                                        <td className="p-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                            ₹{formatNumber(spotInr)}
                                        </td>
                                        <td className={`p-4 text-right text-xs font-black ${isGain ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {isGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                <span>₹{formatNumber(Math.abs(diff))}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
