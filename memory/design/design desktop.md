# Bharat Book AI Import - Desktop UI Specification

## 1. Aesthetic Recipe: Clean Technical Utility (Desktop)
The design follows a combination of **Recipe 8: Clean Utility** and **Recipe 1: Technical Dashboard**. It prioritizes precision, trust, and clarity, essential for financial and accounting software on desktop monitors.

### Core Mood
- **Professional**: Clean lines and a restricted color palette.
- **Precise**: Information-dense grids with clear hierarchy.
- **Trustworthy**: Native-feeling typography and standard UI patterns.
- **Modern**: Large border radii (`rounded-2xl`, `rounded-[1.25rem]`) and subtle shadows.

## 2. Visual Fundamentals

### Typography
- **Primary (Sans)**: `Inter`
  - Used for readability in data grids, forms, and general UI.
  - Weights: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold).
- **Display (Headings)**: `Outfit`
  - Used for page titles, major headers, and brand elements.
  - Weights: 400, 700, 900 (Black).
- **Monospace**: `JetBrains Mono`
  - Required for: Voucher IDs (e.g., `#VOU-123`), amounts, dates, and audit logs to ensure alignment and technical character.

### Color Palette & Theme
Defined in `index.css` under global `@theme`:
- **Blue (Primary)**: 
  - `premium-blue-500`: `#3B82F6` (Action primary)
  - `premium-blue-600`: `#2563EB` (Action hover/active)
  - Light variants: `bg-blue-50` (soft backgrounds/pills)
- **Slate (Neutral)**:
  - `premium-slate-50`: `#F8FAFC`
  - `premium-slate-100`: `#F1F5F9`
  - `premium-slate-200`: `#E2E8F0`
- **Functional States**:
  - **Success**: Emerald/Green (`bg-green-50`, `text-green-700`, `border-green-200`)
  - **Warning**: Amber/Yellow (`bg-amber-50`, `text-amber-700`, `border-amber-100`)
  - **Error/Mismatch**: Rose/Red (`bg-red-50`, `text-red-700`, `border-red-500`, `ring-red-100`)

## 3. Layout Architecture

### Shell Structure (`Layout.tsx`)
- **Main Wrapper**: `flex h-screen bg-gray-100`
- **Sidebar (`Sidebar.tsx`)**:
  - Width: `w-64` (expanded) or `w-24` (collapsed).
  - Transition: `duration-500 ease-in-out`.
  - Style: `bg-white shadow-[20px_0_40px_rgba(0,0,0,0.02)] border-r border-premium-slate-100`.
- **Top Header (`Header.tsx`)**:
  - Height: `h-20`.
  - Style: `bg-white/80 backdrop-blur-md border-b sticky top-0`.
  - **Global Command Search**: 
    - Container: `max-w-md w-full rounded-3xl bg-premium-slate-50`.
    - Input style: `pl-14 pr-6 py-4 border-none text-[10px] font-bold uppercase tracking-widest text-gray-700`.
    - Focus state: `ring-2 ring-blue-100 bg-white`.

### Scrollbar Style
- Custom utility `.custom-scrollbar`:
  - Width/Height: `6px`.
  - Thumb: `#E2E8F0` with `rounded: 10px`.
  - Hover: `#CBD5E1`.

## 4. Component Patterns

### Confidence Indicators & Data States
- **Confidence Pills**:
  - **High (98%)**: Green theme.
  - **Medium (75%)**: Yellow theme.
  - **Low (45%)**: Red theme.
- **Editable Fields**:
  - Hover: `hover:bg-gray-100 border-transparent hover:border-blue-300`.
  - Edit Mode: `border-blue-500 ring-1 ring-blue-100 bg-white`.
  - **Mismatch State**: `bg-red-50 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]`.
- **Master Linkage Labels**: 
  - Linked: Blue pill with check icon.
  - Unlinked: Orange pill "Not in Masters".

### Tables & Data Lists (`VoucherListView.tsx`)
- **Container**: `bg-white rounded-xl shadow-sm border border-gray-200`.
- **Table Spec**: `min-w-full divide-y divide-gray-200` with `min-width: 1100px`.
- **Header Cells**: `text-[10px] font-bold uppercase tracking-widest text-gray-400`.
- **Bulk Action Toolbar**: Absolute positioned `top-0` over table, `bg-blue-600 text-white`.
- **Audit Logs**: Vertical timeline with `before:bg-gradient-to-b before:from-blue-200 before:to-transparent`.

### Modals & Dialogs
- **Overlay**: `bg-black/50 backdrop-blur-sm`.
- **Content**: `rounded-2xl shadow-2xl animate-in zoom-in-95`.
- **Mapping Dialog**: Large modal with specific settings/overrides.
- **Delete Confirmation**: Center-aligned icon with destructive red accents.

### Main Views (Desktop Layouts)
- **DashboardView**: Features high-level metrics cards, charts (using Recharts when applicable), and latest activity lists.
- **SettingsView**: Tabs interface on the left, right pane with detailed form configuration sections (General, Import Rules, Mapping Laws, etc.). Uses desktop grids (`md:grid-cols-2`).
- **ReportsView & BankView**: Extensive grid/data layouts allowing wide horizontal spaces for dense enterprise data.
- **MastersManagement**: Sidebar layout for list and details pane side-by-side.

### Multi-Step Import Flow
- **Step 1 (Upload)**:
  - Centralized dropzone with `bg-blue-50/50` and dashed `border-blue-200`.
  - Large iconography to denote accepted file types.
- **Step 2 (Correction)**:
  - Intensive grid view for multi-voucher review.
  - Sticky sub-header for navigation between vouchers.
  - Confidence-based reactive fields (as detailed in Component Patterns).
- **Step 3 (Summary)**:
  - High-level data aggregate cards.
  - Final validation checkmarks before ledger posting.
- **Step 4 (Success)**:
  - Large success checkmark animation.
  - Quick action buttons (Undo, View Ledger, Bank View).

## 5. Animation & Motion
Powered by `motion/react` or standard Tailwind transitions:
- **Navigation**: `fade-in duration-500`.
- **View Switches**: Horizontal slide-ins.
- **Dropdowns/Popovers**: `animate-in fade-in slide-in-from-top-2 duration-200`.
- **Button Feedback**: `active:scale-95 transition-all`.

## 6. Icons
- **Library**: `lucide-react` via local `IconComponents.tsx`.
- **Usage**: Consistent `text-gray-400` for inactive, `text-blue-600` for primary/active.
- **Stroke Width**: Standard (2px) or slightly thinner (1.5px) for a more professional look.
