import fs from 'fs';
import path from 'path';

const searchPattern = /scale-\[1\.01\]/g;

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
  if (content.match(searchPattern)) {
    content = content.replace(searchPattern, '');
    
    // clean trailing spaces before quote
    content = content.replace(/shadow-sm \'/g, "shadow-sm'");
    content = content.replace(/shadow-sm  \'/g, "shadow-sm'");
    content = content.replace(/shadow-sm \"/g, 'shadow-sm"');
    content = content.replace(/shadow-sm  \"/g, 'shadow-sm"');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
    count++;
  }
});

console.log(`Fixed ${count} files.`);
