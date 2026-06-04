const fs = require('fs');

let a = fs.readFileSync('src/app/useAppLogic.tsx', 'utf8');

// The orphaned code blocks:
const partyBlock = `      if (!partyMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newParty: any = {
            id: \`p-\${Date.now()}\`,
            name,
            type: 'Vendor'
        };
        setPartyMasters((prev: any) => [...prev, newParty]);
    }
  };`;

const ledgerBlock = `      if (!ledgerMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newLedger: any = {
            id: \`l-\${Date.now()}\`,
            name,
            group: 'Indirect Expenses'
        };
        setLedgerMasters((prev: any) => [...prev, newLedger]);
    }
  };`;

const uomBlock = `      if (!uomMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase() || String(m.symbol || '').toLowerCase() === name.toLowerCase())) {
        const newUom: any = {
            id: \`u-\${Date.now()}\`,
            name,
            symbol: name.substring(0, 3).toUpperCase()
        };
        setUomMasters((prev: any) => [...prev, newUom]);
    }
  };`;

const itemBlock = `      if (!itemMasters.some((m: any) => String(m.name || '').toLowerCase() === name.toLowerCase())) {
        const newItem: any = {
            id: \`i-\${Date.now()}\`,
            name,
            taxRate: 18,
            uom: 'Nos'
        };
        setItemMasters((prev: any) => [...prev, newItem]);
    }
  };`;

// replace them from useAppLogic
a = a.replace(partyBlock, '');
a = a.replace(ledgerBlock, '');
a = a.replace(uomBlock, '');
a = a.replace(itemBlock, '');

fs.writeFileSync('src/app/useAppLogic.tsx', a);

let m = fs.readFileSync('src/app/hooks/useMasterState.ts', 'utf8');
m = m.replace('const handleAddPartyMaster = (name: string) => {', 'const handleAddPartyMaster = (name: string) => {\n' + partyBlock);
m = m.replace('const handleAddLedgerMaster = (name: string) => {', 'const handleAddLedgerMaster = (name: string) => {\n' + ledgerBlock);
m = m.replace('const handleAddUomMaster = (name: string) => {', 'const handleAddUomMaster = (name: string) => {\n' + uomBlock);
m = m.replace('const handleAddItemMaster = (name: string) => {', 'const handleAddItemMaster = (name: string) => {\n' + itemBlock);

fs.writeFileSync('src/app/hooks/useMasterState.ts', m);

console.log('Fixed handlers!');
