
import React from 'react';
import { CheckCircleIcon, DownloadIcon, PrintIcon, UndoIcon, DashboardIcon, VouchersIcon, ArrowBackIcon } from '../../icons/IconComponents';
import { ParsedVoucher } from '../../../types';
import * as XLSX from 'xlsx';

interface SuccessScreenProps {
  vouchers: ParsedVoucher[];
  onDone: () => void;
  onGoToDashboard: () => void;
  onGoToVouchers: () => void;
  onUndo: (ids: string[]) => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ vouchers, onDone, onGoToDashboard, onGoToVouchers, onUndo }) => {
  const voucherCount = vouchers.length;
  const isBankImport = vouchers.some(v => v.origin === 'bank');

  const handleExportExcel = () => {
    const exportData = vouchers.flatMap((v): any => {
      if (v.items && v.items.length > 0) {
        return v.items.map(item => ({
          'Voucher ID': v.id,
          'Party/Desc': (v.partyName?.value || v.narration?.value || ''),
          'Date': v.date?.value || '',
          'Ledger Account': v.ledger?.value || v.debitLedger?.value || v.fromAccount?.value || '',
          'Item Name': item.name?.value || '',
          'Quantity': item.quantity?.value || 0,
          'Rate': item.rate?.value || 0,
          'Tax Rate (%)': item.taxRate?.value || 0,
          'Tax Type': item.taxType?.value || '',
          'Tax Amount': item.tax?.value || 0,
          'Total Amount': item.total?.value || 0,
          'Voucher Total': v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value || 0
        }));
      }
      
      // If no items, just export the voucher details
      return [{
          'Voucher ID': v.id,
          'Date': v.date?.value || '',
          'Voucher Type': v.type || '',
          'Party/Description': v.partyName?.value || v.narration?.value || '',
          'Account': v.ledger?.value || v.fromAccount?.value || v.toAccount?.value || '',
          'Amount': v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value || 0,
          'Narration': v.narration?.value || ''
      }];
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Posted Vouchers');
    XLSX.writeFile(workbook, `Bharat_Book_Posted_Vouchers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportCSV = () => {
    const exportData = vouchers.map(v => ({
      'Voucher ID': v.id,
      'Date': v.date?.value || '',
      'Type': v.type || '',
      'Party/Description': v.partyName?.value || v.narration?.value || '',
      'Account': v.ledger?.value || v.fromAccount?.value || v.toAccount?.value || '',
      'Amount': v.amount?.value || v.withdrawalAmount?.value || v.depositAmount?.value || 0,
      'Narration': v.narration?.value || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bharart_Book_Export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  return (
    <div className="max-w-[1600px] mx-auto h-full flex flex-col px-4 sm:px-8 pt-6 pb-0 space-y-6 text-center print:p-0 print:space-y-0">
      {/* Top Section: Header & Buttons (Hidden during print) */}
      <div className="shrink-0 bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center border border-gray-100 print:hidden dark:bg-gray-800 dark:border-gray-800">
        <CheckCircleIcon className="text-5xl text-green-500 mb-4 shrink-0" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1 dark:text-gray-100">Success!</h2>
        <p className="text-gray-600 text-sm mb-5 dark:text-gray-300">
          {voucherCount} {isBankImport ? 'bank transactions' : 'vouchers'} {voucherCount > 1 ? 'have' : 'has'} been successfully {isBankImport ? 'integrated' : 'posted'}.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-2 print:hidden">
          <button 
            onClick={onDone}
            className="flex items-center px-4 py-2 border border-blue-100 rounded-lg text-sm font-bold text-blue-700 bg-blue-50 hover:bg-white hover:border-blue-400 transition-all shadow-sm"
          >
            <ArrowBackIcon className="mr-2 text-lg" /> New Import
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm dark:border-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <DownloadIcon className="mr-2 text-lg text-green-500" /> CSV
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-green-300 hover:text-green-600 transition-all shadow-sm dark:border-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <DownloadIcon className="mr-2 text-lg text-blue-500" /> Excel
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 border border-blue-200 rounded-lg text-sm font-bold text-blue-600 bg-blue-50 hover:bg-white hover:border-blue-400 transition-all shadow-sm"
          >
            <PrintIcon className="mr-2 text-lg text-blue-500" /> Print
          </button>
          <button 
            onClick={onGoToVouchers}
            className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-amber-300 hover:text-amber-600 transition-all shadow-sm dark:border-gray-700 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <VouchersIcon className="mr-2 text-lg text-amber-500" /> History
          </button>
          <button 
            onClick={() => {
              const ids = vouchers.map(v => v.id);
              if (ids.length === 0) return;
              // Removing confirm to avoid browser blocking
              onUndo(ids);
              onDone();
            }}
            className="flex items-center px-4 py-2 border border-red-100 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all shadow-sm active:scale-95"
          >
            <UndoIcon className="mr-2 text-lg" /> Undo All
          </button>
        </div>
      </div>

      {/* Middle Section: Summary (Stretches to bottom using flex-1) */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm text-left animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col min-h-0 border border-gray-100 print:p-0 print:shadow-none print:border-none print:static dark:bg-gray-800 dark:border-gray-800">
        <div className="flex items-baseline justify-between mb-4 shrink-0">
          <h3 className="text-base font-bold text-gray-800 flex items-center justify-between print:mb-2 w-full dark:text-gray-100">
            Import Summary
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded print:hidden dark:bg-gray-900">System Log ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              <span className="hidden print:block text-[10px] font-mono text-gray-500 dark:text-gray-400">Printed: {new Date().toLocaleString()}</span>
            </div>
          </h3>
        </div>
        <div className="flex-1 overflow-auto border border-gray-100 rounded-lg custom-scrollbar print:overflow-visible print:border-none print:h-auto dark:border-gray-800">
          <table className="w-full text-sm text-left print:text-[10pt]">
            <thead className="sticky top-0 bg-white z-10 shadow-sm print:static print:shadow-none dark:bg-gray-800">
              <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">ID</th>
                <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">Date</th>
                <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">Party/Description</th>
                <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] text-right dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 font-mono text-xs">{v.id.split('-').slice(0, 2).join('-')}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.date?.value || '-'}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{String(v.partyName?.value || v.narration?.value || 'N/A')}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">₹{Number(v?.amount?.value || v?.withdrawalAmount?.value || v?.depositAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">
                    {v.origin === 'bank' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                        Bank Record
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                        Posted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
