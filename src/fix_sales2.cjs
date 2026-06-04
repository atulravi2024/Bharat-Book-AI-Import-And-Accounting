const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const file = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx.bak';
const content = fs.readFileSync(file, 'utf8');

const baseDir = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher';
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

const vars = [
  't',
  'formatNumber',
  'activeTab',
  'setActiveTab',
  'showNewItemModal',
  'setShowNewItemModal',
  'showScanner',
  'setShowScanner',
  'scanningRowIndex',
  'setScanningRowIndex',
  'handleBarcodeScanned',
  'rows',
  'setRows',
  'handleItemOrSkuChange',
  'headerDetails',
  'setHeaderDetails',
  'systemStamp',
  'formError',
  'setFormError',
  'attachedFile',
  'setAttachedFile',
  'fileInputRef',
  'saveOptionsOpen',
  'setSaveOptionsOpen',
  'editingRowIndex',
  'setEditingRowIndex',
  'expandedRowSection',
  'setExpandedRowSection',
  'totals',
  'handleHeaderChange',
  'handleFileChange',
  'validateVoucher',
  'getEnrichedRows',
  'saveVoucher',
  'notification',
  'setNotification',
  'showNotify',
  'handleSaveInfoResult',
  'handleSave',
  'handleSaveNew',
  'handleSavePrint',
  'handleSaveDraft',
  'showPreview',
  'setShowPreview',
  'isPrinting',
  'setIsPrinting',
  'showCalculator',
  'setShowCalculator',
  'handlePreview',
  'isSection0Collapsed',
  'setIsSection0Collapsed',
  'isSection1Collapsed',
  'setIsSection1Collapsed',
  'isSection2Collapsed',
  'setIsSection2Collapsed',
  'isSection3Collapsed',
  'setIsSection3Collapsed',
  'currentRecordId',
  'setCurrentRecordId',
  'loadRecord',
  'handleNavigate',
  'handleDuplicateEntry',
  'showHelp',
  'setShowHelp',
  'showKeyboardShortcuts',
  'setShowKeyboardShortcuts',
  'showHistory',
  'setShowHistory',
  'showDeleteConfirm',
  'setShowDeleteConfirm',
  'showClearConfirm',
  'setShowClearConfirm',
  'handleDeleteEntryClick',
  'handleConfirmDelete',
  'handleClearEntryClick',
  'handleConfirmClear',
  'handleNewEntry',
  'handleGeneratePDF',
  'handleGenerateImage',
  'collapsedSections',
  'setCollapsedSections',
  'showRequirements',
  'setShowRequirements',
  'toggleSection'
];

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
"  return {\n    " + vars.join(',\n    ') + "\n  };\n};\n"
);
console.log('Hook generated');
