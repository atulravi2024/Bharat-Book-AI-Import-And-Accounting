import React, { useState } from 'react';
import { Keyboard, X, ChevronUp, ChevronDown, Calculator, Layout } from 'lucide-react';

interface VoucherKeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherKeyboardShortcutsModal: React.FC<VoucherKeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [showHelpGeneral, setShowHelpGeneral] = useState(false);
  const [showHelpDocShortcuts, setShowHelpDocShortcuts] = useState(false);
  const [showHelpToolShortcuts, setShowHelpToolShortcuts] = useState(false);
  const [showSectionShortcuts, setShowSectionShortcuts] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh] dark:bg-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 dark:text-white"><Keyboard size={20} className="text-blue-500" /> Keyboard Shortcuts</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4 text-sm text-gray-700 dark:text-gray-200">
          
          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <button 
              onClick={() => setShowHelpGeneral(!showHelpGeneral)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-bold text-gray-900 flex items-center dark:text-white"><Keyboard size={16} className="mr-2 text-blue-500"/> General Navigation Shortcuts</span>
              {showHelpGeneral ? <ChevronUp size={16} className="text-gray-500 dark:text-gray-400"/> : <ChevronDown size={16} className="text-gray-500 dark:text-gray-400"/>}
            </button>
            {showHelpGeneral && (
              <div className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Next Field</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Tab</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Previous Field</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Shift+Tab</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Select / Submit</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Enter</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Close / Cancel</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Esc</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Checkbox</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Space</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Navigate Lists</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">↑ / ↓ Arrows</kbd></div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <button 
              onClick={() => setShowHelpDocShortcuts(!showHelpDocShortcuts)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-bold text-gray-900 flex items-center dark:text-white"><Keyboard size={16} className="mr-2 text-blue-500"/> Document Action Shortcuts</span>
              {showHelpDocShortcuts ? <ChevronUp size={16} className="text-gray-500 dark:text-gray-400"/> : <ChevronDown size={16} className="text-gray-500 dark:text-gray-400"/>}
            </button>
            {showHelpDocShortcuts && (
              <div className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Save Entry</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Ctrl+S</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Save & New</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Ctrl+Shift+S</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>New Entry</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Ctrl+N</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Preview/Print</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Ctrl+P</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Duplicate Entry</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+D</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Clear Entry</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+X</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Delete Entry</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+Del</kbd></div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <button 
              onClick={() => setShowHelpToolShortcuts(!showHelpToolShortcuts)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-bold text-gray-900 flex items-center dark:text-white"><Calculator size={16} className="mr-2 text-blue-500"/> Tool & Utility Shortcuts</span>
              {showHelpToolShortcuts ? <ChevronUp size={16} className="text-gray-500 dark:text-gray-400"/> : <ChevronDown size={16} className="text-gray-500 dark:text-gray-400"/>}
            </button>
            {showHelpToolShortcuts && (
              <div className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Calculator</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+C</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Scan Barcode</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+S</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Attach Files</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+A</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>History</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+H</kbd></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Help</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">F1</kbd></div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <button 
              onClick={() => setShowSectionShortcuts(!showSectionShortcuts)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-bold text-gray-900 flex items-center dark:text-white"><Layout size={16} className="mr-2 text-blue-500"/> Section Navigation Shortcuts</span>
              {showSectionShortcuts ? <ChevronUp size={16} className="text-gray-500 dark:text-gray-400"/> : <ChevronDown size={16} className="text-gray-500 dark:text-gray-400"/>}
            </button>
            {showSectionShortcuts && (
              <div className="p-3 bg-white grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 border-t border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Bottom Nav & Save</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+0</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Bottom Tools</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+1</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Bottom Export</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+2</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Bottom Settings</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+3</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Line Item Selection</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+4</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Line Attributes</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+5</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Line Quantities</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+6</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Line Non-Tax Pricing</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+7</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Line Tax Pricing</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+8</kbd></div>
                <div className="flex justify-between border-b border-gray-100 pb-1 dark:border-gray-800"><span>Toggle Line Tracking</span> <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono dark:bg-gray-800">Alt+9</kbd></div>
              </div>
            )}
          </div>

        </div>
        <div className="p-6 border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            Close Shortcuts
          </button>
        </div>
      </div>
    </div>
  );
};
