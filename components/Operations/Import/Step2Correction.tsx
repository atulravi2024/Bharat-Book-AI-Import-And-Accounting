
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ParsedVoucher, VoucherField, Confidence, VoucherType } from '../../../types';
import { ArrowBackIcon, ArrowForwardIcon, InfoIcon, EditIcon, SearchIcon, CheckCircleIcon, ExpandMoreIcon, ExpandLessIcon, AddIcon, WarningIcon, ErrorIcon, CancelIcon, MoreHorizIcon, DeleteIcon, ContentCopyIcon, HistoryIcon } from '../../icons/IconComponents';
import { PARTY_MASTERS, LEDGER_MASTERS } from '../../../constants';
import { parseNumericValue } from '../../../services/aiService';

interface Step2CorrectionProps {
  vouchers: ParsedVoucher[];
  onBack: () => void;
  onNext: (updatedVouchers: ParsedVoucher[]) => void;
  onSaveDraft: (vouchers: ParsedVoucher[]) => void;
  setVouchers: React.Dispatch<React.SetStateAction<ParsedVoucher[]>>;
  partyMasters: any[];
  ledgerMasters: any[];
  uomMasters: any[];
  itemMasters: any[];
  onAddParty: (name: string) => void;
  onAddLedger: (name: string) => void;
  onAddUom: (name: string) => void;
  onAddItem: (name: string) => void;
  voucherType: VoucherType;
  allVouchers?: ParsedVoucher[];
  onNavigateToMasters: () => void;
}

const ConfidencePill: React.FC<{ confidence: Confidence; compact?: boolean }> = ({ confidence, compact }) => {
  const styles = {
    [Confidence.High]: 'bg-green-50 text-green-700 border-green-200',
    [Confidence.Medium]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [Confidence.Low]: 'bg-red-50 text-red-700 border-red-200',
  };
  
  if (compact) {
    const dots = {
      [Confidence.High]: 'bg-green-500',
      [Confidence.Medium]: 'bg-yellow-500',
      [Confidence.Low]: 'bg-red-500',
    };
    return (
      <div className="flex items-center px-1" title={`AI Confidence: ${confidence}`}>
        <div className={`w-2 h-2 rounded-full ${dots[confidence]} shadow-sm`} />
      </div>
    );
  }

  return <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter rounded-full border ${styles[confidence]}`}>{confidence}</span>;
};

const EditableField: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string | number) => void;
  suffix?: string;
  hideConfidence?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'number' | 'textarea';
}> = ({ field, onChange, suffix, hideConfidence, autoFocus, type }) => {
  const [isEditing, setIsEditing] = useState(autoFocus || false);
  const [currentValue, setCurrentValue] = useState(field.value);

  // Sync isEditing if autoFocus prop changes
  useEffect(() => {
    if (autoFocus) setIsEditing(true);
  }, [autoFocus]);

  // Sync currentValue if field.value changes externally (e.g. changing active voucher)
  useEffect(() => {
    setCurrentValue(field.value);
  }, [field.value]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (type === 'textarea') return; // Allow new lines in textarea
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(currentValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(field.value);
    }
  };
  
  const borderColor = field.isMismatch ? 'border-red-500 ring-1 ring-red-100 shadow-[0_0_10px_rgba(239,68,68,0.15)]' : 'border-gray-300';
  const bgMain = field.isMismatch ? 'bg-red-50 hover:bg-red-100/80' : 'hover:bg-gray-100';

  if (isEditing) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center">
          {type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className={`w-full p-1.5 border ${borderColor} rounded-md text-sm outline-none bg-white transition-all min-h-[80px] resize-y`}
            />
          ) : (
            <input
              type={type || (typeof field.value === 'number' ? 'number' : 'text')}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full p-1.5 border ${borderColor} rounded-md text-sm outline-none bg-white transition-all`}
            />
          )}
          {suffix && <span className="ml-1 text-gray-500 text-xs font-semibold">{suffix}</span>}
        </div>
        {field.isMismatch && field.suggestion && (
          <div className="mt-1 flex items-center text-[10px] text-red-600 font-medium leading-tight">
            <WarningIcon className="mr-1 scale-75" />
            {field.suggestion}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative w-full" onClick={() => setIsEditing(true)}>
      <div className={`flex justify-between items-center cursor-pointer p-1.5 rounded-md border border-transparent transition-all ${bgMain} ${field.isMismatch ? 'border-red-200' : 'hover:border-blue-300'}`}>
        <div className="flex items-center space-x-2 overflow-hidden w-full">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm truncate font-medium ${field.isMismatch ? 'text-red-700' : 'text-gray-900'}`}>
            {field.value}{suffix ? ` ${suffix}` : ''}
          </span>
          {!hideConfidence && <ConfidencePill confidence={field.confidence} compact />}
        </div>
        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      {field.suggestion && (
        <div className={`absolute left-0 top-full mt-1 p-2 text-white text-[11px] rounded-lg shadow-xl w-max max-w-[240px] z-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none ${field.isMismatch ? 'bg-red-600' : 'bg-gray-800'}`}>
          <div className="flex items-start">
            {field.isMismatch ? <ErrorIcon className="mr-1.5 mt-0.5 scale-75" /> : <InfoIcon className="mr-1.5 mt-0.5 scale-75" />}
            <span>{field.suggestion}</span>
          </div>
          {field.isMismatch && <div className="absolute top-0 left-4 -mt-1 w-2 h-2 bg-red-600 rotate-45"></div>}
          {!field.isMismatch && <div className="absolute top-0 left-4 -mt-1 w-2 h-2 bg-gray-800 rotate-45"></div>}
        </div>
      )}
    </div>
  );
};

const TransactionTypeSelect: React.FC<{
  field: VoucherField;
  narration: string;
  onChange: (newValue: string) => void;
}> = ({ field, narration, onChange }) => {
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

  const defaultOptions = ['Deposit', 'Withdrawal', 'Bank Charges', 'Interest Income', 'UPI', 'NEFT/RTGS', 'ATM Withdrawal', 'Dividend', 'Loan EMI', 'Credit Card Payment'];

  const suggestMappings = () => {
    const upperText = narration.toUpperCase();
    const suggestions: { val: string, reason: string }[] = [];
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
        className={`w-full px-3 py-2 border ${field.isMismatch ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'} cursor-pointer rounded-md text-sm transition-all flex items-center justify-between group`}
        onClick={() => {
          setIsEditing(true);
          setShowDropdown(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
      >
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium truncate">{field.value || <span className="text-gray-400 italic">Select...</span>}</span>
          {isLowConfidence && suggestions.length > 0 && (
             <span className="text-[10px] text-amber-600 font-bold mt-0.5 max-w-[150px] truncate leading-tight">AI expects: {suggestions[0].val}</span>
          )}
        </div>
        <ExpandMoreIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input 
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 border border-blue-400 rounded-md text-sm outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.1)] bg-white`}
        placeholder="Type or select..."
      />
      {showDropdown && (
        <div className="absolute z-[100] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto w-full custom-scrollbar">
          {suggestions.length > 0 && (
            <div className="bg-indigo-50/50 pb-1">
              <div className="px-3 py-1.5 text-[10px] font-black text-indigo-800 uppercase tracking-widest bg-indigo-100/50 border-b border-indigo-100 mb-1 flex items-center">
                ✨ AI Pattern Match
              </div>
              {suggestions.map((s, idx) => (
                <div 
                  key={`sugg-${idx}`}
                  className="px-3 py-2 hover:bg-indigo-100 cursor-pointer flex justify-between items-center transition-colors mx-1 rounded-lg"
                  onMouseDown={() => handleSelect(s.val)}
                >
                  <span className="text-sm font-bold text-indigo-900">{s.val}</span>
                  <span className="text-[10px] text-indigo-600 font-medium bg-white px-2 py-0.5 rounded-full shadow-sm">{s.reason}</span>
                </div>
              ))}
            </div>
          )}
          {filteredRemaining.length > 0 && (
            <div className="pt-2 pb-2">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Standard Types</div>
              {filteredRemaining.map((opt, idx) => (
                <div 
                  key={`opt-${idx}`}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700 transition-colors mx-1 rounded-lg"
                  onMouseDown={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
          <div className="p-2 border-t border-gray-100 bg-gray-50/80 mt-1 sticky bottom-0">
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

const HighlightedText: React.FC<{ text: string, highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-blue-100 text-blue-900 font-bold px-0.5 rounded-sm">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const MasterSelectField: React.FC<{ 
  field: VoucherField; 
  masters: any[]; 
  onChange: (newValue: string, masterData?: any) => void;
  onCreate?: (name: string) => void;
  label: string;
  narration?: string;
}> = ({ field, masters, onChange, onCreate, label, narration }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pendingCreateName, setPendingCreateName] = useState<string | null>(null);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getMasterName = (m: any) => typeof m === 'string' ? m : m.name;

  const filteredMasters = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    const narrationUpper = (narration || '').toUpperCase();
    
    if (!s) {
      // Prioritize the currently linked one in the initial view if no search
      const current = masters.find(m => getMasterName(m) === field.value);
      
      // If narration exists, boost masters that have keywords present in narration
      let scoredMasters = masters.map(m => {
        const name = getMasterName(m);
        let score = 0;
        if (current === m) score += 100;
        else if (narrationUpper && name) {
           const words = name.toUpperCase().split(' ');
           let matchCount = 0;
           for (const w of words) {
             if (w.length > 3 && narrationUpper.includes(w)) matchCount++;
           }
           if (matchCount > 0) score += (matchCount * 20);
        }
        return { master: m, score };
      });
      
      scoredMasters = scoredMasters.filter(x => x.score > 0).sort((a, b) => b.score - a.score);
      
      let list = scoredMasters.map(x => x.master);
      
      if (list.length === 0 && current) {
          list = [current];
      }
      
      const combined = Array.from(new Set([...list, ...masters])).slice(0, 8);
      return combined;
    }
    
    const sWords = s.split(/\s+/).filter(w => w.length > 0);

    const scored = masters.map(m => {
        const name = getMasterName(m);
        const nameLower = name.toLowerCase();
        let score = 0;
        
        if (nameLower === s) {
            score = 100;
        } else if (nameLower.startsWith(s)) {
            score = 80 + (s.length / Math.max(nameLower.length, 1)) * 10;
        } else if (nameLower.includes(s)) {
            score = 60 + (s.length / Math.max(nameLower.length, 1)) * 10;
        } else {
            const allWordsMatch = sWords.every(w => nameLower.includes(w));
            if (allWordsMatch) {
                score = 50;
            } else {
                // simple sequential fuzzy search
                let sIdx = 0;
                for (let i = 0; i < nameLower.length; i++) {
                    if (nameLower[i] === s[sIdx]) {
                        sIdx++;
                        if (sIdx === s.length) break;
                    }
                }
                if (sIdx === s.length) {
                    score = 30 + (s.length / Math.max(nameLower.length, 1)) * 10;
                }
            }
        }
        
        // Bonus for already selected/linked
        if (name === field.value) {
            score += 20; 
        }

        // Slight bonus if it was the original suggested value with high confidence
        if (field.value === name && field.confidence === '98%') {
            score += 10;
        }

        return { master: m, score };
    }).filter(item => item.score > 0);

    // Sort by score desc, then alphabetically
    return scored
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return getMasterName(a.master).localeCompare(getMasterName(b.master));
      })
      .map(item => item.master)
      .slice(0, 15); // Show more matches contextually
  }, [masters, searchTerm, field.value, field.confidence]);

  const isExactMatch = masters.some(m => getMasterName(m).toLowerCase() === searchTerm.toLowerCase().trim());
  
  const ghostSuggestion = useMemo(() => {
    if (!searchTerm.trim()) return '';
    const firstMatch = filteredMasters[0];
    if (firstMatch) {
      const name = getMasterName(firstMatch);
      if (name.toLowerCase().startsWith(searchTerm.toLowerCase().trim())) {
        return searchTerm + name.substring(searchTerm.length);
      }
    }
    return '';
  }, [searchTerm, filteredMasters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsEditing(false);
        setPendingCreateName(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (master: any) => {
    const value = getMasterName(master);
    const exists = masters.some(m => getMasterName(m).toLowerCase() === value.toLowerCase());
    
    if (!exists && onCreate) {
        setPendingCreateName(value);
        setShowDropdown(false);
        return;
    }
    
    confirmSelection(value, typeof master === 'object' ? master : undefined);
  };

  const confirmSelection = (value: string, masterData?: any) => {
    onChange(value, masterData);
    setSearchTerm('');
    setShowDropdown(false);
    setIsEditing(false);
    setPendingCreateName(null);
  };

  const handleCreateConfirm = () => {
    if (pendingCreateName && onCreate) {
      onCreate(pendingCreateName);
      confirmSelection(pendingCreateName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (pendingCreateName) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateConfirm();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setPendingCreateName(null);
            setShowDropdown(true);
        }
        return;
    }

    switch(e.key) {
      case 'Tab':
        if (ghostSuggestion && !isExactMatch) {
            e.preventDefault();
            setSearchTerm(getMasterName(filteredMasters[0]));
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setShowDropdown(true);
        setActiveIndex(prev => (prev < filteredMasters.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > -1 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredMasters.length) {
          handleSelect(filteredMasters[activeIndex]);
        } else if (activeIndex === -1 && filteredMasters.length > 0 && searchTerm.trim()) {
           // Default to first match if user just hits enter without arrow nav
           handleSelect(filteredMasters[0]);
        } else if (activeIndex === -1 && !isExactMatch && searchTerm.trim()) {
           handleSelect(searchTerm.trim());
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setIsEditing(false);
        break;
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <div className="flex items-center border border-blue-500 rounded-md bg-white shadow-md overflow-hidden relative">
          <SearchIcon className="ml-2 text-blue-400 shrink-0 z-10" />
          
          <div className="flex-1 relative h-9">
             {/* Ghost text for autocomplete suggestion */}
            {ghostSuggestion && (
              <div className="absolute inset-0 px-2 py-2 text-sm text-gray-300 pointer-events-none whitespace-pre">
                {ghostSuggestion}
              </div>
            )}
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="absolute inset-0 w-full px-2 py-2 outline-none text-sm bg-transparent placeholder-gray-400 z-10"
              placeholder={`Search or type ${label}...`}
            />
          </div>

          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setActiveIndex(-1); }}
              className="px-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <CancelIcon className="scale-75" />
            </button>
          )}
        </div>
        
        {showDropdown && !pendingCreateName && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-2xl max-h-64 overflow-y-auto z-50 scrollbar-thin">
            <div ref={listRef}>
              {filteredMasters.length > 0 ? (
                filteredMasters.map((m, idx) => {
                  const name = getMasterName(m);
                  const isActive = idx === activeIndex;
                  const isCurrent = field.value === name;
                  return (
                    <div 
                      key={name} 
                      onClick={() => handleSelect(m)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`p-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors border-l-2 ${
                        isActive ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50 border-transparent text-gray-700'
                      } ${isCurrent ? 'font-bold' : ''}`}
                    >
                      <HighlightedText text={name} highlight={searchTerm} />
                      {isCurrent && <CheckCircleIcon className="text-blue-500 text-sm" />}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-gray-400 text-xs text-center border-b italic">
                   No master records found matching "{searchTerm}"
                </div>
              )}
            </div>
            
            {!isExactMatch && searchTerm.trim() && (
              <div 
                onClick={() => handleSelect(searchTerm.trim())}
                onMouseEnter={() => setActiveIndex(-1)}
                className={`p-3 border-t bg-gray-50 hover:bg-green-50 cursor-pointer text-sm font-semibold text-green-700 flex items-center transition-all ${activeIndex === -1 && searchTerm.trim() ? 'bg-green-50 ring-1 ring-inset ring-green-200' : ''}`}
              >
                <AddIcon className="mr-2 text-sm" />
                Create and link "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {pendingCreateName && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-blue-200 rounded-md shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 shrink-0">
                <AddIcon className="text-lg" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confirm Creation</h4>
                <p className="text-sm text-gray-800 font-bold leading-tight">Create "{pendingCreateName}" in {label} Masters?</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => { setPendingCreateName(null); setShowDropdown(true); }}
                className="flex-1 py-2 px-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={handleCreateConfirm}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
              >
                Create & Link
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isMasterLinked = masters.some(m => getMasterName(m) === String(field.value));
  
  const borderColor = field.isMismatch ? 'border-red-500 ring-1 ring-red-100 shadow-[0_0_10px_rgba(239,68,68,0.15)]' : 'border-transparent';
  const bgMain = field.isMismatch ? 'bg-red-50 hover:bg-red-100' : isMasterLinked ? 'bg-white hover:bg-gray-100' : 'bg-orange-50 hover:bg-orange-100 border-orange-200';

  return (
    <div className="group relative" onClick={() => {
      setIsEditing(true);
      setSearchTerm(String(field.value));
    }}>
      <div className={`flex justify-between items-center cursor-pointer p-1.5 rounded-md border transition-all ${borderColor} ${bgMain}`}>
        <div className="flex items-center space-x-2 overflow-hidden">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm font-medium truncate ${field.isMismatch ? 'text-red-700' : 'text-gray-900'}`}>{field.value}</span>
          {isMasterLinked && !field.isMismatch && (
             <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase shrink-0 flex items-center">
                <CheckCircleIcon className="mr-1 scale-75" />
                Linked
             </span>
          )}
          {!isMasterLinked && !field.isMismatch && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase shrink-0">Not in Masters</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          {field.isMismatch && !isMasterLinked && onCreate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPendingCreateName(String(field.value));
              }}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded shadow-sm transition-all flex items-center shrink-0 animate-in fade-in zoom-in duration-200"
            >
              <AddIcon className="mr-1 text-[12px]" />
              Create new {label}
            </button>
          )}
          <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </div>
      {field.suggestion && (
        <div className={`absolute left-0 top-full mt-1 p-2 text-white text-[11px] rounded-lg shadow-xl w-max max-w-[240px] z-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none ${field.isMismatch ? 'bg-red-600' : 'bg-gray-800'}`}>
          <div className="flex items-start">
            {field.isMismatch ? <ErrorIcon className="mr-1.5 mt-0.5 scale-75" /> : <InfoIcon className="mr-1.5 mt-0.5 scale-75" />}
            <span>{field.suggestion}</span>
          </div>
          <div className={`absolute top-0 left-4 -mt-1 w-2 h-2 rotate-45 ${field.isMismatch ? 'bg-red-600' : 'bg-gray-800'}`}></div>
        </div>
      )}
    </div>
  );
};

const TaxRateCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: number) => void;
}> = ({ field, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(field.value));
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const COMMON_RATES = [0, 5, 12, 18, 28];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleCommit(currentValue);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentValue]);

  const validate = (val: string) => {
    const num = Number(val);
    if (isNaN(num)) return "Must be a number";
    if (num < 0 || num > 100) return "Must be between 0 and 100";
    return null;
  };

  const handleCommit = (val: string) => {
    const err = validate(val);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setIsEditing(false);
    setShowDropdown(false);
    onChange(Number(val));
    setCurrentValue(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit(currentValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setShowDropdown(false);
      setCurrentValue(String(field.value));
      setError(null);
    }
  };

  const filteredRates = COMMON_RATES.filter(r => String(r).includes(currentValue));

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <div className="flex flex-col relative bg-white">
           <div className="flex items-center">
            <input
              type="number"
              min="0" max="100"
              value={currentValue}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                setShowDropdown(true);
                if (error) setError(null);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full p-1 border ${error ? 'border-red-500' : 'border-blue-500 rounded-md'} text-sm pr-6 focus:outline-none`}
            />
            <span className="absolute right-2 text-gray-500 text-xs pointer-events-none">%</span>
          </div>
          {error && <span className="absolute top-10 w-40 mt-1 text-[10px] text-red-500 bg-red-50 border border-red-200 px-1 py-0.5 rounded shadow-sm z-50">{error}</span>}
        </div>
        
        {showDropdown && !error && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredRates.length > 0 ? (
              filteredRates.map(rate => (
                <div 
                  key={rate} 
                  onMouseDown={(e) => {
                    // Prevent blur from firing before onClick by intercepting mousedown
                    e.preventDefault(); 
                    setCurrentValue(String(rate));
                    handleCommit(String(rate));
                  }}
                  className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
                >
                  <span>{rate}%</span>
                  {Number(currentValue) === rate && <CheckCircleIcon className="text-blue-500 text-sm" />}
                </div>
              ))
            ) : (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCommit(currentValue)}
                className="p-2 hover:bg-blue-50 cursor-pointer text-blue-600 text-xs italic text-center font-bold"
              >
                Use {currentValue}%
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const borderColor = field.isMismatch ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="group relative" onClick={() => { setIsEditing(true); setCurrentValue(String(field.value)); }}>
      <div className={`flex justify-between items-center cursor-pointer p-1 rounded-md hover:bg-gray-100 border border-transparent hover:${borderColor}`}>
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="text-sm truncate">
            {field.value}%
          </span>
          <ConfidencePill confidence={field.confidence} compact />
        </div>
        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      {field.suggestion && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded-md w-max z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <InfoIcon className="inline mr-1 text-sm"/> {field.suggestion}
        </div>
      )}
    </div>
  );
};


const TaxTypeCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string) => void;
}> = ({ field, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(field.value));
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const COMMON_TYPES = ['CGST/SGST', 'IGST'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleCommit(currentValue);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentValue]);

  const handleCommit = (val: string) => {
    setIsEditing(false);
    setShowDropdown(false);
    onChange(val);
    setCurrentValue(val);
  };

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <div className="flex flex-col relative bg-white">
           <div className="flex items-center">
            <input
              type="text"
              value={currentValue}
              readOnly
              onClick={() => setShowDropdown(true)}
              onFocus={() => setShowDropdown(true)}
              className={`w-full p-1 border border-blue-500 rounded-md text-sm cursor-pointer focus:outline-none`}
            />
            <ExpandMoreIcon className="absolute right-1 text-gray-500 text-sm pointer-events-none" />
          </div>
        </div>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {COMMON_TYPES.map(type => (
              <div 
                key={type} 
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  setCurrentValue(type);
                  handleCommit(type);
                }}
                className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
              >
                <span>{type}</span>
                {currentValue === type && <CheckCircleIcon className="text-blue-500 text-sm" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const borderColor = field.isMismatch ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="group relative" onClick={() => { setIsEditing(true); setCurrentValue(String(field.value)); }}>
      <div className={`flex justify-between items-center cursor-pointer p-1 rounded-md hover:bg-gray-100 border border-transparent hover:${borderColor}`}>
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="text-sm font-medium text-gray-700 truncate">
            {field.value}
          </span>
          <ConfidencePill confidence={field.confidence} compact />
        </div>
        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      {field.suggestion && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded-md w-max z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <InfoIcon className="inline mr-1 text-sm"/> {field.suggestion}
        </div>
      )}
    </div>
  );
};

const UomCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string) => void;
  onAdd?: (name: string) => void;
  uomMasters?: any[];
}> = ({ field, onChange, onAdd, uomMasters = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(field.value));
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const mastersList = (uomMasters || []).map(m => m.symbol);
  const COMMON_UNITS = Array.from(new Set([...mastersList, 'Nos', 'Kgs', 'Pcs', 'Boxes', 'Mtrs', 'Sets', 'Ltr', 'Dzn', 'Bag', 'Roll']));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleCommit(currentValue);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentValue]);

  const handleCommit = (val: string) => {
    setIsEditing(false);
    setShowDropdown(false);
    if (val !== String(field.value)) {
        onChange(val);
        if (onAdd && !COMMON_UNITS.includes(val)) {
            onAdd(val);
        }
    }
    setCurrentValue(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit(currentValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setShowDropdown(false);
      setCurrentValue(String(field.value));
    }
  };

  const filteredUnits = COMMON_UNITS.filter(u => u.toLowerCase().includes(currentValue.toLowerCase()));

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <div className="flex flex-col relative bg-white">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full p-1 border ${field.isMismatch ? 'border-red-500' : 'border-blue-500'} rounded-md text-sm focus:outline-none`}
              placeholder="Unit..."
            />
        </div>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[80px] bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
            {filteredUnits.length > 0 ? (
              filteredUnits.map(unit => (
                <div 
                  key={unit} 
                  onMouseDown={(e) => {
                    e.preventDefault(); 
                    handleCommit(unit);
                  }}
                  className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
                >
                  <span>{unit}</span>
                  {currentValue === unit && <CheckCircleIcon className="text-blue-500 text-sm" />}
                </div>
              ))
            ) : (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCommit(currentValue)}
                className="p-2 hover:bg-blue-50 cursor-pointer text-blue-600 text-[10px] italic text-center font-bold"
              >
                Use "{currentValue}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative" onClick={() => { setIsEditing(true); setCurrentValue(String(field.value)); }}>
      <div className={`flex justify-between items-center cursor-pointer p-1 rounded-md border transition-all ${field.isMismatch ? 'bg-red-50 border-red-500' : 'border-transparent hover:bg-gray-100'}`}>
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm font-medium truncate ${field.isMismatch ? 'text-red-700' : 'text-gray-700'}`}>
            {field.value || <span className="text-gray-300 italic">Nil</span>}
          </span>
        </div>
        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      {field.suggestion && (
        <div className={`absolute left-0 top-full mt-1 p-2 text-white text-[11px] rounded-lg shadow-xl w-max max-w-[240px] z-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none ${field.isMismatch ? 'bg-red-600' : 'bg-gray-800'}`}>
          <div className="flex items-start">
            {field.isMismatch ? <ErrorIcon className="mr-1.5 mt-0.5 scale-75" /> : <InfoIcon className="mr-1.5 mt-0.5 scale-75" />}
            <span>{field.suggestion}</span>
          </div>
        </div>
      )}
    </div>
  );
};


const ItemNameCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string) => void;
  suggestions: string[];
  autoFocus?: boolean;
}> = ({ field, onChange, suggestions, autoFocus }) => {
  const [isEditing, setIsEditing] = useState(autoFocus || false);
  const [currentValue, setCurrentValue] = useState(String(field.value));
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) setIsEditing(true);
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleCommit(currentValue);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentValue]);

  const handleCommit = (val: string) => {
    setIsEditing(false);
    setShowDropdown(false);
    onChange(val);
    setCurrentValue(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit(currentValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setShowDropdown(false);
      setCurrentValue(String(field.value));
    }
  };

  const filteredSuggestions = Array.from(new Set(suggestions))
    .filter((s): s is string => typeof s === 'string' && s.toLowerCase().includes(currentValue.toLowerCase()) && s.toLowerCase() !== currentValue.toLowerCase())
    .slice(0, 5);

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30 w-full">
        <div className="flex flex-col relative w-full">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full p-1.5 border ${field.isMismatch ? 'border-red-500' : 'border-blue-500'} rounded-md text-sm focus:outline-none bg-white`}
              placeholder="Item name..."
            />
        </div>
        
        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
            {filteredSuggestions.map(s => (
              <div 
                key={s} 
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  handleCommit(s);
                }}
                className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
              >
                <span className="truncate">{s}</span>
              </div>
            ))}
          </div>
        )}
        {field.isMismatch && field.suggestion && (
          <div className="mt-1 flex items-center text-[10px] text-red-600 font-medium leading-tight">
            <WarningIcon className="mr-1 scale-75" />
            {field.suggestion}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative w-full" onClick={() => { setIsEditing(true); setCurrentValue(String(field.value)); }}>
      <div className={`flex justify-between items-center cursor-pointer p-1.5 rounded-md border transition-all ${field.isMismatch ? 'bg-red-50 border-red-500' : 'border-transparent hover:bg-gray-100'}`}>
        <div className="flex items-center space-x-2 overflow-hidden flex-1">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm font-medium truncate ${field.isMismatch ? 'text-red-700' : 'text-gray-900'}`}>
            {field.value || <span className="text-gray-300 italic">No name</span>}
          </span>
        </div>
        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      {field.suggestion && (
        <div className={`absolute left-0 top-full mt-1 p-2 text-white text-[11px] rounded-lg shadow-xl w-max max-w-[240px] z-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none ${field.isMismatch ? 'bg-red-600' : 'bg-gray-800'}`}>
          <div className="flex items-start">
            {field.isMismatch ? <ErrorIcon className="mr-1.5 mt-0.5 scale-75" /> : <InfoIcon className="mr-1.5 mt-0.5 scale-75" />}
            <span>{field.suggestion}</span>
          </div>
        </div>
      )}
    </div>
  );
};


const allowedFieldsSchema: Record<string, string[]> = {
    [VoucherType.Purchase]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
    [VoucherType.Sales]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
    [VoucherType.DebitNote]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
    [VoucherType.CreditNote]: ['invoiceNumber', 'date', 'time', 'amount', 'tax', 'supplyType', 'placeOfSupply'],
    [VoucherType.Payment]: ['date', 'time', 'amount', 'referenceNo', 'bankDetails', 'narration'],
    [VoucherType.Receipt]: ['date', 'time', 'amount', 'referenceNo', 'bankDetails', 'narration'],
    [VoucherType.Journal]: ['date', 'time', 'debitLedger', 'creditLedger', 'amount', 'narration'],
    [VoucherType.Contra]: ['date', 'time', 'fromAccount', 'toAccount', 'amount', 'referenceNo', 'narration'],
    [VoucherType.BankStatement]: ['date', 'time', 'narration', 'referenceNo', 'amount', 'withdrawalAmount', 'depositAmount', 'closingBalance']
};

export const Step2Correction: React.FC<Step2CorrectionProps> = ({ 
    vouchers, onBack, onNext, onSaveDraft, setVouchers,
    partyMasters, ledgerMasters, uomMasters, itemMasters,
    onAddParty, onAddLedger, onAddUom, onAddItem,
    voucherType, allVouchers = [], onNavigateToMasters
}) => {
  const [activeVoucherIndex, setActiveVoucherIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'unmap' | 'missing' | 'automate'>('automate');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [expandedRateGroups, setExpandedRateGroups] = useState<Record<number, boolean>>({});
  const [newlyAddedItemIndex, setNewlyAddedItemIndex] = useState<number | null>(null);
  const [isTaxAnalysisExpanded, setIsTaxAnalysisExpanded] = useState(true);
  const [activeRowMenuIndex, setActiveRowMenuIndex] = useState<number | null>(null);

  // Categorize vouchers based on the new logic
  const categorizedVouchers = useMemo(() => {
    const unmap: ParsedVoucher[] = [];
    const missing: ParsedVoucher[] = [];
    const automate: ParsedVoucher[] = [];

    vouchers.forEach(v => {
      const fields = [v.partyName, v.ledger, v.toAccount, v.fromAccount];
      const hasValue = fields.some(f => f?.value && String(f.value).trim().length > 0);
      const hasMismatch = fields.some(f => f?.value && f.isMismatch);
      
      const isAutomated = hasValue && !hasMismatch;
      const isMissing = hasValue && hasMismatch;

      if (isAutomated) {
        automate.push(v);
      } else if (isMissing) {
        missing.push(v);
      } else {
        unmap.push(v);
      }
    });

    return { unmap, missing, automate };
  }, [vouchers]);

  // Current filtered list based on tab
  const tabVouchers = categorizedVouchers[activeTab];
  
  // Ensure we don't have an out-of-bounds index when switching tabs
  useEffect(() => {
    if (activeVoucherIndex >= tabVouchers.length) {
        setActiveVoucherIndex(0);
    }
  }, [activeTab, tabVouchers.length]);

  const activeVoucher = tabVouchers[activeVoucherIndex];

  const allItemNames = useMemo(() => {
    const currentVoucherItems = vouchers.flatMap(v => (v.items || []).map(i => i.name?.value ? String(i.name.value) : ''));
    const historicalItems = allVouchers.flatMap(v => (v.items || []).map(i => i.name?.value ? String(i.name.value) : ''));
    const masterItems = (itemMasters || []).map(m => m.name);
    return Array.from(new Set([...currentVoucherItems, ...historicalItems, ...masterItems])).filter(Boolean);
  }, [vouchers, allVouchers, itemMasters]);

  useEffect(() => {
    // Initial validation for essential fields and master linking across all vouchers
    const validatedVouchers = (vouchers || []).map(v => {
      let updatedV = { ...v };

      // Auto-sync bank amounts on load to prevent validation errors
      if (v.origin === 'bank') {
        const w = Number(v.withdrawalAmount?.value || 0);
        const d = Number(v.depositAmount?.value || 0);
        const currentAmt = Number(v.amount?.value || 0);
        if (currentAmt === 0 && (w > 0 || d > 0)) {
            updatedV.amount = { 
                value: w || d, 
                confidence: Confidence.High, 
                isMismatch: false, 
                suggestion: 'Auto-populated from Bank amounts' 
            };
        }
      }

      const essentialFields = (() => {
        switch(v.type) {
                    case VoucherType.Purchase:
                    case VoucherType.Sales: return ['date', 'amount', 'ledger', 'invoiceNumber', 'partyName'];
                    case VoucherType.Payment:
                    case VoucherType.Receipt: return ['date', 'amount'];
                    case VoucherType.Journal: return ['date', 'amount', 'debitLedger', 'creditLedger'];
            case VoucherType.Contra: return ['date', 'amount', 'fromAccount', 'toAccount'];
            case VoucherType.BankStatement: return ['date', 'narration', 'amount', 'partyName'];
            default: return ['date', 'amount'];
        }
      })();
      essentialFields.forEach(key => {
        const fieldData = updatedV[key as keyof ParsedVoucher] as VoucherField;
        if (!fieldData) return;
        const field = { ...fieldData };
        const isEmpty = !String(field.value || '').trim() || (key === 'amount' && Number(field.value) <= 0);
        
        if (isEmpty) {
          field.isMismatch = true;
          field.suggestion = `${key.replace(/([A-Z])/g, ' $1')} is required for ${v.type} posting. Please provide a valid value.`;
        } else if (key === 'partyName') {
          const s = String(field.value).toLowerCase();
          const party = partyMasters.find(m => m.name.toLowerCase() === s);
          if (!party) {
            field.isMismatch = true;
            // Enhanced suggestion: Check for fuzzy matches
            const fuzzyMatch = partyMasters.find(m => {
                const name = m.name.toLowerCase();
                return name.includes(s) || s.includes(name);
            });
            field.suggestion = fuzzyMatch 
                ? `"${field.value}" not found. Did you mean "${fuzzyMatch.name}"? If not, use the 'Create new' button to add it.`
                : `"${field.value}" is not in your masters. Use the 'Create new' button to link it for future vouchers.`;
          }
        } else if (['ledger', 'debitLedger', 'creditLedger', 'fromAccount', 'toAccount'].includes(key)) {
          const s = String(field.value).toLowerCase();
          const ledger = ledgerMasters.find(m => m.name?.toLowerCase() === s);
          if (!ledger) {
            field.isMismatch = true;
            const fuzzyMatch = ledgerMasters.find(m => {
                const name = m.name?.toLowerCase() || '';
                return name.includes(s) || s.includes(name);
            });
            field.suggestion = fuzzyMatch
                ? `Ledger mismatch. Suggested: "${fuzzyMatch.name}". Alternatively, use 'Create new' to add ${field.value}.`
                : `Ledger "${field.value}" is untracked. Click 'Create new' to add it to your chart of accounts.`;
          }
        } else {
            // Provide explicit clears for when changes cascade into validity
            field.isMismatch = false;
            field.suggestion = undefined;
        }
        
        (updatedV[key as keyof ParsedVoucher] as any) = field;
      });

      // Item Validation in initial load
      if (updatedV.items) {
        updatedV.items = (updatedV.items || []).map(item => {
          const validatedItem = { ...item };
          
          // Name validation
          if (!validatedItem.name || !String(validatedItem.name.value).trim()) {
             validatedItem.name = { ...(validatedItem.name || { value: '', confidence: Confidence.High }), isMismatch: true, suggestion: 'Item name is required' };
          }
          
          // Rate validation
          if (!validatedItem.rate || Number(validatedItem.rate.value) <= 0) {
             validatedItem.rate = { ...(validatedItem.rate || { value: 0, confidence: Confidence.High }), isMismatch: true, suggestion: 'Rate must be a positive number' };
          } else {
             validatedItem.rate = { ...validatedItem.rate, isMismatch: false, suggestion: undefined };
          }
          
          // Quantity validation
          if (!validatedItem.quantity || Number(validatedItem.quantity.value) <= 0) {
             validatedItem.quantity = { ...(validatedItem.quantity || { value: 0, confidence: Confidence.High }), isMismatch: true, suggestion: 'Quantity must be a positive number' };
          } else {
             validatedItem.quantity = { ...validatedItem.quantity, isMismatch: false, suggestion: undefined };
          }
          
          // UOM validation
          const isContra = voucherType === VoucherType.Contra;
          const hasNoUom = !validatedItem.uom || !String(validatedItem.uom.value).trim();
          if (!isContra && hasNoUom) {
             validatedItem.uom = { ...(validatedItem.uom || { value: '', confidence: Confidence.High }), isMismatch: true, suggestion: 'Unit of measurement (UOM) is required' };
          } else if (!hasNoUom) {
             validatedItem.uom = { ...validatedItem.uom, isMismatch: false, suggestion: undefined };
          }
          
          return validatedItem;
        });
      }

      return updatedV;
    });
    
    // Check if initial validation changed any isMismatch states or suggestions
    const hasInitialErrors = validatedVouchers.some((v, idx) => {
        const original = vouchers[idx];
        
        // Check voucher fields
        const voucherFieldsChanged = Object.keys(v).some(key => {
            if (key === 'items' || key === 'id' || key === 'type') return false;
            const vField = v[key as keyof ParsedVoucher] as VoucherField;
            const oField = original[key as keyof ParsedVoucher] as VoucherField;
            
            if (!vField || !oField) return vField !== oField;
            return vField.isMismatch !== oField.isMismatch || vField.suggestion !== oField.suggestion;
        });

        if (voucherFieldsChanged) return true;

        // Check items
        if ((v.items?.length || 0) !== (original.items?.length || 0)) return true;
        return (v.items || []).some((item, iIndex) => {
          const oItem = (original.items || [])[iIndex];
          if (!oItem) return true;
          return ['name', 'rate', 'quantity', 'uom'].some(fieldName => {
            const vF = (item as any)[fieldName] as VoucherField;
            const oF = (oItem as any)[fieldName] as VoucherField;
            if (!vF || !oF) return vF !== oF;
            return vF.isMismatch !== oF.isMismatch || vF.suggestion !== oF.suggestion;
          });
        });
    });

    if (hasInitialErrors) {
        setVouchers(validatedVouchers);
    }
  }, [partyMasters, ledgerMasters]); // Added dependencies to re-validate when masters change

  const handleAddItem = () => {
    if (!activeVoucher) return;
    
    const ledgerValue = String(activeVoucher.ledger?.value || '');
    const gstinValue = String(activeVoucher.gstin?.value || '');
    const isInterFromGstin = gstinValue.length >= 2 && gstinValue.substring(0, 2) !== '27';
    // Use supplyType if set, otherwise fallback to logic
    const isInterState = activeVoucher.supplyType?.value === 'Inter-State' || 
                        ledgerValue.includes('IGST') || ledgerValue.includes('Inter') || isInterFromGstin;
    const defaultTaxType = isInterState ? 'IGST' : 'CGST/SGST';

    const newItem = {
      name: { value: '', confidence: Confidence.High },
      quantity: { value: 1, confidence: Confidence.High },
      rate: { value: 0, confidence: Confidence.High },
      uom: { value: 'Nos', confidence: Confidence.High },
      taxRate: { value: 18, confidence: Confidence.High },
      taxType: { value: defaultTaxType, confidence: Confidence.High },
      tax: { value: 0, confidence: Confidence.High },
      total: { value: 0, confidence: Confidence.High }
    };

    const newVouchers = vouchers.map(v => {
      if (v.id === activeVoucher.id) {
        const updatedItems = [...v.items, newItem];
        return { ...v, items: updatedItems };
      }
      return v;
    });

    setVouchers(newVouchers);
    setNewlyAddedItemIndex(newVouchers[activeVoucherIndex].items.length - 1);
  };

  const handleDuplicateItem = (itemIndex: number) => {
    if (!activeVoucher) return;
    const itemToDuplicate = activeVoucher.items[itemIndex];
    const newItem = JSON.parse(JSON.stringify(itemToDuplicate));
    
    const newVouchers = vouchers.map(v => {
      if (v.id === activeVoucher.id) {
        const updatedItems = [...v.items];
        updatedItems.splice(itemIndex + 1, 0, newItem);
        
        // Recalculate Voucher-level totals
        const voucherTax = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.tax.value), 0));
        const voucherTotal = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.total.value), 0));
        
        return { 
          ...v, 
          items: updatedItems,
          tax: { ...v.tax, value: voucherTax, confidence: Confidence.High },
          amount: { ...v.amount, value: voucherTotal, confidence: Confidence.High }
        };
      }
      return v;
    });

    setVouchers(newVouchers);
    setActiveRowMenuIndex(null);
  };

  const handleDeleteItem = (itemIndex: number) => {
    if (!activeVoucher || activeVoucher.items.length <= 1) return;
    
    const newVouchers = vouchers.map(v => {
      if (v.id === activeVoucher.id) {
        const updatedItems = [...v.items];
        updatedItems.splice(itemIndex, 1);
        
        // Recalculate Voucher-level totals
        const voucherTax = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.tax.value), 0));
        const voucherTotal = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.total.value), 0));
        
        return { 
          ...v, 
          items: updatedItems,
          tax: { ...v.tax, value: voucherTax, confidence: Confidence.High },
          amount: { ...v.amount, value: voucherTotal, confidence: Confidence.High }
        };
      }
      return v;
    });

    setVouchers(newVouchers);
    setActiveRowMenuIndex(null);
  };

  const toggleRateGroup = (rate: number) => {
    setExpandedRateGroups(prev => ({
      ...prev,
      [rate]: !prev[rate]
    }));
  };

  const safeNum = (val: any) => {
    const num = Number(val);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  const safeRound = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  const handleFieldChange = (voucherId: string, fieldName: string, newValue: string | number, itemIndex?: number, masterData?: any) => {
    const newVouchers = vouchers.map(v => {
      if (v.id === voucherId) {
        let updatedVoucher = { ...v };
        
        if(itemIndex !== undefined && v.items[itemIndex]) {
            const updatedItems = [...v.items];
            const item = { ...updatedItems[itemIndex] };
            
            // Fix deep mutation and ensure field object is recreated
            const fieldKey = fieldName as keyof typeof item;
            if (item[fieldKey] && typeof item[fieldKey] === 'object') {
              (item as any)[fieldKey] = { ...(item[fieldKey] as object), value: newValue };
            } else {
              (item as any)[fieldKey] = { value: newValue, confidence: Confidence.High };
            }
            
            // Item-level Validations
            if (fieldName === 'rate' || fieldName === 'quantity') {
                const val = safeNum(newValue);
                const fieldKey = fieldName as 'rate' | 'quantity';
                if (val <= 0) {
                    item[fieldKey] = { ...item[fieldKey], isMismatch: true, suggestion: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a positive number` };
                } else {
                    item[fieldKey] = { ...item[fieldKey], isMismatch: false, suggestion: undefined };
                }
            }

            if (fieldName === 'name') {
                if (!String(newValue).trim()) {
                    item.name = { ...item.name, isMismatch: true, suggestion: 'Item name is required' };
                } else {
                    item.name = { ...item.name, isMismatch: false, suggestion: undefined };
                }
            }

            if (fieldName === 'uom') {
                const isContra = voucherType === VoucherType.Contra;
                const isEmpty = !String(newValue).trim();
                if (isEmpty && !isContra) {
                   item.uom = { ...(item.uom || { value: '', confidence: Confidence.High }), isMismatch: true, suggestion: 'Unit of measurement (UOM) is required' };
                } else {
                   item.uom = { ...(item.uom || { value: '', confidence: Confidence.High }), value: newValue, isMismatch: false, suggestion: undefined };
                }
            }

            // Recalculate item totals if quantity, rate, taxRate, or tax change
            if (['quantity', 'rate', 'taxRate', 'tax'].includes(fieldName)) {
                const qty = safeNum(item.quantity.value);
                const rate = safeNum(item.rate.value);
                const taxRateVal = safeNum(item.taxRate.value);
                
                const net = safeRound(qty * rate);
                let tax = safeNum(item.tax.value);

                if (fieldName !== 'tax') {
                    // If taxRate, qty or rate changed, recalculate tax
                    tax = safeRound((net * taxRateVal) / 100);
                    item.tax = { ...item.tax, value: tax, confidence: Confidence.High, isMismatch: false };
                } else {
                    // If tax was manually edited, maybe update taxRate to keep it consistent?
                    // For now, just accept the manual tax and update total
                    item.tax = { ...item.tax, value: tax, confidence: Confidence.High, isMismatch: false };
                }

                if (fieldName === 'taxRate') {
                    if (taxRateVal <= 0) {
                        item.taxRate = { 
                          ...item.taxRate, 
                          isMismatch: true, 
                          suggestion: taxRateVal < 0 ? 'Tax rate cannot be negative' : 'Zero tax rate detected. Please verify if this is correct.' 
                        };
                     } else {
                        item.taxRate = { ...item.taxRate, isMismatch: false, suggestion: undefined };
                     }
                }

                const total = safeRound(net + tax);
                item.total = { ...item.total, value: total, confidence: Confidence.High, isMismatch: false };
            }
            
            updatedItems[itemIndex] = item;
            updatedVoucher.items = updatedItems;

            // Recalculate Voucher-level totals based on items
            const voucherTax = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.tax.value), 0));
            const voucherTotal = safeRound(updatedItems.reduce((sum, i) => sum + safeNum(i.total.value), 0));
            
            updatedVoucher.tax = { ...updatedVoucher.tax, value: voucherTax, confidence: Confidence.High };
            updatedVoucher.amount = { ...updatedVoucher.amount, value: voucherTotal, confidence: Confidence.High };

            // Re-validate totals
            const isAmountEmpty = !String(updatedVoucher.amount.value).trim();
            if (isAmountEmpty) {
              updatedVoucher.amount = { ...updatedVoucher.amount, isMismatch: true, suggestion: 'Voucher amount is required' };
            } else {
              updatedVoucher.amount = { ...updatedVoucher.amount, isMismatch: false, suggestion: undefined };
            }
        } else if (fieldName === 'type') {
             updatedVoucher = { 
               ...v, 
               type: newValue as VoucherType
             };
        } else {
             const isNumericField = ['amount', 'tax', 'withdrawalAmount', 'depositAmount', 'closingBalance'].includes(fieldName);
             const val = isNumericField ? parseNumericValue(newValue) : newValue;
             const targetField = (updatedVoucher as any)[fieldName] || { value: '', confidence: Confidence.High, isMismatch: false };
             
             updatedVoucher = { 
               ...v, 
               [fieldName]: { ...targetField, value: val } 
             };

             if (fieldName === 'supplyType') {
                const isInterState = String(val) === 'Inter-State';
                const newTaxType = isInterState ? 'IGST' : 'CGST/SGST';
                updatedVoucher.items = (updatedVoucher.items || []).map(item => ({
                   ...item,
                   taxType: {
                      ...(item.taxType || { confidence: Confidence.High }),
                      value: newTaxType,
                      isMismatch: false,
                      suggestion: 'Updated to match supply classification'
                   }
                }));
             }

// Validation for essential fields
             const essentialFields = (() => {
               switch(updatedVoucher.type) {
                   case VoucherType.Purchase:
                   case VoucherType.Sales: return ['date', 'amount', 'ledger', 'invoiceNumber', 'partyName'];
                   case VoucherType.Payment:
                   case VoucherType.Receipt: return ['date', 'amount'];
                   case VoucherType.Journal: return ['date', 'amount', 'debitLedger', 'creditLedger'];
                   case VoucherType.Contra: return ['date', 'amount', 'fromAccount', 'toAccount'];
                   case VoucherType.BankStatement: return ['date', 'narration'];
                   default: return ['date', 'amount'];
               }
             })();

             if (essentialFields.includes(fieldName)) {
               const isEmpty = !String(val).trim() || (fieldName === 'amount' && safeNum(val) <= 0);
               
               if (isEmpty) {
                 (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).isMismatch = true;
                 (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).suggestion = `${fieldName.replace(/([A-Z])/g, ' $1')} is required and cannot be empty`;
               } else {
                 (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).isMismatch = false;
                 (updatedVoucher[fieldName as keyof ParsedVoucher] as VoucherField).suggestion = undefined;
               }
             }

              // Auto-identify voucher type and populate amount/reference for bank statement origins
              if (v.origin === 'bank' && ['depositAmount', 'withdrawalAmount', 'narration', 'amount', 'referenceNo'].includes(fieldName)) {
                  const dAmount = safeNum(updatedVoucher.depositAmount?.value);
                  const wAmount = safeNum(updatedVoucher.withdrawalAmount?.value);
                  const descStr = String(updatedVoucher.narration?.value || '').toLowerCase();
                  
                  // Auto-sync the general amount with bank specific amounts to fix "Required" errors
                  const bankSum = dAmount || wAmount;
                  if (bankSum > 0) {
                      updatedVoucher.amount = { 
                          value: bankSum, 
                          confidence: Confidence.High, 
                          isMismatch: false, 
                          suggestion: 'Auto-synced from Bank fields' 
                      };
                  }

                  // Populate reference if empty from narration
                  if (!updatedVoucher.referenceNo?.value) {
                     const refMatch = descStr.match(/ref[:.\s]+([a-zA-Z0-9]+)/i) || 
                                      descStr.match(/(?:upi|imps|neft|rtgs|chq)[\/-]+([a-zA-Z0-9]+)/i);
                     if (refMatch && refMatch[1]) {
                        updatedVoucher.referenceNo = { value: refMatch[1], confidence: Confidence.High };
                     }
                 }
             }

             // If user manually changes total voucher amount or tax, check for consistency with items
             if ((fieldName === 'amount' || fieldName === 'tax') && updatedVoucher.items && updatedVoucher.items.length > 0) {
                const itemsTotal = safeRound(updatedVoucher.items.reduce((sum, i) => sum + safeNum(i.total.value), 0));
                const itemsTax = safeRound(updatedVoucher.items.reduce((sum, i) => sum + safeNum(i.tax.value), 0));
                
                if (fieldName === 'amount' && val !== itemsTotal) {
                   updatedVoucher.amount = { ...updatedVoucher.amount, isMismatch: true, suggestion: `Total ₹${val} does not match items sum ₹${itemsTotal}` };
                } else if (fieldName === 'tax' && val !== itemsTax) {
                   updatedVoucher.tax = { ...updatedVoucher.tax, isMismatch: true, suggestion: `Tax ₹${val} does not match items tax sum ₹${itemsTax}` };
                }
             }


        }

        // Auto-population logic
        if (masterData) {
          if (masterData.gstin) {
            updatedVoucher.gstin = { 
              ...(updatedVoucher.gstin || { confidence: Confidence.High, isMismatch: false }), 
              value: masterData.gstin,
              confidence: Confidence.High,
              isMismatch: false,
              suggestion: `Fetched from Master: ${masterData.name}`
            };
          }
          if (masterData.state || masterData.placeOfSupply) {
            updatedVoucher.placeOfSupply = {
              ...(updatedVoucher.placeOfSupply || { confidence: Confidence.High, isMismatch: false }),
              value: masterData.state || masterData.placeOfSupply,
              confidence: Confidence.High,
              isMismatch: false
            };
          }
          if (masterData.taxRate !== undefined) {
             const currentTotal = safeNum(updatedVoucher.amount.value);
             const currentTax = safeNum(updatedVoucher.tax.value);
             const baseAmount = safeRound(currentTotal - currentTax);
             
             const taxRateVal = safeNum(masterData.taxRate);
             const newTax = safeRound((baseAmount * taxRateVal) / 100);
             
             updatedVoucher.tax = { 
               ...updatedVoucher.tax, 
               value: newTax, 
               confidence: Confidence.High,
               isMismatch: false,
               suggestion: `Applied ${taxRateVal}% default tax for ${masterData.name}` 
             };
             updatedVoucher.amount = {
               ...updatedVoucher.amount,
               value: safeRound(baseAmount + newTax),
               confidence: Confidence.High,
               isMismatch: false
             }
          }
          if (masterData.terms) {
             updatedVoucher.partyName = {
               ...updatedVoucher.partyName,
               suggestion: `Credit Terms: ${masterData.terms}`
             };
          }
        }

        // Cascade supply-based tax rules for consistency
        if (updatedVoucher.items && ['ledger', 'gstin', 'partyName', 'placeOfSupply', 'billingState'].includes(fieldName)) {
           const ledgerVal = String(updatedVoucher.ledger?.value || '').toLowerCase();
           const gstinVal = String(updatedVoucher.gstin?.value || '');
           const posVal = String(updatedVoucher.placeOfSupply?.value || '').toLowerCase();
           
           const isInterFromGstin = gstinVal.length >= 2 && gstinVal.substring(0, 2) !== '27';
           const isInterFromPos = !!posVal && !posVal.includes('27') && !posVal.includes('maharashtra') && !posVal.includes('mh');
           
           const hasIgstKeyword = ledgerVal.includes('igst') || ledgerVal.includes('inter');
           const hasCgstKeyword = ledgerVal.includes('cgst') || ledgerVal.includes('sgst') || ledgerVal.includes('local') || ledgerVal.includes('intra') || (ledgerVal.includes('gst') && !ledgerVal.includes('igst'));
           
           let isInterState = isInterFromGstin || isInterFromPos;
           if (hasIgstKeyword) {
             isInterState = true;
           } else if (hasCgstKeyword) {
             isInterState = false;
           }

           const newSupplyType = isInterState ? 'Inter-State' : 'Intra-State';
           const newTaxType = isInterState ? 'IGST' : 'CGST/SGST';
           
           // Update voucher's supplyType field explicitly
           updatedVoucher.supplyType = {
              value: newSupplyType,
              confidence: Confidence.High,
              isMismatch: false,
              suggestion: `Auto-detected based on ${fieldName}`
           };

           updatedVoucher.items = updatedVoucher.items.map(item => {
              if (item.taxType.value !== newTaxType) {
                 return {
                   ...item,
                   taxType: {
                       ...(item.taxType || { confidence: Confidence.High }),
                       value: newTaxType,
                       isMismatch: false,
                       suggestion: `Auto-updated based on ${isInterState ? 'Inter-state' : 'Intra-state'} classification`
                   }
                 };
              }
              return item;
           });
        }
        
        // Log to AuditLogs
        let oldValue: any = '(Empty)';
        if (itemIndex !== undefined && v.items[itemIndex]) {
          oldValue = (v.items[itemIndex] as any)[fieldName]?.value;
        } else {
          oldValue = (v as any)[fieldName]?.value;
        }

        if (oldValue !== newValue) {
           const logEntry = {
              id: Date.now().toString() + Math.random().toString(16),
              action: 'Modified' as const,
              timestamp: new Date().toISOString(),
              author: 'Current User', // we could get actual user if auth is implemented
              changes: [{
                 field: itemIndex !== undefined ? `Item ${itemIndex + 1} ${fieldName}` : fieldName,
                 oldValue,
                 newValue
              }]
           };
           updatedVoucher.auditLogs = [logEntry, ...(updatedVoucher.auditLogs || [])];
        }
        
        return updatedVoucher;
      }
      return v;
    });
    setVouchers(newVouchers);
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    onSaveDraft(vouchers);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

   const hasItemsAndTax = activeVoucher && (activeVoucher.type === VoucherType.Purchase || activeVoucher.type === VoucherType.Sales);
   const hasErrors = vouchers.some(v => {
     const vHasItems = (v.type === VoucherType.Purchase || v.type === VoucherType.Sales);
     let schema = [...(allowedFieldsSchema[v.type] || allowedFieldsSchema[VoucherType.Purchase])];
     if (v.origin === 'bank') {
         if (!schema.includes('withdrawalAmount')) schema.push('withdrawalAmount');
         if (!schema.includes('depositAmount')) schema.push('depositAmount');
         if (!schema.includes('closingBalance')) schema.push('closingBalance');
         if (!schema.includes('narration')) schema.push('narration');
     }
     
     const topLevelHasErrors = Object.entries(v || {}).some(([key, field]) => {
         if (!schema.includes(key)) return false; // Ignore fields that aren't in the schema
         return typeof field === 'object' && field !== null && !Array.isArray(field) && (field as any).isMismatch;
     });
     
     return topLevelHasErrors || (vHasItems && (v.items || []).some(item => Object.values(item || {}).some(field => typeof field === 'object' && field !== null && !Array.isArray(field) && (field as any).isMismatch)));
   });

   const getTaxAnalysis = () => {
     if (!hasItemsAndTax || !activeVoucher || !activeVoucher.items) return [];
     const groups: Record<number, { taxableValue: number; taxAmount: number; items: { name: string; taxable: number; tax: number }[] }> = {};
     
     activeVoucher.items.forEach(item => {
       if (!item.taxRate || !item.quantity || !item.rate || !item.tax || !item.name) return;
       const rate = safeNum(item.taxRate.value);
       const qty = safeNum(item.quantity.value);
       const price = safeNum(item.rate.value);
       const taxable = safeRound(qty * price);
       const tax = safeNum(item.tax.value);
       
       if (!groups[rate]) {
         groups[rate] = { taxableValue: 0, taxAmount: 0, items: [] };
       }
       groups[rate].taxableValue = safeRound(groups[rate].taxableValue + taxable);
       groups[rate].taxAmount = safeRound(groups[rate].taxAmount + tax);
       groups[rate].items.push({
         name: String(item.name.value),
         taxable,
         tax
       });
     });
     
     return Object.entries(groups)
       .map(([rate, data]) => ({ rate: Number(rate), ...data }))
       .sort((a, b) => a.rate - b.rate);
   };

   const taxAnalysis = getTaxAnalysis();
   const totalTaxableAmount = safeRound(taxAnalysis.reduce((sum, group) => sum + group.taxableValue, 0));

    // Explicit tax component totals for the summary section
    const totalCgst = safeRound(activeVoucher?.items?.reduce((sum, item) => 
      sum + (item.taxType.value === 'CGST/SGST' ? safeNum(item.tax?.value) / 2 : 0), 0) || 0);
    const totalSgst = safeRound(activeVoucher?.items?.reduce((sum, item) => 
      sum + (item.taxType.value === 'CGST/SGST' ? safeNum(item.tax?.value) / 2 : 0), 0) || 0);
    const totalIgst = safeRound(activeVoucher?.items?.reduce((sum, item) => 
      sum + (item.taxType.value === 'IGST' ? safeNum(item.tax?.value) : 0), 0) || 0);
    const hasIgst = activeVoucher?.items?.some(item => item.taxType.value === 'IGST') || false;

   return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 flex-shrink-0 gap-3">
          <div className="flex items-center">
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl flex flex-col items-center justify-center mr-3 sm:mr-4 shadow-lg shadow-blue-100 shrink-0">
                <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tighter opacity-80">{voucherType === VoucherType.BankStatement ? 'Statement' : 'Voucher'}</span>
                <span className="text-base sm:text-lg font-black" style={{ fontSize: activeVoucher?.tempImportId ? '0.75rem' : '1.125rem' }}>{activeVoucher?.tempImportId || `#${activeVoucherIndex + 1}`}</span>
             </div>
             <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">Banking Verification</h2>
                <div className="flex items-center mt-0.5 space-x-2 sm:space-x-3">
                   <p className="text-gray-500 text-[10px] sm:text-xs">
                     {activeTab === 'unmap' ? 'Entries where no valid name was extracted' : 
                      activeTab === 'missing' ? 'Entries with extracted names but no master match (>75%)' : 
                      'Entries automatically matched with existing masters'}
                   </p>
                   {vouchers.length > 1 && (
                      <div className="hidden sm:flex items-center bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mr-2 tracking-wider">Progress</span>
                        <div className="flex items-center space-x-1">
                           {(vouchers || []).map((v, i) => (
                              <div key={v.id} className={`w-1.5 h-1.5 rounded-full ${i === activeVoucherIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}></div>
                           ))}
                        </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
             <button 
               onClick={handleSaveDraft}
               disabled={saveStatus === 'saving'}
            className={`flex-1 sm:flex-none flex justify-center items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saveStatus === 'saved' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {saveStatus === 'saving' ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving...
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="flex items-center"><CheckCircleIcon className="mr-2" /> Draft Saved</span>
            ) : (
              'Save Draft'
            )}
          </button>
          </div>
        </div>

        {/* THREE STAGE TABS */}
        <div className="flex border-b border-gray-200 mb-4 bg-gray-50 rounded-t-lg p-1">
          <button 
            onClick={() => setActiveTab('unmap')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'unmap' ? 'bg-white border shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className={`w-2 h-2 rounded-full ${categorizedVouchers.unmap.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            UNMAP ({categorizedVouchers.unmap.length})
          </button>
          <button 
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'missing' ? 'bg-white border shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className={`w-2 h-2 rounded-full ${categorizedVouchers.missing.length > 0 ? 'bg-amber-500' : 'bg-gray-300'}`} />
            MISSING MASTER ({categorizedVouchers.missing.length})
          </button>
          <button 
            onClick={() => setActiveTab('automate')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'automate' ? 'bg-white border shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className={`w-2 h-2 rounded-full ${categorizedVouchers.automate.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
            AUTOMATE ({categorizedVouchers.automate.length})
          </button>
        </div>

        {tabVouchers.length > 0 && (
            <div className="border-b border-gray-100 mb-4 overflow-x-auto scrollbar-none flex-shrink-0 bg-white p-1 rounded-lg">
                <nav className="flex space-x-2" aria-label="Tabs">
                    {tabVouchers.map((voucher, index) => {
                        const hasError = Object.values(voucher || {}).some(field => typeof field === 'object' && field !== null && !Array.isArray(field) && (field as any).isMismatch) ||
                                        (hasItemsAndTax && (voucher.items || []).some(item => Object.values(item || {}).some(field => typeof field === 'object' && field !== null && (field as any).isMismatch)));
                        const isActive = activeVoucherIndex === index;
                        return (
                          <button
                              key={voucher.id}
                              onClick={() => setActiveVoucherIndex(index)}
                              className={`whitespace-nowrap py-2 px-4 rounded-md text-[10px] font-bold transition-all border ${
                                isActive 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                              {voucher.tempImportId || `#${vouchers.findIndex(v => v.id === voucher.id) + 1}`}
                              {hasError && <span className="ml-2 w-1.5 h-1.5 bg-red-400 rounded-full inline-block animate-ping"></span>}
                          </button>
                        );
                    })}
                </nav>
            </div>
        )}
        
        {activeVoucher && (
            <div className="overflow-x-auto flex-1 min-h-0 bg-white border border-gray-100 rounded-lg shadow-inner overflow-y-auto scrollbar-thin">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extracted Value</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Confidence</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-blue-50/10">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 capitalize">Import ID</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold font-mono text-base">
                            {activeVoucher.tempImportId || `${activeVoucher.type.substring(0, 3).toUpperCase()}-${(activeVoucherIndex + 1).toString().padStart(4, '0')}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic flex items-center">
                            <InfoIcon className="text-blue-400 scale-75 mr-1" /> Auto-generated ID
                        </td>
                    </tr>
                    <tr className="bg-blue-50/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 capitalize">Voucher Type</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex flex-wrap gap-2">
                                {[VoucherType.Receipt, VoucherType.Payment, VoucherType.Contra].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => handleFieldChange(activeVoucher.id, 'type', t)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border shadow-sm ${
                                            activeVoucher.type === t 
                                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic flex items-center">
                            <InfoIcon className="text-blue-400 scale-75 mr-1" /> Classification
                        </td>
                    </tr>
                    {hasItemsAndTax && (
                    <tr className="bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 capitalize">Total Taxable Amount</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                            ₹{totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic">
                            System Calculated
                        </td>
                    </tr>
                    )}
                    {(() => {
                        let schema = [...(allowedFieldsSchema[activeVoucher.type] || allowedFieldsSchema[VoucherType.Purchase])];

                        // Special handling for Bank-originated vouchers (Direct Bank Imports)
                        if (activeVoucher.origin === 'bank') {
                            // If it's from bank, we want to show specific bank fields regardless of the determined type (Payment/Receipt/Contra)
                            // But we also want to remove 'amount' if it's redundant
                            if (!schema.includes('withdrawalAmount')) schema.push('withdrawalAmount');
                            if (!schema.includes('depositAmount')) schema.push('depositAmount');
                            if (!schema.includes('closingBalance')) schema.push('closingBalance');
                            if (!schema.includes('narration')) schema.push('narration');
                            
                            // Remove the general 'amount' field if withdrawal/deposit exists, as it's redundant for bank vouchers
                            const hasBankAmount = safeNum(activeVoucher.withdrawalAmount?.value) > 0 || safeNum(activeVoucher.depositAmount?.value) > 0;
                            if (hasBankAmount) {
                                schema = schema.filter(f => f !== 'amount');
                            }
                        }

                        return (schema || []).map((key) => {
                          const rawField = (activeVoucher as Record<string, any>)[key];
                          // Force a dummy struct if the AI somehow completely dropped the field
                          const field: VoucherField = rawField || { value: '', confidence: Confidence.High, isMismatch: true, suggestion: 'Field missing from extraction' };
                          const isMismatch = field.isMismatch;
                          
                          return (
                            <tr key={key} className={`transition-colors relative ${isMismatch ? 'bg-red-50/50' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize flex items-center relative">
                                  {isMismatch && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" title="Validation mismatch" />}
                                  {isMismatch && <ErrorIcon className="text-red-500 scale-75 mr-2" />}
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/2">
                                    {key === 'partyName' ? (
                                      <div className="flex flex-col gap-1">
                                        <MasterSelectField 
                                          field={field} 
                                          masters={partyMasters} 
                                          label="Party"
                                          narration={String(activeVoucher.narration?.value || '')}
                                          onChange={(val, data) => handleFieldChange(activeVoucher.id, key, val, undefined, data)} 
                                          onCreate={onAddParty}
                                        />
                                        {isMismatch && (
                                            <button onClick={onNavigateToMasters} className="self-start text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center hover:bg-amber-100 transition-colors">
                                                <WarningIcon className="text-[10px] mr-1" /> Unlinked - Manage in Masters
                                            </button>
                                        )}
                                      </div>
                                    ) : (key === 'fromAccount' || key === 'toAccount' || key === 'bankDetails') ? (
                                      <div className="flex flex-col gap-1">
                                        <select 
                                            value={String(field.value)}
                                            onChange={(e) => handleFieldChange(activeVoucher.id, key, e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="">Select bank...</option>
                                            {(ledgerMasters || []).filter(m => m.group === 'Bank Accounts').map(m => m.name).map(item => (
                                              <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                      </div>
                                    ) : key === 'supplyType' ? (
                                      <div className="flex flex-col gap-1">
                                        <select 
                                            value={String(field.value)}
                                            onChange={(e) => handleFieldChange(activeVoucher.id, key, e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="Intra-State">Intra-State (Local)</option>
                                            <option value="Inter-State">Inter-State (Outside)</option>
                                        </select>
                                      </div>
                                    ) : ['ledger', 'debitLedger', 'creditLedger'].includes(key) ? (
                                      <div className="flex flex-col gap-1">
                                        <MasterSelectField 
                                          field={field} 
                                          masters={ledgerMasters} 
                                          label="Ledger Account"
                                          narration={String(activeVoucher.narration?.value || '')}
                                          onChange={(val) => handleFieldChange(activeVoucher.id, key, val)} 
                                          onCreate={onAddLedger}
                                        />
                                        {isMismatch && (
                                            <button onClick={onNavigateToMasters} className="self-start text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center hover:bg-amber-100 transition-colors">
                                                <WarningIcon className="text-[10px] mr-1" /> Unlinked - Manage in Masters
                                            </button>
                                        )}
                                      </div>
                                    ) : (
                                      <EditableField 
                                        type={key === 'narration' ? 'textarea' : typeof field.value === 'number' ? 'number' : 'text'}
                                        field={field} 
                                        onChange={val => handleFieldChange(activeVoucher.id, key, val)} 
                                      />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ConfidencePill confidence={field.confidence} />
                                </td>
                            </tr>
                          );
                        });
                    })()}
                </tbody>
            </table>

            {hasItemsAndTax && taxAnalysis.length > 0 && (
              <div className="mt-8 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsTaxAnalysisExpanded(!isTaxAnalysisExpanded)}
                >
                  <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center">
                    <InfoIcon className="mr-2 text-blue-500" /> Tax Analysis Summary (Grouped by Rate)
                  </h2>
                  <div className="text-blue-700 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
                    {isTaxAnalysisExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </div>
                </div>
                
                {isTaxAnalysisExpanded && (
                  <div className="space-y-4 mt-4">
                    {(taxAnalysis || []).map((group) => {
                    const isExpanded = expandedRateGroups[group.rate];
                    return (
                      <div key={group.rate} className="bg-white rounded-md border border-blue-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                          onClick={() => toggleRateGroup(group.rate)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </div>
                            <div>
                               <div className="text-xs font-bold text-blue-600">GST @ {group.rate}%</div>
                               <div className="text-[10px] text-gray-400 uppercase font-semibold">{group.items.length} items included</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-8">
                            <div className="text-right">
                              <div className="text-[10px] text-gray-500 uppercase font-semibold">Taxable Value</div>
                              <div className="text-sm font-medium text-gray-900">₹{group.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className="text-right bg-blue-50 px-3 py-1 rounded">
                              <div className="text-[10px] text-blue-500 uppercase font-bold">Tax Amount</div>
                              <div className="text-sm font-bold text-blue-700">₹{group.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                            <table className="min-w-full text-xs">
                              <thead>
                                <tr className="text-gray-400 uppercase font-bold border-b border-gray-200">
                                  <th className="text-left pb-2 font-semibold">Item Description</th>
                                  <th className="text-right pb-2 font-semibold font-mono">Taxable Amt</th>
                                  <th className="text-right pb-2 font-semibold font-mono">Tax Amt</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {(group.items || []).map((item, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="py-2 text-gray-700">{item.name}</td>
                                    <td className="py-2 text-right text-gray-600 font-mono">₹{item.taxable.toFixed(2)}</td>
                                    <td className="py-2 text-right text-blue-600 font-bold font-mono">₹{item.tax.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            )}
            
            {hasItemsAndTax && activeVoucher.items && activeVoucher.items.length > 0 && (
              <>
            <div className="flex items-center justify-between my-6">
              <h3 className="text-lg font-bold text-gray-800">Items Details</h3>
              {activeVoucher.items.filter(item => Object.values(item || {}).some(f => (f as any).isMismatch)).length > 0 && (
                <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center animate-pulse">
                  <ErrorIcon className="mr-1 text-sm" />
                  {activeVoucher.items.filter(item => Object.values(item || {}).some(f => (f as any).isMismatch)).length} Items need correction
                </span>
              )}
            </div>
             <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                    <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax %</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amt</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                    {(activeVoucher.items || []).map((item, index) => {
                        const rowHasError = Object.values(item || {}).some(field => typeof field === 'object' && field !== null && (field as VoucherField).isMismatch);
                        const currentTaxType = String(item.taxType?.value || 'CGST/SGST');
                        return (
                        <tr key={index} className={`transition-all relative group/row ${rowHasError ? 'bg-red-50/90 border-l-0' : 'hover:bg-gray-50/40'}`}>
                            <td className="px-6 py-4 relative">
                              {rowHasError && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 z-10 shadow-[2px_0_8px_rgba(220,38,38,0.2)]" title="Row contains errors" />
                              )}
                                <div className="flex items-center space-x-2">
                                  {rowHasError && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
                                  <ItemNameCombobox 
                                    field={item.name || { value: '', confidence: Confidence.High }} 
                                    autoFocus={index === newlyAddedItemIndex}
                                    suggestions={allItemNames}
                                    onChange={val => {
                                      handleFieldChange(activeVoucher.id, 'name', val, index);
                                      if (index === newlyAddedItemIndex) setNewlyAddedItemIndex(null);
                                    }} 
                                  />
                                </div>
                            </td>
                            <td className="px-6 py-4 w-20">
                                <EditableField field={item.quantity || { value: 0, confidence: Confidence.High }} onChange={val => handleFieldChange(activeVoucher.id, 'quantity', Number(val), index)} />
                            </td>
                            <td className="px-6 py-4 w-24">
                                <UomCombobox 
                                  field={item.uom || { value: 'Nos', confidence: Confidence.High }} 
                                  onChange={val => handleFieldChange(activeVoucher.id, 'uom', val, index)} 
                                  onAdd={onAddUom}
                                  uomMasters={uomMasters}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <EditableField field={item.rate || { value: 0, confidence: Confidence.High }} onChange={val => handleFieldChange(activeVoucher.id, 'rate', Number(val), index)} />
                            </td>
                            <td className="px-6 py-4 w-32">
                                <TaxTypeCombobox 
                                  field={item.taxType || { value: 'CGST/SGST', confidence: Confidence.High }} 
                                  onChange={val => handleFieldChange(activeVoucher.id, 'taxType', val, index)} 
                                />
                            </td>
                            <td className="px-6 py-4 w-24">
                                <TaxRateCombobox field={item.taxRate || { value: 0, confidence: Confidence.High }} onChange={val => handleFieldChange(activeVoucher.id, 'taxRate', val, index)} />
                            </td>
                            <td className="px-6 py-4">
                               <div className="group relative">
                                 <EditableField 
                                   field={item.tax || { value: 0, confidence: Confidence.High }} 
                                   onChange={val => handleFieldChange(activeVoucher.id, 'tax', Number(val), index)} 
                                 />
                                 
                                 {/* Detailed Tax Breakdown Popover */}
                                 <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-30 bg-white border border-gray-200 shadow-2xl rounded-xl p-0 w-64 transform translate-y-1 overflow-hidden">
                                   <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Detailed Tax Breakdown</div>
                                   </div>
                                                        <div className="p-3 space-y-3">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-gray-500 font-medium">Taxable Value</span>
                                        <span className="font-mono text-gray-800">₹{safeRound(safeNum(item.quantity?.value) * safeNum(item.rate?.value)).toFixed(2)}</span>
                                      </div>
                                      
                                      {currentTaxType === 'CGST/SGST' ? (
                                        <div className="pt-2 border-t border-gray-100">
                                          <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Intra-State Supply</div>
                                          <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs items-center">
                                              <span className="text-gray-600">CGST ({(safeNum(item.taxRate?.value) / 2).toFixed(1)}%)</span>
                                              <span className="font-mono text-gray-700">₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs items-center">
                                              <span className="text-gray-600">SGST ({(safeNum(item.taxRate?.value) / 2).toFixed(1)}%)</span>
                                              <span className="font-mono text-gray-700">₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="pt-2 border-t border-gray-100">
                                          <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Inter-State Supply</div>
                                          <div className="flex justify-between text-xs items-center">
                                            <span className="text-gray-600">IGST ({safeNum(item.taxRate?.value).toFixed(1)}%)</span>
                                            <span className="font-mono text-gray-700">₹{safeNum(item.tax?.value).toFixed(2)}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="bg-blue-50 px-3 py-2 flex justify-between text-xs border-t border-blue-100">
                                      <span className="font-bold text-blue-800">Total Tax Applicable</span>
                                      <span className="font-mono font-bold text-blue-900">₹{safeNum(item.tax?.value).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                    <div className="mt-1 flex flex-col gap-0.5 pointer-events-none text-right">
                                      {currentTaxType === 'IGST' ? (
                                        <span className="text-[9px] text-gray-400 font-mono leading-none">I: ₹{safeNum(item.tax?.value).toFixed(2)}</span>
                                      ) : (
                                        <>
                                          <span className="text-[9px] text-gray-400 font-mono leading-none">C: ₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                          <span className="text-[9px] text-gray-400 font-mono leading-none">S: ₹{(safeNum(item.tax?.value) / 2).toFixed(2)}</span>
                                        </>
                                      )}
                                    </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <div className="text-sm font-bold text-gray-900">₹{Number(item.total?.value || 0).toFixed(2)}</div>
                                  <ConfidencePill confidence={item.total?.confidence || Confidence.High} compact />
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="relative inline-block text-left">
                                 <button
                                   onClick={() => setActiveRowMenuIndex(activeRowMenuIndex === index ? null : index)}
                                   className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 focus:outline-none"
                                 >
                                   <MoreHorizIcon />
                                 </button>

                                 {activeRowMenuIndex === index && (
                                   <>
                                     <div 
                                       className="fixed inset-0 z-40" 
                                       onClick={() => setActiveRowMenuIndex(null)}
                                     />
                                     <div className="absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform origin-bottom-right">
                                       <div className="py-1" role="menu" aria-orientation="vertical">
                                         <button
                                           onClick={() => handleDuplicateItem(index)}
                                           className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                           role="menuitem"
                                         >
                                           <ContentCopyIcon className="mr-3 scale-75 text-blue-500" />
                                           Duplicate Item
                                         </button>
                                         <button
                                           onClick={() => handleDeleteItem(index)}
                                           disabled={activeVoucher.items.length <= 1}
                                           className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${activeVoucher.items.length <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                                           role="menuitem"
                                         >
                                           <DeleteIcon className="mr-3 scale-75" />
                                           Delete Item
                                         </button>
                                       </div>
                                     </div>
                                   </>
                                 )}
                               </div>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
             </table>

             </>
            )}
             <div className="mt-3 flex flex-col md:flex-row justify-between items-start md:items-end px-4 gap-3 flex-shrink-0">
               {hasItemsAndTax ? (
                 <button
                   onClick={handleAddItem}
                   className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all border border-blue-200"
                 >
                   <AddIcon className="mr-1 text-lg" /> Add New Item
                 </button>
               ) : (
                 <div />
               )}

               <div className="w-full md:w-80 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                 {hasItemsAndTax && (
                   <>
                     <div className="flex justify-between text-sm py-1.5">
                       <span className="text-gray-600 font-medium tracking-wide">Total Taxable Value</span>
                       <span className="font-mono font-bold text-gray-900">₹{totalTaxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex flex-col border-b border-dashed border-gray-300">
                        <div className="flex justify-between text-sm py-1.5">
                          <span className="text-gray-600 font-medium tracking-wide">Total Tax Amount</span>
                          <span className="font-mono font-bold text-gray-900">₹{Number(activeVoucher.tax?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex flex-col pb-2 pl-4 gap-0.5">
                          {hasIgst ? (
                            <div className="flex justify-between text-[11px] text-blue-600 font-mono font-bold">
                              <span>IGST</span>
                              <span>₹{totalIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                                <span>CGST</span>
                                <span>₹{totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                                <span>SGST</span>
                                <span>₹{totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                   </>
                 )}
                 <div className="flex justify-between text-sm sm:text-base py-2 mt-1">
                   <span className="text-gray-900 font-bold tracking-wide">Total Voucher Amount</span>
                   <span className={`${
                     String(activeVoucher.amount?.value || activeVoucher.withdrawalAmount?.value || activeVoucher.depositAmount?.value || 0).length > 8 ? 'text-sm' : 'text-base'
                   } font-mono font-bold text-blue-700 transition-all duration-300`}>₹{Number(activeVoucher.amount?.value || activeVoucher.withdrawalAmount?.value || activeVoucher.depositAmount?.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                 </div>
               </div>
             </div>
             
             <details className="mx-4 mb-4 mt-6 border border-gray-200 rounded-lg bg-white shadow-sm shrink-0">
                <summary className="px-4 py-3 text-sm font-bold text-gray-700 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none flex items-center rounded-t-lg">
                  <HistoryIcon className="text-gray-500 mr-2" />
                  Audit Log History
                </summary>
                <div className="p-4 border-t border-gray-200 space-y-3 max-h-[300px] overflow-y-auto">
                  {(activeVoucher.auditLogs || []).length > 0 ? (
                    activeVoucher.auditLogs!.map((log) => (
                      <div key={log.id} className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex justify-between items-center text-gray-900 font-bold border-b border-gray-200 pb-1 mb-1">
                           <div className="flex items-center space-x-2">
                             <span>{log.author}</span>
                             <span className="font-mono text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">{new Date(log.timestamp).toLocaleString()}</span>
                           </div>
                           <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{log.action}</span>
                        </div>
                        <div className="flex flex-col gap-1 ml-1">
                          {(log.changes || []).map((change, idx) => (
                             <div key={idx} className="flex gap-2 items-center w-full">
                               <span className="font-bold text-gray-700 capitalize min-w-[100px] shrink-0 truncate">{change.field.replace(/([A-Z])/g, ' $1')}:</span>
                               <span className="text-red-500 line-through max-w-[200px] truncate" title={String(change.oldValue || '(Empty)')}>{String(change.oldValue || '(Empty)')}</span>
                               <span className="text-gray-400 font-bold">&rarr;</span>
                               <span className="text-green-600 font-medium max-w-[200px] truncate" title={String(change.newValue || '(Empty)')}>{String(change.newValue || '(Empty)')}</span>
                             </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 py-4 text-center italic">No modifications have been recorded for this voucher yet.</div>
                  )}
                </div>
             </details>
             
            </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t flex-shrink-0">
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowBackIcon className="mr-2" />
            Back
          </button>
          <button
            onClick={() => onNext(vouchers)}
            disabled={hasErrors}
            className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white transition-colors ${
              hasErrors ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {hasErrors ? 'Please Fix Errors' : 'Next'}
            <ArrowForwardIcon className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
