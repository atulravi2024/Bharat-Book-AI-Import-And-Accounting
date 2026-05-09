const fs = require('fs');

const path = 'components/Operations/InventoryEntry/InventoryEntryView.tsx';
let data = fs.readFileSync(path, 'utf8');

const lines = data.split('\n');

const handleGenImageEnd = lines.findIndex(line => line.includes('const handleGenerateImage = async () => {'));
let handleGenImageEndIdx = -1;
if (handleGenImageEnd !== -1) {
    for (let i = handleGenImageEnd; i < lines.length; i++) {
        if (lines[i].includes('};') && lines[i].startsWith('  };')) {
            handleGenImageEndIdx = i;
            break;
        }
    }
}

const mainReturnIdx = lines.findIndex(line => line.includes('  return (\\n    <div className="max-w-[1400px] mx-auto') || line.includes('    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-screen pb-32">'));

let actualMainReturn = -1;
for (let i = handleGenImageEndIdx; i < lines.length; i++) {
    if (lines[i].includes('<div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-screen pb-32">')) {
       actualMainReturn = i - 1; // get the return (
       break;
    }
}

if (handleGenImageEndIdx !== -1 && actualMainReturn !== -1) {
    const newLines = [
        ...lines.slice(0, handleGenImageEndIdx + 1),
        '\n',
        ...lines.slice(actualMainReturn)
    ];
    fs.writeFileSync(path, newLines.join('\n'));
    console.log("Deleted from ", handleGenImageEndIdx, "to", actualMainReturn);
} else {
    console.log("Could not find boundaries", handleGenImageEndIdx, actualMainReturn);
}
