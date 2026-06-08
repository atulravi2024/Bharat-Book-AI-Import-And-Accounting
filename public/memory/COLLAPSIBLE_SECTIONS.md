# Collapsible & Accordion Sections Architecture

This document tracks the permanent UX/UI implementation standards, animation definitions, and code structures required for building header accordions and collapsible group containers within settings grids, matching the design system established on the **Firm Details** subpage.

---

## 1. Core Collapsible State & Search Visibility Logic

Collapsible containers must support both standalone toggle actions and expansion override properties when a search term filter is active:

1. **State Ownership**:
   - The expanded state is owned by a parent state hook (such as `activeAccordion` inside `useFirmSettings` or local page state) as a nullable string indicating the currently active accordion ID (`string | null`).
   - **Rule 1: Collapse Mode by Default (MANDATORY)**: Accordion states MUST be initialized to `null`. No section under any circumstances should start in an expanded state on initial load. All sections must remain quietly collapsed until called upon or in search context of active matches.
   - Only a single accordion section must be active (expanded) at any given time. Clicking a closed section automatically collapses any pre-existing active sections first.
   
2. **Search Integration Override (`isExpanded` Rule)**:
   - When a search term is present, all collapsible accordions containing at least one matching field **MUST override collapse states to expand and display content automatically**.
   - This prevents search matches from being hidden inside closed panels.

```tsx
const isExpanded = activeAccordion === "sectionKey" || (Boolean(searchTerm) && isSectionVisible("sectionKey"));
```

---

## 2. Structural JSX Design & Edge-to-Edge Constraints

The layout of any collapsible panel contains three key sections wrapped inside a fluid space optimizing structure without unnecessary margins or double padding cards:

- **Rule 2: Edge-to-Edge Horizontal Width Constraint (MANDATORY)**:
  - The accordion elements must utilize 100% of the horizontal screen canvas padding, eliminating redundant empty outer margin blocks on both mobile and widescreen desktops.
  - To prevent squeezing or indentation within cards, the wrapping parent containers **MUST NOT** include inner horizontal padding lines (e.g., avoid `p-6` or `p-8` on the parent container box).
  - This allows trigger blocks and content frames to run seamlessly from the absolute left border to the absolute right border of the device viewport sizes.
- **Border Truncation**: Panels are separated by clean, horizontal line rules (`border-t border-gray-100 dark:border-gray-805`).
- **Interactive Header row**:
  - Contains a leading themed icon inside a small decorative badge (`rounded-lg p-1.5` with blue background accents or relevant category-based colors).
  - A dense heading label styled with `text-sm font-black uppercase tracking-widest` for strong semantic boundaries.
  - A trailing indicator icon (`ChevronDown` when collapsed, `ChevronUp` when expanded) to convey affordance.
  - Generous clicking pads (`p-6 sm:px-8`) matching touch target guidelines.

```tsx
<div className="border-t border-gray-100 dark:border-gray-808 overflow-hidden">
  {/* Interactive Trigger Row */}
  <button
    onClick={() => toggleAccordion("sectionKey")}
    className="w-full flex items-center justify-between p-6 sm:px-8 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <Icon className="w-4 h-4" />
      </span>
      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
        {t("Section Header Name")}
      </h3>
    </div>
    {isExpanded ? (
      <ChevronUp className="w-5 h-5 text-gray-400" />
    ) : (
      <ChevronDown className="w-5 h-5 text-gray-400" />
    )}
  </button>
  
  {/* Animated Expansion Slot */}
  <AnimatePresence>
    {isExpanded && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div className="form-grid p-6 sm:px-8 gap-6 bg-white dark:bg-gray-800 text-left">
           {/* Section Fields and Child Controls Go Here */}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

---

## 3. The Judiciary & Jurisdiction Section Standard

- **The Judiciary (Legal Remarks & Jurisdiction)**:
  - This section (mapped under `LegalRemarksSection` and the `legal Remarks` tab) governs highly delicate judicial parameters such as `Jurisdiction City (Legal)` and `Notes / Description`.
  - It MUST comply completely with the **Collapse Mode by Default** standard (initializing with `null`), as well as utilizing **full-width edge-to-edge layout constraints** to make it clean, responsive, and prominent across all platforms.

---

## 4. Motion Transition Blueprint

To maintain rendering fluidity without cause page content to jump abruptly when a user collapses and expands tabs:

- **Library**: `framer-motion` (or `motion/react`).
- **Required motion properties on `<motion.div>`**:
  - `initial={{ height: 0, opacity: 0 }}`
  - `animate={{ height: "auto", opacity: 1 }}`
  - `exit={{ height: 0, opacity: 0 }}`
  - `className="overflow-hidden"` (CRITICAL: prevents items from bleeding out of margins while resizing heights)
- **Transition curves**: Use linear, soft, or default system ease durations (around `200ms` up to `300ms`) to provide natural visual rhythm.

---

## 4. UI Polish & Typography Accents

- **Background Variation**: Use an off-white background (`bg-gray-50/50`) on trigger buttons to contrast heavily against pure form backgrounds inside the expanded frame (`bg-white` or dark mode equivalents).
- **Text Controls**: Input fields and dropdown elements inside the form grid should use `bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border-none font-bold text-gray-700 dark:text-gray-200` to respect the dense, technical ERP layout.
- **Micro-responsive Paddings**: Reduce absolute container margins on small viewports while maintaining robust desktop margins to prevent cramped displays.
