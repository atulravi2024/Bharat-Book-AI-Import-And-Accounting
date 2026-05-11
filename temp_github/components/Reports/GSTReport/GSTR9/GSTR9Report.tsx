import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';

interface GSTR9ReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR9Report: React.FC<GSTR9ReportProps> = ({ useSampleData, onToggleSampleData }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/gstr9.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR9 sample data", err);
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [useSampleData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                        <FileText className="mr-2 text-blue-600" size={20} />
                        GSTR-9 Report
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">Annual Return Data Summary</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">Outward Supplies</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">B2C Supplies</span>
                                <span className="font-medium">₹{data.details_of_outward_supplies?.b2c?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">B2B Supplies</span>
                                <span className="font-medium">₹{data.details_of_outward_supplies?.b2b?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Exports</span>
                                <span className="font-medium">₹{data.details_of_outward_supplies?.exports?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">SEZ Supplies</span>
                                <span className="font-medium">₹{data.details_of_outward_supplies?.sez?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">Details of ITC</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Inputs</span>
                                <span className="font-medium text-emerald-600">₹{data.details_of_itc?.inputs?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Capital Goods</span>
                                <span className="font-medium">₹{data.details_of_itc?.capital_goods?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Input Services</span>
                                <span className="font-medium">₹{data.details_of_itc?.input_services?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2 dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">Tax Paid Details</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">CGST</span>
                                <span className="text-sm font-black text-blue-700">₹{data.tax_paid?.cgst?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">SGST</span>
                                <span className="text-sm font-black text-blue-700">₹{data.tax_paid?.sgst?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">IGST</span>
                                <span className="text-sm font-black text-blue-700">₹{data.tax_paid?.igst?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <span className="text-xs font-bold text-blue-400 block mb-1 uppercase tracking-widest">CESS</span>
                                <span className="text-sm font-black text-blue-700">₹{data.tax_paid?.cess?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium dark:text-gray-400">No data available. Enable sample data to view the report.</p>
                </div>
            )}
        </div>
    );
};
