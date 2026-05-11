
import React from 'react';
import { NotificationsIcon } from '../icons/IconComponents';

interface AlertSettingsProps {
    toggles: {
        dailyAlerts: boolean;
        unmappedAlerts: boolean;
        weeklyAnalysis: boolean;
    };
    handleToggle: (key: any) => void;
}

export const AlertSettings: React.FC<AlertSettingsProps> = ({ toggles, handleToggle }) => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center dark:text-white">
                <NotificationsIcon className="mr-3 text-blue-600" /> Notification Rules
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <div>
                        <p className="font-bold text-gray-900 text-sm dark:text-white">Daily Summary Alerts</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">Receive an email every morning with the total imported mappings.</p>
                    </div>
                    <div onClick={() => handleToggle('dailyAlerts')} className={`${toggles.dailyAlerts ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-all`}>
                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.dailyAlerts ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <div>
                        <p className="font-bold text-gray-900 text-sm dark:text-white">Unmapped Vendor/Party Alerts</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">Get notified when new unidentified ledgers appear in standard syncs.</p>
                    </div>
                    <div onClick={() => handleToggle('unmappedAlerts')} className={`${toggles.unmappedAlerts ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-all`}>
                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.unmappedAlerts ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-100 opacity-60 dark:bg-gray-900 dark:border-gray-800">
                    <div>
                        <p className="font-bold text-gray-900 text-sm dark:text-white">Weekly Deep Analysis</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 dark:text-gray-400">Summarized financial growth & mismatch resolutions via SMS.</p>
                    </div>
                    <div onClick={() => handleToggle('weeklyAnalysis')} className={`${toggles.weeklyAnalysis ? 'bg-blue-600' : 'bg-gray-300'} w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-all`}>
                        <div className={`bg-white w-4 h-4 rounded-full absolute top-1 ${toggles.weeklyAnalysis ? 'right-1' : 'left-1'} shadow-sm transition-all dark:bg-gray-800`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
