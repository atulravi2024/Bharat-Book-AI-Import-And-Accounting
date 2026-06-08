# Settings Architecture Migration Memory (Method 1)

**Date**: June 2026
**Architecture Style**: Domain-Based Grouping (Method 1)
**Goal**: Split the cluttered main settings page (which currently has ~19 tabs) into modular, independent feature-based Main Setting Domains. Each domain will contain its relevant subset of subpages (approx. 3-6 maximum per category) so the UI is highly organized and not overwhelming.

## 🗂️ Categorization Mapping (New Folders)

### 1. `WorkspaceSettings` (Core Configuration & Preferences)
Focused on what the app looks like, what the form defaults are, and basic firm identities.
- `FirmSettings` (Firm level variables)
- `GeneralSettings` (General standard preferences)
- `UISettings` (Theme, layout, and interaction behaviors)
- `AppNavigationSettings` (App navigation defaults)
- `FormDetailSettings` (Form-level specifics)
- `VoucherNumbering` (Document tracking formats)
- `InvoicePrintSettings` (Documentation/printing options)

### 2. `OrganizationSettings` (People, Privacy & Access Management)
Focused on who has access, what they can see, and top-level admin controls.
- `UserSettings` (User Directory, Roles)
- `AdminSettings` (Admin panel actions)
- `SecuritySettings` (Compliance, login enforcement)
- `PrivacySettings` (Data privacy selections)

### 3. `DataEngineSettings` (Data Pipelines & AI Configuration)
Focused on data movement, parsing, intelligent algorithms, and telemetry insight.
- `ImportSettings` (Global and specific voucher import rules)
- `MappingSettings` (Direct database/ledger term mappings)
- `AISettings` (AI Parsing parameters, thresholds)
- `DataExplorer` (Deep data querying and SQL insights)

### 4. `SupportSystemSettings` (Monitoring, Alerting & Support)
Focused on incident handling, user-help, contact, and channels.
- `AlertChannel` (Webhook/Email notifications)
- `HelpSettings` (FAQ and guides)
- `SupportSettings` (Ticketing and customer representation)
- `AboutSettings` (Version, license, system info)

## 🚀 Migration Phases

### Phase 1: Preparation & Directory Scaffolding (Current Phase)
- [x] Document the architectural methodology in this memory file (`SETTINGS_ARCHITECTURE_MIGRATION.md`).
- [ ] Create the top-level domain folders under `src/components/Settings/`:
  - `/WorkspaceSettings`
  - `/OrganizationSettings`
  - `/DataEngineSettings`
  - `/SupportSystemSettings`

### Phase 2: Relocating Components
- [ ] Move the existing setting files (`.tsx`) and their respective sub-folders (like `FirmSettings`, `GeneralSettings`, etc.) into their assigned domain folder.
- [ ] Ensure that internal imports within the moved folders are updated correctly (for relative paths to icons, contexts, etc.).

### Phase 3: High-Level View Abstraction
- [ ] Create a `MainEntry` for each new Domain folder.
- [ ] Build a new parent `PlatformSettings` UI which lists only the **4 Main Domain cards**. Clicking a domain card opens that domain's specific view (where its 4-6 specific sub-tabs are displayed).
- [ ] Deprecate the old flat `SettingsView/index.tsx` horizontal tab container, replacing it with the new layered navigation.

### Phase 4: Verification & Routing Cleanup
- [ ] Ensure no functionality has been lost during file moves.
- [ ] Confirm mobile layout respects the new hierarchy efficiently without squishing 19 tabs together.

---

> **CRITICAL RULE**: Do not remove any functionality or forms during migrations. Files should be strictly moved and their import connections restored.
