import React from 'react';
import { 
  Sparkles, ChevronRight, ArrowRight, RefreshCw, CheckCircle, 
  Database, ShieldCheck, Activity, Lock, Mail, LayoutGrid, 
  Clock, AlertTriangle 
} from 'lucide-react';

interface TrainerSegmentProps {
  t: (key: string) => string;
  selectedTrainerId: string;
  setSelectedTrainerId: (id: string) => void;
  testUserRole: string;
  setTestUserRole: (role: string) => void;
  selectedCol: string | null;
  matchedFields: Record<string, string>;
  sampleColumns: string[];
  targetFields: Array<{ key: string; label: string }>;
  handleDragCol: (col: string) => void;
  handlePairFields: (fieldKey: string) => void;
  resetSimulator: () => void;
  rawNarration: string;
  setRawNarration: (narration: string) => void;
  cleanUPI: boolean;
  cleanCHQ: boolean;
  cleansedIgnore: string;
  aiEngine: string;
  aiTemperature: number;
  simulatedTime: string;
  workStart: string;
  workEnd: string;
  gstinValue: string;
  compiledSimVoucher: () => string;
  compileCleansedNarrationOutput: () => string;
  getSimulatedAiMatchingOutput: () => { confidence: number; duration: string; response: string };
  getWorkingHoursSimulationStatus: () => { allowed: boolean; text: string };
  getGSTINStateCodeSimulation: () => string;
}

export const TrainerSegment: React.FC<TrainerSegmentProps> = ({
  t,
  selectedTrainerId,
  setSelectedTrainerId,
  testUserRole,
  setTestUserRole,
  selectedCol,
  matchedFields,
  sampleColumns,
  targetFields,
  handleDragCol,
  handlePairFields,
  resetSimulator,
  rawNarration,
  setRawNarration,
  cleanUPI,
  cleanCHQ,
  cleansedIgnore,
  aiEngine,
  aiTemperature,
  simulatedTime,
  workStart,
  workEnd,
  gstinValue,
  compiledSimVoucher,
  compileCleansedNarrationOutput,
  getSimulatedAiMatchingOutput,
  getWorkingHoursSimulationStatus,
  getGSTINStateCodeSimulation,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-8 space-y-4">
        
        {/* Feature 1: Mapping Trainer */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'mapping' ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'mapping' ? '' : 'mapping')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'mapping' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-blue-600'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Map Trainer Simulator")}</h4>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">{t("Learn interactive sheet alignments")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'mapping' ? 'rotate-90 text-blue-500' : ''}`} />
          </button>

          {selectedTrainerId === 'mapping' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200 space-y-4">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                {t("Before the system can extract ledger records from Excel/CSV files, it matches sheet column names to internal accounting fields. Click a statement column on the left block then pair it on the ERP target list below to simulate:")}
              </p>

              <div className="border border-indigo-150/40 dark:border-indigo-900/30 bg-slate-50/50 dark:bg-gray-900/40 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-2 font-sans">
                    {t("Choose a Statement column:")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleColumns.map(col => {
                      const isMatched = !!matchedFields[col];
                      const isSelected = selectedCol === col;
                      return (
                        <button
                          key={col}
                          onClick={() => handleDragCol(col)}
                          disabled={isMatched}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-transparent scale-105 shadow-sm shadow-indigo-100' 
                              : isMatched 
                                ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 border-emerald-100 dark:border-emerald-900/40' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                          }`}
                        >
                          {col} {isMatched ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-2 font-sans">
                    {t("Select matching ERP target field:")}
                  </label>
                  <div className="space-y-1.5">
                    {targetFields.map(field => {
                      const matchedColumn = Object.keys(matchedFields).find(k => matchedFields[k] === field.key);
                      const isTargetMatched = !!matchedColumn;
                      return (
                        <button
                          key={field.key}
                          onClick={() => handlePairFields(field.key)}
                          disabled={!selectedCol || isTargetMatched}
                          className={`w-full p-2.5 rounded-lg text-left text-[12px] font-semibold flex items-center justify-between border transition-all ${
                            isTargetMatched 
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-600 border-emerald-150'
                              : selectedCol 
                                ? 'bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-slate-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-dashed border-indigo-200 animate-pulse' 
                                : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          <span>{field.label}</span>
                          {isTargetMatched ? (
                            <span className="text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded-sm text-emerald-700 uppercase">
                              ← {matchedColumn}
                            </span>
                          ) : selectedCol ? (
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-100/50 dark:border-indigo-920 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {t("Mapped")} {Object.keys(matchedFields).length} {t("of")} {sampleColumns.length} {t("fields")}
                  </span>
                  {Object.keys(matchedFields).length > 0 && (
                    <button
                      onClick={resetSimulator}
                      className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> {t("Reset")}
                    </button>
                  )}
                </div>
              </div>

              {Object.keys(matchedFields).length === sampleColumns.length && (
                <div className="bg-emerald-500/10 border border-emerald-200 rounded-xl p-3.5 flex gap-2 text-emerald-700 dark:text-emerald-400 items-start animate-in zoom-in duration-300 mt-4">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider">{t("Perfect Alignment Learned!")}</p>
                    <p className="text-[10px] font-semibold leading-normal mt-0.5">
                      Bharat Book AI generates rules under **{"Mapping -> Mapping Rules"}** to save this alignment layout. Next uploads format instantly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Feature 2: Ledger Reconciliation */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'ledger' ? 'border-purple-200 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'ledger' ? '' : 'ledger')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'ledger' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-purple-600'}`}>
                <Database className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Ledger Reconciliation Trainer")}</h4>
                <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-0.5">{t("Learn how vouchers get mapped")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'ledger' ? 'rotate-90 text-purple-500' : ''}`} />
          </button>
          
          {selectedTrainerId === 'ledger' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                {t("The AI matches raw bank transaction narratives strings against your Chart of Accounts. Here, you can test how the matching logic works behind the scenes before uploading files.")}
              </p>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                   <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">{t("Raw Narration Input:")}</label>
                   <input 
                     type="text" 
                     value={rawNarration} 
                     onChange={(e) => setRawNarration(e.target.value)}
                     className="w-full rounded text-[13px] font-mono p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none flex items-center" 
                     placeholder="e.g. UPI/9812/DR-NET/CHQ/HDFC-OFFICE-RENT"
                   />
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-100 dark:border-purple-900">
                   <label className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400 block mb-2">{t("Simulated Neural Match Result:")}</label>
                   {rawNarration.toUpperCase().includes('RENT') ? (
                      <div className="flex items-center gap-2">
                         <CheckCircle className="w-4 h-4 text-emerald-500" />
                         <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200">{t("Office Rent Account (Indirect Expense)")}</span>
                         <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase shadow-sm">98% Match</span>
                      </div>
                   ) : rawNarration.toUpperCase().includes('UPI') ? (
                      <div className="flex items-center gap-2">
                         <CheckCircle className="w-4 h-4 text-blue-500" />
                         <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200">{t("Suspense / Undefined UPI (Current Asset)")}</span>
                         <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase shadow-sm">65% Match</span>
                      </div>
                   ) : (
                      <div className="flex items-center gap-2">
                         <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">{t("No strong match found. Requires manual mapping.")}</span>
                         <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-black uppercase shadow-sm">12% Match</span>
                      </div>
                   )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature 3: Security Rules */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'security' ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'security' ? '' : 'security')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'security' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-amber-600'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Security Rules Trainer")}</h4>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-0.5">{t("Simulate role access boundaries")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'security' ? 'rotate-90 text-amber-500' : ''}`} />
          </button>
          
          {selectedTrainerId === 'security' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                {t("Users have different permission layers when dealing with vouchers, masters, and settings. Simulate access levels by switching the active user role below.")}
              </p>
              
              <div className="mb-4">
                 <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">{t("Simulate Active Role:")}</label>
                 <div className="flex gap-2">
                    {['Accountant', 'Manager', 'Administrator'].map(role => (
                       <button 
                         key={role}
                         onClick={() => setTestUserRole(role)}
                         className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === role ? 'bg-amber-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                       >
                         {t(role)}
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-2">
                 <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{t("Draft Vouchers")}</span>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">{t("Allowed")}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{t("Post Vouchers to Production")}</span>
                    {testUserRole === 'Accountant' ? (
                       <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-[10px] font-black uppercase">{t("Denied")}</span>
                    ) : (
                       <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">{t("Allowed")}</span>
                    )}
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{t("Modify GST / System Settings")}</span>
                    {testUserRole === 'Administrator' ? (
                       <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">{t("Allowed")}</span>
                    ) : (
                       <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-[10px] font-black uppercase">{t("Denied")}</span>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>


        {/* Feature 4: Confidence Score Threshold */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'confidence' ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'confidence' ? '' : 'confidence')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'confidence' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-emerald-600'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("AI Confidence Thresholds")}</h4>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Auto-Approval Logic")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'confidence' ? 'rotate-90 text-emerald-500' : ''}`} />
          </button>
          
          {selectedTrainerId === 'confidence' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                {t("The AI engine assigns a confidence score to every ledger prediction. If the score is higher than your firm's threshold, it goes to \"Auto-Approve\". Otherwise, it routes to \"Requires Manual Review\".")}
              </p>
              
              <div className="mb-4">
                 <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate System Threshold:</label>
                 <div className="flex gap-2 mb-4">
                    {[50, 75, 90, 95].map(threshold => (
                       <button 
                         key={threshold}
                         onClick={() => setTestUserRole(`Threshold${threshold}`)}
                         className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === `Threshold${threshold}` ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-650 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                       >
                         {threshold}%
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { txt: 'HDFC BANK FUND TRANSFER', score: 98 },
                  { txt: 'AMAZON WEB SERVICES CC ENDING 4022', score: 85 },
                  { txt: 'SWIGGY FOOD ORDER', score: 65 },
                  { txt: 'CASH DEPOSIT BRANCH 1234', score: 45 },
                ].map(mockTx => {
                   const currentThreshMatch = testUserRole.startsWith('Threshold') ? parseInt(testUserRole.replace('Threshold', '')) : 75;
                   const isApproved = mockTx.score >= currentThreshMatch;
                   return (
                     <div key={mockTx.txt} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div>
                           <div className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{mockTx.txt}</div>
                           <div className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">Score: {mockTx.score}%</div>
                        </div>
                        {isApproved ? (
                           <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase shadow-sm">{t("Auto-Approve")}</span>
                        ) : (
                           <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase shadow-sm">{t("Manual Review")}</span>
                        )}
                     </div>
                   );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Feature 5: Shift Boundaries Simulator */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'shift' ? 'border-fuchsia-200 dark:border-fuchsia-900/50 bg-fuchsia-50/20 dark:bg-fuchsia-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'shift' ? '' : 'shift')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'shift' ? 'bg-fuchsia-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-fuchsia-600'}`}>
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Shift Constraint Simulator")}</h4>
                <p className="text-[10px] text-fuchsia-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Temporal Access Rules")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'shift' ? 'rotate-90 text-fuchsia-500' : ''}`} />
          </button>
          
          {selectedTrainerId === 'shift' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                {t("The enterprise shield enforces shift constraints (e.g. 09:00 to 18:00 on Weekdays only). Test how the application responds when attempting to post vouchers outside simulated operational hours.")}
              </p>
              
              <div className="mb-4">
                 <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate Current Time:</label>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { label: 'Weekday 10:00 AM', val: 'wd_10am' },
                      { label: 'Weekday 07:30 PM', val: 'wd_730pm' },
                      { label: 'Sunday 02:00 PM', val: 'we_2pm' },
                    ].map(st => (
                       <button 
                         key={st.val}
                         onClick={() => setTestUserRole(st.val)}
                         className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === st.val ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                       >
                         {st.label}
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-4 pt-2 border-t border-fuchsia-100 dark:border-fuchsia-900 border-dashed">
                {testUserRole === 'wd_10am' || (!['wd_10am', 'wd_730pm', 'we_2pm'].includes(testUserRole)) ? (
                   <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Shift Active")}</div>
                        <div className="text-[11px] mt-1 font-semibold">{t("User can post entries, mapping rules, and run auto-imports smoothly. Full API access is granted.")}</div>
                      </div>
                   </div>
                ) : testUserRole === 'wd_730pm' ? (
                   <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-start gap-3">
                      <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("After-Hours Boundary Hit")}</div>
                        <div className="text-[11px] mt-1 font-semibold">Access restricted. System generates an Audit Incident log (Severity: Medium) - "Posting attempt outside user shift."</div>
                      </div>
                   </div>
                ) : (
                   <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Weekend Lockdown Active")}</div>
                        <div className="text-[11px] mt-1 font-semibold">{t("The UI falls into Read-Only mode. High-Security lockdown triggered for weekend.")}</div>
                      </div>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feature 6: Notification Routing Simulator */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'notifications' ? 'border-sky-200 dark:border-sky-900/50 bg-sky-50/20 dark:bg-sky-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'notifications' ? '' : 'notifications')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'notifications' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-sky-600'}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Alert Routing Simulator")}</h4>
                <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Auto-Email Dispatches")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'notifications' ? 'rotate-90 text-sky-500' : ''}`} />
          </button>
          
          {selectedTrainerId === 'notifications' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                {t("The platform automatically dispatches emails to management upon large volume imports or suspicious voucher creation. Test the routing logic here.")}
              </p>
              
              <div className="mb-4">
                 <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate System Event:</label>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { label: 'Bulk Import 500+', val: 'event_bulk' },
                      { label: 'Nightly Sync Complete', val: 'event_sync' },
                      { label: 'High-Value Voucher Detected', val: 'event_highval' },
                    ].map(st => (
                       <button 
                         key={st.val}
                         onClick={() => setTestUserRole(st.val)}
                         className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === st.val ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-605 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                       >
                         {st.label}
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-4 pt-2 border-t border-sky-100 dark:border-sky-900 border-dashed">
                {testUserRole === 'event_bulk' ? (
                   <div className="p-3 rounded-lg border border-sky-200 bg-sky-50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-400 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Email Routed: Admin Team")}</div>
                        <div className="text-[11px] mt-1 font-semibold">Subject: "Bulk Import Alert: 500+ records successfully mapped."</div>
                      </div>
                   </div>
                ) : testUserRole === 'event_sync' ? (
                   <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                      <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Silent Notification")}</div>
                        <div className="text-[11px] mt-1 font-semibold">{t("Logged to Audit table, no emails dispatched per preference settings.")}</div>
                      </div>
                   </div>
                ) : testUserRole === 'event_highval' ? (
                   <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Email Routed: Finance Directors")}</div>
                        <div className="text-[11px] mt-1 font-semibold">Subject: "CRITICAL: High-Value Voucher over threshold requires multi-signature."</div>
                      </div>
                   </div>
                ) : (
                   <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                      <div className="text-[11px] font-bold uppercase tracking-wider">{t("Select an event")}</div>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Feature 7: Validation Schema Simulator */}
        <div className={`border rounded-lg transition-colors ${selectedTrainerId === 'validation' ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50/20 dark:bg-orange-900/10' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
          <button 
            onClick={() => setSelectedTrainerId(selectedTrainerId === 'validation' ? '' : 'validation')}
            className="w-full p-4 text-left flex items-start justify-between gap-3 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-md shadow-sm ${selectedTrainerId === 'validation' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-orange-600'}`}>
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-black uppercase text-gray-900 dark:text-white tracking-wider">{t("Validation Schema Simulator")}</h4>
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-0.5">{t("Test Ledger Data Integrity Checks")}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform shrink-0 ${selectedTrainerId === 'validation' ? 'rotate-90 text-orange-500' : ''}`} />
          </button>
          
          {selectedTrainerId === 'validation' && (
            <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mb-4">
                {t("The platform rejects invalid voucher lines. Test the JSON schema validation mechanisms used to reject corrupt CSV records.")}
              </p>
              
              <div className="mb-4">
                 <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Simulate Raw Record payload:</label>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { label: 'Valid Record', val: 'rec_valid' },
                      { label: 'Missing Amount', val: 'rec_noamt' },
                      { label: 'Date Out of Sync', val: 'rec_baddate' },
                    ].map(st => (
                       <button 
                         key={st.val}
                         onClick={() => setTestUserRole(st.val)}
                         className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${testUserRole === st.val ? 'bg-orange-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                       >
                         {st.label}
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-4 pt-2 border-t border-orange-100 dark:border-orange-900 border-dashed">
                {testUserRole === 'rec_valid' ? (
                   <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Record Passed")}</div>
                        <div className="text-[11px] mt-1 font-semibold">{t("Schema valid. The voucher is correctly formatted and goes into processing queue.")}</div>
                      </div>
                   </div>
                ) : testUserRole === 'rec_noamt' ? (
                   <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Schema Error: Missing Required Field")}</div>
                        <div className="text-[11px] mt-1 font-semibold">Row 45: property `amount` is undefined or non-numeric. Import paused.</div>
                      </div>
                   </div>
                ) : testUserRole === 'rec_baddate' ? (
                   <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider">{t("Constraint Error: Out of bounds")}</div>
                        <div className="text-[11px] mt-1 font-semibold">Row 112: The `txn_date` field is from a closed financial year (2020-2021). Rejected.</div>
                      </div>
                   </div>
                ) : (
                   <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                      <div className="text-[11px] font-bold uppercase tracking-wider">{t("Select a raw payload")}</div>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
      
      {/* Guidelines Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 space-y-3">
          <h4 className="text-[12px] font-bold uppercase text-gray-950 dark:text-white tracking-wider">{t("Useful checklists")}</h4>
          
          <div className="space-y-2">
            <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
              <Mail className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-gray-850 dark:text-white uppercase tracking-tight">{t("Email Recipient Audit")}</h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed mt-0.5">
                  {t("Periodically review who is receiving the \"High-Value Voucher\" alerts to ensure correct hierarchy.")}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
              <LayoutGrid className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-gray-855 dark:text-white uppercase tracking-tight">{t("Schema Error Review")}</h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed mt-0.5">
                  {t("Monitor schema constraints rejection rates to identify if user training on templates is required.")}
                </p>
              </div>
            </div>
            
            <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
              <Activity className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-gray-855 dark:text-white uppercase tracking-tight">{t("AI Confidence Checks")}</h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed mt-0.5">
                  {t("Routinely scan the \"Manual Review\" queue to train the AI and improve auto-approval precision.")}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
              <Lock className="w-3.5 h-3.5 text-fuchsia-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-gray-855 dark:text-white uppercase tracking-tight">{t("Shift Boundary Audit")}</h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-550 font-medium leading-relaxed mt-0.5">
                  {t("Verify incident logs frequently if users attempt to bypass temporal shift barriers during weekends.")}
                </p>
              </div>
            </div>
            
            <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
              <Database className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-gray-855 dark:text-white uppercase tracking-tight">{t("Ledger Auditing")}</h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed mt-0.5">
                  {t("Double-check counterparty invoice references before posting vouchers.")}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg flex gap-2.5 items-start">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-gray-[11px] text-gray-855 dark:text-white uppercase tracking-tight">{t("Security Bounds")}</h5>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed mt-0.5">
                  {t("Users restricted by timeframes cannot operate outside corporate hours.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
