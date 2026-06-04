# 🗺️ Feature-Based Splitting Targets Specification (फ़ीचर-आधारित विभाजन विनिर्देश)

**English:** This is the current, active memory file containing only the target files that are perfectly suited for and must be split using the **Feature-Based Modular Architecture** defined in `AGENTS.md`. Both targets are currently unsplit in the project, but we are actively executing the split for `ItemsTab.tsx` in this turn.
**Hindi:** यह वर्तमान सक्रिय मेमोरी फ़ाइल है जिसमें केवल वे टार्गेट फ़ाइलें शामिल हैं जो `AGENTS.md` में संकलित **Feature-Based Modular Architecture** के अनुरूप हैं और उसी पद्धति से विभाजित होने के लिए टार्गेट की गई हैं।

---

## 🏗️ Core Standard Architecture Structure

Any target file split here must organize its directories and files strictly in the following structure:
```text
[FeatureFolder]/
 ├── 📄 index.tsx                   (Main Entry Wrapper / विज़ुअल समन्वयक)
 ├── 📄 types.ts                    (Domain & Prop Type Definitions / साझा प्रकार)
 ├── 📁 hooks/                      (State & Business Logic Hook / केवल हुक्स)
 │    └── 📄 use[FeatureName].ts     (Central state and transaction handlers)
 └── 📁 views/                      (Dumb Layout Components / विज़ुअल व्यूज़)
      ├── 📄 [Feature]TableView.tsx (Interactive Grid/Table)
      └── 📄 [Feature]FormModal.tsx (Modals and Input Panels)
```

---

## 🎯 Target Unsplit Files (केवल ये दो मुख्य फ़ाइलें हैं)

The following two files are identified to be split strictly using the Feature-Based Modular Architecture:

### 1️⃣ `src/components/Masters/ItemMaster/Tabs/ItemsTab.tsx` (1255 lines)
* **Status:** Undergoing refactoring in this turn! (इसी चरण में विभाजित किया जा रहा है!)
* **Modular Location:** `/src/components/Masters/ItemMaster/Tabs/ItemsTab/`
* **Splitting Scheme (विभाजन योजना):**
  * `index.tsx`: Coordinates state from the hooks and feeds it into the views.
  * `types.ts`: Typings for individual items, options, lists, and component Props.
  * `hooks/useItemsTab.ts`: Houses all list query terms, search triggers, edit forms state, and deletion operations logic.
  * `views/ItemTable.tsx`: Focuses strictly on table render, language formats (`formatNumber`), action triggers.
  * `views/ItemModal.tsx`: Extracted modal dialog containing collaspsible subsections (Basic Info, Classification, Pricing/Tax, Inventory, E-commerce).

---

### 2️⃣ `src/components/Operations/InventoryEntry/InventoryEntryView.tsx` (1232 lines)
* **Status:** Pending split. (विभाजन के लिए लंबित।)
* **Modular Location:** `/src/components/Operations/InventoryEntry/`
* **Splitting Scheme (विभाजन योजना):**
  * `index.tsx`: Integrates views and hook functions cleanly.
  * `types.ts`: Typings for inventory lines, batch numbers, item dropdown fields.
  * `hooks/useInventoryEntry.ts`: Computes aggregate amounts, taxes, entry totals, and handles CRUD state of inventory rows.
  * `views/HeaderSection.tsx`: Consumes form metadata like date, voucher type, warehouse selecions.
  * `views/ItemsGrid.tsx`: Grid calculation rows listing.
  * `views/TotalsSummary.tsx`: Bill totals displaying widget.
