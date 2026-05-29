import { useLanguage } from '../../../../context/LanguageContext';
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
  rows?: any[];
}

export const VoucherTotalsSummary: React.FC<VoucherTotalsSummaryProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  ledgerMasters,
  totals,
  activeTab,
  rows
}) => {
  const { t, formatNumber } = useLanguage();

  const isInventory = ['sales', 'purchase', 'debit_note', 'credit_note'].includes(activeTab);

  return (
    <div className="flex flex-col gap-6 mt-6">
          <div className={`bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[20] ${collapsedSections.narration ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
             <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.narration ? '' : 'mb-3'}`} onClick={() => toggleSection('narration')}>
               <label className="form-label cursor-pointer">{t("Narration (Optional)")}</label>
               <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                 <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.narration ? 'rotate-180' : ''}`} />
               </button>
             </div>
             {!collapsedSections.narration && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                 <textarea value={headerDetails.narration || ''} onChange={(e) => handleHeaderChange('narration', e.target.value)} placeholder={t("Enter narration or description of the transaction...")} className="form-input text-sm min-h-[100px] resize-y dark:focus:bg-gray-700"></textarea>
               </div>
             )}
          </div>

        {isInventory && (
          <div className="w-full">
            <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[15] ${collapsedSections.taxableAdjustments ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
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
                          className="form-input text-sm font-medium dark:focus:bg-gray-700"
                          value={headerDetails.voucherDiscountPct || ''}
                          onChange={(e) => handleHeaderChange('voucherDiscountPct', e.target.value)}
                        />
                      </div>
                      <span className="text-gray-400 font-black text-xs">{t("+")}</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">{t("₹")}</span>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder={t("Amount")} 
                          className="form-input pl-8 pr-4 text-sm font-medium dark:focus:bg-gray-700"
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
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input 
                              type="number" 
                              step="0.01" 
                              placeholder={t("Pct %")} 
                              className="form-input text-sm font-medium dark:focus:bg-gray-700"
                              value={headerDetails.taxableOtherAdjustmentPct || ''}
                              onChange={(e) => handleHeaderChange('taxableOtherAdjustmentPct', e.target.value)}
                            />
                        </div>
                        <span className="text-gray-400 font-black text-xs">{t("+")}</span>
                        <div className="flex-1 relative">
                          <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">{t("₹")}</span>
                          <input 
                              type="number" 
                              step="0.01" 
                              placeholder={t("Amount")} 
                              className="form-input pl-8 pr-4 text-sm font-medium dark:focus:bg-gray-700"
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
          </div>
        )}

        {isInventory && (
          <div className="w-full">
            <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[12] ${collapsedSections.nonTaxableAdjustments ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
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
                          className="form-input text-sm font-medium dark:focus:bg-gray-700"
                          value={headerDetails.nonTaxableVoucherDiscountPct || ''}
                          onChange={(e) => handleHeaderChange('nonTaxableVoucherDiscountPct', e.target.value)}
                        />
                      </div>
                      <span className="text-gray-400 font-black text-xs">{t("+")}</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">{t("₹")}</span>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder={t("Amount")} 
                          className="form-input pl-8 pr-4 text-sm font-medium dark:focus:bg-gray-700"
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
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input 
                              type="number" 
                              step="0.01" 
                              placeholder={t("Pct %")} 
                              className="form-input text-sm font-medium dark:focus:bg-gray-700"
                              value={headerDetails.nonTaxableOtherAdjustmentPct || ''}
                              onChange={(e) => handleHeaderChange('nonTaxableOtherAdjustmentPct', e.target.value)}
                            />
                        </div>
                        <span className="text-gray-400 font-black text-xs">{t("+")}</span>
                        <div className="flex-1 relative">
                          <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">{t("₹")}</span>
                          <input 
                              type="number" 
                              step="0.01" 
                              placeholder={t("Amount")} 
                              className="form-input pl-8 pr-4 text-sm font-medium dark:focus:bg-gray-700"
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
          </div>
        )}

        <div className="w-full">
          <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[11] ${collapsedSections.rounding ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
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
                    className="form-input text-sm font-medium appearance-none cursor-pointer dark:focus:bg-gray-700"
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
                    <span className="absolute left-4 top-[22px] -translate-y-1/2 text-gray-400 font-black z-10">{t("₹")}</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder={t("Amount")} 
                      className={`w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${headerDetails.roundingType !== 'manual' ? 'opacity-50 cursor-not-allowed' : ''} dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700`}
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
        </div>
        
        <div className="w-full">
          <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[10] ${collapsedSections.summary ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
            <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.summary ? '' : 'mb-6'}`} onClick={() => toggleSection('summary')}>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t("Summary")}</h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.summary ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {!collapsedSections.summary && (() => {
              const qtyByUnit: Record<string, number> = {};
              let totalItems = 0;
              if (rows) {
                rows.forEach(r => {
                  if (r.itemName || r.ledgerName) {
                    totalItems++;
                    if (r.qty) {
                      const q = parseFloat(r.qty) || 0;
                      const u = (r.unit || 'PCS').toUpperCase();
                      qtyByUnit[u] = (qtyByUnit[u] || 0) + q;
                    }
                  }
                });
              }

              const totalDiscount = (totals.discount || 0) + (totals.postTaxDiscount || 0) + (totals.voucherDiscount || 0);
              const totalAdjustment = totals.otherAdjustment || 0;
              const nonTaxableAdjustment = totals.nonTaxableAdjustment || 0;

              const MetricBox = ({ label, value, type = 'default', subtitle, tooltip }: any) => {
                const getColors = () => {
                   switch(type) {
                     case 'positive': return 'bg-gradient-to-b from-white to-emerald-50/30 border-emerald-200/70 shadow-[0_2px_8px_-4px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)] hover:border-emerald-300 dark:from-gray-700 dark:to-gray-800 dark:border-emerald-800/60 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_-4px_rgba(16,185,129,0.4)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_15px_-4px_rgba(16,185,129,0.6)] dark:hover:border-emerald-600/80';
                     case 'negative': return 'bg-gradient-to-b from-white to-rose-50/30 border-rose-200/70 shadow-[0_2px_8px_-4px_rgba(244,63,94,0.2)] hover:shadow-[0_4px_12px_-4px_rgba(244,63,94,0.3)] hover:border-rose-300 dark:from-gray-700 dark:to-gray-800 dark:border-rose-800/60 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_-4px_rgba(244,63,94,0.4)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_15px_-4px_rgba(244,63,94,0.6)] dark:hover:border-rose-600/80';
                     case 'primary': return 'bg-gradient-to-b from-blue-50 to-blue-100/50 border-blue-200/70 shadow-[0_2px_8px_-4px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_12px_-4px_rgba(59,130,246,0.3)] hover:border-blue-300 dark:from-gray-700 dark:to-gray-800 dark:border-blue-800/60 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_10px_-4px_rgba(59,130,246,0.4)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_15px_-4px_rgba(59,130,246,0.6)] dark:hover:border-blue-600/80';
                     default: return 'bg-gradient-to-b from-white to-gray-50/50 border-gray-200/70 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] hover:border-gray-300 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_10px_-4px_rgba(0,0,0,0.6)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_6px_15px_-4px_rgba(0,0,0,0.8)] dark:hover:border-gray-500';
                   }
                };
                
                const getLabelColors = () => {
                  switch(type) {
                    case 'primary': return 'text-blue-600/70 dark:text-blue-400';
                    case 'positive': return 'text-emerald-600/70 dark:text-emerald-400';
                    case 'negative': return 'text-rose-500/70 dark:text-rose-400';
                    default: return 'text-gray-500 dark:text-gray-400';
                  }
                }

                const getValueColors = () => {
                  switch(type) {
                    case 'primary': return 'text-blue-800 dark:text-blue-300';
                    case 'positive': return 'text-emerald-700 dark:text-emerald-300';
                    case 'negative': return 'text-rose-600 dark:text-rose-300';
                    default: return 'text-gray-800 dark:text-gray-100';
                  }
                }

                return (
                  <div title={tooltip} className={`relative px-4 py-3.5 rounded-2xl border flex flex-col items-center justify-center text-center cursor-default transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group ${getColors()} min-h-[80px]`}>
                     <span className={`text-[10px] uppercase font-bold tracking-[0.15em] mb-1.5 transition-colors line-clamp-1 break-all ${getLabelColors()}`}>{label}</span>
                     <span className={`font-black tracking-tight leading-tight ${typeof value === 'string' && value.length > 10 ? 'text-sm' : 'text-base lg:text-lg'} ${getValueColors()}`}>{value}</span>
                     {subtitle && <span className="mt-1.5">{subtitle}</span>}
                  </div>
                );
              }

              return (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col flex-grow">
                  <div className="form-grid gap-3 mb-6">
                    
                    {/* Items & Quantity */}
                    {isInventory && <MetricBox label={t("Total Items")} value={totalItems || ''} />}
                    
                    {isInventory && (
                      <MetricBox 
                        label={t("Total Qty")} 
                        value={
                          Object.keys(qtyByUnit).length > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              {Object.entries(qtyByUnit).map(([unit, qty]) => (
                                <span key={unit} className="text-gray-800 font-black text-sm leading-tight inline-flex items-center justify-center gap-1 dark:text-gray-100">
                                  {qty} <span className="text-[10px] text-gray-400 font-bold">{unit}</span>
                                </span>
                              ))}
                            </div>
                          ) : "0"
                        } 
                      />
                    )}

                    {/* Subtotal */}
                    {isInventory && <MetricBox label={t("Subtotal")} value={`₹ ${(totals.subtotal || 0).toFixed(2)}`} />}

                    {/* Total Discount */}
                    {isInventory && (
                      <>
                        <MetricBox label={t("Trade Discount")} type={totals.discount > 0 || totals.postTaxDiscount > 0 ? "positive" : "default"} value={`₹ ${((totals.discount || 0) + (totals.postTaxDiscount || 0)).toFixed(2)}`} />
                        {totals.taxableVoucherDiscount > 0 && (
                          <MetricBox label={t("Taxable Vch Disc")} type="positive" value={`- ₹ ${totals.taxableVoucherDiscount.toFixed(2)}`} />
                        )}
                        {totals.taxableVoucherDiscount > 0 && (
                          <MetricBox label={t("Taxable Vch Disc")} type="positive" value={`- ₹ ${totals.taxableVoucherDiscount.toFixed(2)}`} />
                        )}
                        {totals.nonTaxableVoucherDiscount > 0 && (
                          <MetricBox label={t("Non-Tax Vch Disc")} type="positive" value={`- ₹ ${totals.nonTaxableVoucherDiscount.toFixed(2)}`} />
                        )}
                      </>
                    )}

                    {/* Taxable Amount */}
                    {isInventory && <MetricBox label={t("Taxable Amount")} type="primary" value={`₹ ${(totals.amountAfterDiscount || totals.subtotal || 0).toFixed(2)}`} />}

                    {/* Taxes — driven by totals.computedSupplyType for reliable IGST↔CGST/SGST switching */}
                    {isInventory && (() => {
                      const isInterState = totals.computedSupplyType === 'Inter-State';
                      const igstAmt = totals.igst || 0;
                      const cgstAmt = totals.cgst || 0;
                      const sgstAmt = totals.sgst || 0;
                      if (isInterState) {
                        return (
                          <MetricBox
                            label={t("IGST")}
                            type={igstAmt > 0 ? 'primary' : 'default'}
                            value={`₹ ${igstAmt.toFixed(2)}`}
                          />
                        );
                      } else {
                        return (
                          <>
                            <MetricBox
                              label={t("CGST")}
                              type={cgstAmt > 0 ? 'primary' : 'default'}
                              value={`₹ ${cgstAmt.toFixed(2)}`}
                            />
                            <MetricBox
                              label={t("SGST")}
                              type={sgstAmt > 0 ? 'primary' : 'default'}
                              value={`₹ ${sgstAmt.toFixed(2)}`}
                            />
                          </>
                        );
                      }
                    })()}

                    {/* Adjustment */}
                    {isInventory && (
                      <MetricBox 
                          label={t(headerDetails.taxableAdjustmentRemarks || "Other Taxable Charges")} 
                          type={totalAdjustment > 0 ? 'primary' : totalAdjustment < 0 ? 'positive' : 'default'}
                          tooltip={t(headerDetails.taxableAdjustmentRemarks)}
                         value={`${totalAdjustment > 0 ? '+' : totalAdjustment < 0 ? '-' : ''} ₹ ${Math.abs(totalAdjustment).toFixed(2)}`} 
                      />
                    )}

                    {/* Non-Taxable Adjustment */}
                    {isInventory && (
                      <MetricBox 
                          label={t(headerDetails.nonTaxableAdjustmentRemarks || "Non-Taxable Charges")} 
                          type={nonTaxableAdjustment > 0 ? 'primary' : nonTaxableAdjustment < 0 ? 'positive' : 'default'}
                          tooltip={t(headerDetails.nonTaxableAdjustmentRemarks)}
                         value={`${nonTaxableAdjustment > 0 ? '+' : nonTaxableAdjustment < 0 ? '-' : ''} ₹ ${Math.abs(nonTaxableAdjustment).toFixed(2)}`} 
                      />
                    )}

                    {/* Round Off */}
                    {isInventory && (
                      <MetricBox label={t("Round Off")} type={totals.roundOff !== 0 ? "default" : "default"} value={`${totals.roundOff > 0 ? '+' : ''}${(totals.roundOff || 0).toFixed(2)}`} />
                    )}

                  </div>
                  
                  <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl border border-blue-500 shadow-xl shadow-blue-500/20 text-white flex justify-between items-center group cursor-default transition-all duration-300 hover:shadow-blue-500/30 hover:-translate-y-0.5">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                       <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                       <span className="relative text-sm font-bold text-blue-100 uppercase tracking-[0.2em]">{t("Grand Total")}</span>
                       <span className={`relative flex items-center ${
                        (totals.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 15 ? 'text-2xl lg:text-3xl' :
                        (totals.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 12 ? 'text-3xl lg:text-4xl' : 
                        'text-4xl lg:text-5xl'
                      } font-black tracking-tighter drop-shadow-sm`}>
                         <span className="opacity-70 mr-1.5 text-2xl lg:text-3xl font-bold">{t("₹")}</span>
                         {(totals.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
    </div>
  );
};
