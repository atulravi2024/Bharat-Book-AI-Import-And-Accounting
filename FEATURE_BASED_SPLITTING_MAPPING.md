# 🗺️ Feature-Based Splitting Mapping - Phased Roadmap (फीचर-आधारित स्प्लिटिंग मैपिंग - चरणबद्ध रोडमैप)

**English:** This document maps the specific major files from our codebase that are perfectly suited for the mandatory **Feature-Based / Modular Architecture** (Method 1) of `AGENTS.md`. Each selected file is mapped phase-by-phase with its implementation sequence to guarantee smooth integration without regressions.

**Hindi:** यह दस्तावेज़ हमारे कोडबेस के उन विशिष्ट बड़ी फ़ाइलों को मैप करता है जो `AGENTS.md` में बताए गए अनिवार्य **फ़ीचर-आधारित / मॉड्यूलर आर्किटेक्चर** (विधि 1) के लिए बिल्कुल उपयुक्त हैं। प्रत्येक चुनी गई फ़ाइल को बिना किसी रिग्रेशन (Regression) के सुचारू रूप से विभाजित करने के लिए चरण-दर-चरण (Phase-by-phase) कार्यान्वयन अनुक्रम में विभाजित किया गया है।

---

## 🚦 Phase-Wise Division Overview (चरणबद्ध विभाजन अवलोकन)

```text
       ┌────────────────────────────────────────────────────────┐
       │   [START IMPLEMENTATION / कार्यान्वयन की शुरुआत]      │
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  PHASE 1: Administrative Panel & Directories (प्रथम चरण: सेटिंग्स)   │
│  - AdminSettings.tsx & CompanyDirectoryTab.tsx                       │
└───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  PHASE 2: Core Inventory & Items Master (द्वितीय चरण: मास्टर डेटा)   │
│  - ItemsTab.tsx (Form, Tables, Filter Sub-directories)               │
└───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  PHASE 3: Corporate Profile Setup (तृतीय चरण: कॉर्पोरेट प्रोफाइल)   │
│  - FirmSettings.tsx (General, Financial, TAX Fields separation)      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📅 Target Files & Phases (टार्गेट फ़ाइलें और चरण)

The files below are designated to be split strictly using the **Feature-Based / Modular Architecture** structure in a phased sequence:

### 🔒 Phase 1: Administrative Configuration & Directories (प्रथम चरण: प्रशासनिक व्यवस्थाएं)

#### 1. `src/components/Settings/AdminSettings.tsx` (1546 lines)

- **Target Location:** `/src/components/Settings/modular/AdminSettings/`
- **Why it fits perfectly (यह बिल्कुल सही क्यों है?):**
  - **English:** Stacks administrator panel controls, access tokens, and security configurations. A modular setup allows clear division between authentication handlers and the visual forms.
  - **Hindi:** व्यवस्थापक पैनल नियंत्रण, एक्सेस टोकन और सुरक्षा कॉन्फ़िगरेशन को संग्रहीत करता है। एक मॉड्यूलर सेटअप प्रमाणीकरण हैंडलर (Handlers) और दृश्य रूपों (Visual Forms) के बीच सही विभाजन प्रदान करता है।

#### 2. `src/components/Settings/UserSettingsTabs/CompanyDirectoryTab.tsx` (1543 lines)

- **Target Location:** `/src/components/Settings/UserSettingsTabs/modular/CompanyDirectory/`
- **Why it fits perfectly (यह बिल्कुल सही क्यों है?):**
  - **English:** Controls user directories, permissions, logs, and directory modals. This screen fits perfectly into parent-child visual components with implicit state coordination.
  - **Hindi:** उपयोगकर्ता निर्देशिकाओं, अनुमतियों, लॉग्स और डायरेक्टरी मॉडल्स को नियंत्रित करता है। यह स्क्रीन पैरेंट-चाइल्ड विज़ुअल कंपोनेंट्स और स्टेट को अलग-अलग फ़ोल्डर में रखने के लिए सबसे सही उम्मीदवार है।

---

### 📦 Phase 2: Inventory & Items Master (द्वितीय चरण: इन्वेंट्री और आइटम मास्टर)

#### 3. `src/components/Masters/ItemMaster/Tabs/ItemsTab.tsx` (1255 lines)

- **Target Location:** `/src/components/Masters/ItemMaster/modular/ItemsTab/`
- **Why it fits perfectly (यह बिल्कुल सही क्यों है?):**
  - **English:** The items manager possesses dense UI elements (tables, filters, stock entries) and complex modals (add/edit inventory items). Grouping these components and state hooks into a single folder clears massive bloat.
  - **Hindi:** इसमें भारी UI तत्व (तालिकाएँ, फ़िल्टर, स्टॉक प्रविष्टियाँ) और जटिल डायलॉग्स (आइटम्स को जोड़ना/बदलना) हैं। इन सभी घटकों और स्टेट हुक्स को एक फोल्डर में समूहबद्ध करने से मुख्य फ़ाइल का आकार बहुत छोटा हो जाएगा।

---

### 🏢 Phase 3: Corporate Profile Setup (तृतीय चरण: कॉर्पोरेट कंपनी सेटिंग्स)

#### 4. `src/components/Settings/FirmSettings.tsx` (1167 lines)

- **Target Location:** `/src/components/Settings/modular/FirmSettings/`
- **Why it fits perfectly (यह बिल्कुल सही क्यों है?):**
  - **English:** This file contains several distinct configuration sections (General Info, Financial Settings, Advanced/Tax Rules) with their own field behaviors and settings states.
  - **Hindi:** इस फ़ाइल में कई अलग-अलग कॉन्फ़िगरेशन सेक्शन (सामान्य जानकारी, वित्तीय सेटिंग्स, उन्नत/टैक्स नियम) हैं, जिनमें से प्रत्येक के अपने फ़ील्ड व्यवहार और सेटिंग्स स्टेट हैं।

---

## 🏗️ Folder Structure Blueprint (फोल्डर संरचना का ब्लूप्रिंट)

Here is how the target directory structure will be created for each representing Phase:
यह दर्शाता है कि उपरोक्त प्रत्येक फ़ाइल के लिए टार्गेट डायरेक्टरी स्ट्रक्चर कैसे बनाया जाएगा:

```text
src/components/.../[FeatureName]/                (मुख्य फ़ीचर फ़ोल्डर / Core Feature Folder)
 │
 ├── 📄 index.tsx                                (Main Integration Wrapper / सभी टुकड़ों को जोड़ने वाली फ़ाइल)
 ├── 📄 types.ts                                (Shared TypeScript Interfaces / प्रकार और इंटरफ़ेस)
 │
 ├── 📁 hooks/                                  (State and business logic files / केवल लॉजिक फ़ाइलें)
 │    ├── 📄 useFeatureState.ts                 (Core State Management)
 │    └── 📄 useFeatureAPI.ts                   (Api Queries & Mutations)
 │
 └── 📁 views/                                  (Visual layout pieces / केवल डिज़ाइन के टुकड़े)
      ├── 📄 FeatureTableView.tsx               (Visual list grids)
      ├── 📄 FeatureFormModal.tsx               (Add/Edit forms)
      └── 📄 FeatureFilterBar.tsx               (Filters & UI controls)
```

---

## 📊 Phased Split Workflow (चरणबद्ध विभाजन प्रवाह)

The following flowchart and visual maps demonstrate the transition of a targeted giant file into the feature-based folder structure:
निम्नलिखित फ्लोचार्ट और आरेख बड़े एकीकृत फाइल को मॉड्यूलर फोल्डर स्ट्रक्चर में विभाजित करने का तरीका दर्शाते हैं:

### 1. Transition Flowchart (परिवर्तन फ्लोचार्ट)

```text
[ Giant Component File (1000+ Lines) ]
                  │
                  ├──► 1. Group Related Types ───►  [ types.ts ]
                  ├──► 2. Extract Logic State ───►  [ hooks/useFeatureState.ts ]
                  └──► 3. Breakdown UI Panels ───►  [ views/FeatureSubView.tsx ]
                                                           │
                                                           ▼
                                      [ Combined into index.tsx Wrapper ]
```

### 2. Dependency Interaction Diagram (डिपेंडेंसी इंटरैक्शन आरेख)

```text
       ┌───────────────────────────────────────────────────┐
       │                   [ index.tsx ]                   │
       │     (Imports views & passes hook parameters)      │
       └──────────────┬────────────────────────────┬───────┘
                      │                            │
                      ▼                            ▼
       ┌──────────────────────────────┐   ┌──────────────────────────────┐
       │     [ hooks/useState.ts ]    │   │      [ views/SubView.tsx ]   │
       │   - Performs state mutations │   │   - Strictly layouts (JSX)   │
       │   - Handles external APIs    │   │   - Consumes hooks methods   │
       └──────────────┬───────────────┘   └──────────────┬───────────────┘
                      │                            │
                      └──────────────┬─────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │          [ types.ts ]        │
                      │   - Implements safe types    │
                      └──────────────────────────────┘
```
