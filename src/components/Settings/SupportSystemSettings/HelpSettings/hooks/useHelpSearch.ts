import { useState } from 'react';
import { ARTICLES } from "../constants/helpArticles";
import { FEATURES_LIST } from "../constants/featuresList";

export const useHelpSearch = () => {
  const [activeSegment, setActiveSegment] = useState<'faq' | 'explorer' | 'trainer'>(() => {
    try {
      const saved = localStorage.getItem('bharat_book_navigation_defaults');
      if (saved) {
        const { page, subPage, subSubPage } = JSON.parse(saved);
        if (page === 'settings' && subPage === 'help' && (subSubPage === 'faq' || subSubPage === 'explorer' || subSubPage === 'trainer')) {
          return subSubPage as 'faq' | 'explorer' | 'trainer';
        }
      }
    } catch (e) {}
    return 'explorer';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  // Explorer Tab State
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [explorerGroups, setExplorerGroups] = useState({ config: false, data: false, security: false });
  const toggleExpGroup = (g: 'config' | 'data' | 'security') => setExplorerGroups(p => ({ ...p, [g]: !p[g] }));
  const [testUserRole, setTestUserRole] = useState<string>('Accountant');

  // Interactive Trainer States
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [matchedFields, setMatchedFields] = useState<Record<string, string>>({});

  // 1. Voucher Numbering Simulator States
  const [simPrefix, setSimPrefix] = useState('BB-JV-');
  const [simPadding, setSimPadding] = useState(5);
  const [simStartSeq, setSimStartSeq] = useState(1);
  const [simSuffix, setSimSuffix] = useState('-2026');

  // 2. Bank Narration Cleanser States
  const [rawNarration, setRawNarration] = useState('UPI/9812/DR-NET/CHQ/HDFC-OFFICE-RENT');
  const [cleanUPI, setCleanUPI] = useState(true);
  const [cleanCHQ, setCleanCHQ] = useState(true);
  const [cleansedIgnore, setCleansedIgnore] = useState('DR-NET');

  // 3. AI confidence estimator States
  const [aiEngine, setAiEngine] = useState<'gemini' | '9router' | 'local'>('gemini');
  const [aiTemperature, setAiTemperature] = useState(0.2);

  // 4. Working hours simulator states
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('18:00');
  const [simulatedTime, setSimulatedTime] = useState('14:30');

  // 5. GSTIN State extractor
  const [gstinValue, setGstinValue] = useState('27AAAAA1111A1Z1');

  // 6. Theme and Layout Toggle
  const [simLayoutDensity, setSimLayoutDensity] = useState<'comfort' | 'compact'>('comfort');
  const [simInvoiceThemeColor, setSimInvoiceThemeColor] = useState('#2563eb');

  const sampleColumns = ['Tran Date', 'Chq No.', 'Particulars', 'Withdrawal (Dr)', 'Deposit (Cr)'];
  const targetFields = [
    { key: 'voucherDate', label: 'Voucher Date (Header)' },
    { key: 'chequeNumber', label: 'Cheque/Ref Number' },
    { key: 'particulars', label: 'Particulars / Party description' },
    { key: 'debit', label: 'Debit Amount' },
    { key: 'credit', label: 'Credit Amount' }
  ];

  const handleDragCol = (colName: string) => {
    setSelectedCol(colName);
  };

  const handlePairFields = (fieldKey: string) => {
    if (!selectedCol) return;
    setMatchedFields(prev => ({
      ...prev,
      [selectedCol]: fieldKey
    }));
    setSelectedCol(null);
  };

  const resetSimulator = () => {
    setMatchedFields({});
    setSelectedCol(null);
  };

  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === 'all') return matchesSearch;
    return art.category === selectedCategory && matchesSearch;
  });

  // Pick Selected Feature details
  const selectedFeature = FEATURES_LIST.find(f => f.id === selectedFeatureId) || FEATURES_LIST[0];

  // Compile Simulated Voucher Numbering
  const compiledSimVoucher = () => {
    const numericPart = String(simStartSeq).padStart(simPadding, '0');
    return `${simPrefix}${numericPart}${simSuffix}`;
  };

  // Compile Cleansed Narration outputs
  const compileCleansedNarrationOutput = () => {
    let result = rawNarration;
    if (cleanUPI) result = result.replace(/UPI\/\d*\/|UPI\//gi, '');
    if (cleanCHQ) result = result.replace(/CHQ\/\d*\/|CHQ\//gi, '');
    if (cleansedIgnore.trim()) {
      const escaped = cleansedIgnore.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b|${escaped}\\/?`, 'gi');
      result = result.replace(regex, '');
    }
    return result.replace(/\/+/g, '/').replace(/^\/|\/$/g, '').trim();
  };

  // Compile Simulated AI confidence score
  const getSimulatedAiMatchingOutput = () => {
    if (aiEngine === 'gemini') {
      const confidence = Math.round(98 - (aiTemperature * 15));
      return { confidence, duration: '45ms', response: 'Extremely Accurate (Neural Matching Rule Established)' };
    } else if (aiEngine === '9router') {
      const confidence = Math.round(92 - (aiTemperature * 20));
      return { confidence, duration: '120ms', response: 'High Accuracy (External API Cluster Routing)' };
    } else {
      return { confidence: 64, duration: '2ms', response: 'Medium Accuracy (Dictionary String Key Matching)' };
    }
  };

  // Compile Simulated working hours check
  const getWorkingHoursSimulationStatus = () => {
    const [simHr, simMin] = simulatedTime.split(':').map(Number);
    const [startHr, startMin] = workStart.split(':').map(Number);
    const [endHr, endMin] = workEnd.split(':').map(Number);

    const simTotal = simHr * 60 + simMin;
    const startTotal = startHr * 60 + startMin;
    const endTotal = endHr * 60 + endMin;

    if (simTotal >= startTotal && simTotal <= endTotal) {
      return { allowed: true, text: 'ACCESS GRANTED (Within Working Security Hours Bounds)' };
    } else {
      return { allowed: false, text: 'SECURITY VIOLATION! VOUCHERS LOCKED (Operational Security Clock Breach)' };
    }
  };

  // Compile GST state code details
  const getGSTINStateCodeSimulation = () => {
    const stateCode = gstinValue.trim().substring(0, 2);
    const statesMap: Record<string, string> = {
      '27': 'Maharashtra (MH)',
      '07': 'Delhi (DL)',
      '29': 'Karnataka (KA)',
      '33': 'Tamil Nadu (TN)',
      '09': 'Uttar Pradesh (UP)',
      '19': 'West Bengal (WB)',
      '24': 'Gujarat (GJ)'
    };
    return statesMap[stateCode] || 'Unknown State Code (Validates fallback tax rule mappings)';
  };

  return {
    activeSegment,
    setActiveSegment,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    expandedArticle,
    setExpandedArticle,
    selectedFeatureId,
    setSelectedFeatureId,
    selectedTrainerId,
    setSelectedTrainerId,
    explorerGroups,
    toggleExpGroup,
    testUserRole,
    setTestUserRole,
    selectedCol,
    setSelectedCol,
    matchedFields,
    setMatchedFields,
    simPrefix,
    setSimPrefix,
    simPadding,
    setSimPadding,
    simStartSeq,
    setSimStartSeq,
    simSuffix,
    setSimSuffix,
    rawNarration,
    setRawNarration,
    cleanUPI,
    setCleanUPI,
    cleanCHQ,
    setCleanCHQ,
    cleansedIgnore,
    setCleansedIgnore,
    aiEngine,
    setAiEngine,
    aiTemperature,
    setAiTemperature,
    workStart,
    setWorkStart,
    workEnd,
    setWorkEnd,
    simulatedTime,
    setSimulatedTime,
    gstinValue,
    setGstinValue,
    simLayoutDensity,
    setSimLayoutDensity,
    simInvoiceThemeColor,
    setSimInvoiceThemeColor,
    sampleColumns,
    targetFields,
    handleDragCol,
    handlePairFields,
    resetSimulator,
    filteredArticles,
    selectedFeature,
    compiledSimVoucher,
    compileCleansedNarrationOutput,
    getSimulatedAiMatchingOutput,
    getWorkingHoursSimulationStatus,
    getGSTINStateCodeSimulation,
  };
};
