const fs = require('fs');
const path = require('path');

const tabs = [
  { id: 'items', label: 'Items', type: 'ItemMaster', prop: 'itemMasters', setter: 'setItemMasters',
    extraProps: 'uomMasters: any[], categoryMasters: any[], brandMasters: any[]',
    th: `
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Classification</th>
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Inventory</th>
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tax & Valuation</th>
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</th>
        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Function / Feature</th>
    `,
    td: `
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            {m.category && <span className="inline-block px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-600 mb-1 dark:bg-gray-800 dark:text-gray-300">{m.category}</span>}
            {m.brand && <div className="text-xs text-gray-500 dark:text-gray-400">{m.brand}</div>}
        </td>
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            {m.uom && <div>UOM: <span className="font-mono">{m.uom}</span></div>}
            {m.stockGroup && <div className="text-xs text-gray-500 dark:text-gray-400">{m.stockGroup}</div>}
        </td>
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            {m.taxRate ? <span className="px-2 py-1 bg-amber-50 text-amber-700 ring-1 ring-amber-100 rounded text-xs font-bold">{m.taxRate}% GST</span> : '-'}
        </td>
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="font-mono font-medium text-gray-900 dark:text-white">{m.salesRate ? \`₹\${m.salesRate.toFixed(2)}\` : '-'}</div>
            {m.purchaseRate ? <div className="text-[11px] text-gray-500 font-mono mt-0.5 dark:text-gray-400">Cost: ₹{m.purchaseRate.toFixed(2)}</div> : null}
        </td>
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            {m.function && <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Func: {m.function}</div>}
            {m.feature && <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">Feat: {m.feature}</div>}
        </td>
    `,
    extraNameDesc: `
        {m.sku && <div className="text-[11px] text-gray-500 font-mono mt-0.5 dark:text-gray-400">SKU: {m.sku}</div>}
        {m.hsnCode && <div className="text-[11px] text-gray-500 font-mono dark:text-gray-400">HSN: {m.hsnCode}</div>}
    `,
    modal: `
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">SKU</label>
            <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Enter SKU..." />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Unit of Measure (UOM)</label>
            <select value={formData.uom || ''} onChange={e => setFormData({...formData, uom: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                <option value="">Select UOM...</option>
                {uomMasters?.map((u: any) => <option key={u.id} value={u.name}>{u.name}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Tax Rate (%)</label>
            <input type="number" value={formData.taxRate || 0} onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">HSN Code</label>
            <input type="text" value={formData.hsnCode || ''} onChange={e => setFormData({...formData, hsnCode: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Enter HSN..." />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Category</label>
            <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                <option value="">Select Category...</option>
                {categoryMasters?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Brand</label>
            <select value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                <option value="">Select Brand...</option>
                {brandMasters?.map((b: any) => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Purchase Rate</label>
            <input type="number" value={formData.purchaseRate || ''} onChange={e => setFormData({...formData, purchaseRate: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="0.00" />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Sales Rate</label>
            <input type="number" value={formData.salesRate || ''} onChange={e => setFormData({...formData, salesRate: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="0.00" />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Function</label>
            <input type="text" value={formData.function || ''} onChange={e => setFormData({...formData, function: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="E.g., Engine Part" />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Feature</label>
            <input type="text" value={formData.feature || ''} onChange={e => setFormData({...formData, feature: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="E.g., High Durability" />
        </div>
    `
  },
  { id: 'warehouse', label: 'Warehouses', type: 'WarehouseMaster',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Location & Details</th>`,
    td: `
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="font-medium text-xs">{m.location || '-'}</div>
            <div className="flex space-x-2 mt-1">
                {m.capacity && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Cap: {m.capacity}</span>}
                {m.contactPerson && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium dark:bg-gray-700 dark:text-gray-300">Contact: {m.contactPerson}</span>}
            </div>
        </td>
    `,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Location</label><input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Location..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Capacity</label><input type="number" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Capacity..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Contact Person</label><input type="text" value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Contact Person..." /></div>
        <div className="flex items-center mt-6"><input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" /><label className="text-sm text-gray-700 dark:text-gray-300">Is Active</label></div>
    `
  },
  { id: 'uoms', label: 'UOMs', type: 'UomMaster',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Symbol</th>`,
    td: `<td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs dark:bg-gray-800">{m.symbol || '-'}</span></td>`,
    modal: `
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Symbol</label>
            <input type="text" value={formData.symbol || ''} onChange={e => setFormData({...formData, symbol: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="e.g. KG, PCS..." />
        </div>
    `
  },
  { id: 'stockGroup', label: 'Stock Groups', type: 'StockGroupMaster',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
    td: `<td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>`
  },
  { id: 'gst', label: 'HSN', type: 'GstMaster',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rate & Type</th>`,
    td: `
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-mono bg-amber-50 text-amber-700 ring-1 ring-amber-100 px-2 py-1 rounded text-xs font-bold mr-2">{m.rate ? \`\${m.rate}%\` : '-'}</span>
            <span className="text-xs uppercase tracking-widest text-gray-500">{m.type || '-'}</span>
        </td>
    `,
    modal: `
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Rate (%)</label>
            <input type="number" value={formData.rate || 0} onChange={e => setFormData({...formData, rate: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Type</label>
            <select value={formData.type || 'Goods'} onChange={e => setFormData({...formData, type: e.target.value as 'Goods'|'Services'})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800">
                <option value="Goods">Goods</option>
                <option value="Services">Services</option>
            </select>
        </div>
    `
  },
  { id: 'brands', label: 'Brands', type: 'BrandMaster',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand Info</th>`,
    td: `
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex space-x-2">
                {m.tier && <span className={\`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase \${m.tier==='Premium' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}\`}>{m.tier}</span>}
                {m.origin && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{m.origin}</span>}
            </div>
            {m.manufacturer && <div className="text-[11px] mt-1 text-gray-500 font-medium line-clamp-1">{m.manufacturer}</div>}
            {m.website && <div className="text-[10px] mt-0.5 text-blue-500"><a href={m.website} target="_blank" rel="noreferrer" className="hover:underline">{m.website}</a></div>}
        </td>
    `,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Origin</label><input type="text" value={formData.origin || ''} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Origin..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Manufacturer</label><input type="text" value={formData.manufacturer || ''} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Manufacturer..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Website</label><input type="url" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Website URL..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Tier</label><select value={formData.tier || ''} onChange={e => setFormData({...formData, tier: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800"><option value="">Select Tier...</option><option value="Premium">Premium</option><option value="Economy">Economy</option><option value="Budget">Budget</option></select></div>
    `
  },
  { id: 'categories', label: 'Categories', type: 'CategoryMaster',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tree & Status</th>`,
    td: `
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex space-x-2">
                <span className={\`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase \${m.status==='Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}\`}>{m.status || 'Active'}</span>
            </div>
            {m.parentCategory && <div className="text-[11px] mt-1 text-gray-500 font-medium">Parent: {m.parentCategory}</div>}
            {m.hsnCode && <div className="text-[10px] mt-0.5 font-mono text-gray-400">HSN: {m.hsnCode}</div>}
        </td>
    `,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Parent Category</label><input type="text" value={formData.parentCategory || ''} onChange={e => setFormData({...formData, parentCategory: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Parent Category..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Default HSN Code</label><input type="text" value={formData.hsnCode || ''} onChange={e => setFormData({...formData, hsnCode: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="HSN Code..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Status</label><select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-700 dark:bg-gray-800"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
    `
  },
  { id: 'color', label: 'Colors', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Hex View</th>`,
    td: `
        <td className="p-4 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{backgroundColor: m.hex || '#000'}}></div>
                <span className="font-mono text-xs">{m.hex}</span>
            </div>
        </td>
    `,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Hex Code</label><div className="flex items-center space-x-2"><input type="color" value={formData.hex || '#000000'} onChange={e => setFormData({...formData, hex: e.target.value})} className="w-10 h-10 border-0 rounded cursor-pointer" /><input type="text" value={formData.hex || ''} onChange={e => setFormData({...formData, hex: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="#000000" /></div></div>
    `
  },
  { id: 'size', label: 'Sizes', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Code</th>`,
    td: `<td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs dark:text-white dark:bg-gray-800">{m.code || '-'}</span></td>`,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">code</label><input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="XL, XXL, 42, etc..." /></div>
    `
  },
  { id: 'grades', label: 'Grades', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Quality Score</th>`,
    td: `<td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-bold text-gray-900 text-sm dark:text-white">{m.qualityScore ? \`\${m.qualityScore} / 10\` : '-'}</span></td>`,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Quality Score (1-10)</label><input type="number" min="1" max="10" value={formData.qualityScore || ''} onChange={e => setFormData({...formData, qualityScore: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Score..." /></div>
    `
  },
  { id: 'dimension', label: 'Dimensions', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">L x W x H</th>`,
    td: `<td className="p-4 text-sm text-gray-700 dark:text-gray-200"><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">{m.l || 0} x {m.w || 0} x {m.h || 0} {m.unit || ''}</span></td>`,
    modal: `
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Length</label><input type="number" value={formData.l || ''} onChange={e => setFormData({...formData, l: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Length..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Width</label><input type="number" value={formData.w || ''} onChange={e => setFormData({...formData, w: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Width..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Height</label><input type="number" value={formData.h || ''} onChange={e => setFormData({...formData, h: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="Height..." /></div>
        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 dark:text-gray-400">Unit</label><input type="text" value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700" placeholder="cm, in, m..." /></div>
    `
  },
  { id: 'variant', label: 'Variants', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
    td: `<td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>`
  },
  { id: 'sku', label: 'SKUs', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
    td: `<td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>`
  },
  { id: 'priceList', label: 'Price List', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
    td: `<td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>`
  },
  { id: 'weight', label: 'Weights', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
    td: `<td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>`
  },
  { id: 'volume', label: 'Volumes', type: 'any',
    th: `<th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details / Description</th>`,
    td: `<td className="p-4 text-xs text-gray-500 dark:text-gray-400">{m.description || '-'}</td>`
  }
];

const outDir = path.join(__dirname, 'components/Masters/ItemMaster/Tabs');

tabs.forEach(tab => {
    const componentName = tab.label.replace(/\s+/g, '') + 'Tab';
    const extraPropsStr = tab.extraProps ? `, ${tab.extraProps}` : '';
    const extraPropsDestruct = tab.extraProps ? `, ${tab.extraProps.split(',').map(s => s.split(':')[0].trim()).join(', ')}` : '';

    const content = `import React, { useState, useMemo } from 'react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, CancelIcon } from '../../../../icons/IconComponents';

interface ${componentName}Props {
    data: any[];
    onSave: (items: any[]) => void;${extraPropsStr ? `\n    ${tab.extraProps.replace(/, /g, ';\n    ')};` : ''}
}

export const ${componentName}: React.FC<${componentName}Props> = ({ data, onSave${extraPropsDestruct} }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

    const filteredData = useMemo(() => {
        return (data || []).filter((m: any) => 
            String(m.name || m.code || m.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const handleSave = () => {
        if (!formData.name?.trim() && !formData.code?.trim()) return;
        const newList = editingId 
            ? data.map((m: any) => m.id === editingId ? { ...formData } : m)
            : [...data, { ...formData, id: \`\${Date.now()}\` }];
        onSave(newList);
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({});
    };

    const confirmDelete = () => {
        if (!deleteConfirmation) return;
        onSave(data.filter((m: any) => m.id !== deleteConfirmation.id));
        setDeleteConfirmation(null);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center dark:bg-gray-800/30 dark:border-gray-800">
                <div className="relative max-w-md w-full mr-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search ${tab.label}..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={() => { setEditingId(null); setFormData({name:''}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center text-xs shadow-md whitespace-nowrap hover:bg-blue-700 active:scale-95 transition-all">
                    <AddIcon className="mr-2" /> Add ${tab.label.slice(0, tab.label.endsWith('s') ? -1 : undefined)}
                </button>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
                {filteredData.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Code</th>
                                ${tab.th || ''}
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-800">
                            {filteredData.map((m: any) => (
                                <tr key={m.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 text-xs shadow-sm ring-1 ring-blue-100">
                                                {m.name?.[0]?.toUpperCase() || m.code?.[0]?.toUpperCase() || 'M'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm font-sans dark:text-white">{m.name || m.code}</div>
                                                ${tab.extraNameDesc || ''}
                                            </div>
                                        </div>
                                    </td>
                                    ${tab.td || ''}
                                    <td className="p-4">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {setEditingId(m.id); setFormData(m); setIsModalOpen(true);}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95" title="Edit"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleteConfirmation({isOpen:true, id:m.id, name:m.name||m.code})} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95" title="Delete"><DeleteIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center flex flex-col justify-center items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
                            <SearchIcon className="text-gray-300 text-3xl" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No data found matching your search</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[1.25rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh] dark:bg-gray-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800">
                            <h2 className="font-bold text-xl text-gray-900 flex items-center dark:text-white">
                                {editingId ? 'Edit' : 'Add'} ${tab.label.slice(0, tab.label.endsWith('s') ? -1 : undefined)}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-600">
                                <CancelIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name / Code *</label>
                                    <input type="text" value={formData.name || formData.code || ''} onChange={e => setFormData({...formData, name: e.target.value, code: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="Enter name or code..." autoFocus />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Notes</label>
                                    <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 bg-transparent dark:text-white" placeholder="Add any extra details..." />
                                </div>
                                ${tab.modal || ''}
                            </div>
                        </div>

                        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800">
                             <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">Cancel</button>
                             <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmation?.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 dark:bg-gray-800">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <DeleteIcon className="text-3xl" />
                        </div>
                        <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Delete ${tab.label.slice(0, tab.label.endsWith('s') ? -1 : undefined)}?</h2>
                        <p className="text-gray-500 mb-6 text-sm dark:text-gray-400">Are you sure you want to delete "{deleteConfirmation.name}"?</p>
                        <div className="flex space-x-3">
                             <button onClick={() => setDeleteConfirmation(null)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 hover:dark:bg-gray-700 transition">Cancel</button>
                             <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
`;
    fs.writeFileSync(path.join(outDir, componentName + '.tsx'), content);
});

console.log('done splitting item master correctly');
