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
- **Button 1 (Format Selector) [All screen sizes]**: An inline selector dropdown offering `JSON` and `CSV` options, acting as the dynamic formatting target for active imports/exports.
- **Button 2 (Import) [All screen sizes]**: Triggers file input upload matching the selected format.
- **Button 3 (Export JSON/CSV) [All screen sizes]**: Performs target export downloads matching the context.
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

