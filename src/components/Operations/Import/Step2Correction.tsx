import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ParsedVoucher, VoucherField, Confidence, VoucherType } from '../../../app/types';
import { 
  ArrowBackIcon, 
  ArrowForwardIcon, 
  InfoIcon, 
  CheckCircleIcon, 
  ExpandMoreIcon, 
  ExpandLessIcon, 
  AddIcon, 
  WarningIcon, 
  ErrorIcon, 
  MoreHorizIcon, 
  DeleteIcon, 
  ContentCopyIcon, 
  HistoryIcon 
} from '../../icons/IconComponents';

// Import our modularized parts
import { Step2CorrectionProps, allowedFieldsSchema } from './step2/types';
import { ConfidencePill } from './step2/ConfidencePill';
import { EditableField } from './step2/EditableField';
import { TransactionTypeSelect } from './step2/TransactionTypeSelect';
import { MasterSelectField } from './step2/MasterSelectField';
import { TaxRateCombobox, TaxTypeCombobox, UomCombobox, ItemNameCombobox } from './step2/TaxUomSelectors';
import { useCorrectionLogic } from './step2/useCorrectionLogic';

export const Step2Correction: React.FC<Step2CorrectionProps> = ({ 
  vouchers, 
  onBack, 
  onNext, 
  onSaveDraft, 
  setVouchers,
  partyMasters, 
  ledgerMasters, 
  uomMasters, 
  itemMasters,
  onAddParty, 
  onAddLedger, 
  onAddUom, 
  onAddItem,
  voucherType, 
  allVouchers = [], 
  onNavigateToMasters,
  activeTab: propActiveTab, 
  onTabChange
}) => {
  const { t } = useLanguage();

  // Instantiate all core workflows via the unified correction hook
  const {
    activeVoucherIndex,
    setActiveVoucherIndex,
    activeTab,
    setActiveTab,
    saveStatus,
    expandedRateGroups,
    toggleRateGroup,
    newlyAddedItemIndex,
    setNewlyAddedItemIndex,
    isTaxAnalysisExpanded,
    setIsTaxAnalysisExpanded,
    activeRowMenuIndex,
    setActiveRowMenuIndex,
    categorizedVouchers,
    tabVouchers,
    activeVoucher,
    allItemNames,
    handleAddItem,
    handleDuplicateItem,
    handleDeleteItem,
    handleFieldChange,
    handleSaveDraft,
    hasItemsAndTax,
    hasErrors,
    taxAnalysis,
    totalTaxableAmount,
    totalCgst,
    totalSgst,
    totalIgst,
    hasIgst,
    safeNum,
    safeRound
  } = useCorrectionLogic(
    vouchers,
    setVouchers,
    partyMasters,
    ledgerMasters,
    itemMasters,
    uomMasters,
    voucherType,
    allVouchers,
    onSaveDraft,
    propActiveTab,
    onTabChange
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md flex-1 flex flex-col min-h-0 overflow-hidden dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 flex-shrink-0 gap-3">
          <div className="flex items-center">
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center mr-3 sm:mr-4 shadow-lg shadow-blue-100 shrink-0">
                <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tighter opacity-80">
                  {voucherType === VoucherType.BankStatement ? 'Statement' : 'Voucher'}
                </span>
                <span className="text-base sm:text-lg font-black" style={{ fontSize: activeVoucher?.tempImportId ? '0.75rem' : '1.125rem' }}>
                  {activeVoucher?.tempImportId || `#${activeVoucherIndex + 1}`}
                </span>
             </div>
             <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight dark:text-gray-100">
                  Banking Verification
                </h2>
                <div className="flex items-center mt-0.5 space-x-2 sm:space-x-3">
                   <p className="text-gray-500 text-[10px] sm:text-xs dark:text-gray-400">
                     {activeTab === 'unmap' ? 'Entries where no valid name was extracted' : 
                      activeTab === 'missing' ? 'Entries with extracted names but no master match (>75%)' : 
                      'Entries automatically matched with existing masters'}
                   </p>
                   {vouchers.length > 1 && (
                      <div className="hidden sm:flex items-center bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mr-2 tracking-wider">{t("Progress")}</span>
                        <div className="flex items-center space-x-1">
                           {(vouchers || []).map((v, i) => (
                              <div key={v.id} className={`w-1.5 h-1.5 rounded-full ${i === activeVoucherIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`} />
                           ))}
                        </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
             <button 
               onClick={handleSaveDraft}
               disabled={saveStatus === 'saving'}
               className={`flex-1 sm:flex-none flex justify-center items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                 saveStatus === 'saved' 
                   ? 'bg-green-100 text-green-700' 
                   : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
               } dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700`}
             >
               {saveStatus === 'saving' ? (
                 <span className="flex items-center">
                   <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   Saving...
                 </span>
               ) : saveStatus === 'saved' ? (
                 <span className="flex items-center"><CheckCircleIcon className="mr-2" /> Draft Saved</span>
               ) : (
                 'Save Draft'
               )}
             </button>
          </div>
        </div>

        {/* THREE STAGE TABS */}
        <div className="flex border-b border-gray-200 mb-4 bg-gray-50 rounded-t-lg p-1 dark:border-gray-700 dark:bg-gray-900">
          <button 
            onClick={() => setActiveTab('unmap')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'unmap' ? 'bg-white border shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'} dark:bg-gray-800 dark:text-gray-400`}
          >
            <div className={`w-2 h-2 rounded-full ${categorizedVouchers.unmap.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            UNMAP ({categorizedVouchers.unmap.length})
          </button>
          <button 
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'missing' ? 'bg-white border shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'} dark:bg-gray-800 dark:text-gray-400`}
          >
            <div className={`w-2 h-2 rounded-full ${categorizedVouchers.missing.length > 0 ? 'bg-amber-500' : 'bg-gray-300'}`} />
            MISSING MASTER ({categorizedVouchers.missing.length})
          </button>
          <button 
            onClick={() => setActiveTab('automate')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'automate' ? 'bg-white border shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'} dark:bg-gray-800 dark:text-gray-400`}
          >
            <div className={`w-2 h-2 rounded-full ${categorizedVouchers.automate.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
            AUTOMATE ({categorizedVouchers.automate.length})
          </button>
        </div>

        {tabVouchers.length > 0 && (
            <div className="border-b border-gray-100 mb-4 overflow-x-auto custom-scrollbar flex-shrink-0 bg-white p-1 rounded-lg dark:border-gray-800 dark:bg-gray-850">
                <nav className="flex space-x-2" aria-label="Tabs">
                    {tabVouchers.map((voucher, index) => {
                        const hasError = Object.values(voucher || {}).some(field => typeof field === 'object' && field !== null && !Array.isArray(field) && (field as any).isMismatch) ||
                                        (hasItemsAndTax && (voucher.items || []).some(item => Object.values(item || {}).some(field => typeof field === 'object' && field !== null && (field as any).isMismatch)));
                        const isActive = activeVoucherIndex === index;
                        return (
                          <button
                              key={voucher.id}
                              onClick={() => setActiveVoucherIndex(index)}
                              className={`whitespace-nowrap py-2 px-4 rounded-md text-[10px] font-bold transition-all border ${
                                isActive 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                              } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
                          >
                              {voucher.tempImportId || `#${vouchers.findIndex(v => v.id === voucher.id) + 1}`}
                              {hasError && <span className="ml-2 w-1.5 h-1.5 bg-red-400 rounded-full inline-block animate-ping" />}
                          </button>
                        );
                    })}
                </nav>
            </div>
        )}
        
        {activeVoucher && (
            <div className="overflow-x-auto flex-1 min-h-0 bg-white border border-gray-100 rounded-lg shadow-inner overflow-y-auto scrollbar-thin dark:bg-gray-800 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Field")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Extracted Value")}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("AI Confidence")}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <tr className="bg-blue-50/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 capitalize dark:text-white">Import ID</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold font-mono text-base">
                            {activeVoucher.tempImportId || `${activeVoucher.type.substring(0, 3).toUpperCase()}-${(activeVoucherIndex + 1).toString().padStart(4, '0')}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic flex items-center">
                            <InfoIcon className="text-blue-400 scale-75 mr-1" /> Auto-generated ID
                        </td>
                    </tr>
                    <tr className="bg-blue-50/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 capitalize dark:text-white">Voucher Type</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex flex-wrap gap-2">
                                {[VoucherType.Receipt, VoucherType.Payment, VoucherType.Contra].map(tType => (
                                    <button 
                                        key={tType}
                                        onClick={() => handleFieldChange(activeVoucher.id, 'type', tType)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border shadow-sm ${
                                            activeVoucher.type === tType 
                                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                                        } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`}
                                    >
                                        {tType}
                                    </button>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic flex items-center">
                            <InfoIcon className="text-blue-400 scale-75 mr-1" /> Classification
                        </td>
                    </tr>
                    {hasItemsAndTax && (
                    <tr className="bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 capitalize dark:text-white">Total Taxable Amount</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold dark:text-gray-200">
                            ₹{totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic">
                            System Calculated
                        </td>
                    </tr>
                    )}
                    {(() => {
                        let schema = [...(allowedFieldsSchema[activeVoucher.type] || allowedFieldsSchema[VoucherType.Purchase])];

                        // Special handling for Bank-originated vouchers (Direct Bank Imports)
                        if (activeVoucher.origin === 'bank') {
                            if (!schema.includes('withdrawalAmount')) schema.push('withdrawalAmount');
                            if (!schema.includes('depositAmount')) schema.push('depositAmount');
                            if (!schema.includes('closingBalance')) schema.push('closingBalance');
                            if (!schema.includes('narration')) schema.push('narration');
                            
                            const hasBankAmount = safeNum(activeVoucher.withdrawalAmount?.value) > 0 || safeNum(activeVoucher.depositAmount?.value) > 0;
                            if (hasBankAmount) {
                                schema = schema.filter(f => f !== 'amount');
                            }
                        }

                        return (schema || []).map((key) => {
                          const rawField = (activeVoucher as Record<string, any>)[key];
                          const field: VoucherField = rawField || { value: '', confidence: Confidence.High, isMismatch: true, suggestion: 'Field missing from extraction' };
                          const isMismatch = field.isMismatch;
                          
                          return (
                            <tr key={key} className={`transition-colors relative ${isMismatch ? 'bg-red-50/50' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize flex items-center relative dark:text-white">
                                  {isMismatch && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" title="Validation mismatch" />}
                                  {isMismatch && <ErrorIcon className="text-red-500 scale-75 mr-2" />}
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/2 dark:text-gray-400">
                                    {key === 'partyName' ? (
                                      <div className="flex flex-col gap-1">
                                        <MasterSelectField 
                                          field={field} 
                                          masters={partyMasters} 
                                          title="Party"
                                          placeholder="Select Party Name..."
                                          onChange={(val) => handleFieldChange(activeVoucher.id, key, val)} 
                                          onAdd={onAddParty}
                                          onNavigateToMasters={onNavigateToMasters}
                                        />
                                      </div>
                                    ) : (key === 'fromAccount' || key === 'toAccount' || key === 'bankDetails') ? (
                                      <div className="flex flex-col gap-1">
                                        <select 
                                            value={String(field.value)}
                                            onChange={(e) => handleFieldChange(activeVoucher.id, key, e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        >
                                            <option value="">{t("Select bank...")}</option>
                                            {(ledgerMasters || []).filter(m => m.group === 'Bank Accounts').map(m => m.name).map(item => (
                                              <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                      </div>
                                    ) : key === 'supplyType' ? (
                                      <div className="flex flex-col gap-1">
                                        <select 
                                            value={String(field.value)}
                                            onChange={(e) => handleFieldChange(activeVoucher.id, key, e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        >
                                            <option value="Intra-State">{t("Intra-State (Local)")}</option>
                                            <option value="Inter-State">{t("Inter-State (Outside)")}</option>
                                        </select>
                                      </div>
                                    ) : ['ledger', 'debitLedger', 'creditLedger'].includes(key) ? (
                                      <div className="flex flex-col gap-1">
                                        <MasterSelectField 
                                          field={field} 
                                          masters={ledgerMasters} 
                                          title="Ledger Account"
                                          placeholder="Select Ledger Account..."
                                          onChange={(val) => handleFieldChange(activeVoucher.id, key, val)} 
                                          onAdd={onAddLedger}
                                          onNavigateToMasters={onNavigateToMasters}
                                        />
                                      </div>
                                    ) : key === 'narration' && voucherType === VoucherType.BankStatement ? (
                                      <TransactionTypeSelect 
                                        field={field} 
                                        narration={String(activeVoucher.narration?.value || '')} 
                                        onChange={(val) => handleFieldChange(activeVoucher.id, key, val)} 
                                      />
                                    ) : (
                                      <EditableField 
                                        type={key === 'narration' ? 'textarea' : typeof field.value === 'number' ? 'number' : 'text'}
                                        field={field} 
                                        onChange={val => handleFieldChange(activeVoucher.id, key, val)} 
                                      />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ConfidencePill confidence={field.confidence} />
                                </td>
                            </tr>
                          );
                        });
                    })()}
                </tbody>
            </table>

            {hasItemsAndTax && taxAnalysis.length > 0 && (
              <div className="mt-8 bg-blue-50/50 p-6 rounded-lg border border-blue-100 mx-4">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsTaxAnalysisExpanded(!isTaxAnalysisExpanded)}
                >
                  <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center">
                    <InfoIcon className="mr-2 text-blue-500" /> Tax Analysis Summary (Grouped by Rate)
                  </h2>
                  <div className="text-blue-700 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
                    {isTaxAnalysisExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </div>
                </div>
                
                {isTaxAnalysisExpanded && (
                  <div className="space-y-4 mt-4">
                    {(taxAnalysis || []).map((group) => {
                      const isExpanded = expandedRateGroups[group.rate];
                      return (
                        <div key={group.rate} className="bg-white rounded-md border border-blue-100 shadow-sm transition-all hover:shadow-md overflow-hidden dark:bg-gray-800">
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:hover:bg-gray-700"
                            onClick={() => toggleRateGroup(group.rate)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </div>
                              <div>
                                 <div className="text-xs font-bold text-blue-600">GST @ {group.rate}%</div>
                                 <div className="text-[10px] text-gray-400 uppercase font-semibold">{group.items.length} items included</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-8">
                              <div className="text-right">
                                <div className="text-[10px] text-gray-500 uppercase font-semibold dark:text-gray-400">{t("Taxable Value")}</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">₹{group.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                              </div>
                              <div className="text-right bg-blue-50 px-3 py-1 rounded">
                                <div className="text-[10px] text-blue-500 uppercase font-bold">{t("Tax Amount")}</div>
                                <div className="text-sm font-bold text-blue-700">₹{group.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800">
                              <table className="min-w-full text-xs">
                                <thead>
                                  <tr className="text-gray-400 uppercase font-bold border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left pb-2 font-semibold">{t("Item Description")}</th>
                                    <th className="text-right pb-2 font-semibold font-mono">{t("Taxable Amt")}</th>
                                    <th className="text-right pb-2 font-semibold font-mono">{t("Tax Amt")}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                                  {(group.items || []).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-2 text-gray-700 dark:text-gray-200">{item.name}</td>
                                      <td className="py-2 text-right text-gray-600 font-mono dark:text-gray-300">₹{item.taxable.toFixed(2)}</td>
                                      <td className="py-2 text-right text-blue-600 font-bold font-mono">₹{item.tax.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {hasItemsAndTax && activeVoucher.items && activeVoucher.items.length > 0 && (
              <div className="px-4">
                <div className="flex items-center justify-between my-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t("Items Details")}</h3>
                  {activeVoucher.items.filter(item => Object.values(item || {}).some(f => (f as any).isMismatch)).length > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center animate-pulse">
                      <ErrorIcon className="mr-1 text-sm" />
                      {activeVoucher.items.filter(item => Object.values(item || {}).some(f => (f as any).isMismatch)).length} Items need correction
                    </span>
                  )}
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Item Name")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Qty")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Unit")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Rate")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Tax Type")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Tax %")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Tax Amt")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Total")}</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {(activeVoucher.items || []).map((item, index) => {
                      const rowHasError = Object.values(item || {}).some(field => typeof field === 'object' && field !== null && (field as VoucherField).isMismatch);
                      const currentTaxType = String(item.taxType?.value || 'CGST/SGST');
                      return (
                        <tr key={index} className={`transition-all relative group/row ${rowHasError ? 'bg-red-50/90 border-l-0' : 'hover:bg-gray-50/40'}`}>
                          <td className="px-6 py-4 relative">
                            {rowHasError && (
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 z-10 shadow-[2px_0_8px_rgba(220,38,38,0.2)]" title="Row contains errors" />
                            )}
                            <div className="flex items-center space-x-2">
                              {rowHasError && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
                              <ItemNameCombobox 
                                field={item.name || { value: '', confidence: Confidence.High }} 
                                autoFocus={index === newlyAddedItemIndex}
                                suggestions={allItemNames}
                                onChange={val => {
                                  handleFieldChange(activeVoucher.id, 'name', val, index);
                                  if (index === newlyAddedItemIndex) setNewlyAddedItemIndex(null);
                                }} 
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 w-20">
                            <EditableField field={item.quantity || { value: 0, confidence: Confidence.High }} onChange={val => handleFieldChange(activeVoucher.id, 'quantity', Number(val), index)} />
                          </td>
                          <td className="px-6 py-4 w-24">
                            <UomCombobox 
                              field={item.uom || { value: 'Nos', confidence: Confidence.High }} 
                              onChange={val => handleFieldChange(activeVoucher.id, 'uom', val, index)} 
                              onAdd={onAddUom}
                              uomMasters={uomMasters}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <EditableField field={item.rate || { value: 0, confidence: Confidence.High }} onChange={val => handleFieldChange(activeVoucher.id, 'rate', Number(val), index)} />
                          </td>
                          <td className="px-6 py-4 w-32">
                            <TaxTypeCombobox 
                              field={item.taxType || { value: 'CGST/SGST', confidence: Confidence.High }} 
                              onChange={val => handleFieldChange(activeVoucher.id, 'taxType', val, index)} 
                            />
                          </td>
                          <td className="px-6 py-4 w-24">
                            <TaxRateCombobox field={item.taxRate || { value: 0, confidence: Confidence.High }} onChange={val => handleFieldChange(activeVoucher.id, 'taxRate', val, index)} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="group relative">
                              <EditableField 
                                field={item.tax || { value: 0, confidence: Confidence.High }} 
                                onChange={val => handleFieldChange(activeVoucher.id, 'tax', Number(val), index)} 
                              />
                              
                              {/* Detailed Tax Breakdown Popover */}
                              <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-30 bg-white border border-gray-200 shadow-2xl rounded-xl p-0 w-64 transform translate-y-1 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center dark:bg-gray-900 dark:border-gray-850">
                                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("Detailed Tax Breakdown")}</div>
                                </div>
                                <div className="p-3 space-y-3">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium dark:text-gray-400">{t("Taxable Value")}</span>
                                    <span className="font-mono text-gray-800 dark:text-gray-100">₹{safeRound(safeNum(item.quantity?.value) * safeNum(item.rate?.value)).toFixed(2)}</span>
                                  </div>
                                  
                                  {currentTaxType === 'CGST/SGST' ? (
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-850">
                                      <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{t("Intra-State Supply")}</div>
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs items-center">
                                          <span className="text-gray-600 dark:text-gray-300">CGST ({(safeNum(item.taxRate?.value) / 2).toFixed(1)}%)</span>
                                          <span className="font-mono text-gray-700 dark:text-gray-200">₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs items-center">
                                          <span className="text-gray-600 dark:text-gray-300">SGST ({(safeNum(item.taxRate?.value) / 2).toFixed(1)}%)</span>
                                          <span className="font-mono text-gray-700 dark:text-gray-200">₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-850">
                                      <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{t("Inter-State Supply")}</div>
                                      <div className="flex justify-between text-xs items-center">
                                        <span className="text-gray-600 dark:text-gray-300">IGST ({safeNum(item.taxRate?.value).toFixed(1)}%)</span>
                                        <span className="font-mono text-gray-700 dark:text-gray-200">₹{safeNum(item.tax?.value).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="bg-blue-50 px-3 py-2 flex justify-between text-xs border-t border-blue-100 dark:bg-gray-900 dark:border-gray-850">
                                  <span className="font-bold text-blue-800">{t("Total Tax Applicable")}</span>
                                  <span className="font-mono font-bold text-blue-900">₹{safeNum(item.tax?.value).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-1 flex flex-col gap-0.5 pointer-events-none text-right">
                              {currentTaxType === 'IGST' ? (
                                <span className="text-[9px] text-gray-400 font-mono leading-none">I: ₹{safeNum(item.tax?.value).toFixed(2)}</span>
                              ) : (
                                <>
                                  <span className="text-[9px] text-gray-400 font-mono leading-none">C: ₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                  <span className="text-[9px] text-gray-400 font-mono leading-none">S: ₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-bold text-gray-900 dark:text-white">₹{Number(item.total?.value || 0).toFixed(2)}</div>
                              <ConfidencePill confidence={item.total?.confidence || Confidence.High} compact />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => setActiveRowMenuIndex(activeRowMenuIndex === index ? null : index)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:bg-gray-600"
                              >
                                <MoreHorizIcon />
                              </button>

                              {activeRowMenuIndex === index && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setActiveRowMenuIndex(null)} />
                                  <div className="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform origin-bottom-right dark:bg-gray-800">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                      <button
                                        onClick={() => handleDuplicateItem(index)}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors dark:text-gray-205 dark:hover:bg-gray-700 dark:text-white"
                                        role="menuitem"
                                      >
                                        <ContentCopyIcon className="mr-3 scale-75 text-blue-500" />
                                        Duplicate Item
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(index)}
                                        disabled={activeVoucher.items.length <= 1}
                                        className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${activeVoucher.items.length <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950'}`}
                                        role="menuitem"
                                      >
                                        <DeleteIcon className="mr-3 scale-75" />
                                        Delete Item
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-3 flex flex-col md:flex-row justify-between items-start md:items-end px-4 gap-3 flex-shrink-0">
               {hasItemsAndTax ? (
                 <button
                   onClick={handleAddItem}
                   className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                 >
                   <AddIcon className="mr-1 text-lg" /> Add New Item
                 </button>
               ) : (
                 <div />
               )}

               <div className="w-full md:w-80 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
                 {hasItemsAndTax && (
                   <>
                     <div className="flex justify-between text-sm py-1.5">
                       <span className="text-gray-600 font-medium tracking-wide dark:text-gray-300">{t("Total Taxable Value")}</span>
                       <span className="font-mono font-bold text-gray-900 dark:text-white">₹{totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex flex-col border-b border-dashed border-gray-300 dark:border-gray-650">
                        <div className="flex justify-between text-sm py-1.5">
                          <span className="text-gray-600 font-medium tracking-wide dark:text-gray-300">{t("Total Tax Amount")}</span>
                          <span className="font-mono font-bold text-gray-900 dark:text-white">₹{Number(activeVoucher.tax?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex flex-col pb-2 pl-4 gap-0.5">
                          {hasIgst ? (
                            <div className="flex justify-between text-[11px] text-blue-600 font-mono font-bold">
                              <span>{t("IGST")}</span>
                              <span>₹{totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between text-[11px] text-gray-500 font-mono dark:text-gray-400">
                                <span>{t("CGST")}</span>
                                <span>₹{totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-[11px] text-gray-500 font-mono dark:text-gray-400">
                                <span>{t("SGST")}</span>
                                <span>₹{totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                   </>
                 )}
                 <div className="flex justify-between text-sm sm:text-base py-2 mt-1">
                   <span className="text-gray-900 font-bold tracking-wide dark:text-white">{t("Total Voucher Amount")}</span>
                   <span className={`${
                     String(activeVoucher.amount?.value || activeVoucher.withdrawalAmount?.value || activeVoucher.depositAmount?.value || 0).length > 8 ? 'text-sm' : 'text-base'
                   } font-mono font-bold text-blue-700 dark:text-blue-400 transition-all duration-300`}>
                     ₹{Number(activeVoucher.amount?.value || activeVoucher.withdrawalAmount?.value || activeVoucher.depositAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                   </span>
                 </div>
               </div>
             </div>
             
             <details className="mx-4 mb-4 mt-6 border border-gray-200 rounded-lg bg-white shadow-sm shrink-0 dark:border-gray-700 dark:bg-gray-800">
                <summary className="px-4 py-3 text-sm font-bold text-gray-700 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none flex items-center rounded-t-lg dark:text-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700">
                  <HistoryIcon className="text-gray-500 mr-2 dark:text-gray-400" />
                  Audit Log History
                </summary>
                <div className="p-4 border-t border-gray-200 space-y-3 max-h-[300px] overflow-y-auto dark:border-gray-700">
                  {(activeVoucher.auditLogs || []).length > 0 ? (
                    activeVoucher.auditLogs!.map((log) => (
                      <div key={log.id} className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex flex-col gap-1.5 shadow-sm dark:text-gray-200 dark:bg-gray-900 dark:border-gray-700">
                        <div className="flex justify-between items-center text-gray-900 font-bold border-b border-gray-200 pb-1 mb-1 dark:text-white dark:border-gray-700">
                           <div className="flex items-center space-x-2">
                             <span>{log.author}</span>
                             <span className="font-mono text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded dark:text-gray-400 dark:bg-gray-700">{new Date(log.timestamp).toLocaleString()}</span>
                           </div>
                           <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{log.action}</span>
                        </div>
                        <div className="flex flex-col gap-1 ml-1">
                          {(log.changes || []).map((change, idx) => (
                             <div key={idx} className="flex gap-2 items-center w-full">
                               <span className="font-bold text-gray-700 capitalize min-w-[100px] shrink-0 truncate dark:text-gray-200">{change.field.replace(/([A-Z])/g, ' $1')}:</span>
                               <span className="text-red-500 line-through max-w-[200px] truncate" title={String(change.oldValue || '(Empty)')}>{String(change.oldValue || '(Empty)')}</span>
                               <span className="text-gray-400 font-bold">{t("&rarr;")}</span>
                               <span className="text-green-600 font-medium max-w-[200px] truncate" title={String(change.newValue || '(Empty)')}>{String(change.newValue || '(Empty)')}</span>
                             </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 py-4 text-center italic dark:text-gray-400">{t("No modifications have been recorded for this voucher yet.")}</div>
                  )}
                </div>
             </details>
             
            </div>
        )}
      </div>

      <div className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4 shadow-[0_-10px_25px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_25px_-12px_rgba(0,0,0,0.8)] mt-auto flex-shrink-0">
        <div className="flex justify-between px-1">
          <button
            onClick={onBack}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ArrowBackIcon className="mr-2" />
            Back
          </button>
          <button
            onClick={() => onNext(vouchers)}
            disabled={hasErrors}
            className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white transition-colors ${
              hasErrors ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {hasErrors ? 'Please Fix Errors' : 'Next'}
            <ArrowForwardIcon className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Step2Correction;
