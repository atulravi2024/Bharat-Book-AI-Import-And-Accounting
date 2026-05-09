import React from 'react';
import { ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../../ui/SearchableDropdown';

interface AdjustmentsSectionProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  ledgerMasters: any[];
}

export const AdjustmentsSection: React.FC<AdjustmentsSectionProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  ledgerMasters
}) => {
  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative mb-6 transition-all duration-300 z-[15] ${collapsedSections.adjustments ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'}`}>
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
              <div className="flex gap-4">
                 <select 
                  className="w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  value={headerDetails.adjustmentAction}
                  onChange={(e) => handleHeaderChange('adjustmentAction', e.target.value)}
                 >
                   <option value="add">Add (+)</option>
                   <option value="subtract">Subtract (-)</option>
                 </select>
                 <div className="flex-1 relative">
                    <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="Amount" 
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      value={headerDetails.adjustmentAmount}
                      onChange={(e) => handleHeaderChange('adjustmentAmount', e.target.value)}
                    />
                 </div>
              </div>
            </div>
         </div>
      </div>
      )}
    </div>
  );
};
