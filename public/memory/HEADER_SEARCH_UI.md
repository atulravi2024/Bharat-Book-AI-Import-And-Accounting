# Settings Header & Subheader Search UI Architecture

This document tracks the permanent UI implementation patterns, responsive behaviors, and structural guidelines required for building and updating page headers, subheaders, and their internal search controls within the dashboard settings.

## 1. Compact Header and Search Controls
To prevent "too much space" vertical stretching, the page search bar and the layout action controls (like import/export/reset/save) must be grouped thoughtfully.

- **Desktop (sm and up) Layout Strategy**:
  Ensure the search input field and action controls appear on a single, horizontally constrained flex row.
  ```tsx
  <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
  ```

- **Search Bar Dimension Strategies**:
  The search bar container uses `flex-1 min-w-0` to scale dynamically, taking up 100% of the remaining horizontal space alongside the actions toolbar to fit the screen width perfectly.
  Use precise padding (`py-1.5`, `pl-8`, `pr-7`) and constrained text (`text-[11px]`).
  ```tsx
  <div className="flex-1 min-w-0 relative">
     <input className="w-full pl-8 pr-7 py-1.5 bg-gray-50 ... text-[11px] font-bold ..." />
  </div>
  ```

## 2. Action Toolbar Rendering & Buttons
The settings toolbar actions are designed for unified settings imports/exports control. The toolbar includes the following buttons in sequence:
- **Button 1 (Simple Input and Output) [All screen sizes]**: An inline selector dropdown offering `JSON` and `CSV` options, named "Simple Input and Output", acting as the dynamic formatting target that determines the active file types for imports/exports.
- **Button 2 (Import) [All screen sizes]**: Triggers file input upload matching the selected file type format, dynamically dependent on the selection in the "Simple Input and Output" dropdown.
- **Button 3 (Export) [All screen sizes]**: Performs target export downloads matching the context. Below the hood, the export logic is dynamically dependent on what is selected in the "Simple Input and Output" file format picker, but the visual button label does NOT change (it must remain static as "Export", rather than dynamically changing the text label to "JSON" or "CSV").
- **Button 4 (Clear Input) [Responsive - HIDDEN on mobile and tablet/medium screens]**: Full field canvas purge button. Only available on desktop and large screen devices (`lg` and up), completely removed from mobile devices or smaller screen devices (tablet and below).
- **Button 5 (Reset to Default) [All screen sizes]**: Restores factory settings configuration.
- **Button 6 (Save Configuration) [All screen sizes]**: Saves current customization profiles.

- **Desktop (sm and up) Layout Strategy**:
  Ensure the search input field and action controls appear on a single, horizontally constrained flex row.
  ```tsx
  <div className="flex flex-row justify-between items-center gap-2 bg-white dark:bg-gray-900 p-1.5 sm:p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 shadow-sm animate-in fade-in overflow-hidden">
  ```

- **Mobile and Tablet Screen Removal Directive**:
  To protect high density menus and keep the search area clean on smaller views (xs directly up to `1024px` width limits), the "Clear" button is completely removed/hidden on mobile and tablet screens:
  ```tsx
  className="... hidden lg:flex items-center justify-center ..."
  ```
  This is the standard structural rule for avoiding tab or navigation collisions on mobile-class or tablet-class touch pads and preserving space for the search input.

## 3. Avoid Tab Clutter
- **Do not populate search match counts dynamically directly into the text tags** of category toggle tabs. This inflates the size of tab labels.
- The indicator that a tab contains filtered results should be handled by standard filtering logic (hiding tabs or blocks) rather than adding pill badges inside tab navigation bars unless explicitly requested.

## 4. Mobile Responsiveness Directives
- **Padding sizes should shrink**: Standardizes `p-2` to `p-1.5` on the smallest screens (`xs` or mobile standard limit).
- Avoid `flex-col` collapsing when a standard horizontal action bar provides a much denser workspace. Retain horizontal layout via `flex-row items-center justify-between` mixed with wrapping or overflow if needed.

## 5. Dynamic Mobile Search Expansion
To ensure an uninterrupted search experience on compact mobile screens where keyboard interaction takes up significant display real estate:
- **Temporary Toolbar Hiding**: When a user clicks on the search bar (focus), or enters text (active search term), the entire utility button toolbar **MUST temporarily hide** on mobile devices (`hidden sm:flex`).
- **Target Tracking**:
  - The toolbar visibility must be bound to two states: `isSearchFocused` (`onFocus`, `onBlur`) OR `searchTerm` containing text.
  - Doing this expands the `flex-1` search input to cover the entire width of the header row, maximizing typing canvas.
- **Restoration**: When the search bar loses focus and is empty, it reverts to its default view (`flex`), revealing all the utility buttons again.

## 6. Subpage Header Descriptive Text & Tab Space Allocation
To prevent subheader paragraphs from overwhelming the layout and eating up the interface, the following standards are strictly enforced:

- **Ultra-Compact Headline Wording**:
  - The descriptive subtext must be direct, simple, and contain **exactly 5 to 8 words** maximum.
  - Avoid generic or technical word lists (e.g., "Optimize and customize visual grids, responsive layouts, data masks, and theme variables" -> "Customize layouts, themes, and formats").
  - This guarantees perfect human readability at a single glance without semantic fatigue.

- **Screen Width Limitation (30% Max)**:
  - On desktop views and wider viewpoints (`sm:` breakpoint and up), the title and descriptive portion of the subheader **MUST be constrained to `sm:max-w-[30%] shrink-0`**.
  - Restricting the descriptive metadata's footprints ensures that **at least 70%** of the remaining screen width is allocated directly to the tab selection navigation controls, ensuring tabs never compress, drop, wrap, or clutter the subpage workspace.

- **Tab Selection Alignment Directive**:
  - The tab selection container (usually 3 or 4 tabs) must layout and fit perfectly flush against the right-hand alignment edge. Use `justify-end` to align the tab bar from the right.
  - To prevent "extra empty space" on the right side of the tab bar, do not add any trailing margins or padding to the layout that pushes the tabs away from the right border limits.

- **Permanent "BHARAT BOOK SECURE MODE" Prohibited Directive**:
  - The "BHARAT BOOK SECURE MODE" badge block is completely prohibited on settings sub-pages, tab panels, and modal headers. 
  - Never add this badge or indicators anywhere on any screen. If found in legacy code, the entire container block must be completely removed.

- **Tab Selection Scrolling Directive**:
  - The subpage tab container **MUST only use and display an interactive horizontal scrollbar** (with custom styling like `.custom-scrollbar`) for overflow handling.
  - Arrow or chevron swipe buttons for scrolling tabs horizontally are **STRICTLY PROHIBITED** and must be completely omitted.
  - All navigation overflow must be driven purely by natural horizontal scroll, swipe gestures, trackpad wheel translation, or automatic active tab selection focus.

## 7. Premium Styling & Theme Integration (Tabs, Buttons, and Container Backgrounds)
To guarantee complete pixel-perfect alignment across all corporate dashboard settings screens (including User Settings, Firm Settings, Alert Channels, and Security Controls):
- **Outer Header Wrapper Card**:
  - Background styling: `bg-white dark:bg-gray-900 shadow-sm border border-gray-200/60 dark:border-gray-800 rounded-xl` with layout padding `p-3.5`.
- **Button Tab Selection Container**:
  - Styling classes: `bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl gap-1 shadow-sm border border-gray-200/40 dark:border-gray-700/40`.
- **Active Tab Selection Element**:
  - Styling classes: `bg-white dark:bg-gray-750 text-gray-900 dark:text-white shadow-sm scale-[1.01]`.
- **Inactive Tab Selection Element**:
  - Styling classes: `text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-750/30`.
- **Main Content Card Container Wrapper**:
  - Layout & Background: `bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 min-h-[450px]` with space layout rules `space-y-6`.
- **Interactive Collapsible Headers**:
  - Design theme: Styled with deep background/border styling matching the "Firm" accordion blocks perfectly (such as interactive triggers with hover transitions) to ensure standard visual hierarchy.

