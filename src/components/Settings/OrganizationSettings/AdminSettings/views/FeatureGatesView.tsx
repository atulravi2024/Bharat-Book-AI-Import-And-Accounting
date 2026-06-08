import React from 'react';
import { Sliders, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { FeatureGates } from "../types";

interface FeatureGatesViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  featureGates: FeatureGates;
  handleToggleGate: (key: keyof FeatureGates) => void;
  gatesSaved: boolean;
  handleSaveGates: () => void;
}

export const FeatureGatesView: React.FC<FeatureGatesViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  featureGates,
  handleToggleGate,
  gatesSaved,
  handleSaveGates,
}) => {
  const isOpen = expandedSection === 'featureGates';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'featureGates')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Accessibility Feature Gates")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Toggle runtime flags and override visual components rendering")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-950/45 dark:text-emerald-400 shrink-0">{t("REAL WORKING FEATURE")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              
              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                  checked={featureGates.compactDensity}
                  onChange={() => handleToggleGate('compactDensity')}
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition block">{t("Compact Table density")}</span>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Shrinks grid paddings to maximize columns visualization.")}</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                  checked={featureGates.audioFeedback}
                  onChange={() => handleToggleGate('audioFeedback')}
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition block">{t("Audio confirmation synths")}</span>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Enables soft synth chimes on voucher validation.")}</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                  checked={featureGates.skipPopups}
                  onChange={() => handleToggleGate('skipPopups')}
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition block">{t("Skip multi-step popups")}</span>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Auto-saves OCR extractions to main list directly.")}</span>
                </div>
              </label>

            </div>

            <div className="space-y-3">
              
              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                  checked={featureGates.allowNegativeStock}
                  onChange={() => handleToggleGate('allowNegativeStock')}
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition block">{t("Allow negative catalog stocks")}</span>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Bypasses warning popups when stock registers negative numbers.")}</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                  checked={featureGates.highContrastBorders}
                  onChange={() => handleToggleGate('highContrastBorders')}
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition block">{t("High contrast screen boundaries")}</span>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Applies dark ink divider definitions around major grids.")}</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-gray-200 dark:border-gray-800 focus:ring-0 text-indigo-600 focus:outline-none"
                  checked={featureGates.autoGstRounding}
                  onChange={() => handleToggleGate('autoGstRounding')}
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition block">{t("Auto GST rounding differences")}</span>
                  <span className="text-[10px] text-gray-450 dark:text-gray-500">{t("Automatically pads fraction rounding differences to SGST/CGST.")}</span>
                </div>
              </label>

            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-900 items-center gap-3">
            {gatesSaved && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{t("Settings persistence complete!")}</span>
            )}
            <button
              onClick={handleSaveGates}
              className="h-8 text-[11px] font-bold px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> {t("Apply Accessibility Options")}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
