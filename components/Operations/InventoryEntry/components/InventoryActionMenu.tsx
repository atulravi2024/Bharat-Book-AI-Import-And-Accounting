import React from 'react';
import { 
  ChevronUp, ChevronDown, ChevronsLeft, ChevronLeft, Save, ChevronRight, ChevronsRight, 
  ClipboardList, ScanBarcode, Paperclip, Calculator, PlusCircle, Plus, Printer, 
  FilePlus, Bookmark, Eye, FileText, Image, X, Trash2, Keyboard, HelpCircle, Settings2
} from 'lucide-react';

interface InventoryActionMenuProps {
  activeTab: string;
  isSection0Collapsed: boolean;
  setIsSection0Collapsed: (val: boolean) => void;
  isSection1Collapsed: boolean;
  setIsSection1Collapsed: (val: boolean) => void;
  isSection2Collapsed: boolean;
  setIsSection2Collapsed: (val: boolean) => void;
  isSection3Collapsed: boolean;
  setIsSection3Collapsed: (val: boolean) => void;
  
  handleNavigate: (dir: 'first'|'up'|'down'|'last') => void;
  handleSave: () => void;
  setShowHistory: (val: boolean) => void;
  setScanningRowIndex: (idx: number) => void;
  setShowScanner: (val: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  attachedFile: File | null;
  setShowCalculator: (val: boolean) => void;
  handleDuplicateEntry: () => void;
  handleNewEntry: () => void;
  handleSavePrint: () => void;
  handleSaveNew: () => void;
  handleSaveDraft: () => void;
  handlePreview: () => void;
  handleGeneratePDF: () => void;
  handleGenerateImage: () => void;
  handleClearEntryClick: () => void;
  handleDeleteEntryClick: () => void;
  setShowKeyboardShortcuts: (val: boolean) => void;
  setShowHelp: (val: boolean) => void;
  onOpenPrintSettings?: () => void;
}

export const InventoryActionMenu: React.FC<InventoryActionMenuProps> = ({
  activeTab,
  isSection0Collapsed, setIsSection0Collapsed,
  isSection1Collapsed, setIsSection1Collapsed,
  isSection2Collapsed, setIsSection2Collapsed,
  isSection3Collapsed, setIsSection3Collapsed,
  handleNavigate, handleSave, setShowHistory, setScanningRowIndex, setShowScanner,
  fileInputRef, attachedFile, setShowCalculator, handleDuplicateEntry, handleNewEntry,
  handleSavePrint, handleSaveNew, handleSaveDraft, handlePreview, handleGeneratePDF,
  handleGenerateImage, handleClearEntryClick, handleDeleteEntryClick, setShowKeyboardShortcuts,
  setShowHelp, onOpenPrintSettings
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] md:sticky md:bottom-0 md:-mx-6 lg:-mx-8 md:-mb-6 lg:-mb-8 z-[60] md:z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-2 md:p-1.5 flex justify-end md:justify-between items-center px-4 md:px-6 lg:px-8 mt-4 md:mt-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
         {activeTab.replace('_', ' ')}
      </div>
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5 items-center">
         <button 
           onClick={() => setIsSection0Collapsed(!isSection0Collapsed)} 
           title="Toggle Navigation & Save"
           className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
         >
           {isSection0Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
         </button>
         <div className={`${isSection0Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
           <button 
             onClick={() => handleNavigate('first')} 
             title="First Record"
             className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             <ChevronsLeft size={18} />
           </button>
           <button 
             onClick={() => handleNavigate('up')} 
             title="Previous Record"
             className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             <ChevronLeft size={18} />
           </button>

           <button onClick={handleSave} title="Save" className="p-1 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-sm active:scale-95 shrink-0">
             <Save size={18} />
           </button>

           <button 
             onClick={() => handleNavigate('down')} 
             title="Next Record"
             className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             <ChevronRight size={18} />
           </button>
           <button 
             onClick={() => handleNavigate('last')} 
             title="Last Record"
             className="block p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
           >
             <ChevronsRight size={18} />
           </button>
         </div>

         <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

         <button 
           onClick={() => setIsSection1Collapsed(!isSection1Collapsed)} 
           title="Toggle Tools"
           className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
         >
           {isSection1Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
         </button>
         <div className={`${isSection1Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
           <button onClick={() => setShowHistory(true)} title="View History" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             <ClipboardList size={18} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); setScanningRowIndex(-1); setShowScanner(true); }} title="Scan Barcode" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             <ScanBarcode size={18} />
           </button>
           <label htmlFor="inventory-file-upload" title="Attach Files" className="relative p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer flex items-center justify-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             {attachedFile ? <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span> : null}
             <Paperclip size={18} />
           </label>
           <button onClick={() => setShowCalculator(true)} title="Calculator" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             <Calculator size={18} />
           </button>
           <button onClick={handleDuplicateEntry} title="Duplicate Entry" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             <PlusCircle size={18} />
           </button>
         </div>
         
         <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

         <button 
           onClick={() => setIsSection2Collapsed(!isSection2Collapsed)} 
           title="Toggle Export Options"
           className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
         >
           {isSection2Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
         </button>
         <div className={`${isSection2Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
           <button 
             onClick={handleNewEntry} 
             title="New Entry"
             className="block p-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
           >
             <Plus size={18} />
           </button>
           <button onClick={handleSavePrint} title="Save & Print" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <Printer size={18} />
           </button>
           <button onClick={handleSaveNew} title="Save & New" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <FilePlus size={18} />
           </button>
           <button onClick={handleSaveDraft} title="Save as Draft" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <Bookmark size={18} />
           </button>
           <button onClick={handlePreview} title="Print Preview" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <Eye size={18} />
           </button>
           <button onClick={handleGeneratePDF} title="Generate PDF" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <FileText size={18} />
           </button>
           <button onClick={handleGenerateImage} title="Generate Image" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <Image size={18} />
           </button>
         </div>
         
         <div className="w-px bg-gray-200 my-1 mx-0.5 shrink-0 dark:bg-gray-700"></div>

         <button 
           onClick={() => setIsSection3Collapsed(!isSection3Collapsed)} 
           title="Toggle Settings & Actions"
           className="md:hidden p-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
         >
           {isSection3Collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
         </button>
         <div className={`${isSection3Collapsed ? 'hidden md:flex' : 'flex'} gap-1 animate-in slide-in-from-right-2 duration-300`}>
           <button onClick={handleClearEntryClick} title="Clear Entry" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <X size={18} />
           </button>
           <button onClick={handleDeleteEntryClick} title="Delete Entry" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
             <Trash2 size={18} />
           </button>
           <button onClick={() => setShowKeyboardShortcuts(true)} title="Keyboard Shortcuts" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             <Keyboard size={18} />
           </button>
           <button onClick={() => setShowHelp(true)} title="Help" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
             <HelpCircle size={18} />
           </button>
           {onOpenPrintSettings && (
             <button onClick={() => onOpenPrintSettings()} title="Print Settings" className="p-1 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
               <Settings2 size={18} />
             </button>
           )}
         </div>
      </div>
    </div>
  );
};
