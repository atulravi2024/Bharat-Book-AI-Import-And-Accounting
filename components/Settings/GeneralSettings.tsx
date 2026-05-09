
import React from 'react';
import { InfoIcon, CheckCircleIcon } from '../icons/IconComponents';

interface GeneralSettingsProps {
    companyName: string;
    setCompanyName: (val: string) => void;
    displayId: string;
    setDisplayId: (val: string) => void;
    fiscalYear: string;
    setFiscalYear: (val: string) => void;
    appMode: string;
    setAppMode: (val: string) => void;
    handleSave: () => void;
    isSaved: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    companyName, setCompanyName,
    displayId, setDisplayId,
    fiscalYear, setFiscalYear,
    appMode, setAppMode,
    handleSave, isSaved
}) => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative">
            {isSaved && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center animate-in fade-in slide-in-from-top-2">
                    <CheckCircleIcon className="mr-2" /> Settings Saved!
                </div>
            )}
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                <InfoIcon className="mr-3 text-blue-600" /> Enterprise Profile
            </h3>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                        <input 
                            type="text" 
                            className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-500 font-medium mt-2 px-2">This name appears on exported reports, vouchers, and GST validation checks.</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display ID</label>
                        <input 
                            type="text" 
                            className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none" 
                            value={displayId}
                            onChange={(e) => setDisplayId(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-500 font-medium mt-2 px-2">A unique prefix assigned to generated vouchers (e.g., BBE-JV-001).</p>
                    </div>
                </div>
                
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fiscal Year Setup</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                        value={fiscalYear}
                        onChange={(e) => setFiscalYear(e.target.value)}
                    >
                        <option value="April to March (Indian Standard)">April to March (Indian Standard)</option>
                        <option value="January to December (Global)">January to December (Global)</option>
                        <option value="July to June (Australian/Custom)">July to June (Australian/Custom)</option>
                        <option value="October to September (US Federal)">October to September (US Federal)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2">Determines financial reporting periods and tax logic mapping.</p>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Application Mode</label>
                    <select 
                        className="w-full p-4 bg-premium-slate-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                        value={appMode}
                        onChange={(e) => setAppMode(e.target.value)}
                    >
                        <option value="demo">Demo Mode (Pre-populated Data)</option>
                        <option value="working">Production / Live Mode (Clean Slate)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 font-medium mt-2 px-2">Production syncs directly to standard ERP outputs. Demo is sandboxed with dummy values.</p>
                </div>

                <div className="pt-4 border-t border-premium-slate-100 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all flex items-center"
                    >
                        <CheckCircleIcon className="mr-3" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
