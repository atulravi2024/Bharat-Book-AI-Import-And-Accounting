# Bharat Book AI Import - Design Documentation

## 1. Project Overview
**Bharat Book AI Import** is a high-performance, AI-driven ERP companion designed to streamline financial operations such as voucher entry, report analysis, and bank reconciliation. It leverages semantic AI to automate data extraction from documents and images, reducing manual entry and errors.

## 2. Technical Stack
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Modern, utility-first)
- **Icons:** Lucide React (Stroke width: 1.5px to 2px)
- **Animations:** Framer Motion (`motion/react`)
- **Data Visualization:** Recharts
- **AI Integration:** Google Generative AI (Gemini 1.5 Flash/Pro)
- **Persistence:** LocalStorage (for masters, vouchers, and settings)
- **Excel Processing:** XLSX (SheetJS)

## 3. Design Philosophy
- **Aesthetic:** "Premium Technical" - combining **Clean Utility** with **Technical Dashboard** recipes.
- **Mood:** Professional, precise, and trustworthy with a modern feel (large border radii `rounded-2xl`).
- **Layout:** Responsive, data-dense interfaces with clear hierarchy.
- **Micro-interactions:** Smooth transitions between views and intelligent tab scrolling for sub-navigation.
- **Architectural Honesty:** No simulated infrastructure; all data processing (Excel parsing, AI simulation) is handled directly in-browser.

## 4. Visual Fundamentals

### 4.1. Typography
- **Primary (Sans):** `Inter`
  - Used for UI elements, data grids, and forms.
  - Weights: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold).
- **Display (Headings):** `Outfit`
  - Used for page titles, brand elements, and major headers.
  - Weights: 400, 700, 900 (Black).
- **Monospace:** `JetBrains Mono`
  - Required for Voucher IDs (e.g., `#VOU-123`), financial amounts, dates, and audit logs.
- **Invoice & Print Typography:**
  - Highly customizable print typography supporting multiple fonts.
  - Includes settings for Font Weight, Text Transform, Base Font Size, and Heading Scale.

### 4.2. Spacing & Margin Metrics
- **Dynamic Print Spacing:**
  - **Plain Spacing:** Adjusts overall padding scaling on print views.
  - **Line Spacing:** Controls reading density (1.0 to 2.0 multipliers).
  - **Text & Character Spacing (px):** Granular tracking enhancements (letter-spacing/word-spacing) to improve OCR legibility.
  - **Paragraph & Header Spacing (px):** Bottom margins on structural document elements.

### 4.3. Color Palette & Theme
- **Blue (Primary):**
  - `premium-blue-500`: `#3B82F6` (Action primary)
  - `premium-blue-600`: `#2563EB` (Action hover)
- **Slate (Neutral):**
  - `premium-slate-50`: `#F8FAFC`
  - `premium-slate-100`: `#F1F5F9`
  - `premium-slate-200`: `#E2E8F0`
- **Functional States:**
  - **Success:** Emerald/Green (`bg-green-50`, `text-green-700`, `border-green-200`)
  - **Warning:** Amber/Yellow (`bg-amber-50`, `text-amber-700`, `border-amber-100`)
  - **Error/Mismatch:** Rose/Red (`bg-red-50`, `text-red-700`, `border-red-500`)

### 4.4. Layout Architecture
- **Shell Structure (`Layout.tsx`):**
  - **Sidebar (`Sidebar.tsx`):** Width `w-64` (expanded) or `w-20` (collapsed). Style: `bg-white border-r border-premium-slate-100`.
  - **Header (`Header.tsx`):** Height `h-20`. Features `Global Command Search` (max-w-md, rounded-3xl).
- **Mobile Adaptations:**
  - **Bottom Navigation:** Icon-based for core actions (`h-16`).
  - **Hamburger Menu:** Off-canvas menu for supplementary navigation.
  - **Responsive Grids:** Conversion of tables to card layouts on small screens.

## 5. Component Architecture

### 5.1. Dashboard (`/components/Dashboard`)
- **KPI Cards:** Displaying Sales, Growth, and Order counts with trend indicators.
- **Charts:** Interactive line and bar charts using Recharts for historical comparison.
- **Contextual Tabs:** Overview, Sales, and Purchase registers with dynamic scrolling.

### 5.2. Masters (`/components/Masters`)
- **ItemMasterView.tsx:** Advanced CRUD for inventory items (Category, Brand, Grade, HSN, Tax).
- **LedgerMasterView.tsx:** Management of Parties (Customers/Vendors) and accounting ledgers.

### 5.3. Reports (`/components/Reports`)
- **GSTReportView.tsx:** Specialized dashboard for GSTR-1, GSTR-3B, and Filing status.
- **FinancialReportView.tsx:** Profit & Loss, Balance Sheet, and Trial Balance with drill-down functionality.
- **BankReportView.tsx:** 
  - Auto-Matching entries to Masters.
  - Classification (Receipts, Payments, Contra).
  - Reconciliation against source statements.

### 5.4. AI Import Flow (`/components/Operations/Import`)
- **Step 1 (Upload):** Large dashed-border dropzone for Excel/CSV/PDF files.
- **Step 2 (Correction):** 
  - **Confidence Pills:** High (98%+), Medium (75%+), Low (below 50%).
  - **Mismatch Highlighting:** `bg-red-50 border-red-500 shadow-sm` for fields requiring attention.
  - **Master Linkage:** Labels indicating if a party is already linked or missing.
- **Step 3 (Summary):** Aggregate cards showing Total Value, Tax Breakdown, and Error count.
- **Step 4 (Success):** Large checkmark animations and direct links to reports.

## 6. Implementation Strategies

### 6.1. Smart Navigation
- **Dynamic Tab Scroller:** Custom `useEffect` hook using `scrollBy` to automatically center active sub-tabs in horizontally scrolling menus. This ensures visibility across mobile and desktop.

### 6.2. Data Processing
- **Parsing Engine:** Uses `XLSX` to handle browser-side Excel reading.
- **Cleaning Logic:** Heuristic header detection and narration string cleaning (regex-based).

### 6.3. Persistence
- **Storage Strategy:** Robust use of `localStorage` for application state, configurations, and historical transactions (`bharat_book_all_vouchers`).

## 7. Animations & Motion
- **Route Transitions:** Fade + Slide effects for view entries.
- **Interactive States:** `hover:scale-[1.02] active:scale-95 transition-all`.
- **Modals:** `animate-in zoom-in-95 backdrop-blur-sm`.

## 8. Data Models & Interface Details (`types.ts`)

### 8.1. Voucher Structure
- **ParsedVoucher**: Core interface for all transactions.
  - `id`: Unique identifier (JetBrains Mono).
  - `type`: Enum of `Sales`, `Purchase`, `Payment`, `Receipt`, `Journal`, `Contra`, `BankStatement`, etc.
  - **VoucherField**: Every extracted field (Date, Amount, Party) is an object containing:
    - `value`: The actual data.
    - `confidence`: Enum of High (98%), Medium (75%), Low (45%).
    - `isMismatch`: Boolean flag for AI-detected errors.
  - `auditLogs`: Array of history events (Created, Modified, AI-Mapped).

### 8.2. Master Entities
- **PartyMaster**: Customers/Vendors with GSTIN, PAN, and contact details.
- **ItemMaster**: Inventory with HSN, Tax Rate, SKU, and categorization attributes.
- **LedgerMaster**: Accounting heads with Group associations and bank details.
- **Attribute Masters**: Specific schemas for Brands, Categories, Colors, Sizes, Grades, and Assertion Codes.

## 9. Advanced Technical Logic

### 9.1. AI Pipeline (`aiService.ts`)
- **Multi-pass Analysis**:
  1. Header/Grid detection to normalize varied Excel structures.
  2. Entity Identification: Matching strings against provided candidate lists (Parties, Items).
  3. Tax Calculation Validation: Cross-checking individual line items against the provided total tax.

### 9.2. Sample Data Management
- The app uses a **Toggleable Sample System**.
- Sample sets (e.g., 'ledgers', 'bank_vouchers') are loaded from JSON files in `/sample-data`.
- Injected data is tagged with a `sampleSetId` to allow clean "un-toggling" without affecting user-generated data.

### 9.3. Storage Schema
- **Prefix Isolation**: All keys in `localStorage` are prefixed with `bharat_book_` to prevent collisions.
- **State Hydration**: On boot, `App.tsx` hydrates its state by merging multiple storage keys, ensuring a persistent session even after refresh.

## 10. Navigation & Routing Defaults
- **Persisted Navigation**: Users can set default landing pages (e.g., "Always open GST Reports on start").
- **Routing Memory**: The system remembers the last active sub-tab for each view, reloading it automatically using the `routing` object in `navigation_defaults`.

## 11. Error Handling & Reliability
- **Discrepancy UI**: Fields with `isMismatch: true` are rendered with specific red borders and warning icons.
- **Recovery**: "Save Draft" functionality allows users to preserve partially corrected AI imports in `bharat_book_voucher_draft`.


