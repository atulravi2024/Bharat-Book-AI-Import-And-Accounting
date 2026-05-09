import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';

interface GSTR9CReportProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const GSTR9CReport: React.FC<GSTR9CReportProps> = ({ useSampleData, onToggleSampleData }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/gstr9c.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load GSTR9C sample data", err);
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
                        GSTR-9C Report
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">Reconciliation Statement</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">Turnover Reconciliation</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Turnover as per Audited Financials</span>
                                <span className="font-medium">₹{data.turnover_reconciliation?.turnover_as_per_audited_financial_statements?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Unbilled Revenue (Beginning)</span>
                                <span className="font-medium text-amber-600">₹{data.turnover_reconciliation?.unbilled_revenue_beginning?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Unbilled Revenue (End)</span>
                                <span className="font-medium text-emerald-600">₹{data.turnover_reconciliation?.unbilled_revenue_end?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Unadjusted Advances (Beginning)</span>
                                <span className="font-medium text-amber-600">₹{data.turnover_reconciliation?.unadjusted_advances_beginning?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Unadjusted Advances (End)</span>
                                <span className="font-medium text-emerald-600">₹{data.turnover_reconciliation?.unadjusted_advances_end?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 mt-4 bg-blue-50 p-2 rounded">
                                <span className="text-sm font-bold text-blue-800">Declared in Annual Return</span>
                                <span className="font-bold text-blue-700">₹{data.turnover_reconciliation?.turnover_declared_in_annual_return?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Unreconciled Turnover</span>
                                <span className={`font-bold ${data.turnover_reconciliation?.unreconciled_turnover > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    ₹{data.turnover_reconciliation?.unreconciled_turnover?.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 dark:text-gray-100">Tax Reconciliation</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Taxable Value</span>
                                <span className="font-medium">₹{data.tax_reconciliation?.taxable_value?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Tax Liability (as per GSTR-9)</span>
                                <span className="font-medium text-rose-600">₹{data.tax_reconciliation?.tax_liability_as_per_gstr9?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Paid through Cash and ITC</span>
                                <span className="font-medium text-emerald-600">₹{data.tax_reconciliation?.tax_paid_through_cash_and_itc?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 mt-4 bg-gray-50 p-2 rounded border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Unreconciled Payment</span>
                                <span className={`font-bold ${data.tax_reconciliation?.unreconciled_payment > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    ₹{data.tax_reconciliation?.unreconciled_payment?.toLocaleString('en-IN')}
                                </span>
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
