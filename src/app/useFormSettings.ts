import { useState, useEffect } from 'react';

export const defaultSettings = {
    // Form Layout - Desktop
    desktopLayoutType: "standard",
    desktopColumns: "3",
    desktopLabelPosition: "top",
    desktopInputSize: "medium",
    desktopShowBorders: true,
    desktopStickyHeader: true,
    desktopModalMode: "popup",
    
    // Form Layout - Tablet
    tabletLayoutType: "standard",
    tabletColumns: "2",
    tabletLabelPosition: "top",
    tabletInputSize: "medium",
    tabletShowBorders: true,
    tabletStickyHeader: false,
    tabletModalMode: "popup",
    
    // Form Layout - Mobile
    mobileLayoutType: "stacked",
    mobileColumns: "1",
    mobileLabelPosition: "top",
    mobileInputSize: "large",
    mobileShowBorders: false,
    mobileStickyHeader: true,
    mobileModalMode: "fullscreen",
    
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

export const useFormSettings = () => {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem("bharat_book_form_settings");
            if (saved) {
                return { ...defaultSettings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        }
        return defaultSettings;
    });

    useEffect(() => {
        const handleUpdate = () => {
            try {
                const saved = localStorage.getItem("bharat_book_form_settings");
                if (saved) {
                    setSettings({ ...defaultSettings, ...JSON.parse(saved) });
                } else {
                    setSettings(defaultSettings);
                }
            } catch(e) {
                // ignore
            }
        };

        window.addEventListener("bharat_book_form_settings_updated", handleUpdate);
        return () => {
            window.removeEventListener("bharat_book_form_settings_updated", handleUpdate);
        };
    }, []);

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkBreakpoints = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        checkBreakpoints();
        window.addEventListener('resize', checkBreakpoints);
        return () => window.removeEventListener('resize', checkBreakpoints);
    }, []);

    const getModalMode = () => {
        if (isMobile) return settings.mobileModalMode;
        if (isTablet) return settings.tabletModalMode;
        return settings.desktopModalMode;
    };

    const getLayoutType = () => {
        if (isMobile) return settings.mobileLayoutType;
        if (isTablet) return settings.tabletLayoutType;
        return settings.desktopLayoutType;
    };

    return { ...settings, currentModalMode: getModalMode(), layoutType: getLayoutType() };
};
