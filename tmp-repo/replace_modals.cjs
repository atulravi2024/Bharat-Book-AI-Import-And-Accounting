const fs = require('fs');
const content = fs.readFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', 'utf8');

const startHelp = content.indexOf('{showHelp && (');
if (startHelp === -1) {
  console.log("startHelp not found");
  process.exit(1);
}

// Find the corresponding end of {showHelp && (...)} and {showKeyboardShortcuts && (...)}
// Rather than exact matching, I will use a simple regex matching everything between `{showHelp && (` and `{/* Hidden file input for file attachments */}`
const endMatch = '{/* Hidden file input for file attachments */}';
const endIdx = content.indexOf(endMatch);

if (endIdx === -1) {
    console.log("endMatch not found");
    process.exit(1);
}

const replacement = `<VoucherHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />\n      <VoucherKeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />\n      \n      `;

const newContent = content.substring(0, startHelp) + replacement + content.substring(endIdx);
fs.writeFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', newContent);

// Let's add imports
let impContent = fs.readFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', 'utf8');
const impIdx = impContent.indexOf('import { VoucherPreview } from \'./VoucherPreview\';');
if (impIdx !== -1) {
    const imps = "import { VoucherHelpModal } from './components/VoucherHelpModal';\nimport { VoucherKeyboardShortcutsModal } from './components/VoucherKeyboardShortcutsModal';\n";
    fs.writeFileSync('components/Operations/VoucherEntry/VoucherEntryView.tsx', impContent.substring(0, impIdx) + imps + impContent.substring(impIdx));
}

console.log("Modals replaced successfully");
