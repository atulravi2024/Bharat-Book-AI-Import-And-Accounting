
export const initialMappingRules = [
    { kw: "RENT / OFFICE", led: "Rent Expense A/c" },
    { kw: "SALARY / WAGES", led: "Salary Payable" },
    { kw: "ZOMATO / SWIGGY", led: "Staff Welfare (Meals)" },
    { kw: "UBER / OLA / TAXI", led: "Conveyance Expenses" },
    { kw: "FUEL / PETROL / DIESEL", led: "Vehicle Fuel & Maint" },
    { kw: "ELECTRICITY / MSEB", led: "Electricity Expenses" },
    { kw: "WATER / TANKER", led: "Water Charges" },
    { kw: "AIRTEL / JIO / VODA", led: "Telephone & Internet" },
    { kw: "BROADBAND / ACT", led: "Telephone & Internet" },
    { kw: "AMAZON / FLIPKART", led: "Office Misc Supplies" },
    { kw: "STATIONERY / XEROX", led: "Printing & Stationery" },
    { kw: "COURIER / SPEEDPOST", led: "Postage & Courier" },
    { kw: "CLEANING / HOUSEKEEPING", led: "Maintenance Charges" },
    { kw: "REPAIR / SERVICE", led: "Repairs & Maintenance" },
    { kw: "AUDIT / CA / LEGAL", led: "Professional Fees" },
    { kw: "INSURANCE / LIC", led: "Insurance Premium" },
    { kw: "TDS / INCOME TAX", led: "Tax Paid" },
    { kw: "GST / IGST / CGST", led: "GST Output/Input" },
    { kw: "LOAN / EMI", led: "Loan Repayment" },
    { kw: "INTEREST / INT", led: "Bank Interest Expense" },
    { kw: "DIVIDEND", led: "Investment Income" },
    { kw: "DONATION", led: "Charity & Donation" },
    { kw: "TEA / COFFEE / SNACKS", led: "Staff Welfare" },
    { kw: "GIFT / DIWALI", led: "Staff Welfare (Gifts)" },
    { kw: "BONUS / INCENTIVE", led: "Salary & Wages" },
    { kw: "MUNICIPAL / TAX", led: "Rates & Taxes" },
    { kw: "PENALTY / FINE", led: "Penalty & Interest" },
    { kw: "BANK CHG / SMS", led: "Bank Charges" },
    { kw: "REFUND / REVERSAL", led: "Suspense Account" },
    { kw: "CASH DEP / BY CASH", led: "Cash-in-Hand (Contra)" },
    { kw: "CASH WDL / ATM", led: "Cash-in-Hand (Contra)" },
    { kw: "CAR SERVICE / TYRE", led: "Vehicle Maintenance" },
    { kw: "SOFTWARE / MSFT / AWS", led: "Software Subscription" },
    { kw: "ADVERTISEMENT / FB", led: "Marketing & Ads" },
    { kw: "STAFF WELFARE", led: "Staff Welfare" },
    { kw: "STIPEND / INTERN", led: "Wages & Salaries" },
    { kw: "FREIGHT / TRANSPORT", led: "Freight Outward" },
    { kw: "LOADING / UNLOADING", led: "Handling Charges" },
    { kw: "GARDENING", led: "Office Maintenance" },
    { kw: "MEMBERSHIP / CLUB", led: "Subscription Fees" },
    { kw: "HARDWARE / RAM / SSD", led: "Computer Repairs" },
    { kw: "NEWSPAPER", led: "Office Expenses" },
    { kw: "CHARITY", led: "Donation A/c" },
    { kw: "MEDICAL / FIRST AID", led: "Staff Welfare" },
    { kw: "ENTERTAINMENT", led: "Misc Expenses" },
    { kw: "LOAN PROCESSING", led: "Bank Charges" },
    { kw: "CREDIT CARD", led: "Credit Card Liability" },
    { kw: "SWEEP IN / OUT", led: "Inter-bank Transfer" },
    { kw: "MORTGAGE / HOME", led: "Loan A/c" },
    { kw: "CONSULTANCY", led: "Professional Fees" }
];

export const runMappingSimulation = (input: string, options: any) => {
    const { 
        mappingRules, aliases, bankChargesKeywords, cashFlowKeywords, selfTransferKeywords, toggles,
        bankShortCodes, bankIgnoreWords, paymentModes, paymentChannels, ifscPrefixes,
        // Structural settings
        splitDelimiter = '/',
        partyNameLocation = 'Auto-Detect (AI Structural Parsing)',
        utrExtractorType = '12-16 Digit Alphanumeric Sequence',
        accountNumberDetection = 'Enabled (9+ Digits anywhere)',
        ignoreExtractionKeywords = ''
    } = options;
    
    // Parse noise lists from string to array (comma separated)
    const bShortCodes = bankShortCodes ? bankShortCodes.split(',').map((s: string) => s.trim().toUpperCase()) : [];
    const bIgnore = bankIgnoreWords ? bankIgnoreWords.split(',').map((s: string) => s.trim().toUpperCase()) : [];
    const pModes = paymentModes ? paymentModes.split(',').map((s: string) => s.trim().toUpperCase()) : [];
    const pChannels = paymentChannels ? paymentChannels.split(',').map((s: string) => s.trim().toUpperCase()) : [];
    const iPrefixes = ifscPrefixes ? ifscPrefixes.split(',').map((s: string) => s.trim().toUpperCase()) : [];
    const ignoreKws = ignoreExtractionKeywords ? ignoreExtractionKeywords.split(',').map((s: string) => s.trim().toUpperCase()) : [];

    let partyKey = "UNKNOWN";
    let personName = "UNKNOWN";
    let category = "Suspense/Unclassified";
    let reference = "Not Found";
    let status = "Needs Manual Review";
    let color = "text-red-700 bg-red-50 border-red-200";
    let mobile = "Not Found";
    let bankAccount = "Not Found";
    let bankName = "Not Found";
    let txnType = "Not Found";
    let voucherType = "Journal (Default)";
    let senderReceiverDetails = "Not Found";
    let confidence = 45;
    
    let partyKeyConf = 20;
    let personNameConf = 20;
    let categoryConf = 50;
    let referenceConf = 0;
    let mobileConf = 0;
    let bankAccountConf = 0;
    let bankNameConf = 0;
    let txnTypeConf = 0;
    let voucherTypeConf = 50;
    let senderReceiverDetailsConf = 0;

    const text = input.toUpperCase();
    
    // 1. Delimiter splitting
    const delimiter = splitDelimiter || '/';
    const parts = text.split(delimiter).map(p => p.trim()).filter(p => p.length > 0);
    
    // 2. Reference / UTR Extraction
    if (utrExtractorType === 'After Keyword "REF/"' && text.includes('REF/')) {
        const afterRef = text.split('REF/')[1];
        reference = afterRef.split(/[^\w]/)[0];
        referenceConf = 95;
    } else if (utrExtractorType === 'After Keyword "UTR/"' && text.includes('UTR/')) {
        const afterUtr = text.split('UTR/')[1];
        reference = afterUtr.split(/[^\w]/)[0];
        referenceConf = 95;
    } else {
        // Default: 12-16 digit sequence
        const utrMatch = text.match(/[A-Z0-9]{12,16}/);
        if (utrMatch) {
            reference = utrMatch[0];
            referenceConf = 85;
        }
    }

    // 3. Party Name Location logic
    if (partyNameLocation === 'Token 1 (First Value)' && parts.length > 0) {
        partyKey = parts[0];
        partyKeyConf = 90;
    } else if (partyNameLocation === 'Token 2 (Second Value after TRF)' && parts.length > 1) {
        partyKey = parts[1];
        partyKeyConf = 90;
    } else if (partyNameLocation === 'Token 3 (Third Value)' && parts.length > 2) {
        partyKey = parts[2];
        partyKeyConf = 90;
    } else if (partyNameLocation === 'Last Token (End of String)' && parts.length > 0) {
        partyKey = parts[parts.length - 1];
        partyKeyConf = 90;
    } else {
        // Auto-Detect logic
        const validParts = parts.filter(p => !ignoreKws.includes(p) && !pModes.includes(p) && p !== reference);
        if (validParts.length > 0) {
            partyKey = validParts[0];
            partyKeyConf = 75;
        } else if (parts.length > 0) {
            partyKey = parts[0];
            partyKeyConf = 40;
        }
    }

    // fallback for reference if not found by specific rules
    if (reference === "Not Found" && parts.length > 1) {
        for (const part of parts) {
            if (part.length >= 8 && /\d/.test(part) && part !== partyKey) {
                reference = part;
                referenceConf = 60;
                break;
            }
        }
    }

    if (partyKey.includes(' PVT') || partyKey.includes(' LTD') || partyKey.includes(' INC') || partyKey.includes(' LLC')) {
        personName = partyKey;
        personNameConf += 60;
    } else {
        personName = partyKey.replace(/([A-Z]+)/g, " $1").trim();
        personNameConf += 30;
    }

    const chargeKws = bankChargesKeywords.split(',').map((s: string) => s.trim().toUpperCase());
    const cashKws = cashFlowKeywords.split(',').map((s: string) => s.trim().toUpperCase());
    const selfKws = selfTransferKeywords.split(',').map((s: string) => s.trim().toUpperCase());

    let matched = false;

    const mobileMatch = text.match(/(?:^|\D)([6-9]\d{9})(?:\D|$)/);
    if (mobileMatch && toggles.mobileNumberExtractor) {
        mobile = mobileMatch[1];
        mobileConf = 95;
        confidence += 10;
    }

    // Account Number Detection
    let accountMatch = null;
    if (accountNumberDetection === 'Prefix Match (AC/, A/C, ACC/)') {
        const prefixMatch = text.match(/(?:AC\/|A\/C|ACC\/)(\d{9,18})/);
        if (prefixMatch) accountMatch = prefixMatch;
    } else if (accountNumberDetection === 'End of String Only') {
         const endMatch = text.match(/(\d{9,18})$/);
         if (endMatch) accountMatch = endMatch;
    } else if (accountNumberDetection !== 'Disabled') {
        accountMatch = text.match(/(?:^|\D)(\d{9,18})(?:\D|$)/);
    }

    if (accountMatch) {
        if (accountMatch[1] !== mobile) {
            bankAccount = accountMatch[1];
            bankAccountConf = 90;
            senderReceiverDetails = `A/c: ${bankAccount}`;
            senderReceiverDetailsConf = 80;
            confidence += 15;
        }
    }

    const banks = ["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "YES BANK", "PUNJAB NAT", "IDFC", "INDUSIND"];
    for (const b of banks) {
        if (text.includes(b)) {
            bankName = b;
            bankNameConf = 98;
            if (senderReceiverDetails !== "Not Found") {
                senderReceiverDetails += ` (${b})`;
                senderReceiverDetailsConf = 90;
            } else {
                senderReceiverDetails = b;
                senderReceiverDetailsConf = 60;
            }
            confidence += 5;
            break;
        }
    }

    const txTypes = pModes.length > 0 ? pModes : ["UPI", "IMPS", "NEFT", "RTGS", "ACH", "INB", "CMS", "SWEEP", "ATM", "POS", "CHQ", "CASH DEP", "CASH WDL"];
    for (const t of txTypes) {
        if (text.includes(t)) {
            txnType = t;
            txnTypeConf = 99;
            confidence += 10;
            break;
        }
    }

    // If senderReceiverDetails is still empty, check parts
    if (senderReceiverDetails === "Not Found" && parts.length > 2) {
        const detailPart = parts.find(p => p !== partyKey && p !== reference && p !== txnType && p !== bankName);
        if (detailPart) {
            senderReceiverDetails = detailPart;
            senderReceiverDetailsConf = 45;
        }
    }

    for (const kw of chargeKws) {
        if (kw && text.includes(kw)) {
            category = "Bank Charges";
            categoryConf = 99;
            voucherType = "Payment";
            voucherTypeConf = 98;
            status = "Auto-Classified (Charges)";
            color = "text-green-700 bg-green-50 border-green-200";
            partyKey = "BANK CHG";
            partyKeyConf = 95;
            personName = "Bank Entity";
            personNameConf = 90;
            confidence = 98;
            matched = true;
            break;
        }
    }

    if (!matched) {
        for (const kw of cashKws) {
            if (kw && text.includes(kw)) {
                category = "Cash / ATM Transaction";
                categoryConf = 95;
                voucherType = "Contra";
                voucherTypeConf = 90;
                status = "Auto-Classified (Cash/ATM)";
                color = "text-green-700 bg-green-50 border-green-200";
                partyKey = "CASH";
                partyKeyConf = 95;
                personName = "Self / Cashier";
                personNameConf = 80;
                confidence = 95;
                matched = true;
                if (text.includes("ATM")) {
                    txnType = "ATM";
                    txnTypeConf = 99;
                }
                break;
            }
        }
    }

    if (!matched) {
        for (const kw of selfKws) {
            if (kw && text.includes(kw)) {
                category = "Internal Fund Transfer (Contra)";
                categoryConf = 90;
                voucherType = "Contra";
                voucherTypeConf = 90;
                status = "Auto-Classified (Internal)";
                color = "text-green-700 bg-green-50 border-green-200";
                partyKey = "INTERNAL TRANSFER";
                partyKeyConf = 95;
                personName = "Self Account";
                personNameConf = 90;
                confidence = 92;
                matched = true;
                break;
            }
        }
    }

    if (!matched) {
        for (const alias of aliases) {
            if (alias.from && text.includes(alias.from.toUpperCase())) {
                partyKey = alias.to;
                partyKeyConf = 99;
                personName = alias.to;
                personNameConf = 99;
                status = "Alias Match Found";
                color = "text-purple-700 bg-purple-50 border-purple-200";
                matched = true;
                break;
            }
        }
    }

    if (!matched) {
        for (const rule of mappingRules) {
            if (rule.kw && text.includes(rule.kw.toUpperCase())) {
                category = rule.led;
                categoryConf = 99;
                voucherType = "Payment / Receipt";
                voucherTypeConf = 85;
                status = "Mapped via Keyword";
                color = "text-green-700 bg-green-50 border-green-200";
                // partyKey already determined above by structural logic
                confidence = 88;
                matched = true;
                break;
            }
        }
    }

    if (toggles.stripEntitySuffixes && partyKey !== "BANK CHG" && partyKey !== "CASH" && partyKey !== "INTERNAL TRANSFER" && partyKey !== "UNKNOWN") {
        partyKey = partyKey.replace(/ PVT L$/, '').replace(/ PVT LTD$/, '').replace(/ LLC$/, '').replace(/ INC$/, '');
    }

    const confidenceStr = Math.min(confidence, 99) + "%";

    return { 
        partyKey, personName, category, reference, status, color, mobile, bankAccount, bankName, txnType, voucherType, senderReceiverDetails, confidence: confidenceStr,
        partyKeyConf: Math.min(partyKeyConf, 99), personNameConf: Math.min(personNameConf, 99), categoryConf: Math.min(categoryConf, 99), referenceConf: Math.min(referenceConf, 99),
        mobileConf: Math.min(mobileConf, 99), bankAccountConf: Math.min(bankAccountConf, 99), bankNameConf: Math.min(bankNameConf, 99), txnTypeConf: Math.min(txnTypeConf, 99),
        voucherTypeConf: Math.min(voucherTypeConf, 99), senderReceiverDetailsConf: Math.min(senderReceiverDetailsConf, 99)
    };
};
