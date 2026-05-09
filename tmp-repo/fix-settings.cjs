const fs = require('fs');

let settingsContent = fs.readFileSync('components/Settings/InvoicePrintSettings.tsx', 'utf8');
settingsContent = settingsContent.replace(/\\`/g, '`');
settingsContent = settingsContent.replace(/\\\$/g, '$');
fs.writeFileSync('components/Settings/InvoicePrintSettings.tsx', settingsContent);
