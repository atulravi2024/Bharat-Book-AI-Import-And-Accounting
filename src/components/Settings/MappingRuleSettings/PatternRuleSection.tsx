
import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";
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
  const { t } = useLanguage();  return (
        <div className="border-t border-gray-100 overflow-hidden dark:border-gray-800">
            <div className="flex items-center px-8 py-5 transition-colors hover:bg-gray-50 group dark:hover:bg-gray-700">
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle('sectionPatternEnabled');
                    }} 
                    className={`${toggles.sectionPatternEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5 rounded-full relative cursor-pointer transition-all shrink-0 mr-4 shadow-sm`}
                >
                    <div className={`bg-white w-3.5 h-3.5 rounded-full absolute top-0.75 ${toggles.sectionPatternEnabled ? 'right-0.75' : 'left-0.75'} shadow-sm transition-all dark:bg-gray-800`}></div>
                </div>
                <button 
                    onClick={() => {
                        toggleSection();
                        if (!isOpen) {
                            if (!toggles.sectionPatternEnabled) handleToggle('sectionPatternEnabled');
                        }
                    }}
                    className={`flex-1 flex items-center justify-between font-bold text-sm uppercase tracking-widest outline-none ${isOpen ? 'text-blue-700' : 'text-gray-900'} ${!toggles.sectionPatternEnabled && 'opacity-50'} dark:text-white`}
                >
                    {t("Pattern Rule / Extraction")}
                    <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                </button>
            </div>
            {isOpen && (
                <div className={`py-8 bg-white border-t border-gray-50 ${!toggles.sectionPatternEnabled && 'opacity-50 pointer-events-none grayscale'} dark:bg-gray-800`}>
                    <div className="space-y-6">
                        {/* 1. Primary Extraction Rules */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2 dark:text-white dark:border-gray-700">{t("1. Primary Extraction Rules")}</h4>
                            <p className="text-xs text-gray-500 mb-6 font-medium dark:text-gray-400">{t("Configure how the system extracts the party name from the raw bank statement narrative.")}</p>
                            <div className="space-y-6 px-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Source Column")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1 dark:text-gray-400">{t("Select the primary text column from the bank statement used for matching and keyword extraction.")}</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700"
                                        value={sourceColumn}
                                        onChange={(e) => setSourceColumn(e.target.value)}
                                    >
                                        <option>{t("Narration")}</option>
                                        <option>{t("Description")}</option>
                                        <option>{t("Remarks")}</option>
                                        <option>{t("Particulars")}</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Split Delimiter")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1 dark:text-gray-400">{t("Character used to split the long narrative text into processable tokens (e.g., NEFT/PARTYNAME/REF).")}</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700"
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
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Ignore Keywords")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium dark:text-gray-400">{t("Terms to exclude before extracting the name")}</p>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700" 
                                        value={ignoreExtractionKeywords}
                                        onChange={(e) => setIgnoreExtractionKeywords(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Strip Entity Suffixes")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium dark:text-gray-400">{t("Automatically remove \"Pvt Ltd\", \"LLC\", \"Inc\" during match")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('stripEntitySuffixes')} className={`${toggles.stripEntitySuffixes ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.stripEntitySuffixes ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Extract Structural Components */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2 dark:text-white dark:border-gray-700">{t("2. Extract Structural Components")}</h4>
                            <p className="text-xs text-gray-500 mb-6 font-medium dark:text-gray-400">{t("Describe how, when, and where specific transaction entities (Party Name, UTR, Terminal) appear based on their structural tokens.")}</p>
                            
                            <div className="space-y-6 px-0">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Party Name Location")} <span className="px-2 py-0.5 ml-2 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg uppercase">{t("Where")}</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1 dark:text-gray-400">{t("Which structural token sequence typically contains the party name after splitting by delimiter?")}</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700"
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

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Reference / UTR Extractor")} <span className="px-2 py-0.5 ml-2 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg uppercase">{t("What")}</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-xs mt-1 dark:text-gray-400">{t("Determine how the 12-16 digit UTR or unique transaction references are extracted.")}</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700"
                                        value={utrExtractorType}
                                        onChange={(e) => setUtrExtractorType(e.target.value)}
                                    >
                                        <option>{t("12-16 Digit Alphanumeric Sequence")}</option>
                                        <option>After Keyword "REF/"</option>
                                        <option>After Keyword "UTR/"</option>
                                        <option>{t("Standard NEFT/RTGS/IMPS Pattern Matches")}</option>
                                        <option>Pattern Match (Smart Data Engine)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Account Number Detection")} <span className="px-2 py-0.5 ml-2 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg uppercase">{t("Source")}</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-xs mt-1 dark:text-gray-400">{t("Extract 9-18 digit bank account numbers from narration strings for party identification.")}</p>
                                    </div>
                                    <select 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700"
                                        value={accountNumberDetection}
                                        onChange={(e) => setAccountNumberDetection(e.target.value)}
                                    >
                                        <option>Enabled (9+ Digits anywhere)</option>
                                        <option>Prefix Match (AC/, A/C, ACC/)</option>
                                        <option>{t("End of String Only")}</option>
                                        <option>{t("Disabled")}</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Mobile Number Extractor")} <span className="px-2 py-0.5 ml-2 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-lg uppercase">{t("Contact")}</span></p>
                                        <p className="text-[10px] text-gray-500 font-medium dark:text-gray-400">Search for 10-digit Indian mobile numbers (UPI/IMPS logs)</p>
                                    </div>
                                    <div onClick={() => handleToggle('mobileNumberExtractor')} className={`${toggles.mobileNumberExtractor ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.mobileNumberExtractor ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* 3. Advanced Parsing (Regex) */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4 dark:border-gray-700">
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest dark:text-white">3. Advanced Parsing (Regex)</h4>
                                <div 
                                    onClick={() => setAdvancedParsingEnabled(!advancedParsingEnabled)}
                                    className={`${advancedParsingEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${advancedParsingEnabled ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-6 dark:text-gray-400">{t("Use custom Regular Expressions to enforce strict extraction rules based on bank formats.")}</p>
                            <div className={`${!advancedParsingEnabled && 'opacity-60 pointer-events-none'} space-y-4 transition-all`}>
                                <div className="form-field-wrapper">
<label className="form-label">{t("Regex Pattern")}</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-gray-200 rounded-lg text-xs font-mono p-3 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:border-gray-700" 
                                        defaultValue="(?<=UPI\/)[^\/]+"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono bg-white p-3 border border-gray-200 rounded-lg dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700">
                                    <span className="text-green-600 font-bold">Test:</span> "UPI/123456/JOHN DOE/HDFC" ➔ "123456"
                                </div>
                            </div>
                        </div>

                        {/* 4. Aggregation & Verification */}
                        <div className="bg-gray-50 p-8 border-y border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest border-b border-gray-200 pb-2 dark:text-white dark:border-gray-700">{t("4. Aggregation & Verification")}</h4>
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Payment Gateways to Skip")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium dark:text-gray-400">{t("Auto-route these transactions to default aggregators instead of creating new parties")}</p>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700" 
                                        defaultValue="RAZORPAY, PHONEPE, PAYTM, STRIPE"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">AI Context Matching (Fuzzy logic)</p>
                                        <p className="text-[10px] text-gray-500 font-medium dark:text-gray-400">{t("Use phonetic mapping to correct typos or slight variations")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('fuzzyLogic')} className={`${toggles.fuzzyLogic ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.fuzzyLogic ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Fuzzy Match Threshold")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium max-w-sm mt-1 dark:text-gray-400">{t("Strictness level for AI correlating narration strings to existing Tally party masters.")}</p>
                                    </div>
                                    <select className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-64 dark:bg-gray-800 dark:border-gray-700">
                                        <option>Very Strict (98%+ confidence level)</option>
                                        <option>Strict (95%+ match)</option>
                                        <option>Balanced (85%+ match)</option>
                                        <option>Loose (70%+ match)</option>
                                    </select>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-red-700">{t("Fallback Suspense Ledger")}</p>
                                        <p className="text-[10px] text-red-500 font-medium max-w-sm mt-1">{t("Auto-assign to this ledger if no rule matches and NLP extraction fails.")}</p>
                                    </div>
                                    <select className="bg-white border border-red-200 rounded-lg text-xs font-bold p-3 focus:ring-2 focus:ring-red-100 outline-none w-full md:w-64 text-red-700 dark:bg-gray-800">
                                        <option>{t("Unclassified Suspense")}</option>
                                        <option>{t("Suspense Receipts / Payments")}</option>
                                        <option>Bank Charges (Default)</option>
                                        <option>{t("Miscellaneous Debtor/Creditor")}</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{t("Continuous Machine Learning")}</p>
                                        <p className="text-[10px] text-gray-500 font-medium dark:text-gray-400">{t("Automatically learn rules when users perform manual corrections")}</p>
                                    </div>
                                    <div onClick={() => handleToggle('continuousLearning')} className={`${toggles.continuousLearning ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}>
                                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.continuousLearning ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Custom Aliases */}
                        <div className="mx-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-blue-900 text-sm">{t("Manage Custom Aliases & Rules")}</p>
                            </div>
                            <div className="flex gap-2">
                                <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const text = event.target?.result as string;
                                          const rows = text.split('\n').map(r => r.split(',').map(c => c.trim())).filter(r => r.length >= 2 && r[0] && r[1]);
                                          
                                          if (rows.length > 0) {
                                            const newAliases = rows.map(r => ({ from: r[0], to: r[1] }));
                                            setAliases(prev => [...prev, ...newAliases]);
                                            alert(`Successfully imported ${newAliases.length} rules from ${file.name}.`);
                                          } else {
                                            alert(`No valid mapping rules found in ${file.name}. Expected format: 'from,to'`);
                                          }
                                        }
                                        reader.readAsText(file);
                                        e.target.value = ''; // Reset
                                    }
                                }} />
                                <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm whitespace-nowrap dark:bg-gray-800">Import CSV (Aliases)</button>
                                <button onClick={() => setShowAliasModal(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">Manage Aliases ({aliases.length})</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAliasModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] dark:bg-gray-800 dark:border-gray-800">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 dark:border-gray-800">
                            <div>
                                <h3 className="font-black text-gray-900 text-lg tracking-tight dark:text-white">{t("Manage Custom Aliases")}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">{t("These take precedence over generic mapping rules.")}</p>
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
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 p-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:focus:bg-gray-700"
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
                                                className="w-full bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 p-2.5 outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm dark:bg-gray-800"
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
                                    className="form-label w-full py-3 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:text-blue-600 rounded-xl tracking-widest transition-colors flex items-center justify-center gap-2 dark:border-gray-700 dark:text-gray-400"
                                >
                                    <AddIcon className="w-4 h-4" /> {t("Add New Alias Row")}
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end dark:bg-gray-900 dark:border-gray-800">
                            <button onClick={() => setShowAliasModal(false)} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors">
                                {t("Validate & Save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
