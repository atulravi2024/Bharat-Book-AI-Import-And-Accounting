const fs = require('fs');

const content = fs.readFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', 'utf8');

const startStr = '          <div className={`mt-6 bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[20] ${collapsedSections.narration ? \'px-6 py-3 rounded-xl\' : \'p-6 rounded-2xl\'}`}>';
const endStr = '          </div>\n        </div>\n      </div>\n\n      <div className="sticky bottom-0';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
    console.log("Could not find start/end bounds for sections.");
    process.exit(1);
}

const sectionsContent = content.substring(startIdx, endIdx + 16); // +16 gets '          </div>'

const compStr = `import React from 'react';
import { ChevronUp } from 'lucide-react';
import { SearchableDropdown } from '../../ui/SearchableDropdown';

interface VoucherTotalsSummaryProps {
  collapsedSections: any;
  toggleSection: (section: string) => void;
  headerDetails: any;
  handleHeaderChange: (field: string, value: any) => void;
  ledgerMasters: any[];
  totals: any;
  activeTab: string;
}

export const VoucherTotalsSummary: React.FC<VoucherTotalsSummaryProps> = ({
  collapsedSections,
  toggleSection,
  headerDetails,
  handleHeaderChange,
  ledgerMasters,
  totals,
  activeTab
}) => {
  return (
    <>
${sectionsContent}
    </>
  );
};
`;

fs.writeFileSync('components/Operations/VoucherEntry/components/VoucherTotalsSummary.tsx', compStr);

const repStr = `          <VoucherTotalsSummary 
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            ledgerMasters={ledgerMasters}
            totals={totals}
            activeTab={activeTab}
          />`;

const newMain = content.substring(0, startIdx) + repStr + '\n        </div>\n      </div>\n\n      <div className="sticky bottom-0' + content.substring(endIdx + endStr.length - '      <div className="sticky bottom-0'.length);

fs.writeFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', newMain);

let impContent = fs.readFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', 'utf8');
const impIdx = impContent.indexOf('import { VoucherPreview } from \'./VoucherPreview\';');
if (impIdx !== -1) {
    const imps = "import { VoucherTotalsSummary } from './components/VoucherTotalsSummary';\n";
    fs.writeFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', impContent.substring(0, impIdx) + imps + impContent.substring(impIdx));
}

console.log("Sections extracted to VoucherTotalsSummary.tsx!");
