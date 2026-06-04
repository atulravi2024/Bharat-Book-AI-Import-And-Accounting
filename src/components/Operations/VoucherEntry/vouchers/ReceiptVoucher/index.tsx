import React from 'react';
import { calculateRowAmountBeforePreTaxRoundOff, calculateRowAmount, getRowPostTaxDiscount, getRowRoundOff, getRowPreTaxRoundOff, calculateRowNetAmount } from '../VoucherCalculations';


import { PlusCircle, Save, ClipboardList, Plus, Trash2, Edit2, X, FileText, Calculator, Settings2, Users, MapPin, ChevronDown, ChevronUp, Paperclip, ScanBarcode, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Import, Printer, Eye, Image, FilePlus, Bookmark, Package, Tags, Info, HelpCircle, Keyboard, Layout, Zap } from 'lucide-react';
import { VoucherType } from '../../../../../app/types';
import { SearchableDropdown } from '../../../../ui/SearchableDropdown';
import { NewItemModal } from '../../../NewItemModal';
import { BarcodeScannerModal } from '../../../BarcodeScannerModal';
import { CalculatorModal } from '../../../../ui/CalculatorModal';
import { ConfirmModal } from '../../../../ui/ConfirmModal';
import { HistoryModal } from '../../../../ui/HistoryModal';

import { VoucherHelpModal } from '../../components/VoucherHelpModal';
import { VoucherKeyboardShortcutsModal } from '../../components/VoucherKeyboardShortcutsModal';
import { VoucherItemEditModal } from '../../components/VoucherItemEditModal';
import { VoucherTotalsSummary } from '../../components/VoucherTotalsSummary';
import { SystemInfo } from '../../components/SystemInfo';
import { VoucherPreview } from '../../VoucherPreview';
import { WebBillRequirements } from '../../components/WebBillRequirements';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Notification } from '../../../../ui/Notification';
import { useReceiptVoucherLogic } from './hooks/useReceiptVoucherLogic';
import { VoucherEntryViewProps } from './types';

export const ReceiptVoucher: React.FC<VoucherEntryViewProps> = (props) => {
  const logic = useReceiptVoucherLogic(props);
  const { t, formatNumber, activeTab, setActiveTab, showNewItemModal, setShowNewItemModal, showScanner, setShowScanner, scanningRowIndex, setScanningRowIndex, handleBarcodeScanned, rows, setRows, handleItemOrSkuChange, headerDetails, setHeaderDetails, systemStamp, formError, setFormError, attachedFile, setAttachedFile, fileInputRef, saveOptionsOpen, setSaveOptionsOpen, editingRowIndex, setEditingRowIndex, expandedRowSection, setExpandedRowSection, totals, handleHeaderChange, handleFileChange, validateVoucher, getEnrichedRows, saveVoucher, notification, setNotification, showNotify, handleSaveInfoResult, handleSave, handleSaveNew, handleSavePrint, handleSaveDraft, showPreview, setShowPreview, isPrinting, setIsPrinting, showCalculator, setShowCalculator, handlePreview, isSection0Collapsed, setIsSection0Collapsed, isSection1Collapsed, setIsSection1Collapsed, isSection2Collapsed, setIsSection2Collapsed, isSection3Collapsed, setIsSection3Collapsed, currentRecordId, setCurrentRecordId, loadRecord, handleNavigate, handleDuplicateEntry, showHelp, setShowHelp, showKeyboardShortcuts, setShowKeyboardShortcuts, showHistory, setShowHistory, showDeleteConfirm, setShowDeleteConfirm, showClearConfirm, setShowClearConfirm, handleDeleteEntryClick, handleConfirmDelete, handleClearEntryClick, handleConfirmClear, handleNewEntry, handleGeneratePDF, handleGenerateImage, collapsedSections, setCollapsedSections, showRequirements, setShowRequirements, toggleSection } = logic;
  const { defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings } = props;

const renderAccountingForm = () => (
    <div className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="bg-red-100 p-2 rounded-full shrink-0">
                    <X size={16} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t("Transaction Failed")}</h4>
                  <p className="text-sm">{formError}</p>
                </div>
            </div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-red-100 shrink-0 text-center">
                {systemStamp}
            </div>
        </div>
      )}
      <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[50] ${collapsedSections.header ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-[inherit]"></div>
        <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.header ? '' : 'mb-5'}`} onClick={() => toggleSection('header')}>
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <Settings2 size={16} className="mr-2 text-amber-500"/> <span className="hidden sm:inline">{t("Voucher&nbsp;")}</span>{t("Header")}
           </h3>
           <button className="text-gray-400 hover:text-gray-600 transition-colors">
             <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.header ? 'rotate-180' : ''}`} />
           </button>
        </div>
        {!collapsedSections.header && (
        <div className="form-grid gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="form-field-wrapper">
<label className="form-label flex justify-between items-center">
              <span>{t("Voucher Date")}</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input type="date" value={headerDetails.voucherDate || ''} onChange={(e) => handleHeaderChange('voucherDate', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              <div className="sm:w-32 flex items-center justify-center px-4 py-3 bg-amber-50 border border-amber-100/50 rounded-xl text-sm font-black text-amber-700 shadow-sm shrink-0 whitespace-nowrap uppercase tracking-wider">
                  {(() => {
                    const d = new Date(headerDetails.voucherDate);
                    return isNaN(d.getTime()) ? 'Invalid' : d.toLocaleDateString('en-US', { weekday: 'long' });
                  })()}
              </div>
            </div>
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Voucher Number")}</label>
            <input type="text" value={headerDetails.voucherNumber || ''} onChange={(e) => handleHeaderChange('voucherNumber', e.target.value)} placeholder={t("Auto-generated")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          
          {activeTab !== 'journal' && (
            <>
              <div className="form-field-wrapper">
<label className="form-label">{t("Account (Cash/Bank)")}</label>
                <SearchableDropdown
                  options={ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank'))}
                  value={headerDetails.cashBankAccount || ''}
                  onChange={(value) => {
                    handleHeaderChange('cashBankAccount', value);
                    const r = [...rows];
                    if (r.length > 0) {
                      r[0].ledgerName = value;
                      setRows(r);
                    }
                  }}
                  placeholder={t("Select Cash/Bank Account...")}
                  buttonClassName="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus-within:bg-gray-800 text-left flex justify-between items-center"
                />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Instrument No.")}</label>
                <input type="text" value={headerDetails.instrumentNo || ''} onChange={(e) => handleHeaderChange('instrumentNo', e.target.value)} placeholder={t("Cheque/UTR/Ref No.")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Instrument Date")}</label>
                <input type="date" value={headerDetails.instrumentDate || ''} onChange={(e) => handleHeaderChange('instrumentDate', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              </div>
            </>
          )}
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[40] ${collapsedSections.lineItems ? 'rounded-xl' : 'rounded-2xl'} dark:bg-gray-800`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-[inherit]"></div>
        <div className={`border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer ${collapsedSections.lineItems ? 'px-4 py-3' : 'px-6 py-5'} dark:border-gray-800`} onClick={() => toggleSection('lineItems')}>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <Calculator size={16} className="mr-2 text-rose-500"/> <span className="sm:hidden">{t("Items")}</span><span className="hidden sm:inline">{t("Particulars")}</span>
           </h3>
           <div className="flex items-center space-x-2 md:space-x-4">
             <button onClick={(e) => { e.stopPropagation(); setRows([...rows, { id: Date.now() }]); }} className="flex items-center px-4 md:px-4 py-2 md:py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-rose-200 transition-colors" title={t("Add Item")}>
               <Plus size={16} className="md:mr-1" /> <span className="hidden md:inline">{t("Add Item")}</span>
             </button>
             <button className="text-gray-400 hover:text-gray-600 transition-colors pl-2">
               <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.lineItems ? 'rotate-180' : ''}`} />
             </button>
           </div>
        </div>
        
        {!collapsedSections.lineItems && (
        <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-300">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-100 uppercase text-[10px] tracking-[0.2em] font-black text-gray-400 dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 w-20 text-center">{t("Cr/Dr")}</th>
                <th className="px-6 py-4">{t("Particulars (Ledger)")}</th>
                <th className="px-6 py-4 text-right w-48">{t("Amount (₹)")}</th>
                <th className="px-6 py-4 w-24 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="px-6 py-3">
                    <select 
                      value={row.crDr || (activeTab === 'payment' && index === 0 ? 'Cr' : activeTab === 'payment' ? 'Dr' : activeTab === 'receipt' && index === 0 ? 'Dr' : activeTab === 'receipt' ? 'Cr' : activeTab === 'journal' ? 'Dr' : 'Cr')} 
                      onChange={(e) => { const r = [...rows]; r[index].crDr = e.target.value; setRows(r); }} 
                      disabled={(activeTab === 'payment' || activeTab === 'receipt') && index === 0}
                      className="w-full px-2 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-black uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer text-center disabled:opacity-50 dark:focus:bg-gray-700"
                    >
                      <option value="Dr">{t("Dr")}</option>
                      <option value="Cr">{t("Cr")}</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <SearchableDropdown
                      options={index === 0 ? ledgerMasters.filter(l => l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank')) : [...ledgerMasters.filter(l => !(l.group?.toLowerCase().includes('cash') || l.group?.toLowerCase().includes('bank') || l.name?.toLowerCase().includes('cash') || l.name?.toLowerCase().includes('bank'))), ...partyMasters]}
                      value={row.ledgerName || ''}
                      onChange={(value) => { 
                        const r = [...rows]; 
                        r[index].ledgerName = value; 
                        if (index === 0) handleHeaderChange('cashBankAccount', value);
                        setRows(r); 
                      }}
                      placeholder={t("Select ledger...")}
                      buttonClassName="w-full min-w-[300px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all dark:focus-within:bg-gray-700"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input type="number" placeholder={t("0.00")} value={row.amount || ''} onChange={(e) => { const r = [...rows]; r[index].amount = e.target.value; setRows(r); }} className="w-full px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-bold text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:focus:bg-gray-700" />
                  </td>
                  <td className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setEditingRowIndex(index)} className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-lg transition-colors border border-amber-100" title={t("Edit")}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setRows(rows.filter(r => r.id !== row.id))} className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-red-100" title={t("Delete")}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );

return (
    <>

      <div className="flex flex-col gap-6 items-stretch">
        <div className="w-full">
          {renderAccountingForm()}
          
          <VoucherTotalsSummary rows={rows} 
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            ledgerMasters={ledgerMasters}
            totals={totals}
            activeTab={activeTab}
          />
          
          <div className="mt-6">
            <SystemInfo
              collapsed={collapsedSections.systemInfo}
              toggleSection={() => toggleSection('systemInfo')}
              createdAt={currentRecordId ? (initialVoucher?.createdAt || new Date().toISOString()) : undefined}
              updatedAt={currentRecordId ? (initialVoucher?.updatedAt || new Date().toISOString()) : undefined}
              recordId={currentRecordId || (initialVoucher?.id) || null}
              createdBy="Administrator"
              rowNumber={currentRecordId && vouchers ? vouchers.findIndex(v => v.id === currentRecordId) + 1 : 0}
              voucherType={activeTab}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] md:sticky md:bottom-0 md:-mx-6 lg:-mx-8 md:-mb-6 lg:-mb-8 z-[60] md:z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-2 md:p-1.5 flex justify-end md:justify-between items-center px-4 md:px-6 lg:px-8 mt-4 md:mt-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
           {activeTab.replace('_', ' ')}
        </div>
        <div className="flex gap-1 overflow-x-auto custom-scrollbar py-0.5 items-center">
           <button 
             onClick={() => setIsSection0Collapsed(!isSection0Collapsed)} 
             title={t("Toggle Navigation & Save")}
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection0Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection0Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button 
               onClick={() => handleNavigate('first')} 
               title={t("First Record")}
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronsLeft size={18} />
             </button>
             <button 
               onClick={() => handleNavigate('up')} 
               title={t("Previous Record")}
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronLeft size={18} />
             </button>

             <button onClick={handleSave} title={t("Save")} className="p-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm active:scale-95 shrink-0">
               <Save size={18} />
             </button>

             <button 
               onClick={() => handleNavigate('down')} 
               title={t("Next Record")}
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronRight size={18} />
             </button>
             <button 
               onClick={() => handleNavigate('last')} 
               title={t("Last Record")}
               className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
             >
               <ChevronsRight size={18} />
             </button>
           </div>

           <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

           <button 
             onClick={() => setIsSection1Collapsed(!isSection1Collapsed)} 
             title={t("Toggle Tools")}
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection1Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection1Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button onClick={() => setShowHistory(true)} title={t("View History")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <ClipboardList size={18} />
             </button>
             <button onClick={(e) => { e.stopPropagation(); setScanningRowIndex(-1); setShowScanner(true); }} title={t("Scan Barcode")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <ScanBarcode size={18} />
             </button>
             <button onClick={() => fileInputRef.current?.click()} title={t("Attach Files")} className="relative p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               {attachedFile && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
               <Paperclip size={18} />
             </button>
             <button onClick={() => setShowCalculator(true)} title={t("Calculator")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Calculator size={18} />
             </button>
             <button onClick={handleDuplicateEntry} title={t("Duplicate Entry")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <PlusCircle size={18} />
             </button>
           </div>
           
           <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

           <button 
             onClick={() => setIsSection2Collapsed(!isSection2Collapsed)} 
             title={t("Toggle Export Options")}
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection2Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection2Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button 
               onClick={handleNewEntry} 
               title={t("New Entry")}
               className="block p-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
             >
               <Plus size={18} />
             </button>
             <button onClick={handleSavePrint} title={t("Save & Print")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Printer size={18} />
             </button>
             <button onClick={handleSaveNew} title={t("Save & New")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <FilePlus size={18} />
             </button>
             <button onClick={handleSaveDraft} title={t("Save as Draft")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Bookmark size={18} />
             </button>
             <button onClick={handlePreview} title={t("Print Preview")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Eye size={18} />
             </button>
             <button onClick={handleGeneratePDF} title={t("Generate PDF")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <FileText size={18} />
             </button>
             <button onClick={handleGenerateImage} title={t("Generate Image")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Image size={18} />
             </button>
           </div>
           
           <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

           <button 
             onClick={() => setIsSection3Collapsed(!isSection3Collapsed)} 
             title={t("Toggle Settings & Actions")}
             className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             {isSection3Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </button>
           <div className={`${isSection3Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
             <button onClick={handleClearEntryClick} title={t("Clear Entry")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
               <X size={18} />
             </button>
             <button onClick={handleDeleteEntryClick} title={t("Delete Entry")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
               <Trash2 size={18} />
             </button>
             <button onClick={() => setShowKeyboardShortcuts(true)} title={t("Keyboard Shortcuts")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Keyboard size={18} />
             </button>
             <button onClick={() => setShowHelp(true)} title={t("Help")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <HelpCircle size={18} />
             </button>
             <button onClick={() => onOpenPrintSettings && onOpenPrintSettings()} title={t("Print Settings")} className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Settings2 size={18} />
             </button>
           </div>
        </div>
      </div>

      
      <VoucherItemEditModal 
        isOpen={editingRowIndex !== null}
        editingRowIndex={editingRowIndex}
        setEditingRowIndex={setEditingRowIndex}
        expandedRowSection={expandedRowSection}
        setExpandedRowSection={setExpandedRowSection}
        rows={rows}
        setRows={setRows}
        itemMasters={itemMasters}
        handleItemOrSkuChange={handleItemOrSkuChange}
        setScanningRowIndex={setScanningRowIndex}
        setShowScanner={setShowScanner}
        getRowPreTaxRoundOff={getRowPreTaxRoundOff}
        calculateRowAmount={calculateRowAmount}
        getRowRoundOff={getRowRoundOff}
        calculateRowNetAmount={calculateRowNetAmount}
        activeTab={activeTab}
        ledgerMasters={ledgerMasters}
      />
      
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onSave={(item) => {
          if (onAddItemMaster) {
            onAddItemMaster(item);
            alert(`New item "${item.name}" created successfully!`);
          }
        }}
      />
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleBarcodeScanned}
      />
      {showCalculator && (
        <CalculatorModal 
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />
      )}
      <VoucherHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <VoucherKeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
      
      {/* Hidden file input for file attachments */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      
      <HistoryModal onDeleteRecord={onDeleteEntry} items={(vouchers || []).filter(v => (typeof v.type === 'string' ? v.type.toLowerCase().replace(/ /g, '_') : v.type) === activeTab)} 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        storageKey="bharat_book_all_vouchers_v2" 
        onSelectRecord={(record) => loadRecord(record)}
        title="Voucher History" 
      />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Voucher"
        message="Are you sure you want to delete this voucher? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        isDestructive={true}
      />
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Entry"
        message="Are you sure you want to clear all fields? Any unsaved changes will be lost."
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Clear Form"
        isDestructive={true}
      />
      {showPreview && (
        <VoucherPreview 
          header={headerDetails}
          rows={getEnrichedRows()}
          totals={totals}
          type={activeTab}
          onClose={() => setShowPreview(false)}
          onDownloadPDF={handleGeneratePDF}
          onDownloadImage={handleGenerateImage}
          autoPrint={isPrinting}
        />
      )}
      <Notification 
        message={notification.message}
        type={notification.type}
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </>
  );

}
