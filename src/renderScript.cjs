const fs = require('fs');
const code = `
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
            <DashboardView 
                vouchers={allVouchers} 
                defaultTab={dashboardActiveTab} 
                onTabChange={setDashboardActiveTab} 
                partyMasters={partyMasters}
                itemMasters={itemMasters}
                ledgerMasters={ledgerMasters}
            />
        );
    }

    if (view === 'ledger-master') {
        return (
            <MasterView 
                partyMasters={partyMasters} 
                ledgerMasters={ledgerMasters} 
                itemMasters={itemMasters}
                uomMasters={uomMasters}
                gstMasters={gstMasters}
                brandMasters={brandMasters}
                categoryMasters={categoryMasters}
                gradeMasters={gradeMasters}
                activeSamples={activeSamples || []}
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
                customMasters={customMasters}
                defaultTab={activeMasterTab}
                onTabChange={setActiveMasterTab}
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
                setCustomMasters={setCustomMasters}
                setGradeMasters={setGradeMasters}
            />
        );
    }

    if (view === 'bank-vouchers') {
        return <LedgerReportView vouchers={allVouchers} ledgerMasters={ledgerMasters} />;
    }

    if (view === 'bank') {
        return (
            <BankReportView 
                vouchers={allVouchers} 
                ledgerMasters={ledgerMasters}
                defaultTab={bankActiveTab}
                onTabChange={setBankActiveTab}
            />
        );
    }

    if (view === 'reports') {
        return (
            <ReportsView 
                vouchers={allVouchers}
                defaultTab={reportActiveTab}
                onTabChange={setReportActiveTab}
                ledgerMasters={ledgerMasters}
            />
        );
    }

    if (view === 'vouchers') {
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
                if (amt > (policy.maxTransactionAmount || Infinity)) {
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
              onCancelEntry={() => {
                setView('vouchers');
                setEditingVoucher(null);
              }}
            />
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
              defaultType={voucherEntryActiveTab || 'sales'}
              initialVoucher={editingVoucher}
              itemMasters={itemMasters}
              ledgerMasters={ledgerMasters}
              partyMasters={partyMasters}
              vouchers={allVouchers}
              onUpdateItemMaster={(updatedItem: any) => {
                setItemMasters((prev: any) => prev.map((i: any) => i.name === updatedItem.name ? { ...i, ...updatedItem } : i));
              }}
              onAddItemMaster={(newItem: any) => {
                setItemMasters((prev: any) => [...prev, newItem]);
              }}
              onSaveEntry={(savedEntry: any, isNew: boolean) => {
                if (isNew) {
                   setAllVouchers((prev: any) => [...prev, savedEntry]);
                } else {
                   setAllVouchers((prev: any) => prev.map((v: any) => v.id === savedEntry.id ? savedEntry : v));
                }
                setView('vouchers');
                setEditingVoucher(null);
              }}
              onCancelEntry={() => {
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
                defaultTab={inventoryEntryActiveTab} 
                onTabChange={setInventoryEntryActiveTab} 
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
`;
let r = fs.readFileSync('src/app/AppViewRouter.tsx', 'utf8');
r = r.replace('// ---- WILL PASTE RENDER CONTENT HERE ----', code + '\\n  return renderContent();');
fs.writeFileSync('src/app/AppViewRouter.tsx', r);
console.log('Done rendering content');
