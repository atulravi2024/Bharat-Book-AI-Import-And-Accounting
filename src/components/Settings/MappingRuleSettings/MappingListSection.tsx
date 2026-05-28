
import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { DeleteIcon, AddIcon } from '../../icons/IconComponents';

interface MappingListSectionProps {
    isOpen: boolean;
    toggleSection: () => void;
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
}

export const MappingListSection: React.FC<MappingListSectionProps> = ({
    isOpen,
    toggleSection,
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
    setMappingRules
}) => {
  const { t } = useLanguage();
    return (
        <div className="border-t border-gray-100 overflow-hidden dark:border-gray-800">
            <div className="flex items-center px-8 py-5 transition-colors hover:bg-gray-50 group dark:hover:bg-gray-700">
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle('sectionMappingListEnabled');
                    }} 
                    className={`${toggles.sectionMappingListEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0 mr-4 shadow-sm`}
                >
                    <div className={`bg-white w-3.5 h-3.5 rounded-full absolute top-0.75 ${toggles.sectionMappingListEnabled ? 'right-0.75' : 'left-0.75'} shadow-sm transition-all dark:bg-gray-800`}></div>
                </div>
                <button 
                    onClick={() => {
                        toggleSection();
                        if (!isOpen) {
                            if (!toggles.sectionMappingListEnabled) handleToggle('sectionMappingListEnabled');
                        }
                    }}
                    className={`flex-1 flex items-center justify-between font-bold text-sm uppercase tracking-widest outline-none ${isOpen ? 'text-blue-700' : 'text-gray-900'} ${!toggles.sectionMappingListEnabled && 'opacity-50'} dark:text-white`}
                >
                    {t("Mapping List / Table")}
                    <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                </button>
            </div>
            {isOpen && (
                <div className={`bg-white border-t border-gray-50 ${!toggles.sectionMappingListEnabled && 'opacity-50 pointer-events-none grayscale'} dark:bg-gray-800`}>
                    {/* Bank Statement Mapping Rules */}
                    <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4 dark:border-gray-700">
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest dark:text-white">{t("Bank Statement Mapping Rules")}</h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 font-medium dark:text-gray-400">{t("Map specific keywords or regex patterns in bank statement narrations to precise Transaction Types (Payment, Receipt, Contra) or Ledgers.")}</p>
                        
                        <div className="space-y-0 divide-y divide-gray-100 mb-4 max-h-[400px] overflow-y-auto px-2 border rounded-xl overflow-hidden custom-scrollbar dark:divide-gray-800">
                            {customMappingRules.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-50/30">{t("No mapping rules yet.")}</div>
                            ) : (
                                [...customMappingRules].sort((a, b) => (b.priority || 0) - (a.priority || 0)).map((rule) => {
                                    const originalIdx = customMappingRules.findIndex(r => r.id === rule.id);
                                    return (
                                    <div key={rule.id} className="group flex flex-col sm:flex-row items-center gap-4 py-4 px-2 hover:bg-gray-50 transition-colors relative dark:hover:bg-gray-700">
                                        {rule.isRegex && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                                        <div className="w-full sm:w-[25%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Keyword / Regex")}</span>
                                            <input 
                                                type="text" 
                                                className={`w-full text-xs font-bold ${rule.isRegex ? 'font-mono text-indigo-700' : 'text-gray-800'} bg-transparent outline-none dark:text-gray-100`}
                                                value={rule.keyword} 
                                                onChange={(e) => {
                                                    const newRules = [...customMappingRules];
                                                    newRules[originalIdx].keyword = e.target.value;
                                                    setCustomMappingRules(newRules);
                                                }}
                                            />
                                        </div>
                                        <div className="w-full sm:w-[20%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Target Field")}</span>
                                            <select 
                                                className="w-full text-[10px] font-bold text-gray-600 bg-transparent outline-none uppercase dark:text-gray-300"
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
                                        <div className="w-full sm:w-[25%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Target Value")}</span>
                                            {rule.targetField === 'type' ? (
                                                <select 
                                                    className="w-full text-[10px] font-bold text-blue-700 bg-transparent outline-none uppercase"
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
                                                    className="w-full text-xs font-bold text-blue-700 bg-transparent outline-none" 
                                                    value={rule.targetValue} 
                                                    onChange={(e) => {
                                                        const newRules = [...customMappingRules];
                                                        newRules[originalIdx].targetValue = e.target.value;
                                                        setCustomMappingRules(newRules);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="w-full sm:w-[15%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Priority")}</span>
                                            <input 
                                                type="number" 
                                                className="w-full text-xs font-bold text-gray-800 bg-transparent outline-none dark:text-gray-100" 
                                                value={rule.priority || 0} 
                                                onChange={(e) => {
                                                    const newRules = [...customMappingRules];
                                                    newRules[originalIdx].priority = parseInt(e.target.value) || 0;
                                                    setCustomMappingRules(newRules);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 w-full sm:w-[15%] items-end sm:items-center">
                                            <label className="form-label flex items-center cursor-pointer">
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
                                            <button onClick={() => setCustomMappingRules(customMappingRules.filter(r => r.id !== rule.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <DeleteIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    )})
                            )}
                        </div>
                        <button 
                            onClick={() => setCustomMappingRules([...customMappingRules, { id: Date.now().toString(), keyword: "NEW_RULE", targetField: "type", targetValue: "Payment", isRegex: false, priority: 1 }])} 
                            className="w-full py-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all flex items-center justify-center rounded-xl dark:bg-gray-800 dark:border-gray-700"
                        >
                            <AddIcon className="w-3 h-3 justify-center text-center mr-1" /> {t("New Import Rule")}
                        </button>
                    </div>

                    {/* Moved Section 5 & 6 (Consolidated) */}
                    <div className="py-6 px-8 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2 flex items-center dark:text-white dark:border-gray-700">
                            {t("Internal Bank & Account Mapping")}
                            <span className="ml-auto bg-blue-100/50 text-blue-700 text-[9px] px-2 py-0.5 rounded-lg font-black">{t("Inter-Bank Detection")}</span>
                        </h4>
                        <p className="text-xs text-gray-500 mb-6 font-medium dark:text-gray-400">{t("Link your active Indian bank masters to their account numbers.")}</p>
                        
                        <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-4 dark:divide-gray-800 dark:border-gray-800">
                            {bankMappings.map((bank, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white p-4 hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Bank Master")}</span>
                                            <input 
                                                type="text" 
                                                className="w-full text-xs font-bold text-gray-800 bg-transparent outline-none focus:text-blue-600 dark:text-gray-100" 
                                                value={bank.name} 
                                                onChange={(e) => {
                                                    const newMappings = [...bankMappings];
                                                    newMappings[idx].name = e.target.value;
                                                    setBankMappings(newMappings);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Account Number")}</span>
                                            <input 
                                                type="text" 
                                                className="w-full text-xs font-mono font-bold text-blue-700 bg-transparent outline-none" 
                                                value={bank.no} 
                                                onChange={(e) => {
                                                    const newMappings = [...bankMappings];
                                                    newMappings[idx].no = e.target.value;
                                                    setBankMappings(newMappings);
                                                }}
                                            />
                                        </div>
                                        <div className="w-full md:w-40">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t("Account Type")}</span>
                                            <select 
                                                className="w-full text-xs font-bold text-gray-700 bg-transparent outline-none dark:text-gray-200"
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
                                        <button 
                                            onClick={() => setBankMappings(bankMappings.filter((_, i) => i !== idx))}
                                            className="text-gray-300 hover:text-red-500 p-1"
                                        >
                                            <DeleteIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => setBankMappings([...bankMappings, { name: "Default Bank Master", no: "", type: "Current" }])}
                                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center dark:border-gray-700"
                            >
                                <AddIcon className="w-3.5 h-3.5 mr-2" /> {t("Link with the bank master")}
                            </button>
                        </div>

                        {/* Consolidated Classification Logic */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest dark:text-white">{t("Transaction Classification Logic")}</h4>
                            <div className="space-y-4">
                                <div className="flex border-b border-gray-100 pb-4 flex-col md:flex-row md:items-center justify-between gap-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Bank Charges & Fees Keywords")}</p>
                                    </div>
                                    <input type="text" className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700" value={bankChargesKeywords} onChange={e => setBankChargesKeywords(e.target.value)} />
                                </div>
                                <div className="flex border-b border-gray-100 pb-4 flex-col md:flex-row md:items-center justify-between gap-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Cash Flow / ATM Identifiers")}</p>
                                    </div>
                                    <input type="text" className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700" value={cashFlowKeywords} onChange={e => setCashFlowKeywords(e.target.value)} />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Self Transfer Tags")}</p>
                                    </div>
                                    <input type="text" className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700" value={selfTransferKeywords} onChange={e => setSelfTransferKeywords(e.target.value)} />
                                </div>
                            </div>
                        </div>

                    {/* Keyword To Ledger Mapping Engine */}
                    <div className="bg-gray-50 p-8 border-y border-gray-100 shadow-sm border-blue-100/50 dark:bg-gray-900 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2 dark:text-white dark:border-gray-700">{t("Keyword To Ledger Mapping Engine")}</h4>
                        
                        <div className="bg-white border border-gray-200 rounded-xl shadow-inner overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex text-[10px] font-black text-gray-400 uppercase tracking-widest dark:bg-gray-900 dark:border-gray-700">
                                <div className="w-1/2">{t("Narrative Keyword")}</div>
                                <div className="w-1/2 ml-4">{t("Assigned Ledger Account")}</div>
                            </div>
                            
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                                {mappingRules.map((rule, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/30 transition-colors border-b border-gray-100/50 group">
                                        <div className="w-1/2">
                                            <input 
                                                type="text" 
                                                className="w-full text-xs font-bold text-gray-700 bg-transparent outline-none focus:text-blue-600 dark:text-gray-200" 
                                                value={rule.kw}
                                                onChange={(e) => {
                                                    const newRules = [...mappingRules];
                                                    newRules[idx].kw = e.target.value;
                                                    setMappingRules(newRules);
                                                }}
                                            />
                                        </div>
                                        <div className="w-1/2 flex items-center justify-between pl-1">
                                            <input 
                                                type="text" 
                                                className="w-full text-xs font-bold text-blue-700 bg-transparent outline-none" 
                                                value={rule.led}
                                                onChange={(e) => {
                                                    const newRules = [...mappingRules];
                                                    newRules[idx].led = e.target.value;
                                                    setMappingRules(newRules);
                                                }}
                                            />
                                            <button onClick={() => setMappingRules(mappingRules.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                                <DeleteIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={() => setMappingRules([...mappingRules, {kw: "NEW KEYWORD", led: "New Ledger"}])} className="w-full py-3 bg-gray-50/80 hover:bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all flex items-center justify-center border-t border-gray-200 dark:border-gray-700">
                                <AddIcon className="w-4 h-4 mr-1" /> {t("Add New Custom Mapping Rule")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
