import fs from 'fs';
import path from 'path';

const searchSnapCenter = /snap-center/g;
const searchSnapX = /snap-x/g;

const getFiles = (dir: string): string[] => {
  const files: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
};

const allFiles = getFiles(path.resolve('src/components/Settings'));
let count = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.match(searchSnapCenter)) {
    content = content.replace(searchSnapCenter, '');
    changed = true;
  }
  
  if (content.match(searchSnapX)) {
    content = content.replace(searchSnapX, '');
    changed = true;
  }

  if (changed) {
    // Attempt to fix double spaces leaving layout intact. Only replace spaces within the className boundaries roughly
    content = content.replace(/shrink-0  /g, 'shrink-0 ');
    content = content.replace(/max-w-full  /g, 'max-w-full ');
    
    // Check if any scrollIntoView exists and we also delete it
    const hasScrollIntoView = content.includes('scrollIntoView');
    if (hasScrollIntoView) {
        content = content.replace(/activeEl\.scrollIntoView\(\{\s*behavior:\s*'smooth',\s*block:\s*'(nearest|center)',\s*inline:\s*'center'\s*\}\);/g, '');
        // also fallback for another form
        content = content.replace(/targetLabel\.scrollIntoView\([^)]*\);/g, '');
        console.log('Removed scrollIntoView exactly:', file);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
    count++;
  }
});

console.log(`Fixed ${count} files.`);
