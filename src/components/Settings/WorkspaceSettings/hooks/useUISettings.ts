import { useState, useEffect } from 'react';

export interface UISettingsState {
  density: "compact" | "standard" | "spacious";
  sidebarStyle: "expanded" | "collapsed" | "hover";
  showStatusIndicator: boolean;
  selectedTheme: "standard" | "coal" | "cobalt" | "emerald";
  colorMode: "system" | "light" | "dark";
  currencyStyle: "indian" | "intl";
  dateFormat: "DD-MM-YYYY" | "YYYY-MM-DD" | "MM-DD-YYYY";
  hideSalaries: boolean;
  hardwareAcceleration: boolean;
  reducedMotion: boolean;
  cacheSize: "10" | "50" | "100";
  fontFamily: "inter" | "space" | "jetbrains";
  maxGridZoom: "85" | "100" | "115";
  borderWeight: "thin" | "medium" | "thick";
  isMaxMode: boolean;
}

const defaultSettings: UISettingsState = {
  density: "compact",
  sidebarStyle: "expanded",
  showStatusIndicator: true,
  selectedTheme: "standard",
  colorMode: "light",
  currencyStyle: "indian",
  dateFormat: "DD-MM-YYYY",
  hideSalaries: false,
  hardwareAcceleration: true,
  reducedMotion: false,
  cacheSize: "50",
  fontFamily: "inter",
  maxGridZoom: "100",
  borderWeight: "thin",
  isMaxMode: false,
};

export const useUISettings = () => {
  const [settings, setSettings] = useState<UISettingsState>(defaultSettings);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('bharat_book_ui_settings');
        if (stored) {
          setSettings(prev => ({ ...prev, ...JSON.parse(stored) }));
        }
      } catch (err) {
        console.error("Failed to load UI settings", err);
      }
    };
    loadSettings();
    
    // Listen for custom event to reload settings
    const handleStorageChange = () => loadSettings();
    window.addEventListener('ui_settings_changed', handleStorageChange);
    return () => window.removeEventListener('ui_settings_changed', handleStorageChange);
  }, []);

  const saveSettings = (newSettings: Partial<UISettingsState>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('bharat_book_ui_settings', JSON.stringify(updated));
    window.dispatchEvent(new Event('ui_settings_changed'));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('bharat_book_ui_settings', JSON.stringify(defaultSettings));
    window.dispatchEvent(new Event('ui_settings_changed'));
  };

  return { settings, setSettings, saveSettings, resetSettings };
};
