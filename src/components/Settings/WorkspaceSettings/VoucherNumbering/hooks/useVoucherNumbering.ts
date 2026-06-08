import { useState, useEffect } from 'react';
import { defaultVoucherSettings } from "../../../../../services/voucherNumbering";
import { VoucherSetting } from "../types";

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

    const handleExport = (format?: 'JSON' | 'CSV') => {
        if (format === 'CSV') {
            let csvContent = "key,prefix,suffix,startingNo,width,method,restartOn\n";
            for (const [key, value] of Object.entries(settings)) {
                csvContent += `"${key}","${value.prefix || ''}","${value.suffix || ''}",${value.startAt || 1},${value.padding !== undefined ? value.padding : 3},"${value.autoGenerate ? 'automatic' : 'manual'}","${value.resetPattern || 'yearly'}"\n`;
            }
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "bharat_book_voucher_settings.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "bharat_book_voucher_settings.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    };

    const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (file.name.toLowerCase().endsWith('.csv')) {
                try {
                    const lines = result.split('\n');
                    const newSettings: any = { ...settings };
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        
                        // Parse CSV lines carefully
                        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                        if (parts.length >= 7) {
                            let key = parts[0].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                            let prefix = parts[1].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                            let suffix = parts[2].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                            let startAt = parseInt(parts[3].trim(), 10) || 1;
                            let padding = parseInt(parts[4].trim(), 10) || 3;
                            let autoGenerate = parts[5].trim().replace(/^"|"$/g, '').replace(/""/g, '"') === 'automatic';
                            let resetPattern = parts[6].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                            
                            newSettings[key] = {
                                prefix,
                                suffix,
                                startAt,
                                padding,
                                autoGenerate,
                                resetPattern
                            };
                        }
                    }
                    setSettings(newSettings);
                } catch (error) {
                    console.error("Error parsing CSV", error);
                }
            } else {
                try {
                    const jsonObj = JSON.parse(result);
                    setSettings({ ...defaultSettings, ...jsonObj } as any);
                } catch (error) {
                    console.error("Error parsing settings JSON", error);
                }
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
