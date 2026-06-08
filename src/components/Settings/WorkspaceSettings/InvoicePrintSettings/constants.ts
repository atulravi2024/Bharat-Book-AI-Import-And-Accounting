export interface InvoiceFont {
    id: string;
    label: string;
    category: 'Sans' | 'Serif' | 'Mono' | 'Display';
}

export const INVOICE_FONTS: InvoiceFont[] = [
    { id: 'Default', label: 'Default System Sans', category: 'Sans' },
    { id: 'Inter', label: 'Inter Swiss-Clean', category: 'Sans' },
    { id: 'Roboto', label: 'Roboto Standard', category: 'Sans' },
    { id: 'Space Grotesk', label: 'Space Grotesk Tech', category: 'Display' },
    { id: 'Outfit', label: 'Outfit Minimalist', category: 'Display' },
    { id: 'Playfair Display', label: 'Playfair Display Elegant', category: 'Serif' },
    { id: 'Merriweather', label: 'Merriweather Editorial', category: 'Serif' },
    { id: 'JetBrains Mono', label: 'JetBrains Code', category: 'Mono' },
    { id: 'Fira Code', label: 'Fira Mono Accent', category: 'Mono' },
    { id: 'Courier New', label: 'Courier Retro Typist', category: 'Mono' }
];

export interface SectionStyle {
    color: string;
    weight: string;
    transform: string;
    family: string;
    size: string;
    marginTop?: string;
    marginBottom?: string;
    verticalShift?: number;
    height?: number;
}

export interface InvoiceSettings {
    pageSize: 'A4' | 'A5' | 'Letter' | 'Legal' | 'Thermal';
    pageOrientation: 'Portrait' | 'Landscape';
    pageMargin: 'Zero' | 'Minimal' | 'Narrow' | 'Normal' | 'Wide' | 'Custom';
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    compactMode: boolean;
    ultraCompactMode: boolean;
    ultraCleanMode: boolean;
    useGrayScale: boolean;
    colorPalette: string;
    showLogo: boolean;
    showHeader: boolean;
    showBilling: boolean;
    showSignature: boolean;
    showCustomerSign: boolean;
    showFooterNotes: boolean;
    showHSN: boolean;
    showQty: boolean;
    showRate: boolean;
    showMrp: boolean;
    showDiscountPercentage: boolean;
    showDiscountAmount: boolean;
    showTaxDetails: boolean;
    showAmountInWords: boolean;
    showNarration: boolean;
    fontFamily: string;
    baseFontSize: number;
    headingScale: number;
    fontWeight: string;
    textTransform: string;
    lineHeight: number;
    wordSpacing: number;
    letterSpacing: number;
    paragraphSpacing: number;
    headerSpacing: number;
    plainSpacing: number;
    showPageNumber: boolean;
    pageNumberLocation: 'Header' | 'Footer';
    pageNumberAlignment: 'Left' | 'Center' | 'Right';
    pageNumberFormat: 'Standard' | 'Compact' | 'Custom';
    designLayout: string;
    headerDisplay: string;
    pageSubtotalDisplay: string;
    selectedUser: string;
    itemsPerFirstPage: number;
    itemsPerSecondPage: number;
    itemsPerLastPage: number;
    showHsnSummary: boolean;
    sectionStyles: Record<string, SectionStyle>;
}

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
    pageSize: 'A4',
    pageOrientation: 'Portrait',
    pageMargin: 'Normal',
    marginTop: 1.0,
    marginBottom: 1.0,
    marginLeft: 1.0,
    marginRight: 1.0,
    compactMode: false,
    ultraCompactMode: false,
    ultraCleanMode: false,
    useGrayScale: false,
    colorPalette: 'Slate/Default',
    showLogo: true,
    showHeader: true,
    showBilling: true,
    showSignature: true,
    showCustomerSign: true,
    showFooterNotes: true,
    showHSN: true,
    showQty: true,
    showRate: true,
    showMrp: false,
    showDiscountPercentage: false,
    showDiscountAmount: false,
    showTaxDetails: true,
    showAmountInWords: true,
    showNarration: true,
    fontFamily: 'Default',
    baseFontSize: 12,
    headingScale: 1.25,
    fontWeight: 'normal',
    textTransform: 'none',
    lineHeight: 1.5,
    wordSpacing: 1.0,
    letterSpacing: 0,
    paragraphSpacing: 1.0,
    headerSpacing: 1.0,
    plainSpacing: 1.0,
    showPageNumber: true,
    pageNumberLocation: 'Footer',
    pageNumberAlignment: 'Right',
    pageNumberFormat: 'Standard',
    designLayout: 'Modern',
    headerDisplay: 'Always',
    pageSubtotalDisplay: 'Always',
    selectedUser: 'All',
    itemsPerFirstPage: 10,
    itemsPerSecondPage: 15,
    itemsPerLastPage: 8,
    showHsnSummary: true,
    sectionStyles: {
        companyName: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        companyAddress: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        header: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        subheader: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        partyName: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        partyAddress: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        tableHeader: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        lineItem: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        amountInWords: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        taxDetails: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        narration: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        signatures: { color: '', weight: '', transform: 'default', family: 'Default', size: '' },
        grandTotal: { color: '', weight: '', transform: 'default', family: 'Default', size: '' }
    }
};
