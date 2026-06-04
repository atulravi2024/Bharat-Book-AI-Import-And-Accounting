import React from 'react';


import { parseSafe, calculateRowAmountBeforePreTaxRoundOff, getRowPreTaxRoundOff, calculateRowAmount, getRowPostTaxDiscount, getRowRoundOff, calculateRowNetAmount } from '../VoucherCalculations';
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
import { usePurchaseVoucherLogic } from './hooks/usePurchaseVoucherLogic';
import { VoucherEntryViewProps } from './types';

export const PurchaseVoucher: React.FC<VoucherEntryViewProps> = (props) => {
  const logic = usePurchaseVoucherLogic(props);
  const { t, formatNumber, activeTab, setActiveTab, showNewItemModal, setShowNewItemModal, showScanner, setShowScanner, scanningRowIndex, setScanningRowIndex, handleBarcodeScanned, rows, setRows, handleItemOrSkuChange, headerDetails, setHeaderDetails, systemStamp, formError, setFormError, attachedFile, setAttachedFile, fileInputRef, saveOptionsOpen, setSaveOptionsOpen, editingRowIndex, setEditingRowIndex, expandedRowSection, setExpandedRowSection, totals, handleHeaderChange, handleFileChange, validateVoucher, getEnrichedRows, saveVoucher, notification, setNotification, showNotify, handleSaveInfoResult, handleSave, handleSaveNew, handleSavePrint, handleSaveDraft, showPreview, setShowPreview, isPrinting, setIsPrinting, showCalculator, setShowCalculator, handlePreview, isSection0Collapsed, setIsSection0Collapsed, isSection1Collapsed, setIsSection1Collapsed, isSection2Collapsed, setIsSection2Collapsed, isSection3Collapsed, setIsSection3Collapsed, currentRecordId, setCurrentRecordId, loadRecord, handleNavigate, handleDuplicateEntry, showHelp, setShowHelp, showKeyboardShortcuts, setShowKeyboardShortcuts, showHistory, setShowHistory, showDeleteConfirm, setShowDeleteConfirm, showClearConfirm, setShowClearConfirm, handleDeleteEntryClick, handleConfirmDelete, handleClearEntryClick, handleConfirmClear, handleNewEntry, handleGeneratePDF, handleGenerateImage, collapsedSections, setCollapsedSections, showRequirements, setShowRequirements, toggleSection } = logic;
  const { defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings } = props;

const renderSalesPurchaseForm = () => (
    <div className="space-y-6">
      {showRequirements && <WebBillRequirements onClose={() => setShowRequirements(false)} />}
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
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-[inherit]"></div>
        <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.header ? '' : 'mb-5'}`} onClick={() => toggleSection('header')}>
           <div className="flex items-center space-x-3">
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
               <FileText size={16} className="mr-2 text-blue-500"/> {t("Header")} <span className="hidden sm:inline">{t("&nbsp;Details")}</span>
             </h3>
             <button 
               onClick={(e) => { e.stopPropagation(); setShowRequirements(!showRequirements); }}
               className="p-1 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors flex items-center space-x-1"
               title="Web Bill Requirements"
             >
               <Info size={14} />
               <span className="text-[10px] font-black uppercase tracking-tighter hidden sm:inline">{t("Requirements")}</span>
             </button>
           </div>
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider dark:bg-gray-900">
               Status: <span className="text-amber-500 ml-1">{t("Draft")}</span>
             </div>
             <button className="text-gray-400 hover:text-gray-600 transition-colors">
               <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.header ? 'rotate-180' : ''}`} />
             </button>
           </div>
        </div>
        {!collapsedSections.header && (
        <div className="form-grid gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="form-field-wrapper">
<label className="form-label flex justify-between items-center">
              <span>{t("Voucher Date & Weekday")}</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <input type="date" value={headerDetails.voucherDate || ''} onChange={(e) => handleHeaderChange('voucherDate', e.target.value)} className="form-input text-sm font-medium dark:focus:bg-gray-700" />
              </div>
              <div className="sm:w-32 flex items-center justify-center px-4 py-3 bg-blue-50 border border-blue-100/50 rounded-xl text-sm font-black text-blue-700 shadow-sm shrink-0 whitespace-nowrap uppercase tracking-widest ring-1 ring-blue-200/50">
                  {(() => {
                    const d = new Date(headerDetails.voucherDate);
                    return isNaN(d.getTime()) ? 'Invalid' : d.toLocaleDateString('en-US', { weekday: 'long' });
                  })()}
              </div>
            </div>
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Voucher Number")}</label>
            <input type="text" value={headerDetails.voucherNumber || ''} onChange={(e) => handleHeaderChange('voucherNumber', e.target.value)} placeholder={t("Auto-generated")} className="form-input text-sm font-medium dark:focus:bg-gray-700" />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("REF / Invoice Number")}</label>
            <input type="text" value={headerDetails.referenceNo || ''} onChange={(e) => handleHeaderChange('referenceNo', e.target.value)} placeholder={t("Optional")} className="form-input text-sm font-medium dark:focus:bg-gray-700" />
          </div>
          
          <div className="form-field-wrapper col-span-full hover:bg-gray-50 flex items-center p-2 rounded-xl border border-transparent transition-all dark:hover:bg-gray-700">
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer shadow-sm dark:border-gray-600 dark:text-gray-400">
               <Paperclip size={14} className="mr-2" /> {t("Attach Document")}
             </button>
             <div className="ml-4 flex items-center">
               {attachedFile ? (
                 <div className="flex items-center text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="ml-2 text-blue-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                 </div>
               ) : (
                 <span className="text-xs text-gray-400 font-medium">{t("No file attached")}</span>
               )}
             </div>
          </div>
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[40] ${collapsedSections.party ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
         <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-[inherit]"></div>
         <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.party ? '' : 'mb-5'}`} onClick={() => toggleSection('party')}>
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <Users size={16} className="mr-2 text-emerald-500"/> Party <span className="hidden sm:inline">{t("&nbsp;Details")}</span>
           </h3>
           <button className="text-gray-400 hover:text-gray-600 transition-colors">
             <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.party ? 'rotate-180' : ''}`} />
           </button>
        </div>
        {!collapsedSections.party && (
        <div className="form-grid gap-x-6 gap-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="form-field-wrapper">
<label className="form-label">{t("Entity Category")}</label>
            <select 
              value={headerDetails.entityCategory || ''} 
              onChange={(e) => handleHeaderChange('entityCategory', e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
            >
              <option value="Customer">{t("Customer")}</option>
              <option value="Vendor">{t("Vendor")}</option>
              <option value="Both">{t("Both")}</option>
              <option value="Internal">{t("Internal")}</option>
              <option value="Hybrid">{t("Hybrid")}</option>
            </select>
          </div>
          <div className="form-field-wrapper">
            <SearchableDropdown
              label={t("Party A/c Name")}
              options={partyMasters.filter(p => {
                const cat = headerDetails.entityCategory;
                if (cat === 'Both') return true;
                if (cat === 'Customer' && (p.type === 'Customer' || p.type === 'Both')) return true;
                if (cat === 'Vendor' && (p.type === 'Vendor' || p.type === 'Both')) return true;
                if (cat === 'Internal' && p.type === 'Internal') return true;
                if (cat === 'Hybrid' && p.type === 'Hybrid') return true;
                return p.type === cat;
              })}
              value={headerDetails.partyName || ''}
              onChange={(value) => handleHeaderChange('partyName', value)}
              placeholder={t("Search {{category}}...", { category: t(headerDetails.entityCategory) })}
            />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Business Role")}</label>
            <select 
              value={headerDetails.businessRole || ''} 
              onChange={(e) => handleHeaderChange('businessRole', e.target.value)} 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
            >
              {(headerDetails.entityCategory === 'Customer' || headerDetails.entityCategory === 'Both') && (
                <>
                  <option value="Trader">{t("Trader")}</option>
                  <option value="Consumer">{t("Consumer")}</option>
                </>
              )}
              {(headerDetails.entityCategory === 'Vendor' || headerDetails.entityCategory === 'Both') && (
                <>
                  <option value="Supplier">{t("Supplier")}</option>
                  <option value="Manufacturer">{t("Manufacturer")}</option>
                </>
              )}
              {(headerDetails.entityCategory === 'Internal' || headerDetails.entityCategory === 'Hybrid') && (
                <>
                  <option value="Operator">{t("Operator")}</option>
                  <option value="Staff">{t("Staff")}</option>
                  <option value="Supervisor">{t("Supervisor")}</option>
                  <option value="Contractor">{t("Contractor")}</option>
                </>
              )}
            </select>
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("GST Number")}</label>
            <input type="text" value={headerDetails.gstNumber || ''} onChange={(e) => handleHeaderChange('gstNumber', e.target.value)} placeholder={t("22AAAAA0000A1Z5")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Aadhaar Card No.")}</label>
            <input type="text" value={headerDetails.aadhaarNo || ''} onChange={(e) => handleHeaderChange('aadhaarNo', e.target.value)} placeholder={t("12-digit number")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("PAN Card No.")}</label>
            <input type="text" value={headerDetails.panNo || ''} onChange={(e) => handleHeaderChange('panNo', e.target.value)} placeholder={t("ABCDE1234F")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Party Type")}</label>
            <select value={headerDetails.partyType || ''} onChange={(e) => handleHeaderChange('partyType', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700">
              <option value="Regular">{t("Regular")}</option>
              <option value="Composition">{t("Composition")}</option>
              <option value="Unregistered">{t("Unregistered")}</option>
              <option value="Consumer">{t("Consumer")}</option>
            </select>
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Place of Supply")}</label>
            <input 
              type="text" 
              value={headerDetails.placeOfSupply || ''} 
              onChange={(e) => handleHeaderChange('placeOfSupply', e.target.value)} 
              placeholder={t("e.g. Maharashtra")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" 
            />
          </div>
          <div className="form-field-wrapper">
<label className="form-label">{t("Supply Classification (System)")}</label>
            <input 
              type="text" 
              value={headerDetails.supplyType || ''} 
              readOnly 
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-black text-gray-500 uppercase tracking-widest text-center cursor-not-allowed select-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
            />
          </div>

          <div className="form-field-wrapper form-grid col-span-full gap-4 p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 mt-2">
            <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t("PO Number")}</label>
              <input type="text" value={headerDetails.poNumber || ''} onChange={(e) => handleHeaderChange('poNumber', e.target.value)} placeholder={t("PO-001")} className="w-full px-3 py-2 bg-white border border-emerald-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800" />
            </div>
            <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t("PO Date")}</label>
              <input type="date" value={headerDetails.poDate || ''} onChange={(e) => handleHeaderChange('poDate', e.target.value)} className="w-full px-3 py-2 bg-white border border-emerald-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800" />
            </div>
            <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t("Credit Period (Days)")}</label>
              <input type="number" value={headerDetails.creditPeriod || ''} onChange={(e) => handleHeaderChange('creditPeriod', e.target.value)} placeholder={t("30")} className="w-full px-3 py-2 bg-white border border-emerald-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800" />
            </div>
            <div className="hidden sm:block">
              <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t("Price Level")}</label>
              <select value={headerDetails.priceLevel || ''} onChange={(e) => handleHeaderChange('priceLevel', e.target.value)} className="w-full px-3 py-2 bg-white border border-emerald-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800">
                <option value="Standard">{t("Standard")}</option>
                <option value="Wholesale">{t("Wholesale")}</option>
                <option value="Retail">{t("Retail")}</option>
                <option value="Consumer">{t("Consumer")}</option>
              </select>
            </div>
          </div>
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[35] ${collapsedSections.logistics ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
         <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-[inherit]"></div>
         <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.logistics ? '' : 'mb-5'}`} onClick={() => toggleSection('logistics')}>
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <MapPin size={16} className="mr-2 text-blue-600"/> {t("Address & Logistics")}
           </h3>
           <button className="text-gray-400 hover:text-gray-600 transition-colors">
             <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.logistics ? 'rotate-180' : ''}`} />
           </button>
        </div>
        {!collapsedSections.logistics && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Billing Address */}
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center">
              <span className="bg-blue-600 w-2 h-2 rounded-full mr-2"></span> {t("Billing Address")}
            </h4>
            <div className="form-grid gap-6">
              <div className="form-field-wrapper lg:col-span-1">
                <SearchableDropdown
                  label={t("Billing Party Name")}
                  options={partyMasters}
                  value={headerDetails.billingPartyName || ''}
                  onChange={(value) => handleHeaderChange('billingPartyName', value)}
                  placeholder={t("Select Party...")}
                />
              </div>
              <div className="form-field-wrapper lg:col-span-2">
                <label className="form-label">{t("Street Address")}</label>
                <input type="text" value={headerDetails.billingAddress || ''} onChange={(e) => handleHeaderChange('billingAddress', e.target.value)} placeholder={t("Full address")} className="form-input text-sm font-medium" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("State")}</label>
                <input type="text" value={headerDetails.billingState || ''} onChange={(e) => handleHeaderChange('billingState', e.target.value)} placeholder={t("e.g. Maharashtra")} className="form-input text-sm font-medium" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("State Code / Pin Code")}</label>
                <div className="flex space-x-2">
                  <input type="text" value={headerDetails.billingStateCode || ''} onChange={(e) => handleHeaderChange('billingStateCode', e.target.value)} placeholder={t("Code")} className="form-input w-20 text-sm font-medium" />
                  <input type="text" value={headerDetails.billingPinCode || ''} onChange={(e) => handleHeaderChange('billingPinCode', e.target.value)} placeholder={t("Pin")} className="form-input flex-1 text-sm font-medium" />
                </div>
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Contact Person")}</label>
                <input type="text" value={headerDetails.contactPerson || ''} onChange={(e) => handleHeaderChange('contactPerson', e.target.value)} placeholder={t("Name")} className="form-input text-sm font-medium" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Mobile Number")}</label>
                <input type="text" value={headerDetails.mobileNumber || ''} onChange={(e) => handleHeaderChange('mobileNumber', e.target.value)} placeholder={t("10-digit number")} className="form-input text-sm font-medium" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("WhatsApp Number")}</label>
                <input type="text" value={headerDetails.whatsappNumber || ''} onChange={(e) => handleHeaderChange('whatsappNumber', e.target.value)} placeholder={t("WhatsApp number")} className="form-input text-sm font-medium" />
              </div>
              <div className="form-field-wrapper">
<label className="form-label">{t("Email ID")}</label>
                <input type="email" value={headerDetails.emailId || ''} onChange={(e) => handleHeaderChange('emailId', e.target.value)} placeholder={t("email@example.com")} className="form-input text-sm font-medium" />
              </div>
            </div>
          </div>

          {/* Shipping Sync Checkbox */}
          <div className="flex items-center space-x-3 px-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={headerDetails.isShippingSameAsBilling || false} 
                onChange={(e) => handleHeaderChange('isShippingSameAsBilling', e.target.checked)}
                className="form-input w-5 h-5 border-2 border-gray-300 text-blue-600 cursor-pointer dark:border-gray-600"
              />
              <span className="text-xs font-black text-gray-700 uppercase tracking-widest dark:text-gray-200">{t("Shipping address is same as billing")}</span>
            </label>
          </div>

          {/* E-Way Bill Toggle */}
          <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={headerDetails.isEWayBillRequired || false} 
                  onChange={(e) => handleHeaderChange('isEWayBillRequired', e.target.checked)}
                  className="form-input w-6 h-6 border-2 border-gray-300 text-blue-600 cursor-pointer dark:border-gray-600"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-800 uppercase tracking-widest dark:text-gray-100">{t("Generate E-Way Bill")}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("Required for interstate transport &gt; ₹50,000")}</span>
                </div>
              </label>

              {headerDetails.isEWayBillRequired && (
                <div className="form-grid flex-1 gap-4 animate-in zoom-in-95 duration-300">
                  <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t("Vehicle No")}</label>
                    <input type="text" value={headerDetails.vehicleNo || ''} onChange={(e) => handleHeaderChange('vehicleNo', e.target.value)} placeholder={t("MH 12 AB 1234")} className="form-input border-blue-100 text-sm font-bold" />
                  </div>
                  <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t("Transporter")}</label>
                    <input type="text" value={headerDetails.transporterName || ''} onChange={(e) => handleHeaderChange('transporterName', e.target.value)} placeholder={t("Transporter Name")} className="form-input border-blue-100 text-sm font-bold" />
                  </div>
                  <div className="form-field-wrapper">
<label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{t("Distance (KM)")}</label>
                    <input type="number" value={headerDetails.distance || ''} onChange={(e) => handleHeaderChange('distance', e.target.value)} placeholder={t("Distance")} className="form-input border-blue-100 text-sm font-bold" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {!headerDetails.isShippingSameAsBilling && (
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500 dark:border-gray-800">
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center">
                <span className="bg-indigo-600 w-2 h-2 rounded-full mr-2"></span> Shipping Address
              </h4>
              <div className="form-grid gap-6">
                <div className="form-field-wrapper lg:col-span-1">
                  <SearchableDropdown
                    label={t("Shipping Party Name")}
                    options={partyMasters}
                    value={headerDetails.shippingPartyName || ''}
                    onChange={(value) => handleHeaderChange('shippingPartyName', value)}
                    placeholder={t("Select Party...")}
                  />
                </div>
                <div className="form-field-wrapper lg:col-span-2">
                  <label className="form-label">{t("Street Address")}</label>
                  <input type="text" value={headerDetails.shippingAddress || ''} onChange={(e) => handleHeaderChange('shippingAddress', e.target.value)} placeholder={t("Full address")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("State")}</label>
                  <input type="text" value={headerDetails.shippingState || ''} onChange={(e) => handleHeaderChange('shippingState', e.target.value)} placeholder={t("e.g. Karnataka")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("State Code / Pin Code")}</label>
                  <div className="flex space-x-2">
                    <input type="text" value={headerDetails.shippingStateCode || ''} onChange={(e) => handleHeaderChange('shippingStateCode', e.target.value)} placeholder={t("Code")} className="w-20 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                    <input type="text" value={headerDetails.shippingPinCode || ''} onChange={(e) => handleHeaderChange('shippingPinCode', e.target.value)} placeholder={t("Pin")} className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                  </div>
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("Contact Info")}</label>
                  <input type="text" value={headerDetails.shippingContact || ''} onChange={(e) => handleHeaderChange('shippingContact', e.target.value)} placeholder={t("Phone or Email")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("Contact Person")}</label>
                  <input type="text" value={headerDetails.shippingContactPerson || ''} onChange={(e) => handleHeaderChange('shippingContactPerson', e.target.value)} placeholder={t("Name")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("Mobile Number")}</label>
                  <input type="text" value={headerDetails.shippingMobileNumber || ''} onChange={(e) => handleHeaderChange('shippingMobileNumber', e.target.value)} placeholder={t("10-digit number")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("WhatsApp Number")}</label>
                  <input type="text" value={headerDetails.shippingWhatsappNumber || ''} onChange={(e) => handleHeaderChange('shippingWhatsappNumber', e.target.value)} placeholder={t("WhatsApp number")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="form-field-wrapper">
<label className="form-label">{t("Email ID")}</label>
                  <input type="email" value={headerDetails.shippingEmailId || ''} onChange={(e) => handleHeaderChange('shippingEmailId', e.target.value)} placeholder={t("email@example.com")} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[30] ${collapsedSections.lineItems ? 'rounded-xl' : 'rounded-2xl'} dark:bg-gray-800`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-[inherit]"></div>
        <div className={`border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer ${collapsedSections.lineItems ? 'px-4 py-3' : 'px-6 py-5'} dark:border-gray-800`} onClick={() => toggleSection('lineItems')}>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
             <ClipboardList size={16} className="mr-2 text-purple-500"/> <span className="hidden sm:inline">{t("Line&nbsp;")}</span>{t("Items")}
           </h3>
           <div className="flex items-center space-x-2 md:space-x-3">
             <button onClick={(e) => { e.stopPropagation(); setScanningRowIndex(-1); setShowScanner(true); }} className="flex items-center px-4 md:px-3 py-2 md:py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700" title={t("Scan")}>
               <ScanBarcode size={16} /> 
             </button>
             <button onClick={(e) => {
               e.stopPropagation();
               setShowNewItemModal(true);
             }} className="flex items-center px-4 md:px-4 py-2 md:py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors" title={t("New Item")}>
               <Settings2 size={16} className="md:mr-1" /> <span className="hidden md:inline">{t("New Item")}</span>
             </button>
             <button onClick={(e) => { e.stopPropagation(); setRows([...rows, { id: Date.now() }]); }} className="flex items-center px-4 md:px-4 py-2 md:py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-purple-200 transition-colors" title={t("Add Item")}>
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
                <th className="px-4 py-4 w-12 text-center">{t("#")}</th>
                <th className="px-4 py-4 min-w-[300px]">{t("Item Description")}</th>
                <th className="px-4 py-4 min-w-[150px]">{t("SKU")}</th>
                <th className="px-4 py-4 min-w-[100px]">{t("HSN/SAC")}</th>
                <th className="px-4 py-4 text-right min-w-[100px]">{t("Qty")}</th>
                <th className="px-4 py-4 text-right min-w-[120px]">{t("Rate (₹)")}</th>
                <th className="px-4 py-4 text-right min-w-[130px]">{t("Rate w/ Tax")}</th>
                <th className="px-4 py-4 text-center w-24">{t("Tax %")}</th>
                <th className="px-4 py-4 text-right min-w-[120px]">{t("Amount (₹)")}</th>
                <th className="px-4 py-4 w-24 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-4 text-center text-xs font-bold text-gray-400 items-center justify-center">
                    <span>{index + 1}</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                       <button className="text-gray-400 hover:text-blue-500 transition-colors shrink-0" title={t("Scan Barcode")} onClick={(e) => { e.stopPropagation(); setScanningRowIndex(index); setShowScanner(true); }}>
                        <ScanBarcode size={18} />
                      </button>
                      <div className="flex-1">
                        <SearchableDropdown
                          options={itemMasters}
                          value={row.itemName || ''}
                          onChange={(value) => handleItemOrSkuChange(index, value, 'itemName')}
                          placeholder={t("Type to search item...")}
                          buttonClassName="w-full min-w-[300px] px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm font-medium focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all dark:focus-within:bg-gray-700"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <SearchableDropdown
                      options={itemMasters.filter(i => i.sku)}
                      value={row.sku || ''}
                      onChange={(value) => handleItemOrSkuChange(index, value, 'sku')}
                      placeholder={t("SKU...")}
                      labelKey="sku"
                      buttonClassName="w-full px-3 py-2 bg-transparent border border-transparent group-hover:border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 dark:focus:bg-gray-700 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" placeholder={t("-")} value={row.hsn || ''} onChange={(e) => { const r = [...rows]; r[index].hsn = e.target.value; setRows(r); }} className="form-input bg-transparent border-transparent group-hover:border-gray-200 text-sm font-medium min-w-[80px] dark:focus:bg-gray-700" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder={t("0")} value={row.qty || ''} onChange={(e) => { const r = [...rows]; r[index].qty = e.target.value; setRows(r); }} className="form-input bg-transparent border-transparent group-hover:border-gray-200 text-sm font-medium text-right min-w-[80px] dark:focus:bg-gray-700" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder={t("0.00")} step="0.01" value={row.rate || ''} onChange={(e) => { 
                      const r = [...rows]; r[index].rate = e.target.value; 
                      const tax = parseFloat(r[index].tax || '18');
                      const rate = parseFloat(e.target.value) || 0;
                      r[index].rateWithTax = (rate * (1 + tax / 100)).toFixed(2);
                      setRows(r); 
                    }} className="form-input bg-transparent border-transparent group-hover:border-gray-200 text-sm font-medium text-right min-w-[80px] dark:focus:bg-gray-700" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder={t("0.00")} step="0.01" value={row.rateWithTax || ''} onChange={(e) => {
                      const r = [...rows]; r[index].rateWithTax = e.target.value;
                      const tax = parseFloat(r[index].tax || '18');
                      const rwt = parseFloat(e.target.value) || 0;
                      const divisor = 1 + tax / 100;
                      r[index].rate = divisor !== 0 ? (rwt / divisor).toFixed(2) : '0';
                      setRows(r);
                    }} className="form-input bg-transparent border-transparent group-hover:border-gray-200 text-sm font-medium text-right min-w-[90px] dark:focus:bg-gray-700" />
                  </td>
                  <td className="px-4 py-2">
                    <select value={row.tax || '18'} onChange={(e) => {
                      const r = [...rows]; r[index].tax = e.target.value; 
                      const tax = parseFloat(e.target.value) || 0;
                      const rate = parseFloat(r[index].rate) || 0;
                      r[index].rateWithTax = (rate * (1 + tax / 100)).toFixed(2);
                      setRows(r); 
                    }} className="form-input px-2 bg-transparent border-transparent group-hover:border-gray-200 text-sm font-medium text-center appearance-none cursor-pointer min-w-[60px] dark:focus:bg-gray-700">
                      <option value="0">{t("0%")}</option>
                      <option value="5">{t("5%")}</option>
                      <option value="12">{t("12%")}</option>
                      <option value="18">{t("18%")}</option>
                      <option value="28">{t("28%")}</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-700 min-w-[100px] dark:text-gray-200">
                    ₹{formatNumber(Number(calculateRowNetAmount(row).toFixed(2)))}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setEditingRowIndex(index)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors border border-blue-100" title={t("Edit")}>
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
          {renderSalesPurchaseForm()}
          
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
           {t(activeTab.replace('_', ' '))}
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
      />
      
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onSave={(item) => {
          if (onAddItemMaster) {
            onAddItemMaster(item);
            alert(`${t("New item")} "${item.name}" ${t("created successfully!")}`);
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
        title={t("Voucher History")} 
      />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={t("Delete Voucher")}
        message={t("Are you sure you want to delete this voucher? This action cannot be undone.")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={t("Delete")}
        isDestructive={true}
      />
      <ConfirmModal
        isOpen={showClearConfirm}
        title={t("Clear Entry")}
        message={t("Are you sure you want to clear all fields? Any unsaved changes will be lost.")}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearConfirm(false)}
        confirmText={t("Clear Form")}
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
