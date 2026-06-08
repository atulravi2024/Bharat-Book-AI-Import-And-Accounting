import { initialFirmData as contextInitialFirmData } from "../../../../context/FirmSettingsContext";

export const initialFirmData = contextInitialFirmData;

export interface SearchField {
    id: string;
    label: string;
}

export const ALL_SEARCH_FIELDS: SearchField[] = [
    { id: 'basicCompany', label: 'Basic Company Details' },
    { id: 'businessProfile', label: 'Business Profile Information' },
    { id: 'branding', label: 'Branding & Visual Identity' },
    { id: 'social', label: 'Social Media & Web Links' },
    { id: 'addressDetails', label: 'Primary Location Address' },
    { id: 'primaryContacts', label: 'Primary Point of Contacts' },
    { id: 'alertDestinations', label: 'System Alert Destinations' },
    { id: 'financial_general', label: 'General Accounting System' },
    { id: 'financial_tax', label: 'Financial Taxation Schemes' },
    { id: 'financial_formatting', label: 'Currency Decimal Separator' },
    { id: 'financial_advanced', label: 'Advanced Threshold Controls' },
    { id: 'bank', label: 'Corporate Bank Accounts' },
    { id: 'statutoryTax', label: 'Statutory Registrations (CIN/GSTIN)' },
    { id: 'businessLicenses', label: 'Business Licenses & Permits (FSSAI)' },
    { id: 'legal Remarks', label: 'Default Terms Conditions' },
    { id: 'operational', label: 'Operations & Calendar' },
    { id: 'billing', label: 'Billing Invoicing Terms' },
    { id: 'inventoryLogistics', label: 'Inventory Dispatch Systems' },
    { id: 'hrPayroll', label: 'HR Attendance Policies' },
    { id: 'systemCompliance', label: 'Sandbox Audit & Data Protocols' }
];
