const fs = require('fs');
let settingsContent = fs.readFileSync('components/Settings/InvoicePrintSettings.tsx', 'utf8');

let startIndex = settingsContent.indexOf('{/* Invoice Header */}');
if (startIndex === -1) startIndex = settingsContent.indexOf('{config.showHeader && (');
if (startIndex === -1) {
   const gridIndex = settingsContent.indexOf('{isTechnical && (');
   if(gridIndex !== -1) startIndex = settingsContent.indexOf(')}', gridIndex) + 2;
}
const endIndex = settingsContent.indexOf('{/* Footers */}');

let voucherContent = fs.readFileSync('components/Operations/VoucherEntry/VoucherPreview.tsx', 'utf8');
let vStart = voucherContent.indexOf('<div className={tStyles.headerWrap}>');
let vEnd = voucherContent.indexOf('{/* Footer Info'); 

let replacementJsx = voucherContent.substring(vStart, vEnd);
replacementJsx = replacementJsx.replace(/printConfig\./g, 'config.');
replacementJsx = replacementJsx.replace(/rows\.filter\\(r => \\(isInventory \\? r\\.itemName : r\\.ledgerName\\)\\)\\.map/g, 'rows.map');
replacementJsx = replacementJsx.replace(/isInventory \?/g, 'true ?');

const rebuiltBody = `
            {/* Invoice Header */}
            {config.showHeader && (
                ${replacementJsx}
`;

settingsContent = settingsContent.substring(0, startIndex) + '\\n' + rebuiltBody + '\\n            ' + settingsContent.substring(endIndex);

fs.writeFileSync('components/Settings/InvoicePrintSettings.tsx', settingsContent);
