
import React from 'react';
import { InfoIcon, CheckCircleIcon, UploadIcon, UndoIcon, ClearAllIcon } from '../icons/IconComponents';

interface GeneralSettingsProps {
    workspaceName: string;
    setWorkspaceName: (val: string) => void;
    theme: string;
    setTheme: (val: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    dateFormat: string;
    setDateFormat: (val: string) => void;
    timezone: string;
    setTimezone: (val: string) => void;
    autoLock: string;
    setAutoLock: (val: string) => void;
    density: string;
    setDensity: (val: string) => void;
    animations: string;
    setAnimations: (val: string) => void;
    soundEffects: string;
    setSoundEffects: (val: string) => void;
    keyboardShortcuts: string;
    setKeyboardShortcuts: (val: string) => void;
    weekStartsOn: string;
    setWeekStartsOn: (val: string) => void;
    paginationSize: string;
    setPaginationSize: (val: string) => void;
    displayId: string;
    setDisplayId: (val: string) => void;
    appMode: string;
    setAppMode: (val: string) => void;
    handleSave: () => void;
    handleLoad: () => void;
    handleDeleteAll: () => void;
    handleReset: () => void;
    handleClear: () => void;
    isSaved: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    workspaceName, setWorkspaceName,
    theme, setTheme,
    language, setLanguage,
    dateFormat, setDateFormat,
    timezone, setTimezone,
    autoLock, setAutoLock,
    density, setDensity,
    animations, setAnimations,
    soundEffects, setSoundEffects,
    keyboardShortcuts, setKeyboardShortcuts,
    weekStartsOn, setWeekStartsOn,
    paginationSize, setPaginationSize,
    displayId, setDisplayId,
    appMode, setAppMode,
    handleSave, handleLoad, handleDeleteAll, handleReset, handleClear, isSaved
}) => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative dark:bg-gray-800 dark:border-gray-700">
            {isSaved && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center animate-in fade-in slide-in-from-top-2 z-10">
                    <CheckCircleIcon className="mr-2" /> Settings Saved!
                </div>
            )}
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center dark:text-white">
                <InfoIcon className="mr-3 text-blue-600" /> General Application Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Workspace / Software Name</label>
                    <input 
                        type="text" 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200" 
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="e.g. Bharat Book App"
                    />
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2 dark:text-gray-400">The name of this software instance. This is strictly for the application workspace, distinct from your legal Firm Name.</p>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display ID (Workspace Prefix)</label>
                    <input 
                        type="text" 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200" 
                        value={displayId}
                        onChange={(e) => setDisplayId(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2 dark:text-gray-400">A unique prefix assigned to generated vouchers (e.g., BBE-JV-001).</p>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Application Mode</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={appMode}
                        onChange={(e) => setAppMode(e.target.value)}
                    >
                        <option value="demo">Demo Mode (Pre-populated)</option>
                        <option value="working">Production / Live Mode (Clean)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2 dark:text-gray-400">Production syncs directly to standard ERP outputs. Demo is sandboxed.</p>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Theme Mode</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="system">System Default</option>
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Language</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="en-IN">English (India)</option>
                        <option value="en-US">English (United States)</option>
                        <option value="en-UK">English (United Kingdom)</option>
                        <option value="hi-IN">Hindi / हिन्दी (India)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Date Format</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                    >
                        <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Default Timezone</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                    >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC / GMT</option>
                        <option value="America/New_York">America/New_York (EST/EDT)</option>
                        <option value="Europe/London">Europe/London (GMT/BST)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Auto-Lock Timeout</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={autoLock}
                        onChange={(e) => setAutoLock(e.target.value)}
                    >
                        <option value="5">5 Minutes</option>
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="never">Never</option>
                    </select>
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2 dark:text-gray-400">Lock the application after inactivity.</p>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Density</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={density}
                        onChange={(e) => setDensity(e.target.value)}
                    >
                        <option value="compact">Compact (More Data)</option>
                        <option value="standard">Standard (Default)</option>
                        <option value="comfortable">Comfortable (Spacious)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2 dark:text-gray-400">Controls spacing across tables and lists.</p>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">UI Animations</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={animations}
                        onChange={(e) => setAnimations(e.target.value)}
                    >
                        <option value="enabled">Enabled (Smooth transitions)</option>
                        <option value="disabled">Disabled (Reduce motion)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sound Effects</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={soundEffects}
                        onChange={(e) => setSoundEffects(e.target.value)}
                    >
                        <option value="enabled">Enabled (Success/Error sounds)</option>
                        <option value="disabled">Disabled (Muted)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Keyboard Shortcuts</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={keyboardShortcuts}
                        onChange={(e) => setKeyboardShortcuts(e.target.value)}
                    >
                        <option value="enabled">Enabled (Allow hotkeys)</option>
                        <option value="disabled">Disabled</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Start Week On</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={weekStartsOn}
                        onChange={(e) => setWeekStartsOn(e.target.value)}
                    >
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Default Pagination Size</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-800 dark:text-gray-200"
                        value={paginationSize}
                        onChange={(e) => setPaginationSize(e.target.value)}
                    >
                        <option value="10">10 items per page</option>
                        <option value="25">25 items per page</option>
                        <option value="50">50 items per page</option>
                        <option value="100">100 items per page</option>
                    </select>
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2 dark:text-gray-400">Applies to all data tables and reports.</p>
                </div>
            </div>

            <div className="pt-6 border-t border-premium-slate-100 flex gap-3 sm:gap-4 items-center justify-center sm:justify-end overflow-x-auto pb-2 dark:border-gray-700">
                    <button 
                        onClick={handleLoad}
                        className="p-3.5 sm:px-6 sm:py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-100 transition-all flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-gray-300 shadow-sm"
                        title="Load"
                    >
                        <UploadIcon className="h-5 w-5 shrink-0" /> <span className="hidden sm:inline">Load</span>
                    </button>
                    <button 
                        onClick={handleReset}
                        className="p-3.5 sm:px-6 sm:py-3.5 bg-amber-50 text-amber-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-amber-100 transition-all flex items-center justify-center gap-2 dark:bg-amber-900/20 dark:text-amber-400 shadow-sm"
                        title="Reset"
                    >
                        <UndoIcon className="h-5 w-5 shrink-0" /> <span className="hidden sm:inline">Reset</span>
                    </button>
                    <button 
                        onClick={handleClear}
                        className="p-3.5 sm:px-6 sm:py-3.5 bg-gray-50 text-gray-600 rounded-2xl font-bold uppercase tracking-widest text-xs border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 shadow-sm"
                        title="Clear"
                    >
                        <ClearAllIcon className="h-5 w-5 shrink-0" /> <span className="hidden sm:inline">Clear</span>
                    </button>
                    <button 
                        onClick={handleSave}
                        className="p-3.5 sm:px-8 sm:py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                        title="Save"
                    >
                        <CheckCircleIcon className="h-5 w-5 shrink-0" /> <span className="hidden sm:inline">Save</span>
                    </button>
                </div>
        </div>
    );
};
