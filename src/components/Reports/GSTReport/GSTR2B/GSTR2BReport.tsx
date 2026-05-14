import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';

interface GSTR2BReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR2BReport: React.FC<GSTR2BReportProps> = ({ useSampleData, onToggleSampleData }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/g2b_data.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR2B sample data", err);
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
                        GSTR-2B Report
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">Auto-drafted Input Tax Credit (ITC) Statement</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.sections.map((sec: any, i: number) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                                <h3 className="font-bold text-gray-800 mb-4 dark:text-gray-100">{sec.title}</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-900">
                                        <p className="text-xs text-gray-500 font-medium dark:text-gray-400">Total Taxable</p>
                                        <p className="font-bold text-gray-800 dark:text-gray-100">₹{sec.total_taxable?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-xs text-blue-600 font-medium">Total ITC</p>
                                        <p className="font-bold text-blue-700">₹{sec.total_itc?.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center p-2 rounded bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">CGST</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">₹{sec.cgst?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">SGST</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">₹{sec.sgst?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-center p-2 rounded bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">IGST</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">₹{sec.igst?.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">
                            Supplier-wise Details
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">GSTIN</th>
                                        <th className="px-4 py-3 font-semibold">Name</th>
                                        <th className="px-4 py-3 font-semibold text-right">Invoices</th>
                                        <th className="px-4 py-3 font-semibold text-right">Taxable Value</th>
                                        <th className="px-4 py-3 font-semibold text-right">Tax Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {data.supplier_wise_details?.map((sup: any, i: number) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{sup.gstin}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{sup.name}</td>
                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{sup.invoices_count}</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-gray-100">₹{sup.taxable_value?.toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3 text-right font-medium text-blue-600">₹{sup.tax?.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
