import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherField, Confidence } from '../../../../app/types';
import { ErrorIcon, WarningIcon, InfoIcon, EditIcon, CheckCircleIcon, ExpandMoreIcon, AddIcon } from '../../../icons/IconComponents';

// ==========================================
// TaxRateCombobox Component
// ==========================================
export const TaxRateCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: number) => void 
}> = ({ field, onChange }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rates = [0, 5, 12, 18, 28];

  const handleSelect = (r: number) => {
    onChange(r);
    setIsEditing(false);
    setShowDropdown(false);
  };

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full text-left p-1 border border-blue-500 rounded bg-white text-xs font-semibold focus:outline-none flex justify-between items-center dark:bg-gray-800 dark:text-white"
        >
          <span>{field.value}%</span>
          <ExpandMoreIcon className="text-gray-400 text-xs" />
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
            {rates.map(r => (
              <div 
                key={r} 
                onClick={() => handleSelect(r)}
                className="p-1 px-2 hover:bg-blue-50 cursor-pointer text-xs font-semibold flex justify-between items-center text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <span>{r}%</span>
                {Number(field.value) === r && <CheckCircleIcon className="text-blue-500 text-xs" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative" onClick={() => setIsEditing(true)}>
      <div className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors dark:hover:bg-gray-600">
        <span className="text-xs font-bold text-gray-700 font-mono dark:text-gray-200">{field.value}%</span>
        <EditIcon className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

// ==========================================
// TaxTypeCombobox Component
// ==========================================
export const TaxTypeCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string) => void 
}> = ({ field, onChange }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const types = ['CGST/SGST', 'IGST'];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsEditing(false);
    setShowDropdown(false);
  };

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full text-left p-1 border border-blue-500 rounded bg-white text-xs font-semibold focus:outline-none flex justify-between items-center dark:bg-gray-800 dark:text-white"
        >
          <span className="truncate">{String(field.value)}</span>
          <ExpandMoreIcon className="text-gray-400 text-xs" />
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
            {types.map(val => (
              <div 
                key={val} 
                onClick={() => handleSelect(val)}
                className="p-1 px-2 hover:bg-blue-50 cursor-pointer text-xs font-semibold flex justify-between items-center text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <span>{val}</span>
                {String(field.value) === val && <CheckCircleIcon className="text-blue-500 text-xs" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative" onClick={() => setIsEditing(true)}>
      <div className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors dark:hover:bg-gray-600">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{field.value || 'CGST/SGST'}</span>
        <EditIcon className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

// ==========================================
// UomCombobox Component
// ==========================================
export const UomCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string) => void;
  onAdd: (name: string) => void;
  uomMasters: any[];
}> = ({ field, onChange, onAdd, uomMasters }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(field.value));
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentValue(String(field.value));
  }, [field.value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setShowDropdown(false);
        onChange(currentValue);
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

  const units = Array.from(new Set([
    'Nos', 'Kgs', 'Pcs', 'Box', 'Mtr', 'Ltr', 'Set', 'Bag', 'Roll',
    ...(uomMasters || []).map(m => m.name || m.code)
  ])).filter(Boolean);

  const filteredUnits = units
    .filter(unit => unit.toLowerCase().includes(currentValue.toLowerCase()) && unit.toLowerCase() !== currentValue.toLowerCase())
    .slice(0, 5);

  if (isEditing) {
    return (
      <div ref={wrapperRef} className="relative z-30">
        <div className="flex flex-col relative">
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
            className={`w-full p-1 border ${field.isMismatch ? 'border-red-500 bg-white' : 'border-blue-500'} rounded-md text-sm outline-none bg-white dark:bg-gray-800 dark:text-white`}
            placeholder="Unit..."
          />
        </div>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[80px] bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50 dark:bg-gray-800 dark:border-gray-700">
            {filteredUnits.length > 0 ? (
              filteredUnits.map(unit => (
                <div 
                  key={unit} 
                  onMouseDown={(e) => {
                    e.preventDefault(); 
                    handleCommit(unit);
                  }}
                  className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center text-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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

  const borderClass = field.isMismatch ? 'bg-red-50 border-red-500' : 'border-transparent hover:bg-gray-100';

  return (
    <div className="group relative" onClick={() => { setIsEditing(true); setCurrentValue(String(field.value)); }}>
      <div className={`flex justify-between items-center cursor-pointer p-1 rounded-md border transition-all ${borderClass} dark:hover:bg-gray-600`}>
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm font-medium truncate ${field.isMismatch ? 'text-red-700' : 'text-gray-700'} dark:text-gray-200`}>
            {field.value || <span className="text-gray-300 italic">{t("Nil")}</span>}
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

// ==========================================
// ItemNameCombobox Component
// ==========================================
export const ItemNameCombobox: React.FC<{ 
  field: VoucherField; 
  onChange: (newValue: string) => void;
  suggestions: string[];
  autoFocus?: boolean;
}> = ({ field, onChange, suggestions, autoFocus }) => {
  const { t } = useLanguage();
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
      <div ref={wrapperRef} className="relative z-30 w-full text-left">
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
            className={`w-full p-1.5 border ${field.isMismatch ? 'border-red-500 bg-white' : 'border-blue-500'} rounded-md text-sm outline-none bg-white dark:bg-gray-800 dark:text-white`}
            placeholder="Item name..."
          />
        </div>
        
        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50 dark:bg-gray-800 dark:border-gray-700">
            {filteredSuggestions.map(s => (
              <div 
                key={s} 
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  handleCommit(s);
                }}
                className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center text-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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

  const borderClass = field.isMismatch ? 'bg-red-50 border-red-500' : 'border-transparent hover:bg-gray-100';

  return (
    <div className="group relative w-full text-left" onClick={() => { setIsEditing(true); setCurrentValue(String(field.value)); }}>
      <div className={`flex justify-between items-center cursor-pointer p-1.5 rounded-md border transition-all ${borderClass} dark:hover:bg-gray-600`}>
        <div className="flex items-center space-x-2 overflow-hidden flex-1">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm font-medium truncate ${field.isMismatch ? 'text-red-700' : 'text-gray-900'} dark:text-white`}>
            {field.value || <span className="text-gray-300 italic">{t("No name")}</span>}
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
