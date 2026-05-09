import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';

interface GSTR3BReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR3BReport: React.FC<GSTR3BReportProps> = ({ useSampleData, onToggleSampleData }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/gstr3b.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR3B sample data", err);
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [useSampleData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                        <FileText className="mr-2 text-blue-600" size={20} />
                        GSTR-3B Report
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">Monthly Return Data Summary</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Outward Supplies</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Taxable Value</span>
                                <span className="font-medium">₹{data.outward_supplies?.taxable?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">CGST</span>
                                <span className="font-medium text-blue-600">₹{data.outward_supplies?.cgst?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">SGST</span>
                                <span className="font-medium text-blue-600">₹{data.outward_supplies?.sgst?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">IGST</span>
                                <span className="font-medium text-blue-600">₹{data.outward_supplies?.igst?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Eligible ITC</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Import Goods</span>
                                <span className="font-medium">₹{data.eligible_itc?.import_goods?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Import Services</span>
                                <span className="font-medium">₹{data.eligible_itc?.import_services?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Inward Supplies</span>
                                <span className="font-medium text-emerald-600">₹{data.eligible_itc?.inward_supplies?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Payment of Tax</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-4 rounded-lg flex justify-between items-center border border-emerald-100">
                                <span className="text-sm font-bold text-emerald-800">Paid through ITC</span>
                                <span className="text-lg font-black text-emerald-600">₹{data.payment_of_tax?.paid_through_itc?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg flex justify-between items-center border border-amber-100">
                                <span className="text-sm font-bold text-amber-800">Paid in Cash</span>
                                <span className="text-lg font-black text-amber-600">₹{data.payment_of_tax?.paid_in_cash?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No data available. Enable sample data to view the report.</p>
                </div>
            )}
        </div>
    );
};
