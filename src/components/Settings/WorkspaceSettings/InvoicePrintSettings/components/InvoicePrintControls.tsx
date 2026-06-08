import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// 1. COLLAPSIBLE SECTION
// ==========================================
interface CollapsibleSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    icon?: React.ReactNode;
    headerActions?: React.ReactNode;
    children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    isOpen,
    onToggle,
    icon,
    headerActions,
    children
}) => {
    return (
        <div 
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="border border-gray-100 rounded-[2rem] bg-white shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-300"
        >
            <div 
                id={`section-header-${title.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={onToggle}
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors select-none"
            >
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="text-blue-600 dark:text-blue-400 p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 shrink-0">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        {title}
                    </h3>
                </div>
                
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {headerActions}
                    <button 
                        id={`section-chevron-${title.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={onToggle}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={18} />
                        </motion.div>
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={`section-content-${title.toLowerCase().replace(/\s+/g, '-')}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <div className="p-6 border-t border-gray-50 dark:border-gray-700">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ==========================================
// 2. TOGGLE BUTTON
// ==========================================
interface ToggleButtonProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
    icon,
    label,
    active,
    onClick
}) => {
    return (
        <button
            id={`toggle-btn-${label.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-250 cursor-pointer select-none text-left w-full ${
                active 
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300 font-extrabold shadow-sm' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700/50'
            }`}
        >
            <div className={`p-2 rounded-xl shrink-0 ${active ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                {icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </button>
    );
};

// ==========================================
// 3. SEGMENTED CONTROL
// ==========================================
interface SegmentedOption {
    id: string;
    label: string;
    sub?: string;
}

interface SegmentedControlProps {
    options: SegmentedOption[];
    value: string;
    onChange: (id: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    value,
    onChange
}) => {
    return (
        <div 
            id={`segmented-control-${value.toLowerCase()}`}
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 p-1 bg-gray-100/80 dark:bg-gray-900/80 rounded-2xl border border-gray-100 dark:border-gray-800"
        >
            {options.map((opt) => {
                const isSelected = opt.id === value;
                return (
                    <button
                        key={opt.id}
                        id={`segment-opt-${opt.id.toLowerCase()}`}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className={`relative py-3 px-2 rounded-xl text-center transition-all duration-200 cursor-pointer select-none flex flex-col items-center justify-center min-h-[52px] ${
                            isSelected
                                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-100/50 dark:border-gray-700'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <span className={`text-[10px] uppercase tracking-widest font-black leading-tight ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {opt.label}
                        </span>
                        {opt.sub && (
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 whitespace-nowrap overflow-hidden">
                                {opt.sub}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// ==========================================
// 4. MARGIN INPUT
// ==========================================
interface MarginInputProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
}

export const MarginInput: React.FC<MarginInputProps> = ({
    label,
    value,
    onChange
}) => {
    const handleIncrement = () => {
        onChange(Math.round((value + 0.05) * 100) / 100);
    };

    const handleDecrement = () => {
        onChange(Math.max(0, Math.round((value - 0.05) * 100) / 100));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            onChange(val);
        } else if (e.target.value === '') {
            onChange(0);
        }
    };

    return (
        <div id={`margin-input-${label.toLowerCase()}`} className="bg-gray-50/50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-extrabold hover:border-gray-300 cursor-pointer shadow-sm text-xs select-none"
                >
                    -
                </button>
                <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={value || 0}
                    onChange={handleInputChange}
                    className="w-14 text-center bg-transparent border-0 font-mono text-xs font-bold text-gray-800 dark:text-gray-200 outline-none p-0 focus:ring-0 select-all"
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-extrabold hover:border-gray-300 cursor-pointer shadow-sm text-xs select-none"
                >
                    +
                </button>
            </div>
        </div>
    );
};
