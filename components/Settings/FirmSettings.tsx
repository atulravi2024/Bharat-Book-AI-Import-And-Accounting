import React, { useState } from "react";
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

        {/* Accordion 1: Basic Company Details */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("basicCompany")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Basic Details
            </h3>
            {activeAccordion === "basicCompany" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "basicCompany" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Company Name"
                      value={firmData.companyName}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Trade Name / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Trade Name"
                      value={firmData.tradeName}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          tradeName: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Business Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Business Slogan"
                      value={firmData.businessSlogan}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          businessSlogan: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Date of Incorporation
                    </label>
                    <input
                      type="date"
                      value={firmData.dateOfIncorporation}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          dateOfIncorporation: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Employee Count
                    </label>
                    <select
                      value={firmData.employeeCount}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          employeeCount: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 (Micro)</option>
                      <option value="11-50">11-50 (Small)</option>
                      <option value="51-200">51-200 (Medium)</option>
                      <option value="201-500">201-500 (Large)</option>
                      <option value="500+">500+ (Enterprise)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Annual Turnover
                    </label>
                    <select
                      value={firmData.annualTurnover}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          annualTurnover: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="">Select Turnover Range</option>
                      <option value="<10L">Up to ₹10 Lakhs</option>
                      <option value="10L-50L">₹10 Lakhs - ₹50 Lakhs</option>
                      <option value="50L-5Cr">₹50 Lakhs - ₹5 Crores</option>
                      <option value="5Cr-50Cr">₹5 Crores - ₹50 Crores</option>
                      <option value=">50Cr">Above ₹50 Crores</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 2: Business Profile */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("businessProfile")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Business Profile
            </h3>
            {activeAccordion === "businessProfile" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "businessProfile" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Business Constitution
                    </label>
                    <select
                      value={firmData.businessType}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          businessType: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="llc">LLP / LLC</option>
                      <option value="pvt_ltd">Private Limited</option>
                      <option value="public_ltd">Public Limited</option>
                      <option value="trust">Trust / NGO</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Nature of Business
                    </label>
                    <select
                      value={firmData.businessNature}
                      onChange={(e) => {
                        const newNature = e.target.value;
                        const defaultDomain = DOMAIN_CATEGORIES[newNature]?.[0]?.value || "";
                        const defaultSubDomain = BUSINESS_SUBDOMAINS[defaultDomain]?.[0]?.value || "";
                        const defaultRole = BUSINESS_ROLES[newNature]?.[0]?.value || "";

                        setFirmData({
                          ...firmData,
                          businessNature: newNature,
                          businessDomain: defaultDomain,
                          businessSubDomain: defaultSubDomain,
                          businessRole: defaultRole,
                        });
                      }}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="product">Inventory / Product Based</option>
                      <option value="service">Service Provider</option>
                      <option value="professional">Professional / Consultation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Sales Channel / E-Commerce
                    </label>
                    <select
                      value={firmData.isEcommerceInfo}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          isEcommerceInfo: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="offline">Offline / Physical Store Only</option>
                      <option value="online">Online / E-Commerce Only</option>
                      <option value="omnichannel">Both Online and Offline (Omnichannel)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Select the Business Type
                    </label>
                    <select
                      value={firmData.businessRole}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          businessRole: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      {BUSINESS_ROLES[firmData.businessNature]?.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      What business is involved?
                    </label>
                    <select
                      value={firmData.businessDomain}
                      onChange={(e) => {
                        const newDomain = e.target.value;
                        const defaultSubDomain = BUSINESS_SUBDOMAINS[newDomain]?.[0]?.value || "";
                        setFirmData({
                          ...firmData,
                          businessDomain: newDomain,
                          businessSubDomain: defaultSubDomain,
                        });
                      }}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      {DOMAIN_CATEGORIES[firmData.businessNature]?.map((domain) => (
                        <option key={domain.value} value={domain.value}>
                          {domain.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {BUSINESS_SUBDOMAINS[firmData.businessDomain] && (
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                        Specific Business Type
                      </label>
                      <select
                        value={firmData.businessSubDomain}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            businessSubDomain: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                      >
                        {BUSINESS_SUBDOMAINS[firmData.businessDomain].map((subOption) => (
                          <option key={subOption.value} value={subOption.value}>
                            {subOption.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 3: Primary Contacts */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("primaryContacts")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Primary Contacts
            </h3>
            {activeAccordion === "primaryContacts" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "primaryContacts" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Primary Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={firmData.primaryContactName}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          primaryContactName: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Contact Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Director, Manager"
                      value={firmData.primaryContactDesignation}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          primaryContactDesignation: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Primary Email
                    </label>
                    <input
                      type="email"
                      placeholder="company@example.com"
                      value={firmData.email}
                      onChange={(e) =>
                        setFirmData({ ...firmData, email: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (234) 567-8901"
                      value={firmData.phone}
                      onChange={(e) =>
                        setFirmData({ ...firmData, phone: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      WhatsApp Business Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter WhatsApp Number"
                      value={firmData.whatsapp}
                      onChange={(e) =>
                        setFirmData({ ...firmData, whatsapp: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Support Email
                    </label>
                    <input
                      type="email"
                      placeholder="support@example.com"
                      value={firmData.supportEmail}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          supportEmail: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Support Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Support contact"
                      value={firmData.supportPhone}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          supportPhone: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.example.com"
                      value={firmData.website}
                      onChange={(e) =>
                        setFirmData({ ...firmData, website: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 4: Address Details */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("addressDetails")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Address Details
            </h3>
            {activeAccordion === "addressDetails" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "addressDetails" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Registered Address
                    </label>
                    <textarea
                      placeholder="Enter full registered address"
                      value={firmData.address}
                      onChange={(e) =>
                        setFirmData({ ...firmData, address: e.target.value })
                      }
                      rows={3}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      State / Province
                    </label>
                    <select
                      value={firmData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const data = STATE_DATA[newState];
                        setFirmData({ 
                          ...firmData, 
                          state: newState,
                          stateCode: data ? data.code : firmData.stateCode,
                          district: data && data.districts.length > 0 ? data.districts[0] : "",
                        });
                      }}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="">Select State</option>
                      {Object.keys(STATE_DATA).map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      District
                    </label>
                    {STATE_DATA[firmData.state]?.districts.length > 0 ? (
                      <select
                        value={firmData.district}
                        onChange={(e) => setFirmData({ ...firmData, district: e.target.value })}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                      >
                        {STATE_DATA[firmData.state].districts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter District"
                        value={firmData.district}
                        onChange={(e) =>
                          setFirmData({ ...firmData, district: e.target.value })
                        }
                        className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter City"
                      value={firmData.city}
                      onChange={(e) =>
                        setFirmData({ ...firmData, city: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      State / UT Code (e.g., 27 for MH)
                    </label>
                    <input
                      type="text"
                      placeholder="27"
                      value={firmData.stateCode}
                      onChange={(e) =>
                        setFirmData({ ...firmData, stateCode: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Pincode / ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Pincode"
                      value={firmData.pincode}
                      onChange={(e) =>
                        setFirmData({ ...firmData, pincode: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Country"
                      value={firmData.country}
                      onChange={(e) =>
                        setFirmData({ ...firmData, country: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 5: Statutory & Tax Registrations */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("statutoryTax")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Tax Registration
            </h3>
            {activeAccordion === "statutoryTax" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "statutoryTax" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      GSTIN / Tax ID
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter GSTIN"
                        value={firmData.gstin}
                        onChange={(e) =>
                          setFirmData({ ...firmData, gstin: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.gstinDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, gstinDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      PAN Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter PAN"
                        value={firmData.pan}
                        onChange={(e) =>
                          setFirmData({ ...firmData, pan: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.panDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, panDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      TAN Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter TAN"
                        value={firmData.tanNumber}
                        onChange={(e) =>
                          setFirmData({ ...firmData, tanNumber: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.tanDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, tanDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      LUT Number (For Exports)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="e.g. AD270321000123"
                        value={firmData.lutNumber}
                        onChange={(e) =>
                          setFirmData({ ...firmData, lutNumber: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.lutDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, lutDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Professional Tax (PT) Reg No.
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={firmData.ptNumber}
                        onChange={(e) =>
                          setFirmData({ ...firmData, ptNumber: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.ptDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, ptDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 5B: Business & Operational Licenses */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("businessLicenses")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Operational Licenses
            </h3>
            {activeAccordion === "businessLicenses" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "businessLicenses" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      CIN (Corporate Identity Number)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter CIN"
                        value={firmData.cin}
                        onChange={(e) =>
                          setFirmData({ ...firmData, cin: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.cinDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, cinDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      MSME / Udyam Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter MSME/Udyam"
                        value={firmData.msmeNo}
                        onChange={(e) =>
                          setFirmData({ ...firmData, msmeNo: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.msmeDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, msmeDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      IEC (Import Export Code)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter IEC Code"
                        value={firmData.iecCode}
                        onChange={(e) =>
                          setFirmData({ ...firmData, iecCode: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.iecDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, iecDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Trade License Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter Trade License"
                        value={firmData.tradeLicense}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            tradeLicense: e.target.value,
                          })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.tradeLicenseDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, tradeLicenseDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      FSSAI License Number (If Applicable)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="Enter FSSAI"
                        value={firmData.fssaiNumber}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            fssaiNumber: e.target.value,
                          })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.fssaiDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, fssaiDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Drug License No. (If applicable)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={firmData.drugLicense}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            drugLicense: e.target.value,
                          })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.drugLicenseDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, drugLicenseDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 6: HR & Payroll Compliance */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("hrPayroll")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              HR Compliance
            </h3>
            {activeAccordion === "hrPayroll" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "hrPayroll" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      EPF Number (Provident Fund)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="e.g. MH/BAN/12345/000"
                        value={firmData.pfNumber}
                        onChange={(e) =>
                          setFirmData({ ...firmData, pfNumber: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.pfDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, pfDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      ESIC Number
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        placeholder="e.g. 31000123450001234"
                        value={firmData.esicNumber}
                        onChange={(e) =>
                          setFirmData({ ...firmData, esicNumber: e.target.value })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                      <input
                        type="date"
                        title="Registration Date"
                        value={firmData.esicDate}
                        onChange={(e) =>
                          setFirmData({ ...firmData, esicDate: e.target.value })
                        }
                        className="w-full sm:w-40 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 7: Financial Settings */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("financial")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Financial Settings
            </h3>
            {activeAccordion === "financial" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "financial" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Financial Year
                    </label>
                    <select
                      value={firmData.financialYear}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          financialYear: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="apr-mar">April - March</option>
                      <option value="jan-dec">January - December</option>
                      <option value="jul-jun">July - June</option>
                      <option value="oct-sep">October - September</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Base Currency
                    </label>
                    <select
                      value={firmData.baseCurrency}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          baseCurrency: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="INR">INR - Indian Rupee (₹)</option>
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Date Format
                    </label>
                    <select
                      value={firmData.dateFormat}
                      onChange={(e) =>
                        setFirmData({ ...firmData, dateFormat: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Accounting Method
                    </label>
                    <select
                      value={firmData.accountingMethod}
                      onChange={(e) =>
                        setFirmData({ ...firmData, accountingMethod: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="cash">Cash Accounting</option>
                      <option value="accrual">Accrual Accounting</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Tax Filing Frequency
                    </label>
                    <select
                      value={firmData.taxFilingFrequency}
                      onChange={(e) =>
                        setFirmData({ ...firmData, taxFilingFrequency: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Default Tax System
                    </label>
                    <select
                      value={firmData.defaultTaxCategory}
                      onChange={(e) =>
                        setFirmData({ ...firmData, defaultTaxCategory: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="GST">GST (India)</option>
                      <option value="VAT">VAT</option>
                      <option value="SalesTax">Sales Tax</option>
                      <option value="Exempt">Tax Exempt</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Currency Symbol Position
                    </label>
                    <select
                      value={firmData.currencySymbolPosition}
                      onChange={(e) =>
                        setFirmData({ ...firmData, currencySymbolPosition: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="prefix">Prefix (e.g. ₹100)</option>
                      <option value="suffix">Suffix (e.g. 100 ₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Decimal Precision
                    </label>
                    <select
                      value={firmData.decimalPlaces}
                      onChange={(e) =>
                        setFirmData({ ...firmData, decimalPlaces: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="0">0 (e.g. 100)</option>
                      <option value="1">1 (e.g. 100.0)</option>
                      <option value="2">2 (e.g. 100.00)</option>
                      <option value="3">3 (e.g. 100.000)</option>
                      <option value="4">4 (e.g. 100.0000)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Rounding Method
                    </label>
                    <select
                      value={firmData.roundingMethod}
                      onChange={(e) =>
                        setFirmData({ ...firmData, roundingMethod: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="nearest">Round to Nearest</option>
                      <option value="up">Round Up</option>
                      <option value="down">Round Down</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Number System
                    </label>
                    <select
                      value={firmData.numberGroupingStyle}
                      onChange={(e) =>
                        setFirmData({ ...firmData, numberGroupingStyle: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="indian">Indian (1,23,456.00)</option>
                      <option value="international">International (123,456.00)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Thousand Separator
                    </label>
                    <select
                      value={firmData.thousandSeparator}
                      onChange={(e) =>
                        setFirmData({ ...firmData, thousandSeparator: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=".">Dot (.)</option>
                      <option value=" ">Space ( )</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Decimal Separator
                    </label>
                    <select
                      value={firmData.decimalSeparator}
                      onChange={(e) =>
                        setFirmData({ ...firmData, decimalSeparator: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value=".">Dot (.)</option>
                      <option value=",">Comma (,)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.showCurrencySymbol}
                          onChange={(e) => setFirmData({...firmData, showCurrencySymbol: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.showCurrencySymbol ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.showCurrencySymbol ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Show Currency Symbol</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.enableDiscount}
                          onChange={(e) => setFirmData({...firmData, enableDiscount: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableDiscount ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableDiscount ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable Discounts</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.enableTax}
                          onChange={(e) => setFirmData({...firmData, enableTax: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableTax ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableTax ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable Tax Columns</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.autoRoundOff}
                          onChange={(e) => setFirmData({...firmData, autoRoundOff: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.autoRoundOff ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.autoRoundOff ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Auto Round Off</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.allowBackdatedEntries}
                          onChange={(e) => setFirmData({...firmData, allowBackdatedEntries: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.allowBackdatedEntries ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.allowBackdatedEntries ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Allow Backdated Entries</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.enableBackdatedGracePeriod}
                          onChange={(e) => setFirmData({...firmData, enableBackdatedGracePeriod: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableBackdatedGracePeriod ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableBackdatedGracePeriod ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Backdated Grace Period</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.enableMultiCurrency}
                          onChange={(e) => setFirmData({...firmData, enableMultiCurrency: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableMultiCurrency ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableMultiCurrency ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable Multi-Currency</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.enableAutoTds}
                          onChange={(e) => setFirmData({...firmData, enableAutoTds: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.enableAutoTds ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.enableAutoTds ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Auto TDS Calculation</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={firmData.requireVoucherApproval}
                          onChange={(e) => setFirmData({...firmData, requireVoucherApproval: e.target.checked})}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${firmData.requireVoucherApproval ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${firmData.requireVoucherApproval ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Voucher Approval Worklow</span>
                    </label>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Currency & Exchange</h4>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          Exchange Rate Update
                        </label>
                        <select
                          disabled={!firmData.enableMultiCurrency}
                          value={firmData.exchangeRateUpdateMode}
                          onChange={(e) => setFirmData({ ...firmData, exchangeRateUpdateMode: e.target.value })}
                          className={`w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 ${!firmData.enableMultiCurrency ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="manual">Manual Entry</option>
                          <option value="api">Auto via API (Real-time)</option>
                          <option value="daily">Auto via API (Daily Avg)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">TDS / TCS Compliance</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Default TDS Rate (%)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 10"
                            value={firmData.defaultTdsRate}
                            onChange={(e) => setFirmData({ ...firmData, defaultTdsRate: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Threshold Limit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 30000"
                            value={firmData.tdsThresholdLimit}
                            onChange={(e) => setFirmData({ ...firmData, tdsThresholdLimit: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Approval Control</h4>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          Approval Threshold (₹)
                        </label>
                        <input
                          type="text"
                          disabled={!firmData.requireVoucherApproval}
                          placeholder="e.g. 50000"
                          value={firmData.approvalThresholdAmount}
                          onChange={(e) => setFirmData({ ...firmData, approvalThresholdAmount: e.target.value })}
                          className={`w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 ${!firmData.requireVoucherApproval ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Interest Calculation</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Late Interest (%)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 18"
                            value={firmData.latePaymentInterestRate}
                            onChange={(e) => setFirmData({ ...firmData, latePaymentInterestRate: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Method
                          </label>
                          <select
                            value={firmData.interestCalculationMethod}
                            onChange={(e) => setFirmData({ ...firmData, interestCalculationMethod: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          >
                            <option value="simple">Simple</option>
                            <option value="compound_monthly">Compound (Mo)</option>
                            <option value="compound_yearly">Compound (Yr)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Compliance & Closing</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Soft Close Date
                          </label>
                          <input
                            type="date"
                            value={firmData.softCloseDate}
                            onChange={(e) => setFirmData({ ...firmData, softCloseDate: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Hard Freeze Date
                          </label>
                          <input
                            type="date"
                            value={firmData.freezeDate}
                            onChange={(e) => setFirmData({ ...firmData, freezeDate: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    {firmData.enableBackdatedGracePeriod && (
                      <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                          Grace Period (Days)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={firmData.backdatedGraceDays}
                          onChange={(e) =>
                            setFirmData({ ...firmData, backdatedGraceDays: e.target.value })
                          }
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
                          placeholder="Example: 7 days"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 8: Bank Details */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("bank")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Bank Details
            </h3>
            {activeAccordion === "bank" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "bank" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2 relative">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Bank Name
                    </label>
                    <SearchableDropdown
                      options={bankOptions}
                      value={firmData.bankName}
                      onChange={(value) => {
                        const selectedBankMaster = ledgerMasters.find(m => m.name === value);
                        if (selectedBankMaster && selectedBankMaster.bankDetails) {
                            setFirmData({ 
                              ...firmData, 
                              bankName: value,
                              accountNumber: selectedBankMaster.bankDetails.accountNo || firmData.accountNumber,
                              ifscCode: selectedBankMaster.bankDetails.ifsc || firmData.ifscCode,
                              swiftCode: selectedBankMaster.bankDetails.swiftCode || firmData.swiftCode,
                              micrCode: selectedBankMaster.bankDetails.micrCode || firmData.micrCode,
                              accountType: selectedBankMaster.bankDetails.accountType || firmData.accountType,
                              branchName: selectedBankMaster.bankDetails.branchName || firmData.branchName,
                              upiId: selectedBankMaster.bankDetails.upiId || firmData.upiId
                            });
                        } else {
                            setFirmData({ ...firmData, bankName: value });
                        }
                      }}
                      placeholder="Enter Bank Name or Select"
                      buttonClassName="w-full text-left p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Account Number"
                      value={firmData.accountNumber}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter IFSC Code"
                      value={firmData.ifscCode}
                      onChange={(e) =>
                        setFirmData({ ...firmData, ifscCode: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter SWIFT Code"
                      value={firmData.swiftCode}
                      onChange={(e) =>
                        setFirmData({ ...firmData, swiftCode: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      MICR Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter MICR Code"
                      value={firmData.micrCode}
                      onChange={(e) =>
                        setFirmData({ ...firmData, micrCode: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Account Type
                    </label>
                    <select
                      value={firmData.accountType}
                      onChange={(e) =>
                        setFirmData({ ...firmData, accountType: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="Overdraft">Overdraft</option>
                      <option value="Cash Credit">Cash Credit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Branch Name"
                      value={firmData.branchName}
                      onChange={(e) =>
                        setFirmData({ ...firmData, branchName: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      UPI / VPA ID
                    </label>
                    <input
                      type="text"
                      placeholder="company@bank"
                      value={firmData.upiId}
                      onChange={(e) =>
                        setFirmData({ ...firmData, upiId: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 9: Social & Web Presence */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("social")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Social Presence
            </h3>
            {activeAccordion === "social" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "social" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      LinkedIn Page
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/your-company"
                      value={firmData.linkedIn}
                      onChange={(e) =>
                        setFirmData({ ...firmData, linkedIn: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      placeholder="@company_handle"
                      value={firmData.twitter}
                      onChange={(e) =>
                        setFirmData({ ...firmData, twitter: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Facebook Page
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/your-company"
                      value={firmData.facebook}
                      onChange={(e) =>
                        setFirmData({ ...firmData, facebook: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      placeholder="@your_company"
                      value={firmData.instagram}
                      onChange={(e) =>
                        setFirmData({ ...firmData, instagram: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      YouTube Channel
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@your-company"
                      value={firmData.youtube}
                      onChange={(e) =>
                        setFirmData({ ...firmData, youtube: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={firmData.whatsapp}
                      onChange={(e) =>
                        setFirmData({ ...firmData, whatsapp: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 10: Operational Settings */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("operational")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Operational Settings
            </h3>
            {activeAccordion === "operational" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "operational" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Timezone
                    </label>
                    <select
                      value={firmData.timezone}
                      onChange={(e) =>
                        setFirmData({ ...firmData, timezone: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">EST (America/New_York)</option>
                      <option value="Europe/London">GMT (Europe/London)</option>
                      <option value="Australia/Sydney">AEST (Australia/Sydney)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Working Days
                    </label>
                    <select
                      value={firmData.workingDays}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          workingDays: e.target.value,
                          ...(e.target.value !== "Custom" ? { customWorkingDays: "" } : {})
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="Monday-Friday">Monday - Friday</option>
                      <option value="Monday-Saturday">Monday - Saturday</option>
                      <option value="Monday-Sunday">Monday - Sunday (All Days)</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {firmData.workingDays === "Custom" && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                        Custom Working Days
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mon, Wed, Fri"
                        value={firmData.customWorkingDays || ""}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            customWorkingDays: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Working Hours
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">From</span>
                        <input
                          type="time"
                          value={firmData.workingHoursStart || "09:00"}
                          onChange={(e) => {
                            const start = e.target.value;
                            setFirmData({
                              ...firmData,
                              workingHoursStart: start,
                              workingHours: `${start} to ${firmData.workingHoursEnd || '18:00'}`
                            });
                          }}
                          className="w-full p-4 pl-14 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">To</span>
                        <input
                          type="time"
                          value={firmData.workingHoursEnd || "18:00"}
                          onChange={(e) => {
                            const end = e.target.value;
                            setFirmData({
                              ...firmData,
                              workingHoursEnd: end,
                              workingHours: `${firmData.workingHoursStart || '09:00'} to ${end}`
                            });
                          }}
                          className="w-full p-4 pl-10 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Holidays
                    </label>
                    <textarea
                      placeholder="e.g. Holi, Diwali, Christmas..."
                      value={firmData.holidays}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          holidays: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200 resize-y min-h-[60px]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 11: Billing & Sales Preferences */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("billing")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Billing Sales
            </h3>
            {activeAccordion === "billing" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "billing" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INV-"
                      value={firmData.invoicePrefix}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          invoicePrefix: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Quotation Prefix
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. QTN-"
                      value={firmData.quotationPrefix}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          quotationPrefix: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Default Payment Terms
                    </label>
                    <select
                      value={firmData.paymentTerms}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          paymentTerms: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Net 90">Net 90</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Late Payment Penalty Rate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1.5% per month"
                      value={firmData.latePaymentPenalty}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          latePaymentPenalty: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id="taxInclusivePricing"
                      checked={firmData.taxInclusivePricing}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          taxInclusivePricing: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="taxInclusivePricing"
                      className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Prices are Tax Inclusive by default
                    </label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Default Terms and Conditions
                    </label>
                    <textarea
                      placeholder="1. Goods once sold will not be taken back."
                      value={firmData.defaultTerms}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          defaultTerms: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 12: Inventory & Logistics */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("inventoryLogistics")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Inventory Logistics
            </h3>
            {activeAccordion === "inventoryLogistics" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "inventoryLogistics" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Inventory Valuation Method
                    </label>
                    <select
                      value={firmData.inventoryValuation}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          inventoryValuation: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="FIFO">First In, First Out (FIFO)</option>
                      <option value="LIFO">Last In, First Out (LIFO)</option>
                      <option value="AVERAGE">Weighted Average Cost</option>
                    </select>
                  </div>
                  <div className="space-y-2 flex items-center pt-8">
                    <input
                      type="checkbox"
                      id="enableNegativeStock"
                      checked={firmData.enableNegativeStock}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          enableNegativeStock: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="enableNegativeStock"
                      className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Enable Negative Stock Billing
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Preferred Shipping Partner
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FedEx, BlueDart, DTDC"
                      value={firmData.shippingPartner}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          shippingPartner: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Standard Delivery Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2-3 Business Days"
                      value={firmData.deliveryTime}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          deliveryTime: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 13: Branding & Assets */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("branding")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Branding Assets
            </h3>
            {activeAccordion === "branding" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "branding" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={firmData.logoUrl}
                      onChange={(e) =>
                        setFirmData({ ...firmData, logoUrl: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Theme Color
                    </label>
                    <div className="flex space-x-4 items-center">
                      <input
                        type="color"
                        value={firmData.themeColor}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            themeColor: e.target.value,
                          })
                        }
                        className="w-12 h-12 p-1 bg-gray-50 border-none rounded-2xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={firmData.themeColor}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            themeColor: e.target.value,
                          })
                        }
                        className="flex-1 p-3 text-sm bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Authorized Signature URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/signature.png"
                      value={firmData.signatureUrl}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          signatureUrl: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Company Stamp URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/stamp.png"
                      value={firmData.stampUrl}
                      onChange={(e) =>
                        setFirmData({ ...firmData, stampUrl: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 14: Legal & Remarks */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("legal Remarks")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              Legal Remarks
            </h3>
            {activeAccordion === "legal Remarks" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "legal Remarks" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Jurisdiction City (Legal)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, New Delhi"
                      value={firmData.jurisdictionCity}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          jurisdictionCity: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Notes / Description
                    </label>
                    <textarea
                      placeholder="Additional company notes or description"
                      value={firmData.notes}
                      onChange={(e) =>
                        setFirmData({ ...firmData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 15: System Data & Compliance */}
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => toggleAccordion("systemCompliance")}
            className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              System Compliance
            </h3>
            {activeAccordion === "systemCompliance" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {activeAccordion === "systemCompliance" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800">
                  
                  {/* Action Logic Audit */}
                  <div className="space-y-2 flex items-center pt-8">
                    <input
                      type="checkbox"
                      id="enableAuditLog"
                      checked={firmData.enableAuditLog}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          enableAuditLog: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="enableAuditLog"
                      className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Enable Action Logic Audit
                    </label>
                  </div>

                  {/* Format Validation */}
                  <div className="space-y-2 flex items-center pt-8">
                    <input
                      type="checkbox"
                      id="enforceFormatValidation"
                      checked={firmData.enforceFormatValidation}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          enforceFormatValidation: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="enforceFormatValidation"
                      className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Enforce Strict Format Validation
                    </label>
                  </div>

                  {/* 3D Backup Reset Tooling */}
                  <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-700 border-dashed">
                     <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                       3D Backup / Reset Tooling
                     </h4>
                     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                       <button
                         onClick={handleExportBackup}
                         className="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                       >
                         Export 3D Backup
                       </button>
                       <input
                         type="file"
                         accept=".json"
                         ref={fileInputRef}
                         onChange={handleRestoreBackup}
                         className="hidden"
                       />
                       <button
                         onClick={() => fileInputRef.current?.click()}
                         className="px-6 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                       >
                         Restore Backup
                       </button>
                       <button
                         onClick={handleFactoryReset}
                         className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                       >
                         Factory Reset Tooling
                       </button>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                      Data Retention Period
                    </label>
                    <select
                      value={firmData.dataRetentionPeriod}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          dataRetentionPeriod: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                    >
                      <option value="1_year">1 Year</option>
                      <option value="3_years">3 Years</option>
                      <option value="7_years">7 Years</option>
                      <option value="indefinite">Indefinite (Keep forever)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 flex items-center pt-8">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      checked={firmData.autoBackup}
                      onChange={(e) =>
                        setFirmData({
                          ...firmData,
                          autoBackup: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="autoBackup"
                      className="ml-3 block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Enable Auto Scheduled Backup
                    </label>
                  </div>

                  {firmData.autoBackup && (
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                        Auto Backup Frequency
                      </label>
                      <select
                        value={firmData.backupFrequency}
                        onChange={(e) =>
                          setFirmData({
                            ...firmData,
                            backupFrequency: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none dark:bg-gray-900 dark:text-gray-200"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
