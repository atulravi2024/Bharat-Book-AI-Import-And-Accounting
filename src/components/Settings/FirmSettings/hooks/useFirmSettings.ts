import { useState, useRef, useEffect, useMemo, ChangeEvent } from "react";
import { initialFirmData, ALL_SEARCH_FIELDS } from "../constants";
import { LedgerMaster } from "../../../../app/types";
import { INDIAN_BANKS } from "../../../../lib/banks";

export const useFirmSettings = (ledgerMasters: LedgerMaster[]) => {
  const [isSaved, setIsSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isDanger: boolean;
    onConfirm: () => void;
  } | null>(null);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  const [firmData, setFirmData] = useState(() => {
    try {
        const saved = localStorage.getItem("firmSettings_v1");
        if (saved) {
            return { ...initialFirmData, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error("Error parsing saved firm settings:", e);
    }
    return initialFirmData;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const bankOptions = useMemo(() => {
    const masterBanks = ledgerMasters
      .filter((m) => m.group?.toLowerCase().includes("bank"))
      .map((m) => ({ id: m.name, name: m.name }));
    const defaultBanks = INDIAN_BANKS.map((b) => ({ id: b, name: b }));
    const combined = [...masterBanks, ...defaultBanks];
    const uniqueNames = Array.from(new Set(combined.map((b) => b.name)));
    return uniqueNames.map((name) => ({ id: name, name }));
  }, [ledgerMasters]);

  const handleSearchSelect = (item: typeof ALL_SEARCH_FIELDS[0]) => {
    const isAlreadyOpen = activeAccordion === item.id;
    setActiveAccordion(item.id);
    setSearchTerm("");
    setShowDropdown(false);
    
    const delay = isAlreadyOpen ? 100 : 500;
    setTimeout(() => {
        const labels = Array.from(document.querySelectorAll('label'));
        const targetLabel = labels.find(l => {
            const text = l.textContent?.toLowerCase().trim() || "";
            const searchLabel = item.label.toLowerCase().trim();
            return text === searchLabel || text.includes(searchLabel) || searchLabel.includes(text);
        });
        
        if (targetLabel) {
            targetLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const container = targetLabel.closest('.space-y-2') || targetLabel.parentElement;
            const interactive = container?.querySelector('input, select, textarea, [role="combobox"], button:not([title])') as HTMLElement;
            
            if (interactive) {
               const focusTarget = interactive.getAttribute('role') === 'combobox' 
                  ? interactive 
                  : (interactive.tagName === 'INPUT' || interactive.tagName === 'SELECT' || interactive.tagName === 'TEXTAREA' ? interactive : null);

               if (focusTarget) {
                 focusTarget.focus();
               }

               const highlightTarget = container as HTMLElement;
               if (highlightTarget) {
                 highlightTarget.classList.add('ring-4', 'ring-blue-500/40', 'bg-blue-50/50', 'rounded-xl', 'transition-all', 'duration-500', 'z-10', 'relative');
                 setTimeout(() => {
                   highlightTarget.classList.remove('ring-4', 'ring-blue-500/40', 'bg-blue-50/50');
                 }, 3000);
               }
            }
        }
    }, delay); 
  };

  const handleLoad = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    } else {
        const globalInput = document.getElementById('globalHiddenFileInput') as HTMLInputElement;
        globalInput?.click();
    }
  };

  const handleClear = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Clear All Fields",
      message: "This will CLEAR ALL FILLED data in this form.\n\nAre you sure you want to proceed?",
      confirmText: "Yes, Clear All",
      cancelText: "No, Cancel",
      isDanger: true,
      onConfirm: () => {
        const clearedData = Object.keys(initialFirmData).reduce((acc: any, key) => {
          const val = (initialFirmData as any)[key];
          if (typeof val === "boolean") {
            acc[key] = false;
          } else if (typeof val === "number") {
            acc[key] = 0;
          } else {
            acc[key] = "";
          }
          return acc;
        }, {});
        
        setFirmData(clearedData);
        setActiveAccordion("basicCompany");
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        setAlertConfig({
          isOpen: true,
          title: "Success",
          message: "All fields have been cleared successfully. (Click Save to apply)"
        });
      }
    });
  };

  const handleResetToDefault = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Reset to Saved Settings",
      message: "This will discard any unsaved changes and restore the settings to their last saved values.\n\nAre you sure you want to proceed?",
      confirmText: "Yes, Reset",
      cancelText: "No, Cancel",
      isDanger: false,
      onConfirm: () => {
        const saved = localStorage.getItem("firmSettings_v1");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setFirmData({ ...initialFirmData, ...parsed });
          } catch (e) {
            setFirmData({ ...initialFirmData });
          }
        } else {
          setFirmData({ ...initialFirmData });
        }
        
        setActiveAccordion("basicCompany");
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        setAlertConfig({
          isOpen: true,
          title: "Success",
          message: "Settings have been restored to last saved values."
        });
      }
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem("firmSettings_v1", JSON.stringify(firmData));
    } catch (err) {
      console.error("Failed to save firm settings", err);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(firmData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "firmSettings_backup.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleCombinedImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (file.name.toLowerCase().endsWith('.csv')) {
        try {
          const lines = result.split('\n');
          const newFirmData: any = {};
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const firstCommaIndex = line.indexOf(',');
            if (firstCommaIndex > -1) {
               let key = line.substring(0, firstCommaIndex);
               let val = line.substring(firstCommaIndex + 1);
               
               if (key.startsWith('"') && key.endsWith('"')) {
                   key = key.substring(1, key.length - 1);
               }
               if (val.startsWith('"') && val.endsWith('"')) {
                   val = val.substring(1, val.length - 1);
               }
               key = key.replace(/""/g, '"');
               val = val.replace(/""/g, '"');

               if (initialFirmData.hasOwnProperty(key)) {
                  newFirmData[key] = val === "true" ? true : val === "false" ? false : val;
               }
            }
          }
          setFirmData(prev => ({ ...prev, ...newFirmData }));
          setAlertConfig({
            isOpen: true,
            title: "Backup Restored",
            message: "CSV backup restored successfully. Please click Save to persist."
          });
        } catch (err) {
          setAlertConfig({
            isOpen: true,
            title: "Error",
            message: "Invalid CSV file."
          });
        }
      } else {
        try {
          const parsed = JSON.parse(result);
          setFirmData(prev => ({ ...prev, ...parsed }));
          setAlertConfig({
            isOpen: true,
            title: "Backup Restored",
            message: "JSON backup restored successfully. Please click Save Changes to persist."
          });
        } catch (err) {
          setAlertConfig({
            isOpen: true,
            title: "Error",
            message: "Invalid JSON backup file."
          });
        }
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportCSV = () => {
    const keys = Object.keys(firmData) as (keyof typeof initialFirmData)[];
    let csvContent = "Key,Value\n";
    for (const key of keys) {
      const value = (firmData as any)[key];
      const escapedValue = String(value).replace(/"/g, '""');
      csvContent += `"${key}","${escapedValue}"\n`;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "firmSettings_backup.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFactoryReset = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Factory Reset",
      message: "Are you sure you want to run the factory reset? This will clear all settings and reset to defaults.",
      confirmText: "Yes, Reset",
      cancelText: "Cancel",
      isDanger: true,
      onConfirm: () => {
        setFirmData({ ...initialFirmData });
        localStorage.removeItem("firmSettings_v1");
        setActiveAccordion("basicCompany");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return {
    isSaved,
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    activeAccordion,
    confirmConfig,
    setConfirmConfig,
    alertConfig,
    setAlertConfig,
    firmData,
    setFirmData,
    fileInputRef,
    searchDropdownRef,
    bankOptions,
    handleSearchSelect,
    handleLoad,
    handleClear,
    handleResetToDefault,
    handleSave,
    handleExportBackup,
    handleCombinedImport,
    handleExportCSV,
    handleFactoryReset,
    toggleAccordion
  };
};
