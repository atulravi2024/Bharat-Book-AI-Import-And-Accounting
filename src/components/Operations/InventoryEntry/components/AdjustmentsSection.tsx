import { useLanguage } from '../../../../context/LanguageContext';
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
  const { t, formatNumber  } = useLanguage();
  return (
    <>
      <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative mb-6 transition-all duration-300 z-[15] ${collapsedSections.taxableAdjustments ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
        <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.taxableAdjustments ? '' : 'mb-6'}`} onClick={() => toggleSection('taxableAdjustments')}>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t("Taxable Adjustment")}</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.taxableAdjustments ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {!collapsedSections.taxableAdjustments && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
           <div className="form-field-wrapper">
<label className="form-label">{t("Voucher Level Discount")}</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder={t("Discount %")} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
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
                    placeholder={t("Amount")} 
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    value={headerDetails.voucherDiscountAmount || ''}
                    onChange={(e) => handleHeaderChange('voucherDiscountAmount', e.target.value)}
                  />
                </div>
              </div>
           </div>
           
           <div className="form-field-wrapper">
<label className="form-label">{t("Other Taxable Adjustment / Charges")}</label>
              <div className="flex flex-col gap-4">
                <div className="w-full">
                   <SearchableDropdown
                     label=""
                     options={ledgerMasters}
                     value={headerDetails.taxableAdjustmentRemarks || ''}
                     onChange={(value) => handleHeaderChange('taxableAdjustmentRemarks', value)}
                     placeholder={t("Select Taxable Adjustment Ledger...")}
                   />
                </div>
                <div className="flex gap-4">
                   <div className="flex-1">
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder={t("Pct %")} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        value={headerDetails.taxableOtherAdjustmentPct || ''}
                        onChange={(e) => handleHeaderChange('taxableOtherAdjustmentPct', e.target.value)}
                      />
                   </div>
                   <span className="text-gray-400 font-black text-xs">+</span>
                   <div className="flex-1 relative">
                      <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder={t("Amount")} 
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        value={headerDetails.taxableOtherAdjustment || ''}
                        onChange={(e) => handleHeaderChange('taxableOtherAdjustment', e.target.value)}
                      />
                   </div>
                </div>
              </div>
           </div>
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative mb-6 transition-all duration-300 z-[14] ${collapsedSections.nonTaxableAdjustments ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
        <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.nonTaxableAdjustments ? '' : 'mb-6'}`} onClick={() => toggleSection('nonTaxableAdjustments')}>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t("Non-Taxable Adjustment")}</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.nonTaxableAdjustments ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {!collapsedSections.nonTaxableAdjustments && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
           <div className="form-field-wrapper">
<label className="form-label">{t("Voucher Level Discount (Non-Taxable)")}</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder={t("Discount %")} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    value={headerDetails.nonTaxableVoucherDiscountPct || ''}
                    onChange={(e) => handleHeaderChange('nonTaxableVoucherDiscountPct', e.target.value)}
                  />
                </div>
                <span className="text-gray-400 font-black text-xs">+</span>
                <div className="flex-1 relative">
                   <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder={t("Amount")} 
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                    value={headerDetails.nonTaxableVoucherDiscountAmount || ''}
                    onChange={(e) => handleHeaderChange('nonTaxableVoucherDiscountAmount', e.target.value)}
                  />
                </div>
              </div>
           </div>
           
           <div className="form-field-wrapper">
<label className="form-label">{t("Other Non-Taxable Adjustment / Charges")}</label>
              <div className="flex flex-col gap-4">
                <div className="w-full">
                   <SearchableDropdown
                     label=""
                     options={ledgerMasters}
                     value={headerDetails.nonTaxableAdjustmentRemarks || ''}
                     onChange={(value) => handleHeaderChange('nonTaxableAdjustmentRemarks', value)}
                     placeholder={t("Select Non-Taxable Adjustment Ledger...")}
                   />
                </div>
                <div className="flex gap-4">
                   <div className="flex-1">
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder={t("Pct %")} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        value={headerDetails.nonTaxableOtherAdjustmentPct || ''}
                        onChange={(e) => handleHeaderChange('nonTaxableOtherAdjustmentPct', e.target.value)}
                      />
                   </div>
                   <span className="text-gray-400 font-black text-xs">+</span>
                   <div className="flex-1 relative">
                      <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder={t("Amount")} 
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                        value={headerDetails.nonTaxableOtherAdjustment || ''}
                        onChange={(e) => handleHeaderChange('nonTaxableOtherAdjustment', e.target.value)}
                      />
                   </div>
                </div>
              </div>
           </div>
        </div>
        )}
      </div>

      <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative mb-6 transition-all duration-300 z-[13] ${collapsedSections.rounding ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
        <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.rounding ? '' : 'mb-6'}`} onClick={() => toggleSection('rounding')}>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t("Rounding Off")}</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.rounding ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {!collapsedSections.rounding && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="form-label">{t("Rounding Type")}</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700"
                value={headerDetails.roundingType || 'auto'}
                onChange={(e) => handleHeaderChange('roundingType', e.target.value)}
              >
                <option value="auto">{t("Round Off")}</option>
                <option value="up">{t("Round Up")}</option>
                <option value="down">{t("Round Down")}</option>
                <option value="manual">{t("Manual")}</option>
                <option value="none">{t("None")}</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="form-label">{t("Round Off Amount")}</label>
              <div className="relative">
                <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">₹</span>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder={t("Amount")} 
                  className={`w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${headerDetails.roundingType !== 'manual' ? 'opacity-50 cursor-not-allowed' : ''} dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700`}
                  value={headerDetails.roundingValue || ''}
                  onChange={(e) => handleHeaderChange('roundingValue', e.target.value)}
                  disabled={headerDetails.roundingType !== 'manual'}
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};
