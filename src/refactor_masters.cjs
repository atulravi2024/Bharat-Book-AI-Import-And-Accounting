const fs = require('fs');

let c = fs.readFileSync('src/app/useAppLogic.tsx', 'utf8');

const constantsKeys = [
  'PARTY_MASTERS_KEY', 'LEDGER_MASTERS_KEY', 'ITEM_MASTERS_KEY',
  'UOM_MASTERS_KEY', 'GST_MASTERS_KEY', 'BRAND_MASTERS_KEY',
  'CATEGORY_MASTERS_KEY', 'GRADE_MASTERS_KEY',
  'ASSERTION_CATEGORY_MASTERS_KEY', 'ASSERTION_CODE_MASTERS_KEY',
  'CONTACT_MASTERS_KEY', 'LOCATION_MASTERS_KEY', 'STOCK_GROUP_MASTERS_KEY',
  'COST_CENTER_MASTERS_KEY', 'ACCOUNT_GROUP_MASTERS_KEY', 'BOM_MASTERS_KEY'
];

let extractedKeys = '';
constantsKeys.forEach(k => {
  const regex = new RegExp(`const ${k} = '[^']+';\\n`);
  const match = c.match(regex);
  if (match) {
    extractedKeys += match[0];
    c = c.replace(regex, '');
  }
});

// find all master states
const masterStateMatches = c.match(/const \[.*?Masters, set.*?] = useStorageState.*?;/g);
let masterStatesLines = '';
let returnedStateVars = [];

masterStateMatches.forEach(m => {
  masterStatesLines += '  ' + m + '\n';
  c = c.replace(m + '\n', '');
  
  const varMatch = m.match(/const \[(.*?), (.*?)\]/);
  returnedStateVars.push(varMatch[1]);
  returnedStateVars.push(varMatch[2]);
});

// also find activeSamples
const activeSamplesMatch = c.match(/const \[activeSamples, setActiveSamples\] = useStorageState<string\[\]>\('bharat_book_active_samples_v12', \[[\s\S]*?\]\);/);
if (activeSamplesMatch) {
  masterStatesLines += '\n  ' + activeSamplesMatch[0].replace(/\n/g, '\n  ') + '\n';
  c = c.replace(activeSamplesMatch[0] + '\n', '');
  returnedStateVars.push('activeSamples');
  returnedStateVars.push('setActiveSamples');
}

// also find the fetchMissingSamples logic
const fetchMissingSamplesMatch = c.match(/\/\/ Sync activeSamples to fetch them if missing\n  useEffect\(\(\) => {[\s\S]*?return \(\) => { active = false; };\n  \}, \[.*?\]\);/);
if(fetchMissingSamplesMatch) {
  let inner = fetchMissingSamplesMatch[0];
  inner = inner.replace(/\]\);/g, ']);\n');
  masterStatesLines += '\n  ' + inner.replace(/\n/g, '\n  ') + '\n';
  c = c.replace(fetchMissingSamplesMatch[0] + '\n', '');
}

// also find handlers
const handlers = c.match(/const handleAdd[a-zA-Z]+Master = .*?\n/g) || [];
handlers.forEach(h => {
  masterStatesLines += '\n  ' + h;
  c = c.replace(h, '');
  const m = h.match(/const (handleAdd[a-zA-Z]+Master)/);
  if (m) returnedStateVars.push(m[1]);
});

const setterHandlers = c.match(/const handleSet[a-zA-Z]+Masters = .*?\n/g) || [];
setterHandlers.forEach(h => {
  masterStatesLines += '\n  ' + h;
  c = c.replace(h, '');
  const m = h.match(/const (handleSet[a-zA-Z]+Masters)/);
  if (m) returnedStateVars.push(m[1]);
});

const fileContent = `import { useState, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { ColorMaster, SizeMaster, DimensionMaster, BomMaster, ParsedVoucher } from '../types';
import { useNotifications } from '../../context/NotificationContext';

${extractedKeys}

export const useMasterState = (allVouchers: ParsedVoucher[]) => {
  const { addNotification } = useNotifications();

${masterStatesLines}

  return {
    ${returnedStateVars.join(',\n    ')}
  };
};
`;

fs.writeFileSync('src/app/hooks/useMasterState.ts', fileContent);

// Add import inside useAppLogic
c = c.replace("import { safeJsonParse, useStorageState } from './hooks/useStorageState';", "import { safeJsonParse, useStorageState } from './hooks/useStorageState';\nimport { useMasterState } from './hooks/useMasterState';");

// Inside useAppLogic function
const insertionPoint = c.indexOf('const { addNotification }');
c = c.slice(0, insertionPoint + 26) + '\n  const masterState = useMasterState(allVouchers);\n  const { ' + returnedStateVars.join(', ') + ' } = masterState;\n' + c.slice(insertionPoint + 26);

// Remove the returned vars from useAppLogic's return block
returnedStateVars.forEach(v => {
  const r = new RegExp(`\\s+${v},\\n`);
  c = c.replace(r, '\n');
});

// Since we destructure them, we can still just add ...masterState at the end
c = c.replace('handleViewChange,\n  };', 'handleViewChange,\n    ...masterState,\n  };');

fs.writeFileSync('src/app/useAppLogic.tsx', c);

console.log('done splitting useMasterState!');
