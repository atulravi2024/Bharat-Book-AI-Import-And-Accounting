<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Bharat Book AI Import

Bharat Book AI Import is a high-performance, AI-driven ERP companion designed to streamline financial operations such as voucher entry, report analysis, and bank reconciliation. It leverages semantic AI (powered by Google Gemini) to automate data extraction from documents and images, reducing manual entry and errors in accounting workflows.

## 🚀 Features

- **AI-Powered Voucher Extraction:** Automatically extract entities, dates, and line items from invoices, bank statements, and Excel registers.
- **Smart Master Management:** Comprehensive CRUD operations for Item Masters, Ledger Masters, and Parties with advanced attributes.
- **Dynamic GST & Financial Reports:** View real-time GSTR-1, GSTR-3B, GSTR-9, Balance Sheet, P&L, and Cash Flow with drill-down capabilities.
- **Bank Auto-Reconciliation:** Intelligently match bank statement entries against accounting ledgers using fuzzy logic and AI verification.
- **Modular Settings Architecture:** Extensive configurability spanning User, Firm, Voucher Numbering, Import Rules, and Security settings.
- **Responsive UI:** A "Premium Technical" aesthetic built with Tailwind CSS, supporting both dense desktop grids and touch-friendly mobile layouts.

## 🛠️ Technical Stack

- **Framework:** React 18+ with TypeScript
- **Tooling:** Vite
- **Styling:** Tailwind CSS (Modern, utility-first)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **AI Integration:** Google Generative AI (@google/genai)
- **Data Persistence:** LocalStorage-based robust state hydration

## 💻 Run Locally

**Prerequisites:** Node.js (v18+)

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd bharat-book-ai-import
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Set the `GEMINI_API_KEY` in your `.env` or `.env.local` to your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/components`: Modular UI components (Dashboard, Masters, Reports, Settings, Layout, etc.)
  - Notably includes `/components/Settings/FirmSettingsTabs` which dynamically renders 19 configurable settings categories using our modular React accordion pattern.
- `/lib`: Utility functions and shared constants
- `/services`: Core business logic, matching engine, and AI integration
- `/public/memory/design`: In-depth UI design specifications for Mobile and Desktop
- `/public/sample-data`: Static JSON data serving as the database backend
- *(Note: Temporary build scripts and `.cjs` automation files were explicitly purged to maintain a lean, robust codebase.)*

---
*Built with [Google AI Studio Builder](https://ai.studio/build)*