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

// PriceListTab.tsx
processFile('PriceListTab.tsx', [
[
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Settings & Validity</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing Strategy</th>`,
`<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Name</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Code</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Status</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Description / Type</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Currency</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Default</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Industry</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Group</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Valid From</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Valid To</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Base List</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Adjustment</th>`
],
[
`<td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100 flex-shrink-0">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white flex items-center gap-2">
                                                    {m.name || m.code}
                                                    {m.status === 'Active' ? (
                                                        <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>
                                                    ) : m.status === 'Draft' ? (
                                                        <span className="w-2 h-2 rounded-full bg-gray-300" title="Draft"></span>
                                                    ) : m.status === 'Inactive' ? (
                                                        <span className="w-2 h-2 rounded-full bg-red-400" title="Inactive"></span>
                                                    ) : null}
                                                </div>
                                                <div className="text-[11px] text-gray-500 mt-0.5 max-w-[200px] truncate dark:text-gray-400" title={m.description}>{m.description || m.type || 'Sales'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="flex space-x-2 items-center mb-1.5 flex-wrap gap-1">
                                            {m.currency && <span className="font-mono text-[10px] uppercase font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">{m.currency}</span>}
                                            {m.isDefault && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Default</span>}
                                            {m.industry && <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">{m.industry}</span>}
                                            {m.applicableGroup && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">{m.applicableGroup}</span>}
                                        </div>
                                        {(m.validFrom || m.validTo) && (
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 py-0.5 px-1.5 rounded inline-block dark:bg-gray-800">
                                                <span className="font-medium mr-1 text-gray-400">VALID:</span>
                                                {m.validFrom || 'Ever'} {m.validTo && <span className="text-gray-400 mx-1">→</span>} {m.validTo || (m.validFrom ? 'Onwards' : '')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                        {m.basePriceList ? (
                                            <div className="text-[11px]">
                                                <span className="text-gray-500 block mb-0.5">Based on <strong className="text-gray-700 dark:text-gray-300 font-mono">{data?.find(p=>p.id === m.basePriceList)?.name || 'Base'}</strong></span>
                                                {m.adjustmentType !== 'None' && m.adjustmentValue ? (
                                                    <span className={\`font-bold inline-flex items-center px-1.5 py-0.5 rounded \${m.adjustmentValue > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}\`}>
                                                        {m.adjustmentValue > 0 ? '+' : ''}{m.adjustmentValue}{m.adjustmentType === 'Percentage' ? '%' : \` \${m.currency || ''}\`}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 font-medium italic">Exact Match</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-[11px] text-gray-500 font-medium italic dark:text-gray-400">
                                                Standalone Pricing
                                            </div>
                                        )}
                                    </td>`,
`<td className="p-4 whitespace-nowrap font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.code}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.status === 'Active' ? (
                <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold text-[10px] uppercase">Active</span>
            ) : m.status === 'Draft' ? (
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold text-[10px] uppercase">Draft</span>
            ) : m.status === 'Inactive' ? (
                <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[10px] uppercase">Inactive</span>
            ) : null}
        </td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.description || m.type || 'Sales'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.currency && <span className="font-mono text-[10px] uppercase font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">{m.currency}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.isDefault && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Yes</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.industry && <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800">{m.industry}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{m.applicableGroup && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-medium dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">{m.applicableGroup}</span>}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.validFrom || '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.validTo || '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 font-mono">{m.basePriceList ? (data?.find(p=>p.id === m.basePriceList)?.name || 'Base') : '-'}</td>
        <td className="p-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
            {m.basePriceList && m.adjustmentType !== 'None' && m.adjustmentValue ? (
                <span className={\`font-bold inline-flex items-center px-1.5 py-0.5 rounded \${m.adjustmentValue > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}\`}>
                    {m.adjustmentValue > 0 ? '+' : ''}{m.adjustmentValue}{m.adjustmentType === 'Percentage' ? '%' : \` \${m.currency || ''}\`}
                </span>
            ) : m.basePriceList ? (
                <span className="text-gray-400 font-medium italic">Exact Match</span>
            ) : (
                <span className="text-gray-400 font-medium italic">-</span>
            )}
        </td>`
]
]);
