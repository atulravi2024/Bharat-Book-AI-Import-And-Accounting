import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { GLOBAL_SEARCH_DATA, SearchItem } from './searchData';
import { MainView } from '../../app/types';
import { useLanguage } from '../../context/LanguageContext';

interface GlobalSearchProps {
  onViewChange?: (view: MainView) => void;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (expanded: boolean) => void;
}

type FilterType = 'All' | 'Page' | 'Master' | 'Report' | 'Operation' | 'Dashboard';

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  onViewChange, 
  isSearchExpanded,
  setIsSearchExpanded
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['Page', 'Master', 'Report', 'Operation', 'Dashboard']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const { t } = useLanguage();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() && activeFilters.length === 5) {
      setFilteredResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const words = query.toLowerCase().trim().split(/\s+/);
    const positiveTerms: string[] = [];
    const negativeTerms: string[] = [];

    for (const word of words) {
      if (word.startsWith('!') && word.length > 1) {
        negativeTerms.push(word.substring(1));
      } else if (word.startsWith('-') && word.length > 1) {
        negativeTerms.push(word.substring(1));
      } else if (word.trim()) {
        positiveTerms.push(word);
      }
    }

    const results = GLOBAL_SEARCH_DATA.filter((item) => {
      const matchesFilter = activeFilters.includes(item.type);
      if (!matchesFilter) return false;

      if (!query.trim()) return true;

      const fieldsToCheck = [
        item.title,
        t(item.title),
        item.type,
        t(item.type),
        item.subPage || '',
        item.subPage ? t(item.subPage.replace(/_/g, ' ')) : '',
        item.subSubPage || '',
        item.subSubPage ? t(item.subSubPage.replace(/_/g, ' ')) : '',
        ...(item.keywords || [])
      ].map(field => field.toLowerCase());

      if (negativeTerms.length > 0) {
        const hasNegativeMatch = negativeTerms.some(neg =>
          fieldsToCheck.some(field => field.includes(neg))
        );
        if (hasNegativeMatch) return false;
      }

      if (positiveTerms.length > 0) {
        const hasAllPositiveMatches = positiveTerms.every(pos =>
          fieldsToCheck.some(field => field.includes(pos))
        );
        if (!hasAllPositiveMatches) return false;
      }

      return true;
    });

    setFilteredResults(results);
    setIsDropdownOpen(true);
  }, [query, activeFilters]);

  const handleSelect = (item: SearchItem) => {
    if (onViewChange) {
      // Setup the routing state locally to push into local storage first
      const navOverride: any = {
        page: item.view,
        subPage: item.subPage
      };
      if (item.subSubPage) {
        navOverride.subSubPage = item.subSubPage;
      }
      localStorage.setItem('bharat_book_nav_override', JSON.stringify(navOverride));
      onViewChange(item.view);
    }
    
    // Reset and close
    setQuery('');
    setIsDropdownOpen(false);
    setIsSearchExpanded(false);
    setIsFilterDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsSearchExpanded(false);
      setIsFilterDropdownOpen(false);
    }
  };

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'Dashboards', value: 'Dashboard' },
    { label: 'Pages', value: 'Page' },
    { label: 'Master Data', value: 'Master' },
    { label: 'Reports', value: 'Report' },
    { label: 'Operations', value: 'Operation' },
  ];

  return (
    <div className="relative group w-full" ref={searchRef}>
      <div className="absolute inset-y-0 left-0 pl-3 md:pl-5 flex items-center pointer-events-none">
        <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 md:w-5 md:h-5" />
      </div>
      <input
        ref={inputRef}
        id="search"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
           if (query.trim() || activeFilters.length < 5) setIsDropdownOpen(true);
        }}
        autoFocus={isSearchExpanded}
        className="block w-full pl-10 md:pl-14 pr-24 py-2 md:py-2.5 bg-premium-slate-50 dark:bg-gray-700 border-none transition-all rounded-3xl leading-5 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 focus:bg-white dark:bg-gray-600 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200 dark:focus:bg-gray-700"
        placeholder={t("Global Command Search...")}
        type="search"
        autoComplete="off"
      />
      
      {/* Absolute right side inside search input: Filters */}
      <div className="absolute inset-y-0 right-2 flex items-center">
        <div className="relative">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsFilterDropdownOpen(!isFilterDropdownOpen); }}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${isFilterDropdownOpen ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 hover:text-blue-600 dark:hover:text-blue-400'}`}
            title={t("Filters")}
          >
            <span>{t("Filters")}</span>
            <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] ${activeFilters.length < 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-white'}`}>
              {activeFilters.length}
            </span>
          </button>
          
          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-2 flex flex-col space-y-1">
              <div className="px-2 py-1 mb-1 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase">{t("Categories")}</span>
                <button 
                  onClick={(e) => { e.preventDefault(); setActiveFilters(filterOptions.map(o => o.value)); }}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("Select All")}
                </button>
              </div>
              {filterOptions.map(opt => (
                <label key={opt.value} className="flex items-center space-x-3 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.includes(opt.value)}
                      onChange={() => toggleFilter(opt.value)}
                      className="peer appearance-none w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 transition-all cursor-pointer"
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 top-0.5 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{t(opt.label)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-40 overflow-visible flex flex-col max-h-[70vh] md:max-h-[500px]">
          
          {/* Results Header optionally, but we removed it since filters are now in input */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80 shrink-0">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
              {t("Search Results")}
            </span>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
            {filteredResults.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t("No results found.")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center mr-3 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 shrink-0 transition-colors">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{t(item.title)}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-0.5">
                        {t(item.type)} {item.subPage ? `• ${t(item.subPage.replace(/_/g, ' '))}` : ''}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
