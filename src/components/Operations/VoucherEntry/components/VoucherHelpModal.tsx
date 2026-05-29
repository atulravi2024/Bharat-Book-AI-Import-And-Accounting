import { useLanguage } from '../../../../context/LanguageContext';
import React, { useState } from 'react';
import { HelpCircle, X, Layout, ChevronUp, ChevronDown, Zap } from 'lucide-react';

interface VoucherHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherHelpModal: React.FC<VoucherHelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [showHelpFunctionality, setShowHelpFunctionality] = useState(false);
  const [showHelpProTips, setShowHelpProTips] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh] dark:bg-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 dark:text-white"><HelpCircle size={20} className="text-blue-500" /> {t("Help & Instructions")}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4 text-sm text-gray-700 dark:text-gray-200">
          
          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <button 
              onClick={() => setShowHelpFunctionality(!showHelpFunctionality)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-bold text-gray-900 flex items-center dark:text-white"><Layout size={16} className="mr-2 text-blue-500"/> {t("Section-by-Section Guide")}</span>
              {showHelpFunctionality ? <ChevronUp size={16} className="text-gray-500 dark:text-gray-400"/> : <ChevronDown size={16} className="text-gray-500 dark:text-gray-400"/>}
            </button>
            {showHelpFunctionality && (
              <div className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block dark:text-gray-100">1. {t("Header Details")}</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>{t("Voucher Number & Date")}:</b> {t("Auto-generated or manually entered number. System auto-fills today's date.")}</li>
                      <li><b>{t("Party A/C & Contact")}:</b> {t("Select the ledger account (e.g., Customer/Supplier). Choose a specific contact person.")}</li>
                      <li><b>{t("Place of Supply & Currency")}:</b> {t("Crucial for precise tax calculations (e.g., IGST vs CGST/SGST).")}</li>
                      <li><b>{t("Godown / Branch")}:</b> {t("Ensure inventory movements register at the correct location.")}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block dark:text-gray-100">2. {t("Entry Lines (Item Details)")}</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>{t("Adding Items")}:</b> {t("Search items via the dropdown or use Barcode Scan. Use the '+' shortcut or \"New Row\" button to add lines.")}</li>
                      <li><b>{t("Quantities & Pricing")}:</b> {t("Provide base quantity, secondary units (if applicable), and unit rates.")}</li>
                      <li><b>{t("Valuation & MRP")}:</b> {t("Used for retail and stock valuation.")}</li>
                      <li><b>{t("Discounts")}:</b> {t("Apply percentage or absolute value discounts line-by-line.")}</li>
                      <li><b>{t("Line Tax")}:</b> {t("Define specific tax/GST rates per item if different from a global rate.")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block dark:text-gray-100">3. {t("Voucher Summary & Taxes")}</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>{t("Subtotal")}:</b> {t("Total of all line amounts before global tax in the base currency limit.")}</li>
                      <li><b>{t("Global Discount")}:</b> {t("Apply a discount to the entire voucher.")}</li>
                      <li><b>{t("Additional Charges")}:</b> {t("Apply values for freight, packaging, or insurance.")}</li>
                      <li><b>{t("Global Tax")}:</b> {t("Final computed tax across all taxable items.")}</li>
                      <li><b>{t("Round-Off")}:</b> {t("Auto-adjusts fractional values to the nearest whole number.")}</li>
                      <li><b>{t("TCS/TDS")}:</b> {t("Attach tax collected/deducted at source, if necessary for statutory compliance.")}</li>
                      <li><b>{t("Net Payable/Receivable")}:</b> {t("The final grand total to settle.")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block dark:text-gray-100">4. {t("Contextual Actions & Save")}</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>{t("Save & Print")}:</b> {t("Directly commit the entry and open print templates.")}</li>
                      <li><b>{t("Attach Documents")}:</b> {t("Upload vendor invoices, POs, or receipts to link them to the system entry.")}</li>
                      <li><b>{t("Duplicate")}:</b> {t("Clone the current voucher layout to quickly record a similar entry.")}</li>
                      <li><b>{t("History")}:</b> {t("Review previously saved entries within this module and reload them.")}</li>
                      <li><b>{t("Suspend/Resume")}:</b> {t("Park an entry temporarily if you need further confirmations, then load it back later from history.")}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block dark:text-gray-100">5. {t("Keyboard Masterclasses")}</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Alt + S:</b> {t("Open the barcode scanner immediately.")}</li>
                      <li><b>Alt + A:</b> {t("Open the attachment dialogue to upload a document quickly.")}</li>
                      <li><b>Alt + C:</b> {t("Invoke the built-in system calculator.")}</li>
                      <li><b>Alt + H:</b> {t("Open recent voucher history.")}</li>
                      <li><b>Alt + D / Delete:</b> {t("Duplicate the current voucher or clear/delete it from the screen.")}</li>
                      <li><b>{t("Enter Key")}:</b> {t("Inside table cells, acts as Tab to move you to the next logical data field quickly.")}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block dark:text-gray-100">6. {t("Tax & Discount Evaluation Rules")}</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>{t("Discount Hierarchy")}:</b> {t("Line-level discounts apply first, reducing the item's taxable amount. Header-level discounts apply against the total subtotal proportionally.")}</li>
                      <li><b>{t("Tax Compounding")}:</b> {t("Global taxes are applied strictly after all Global Discounts have been deducted. Line taxes only apply against the Line item's subtotal.")}</li>
                      <li><b>{t("Round-Off Priority")}:</b> {t("Rounding is mathematically applied to the final Net Amount after all calculations, ensuring exact integers for ledgers.")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <button 
              onClick={() => setShowHelpProTips(!showHelpProTips)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-600"
            >
              <span className="font-bold text-gray-900 flex items-center dark:text-white"><Zap size={16} className="mr-2 text-blue-500"/> {t("Pro Tips & Workflows")}</span>
              {showHelpProTips ? <ChevronUp size={16} className="text-gray-500 dark:text-gray-400"/> : <ChevronDown size={16} className="text-gray-500 dark:text-gray-400"/>}
            </button>
            {showHelpProTips && (
              <div className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>{t("Use")} <b>{t("Tab")}</b> {t("to toggle through fields quickly without using the mouse. Ensure rapid entry speeds.")}</li>
                  <li>{t("Click")} <b>{t("Save & New")}</b> {t("when doing rapid consecutive data entry from stacks of invoices.")}</li>
                  <li>{t("Collapse sections (like the Header or Summary) using the chevron arrows to give your screen more vertical space for entry lines.")}</li>
                  <li>{t("Use the")} <b>{t("Calculator (Alt+C)")}</b> {t("or inline math (e.g. typing `10*5` in amount fields) if enabled to calculate totals quickly.")}</li>
                </ul>
              </div>
            )}
          </div>

        </div>
        <div className="p-6 border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            {t("Close Help")}
          </button>
        </div>
      </div>
    </div>
  );
};
