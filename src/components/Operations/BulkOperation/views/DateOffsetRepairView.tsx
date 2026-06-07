import React, { useState, useMemo } from 'react';
import { ParsedVoucher } from '../../../../app/types';
import { useLanguage } from '../../../../context/LanguageContext';
import { 
    Calendar, 
    ArrowRight, 
    RefreshCw, 
    Check, 
    Zap,
    AlertCircle,
    CalendarCheck
} from 'lucide-react';
import { useNotifications } from '../../../../context/NotificationContext';

interface DateOffsetRepairViewProps {
    allVouchers: ParsedVoucher[];
    setAllVouchers: (vouchers: ParsedVoucher[]) => void;
}

export const DateOffsetRepairView: React.FC<DateOffsetRepairViewProps> = ({
    allVouchers,
    setAllVouchers
}) => {
    const { formatNumber } = useLanguage();
    const { addNotification } = useNotifications();
    const [offsetDays, setOffsetDays] = useState<number>(0);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isRepairing, setIsRepairing] = useState(false);

    // List of vouchers with dates
    const voucherList = useMemo(() => {
        return allVouchers.slice(0, 30); // Show up to 30 for dense performance view
    }, [allVouchers]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Calculate shifted date helper
    const calculateShiftedDate = (originalDateStr: string, daysShift: number) => {
        try {
            const dateObj = new Date(originalDateStr);
            if (isNaN(dateObj.getTime())) return originalDateStr; // Return unchanged if invalid date format
            
            dateObj.setDate(dateObj.getDate() + daysShift);
            return dateObj.toISOString().split('T')[0];
        } catch {
            return originalDateStr;
        }
    };

    const handleRepairDates = () => {
        if (selectedIds.length === 0 || offsetDays === 0) return;

        setIsRepairing(true);
        setTimeout(() => {
            const updated = allVouchers.map(v => {
                if (selectedIds.includes(v.id)) {
                    const originalDate = String(v.date?.value || '');
                    const newDate = calculateShiftedDate(originalDate, offsetDays);
                    return {
                        ...v,
                        date: { ...v.date, value: newDate },
                        narration: { value: `[DATE ADJUSTED BY ${offsetDays}D] ${v.narration?.value || ''}`, confidence: v.date?.confidence || '98%' as any }
                    };
                }
                return v;
            });

            setAllVouchers(updated);
            setIsRepairing(false);
            setSelectedIds([]);
            setOffsetDays(0);

            addNotification({
                title: 'Date Realignment Succeeded',
                message: `Successfully shifted posting timelines for ${selectedIds.length} vouchers by ${offsetDays} days.`,
                type: 'Alert'
            });
        }, 1200);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-50 dark:border-gray-700/40 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="text-indigo-500 w-6 h-6" />
                        Timezone Offset & backdate Synchronizer
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">
                        Mass balance transaction periods and correct systematic legacy log dates
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-black uppercase text-gray-400 pl-2">Shift days:</span>
                        <input 
                            type="number"
                            value={offsetDays}
                            onChange={(e) => setOffsetDays(parseInt(e.target.value) || 0)}
                            placeholder="e.g. -1 or +2"
                            className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-100 w-16 border-0 focus:ring-0"
                        />
                    </div>

                    {selectedIds.length > 0 && offsetDays !== 0 && (
                        <button
                            onClick={handleRepairDates}
                            disabled={isRepairing}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-100"
                        >
                            {isRepairing ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Zap className="w-3.5 h-3.5" />
                            )}
                            <span>Shift {selectedIds.length} Vouchers</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Shift Alert Panel */}
            {offsetDays !== 0 && selectedIds.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/30 mt-6 animate-pulse">
                    <AlertCircle className="text-indigo-600 w-5 h-5" />
                    <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                        Attention: You are about to shift dates for {selectedIds.length} records by {offsetDays < 0 ? `${Math.abs(offsetDays)} days backward (Backdating)` : `${offsetDays} days forward`}. Balance indicators will recalculate.
                    </p>
                </div>
            )}

            {voucherList.length > 0 ? (
                <div className="mt-8 space-y-6">
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-5">
                                <tr>
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            type="checkbox"
                                            checked={selectedIds.length === voucherList.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedIds(voucherList.map(v => v.id));
                                                else setSelectedIds([]);
                                            }}
                                            className="accent-indigo-600"
                                        />
                                    </th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Voucher Info</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Date</th>
                                    <th className="p-4 text-center w-12"></th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Adjusted Preview Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voucherList.map((v) => {
                                    const originalDate = String(v.date?.value || '');
                                    const previewDate = offsetDays !== 0 && selectedIds.includes(v.id)
                                        ? calculateShiftedDate(originalDate, offsetDays)
                                        : originalDate;
                                    const isDateChanged = originalDate !== previewDate;

                                    return (
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
                                                    Amount: ₹{formatNumber(parseFloat(String(v.amount?.value || '0').replace(/,/g, '')))} | Party: {v.partyName?.value || 'General'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-bold text-gray-500">
                                                {originalDate}
                                            </td>
                                            <td className="p-4 text-center text-gray-300">
                                                <ArrowRight className="w-4 h-4 mx-auto" />
                                            </td>
                                            <td className={`p-4 text-xs font-black ${isDateChanged ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>
                                                {previewDate}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Registers are completely empty</p>
                </div>
            )}
        </div>
    );
};
