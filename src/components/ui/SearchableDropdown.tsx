import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  id: string;
  name?: string;
  [key: string]: any;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  labelKey?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options = [],
  value,
  onChange,
  placeholder = 'Search...',
  label,
  className = '',
  buttonClassName = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus-within:bg-gray-700',
  labelKey
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, width: 0 });

  const updateCoords = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
      return () => {
        window.removeEventListener('resize', updateCoords);
        window.removeEventListener('scroll', updateCoords, true);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the input area and the portal menu
      const dropdownMenu = document.getElementById('searchable-dropdown-menu');
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        (!dropdownMenu || !dropdownMenu.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = (opt: any) => {
    if (labelKey && opt[labelKey]) return opt[labelKey];
    return opt.name || opt.item_name || opt.ledger_name || opt.warehouse_name || opt.id || '';
  };
  const getId = (opt: any) => opt.id || opt.name || opt.item_name || '';

  const filteredOptions = options.filter((opt) => {
    const valObj = (value || '').toLowerCase();
    const lblMatch = getLabel(opt)?.toLowerCase().includes(valObj);
    const skuMatch = opt.sku?.toLowerCase().includes(valObj);
    const codeMatch = opt.barcode?.toLowerCase().includes(valObj);
    const nameMatch = opt.name?.toLowerCase().includes(valObj) || opt.item_name?.toLowerCase().includes(valObj);
    
    return lblMatch || skuMatch || codeMatch || nameMatch;
  });

  useEffect(() => {
    setSelectedIndex(-1);
  }, [value, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
        onChange(getLabel(filteredOptions[selectedIndex]));
        setIsOpen(false);
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      document.activeElement instanceof HTMLElement && document.activeElement.blur();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="form-label">{label}</label>}
      <div className="relative flex items-center">
        <input
          type="text"
          className={`${buttonClassName.replace(/focus-within:/g, 'focus:')} pr-10`}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={(e) => {
            e.target.select();
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {value && isOpen ? (
          <X 
            size={16} 
            className="absolute right-3 text-gray-400 transition-transform cursor-pointer hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              document.activeElement instanceof HTMLElement && document.activeElement.blur();
              setIsOpen(true);
            }}
          />
        ) : (
          <ChevronDown 
            size={16} 
            className={`absolute right-3 text-gray-400 transition-transform cursor-pointer pointer-events-none ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </div>

      {isOpen && createPortal(
        <div 
          id="searchable-dropdown-menu"
          className="absolute z-[9999] bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 dark:bg-gray-800 dark:border-gray-800"
          style={{ top: menuCoords.top + 4, left: menuCoords.left, width: menuCoords.width }}
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <div
                  key={getId(opt) + '-' + index}
                  className={`px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-100 text-blue-800 font-bold'
                      : (value === getId(opt) || value === getLabel(opt))
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  } dark:text-gray-200 dark:hover:bg-gray-700`}
                  onClick={() => {
                    onChange(getLabel(opt));
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {getLabel(opt)}
                  {(opt.type || opt.group || opt.category) && (
                    <span className="ml-2 text-xs font-medium text-gray-400">
                      ({opt.type || opt.group || opt.category})
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center dark:text-gray-400">No results found</div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
