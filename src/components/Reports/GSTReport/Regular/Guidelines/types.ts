export type RegularOption = 'eligibility' | 'calendars' | 'invoicing' | 'itc' | 'rcm';

export interface RegularExpandedSections {
    // Option 1: Eligibility
    turnoverLimits: boolean;
    levyTaxRates: boolean;
    registrationMandatory: boolean;

    // Option 2: Filing Calendars
    gstr1Form: boolean;
    gstr2bForm: boolean;
    gstr3bForm: boolean;
    gstr9Form: boolean;

    // Option 3: Invoicing Rules
    regularInvoice: boolean;
    eInvoiceThreshold: boolean;
    hsnRequirements: boolean;

    // Option 4: ITC claims
    section16Rules: boolean;
    blockCredits17_5: boolean;
    itcReconciliation: boolean;

    // Option 5: RCM Liability
    rcmCategories: boolean;
    rcmNoItcRestrictions: boolean;
}

export interface RegularGuidelinesProps {
    useSampleData: boolean;
    onToggleSampleData?: (enabled: boolean) => void;
}
