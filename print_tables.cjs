const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/Masters/ItemMaster/Tabs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'ItemsTab.tsx' && f !== 'BrandsTab.tsx');

let output = '';
for (let f of files) {
  let content = fs.readFileSync(path.join(dir, f), 'utf8');
  let matchHead = content.match(/<thead>(.*?)<\/thead>/s);
  let matchBody = content.match(/<tbody.*?>(.*?)<\/tbody>/s);
  if (matchHead && matchBody) {
    output += `\n--- ${f} ---\n`;
    output += matchHead[1].trim() + '\n\n';
    
    // Extracted raw TDs from the first tr
    let body = matchBody[1];
    let startIndex = body.indexOf('<tr');
    let trBody = body; // just print all tds in first tr
    let parts = trBody.match(/<td[\s\S]*?<\/td>/g);
    if(parts && parts.length > 0) {
        output += "TDs:\n"
        for(let j = 0; j < Math.min(parts.length, 10); j++) {
            output += parts[j] + '\n';
        }
    }
  }
}
fs.writeFileSync('tables.txt', output);
console.log('done');
