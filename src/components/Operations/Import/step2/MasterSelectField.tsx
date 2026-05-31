import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherField, Confidence } from '../../../../app/types';
import { WarningIcon, ErrorIcon, InfoIcon, AddIcon, CheckCircleIcon, ExpandMoreIcon, EditIcon } from '../../../icons/IconComponents';

interface MasterSelectFieldProps {
  field: VoucherField;
  masters: { name: string; id?: string; code?: string }[];
  placeholder?: string;
  onChange: (newValue: string) => void;
  onAdd: (name: string) => void;
  onNavigateToMasters: () => void;
  title: string;
}

export const MasterSelectField: React.FC<MasterSelectFieldProps> = ({ 
  field, 
  masters = [], 
  placeholder, 
  onChange, 
  onAdd, 
  onNavigateToMasters,
  title 
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(field.value || ''));
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(String(field.value || ''));
  }, [field.value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setShowDropdown(false);
        // Commit whatever is there or restore original
        const matched = masters.find(m => m.name.toLowerCase() === currentValue.toLowerCase());
        if (matched) {
          onChange(matched.name);
          setCurrentValue(matched.name);
        } else {
          // Keep current text (mismatch)
          onChange(currentValue);
        }
      }
    }
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, currentValue, masters]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      setShowDropdown(false);
      const matched = masters.find(m => m.name.toLowerCase() === currentValue.toLowerCase());
      if (matched) {
        onChange(matched.name);
        setCurrentValue(matched.name);
      } else {
        onChange(currentValue);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setShowDropdown(false);
      setCurrentValue(String(field.value || ''));
    }
  };

  const filteredMasters = (masters || [])
    .filter(m => m.name.toLowerCase().includes(currentValue.toLowerCase()) && m.name.toLowerCase() !== currentValue.toLowerCase())
    .slice(0, 5);

  const exactMatch = (masters || []).some(m => m.name.toLowerCase() === currentValue.toLowerCase());
  const isMismatch = field.isMismatch;

  const handleSelectOption = (name: string) => {
    setCurrentValue(name);
    onChange(name);
    setIsEditing(false);
    setShowDropdown(false);
  };

  const handleQuickCreate = () => {
    if (!currentValue.trim()) return;
    onAdd(currentValue.trim());
    setIsEditing(false);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full text-left">
      {isEditing ? (
        <div className="flex flex-col relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`w-full p-2 border ${isMismatch ? 'border-red-500 ring-1 ring-red-100 bg-white' : 'border-blue-500'} rounded-md text-sm outline-none bg-white transition-all dark:bg-gray-800 dark:text-white`}
            placeholder={placeholder || `Select ${title}...`}
          />
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-52 overflow-y-auto z-50 dark:bg-gray-800 dark:border-gray-700 w-full">
              {filteredMasters.length > 0 && (
                <div className="pt-2 pb-1">
                  <div className="px-3 pb-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("Matches in Masters")}</div>
                  {filteredMasters.map(m => (
                    <div 
                      key={m.name} 
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        handleSelectOption(m.name);
                      }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center text-gray-700 font-medium transition-colors mx-1 rounded-lg dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      <span className="truncate">{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {!exactMatch && currentValue.trim().length > 0 && (
                <div className="p-2 border-t border-gray-100 bg-gray-50/80 sticky bottom-0 dark:border-gray-800">
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleQuickCreate();
                    }}
                    className="w-full flex items-center justify-center p-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/90 rounded-lg transition-all border border-amber-200 shadow-sm"
                  >
                    <AddIcon className="w-4 h-4 mr-1.5" />
                    Create and link: "{currentValue}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => {
            setIsEditing(true);
            setShowDropdown(true);
          }}
          className="group relative cursor-pointer"
        >
          <div className={`flex justify-between items-center p-2 rounded-md border transition-all ${isMismatch ? 'bg-red-50 border-red-300' : 'border-transparent hover:bg-gray-100'} dark:hover:bg-gray-600`}>
            <div className="flex flex-col overflow-hidden text-left flex-1">
              <div className="flex items-center space-x-2">
                {isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
                <span className={`text-sm font-semibold truncate ${isMismatch ? 'text-red-700' : 'text-gray-900'} dark:text-white`}>
                  {field.value || <span className="text-gray-300 italic">{t("Nil (Not Selected)")}</span>}
                </span>
              </div>
              
              {isMismatch && field.suggestion && (
                <span className="text-[10px] text-amber-600 font-bold mt-0.5 max-w-[200px] truncate leading-tight">
                  {field.suggestion}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
              {isMismatch && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToMasters();
                  }}
                  className="text-[9px] font-black tracking-wider uppercase text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-md flex items-center transition-colors shadow-sm"
                >
                  Manage
                </button>
              )}
              <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
