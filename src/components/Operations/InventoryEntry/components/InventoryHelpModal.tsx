import React, { useState } from 'react';
import { X, HelpCircle, ChevronUp, ChevronDown, Layout, Keyboard, Info, Bookmark, Calculator, FileText, Zap, MousePointer2, ScanBarcode } from 'lucide-react';

interface InventoryHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryHelpModal: React.FC<InventoryHelpModalProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    functionality: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 dark:bg-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0 dark:border-gray-800">
          <div>
             <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 tracking-tight dark:text-white">
               <HelpCircle size={24} className="text-emerald-500" /> 
               Help & User Guide
             </h3>
             <p className="form-label tracking-widest mt-1 dark:text-gray-400">Mastering Inventory Operations</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100 group">
            <X size={24} className="group-active:scale-95 transition-transform" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar bg-white dark:bg-gray-800">
          
          {/* Section 1: Detailed Functional Guide */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm dark:border-gray-800">
            <button 
              onClick={() => toggleSection('functionality')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-black text-gray-800 text-sm flex items-center uppercase tracking-wider dark:text-gray-100">
                <Layout size={18} className="mr-3 text-emerald-500"/> Section-by-Section Guide
              </span>
              {expandedSections.functionality ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
            </button>
            {expandedSections.functionality && (
              <div className="p-5 bg-white space-y-8 dark:bg-gray-800">
                <div>
                  <h4 className="font-black text-emerald-800 text-xs mb-3 pb-2 border-b-2 border-emerald-50 uppercase tracking-[0.2em] flex items-center">
                    <Bookmark size={14} className="mr-2" /> Workflow Types (Tabs)
                  </h4>
                  <div className="form-grid gap-4">
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                       <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                         <b>Stock Journal:</b> The "Swiss Army Knife" of inventory. Use for generic taxable adjustments, converting raw materials into finished goods (Manufacturing), or correcting bin errors.
                       </p>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                       <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                         <b>Physical Stock:</b> Your Audit tool. Enter what you *actually* see. The system compares it to the "Book" value and generates "Stock Journal" variance entries automatically to sync records.
                       </p>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                       <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                         <b>Consumption & Scrap:</b> Reducer workflows. <i>Consumption</i> tracks items used in daily business (e.g. tape, fuel). <i>Scrap</i> handles damaged/unsellable goods that need to be removed from value.
                       </p>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                       <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                         <b>Inter-Location Transfer:</b> Moves inventory between bins or branches. Requires both Source and Destination identification. No financial loss/gain is recorded.
                       </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-emerald-800 text-xs mb-3 pb-2 border-b-2 border-emerald-50 uppercase tracking-[0.2em]">1. Smart Header & Compliance</h4>
                  <ul className="space-y-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span><b>Entry Auto-Numbering:</b> Sequential numbers are locked to prevent gaps in audit logs. If "Draft" is saved, the number remains reserved.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span><b>Document Attachments:</b> Drag & drop GRNs or signed delivery notes. High-security mode requires manual approval if attachments are missing.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-black text-emerald-800 text-xs mb-3 pb-2 border-b-2 border-emerald-50 uppercase tracking-[0.2em]">2. Intelligent Item Selection</h4>
                  <p className="text-xs text-gray-500 mb-3 italic dark:text-gray-400">Use one of three entry methods:</p>
                  <div className="form-grid gap-3">
                    <div className="p-3 border border-gray-100 rounded-xl bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
                      <Zap size={16} className="mx-auto mb-2 text-yellow-500" />
                      <span className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-300">Smart Search</span>
                    </div>
                    <div className="p-3 border border-gray-100 rounded-xl bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
                      <ScanBarcode size={16} className="mx-auto mb-2 text-purple-500" />
                      <span className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-300">AI Barcode Scan</span>
                    </div>
                    <div className="p-3 border border-gray-100 rounded-xl bg-gray-50 text-center dark:border-gray-800 dark:bg-gray-900">
                      <Keyboard size={16} className="mx-auto mb-2 text-blue-500" />
                      <span className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-300">F2 Master Key</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Keyboard Masterclass */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm dark:border-gray-800">
            <button 
              onClick={() => toggleSection('keyboard')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-black text-gray-800 text-sm flex items-center uppercase tracking-wider dark:text-gray-100">
                <Keyboard size={18} className="mr-3 text-blue-500"/> Power-User Shortcuts
              </span>
              {expandedSections.keyboard ? <ChevronUp size={18} className="text-gray-400"/> : <ChevronDown size={18} className="text-gray-400"/>}
            </button>
            {expandedSections.keyboard && (
              <div className="p-5 bg-white dark:bg-gray-800">
                <div className="form-grid gap-4">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Save Current Entry</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-black text-gray-600 min-w-[50px] text-center shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">CTRL + S</kbd>
                  </div>
                   <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Fast Scan (AI)</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-black text-gray-600 min-w-[50px] text-center shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">ALT + S</kbd>
                  </div>
                   <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Toggle "Edit" View</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-black text-gray-600 min-w-[50px] text-center shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">ALT + E</kbd>
                  </div>
                   <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Calculator Bridge</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-black text-gray-600 min-w-[50px] text-center shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">ALT + C</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Pro Tips */}
          <div className="bg-emerald-600 rounded-[1.5rem] p-6 text-white shadow-lg overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} />
             </div>
             <h4 className="text-lg font-black tracking-tight mb-4 flex items-center">
               <Info size={20} className="mr-2" /> Expert Pro Tips
             </h4>
             <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                   <h5 className="text-xs font-black uppercase tracking-widest mb-1 text-emerald-200">Zero-Loss Transfers</h5>
                   <p className="text-sm font-medium leading-relaxed">Always check the "Book Summary" before committing a <b>Physical Stock</b> update. Discrepancies larger than 2% should trigger a manual supervisor alert.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                   <h5 className="text-xs font-black uppercase tracking-widest mb-1 text-emerald-200">Batch Integrity</h5>
                   <p className="text-sm font-medium leading-relaxed">Use the <b>Deep Edit Modal (Alt+E)</b> to record Expiry Dates. This data feeds into the <i>Near-Expiry Dashboard</i> for proactive scrap reduction.</p>
                </div>
             </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-[1.5rem] mt-4 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
             <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600 dark:bg-gray-800">
                   <MousePointer2 size={18} />
                </div>
                <div>
                   <p className="text-xs font-black text-gray-900 uppercase tracking-wider dark:text-white">Need Advanced Support?</p>
                   <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Contact our inventory specialists for bulk import assistance.</p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end shrink-0 dark:border-gray-800">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Got it, Let's Work
          </button>
        </div>
      </div>
    </div>
  );
};
