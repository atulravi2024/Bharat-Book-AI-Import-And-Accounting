import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';

interface WebBillRequirementsProps {
  onClose: () => void;
}

export const WebBillRequirements: React.FC<WebBillRequirementsProps> = ({ onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg shrink-0">
          <HelpCircle size={18} className="text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-2">{t("Essential Web Bill Requirements")}</h4>
          <ul className="form-grid gap-x-6 gap-y-2">
            {[
              'Unique sequential Invoice Number',
              'Valid GSTIN/Tax Identification',
              'Correct Place of Supply details',
              'Accurate Item/Service HSN codes',
              'System-generated Date & Time Stamp',
              'Digital Signature / Verified Authorized Signatory',
              'Itemized breakdown with applicable Tax rates',
              'Registered Business Address & Contact',
              'Receiver/Customer billing information'
            ].map((req, i) => (
              <li key={i} className="flex items-center text-xs font-bold text-blue-700/70">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 shrink-0" />
                {t(req)}
              </li>
            ))}
          </ul>
        </div>
        <button 
          onClick={onClose}
          className="ml-auto text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
