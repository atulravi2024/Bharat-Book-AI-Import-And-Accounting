import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface FaqSegmentProps {
  t: (key: string) => string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  expandedArticle: string | null;
  setExpandedArticle: (id: string | null) => void;
  filteredArticles: Article[];
}

export const FaqSegment: React.FC<FaqSegmentProps> = ({
  t,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  expandedArticle,
  setExpandedArticle,
  filteredArticles,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("Query titles, tagging keywords, fallback filters...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900/50 text-[12px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 shadow-sm"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x">
          {['all', 'getting-started', 'vouchers', 'ai-engines', 'security'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 snap-center ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Articles list */}
      <div className="space-y-2.5 mt-3 border-t border-gray-100 dark:border-gray-800 pt-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-sans">{t("No matching articles")}</p>
            <p className="text-[10px] text-gray-400 mt-1">{t("Try another search term")}</p>
          </div>
        ) : (
          filteredArticles.map(art => {
            const isExpanded = expandedArticle === art.id;
            return (
              <div
                key={art.id}
                className={`border rounded-lg transition-all ${
                  isExpanded
                    ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/10 dark:bg-blue-950/5 shadow-sm'
                    : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <button
                  onClick={() => setExpandedArticle(isExpanded ? null : art.id)}
                  className="w-full p-3.5 text-left flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                        {t(art.category)}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mt-1 leading-tight">{t(art.title)}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-0.5 max-w-[95%]">{t(art.summary)}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform mt-1 shrink-0 ${isExpanded ? 'rotate-90 text-blue-500' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-4 pt-2 mb-2 border-t border-dashed border-gray-100 dark:border-gray-700 text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium space-y-3 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 p-4 border border-blue-50 dark:border-blue-900/20 rounded-md">
                      <p>{t(art.content)}</p>
                    </div>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {art.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-[10px] uppercase font-bold text-gray-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
