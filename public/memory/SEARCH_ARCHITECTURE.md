# 🔍 Comprehensive Search & Filtering Architecture (CRITICAL/PERMANENT)

The search functionality across the application (including Subpages, Settings, Dashboards, and global searches) represents a core user experience pillar. When implementing, maintaining, or extending any Search Bar or filtering feature, you **MUST** strictly adhere to the exact background search, dynamic switching, and category matching behavior outlined below. This section also serves as the foundational blueprint for all future search-related logic.

### 1. Matching Logic & Field Visibility Engine (The Core)
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
- Maintain state or compute boolean matching variables for every element on the screen.
- Expose the exact match count integer for each category (e.g. `appearanceMatchCount`) right beside the Tab Category name in the navigation tag:
  ```typescript
  const appearanceMatchCount = isSearching ? ((showTheme ? 1 : 0) + (showDensity ? 1 : 0) /* + ... */) : 0;
  ```
- Tab buttons/tags **must** render `({matchCount})` badges when `searchQuery` is active.

### 4. Zero Matches Category Warning inside Tabs
- If a category has no matches but others do, do **NOT** show a blank page. Instead, show an elegant custom card illustrating:
  - Icon and headline stating *"No matches in [Current Category]"*.
  - A helper message: *"However, matches are found in other categories. Select a category below to see its matches:"*.
  - Render a horizontal warp block of dynamic, clickable button tags showing the other matching categories equipped with their exact count badges (e.g., `[ Regional (2) ]`, `[ System Core (1) ]`). This preserves navigation context and lets the user jump to matching content instantly.

### 5. Field-Level Filtering & Masking Wrapper
- You **MUST** dynamically wrap each form field block (including its label, input, and description) directly with the `isFieldVisible(...)` evaluation helper.
- If the field does not match the active search query, the physical component **must** be excluded from the React node tree entirely. This creates the exact "filtered fields" visual behavior, fulfilling the basic core functionality of a settings search.
  ```tsx
  {isFieldVisible("Company Name", ["Brand", "Legal Name"]) && (
    <div className="space-y-2">
      <label className="form-label">{t("Company Name")}</label>
      <input type="text" className="w-full..." />
    </div>
  )}
  ```

### 6. Collapsible Section (Accordion) Handling
- **Section Visibility**: If a page or tab utilizes collapsible sections, any section that does **not** contain at least one matching search item must be completely hidden from the UI.
- **Auto-Expand on Match**: If a search item is found inside a collapsible section, that section **must** be automatically uncollapsed (expanded) so the user can immediately see the matching fields.
- **Scope**: This rule only applies when collapsible sections are present on the given page or tab.

### 🔮 Space for Future Search-Related Features & Logic
*This dedicated block exists to house future robust search protocols (Global Search, Fuzzy Search, Recent Searches, etc.) as the system evolves.*
- **[Reserved for Keyword Highlighting Protocol]**: Future logic for rendering `<mark>` tags over matching text substrings.
- **[Reserved for Fuzzy Matching/Levenshtein Logic]**: Future rules for typo-tolerant searches.
- **[Reserved for Global Omni-Search (CMD+K)]**: Future commands for keyboard shortcuts, command palettes, and cross-application global search behavior.
- **[Reserved for Deep Relationship Searching]**: Future standards for matching related data objects, nested options, and complex object arrays.
- **[Reserved for Voice Search Command Integration]**: To be defined as the application scales.
- **[Simple Input and Output Toolbar Logic]**:
  - The format selection dropdown MUST be named "Simple Input and Output" (configured via tooltips/aria-labels).
  - The active accept formats for file pickers/uploads and backing parse logic MUST dynamically adapt to the active choice of this dropdown.
  - The "Export" button's label MUST remain static as "Export" or "Export Settings" (rather than changing to "JSON" or "CSV"), while its underlying download MIME/format logic runs dynamically dependent on the selector's value.
