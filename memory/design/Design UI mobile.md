# Bharat Book AI Import - Mobile UI Specification

## 1. Aesthetic Recipe: Clean Technical Utility (Mobile)
The mobile design retains the core essence of the desktop web app (technical, precise, trustworthy) but adapts navigation and layout for touch interactions and smaller viewports.

### Core Mood
- **Professional**: Clean lines and restricted color palette.
- **Precise**: Accessible and dense but tap-friendly data presentation.
- **Trustworthy**: Native-feeling interactions, clear feedback.

## 2. Visual Fundamentals

### Typography
- **Primary (Sans)**: `Inter`
  - Font sizes adjusted: Base size `text-sm` for readabilty, secondary text `text-xs`.
- **Display (Headings)**: `Outfit`
  - Used for top headers and section titles.
- **Monospace**: `JetBrains Mono`
  - Preserved for Voucher IDs, references, and amounts for alignment.

### Color Palette & Theme
- Identical to desktop, relying on `premium-blue`, `premium-slate`, and semantic colors (Emerald, Amber, Rose).

## 3. Layout Architecture (Mobile)

### Shell Structure (`Layout.tsx`)
- **Main Wrapper**: `flex flex-col h-screen overflow-hidden bg-gray-100`
- **Bottom Navigation (Alternative to Sidebar)**:
  - Hidden on desktop, fixed at `bottom-0` on mobile.
  - Height: `h-16`.
  - Icon-based navigation for primary actions (Dashboard, Upload, Bank, Vouchers).
- **Mobile Sidebar (Off-canvas Menu)**:
  - Triggered via a Hamburger menu in the header.
  - Slides in from left, takes `w-4/5` or `min-w-[250px]`, overlaid with a dark backdrop.
- **Top Header (`Header.tsx`)**:
  - Height auto/smaller on mobile (`h-14` or `h-16`).
  - Contains Hamburger icon, Brand Logo/Name, and minimal actions (Notification icon).
  - Search: Hidden behind a "Search" icon button that expands to a full-width overlay when active.

### Scrollbar Style
- Mobile-native scrollbars hide automatically. On panels, use `overflow-y-auto` with `-webkit-overflow-scrolling: touch`.

## 4. Component Patterns

### Tables & Data Lists
- **Transformation to Card Layouts**:
  - Dense desktop tables should convert to stacked cards on mobile views (`<md`).
  - Example: A voucher row becomes a card bearing Voucher ID on top-left, Amount on top-right, and Status/Party below.
- **Horizontal Scrolling Tables**:
  - If a table format must be forced, wrap with `overflow-x-auto` to allow horizontal swipe.

### Confidence Indicators & Data States
- Smaller pills: `py-0.5 px-1.5 text-[8px] or text-[10px]`.
- Mismatch states highlighted with red borders or colored typography instead of large block backgrounds to save space.

### Editable Fields
- Larger touch targets: Set `min-height` to `44px` on input fields.
- Full-width fields on mobile rather than side-by-side grids.

### Modals & Dialogs
- **Bottom Sheets**: Dialogs mapping to bottom sheets (docked at the bottom with a pull indicator) are preferred over center modals to ensure reachability.
  - `rounded-t-2xl` on the bottom sheet, full width.

### Multi-Step Import Flow
- **Step 1 (Upload)**:
  - Big "Tap to Upload" or "Take Photo/Choose File" button.
- **Step 2 (Correction)**:
  - Stacked fields. Single-column list.
- **Step 3 & 4 (Summary & Success)**:
  - Simple, single-column summary cards. Success takes full screen.

### Settings & Configuration Forms
- **Responsive Accordions:** Settings sections (like the Firm Settings) are organized into vertically stacked collapsible accordions, perfectly suited for natural mobile scrolling without taking up horizontal real estate.
- **Sticky Actions:** Heavy action buttons (Submit, Export Backup, Factory Reset) in deep configurations should stick to the bottom (`sticky bottom-0`) so users don't have to scroll infinitely to save changes.

## 5. Animation & Motion
- Emphasize native-like transitions. Bottom sheets slide up (`slide-in-from-bottom`), sidebars slide left (`slide-in-from-left`).
- Swipe gestures for lists (e.g., swipe to delete if implemented).

## 6. Icons & Touch Targets
- Icon buttons need a minimum size of `w-10 h-10` to meet the 44px equivalent touch target standard on mobile.
