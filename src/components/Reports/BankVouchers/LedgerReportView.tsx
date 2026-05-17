
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Printer } from 'lucide-react';
import { ParsedVoucher, VoucherType, AuditLog, PartyMaster, LedgerMaster, Confidence } from '../../../types';
import { 
    VouchersIcon, 
    SearchIcon, 
    FilterListIcon, 
    DownloadIcon, 
    MoreHorizIcon, 
    EditIcon, 
    DeleteIcon, 
    ContentCopyIcon, 
    HistoryIcon,
    VisibilityIcon,
    CheckCircleIcon,
    MoreVertIcon,
    CancelIcon,
    AccountIcon,
    BankIcon,
    WarningIcon,
    MapIcon,
    PieChartIcon,
} from '../../icons/IconComponents';

import { ImportExportButtons } from '../../shared/ImportExportButtons';

interface LedgerReportViewProps {
  vouchers: ParsedVoucher[];
  partyMasters: PartyMaster[];
  ledgerMasters: LedgerMaster[];
  onDuplicate: (voucher: ParsedVoucher) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkEdit?: (ids: string[]) => void;
  onBulkMap?: (ids: string[]) => void;
  onView: (voucher: ParsedVoucher) => void;
  onImportVoucher: (type: VoucherType) => void;
  onNavigateToMasters: () => void;
  defaultTab?: string | null;
  onTabChange?: (tab: string | null) => void;
  setVouchers?: (data: any[]) => void;
}

export const LedgerReportView: React.FC<LedgerReportViewProps> = ({ 
    vouchers, 
    partyMasters,
    ledgerMasters,
    onDuplicate, 
    onDelete, 
    onBulkDelete,
    onBulkEdit,
    onBulkMap,
    onView,
    onImportVoucher,
    onNavigateToMasters,
    defaultTab,
    onTabChange,
    setVouchers
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<string>((defaultTab as string) || 'standard');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    React.useEffect(() => {
        if (defaultTab && defaultTab !== activeTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (onTabChange) onTabChange(tab);
    };
    const [selectedAuditVoucher, setSelectedAuditVoucher] = useState<ParsedVoucher | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ 
        isOpen: boolean; 
        ids: string[]; 
        isBulk: boolean;
        message: string;
    } | null>(null);

    const ConfidenceIndicator = ({ confidence }: { confidence?: Confidence }) => {
        if (!confidence) return null;
        if (confidence === Confidence.High) return <div title="High Confidence" className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block ml-1 opacity-80" />;
        if (confidence === Confidence.Medium) return <div title="Medium Confidence" className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block ml-1 opacity-80" />;
        if (confidence === Confidence.Low) return <div title="Low Confidence" className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block ml-1 opacity-80" />;
        return null;
    };

    const vouchersToFilter = React.useMemo(() => {
        let list = vouchers.filter(v => {
            const isBankStatement = v.type === VoucherType.BankStatement;
            if (isBankStatement) return false;
            
            if (v.sampleSetId) {
                if (activeTab === 'purchase' && !['purchase_register', 'purchase_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'sales' && !['sales_register', 'sales_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'payment' && !['payment_register', 'payment_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'receipt' && !['receipt_register', 'receipt_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'journal' && !['journal_register', 'journal_entry', 'stock_journal_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'contra' && !['contra_register', 'contra_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'debit_note' && !['debit_note_register', 'debit_note_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'credit_note' && !['credit_note_register', 'credit_note_entry'].includes(v.sampleSetId)) return false;
                if (activeTab === 'day_book' && v.sampleSetId !== 'day_book') return false;
                if (activeTab === 'audit_trail' && v.sampleSetId !== 'audit_trail') return false;
                
                // Allow generic ones for 'standard' tab, plus let it see ALL vouchers. 
                // Wait, if activeTab is standard, it should only show if that specific voucher sample toggle is ON.
                // If it is ON, it is in 'vouchers'. So any v.sampleSetId is fine to show in 'standard' if it belongs to standard ledger!
                // Actually, standard implies ALL vouchers. So if a sample is active, it's fine to show in standard, EXCEPT maybe specific ones?
                // Let's just say standard shows EVERYTHING that is active.
                // Except wait, before I had: if (activeTab === 'standard' && !['vouchers', 'financial_vouchers'].includes(v.sampleSetId)) return false;
                if (activeTab === 'standard' && !['vouchers', 'financial_vouchers', 'sales_entry', 'purchase_entry', 'payment_entry', 'receipt_entry', 'journal_entry', 'contra_entry', 'debit_note_entry', 'credit_note_entry', 'sales_register', 'purchase_register', 'payment_register', 'receipt_register', 'journal_register', 'contra_register', 'debit_note_register', 'credit_note_register'].includes(v.sampleSetId)) return false;
            }
            return true;
        });

        if (activeTab === 'purchase') list = list.filter(v => v.type === VoucherType.Purchase);
        else if (activeTab === 'sales') list = list.filter(v => v.type === VoucherType.Sales);
        else if (activeTab === 'payment') list = list.filter(v => v.type === VoucherType.Payment);
        else if (activeTab === 'receipt') list = list.filter(v => v.type === VoucherType.Receipt);
        else if (activeTab === 'journal') list = list.filter(v => v.type === VoucherType.Journal);
        else if (activeTab === 'contra') list = list.filter(v => v.type === VoucherType.Contra);
        else if (activeTab === 'debit_note') list = list.filter(v => v.type === VoucherType.DebitNote);
        else if (activeTab === 'credit_note') list = list.filter(v => v.type === VoucherType.CreditNote);
        else if (activeTab === 'day_book') {
            return [...list].sort((a, b) => {
                const dateA = new Date(a.date?.value || 0).getTime();
                const dateB = new Date(b.date?.value || 0).getTime();
                return dateB - dateA;
            });
        }
        else if (activeTab === 'audit_trail') list = list.filter(v => v.auditLogs && v.auditLogs.length > 0);

        return list;
    }, [vouchers, activeTab]);

    const filteredVouchers = vouchersToFilter.filter(v => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = String(v.partyName?.value || v.narration?.value || '').toLowerCase().includes(searchLower) ||
                              String(v.id).toLowerCase().includes(searchLower) ||
                              String(v.ledger?.value || '').toLowerCase().includes(searchLower) ||
                              String(v.paymentMode?.value || '').toLowerCase().includes(searchLower) ||
                              String(v.tempImportId || '').toLowerCase().includes(searchLower);
        
        return matchesSearch;
    });

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

    const handleBulkExport = () => {
        const selectedVouchers = vouchers.filter(v => selectedIds.includes(v.id));
        const data = selectedVouchers.map(v => ({
            Date: v.date?.value,
            Time: v.time?.value || "",
            ID: v.tempImportId || v.id,
            Type: v.type,
            Party: v.partyName?.value || v.narration?.value,
            Ledger: v.ledger?.value || v.debitLedger?.value,
            "Payment Mode": v.paymentMode?.value || "",
            Amount: v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value,
            Confidence: v.confidence
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vouchers");
        XLSX.writeFile(wb, `BharatBook_BulkExport_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleExportFilteredCSV = () => {
        const data = filteredVouchers.map(v => ({
            Date: v.date?.value || "",
            Time: v.time?.value || "",
            ID: v.tempImportId || v.id,
            Type: v.type,
            Party: v.partyName?.value || v.narration?.value || "",
            Ledger: v.ledger?.value || v.debitLedger?.value || "",
            "Payment Mode": v.paymentMode?.value || "",
            Amount: v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value || 0,
            Confidence: v.confidence || ""
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(ws);
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `BharatBook_VouchersExport_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkDelete = () => {
        if (onBulkDelete) {
            setDeleteConfirmation({
                isOpen: true,
                ids: selectedIds,
                isBulk: true,
                message: `Are you sure you want to delete ${selectedIds.length} entries? This action cannot be undone.`
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

    const [expandedVoucherId, setExpandedVoucherId] = useState<string | null>(null);

    const getAiInsights = (v: ParsedVoucher) => {
        if (v.aiSummary) return v.aiSummary;

        // Generate dynamic mock insights if not present
        const discrepancies: string[] = [];
        const partyName = String(v.partyName?.value || '');
        const ledgerName = String(v.ledger?.value || '');

        if (v.amount?.confidence === Confidence.Low || v.date?.confidence === Confidence.Low) {
            discrepancies.push(`Critical low confidence score detected in core financial attributes.`);
        }

        if (partyName && !partyMasters.find(m => String(m.name || '').toLowerCase() === partyName.toLowerCase())) {
            discrepancies.push(`Undeclared Entity: "${partyName}" does not exist in any mapped master registers.`);
        }

        if (ledgerName && !ledgerMasters.find(m => String(m.name || '').toLowerCase() === ledgerName.toLowerCase())) {
            discrepancies.push(`Orphaned Ledger: Account code "${ledgerName}" is missing from the global chart of accounts.`);
        }

        const essentialFields = ['amount', 'date'];
        essentialFields.forEach(f => {
            if ((v as any)[f]?.isMismatch) {
                discrepancies.push(`Integrity Failure: ${f.charAt(0).toUpperCase() + f.slice(1)} field failed cross-validation check.`);
            }
        });

        const summary = `System analyzed this document as a ${v.type} transaction valued at ₹${Number(v.amount?.value || 0).toLocaleString()}. Classification was derived via ${v.origin === 'bank' ? 'OCR semantic analysis of bank narratives' : 'structural template matching of fiscal documents'}.`;

        const keyExtraction = {
            gst: "Detected as B2B",
            period: "FY 2025-26",
            urgency: Number(v.amount?.value || 0) > 50000 ? "High" : "Routine"
        };

        return { summary, discrepancies, keyExtraction };
    };

    const tabs = [
        { id: 'standard', label: 'General Ledger' },
        { id: 'purchase', label: 'Purchase Register' },
        { id: 'sales', label: 'Sales Register' },
        { id: 'payment', label: 'Payment Register' },
        { id: 'receipt', label: 'Receipt Register' },
        { id: 'journal', label: 'Journal Register' },
        { id: 'contra', label: 'Contra Register' },
        { id: 'debit_note', label: 'Debit Note' },
        { id: 'credit_note', label: 'Credit Note' },
        { id: 'day_book', label: 'Day Book' },
        { id: 'audit_trail', label: 'Audit Trail' }
    ];

    const completeSave = (data: any[]) => {
        if (!setVouchers) return;
        const bankVouchers = vouchers.filter(v => v.type === VoucherType.BankStatement || v.origin === 'bank');
        setVouchers([...bankVouchers, ...data]);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 animate-in fade-in duration-500 print-area">
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-print">
                <nav className="-mb-px flex space-x-6 min-w-max" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative dark:bg-gray-800 dark:border-gray-700">
                {selectedIds.length > 0 && (
                    <div className="absolute top-0 inset-x-0 bg-blue-600 text-white p-3 z-30 flex items-center justify-between animate-in slide-in-from-top duration-300 no-print">
                        <div className="flex items-center text-sm font-bold">
                            <span className="bg-blue-800 px-2 py-1 rounded mr-3">{selectedIds.length}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => onBulkMap?.(selectedIds)} title="Bulk Map" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Map"><MapIcon className="text-xl" /></button>
                            <button onClick={() => onBulkEdit?.(selectedIds)} title="Bulk Edit" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Edit"><EditIcon className="text-xl" /></button>
                            <button onClick={handleBulkExport} title="Bulk Export" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Export"><DownloadIcon className="text-xl" /></button>
                            <button onClick={handleBulkDelete} title="Bulk Delete" className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all" aria-label="Bulk Delete"><DeleteIcon className="text-xl" /></button>
                            <button onClick={() => setSelectedIds([])} title="Cancel" className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg transition-all" aria-label="Cancel"><CancelIcon className="text-xl" /></button>
                        </div>
                    </div>
                )}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-gray-800 no-print">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative max-w-md w-full">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search by Party or Import ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input pl-10 pr-4 text-sm dark:focus:bg-gray-700"
                            />
                        </div>
                        <ImportExportButtons data={filteredVouchers} onSave={completeSave} entityName="Vouchers" />
                        <button onClick={(e) => { e.currentTarget.blur(); setTimeout(() => window.print(), 100); }} className="bg-white text-gray-700 border border-gray-200 px-3 lg:px-4 py-2 rounded-lg font-bold flex items-center justify-center text-xs shadow-sm whitespace-nowrap hover:bg-gray-50 active:scale-95 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:dark:bg-gray-700">
                            <Printer className="text-[18px] leading-none lg:mr-2" />
                            <span className="hidden lg:inline-block">Print</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total: {filteredVouchers.length} Entries</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1100px' }}>
                        <thead className="bg-gray-50 text-gray-400 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input 
                                        type="checkbox" 
                                        className="form-input rounded border-gray-300 text-blue-600 h-4 w-4 dark:border-gray-600"
                                        checked={selectedIds.length === filteredVouchers.length && filteredVouchers.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Import ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Mode</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Party Name</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-800">
                            {filteredVouchers.length > 0 ? (
                                filteredVouchers.map((voucher) => (
                                    <React.Fragment key={voucher.id}>
                                        <tr 
                                            className={`hover:bg-blue-50/30 transition-colors group ${selectedIds.includes(voucher.id) ? 'bg-blue-50/50' : ''} ${expandedVoucherId === voucher.id ? 'bg-blue-50/20' : ''}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-input rounded border-gray-300 text-blue-600 h-4 w-4 dark:border-gray-600"
                                                        checked={selectedIds.includes(voucher.id)}
                                                        onChange={() => toggleSelect(voucher.id)}
                                                    />
                                                    <button 
                                                        onClick={() => setExpandedVoucherId(expandedVoucherId === voucher.id ? null : voucher.id)}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400"
                                                    >
                                                        <PieChartIcon size={14} className={expandedVoucherId === voucher.id ? 'text-blue-600' : ''} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 font-bold">
                                                {voucher.tempImportId ? `#${voucher.tempImportId}` : `#${voucher.id.includes('copy') ? 'COPY' : (voucher.id.split('-')[1] || '---')}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium dark:text-gray-300">
                                                {String(voucher.date?.value || '-')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                                                {voucher.time?.value || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {voucher.paymentMode?.value ? (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        voucher.paymentMode.value === 'UPI' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                        voucher.paymentMode.value === 'Cheque' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                        voucher.paymentMode.value === 'Auto Debit' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                        'bg-gray-100 text-gray-700 border border-gray-200'
                                                    } dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700`}>
                                                        {voucher.paymentMode.value}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 text-[10px]">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-100">
                                                        {String(voucher.partyName?.value || voucher.narration?.value || voucher.fromAccount?.value || 'N/A')}
                                                        <ConfidenceIndicator confidence={voucher.partyName?.confidence || voucher.fromAccount?.confidence} />
                                                    </div>
                                                    {voucher.partyName && !partyMasters.find(m => String(m.name || '').toLowerCase() === String(voucher.partyName?.value).toLowerCase()) && (
                                                        <button onClick={onNavigateToMasters} className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center hover:bg-amber-100 transition-colors" title="Party not linked to a master record">
                                                            <WarningIcon className="text-[10px] mr-1" /> Unlinked
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2 mt-0.5">
                                                    <div className="flex items-center text-[10px] text-gray-500 font-semibold dark:text-gray-400">
                                                        {String(voucher.ledger?.value || voucher.debitLedger?.value || voucher.toAccount?.value || '-')}
                                                        <ConfidenceIndicator confidence={voucher.ledger?.confidence || voucher.debitLedger?.confidence || voucher.toAccount?.confidence} />
                                                    </div>
                                                    {voucher.ledger && !ledgerMasters.find(m => String(m.name || '').toLowerCase() === String(voucher.ledger?.value).toLowerCase()) && (
                                                        <button onClick={onNavigateToMasters} className="text-[9px] font-bold text-amber-600 hover:text-amber-800 transition-colors" title="Ledger not linked to a master record. Click to manage.">
                                                            (Create in Masters)
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 font-mono flex justify-end items-center dark:text-white">
                                                ₹{Number(voucher.amount?.value || voucher.withdrawalAmount?.value || voucher.depositAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                <ConfidenceIndicator confidence={voucher.amount?.confidence || voucher.withdrawalAmount?.confidence || voucher.depositAmount?.confidence} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-100">
                                                    Posted
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button 
                                                        onClick={() => onView(voucher)}
                                                        title="View Detail"
                                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors dark:hover:bg-gray-600 dark:text-gray-400"
                                                    >
                                                        <VisibilityIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => onView(voucher)}
                                                        title="Edit Entry"
                                                        className="p-1.5 rounded-full hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => onDuplicate(voucher)}
                                                        title="Duplicate"
                                                        className="p-1.5 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-700 transition-colors dark:text-gray-400"
                                                    >
                                                        <ContentCopyIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => setSelectedAuditVoucher(voucher)}
                                                        title="Audit Trail"
                                                        className="p-1.5 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-700 transition-colors dark:text-gray-400"
                                                    >
                                                        <HistoryIcon />
                                                    </button>
                                                    <button 
                                                        onClick={() => { 
                                                            setDeleteConfirmation({
                                                                isOpen: true,
                                                                ids: [voucher.id],
                                                                isBulk: false,
                                                                message: 'Are you sure you want to delete this entry? This will permanently remove it from the ledger.'
                                                            });
                                                        }}
                                                        title="Delete"
                                                        className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedVoucherId === voucher.id && (
                                            <tr className="bg-blue-50/10 border-b border-blue-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                                                <td colSpan={8} className="px-6 py-4">
                                                    <div className="flex flex-col lg:flex-row gap-6">
                                                        <div className="flex-1">
                                                            <div className="mb-4">
                                                                <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center">
                                                                    <CheckCircleIcon size={14} className="mr-2" /> AI Summary & Synthesis
                                                                </h4>
                                                                <p className="text-sm text-gray-700 leading-relaxed font-medium dark:text-gray-200">
                                                                    {getAiInsights(voucher).summary}
                                                                </p>
                                                            </div>
                                                            <div className="form-grid gap-3">
                                                                {Object.entries(getAiInsights(voucher).keyExtraction || {}).map(([k, val]) => (
                                                                    <div key={k} className="bg-white p-2 rounded-lg border border-blue-50 dark:bg-gray-800">
                                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{k}</p>
                                                                        <p className="text-[11px] font-bold text-gray-900 dark:text-white">{val}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="w-full lg:w-1/3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm self-start dark:bg-gray-800">
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                                                                <WarningIcon size={12} className="mr-2 text-amber-500" /> Discrepancies Noted
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {getAiInsights(voucher).discrepancies.length > 0 ? (
                                                                    getAiInsights(voucher).discrepancies.map((d, di) => (
                                                                        <div key={di} className="flex items-start text-[11px] text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                                                                            <span className="mr-2 mt-0.5">•</span>
                                                                            <span className="font-medium">{d}</span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="flex items-center text-[11px] text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                                                        <CheckCircleIcon size={12} className="mr-2" /> No logical discrepancies detected in current capture.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <VouchersIcon className="text-6xl mx-auto text-gray-100 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-400">No entries found</h3>
                                        <p className="text-gray-400 text-sm max-w-xs mx-auto">Either you haven't imported any data yet or your search filter returned no results.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedAuditVoucher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-gray-800">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center">
                                <HistoryIcon className="text-blue-600 mr-3 text-2xl" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Audit Trail</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                        Entry #{selectedAuditVoucher.id.includes('copy') ? 'COPY' : (selectedAuditVoucher.id.split('-')[1] || '---')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAuditVoucher(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all dark:hover:bg-gray-600">
                                <CancelIcon />
                            </button>
                        </div>
                        <div className="p-0 max-h-[60vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-blue-100 before:to-transparent">
                                    {selectedAuditVoucher.auditLogs && selectedAuditVoucher.auditLogs.length > 0 ? (
                                        [...selectedAuditVoucher.auditLogs].reverse().map((log, idx) => (
                                            <div key={log.id} className="relative flex items-start group">
                                                <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center z-10 group-hover:border-blue-500 transition-colors shadow-sm dark:bg-gray-800">
                                                    {log.action === 'Created' ? <CheckCircleIcon className="text-green-500 text-lg" /> :
                                                     log.action === 'Duplicated' ? <ContentCopyIcon className="text-blue-500 text-lg" /> :
                                                     <HistoryIcon className="text-gray-400 text-lg" />}
                                                </div>
                                                <div className="ml-14 flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                                            log.action === 'Created' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            log.action === 'Duplicated' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-gray-50 text-gray-700 border-gray-100'
                                                        } dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800`}>
                                                            {log.action}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{log.timestamp}</span>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                                        <div className="text-sm font-bold text-gray-800 mb-1 dark:text-gray-100">{log.details}</div>
                                                        <div className="flex items-center text-xs text-gray-500 font-medium dark:text-gray-400">
                                                            <AccountIcon className="mr-1 text-base opacity-40" /> {log.user}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center">
                                            <HistoryIcon className="text-6xl text-gray-100 mx-auto mb-4" />
                                            <p className="text-gray-400 font-medium">No audit activities recorded for this entry.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end dark:bg-gray-900">
                            <button 
                                onClick={() => setSelectedAuditVoucher(null)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Close Trail
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-gray-800">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DeleteIcon className="text-3xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Confirm Deletion</h3>
                            <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">{deleteConfirmation.message}</p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-gray-800">
                            <button 
                                onClick={() => setDeleteConfirmation(null)}
                                className="flex-1 px-4 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:border-gray-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
