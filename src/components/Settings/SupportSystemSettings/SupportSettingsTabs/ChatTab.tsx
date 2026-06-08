import React, { useRef, useEffect } from 'react';
import { useLanguage } from "../../../../context/LanguageContext";
import { Send, Clock, Sparkles, Terminal, Trash2, Check, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ChatTab = ({
  chatMessages, isAiTyping, currentChatInput, setCurrentChatInput,
  handleSendChatMessage, handleClearChat, handleKeyPress, messagesEndRef
}: any) => {
  const { t } = useLanguage();
  return (
    <>
      {/* VIEW 1: AI DIAGNOSTIC CHAT */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[480px]">
            {/* Header */}
            <div className="h-12 px-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center p-[1px]">
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                      <Terminal className="w-3 h-3 text-indigo-500" />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{t("Chatbot")}</h3>
                  <p className="text-[9px] text-gray-500">Technical Analysis (Function and Feature)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                  <button 
                    onClick={handleClearChat}
                    className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                    title="Clear conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white dark:bg-gray-900 z-0 text-[12px]">
              {chatMessages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex flex-col gap-0.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-50 dark:bg-indigo-600 text-indigo-950 dark:text-white rounded-br-sm border border-indigo-100 dark:border-indigo-500/50' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200/50 dark:border-gray-700/50'
                    }`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-a:text-indigo-400">
                         {msg.sender === 'user' ? (
                            <div className={`whitespace-pre-wrap ${msg.sender==='user'?'text-indigo-950 dark:text-white':''}`}>{msg.text}</div>
                         ) : (
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                         )}
                      </div>
                      
                      {msg.diagnosticResults && (
                        <div className={`mt-2.5 space-y-1.5 border-t pt-2.5 ${msg.sender === 'user' ? 'border-indigo-200 dark:border-indigo-400/30' : 'border-gray-200 dark:border-gray-700'}`}>
                          {msg.diagnosticResults.map((diag: any, i: number) => (
                            <div key={i} className={`rounded-lg p-2 flex gap-2 border ${msg.sender === 'user' ? 'bg-white/50 border-indigo-200 dark:bg-indigo-700/50 dark:border-indigo-400' : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'}`}>

                               <span className={`shrink-0 mt-0.5 ${diag.passed ? 'text-emerald-500' : 'text-red-400'}`}>
                                 {diag.passed ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                               </span>
                               <div>
                                 <p className={`font-semibold text-[11px] leading-tight ${msg.sender==='user'?'text-indigo-950 dark:text-white':'text-gray-900 dark:text-white'}`}>{diag.testName}</p>
                                 {diag.recommendation && <p className={`text-[10px] mt-0.5 ${msg.sender==='user'?'text-indigo-700 dark:text-indigo-200':'text-gray-500 dark:text-gray-400'}`}>{diag.recommendation}</p>}
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 px-1 uppercase tracking-wider">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl rounded-bl-sm px-3 py-2.5 flex items-center gap-1 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-gray-50/50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0 flex flex-col gap-2 relative z-10">
              <div className="flex gap-1.5 px-0.5 pb-2 overflow-x-auto custom-scrollbar">
                {[
                  'How to create a new ledger?',
                  'Process for voucher entry',
                  'Generate GST report',
                  'How to reconcile bank statements?',
                  'Check system latency',
                  'Explain debit/credit defaults',
                  'Add multiple items in invoice',
                  'Manage user permissions',
                  'Database health and stats',
                  'Export ledger to Excel',
                  'Cancel generated e-way bill',
                  'Resolve ledger not found error',
                  'Configure voucher numbering',
                  'System integrity check',
                  'Track deleted vouchers',
                  'Auto-calculate IGST/CGST rules',
                  'Customize print invoice format',
                  'Multi-currency transactions',
                  'Manage inventory items',
                  'Check memory footprint',
                  'Set up daily email alerts',
                  'How to close financial year?',
                  'Form validation rules',
                ].map((txt, idx) => (
                   <button
                     key={idx}
                     onClick={() => handleSendChatMessage(txt)}
                     className="px-2.5 py-1 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-md whitespace-nowrap transition-colors shadow-sm"
                   >
                     {txt}
                   </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg p-1 focus-within:border-gray-400 dark:focus-within:border-gray-500 transition-colors shadow-sm">
                <input
                  type="text"
                  value={currentChatInput}
                  onChange={e => setCurrentChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChatMessage(currentChatInput)}
                  placeholder="Ask a technical query..."
                  className="flex-1 bg-transparent border-none outline-none text-[12px] px-2 font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400"
                />
                <button
                  onClick={() => handleSendChatMessage(currentChatInput)}
                  disabled={!currentChatInput.trim()}
                  className="w-7 h-7 rounded-md bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
    </>
  );
};
