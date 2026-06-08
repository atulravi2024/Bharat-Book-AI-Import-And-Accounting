import React, { useState } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { 
    SlidersHorizontal, Layers, ChevronUp, ChevronDown, Landmark, Radio, 
    BookOpen, Trash2, Plus, Sparkles, Shield, HelpCircle, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MappingListSectionProps {
    isOpen: boolean;
    toggleSection?: () => void;
    toggles: any;
    handleToggle: (key: string) => void;
    customMappingRules: {id: string, keyword: string, targetField: 'partyName' | 'ledger' | 'type', targetValue: string, priority?: number, isRegex?: boolean}[];
    setCustomMappingRules: (rules: any) => void;
    bankMappings: {name: string, no: string, type: string}[];
    setBankMappings: (mappings: any) => void;
    bankChargesKeywords: string;
    setBankChargesKeywords: (val: string) => void;
    cashFlowKeywords: string;
    setCashFlowKeywords: (val: string) => void;
    selfTransferKeywords: string;
    setSelfTransferKeywords: (val: string) => void;
    mappingRules: {kw: string, led: string}[];
    setMappingRules: (rules: any) => void;
    searchTerm?: string;
}

export const MappingListSection: React.FC<MappingListSectionProps> = ({
    isOpen,
    toggles,
    handleToggle,
    customMappingRules,
    setCustomMappingRules,
    bankMappings,
    setBankMappings,
    bankChargesKeywords,
    setBankChargesKeywords,
    cashFlowKeywords,
    setCashFlowKeywords,
    selfTransferKeywords,
    setSelfTransferKeywords,
    mappingRules,
    setMappingRules,
    searchTerm = ''
}) => {
    const { t } = useLanguage();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleAccordion = (key: string) => {
        setActiveAccordion(prev => {
            const next = prev === key ? null : key;
            if (next) localStorage.setItem('bharat_book_accordion_mapping_list', next);
            else localStorage.removeItem('bharat_book_accordion_mapping_list');
            return next;
        });
    };

    // Filter matching logic based on search queries
    const isSectionVisible = (secKey: string) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase().trim();
        if (secKey === 'mapping-rules') {
            return t("Bank Statement Mapping Rules").toLowerCase().includes(q) ||
                   customMappingRules.some(r => r.keyword.toLowerCase().includes(q) || r.targetValue.toLowerCase().includes(q)) ||
                   "transaction type party name ledger inline priority regex rules".includes(q);
        }
        if (secKey === 'bank-accounts') {
            return t("Internal Bank & Account Mapping").toLowerCase().includes(q) ||
                   bankMappings.some(b => b.name.toLowerCase().includes(q) || b.no.includes(q)) ||
                   bankChargesKeywords.toLowerCase().includes(q) ||
                   cashFlowKeywords.toLowerCase().includes(q) ||
                   selfTransferKeywords.toLowerCase().includes(q) ||
                   "charges cash flow identifiers self transfer tags CA SB Cash Credit".includes(q);
        }
        if (secKey === 'ledger-engine') {
            return t("Keyword To Ledger Mapping Engine").toLowerCase().includes(q) ||
                   mappingRules.some(r => r.kw.toLowerCase().includes(q) || r.led.toLowerCase().includes(q)) ||
                   "assigned ledger account narrative keyword custom rule".includes(q);
        }
        return false;
    };

    const isRulesVisible = isSectionVisible('mapping-rules');
    const isRulesExpanded = activeAccordion === 'mapping-rules' || (Boolean(searchTerm) && isRulesVisible);

    const isBanksVisible = isSectionVisible('bank-accounts');
    const isBanksExpanded = activeAccordion === 'bank-accounts' || (Boolean(searchTerm) && isBanksVisible);

    const isEngineVisible = isSectionVisible('ledger-engine');
    const isEngineExpanded = activeAccordion === 'ledger-engine' || (Boolean(searchTerm) && isEngineVisible);

    return (
        <div className="animate-in fade-in duration-200">
            {/* Top Interactive Switch Row inside a padded block */}
            <div className="p-6 sm:p-8 pb-4 border-b border-gray-100 dark:border-gray-800/80 space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 p-5 rounded-xl">
                     <div className="flex items-center gap-3">
                          <SlidersHorizontal className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                               <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("Direct Ledger Mapping Table")}</h4>
                               <p className="text-[10px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">{t("Manually bind precise keyword matches, bank classes, and account branches.")}</p>
                          </div>
                     </div>
                     <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${toggles.sectionMappingListEnabled ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-gray-100 text-gray-450 dark:bg-gray-800 dark:text-gray-500'}`}>
                               {toggles.sectionMappingListEnabled ? t("Active") : t("Disabled")}
                          </span>
                          <div 
                               onClick={() => handleToggle('sectionMappingListEnabled')} 
                               className={`${toggles.sectionMappingListEnabled ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer shadow-inner transition-all shrink-0`}
                          >
                               <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.sectionMappingListEnabled ? 'right-0.75' : 'left-0.75'}`}></div>
                          </div>
                     </div>
                </div>
            </div>

            {/* Accordions Wrapper List - Edge-to-Edge display */}
            <div className={`divide-y divide-gray-100 dark:divide-gray-800 transition-all duration-300 ${
                !toggles.sectionMappingListEnabled ? 'opacity-55 pointer-events-none grayscale' : ''
            }`}>
               
                {/* 1. Bank Statement Mapping Rules Accordion */}
                {isRulesVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("mapping-rules")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Bank Statement Mapping Rules")}
                                </h3>
                            </div>
                            {isRulesExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isRulesExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Map specific keywords or regex patterns in bank statement narrations to precise Transaction Types (Payment, Receipt, Contra) or Ledgers.")}
                                        </p>

                                        {/* Direct list of rules */}
                                        <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800 border rounded-xl overflow-hidden max-h-[380px] overflow-y-auto p-1.5 bg-gray-50/20 dark:bg-gray-900/10">
                                            {customMappingRules.length === 0 ? (
                                                <div className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-50/10">{t("No mapping rules yet.")}</div>
                                            ) : (
                                                [...customMappingRules]
                                                  .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                                                  .map((rule) => {
                                                    const originalIdx = customMappingRules.findIndex(r => r.id === rule.id);
                                                    return (
                                                        <div key={rule.id} className="group flex flex-col sm:flex-row items-center gap-4 py-4 px-3 hover:bg-gray-50/80 dark:hover:bg-gray-800 transition-colors relative">
                                                            {rule.isRegex && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-550"></div>}
                                                            
                                                            {/* Keyword */}
                                                            <div className="w-full sm:w-[25%] min-w-0">
                                                                <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Keyword / Regex")}</span>
                                                                <input 
                                                                    type="text" 
                                                                    className={`w-full text-xs font-bold ${rule.isRegex ? 'font-mono text-indigo-600 dark:text-indigo-400' : 'text-gray-850 dark:text-gray-100'} bg-transparent outline-none`}
                                                                    value={rule.keyword} 
                                                                    onChange={(e) => {
                                                                        const newRules = [...customMappingRules];
                                                                        newRules[originalIdx].keyword = e.target.value;
                                                                        setCustomMappingRules(newRules);
                                                                    }}
                                                                />
                                                            </div>
                                                            
                                                            {/* Target field */}
                                                            <div className="w-full sm:w-[20%] min-w-0">
                                                                <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Target Field")}</span>
                                                                <select 
                                                                    className="w-full text-[10px] font-black text-gray-600 bg-transparent outline-none uppercase dark:text-gray-300 cursor-pointer"
                                                                    value={rule.targetField}
                                                                    onChange={(e) => {
                                                                        const newRules = [...customMappingRules];
                                                                        newRules[originalIdx].targetField = e.target.value as 'partyName' | 'ledger' | 'type';
                                                                        setCustomMappingRules(newRules);
                                                                    }}
                                                                >
                                                                    <option value="type">{t("Transaction Type")}</option>
                                                                    <option value="partyName">{t("Party Name")}</option>
                                                                    <option value="ledger">{t("Ledger Name")}</option>
                                                                </select>
                                                            </div>
                                                            
                                                            {/* Target value */}
                                                            <div className="w-full sm:w-[25%] min-w-0">
                                                                <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Target Value")}</span>
                                                                {rule.targetField === 'type' ? (
                                                                    <select 
                                                                        className="w-full text-[10px] font-black text-blue-600 bg-transparent outline-none uppercase cursor-pointer"
                                                                        value={rule.targetValue} 
                                                                        onChange={(e) => {
                                                                            const newRules = [...customMappingRules];
                                                                            newRules[originalIdx].targetValue = e.target.value;
                                                                            setCustomMappingRules(newRules);
                                                                        }}
                                                                    >
                                                                        <option value="Payment">{t("Payment")}</option>
                                                                        <option value="Receipt">{t("Receipt")}</option>
                                                                        <option value="Contra">{t("Contra")}</option>
                                                                        <option value="Journal">{t("Journal")}</option>
                                                                    </select>
                                                                ) : (
                                                                    <input 
                                                                        type="text" 
                                                                        className="w-full text-xs font-bold text-blue-600 bg-transparent outline-none" 
                                                                        value={rule.targetValue} 
                                                                        onChange={(e) => {
                                                                            const newRules = [...customMappingRules];
                                                                            newRules[originalIdx].targetValue = e.target.value;
                                                                            setCustomMappingRules(newRules);
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>

                                                            {/* Priority */}
                                                            <div className="w-full sm:w-[15%] min-w-0">
                                                                <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Priority")}</span>
                                                                <input 
                                                                    type="number" 
                                                                    className="w-full text-xs font-black text-gray-800 bg-transparent outline-none dark:text-gray-150" 
                                                                    value={rule.priority || 0} 
                                                                    onChange={(e) => {
                                                                        const newRules = [...customMappingRules];
                                                                        newRules[originalIdx].priority = parseInt(e.target.value) || 0;
                                                                        setCustomMappingRules(newRules);
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex flex-col gap-1 w-full sm:w-[15%] items-end sm:items-center">
                                                                <label className="text-[9px] font-black flex items-center cursor-pointer select-none">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="mr-1 accent-indigo-600" 
                                                                        checked={!!rule.isRegex}
                                                                        onChange={(e) => {
                                                                            const newRules = [...customMappingRules];
                                                                            newRules[originalIdx].isRegex = e.target.checked;
                                                                            setCustomMappingRules(newRules);
                                                                        }}
                                                                    /> {t("Regex")}
                                                                </label>
                                                                <button 
                                                                    onClick={() => setCustomMappingRules(customMappingRules.filter(r => r.id !== rule.id))} 
                                                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                                >
                                                                    <Trash2 className="w-4 h-4 shadow-none" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => setCustomMappingRules([...customMappingRules, { id: Date.now().toString(), keyword: "NEW_RULE", targetField: "type", targetValue: "Payment", isRegex: false, priority: 1 }])} 
                                            className="w-full py-3 bg-white hover:bg-blue-50/50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all flex items-center justify-center rounded-xl cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" /> {t("New Import Rule")}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 2. Internal Bank & Account Mapping & Classification Accordion */}
                {isBanksVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("bank-accounts")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <Landmark className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Internal Bank & Account Mapping")}
                                </h3>
                            </div>
                            {isBanksExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isBanksExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-6">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Link raw active bank ledger streams to company account numbers to automatically categorize inter-company transfers and direct postings.")}
                                        </p>

                                        {/* Bank Masters Fields List */}
                                        <div className="space-y-0 divide-y divide-gray-150 dark:divide-gray-800 border-x border-y border-gray-150 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-gray-50/20 dark:bg-gray-900/10">
                                            {bankMappings.map((bank, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    
                                                    {/* Bank master label */}
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Bank Master")}</span>
                                                        <input 
                                                            type="text" 
                                                            className="w-full text-xs font-bold text-gray-800 bg-transparent outline-none focus:text-blue-600 dark:text-gray-150" 
                                                            value={bank.name} 
                                                            onChange={(e) => {
                                                                const newMappings = [...bankMappings];
                                                                newMappings[idx].name = e.target.value;
                                                                setBankMappings(newMappings);
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Bank Account No. */}
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Account Number")}</span>
                                                        <input 
                                                            type="text" 
                                                            className="w-full text-xs font-mono font-bold text-blue-600 bg-transparent outline-none" 
                                                            value={bank.no} 
                                                            onChange={(e) => {
                                                                const newMappings = [...bankMappings];
                                                                newMappings[idx].no = e.target.value;
                                                                setBankMappings(newMappings);
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Account type */}
                                                    <div className="w-full md:w-44">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{t("Account Type")}</span>
                                                        <select 
                                                            className="w-full text-xs font-bold text-gray-700 bg-transparent outline-none dark:text-gray-200 cursor-pointer"
                                                            value={bank.type}
                                                            onChange={(e) => {
                                                                const newMappings = [...bankMappings];
                                                                newMappings[idx].type = e.target.value;
                                                                setBankMappings(newMappings);
                                                            }}
                                                        >
                                                            <option value="Current">Current Account (CA)</option>
                                                            <option value="Personal Savings">Savings Account (SB)</option>
                                                            <option value="Business CC">{t("Cash Credit / Overdraft")}</option>
                                                        </select>
                                                    </div>

                                                    {/* Trash Action */}
                                                    <button 
                                                        onClick={() => setBankMappings(bankMappings.filter((_, i) => i !== idx))}
                                                        className="text-gray-300 hover:text-red-500 p-1 self-end md:self-center transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4 ml-1" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button 
                                            onClick={() => setBankMappings([...bankMappings, { name: "Default Bank Master", no: "", type: "Current" }])}
                                            className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-blue-200 hover:text-blue-600 text-gray-400 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center rounded-xl cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" /> {t("Link with the bank master")}
                                        </button>

                                        {/* Dynamic Transaction Classification Keywords Block */}
                                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                             <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider dark:text-white mb-2">{t("Transaction Classification Logic")}</h4>
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                  <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl space-y-1.5">
                                                       <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">{t("Bank Charges Keywords")}</p>
                                                       <input 
                                                            type="text" 
                                                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold p-2 outline-none mt-1 focus:ring-1 focus:ring-blue-105" 
                                                            value={bankChargesKeywords} 
                                                            onChange={e => setBankChargesKeywords(e.target.value)} 
                                                       />
                                                  </div>
                                                  
                                                  <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl space-y-1.5">
                                                       <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">{t("Cash Flow / ATM Tags")}</p>
                                                       <input 
                                                            type="text" 
                                                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold p-2 outline-none mt-1 focus:ring-1 focus:ring-blue-105" 
                                                            value={cashFlowKeywords} 
                                                            onChange={e => setCashFlowKeywords(e.target.value)} 
                                                       />
                                                  </div>

                                                  <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl space-y-1.5">
                                                       <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">{t("Self Transfer Tags")}</p>
                                                       <input 
                                                            type="text" 
                                                            className="w-full bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold p-2 outline-none mt-1 focus:ring-1 focus:ring-blue-105" 
                                                            value={selfTransferKeywords} 
                                                            onChange={e => setSelfTransferKeywords(e.target.value)} 
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 3. Keyword To Ledger Mapping Engine Accordion */}
                {isEngineVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("ledger-engine")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                                    <BookOpen className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("Keyword To Ledger Mapping Engine")}
                                </h3>
                            </div>
                            {isEngineExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isEngineExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Bind precise general text matches or narrative key patterns straight to pre-configured master ledgers within your accounting systems.")}
                                        </p>

                                        {/* Ledger Engine Table wrapper */}
                                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-inner bg-gray-55/20">
                                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 flex text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                                <div className="w-1/2">{t("Narrative Keyword")}</div>
                                                <div className="w-1/2 ml-4">{t("Assigned Ledger Account")}</div>
                                            </div>
                                            
                                            <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                                                {mappingRules.map((rule, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/20 transition-colors group">
                                                        {/* Narrative keyword match */}
                                                        <div className="w-1/2">
                                                            <input 
                                                                type="text" 
                                                                className="w-full text-xs font-bold text-gray-700 dark:text-gray-200 bg-transparent outline-none focus:text-blue-600" 
                                                                value={rule.kw}
                                                                onChange={(e) => {
                                                                    const newRules = [...mappingRules];
                                                                    newRules[idx].kw = e.target.value;
                                                                    setMappingRules(newRules);
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Target Ledger Match */}
                                                        <div className="w-1/2 flex items-center justify-between pl-1">
                                                            <input 
                                                                type="text" 
                                                                className="w-full text-xs font-bold text-blue-600 bg-transparent outline-none" 
                                                                value={rule.led}
                                                                onChange={(e) => {
                                                                    const newRules = [...mappingRules];
                                                                    newRules[idx].led = e.target.value;
                                                                    setMappingRules(newRules);
                                                                }}
                                                            />
                                                            <button 
                                                                onClick={() => setMappingRules(mappingRules.filter((_, i) => i !== idx))} 
                                                                className="text-gray-350 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-0.5 shrink-0"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <button 
                                                onClick={() => setMappingRules([...mappingRules, {kw: "NEW KEYWORD", led: "New Ledger"}])} 
                                                className="w-full py-3 bg-gray-50/85 hover:bg-blue-50/60 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all flex items-center justify-center cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> {t("Add New Custom Mapping Rule")}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};
