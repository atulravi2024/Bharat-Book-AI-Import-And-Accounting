import { useState } from 'react';
import { RegularOption, RegularExpandedSections } from '../types';

export const useRegularGuidelines = () => {
    const [activeOption, setActiveOption] = useState<RegularOption>('eligibility');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [isTopBannerCollapsed, setIsTopBannerCollapsed] = useState<boolean>(false);

    const [expandedSections, setExpandedSections] = useState<RegularExpandedSections>({
        // Eligibility
        turnoverLimits: true,
        levyTaxRates: true,
        registrationMandatory: false,

        // Calendars
        gstr1Form: true,
        gstr2bForm: true,
        gstr3bForm: true,
        gstr9Form: false,

        // Invoicing
        regularInvoice: true,
        eInvoiceThreshold: true,
        hsnRequirements: false,

        // ITC
        section16Rules: true,
        blockCredits17_5: true,
        itcReconciliation: false,

        // RCM
        rcmCategories: true,
        rcmNoItcRestrictions: true
    });

    const toggleSection = (sectionName: keyof RegularExpandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const getOptionKeys = (option: RegularOption): (keyof RegularExpandedSections)[] => {
        switch (option) {
            case 'eligibility':
                return ['turnoverLimits', 'levyTaxRates', 'registrationMandatory'];
            case 'calendars':
                return ['gstr1Form', 'gstr2bForm', 'gstr3bForm', 'gstr9Form'];
            case 'invoicing':
                return ['regularInvoice', 'eInvoiceThreshold', 'hsnRequirements'];
            case 'itc':
                return ['section16Rules', 'blockCredits17_5', 'itcReconciliation'];
            case 'rcm':
                return ['rcmCategories', 'rcmNoItcRestrictions'];
        }
    };

    const expandAllCurrentOptionSections = () => {
        const keys = getOptionKeys(activeOption);
        setExpandedSections(prev => {
            const next = { ...prev };
            keys.forEach(k => { next[k] = true; });
            return next;
        });
    };

    const collapseAllCurrentOptionSections = () => {
        const keys = getOptionKeys(activeOption);
        setExpandedSections(prev => {
            const next = { ...prev };
            keys.forEach(k => { next[k] = false; });
            return next;
        });
    };

    return {
        activeOption,
        setActiveOption,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isTopBannerCollapsed,
        setIsTopBannerCollapsed,
        expandedSections,
        toggleSection,
        expandAllCurrentOptionSections,
        collapseAllCurrentOptionSections
    };
};
