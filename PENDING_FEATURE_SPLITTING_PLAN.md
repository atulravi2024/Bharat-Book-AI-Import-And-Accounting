# 🎯 Bharat Book AI ERP - Pending Feature-Based Splitting Plan
(चरण-दर-चरण फीचर-आधारित फ़ाइल विभाजन विस्तृत ब्लूप्रिंट)

This document maps out the precise, compliant plan to split the remaining monolithic large files in the project. It adheres strictly to the **Feature-Based / Modular Architecture** mandated in **`AGENTS.md`**, ensuring that all component logic, UI, and rendering subsystems are co-located, fully typed, and isolated.

---

## 🚫 Why the Existing `FILE_SPLITTING_TARGETS.md` is Incompatible
The previous roadmap (`FILE_SPLITTING_TARGETS.md`) suggests a variety of general patterns (e.g., "Multi-Tab Route Lazy Loading", "Slot Patterns", "Container-Presenter Pattern", or "Headless UI hooks") without enforcing unified domain folder structures. 

Under the **`AGENTS.md`** rulebook, those generic patterns are **incompatible**. We must strictly adopt the **Feature-Based / Modular Architecture** for all splitting, exactly as has been successfully executed for `AdminSettings` and `CompanyDirectory`.

### 📐 The Co-location Target Structure
Every modularized component directory must contain:
1. 📄 **`index.tsx`** — Standard entry point. Orchestrates views and hooks; binds properties together.
2. 📄 **`types.ts`** — Isolated type interfaces, states, and action types. Prevents circular dependencies.
3. 📁 **`hooks/`** — Standardized React hooks managing custom logic, searching, computations, and API/Local state.
4. 📁 **`views/`** — Small, granular presentational sub-components optimized for layout, color, and responsiveness.

---

## 📅 The Two Pending Monolithic Targets (दो अनिर्मित स्प्लिटिंग लक्ष्य)

These two files are currently monolithic, contain massive arrays/configurations, and have not yet been refactored under the correct folder hierarchy of the project.

---

### 1️⃣ Target File: `src/components/Settings/HelpSettings.tsx` (~1409 lines)
**Scope:** Contains massive static arrays with educational guides, tax standards, keyboard shortcuts, contact support links, and rendering views all inside a single file.

#### 🏗️ Target Modular Directory: `/src/components/Settings/HelpSettings/`

The monolithic file will be divided into the following layout:

```text
src/components/Settings/HelpSettings/
 ├── 📄 index.tsx                    (Main Router: Coordinate categories & state)
 ├── 📄 types.ts                     (Types like Article, Tag, SupportContact, etc.)
 ├── 📁 hashConstants/               (Folder for pure static constants to prevent file bloat)
 │    └── 📄 helpArticles.ts         (Extracts the massive static ARTICLES array of guides)
 ├── 📁 hooks/
 │    └── 📄 useHelpSearch.ts        (Logic for live searching, tagging, categories selection)
 └── 📁 views/
      ├── 📄 HelpSearchHeader.tsx    (Dense search bar with instant autocomplete)
      ├── 📄 CategoryFilterBar.tsx   (Horizontal scroll guide for choosing topics)
      ├── 📄 HelpArticlesList.tsx    (List view presenting matching articles and search highlights)
      ├── 📄 ArticleDetailModal.tsx   (Full-screen slide-over panel displaying documentation)
      └── 📄 SupportContactCard.tsx  (Premium support ticketing drawer & interactive links)
```

---

### 2️⃣ Target File: `src/components/Masters/ItemMaster/Tabs/ItemsTab.tsx` (~1255 lines)
**Scope:** Holds core item inventories, add/edit item form flows, custom GST classification rates, item image uploading actions, stock calculation grids, and CSV table actions in one bulk file.

#### 🏗️ Target Modular Directory: `/src/components/Masters/ItemMaster/modular/Items/` (or `/Tabs/ItemsTab/`)

The monolithic spreadsheet and form logic will be split into:

```text
src/components/Masters/ItemMaster/modular/Items/
 ├── 📄 index.tsx                    (Main Controller: Renders items grid or individual forms)
 ├── 📄 types.ts                     (Declarations for Item, SKU, StockGroup, GSTConfig)
 ├── 📁 hooks/
 │    ├── 📄 useItemsData.ts         (State hook for fetching, creating, updating, and exporting Items)
 │    └── 📄 useStockCalculators.ts  (Pure mathematical helpers for dynamic pricing, margin, and weight metrics)
 └── 📁 views/
      ├── 📄 ItemsTableList.tsx      (Dense responsive inventory grid with filter headers and sorting)
      ├── 📄 ItemFormDrawer.tsx      (Unified side-drawer for creating and editing single stock item records)
      ├── 📄 GSTClassificationView.tsx (Segment for setting HSN code, tax category, tax standard rate details)
      ├── 📄 StockPricingDetails.tsx  (Section coordinating minimum buffer quantities, selling pricing, purchase pricing)
      └── 📄 BulkCSVImportExport.tsx  (CSV upload mapping controls for item masters)
```

---

## 🛠️ Execution Strategy (कार्यान्वयन रणनीति)

When editing or split operations commence, devs must follow the **Prerequisite Pattern**:
1. Create `types.ts` first. Define strict TypeScript types so that views and hooks do not introduce circular inputs.
2. Extract the computational/data logic in `hooks/` to isolate all mathematical or state handlers.
3. Build responsive small rendering views inside `views/`.
4. Tie them up inside the primary parent `index.tsx`.
5. Update file references in route setups, run `npm run lint` and `npm run build` to verify transition safety.
