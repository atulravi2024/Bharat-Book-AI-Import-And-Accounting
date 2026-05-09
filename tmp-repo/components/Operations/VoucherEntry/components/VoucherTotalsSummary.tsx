import React from 'react';
import { ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface VoucherTotalsSummaryProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  ledgerMasters: any[];
  totals: any;
  activeTab: string;
}

export const VoucherTotalsSummary: React.FC<VoucherTotalsSummaryProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  ledgerMasters,
  totals,
  activeTab
}) => {
  return (
    <>
          <div className={`mt-6 bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[20] ${collapsedSections.narration ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'}`}>
             <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.narration ? '' : 'mb-3'}`} onClick={() => toggleSection('narration')}>
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer">Narration (Optional)</label>
               <button className="text-gray-400 hover:text-gray-600 transition-colors">
                 <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.narration ? 'rotate-180' : ''}`} />
               </button>
             </div>
             {!collapsedSections.narration && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                 <textarea value={headerDetails.narration} onChange={(e) => handleHeaderChange('narration', e.target.value)} placeholder="Enter narration or description of the transaction..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-y"></textarea>
               </div>
             )}
          </div>

        <div className="w-full">
          <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[15] ${collapsedSections.adjustments ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'}`}>
            <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.adjustments ? '' : 'mb-6'}`} onClick={() => toggleSection('adjustments')}>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Adjustments</h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.adjustments ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {!collapsedSections.adjustments && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
               <div className="hidden sm:block">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Voucher Level Discount</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Discount %" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={headerDetails.voucherDiscountPct || ''}
                        onChange={(e) => handleHeaderChange('voucherDiscountPct', e.target.value)}
                      />
                    </div>
                    <span className="text-gray-400 font-black text-xs">+</span>
                    <div className="flex-1 relative">
                       <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Amount" 
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={headerDetails.voucherDiscountAmount || ''}
                        onChange={(e) => handleHeaderChange('voucherDiscountAmount', e.target.value)}
                      />
                    </div>
                  </div>
               </div>
               
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Other Adjustment / Charges</label>
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                       <SearchableDropdown
                         label=""
                         options={ledgerMasters}
                         value={headerDetails.adjustmentRemarks}
                         onChange={(value) => handleHeaderChange('adjustmentRemarks', value)}
                         placeholder="Select Adjustment Ledger..."
                       />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                         <input 
                            type="number" 
                            step="0.01" 
                            placeholder="Pct %" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={headerDetails.otherAdjustmentPct || ''}
                            onChange={(e) => handleHeaderChange('otherAdjustmentPct', e.target.value)}
                          />
                      </div>
                      <span className="text-gray-400 font-black text-xs">+</span>
                      <div className="flex-1 relative">
                         <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                         <input 
                            type="number" 
                            step="0.01" 
                            placeholder="Amount" 
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={headerDetails.otherAdjustment || ''}
                            onChange={(e) => handleHeaderChange('otherAdjustment', e.target.value)}
                          />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
            )}
          </div>
        </div>
        
        <div className="w-full">
          <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[10] ${collapsedSections.summary ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'}`}>
            <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.summary ? '' : 'mb-6'}`} onClick={() => toggleSection('summary')}>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Summary</h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.summary ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {!collapsedSections.summary && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col flex-grow">
              <div className="space-y-4 mb-6 flex-grow">
                <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                  <span>Subtotal</span>
                  <span>₹ {totals.subtotal.toFixed(2)}</span>
                </div>
                {(activeTab === 'sales' || activeTab === 'purchase' || activeTab === 'debit_note' || activeTab === 'credit_note') && (
                  <>
                    {(totals.discount > 0 || totals.postTaxDiscount > 0) && (
                    <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                      <span>Total Item Discount</span>
                      <span className="text-emerald-500">- ₹ {(totals.discount + totals.postTaxDiscount).toFixed(2)}</span>
                    </div>
                    )}
                    {headerDetails.placeOfSupply !== 'other_state' ? (
                      <>
                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                          <span>CGST</span>
                          <span>₹ {totals.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                          <span>SGST</span>
                          <span>₹ {totals.sgst.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                        <span>IGST</span>
                        <span>₹ {totals.igst.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.voucherDiscount > 0 && (
                      <div className="flex justify-between items-center text-sm font-medium text-gray-600 pt-2 border-t border-gray-100">
                        <span>Voucher Discount</span>
                        <span className="text-emerald-500">- ₹ {totals.voucherDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.otherAdjustment !== 0 && (
                      <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                        <span>{headerDetails.adjustmentRemarks || 'Other Adjustments'}</span>
                        <span className={totals.otherAdjustment > 0 ? "text-blue-500" : "text-emerald-500"}>{totals.otherAdjustment > 0 ? '+' : '-'} ₹ {Math.abs(totals.otherAdjustment).toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                {totals.roundOff !== 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-gray-600 pt-4 border-t border-gray-100">
                    <span>Round Off</span>
                    <span>₹ {totals.roundOff > 0 ? '+' : ''}{totals.roundOff.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Grand Total</span>
                  <span className={`${
                    totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 15 ? 'text-sm' :
                    totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 12 ? 'text-lg' : 
                    totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 10 ? 'text-xl' : 
                    totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 8 ? 'text-2xl' : 'text-3xl'
                  } font-black text-blue-600 tracking-tighter transition-all duration-300 whitespace-nowrap`}>₹ {totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
    </>
  );
};
