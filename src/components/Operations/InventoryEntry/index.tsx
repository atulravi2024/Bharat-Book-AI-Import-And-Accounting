import React, { useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Database, Trash2, ArrowRightLeft, Move, MapPin, Zap } from 'lucide-react';
import { NewItemModal } from '../NewItemModal';
import { BarcodeScannerModal } from '../BarcodeScannerModal';
import { CalculatorModal } from '../../ui/CalculatorModal';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { HistoryModal } from '../../ui/HistoryModal';
import { VoucherPreview } from '../VoucherEntry/VoucherPreview';
import { Notification } from '../../ui/Notification';
import { 
  EntryDetailsSection, LocationSection, PartySection, 
  LogisticsSection, ItemTableSection, AdjustmentsSection, 
  SummarySection, RemarksSection, InventoryActionMenu, 
  InventoryEditModal, InventoryHelpModal
} from './views';
import { SystemInfo } from '../VoucherEntry/components/SystemInfo';
import { useInventoryEntry } from './hooks/useInventoryEntry';
import { InventoryEntryViewProps } from './types';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { X, HelpCircle } from 'lucide-react';

export const InventoryEntryView: React.FC<InventoryEntryViewProps> = ({ 
  defaultType, itemMasters = [], warehouseMasters = [], 
  ledgerMasters = [], partyMasters = [], vouchers = [], 
  onUpdateItemMaster, onAddItemMaster, onSaveEntry, 
  onDeleteEntry, onOpenPrintSettings 
}) => {
  const { t } = useLanguage();

  const hookData = useInventoryEntry({
    defaultType, itemMasters, partyMasters, vouchers, onSaveEntry
  });

  const {
    editingRowIndex, setEditingRowIndex,
    expandedRowSection, setExpandedRowSection,
    activeTab, setActiveTab,
    showNewItemModal, setShowNewItemModal,
    showScanner, setShowScanner,
    scanningRowIndex, setScanningRowIndex,
    rows, setRows,
    collapsedSections, toggleSection,
    showRequirements, setShowRequirements,
    headerDetails, handleHeaderChange,
    systemStamp, formError, setFormError,
    totals, notification, setNotification, showNotify,
    showPreview, setShowPreview,
    isPrinting, setIsPrinting,
    showCalculator, setShowCalculator,
    currentRecordId,
    showHistory, setShowHistory,
    showHelp, setShowHelp,
    showKeyboardShortcuts, setShowKeyboardShortcuts,
    showDeleteConfirm, setShowDeleteConfirm,
    showClearConfirm, setShowClearConfirm,
    isSection0Collapsed, setIsSection0Collapsed,
    isSection1Collapsed, setIsSection1Collapsed,
    isSection2Collapsed, setIsSection2Collapsed,
    isSection3Collapsed, setIsSection3Collapsed,
    fileInputRef, attachedFile, setAttachedFile,
    handleBarcodeScanned, handleItemOrSkuChange,
    saveInventoryEntry, getEnrichedRows, loadRecord,
    handleNavigate, handleDuplicateEntry, handleNewEntry,
    handleClearEntryClick, handleDeleteEntryClick
  } = hookData;

  const tabs = [
    { id: 'stock_journal', label: 'Stock Journal', icon: ArrowRightLeft },
    { id: 'physical_stock', label: 'Physical Stock', icon: Database },
    { id: 'consumption', label: 'Item Consumption', icon: Zap },
    { id: 'scrap', label: 'Item Scrap', icon: Trash2 },
    { id: 'transfer', label: 'Inter-Location', icon: Move },
    { id: 'rejections_in', label: 'Rejections In', icon: MapPin },
    { id: 'rejections_out', label: 'Rejections Out', icon: MapPin },
  ];

  const handleSaveInfoResult = (entry: any) => {
    if (entry) {
        showNotify(t('Entry saved successfully!'));
    }
  }

  const handleSave = () => {
    const entry = saveInventoryEntry();
    handleSaveInfoResult(entry);
  };

  const handleSaveNew = () => {
    const entry = saveInventoryEntry();
    if (!entry) return;
    
    // clear logic is handled in handleNewEntry or we can manually handle
    loadRecord(null);
    showNotify(t('Entry saved successfully! Starting a new one.'));
  };

  const handleSavePrint = () => {
    const entry = saveInventoryEntry();
    if (entry) {
        setIsPrinting(true);
        setShowPreview(true);
    }
  };

  const handleSaveDraft = () => {
    saveInventoryEntry(true);
    showNotify(t('Entry saved as draft!'), 'info');
  };

  const handlePreview = () => {
    setIsPrinting(false);
    setShowPreview(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteEntry && currentRecordId) {
      onDeleteEntry(currentRecordId);
    }
    showNotify(t('Entry deleted!'), 'error');
    handleNewEntry();
    setShowDeleteConfirm(false);
  };

  const handleConfirmClear = () => {
    handleNewEntry();
    setShowClearConfirm(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        if (e.key === 'F1') { e.preventDefault(); setShowHelp(true); }
        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          if (e.shiftKey) { e.preventDefault(); handleSaveNew(); } 
          else { e.preventDefault(); handleSave(); }
        }
        else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
          e.preventDefault(); handleSavePrint();
        }
        else if (e.altKey) {
          const key = e.key.toLowerCase();
          if (key === 'c') { e.preventDefault(); setShowCalculator(true); }
          else if (key === 's') { e.preventDefault(); setScanningRowIndex(-1); setShowScanner(true); }
          else if (key === 'a') { e.preventDefault(); fileInputRef.current?.click(); }
          else if (key === 'h') { e.preventDefault(); setShowHistory(true); }
          else if (key === 'd') { e.preventDefault(); handleDuplicateEntry(); }
          else if (key === 'x') { e.preventDefault(); handleClearEntryClick(); }
          else if (e.key === 'Delete') { e.preventDefault(); handleDeleteEntryClick(); }
          else if (key === '0') { e.preventDefault(); setIsSection0Collapsed(prev => !prev); }
          else if (key === '1') { e.preventDefault(); setIsSection1Collapsed(prev => !prev); }
          else if (key === '2') { e.preventDefault(); setIsSection2Collapsed(prev => !prev); }
          else if (key === '3') { e.preventDefault(); setIsSection3Collapsed(prev => !prev); }
          else if (key === '4') { e.preventDefault(); setExpandedRowSection(prev => prev === 'item_selection' ? null : 'item_selection'); }
          else if (key === '5') { e.preventDefault(); setExpandedRowSection(prev => prev === 'attributes' ? null : 'attributes'); }
          else if (key === '6') { e.preventDefault(); setExpandedRowSection(prev => prev === 'quantities' ? null : 'quantities'); }
          else if (key === '7') { e.preventDefault(); setExpandedRowSection(prev => prev === 'pricing' ? null : 'pricing'); }
          else if (key === '8') { e.preventDefault(); setExpandedRowSection(prev => prev === 'tracking' ? null : 'tracking'); }
        }
        return;
      }
      if (e.key === 'F1') { e.preventDefault(); setShowHelp(true); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        if (e.shiftKey) { e.preventDefault(); handleSaveNew(); } else { e.preventDefault(); handleSave(); }
      }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') { e.preventDefault(); handleNewEntry(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); handleSavePrint(); }
      else if (e.altKey && e.key.toLowerCase() === 'c') { e.preventDefault(); setShowCalculator(true); }
      else if (e.altKey && e.key.toLowerCase() === 's') { e.preventDefault(); setScanningRowIndex(-1); setShowScanner(true); }
      else if (e.altKey && e.key.toLowerCase() === 'a') { e.preventDefault(); fileInputRef.current?.click(); }
      else if (e.altKey && e.key.toLowerCase() === 'h') { e.preventDefault(); setShowHistory(true); }
      else if (e.altKey && e.key.toLowerCase() === 'd') { e.preventDefault(); handleDuplicateEntry(); }
      else if (e.altKey && e.key.toLowerCase() === 'x') { e.preventDefault(); handleClearEntryClick(); }
      else if (e.altKey && e.key === 'Delete') { e.preventDefault(); handleDeleteEntryClick(); }
      else if (e.altKey && e.key === '0') { e.preventDefault(); setIsSection0Collapsed(prev => !prev); }
      else if (e.altKey && e.key === '1') { e.preventDefault(); setIsSection1Collapsed(prev => !prev); }
      else if (e.altKey && e.key === '2') { e.preventDefault(); setIsSection2Collapsed(prev => !prev); }
      else if (e.altKey && e.key === '3') { e.preventDefault(); setIsSection3Collapsed(prev => !prev); }
      else if (e.altKey && e.key === '4') { e.preventDefault(); setExpandedRowSection(prev => prev === 'item_selection' ? null : 'item_selection'); }
      else if (e.altKey && e.key === '5') { e.preventDefault(); setExpandedRowSection(prev => prev === 'attributes' ? null : 'attributes'); }
      else if (e.altKey && e.key === '6') { e.preventDefault(); setExpandedRowSection(prev => prev === 'quantities' ? null : 'quantities'); }
      else if (e.altKey && e.key === '7') { e.preventDefault(); setExpandedRowSection(prev => prev === 'pricing' ? null : 'pricing'); }
      else if (e.altKey && e.key === '8') { e.preventDefault(); setExpandedRowSection(prev => prev === 'tracking' ? null : 'tracking'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleGeneratePDF = async () => {
    const element = document.getElementById('voucher-to-print');
    if (!element) return;
    try {
      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2, cacheBust: true, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeTab}_${headerDetails.entryNumber || 'inventory'}.pdf`);
      showNotify(t('PDF generated successfully!'));
    } catch (error) {
      showNotify(t('Failed to generate PDF. Please try again.'), 'error');
    }
  };

  const handleGenerateImage = async () => {
    const element = document.getElementById('voucher-to-print');
    if (!element) return;
    try {
      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2, cacheBust: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${activeTab}_${headerDetails.entryNumber || 'inventory'}.png`;
      link.href = dataUrl;
      link.click();
      showNotify(t('Image generated successfully!'));
    } catch (error) {
      showNotify(t('Failed to generate image. Please try again.'), 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-full">
      <div className="sticky top-0 z-[40] md:static -mx-4 px-4 -mt-4 pt-4 bg-gray-100/95 backdrop-blur-md pb-4 mb-4 md:-mx-0 md:px-0 md:-mt-0 md:pt-0 md:bg-transparent md:pb-0 md:mb-8 overflow-x-auto custom-scrollbar w-full">
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm inline-flex min-w-max dark:bg-gray-800 dark:border-gray-700">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setRows([{id: Date.now()}, {id: Date.now() + 1}]); }}
                className={`
                  whitespace-nowrap py-2.5 px-5 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all flex items-center
                  ${activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20' 
                    : 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }
                 dark:text-gray-400 dark:hover:bg-gray-700`}
              >
                <tab.icon size={14} className="mr-2" />
                {t(tab.label)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-stretch pb-24 md:pb-0">
        <div className="w-full">
          <EntryDetailsSection
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            systemStamp={systemStamp}
            formError={formError}
            showRequirements={showRequirements}
            setShowRequirements={setShowRequirements}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            fileInputRef={fileInputRef}
            attachedFile={attachedFile}
            setAttachedFile={setAttachedFile}
            activeTab={activeTab}
          />
          <LocationSection
            activeTab={activeTab}
            headerDetails={headerDetails}
            warehouseMasters={warehouseMasters}
            handleHeaderChange={handleHeaderChange}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
          <PartySection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            partyMasters={partyMasters}
            handleHeaderChange={handleHeaderChange}
            activeTab={activeTab}
          />
          <LogisticsSection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
          />
          <ItemTableSection
            activeTab={activeTab}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            rows={rows}
            setRows={setRows}
            itemMasters={itemMasters}
            warehouseMasters={warehouseMasters}
            handleItemOrSkuChange={handleItemOrSkuChange}
            setEditingRowIndex={setEditingRowIndex}
            setExpandedRowSection={setExpandedRowSection}
            setShowScanner={setShowScanner}
            setScanningRowIndex={setScanningRowIndex}
            showRequirements={showRequirements}
            setShowNewItemModal={setShowNewItemModal}
          />
          
          <RemarksSection
             collapsedSections={collapsedSections}
             toggleSection={toggleSection}
             headerDetails={headerDetails}
             handleHeaderChange={handleHeaderChange}
          />
        </div>
        
        {activeTab !== 'physical_stock' && (
        <div className="w-full">
          <AdjustmentsSection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            ledgerMasters={ledgerMasters}
          />
        </div>
        )}

        <div className="w-full">
          <SummarySection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            totals={totals}
            activeTab={activeTab}
            headerDetails={headerDetails}
            rows={rows}
          />
        </div>

        <div className="w-full">
          <SystemInfo
            collapsed={collapsedSections.systemInfo}
            toggleSection={() => toggleSection('systemInfo')}
            createdAt={currentRecordId ? (vouchers?.find(v => v.id === currentRecordId)?.createdAt || new Date().toISOString()) : undefined}
            updatedAt={currentRecordId ? (vouchers?.find(v => v.id === currentRecordId)?.updatedAt || new Date().toISOString()) : undefined}
            recordId={currentRecordId || null}
            createdBy="Administrator"
            rowNumber={currentRecordId && vouchers ? vouchers.findIndex(v => v.id === currentRecordId) + 1 : 0}
            voucherType={activeTab}
          />
        </div>
      </div>

      <InventoryActionMenu
        activeTab={activeTab}
        isSection0Collapsed={isSection0Collapsed} setIsSection0Collapsed={setIsSection0Collapsed}
        isSection1Collapsed={isSection1Collapsed} setIsSection1Collapsed={setIsSection1Collapsed}
        isSection2Collapsed={isSection2Collapsed} setIsSection2Collapsed={setIsSection2Collapsed}
        isSection3Collapsed={isSection3Collapsed} setIsSection3Collapsed={setIsSection3Collapsed}
        handleNavigate={handleNavigate}
        handleSave={handleSave}
        setShowHistory={setShowHistory}
        setScanningRowIndex={setScanningRowIndex}
        setShowScanner={setShowScanner}
        fileInputRef={fileInputRef}
        attachedFile={attachedFile}
        setShowCalculator={setShowCalculator}
        handleDuplicateEntry={handleDuplicateEntry}
        handleNewEntry={handleNewEntry}
        handleSavePrint={handleSavePrint}
        handleSaveNew={handleSaveNew}
        handleSaveDraft={handleSaveDraft}
        handlePreview={handlePreview}
        handleGeneratePDF={handleGeneratePDF}
        handleGenerateImage={handleGenerateImage}
        handleClearEntryClick={handleClearEntryClick}
        handleDeleteEntryClick={handleDeleteEntryClick}
        setShowKeyboardShortcuts={setShowKeyboardShortcuts}
        setShowHelp={setShowHelp}
        onOpenPrintSettings={onOpenPrintSettings}
      />
      
      <InventoryEditModal
        isOpen={editingRowIndex !== null}
        onClose={() => { setEditingRowIndex(null); setExpandedRowSection(null); }}
        rows={rows}
        editingRowIndex={editingRowIndex!}
        expandedRowSection={expandedRowSection}
        setExpandedRowSection={setExpandedRowSection}
        handleItemOrSkuChange={handleItemOrSkuChange}
        setRows={setRows}
        setShowScanner={setShowScanner}
        setScanningRowIndex={setScanningRowIndex}
        itemMasters={itemMasters}
        warehouseMasters={warehouseMasters}
        activeTab={activeTab}
      />
      
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onSave={(item) => {
          if (onAddItemMaster) {
            onAddItemMaster(item);
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
      <InventoryHelpModal
        isOpen={showHelp || showKeyboardShortcuts}
        onClose={() => { setShowHelp(false); setShowKeyboardShortcuts(false); }}
      />

      <HistoryModal onDeleteRecord={onDeleteEntry} items={(vouchers || []).filter(v => (typeof v.type === 'string' ? v.type.toLowerCase().replace(/ /g, '_') : v.type) === activeTab)} 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        storageKey="bharat_book_inventory_entries" 
        onSelectRecord={(record) => loadRecord(record)}
        title="Inventory History" 
      />

      {/* Hidden file input for attachments */}
      <input type="file" id="inventory-file-upload" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Entry"
        message="Are you sure you want to delete this inventory entry? This action cannot be undone."
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
    </div>
  );
};
