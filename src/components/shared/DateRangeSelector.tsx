import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export type DateRangeOption = 
    | 'today' | 'yesterday'
    | 'currentMonth' | 'lastMonth' 
    | 'currentQuarter' | 'lastQuarter'
    | 'currentYear' | 'lastYear' 
    | 'currentFY' | 'previousFY'
    | 'custom';

export interface DateRange {
    from: string;
    to: string;
}

interface DateRangeSelectorProps {
    dateRange: DateRange;
    onChange: (range: DateRange) => void;
    className?: string;
    defaultOption?: DateRangeOption;
}

export const calculateDateRange = (option: DateRangeOption): DateRange => {
    const now = new Date();
    let from = '', to = '';
    
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    switch(option) {
        case 'today':
            from = to = formatDate(now);
            break;
        case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            from = to = formatDate(yesterday);
            break;
        case 'currentMonth':
            from = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
            to = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
            break;
        case 'lastMonth':
            from = formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            to = formatDate(new Date(now.getFullYear(), now.getMonth(), 0));
            break;
        case 'currentQuarter': {
            const cqStartMonth = Math.floor(now.getMonth() / 3) * 3;
            from = formatDate(new Date(now.getFullYear(), cqStartMonth, 1));
            to = formatDate(new Date(now.getFullYear(), cqStartMonth + 3, 0));
            break;
        }
        case 'lastQuarter': {
            const lqStartMonth = Math.floor(now.getMonth() / 3) * 3 - 3;
            from = formatDate(new Date(now.getFullYear(), lqStartMonth, 1));
            to = formatDate(new Date(now.getFullYear(), lqStartMonth + 3, 0));
            break;
        }
        case 'currentYear':
            from = `${now.getFullYear()}-01-01`;
            to = `${now.getFullYear()}-12-31`;
            break;
        case 'lastYear':
            from = `${now.getFullYear() - 1}-01-01`;
            to = `${now.getFullYear() - 1}-12-31`;
            break;
        case 'currentFY': {
            let startMonth = 3; // April (0-indexed)
            let isCalYear = false;
            try {
                const stored = localStorage.getItem('bharat_book_app_settings');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.fiscalYear) {
                        if (parsed.fiscalYear.includes('January')) { startMonth = 0; isCalYear = true; }
                        else if (parsed.fiscalYear.includes('July')) startMonth = 6;
                        else if (parsed.fiscalYear.includes('October')) startMonth = 9;
                    }
                }
            } catch(e) {}
            
            let fiscalStartYear = now.getFullYear();
            let fiscalEndYear = now.getFullYear() + 1;

            if (now.getMonth() < startMonth) {
                fiscalStartYear = now.getFullYear() - 1;
                fiscalEndYear = now.getFullYear();
            } else if (isCalYear) {
                fiscalEndYear = now.getFullYear();
            }
            
            from = formatDate(new Date(fiscalStartYear, startMonth, 1));
            to = formatDate(new Date(fiscalEndYear, isCalYear ? 12 : startMonth, 0));
            break;
        }
        case 'previousFY': {
            let startMonth = 3; // April (0-indexed)
            let isCalYear = false;
            try {
                const stored = localStorage.getItem('bharat_book_app_settings');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.fiscalYear) {
                        if (parsed.fiscalYear.includes('January')) { startMonth = 0; isCalYear = true; }
                        else if (parsed.fiscalYear.includes('July')) startMonth = 6;
                        else if (parsed.fiscalYear.includes('October')) startMonth = 9;
                    }
                }
            } catch(e) {}
            
            let fiscalStartYear = now.getFullYear() - 1;
            let fiscalEndYear = now.getFullYear();

            if (now.getMonth() < startMonth) {
                fiscalStartYear = now.getFullYear() - 2;
                fiscalEndYear = now.getFullYear() - 1;
            } else if (isCalYear) {
                fiscalEndYear = now.getFullYear() - 1;
            }
            
            from = formatDate(new Date(fiscalStartYear, startMonth, 1));
            to = formatDate(new Date(fiscalEndYear, isCalYear ? 12 : startMonth, 0));
            break;
        }
        case 'custom':
            return { from: '', to: '' };
    }
    return { from, to };
};

export const defaultDateRangeOption: DateRangeOption = 'currentMonth';

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, onChange, className = '', defaultOption }) => {
    const [selectedOption, setSelectedOption] = useState<DateRangeOption>(defaultOption || 'custom');

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const option = e.target.value as DateRangeOption;
        setSelectedOption(option);
        if (option !== 'custom') {
            onChange(calculateDateRange(option));
        }
    };

    return (
        <div className={`flex bg-white dark:bg-gray-800 items-center p-1 md:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none w-fit ${className}`}>
           <div className="flex items-center px-1 md:px-3 lg:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md">
               <Calendar size={14} className="mr-1.5 text-gray-400 hidden sm:block" />
               <select 
                   value={selectedOption} 
                   onChange={handleOptionChange}
                   className="bg-transparent border-none outline-none cursor-pointer text-gray-600 dark:text-gray-300 focus:ring-0 max-w-[120px] md:max-w-[160px] truncate"
               >
                   <option value="custom">Custom Period</option>
                   <option value="today">Today</option>
                   <option value="yesterday">Yesterday</option>
                   <option value="currentMonth">Current Month</option>
                   <option value="lastMonth">Last Month</option>
                   <option value="currentQuarter">Current Quarter</option>
                   <option value="lastQuarter">Last Quarter</option>
                   <option value="currentYear">Current Year</option>
                   <option value="lastYear">Last Year</option>
                   <option value="currentFY">Current Financial Year</option>
                   <option value="previousFY">Previous Financial Year</option>
               </select>
           </div>
           
           <div className="flex items-center px-2">
             <input
              type="date"
              className="text-[10px] md:text-xs font-medium outline-none text-gray-600 dark:bg-gray-800 dark:text-gray-300 w-24 md:w-auto"
              value={dateRange.from}
              onChange={e => {
                  setSelectedOption('custom');
                  onChange({ ...dateRange, from: e.target.value });
              }}
             />
           </div>
           <div className="flex items-center px-1 md:px-3">
             <ArrowRight size={12} className="text-gray-300" />
             <input 
              type="date" 
              className="ml-1 md:ml-3 text-[10px] md:text-xs font-medium outline-none text-gray-600 dark:bg-gray-800 dark:text-gray-300 w-24 md:w-auto" 
              value={dateRange.to}
              onChange={e => {
                  setSelectedOption('custom');
                  onChange({ ...dateRange, to: e.target.value });
              }}
             />
           </div>
        </div>
    );
};
