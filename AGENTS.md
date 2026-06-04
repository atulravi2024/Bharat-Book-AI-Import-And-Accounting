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

3. **Code Splitting & Architecture Method (CRITICAL)**
   - When splitting any large file or folder structure, you **MUST** default to using the **Feature-Based / Modular Architecture** by default.
   - If a folder structure is not suitable for this method, or if the method is not practical in a specific scenario, you **MUST PAUSE** and provide the user with the **THREE best alternative architecture options** for that specific situation.
   - You must wait for the user to decide which of those three recommendations to follow before making sweeping architectural changes.
   - *Feature-Based Structure Example*: Group all related files (Hooks, Views/UI, Types) under the feature's dedicated folder rather than scattering them across global folders.
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

## 🧹 Project Cleanup Maintenance (CRITICAL)

1. **Deletion Instructions Consistency**
   - When asked to delete or clean files for the project, you MUST clean the unrelated files entirely without asking anything.
   - **EXCEPTION:** You must NEVER delete the `public` folder or its contents under any circumstances.
