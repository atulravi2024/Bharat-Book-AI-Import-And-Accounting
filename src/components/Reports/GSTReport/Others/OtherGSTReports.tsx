import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Info, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface OtherGSTReportsProps {
    useSampleData: boolean;
    onToggleSampleData: (enabled: boolean) => void;
}

export const OtherGSTReports: React.FC<OtherGSTReportsProps> = ({ useSampleData, onToggleSampleData }) => {
  const { t, formatNumber  } = useLanguage();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (useSampleData) {
            setLoading(true);
            fetch('/sample-data/reports/others.json')
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load Others sample data", err);
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [useSampleData]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Filed':
                return <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />;
            case 'Pending':
                return <Clock className="w-4 h-4 text-amber-500 mr-2" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center dark:text-gray-100">
                        <FileText className="mr-2 text-blue-600" size={20} />
                        {t("Other GST Reports")}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm dark:text-gray-400">{t("Additional GST Compliance Metrics")}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-800">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">{t("Compliance Dashboard")}</div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.reports?.map((report: any, i: number) => (
                            <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-100">{t(report.name)}</h4>
                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider dark:text-gray-400">{report.id}</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                                    <div className="flex items-center">
                                        <span className="text-xs font-medium text-gray-500 w-20 dark:text-gray-400">{t("Due Date:")}</span>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{report.due_date || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center w-32">
                                        {getStatusIcon(report.status)}
                                        <span className={`text-sm font-bold ${
                                            report.status === 'Filed' ? 'text-emerald-700' :
                                            report.status === 'Pending' ? 'text-amber-700' : 'text-gray-600'
                                        } dark:text-gray-300`}>
                                            {t(report.status)}
                                        </span>
                                    </div>
                                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">{t("View Details")}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-800">
                    <Info className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium dark:text-gray-400">{t("No data available. Enable sample data to view the report.")}</p>
                </div>
            )}
        </div>
    );
};
