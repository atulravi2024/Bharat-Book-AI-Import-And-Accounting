
import React from 'react';
import { SecurityIcon } from '../icons/IconComponents';

export const SecuritySettings: React.FC = () => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-premium-slate-100 relative">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                <SecurityIcon className="mr-3 text-blue-600" /> Security Settings
            </h3>
            <div className="space-y-6">
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start max-w-sm">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-4 mt-1">
                                <SecurityIcon />
                            </div>
                            <div>
                                <p className="font-bold text-indigo-900 text-sm">Two-Factor Authentication</p>
                                <p className="text-xs text-indigo-700 font-medium mt-1">Protect your enterprise account using authenticator apps or SMS.</p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors uppercase tracking-widest">Enable</button>
                    </div>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Update Password</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Manage your access credentials</p>
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Change Password</button>
                </div>
            </div>
        </div>
    );
};
