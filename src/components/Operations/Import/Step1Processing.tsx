import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../context/LanguageContext';
import { VoucherType, ParsingSettings, ParsedVoucher } from '../../../app/types';
import { parseVoucherFile } from '../../../services/aiService';
import { 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileSpreadsheet, 
  Sliders, 
  Database, 
  Scale, 
  ExternalLink 
} from 'lucide-react';

interface Step1ProcessingProps {
  file: File | null;
  voucherType: VoucherType;
  mapping?: Record<string, string>;
  settings?: ParsingSettings;
  sourceBank?: string;
  partyMasters: any[];
  ledgerMasters: any[];
  onComplete: (vouchers: ParsedVoucher[]) => void;
  onCancel: () => void;
}

interface ProcessingStage {
  id: number;
  labelEn: string;
  labelHi: string;
  descEn: string;
  descHi: string;
  icon: React.ComponentType<any>;
}

export const Step1Processing: React.FC<Step1ProcessingProps> = ({
  file,
  voucherType,
  mapping,
  settings,
  sourceBank,
  partyMasters,
  ledgerMasters,
  onComplete,
  onCancel,
}) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeStageId, setActiveStageId] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  const fetchedRef = useRef(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const stages: ProcessingStage[] = [
    {
      id: 0,
      labelEn: "File Parsing & Metadata Read",
      labelHi: "फ़ाइल पार्सिंग और मेटाडाटा रीडिंग",
      descEn: "Analyzing files structure, sheet metadata & loading data stream",
      descHi: "फ़ाइल संरचना, शीट मेटाडाटा और डेटा स्ट्रीम लोड करने का विश्लेषण",
      icon: FileSpreadsheet
    },
    {
      id: 1,
      labelEn: "AI Header & Column Alignment",
      labelHi: "एआई हेडर और कॉलम मिलान",
      descEn: "Mapping extracted headers dynamically using custom settings schema",
      descHi: "कस्टम सेटिंग्स स्कीमा का उपयोग करके निकाले गए हेडर का मिलान",
      icon: Sliders
    },
    {
      id: 2,
      labelEn: "Ledger & Party Reconciliations",
      labelHi: "पार्टी और लेज़र मिलान",
      descEn: "Analyzing parties and ledger accounts against local Master databases",
      descHi: "स्थानीय मास्टर डेटाबेस के विरुद्ध पार्टियों और खाता विवरण का मिलान",
      icon: Database
    },
    {
      id: 3,
      labelEn: "Tax Rules & Discrepancy Audits",
      labelHi: "टैक्स नियम और विसंगति ऑडिट",
      descEn: "Computing tax rates, identifying duplicate records and low confidence lines",
      descHi: "टैक्स दरों की गणना, और कम-आत्मविश्वास वाली लाइनों की पहचान",
      icon: Scale
    },
    {
      id: 4,
      labelEn: "Compiling Structured Vouchers",
      labelHi: "संरचित वाउचर को कंपाइल करना",
      descEn: "Generating unified records and preparing data for correction review",
      descHi: "सुधार समीक्षा के लिए अंतिम डेटा सेट तैयार करना",
      icon: Cpu
    }
  ];

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle actual API call in background while running progress simulation
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${time}] ${msg}`]);
    };

    let parsedVouchersResult: ParsedVoucher[] = [];
    let isApiDone = false;
    let timerId: NodeJS.Timeout;

    addLog(isHindi ? "भारत बुक एआई इम्पोर्ट इंजन सक्रिय कर रहा है..." : "Initializing Bharat Book AI Import Engine...");
    addLog(isHindi ? `लक्ष्य दस्तावेज: ${file?.name || "नया दस्तावेज़"}` : `Target document: ${file?.name || "unnamed_document"}`);
    addLog(isHindi ? `वाउचर प्रकार: ${voucherType}` : `Voucher type: ${voucherType}`);

    // Trigger AI parsing call immediately
    const fetchApiData = async () => {
      try {
        if (!file) {
          throw new Error(isHindi ? "कोई फाइल अपलोड नहीं की गई है।" : "No file uploaded.");
        }

        const appSettingsStr = localStorage.getItem('bharat_book_app_settings');
        let finalSettings = settings || { ocrSensitivity: 75, aiModel: 'Gemini 1.5 Flash', experimentalFeatures: false, customInstructions: '' };
        
        if (appSettingsStr) {
          try {
            const appSettings = JSON.parse(appSettingsStr);
            finalSettings = {
              ...finalSettings,
              customMappingRules: appSettings.customMappingRules || [],
              bankShortCodes: appSettings.bankShortCodes,
              bankIgnoreWords: appSettings.bankIgnoreWords,
              paymentModes: appSettings.paymentModes,
              paymentChannels: appSettings.paymentChannels,
              ifscPrefixes: appSettings.ifscPrefixes
            };
          } catch (e) {
            console.error("Error merging settings", e);
          }
        }

        const result = await parseVoucherFile(file, voucherType, mapping, finalSettings, sourceBank, partyMasters, ledgerMasters);
        
        if (!result || result.length === 0) {
          throw new Error(isHindi ? "एआई इस फाइल में कोई वैध वाउचर नहीं ढूंढ सका।" : "AI could not parse any valid vouchers from the document.");
        }

        let prefix = 'VCH';
        if (voucherType === VoucherType.BankStatement) prefix = 'BANK';
        else if (voucherType === VoucherType.Purchase) prefix = 'PUR';
        else if (voucherType === VoucherType.Sales) prefix = 'SALE';
        else if (voucherType === VoucherType.Payment) prefix = 'PAY';
        else if (voucherType === VoucherType.Receipt) prefix = 'RCT';
        else if (voucherType === VoucherType.Journal) prefix = 'JRNL';
        else if (voucherType === VoucherType.Contra) prefix = 'CON';

        parsedVouchersResult = result.map((v, index) => ({
          ...v,
          tempImportId: `${prefix}-${(index + 1).toString().padStart(3, '0')}`
        }));

        isApiDone = true;
      } catch (err: any) {
        setProcessingError(err.message || (isHindi ? "प्रसंस्करण के दौरान एक अज्ञात त्रुटि आई।" : "An error occurred during parsing."));
      }
    };

    fetchApiData();

    // Visual loading simulations
    let progress = 0;
    let currentStage = 0;

    const runSimulation = () => {
      if (processingError) return;

      timerId = setTimeout(() => {
        if (isHindi) {
          if (progress === 0) {
            addLog("फ़ाइल बाइनरी और मेटाडाटा लोड हो रहा है...");
            addLog("कॉलम की जाँच की जा रही है...");
          }
          if (progress === 20) {
            currentStage = 1;
            setActiveStageId(1);
            setCompletedStages(prev => [...prev, 0]);
            addLog("उपयोगकर्ता-नियमों के आधार पर फ़ील्ड मैपिंग को सत्यापित किया जा रहा है...");
            if (mapping) addLog(`कस्टम मैपिंग लोड की गई: ${Object.keys(mapping).length} फ़ील्ड परिभाषित`);
          }
          if (progress === 40) {
            currentStage = 2;
            setActiveStageId(2);
            setCompletedStages(prev => [...prev, 1]);
            addLog("मास्टर डेटाबेस (Party & Ledger) के विरुद्ध खातों का मिलान जारी...");
            addLog(`${partyMasters.length} पार्टियां और ${ledgerMasters.length} लेज़र्स स्कैन किए जा रहे हैं...`);
          }
          if (progress === 60) {
            currentStage = 3;
            setActiveStageId(3);
            setCompletedStages(prev => [...prev, 2]);
            addLog("टैक्स नियमों (GST/CGST/SGST/IGST) और विसंगतियों की गणना...");
            addLog("संदिग्ध अथवा निम्न-विश्वास वाली प्रविष्टियों को चिन्हित किया जा रहा है...");
          }
          if (progress === 80) {
            currentStage = 4;
            setActiveStageId(4);
            setCompletedStages(prev => [...prev, 3]);
            addLog("अंतिम वाउचर डेटा बंडल को संरचित जेसन (JSON) प्रारूप में परिवर्तित किया जा रहा है...");
          }
        } else {
          // English logs
          if (progress === 0) {
            addLog("Reading Excel/CSV sheet rows & binary data stream...");
            addLog("Inspecting structure headers...");
          }
          if (progress === 20) {
            currentStage = 1;
            setActiveStageId(1);
            setCompletedStages(prev => [...prev, 0]);
            addLog("Mapping data columns against standard voucher schemas...");
            if (mapping) addLog(`Injected column map: ${Object.keys(mapping).length} fields configured`);
          }
          if (progress === 40) {
            currentStage = 2;
            setActiveStageId(2);
            setCompletedStages(prev => [...prev, 1]);
            addLog("Executing Master Database reconciliation scans...");
            addLog(`Querying matches across ${partyMasters.length} party profiles & ${ledgerMasters.length} general ledgers...`);
          }
          if (progress === 60) {
            currentStage = 3;
            setActiveStageId(3);
            setCompletedStages(prev => [...prev, 2]);
            addLog("Analyzing values against internal auditing protocols...");
            addLog("Verifying arithmetic totals, GST computations & low-confidence fields...");
          }
          if (progress === 80) {
            currentStage = 4;
            setActiveStageId(4);
            setCompletedStages(prev => [...prev, 3]);
            addLog("Compiling final structured JSON bundle & checking schema integrity...");
          }
        }

        // Increment progress smoothly
        if (progress < 95) {
          progress += 5;
          setOverallProgress(progress);
          runSimulation();
        } else {
          // Progress is near 95%, wait for the real API call to be done
          const checkCompletion = setInterval(() => {
            if (processingError) {
              clearInterval(checkCompletion);
              return;
            }
            if (isApiDone) {
              clearInterval(checkCompletion);
              setOverallProgress(100);
              setCompletedStages(prev => [...prev, 4]);
              addLog(isHindi ? "एआई प्रसंस्करण सफलतापूर्वक पूर्ण हुआ! वाउचर लोड हो रहे हैं..." : "AI processing completed successfully! Directing to correction screen...");
              setTimeout(() => {
                onComplete(parsedVouchersResult);
              }, 800);
            } else {
              // Still compiling - add dynamic waiting log
              addLog(isHindi ? "एआई मॉडल उत्तर का इंतज़ार किया जा रहा है (अधिकतम समय लग सकता है)..." : "Waiting for AI model deep parsing response (might take a moment)...");
            }
          }, 1000);
        }
      }, 200);
    };

    runSimulation();

    return () => {
      clearTimeout(timerId);
    };
  }, [file, voucherType, mapping, settings, sourceBank, partyMasters, ledgerMasters, isHindi, processingError]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between border-b pb-4 mb-6 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg dark:bg-indigo-950/40 dark:text-indigo-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isHindi ? "भारत बुक एआई इंजन प्रसंस्करण" : "Bharat Book AI Stepwise Processing"}
              </h2>
              <p className="text-gray-500 text-xs mt-0.5 dark:text-gray-400">
                {isHindi 
                  ? "एआई वास्तविक समय में फ़ाइल संरचना और मास्टर रिकॉर्ड्स का मिलान कर रहा है" 
                  : "AI is analyzing file columns, reconciling master entries & cleaning data"}
              </p>
            </div>
          </div>
          <div>
            <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-800 font-semibold rounded-full dark:bg-indigo-950 dark:text-indigo-300">
              {overallProgress}%
            </span>
          </div>
        </div>

        {processingError ? (
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-5 dark:bg-rose-950/20 dark:border-rose-900/30">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 dark:text-rose-400" />
              <div className="flex-1">
                <h4 className="font-bold text-rose-800 dark:text-rose-300">
                  {isHindi ? "प्रसंस्करण त्रुटि" : "Processing Fault"}
                </h4>
                <p className="text-sm text-rose-700 mt-1 dark:text-rose-400">
                  {processingError}
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {isHindi ? "वापस अपलोड करें" : "Return to Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>{isHindi ? "कुल प्रगति" : "Overall Audit Completion"}</span>
                <span className="font-mono">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
                <motion.div 
                  className="bg-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Stages Grid */}
            <div className="space-y-3">
              {stages.map((stage) => {
                const isCompleted = completedStages.includes(stage.id);
                const isProcessing = activeStageId === stage.id && !isCompleted;
                const StageIcon = stage.icon;

                return (
                  <div 
                    key={stage.id}
                    className={`flex items-start p-4 rounded-lg border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20' 
                        : isProcessing
                          ? 'bg-indigo-50/40 border-indigo-200 shadow-sm dark:bg-indigo-950/20 dark:border-indigo-900/40'
                          : 'bg-gray-50/50 border-gray-100 dark:bg-gray-900/25 dark:border-gray-800/50 opacity-60'
                    }`}
                  >
                    <div className="mr-4 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isProcessing ? (
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">{stage.id + 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <StageIcon className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : isProcessing ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <h4 className={`text-sm font-bold ${
                          isCompleted 
                            ? 'text-gray-850 dark:text-gray-200' 
                            : isProcessing 
                              ? 'text-indigo-900 dark:text-indigo-300' 
                              : 'text-gray-650 dark:text-gray-500'
                        }`}>
                          {isHindi ? stage.labelHi : stage.labelEn}
                        </h4>
                      </div>
                      <p className={`text-xs mt-0.5 ${
                        isCompleted 
                          ? 'text-gray-500 dark:text-gray-450' 
                          : isProcessing 
                            ? 'text-indigo-700 dark:text-indigo-400' 
                            : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {isHindi ? stage.descHi : stage.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Terminal Tech log window */}
      {!processingError && (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
          {/* Terminal Banner */}
          <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-300">
                {isHindi ? "एआई ऑडिट लाइव स्ट्रीम लॉग" : "AI Audit Live Log Pipeline"}
              </span>
            </div>
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
            </div>
          </div>

          {/* Log Window */}
          <div 
            ref={logContainerRef}
            className="p-4 h-48 overflow-y-auto font-mono text-xs text-emerald-400/90 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800"
          >
            {logs.length === 0 ? (
              <span className="text-slate-500 select-none">
                {isHindi ? "लॉग अनुक्रम लोड हो रहा है..." : "Establishing log sequences..."}
              </span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="leading-relaxed border-l-2 border-emerald-500/20 pl-2">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-450 px-2 select-none">
        <button 
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-150 transition-colors text-gray-700 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700/50"
        >
          {isHindi ? "रद्द करें और फ़ाइल बदलें" : "Cancel & Change File"}
        </button>
        <div className="flex items-center space-x-1.5 font-mono">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          <span>{isHindi ? "इंजन चालू है..." : "Bharat Engine Active"}</span>
        </div>
      </div>
    </div>
  );
};
