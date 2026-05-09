
import React from 'react';
import { AddIcon, DeleteIcon } from '../../icons/IconComponents';

interface PatternRuleSectionProps {
    isOpen: boolean;
    toggleSection: () => void;
    toggles: any;
    handleToggle: (key: string) => void;
    showAliasModal: boolean;
    sourceColumn: string;
    setSourceColumn: (val: string) => void;
    splitDelimiter: string;
    setSplitDelimiter: (val: string) => void;
    ignoreExtractionKeywords: string;
    setIgnoreExtractionKeywords: (val: string) => void;
    partyNameLocation: string;
    setPartyNameLocation: (val: string) => void;
    utrExtractorType: string;
    setUtrExtractorType: (val: string) => void;
    accountNumberDetection: string;
    setAccountNumberDetection: (val: string) => void;
    advancedParsingEnabled: boolean;
    setAdvancedParsingEnabled: (val: boolean) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    aliases: {from: string, to: string}[];
    setAliases: (aliases: any) => void;
    setShowAliasModal: (show: boolean) => void;
}

export const PatternRuleSection: React.FC<PatternRuleSectionProps> = ({
    isOpen,
    toggleSection,
    toggles,
    handleToggle,
    sourceColumn,
    setSourceColumn,
    splitDelimiter,
    setSplitDelimiter,
    ignoreExtractionKeywords,
    setIgnoreExtractionKeywords,
    partyNameLocation,
    setPartyNameLocation,
    utrExtractorType,
    setUtrExtractorType,
    accountNumberDetection,
    setAccountNumberDetection,
    advancedParsingEnabled,
    setAdvancedParsingEnabled,
    fileInputRef,
    aliases,
    setAliases,
    setShowAliasModal,
    showAliasModal
}) => {
    return (
        <div className="border-t border-gray-100 overflow-hidden">
            <div className="flex items-center px-8 py-5 transition-colors hover:bg-gray-50 group">
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle('sectionPatternEnabled');
                    }} 
                    className={`${toggles.sectionPatternEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0 mr-4 shadow-sm`}
                >
                    <div className={`bg-white w-3.5 h-3.5 rounded-full absolute top-0.75 ${toggles.sectionPatternEnabled ? 'right-0.75' : 'left-0.75'} shadow-sm transition-all`}></div>
                </div>
                <button 
                    onClick={() => {
                        toggleSection();
                        if (!isOpen) {
                            if (!toggles.sectionPatternEnabled) handleToggle('sectionPatternEnabled');
                        }
                    }}
                    className={`flex-1 flex items-center justify-between font-bold text-sm uppercase tracking-widest outline-none ${isOpen ? 'text-blue-700' : 'text-gray-900'} ${!toggles.sectionPatternEnabled && 'opacity-50'}`}
                >
                    Pattern Rule / Extraction
                    <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                </button>
            </div>
            {isOpen && (
                <div className={`py-8 bg-white border-t border-gray-50 ${!toggles.sectionPatternEnabled && 'opacity-50 pointer-events-none grayscale'}`}>
                    <div className="space-y-6">
                        {/* 1. Primary Extraction Rules */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">1. Primary Extraction Rules</h4>
                            <p className="text-xs text-gray-500 mb-6 font-medium">Configure how the system extracts the party name from the raw bank statement narrative.</p>
                            <div className="space-y-6 px-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Source Column</p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1">Select the primary text column from the bank statement used for matching and keyword extraction.</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64"
                                        value={sourceColumn}
                                        onChange={(e) => setSourceColumn(e.target.value)}
                                    >
                                        <option>Narration</option>
                                        <option>Description</option>
                                        <option>Remarks</option>
                                        <option>Particulars</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Split Delimiter</p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1">Character used to split the long narrative text into processable tokens (e.g., NEFT/PARTYNAME/REF).</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64"
                                        value={splitDelimiter}
                                        onChange={(e) => setSplitDelimiter(e.target.value)}
                                    >
                                        <option value="/">Forward Slash ( / )</option>
                                        <option value="-">Hyphen ( - )</option>
                                        <option value="@">At Symbol ( @ )</option>
                                        <option value="|">Pipe ( | )</option>
                                        <option value=",">Comma ( , )</option>
                                        <option value=" ">Space ( )</option>
                                    </select>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Ignore Keywords</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Terms to exclude before extracting the name</p>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64" 
                                        value={ignoreExtractionKeywords}
                                        onChange={(e) => setIgnoreExtractionKeywords(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Strip Entity Suffixes</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Automatically remove "Pvt Ltd", "LLC", "Inc" during match</p>
                                    </div>
                                    <div onClick={() => handleToggle('stripEntitySuffixes')} className={`${toggles.stripEntitySuffixes ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.stripEntitySuffixes ? 'right-1' : 'left-1'} shadow-sm transition-all`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Extract Structural Components */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">2. Extract Structural Components</h4>
                            <p className="text-xs text-gray-500 mb-6 font-medium">Describe how, when, and where specific transaction entities (Party Name, UTR, Terminal) appear based on their structural tokens.</p>
                            
                            <div className="space-y-6 px-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Party Name Location <span className="px-2 py-0.5 ml-2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg uppercase">Where</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1">Which structural token sequence typically contains the party name after splitting by delimiter?</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64"
                                        value={partyNameLocation}
                                        onChange={(e) => setPartyNameLocation(e.target.value)}
                                    >
                                        <option>Auto-Detect (AI Structural Parsing)</option>
                                        <option>Token 1 (First Value)</option>
                                        <option>Token 2 (Second Value after TRF)</option>
                                        <option>Token 3 (Third Value)</option>
                                        <option>Last Token (End of String)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Reference / UTR Extractor <span className="px-2 py-0.5 ml-2 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg uppercase">What</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-xs mt-1">Determine how the 12-16 digit UTR or unique transaction references are extracted.</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64"
                                        value={utrExtractorType}
                                        onChange={(e) => setUtrExtractorType(e.target.value)}
                                    >
                                        <option>12-16 Digit Alphanumeric Sequence</option>
                                        <option>After Keyword "REF/"</option>
                                        <option>After Keyword "UTR/"</option>
                                        <option>Standard NEFT/RTGS/IMPS Pattern Matches</option>
                                        <option>Pattern Match (Smart Data Engine)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Account Number Detection <span className="px-2 py-0.5 ml-2 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg uppercase">Source</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-xs mt-1">Extract 9-18 digit bank account numbers from narration strings for party identification.</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64"
                                        value={accountNumberDetection}
                                        onChange={(e) => setAccountNumberDetection(e.target.value)}
                                    >
                                        <option>Enabled (9+ Digits anywhere)</option>
                                        <option>Prefix Match (AC/, A/C, ACC/)</option>
                                        <option>End of String Only</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Mobile Number Extractor <span className="px-2 py-0.5 ml-2 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-lg uppercase">Contact</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium">Search for 10-digit Indian mobile numbers (UPI/IMPS logs)</p>
                                    </div>
                                    <div onClick={() => handleToggle('mobileNumberExtractor')} className={`${toggles.mobileNumberExtractor ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.mobileNumberExtractor ? 'right-1' : 'left-1'} shadow-sm transition-all`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* 3. Advanced Parsing (Regex) */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">3. Advanced Parsing (Regex)</h4>
                                <div 
                                    onClick={() => setAdvancedParsingEnabled(!advancedParsingEnabled)}
                                    className={`${advancedParsingEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${advancedParsingEnabled ? 'right-1' : 'left-1'} shadow-sm transition-all`}></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-6">Use custom Regular Expressions to enforce strict extraction rules based on bank formats.</p>
                            <div className={`${!advancedParsingEnabled && 'opacity-60 pointer-events-none'} space-y-4 transition-all`}>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Regex Pattern</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-gray-200 rounded-lg text-xs font-mono p-3 focus:ring-2 focus:ring-blue-100 outline-none" 
                                        defaultValue="(?<=UPI\/)[^\/]+"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono bg-white p-3 border border-gray-200 rounded-lg">
                                    <span className="text-green-600 font-bold">Test:</span> "UPI/123456/JOHN DOE/HDFC" ➔ "123456"
                                </div>
                            </div>
                        </div>

                        {/* 4. Aggregation & Verification */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">4. Aggregation & Verification</h4>
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Payment Gateways to Skip</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Auto-route these transactions to default aggregators instead of creating new parties</p>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64" 
                                        defaultValue="RAZORPAY, PHONEPE, PAYTM, STRIPE"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">AI Context Matching (Fuzzy logic)</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Use phonetic mapping to correct typos or slight variations</p>
                                    </div>
                                    <div onClick={() => handleToggle('fuzzyLogic')} className={`${toggles.fuzzyLogic ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.fuzzyLogic ? 'right-1' : 'left-1'} shadow-sm transition-all`}></div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Fuzzy Match Threshold</p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1">Strictness level for AI correlating narration strings to existing Tally party masters.</p>
                                    </div>
                                    <select className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64">
                                        <option>Very Strict (98%+ confidence level)</option>
                                        <option>Strict (95%+ match)</option>
                                        <option>Balanced (85%+ match)</option>
                                        <option>Loose (70%+ match)</option>
                                    </select>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-sm font-bold text-red-700">Fallback Suspense Ledger</p>
                                        <p className="text-[10px] text-red-500 font-medium max-w-sm mt-1">Auto-assign to this ledger if no rule matches and NLP extraction fails.</p>
                                    </div>
                                    <select className="bg-white border border-red-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-red-100 outline-none w-full md:w-64 text-red-700">
                                        <option>Unclassified Suspense</option>
                                        <option>Suspense Receipts / Payments</option>
                                        <option>Bank Charges (Default)</option>
                                        <option>Miscellaneous Debtor/Creditor</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">Continuous Machine Learning</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Automatically learn rules when users perform manual corrections</p>
                                    </div>
                                    <div onClick={() => handleToggle('continuousLearning')} className={`${toggles.continuousLearning ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.continuousLearning ? 'right-1' : 'left-1'} shadow-sm transition-all`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Custom Aliases */}
                        <div className="mx-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-blue-900 text-sm">Manage Custom Aliases & Rules</p>
                            </div>
                            <div className="flex gap-2">
                                <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        alert(`Simulated import of ${e.target.files[0].name} successful! 4 new aliases imported.`);
                                        setAliases([...aliases, { from: 'GOOGLE CLOUD', to: 'Google India Pvt Ltd' }, { from: 'AWS EMEA', to: 'Amazon Web Services' }]);
                                        e.target.value = ''; // Reset
                                    }
                                }} />
                                <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm whitespace-nowrap">Import CSV (Aliases)</button>
                                <button onClick={() => setShowAliasModal(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">Manage Aliases ({aliases.length})</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAliasModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="font-black text-gray-900 text-lg tracking-tight">Manage Custom Aliases</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">These take precedence over generic mapping rules.</p>
                            </div>
                            <button onClick={() => setShowAliasModal(false)} className="text-gray-400 hover:text-gray-600 p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="space-y-4">
                                {aliases.map((alias, idx) => (
                                    <div key={idx} className="flex gap-4 items-center group">
                                        <div className="flex-1">
                                            <input 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 p-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                                                value={alias.from}
                                                onChange={(e) => {
                                                    const newA = [...aliases];
                                                    newA[idx].from = e.target.value;
                                                    setAliases(newA);
                                                }}
                                                placeholder="Raw String (e.g., ZOMATO MEDIA)"
                                            />
                                        </div>
                                        <div className="text-gray-400 shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                className="w-full bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 p-2.5 outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                                                value={alias.to}
                                                onChange={(e) => {
                                                    const newA = [...aliases];
                                                    newA[idx].to = e.target.value;
                                                    setAliases(newA);
                                                }}
                                                placeholder="Mapped Party (e.g., Zomato Ltd)"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => setAliases(aliases.filter((_, i) => i !== idx))}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 shrink-0"
                                        >
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <button 
                                    onClick={() => setAliases([...aliases, { from: '', to: '' }])}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                >
                                    <AddIcon className="w-4 h-4" /> Add New Alias Row
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setShowAliasModal(false)} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors">
                                Validate & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
