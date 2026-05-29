import React from 'react';
import { ParsedVoucher } from '../../../app/types';
import { 
    HistoryIcon,
    CancelIcon,
    AccountIcon,
    CheckCircleIcon,
    DeleteIcon
} from '../../icons/IconComponents';

interface BankReportModalsProps {
    selectedAuditVoucher: ParsedVoucher | null;
    setSelectedAuditVoucher: (v: ParsedVoucher | null) => void;
    deleteConfirmation: { isOpen: boolean; ids: string[]; isBulk: boolean; message: string; } | null;
    setDeleteConfirmation: (data: any) => void;
    confirmDelete: () => void;
    showAIConfirm: boolean;
    setShowAIConfirm: (show: boolean) => void;
    runAutoMatch: (force: boolean) => void;
    isRunningAI: boolean;
}

export const BankReportModals: React.FC<BankReportModalsProps> = ({
    selectedAuditVoucher,
    setSelectedAuditVoucher,
    deleteConfirmation,
    setDeleteConfirmation,
    confirmDelete,
    showAIConfirm,
    setShowAIConfirm,
    runAutoMatch,
    isRunningAI
}) => {
    return (
        <>
            {selectedAuditVoucher && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-gray-800">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center">
                                <HistoryIcon className="text-indigo-600 mr-3 text-2xl" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Audit Trail</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Statement #{selectedAuditVoucher.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAuditVoucher(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all dark:hover:bg-gray-600"><CancelIcon /></button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-indigo-100">
                                {selectedAuditVoucher.auditLogs?.map((log) => (
                                    <div key={log.id} className="relative flex items-start group">
                                        <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center z-10 group-hover:border-indigo-500 transition-colors shadow-sm dark:bg-gray-800">
                                            {log.action === 'Created' ? <CheckCircleIcon className="text-green-500 text-lg" /> : <HistoryIcon className="text-indigo-400 text-lg" />}
                                        </div>
                                        <div className="ml-14 flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">{log.action}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{log.timestamp}</span>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                                <div className="text-sm font-bold text-gray-800 mb-1 dark:text-gray-100">{log.details}</div>
                                                <div className="flex items-center text-xs text-gray-500 font-medium dark:text-gray-400"><AccountIcon className="mr-1 text-base opacity-40" /> {log.user}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end dark:bg-gray-900">
                            <button onClick={() => setSelectedAuditVoucher(null)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">Close Trail</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-gray-800">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><DeleteIcon className="text-3xl" /></div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Confirm Deletion</h3>
                            <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">{deleteConfirmation.message}</p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-gray-800">
                            <button onClick={() => setDeleteConfirmation(null)} className="flex-1 px-4 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:border-gray-800">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showAIConfirm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-gray-800">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="text-3xl">⚡</div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Run AI Auto-Match?</h3>
                            <p className="text-gray-500 text-sm mt-3 dark:text-gray-400">
                                This will analyze your bank narrations and suggest mappings for unknown transactions. 
                                <br/><br/>
                                <span className="font-bold text-gray-700 dark:text-gray-200">Would you like to re-match already identified statements as well?</span>
                            </p>
                        </div>
                        <div className="flex flex-col border-t border-gray-100 dark:border-gray-800">
                            <button 
                                onClick={() => {
                                    runAutoMatch(true); 
                                    setShowAIConfirm(false);
                                }} 
                                className="px-4 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-b border-gray-100 dark:border-gray-800"
                            >
                                Re-Match All Statements
                            </button>
                            <button 
                                onClick={() => {
                                    runAutoMatch(false);
                                    setShowAIConfirm(false);
                                }} 
                                className="px-4 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-b border-gray-100 dark:border-gray-800"
                            >
                                Match Only Unclassified
                            </button>
                            <button 
                                onClick={() => setShowAIConfirm(false)} 
                                className="px-4 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
