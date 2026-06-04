# 🧠 Hybrid & Alternative File Splitting Methods (हाइब्रिड और वैकल्पिक स्प्लिटिंग तरीके)

**English:** While the "Feature-Based Modular Architecture" is the primary mandate, certain extreme files in this ERP project (like Voucher Entry Hooks, Import Pipelines, and Settings Views) require alternative, hybrid, or highly specialized architectural methods. This memory file outlines the **Top 10 Advanced Splitting Methods** tailored specifically for this project.

**Hindi:** हालांकि "फ़ीचर-आधारित मॉड्यूलर आर्किटेक्चर" सबसे मुख्य नियम है, लेकिन इस ERP प्रोजेक्ट की कुछ विशाल फ़ाइलों (जैसे Voucher Entry Hooks, Import Pipelines, और Settings) के लिए वैकल्पिक, हाइब्रिड (मिश्रित), या विशेष तरीकों की आवश्यकता होती है। यह दस्तावेज़ इस प्रोजेक्ट के लिए अनुकूलित 10 सबसे उन्नत स्प्लिटिंग तरीकों को परिभाषित करता है।

---

### 1. Hybrid Feature-Atomic Architecture (हाइब्रिड फीचर-एटॉमिक आर्किटेक्चर)

- **English:** Blends Feature-based routing with Atomic Design. Perfect for massive view files like `SettingsView.tsx` or `AppViewRouter.tsx` with complex repeated UI patterns.
- **Hindi:** फीचर-आधारित फ़ोल्डर्स को "एटॉमिक डिज़ाइन" के साथ मिलाता है। बहुत बड़े UI पैटर्न वाली फ़ाइलों (जैसे `SettingsView`) के लिए एकदम सही है।

#### 📊 Architecture Diagram (आर्किटेक्चर डायग्राम)

```text
┌────────────────────────────────────────────────────────┐
│               [FEATURE NAME / फीचर का नाम]             │
│                 (Example: SettingsView)                │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  [ORGANISM]  │     │  [MOLECULE]  │     │    [ATOM]    │
│  (LAYOUTS)   │     │ (SECTIONS)   │     │  (CONTROLS)  │
│ - MainLayout │     │ - FormRow    │     │ - Button     │
│ - TabsHeader │     │ - CardGroup  │     │ - Toggle     │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

### 2. Headless UI Hooks Pattern (हेडलेस UI हुक्स पैटर्न)

- **English:** Extracts 100% of state, handlers, and logic into a custom hook. The component becomes just an empty shell rendering JSX. Best for `InventoryEntryView.tsx`.
- **Hindi:** 100% स्टेट, फंक्शन और लॉजिक को निकालकर एक "कस्टम हुक" में डालना। मुख्य फ़ाइल केवल एक ढांचा (Shell) बन जाती है। `InventoryEntryView.tsx` के लिए बेहतरीन है।

#### 📊 Flow Diagram (फ्लो डायग्राम)

```text
┌────────────────────────────────────────────────────────┐
│               [VIEW COMPONENT (SHELL)]                 │
│      Renders visual layout and Tailwind styling        │
│          Renders actual HTML elements (JSX)            │
└───────────────────────────┬────────────────────────────┘
                            │
              (Hook output / स्टेट और फंक्शंस)
                            ▼
┌────────────────────────────────────────────────────────┐
│              [CUSTOM HOOK (useLogic.ts)]               │
│     Manages 100% of state (useState, useReducer)       │
│     Manages API fetch calls and validation logic       │
└────────────────────────────────────────────────────────┘
```

---

### 3. Sub-Domain Utility Extraction (सब-डोमेन यूटिलिटी एक्सट्रैक्शन)

- **English:** Moving pure mathematical, validation, or transformation logic from massive Voucher hooks (like `useSalesVoucherLogic.tsx`) into isolated utility functions.
- **Hindi:** `useSalesVoucherLogic.tsx` जैसे विशाल हुक्स से गणितीय या वैलिडेशन लॉजिक को अलग शुद्ध फंक्शन्स (Utility Functions) में ले जाना।

#### 📊 Modular Integration Map (मॉड्यूलर इंटीग्रेशन मैप)

```text
┌──────────────────────────────────────────────────────┐
│           [GIANT CONTROLLER / HOOKS FILE]            │
│   (e.g., useSalesVoucherLogic - Complex and heavy)   │
└──────────────────────────┬───────────────────────────┘
                           │
                 (Delegates Math & Checks)
                           ▼
┌──────────────────────────────────────────────────────┐
│                [DOMAINS UTILITIES]                   │
├──────────────────────────┬───────────────────────────┤
│ - calculateGST()         │ - validateItemStock()     │
│ - parseLedgerBalances()  │ - computeTotalAmounts()   │
└──────────────────────────┴───────────────────────────┘
```

---

### 4. Container & Presenter Separation (कंटेनर-प्रेजेंटर अलगाव)

- **English:** Separates the Business Logic (Container) from the Visuals (Presenter). Ideal when a file is huge just because of mixed API calls and JSX like `AdminSettings.tsx`.
- **Hindi:** बिज़नेस लॉजिक (कंटेनर) को डिज़ाइन (प्रेजेंटर) से अलग करता है। `AdminSettings.tsx` जैसी फाइलों के लिए जहाँ लॉजिक और डिज़ाइन आपस में उलझे हों।

#### 📊 Data Flow Pattern (डेटा फ्लो पैटर्न)

```text
┌──────────────────────────────────────────────────────────┐
│             [CONTAINER COMPONENT (लॉजिक)]                 │
│              - Manages database querying                 │
│              - State mutations & Event handling          │
└────────────────────────────┬─────────────────────────────┘
                             │
                      (Props / डेटा प्रॉप्स)
                             ▼
┌──────────────────────────────────────────────────────────┐
│              [PRESENTER COMPONENT (दिखावट)]              │
│              - Presentational layout                     │
│              - Strictly pure visual HTML JSX             │
└──────────────────────────────────────────────────────────┘
```

---

### 5. Multi-Tab Route Lazy Loading (मल्टी-टैब लेज़ी लोडिंग)

- **English:** Splitting completely distinct tab panels that are not needed on initial load using `React.lazy()` and Suspense. Great for `FirmSettings.tsx`.
- **Hindi:** उन टैब्स या पन्नों को `React.lazy()` का उपयोग करके तोड़ना, जिनकी शुरुआत में कोई आवश्यकता नहीं होती है। `FirmSettings.tsx` के लिए सर्वश्रेष्ठ।

#### 📊 Performance Tree Diagram (परफॉर्मेंस ट्री डायग्राम)

```text
                       ┌─────────────────────────┐
                       │   [MainSettingsView]    │
                       └────────────┬────────────┘
                                    │
                                 (Route)
                                    ┼
       ┌────────────────────────────┼────────────────────────────┐
       ▼ (Lazy Load)                ▼ (Lazy Load)                ▼ (Lazy Load)
┌───────────────┐            ┌───────────────┐            ┌───────────────┐
│  <Suspense>   │            │  <Suspense>   │            │  <Suspense>   │
│  SecurityTab  │            │  FinancialTab │            │  ProfileTab   │
└───────────────┘            └───────────────┘            └───────────────┘
```

---

### 6. Logic Reducer Hub (लॉजिक रिड्यूसर हब)

- **English:** Used when a file has 10+ `useState` hooks, such as `SubStepChoose.tsx` in the Import Pipeline. Combine them into a single centralized Reducer.
- **Hindi:** जब इंपोर्ट पाइपलाइन की `SubStepChoose.tsx` जैसी किसी फाइल में बहुत सारे `useState` हों, तो उन सबको एक केंद्रीकृत 'रिड्यूसर' (Reducer) फाइल में ले जाएं।

#### 📊 Dispatch-Action Flow (डिस्पैच-एक्शन फ्लो)

```text
                 ┌──────────────────────────────────────┐
                 │     [UI Component / व्यू फाइल]       │
                 │   - User fires action (e.g., click)  │
                 └──────────────────┬───────────────────┘
                                    │
                        (Dispatch Action / क्रिया)
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        [STATE REDUCER HUB]                           │
│  - Evaluates action updates in a deterministic tree state            │
│  - Avoids 15+ independent useStates cluttering the file              │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 7. Pure Constant & Config Extraction (प्योर कॉन्फ़िगरेशन एक्सट्रैक्शन)

- **English:** Moving giant drop-down menus, mappings, arrays, or static translations (like `context/translations/hi/common.ts`) into fragmented `.ts` or `.json` config constants.
- **Hindi:** बहुत बड़े मेनू की सूचियों (Arrays) या अनुवाद (Translations) को मुख्य फ़ाइल से हटाकर छोटे और सुरक्षित कॉन्फ़िगरेशन फाइलों में रखना।

#### 📊 Config Loading Diagram (कॉन्फ़िगरेशन लोडिंग डायग्राम)

```text
┌──────────────────────────────┐
│    [MAIN COMPONENT FILE]     │
│  - Executes runtime state    │◄─── (Imports clean statically)
│  - Lightweight JSX structure │
└──────────────────────────────┘
               ▲
               │ (Imports array items / static lists)
┌──────────────────────────────┐
│    [CONFIG CONSTANTS FILE]   │
│  - Long select option lists  │
│  - Multi-language dictionary │
└──────────────────────────────┘
```

---

### 8. Compound Components Pattern (कंपाउंड कंपोनेंट्स पैटर्न)

- **English:** Splitting interconnected visual files (like the massive `CompanyDirectoryTab.tsx`) by creating implicit state-sharing parent-child structures.
- **Hindi:** `CompanyDirectoryTab.tsx` जैसी जटिल और एक-दूसरे से जुड़ी हुई फाइलों को अलग करने का तरीका जहाँ पैरेंट और चाइल्ड स्टेट शेयर करते हैं।

#### 📊 Implicit State Diagram (इम्पलिसिट स्टेट डायग्राम)

```text
┌───────────────────────────────────────────────┐
│              [Directory.Wrapper]              │
│        - Controls overall selection state     │
└───────────────────────┬───────────────────────┘
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
┌───────────┐     ┌───────────┐     ┌───────────┐
│  Table    │     │  Filters  │     │  Modals   │
│ Directory │     │ Directory │     │ Directory │
└───────────┘     └───────────┘     └───────────┘
```

---

### 9. Context Provider Isolation (कॉन्टेक्स्ट प्रोवाइडर आइसोलेशन)

- **English:** When an import step is hundreds of lines just due to prop-drilling within the 11-step pipeline, split it by extracting local Context Providers.
- **Hindi:** जब 11-चरण वाली इंपोर्ट पाइपलाइन में सिर्फ प्रॉप्स (Props) पास करने के कारण कोड बहुत बड़ा हो जाए, तो उसे सीमित एरिया के 'कॉन्टेक्स्ट प्रोवाइडर' में तोड़ दें।

#### 📊 Sandbox State Partition (सैंडबॉक्स स्टेट पार्टिशन)

```text
┌──────────────────────────────────────────────────────────────────┐
│                    [ImportPipelineProvider]                      │
│            - Shares import schema context and records             │
└────────────────────────────────┬─────────────────────────────────┘
      ┌──────────────────────────┼──────────────────────────┐
      ▼                          ▼                          ▼
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│ Step1_Upload │           │ Step2_Map    │           │ Step3_Verify │
│ (Uses context)│          │ (Uses context)│          │ (Uses context)│
└──────────────┘           └──────────────┘           └──────────────┘
```

---

### 10. Abstract Factory Pattern (एब्सट्रैक्ट फैक्ट्री पैटर्न)

- **English:** Reducing giant `switch` statements or huge conditional component rendering (like `MasterView.tsx`) into modular factory functions.
- **Hindi:** `MasterView.tsx` जैसी विशाल फाइलों में उपयोग होने वाले बड़े `switch` या `if-else` स्टेटमेंट को फैक्ट्री पैटर्न का उपयोग करके छोटे-छोटे टुकड़ों में बाँटना।

#### 📊 Dynamic Resolution Tree (डायनेमिक रेजोल्यूशन ट्री)

```text
                       ┌─────────────────────────┐
                       │     [MasterView]        │
                       └────────────┬────────────┘
                                    │
                         (Resolves type dynamically)
                                    ▼
                       ┌─────────────────────────┐
                       │   [MasterViewFactory]   │
                       └────────────┬────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │     [ItemMasterView]   │      │   [LedgerMasterView]   │
       └────────────────────────┘      └────────────────────────┘
```

---

## 🧐 Quick Decision Guide (प्रोजेक्ट के लिए निर्णय गाइड)

| File Pattern (फाइल का प्रकार) | Recommended Method (अनुशंसित विधि) | Example Target (उदाहरण) | Description / विवरण |
| :--- | :--- | :--- | :--- |
| **Massive UI with repeated patterns** | #1 Hybrid Feature-Atomic | `SettingsView.tsx` | Highly modular layout with atom pieces |
| **Forms with 10+ useStates** | #6 Logic Reducer Hub | `SubStepChoose.tsx` | Reducer handling many clean events |
| **Giant 1000+ line Logic Hooks** | #3 Sub-Domain Utility | `useSalesVoucherLogic.tsx` | Math & validation moved to helper functions |
| **Translations & Static Lists** | #7 Constant Extraction | `hi/common.ts` | Static arrays extracted to configuration |
| **Prop-Drilling in Pipelines** | #9 Context Provider Isolation | `Step2Correction.tsx` | Direct hook consumption without drill-down |
