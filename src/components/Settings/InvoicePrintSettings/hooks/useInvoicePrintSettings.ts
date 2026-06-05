import { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import { DEFAULT_INVOICE_SETTINGS } from '../constants';

export const useInvoicePrintSettings = () => {
    const [settings, setSettings] = useState(DEFAULT_INVOICE_SETTINGS);
    const [isSaved, setIsSaved] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [plannerPageType, setPlannerPageType] = useState<'First' | 'Middle' | 'Last'>('First');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [autoScale, setAutoScale] = useState(0.4);
    const [manualZoom, setManualZoom] = useState<number | null>(null);
    const previewScale = isNaN(manualZoom !== null ? (manualZoom as number) : autoScale) ? 0.4 : (manualZoom !== null ? manualZoom : autoScale);
    
    // Derived state for dummy data
    const [dummyHeader, setDummyHeader] = useState<any>({
        voucherNumber: '-',
        entryNumber: '-',
        voucherDate: '-',
        partyName: '-',
        billingPartyName: '-',
        billingAddress: '-',
        billingState: '-',
        billingPinCode: '-',
        billingContact: '-',
        gstNumber: '-',
        narration: '-',
        referenceNo: '-',
        poNumber: '-'
    });
    const [dummyRows, setDummyRows] = useState<any[]>([]);
    const [dummyTotals, setDummyTotals] = useState<any>({
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        grandTotal: 0,
        finalValue: 0
    });

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }));
    };

    const resetSettingsForSection = (keys: (keyof typeof settings)[], sectionStylesKeys?: string[]) => {
        setSettings(prev => {
            const next = { ...prev };
            keys.forEach(key => {
                (next as any)[key] = (DEFAULT_INVOICE_SETTINGS as any)[key];
            });
            if (sectionStylesKeys) {
                sectionStylesKeys.forEach(key => {
                    next.sectionStyles[key as keyof typeof next.sectionStyles] = (DEFAULT_INVOICE_SETTINGS.sectionStyles as any)[key];
                });
            }
            return next;
        });
    };

    const resetAllSettings = () => {
        setSettings(DEFAULT_INVOICE_SETTINGS);
    };

    const handleSave = () => {
        localStorage.setItem('bharat_book_print_settings_v3', JSON.stringify(settings));
        setIsSaved(true);
        window.dispatchEvent(new Event('print_settings_updated'));
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "bharat_book_print_settings.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportSettings = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonObj = JSON.parse(e.target?.result as string);
                setSettings(jsonObj);
            } catch (error) {
                console.error("Error parsing settings JSON", error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleZoomIn = () => setManualZoom(prev => Math.min((prev || autoScale) + 0.1, 2));
    const handleZoomOut = () => setManualZoom(prev => Math.max((prev || autoScale) - 0.1, 0.2));
    const handleFullSize = () => setManualZoom(1);
    
    const handleResetZoom = () => {
        if (previewContainerRef.current) {
            previewContainerRef.current.scrollTop = 0;
            previewContainerRef.current.scrollLeft = 0;
        }
        setManualZoom(null);
        
        requestAnimationFrame(() => {
            if (previewContainerRef.current) {
                previewContainerRef.current.scrollTop = 0;
                previewContainerRef.current.scrollLeft = 0;
            }
        });
    };

    // Load saved settings
    useEffect(() => {
        const saved = localStorage.getItem('bharat_book_print_settings_v3');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse saved settings", e);
            }
        }
    }, []);

    // Generate dummy data
    useEffect(() => {
        const CATEGORIES: Record<string, {name: string, hsn: string, rate: number, tax: number}[]> = {
            'electronics': [
                {name: 'Premium Wireless Headphones', hsn: '8518', rate: 2499.00, tax: 18},
                {name: 'Mechanical Gaming Keyboard', hsn: '8471', rate: 5999.00, tax: 18},
                {name: '27-inch 4K Monitor', hsn: '8528', rate: 24500.00, tax: 28},
                {name: 'USB-C Hub 7-in-1', hsn: '8544', rate: 1299.00, tax: 18},
                {name: '1TB NVMe SSD', hsn: '8523', rate: 8499.00, tax: 18},
            ],
            'services': [
                {name: 'Web Development Consulting', hsn: '9983', rate: 15000.00, tax: 18},
                {name: 'Monthly SEO Maintenance', hsn: '9983', rate: 8000.00, tax: 18},
                {name: 'UI/UX Design', hsn: '9983', rate: 25000.00, tax: 18},
                {name: 'Server Config', hsn: '9983', rate: 5000.00, tax: 18},
            ],
        };

        const deferredSampleItemCount = 50;
        const deferredSampleHsnCount = 5;
        const isInterstate = false;
        const sampleCategory: string = 'electronics';
        const catItems = CATEGORIES[sampleCategory] || CATEGORIES['electronics'];
        const newRows = [];
        let taxableValue = 0;
        let totalTaxAmount = 0;

        for (let i = 0; i < deferredSampleItemCount; i++) {
            const template = catItems[i % catItems.length];
            const qty = (i % 5) + 1;
            const amount = qty * template.rate;
            taxableValue += amount;
            
            const rowTax = amount * (template.tax / 100);
            totalTaxAmount += rowTax;

            const hsnIndex = i % Math.max(1, deferredSampleHsnCount);
            const baseHsn = parseInt(CATEGORIES[sampleCategory]?.[0]?.hsn || '8500');
            const hsnVal = baseHsn + hsnIndex;

            newRows.push({
                itemName: template.name + (i >= catItems.length ? ` - Variant ${Math.floor(i/catItems.length)}` : ''),
                hsn: hsnVal.toString(),
                qty: qty,
                uom: sampleCategory === 'services' ? 'Hrs' : 'Pcs',
                rate: template.rate,
                mrp: template.rate * 1.2,
                discountPercent: 0,
                discountAmount: 0,
                tax: template.tax,
                amount: amount,
                crDr: 'Dr'
            });
        }

        setDummyRows(newRows);
        setDummyTotals({
            taxableValue: taxableValue,
            cgst: isInterstate ? 0 : totalTaxAmount / 2,
            sgst: isInterstate ? 0 : totalTaxAmount / 2,
            igst: isInterstate ? totalTaxAmount : 0,
            grandTotal: taxableValue + totalTaxAmount,
            finalValue: taxableValue + totalTaxAmount
        });
        
        setDummyHeader(prev => ({
            ...prev,
            voucherNumber: 'INV-2026-001',
            entryNumber: 'INV-2026-001',
            voucherDate: '2026-05-12',
            partyName: prev.partyName === '-' ? 'Acme Corp Sample' : prev.partyName,
            billingPartyName: prev.billingPartyName === '-' ? 'Acme Corp Sample' : prev.billingPartyName,
            billingAddress: prev.billingAddress === '-' ? '123 Business Road' : prev.billingAddress,
            billingState: prev.billingState === '-' ? 'Maharashtra' : prev.billingState,
            billingPinCode: prev.billingPinCode === '-' ? '400001' : prev.billingPinCode,
            billingContact: prev.billingContact === '-' ? '+91 98765 43210' : prev.billingContact,
            gstNumber: prev.gstNumber === '-' ? '27AADCB2230M1Z2' : prev.gstNumber,
            narration: prev.narration === '-' ? 'Being goods sold as per order.' : prev.narration,
            referenceNo: prev.referenceNo === '-' ? 'REF-99201' : prev.referenceNo,
            poNumber: prev.poNumber === '-' ? 'PO-4421' : prev.poNumber,
        }));
    }, []);

    // Pagination Logic
    const itemPages = useMemo(() => {
        const first = settings.itemsPerFirstPage || 12;
        const second = settings.itemsPerSecondPage || 15;
        const last = settings.itemsPerLastPage || 10;
        
        const hsnCount = new Set(dummyRows.map(r => r.hsn)).size;
        const effectiveLast = settings.showHsnSummary ? Math.max(0, last - hsnCount) : last;
        
        const pages = [];
        let start = 0;
        const totalItems = dummyRows.length;
        
        if (totalItems === 0) return [[]];

        let remaining = totalItems - start;
        if (remaining <= effectiveLast) {
            pages.push(dummyRows.slice(start, start + remaining));
            return pages;
        } else {
            const firstLimit = first > 0 ? first : 12;
            const toTake = Math.min(remaining, firstLimit);
            pages.push(dummyRows.slice(start, start + toTake));
            start += toTake;
        }
        
        while (start < totalItems) {
            remaining = totalItems - start;
            if (remaining <= effectiveLast) {
                 pages.push(dummyRows.slice(start, start + remaining));
                 start += remaining;
                 break;
            } else {
                 const limit = second > 0 ? second : 15;
                 const toTake = Math.min(remaining, limit);
                 pages.push(dummyRows.slice(start, start + toTake));
                 start += toTake;
            }
        }
        
        if (pages.length > 0) {
            let lastPageItems = pages[pages.length - 1].length;
            if (lastPageItems > effectiveLast) {
                pages.push([]);
            }
        }
        
        return pages;
    }, [dummyRows, settings.itemsPerFirstPage, settings.itemsPerSecondPage, settings.itemsPerLastPage, settings.showHsnSummary]);

    const totalPages = Math.max(1, itemPages.length);
    const paginatedRows = itemPages[currentPage - 1] || [];
    const absoluteStartIndex = itemPages.slice(0, currentPage - 1).reduce((sum, page) => sum + page.length, 0);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    // Handle Viewer Scaling
    useEffect(() => {
        const updateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.clientWidth - 32;
                const containerHeight = previewContainerRef.current.clientHeight - 32;
                
                let docWidth = 794;
                let docHeight = 1123;
                switch (settings.pageSize) {
                    case 'Thermal': docWidth = 300; docHeight = 1056; break;
                    case 'A5': docWidth = 559; docHeight = 794; break;
                    case 'Letter': docWidth = 816; docHeight = 1056; break;
                    case 'Legal': docWidth = 816; docHeight = 1344; break;
                    case 'A4':
                    default: docWidth = 794; docHeight = 1123; break;
                }
                if (settings.pageOrientation === 'Landscape') {
                    const temp = docWidth;
                    docWidth = docHeight;
                    docHeight = temp;
                }

                const scaleW = containerWidth / docWidth;
                const scaleH = containerHeight / docHeight;
                setAutoScale(Math.min(scaleW, scaleH, 1.5));
            }
        };

        const observer = new ResizeObserver(updateScale);
        if (previewContainerRef.current) observer.observe(previewContainerRef.current);
        
        const previewDoc = document.getElementById('voucher-preview-document');
        if (previewDoc) observer.observe(previewDoc);
        
        const timer = setTimeout(updateScale, 100);
        
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [settings]);

    return {
        settings, setSettings, isSaved, 
        activeSection, toggleSection, resetSettingsForSection, resetAllSettings, toggleSetting,
        plannerPageType, setPlannerPageType,
        currentPage, setCurrentPage, totalPages, paginatedRows, absoluteStartIndex, itemPages,
        manualZoom, handleZoomIn, handleZoomOut, handleFullSize, handleResetZoom, previewScale,
        dummyHeader, dummyRows, dummyTotals,
        previewContainerRef, printRef,
        handleSave, handleExport, handleImportSettings
    };
};
