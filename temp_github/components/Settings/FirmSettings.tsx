import React, { useState } from "react";
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

import { STATE_DATA } from "../../lib/states";
import { INDIAN_BANKS } from "../../lib/banks";
import { LedgerMaster } from "../../types";
import { SearchableDropdown } from "../ui/SearchableDropdown";
import {
  SettingsIcon,
  CheckCircleIcon,
  AdminIcon,
} from "../icons/IconComponents";
import { ChevronDown, ChevronUp } from "lucide-react";
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

export interface FirmSettingsProps {
  ledgerMasters?: LedgerMaster[];
}

export const FirmSettings: React.FC<FirmSettingsProps> = ({ ledgerMasters = [] }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "basic",
  );
  const [firmData, setFirmData] = useState(initialFirmData);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFirmData(prev => ({ ...prev, ...parsed }));
        alert("Backup restored successfully. Please click Save Changes to persist.");
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to run the factory reset tooling? This action cannot be undone.")) {
      setFirmData(initialFirmData);
      localStorage.removeItem("firmSettings_v1");
      alert("System Reset to factory defaults.");
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between p-6 sm:p-8 mb-2">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center">
          <AdminIcon className="mr-3 text-blue-600" /> Firm Details
        </h2>
        <button
          onClick={handleSave}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all flex items-center shadow-lg ${isSaved ? "bg-green-500 text-white shadow-green-200 dark:shadow-none" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none"} `}
        >
          {isSaved ? (
            <>
              <CheckCircleIcon className="mr-2" /> Saved!
            </>
          ) : (
            "Save Configuration"
          )}
        </button>
      </div>

      <div className="space-y-0 text-left">

                <BasicSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <ProfileSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <ContactsSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <AddressSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <TaxRegistrationSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <LicensesSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <HrPayrollSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <FinancialGeneralSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <FinancialTaxationSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <FinancialFormattingSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <FinancialAdvancedSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <BankDetailsSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <SocialWebSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <OperationalSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <BillingSalesSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <InventoryLogisticsSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <BrandingAssetsSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <LegalRemarksSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} />
        <SystemDataSection firmData={firmData} setFirmData={setFirmData} activeAccordion={activeAccordion} toggleAccordion={toggleAccordion} bankOptions={bankOptions} ledgerMasters={ledgerMasters} handleExportBackup={handleExportBackup} handleRestoreBackup={handleRestoreBackup} handleFactoryReset={handleFactoryReset} fileInputRef={fileInputRef} />

      </div>
    </div>
  );
};
