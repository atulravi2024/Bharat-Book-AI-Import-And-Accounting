const fs = require('fs');
const path = require('path');

const fileSrc = 'components/Operations/VoucherEntry/VoucherEntryView.tsx';
let content = fs.readFileSync(fileSrc, 'utf8');

// The exact string boundaries mapping:
function extractAndReplace(blockStart, blockEnd, componentName, propsReplacement) {
  const startIdx = content.indexOf(blockStart);
  if (startIdx === -1) {
    console.error('Could not find start:', blockStart.substring(0, 50));
    return null;
  }
  const endIdx = content.indexOf(blockEnd, startIdx) + blockEnd.length;
  if (content.indexOf(blockEnd, startIdx) === -1) {
    console.error('Could not find end:', blockEnd.substring(0, 50));
    return null;
  }
  
  const extracted = content.substring(startIdx, endIdx);
  content = content.substring(0, startIdx) + propsReplacement + content.substring(endIdx);
  
  return extracted;
}

const res = extractAndReplace(
  'const WebBillRequirements = () => (',
  '  );',
  'WebBillRequirements',
  ''
);

return;
