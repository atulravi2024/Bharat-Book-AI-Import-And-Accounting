const fs = require('fs');
const path = require('path');

const targets = [
  'ContraVoucher',
  'CreditNoteVoucher',
  'DebitNoteVoucher',
  'JournalVoucher',
  'PaymentVoucher',
  'ReceiptVoucher'
];

targets.forEach(targetName => {
  const sourceFile = "src/components/Operations/VoucherEntry/vouchers/" + targetName + ".tsx";
  const bakFile = sourceFile + ".bak";

  if (!fs.existsSync(bakFile)) {
    fs.copyFileSync(sourceFile, bakFile);
  }

  let content = fs.readFileSync(bakFile, 'utf8');

  const baseDir = "src/components/Operations/VoucherEntry/vouchers/" + targetName;
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
  if (!fs.existsSync(path.join(baseDir, 'hooks'))) fs.mkdirSync(path.join(baseDir, 'hooks'));
  if (!fs.existsSync(path.join(baseDir, 'views'))) fs.mkdirSync(path.join(baseDir, 'views'));

  // Extract logic and fix imports
  const importsRegex = /^import .*?;/gm;
  let imports = [];
  let match;
  while ((match = importsRegex.exec(content)) !== null) { imports.push(match[0]); }
  
  let importStr = imports.map(line => {
    if (line.includes("'./VoucherCalculations'")) return line.replace("'./VoucherCalculations'", "'../VoucherCalculations'");
    if (line.includes("'../components/")) return line.replace("'../components/", "'../../components/");
    if (line.includes("'../../NewItemModal'")) return line.replace("'../../NewItemModal'", "'../../../NewItemModal'");
    if (line.includes("'../../BarcodeScannerModal'")) return line.replace("'../../BarcodeScannerModal'", "'../../../BarcodeScannerModal'");
    if (line.includes("'../VoucherPreview'")) return line.replace("'../VoucherPreview'", "'../../VoucherPreview'");
    if (line.includes("'../../../ui/")) return line.replace("'../../../ui/", "'../../../../ui/");
    if (line.includes("'../../../../context/")) return line.replace("'../../../../context/", "'../../../../../context/");
    if (line.includes("'../../../../app/types'")) return line.replace("'../../../../app/types'", "'../../../../../app/types'");
    if (line.includes("'../../../../services/")) return line.replace("'../../../../services/", "'../../../../../services/");
    return line;
  }).join('\n');

  let safeJsonParseStr = "const safeJsonParse = <T,>(jsonString: string | null, defaultValue: T): T => {\n" +
  "  if (!jsonString) return defaultValue;\n" +
  "  try { return JSON.parse(jsonString) as T; } \n" +
  "  catch (e) { return defaultValue; }\n" +
  "};";

  content = content.replace(/const safeJsonParse[\s\S]*?catch \(e\) \{\s*return defaultValue;\s*\}\s*\};/m, '');

  const interfaceStartIndex = content.indexOf('interface VoucherEntryViewProps');
  let componentStartIndex = content.indexOf("export const " + targetName + ": React.FC<");
  
  let interfaceCode = content.substring(interfaceStartIndex, componentStartIndex);
  // Special JournalVoucher props logic
  let propType = "VoucherEntryViewProps";
  let propsDestruct = "{ defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings }";
  if (targetName === 'JournalVoucher') {
     propType = "AccountingVoucherProps";
     propsDestruct = "{ type = 'journal', defaultType, initialVoucher, itemMasters = [], ledgerMasters = [], partyMasters = [], vouchers = [], onUpdateItemMaster, onAddItemMaster, onSaveEntry, onDeleteEntry, onOpenPrintSettings }";
  }

  const bodyStartIndex = content.indexOf('{', componentStartIndex) + 1;
  const lastBraceIndex = content.lastIndexOf('}');
  const componentBodyStr = content.substring(bodyStartIndex, lastBraceIndex);

  let renderStartIndex = componentBodyStr.indexOf('const renderSalesPurchaseForm = () => (');
  if (renderStartIndex === -1) renderStartIndex = componentBodyStr.indexOf('const renderEntryForm = () => (');
  if (renderStartIndex === -1) renderStartIndex = componentBodyStr.indexOf('const renderJournalForm = () => (');
  if (renderStartIndex === -1) renderStartIndex = componentBodyStr.indexOf('const renderContraForm = () => (');
  if (renderStartIndex === -1) renderStartIndex = componentBodyStr.indexOf('const renderAccountingForm = () => (');
  
  if (renderStartIndex === -1) {
    console.log('Failed to find render method in ', targetName);
    process.exit(1);
  }

  let logicCode = componentBodyStr.substring(0, renderStartIndex).trim();
  logicCode = logicCode.replace(/^.*?\}\) => \{\n/m, '');

  const returnObjStrIndex = componentBodyStr.indexOf('return (', renderStartIndex);
  const renderFormStr = componentBodyStr.substring(renderStartIndex, returnObjStrIndex).trim();
  const returnBody = componentBodyStr.substring(returnObjStrIndex);

  const vars = [
    't', 'formatNumber', 'activeTab', 'setActiveTab', 'showNewItemModal', 'setShowNewItemModal', 'showScanner', 'setShowScanner', 'scanningRowIndex', 'setScanningRowIndex', 'handleBarcodeScanned', 'rows', 'setRows', 'handleItemOrSkuChange', 'headerDetails', 'setHeaderDetails', 'systemStamp', 'formError', 'setFormError', 'attachedFile', 'setAttachedFile', 'fileInputRef', 'saveOptionsOpen', 'setSaveOptionsOpen', 'editingRowIndex', 'setEditingRowIndex', 'expandedRowSection', 'setExpandedRowSection', 'totals', 'handleHeaderChange', 'handleFileChange', 'validateVoucher', 'getEnrichedRows', 'saveVoucher', 'notification', 'setNotification', 'showNotify', 'handleSaveInfoResult', 'handleSave', 'handleSaveNew', 'handleSavePrint', 'handleSaveDraft', 'showPreview', 'setShowPreview', 'isPrinting', 'setIsPrinting', 'showCalculator', 'setShowCalculator', 'handlePreview', 'isSection0Collapsed', 'setIsSection0Collapsed', 'isSection1Collapsed', 'setIsSection1Collapsed', 'isSection2Collapsed', 'setIsSection2Collapsed', 'isSection3Collapsed', 'setIsSection3Collapsed', 'currentRecordId', 'setCurrentRecordId', 'loadRecord', 'handleNavigate', 'handleDuplicateEntry', 'showHelp', 'setShowHelp', 'showKeyboardShortcuts', 'setShowKeyboardShortcuts', 'showHistory', 'setShowHistory', 'showDeleteConfirm', 'setShowDeleteConfirm', 'showClearConfirm', 'setShowClearConfirm', 'handleDeleteEntryClick', 'handleConfirmDelete', 'handleClearEntryClick', 'handleConfirmClear', 'handleNewEntry', 'handleGeneratePDF', 'handleGenerateImage', 'collapsedSections', 'setCollapsedSections', 'showRequirements', 'setShowRequirements', 'toggleSection'
  ];

  let hookImport = "import React, { useState, useEffect, useRef } from 'react';\n" +
  "import { useLanguage } from '../../../../../../context/LanguageContext';\n" +
  "import { getNextVoucherNumber, incrementVoucherNumber } from '../../../../../../services/voucherNumbering';\n" +
  "import { toPng } from 'html-to-image';\n" +
  "import { jsPDF } from 'jspdf';\n" +
  "import { " + propType + (propType !== 'VoucherEntryViewProps' ? ", VoucherEntryViewProps" : "") + " } from '../types';\n" +
  "import { VoucherType } from '../../../../../../app/types';\n" +
  "import { NotificationType } from '../../../../../ui/Notification';\n" +
  "import { calculateRowAmountBeforePreTaxRoundOff, calculateRowAmount, getRowPostTaxDiscount, getRowRoundOff, getRowPreTaxRoundOff, calculateRowNetAmount } from '../../VoucherCalculations';\n";

  fs.writeFileSync(path.join(baseDir, 'hooks', "use" + targetName + "Logic.tsx"),
    hookImport + "\n\n" + safeJsonParseStr + "\n\n" +
    "export const use" + targetName + "Logic = (props: " + propType + ") => {\n" +
    "  const " + propsDestruct + " = props;\n" +
    logicCode + "\n\n" +
    "  return {\n    " + vars.join(',\n    ') + "\n  };\n};\n"
  );

  fs.writeFileSync(path.join(baseDir, 'types.ts'), "\nexport " + interfaceCode + "\n");

  importStr = importStr.replace(/import \{ Notification, NotificationType \} from '\.\.\/\.\.\/\.\.\/\.\.\/ui\/Notification';/, "import { Notification } from '../../../../ui/Notification';");
  importStr = importStr.replace(/import React, \{ useState, useEffect \} from 'react';/, "");
  importStr = importStr.replace(/import \{ useLanguage \} from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/context\/LanguageContext';/, "");
  importStr = importStr.replace(/import \{ getNextVoucherNumber, incrementVoucherNumber \} from '\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/services\/voucherNumbering';/, "");

  fs.writeFileSync(path.join(baseDir, 'index.tsx'),
    "import React from 'react';\n" +
    importStr + "\n" +
    "import { use" + targetName + "Logic } from './hooks/use" + targetName + "Logic';\n" +
    "import { " + propType + " } from './types';\n\n" +
    "export const " + targetName + ": React.FC<" + propType + "> = (props) => {\n" +
    "  const logic = use" + targetName + "Logic(props);\n" +
    "  const { " + vars.join(', ') + " } = logic;\n" +
    "  const " + propsDestruct + " = props;\n\n" +
    renderFormStr + "\n\n" +
    returnBody + "\n}\n"
  );
  if (fs.existsSync(sourceFile)) fs.renameSync(sourceFile, sourceFile + ".old");
  console.log('Regenerated cleanly for', targetName);
});
