import React, { useState } from 'react';
import { HelpCircle, X, Layout, ChevronUp, ChevronDown, Zap } from 'lucide-react';

interface VoucherHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherHelpModal: React.FC<VoucherHelpModalProps> = ({ isOpen, onClose }) => {
  const [showHelpFunctionality, setShowHelpFunctionality] = useState(false);
  const [showHelpProTips, setShowHelpProTips] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><HelpCircle size={20} className="text-blue-500" /> Help & Instructions</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4 text-sm text-gray-700">
          
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowHelpFunctionality(!showHelpFunctionality)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-bold text-gray-900 flex items-center"><Layout size={16} className="mr-2 text-blue-500"/> Section-by-Section Guide</span>
              {showHelpFunctionality ? <ChevronUp size={16} className="text-gray-500"/> : <ChevronDown size={16} className="text-gray-500"/>}
            </button>
            {showHelpFunctionality && (
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block">1. Header Details</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Voucher Number & Date:</b> Auto-generated or manually entered number. System auto-fills today's date.</li>
                      <li><b>Party A/C & Contact:</b> Select the ledger account (e.g., Customer/Supplier). Choose a specific contact person.</li>
                      <li><b>Place of Supply & Currency:</b> Crucial for precise tax calculations (e.g., IGST vs CGST/SGST).</li>
                      <li><b>Godown / Branch:</b> Ensure inventory movements register at the correct location.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block">2. Entry Lines (Item Details)</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Adding Items:</b> Search items via the dropdown or use Barcode Scan. Use the '+' shortcut or "New Row" button to add lines.</li>
                      <li><b>Quantities & Pricing:</b> Provide base quantity, secondary units (if applicable), and unit rates.</li>
                      <li><b>Valuation & MRP:</b> Used for retail and stock valuation.</li>
                      <li><b>Discounts:</b> Apply percentage or absolute value discounts line-by-line.</li>
                      <li><b>Line Tax:</b> Define specific tax/GST rates per item if different from a global rate.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block">3. Voucher Summary & Taxes</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Subtotal:</b> Total of all line amounts before global tax in the base currency limit.</li>
                      <li><b>Global Discount:</b> Apply a discount to the entire voucher.</li>
                      <li><b>Additional Charges:</b> Apply values for freight, packaging, or insurance.</li>
                      <li><b>Global Tax:</b> Final computed tax across all taxable items.</li>
                      <li><b>Round-Off:</b> Auto-adjusts fractional values to the nearest whole number.</li>
                      <li><b>TCS/TDS:</b> Attach tax collected/deducted at source, if necessary for statutory compliance.</li>
                      <li><b>Net Payable/Receivable:</b> The final grand total to settle.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block">4. Contextual Actions & Save</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Save & Print:</b> Directly commit the entry and open print templates.</li>
                      <li><b>Attach Documents:</b> Upload vendor invoices, POs, or receipts to link them to the system entry.</li>
                      <li><b>Duplicate:</b> Clone the current voucher layout to quickly record a similar entry.</li>
                      <li><b>History:</b> Review previously saved entries within this module and reload them.</li>
                      <li><b>Suspend/Resume:</b> Park an entry temporarily if you need further confirmations, then load it back later from history.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block">5. Keyboard Masterclasses</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Alt + S:</b> Open the barcode scanner immediately.</li>
                      <li><b>Alt + A:</b> Open the attachment dialogue to upload a document quickly.</li>
                      <li><b>Alt + C:</b> Invoke the built-in system calculator.</li>
                      <li><b>Alt + H:</b> Open recent voucher history.</li>
                      <li><b>Alt + D / Delete:</b> Duplicate the current voucher or clear/delete it from the screen.</li>
                      <li><b>Enter Key:</b> Inside table cells, acts as Tab to move you to the next logical data field quickly.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1 px-2 py-1 bg-blue-50 text-blue-800 outline outline-blue-100 rounded inline-block">6. Tax & Discount Evaluation Rules</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><b>Discount Hierarchy:</b> Line-level discounts apply first, reducing the item's taxable amount. Header-level discounts apply against the total subtotal proportionally.</li>
                      <li><b>Tax Compounding:</b> Global taxes are applied strictly after all Global Discounts have been deducted. Line taxes only apply against the Line item's subtotal.</li>
                      <li><b>Round-Off Priority:</b> Rounding is mathematically applied to the final Net Amount after all calculations, ensuring exact integers for ledgers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowHelpProTips(!showHelpProTips)} 
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-bold text-gray-900 flex items-center"><Zap size={16} className="mr-2 text-blue-500"/> Pro Tips & Workflows</span>
              {showHelpProTips ? <ChevronUp size={16} className="text-gray-500"/> : <ChevronDown size={16} className="text-gray-500"/>}
            </button>
            {showHelpProTips && (
              <div className="p-3 bg-white border-t border-gray-200">
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  <li>Use <b>Tab</b> to toggle through fields quickly without using the mouse. Ensure rapid entry speeds.</li>
                  <li>Click <b>Save & New</b> when doing rapid consecutive data entry from stacks of invoices.</li>
                  <li>Collapse sections (like the Header or Summary) using the chevron arrows to give your screen more vertical space for entry lines.</li>
                  <li>Use the <b>Calculator (Alt+C)</b> or inline math (e.g. typing `10*5` in amount fields) if enabled to calculate totals quickly.</li>
                </ul>
              </div>
            )}
          </div>

        </div>
        <div className="p-6 border-t border-gray-100 bg-white">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            Close Help
          </button>
        </div>
      </div>
    </div>
  );
};
