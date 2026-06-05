import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Percent, ShieldAlert, Plus, Trash2, HelpCircle, ChevronDown, ChevronUp, Layers, Check } from 'lucide-react';

interface AssetBlock {
  id: string;
  name: string;
  rate: number; // specified percentage
  openingWdv: number; // balance on April 1st
  additionsMore180: number; // additions used >= 180 days (Full rate)
  additionsLess180: number; // additions used < 180 days (50% rate)
  deletions: number; // sold value
}

export const DepreciationPlanner: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const [infoOpen, setInfoOpen] = useState(true);

  // Default block of assets according to Indian IT rules
  const [blocks, setBlocks] = useState<AssetBlock[]>([
    { id: '1', name: t('Office Buildings (General)'), rate: 10, openingWdv: 12500000, additionsMore180: 800000, additionsLess180: 0, deletions: 200000 },
    { id: '2', name: t('Financial / Office Furniture & Fixtures'), rate: 10, openingWdv: 3500000, additionsMore180: 250000, additionsLess180: 75000, deletions: 0 },
    { id: '3', name: t('General Plant, Printers & Machinery'), rate: 15, openingWdv: 18500000, additionsMore180: 1200000, additionsLess180: 350000, deletions: 500000 },
    { id: '4', name: t('Computers, Tablets & ERP Software'), rate: 40, openingWdv: 4200000, additionsMore180: 950000, additionsLess180: 180000, deletions: 120000 },
  ]);

  // Form states for adding custom block if desired
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState(15);
  const [newWdv, setNewWdv] = useState(0);

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newBlock: AssetBlock = {
      id: Date.now().toString(),
      name: newName,
      rate: newRate,
      openingWdv: newWdv,
      additionsMore180: 0,
      additionsLess180: 0,
      deletions: 0
    };
    setBlocks([...blocks, newBlock]);
    setNewName('');
    setNewWdv(0);
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateVal = (id: string, field: keyof AssetBlock, val: number) => {
    setBlocks(blocks.map(b => {
      if (b.id === id) {
        return { ...b, [field]: val };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Informative Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div 
          onClick={() => setInfoOpen(!infoOpen)}
          className="flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Layers className="text-blue-600 dark:text-blue-400" size={18} />
            <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-100 tracking-wider">
              {t("Asset Depreciation Schedule (Section 32 Sandbox)")}
            </h3>
          </div>
          <span className="text-gray-400">
            {infoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>

        {infoOpen && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-slate-100 pt-4 dark:border-gray-700 animate-fadeIn">
            {t("Asset depreciation under Section 32 of Indian Income Tax is calculated per block of assets. If additions of assets are put to use for less than 180 days in the year, depreciation for that asset addition is limited strictly to 50% of the prescribed block rate limit.")}
          </p>
        )}
      </div>

      {/* Main Blocks Table container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 bg-gray-50 border-b border-slate-200 font-black text-gray-700 text-[10.5px] dark:bg-gray-901 dark:border-gray-700 dark:text-gray-300 uppercase tracking-widest flex justify-between items-center">
          <span>{t("Active Corporate Block of Assets Table")}</span>
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold dark:bg-blue-950/40 dark:text-indigo-300">
            {blocks.length} {t("Blocks Active")}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#f8fafc] text-gray-500 border-b border-slate-200 dark:bg-gray-900 dark:border-gray-750 dark:text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("Block Name & Statutory Rate")}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Opening WDV Balance (A)")}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Additions >= 180 Days (B)")}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Additions < 180 Days (C)")}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Deletions / Sales (D)")}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Total Depreciation Allowed")}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Closing WDV Asset Balance")}</th>
                <th className="px-5 py-3 text-center font-semibold">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
              {blocks.map((b) => {
                // Calculation:
                // Base 1: Net value before depreciation
                // Base = Opening WDV + additionsMore180 + additionsLess180 - deletions
                // If Base < 0, written down value balance becomes zero, no depreciation applies. Terminal profit/loss under Section 50.
                const predepVal = Math.max(0, b.openingWdv + b.additionsMore180 + b.additionsLess180 - b.deletions);
                
                // Depreciation allocation:
                // First apply full rate up to (Opening WDV + additionsMore180 - deletions)
                // Second apply half-rate strictly for additionsLess180
                let totalDep = 0;
                let closingWdv = 0;

                if (predepVal > 0) {
                  // Max eligible value for 50% limit cannot exceed total value.
                  // It can only be up to the additionsLess180 amount or the net predepVal (whichever is lower)
                  const halfRateBase = Math.min(b.additionsLess180, predepVal);
                  const fullRateBase = Math.max(0, predepVal - halfRateBase);

                  const halfRateDep = (halfRateBase * (b.rate / 2)) / 100;
                  const fullRateDep = (fullRateBase * b.rate) / 100;

                  totalDep = halfRateDep + fullRateDep;
                  closingWdv = Math.max(0, predepVal - totalDep);
                }

                return (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                    <td className="px-5 py-3 font-bold text-gray-800 dark:text-white">
                      <p className="font-semibold text-xs">{b.name}</p>
                      <span className="text-[10px] font-black tracking-wider text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 block">{b.rate}% {t("Rate block")}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input 
                        type="number"
                        value={b.openingWdv}
                        onChange={(e) => updateVal(b.id, 'openingWdv', Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-right w-24 p-1 px-1.5 font-mono text-xs font-bold border border-slate-200 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-200"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input 
                        type="number"
                        value={b.additionsMore180}
                        onChange={(e) => updateVal(b.id, 'additionsMore180', Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-right w-24 p-1 px-1.5 font-mono text-xs font-bold border border-slate-200 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-200"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input 
                        type="number"
                        value={b.additionsLess180}
                        onChange={(e) => updateVal(b.id, 'additionsLess180', Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-right w-24 p-1 px-1.5 font-mono text-xs font-bold border border-slate-200 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-200"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <input 
                        type="number"
                        value={b.deletions}
                        onChange={(e) => updateVal(b.id, 'deletions', Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-right w-24 p-1 px-1.5 font-mono text-xs font-bold border border-slate-200 dark:border-gray-700 rounded bg-transparent text-gray-800 dark:text-gray-200"
                      />
                    </td>
                    <td className="px-5 py-3 text-right font-black font-mono text-blue-600 dark:text-blue-400">
                      ₹{formatNumber(Math.round(totalDep))}
                    </td>
                    <td className="px-5 py-3 text-right font-black font-mono text-gray-900 dark:text-white">
                      ₹{formatNumber(Math.round(closingWdv))}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button 
                        onClick={() => handleRemoveBlock(b.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom / New Category block Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleAddBlock} className="group md:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
          <div className="col-span-1 sm:col-span-12 lg:col-span-5 w-full">
            <label className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider mb-1 block">{t("Create Block Name")}</label>
            <input 
              type="text" 
              placeholder="e.g. Electric Fleet Cars (Sec 32 block)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="w-full text-xs font-bold px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white border-slate-200"
            />
          </div>
          <div className="col-span-1 sm:col-span-4 lg:col-span-2 w-full">
            <label className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider mb-1 block">{t("Rate (%)")}</label>
            <select
              value={newRate}
              onChange={(e) => setNewRate(parseInt(e.target.value))}
              className="w-full text-xs font-mono font-bold px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white border-slate-200"
            >
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="30">30%</option>
              <option value="40">40%</option>
              <option value="100">100%</option>
            </select>
          </div>
          <div className="col-span-1 sm:col-span-4 lg:col-span-3 w-full">
            <label className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-wider mb-1 block">{t("Opening WDV (₹)")}</label>
            <input 
              type="number"
              placeholder="0"
              value={newWdv}
              onChange={(e) => setNewWdv(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-xs font-mono font-bold px-3 py-2 border rounded-lg bg-white dark:bg-gray-901 dark:border-gray-700 text-gray-800 dark:text-white border-slate-200"
            />
          </div>
          <div className="col-span-1 sm:col-span-4 lg:col-span-2 w-full">
            <button 
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-indigo-700/50"
            >
              <Plus size={14} />
              {t("Add Block")}
            </button>
          </div>
        </form>

        {/* Adopt block depreciation allowance warning */}
        <div className="bg-slate-50 rounded-xl border border-slate-250 p-5 dark:bg-gray-900 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest block">{t("Total Book Allowance")}</span>
            <h4 className="text-sm font-black text-slate-800 dark:text-gray-200 mt-1 uppercase tracking-wider">{t("Sum Allowance Total")}</h4>
            <p className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-4">
              ₹{formatNumber(blocks.reduce((sum, b) => {
                const predep = Math.max(0, b.openingWdv + b.additionsMore180 + b.additionsLess180 - b.deletions);
                if (predep <= 0) return sum;
                const hBase = Math.min(b.additionsLess180, predep);
                const fBase = Math.max(0, predep - hBase);
                return sum + ((hBase * (b.rate / 2)) / 100) + ((fBase * b.rate) / 100);
              }, 0))}
            </p>
          </div>
          <button 
            onClick={() => alert(t("Depreciation amounts computed based on Section 32 have been linked as deductible expenses in your Projections tab!"))}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <Check size={14} />
            {t("Adopt Depreciation Allowance")}
          </button>
        </div>
      </div>
    </div>
  );
};
