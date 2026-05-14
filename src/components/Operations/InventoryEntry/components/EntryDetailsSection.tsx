import React from 'react';
import { Settings2, X, Info, Paperclip, Trash2, ChevronUp, HelpCircle } from 'lucide-react';

interface EntryDetailsSectionProps {
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  systemStamp: string;
  formError: string | null;
  showRequirements: boolean;
  setShowRequirements: (val: boolean) => void;
  collapsedSections: any;
  toggleSection: (section: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  attachedFile: File | null;
  setAttachedFile: (file: File | null) => void;
  activeTab: string;
}

export const EntryDetailsSection: React.FC<EntryDetailsSectionProps> = ({
  headerDetails,
  handleHeaderChange,
  systemStamp,
  formError,
  showRequirements,
  setShowRequirements,
  collapsedSections,
  toggleSection,
  fileInputRef,
  attachedFile,
  setAttachedFile,
  activeTab
}) => {
  const WebBillRequirements = () => (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start space-x-3">
        <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
          <HelpCircle size={18} className="text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-2">Inventory Bill Requirements</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {[
              'Unique sequential Entry Number',
              'Valid Location identification',
              'Batch/Lot Tracking details',
              'Accurate Stock Item units',
              'System-generated Date & Time Stamp',
              'Supervisor/Authorized verification',
              'Transit Vehicle number (if applicable)',
              'E-Waybill verification for transfers',
              'Real-time Stock taxable adjustment records'
            ].map((req, i) => (
              <li key={i} className="flex items-center text-xs font-bold text-emerald-700/70">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={() => setShowRequirements(false)}
          className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showRequirements && <WebBillRequirements />}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 mb-6">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="bg-red-100 p-2 rounded-full shrink-0">
                    <X size={16} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Transaction Failed</h4>
                  <p className="text-sm">{formError}</p>
                </div>
            </div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg border border-red-100 shrink-0 text-center">
                {systemStamp}
            </div>
        </div>
      )}
      <div className={`bg-white border border-gray-200/60 shadow-sm relative mb-6 transition-all duration-300 z-[50] ${collapsedSections.header ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'} dark:bg-gray-800`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-[inherit]"></div>
        <div className={`flex items-center justify-between cursor-pointer ${collapsedSections.header ? '' : 'mb-5'}`} onClick={() => toggleSection('header')}>
           <div className="flex items-center space-x-3">
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center dark:text-gray-100">
               <Settings2 size={16} className="mr-2 text-emerald-500"/> Entry <span className="hidden sm:inline">&nbsp;Details</span>
             </h3>
             <button 
               onClick={(e) => { e.stopPropagation(); setShowRequirements(!showRequirements); }}
               className="p-1 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors flex items-center space-x-1"
               title="Entry Requirements"
             >
               <Info size={14} />
               <span className="text-[10px] font-black uppercase tracking-tighter hidden sm:inline">Requirements</span>
             </button>
           </div>
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider dark:bg-gray-900">
               Status: <span className="text-amber-500 ml-1">Draft</span>
             </div>
             <button className="text-gray-400 hover:text-gray-600 transition-colors">
               <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.header ? 'rotate-180' : ''}`} />
             </button>
           </div>
        </div>
        {!collapsedSections.header && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
              <span>Entry Date & Weekday</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <input type="date" value={headerDetails.entryDate || ''} onChange={(e) => handleHeaderChange('entryDate', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
              </div>
              <div className="sm:w-32 flex items-center justify-center px-4 py-3 bg-emerald-50 border border-emerald-100/50 rounded-xl text-sm font-black text-emerald-700 shadow-sm shrink-0 whitespace-nowrap uppercase tracking-widest ring-1 ring-emerald-200/50">
                  {(() => {
                    const d = new Date(headerDetails.entryDate);
                    return isNaN(d.getTime()) ? 'Invalid' : d.toLocaleDateString('en-US', { weekday: 'long' });
                  })()}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Entry Number</label>
            <input type="text" value={headerDetails.entryNumber || ''} onChange={(e) => handleHeaderChange('entryNumber', e.target.value)} placeholder="Auto-generated" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">REF / Invoice Number</label>
            <input type="text" value={headerDetails.referenceNo || ''} onChange={(e) => handleHeaderChange('referenceNo', e.target.value)} placeholder="Optional reference..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-700" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Creation Stamp (System)</label>
            <input type="text" value={systemStamp || ''} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed select-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 hover:bg-gray-50 flex items-center p-2 rounded-xl border border-transparent transition-all dark:hover:bg-gray-700">
            <label htmlFor="inventory-file-upload" className="flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-white hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer shadow-sm dark:border-gray-600 dark:text-gray-400">
              <Paperclip size={14} className="mr-2" /> Attach Document
            </label>
            <div className="ml-4 flex items-center">
              {attachedFile ? (
                <div className="flex items-center text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                   <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                   <button onClick={() => setAttachedFile(null)} className="ml-2 text-emerald-400 hover:text-red-500 transition-colors">
                     <Trash2 size={14} />
                   </button>
                </div>
              ) : (
                 <span className="text-xs text-gray-400 font-medium italic">No file attached</span>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};
