import React from 'react';
import { ChevronUp } from 'lucide-react';

interface RemarksSectionProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
}

export const RemarksSection: React.FC<RemarksSectionProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange
}) => {
  return (
    <div className={`mt-6 bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[20] ${collapsedSections.remarks ? 'px-6 py-3 rounded-xl' : 'p-6 rounded-2xl'}`}>
       <div className={`flex justify-between items-center cursor-pointer ${collapsedSections.remarks ? '' : 'mb-3'}`} onClick={() => toggleSection('remarks')}>
         <label className="block text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer mb-0">Remarks / Reason</label>
         <button className="text-gray-400 hover:text-gray-600 transition-colors">
           <ChevronUp size={20} className={`transform transition-transform duration-300 ${collapsedSections.remarks ? 'rotate-180' : ''}`} />
         </button>
       </div>
       {!collapsedSections.remarks && (
         <div className="animate-in fade-in slide-in-from-top-2 duration-300">
           <textarea 
             value={headerDetails.remarks} 
             onChange={(e) => handleHeaderChange('remarks', e.target.value)} 
             placeholder="Reason for stock taxable adjustment or movement..." 
             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[100px] resize-y"
           />
         </div>
       )}
    </div>
  );
};
