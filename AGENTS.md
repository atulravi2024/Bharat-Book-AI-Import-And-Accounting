# Agent Guidelines - Bharat Book AI Import

These persistent instructions represent the user's specific rules, project conventions, and functional boundaries for the application. They are automatically injected into the system instructions for all future turns and AI sessions.

## 🛠️ Development & Architecture Rules

1. **Global Settings vs. Page Import Scope (CRITICAL)**
   - In the future, **DO NOT** add custom steps, configurations, fields, or behaviors (like custom "reward" metrics, mapping defaults, or specific steps) inside page-level import flows (such as importing vouchers, ledgers, or Excel sheets).
   - All such configuration choices should be part of the global **Settings** flow which is set once by the user, rather than re-declared or forced inside individual import scripts.
   - Keep import logic highly focused on data parsing and mapping against current configured states, without over-engineering or adding unsolicited data layers dynamically during execution.

2. **UI and Interaction Design**
   - Respect visual and functional boundaries: Build exactly what is requested, utilizing deep visual polish and clean negative space instead of adding unsolicited features.
   - Maintain the premium, dense ERP technical style established by Bharat Book.
   - **Settings Headers Layout Directive**: The settings page header uses a stacked two-row layout on mobile devices (`flex flex-col sm:flex-row gap-4 items-stretch sm:items-center`), displaying the page title/icon on the first row, and the tab selection on the second row (stacked below). On desktop/tablet, they render on a single horizontal row.
   - **Mobile-Responsive Subpage Headers**: Always display the general settings page header (including title, icon, and the descriptive subheader text or information) on all platforms including mobile to ensure the user receives context. Place the tab selection navigation bar on the second row below the page header in mobile layout. Ensure the descriptive subheader text is styled with micro-responsive text sizes (such as `text-[10px] xs:text-[11px]`) and layout truncation (`truncate whitespace-nowrap`) to guarantee that it strictly resides on a single, clean row without wrapping or spilling onto multiple lines.
   - **Compact Same-Row Action Controls**: All subpage utility actions (Reset, Save, Load, Clear, etc., ranging from 1 to 6 buttons) must occupy a single, continuous, horizontal row without wrapping. On mobile or smaller screens, hide button text labels using `hidden sm:inline` classing, displaying only icons to ensure all actions fit clearly and perfectly on a single line.
   - **Responsive Security Badge Directive**: The `t("BHARAT BOOK") SECURE MODE` badge block should be hidden on mobile/tablet/medium screen sizes to preserve space (using `hidden lg:flex`). Only display it when ample visual space is available on desktop monitors (`lg` screens and up).

3. **Code Splitting & Architecture Method (CRITICAL)**
   - When splitting any large file or folder structure, you **MUST** default to using the **Feature-Based / Modular Architecture** by default.
   - If a folder structure is not suitable for this method, or if the method is not practical in a specific scenario, you **MUST PAUSE** and provide the user with the **THREE best alternative architecture options** for that specific situation.
   - You must wait for the user to decide which of those three recommendations to follow before making sweeping architectural changes.
   - *Feature-Based Structure Example*: Group all related files (Hooks, Views/UI, Types) under the feature's dedicated folder rather than scattering them across global folders.
   - **Sub-page Tab Splitting Directive**: When splitting a large settings sub-page into separate tabs, you **MUST** create a dedicated folder named `tab` within the sub-page's root folder (e.g., `src/components/Settings/GeneralSettings/tab/`) and place the individual tab component files inside it.
     ```
     src/components/Operations/VoucherEntry/components/SystemInfo/
      ├── 📄 index.tsx                   (Main Wrapper: यह सभी छोटे components को जोड़ेगा)
      ├── 📄 types.ts                    (यहाँ AddressData, HistoryEntry, SystemInfoSectionProps होंगे)
      │
      ├── 📁 hooks/                      (सिर्फ लॉजिक और स्टेट मैनेजमेंट)
      │    ├── 📄 useTelemetry.ts        (exportCount, telemetry state का लॉजिक)
      │    ├── 📄 useVoucherHistory.ts   (History load और update करने का लॉजिक)
      │    └── 📄 useAddressGeocoder.ts  (Address fetching और geocoding का लॉजिक)
      │
      └── 📁 views/                      (छोटे UI Components - Method 1 का हिस्सा)
           ├── 📄 SystemInfoTabs.tsx     (टैब नेविगेशन UI)
           ├── 📄 AddressGeocoderView.tsx(एड्रेस दिखाने का UI)
           ├── 📄 TelemetryDetails.tsx   (टेलीमेट्री डेटा दिखाने का कार्ड)
           ├── 📄 HistoryLogTable.tsx    (हिस्ट्री एंट्रीज के लिए टेबल UI)
           └── 📄 PrintExportListeners.tsx (बैकग्राउंड इवेंट लिसनर्स)
     ```

## 📐 Import Pipeline Terminology & Architecture Rules (CRITICAL/PERMANENT)

1. **Stages vs. Parts vs. Steps Definition**
   - Do **NOT** refer to different steps as "Page One" or "Page Two" interchangeably unless mapping them synchronously: **Step 1 is Page One**, and **Step 2 is Page Two**. Keep their sequence identical.
   - The entire import pipeline consists of **11 Steps** in total.
   - These 11 steps are divided into two distinct **Stages** (or **Parts**):
     - **Stage One (or Part One) [Steps 1 to 6]**: Handles the initial user ingestion, file selection, mapping setup, and configuration.
     - **Stage Two (or Part Two) [Steps 7 to 11]**: The **AI Ingestion & Processing Unit**, where the AI parses, auto-aligns, verifies, and corrects the records before formal absorption.

2. **Guidelines for Choices and Information Layout**
   - Do **NOT** use the term "Sub-step" or "Sub-page". These are strictly styled as "Options" inside the step or page.
   - All interactive paths, data, or screens loaded inside a Step or a Page should be described as **Options** (e.g. Choose Option, Type Option) depending on whatever step or page is currently active.
   - Ensure all future development and code changes respect these boundaries and terminologies explicitly.


## 🔍 Subpages Search & Tab Matching Protocol (CRITICAL/PERMANENT)

When implementing or extending a Search Bar on any Subpages (such as General Settings, or other future configurations/dashboards), you **MUST** strictly adhere to the exact background search, dynamic switching, and category matching behavior outlined below:

### 1. Matching Logic & Field Visibility Engine
- **Direct Label & Extra Keyword Search**: Create an evaluation helper matching both translated labels and specific keyword lists/synonyms (Hindi terms, option titles, and technical words) present inside the subpage/tabs.
  ```typescript
  const isFieldVisible = (labelKey: string, extraTerms: string[] = []) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const labelText = t(labelKey).toLowerCase();
    if (labelText.includes(query)) return true;
    return extraTerms.some(term => {
      const termTranslated = t(term).toLowerCase();
      return term.toLowerCase().includes(query) || termTranslated.includes(query);
    });
  };
  ```

### 2. Auto-Aligning & Tab Auto-Switching Protocol (Background Sync)
- When the user types into the search input, run checks over all categories (`appMatch`, `regMatch`, `sysMatch`, etc.).
- If the font-facing category tab contains **zero matches** but other categories possess valid matches, **automatically switch the active category focus** to the first category that has matching components:
  ```typescript
  if (activeTab === "appearance" && !appMatch) {
    if (regMatch) setActiveTab("regional");
    else if (sysMatch) setActiveTab("system");
  } // Repeat symmetry across all other categories
  ```

### 3. Dynamic Match Count Badges on Tab Selectors
- Maintain state or compute boolean matching variables for every elements on screens.
- Expose the exact match count integer for each category (e.g. `appearanceMatchCount`) right beside the Tab Category name in the navigation tag:
  ```typescript
  const appearanceMatchCount = isSearching ? ((showTheme ? 1 : 0) + (showDensity ? 1 : 0) + ...) : 0;
  ```
- Tab buttons/tags **must** render `({matchCount})` badges when `searchQuery` is active.

### 4. Zero Matches Category Warning inside Tabs
- If a category has no matches but others do, do **NOT** show a blank page. Instead, show an elegant custom card illustrating:
  - Icon and headline stating *"No matches in [Current Category]"*.
  - A helper message: *"However, matches are found in other categories. Select a category below to see its matches:"*.
  - Render a horizontal warp block of dynamic, clickable button tags showing the other matching categories equipped with their exact count badges (e.g., `[ Regional (2) ]`, `[ System Core (1) ]`). This preserves navigation context and lets the user jump to matching content instantly.

## 🧹 Project Cleanup Maintenance (CRITICAL)

1. **Deletion Instructions Consistency**
   - When asked to delete or clean files for the project, you MUST clean the unrelated files entirely without asking anything.
   - **EXCEPTION:** You must NEVER delete the `public` folder or its contents under any circumstances.
