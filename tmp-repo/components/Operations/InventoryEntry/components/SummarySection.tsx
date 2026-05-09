import React from 'react';
import { ChevronUp } from 'lucide-react';

interface SummarySectionProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  totals: {
    totalItems: number;
    totalQty: number;
    estValue: number;
    voucherDiscount: number;
    otherAdjustment: number;
    finalValue: number;
  };
  activeTab: string;
  headerDetails: any;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  collapsedSections,
  toggleSection,
  totals,
  activeTab,
  headerDetails
}) => {
  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[10] ${collapsedSections.summary ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'}`}>
      <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.summary ? '' : 'mb-6'}`} onClick={() => toggleSection('summary')}>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Summary Log</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.summary ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {!collapsedSections.summary && (
      <div className="space-y-4 mb-2 flex-grow animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
          <span>Total Items</span>
          <span>{totals.totalItems}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
           <span>Total Net Qty</span>
           <span className="font-bold">{totals.totalQty > 0 ? '+' : ''}{totals.totalQty}</span>
        </div>
         {activeTab !== 'physical_stock' && (
            <>
              <div className="flex justify-between items-center text-sm font-medium text-gray-600 pt-4 border-t border-gray-100">
                <span>Est. Value</span>
                <span className={`${
                  totals.estValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 12 ? 'text-xs' : 
                  totals.estValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 10 ? 'text-sm' : 
                  'text-base'
                } font-bold text-gray-900 transition-all duration-300`}>₹ {totals.estValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {totals.voucherDiscount > 0 && (
                <div className="flex justify-between items-center text-sm font-medium text-gray-600">
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
              {(totals.voucherDiscount > 0 || totals.otherAdjustment !== 0) && (
                <div className="flex justify-between items-center text-sm font-black text-gray-900 pt-3 border-t border-dashed border-gray-200">
                  <span className="uppercase tracking-widest text-xs">Total Net Value</span>
                  <span className={`${
                    totals.finalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 12 ? 'text-xs' : 
                    totals.finalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 10 ? 'text-sm' : 
                    'text-base'
                  } font-black text-blue-600 transition-all duration-300`}>₹ {totals.finalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </>
         )}
      </div>
      )}
    </div>
  );
};
