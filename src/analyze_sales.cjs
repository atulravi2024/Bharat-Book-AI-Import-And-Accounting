const fs = require('fs');

const file = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx';
const content = fs.readFileSync(file, 'utf8');

// Find the boundaries
// 1. imports
const importsRegex = /^import .*;/gm;
let imports = [];
let match;
while ((match = importsRegex.exec(content)) !== null) {
  imports.push(match[0]);
}
const importStr = imports.join('\n');

// 2. safeJsonParse
const safeJsonParseStartIndex = content.indexOf('// Safe JSON parse helper');
const interfaceStartIndex = content.indexOf('interface VoucherEntryViewProps');

const helperCode = content.substring(safeJsonParseStartIndex, interfaceStartIndex);

// 3. interface
const componentStartIndex = content.indexOf('export const SalesVoucher: React.FC<VoucherEntryViewProps> = ({');
const interfaceCode = content.substring(interfaceStartIndex, componentStartIndex);

// 4. component body
const bodyStartIndex = content.indexOf('{', componentStartIndex) + 1;
// we find the last closing brace for the component body.
const lastBraceIndex = content.lastIndexOf('}');
const componentBody = content.substring(bodyStartIndex, lastBraceIndex);

// Let's divide the component body
// It starts with const { t, formatNumber...
// Up to renderSalesPurchaseForm
const renderStartIndex = componentBody.indexOf('const renderSalesPurchaseForm = () => (');
const logicCode = componentBody.substring(0, renderStartIndex).trim();

const viewCodeStart = renderStartIndex;
const returnObjStrIndex = componentBody.indexOf('return (', viewCodeStart);
const returnBody = componentBody.substring(returnObjStrIndex);
const renderSalesPurchaseFormStr = componentBody.substring(renderStartIndex, returnObjStrIndex).trim();

console.log({
  helperCodeSize: helperCode.length,
  interfaceCodeSize: interfaceCode.length,
  logicCodeSize: logicCode.length,
  renderStrSize: renderSalesPurchaseFormStr.length,
  returnSize: returnBody.length
});
