import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Zap, ShieldCheck, CheckCircle, Activity, Repeat } from 'lucide-react';

export const TransactionFlow = () => {
    const steps = [
        { id: 'ingest', label: 'Ingestion', sub: 'OCR & Stream', icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'ai', label: 'AI Synthesis', sub: 'Semantic Map', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'verify', label: 'Verification', sub: 'Human-in-loop', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'post', label: 'Final Ledger', sub: 'Tally Protocol', icon: CheckCircle, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-premium-slate-100 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Repeat size={200} />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-10 flex items-center">
                <Activity size={18} className="mr-3 text-blue-600" /> Orchestration Lifecycle Flow
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                {steps.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center text-center group translate-z-0">
                            <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <step.icon size={28} />
                            </div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">{step.label}</h4>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{step.sub}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4 relative overflow-hidden">
                                <motion.div 
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-1/2"
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
