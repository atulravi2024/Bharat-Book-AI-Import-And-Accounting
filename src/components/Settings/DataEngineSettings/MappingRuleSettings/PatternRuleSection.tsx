import React, { useState } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { 
    SlidersHorizontal, Layers, Code, Sparkles, ChevronUp, ChevronDown, 
    Terminal, ArrowUpRight, Activity, Cpu, Upload, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatternRuleSectionProps {
    isOpen: boolean;
    toggleSection?: () => void;
    toggles: any;
    handleToggle: (key: string) => void;
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
    searchTerm?: string;
}

export const PatternRuleSection: React.FC<PatternRuleSectionProps> = ({
    isOpen,
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
    searchTerm = ''
}) => {
    const { t } = useLanguage();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleAccordion = (key: string) => {
        setActiveAccordion(prev => {
            const next = prev === key ? null : key;
            if (next) localStorage.setItem('bharat_book_accordion_pattern', next);
            else localStorage.removeItem('bharat_book_accordion_pattern');
            return next;
        });
    };

    // Filter matching logic based on search query
    const isSectionVisible = (secKey: string) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase().trim();
        if (secKey === 'primary') {
            return t("1. Primary Extraction Rules").toLowerCase().includes(q) || 
                   sourceColumn.toLowerCase().includes(q) ||
                   splitDelimiter.toLowerCase().includes(q) ||
                   ignoreExtractionKeywords.toLowerCase().includes(q) ||
                   "source column split delimiter ignore keywords strip entity suffixes".includes(q);
        }
        if (secKey === 'structural') {
            return t("2. Extract Structural Components").toLowerCase().includes(q) || 
                   partyNameLocation.toLowerCase().includes(q) ||
                   utrExtractorType.toLowerCase().includes(q) ||
                   accountNumberDetection.toLowerCase().includes(q) ||
                   "party name location reference utr extractor account number detection mobile phone".includes(q);
        }
        if (secKey === 'advanced') {
            return t("3. Advanced Parsing (Regex)").toLowerCase().includes(q) || 
                   "regex pattern custom regular expression values match".includes(q);
        }
        if (secKey === 'aggregation') {
            return t("4. Aggregation & Verification").toLowerCase().includes(q) || 
                   "payment gateways to skip fuzzy logic matching strict threshold fallback suspense ledger continuous machine learning learning".includes(q);
        }
        return false;
    };

    const isPrimaryVisible = isSectionVisible('primary');
    const isPrimaryExpanded = activeAccordion === 'primary' || (Boolean(searchTerm) && isPrimaryVisible);

    const isStructuralVisible = isSectionVisible('structural');
    const isStructuralExpanded = activeAccordion === 'structural' || (Boolean(searchTerm) && isStructuralVisible);

    const isAdvancedVisible = isSectionVisible('advanced');
    const isAdvancedExpanded = activeAccordion === 'advanced' || (Boolean(searchTerm) && isAdvancedVisible);

    const isAggregationVisible = isSectionVisible('aggregation');
    const isAggregationExpanded = activeAccordion === 'aggregation' || (Boolean(searchTerm) && isAggregationVisible);

    return (
        <div className="animate-in fade-in duration-200">
            {/* Main Interactive Status Header Switch inside a padded block */}
            <div className="p-6 sm:p-8 pb-4 border-b border-gray-100 dark:border-gray-800/80 space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 p-5 rounded-xl">
                     <div className="flex items-center gap-3">
                          <SlidersHorizontal className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                               <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{t("RegEx Pattern Processing")}</h4>
                               <p className="text-[10px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">{t("Extract text tokens, reference numbers, and structures using intelligent formats.")}</p>
                          </div>
                     </div>
                     <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${toggles.sectionPatternEnabled ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-gray-100 text-gray-450 dark:bg-gray-800 dark:text-gray-500'}`}>
                               {toggles.sectionPatternEnabled ? t("Active") : t("Disabled")}
                          </span>
                          <div 
                               onClick={() => handleToggle('sectionPatternEnabled')} 
                               className={`${toggles.sectionPatternEnabled ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer shadow-inner transition-all shrink-0`}
                          >
                               <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.sectionPatternEnabled ? 'right-0.75' : 'left-0.75'}`}></div>
                          </div>
                     </div>
                </div>
            </div>

            {/* Accordion List - Grayed out & locked if pattern processing is disabled */}
            <div className={`divide-y divide-gray-100 dark:divide-gray-800 transition-all duration-300 ${
                !toggles.sectionPatternEnabled ? 'opacity-55 pointer-events-none grayscale' : ''
            }`}>
                
                {/* 1. Primary Extraction Rules */}
                {isPrimaryVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("primary")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Upload className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("1. Primary Extraction Rules")}
                                </h3>
                            </div>
                            {isPrimaryExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isPrimaryExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-5">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Configure how the system extracts the party name from the raw bank statement narrative.")}
                                        </p>

                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Source Column")}</p>
                                                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{t("Select the primary text column from the bank statement used for matching and keyword extraction.")}</p>
                                                </div>
                                                <select 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                                    value={sourceColumn}
                                                    onChange={(e) => setSourceColumn(e.target.value)}
                                                >
                                                    <option>{t("Narration")}</option>
                                                    <option>{t("Description")}</option>
                                                    <option>{t("Remarks")}</option>
                                                    <option>{t("Particulars")}</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Split Delimiter")}</p>
                                                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{t("Character used to split the long narrative text into processable tokens (e.g., NEFT/PARTYNAME/REF).")}</p>
                                                </div>
                                                <select 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105 cursor-pointer"
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

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Ignore Keywords")}</p>
                                                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{t("Exclude these common transaction details (comma-delimited) before parsing raw text names.")}</p>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105" 
                                                    value={ignoreExtractionKeywords}
                                                    onChange={(e) => setIgnoreExtractionKeywords(e.target.value)}
                                                />
                                            </div>

                                            <div className="py-3.5 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-850 dark:text-gray-200">{t("Strip Entity Suffixes")}</p>
                                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Automatically remove \"Pvt Ltd\", \"LLC\", \"Inc\" to map corresponding corporate bank transactions together.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('stripEntitySuffixes')} 
                                                    className={`${toggles.stripEntitySuffixes ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.stripEntitySuffixes ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 2. Extract Structural Components */}
                {isStructuralVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("structural")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <Layers className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("2. Extract Structural Components")}
                                </h3>
                            </div>
                            {isStructuralExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isStructuralExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                            {t("Describe how, when, and where transaction metadata (Party Name, UTR, Terminal) appear based on narrative structures.")}
                                        </p>

                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Party Name Location")} <span className="px-2 py-0.5 ml-2 bg-blue-55 text-blue-600 text-[9px] font-black rounded uppercase">Where</span></p>
                                                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{t("Which structural token typically contains the party name after splitting by delimiter?")}</p>
                                                </div>
                                                <select 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105"
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

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Reference / UTR Extractor")} <span className="px-2 py-0.5 ml-2 bg-indigo-55 text-indigo-650 text-[9px] font-black rounded uppercase">What</span></p>
                                                    <p className="text-[10px] text-gray-455 dark:text-gray-400 mt-0.5">{t("Determine how the 12-16 digit UTR or unique transaction references are extracted.")}</p>
                                                </div>
                                                <select 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105"
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

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Account Number Detection")} <span className="px-2 py-0.5 ml-2 bg-green-55 text-green-700 text-[9px] font-black rounded uppercase">Source</span></p>
                                                    <p className="text-[10px] text-gray-455 dark:text-gray-400 mt-0.5">{t("Extract 9-18 digit bank account numbers from narration strings for party identification.")}</p>
                                                </div>
                                                <select 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105"
                                                    value={accountNumberDetection}
                                                    onChange={(e) => setAccountNumberDetection(e.target.value)}
                                                >
                                                    <option>Enabled (9+ Digits anywhere)</option>
                                                    <option>Prefix Match (AC/, A/C, ACC/)</option>
                                                    <option>{t("End of String Only")}</option>
                                                    <option>{t("Disabled")}</option>
                                                </select>
                                            </div>

                                            <div className="py-3.5 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-850 dark:text-gray-200">{t("Mobile Number Extractor")} <span className="px-2 py-0.5 ml-2 bg-orange-55 text-orange-655 text-[9px] font-black rounded uppercase">Contact</span></p>
                                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Search for 10-digit Indian mobile numbers inside standard UPI, IMPS, or SMS bank transfers.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('mobileNumberExtractor')} 
                                                    className={`${toggles.mobileNumberExtractor ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.mobileNumberExtractor ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 3. Advanced Parsing (Regex) */}
                {isAdvancedVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("advanced")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                    <Terminal className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("3. Advanced Parsing (Regex)")}
                                </h3>
                            </div>
                            {isAdvancedExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isAdvancedExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <div className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-900 p-3 rounded-xl border border-gray-150 dark:border-gray-800 mb-2">
                                             <div>
                                                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Regular Expression Direct Override")}</p>
                                                  <p className="text-[10px] text-gray-500">{t("Directly intercept narratives with custom regex string rules.")}</p>
                                             </div>
                                             <div 
                                                  onClick={() => setAdvancedParsingEnabled(!advancedParsingEnabled)}
                                                  className={`${advancedParsingEnabled ? 'bg-blue-600' : 'bg-gray-300'} w-10 h-5.5 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-all`}
                                             >
                                                  <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 ${advancedParsingEnabled ? 'right-0.75' : 'left-0.75'} shadow-sm transition-all dark:bg-gray-800`}></div>
                                             </div>
                                        </div>

                                        <div className={`${!advancedParsingEnabled && 'opacity-55 pointer-events-none grayscale'} space-y-4 transition-all duration-200`}>
                                            <div>
                                                 <label className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">{t("Regex Pattern Definition")}</label>
                                                 <input 
                                                     type="text" 
                                                     className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono p-3 px-3.5 focus:ring-2 focus:ring-blue-105 outline-none mt-1" 
                                                     defaultValue="(?<=UPI\/)[^\/]+"
                                                 />
                                            </div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono bg-blue-50/20 dark:bg-blue-900/5 p-3 px-4 border border-blue-100/30 dark:border-blue-900/10 rounded-xl">
                                                <span className="text-green-600 dark:text-green-400 font-bold">Simulator Test:</span>
                                                <span>"UPI/123456/JOHN DOE/HDFC"</span>
                                                <span className="text-gray-400">➔</span>
                                                <span className="text-blue-600 dark:text-blue-400 font-bold">"123456"</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* 4. Aggregation & Verification */}
                {isAggregationVisible && (
                    <div className="overflow-hidden">
                        <button
                            onClick={() => toggleAccordion("aggregation")}
                            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors text-left font-bold outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                                    <Sparkles className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {t("4. Aggregation & Verification")}
                                </h3>
                            </div>
                            {isAggregationExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <AnimatePresence initial={false}>
                            {isAggregationExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 sm:px-8 bg-white dark:bg-gray-850 space-y-4">
                                        <div className="space-y-4">
                                            
                                            {/* Gateways to Skip */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t("Payment Gateways to Skip")}</p>
                                                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{t("Auto-route these transactions directly to default aggregators instead of creating unmapped parties.")}</p>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105" 
                                                    defaultValue="RAZORPAY, PHONEPE, PAYTM, STRIPE"
                                                />
                                            </div>

                                            {/* AI Context Matching Toggle */}
                                            <div className="py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 pb-1">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-850 dark:text-gray-200">{t("Phonetic / Fuzzy Match NLP")}</p>
                                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Map narrated string variations (e.g. 'Johan D' vs 'John Doe') onto Tally party ledger masters automatically.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('fuzzyLogic')} 
                                                    className={`${toggles.fuzzyLogic ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.fuzzyLogic ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>

                                            {/* Fuzzy Matching Threshold */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-gray-110 dark:border-gray-800">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-855 dark:text-gray-200">{t("Fuzzy Match Threshold")}</p>
                                                    <p className="text-[10px] text-gray-450 dark:text-gray-400 mt-0.5">{t("Level of minimum string similarity required before auto-correlating narration text to Tally masters.")}</p>
                                                </div>
                                                <select className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-105 cursor-pointer">
                                                    <option>Very Strict (98%+ confidence level)</option>
                                                    <option>Strict (95%+ match)</option>
                                                    <option>Balanced (85%+ match)</option>
                                                    <option>Loose (70%+ match)</option>
                                                </select>
                                            </div>

                                            {/* Fallback Suspense Ledger */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div>
                                                    <p className="text-xs font-bold text-red-700">{t("Fallback Suspense Ledger")}</p>
                                                    <p className="text-[10px] text-red-500 mt-0.5">{t("Default suspense voucher account when all other regex patterns fail to extract or match mappings.")}</p>
                                                </div>
                                                <select className="bg-white dark:bg-gray-950 border border-red-200 dark:border-gray-750 text-red-700 rounded-xl text-xs font-bold p-3 outline-none w-full md:w-64 focus:ring-2 focus:ring-red-105 cursor-pointer font-bold">
                                                    <option>{t("Unclassified Suspense")}</option>
                                                    <option>{t("Suspense Receipts / Payments")}</option>
                                                    <option>Bank Charges (Default)</option>
                                                    <option>{t("Miscellaneous Debtor/Creditor")}</option>
                                                </select>
                                            </div>

                                            {/* Continuous Machine Learning */}
                                            <div className="py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 pb-1">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-850 dark:text-gray-200">{t("Continuous Feedback Learning")}</p>
                                                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5 dark:text-gray-400">
                                                        {t("Accumulate user manual overrides to create self-adjusting regex exceptions over time.")}
                                                    </p>
                                                </div>
                                                <div 
                                                    onClick={() => handleToggle('continuousLearning')} 
                                                    className={`${toggles.continuousLearning ? 'bg-blue-600' : 'bg-gray-250 dark:bg-gray-700'} w-11 h-5.5 rounded-full relative cursor-pointer transition-all shrink-0`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full absolute top-0.75 shadow transition-all ${toggles.continuousLearning ? 'right-0.75' : 'left-0.75'}`}></div>
                                                </div>
                                            </div>
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
