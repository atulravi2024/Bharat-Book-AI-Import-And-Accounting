import React from 'react';
import { Sparkles, ChevronDown, ChevronUp, Info, Users, Package, Database, Zap } from 'lucide-react';

interface SeedingViewProps {
  t: (key: string) => string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  handleSeedParties: () => void;
  handleSeedCatalogItems: () => void;
  handleSeedGeneralLedgers: () => void;
  handleSeedTransactionalVouchers: () => void;
}

export const SeedingView: React.FC<SeedingViewProps> = ({
  t,
  expandedSection,
  setExpandedSection,
  handleSeedParties,
  handleSeedCatalogItems,
  handleSeedGeneralLedgers,
  handleSeedTransactionalVouchers,
}) => {
  const isOpen = expandedSection === 'seeding';

  return (
    <div className="border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 transition-all shadow-xs">
      <button 
        onClick={() => setExpandedSection(isOpen ? null : 'seeding')}
        className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white bg-gray-50/55 dark:bg-gray-900/15 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t("Automatic Seeding & Sampling")}</h4>
            <p className="text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">{t("Hydrate realistic transactions and custom master accounts instantly")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[8px] sm:text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-amber-500/10 text-amber-600 border border-amber-500/25 dark:bg-amber-950/45 dark:text-amber-400 shrink-0">{t("DEMO SEEDER")}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 dark:border-gray-900 space-y-4 animate-in fade-in duration-150">
          <div className="bg-amber-50/30 border border-amber-100/40 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-amber-800 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-950/20 leading-relaxed">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{t("Sandbox Automated Hydration Framework")}</span>
              {t("Running empty accounts? Use these utilities to immediately seed mock data conforming to strict Indian regulatory GST tax templates. Seeded records will instantly populate interactive dashboards.")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              onClick={handleSeedParties}
              className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl transition shadow-xs group"
            >
              <Users className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-xs text-gray-900 dark:text-white block">{t("Seed Party Masters")}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Injects 5 high-profile active client & vendor files.")}</span>
              </div>
            </button>

            <button
              onClick={handleSeedCatalogItems}
              className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl transition shadow-xs group"
            >
              <Package className="w-4 h-4 text-indigo-500 animate-none" />
              <div>
                <span className="font-bold text-xs text-gray-900 dark:text-white block">{t("Seed SKU Catalog")}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Injects 5 realistic inventory items with tax rates.")}</span>
              </div>
            </button>

            <button
              onClick={handleSeedGeneralLedgers}
              className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl transition shadow-xs group"
            >
              <Database className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="font-bold text-xs text-gray-900 dark:text-white block">{t("Seed Ledgers")}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Registers cash chests, sales A/C, operational expense rows.")}</span>
              </div>
            </button>

            <button
              onClick={handleSeedTransactionalVouchers}
              className="inline-flex flex-col items-start gap-2 text-left bg-white dark:bg-gray-900 hover:bg-amber-50/20 dark:hover:bg-amber-950/15 p-3.5 border border-gray-200 dark:border-amber-950/40 rounded-xl transition shadow-xs cursor-pointer group"
            >
              <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
              <div>
                <span className="font-bold text-xs text-orange-650 dark:text-amber-400 block flex items-center gap-1">{t("Seed 10 Transactions")} <Sparkles className="w-3 h-3 text-yellow-500" /></span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">{t("Generates beautiful Sales, Purchase, Receipts and Contra rows.")}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
