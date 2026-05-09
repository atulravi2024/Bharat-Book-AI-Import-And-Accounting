
import React from 'react';
import { AccountIcon } from '../icons/IconComponents';

export const UserSettings: React.FC = () => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center dark:text-white">
                <AccountIcon className="mr-3 text-blue-600" /> User Management
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">AD</div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm dark:text-white">Admin User</p>
                            <p className="text-xs text-gray-500 font-medium dark:text-gray-400">admin@bharatbook.com</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">Owner</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">SA</div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm dark:text-white">Sales Team</p>
                            <p className="text-xs text-gray-500 font-medium dark:text-gray-400">sales@bharatbook.com</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">Editor</span>
                </div>
                <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-widest text-xs flex justify-center items-center dark:border-gray-700">
                    <span className="text-lg mr-2">+</span> Invite New User
                </button>
            </div>
        </div>
    );
};
