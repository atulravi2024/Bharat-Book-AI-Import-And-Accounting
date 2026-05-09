const fs = require('fs');

let tStylesCode = fs.readFileSync('modify-voucher.js', 'utf8');
tStylesCode = tStylesCode.substring(tStylesCode.indexOf('// --- Deep Transformation Styles ---'), tStylesCode.indexOf('// Insert the tStyles declaration'));
tStylesCode = tStylesCode.replace(/printConfig\./g, 'config.');
tStylesCode = tStylesCode.substring(0, tStylesCode.length - 2);

let settingsContent = fs.readFileSync('components/Settings/InvoicePrintSettings.tsx', 'utf8');

// Insert tStylesCode into InvoicePrintSettings.tsx
settingsContent = settingsContent.replace(
    /(\s+)(return \(\s*<div \s+id="voucher-preview-document")/,
    `\n  ${tStylesCode}\n$1$2`
);

let jsxReplacement = fs.readFileSync('modify-voucher.js', 'utf8');
jsxReplacement = jsxReplacement.substring(jsxReplacement.indexOf('<div className={tStyles.headerWrap}>'), jsxReplacement.indexOf('{/* Footer Info`'));
jsxReplacement = jsxReplacement.replace(/printConfig\./g, 'config.');
jsxReplacement = jsxReplacement.substring(0, jsxReplacement.length - 2); 

// In InvoicePrintSettings, rows are rendered like this:
// {rows.map((row, index) => (
// Replace rows rendering logic
jsxReplacement = jsxReplacement.replace(/rows\.filter\(r => \(isInventory \? r\.itemName : r\.ledgerName\)\)\.map/g, 'rows.map');

settingsContent = settingsContent.replace(
    /<div className=\{\`flex justify-between items-start[\s\S]*?(?=<\/div>\s*<\/div>\s*\{\/\* Footers)/,
    jsxReplacement
);

// We also need to fix Footers to use tStyles inside InvoicePrintSettings
let footerReplacement = `
                <div className={tStyles.footerWrap}>
                  <div className="text-left w-1/3">
                    {config.showCustomerSign && (
                      <div className={isTechnical ? 'border-2 border-black p-4 inline-block' : ''}>
                        <div {...getSectionStyle('signatures', tStyles.signaturesAuth, { fontSize: \`\${baseSize * 0.7}px\` })}>Customer Authorization</div>
                        <div className={tStyles.signaturesDivider}></div>
                      </div>
                    )}
                  </div>
                  <div className="text-right w-1/2">
                    {config.showSignature && (
                      <div className={tStyles.signaturesBox}>
                        <div {...getSectionStyle('signatures', \`font-black text-gray-900 uppercase tracking-widest mb-4\`, { fontSize: \`\${baseSize * 0.8}px\` })}>Authorized For BHARAT BOOK</div>
                        <div className={tStyles.signaturesDivider}></div>
                        <div {...getSectionStyle('signatures', \`font-black \${primaryText} uppercase tracking-[0.4em] opacity-100 mt-4\`, { fontSize: \`\${baseSize * 0.8}px\` })}>Official Stamp & Sign</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>`;

settingsContent = settingsContent.replace(
    /<div className=\{\`flex justify-between items-end \$\{isTechnical \? 'border-t-\[3px\] border-black pt-10' : ''\}\`\}>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
    footerReplacement
);

fs.writeFileSync('components/Settings/InvoicePrintSettings.tsx', settingsContent);
