const fs = require('fs');
const path = require('path');

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith('.tsx') || name.endsWith('.ts')) {
        files_.push(name);
      }
    }
  }
  return files_;
}

const allFiles = getFiles('./src');
const counts = allFiles.map(f => {
  const content = fs.readFileSync(f, 'utf-8');
  return { file: f, lines: content.split('\n').length };
});

counts.sort((a, b) => b.lines - a.lines);
console.log(counts.slice(0, 15).map(c => `${c.lines} ${c.file}`).join('\n'));
