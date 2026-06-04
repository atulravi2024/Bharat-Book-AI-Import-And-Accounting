const fs = require('fs');
const content = fs.readFileSync('src/app/App.tsx', 'utf8');

const appContentMatch = content.indexOf('const AppContent');

const firstPart = content.substring(0, appContentMatch);
const restPart = content.substring(appContentMatch);

const importsRegex = /^import .*?;/gm;
let imports = [];
let match;
while ((match = importsRegex.exec(firstPart)) !== null) { imports.push(match[0]); }
const importStr = imports.join('\n');

const restCodeStr = importStr + '\n' + firstPart.replace(/^import .*?;/gm, '') + '\n' + restPart;

// We will just do a check on what's to be extracted.
console.log(importStr.substring(0, 100));
