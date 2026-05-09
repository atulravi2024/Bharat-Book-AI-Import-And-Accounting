const fs = require('fs');

const path = 'components/Operations/InventoryEntry/InventoryEntryView.tsx';
let data = fs.readFileSync(path, 'utf8');

// The functions to remove
const funcDecls = [
  'const renderLocationDetails = () => {',
  '  const renderLocationDetails = () => (',
  'const renderPartyDetails = () => (',
  '  const renderPartyDetails = () => (',
  'const renderPartyDetails = () => {',
  '  const renderPartyDetails = () => {',
  'const renderLogisticsDetails = () => {',
  '  const renderLogisticsDetails = () => {',
  'const renderItemTable = () => (',
  '  const renderItemTable = () => (',
  'const renderAdjustments = () => (',
  '  const renderAdjustments = () => (',
  'const renderSummary = () => (',
  '  const renderSummary = () => ('
];

// Let's just find the main return by searching for `return (` and looking at what follows it.
// Main return is followed by `<div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-screen pb-32">`

const mainReturnSig = 'return (\n    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 min-h-screen pb-32">';
const mainReturnIdx = data.indexOf(mainReturnSig);

if (mainReturnIdx !== -1) {
    // Delete from `const renderLocationDetails` all the way to `mainReturnIdx`
    let deleteStartIdx = data.indexOf('const renderLocationDetails = ()');
    if (deleteStartIdx === -1) deleteStartIdx = data.indexOf('  const renderLocationDetails = ()');
    
    if (deleteStartIdx !== -1) {
       data = data.substring(0, deleteStartIdx) + data.substring(mainReturnIdx);
    }
}

// And fix that trailing error
// "components/Operations/InventoryEntry/InventoryEntryView.tsx(2302,1): error TS1128: Declaration or statement expected."
// This means there might be an extra closing brace or missing one.
// Let's print out the end of the file.

fs.writeFileSync(path, data);
console.log("Clean up done!");
