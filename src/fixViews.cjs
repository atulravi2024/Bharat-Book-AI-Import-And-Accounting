const fs = require('fs');

let c = fs.readFileSync('src/app/AppViewRouter.tsx', 'utf8');

const regex = /if \(view === 'ledger-master'\) \{[\s\S]*?(?=if \(view === 'settings'\))/;

const newCode = `if (view === 'ledger-master' || view === 'item-master') {
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

    `;

c = c.replace(regex, newCode);
fs.writeFileSync('src/app/AppViewRouter.tsx', c);
