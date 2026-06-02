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

## 📐 Import Pipeline Terminology & Architecture Rules (CRITICAL/PERMANENT)

1. **Stages vs. Parts vs. Steps Definition**
   - Do **NOT** refer to different steps as "Page One" or "Page Two" interchangeably unless mapping them synchronously: **Step 1 is Page One**, and **Step 2 is Page Two**. Keep their sequence identical.
   - The entire import pipeline consists of **11 Steps** in total.
   - These 11 steps are divided into two distinct **Stages** (or **Parts**):
     - **Stage One (or Part One) [Steps 1 to 6]**: Handles the initial user ingestion, file selection, mapping setup, and configuration.
     - **Stage Two (or Part Two) [Steps 7 to 11]**: The **AI Ingestion & Processing Unit**, where the AI parses, auto-aligns, verifies, and corrects the records before formal absorption.

2. **Guidelines for Choices and Information Layout**
   - Do **NOT** use the term "Sub-step" or "Sub-page". These are strictly styled as "Options" inside the step or page.
   - All interactive paths, data, or screens loaded inside a Step or a Page should be described as **Options** (e.g. Choose Option, Type Option) depending on whatever step or page is currently active.
   - Ensure all future development and code changes respect these boundaries and terminologies explicitly.
