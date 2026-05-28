import fs from 'fs';
import path from 'path';

function extractTKeys(dir, keys = new Set()) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      extractTKeys(fullPath, keys);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const regex = /t\("([^"]+)"\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
      }
      
      const regex2 = /t\(`([^`]+)`\)/g;
      while ((match = regex2.exec(content)) !== null) {
        keys.add(match[1]);
      }
    }
  }
  return keys;
}

const keys = extractTKeys('./src/components/Settings');
console.log(JSON.stringify(Array.from(keys), null, 2));
