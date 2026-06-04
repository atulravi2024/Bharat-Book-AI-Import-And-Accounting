const fs = require('fs');

const fileContent = `# फ़ाइल स्प्लिटिंग मेमोरी (File Splitting Memory)

यह दस्तावेज़ प्रोजेक्ट की बड़ी फ़ाइलों (विशालकाय फ़ाइलों) की पहचान करने और उन्हें छोटे, प्रबंधनीय टुकड़ों में बाँटने (स्प्लिट करने) के लिए एक रणनीतिक गाइड है।

## 📊 बड़ी फ़ाइलों की सूची (Files Needing to be Split)

वर्तमान में, निम्नलिखित फ़ाइलों में बहुत अधिक कोड (लगभग 1000+ लाइन्स) है और उन्हें स्प्लिट करने की आवश्यकता है:

1. \`src/components/Settings/AdminSettings.tsx\` (1546 lines)
2. \`src/components/Settings/UserSettingsTabs/CompanyDirectoryTab.tsx\` (1543 lines)
3. \`src/components/Settings/SettingsView.tsx\` (1504 lines)
4. \`src/components/Settings/HelpSettings.tsx\` (1409 lines)
5. \`src/context/translations/hi/common.ts\` (1330 lines)
6. \`src/components/Operations/VoucherEntry/vouchers/ReceiptVoucher/hooks/useReceiptVoucherLogic.tsx\` (1312 lines)
7. \`src/components/Operations/VoucherEntry/vouchers/PaymentVoucher/hooks/usePaymentVoucherLogic.tsx\` (1311 lines)
8. \`src/components/Operations/VoucherEntry/vouchers/ContraVoucher/hooks/useContraVoucherLogic.tsx\` (1311 lines)
9. \`src/components/Operations/VoucherEntry/vouchers/JournalVoucher/hooks/useJournalVoucherLogic.tsx\` (1302 lines)
10. \`src/components/Masters/ItemMaster/Tabs/ItemsTab.tsx\` (1255 lines)
11. \`src/components/Operations/VoucherEntry/vouchers/SalesVoucher/hooks/useSalesVoucherLogic.tsx\` (1241 lines)
12. \`src/components/Operations/InventoryEntry/InventoryEntryView.tsx\` (1232 lines)
13. \`src/components/Operations/VoucherEntry/vouchers/PurchaseVoucher/hooks/usePurchaseVoucherLogic.tsx\` (1229 lines)
14. \`src/components/Operations/VoucherEntry/VoucherPreview.tsx\` (1216 lines)
15. \`src/components/Settings/FirmSettings.tsx\` (1167 lines)
16. \`src/components/Operations/Import/step1/SubStepChoose.tsx\` (1134 lines)

---

## 🏆 टॉप 10 फ़ाइल स्प्लिटिंग मेथड्स (Top 10 File Splitting Methods)

### 1. फ़ीचर-आधारित मॉड्यूलर आर्किटेक्चर (Feature-Based Modular Architecture)
- **विवरण:** यह सबसे प्रमुख तरीका है जहाँ एक फ़ीचर (जैसे ItemsTab) से जुड़े सभी UI, हुक्स, और टाइप्स को उसी के एक अलग फोल्डर में रखा जाता है।
- **सबसे अच्छा क्यों है?** यह प्रोजेक्ट को साफ़ रखता है। जब आपको कोई बदलाव करना होता है, तो उसी फोल्डर में सब कुछ मिल जाता है।
- **कहाँ उपयोग करें:** \`ItemsTab.tsx\`, \`AdminSettings.tsx\`, \`SettingsView.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[विशालकाय फीचर फाइल] 
       │
       ▼
[फीचर की पहचान करें]
       │
       ▼
[फीचर के नाम का एक फोल्डर बनाएं]
       │
       ├─► [UI को Views/ फोल्डर में अलग करें] ───────┐
       │                                             │
       ├─► [लॉजिक को Hooks/ फोल्डर में अलग करें] ────┼──► [index.tsx में एक साथ लाएं]
       │                                             │
       └─► [प्रकार/इंटरफेस को types.ts में डालें] ───┘
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
┌─────────────────────────┐
│       index.tsx         │ (Main Container)
└───────────┬─────────────┘
            │
      ┌─────┼─────┐
      │     │     │
   ┌──▼──┐┌─▼─┐┌──▼───┐
   │Views││Hooks││types.ts│
   └─────┘└───┘└──────┘
\`\`\`

### 2. कस्टम हुक्स एक्सट्रैक्शन (Custom Hooks Extraction)
- **विवरण:** बड़ी फ़ाइलों में मौजूद useState, useEffect और डेटा फेचिंग लॉजिक को निकालकर अलग \`useSomething.ts\` फाइलों में रखना।
- **सबसे अच्छा क्यों है?** लॉजिक को UI से अलग करता है और कोड को फिर से इस्तेमाल करने योग्य बनाता है।
- **कहाँ उपयोग करें:** \`InventoryEntryView.tsx\`, \`useSalesVoucherLogic.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[UI घटक + लॉजिक]
       │
  (लॉजिक अलग करें)
       │
       ├─► [useCustomHook.ts] (UI में इस्तेमाल करें)
       │         ▲
       ▼         │ (रिटर्न डेटा)
[साफ UI Component]
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
[UI Component] ◄─── (Provide Data/Methods) ───► [Custom Hook]
                                                   │
                                                   ▼
                                           [State/API Store]
\`\`\`

### 3. सब-कम्पोनेंट एक्सट्रैक्शन (Sub-Component Extraction)
- **विवरण:** एक बड़े UI घटक के छोटे विज़ुअल हिस्सों (जैसे फॉर्म सेक्शन, मोडल्स, टेबल्स) को अलग-अलग फ़ाइलों में तोड़ना।
- **सबसे अच्छा क्यों है?** React में रेंडरिंग बेहतर होती है और कोड पढ़ने में आसान लगता है।
- **कहाँ उपयोग करें:** \`VoucherPreview.tsx\`, \`CompanyDirectoryTab.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
                      [MegaComponent (बड़ा घटक)]
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
    [FormSection]          [ModalSection]          [TableSection]
         │                       │                       │
         ▼                       ▼                       ▼
[अलग फाइल: Form.tsx]    [अलग फाइल: Modal.tsx]   [अलग फाइल: Table.tsx]
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
[Parent Component]
      ├─► [Child Component 1: Form]  ◄── (Props)
      ├─► [Child Component 2: Table] ◄── (Props)
      └─► [Child Component 3: Modal] ◄── (Props)
\`\`\`

### 4. कंटेनर / प्रेज़ेंटर पैटर्न (Container / Presenter Pattern)
- **विवरण:** एक कंपोनेंट सिर्फ डेटा तैयार करता है (Container) और दूसरा उसे स्क्रीन पर दिखाता है (Presenter)।
- **सबसे अच्छा क्यों है?** टेस्टिंग और डिज़ाइन में बदलाव करना आसान हो जाता है।
- **कहाँ उपयोग करें:** \`AdminSettings.tsx\`, \`FirmSettings.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[API/State Data]
       │
       ▼
[Container Component (डेटा तैयार करता है)]
       │
       ▼ (Passing Props)
       │
[Presenter Component (UI दिखाता है)]
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
┌───────────────────────┐         ┌────────────────────────┐
│ Container Component   │         │ Presenter Component    │
│ - fetchData()         │────►────│ - renderUI()           │
│ - handleEvents()      │(Props)  │ - displayData          │
└───────────────────────┘         └────────────────────────┘
\`\`\`

### 5. मल्टी-टैब और अकॉर्डियन स्प्लिटिंग (Multi-Tab/Accordion Splitting)
- **विवरण:** यदि एक पेज में कई टैब हैं, तो प्रत्येक टैब का कंटेंट एक अलग फ़ाइल में होना चाहिए।
- **सबसे अच्छा क्यों है?** भारी पेजों को साफ़ करता है और Lazy Loading करने में मदद करता है।
- **कहाँ उपयोग करें:** \`SettingsView.tsx\`, \`HelpSettings.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
                 [MainView (मुख्य पेज)]
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   [Tab 1 User]     [Tab 2 Admin]     [Tab 3 Settings]
         │                 │                 │
         ▼                 ▼                 ▼
   [UserTab.tsx]    [AdminTab.tsx]    [SettingsTab.tsx]
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
■ Main Wrapper (10%)
████ Tab 1: Users (30%)
████ Tab 2: Firm (30%)
████ Tab 3: Security (30%)
\`\`\`

### 6. यूटिलिटी फ़ंक्शन्स एक्सट्रैक्शन (Utility Functions Extraction)
- **विवरण:** शुद्ध जावास्क्रिप्ट फ़ंक्शन्स (जैसे मैथ कैलकुलेशन, डेट फॉर्मेटिंग) को \`utils/\` फोल्डर में डालना।
- **सबसे अच्छा क्यों है?** इन फ़ंक्शन्स को कहीं भी इम्पोर्ट और टेस्ट किया जा सकता है।
- **कहाँ उपयोग करें:** विशालकाय हुक्स जैसे \`useReceiptVoucherLogic.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[Heavy Logic Component] ──┐
                          ▼
              (Extract Pure JS Function)
                          │
                          ▼
              [Utils Folder: mathCalc.ts]
                          ▲
                          │ (Imports)
[Other Feature Component] ┘
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
┌────────────────────┐
│ Utils Directory    │◄────┐
│ - calculateTax()   │     │ (Uses)
│ - formatDate()     │     │
└────────────────────┘     │
        ▲                  │
        │ (Uses)           │
[Feature A Component] [Feature B Component]
\`\`\`

### 7. टाइप और इंटरफ़ेस सेपरेशन (Type & Interface Separation)
- **विवरण:** सभी TypeScript \`interface\` और \`type\` को एक \`types.ts\` फ़ाइल में खिसकाना।
- **सबसे अच्छा क्यों है?** अनचाही लाइनों को हटाता है और सर्कुलर डिपेंडेंसी से बचाता है।
- **कहाँ उपयोग करें:** किसी भी बड़ी फ़ाइल में।

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[Component.tsx (With mixed Types)]
               │
      (Types को अलग करें)
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
[Clean Component] ►► [types.ts]
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
[COMPONENTS] ──┐
               │
[HOOKS] ───────┼──► [ TYPES LIST ]
               │
[UTILS] ───────┘
\`\`\`

### 8. कॉन्स्टेंट्स और कॉन्फ़िग एक्सट्रैक्शन (Constants & Config Extraction)
- **विवरण:** स्टैटिक डेटा, ऐरे, मेनू लिस्ट, और कॉन्फ़िगरेशन को \`constants.ts\` में ले जाना।
- **सबसे अच्छा क्यों है?** मुख्य कोड को केवल लॉजिक चलने देता है और डेटा को साफ़ रखता है।
- **कहाँ उपयोग करें:** \`HelpSettings.tsx\`, \`common.ts\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[Hardcoded Arrays/Lists]
           │
       (Extract)
           │
           ▼
[Constants File: constants.ts] ◄── [Component] (Read data)
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
┌──────────────────┐
│ Constants File   │
│ - MENU_OPTIONS   │◄─── (Imports List) ──── [Render Components]
│ - API_ENDPOINTS  │
└──────────────────┘
\`\`\`

### 9. स्टेट मशीन पैटर्न या रिड्यूसर (State Machine / useReducer)
- **विवरण:** जब कई \`useState\` एक साथ उलझ जाएं, तो उन्हें \`useReducer\` से मैनेज करना।
- **सबसे अच्छा क्यों है?** जटिल स्टेट्स (Complex State) को सुरक्षित और भरोसेमंद बनाता है।
- **कहाँ उपयोग करें:** \`VoucherPreview.tsx\`, \`InventoryEntryView.tsx\`

**फ्लोचार्ट (Flowchart):**
\`\`\`text
[Too Many useStates (उलझी हुई स्थिति)]
               │
    (Convert to useReducer)
               │
     ┌─────────┴─────────┐
     ▼                   ▼
[Define Actions] ◄► [Define Reducer Flow]
     │                   │
     └─────────┬─────────┘
               ▼
   [State Updates Predictably]
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
[*] ──► (INIT)
          │
  (fetch) ▼
      (LOADING) ─────── 
          │           │ (error)
(success) ▼           ▼
      (SUCCESS)    (ERROR) ──► (retry) ──► (INIT)
          │
         [*]
\`\`\`

### 10. सर्कुलर इंपोर्ट फिक्सिंग (Circular Import Splitting/Fixing)
- **विवरण:** उन फ़ाइलों को अलग करना जो एक दूसरे पर निर्भर होने की वजह से लूप बना रही हैं।
- **सबसे अच्छा क्यों है?** ऐप के क्रैश और बिल्ड एरर्स को रोकता है।
- **कहाँ उपयोग करें:** हुक्स और टाइप्स के बीच।

**फ्लोचार्ट (Flowchart):**
\`\`\`text
   [File A] ◄──► [File B]  (Circular Dependency Loop)
       │            │
       ▼            ▼
       └─────►◄─────┘
         [Shared Types/Intermediate File] (Fix)
\`\`\`

**स्ट्रक्चर डायग्राम (Chart Diagram):**
\`\`\`text
[File A] ───► [Shared Types Folder] ◄─── [File B]
 (No Circular Dependency Loop here anymore)
\`\`\`

---

## 📁 आदर्श फोल्डर स्ट्रक्चर (Ideal Folder Structure)

यह फोल्डर स्ट्रक्चर मानवा-अनुकूल (human easy understanding) और फीचर-आधारित मॉड्यूलर आर्किटेक्चर (Feature-Based Modular Architecture) पर आधारित है। इसे किसी भी विशालकाय फाइल को स्प्लिट करते समय टेम्पलेट के रूप में इस्तेमाल किया जाना चाहिए।

### 📌 फोल्डर स्ट्रक्चर डायग्राम (Directory Tree Diagram)

\`\`\`text
src/components/FeatureName/                     (मुख्य फीचर फोल्डर)
 │
 ├── 📄 index.tsx                               (मुख्य एंट्री पॉइंट जो सबको जोड़ता है)
 ├── 📄 types.ts                                (TypeScript प्रकार और इंटरफ़ेस)
 ├── 📄 constants.ts                            (स्टैटिक डेटा, मेनू ऑप्शंस, आदि - वैकल्पिक)
 │
 ├── 📁 components/                             (यदि इस फीचर के अंदर छोटे सब-कंपोनेंट्स हैं)
 │    ├── 📄 CustomButton.tsx
 │    └── 📄 FeatureHeader.tsx
 │
 ├── 📁 hooks/                                  (लॉजिक, स्टेट और एपीआई कॉल्स)
 │    ├── 📄 useFeatureLogic.ts
 │    └── 📄 useFeatureForm.ts
 │
 └── 📁 views/                                  (विजुअल / UI टुकड़े)
      ├── 📄 TabOneView.tsx
      ├── 📄 TabTwoView.tsx
      └── 📄 ModalView.tsx
\`\`\`

### 💡 इस स्ट्रक्चर के फायदे (Why this structure?)
1. **ढूंढने में आसानी (Easy to Find):** किसी भी फीचर में बदलाव करने के लिए आपको पूरी ऐप में नहीं भटकना पड़ता। सब कुछ एक ही फोल्डर में रहता है।
2. **स्केलेबिलिटी (Scalability):** जब कोडबेस बढ़ता है, तो फाइलें एक-दूसरे में नहीं उलझती हैं।
3. **टीम वर्क (Team Work):** नया डेवलपर भी सिर्फ फोल्डर का नाम देखकर समझ सकता है कि कौन सा कोड कहाँ है।
4. **सर्कुलर डिपेंडेंसी से बचाव:** \`types.ts\` को सबसे निचले स्तर पर रखने से अन्य फाइलें आसानी से टाइप इम्पोर्ट कर सकती हैं बिना लूप बनाए।

### 🛠 फ्लोचार्ट: स्प्लिटिंग प्रक्रिया का निर्णय (Splitting Process Decision Flow)

\`\`\`text
[Start: फाइल स्प्लिट करें]
        │
        ▼
[Step 1: नया फीचर फोल्डर बनाएं]
        │
        ▼
[Step 2: Types को types.ts में डालें]
        │
        ▼
[Step 3: UI को views/ फोल्डर में ले जाएँ]
        │
        ▼
[Step 4: लॉजिक को hooks/ में डालें]
        │
        ▼
[Step 5: index.tsx में सब कुछ इम्पोर्ट करें और जोड़ें]
        │
        ▼
[End: स्प्लिटिंग पूरी हुई!]
\`\`\`
`

fs.writeFileSync('FILE_SPLITTING_MEMORY_HINDI.md', fileContent);
console.log('Done rewriting file for ASCII support.');
