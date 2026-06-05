import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CollapsibleCardProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onToggle: () => void;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

// Highly stylized collapsible container component that fits the premium ERP context
export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
    title, 
    description,
    isOpen, 
    onToggle, 
    icon, 
    badge, 
    children, 
    className = "" 
}) => {
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 ${isOpen ? 'shadow-xs border-indigo-100/80 dark:border-indigo-900/60 ring-1 ring-indigo-50/30 dark:ring-indigo-950/20' : 'hover:border-gray-200 dark:hover:border-gray-750'} ${className}`}>
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-start justify-between p-4 text-left transition-colors select-none ${isOpen ? 'bg-indigo-50/10 dark:bg-indigo-950/5 border-b border-gray-50 dark:border-gray-800/80' : ''}`}
            >
                <div className="flex items-start gap-3 mr-4">
                    {icon && <div className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">{icon}</div>}
                    <div>
                        <h5 className="font-extrabold text-xs text-gray-800 dark:text-gray-150 uppercase tracking-wide">
                            {title}
                        </h5>
                        {description && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-normal">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {badge}
                    <div className="p-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-750 group-hover:bg-gray-100 transition-colors">
                        {isOpen ? (
                            <ChevronUp size={14} className="text-gray-500 dark:text-gray-450 shrink-0" />
                        ) : (
                            <ChevronDown size={14} className="text-gray-500 dark:text-gray-450 shrink-0" />
                        )}
                    </div>
                </div>
            </button>
            
            {isOpen && (
                <div className="p-4 bg-white dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-850">
                    {children}
                </div>
            )}
        </div>
    );
};
