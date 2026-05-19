const fs = require('fs');

const dFile = 'src/components/Dashboard/DashboardView.tsx';
let dContent = fs.readFileSync(dFile, 'utf8');

dContent = dContent.replace(
    /type DashboardTab = 'overview' \| 'sales' \| 'purchase' \| 'payment' \| 'receipts' \| 'journal' \| 'contra' \| 'bank';/,
    `type DashboardTab = 'overview' | 'sales' | 'purchase' | 'payment' | 'receipts' | 'journal' | 'contra' | 'bank' | 'inventory';`
);

dContent = dContent.replace(
    /\{\ id:\ 'contra',\ label:\ 'Contra'\ \},/,
    `{ id: 'contra', label: 'Contra' },
    { id: 'inventory', label: 'Inventory' },`
);

// We should also add InventoryTab if we can, but Dashboard rendering has a switch case:
if(!dContent.includes('case \'inventory\':')) {
    dContent = dContent.replace(
        /default:\ return <MainTab[^>]+>;\n\s*\}/,
        `case 'inventory': return <div className="p-4 text-center text-gray-500">Inventory Dashboard Coming Soon</div>;\n            default: return <MainTab stats={stats} isDemo={isDemo} />;
        }`
    );
}

fs.writeFileSync(dFile, dContent);
console.log('Done dashboard!');
