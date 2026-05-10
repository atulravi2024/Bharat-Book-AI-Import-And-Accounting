const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/Masters/ItemMaster/Tabs');

function processFile(filename, replacements) {
    const p = path.join(dir, filename);
    if (!fs.existsSync(p)) return;
    let code = fs.readFileSync(p, 'utf8');
    
    code = code.replace(/<table className="w-full text-left border-collapse">/g, '<table className="w-full text-left border-collapse whitespace-nowrap">');
    
    for (let r of replacements) {
        code = code.split(r[0]).join(r[1]);
    }
    fs.writeFileSync(p, code);
    console.log("Processed " + filename);
}

// SKUsTab.tsx
processFile('SKUsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">SKU Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Item Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Barcode</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex flex-col space-y-1">
                                            {m.skuCode && <span className="font-mono text-xs"><span className="text-gray-400">SKU:</span> {m.skuCode}</span>}
                                            {m.itemCode && <span className="font-mono text-xs"><span className="text-gray-400">Item:</span> {m.itemCode}</span>}
                                            {m.barcode && <span className="font-mono text-xs"><span className="text-gray-400">Barcode:</span> {m.barcode}</span>}
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.skuCode}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.itemCode}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.barcode}</td>`
]
]);

// SizesTab.tsx
processFile('SizesTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Code</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">System</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Category</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex space-x-2 mb-1">
                                            <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs dark:text-white dark:bg-gray-800">{m.code || '-'}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            {m.sizeSystem && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Sys: {m.sizeSystem}</span>}
                                            {m.category && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold dark:bg-purple-900/30 dark:text-purple-400">{m.category}</span>}
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono font-bold"><span className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">{m.code || '-'}</span></td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.sizeSystem && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{m.sizeSystem}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.category && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold dark:bg-purple-900/30 dark:text-purple-400">{m.category}</span>}</td>`
]
]);

// StockGroupsTab.tsx
processFile('StockGroupsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Parent</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Costing</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Tax</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Description</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col space-y-1">
                                            {m.parentGroup && <span className="font-medium text-xs text-gray-600 dark:text-gray-300">Parent: {m.parentGroup}</span>}
                                            <div className="flex space-x-2">
                                                {m.defaultCostingMethod && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-400">Costing: {m.defaultCostingMethod}</span>}
                                                {m.defaultTaxRate ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-medium dark:bg-red-900/30 dark:text-red-400">Tax: {m.defaultTaxRate}%</span> : null}
                                            </div>
                                            <span>{m.description || ''}</span>
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.parentGroup}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.defaultCostingMethod && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/30 dark:text-blue-400">{m.defaultCostingMethod}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.defaultTaxRate ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-600 font-medium dark:bg-red-900/30 dark:text-red-400">{m.defaultTaxRate}%</span> : null}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.description}</td>`
]
]);

// UOMsTab.tsx
processFile('UOMsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Symbol</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Conversion</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Symbol</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Conversion</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs dark:bg-gray-800">{m.symbol || '-'}</span></td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        {m.baseUom ? (
                                            <div className="text-xs">
                                                <span className="font-bold">1 {m.symbol || m.name}</span> = <span className="text-blue-600 font-bold dark:text-blue-400">{m.conversionFactor || 1} {m.baseUom}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Base Unit</span>
                                        )}
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono"><span className="bg-gray-100 px-2 py-1 rounded text-xs dark:bg-gray-800">{m.symbol || '-'}</span></td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.baseUom ? (
                <div className="text-xs">
                    <span className="font-bold">1 {m.symbol || m.name}</span> = <span className="text-blue-600 font-bold dark:text-blue-400">{m.conversionFactor || 1} {m.baseUom}</span>
                </div>
            ) : (
                <span className="text-xs text-gray-400 italic">Base Unit</span>
            )}
        </td>`
]
]);

// VariantsTab.tsx
processFile('VariantsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">SKU</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Color</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Size</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Price Mod</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex flex-col space-y-1">
                                            {m.skuCode && <span className="font-mono text-xs"><span className="text-gray-400">SKU:</span> {m.skuCode}</span>}
                                            <div className="flex space-x-2 mt-1">
                                                {m.colorId && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[10px] dark:bg-gray-800 dark:text-gray-300">Color: {m.colorId}</span>}
                                                {m.sizeId && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[10px] dark:bg-gray-800 dark:text-gray-300">Size: {m.sizeId}</span>}
                                            </div>
                                            {m.priceModifier ? <span className="text-xs text-green-600 font-bold dark:text-green-400">Price Mod: {m.priceModifier > 0 ? '+' : ''}{m.priceModifier}</span> : null}
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.skuCode}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.colorId && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[10px] dark:bg-gray-800 dark:text-gray-300">{m.colorId}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.sizeId && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[10px] dark:bg-gray-800 dark:text-gray-300">{m.sizeId}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.priceModifier ? <span className="text-xs text-green-600 font-bold dark:text-green-400">{m.priceModifier > 0 ? '+' : ''}{m.priceModifier}</span> : null}</td>`
]
]);

// VolumesTab.tsx
processFile('VolumesTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Value</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Description</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex space-x-2 items-center">
                                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs dark:text-white dark:bg-gray-800">{m.value || 0} {m.unit || ''}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{m.description || ''}</span>
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono font-bold">{m.value || 0} {m.unit || ''}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.description}</td>`
]
]);

// WeightsTab.tsx
processFile('WeightsTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Value</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Description</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex space-x-2 items-center">
                                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs dark:text-white dark:bg-gray-800">{m.value || 0} {m.unit || ''}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{m.description || ''}</span>
                                        </div>
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono font-bold">{m.value || 0} {m.unit || ''}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.description}</td>`
]
]);

// WarehousesTab.tsx
processFile('WarehousesTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Location & Details</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Type</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Location</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Address</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Capacity</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Contact Person</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Phone</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="font-medium text-xs mb-1">
                {m.type && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold mr-2 dark:bg-purple-900/30 dark:text-purple-300">{m.type}</span>}
                {m.location || '-'}
            </div>
            {m.address && <div className="text-[10px] text-gray-500 mb-1">{m.address}{m.city ? \`, \${m.city}\` : ''}</div>}
            <div className="flex space-x-2 mt-1">
                {m.capacity && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Cap: {m.capacity}</span>}
                {m.contactPerson && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium dark:bg-gray-700 dark:text-gray-300">Contact: {m.contactPerson}{m.phone ? \` (\${m.phone})\` : ''}</span>}
            </div>
            {!m.isActive && <div className="text-[10px] text-red-500 font-bold mt-1">INACTIVE</div>}
        </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{!m.isActive ? <div className="text-[10px] text-red-500 font-bold mt-1">INACTIVE</div> : <div className="text-[10px] text-green-500 font-bold mt-1 uppercase">ACTIVE</div>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.type && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold dark:bg-purple-900/30 dark:text-purple-300">{m.type}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.location || '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.address}{m.city ? \`, \${m.city}\` : ''}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.capacity && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{m.capacity}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.contactPerson}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.phone}</td>`
]
]);

