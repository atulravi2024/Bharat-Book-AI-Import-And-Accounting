const fs = require('fs');
let settingsContent = fs.readFileSync('components/Settings/InvoicePrintSettings.tsx', 'utf8');

// There are two things to fix:
// 1. The \`});\` that precedes \`return (\`
settingsContent = settingsContent.replace(/return c;\n\s*\n\s*\}\)\(\);\n\`;/g, 'return c;\n  })();');
settingsContent = settingsContent.replace(/return c;\n  \}\)\(\);\n\`;/g, 'return c;\n  })();');

// 2. The JS code injected at the end of the file.
// We need to cut everything from `// Insert the tStyles declaration right above "return ("` 
// up to `          </div>\n            </div>` (which is before `{/* Footers */}`)
const badStringStart = '// Insert the tStyles declaration right above "return ("';
if (settingsContent.includes(badStringStart)) {
  const startIdx = settingsContent.indexOf(badStringStart);
  const endIdx = settingsContent.indexOf('</div>\n            </div>', startIdx);
  if (endIdx !== -1) {
    settingsContent = settingsContent.substring(0, startIdx) + settingsContent.substring(endIdx);
  }
}

// Ensure we don't have duplicated tStyles blocks. I will just do the replace and then check.
fs.writeFileSync('components/Settings/InvoicePrintSettings.tsx', settingsContent);
