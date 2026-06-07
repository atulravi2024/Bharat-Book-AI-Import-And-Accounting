import { useState, useEffect } from 'react';
import { defaultVoucherSettings } from '../../../../services/voucherNumbering';
import { VoucherSetting } from '../types';

export const useVoucherNumbering = () => {
    const defaultSettings = defaultVoucherSettings;
    const [settings, setSettings] = useState<Record<string, VoucherSetting>>(defaultSettings as any);
    const [isSaved, setIsSaved] = useState(false);
    const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = localStorage.getItem('bharat_book_voucher_numbering');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings({ ...defaultSettings, ...parsed } as any);
            } catch (e) {
                console.error("Failed to parse voucher numbering settings");
            }
        }
        
        // Initial collapse states (all collapsed by default)
        const initialCollapsed: Record<string, boolean> = {};
        Object.keys(defaultSettings).forEach(key => {
            initialCollapsed[key] = true;
        });
        setCollapsedStates(initialCollapsed);
    }, []);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        localStorage.setItem('bharat_book_voucher_numbering', JSON.stringify(settings));
    };

    const resetAllSettings = () => {
        setSettings(defaultSettings as any);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "bharat_book_voucher_settings.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonObj = JSON.parse(e.target?.result as string);
                setSettings({ ...defaultSettings, ...jsonObj } as any);
            } catch (error) {
                console.error("Error parsing settings JSON", error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleSettingChange = (type: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const toggleCollapse = (id: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') {
            return;
        }
        setCollapsedStates(prev => {
            const isCurrentlyCollapsed = prev[id] !== false; // handle undefined as true
            if (isCurrentlyCollapsed) {
                // Expanding this one, collapse all others
                const newState: Record<string, boolean> = {};
                Object.keys(defaultSettings).forEach(key => {
                    newState[key] = key === id ? false : true;
                });
                return newState;
            } else {
                // Collapsing this one
                return { ...prev, [id]: true };
            }
        });
    };

    return {
        settings,
        isSaved,
        collapsedStates,
        handleSave,
        resetAllSettings,
        handleExport,
        handleImportSettings,
        handleSettingChange,
        toggleCollapse
    };
};
