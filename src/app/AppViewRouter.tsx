import React from 'react';
import { RefreshCw, Lock, Shield, Check, Layers, ListTodo, FileSpreadsheet, Upload, Sliders, Settings, Cpu, Database, ShieldAlert, ClipboardCheck } from 'lucide-react';
import { useAppLogic } from './useAppLogic';
import { Step1Upload } from '../components/Operations/Import/Step1Upload';
import { Step1Processing } from '../components/Operations/Import/Step1Processing';
import { Step2Correction } from '../components/Operations/Import/Step2Correction';
import { Step3Summary } from '../components/Operations/Import/Step3Summary';
import { SuccessScreen } from '../components/Operations/Import/SuccessScreen';
import { MasterView } from '../components/Masters/MasterView';
import { LedgerReportView } from '../components/Reports/BankVouchers/LedgerReportView';
import { BankReportView } from '../components/Reports/BankVouchers/BankReportView';
import { DashboardView } from '../components/Dashboard/DashboardView';
import { ReportsView } from '../components/Reports/FinancialReport/FinancialReportView';
import { ItemReportView } from '../components/Reports/Items/ItemReportView';
import { VoucherEntryView } from '../components/Operations/VoucherEntry/VoucherEntryView';
import { InventoryEntryView } from '../components/Operations/InventoryEntry/InventoryEntryView';
import { SystemDecideView } from '../components/Operations/BulkOperation/SystemDecideView';
import { SettingsView } from '../components/Settings/SettingsView';
import { HelpSettings } from '../components/Settings/HelpSettings';
import { SupportSettings } from '../components/Settings/SupportSettings';
import { GSTReportView } from '../components/Reports/GSTReport/GSTReportView';
import { AppStep, ParsedVoucher, VoucherType, ParsingSettings, MainView, ColorMaster, SizeMaster, DimensionMaster, BomMaster } from './types';
import { InfoIcon, UndoIcon } from '../components/icons/IconComponents';
import { getEffectivePolicy, isWithinAllowedHours } from '../utils/security';
import { useNotifications } from '../context/NotificationContext';

export const AppViewRouter: React.FC<{ appState: ReturnType<typeof useAppLogic> }> = ({ appState }) => {

  const { addNotification } = useNotifications();

  // We destructure this way because in TS relying on destructuring 150 properties isn't pretty inside function arguments.
  const { 
    view, setView, activeMasterTab, setActiveMasterTab, reportActiveTab, setReportActiveTab, bankActiveTab, setBankActiveTab,
    dashboardActiveTab, setDashboardActiveTab, vouchersActiveTab, setVouchersActiveTab, gstActiveTab, setGstActiveTab,
    itemReportActiveTab, setItemReportActiveTab, voucherEntryActiveTab, setVoucherEntryActiveTab, inventoryEntryActiveTab,
    setInventoryEntryActiveTab, settingsActiveTab, setSettingsActiveTab, supportActiveTab, setSupportActiveTab, activeSamples,
    uploadSubStep, correctionSubStep, importCategory, setImportCategory, step, setStep, entryStep, setEntryStep, vouchers, editingVoucher,
    allVouchers, setAllVouchers, voucherType, setVoucherType, parsingSettings, isLoading, hasDraft, pendingFile,
    partyMasters, setPartyMasters, ledgerMasters, setLedgerMasters, itemMasters, setItemMasters, uomMasters, setUomMasters,
    gstMasters, setGstMasters, brandMasters, setBrandMasters, categoryMasters, setCategoryMasters, gradeMasters, setGradeMasters,
    assertionCategoryMasters, assertionCodeMasters, contactMasters, setContactMasters, skuMasters, setSkuMasters, priceListMasters, setPriceListMasters,
    weightMasters, setWeightMasters, volumeMasters, setVolumeMasters, colorMasters, setColorMasters, sizeMasters, setSizeMasters,
    variantMasters, setVariantMasters, dimensionMasters, setDimensionMasters, locationMasters, setLocationMasters, bomMasters, setBomMasters,
    stockGroupMasters, setStockGroupMasters, costCenterMasters, setCostCenterMasters, accountGroupMasters, setAccountGroupMasters,
    customMasters, setCustomMasters, resetFlow, handleBulkDeleteVouchers, handleSubmit, setOriginView, handleAppModeChange,
  setUploadSubStep,
setCorrectionSubStep,
language,
clearDraft,
resumeDraft,
error,
originView,
pendingMapping,
pendingSourceBank,
setVouchers,
setError,
handleStep1Next,
handleStep2Next,
  handleDuplicateVoucher,
  handleDeleteVoucher,
  handleViewVoucher,
handleSaveDraft,
handleAddPartyMaster,
handleAddLedgerMaster,
handleAddUomMaster,
handleAddItemMaster,
setAssertionCategoryMasters,
setAssertionCodeMasters,
setEditingVoucher
} = appState as any;


 
    const getActiveImportStepId = (): string => {
    if (step === 'upload') {
      return uploadSubStep;
    }
    if (step === 'processing') {
      return 'processing';
    }
    if (step === 'correction') {
      return correctionSubStep === 'missing' ? 'matching' : 'correction';
    }
    if (step === 'summary') {
      return 'summary';
    }
    if (step === 'success') {
      return 'success';
    }
    return 'type';
  };

  const getStepIndex = (id: string): number => {
    const list = ['type', 'choose', 'preview', 'upload', 'mapping', 'settings', 'processing', 'matching', 'correction', 'summary', 'success'];
    return list.indexOf(id);
  };

  const handleStepClick = (targetId: string) => {
    const currentActiveId = getActiveImportStepId();
    const currentIndex = getStepIndex(currentActiveId);
    const targetIndex = getStepIndex(targetId);

    // If the step is ahead of current progress, restrict direct skipping to avoid empty state crashes
    if (targetIndex > currentIndex) {
      if (step === 'upload' && targetIndex < 6) {
        setUploadSubStep(targetId as any);
      }
      return;
    }

    if (targetIndex === currentIndex) return;

    if (targetIndex < 6) {
      setStep('upload');
      setUploadSubStep(targetId as any);
    } else if (targetId === 'processing') {
      if (pendingFile) {
        setStep('processing');
      }
    } else if (targetId === 'matching') {
      if (vouchers && vouchers.length > 0) {
        setStep('correction');
        setCorrectionSubStep('missing');
      }
    } else if (targetId === 'correction') {
      if (vouchers && vouchers.length > 0) {
        setStep('correction');
        setCorrectionSubStep('unmap');
      }
    } else if (targetId === 'summary') {
      if (vouchers && vouchers.length > 0) {
        setStep('summary');
      }
    }
  };

  const renderImportStepper = () => {
    const currentActiveId = getActiveImportStepId();
    const currentIndex = getStepIndex(currentActiveId);
    const isHindi = language === 'hi';

    const steps = [
      { id: 'type', title: isHindi ? 'इम्पोर्ट' : 'Import', icon: Layers },
      { id: 'choose', title: isHindi ? 'श्रेणी' : 'Category', icon: ListTodo },
      { id: 'preview', title: isHindi ? 'टेम्पलेट' : 'Template', icon: FileSpreadsheet },
      { id: 'upload', title: isHindi ? 'अपलोड' : 'Upload', icon: Upload },
      { id: 'mapping', title: isHindi ? 'मिलान' : 'Mapping', icon: Sliders },
      { id: 'settings', title: isHindi ? 'सेटिंग्स' : 'Settings', icon: Settings },
      { id: 'processing', title: isHindi ? 'प्रोसेसिंग' : 'AI Process', icon: Cpu },
      { id: 'matching', title: isHindi ? 'मास्टर मिलान' : 'Master Match', icon: Database },
      { id: 'correction', title: isHindi ? 'त्रुटि सुधार' : 'Verify', icon: ShieldAlert },
      { id: 'summary', title: isHindi ? 'सारांश' : 'Summary', icon: ClipboardCheck },
      { id: 'success', title: isHindi ? 'सफल' : 'Success', icon: Check }
    ];

    return (
      <div className="bg-white dark:bg-gray-800 border border-premium-slate-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
        {/* Mobile View: Compact step details indicator */}
        <div className="flex md:hidden items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black tracking-widest text-[#23d160] uppercase leading-none">
              {isHindi ? 'चरण' : 'Step'} {currentIndex + 1} / {steps.length}
            </p>
            <h3 className="text-sm font-black text-gray-800 dark:text-white flex items-center">
              {React.createElement(steps[currentIndex].icon, { className: "w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" })}
              {steps[currentIndex].title}
            </h3>
          </div>
          <div className="w-24 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Desktop View: Wide process timeline */}
        <div className="hidden md:flex items-center justify-between relative px-2 py-1 select-none overflow-x-auto whitespace-nowrap scrollbar-none">
          {/* Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 dark:bg-gray-700 z-0 rounded-full"></div>
          {/* Active Fill Track */}
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-[2.5px] bg-blue-600 dark:bg-blue-500 z-0 transition-all duration-500 ease-in-out rounded-full"
            style={{ 
              width: `calc(${currentIndex === 0 ? '0px' : `(${currentIndex} / ${steps.length - 1}) * 100%`})`,
            }}
          ></div>

          {steps.map((s, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;
            const StepIcon = s.icon;

            return (
              <div 
                key={s.id} 
                className="relative z-10 flex flex-col items-center flex-1 cursor-pointer group"
                onClick={() => handleStepClick(s.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                    isCurrent
                      ? 'border-blue-600 text-blue-600 bg-white dark:bg-gray-800 ring-4 ring-blue-50 dark:ring-blue-900/30'
                      : isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 dark:bg-blue-600 dark:border-blue-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 group-hover:border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white font-bold" strokeWidth={3} />
                  ) : (
                    <StepIcon className={`w-3.5 h-3.5 ${isCurrent ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-current'}`} />
                  )}
                  
                  {/* Step progression counter pill */}
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-gray-500 text-white min-w-[12px] h-[12px] flex items-center justify-center rounded-full leading-none font-medium px-0.5 shadow-sm">
                    {index + 1}
                  </span>
                </div>
                <div className={`mt-2 text-[10px] md:text-[11px] font-bold text-center transition-colors duration-300 ${
                  isCurrent ? 'text-blue-600 dark:text-blue-400 font-extrabold' : isCompleted ? 'text-gray-700 dark:text-gray-300 font-semibold' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {s.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <>
            {hasDraft && (
              <div className="max-w-5xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center text-blue-800">
                  <InfoIcon className="mr-3" />
                  <span className="text-sm font-medium">You have an unsaved draft from a previous session.</span>
                </div>
                <div className="flex space-x-3">
                  <button onClick={clearDraft} className="text-xs text-gray-500 hover:text-gray-700 font-medium dark:text-gray-400">Discard</button>
                  <button onClick={resumeDraft} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                    <UndoIcon className="mr-2 text-sm" /> Resume Draft
                  </button>
                </div>
              </div>
            )}
            <Step1Upload 
              onNext={handleStep1Next} 
              isLoading={isLoading} 
              onCancel={resetFlow} 
              error={error} 
              clearError={() => setError(null)} 
              initialSettings={parsingSettings}
              initialVoucherType={voucherType}
              ledgerMasters={ledgerMasters}
              activeTab={uploadSubStep}
              onTabChange={setUploadSubStep}
              onImportCategoryChange={setImportCategory}
              hideStepper={true}
            />
          </>
        );
      case 'processing':
        return (
          <Step1Processing 
            file={pendingFile}
            voucherType={voucherType}
            mapping={pendingMapping}
            settings={parsingSettings}
            sourceBank={pendingSourceBank}
            partyMasters={partyMasters}
            ledgerMasters={ledgerMasters}
            onComplete={(parsedVouchers) => {
              setVouchers(parsedVouchers);
              setStep('correction');
              setCorrectionSubStep('missing'); // start correction view on master matching tab
            }}
            onCancel={resetFlow}
          />
        );
      case 'correction':
        return (
              <Step2Correction 
                vouchers={vouchers} 
                setVouchers={setVouchers} 
                onBack={() => { 
                  if (entryStep === 'correction') {
                    if (originView && originView !== 'import') {
                      setView(originView);
                      setOriginView(null);
                    } else {
                      setView('dashboard');
                    }
                    resetFlow();
                  } else {
                    setStep('upload'); 
                    setError(null); 
                  }
                }} 
                onNext={handleStep2Next} 
                onSaveDraft={handleSaveDraft}
                partyMasters={partyMasters}
                ledgerMasters={ledgerMasters}
                contactMasters={contactMasters}
                setContactMasters={setContactMasters}
                onAddParty={handleAddPartyMaster}
                onAddLedger={handleAddLedgerMaster}
                uomMasters={uomMasters}
                itemMasters={itemMasters}
                onAddUom={handleAddUomMaster}
                onAddItem={handleAddItemMaster}
                voucherType={voucherType}
                allVouchers={allVouchers}
                onNavigateToMasters={() => setView('ledger-master')}
                activeTab={correctionSubStep}
                onTabChange={setCorrectionSubStep}
                importCategory={importCategory}
                locationMasters={locationMasters}
                bomMasters={bomMasters}
                stockGroupMasters={stockGroupMasters}
                costCenterMasters={costCenterMasters}
                accountGroupMasters={accountGroupMasters}
                categoryMasters={categoryMasters}
                brandMasters={brandMasters}
                gradeMasters={gradeMasters}
                gstMasters={gstMasters}
                skuMasters={skuMasters}
                priceListMasters={priceListMasters}
                variantMasters={variantMasters}
                sizeMasters={sizeMasters}
                colorMasters={colorMasters}
                setLedgerMasters={setLedgerMasters}
                setItemMasters={setItemMasters}
                setUomMasters={setUomMasters}
                setPartyMasters={setPartyMasters}
                setLocationMasters={setLocationMasters}
                setBomMasters={setBomMasters}
                setStockGroupMasters={setStockGroupMasters}
                setCostCenterMasters={setCostCenterMasters}
                setAccountGroupMasters={setAccountGroupMasters}
                setCategoryMasters={setCategoryMasters}
                setBrandMasters={setBrandMasters}
                setGradeMasters={setGradeMasters}
                setSkuMasters={setSkuMasters}
                setPriceListMasters={setPriceListMasters}
                setWeightMasters={setWeightMasters}
                setVolumeMasters={setVolumeMasters}
                setSizeMasters={setSizeMasters}
                setColorMasters={setColorMasters}
                setVariantMasters={setVariantMasters}
                setDimensionMasters={setDimensionMasters}
                setGstMasters={setGstMasters}
                onOtherImportSuccess={(message) => {
                    addNotification({
                      title: 'Import Composed',
                      message,
                      type: 'Alert'
                    });
                    setStep('success');
                }}
                initialSettings={parsingSettings}
            />
        );
      case 'summary':
        return <Step3Summary vouchers={vouchers} voucherType={voucherType} onBack={() => setStep((importCategory === 'tax_related' || importCategory === 'settings') ? 'upload' : 'correction')} onSubmit={handleSubmit} isLoading={isLoading} onCancel={resetFlow} importCategory={importCategory} file={pendingFile} />;
      case 'success':
        const isBankImportForSuccess = vouchers.some(v => v.origin === 'bank' || v.type === VoucherType.BankStatement);
        return (
          <SuccessScreen 
            vouchers={vouchers} 
            importCategory={importCategory}
            onDone={resetFlow} 
            onGoToDashboard={() => {
              setOriginView(null);
              setView('dashboard');
              resetFlow();
            }}
            onGoToVouchers={() => {
              setOriginView(null);
              setView(isBankImportForSuccess ? 'bank' : 'vouchers');
              resetFlow();
            }}
            onUndo={handleBulkDeleteVouchers}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  const renderContent = () => {
    const policy = getEffectivePolicy();
    const timeCheck = isWithinAllowedHours(policy.workHoursMode);

    if (!timeCheck.allowed) {
      return (
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center h-[calc(100vh-80px)]">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-[2rem] flex items-center justify-center mb-6 border border-rose-100 dark:border-rose-900/50">
            <Lock className="text-3xl text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Security Access Locked</h3>
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mt-1">Group Work-Hours Restriction</p>
          <p className="text-gray-500 mt-4 max-w-md dark:text-gray-400 text-xs font-semibold leading-relaxed">
            {timeCheck.reason}
          </p>
          <p className="text-gray-400 mt-2 max-w-sm dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest pl-1">
            (Code: ERR_RESTRICTED_HOURS)
          </p>
        </div>
      );
    }

    if (view === 'dashboard') {
        return (
            <DashboardView vouchers={allVouchers} defaultTab={dashboardActiveTab} onTabChange={setDashboardActiveTab} onNavigateToView={setView} 
                
            />
        );
    }

    if (view === 'ledger-master' || view === 'item-master') {
        return (
            <MasterView 
                initialSubTab={view === 'item-master' ? 'item' : 'ledger'}
                partyMasters={partyMasters} 
                ledgerMasters={ledgerMasters} 
                itemMasters={itemMasters}
                uomMasters={uomMasters}
                gstMasters={gstMasters}
                brandMasters={brandMasters}
                categoryMasters={categoryMasters}
                gradeMasters={gradeMasters}
                assertionCategoryMasters={assertionCategoryMasters}
                assertionCodeMasters={assertionCodeMasters}
                contactMasters={contactMasters}
                skuMasters={skuMasters}
                priceListMasters={priceListMasters}
                weightMasters={weightMasters}
                volumeMasters={volumeMasters}
                colorMasters={colorMasters}
                sizeMasters={sizeMasters}
                variantMasters={variantMasters}
                dimensionMasters={dimensionMasters}
                locationMasters={locationMasters}
                bomMasters={bomMasters}
                stockGroupMasters={stockGroupMasters}
                costCenterMasters={costCenterMasters}
                accountGroupMasters={accountGroupMasters}
                setPartyMasters={setPartyMasters}
                setLedgerMasters={setLedgerMasters}
                setItemMasters={setItemMasters}
                setUomMasters={setUomMasters}
                setGstMasters={setGstMasters}
                setBrandMasters={setBrandMasters}
                setCategoryMasters={setCategoryMasters}
                setAssertionCategoryMasters={setAssertionCategoryMasters}
                setAssertionCodeMasters={setAssertionCodeMasters}
                setContactMasters={setContactMasters}
                setLocationMasters={setLocationMasters}
                setBomMasters={setBomMasters}
                setStockGroupMasters={setStockGroupMasters}
                setCostCenterMasters={setCostCenterMasters}
                setAccountGroupMasters={setAccountGroupMasters}
                setGradeMasters={setGradeMasters}
                setSkuMasters={setSkuMasters}
                setPriceListMasters={setPriceListMasters}
                setWeightMasters={setWeightMasters}
                setVolumeMasters={setVolumeMasters}
                setSizeMasters={setSizeMasters}
                setColorMasters={setColorMasters}
                setVariantMasters={setVariantMasters}
                setDimensionMasters={setDimensionMasters}
            />
        );
    }

    if (view === 'vouchers') {
        return <LedgerReportView vouchers={allVouchers} ledgerMasters={ledgerMasters} partyMasters={partyMasters} onDuplicate={handleDuplicateVoucher} onDelete={handleDeleteVoucher} onView={handleViewVoucher} onImportVoucher={() => setView('import')} onNavigateToMasters={() => setView('ledger-master')} />;
    }

    if (view === 'bank') {
        return (
            <BankReportView vouchers={allVouchers} ledgerMasters={ledgerMasters} partyMasters={partyMasters} defaultTab={bankActiveTab} onTabChange={setBankActiveTab} onDuplicate={handleDuplicateVoucher} onDelete={handleDeleteVoucher} onView={handleViewVoucher} onImportVoucher={() => setView('import')} onNavigateToMasters={() => setView('ledger-master')} />
        );
    }

    if (view === 'reports') {
        return (
            <ReportsView vouchers={allVouchers} defaultTab={reportActiveTab} onTabChange={setReportActiveTab} />
        );
    }

    if (view === 'gst-report') {
        return (
            <GSTReportView 
                vouchers={allVouchers}
                activeSamples={activeSamples}
                defaultTab={gstActiveTab}
                onTabChange={setGstActiveTab}
            />
        );
    }

    if (view === 'item-report') {
        return (
            <ItemReportView 
                vouchers={allVouchers}
                defaultTab={itemReportActiveTab}
                onTabChange={setItemReportActiveTab}
            />
        );
    }

    if (view === 'bulk-operation') {
        return (
            <SystemDecideView 
                itemMasters={itemMasters}
                setItemMasters={setItemMasters}
            />
        );
    }

    if (view === 'voucher-entry') {
        return (
            <VoucherEntryView 
              defaultType={voucherEntryActiveTab || 'all'}
              initialVoucher={editingVoucher}
              itemMasters={itemMasters}
              ledgerMasters={ledgerMasters}
              partyMasters={partyMasters}
              vouchers={allVouchers}
              onUpdateItemMaster={(updatedItem: any) => {
                setItemMasters((prev: any[]) => prev.map((i: any) => i.name === updatedItem.name ? { ...i, ...updatedItem } : i));
              }}
              onAddItemMaster={(newItem: any) => {
                setItemMasters((prev: any[]) => [...prev, newItem]);
              }}
              onSaveEntry={(savedEntry: any, isNew: any) => {
                const amtStr = savedEntry.totals?.grandTotal?.toString() || savedEntry.totals?.subtotal?.toString() || '0';
                const amt = parseFloat(amtStr.replace(/[^0-9.]/g, ''));
                if (amt > (policy?.maxTransactionAmount || Infinity)) {
                   alert('Transaction amount exceeds maximum allowed.');
                   return;
                }
                if (isNew) {
                   setAllVouchers((prev: any) => [...prev, savedEntry]);
                } else {
                   setAllVouchers((prev: any) => prev.map((v: any) => v.id === savedEntry.id ? savedEntry : v));
                }
                setView('vouchers');
                setEditingVoucher(null);
              }}
            />
        );
    }

    if (view === 'inventory-entry') {
        return (
            <InventoryEntryView 
                vouchers={allVouchers} 
            />
        );
    }

    if (view === 'settings') {
        return (
            <SettingsView 
                setView={setView} 
                setActiveMasterTab={setActiveMasterTab} 
                setReportBankActiveTab={setReportActiveTab}
                defaultTab={settingsActiveTab}
                onTabChange={setSettingsActiveTab}
                ledgerMasters={ledgerMasters}
                onAppModeChange={handleAppModeChange}
                onImportCategoryChange={setImportCategory}
            />
        );
    }

    if (view === 'help') {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <HelpSettings />
            </div>
        );
    }

    if (view === 'support') {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <SupportSettings 
                    defaultTab={supportActiveTab}
                    onTabChange={setSupportActiveTab}
                />
            </div>
        );
    }

    if (view !== 'import') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 dark:bg-gray-800">
                    <InfoIcon className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest dark:text-gray-100">{view}</h2>
                <p className="text-gray-500 mt-2 max-w-sm dark:text-gray-400">This module is currently in development. Please use the "Import" tool to process your records.</p>
                <button 
                    onClick={() => setView('import')}
                    className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg"
                >
                    Return to Import
                </button>
            </div>
        );
    }

    return (
      <div className="max-w-7xl mx-auto w-full min-h-full flex-1 flex flex-col space-y-6 pt-4 px-4 md:px-6 md:pt-6 pb-0">
        {renderImportStepper()}
        <div className="flex-1 flex flex-col min-h-0">
          {renderStep()}
        </div>
      </div>
    );
  };

  return renderContent();
};