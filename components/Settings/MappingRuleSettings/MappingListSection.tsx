
import React from 'react';
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
    return (
        <div className="border-t border-gray-100 overflow-hidden">
            <div className="flex items-center px-8 py-5 transition-colors hover:bg-gray-50 group">
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle('sectionMappingListEnabled');
                    }} 
                    className={`${toggles.sectionMappingListEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0 mr-4 shadow-sm`}
                >
                    <div className={`bg-white w-3.5 h-3.5 rounded-full absolute top-0.75 ${toggles.sectionMappingListEnabled ? 'right-0.75' : 'left-0.75'} shadow-sm transition-all`}></div>
                </div>
                <button 
                    onClick={() => {
                        toggleSection();
                        if (!isOpen) {
                            if (!toggles.sectionMappingListEnabled) handleToggle('sectionMappingListEnabled');
                        }
                    }}
                    className={`flex-1 flex items-center justify-between font-bold text-sm uppercase tracking-widest outline-none ${isOpen ? 'text-blue-700' : 'text-gray-900'} ${!toggles.sectionMappingListEnabled && 'opacity-50'}`}
                >
                    Mapping List / Table
                    <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                </button>
            </div>
            {isOpen && (
                <div className={`bg-white border-t border-gray-50 ${!toggles.sectionMappingListEnabled && 'opacity-50 pointer-events-none grayscale'}`}>
                    {/* Bank Statement Mapping Rules */}
                    <div className="py-6 px-8 border-b border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Bank Statement Mapping Rules</h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 font-medium">Map specific keywords or regex patterns in bank statement narrations to precise Transaction Types (Payment, Receipt, Contra) or Ledgers.</p>
                        
                        <div className="space-y-0 divide-y divide-gray-100 mb-4 max-h-[400px] overflow-y-auto px-2 border rounded-xl overflow-hidden custom-scrollbar">
                            {customMappingRules.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-50/30">No mapping rules yet.</div>
                            ) : (
                                [...customMappingRules].sort((a, b) => (b.priority || 0) - (a.priority || 0)).map((rule) => {
                                    const originalIdx = customMappingRules.findIndex(r => r.id === rule.id);
                                    return (
                                    <div key={rule.id} className="group flex flex-col sm:flex-row items-center gap-4 py-4 px-2 hover:bg-gray-50 transition-colors relative">
                                        {rule.isRegex && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                                        <div className="w-full sm:w-[25%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Keyword / Regex</span>
                                            <input 
                                                type="text" 
                                                className={`w-full text-xs font-bold ${rule.isRegex ? 'font-mono text-indigo-700' : 'text-gray-800'} bg-transparent outline-none`}
                                                value={rule.keyword} 
                                                onChange={(e) => {
                                                    const newRules = [...customMappingRules];
                                                    newRules[originalIdx].keyword = e.target.value;
                                                    setCustomMappingRules(newRules);
                                                }}
                                            />
                                        </div>
                                        <div className="w-full sm:w-[20%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Target Field</span>
                                            <select 
                                                className="w-full text-[10px] font-bold text-gray-600 bg-transparent outline-none uppercase"
                                                value={rule.targetField}
                                                onChange={(e) => {
                                                    const newRules = [...customMappingRules];
                                                    newRules[originalIdx].targetField = e.target.value as 'partyName' | 'ledger' | 'type';
                                                    setCustomMappingRules(newRules);
                                                }}
                                            >
                                                <option value="type">Transaction Type</option>
                                                <option value="partyName">Party Name</option>
                                                <option value="ledger">Ledger Name</option>
                                            </select>
                                        </div>
                                        <div className="w-full sm:w-[25%] min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Target Value</span>
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
                                                    <option value="Payment">Payment</option>
                                                    <option value="Receipt">Receipt</option>
                                                    <option value="Contra">Contra</option>
                                                    <option value="Journal">Journal</option>
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
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Priority</span>
                                            <input 
                                                type="number" 
                                                className="w-full text-xs font-bold text-gray-800 bg-transparent outline-none" 
                                                value={rule.priority || 0} 
                                                onChange={(e) => {
                                                    const newRules = [...customMappingRules];
                                                    newRules[originalIdx].priority = parseInt(e.target.value) || 0;
                                                    setCustomMappingRules(newRules);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 w-full sm:w-[15%] items-end sm:items-center">
                                            <label className="flex items-center text-[10px] font-bold text-gray-500 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="mr-1 accent-indigo-600" 
                                                    checked={!!rule.isRegex}
                                                    onChange={(e) => {
                                                        const newRules = [...customMappingRules];
                                                        newRules[originalIdx].isRegex = e.target.checked;
                                                        setCustomMappingRules(newRules);
                                                    }}
                                                /> Regex
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
                            className="w-full py-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all flex items-center justify-center rounded-xl"
                        >
                            <AddIcon className="w-3 h-3 justify-center text-center mr-1" /> New Import Rule
                        </button>
                    </div>

                    {/* Moved Section 5 & 6 (Consolidated) */}
                    <div className="py-6 px-8 border-b border-gray-100">
                        <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2 flex items-center">
                            Internal Bank & Account Mapping
                            <span className="ml-auto bg-blue-100/50 text-blue-700 text-[9px] px-2 py-0.5 rounded-lg font-black">Inter-Bank Detection</span>
                        </h4>
                        <p className="text-xs text-gray-500 mb-6 font-medium">Link your active Indian bank masters to their account numbers.</p>
                        
                        <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-4">
                            {bankMappings.map((bank, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Bank Master</span>
                                            <input 
                                                type="text" 
                                                className="w-full text-xs font-bold text-gray-800 bg-transparent outline-none focus:text-blue-600" 
                                                value={bank.name} 
                                                onChange={(e) => {
                                                    const newMappings = [...bankMappings];
                                                    newMappings[idx].name = e.target.value;
                                                    setBankMappings(newMappings);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Account Number</span>
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
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Account Type</span>
                                            <select 
                                                className="w-full text-xs font-bold text-gray-700 bg-transparent outline-none"
                                                value={bank.type}
                                                onChange={(e) => {
                                                    const newMappings = [...bankMappings];
                                                    newMappings[idx].type = e.target.value;
                                                    setBankMappings(newMappings);
                                                }}
                                            >
                                                <option value="Current">Current Account (CA)</option>
                                                <option value="Personal Savings">Savings Account (SB)</option>
                                                <option value="Business CC">Cash Credit / Overdraft</option>
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
                                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center"
                            >
                                <AddIcon className="w-3.5 h-3.5 mr-2" /> Link with the bank master
                            </button>
                        </div>

                        {/* Consolidated Classification Logic */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest">Transaction Classification Logic</h4>
                            <div className="space-y-4">
                                <div className="flex border-b border-gray-100 pb-4 flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Bank Charges & Fees Keywords</p>
                                    </div>
                                    <input type="text" className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 outline-none w-full md:w-64" value={bankChargesKeywords} onChange={e => setBankChargesKeywords(e.target.value)} />
                                </div>
                                <div className="flex border-b border-gray-100 pb-4 flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Cash Flow / ATM Identifiers</p>
                                    </div>
                                    <input type="text" className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 outline-none w-full md:w-64" value={cashFlowKeywords} onChange={e => setCashFlowKeywords(e.target.value)} />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Self Transfer Tags</p>
                                    </div>
                                    <input type="text" className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-2.5 outline-none w-full md:w-64" value={selfTransferKeywords} onChange={e => setSelfTransferKeywords(e.target.value)} />
                                </div>
                            </div>
                        </div>

                    {/* Keyword To Ledger Mapping Engine */}
                    <div className="bg-gray-50 p-8 border-y border-gray-100 shadow-sm border-blue-100/50">
                        <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">Keyword To Ledger Mapping Engine</h4>
                        
                        <div className="bg-white border border-gray-200 rounded-xl shadow-inner overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <div className="w-1/2">Narrative Keyword</div>
                                <div className="w-1/2 ml-4">Assigned Ledger Account</div>
                            </div>
                            
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                                {mappingRules.map((rule, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/30 transition-colors border-b border-gray-100/50 group">
                                        <div className="w-1/2">
                                            <input 
                                                type="text" 
                                                className="w-full text-xs font-bold text-gray-700 bg-transparent outline-none focus:text-blue-600" 
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
                            
                            <button onClick={() => setMappingRules([...mappingRules, {kw: "NEW KEYWORD", led: "New Ledger"}])} className="w-full py-3 bg-gray-50/80 hover:bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest transition-all flex items-center justify-center border-t border-gray-200">
                                <AddIcon className="w-4 h-4 mr-1" /> Add New Custom Mapping Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
