import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { VoucherField } from '../../../../app/types';
import { EditIcon, WarningIcon, ErrorIcon, InfoIcon } from '../../../icons/IconComponents';
import { ConfidencePill } from './ConfidencePill';

interface EditableFieldProps {
  field: VoucherField;
  onChange: (newValue: string | number) => void;
  suffix?: string;
  hideConfidence?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'number' | 'textarea';
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  field, 
  onChange, 
  suffix, 
  hideConfidence, 
  autoFocus, 
  type 
}) => {
  const { t } = useLanguage();
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
      <div className="flex flex-col w-full text-left">
        <div className="flex items-center">
          {type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className={`w-full p-1.5 border ${borderColor} rounded-md text-sm outline-none bg-white transition-all min-h-[80px] resize-y dark:bg-gray-800 dark:text-white`}
            />
          ) : (
            <input
              type={type || (typeof field.value === 'number' ? 'number' : 'text')}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className={`w-full p-1.5 border ${borderColor} rounded-md text-sm outline-none bg-white transition-all dark:bg-gray-800 dark:text-white`}
            />
          )}
          {suffix && <span className="ml-1 text-gray-500 text-xs font-semibold dark:text-gray-400">{suffix}</span>}
        </div>
        {field.isMismatch && field.suggestion && (
          <div className="mt-1 flex items-center text-[10px] text-red-600 font-medium leading-tight">
            <WarningIcon className="mr-1 scale-75 shrink-0" />
            {field.suggestion}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative w-full text-left" onClick={() => setIsEditing(true)}>
      <div className={`flex justify-between items-center cursor-pointer p-1.5 rounded-md border border-transparent transition-all ${bgMain} ${field.isMismatch ? 'border-red-200' : 'hover:border-blue-300'}`}>
        <div className="flex items-center space-x-2 overflow-hidden w-full">
          {field.isMismatch && <ErrorIcon className="text-red-500 scale-75 shrink-0" />}
          <span className={`text-sm truncate font-medium ${field.isMismatch ? 'text-red-700' : 'text-gray-900'} dark:text-white`}>
            {field.value}{suffix ? ` ${suffix}` : ''}
          </span>
          {!hideConfidence && <ConfidencePill confidence={field.confidence} compact />}
        </div>
        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      {field.suggestion && (
        <div className={`absolute left-0 top-full mt-1 p-2 text-white text-[11px] rounded-lg shadow-xl w-max max-w-[240px] z-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none ${field.isMismatch ? 'bg-red-600' : 'bg-gray-800'}`}>
          <div className="flex items-start">
            {field.isMismatch ? <ErrorIcon className="mr-1.5 mt-0.5 scale-75 shrink-0" /> : <InfoIcon className="mr-1.5 mt-0.5 scale-75 shrink-0" />}
            <span>{field.suggestion}</span>
          </div>
          {field.isMismatch && <div className="absolute top-0 left-4 -mt-1 w-2 h-2 bg-red-600 rotate-45" />}
          {!field.isMismatch && <div className="absolute top-0 left-4 -mt-1 w-2 h-2 bg-gray-800 rotate-45" />}
        </div>
      )}
    </div>
  );
};
