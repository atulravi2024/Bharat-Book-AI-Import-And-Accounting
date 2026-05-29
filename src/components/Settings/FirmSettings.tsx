import React, { useState } from "react";
import { useLanguage } from '../../context/LanguageContext';
import { BasicSection } from './FirmSettingsTabs/BasicSection';
import { ProfileSection } from './FirmSettingsTabs/ProfileSection';
import { ContactsSection } from './FirmSettingsTabs/ContactsSection';
import { AddressSection } from './FirmSettingsTabs/AddressSection';
import { TaxRegistrationSection } from './FirmSettingsTabs/TaxRegistrationSection';
import { LicensesSection } from './FirmSettingsTabs/LicensesSection';
import { HrPayrollSection } from './FirmSettingsTabs/HrPayrollSection';
import { FinancialGeneralSection } from './FirmSettingsTabs/FinancialGeneralSection';
import { FinancialTaxationSection } from './FirmSettingsTabs/FinancialTaxationSection';
import { FinancialFormattingSection } from './FirmSettingsTabs/FinancialFormattingSection';
import { FinancialAdvancedSection } from './FirmSettingsTabs/FinancialAdvancedSection';
import { BankDetailsSection } from './FirmSettingsTabs/BankDetailsSection';
import { SocialWebSection } from './FirmSettingsTabs/SocialWebSection';
import { OperationalSection } from './FirmSettingsTabs/OperationalSection';
import { BillingSalesSection } from './FirmSettingsTabs/BillingSalesSection';
import { InventoryLogisticsSection } from './FirmSettingsTabs/InventoryLogisticsSection';
import { BrandingAssetsSection } from './FirmSettingsTabs/BrandingAssetsSection';
import { LegalRemarksSection } from './FirmSettingsTabs/LegalRemarksSection';
import { SystemDataSection } from './FirmSettingsTabs/SystemDataSection';
import { AlertChannels } from './FirmSettingsTabs/AlertChannels';

import { STATE_DATA } from "../../lib/states";
import { INDIAN_BANKS } from "../../lib/banks";
import { LedgerMaster } from "../../app/types";
import { SearchableDropdown } from "../ui/SearchableDropdown";
import {
  SettingsIcon,
  CheckCircleIcon,
  AdminIcon,
} from "../icons/IconComponents";
import { ChevronDown, ChevronUp, Search, Download, RotateCcw, Save, FormInput, Trash2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BUSINESS_SUBDOMAINS: Record<string, { label: string; value: string }[]> =
  {
    grocery: [
      { label: "All Grocery & Supermarket", value: "all" },
      { label: "Grocery Mart", value: "grocery_mart" },
      { label: "Supermarket", value: "supermarket" },
      { label: "Kirana Store", value: "kirana" },
      { label: "General Store", value: "general_store" },
      { label: "Organic Food Store", value: "organic_food" },
      { label: "Dairy & Milk Products", value: "dairy" },
      { label: "Dry Fruits & Spices", value: "dry_fruits" },
    ],
    clothes: [
      { label: "All Apparel & Clothing", value: "all" },
      { label: "Men's Apparel", value: "mens_apparel" },
      { label: "Women's Boutique", value: "womens_boutique" },
      { label: "Kids Wear", value: "kids_wear" },
      { label: "Footwear / Shoes", value: "footwear" },
      { label: "Sportswear & Activewear", value: "sportswear" },
      { label: "Accessories & Bags", value: "accessories" },
      { label: "Uniforms & Workwear", value: "uniforms" },
      { label: "Hosiery & Innerwear", value: "hosiery" },
    ],
    medical: [
      { label: "All Medical & Pharmacy", value: "all" },
      { label: "General Pharmacy", value: "pharmacy" },
      { label: "Ayurvedic / Herbal", value: "ayurvedic" },
      { label: "Surgical Instruments", value: "surgical" },
      { label: "Veterinary Medicine", value: "veterinary" },
      { label: "Homeopathy & Alternative", value: "homeopathy" },
      { label: "Medical Equipment", value: "medical_equipment" },
    ],
    electronics: [
      { label: "All Electronics & Gadgets", value: "all" },
      { label: "Mobile / Smartphones", value: "mobile" },
      { label: "Computers & Laptops", value: "computers" },
      { label: "Consumer Appliances", value: "appliances" },
      { label: "Audio & Video Equipment", value: "audio_video" },
      { label: "Smart Home & IoT", value: "smart_home" },
      { label: "Cameras & Photography", value: "cameras" },
      { label: "Electronic Components", value: "components" },
    ],
    hardware: [
      { label: "All Hardware & Building", value: "all" },
      { label: "Cement & Building Materials", value: "building_materials" },
      { label: "Paints & Chemicals", value: "paints" },
      { label: "Sanitary & Plumbing", value: "sanitary" },
      { label: "Electricals & Lighting", value: "electricals" },
      { label: "Tools & Machinery", value: "tools" },
      { label: "Timber, Plywood & Glass", value: "timber" },
      { label: "Tiles & Flooring", value: "tiles" },
    ],
    fmcg: [
      { label: "All FMCG Goods", value: "all" },
      { label: "Food & Beverages", value: "food_beverages" },
      { label: "Personal Care", value: "personal_care" },
      { label: "Home Care & Cleaning", value: "home_care" },
      { label: "Packaged Snacks & Confectionery", value: "snacks" },
    ],
    kitchen: [
      { label: "All Kitchen Utensils", value: "all" },
      { label: "Pots & Pans", value: "pots_pans" },
      { label: "Cutlery & Tableware", value: "cutlery" },
      { label: "Kitchen Appliances", value: "kitchen_appliances" },
      { label: "Glassware & Crockery", value: "glassware" },
      { label: "Plasticware & Storage", value: "plasticware" },
    ],
    food: [
      { label: "All Food Services", value: "all" },
      { label: "Restaurant", value: "restaurant" },
      { label: "Cafe", value: "cafe" },
      { label: "Fast Food", value: "fast_food" },
      { label: "Cloud Kitchen / Delivery Only", value: "cloud_kitchen" },
      { label: "Catering Services", value: "catering" },
      { label: "Sweet Shop / Confectionery", value: "sweet_shop" },
    ],
    furniture: [
      { label: "All Furniture", value: "all" },
      { label: "Home Furniture", value: "home_furniture" },
      { label: "Office Furniture", value: "office_furniture" },
      { label: "Outdoor & Garden Furniture", value: "outdoor_furniture" },
      { label: "Mattresses & Bedding", value: "mattresses" },
      { label: "Furnishings & Curtains", value: "furnishings" },
    ],
    automotive: [
      { label: "All Automotive", value: "all" },
      { label: "Auto Parts", value: "auto_parts" },
      { label: "Car Wash", value: "car_wash" },
      { label: "Repair Shop", value: "repair_shop" },
      { label: "Tyres & Batteries", value: "tyres" },
      { label: "Accessories & Decor", value: "auto_accessories" },
      { label: "Vehicle Dealership", value: "dealership" },
    ],
    beauty: [
      { label: "All Beauty & Wellness", value: "all" },
      { label: "Salon", value: "salon" },
      { label: "Spa", value: "spa" },
      { label: "Cosmetics Shop", value: "cosmetics" },
      { label: "Tattoo & Piercing Parlor", value: "tattoo" },
      { label: "Fitness Center / Gym", value: "fitness" },
    ],
    it: [
      { label: "All IT & Tech Services", value: "all" },
      { label: "Software Development", value: "software" },
      { label: "IT Consulting", value: "it_consulting" },
      { label: "Computer Repair", value: "repair" },
      { label: "Web & Digital Marketing", value: "digital_marketing" },
      { label: "Networking & Security", value: "networking" },
    ],
    agriculture: [
      { label: "All Agriculture & Farming", value: "all" },
      { label: "Farming Equipment", value: "farming_equipment" },
      { label: "Fertilizers & Pesticides", value: "fertilizers" },
      { label: "Seeds & Plants", value: "seeds" },
      { label: "Poultry & Livestock", value: "poultry" },
      { label: "Produce Trading / Mandi", value: "produce_trading" },
    ],
    professional: [
      { label: "All Professional Services", value: "all" },
      { label: "Architecture & Interior Design", value: "architecture" },
      { label: "Marketing / Advertising", value: "marketing" },
      { label: "Business Consulting", value: "business_consulting" },
    ],
    finance: [
      { label: "All Financial & Legal", value: "all" },
      { label: "Chartered Accountant (CA)", value: "ca" },
      { label: "Accountant / Bookkeeper", value: "accountant" },
      { label: "Lawyer / Advocate", value: "lawyer" },
      { label: "Tax Consultant", value: "tax_consultant" },
      { label: "Insurance Agent", value: "insurance_agent" },
    ],
    education: [
      { label: "All Education & Training", value: "all" },
      { label: "School / College", value: "school" },
      { label: "Coaching / Tuition Center", value: "coaching" },
      { label: "Online Tutor / Courses", value: "tutor" },
      { label: "Music & Dance Classes", value: "music_dance" },
      { label: "Vocational Training", value: "vocational" },
    ],
    healthcare: [
      { label: "All Healthcare Professionals", value: "all" },
      { label: "Doctor / Clinic", value: "doctor" },
      { label: "Hospital / Nursing Home", value: "hospital" },
      { label: "Dentist", value: "dentist" },
      { label: "Pathology Lab / Diagnostics", value: "pathology" },
      { label: "Physiotherapy", value: "physiotherapy" },
    ],
    trades: [
      { label: "All Trades & Home Services", value: "all" },
      { label: "Carpenter / Woodwork", value: "carpenter" },
      { label: "Plumber / Sanitary Service", value: "plumber" },
      { label: "Electrician / Electrical Service", value: "electrician" },
      { label: "AC Repair & Maintenance", value: "ac_repair" },
      { label: "Pest Control", value: "pest_control" },
      { label: "Cleaning Services", value: "cleaning" },
      { label: "Civil Contractor / Mason", value: "mason" },
    ],
    travel: [
      { label: "All Travel & Hospitality", value: "all" },
      { label: "Hotel / Lodge", value: "hotel" },
      { label: "Travel Agency / Booking", value: "travel_agency" },
      { label: "Tour Operator", value: "tour_operator" },
      { label: "Cab / Taxi Service", value: "taxi" },
    ],
    logistics: [
      { label: "All Logistics & Transport", value: "all" },
      { label: "Courier & Parcel Service", value: "courier" },
      { label: "Packers & Movers", value: "packers_movers" },
      { label: "Transport & Cargo", value: "transport" },
      { label: "Warehousing / Storage", value: "warehousing" },
    ],
    events: [
      { label: "All Entertainment & Events", value: "all" },
      { label: "Event Planner / Decorator", value: "event_planner" },
      { label: "Photography & Videography", value: "photography" },
      { label: "DJ & Sound Services", value: "dj_sound" },
      { label: "Marriage Hall / Banquet", value: "banquet" },
      { label: "Tent House / Catering", value: "tent_house" },
    ],
    real_estate: [
      { label: "All Real Estate", value: "all" },
      { label: "Real Estate Brokerage / Agent", value: "brokerage" },
      { label: "Builder / Developer", value: "builder" },
      { label: "Property Management", value: "property_management" },
    ],
    manufacturing: [
      { label: "All Manufacturing", value: "all" },
      { label: "Textile Manufacturing", value: "textile" },
      { label: "Metal Fabrication", value: "metal" },
      { label: "Plastic Products", value: "plastic" },
      { label: "Food Processing & Packaging", value: "food_processing" },
      { label: "Chemical & Pharmaceutical", value: "chemical" },
      { label: "Paper & Printing", value: "printing" },
      { label: "Wood & Timber Processing", value: "wood_processing" },
    ],
    other: [
      { label: "All Other Business Types", value: "all" },
      { label: "Other Business Type", value: "other_business" },
    ],
  };

const DOMAIN_CATEGORIES: Record<string, { label: string; value: string }[]> = {
  product: [
    { value: "grocery", label: "Grocery Mart / Supermarket / Kirana" },
    { value: "clothes", label: "Apparel / Clothes / Boutique" },
    { value: "medical", label: "Medical Store / Pharmacy" },
    { value: "electronics", label: "Electronics & Gadgets" },
    { value: "hardware", label: "Hardware / Paint / Construction Supplies" },
    { value: "fmcg", label: "FMCG (Consumer Goods)" },
    { value: "kitchen", label: "Kitchen Utensils & Appliances" },
    { value: "furniture", label: "Furniture & Home Decor" },
    { value: "automotive", label: "Automotive / Auto Parts" },
    { value: "agriculture", label: "Agriculture & Farming" },
    { value: "manufacturing", label: "Heavy Duty & Manufacturing" },
    { value: "other", label: "Other Products" },
  ],
  service: [
    { value: "food", label: "Restaurant / Cafe / Food" },
    { value: "beauty", label: "Beauty / Salon / Personal Care" },
    { value: "it", label: "IT & Software / Electronics Repair" },
    {
      value: "trades",
      label: "Trades & Home Services (Carpenter, Plumber, Pest Control)",
    },
    { value: "travel", label: "Travel, Tourism & Hospitality" },
    { value: "logistics", label: "Logistics, Transport & Movers" },
    { value: "events", label: "Entertainment, Events & Photography" },
    { value: "real_estate", label: "Real Estate & Construction Builder" },
    { value: "other", label: "Other Services" },
  ],
  professional: [
    { value: "professional", label: "Professional & Consulting Services" },
    { value: "finance", label: "Finance, Legal & Accounting (CA, Lawyer)" },
    { value: "education", label: "Education, Tutor, Coaching" },
    { value: "healthcare", label: "Doctors, Clinics, Hospitals & Healthcare" },
    { value: "other", label: "Other Professional Services" },
  ],
};

const BUSINESS_ROLES: Record<string, { label: string; value: string }[]> = {
  product: [
    { value: "retailer", label: "Retailer (B2C)" },
    { value: "wholesaler", label: "Wholesaler (B2B)" },
    { value: "distributor", label: "Distributor / Stockist" },
    { value: "manufacturer", label: "Manufacturer / Producer" },
    { value: "dealer", label: "Dealer / Franchisee" },
    { value: "importer_exporter", label: "Importer / Exporter" },
    { value: "dropshipper", label: "Dropshipper" },
    { value: "ecommerce_seller", label: "E-Commerce Seller" },
    { value: "other", label: "Other (Product Based)" },
  ],
  service: [
    { value: "service_provider", label: "General Service Provider" },
    { value: "contractor", label: "Contractor / Builder" },
    { value: "repair_maintenance", label: "Repair & Maintenance" },
    { value: "logistics", label: "Logistics / Transporter" },
    { value: "hospitality", label: "Hospitality & Events" },
    { value: "it_software", label: "IT & Software Services" },
    { value: "agency", label: "Agency (Marketing/Ad/Design)" },
    { value: "bpo_kpo", label: "BPO / KPO" },
    { value: "other", label: "Other (Service Based)" },
  ],
  professional: [
    { value: "freelancer", label: "Independent Freelancer" },
    { value: "consultant", label: "Consultant / Advisor" },
    { value: "legal", label: "Legal Practitioner" },
    { value: "financial", label: "Financial Professional (CA/CPA)" },
    { value: "healthcare", label: "Medical Professional / Clinic" },
    { value: "architect", label: "Architect / Interior Designer" },
    { value: "educator", label: "Educator / Coaching" },
    { value: "other", label: "Other (Professional)" },
  ],
};

const initialFirmData = {
  companyName: "",
  alertEmail: "",
  alertSms: "",
  alertWhatsapp: "",
  alertTelegram: "",
  alertEmailEnabled: false,
  alertSmsEnabled: false,
  alertWhatsappEnabled: false,
  alertTelegramEnabled: false,
  tradeName: "",
  businessSlogan: "",
  businessType: "llc",
  businessRole: "retailer",
  businessNature: "product",
  businessDomain: "grocery",
  businessSubDomain: "all",
  isEcommerceInfo: "offline",
  taxId: "",
  address: "",
  state: "",
  country: "India",
  email: "",
  phone: "",
  website: "",
  logoUrl: "",
  financialYear: "apr-mar",
  baseCurrency: "INR",
  dateFormat: "DD/MM/YYYY",
  gstin: "",
  gstinDate: "",
  pan: "",
  panDate: "",
  cin: "",
  cinDate: "",
  msmeNo: "",
  msmeDate: "",
  iecCode: "",
  iecDate: "",
  tradeLicense: "",
  tradeLicenseDate: "",
  fssaiNumber: "",
  fssaiDate: "",
  tanNumber: "",
  tanDate: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
  micrCode: "",
  accountType: "Savings",
  branchName: "",
  upiId: "",
  linkedIn: "",
  twitter: "",
  facebook: "",
  instagram: "",
  youtube: "",
  whatsapp: "",
  notes: "",
  dateOfIncorporation: "",
  city: "",
  district: "",
  pincode: "",
  primaryContactName: "",
  primaryContactDesignation: "",
  annualTurnover: "",
  employeeCount: "",
  supportEmail: "",
  supportPhone: "",
  timezone: "Asia/Kolkata",
  workingDays: "Monday-Saturday",
  customWorkingDays: "",
  workingHours: "09:00 AM - 06:00 PM",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  holidays: "Holi, Diwali, Independence Day, Republic Day",
  invoicePrefix: "INV-",
  quotationPrefix: "QTN-",
  defaultTerms: "",
  themeColor: "#3b82f6",
  signatureUrl: "",
  stampUrl: "",
  pfNumber: "",
  pfDate: "",
  esicNumber: "",
  esicDate: "",
  ptNumber: "",
  ptDate: "",
  lutNumber: "",
  lutDate: "",
  drugLicense: "",
  drugLicenseDate: "",
  stateCode: "",
  inventoryValuation: "FIFO",
  enableNegativeStock: false,
  taxInclusivePricing: false,
  paymentTerms: "Due on Receipt",
  latePaymentPenalty: "",
  jurisdictionCity: "",
  shippingPartner: "",
  deliveryTime: "",
  enableAuditLog: false,
  enforceFormatValidation: true,
  dataRetentionPeriod: "3_years",
  autoBackup: false,
  backupFrequency: "weekly",
  accountingMethod: "accrual",
  taxFilingFrequency: "monthly",
  currencySymbolPosition: "prefix",
  decimalPlaces: "2",
  roundingMethod: "nearest",
  defaultTaxCategory: "GST",
  numberGroupingStyle: "indian",
  thousandSeparator: ",",
  decimalSeparator: ".",
  showCurrencySymbol: true,
  enableDiscount: true,
  enableTax: true,
  autoRoundOff: true,
  allowBackdatedEntries: true,
  freezeDate: "",
  enableBackdatedGracePeriod: false,
  backdatedGraceDays: "7",
  enableMultiCurrency: false,
  exchangeRateUpdateMode: "manual",
  defaultTdsRate: "",
  tdsThresholdLimit: "",
  enableAutoTds: false,
  requireVoucherApproval: false,
  approvalThresholdAmount: "",
  latePaymentInterestRate: "",
  interestCalculationMethod: "simple",
  softCloseDate: "",
};

const ALL_SEARCH_FIELDS = [
  // Basic Details
  { label: "Company Name", id: "basicCompany" },
  { label: "Trade Name", id: "basicCompany" },
  { label: "Business Slogan", id: "basicCompany" },
  { label: "Date of Incorporation", id: "basicCompany" },
  { label: "Employee Count", id: "basicCompany" },
  { label: "Annual Turnover", id: "basicCompany" },

  // Profile Details
  { label: "Business Structure", id: "businessProfile" },
  { label: "Primary Business Role", id: "businessProfile" },
  { label: "Business Nature", id: "businessProfile" },
  { label: "Industry Domain", id: "businessProfile" },
  { label: "E-Commerce Operation", id: "businessProfile" },

  // Contacts
  { label: "Primary Contact Name", id: "primaryContacts" },
  { label: "Contact Designation", id: "primaryContacts" },
  { label: "Email Address", id: "primaryContacts" },
  { label: "Phone Number", id: "primaryContacts" },
  { label: "Support Email", id: "primaryContacts" },
  { label: "Support Phone", id: "primaryContacts" },
  { label: "WhatsApp", id: "primaryContacts" },

  // Address
  { label: "Complete Address", id: "addressDetails" },
  { label: "State", id: "addressDetails" },
  { label: "Country", id: "addressDetails" },
  { label: "City", id: "addressDetails" },
  { label: "District", id: "addressDetails" },
  { label: "Pincode", id: "addressDetails" },
  { label: "Jurisdiction City", id: "addressDetails" },

  // Tax Registration
  { label: "GSTIN", id: "statutoryTax" },
  { label: "PAN", id: "statutoryTax" },
  { label: "TAN", id: "statutoryTax" },

  // Licenses
  { label: "CIN", id: "businessLicenses" },
  { label: "MSME Number", id: "businessLicenses" },
  { label: "IEC Code", id: "businessLicenses" },
  { label: "Trade License", id: "businessLicenses" },
  { label: "FSSAI", id: "businessLicenses" },
  { label: "Drug License", id: "businessLicenses" },

  // HR Process
  { label: "PF Registration Amount", id: "hrPayroll" },
  { label: "ESIC", id: "hrPayroll" },
  { label: "PT Number", id: "hrPayroll" },
  { label: "LUT", id: "hrPayroll" },

  // Financial General
  { label: "Financial Year", id: "financial_general" },
  { label: "Base Currency", id: "financial_general" },
  { label: "Books Freezing Date", id: "financial_general" },
  { label: "Accounting Method", id: "financial_general" },

  // Financial Taxation
  { label: "Default Tax Category", id: "financial_tax" },
  { label: "Tax Filing", id: "financial_tax" },
  { label: "TDS", id: "financial_tax" },

  // Financial Formatting
  { label: "Date Format", id: "financial_formatting" },
  { label: "Currency Symbol", id: "financial_formatting" },
  { label: "Decimal", id: "financial_formatting" },
  { label: "Rounding", id: "financial_formatting" },

  // Financial Advanced
  { label: "Backdated", id: "financial_advanced" },
  { label: "Soft Close Date", id: "financial_advanced" },

  // Bank
  { label: "Bank Name", id: "bank" },
  { label: "Account Number", id: "bank" },
  { label: "IFSC", id: "bank" },
  { label: "SWIFT", id: "bank" },
  { label: "MICR", id: "bank" },
  { label: "Branch", id: "bank" },
  { label: "UPI", id: "bank" },

  // Social
  { label: "Company Website", id: "social" },
  { label: "LinkedIn", id: "social" },
  { label: "Twitter", id: "social" },
  { label: "Facebook", id: "social" },
  { label: "Instagram", id: "social" },
  { label: "YouTube", id: "social" },

  // Operational
  { label: "Timezone", id: "operational" },
  { label: "Working Days", id: "operational" },
  { label: "Working Hours", id: "operational" },
  { label: "Holidays", id: "operational" },

  // Billing
  { label: "Invoice Prefix", id: "billing" },
  { label: "Quotation Prefix", id: "billing" },
  { label: "Payment Terms", id: "billing" },

  // Inventory
  { label: "Inventory Valuation Method", id: "inventoryLogistics" },
  { label: "Enable Negative Stock", id: "inventoryLogistics" },
  { label: "Shipping Partner", id: "inventoryLogistics" },
  { label: "Delivery Time", id: "inventoryLogistics" },

  // Branding
  { label: "Logo", id: "branding" },
  { label: "Theme Color", id: "branding" },
  { label: "Signature", id: "branding" },
  { label: "Stamp", id: "branding" },

  // Legal
  { label: "Notes", id: "legal Remarks" },

  // System
  { label: "Audit Log", id: "systemCompliance" },
  { label: "Format Validation", id: "systemCompliance" },
  { label: "Retention Period", id: "systemCompliance" },
  { label: "Backup", id: "systemCompliance" },

  // Alert Destinations
  { label: "Alert Email", id: "alertDestinations" },
  { label: "Alert SMS", id: "alertDestinations" },
  { label: "Alert WhatsApp", id: "alertDestinations" },
  { label: "Alert Telegram", id: "alertDestinations" },
];

export interface FirmSettingsProps {
  ledgerMasters?: LedgerMaster[];
}

export const FirmSettings: React.FC<FirmSettingsProps> = ({ ledgerMasters = [] }) => {
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    null,
  );
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
    const saved = localStorage.getItem("firmSettings_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved firm settings:", e);
      }
    }
    return initialFirmData;
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const searchDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (item: typeof ALL_SEARCH_FIELDS[0]) => {
    // If it's already open, we don't need to wait for animation as much
    const isAlreadyOpen = activeAccordion === item.id;
    setActiveAccordion(item.id);
    setSearchTerm("");
    setShowDropdown(false);
    
    // Wait for the accordion to expand and content to render
    const delay = isAlreadyOpen ? 100 : 500;
    setTimeout(() => {
        // Find all labels and look for the one that best matches the search label
        const labels = Array.from(document.querySelectorAll('label'));
        const targetLabel = labels.find(l => {
            const text = l.textContent?.toLowerCase().trim() || "";
            const searchLabel = item.label.toLowerCase().trim();
            return text === searchLabel || text.includes(searchLabel) || searchLabel.includes(text);
        });
        
        if (targetLabel) {
            targetLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Look for the interactive element within the same container or nearby
            const container = targetLabel.closest('.space-y-2') || targetLabel.parentElement;
            const interactive = container?.querySelector('input, select, textarea, [role="combobox"], button:not([title])') as HTMLElement;
            
            if (interactive) {
               // Special handling for SearchableDropdown or similar custom components
               const focusTarget = interactive.getAttribute('role') === 'combobox' 
                  ? interactive 
                  : (interactive.tagName === 'INPUT' || interactive.tagName === 'SELECT' || interactive.tagName === 'TEXTAREA' ? interactive : null);

               if (focusTarget) {
                 focusTarget.focus();
               }

               // Highlight the entire container for better visibility
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
        console.log("Action: User confirmed Clear All Fields");
        
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
        console.log("Action: User confirmed Reset to Saved");
        
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

  const bankOptions = React.useMemo(() => {
    const masterBanks = ledgerMasters
      .filter((m) => m.group?.toLowerCase().includes("bank"))
      .map((m) => ({ id: m.name, name: m.name }));
    const defaultBanks = INDIAN_BANKS.map((b) => ({ id: b, name: b }));
    const combined = [...masterBanks, ...defaultBanks];
    const uniqueNames = Array.from(new Set(combined.map((b) => b.name)));
    return uniqueNames.map((name) => ({ id: name, name }));
  }, [ledgerMasters]);

  React.useEffect(() => {
    const savedData = localStorage.getItem("firmSettings_v1");
    if (savedData) {
      try {
        setFirmData(prev => ({ ...prev, ...JSON.parse(savedData) }));
      } catch (err) {
        console.error("Failed to parse firm settings", err);
      }
    }
  }, []);

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

  const handleCombinedImport = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            
            // Simple CSV parser for 2 columns: Key, Value
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
      const value = firmData[key];
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
        // Expand first section for visual confirmation
        setActiveAccordion("basicCompany");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const SECTIONS = [
    { id: "basicCompany", label: t("Basic Details"), component: BasicSection },
    { id: "businessProfile", label: t("Profile Details"), component: ProfileSection },
    { id: "primaryContacts", label: t("Primary Contacts"), component: ContactsSection },
    { id: "alertDestinations", label: t("Alert Channels"), component: AlertChannels },
    { id: "addressDetails", label: t("Registered Address"), component: AddressSection },
    { id: "statutoryTax", label: t("Tax Registrations"), component: TaxRegistrationSection },
    { id: "businessLicenses", label: t("Business Licenses"), component: LicensesSection },
    { id: "hrPayroll", label: t("Payroll Setup"), component: HrPayrollSection },
    { id: "financial_general", label: t("Financial General"), component: FinancialGeneralSection },
    { id: "financial_tax", label: t("Financial Taxation"), component: FinancialTaxationSection },
    { id: "financial_formatting", label: t("Financial Formatting"), component: FinancialFormattingSection },
    { id: "financial_advanced", label: t("Financial Advanced"), component: FinancialAdvancedSection },
    { id: "bank", label: t("Bank Details"), component: BankDetailsSection },
    { id: "social", label: t("Social Presence"), component: SocialWebSection },
    { id: "operational", label: t("Operational Preferences"), component: OperationalSection },
    { id: "billing", label: t("Billing Sales"), component: BillingSalesSection },
    { id: "inventoryLogistics", label: t("Inventory Logistics"), component: InventoryLogisticsSection },
    { id: "branding", label: t("Branding Assets"), component: BrandingAssetsSection },
    { id: "legal Remarks", label: t("Legal Remarks"), component: LegalRemarksSection },
    { id: "systemCompliance", label: t("System Backup"), component: SystemDataSection },
  ];

  const filteredSections = SECTIONS;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <input
        type="file"
        accept=".json,.csv"
        ref={fileInputRef}
        onChange={handleCombinedImport}
        className="hidden"
        id="globalHiddenFileInput"
      />
      {/* Header Row - Refactored for responsiveness and new controls */}
      <div className="flex flex-col xl:flex-row items-center justify-between p-4 xl:p-6 gap-4 border-b border-gray-50 dark:border-gray-700/50">
        <div className="flex items-center w-full xl:w-auto shrink-0 justify-between md:justify-start gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center whitespace-nowrap">
            <AdminIcon className="mr-3 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" /> 
            {t("Firm Details")}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center w-full gap-4">
            {/* Search Bar - Flex-1 on md+ to take available space */}
            <div className="relative w-full md:flex-1" ref={searchDropdownRef}>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t("Search settings...")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (searchTerm.trim() !== '') setShowDropdown(true);
                }}
                className="form-input pl-10 pr-4 focus:border-transparent text-sm font-medium"
              />
              {showDropdown && searchTerm.trim() !== '' && (
                <div className="absolute top-14 left-0 right-0 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50">
                  {ALL_SEARCH_FIELDS.filter(field => 
                     field.label.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((field, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSelect(field)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    >
                      <span className="font-bold">{field.label}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 block">in {SECTIONS.find(s => s.id === field.id)?.label || t('Settings')}</span>
                    </button>
                  ))}
                  {ALL_SEARCH_FIELDS.filter(field => field.label.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
                      {t("No settings found matching")} "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons - Unified Styling & Responsive Labels */}
            <div className="flex flex-nowrap items-center gap-2 w-full md:w-auto shrink-0 justify-center">
              
              <div className="flex shrink-0 items-center bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    title={t("Import (JSON/CSV)")}
                    className="px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" /> <span className="hidden xl:inline">{t("Import")}</span>
                 </button>
                 <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                 <button
                    onClick={handleExportBackup}
                    title={t("Export JSON")}
                    className="px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" /> <span className="hidden xl:inline">{t("JSON")}</span>
                 </button>
                 <button
                    onClick={handleExportCSV}
                    title={t("Export CSV")}
                    className="px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" /> <span className="hidden xl:inline">{t("CSV")}</span>
                 </button>
              </div>

              <button
                onClick={handleClear}
                title={t("Clear All Fields")}
                className="shrink-0 p-2 xl:px-4 xl:py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-orange-500 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-sm active:scale-95 group"
              >
                <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors xl:mr-2" />
                <span className="hidden xl:inline">{t("Clear")}</span>
              </button>

              <button
                onClick={handleResetToDefault}
                title={t("Reset to Defaults")}
                className="shrink-0 p-2 xl:px-4 xl:py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-red-500 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-sm active:scale-95 group"
              >
                <RotateCcw className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors xl:mr-2" />
                <span className="hidden xl:inline">{t("Reset")}</span>
              </button>

              <button
                onClick={handleSave}
                title={t("Save Configuration")}
                className={`shrink-0 p-2.5 xl:px-6 xl:py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-md active:scale-95 ${
                  isSaved 
                    ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none"
                } `}
              >
                {isSaved ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 xl:mr-2" />
                    <span className="hidden xl:inline">{t("Saved!")}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 xl:mr-2" />
                    <span className="hidden xl:inline">{t("Save")}</span>
                  </>
                )}
              </button>
            </div>
        </div>
      </div>

      <div className="space-y-0 text-left">
        {filteredSections.map(({ id, component: Component }) => (
          <Component 
            key={id}
            firmData={firmData} 
            setFirmData={setFirmData} 
            activeAccordion={activeAccordion} 
            toggleAccordion={toggleAccordion} 
            bankOptions={bankOptions} 
            ledgerMasters={ledgerMasters}
            {...(id === 'systemCompliance' ? {
              handleExportBackup,
              handleRestoreBackup: handleCombinedImport,
              handleFactoryReset,
              fileInputRef
            } : {})}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmConfig?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setConfirmConfig(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {confirmConfig.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 whitespace-pre-wrap">
                {confirmConfig.message}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmConfig(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold text-sm transition-colors"
                >
                  {confirmConfig.cancelText}
                </button>
                <button
                  onClick={() => {
                    confirmConfig.onConfirm();
                    setConfirmConfig(null);
                  }}
                  className={`px-4 py-2 text-white rounded-xl font-semibold text-sm transition-colors ${
                    confirmConfig.isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {confirmConfig.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {alertConfig?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setAlertConfig(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-6 text-center"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {alertConfig.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {alertConfig.message}
              </p>
              <button
                onClick={() => setAlertConfig(null)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {t("OK")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
