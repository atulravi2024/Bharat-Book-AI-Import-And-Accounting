const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const file = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx';
const content = fs.readFileSync(file, 'utf8');

const baseDir = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucherFeature';
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
if (!fs.existsSync(path.join(baseDir, 'hooks'))) fs.mkdirSync(path.join(baseDir, 'hooks'));
if (!fs.existsSync(path.join(baseDir, 'views'))) fs.mkdirSync(path.join(baseDir, 'views'));

// Find start markers
const importsRegex = /^import .*?;/gm;
let imports = [];
let match;
while ((match = importsRegex.exec(content)) !== null) { imports.push(match[0]); }
let importStr = imports.join('\n');

const safeJsonParseStartIndex = content.indexOf('// Safe JSON parse helper');
const interfaceStartIndex = content.indexOf('interface VoucherEntryViewProps');
const componentStartIndex = content.indexOf('export const SalesVoucher: React.FC<VoucherEntryViewProps> = ({');
const helperCode = content.substring(safeJsonParseStartIndex, interfaceStartIndex);
const interfaceCode = content.substring(interfaceStartIndex, componentStartIndex);

const bodyStartIndex = content.indexOf('{', componentStartIndex) + 1;
const lastBraceIndex = content.lastIndexOf('}');
const componentBodyStr = content.substring(bodyStartIndex, lastBraceIndex);

const renderStartIndex = componentBodyStr.indexOf('const renderSalesPurchaseForm = () => (');
const logicCode = componentBodyStr.substring(0, renderStartIndex).trim();

const returnObjStrIndex = componentBodyStr.indexOf('return (', renderStartIndex);
const renderSalesPurchaseFormStr = componentBodyStr.substring(renderStartIndex, returnObjStrIndex).trim();
const returnBody = componentBodyStr.substring(returnObjStrIndex);

const sourceFile = ts.createSourceFile('temp.tsx', logicCode, ts.ScriptTarget.Latest, true);
let topLevelVars = new Set();
sourceFile.statements.forEach(stmt => {
  if (ts.isVariableStatement(stmt)) {
    stmt.declarationList.declarations.forEach(d => {
      if (ts.isIdentifier(d.name)) topLevelVars.add(d.name.text);
      else if (ts.isArrayBindingPattern(d.name) || ts.isObjectBindingPattern(d.name)) {
        d.name.elements.forEach(el => {
          if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) topLevelVars.add(el.name.text);
        });
      }
    });
  } else if (ts.isFunctionDeclaration(stmt) && stmt.name) {
    topLevelVars.add(stmt.name.text);
  }
});

let varsArray = Array.from(topLevelVars);
varsArray = varsArray.filter(v => ['tabs'].indexOf(v) === -1);
if (!varsArray.includes('fileInputRef')) varsArray.push('fileInputRef');

// Generate types.ts
fs.writeFileSync(path.join(baseDir, 'types.ts'), "\nexport " + interfaceCode + "\n");

// Generate hook
fs.writeFileSync(path.join(baseDir, 'hooks', 'useSalesVoucherLogic.tsx'),
"import React, { useState, useEffect, useRef } from 'react';\n" +
"import { useLanguage } from '../../../../../context/LanguageContext';\n" +
"import { getNextVoucherNumber, incrementVoucherNumber } from '../../../../../services/voucherNumbering';\n" +
"import { toPng } from 'html-to-image';\n" +
"import { jsPDF } from 'jspdf';\n" +
"import { VoucherEntryViewProps } from '../types';\n\n" +
helperCode + "\n\n" +
"export const useSalesVoucherLogic = (props: VoucherEntryViewProps) => {\n" +
"  const { defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings } = props;\n" +
 logicCode + "\n\n" +
"  return {\n    " + varsArray.join(',\n    ') + "\n  };\n};\n"
);

importStr = importStr.replace(/import \{ useLanguage \} from '..\/..\/..\/..\/context\/LanguageContext';/g, '');

// Generate index
fs.writeFileSync(path.join(baseDir, 'index.tsx'),
"import React from 'react';\n" +
importStr + "\n" +
"import { useSalesVoucherLogic } from './hooks/useSalesVoucherLogic';\n" +
"import { VoucherEntryViewProps } from './types';\n\n" +
"export const SalesVoucherFeature: React.FC<VoucherEntryViewProps> = (props) => {\n" +
"  const logic = useSalesVoucherLogic(props);\n" +
"  const { " + varsArray.join(', ') + " } = logic;\n" +
"  const { defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings } = props;\n\n" +
renderSalesPurchaseFormStr + "\n\n" +
returnBody + "\n}\n"
);
console.log('Done');
