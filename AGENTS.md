# Agent Guidelines - Bharat Book AI Import

These persistent instructions represent the user's specific rules, project conventions, and functional boundaries for the application. They are automatically injected into the system instructions for all future turns and AI sessions.

## 🛠️ Development & Architecture Rules

1. **Global Settings vs. Page Import Scope (CRITICAL)**
   - In the future, **DO NOT** add custom steps, configurations, fields, or behaviors (like custom "reward" metrics, mapping defaults, or specific steps) inside page-level import flows (such as importing vouchers, ledgers, or Excel sheets).
   - All such configuration choices should be part of the global **Settings** flow which is set once by the user, rather than re-declared or forced inside individual import scripts.
   - Keep import logic highly focused on data parsing and mapping against current configured states, without over-engineering or adding unsolicited data layers dynamically during execution.

2. **UI and Interaction Design**
   - Respect visual and functional boundaries: Build exactly what is requested, utilizing deep visual polish and clean negative space instead of adding unsolicited features.
   - Maintain the premium, dense ERP technical style established by Bharat Book.
