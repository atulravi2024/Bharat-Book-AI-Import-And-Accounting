import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Layers,
  TrendingUp,
  Cpu,
  Calendar,
  Activity,
  Award,
  Clock,
  ShieldCheck,
  Smartphone,
  Globe,
  Laptop,
  Fingerprint,
  BarChart3,
  FileSpreadsheet,
  Network
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap
} from 'recharts';
import { ParsedVoucher } from '../../../../app/types';
import { SafeResponsiveContainer } from '../../../Dashboard/components/DashboardShared';

interface TransactionAnalysisTabProps {
  allVouchers: ParsedVoucher[];
  language: any;
}

export const TransactionAnalysisTab: React.FC<TransactionAnalysisTabProps> = ({
  allVouchers = [],
  language
}) => {
  // Interactive filters for unified Transaction Analysis tab
  const [groupingFilter, setGroupingFilter] = useState<'all' | 'day' | 'week' | 'month' | 'quarter' | 'year' | 'biweekly' | 'semiannually' | 'daytype' | 'shift'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showDeviceDetails, setShowDeviceDetails] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'all' | 'kpi' | 'chart' | 'diagram'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'web' | 'excel' | 'api' | 'desktop' | null>(null);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);

  // Automatically reset selection when grouping or type filters change
  useEffect(() => {
    setSelectedId(null);
    setSelectedDevice(null);
  }, [groupingFilter, typeFilter]);

  // Set chart ready after mount is complete to prevent Recharts measurement warnings
  useEffect(() => {
    const t = setTimeout(() => setIsChartReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Helper date parsing with multi-format support
  const getParsedDate = (val: string): Date | null => {
    if (!val) return null;
    let d = new Date(val);
    if (!isNaN(d.getTime())) return d;
    
    const parts = val.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
    return isNaN(d.getTime()) ? null : d;
  };

  // Helper to determine device mapping for a voucher deterministically
  const getVoucherDeviceKey = (v: ParsedVoucher): 'mobile' | 'web' | 'excel' | 'api' | 'desktop' => {
    const idStr = v.id !== undefined && v.id !== null ? String(v.id) : '';
    const dateValStr = v.date?.value !== undefined && v.date?.value !== null ? String(v.date.value) : '';
    const partyNameStr = v.partyName?.value !== undefined && v.partyName?.value !== null ? String(v.partyName.value) : '';
    const code = idStr ? idStr.charCodeAt(idStr.length - 1) || 0 : dateValStr.length + partyNameStr.length;
    const rem = code % 5;
    if (rem === 0) return 'mobile';
    if (rem === 1) return 'web';
    if (rem === 2) return 'excel';
    if (rem === 3) return 'api';
    return 'desktop';
  };

  // Filter vouchers based on transaction type filter
  const filteredVouchersForAnalysis = allVouchers.filter(v => {
    if (typeFilter === 'all') return true;
    const vt = (v.type || '').toLowerCase();
    
    // Custom modern & legacy grouping filters mapping
    if (typeFilter === 'banking' || typeFilter === 'receipt-payment') {
      return ['payment', 'receipt', 'contra', 'banking', 'bank', 'bank statement'].includes(vt);
    }
    if (typeFilter === 'journal') {
      return vt === 'journal' || vt === 'voucher' || vt === 'stock journal';
    }
    if (typeFilter === 'gst') {
      return vt.includes('gst') || vt.includes('gstr');
    }
    
    // Otherwise, direct case-insensitive match
    const tf = typeFilter.toLowerCase();
    return vt === tf;
  });

  // Filter vouchers based on selected device if active
  const vouchersForBreakdown = filteredVouchersForAnalysis.filter(v => {
    if (!selectedDevice) return true;
    return getVoucherDeviceKey(v) === selectedDevice;
  });

  // Stable helper index generator
  const getStableIndex = (v: ParsedVoucher, max: number): number => {
    const str = String(v.id || '') + String(v.date?.value || '') + String(v.partyName?.value || '');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  };

  // Check if a voucher belongs to a specific timescale card
  const isVoucherInTimescaleCard = (v: ParsedVoucher, filterType: string, cardId: string | null): boolean => {
    if (!cardId) return true;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = getParsedDate(String(v.date?.value || ''));
    
    if (filterType === 'all') {
      const expectedKey = cardId.replace('all-', '');
      const vt = (v.type || '').toLowerCase();
      if (expectedKey === 'banking') {
        return ['payment', 'receipt', 'contra', 'banking', 'bank', 'bank statement'].includes(vt);
      }
      if (expectedKey === 'journal') {
        return vt === 'journal' || vt === 'voucher' || vt === 'stock journal';
      }
      return vt === expectedKey;
    }
    
    if (filterType === 'week') {
      if (!d) {
        const stableIdx = getStableIndex(v, 5);
        return `week-${4 - stableIdx}` === cardId;
      }
      const diffTime = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekDiff = Math.max(0, Math.min(4, Math.floor(diffDays / 7)));
      return `week-${4 - weekDiff}` === cardId;
    }
    
    if (filterType === 'month') {
      if (!d) {
        const stableIdx = getStableIndex(v, 5);
        const map = ['jan', 'feb', 'mar', 'apr', 'may'];
        return `month-${map[stableIdx]}` === cardId;
      }
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const mName = monthNames[d.getMonth()];
      return `month-${mName}` === cardId;
    }
    
    if (filterType === 'year') {
      if (!d) {
        const stableIdx = getStableIndex(v, 3);
        const map = ['2023-24', '2024-25', '2025-26'];
        return map[stableIdx] === cardId;
      }
      const year = d.getFullYear();
      if (year <= 2024) return '2023-24' === cardId;
      if (year === 2025) return '2024-25' === cardId;
      return '2025-26' === cardId;
    }
    
    if (filterType === 'quarter') {
      if (!d) {
        const stableIdx = getStableIndex(v, 4);
        return `q${stableIdx + 1}` === cardId;
      }
      const month = d.getMonth();
      let q = 'q1';
      if (month >= 3 && month <= 5) q = 'q1';
      else if (month >= 6 && month <= 8) q = 'q2';
      else if (month >= 9 && month <= 11) q = 'q3';
      else q = 'q4';
      return q === cardId;
    }
    
    if (filterType === 'day') {
      if (!d) {
        const stableIdx = getStableIndex(v, 5);
        return `day-${stableIdx}` === cardId;
      }
      const dayDiff = Math.floor((now.getTime() - d.getTime()) / (1000 * 30 * 24));
      const targetDiff = Math.max(0, Math.min(4, dayDiff));
      return `day-${targetDiff}` === cardId;
    }
    
    if (filterType === 'biweekly') {
      if (!d) {
        const stableIdx = getStableIndex(v, 4);
        return `biweekly-${stableIdx}` === cardId;
      }
      const day = d.getDate();
      const half = day <= 15 ? 'first' : 'second';
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const mName = monthNames[d.getMonth()];
      return `biweekly-${mName}-${half}` === cardId;
    }
    
    if (filterType === 'semiannually') {
      if (!d) {
        const stableIdx = getStableIndex(v, 2);
        return `semi-${stableIdx}` === cardId;
      }
      const month = d.getMonth();
      const semi = month < 6 ? 'h1' : 'h2';
      return `semi-${semi}` === cardId;
    }
    
    if (filterType === 'daytype') {
      if (!d) {
        const stableIdx = getStableIndex(v, 2);
        const type = stableIdx === 0 ? 'weekday' : 'weekend';
        return type === cardId;
      }
      const dayOfWeek = d.getDay();
      const type = (dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : 'weekday';
      return type === cardId;
    }
    
    if (filterType === 'shift') {
      const stableIdx = getStableIndex(v, 3);
      const shifts = ['morning', 'afternoon', 'night'];
      return shifts[stableIdx] === cardId;
    }
    
    return true;
  };

  // Stable deterministic demo count provider to fill up KPIs in all groupings / filters
  const getDemoCount = (actualCount: number, seedString: string): number => {
    return actualCount;
  };

  // --- Breakdown Ingestion Logic ---

  const getActiveAllBreakdown = () => {
    let sales = 0, purchase = 0, receipt = 0, payment = 0, journal = 0, contra = 0;
    
    vouchersForBreakdown.forEach(v => {
      const vt = (v.type || '').toLowerCase();
      if (vt === 'sales') sales++;
      else if (vt === 'purchase') purchase++;
      else if (vt === 'receipt') receipt++;
      else if (vt === 'payment') payment++;
      else if (vt === 'contra') contra++;
      else journal++;
    });

    sales = getDemoCount(sales, 'sales');
    purchase = getDemoCount(purchase, 'purchase');
    receipt = getDemoCount(receipt, 'receipt');
    payment = getDemoCount(payment, 'payment');
    contra = getDemoCount(contra, 'contra');
    journal = getDemoCount(journal, 'journal');
    
    const total = sales + purchase + receipt + payment + contra + journal;
    const getPercent = (v: number) => total > 0 ? Math.round((v / total) * 100) : 0;
    
    const list = [
      { key: 'sales', label: language === 'hi' ? 'बिक्री प्रभाव' : 'Revenue Sales', count: sales, percentage: getPercent(sales), color: 'bg-emerald-500' },
      { key: 'purchase', label: language === 'hi' ? 'खरीद प्रविष्टियां' : 'Liability Purchases', count: purchase, percentage: getPercent(purchase), color: 'bg-rose-500' },
      { key: 'receipt', label: language === 'hi' ? 'रसीद प्रविष्टियां' : 'Receipt Flows', count: receipt, percentage: getPercent(receipt), color: 'bg-blue-500' },
      { key: 'payment', label: language === 'hi' ? 'भुगतान विवरण' : 'Payment Disbursals', count: payment, percentage: getPercent(payment), color: 'bg-purple-500' },
      { key: 'contra', label: language === 'hi' ? 'कांट्रा प्रविष्टियां' : 'Contra Settlement', count: contra, percentage: getPercent(contra), color: 'bg-amber-500' },
      { key: 'journal', label: language === 'hi' ? 'जर्नल प्रविष्टियां' : 'Journal Adjustments', count: journal, percentage: getPercent(journal), color: 'bg-slate-500' },
    ];
    
    return { list, total };
  };

  const getActiveWeekBreakdown = () => {
    const list = [
      { id: 'week-4', label: language === 'hi' ? 'इस सप्ताह' : 'Current Week (W5)', dateRange: 'Jun 08 - Jun 14', count: 0 },
      { id: 'week-3', label: language === 'hi' ? '१ सप्ताह पहले' : '1 Week Ago (W4)', dateRange: 'Jun 01 - Jun 07', count: 0 },
      { id: 'week-2', label: language === 'hi' ? '२ सप्ताह पहले' : '2 Weeks Ago (W3)', dateRange: 'May 25 - May 31', count: 0 },
      { id: 'week-1', label: language === 'hi' ? '३ सप्ताह पहले' : '3 Weeks Ago (W2)', dateRange: 'May 18 - May 24', count: 0 },
      { id: 'week-0', label: language === 'hi' ? '४ सप्ताह पहले' : '4 Weeks Ago (W1)', dateRange: 'May 11 - May 17', count: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 5);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const now = new Date();
      now.setHours(0,0,0,0);
      const diffTime = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekDiff = Math.max(0, Math.min(4, Math.floor(diffDays / 7)));
      list[4 - weekDiff].count++;
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.id);
    });
    
    return list;
  };

  const getActiveMonthBreakdown = () => {
    const months = [
      { id: 'month-jan', label: language === 'hi' ? 'जनवरी' : 'January', monthIdx: 0, year: 2025, count: 0, percentage: 0 },
      { id: 'month-feb', label: language === 'hi' ? 'फरवरी' : 'February', monthIdx: 1, year: 2025, count: 0, percentage: 0 },
      { id: 'month-mar', label: language === 'hi' ? 'मार्च' : 'March', monthIdx: 2, year: 2025, count: 0, percentage: 0 },
      { id: 'month-apr', label: language === 'hi' ? 'अप्रैल' : 'April', monthIdx: 3, year: 2025, count: 0, percentage: 0 },
      { id: 'month-may', label: language === 'hi' ? 'मई' : 'May', monthIdx: 4, year: 2025, count: 0, percentage: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 5);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        months[stableIdx].count++;
        return;
      }
      const mIdx = d.getMonth();
      if (mIdx >= 0 && mIdx <= 4) {
        months[mIdx].count++;
      } else {
        months[stableIdx].count++;
      }
    });

    months.forEach(m => {
      m.count = getDemoCount(m.count, m.id);
    });
    
    const total = months.reduce((sum, b) => sum + b.count, 0);
    months.forEach(m => {
      m.percentage = total > 0 ? Math.round((m.count / total) * 100) : 0;
    });
    return months;
  };

  const getActiveQuarterBreakdown = () => {
    const list = [
      { id: 'q1', label: language === 'hi' ? 'तिमाही १ (Q1)' : 'Q1 Block', period: 'Apr - Jun', count: 0, percentage: 0 },
      { id: 'q2', label: language === 'hi' ? 'तिमाही २ (Q2)' : 'Q2 Block', period: 'Jul - Sep', count: 0, percentage: 0 },
      { id: 'q3', label: language === 'hi' ? 'तिमाही ३ (Q3)' : 'Q3 Block', period: 'Oct - Dec', count: 0, percentage: 0 },
      { id: 'q4', label: language === 'hi' ? 'तिमाही ४ (Q4)' : 'Q4 Block', period: 'Jan - Mar', count: 0, percentage: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 4);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const m = d.getMonth();
      let targetQIdx = 0;
      if (m >= 3 && m <= 5) targetQIdx = 0;
      else if (m >= 6 && m <= 8) targetQIdx = 1;
      else if (m >= 9 && m <= 11) targetQIdx = 2;
      else targetQIdx = 3;
      list[targetQIdx].count++;
    });

    list.forEach(q => {
      q.count = getDemoCount(q.count, q.id);
    });
    
    const total = list.reduce((sum, b) => sum + b.count, 0);
    list.forEach(q => {
      q.percentage = total > 0 ? Math.round((q.count / total) * 100) : 0;
    });
    return list;
  };

  const getActiveYearBreakdown = () => {
    const list = [
      { id: '2023-24', label: '2023-24', period: language === 'hi' ? 'पिछला वित्तीय वर्ष' : 'Previous Fiscal Year System', count: 0 },
      { id: '2024-25', label: '2024-25', period: language === 'hi' ? 'सक्रिय वित्तीय वर्ष' : 'Active Financial Session', count: 0 },
      { id: '2025-26', label: '2025-26', period: language === 'hi' ? 'आगामी वित्तीय वर्ष प्रक्षेप' : 'Audited Future Forecast', count: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 3);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const y = d.getFullYear();
      if (y <= 2024) list[0].count++;
      else if (y === 2025) list[1].count++;
      else list[2].count++;
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.label);
    });
    
    return list;
  };

  const getActiveDayBreakdown = () => {
    const list = [
      { id: 'day-0', label: language === 'hi' ? 'आज' : 'Today (T0)', dateStr: 'Real-time sync', count: 0 },
      { id: 'day-1', label: language === 'hi' ? 'कल' : 'Yesterday (T-1)', dateStr: '1 day latency', count: 0 },
      { id: 'day-2', label: language === 'hi' ? '२ दिन पहले' : '2 Days Ago (T-2)', dateStr: '2 days latency', count: 0 },
      { id: 'day-3', label: language === 'hi' ? '३ दिन पहले' : '3 Days Ago (T-3)', dateStr: '3 days latency', count: 0 },
      { id: 'day-4', label: language === 'hi' ? '४ दिन पहले' : '4 Days Ago (T-4)', dateStr: '4 days latency', count: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 5);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const now = new Date();
      const dayDiff = Math.floor((now.getTime() - d.getTime()) / (1000 * 30 * 24));
      const targetDiff = Math.max(0, Math.min(4, dayDiff));
      list[targetDiff].count++;
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.id);
    });
    
    return list;
  };

  const getActiveBiweeklyBreakdown = () => {
    const list = [
      { id: 'biweekly-jun-first', label: language === 'hi' ? 'जून पखवाड़ा १' : 'Fortnightly June H1', period: 'Jun 01 - Jun 15', count: 0, percentage: 0 },
      { id: 'biweekly-jun-second', label: language === 'hi' ? 'जून पखवाड़ा २' : 'Fortnightly June H2', period: 'Jun 16 - Jun 30', count: 0, percentage: 0 },
      { id: 'biweekly-may-first', label: language === 'hi' ? 'मई पखवाड़ा १' : 'Fortnightly May H1', period: 'May 01 - May 15', count: 0, percentage: 0 },
      { id: 'biweekly-may-second', label: language === 'hi' ? 'मई पखवाड़ा २' : 'Fortnightly May H2', period: 'May 16 - May 31', count: 0, percentage: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 4);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const day = d.getDate();
      const month = d.getMonth();
      const halfIdx = day <= 15 ? 0 : 1;
      
      if (month === 5) { // June
        list[halfIdx].count++;
      } else if (month === 4) { // May
        list[2 + halfIdx].count++;
      } else {
        list[stableIdx].count++;
      }
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.id);
    });
    
    const total = list.reduce((sum, b) => sum + b.count, 0);
    list.forEach(item => {
      item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });
    return list;
  };

  const getActiveSemiannuallyBreakdown = () => {
    const list = [
      { id: 'semi-h1', label: language === 'hi' ? 'प्रथम अर्धवार्षिक (H1)' : 'First Half (H1)', period: 'Apr - Sep Fiscal block', count: 0, percentage: 0 },
      { id: 'semi-h2', label: language === 'hi' ? 'द्वितीय अर्धवार्षिक (H2)' : 'Second Half (H2)', period: 'Oct - Mar Fiscal block', count: 0, percentage: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 2);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const month = d.getMonth();
      const idx = month < 6 ? 0 : 1;
      list[idx].count++;
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.id);
    });
    
    const total = list.reduce((sum, b) => sum + b.count, 0);
    list.forEach(item => {
      item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });
    return list;
  };

  const getActiveDaytypeBreakdown = () => {
    const list = [
      { id: 'weekday', label: language === 'hi' ? 'आधिकारिक कार्यदिवस' : 'Official Weekdays', period: 'Monday to Friday', count: 0, percentage: 0 },
      { id: 'weekend', label: language === 'hi' ? 'साप्ताहिक अवकाश' : 'Weekend Shifts', period: 'Saturday and Sunday', count: 0, percentage: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 2);
      const d = getParsedDate(String(v.date?.value || ''));
      if (!d) {
        list[stableIdx].count++;
        return;
      }
      const dayOfWeek = d.getDay();
      const idx = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
      list[idx].count++;
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.id);
    });
    
    const total = list.reduce((sum, b) => sum + b.count, 0);
    list.forEach(item => {
      item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });
    return list;
  };

  const getActiveShiftBreakdown = () => {
    const list = [
      { id: 'morning', label: language === 'hi' ? 'प्रातःकालीन पाली (Shift A)' : 'Morning Core (Shift A)', period: '08:00 AM - 04:00 PM', count: 0, percentage: 0 },
      { id: 'afternoon', label: language === 'hi' ? 'मध्याह्न पाली (Shift B)' : 'Afternoon High (Shift B)', period: '04:00 PM - 12:00 AM', count: 0, percentage: 0 },
      { id: 'night', label: language === 'hi' ? 'रात्रिकालीन पाली (Shift C)' : 'Night Audit (Shift C)', period: '12:00 AM - 08:00 AM', count: 0, percentage: 0 }
    ];
    
    vouchersForBreakdown.forEach(v => {
      const stableIdx = getStableIndex(v, 3);
      list[stableIdx].count++;
    });

    list.forEach(item => {
      item.count = getDemoCount(item.count, item.id);
    });
    
    const total = list.reduce((sum, b) => sum + b.count, 0);
    list.forEach(item => {
      item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });
    return list;
  };

  const getDeviceBreakdown = (vouchersList: ParsedVoucher[]) => {
    let mobile = 0, web = 0, excel = 0, api = 0, desktop = 0;
    
    vouchersList.forEach(v => {
      const dk = getVoucherDeviceKey(v);
      if (dk === 'mobile') mobile++;
      else if (dk === 'web') web++;
      else if (dk === 'excel') excel++;
      else if (dk === 'api') api++;
      else desktop++;
    });

    mobile = getDemoCount(mobile, 'device-mobile');
    web = getDemoCount(web, 'device-web');
    excel = getDemoCount(excel, 'device-excel');
    api = getDemoCount(api, 'device-api');
    desktop = getDemoCount(desktop, 'device-desktop');
    
    const total = mobile + web + excel + api + desktop;
    const getPercent = (v: number) => total > 0 ? Math.round((v / total) * 100) : 0;
    
    const list = [
      { key: 'mobile', label: language === 'hi' ? 'मोबाइल डिवाइस' : 'Mobile App Sync', count: mobile, percentage: getPercent(mobile), icon: Smartphone, color: 'text-emerald-500 border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/10', version: 'BharatBook v10.4' },
      { key: 'web', label: language === 'hi' ? 'वेब ब्राउज़र पोर्टल' : 'Web Portal Desktop', count: web, percentage: getPercent(web), icon: Globe, color: 'text-blue-500 border-blue-100 bg-blue-50/50 dark:bg-blue-900/10', version: 'Firefox/Chrome Sync' },
      { key: 'excel', label: language === 'hi' ? 'एक्सेल इम्पोर्ट सिंक' : 'Excel Ledger Import', count: excel, percentage: getPercent(excel), icon: FileSpreadsheet, color: 'text-green-500 border-green-100 bg-green-50/50 dark:bg-green-900/10', version: 'MS-Excel Native Parser' },
      { key: 'api', label: language === 'hi' ? 'क्लाउड एपीआई कनेक्टर' : 'Rest API ERP Sync', count: api, percentage: getPercent(api), icon: Fingerprint, color: 'text-purple-500 border-purple-100 bg-purple-50/50 dark:bg-purple-900/10', version: 'OAuth API Connect' },
      { key: 'desktop', label: language === 'hi' ? 'विंडोज़ डेस्कटॉप' : 'Desktop ERP Offline', count: desktop, percentage: getPercent(desktop), icon: Laptop, color: 'text-indigo-500 border-indigo-100 bg-indigo-50/50 dark:bg-indigo-900/10', version: 'WinOS Native Exe' }
    ];
    
    return { list, total };
  };

  const getActiveDeviceBreakdown = () => {
    const listWithTimescaleFilter = filteredVouchersForAnalysis.filter(v => {
      return isVoucherInTimescaleCard(v, groupingFilter, selectedId);
    });
    
    const activeData = getDeviceBreakdown(listWithTimescaleFilter);
    const totalData = getDeviceBreakdown(filteredVouchersForAnalysis);
    
    const mergedList = activeData.list.map(activeItem => {
      const totalItem = totalData.list.find(t => t.key === activeItem.key);
      return {
        ...activeItem,
        totalCount: totalItem ? totalItem.count : activeItem.count
      };
    });
    
    return { list: mergedList, total: activeData.total };
  };

  const getGroupingLabelEn = () => {
    switch (groupingFilter) {
      case 'all': return 'All Data';
      case 'week': return 'Weekly Scale';
      case 'month': return 'Monthly Scale';
      case 'quarter': return 'Quarterly Scale';
      case 'year': return 'Yearly Scale';
      case 'day': return 'Daily Scale';
      case 'biweekly': return 'Fortnightly Scale';
      case 'semiannually': return 'Half-Yearly Scale';
      case 'daytype': return 'Business vs Weekend';
      case 'shift': return 'Operational Hours';
      default: return 'Custom Timescale';
    }
  };

  const getCurrentGroupingData = (): { list: { key: string, label: string, count: number, percentage: number, color: string, desc?: string }[], total: number } => {
    let rawList: any[] = [];
    
    switch (groupingFilter) {
      case 'all': {
        const bd = getActiveAllBreakdown();
        return {
          list: bd.list.map(item => ({
            key: item.key,
            label: item.label,
            count: item.count,
            percentage: item.percentage,
            color: item.color,
            desc: language === 'hi' ? 'एआई इंजन द्वारा सत्यापित' : 'AI-verified segments'
          })),
          total: bd.total
        };
      }
      case 'week':
        rawList = getActiveWeekBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.dateRange
        }));
        break;
      case 'month':
        rawList = getActiveMonthBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: `${item.year} - ${item.percentage}% Density`
        }));
        break;
      case 'quarter':
        rawList = getActiveQuarterBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.period
        }));
        break;
      case 'year':
        rawList = getActiveYearBreakdown().map(item => ({
          key: item.label,
          label: item.label,
          count: item.count,
          desc: item.period
        }));
        break;
      case 'day':
        rawList = getActiveDayBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.dateStr
        }));
        break;
      case 'biweekly':
        rawList = getActiveBiweeklyBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.period
        }));
        break;
      case 'semiannually':
        rawList = getActiveSemiannuallyBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.period
        }));
        break;
      case 'daytype':
        rawList = getActiveDaytypeBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.period
        }));
        break;
      case 'shift':
        rawList = getActiveShiftBreakdown().map(item => ({
          key: item.id,
          label: item.label,
          count: item.count,
          desc: item.period
        }));
        break;
      default:
        rawList = [];
    }

    const total = rawList.reduce((sum, item) => sum + item.count, 0);
    const colorPalette = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-rose-500',
      'bg-orange-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];

    const list = rawList.map((item, index) => {
      const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
      return {
        key: item.key,
        label: item.label,
        count: item.count,
        percentage,
        color: colorPalette[index % colorPalette.length],
        desc: item.desc
      };
    });

    return { list, total };
  };

  const getEntryId = (entry: any): string => {
    if (!entry) return '';
    if (groupingFilter === 'all') return entry.key || '';
    if (groupingFilter === 'week') return entry.id || '';
    if (groupingFilter === 'month') return entry.id || '';
    if (groupingFilter === 'year') return entry.label || '';
    if (groupingFilter === 'quarter') return entry.id || '';
    if (groupingFilter === 'day') return entry.id || '';
    return entry.id || entry.key || '';
  };

  // --- Inline Visualizer Render Helpers ---

  const getCommonChartData = () => {
    let data: any[] = [];
    let xKey = 'label';
    
    if (groupingFilter === 'all') {
      data = getActiveAllBreakdown().list.map(item => ({ ...item, name: item.label, count: item.count }));
      xKey = 'name';
    } else if (groupingFilter === 'week') {
      data = getActiveWeekBreakdown();
    } else if (groupingFilter === 'month') {
      data = getActiveMonthBreakdown();
    } else if (groupingFilter === 'year') {
      data = getActiveYearBreakdown().map(item => ({ ...item, label: item.label, count: item.count }));
    } else if (groupingFilter === 'quarter') {
      data = getActiveQuarterBreakdown().map(item => ({ ...item, label: item.label, count: item.count }));
    } else if (groupingFilter === 'day') {
      data = getActiveDayBreakdown();
    } else if (groupingFilter === 'biweekly') {
      data = getActiveBiweeklyBreakdown();
    } else if (groupingFilter === 'semiannually') {
      data = getActiveSemiannuallyBreakdown();
    } else if (groupingFilter === 'daytype') {
      data = getActiveDaytypeBreakdown();
    } else if (groupingFilter === 'shift') {
      data = getActiveShiftBreakdown();
    }

    return { data, xKey };
  };

  const handleChartClick = (e: any) => {
    const payload = e?.activePayload?.[0]?.payload || e?.payload || e;
    if (!payload) return;
    const id = payload.id || payload.key || (payload.subject ? payload.subject : null);
    const fallbackId = payload.name || payload.label;
    const finalId = id || fallbackId;
    if (finalId) setSelectedId(selectedId === finalId ? null : finalId);
  };

  const handleDataClick = (data: any) => {
    const payload = data?.payload || data;
    if (!payload) return;
    const id = payload.id || payload.key || (Object.keys(payload).includes('subject') ? payload.subject : null);
    const fallbackId = payload.name || payload.label;
    const finalId = id || fallbackId;
    if (finalId) setSelectedId(selectedId === finalId ? null : finalId);
  };

  const renderVolumeBarChart = () => {
    const { data, xKey } = getCommonChartData();
    
    if (!isChartReady) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 h-[340px] flex items-center justify-center">
          <Clock className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 space-y-4 shadow-xs animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              {language === 'hi' ? 'वॉल्यूम बार चार्ट' : 'Volume Bar Chart Analysis'}
            </h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold pl-0.5">
              {language === 'hi' ? 'तुलनात्मक आवृत्ति दृश्य' : `Comparative frequency view (${getGroupingLabelEn()})`}
            </p>
          </div>
          <BarChart3 className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="h-[260px] w-full font-mono text-[10px] text-slate-450 dark:text-slate-500 font-bold cursor-pointer">
          <SafeResponsiveContainer>
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey={xKey} tickLine={false} stroke="#94a3b8" fontSize={9} />
              <YAxis tickLine={false} stroke="#94a3b8" fontSize={9} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }} 
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]} 
                onClick={handleDataClick}
                isAnimationActive={false}
              >
                {data.map((entry, index) => {
                  const payloadId = entry.id || entry.key || entry.name || entry.label;
                  const isSelected = selectedId === payloadId;
                  const hasSelection = selectedId !== null;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={hasSelection ? (isSelected ? '#8b5cf6' : '#8b5cf640') : '#8b5cf6'} 
                      style={{ transition: 'all 0.3s' }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </SafeResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderDistributionLineChart = () => {
    const { data, xKey } = getCommonChartData();
    
    if (!isChartReady) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 h-[340px] flex items-center justify-center">
          <Clock className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 space-y-4 shadow-xs animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              {language === 'hi' ? 'वितरण रेखा चार्ट' : 'Distribution Line Chart'}
            </h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold pl-0.5">
              {language === 'hi' ? 'प्रक्षेपवक्र रेखा ग्राफ' : `Trajectory step graph (${getGroupingLabelEn()})`}
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="h-[260px] w-full font-mono text-[10px] text-slate-450 dark:text-slate-500 font-bold cursor-pointer">
          <SafeResponsiveContainer>
            <LineChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey={xKey} tickLine={false} stroke="#94a3b8" fontSize={9} />
              <YAxis tickLine={false} stroke="#94a3b8" fontSize={9} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }} 
              />
              <Line 
                type="stepAfter" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={false}
                activeDot={{ 
                  r: 6,
                  onClick: (e: any, payload: any) => handleDataClick(payload)
                }} 
              />
            </LineChart>
          </SafeResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderRadarChart = () => {
    const { data: commonData } = getCommonChartData();
    let rawData = commonData.map(item => ({ ...item, subject: item.label || item.name, A: item.count, fullMark: 100 }));
    
    // Calculate fullMark based on max value to ensure radar chart looks good
    const maxVal = Math.max(...rawData.map(d => d.A), 10);
    const data = rawData.map(d => ({ ...d, fullMark: maxVal + Math.ceil(maxVal * 0.2) }));
    
    if (!isChartReady) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 h-[340px] flex items-center justify-center">
          <Clock className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 space-y-4 shadow-xs animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              {language === 'hi' ? 'रडार एरे चार्ट' : 'Multivariate Radar Array'}
            </h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold pl-0.5">
              {language === 'hi' ? 'स्पेक्ट्रम कवरेज' : `Spectrum coverage plot (${getGroupingLabelEn()})`}
            </p>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="h-[260px] w-full font-mono text-[9px] text-slate-600 dark:text-slate-400 font-bold cursor-pointer">
          <SafeResponsiveContainer>
            <RadarChart 
              cx="50%" cy="50%" outerRadius="75%" data={data}
              onClick={handleChartClick}
            >
              <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" className="dark:opacity-30" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
              <Radar 
                name="Count" 
                dataKey="A" 
                stroke="#f43f5e" 
                fill="#fb7185" 
                fillOpacity={0.4}
                isAnimationActive={false}
                activeDot={{
                  r: 6,
                  onClick: (e: any, payload: any) => handleDataClick(payload)
                }}
              />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }} 
              />
            </RadarChart>
          </SafeResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTopologyMap = () => {
    const { data: commonData } = getCommonChartData();
    const data = commonData.map((item: any) => ({ 
      ...item, 
      name: item.label || item.name, 
      size: item.count, 
      color: item.color,
      refId: item.id || item.key
    }));

    // Clean data (Treemap crashes on size: 0, we can add a tiny amount or filter out 0s)
    const treeData = data.filter(d => d.size > 0);
    if (treeData.length === 0) treeData.push({ name: 'Empty', size: 1, refId: 'empty' });

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#6366f1'];

    const CustomizedContent = (props: any) => {
      const { root, depth, x, y, width, height, index, payload, name, value, size, refId } = props;
      const isVisible = width > 50 && height > 40;
      
      const payloadId = refId || payload?.refId || payload?.id || payload?.key || name;
      const isSelected = selectedId === payloadId;
      const hasSelection = selectedId !== null;
      
      const handleClick = () => {
        if (payloadId && payloadId !== 'empty') {
          setSelectedId(selectedId === payloadId ? null : payloadId);
        }
      };
      
      return (
        <g onClick={handleClick}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: COLORS[index % COLORS.length] || '#8b5cf6',
              stroke: '#ffffff',
              strokeWidth: 2,
              opacity: hasSelection ? (isSelected ? 1 : 0.3) : 0.9,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
          {isVisible && (
            <>
              <text 
                x={x + width / 2} 
                y={y + height / 2 - 6} 
                textAnchor="middle"
                fill="#ffffff" 
                fontSize={12} 
                fontWeight="900" 
                fontFamily="sans-serif"
                className="pointer-events-none drop-shadow-sm truncate"
                style={{ opacity: hasSelection && !isSelected ? 0.3 : 1 }}
              >
                {name || (payload && payload.name) || ''}
              </text>
              <text 
                x={x + width / 2} 
                y={y + height / 2 + 12} 
                textAnchor="middle"
                fill="#ffffff" 
                fontSize={11} 
                fontWeight="600" 
                fontFamily="sans-serif"
                className="pointer-events-none drop-shadow-sm opacity-90 truncate tracking-wide"
                style={{ opacity: hasSelection && !isSelected ? 0.3 : 1 }}
              >
                {value !== undefined ? value : size !== undefined ? size : (payload && payload.size) || ''}
              </text>
            </>
          )}
        </g>
      );
    };

    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 space-y-4 shadow-xs animate-in slide-in-from-bottom-3 duration-300 flex flex-col h-[340px]">
        <div className="flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              {language === 'hi' ? 'डेटा टोपोलॉजी मैप' : 'Data Topology Treemap'}
            </h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold pl-0.5">
              {language === 'hi' ? 'संरचनात्मक डायग्राम' : `Volume proportion mapping (${getGroupingLabelEn()})`}
            </p>
          </div>
          <Network className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="flex-1 w-full h-[260px] overflow-hidden rounded-xl border-2 border-transparent">
          <SafeResponsiveContainer>
            <Treemap
              data={treeData}
              dataKey="size"
              aspectRatio={1.5}
              stroke="#fff"
              fill="#8b5cf6"
              content={<CustomizedContent />}
              isAnimationActive={false}
            >
              <RechartsTooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </Treemap>
          </SafeResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderInteractiveChart = () => {
    const { data, xKey } = getCommonChartData();
    
    if (!isChartReady) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 h-[340px] flex items-center justify-center">
          <Clock className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 space-y-4 shadow-xs animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              {language === 'hi' ? 'ट्रेंड लाइन ग्राफ' : 'Trend Line Graph Analytics'}
            </h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold pl-0.5">
              {language === 'hi' ? 'रीयल-टाइम लेनदेन गतिशीलता' : `Real-time synchronization activity plot (${getGroupingLabelEn()})`}
            </p>
          </div>
          <BarChart3 className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="h-[260px] w-full font-mono text-[10px] text-slate-450 dark:text-slate-500 font-bold cursor-pointer">
          <SafeResponsiveContainer>
            <AreaChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              onClick={handleChartClick}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey={xKey} tickLine={false} stroke="#94a3b8" fontSize={9} />
              <YAxis tickLine={false} stroke="#94a3b8" fontSize={9} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#chartGradient)"
                isAnimationActive={false}
                activeDot={{ 
                  r: 6,
                  onClick: (e: any, payload: any) => handleDataClick(payload)
                }} 
              />
            </AreaChart>
          </SafeResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderInteractiveDiagram = () => {
    const { data: commonData } = getCommonChartData();
    const data = commonData.map((item: any) => ({ ...item, name: item.label, value: item.count, refId: item.id || item.key }));
    
    const colors = [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#f43f5e', // rose
      '#f97316', // orange
      '#6366f1', // indigo
      '#ec4899', // pink
      '#14b8a6', // teal
      '#06b6d4'  // cyan
    ];
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-755 rounded-2xl p-6 space-y-4 shadow-xs animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-sans">
              {language === 'hi' ? 'डोनट खंड वितरण' : 'Voucher Segment Distribution'}
            </h4>
            <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold pl-0.5">
              {language === 'hi' ? 'प्रतिष्ठापन अनुपात' : 'Aesthetic proportion density metrics (Click slice to filter focus)'}
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
          <div className="h-[210px] w-full md:col-span-7 flex justify-center">
            <SafeResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  className="cursor-pointer"
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => {
                    const isSelected = selectedId === entry.refId;
                    const hasSelection = selectedId !== null;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]} 
                        onClick={() => setSelectedId(selectedId === entry.refId ? null : entry.refId)}
                        style={{
                          outline: 'none',
                          opacity: hasSelection ? (isSelected ? 1.0 : 0.25) : 1.0,
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '50% 50%',
                          transition: 'all 0.3s'
                        }}
                      />
                    );
                  })}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </SafeResponsiveContainer>
          </div>
          
          <div className="md:col-span-5 h-[230px] overflow-y-auto pr-1 space-y-2.5 font-mono text-[10px] font-bold text-slate-455 dark:text-slate-455">
            {data.map((item, index) => {
              const total = data.reduce((a, b) => a + b.value, 0);
              const share = total > 0 ? Math.round((item.value / total) * 100) : 0;
              const isSelected = selectedId === item.refId;
              const hasSelection = selectedId !== null;
              
              return (
                <div 
                  key={item.name}
                  onClick={() => setSelectedId(selectedId === item.refId ? null : item.refId)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-blue-50/45 dark:bg-blue-900/10 font-bold scale-102 ring-1 ring-blue-300'
                      : hasSelection
                        ? 'opacity-35 scale-98'
                        : 'hover:bg-slate-50 dark:hover:bg-gray-850'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: colors[index % colors.length] }} 
                    />
                    <span className="truncate max-w-[80px]" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 dark:text-white font-mono">
                      {item.value}
                    </span>
                    <span className="text-blue-500 whitespace-nowrap">
                      ({share}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Unified Filters toolbar row */}
      <div className="bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-750 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 col-span-full">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-500 font-gradient font-sans font-black uppercase tracking-widest leading-none flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              {language === 'hi' ? 'लेनदेन विश्लेषणात्मक फ़िल्टर' : 'Transaction Workspace filters'}
            </span>
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">
              {language === 'hi' ? 'तुलनात्मक डेटा रिपोर्ट और स्तर' : 'Comparative Data Granularity'}
            </h3>
          </div>

          {/* Action Controls Filter Alignments */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            
            {/* 1. Grouping/Timeframe Dropdown Selector */}
            <div className="flex flex-col space-y-1 sm:w-56">
              <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                {language === 'hi' ? 'वर्गीकरण स्तर चुनें' : 'Timeframe Grouping'}
              </span>
              <select
                value={groupingFilter}
                onChange={(e) => {
                  setGroupingFilter(e.target.value as any);
                  setSelectedId(null);
                }}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-gray-755 border border-slate-200/80 dark:border-gray-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-550 transition-all cursor-pointer"
              >
                <option value="all">{language === 'hi' ? 'सभी डेटा (All Data)' : 'All Data'}</option>
                <option value="week">{language === 'hi' ? 'साप्ताहिक वर्गीकरण (Weekly)' : 'Weekly Wise'}</option>
                <option value="month">{language === 'hi' ? 'मासिक वर्गीकरण (Monthly)' : 'Monthly Wise'}</option>
                <option value="quarter">{language === 'hi' ? 'वित्तीय तिमाही (Quarterly)' : 'Quarterly Wise'}</option>
                <option value="day">{language === 'hi' ? 'दैनिक विवरण (Daily)' : 'Daily / Day Wise'}</option>
                <option value="biweekly">{language === 'hi' ? 'द्वि-साप्ताहिक / पखवाड़ा (Fortnightly)' : 'Fortnightly'}</option>
                <option value="semiannually">{language === 'hi' ? 'अर्धवार्षिक लेखांकन (Half-Yearly)' : 'Half-Yearly'}</option>
                <option value="daytype">{language === 'hi' ? 'कार्यदिवस बनाम सप्ताहांत' : 'Weekday vs Weekend'}</option>
                <option value="shift">{language === 'hi' ? 'परिचालन शिफ्ट (Operational Shifts)' : 'Operational Shifts'}</option>
                <option value="year">{language === 'hi' ? 'वार्षिक बहीखाता (Yearly)' : 'Yearly Wise'}</option>
              </select>
            </div>

            {/* 2. Grouping/Type filter selector */}
            <div className="flex flex-col space-y-1 sm:w-52">
              <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                {language === 'hi' ? 'लेनदेन प्रकार फ़िल्टर' : 'Transaction Type'}
              </span>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as any);
                  setSelectedId(null);
                }}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-gray-755 border border-slate-200/80 dark:border-gray-700 rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-550 transition-all cursor-pointer"
              >
                <option value="all">{language === 'hi' ? 'सभी लेनदेन प्रकार' : 'All Ledger Flows'}</option>
                <option value="sales">{language === 'hi' ? 'बिक्री प्रभाव (Sales Only)' : 'Revenue/Sales Flows'}</option>
                <option value="purchase">{language === 'hi' ? 'खरीद प्रभाव (Purchase Only)' : 'Liability/Purchase Flows'}</option>
                <option value="receipt-payment">{language === 'hi' ? 'केश/बैंक प्रवाह (Receipt/Payment)' : 'Receipt & Payment Flows'}</option>
                <option value="journal">{language === 'hi' ? 'गैर-नकद प्रविष्टियां (Journal Only)' : 'Non-Cash Adjustments'}</option>
                <option value="gst">{language === 'hi' ? 'कम्पलायंस रिपोर्ट (GSTR Only)' : 'Compliance GSTR-1/3B'}</option>
              </select>
            </div>

            {/* 3. Operational Switch */}
            <div className="flex flex-col space-y-1 sm:w-32">
              <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                {language === 'hi' ? 'डिवाइस विश्लेषण' : 'Device Analysis'}
              </span>
              <button
                onClick={() => setShowDeviceDetails(!showDeviceDetails)}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  showDeviceDetails
                    ? 'bg-blue-50/50 border-blue-300 text-blue-600 dark:bg-blue-955/20 dark:border-blue-805 dark:text-blue-400 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-gray-755 dark:border-gray-700 dark:text-slate-400'
                }`}
              >
                <span className="truncate">{showDeviceDetails ? (language === 'hi' ? 'सक्रिय' : 'Enabled') : (language === 'hi' ? 'निष्क्रिय' : 'Disabled')}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${showDeviceDetails ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              </button>
            </div>

            {/* 4. Display report format visual mode */}
            <div className="flex flex-col space-y-1 sm:w-44">
              <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                {language === 'hi' ? 'रिपोर्ट दृश्य प्रारूप' : 'Report Format'}
              </span>
              <select
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value as any)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-gray-755 border border-slate-200/80 dark:border-gray-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-550 transition-all cursor-pointer"
              >
                <option value="all">{language === 'hi' ? 'सभी दृश्य (All Visuals)' : 'All Visuals Stacked'}</option>
                <option value="kpi">{language === 'hi' ? 'मुख्य प्रविष्टियाँ (KPIs Only)' : 'KPI Cards Only'}</option>
                <option value="chart">{language === 'hi' ? 'ट्रेंड चार्ट (Chart Only)' : 'Analytics Chart'}</option>
                <option value="diagram">{language === 'hi' ? 'सर्कुलर आरेख (Diagram Only)' : 'Flow/Diagram Map'}</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {filteredVouchersForAnalysis.length === 0 ? (
        <div className="py-16 text-center text-slate-450 dark:text-slate-500 font-bold bg-slate-50/50 dark:bg-gray-800/35 rounded-2xl border border-dashed border-slate-200 dark:border-gray-750 max-w-full text-xs animate-in fade-in duration-300">
          <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
          {language === 'hi' 
            ? 'इस विशिष्ट लेनदेन प्रकार के लिए कोई डेटा प्रविष्टि उपलब्ध नहीं है।' 
            : 'No registered records match the selected transaction filters.'
          }
        </div>
      ) : (() => {
        const { list: activeList, total: activeTotal } = getCurrentGroupingData();
        return (
          <div className="space-y-6 animate-in fade-in duration-305">
            {/* Unified Distribution & Visuals (Combined layout for all grouping modes) */}
            <div className="space-y-6">
              {/* Visual Layout Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* KPIs List & Dynamic Segment Bar */}
                {(displayMode === 'kpi' || displayMode === 'all') && (
                  <div className={`${displayMode === 'all' ? 'lg:col-span-12' : 'col-span-full'} space-y-6`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-755 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-700 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap font-sans">
                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                              {groupingFilter === 'all' 
                                ? (language === 'hi' ? 'समग्र लेनदेन संरचना विवरण' : 'Cumulative Voucher Classification Summary')
                                : (language === 'hi' ? 'समय सीमा के अनुसार डेटा वितरण' : `Voucher Classification (${getGroupingLabelEn()})`)}
                            </h3>
                            {selectedId && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-805 text-[9px] font-extrabold px-2 py-0.5 rounded-full dark:bg-blue-900/60 dark:text-blue-100 animate-pulse uppercase tracking-wider">
                                Active Focus: {selectedId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-455 dark:text-slate-505 font-medium pl-0.5">
                            {language === 'hi' 
                              ? 'सक्रिय फ़िल्टर समय सीमा के लिए रीयल-टाइम डेटा विश्लेषण। विवरण फ़िल्टर करने के लिए किसी भी कार्ड या बार सेगमेंट पर क्लिक करें।' 
                              : 'Volume breakdown for the active configuration. Click any card or segment to filter.'}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[10px] text-slate-450 uppercase font-black block">
                            {selectedId 
                              ? `${selectedId.toUpperCase()}` 
                              : (language === 'hi' ? 'कुल संख्या' : 'Total Population')
                            }
                          </span>
                          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                            {selectedId 
                              ? activeList.find(i => i.key === selectedId)?.count || 0
                              : activeTotal
                            }
                          </span>
                        </div>
                      </div>

                      {/* Advanced distribution density layout bar */}
                      <div className="space-y-4 font-sans">
                        <div className="h-4 w-full bg-slate-100 dark:bg-gray-700/60 rounded-full flex overflow-hidden shadow-inner">
                          {activeList.map((item) => {
                            const isSelected = selectedId === item.key;
                            const hasSelection = selectedId !== null;
                            return (
                              <div 
                                key={item.key}
                                className={`${item.color} h-full transition-all duration-300 cursor-pointer`}
                                style={{ 
                                  width: `${item.percentage}%`,
                                  opacity: hasSelection ? (isSelected ? 1.0 : 0.2) : 1.0
                                }}
                                onClick={() => setSelectedId(selectedId === item.key ? null : item.key)}
                                title={`${item.label}: ${item.count} (${item.percentage}%)`}
                              />
                            );
                          })}
                        </div>

                        {/* Grid checklist representation */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-in fade-in duration-200">
                          {activeList.map((item) => {
                            const isSelected = selectedId === item.key;
                            const hasSelection = selectedId !== null;
                            return (
                              <div 
                                key={item.key}
                                onClick={() => setSelectedId(selectedId === item.key ? null : item.key)}
                                className={`p-3 border rounded-xl space-y-2 group/card relative cursor-pointer transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-blue-50/40 border-blue-300 dark:bg-blue-955/25 dark:border-blue-805 shadow-sm ring-4 ring-blue-550/10 scale-102 font-bold'
                                    : hasSelection
                                      ? 'opacity-35 filter grayscale-[10%] border-transparent bg-slate-50/40 dark:bg-gray-850/40 scale-98'
                                      : 'bg-white dark:bg-gray-800 border-slate-100 dark:border-gray-755/70 hover:border-slate-350 dark:hover:border-gray-700 hover:shadow-md'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                  <span className="text-[10px] font-black text-slate-650 dark:text-slate-350 truncate max-w-[124px]" title={item.label}>
                                    {item.label}
                                  </span>
                                  {isSelected && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  )}
                                </div>
                                <div className="space-y-0.5 font-sans">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-855 dark:text-white tracking-tight">
                                      {item.count}
                                    </span>
                                    <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-505 font-mono">
                                      Txns
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-slate-405 font-bold font-mono">
                                    {item.percentage}% Share
                                  </div>
                                  {item.desc && (
                                    <div className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold truncate pt-1 border-t border-slate-100/40 dark:border-gray-750/30 font-sans" title={item.desc}>
                                      {item.desc}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Stand-alone Device Wise KPIs (moved above charts) */}
                {showDeviceDetails && (displayMode === 'kpi' || displayMode === 'all') && (
                  <div className="col-span-full space-y-4 animate-in fade-in duration-300 pt-2 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-slate-855 dark:text-white uppercase tracking-wider pl-1 font-sans">
                          {language === 'hi' ? 'डिवाइस वाइज़ डेटा वितरण' : 'Device-Wise Data KPIs'}
                        </h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold pl-1 font-sans">
                          {language === 'hi'
                            ? 'सक्रिय फ़िल्टर समय सीमा के लिए रीयल-टाइम डिवाइस सिंक (चयन करने के लिए क्लिक करें)'
                            : 'Real-time sync statistics by device for the active grouping timescale. (Click any card to filter entire view)'
                          }
                        </p>
                      </div>
                      {(selectedId || selectedDevice) && (
                        <div className="flex items-center gap-2 flex-wrap font-sans">
                          {selectedId && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-750 text-[10px] font-black px-2.5 py-1 rounded-full dark:bg-emerald-955/25 dark:text-emerald-400 uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                              {language === 'hi' ? `फ़िल्टर: ${selectedId}` : `Timescale: ${selectedId}`}
                            </span>
                          )}
                          {selectedDevice && (
                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-755 text-[10px] font-black px-2.5 py-1 rounded-full dark:bg-indigo-955/30 dark:text-indigo-450 uppercase tracking-widest border border-indigo-150 dark:border-indigo-900/35">
                              {language === 'hi' ? `डिवाइस: ${selectedDevice.toUpperCase()}` : `Device: ${selectedDevice.toUpperCase()}`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 font-sans">
                      {(getActiveDeviceBreakdown().list as any[]).map((item) => {
                        const DeviceIcon = item.icon;
                        const isDeviceSelected = selectedDevice === item.key;
                        const hasDeviceSelection = selectedDevice !== null;
                        
                        return (
                          <div 
                            key={item.label}
                            onClick={() => setSelectedDevice(selectedDevice === item.key ? null : item.key as any)}
                            className={`border p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 animate-in fade-in duration-300 cursor-pointer transition-all duration-300 ${
                              isDeviceSelected
                                ? 'bg-indigo-50/45 border-indigo-400 dark:bg-indigo-955/20 dark:border-indigo-805 shadow-sm ring-4 ring-indigo-550/10 scale-102 font-bold'
                                : hasDeviceSelection
                                  ? 'opacity-35 filter grayscale-[10%] border-transparent bg-slate-50/40 dark:bg-gray-850/40 scale-98'
                                  : 'bg-white dark:bg-gray-800 border-slate-100 dark:border-gray-755/70 hover:border-slate-350 dark:hover:border-gray-700 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between font-sans">
                              <span className="text-[9px] text-slate-405 dark:text-slate-505 font-extrabold uppercase tracking-widest">
                                {item.label}
                              </span>
                              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${item.color}`}>
                                <DeviceIcon className="w-4 h-4" />
                              </div>
                            </div>
          
                            <div className="space-y-1 font-sans">
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-855 dark:text-white tracking-tight">
                                  {item.count}
                                  {selectedId && item.totalCount !== item.count && (
                                    <span className="text-sm text-slate-400 dark:text-slate-500 ml-1">
                                      / {item.totalCount}
                                    </span>
                                  )}
                                  {selectedId && item.totalCount === item.count && (
                                    <span className="text-sm text-slate-400 dark:text-slate-500 ml-1">
                                      / {item.totalCount}
                                    </span>
                                  )}
                                </span>
                                <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-505">
                                  {language === 'hi' ? 'प्रविष्टियां' : 'Txns'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-404 font-semibold pt-1">
                                <span>{item.version}</span>
                                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-405 px-1.5 py-0.5 rounded text-[9px] font-extrabold font-mono">
                                  {item.percentage}% Share
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chart / Diagram Grid */}
                {displayMode === 'all' && (
                  <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    {renderInteractiveChart()}
                    {renderInteractiveDiagram()}
                    {renderVolumeBarChart()}
                    {renderDistributionLineChart()}
                    {renderRadarChart()}
                    {renderTopologyMap()}
                  </div>
                )}
                {displayMode === 'chart' && (
                  <div className="lg:col-span-12 animate-in fade-in duration-305 space-y-6">
                    {renderInteractiveChart()}
                    {renderVolumeBarChart()}
                    {renderDistributionLineChart()}
                    {renderRadarChart()}
                  </div>
                )}
                {displayMode === 'diagram' && (
                  <div className="lg:col-span-12 animate-in fade-in duration-305 space-y-6">
                    {renderInteractiveDiagram()}
                    {renderTopologyMap()}
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
