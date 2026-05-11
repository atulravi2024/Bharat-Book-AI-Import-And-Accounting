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
    nonTaxableAdjustment: number;
    roundOff: number;
    finalValue: number;
  };
  activeTab: string;
  headerDetails: any;
}

export const SummarySection: React.FC<SummarySectionProps & { rows?: any[] }> = ({
  collapsedSections,
  toggleSection,
  totals,
  activeTab,
  headerDetails,
  rows
}) => {
  return (
    <div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[10] ${collapsedSections.summary ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-3xl'} dark:bg-gray-800`}>
      <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.summary ? '' : 'mb-6'}`} onClick={() => toggleSection('summary')}>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Summary Log</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.summary ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {!collapsedSections.summary && (() => {
        const qtyByUnit: Record<string, number> = {};
        if (rows) {
          rows.forEach(r => {
            if (r.itemName) {
              if (r.qty) {
                const q = parseFloat(r.qty) || 0;
                const u = (r.unit || 'PCS').toUpperCase();
                qtyByUnit[u] = (qtyByUnit[u] || 0) + q;
              }
            }
          });
        }
        
        const MetricBox = ({ label, value, type = 'default', subtitle, tooltip }: any) => {
          const getColors = () => {
             switch(type) {
               case 'positive': return 'bg-gradient-to-b from-white to-emerald-50/30 border-emerald-200/70 shadow-[0_2px_8px_-4px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_-4px_rgba(16,185,129,0.3)] hover:border-emerald-300';
               case 'negative': return 'bg-gradient-to-b from-white to-rose-50/30 border-rose-200/70 shadow-[0_2px_8px_-4px_rgba(244,63,94,0.2)] hover:shadow-[0_4px_12px_-4px_rgba(244,63,94,0.3)] hover:border-rose-300';
               case 'primary': return 'bg-gradient-to-b from-blue-50 to-blue-100/50 border-blue-200/70 shadow-[0_2px_8px_-4px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_12px_-4px_rgba(59,130,246,0.3)] hover:border-blue-300';
               default: return 'bg-gradient-to-b from-white to-gray-50/50 border-gray-200/70 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] hover:border-gray-300';
             }
          };
          
          const getLabelColors = () => {
            switch(type) {
              case 'primary': return 'text-blue-600/70';
              case 'positive': return 'text-emerald-600/70';
              case 'negative': return 'text-rose-500/70';
              default: return 'text-gray-500';
            }
          }

          const getValueColors = () => {
            switch(type) {
              case 'primary': return 'text-blue-800';
              case 'positive': return 'text-emerald-700';
              case 'negative': return 'text-rose-600';
              default: return 'text-gray-800';
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              
              <MetricBox label="Total Items" value={totals.totalItems} />
              
              <MetricBox 
                label="Total Net Qty" 
                value={
                  Object.keys(qtyByUnit).length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {Object.entries(qtyByUnit).map(([unit, qty]) => (
                        <span key={unit} className="text-gray-800 font-black text-sm leading-tight inline-flex items-center justify-center gap-1 dark:text-gray-100">
                          {qty > 0 ? '+' : ''}{qty} <span className="text-[10px] text-gray-400 font-bold">{unit}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    totals.totalQty > 0 ? `+${totals.totalQty}` : totals.totalQty || "0"
                  )
                } 
              />
              
              {activeTab !== 'physical_stock' && (
                <>
                  <MetricBox 
                    label="Est. Value" 
                    value={`₹ ${totals.estValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
                  />

                  {/* Voucher Discount */}
                  <MetricBox 
                    label="Total Discount" 
                    type={totals.voucherDiscount > 0 ? "positive" : "default"}
                    value={`${totals.voucherDiscount > 0 ? '- ' : ''}₹ ${totals.voucherDiscount.toFixed(2)}`} 
                  />

                  {/* Taxable Adjustment */}
                  <MetricBox 
                    label={headerDetails.taxableAdjustmentRemarks || 'Other Taxable Charges'}
                    type={totals.otherAdjustment > 0 ? 'primary' : totals.otherAdjustment < 0 ? 'positive' : 'default'}
                    tooltip={headerDetails.taxableAdjustmentRemarks}
                    value={`${totals.otherAdjustment > 0 ? '+' : totals.otherAdjustment < 0 ? '-' : ''} ₹ ${Math.abs(totals.otherAdjustment).toFixed(2)}`}
                  />

                  {/* Non-Taxable Adjustment */}
                  <MetricBox 
                    label={headerDetails.nonTaxableAdjustmentRemarks || 'Non-Taxable Charges'}
                    type={totals.nonTaxableAdjustment > 0 ? 'primary' : totals.nonTaxableAdjustment < 0 ? 'positive' : 'default'}
                    tooltip={headerDetails.nonTaxableAdjustmentRemarks}
                    value={`${totals.nonTaxableAdjustment > 0 ? '+' : totals.nonTaxableAdjustment < 0 ? '-' : ''} ₹ ${Math.abs(totals.nonTaxableAdjustment).toFixed(2)}`}
                  />

                  {/* Round Off */}
                  <MetricBox 
                    label="Round Off"
                    type={totals.roundOff !== 0 ? 'default' : 'default'}
                    value={`${totals.roundOff > 0 ? '+' : ''}${totals.roundOff.toFixed(2)}`}
                  />
                </>
              )}
            </div>

            {activeTab !== 'physical_stock' && (
              <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl border border-blue-500 shadow-xl shadow-blue-500/20 text-white flex justify-between items-center group cursor-default transition-all duration-300 hover:shadow-blue-500/30 hover:-translate-y-0.5">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                   <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                   <span className="relative text-sm font-bold text-blue-100 uppercase tracking-[0.2em]">Total Net Value</span>
                   <span className={`relative flex items-center ${
                    totals.finalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 15 ? 'text-2xl lg:text-3xl' : 
                    totals.finalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }).length > 12 ? 'text-3xl lg:text-4xl' : 
                    'text-4xl lg:text-5xl'
                  } font-black tracking-tighter drop-shadow-sm`}>
                     <span className="opacity-70 mr-1.5 text-2xl lg:text-3xl font-bold">₹</span>
                     {totals.finalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                   </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
