import React, { createContext, useContext, useState, useEffect } from "react";

export const initialFirmData = {
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
  timezone: "Asia/Kolkata",
  workingDays: "Mon-Fri",
  customWorkingDays: "",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  workingHours: "09:00 to 18:00",
  holidays: "Standard",
  invoicePrefix: "INV-",
  quotationPrefix: "QT-",
  paymentTerms: "Net 30",
  latePaymentPenalty: "0",
  taxInclusivePricing: false,
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
  enableBackdatedGracePeriod: false,
  backdatedGraceDays: 0,
  enableMultiCurrency: false,
  exchangeRateUpdateMode: "manual",
  enableAutoTds: false,
  defaultTdsRate: 0,
  tdsThresholdLimit: 0,
  requireVoucherApproval: false,
  approvalThresholdAmount: 0,
  latePaymentInterestRate: 0,
  interestCalculationMethod: "simple",
  softCloseDate: "",
  freezeDate: "",
  defaultTerms: "",
  inventoryValuation: "FIFO",
  enableNegativeStock: false,
  shippingPartner: "",
  deliveryTime: "",
  enableAuditLog: false,
  enforceFormatValidation: true,
  dataRetentionPeriod: "3_years",
  autoBackup: false,
  backupFrequency: "weekly",
  accountingMethod: "accrual",
  taxFilingFrequency: "monthly",
};

export type FirmData = typeof initialFirmData;

interface FirmSettingsContextType {
  firmData: FirmData;
  setFirmData: (data: FirmData) => void;
  formatCurrency: (amount: number) => string;
  formatNumber: (amount: number) => string;
}

const FirmSettingsContext = createContext<FirmSettingsContextType | undefined>(undefined);

export const FirmSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firmData, setFirmDataState] = useState<FirmData>(() => {
    const saved = localStorage.getItem("firmSettings_v1");
    if (saved) {
      try {
        return { ...initialFirmData, ...JSON.parse(saved) };
      } catch (e) {
        return initialFirmData;
      }
    }
    return initialFirmData;
  });

  const setFirmData = (data: FirmData) => {
    setFirmDataState(data);
    localStorage.setItem("firmSettings_v1", JSON.stringify(data));
  };

  const formatNumber = (amount: number) => {
    if (isNaN(amount) || amount == null) return "0.00";
    let formattedStr = "";
    if (firmData.numberGroupingStyle === "indian") {
      formattedStr = amount.toLocaleString("en-IN", {
        minimumFractionDigits: parseInt(firmData.decimalPlaces) || 2,
        maximumFractionDigits: parseInt(firmData.decimalPlaces) || 2,
      });
    } else {
      formattedStr = amount.toLocaleString("en-US", {
        minimumFractionDigits: parseInt(firmData.decimalPlaces) || 2,
        maximumFractionDigits: parseInt(firmData.decimalPlaces) || 2,
      });
    }

    if (firmData.thousandSeparator === " " || firmData.thousandSeparator === ".") {
        formattedStr = formattedStr.replace(/,/g, "||comma||");
        formattedStr = formattedStr.replace(/\./g, firmData.decimalSeparator);
        formattedStr = formattedStr.replace(/\|\|comma\|\|/g, firmData.thousandSeparator);
    }
    return formattedStr;
  };

  const formatCurrency = (amount: number) => {
    const num = formatNumber(amount);
    if (!firmData.showCurrencySymbol) return num;
    
    // Simplistic symbol map
    let sym = "₹";
    if (firmData.baseCurrency === "USD") sym = "$";
    if (firmData.baseCurrency === "EUR") sym = "€";
    if (firmData.baseCurrency === "GBP") sym = "£";
    
    return firmData.currencySymbolPosition === "prefix" ? `${sym}${num}` : `${num}${sym}`;
  };

  return (
    <FirmSettingsContext.Provider value={{ firmData, setFirmData, formatCurrency, formatNumber }}>
      {children}
    </FirmSettingsContext.Provider>
  );
};

export const useFirmSettings = () => {
  const context = useContext(FirmSettingsContext);
  if (!context) {
    throw new Error("useFirmSettings must be used within a FirmSettingsProvider");
  }
  return context;
};
