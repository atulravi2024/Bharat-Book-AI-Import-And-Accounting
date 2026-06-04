const fs = require('fs');

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

let hookPath = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher/hooks/useSalesVoucherLogic.tsx';
let hookContent = fs.readFileSync(hookPath, 'utf8');

// remove old return block
hookContent = hookContent.replace(/return \{\n.*\n\ \ \};\n\};\n/s, '');
hookContent += '  return {\n    ' + vars.join(',\n    ') + '\n  };\n};\n';

fs.writeFileSync(hookPath, hookContent);

let indexPath = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher/index.tsx';
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(/const \{ fileInputRef \} = logic;/g, 'const { ' + vars.join(', ') + ' } = logic;');
fs.writeFileSync(indexPath, indexContent);
console.log('Fixed');
