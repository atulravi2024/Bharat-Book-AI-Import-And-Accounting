# Database & Persistence Architecture - Bharat Book AI Import

## 1. Storage Paradigm: "Serverless Local First"
Bharat Book AI Import utilizes a **zero-backend-database** architecture. All critical financial data, masters, transactions, and settings are persisted directly in the user's browser using **HTML5 LocalStorage**.

This ensures instant load times, total offline capabilities, and strong privacy guarantees (data never leaves the device unless explicitly queried against the Gemini AI proxy, which handles extraction ephemerally).

### 1.1. Key Prefixing & Hydration
- **Namespace Isolation:** All storage keys are prefixed with `bharat_book_` to prevent collisions with other apps running on localhost or shared domains (e.g., `bharat_book_all_vouchers`, `bharat_book_item_master`, `bharat_book_ledger_master`).
- **State Hydration:** Data is read synchronously on-mount within React (`App.tsx` and custom context providers) to hydrate the in-memory application UI state.

## 2. Core Entities & Data Models (`types.ts`)

The schema relies on highly relational structures mapped to local JSON arrays. Over 20 distinct data models are managed.

### 2.1. Transactional Layer (`ParsedVoucher`)
A universal wrapper for all financial transactions natively extracted by the AI or entered manually.
- **Base Attributes:** `id` (string), `type` (e.g., Sales, Purchase, Payment, Receipt, Journal, Contra, Bank Statement), `date`, `amount`.
- **Field Confidence Structure (`VoucherField`):**
  Instead of raw values, most data points use a wrapping object evaluating the AI's extraction confidence.
  ```typescript
  {
    value: string | number;
    confidence: '98%' | '75%' | '45%'; // High, Medium, Low
    suggestion?: string;               // Corrected mismatch suggestion
    isMismatch?: boolean;              // Validation failure flag
  }
  ```
- **Line Items (`items`):** Tracks nested billing arrays matching exact grid structures. Fields include `name`, `quantity`, `rate`, `uom` (Unit of Measure), `hsn`, `taxRate`, `taxType`, individual taxes (`cgst`, `sgst`, `igst`), and calculated `total`.
- **AI Summary (`aiSummary`):** An embedded object storing overall narrative text, discrepancy listings, and key specific extractions (like gst, urgency, period).
- **Audit Logging (`auditLogs`):** An array storing mutation history ("Created", "Modified", "AI Auto-Mapped", "Confirmed") ensuring traceability across local interactions. Contains old vs new value differential tracking.

### 2.2. Ledger & Accounting Masters
Relational 'tables' simulating a standard relational DB layout.
- **PartyMaster:** Customers or Vendors containing firm details. Includes `type` (Customer/Vendor/Both), `gstin`, `panNo`, `creditDays`, `openingBalance`, banking specifics, and address vectors.
- **LedgerMaster:** Core accounting buckets categorized by `group` (Assets, Liabilities, Expenses, Income). Includes specific `balanceType` (Debit/Credit) and robust nested `bankDetails` linking IFSC, Swift, UPI IDs, MICR, and Account Types.
- **AccountGroupMaster:** Hierarchical parent-child relationship mappings organizing nature (Assets/Liabilities).

### 2.3. Inventory & Item Masters
A comprehensive interface (`ItemMaster`) describing goods and services with deep ERP-level configuration tracking:
- **Pricing:** `purchaseRate`, `salesRate`, `mrp`, `wholesaleRate`, `dealerRate`.
- **Taxation/Compliance:** `hsnCode`, `taxRate`, `drugLicenseRequired`, `fssaiRequired`.
- **Logistics & Warehousing:** `minStock`, `maxStock`, `leadTime`, nested `weight`, `dimensions`, packaging sizes (`packSize`, `outerCartonQuantity`).
- **Valuation Strategy:** Detailed `costingMethod` (FIFO, LIFO, Average, Standard).
- **Sub-Masters Linkage:** Inventory directly references IDs connecting to:
  - `CategoryMaster`
  - `UomMaster` (Unit of Measure linked to conversion factors)
  - `BrandMaster`
  - `GradeMaster`
  - `SizeMaster` & `ColorMaster`
  - `AssertionCodeMaster` & `AssertionCategoryMaster`
  - `StockGroupMaster`
  - `LocationMaster` / `WarehouseMaster`

### 2.4. Production & Manufacturing Layer
- **BomMaster (Bill of Materials):** Used for advanced product assembly operations.
  Features parent `itemId`, `quantityProduced`, an array of child `components` tracking `quantity`, `uom`, and `scrapPercentage`. Includes manufacturing `routing` rules detailing setup times, run times, and labor/overhead costing per hour.

### 2.5. Configurable Attributes
- **GstMaster:** Dynamic database mapping HSN codes to precise tax rates, cess, and reverse-charge mechanisms.
- **CustomMappingRule:** Stores exact match rules (`keyword` -> `targetField` -> `targetValue`) and Regex strings enabling the bridging of AI misspellings exactly back to the Ledger without manual mapping each time. Includes execution `priority`.
- **ParsingSettings:** Controls AI behaviour tracking global system state, noise lists (Bank short words, IFCS prefixes to strip), and custom processing instructions.

## 3. The "Sample Data" Database Emulation
For feature demonstrations, the app loads read-only JSON datasets mapped identically to the schema from `/sample-data/`. 
When a user "Toggles Sample Data," the app dynamically loads up to 18 JSON files (from categories like `reports/vouchers.json`, `item-master/items.json`, `ledger-master/ledgers.json`) overriding or merging the live LocalStorage arrays using an isolated system, allowing safe insertion and cleanly separated deletion of mock data.
