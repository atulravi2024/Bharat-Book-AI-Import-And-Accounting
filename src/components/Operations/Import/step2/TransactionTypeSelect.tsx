import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherField, Confidence } from '../../../../app/types';
import { ExpandMoreIcon, AddIcon } from '../../../icons/IconComponents';

interface TransactionTypeSelectProps {
  field: VoucherField;
  narration: string;
  onChange: (newValue: string) => void;
}

export const TransactionTypeSelect: React.FC<TransactionTypeSelectProps> = ({ 
  field, 
  narration, 
  onChange 
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(String(field.value) || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(String(field.value) || '');
  }, [field.value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsEditing(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const [metaOptions, setMetaOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const resp = await fetch('/sample-data/masters/metadata.json');
        if (resp.ok) {
          const data = await resp.json();
          if (data.importCorrectionOptions) setMetaOptions(data.importCorrectionOptions);
        }
      } catch (e) {
        console.error("Failed to load metadata in Step2Correction TransactionTypeSelect", e);
      }
    };
    fetchMeta();
  }, []);

  const defaultOptions = metaOptions.length > 0 
    ? metaOptions 
    : ['Deposit', 'Withdrawal', 'Bank Charges', 'Interest Income', 'UPI', 'NEFT/RTGS', 'ATM Withdrawal', 'Dividend', 'Loan EMI', 'Credit Card Payment'];

  const suggestMappings = () => {
    const upperText = narration.toUpperCase();
    const suggestions: { val: string; reason: string }[] = [];
    if (upperText.includes('CHG') || upperText.includes('FEE') || upperText.includes('COMMISSION')) {
      suggestions.push({ val: 'Bank Charges', reason: 'Keyword "CHG", "FEE"' });
    }
    if (upperText.includes('UPI')) suggestions.push({ val: 'UPI', reason: 'Keyword "UPI"' });
    if (upperText.includes('ATM') || upperText.includes('CASH WDL')) suggestions.push({ val: 'ATM Withdrawal', reason: 'Keyword "ATM"' });
    if (upperText.includes('INT.PD') || upperText.includes('INTEREST')) suggestions.push({ val: 'Interest Income', reason: 'Keyword "INTEREST"' });
    if (upperText.includes('EMI') || upperText.includes('LOAN')) suggestions.push({ val: 'Loan EMI', reason: 'Keyword "EMI"' });
    return suggestions;
  };

  const suggestions = suggestMappings();
  const allSuggestedVals = suggestions.map(s => s.val);
  const remainingOptions = defaultOptions.filter(o => !allSuggestedVals.includes(o));
  const filteredRemaining = remainingOptions.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelect = (val: string) => {
    setSearchTerm(val);
    onChange(val);
    setShowDropdown(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSelect(searchTerm);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setIsEditing(false);
      setSearchTerm(String(field.value));
    }
  };

  const isLowConfidence = field.confidence === Confidence.Low;

  if (!isEditing) {
    return (
      <div 
        className={`w-full px-3 py-2 border ${field.isMismatch ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'} cursor-pointer rounded-md text-sm transition-all flex items-center justify-between group dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-left`}
        onClick={() => {
          setIsEditing(true);
          setShowDropdown(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
      >
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium truncate dark:text-white">{field.value || <span className="text-gray-400 italic">{t("Select...")}</span>}</span>
          {isLowConfidence && suggestions.length > 0 && (
            <span className="text-[10px] text-amber-600 font-bold mt-0.5 max-w-[150px] truncate leading-tight">AI expects: {suggestions[0].val}</span>
          )}
        </div>
        <ExpandMoreIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full text-left">
      <input 
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-blue-400 rounded-md text-sm outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.1)] bg-white dark:bg-gray-800 dark:text-white"
        placeholder="Type or select..."
      />
      {showDropdown && (
        <div className="absolute z-[100] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto w-full custom-scrollbar dark:bg-gray-800 dark:border-gray-700">
          {suggestions.length > 0 && (
            <div className="bg-indigo-50/50 pb-1">
              <div className="px-3 py-1.5 text-[10px] font-black text-indigo-800 uppercase tracking-widest bg-indigo-100/50 border-b border-indigo-100 mb-1 flex items-center">{t("✨ AI Pattern Match")}</div>
              {suggestions.map((s, idx) => (
                <div 
                  key={`sugg-${idx}`}
                  className="px-3 py-2 hover:bg-indigo-100 cursor-pointer flex justify-between items-center transition-colors mx-1 rounded-lg"
                  onMouseDown={() => handleSelect(s.val)}
                >
                  <span className="text-sm font-bold text-indigo-900">{s.val}</span>
                  <span className="text-[10px] text-indigo-600 font-medium bg-white px-2 py-0.5 rounded-full shadow-sm dark:bg-gray-800">{s.reason}</span>
                </div>
              ))}
            </div>
          )}
          {filteredRemaining.length > 0 && (
            <div className="pt-2 pb-2">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("Standard Types")}</div>
              {filteredRemaining.map((opt, idx) => (
                <div 
                  key={`opt-${idx}`}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700 transition-colors mx-1 rounded-lg dark:hover:bg-gray-600 dark:text-gray-200"
                  onMouseDown={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
          <div className="p-2 border-t border-gray-100 bg-gray-50/80 mt-1 sticky bottom-0 dark:border-gray-800">
            <div 
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center justify-center p-1.5 hover:bg-blue-100 rounded-lg transition-colors uppercase tracking-wider"
              onMouseDown={() => handleSelect(searchTerm)}
            >
              <AddIcon className="w-3 h-3 mr-1" /> Use "{searchTerm || 'Value'}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
