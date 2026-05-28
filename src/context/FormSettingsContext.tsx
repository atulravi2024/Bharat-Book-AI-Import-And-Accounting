import React, { createContext, useContext, useEffect, useState } from "react";

export const defaultSettings = {
  // Form Layout - Desktop
  desktopLayoutType: "standard",
  desktopColumns: "3",
  desktopLabelPosition: "top",
  desktopInputSize: "medium",
  desktopShowBorders: true,
  desktopStickyHeader: true,
  
  // Form Layout - Tablet
  tabletLayoutType: "standard",
  tabletColumns: "2",
  tabletLabelPosition: "top",
  tabletInputSize: "medium",
  tabletShowBorders: true,
  tabletStickyHeader: false,
  
  // Form Layout - Mobile
  mobileLayoutType: "stacked",
  mobileColumns: "1",
  mobileLabelPosition: "top",
  mobileInputSize: "large",
  mobileShowBorders: false,
  mobileStickyHeader: true,
  
  // Form Defaults & Behaviors
  showAdditionalFields: true,
  requireApprovalOptions: false,
  autofillEnabled: true,
  showTooltips: true,
  dynamicValidation: true,
  highlightMandatory: true,
  autoSaveDrafts: false,
  floatingLabels: false,
};

interface FormSettingsContextType {
  formSettings: typeof defaultSettings;
  getFormGridClass: () => string;
  getInputClass: () => string;
  getLabelClass: () => string;
  getFieldWrapperClass: () => string;
  deviceType: "desktop" | "tablet" | "mobile";
  layoutType: string;
}

const FormSettingsContext = createContext<FormSettingsContextType | undefined>(undefined);

export const FormSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formSettings, setFormSettings] = useState(defaultSettings);
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bharat_book_form_settings");
      if (saved) {
        setFormSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch(e) {}

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Add event listener for local storage changes
    const storageListener = (e: StorageEvent) => {
        if(e.key === 'bharat_book_form_settings' && e.newValue) {
            setFormSettings({ ...defaultSettings, ...JSON.parse(e.newValue) });
        }
    };
    
    // Custom event to force refresh settings from local component updates in same tab
    const forceRefresh = () => {
       try {
        const saved = localStorage.getItem("bharat_book_form_settings");
        if (saved) {
            setFormSettings({ ...defaultSettings, ...JSON.parse(saved) });
        }
       } catch(e) {}
    };

    window.addEventListener("storage", storageListener);
    window.addEventListener("bharat_book_form_settings_updated", forceRefresh);
    
    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("storage", storageListener);
        window.removeEventListener("bharat_book_form_settings_updated", forceRefresh);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(formSettings).forEach(([key, value]) => {
      root.setAttribute(`data-fs-${key.toLowerCase()}`, String(value));
    });
  }, [formSettings]);

  const getFormGridClass = () => {
    let classes = "p-6 grid gap-6 border-t border-gray-200 dark:border-gray-700 ";
    const typeKey = `${deviceType}LayoutType` as keyof typeof formSettings;
    const colsKey = `${deviceType}Columns` as keyof typeof formSettings;
    
    let cols = "grid-cols-1";
    if (formSettings[colsKey] === "2") cols = "grid-cols-2";
    if (formSettings[colsKey] === "3") cols = "grid-cols-3";
    if (formSettings[colsKey] === "4") cols = "grid-cols-4";
    if (formSettings[colsKey] === "6") cols = "grid-cols-6";

    // Allow override at different breakpoints via responsive classes or just apply current device columns directly
    classes += `${cols}`;
    
    return classes;
  };

  const getInputClass = () => {
    let classes = "w-full outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white ";
    const sizeKey = `${deviceType}InputSize` as keyof typeof formSettings;
    const bordersKey = `${deviceType}ShowBorders` as keyof typeof formSettings;
    
    classes += formSettings[sizeKey] === "large" ? "p-3 sm:p-2 text-base sm:text-sm " : formSettings[sizeKey] === "small" ? "p-1.5 text-xs " : "p-2 text-sm ";
    
    if (formSettings[bordersKey] !== false) {
      classes += "border border-gray-200 rounded-lg dark:border-gray-700 ";
    } else {
      classes += "border-b border-gray-200 dark:border-gray-700 pt-2 pb-1 px-1 rounded-none ";
    }
    return classes;
  };

  const getLabelClass = () => {
    const positionKey = `${deviceType}LabelPosition` as keyof typeof formSettings;
    if (formSettings[positionKey] === "floating" || formSettings.floatingLabels) {
      return "absolute -top-2 left-2 bg-white dark:bg-gray-800 px-1 text-[10px] font-bold text-blue-500 uppercase z-10 transition-all";
    }
    return "block text-xs font-bold text-gray-500 uppercase mb-1";
  };

  const getFieldWrapperClass = () => {
    const positionKey = `${deviceType}LabelPosition` as keyof typeof formSettings;
    if (formSettings[positionKey] === "floating" || formSettings.floatingLabels) {
      return "relative pt-2 w-full"; // ensure it takes full width
    }
    return "w-full";
  };

  const layoutType = String(formSettings[`${deviceType}LayoutType` as keyof typeof formSettings] || "standard");

  return (
    <FormSettingsContext.Provider value={{
        formSettings,
        getFormGridClass,
        getInputClass,
        getLabelClass,
        getFieldWrapperClass,
        deviceType,
        layoutType
    }}>
      {children}
    </FormSettingsContext.Provider>
  );
};

export const useFormSettings = () => {
  const context = useContext(FormSettingsContext);
  if (context === undefined) {
    throw new Error("useFormSettings must be used within a FormSettingsProvider");
  }
  return context;
};
