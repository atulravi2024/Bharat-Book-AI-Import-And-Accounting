import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, X, Video, ChevronRight } from 'lucide-react';

export const CorrectionGuideVideo: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const duration = 45; // 45 seconds total length for walkthrough video
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            setProgress(0);
            return 0;
          }
          const nextTime = prev + 1;
          setProgress((nextTime / duration) * 100);
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Sync active guide step based on time
  useEffect(() => {
    if (currentTime < 10) {
      setActiveStep(0); // Overview
    } else if (currentTime < 22) {
      setActiveStep(1); // Reviewing Errors & Mismatches
    } else if (currentTime < 35) {
      setActiveStep(2); // Fixing ledger & tax alignments
    } else {
      setActiveStep(3); // Save & absorption
    }
  }, [currentTime]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSkipTo = (seconds: number) => {
    setCurrentTime(seconds);
    setProgress((seconds / duration) * 100);
    if (!isPlaying) setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return (
      <div className="flex justify-end mb-4 flex-shrink-0">
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
        >
          <Video className="w-3.5 h-3.5" />
          {t("Show Video Tutorial Walkthrough")}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-2xl shadow-xl border border-indigo-900/30 text-white flex-shrink-0 animate-in fade-in duration-500 overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Video className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-200">
            {t("Stage Two Video Walkthrough: Ingestion Correction Workflow")}
          </h3>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Dismiss Video Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Dynamic Simulated Video Screen */}
        <div className="lg:col-span-7 bg-black/60 border border-slate-800 rounded-xl overflow-hidden aspect-[16/9] relative flex flex-col justify-between group p-3 select-none shadow-inner shadow-black">
          {/* Subtle noise watermark filter */}
          <div className="absolute inset-0 bg-[url('radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)')] pointer-events-none z-10"></div>
          
          {/* Top Indicators */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-600 rounded">
              {t("Bharat Book AI Simulator")}
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wider">
              {isPlaying ? '● REAL-TIME DEMO PLAYBACK' : '❙❙ PAUSED'}
            </span>
          </div>

          {/* Interactive Screen Content synced with timeline */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 z-10">
            {activeStep === 0 && (
              <div className="text-center animate-in zoom-in-95 duration-300">
                <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-2 animate-bounce" />
                <h4 className="text-sm font-black tracking-wide uppercase text-indigo-100">{t("Welcome to ERP Correction Stage")}</h4>
                <p className="text-[11px] text-slate-300 max-w-sm mt-1 mx-auto leading-relaxed">
                  {t("Step 2 parses extracted items side-by-side with localized databases for instant master auto-alignment.")}
                </p>
              </div>
            )}
            {activeStep === 1 && (
              <div className="text-center animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-red-950 border border-red-500/30 text-red-400 flex items-center justify-center text-xs font-black">!</div>
                  <div className="w-8 h-8 rounded bg-amber-950 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs font-black">?</div>
                </div>
                <h4 className="text-sm font-black tracking-wide uppercase text-red-300">{t("Detecting Ingestion Inaccuracies")}</h4>
                <p className="text-[11px] text-slate-300 max-w-sm mt-1 mx-auto leading-relaxed">
                  {t("Review highlighted unmapped rows or missing masters. Values matching < 75% are flagged automatically.")}
                </p>
              </div>
            )}
            {activeStep === 2 && (
              <div className="text-center animate-in slide-in-from-left-2 duration-300">
                <div className="w-16 h-10 bg-slate-900 border border-indigo-500/30 rounded-lg mx-auto mb-2.5 flex items-center justify-center text-[10px] text-indigo-300 font-mono font-bold">GST: 18%</div>
                <h4 className="text-sm font-black tracking-wide uppercase text-amber-300">{t("Inline Validation & Tax Predictors")}</h4>
                <p className="text-[11px] text-slate-300 max-w-sm mt-1 mx-auto leading-relaxed">
                  {t("Directly update tax percentages or match ledgers, SKUs and UOM fields globally using the contextual dropdowns.")}
                </p>
              </div>
            )}
            {activeStep === 3 && (
              <div className="text-center animate-in fade-in duration-500">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-2">✓</div>
                <h4 className="text-sm font-black tracking-wide uppercase text-emerald-300">{t("Absorption & Safe Master Storage")}</h4>
                <p className="text-[11px] text-slate-300 max-w-sm mt-1 mx-auto leading-relaxed">
                  {t("Click 'Accept & Import' to safely absorb the corrected assets. New elements automatically save to your master matrices.")}
                </p>
              </div>
            )}

            {/* Click to play overlay when paused */}
            {!isPlaying && (
              <button 
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all cursor-pointer z-20 group"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-all">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </button>
            )}
          </div>

          {/* Subtitles Overlay */}
          <div className="bg-black/80 px-3 py-1.5 rounded-lg text-center mx-4 pb-2 z-10 border border-slate-800/80 mb-2">
            <p className="text-[11px] text-indigo-200 font-bold">
              {activeStep === 0 && `🔊 ${t("Tutorial: Bharat Book provides deep automation pipelines for seamless ERP imports.")}`}
              {activeStep === 1 && `🔊 ${t("Tip: Select GSTR sheets, then resolve red unmapped markers by choosing master matching values.")}`}
              {activeStep === 2 && `🔊 ${t("Pro-tip: Correct missing units, prices or item details instantly. All errors auto-resolve.")}`}
              {activeStep === 3 && `🔊 ${t("Final step: Verify columns, check summary audits, and persist files securely across sessions.")}`}
            </p>
          </div>

          {/* Player controls */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800 z-10 bg-slate-950/80 px-2 py-1.5 rounded-lg">
            {/* Timeline progress track */}
            <div className="relative h-1 bg-slate-800 rounded-full cursor-pointer overflow-hidden" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              handleSkipTo(Math.floor(percentage * duration));
            }}>
              <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-1 hover:text-indigo-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="p-1 hover:text-indigo-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[10px] font-mono text-slate-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/20">
                {formatTime(duration - currentTime)} {t("Remaining")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Playlist-style Navigation Guide Step-list */}
        <div className="lg:col-span-5 space-y-2 text-left">
          <p className="text-[10px] font-black uppercase text-indigo-300 tracking-wider mb-1">{t("Video Chapters")}</p>
          {[
            { id: 0, title: t("1. Overview of Master Correction"), time: '0:00', startSec: 0, desc: t("Understand automated extraction outputs.") },
            { id: 1, title: t("2. Troubleshooting Unmapped Rows"), time: '0:10', startSec: 10, desc: t("Fix high confidence mismatch flags.") },
            { id: 2, title: t("3. Modifying Incomplete Records"), time: '0:22', startSec: 22, desc: t("Rectifying codes, prices and tax entries.") },
            { id: 3, title: t("4. Safe Absorption & Persistence"), time: '0:35', startSec: 35, desc: t("Submit data to active ledger ledgers.") },
          ].map((step) => {
            const isCurrent = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => handleSkipTo(step.startSec)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-indigo-600/25 border-indigo-500/80 text-white shadow-md' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black tracking-wide ${isCurrent ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                  <span className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">{step.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-normal line-clamp-1">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
