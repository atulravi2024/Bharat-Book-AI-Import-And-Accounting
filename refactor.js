const fs = require('fs');

const path = 'components/Operations/InventoryEntry/InventoryEntryView.tsx';
let data = fs.readFileSync(path, 'utf8');

// Add imports
data = data.replace(
  "import { Notification, NotificationType } from '../../ui/Notification';",
  `import { Notification, NotificationType } from '../../ui/Notification';
import { EntryDetailsSection } from './components/EntryDetailsSection';
import { LocationSection } from './components/LocationSection';
import { PartySection } from './components/PartySection';
import { LogisticsSection } from './components/LogisticsSection';
import { ItemTableSection } from './components/ItemTableSection';
import { AdjustmentsSection } from './components/AdjustmentsSection';
import { SummarySection } from './components/SummarySection';
import { RemarksSection } from './components/RemarksSection';
import { InventoryActionMenu } from './components/InventoryActionMenu';
import { ItemEditModal } from './components/ItemEditModal';`
);

// Delete renderHeaderDetails to right before main return
const renderStartPattern = 'const renderHeaderDetails = () => (';
const renderStart = data.indexOf(renderStartPattern);
const mainReturn = data.indexOf('return (', renderStart + 10);

if (renderStart !== -1 && mainReturn !== -1) {
    data = data.substring(0, renderStart) + data.substring(mainReturn);
}

// Replace exact sections in the main return
const expectedInnerJSX = `{renderHeaderDetails()}
          {renderLocationDetails()}
          {renderPartyDetails()}
          {renderLogisticsDetails()}
          {renderItemTable()}`;

const replacementInnerJSX = `<EntryDetailsSection
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            systemStamp={systemStamp}
            formError={formError}
            showRequirements={showRequirements}
            setShowRequirements={setShowRequirements}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            fileInputRef={fileInputRef}
            attachedFile={attachedFile}
            setAttachedFile={setAttachedFile}
            activeTab={activeTab}
          />
          <LocationSection
            activeTab={activeTab}
            headerDetails={headerDetails}
            warehouseMasters={warehouseMasters}
            handleHeaderChange={handleHeaderChange}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
          <PartySection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            partyMasters={partyMasters}
            handleHeaderChange={handleHeaderChange}
            activeTab={activeTab}
          />
          <LogisticsSection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
          />
          <ItemTableSection
            activeTab={activeTab}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            rows={rows}
            setRows={setRows}
            itemMasters={itemMasters}
            warehouseMasters={warehouseMasters}
            handleItemOrSkuChange={handleItemOrSkuChange}
            setEditingRowIndex={setEditingRowIndex}
            setExpandedRowSection={setExpandedRowSection}
            setShowScanner={setShowScanner}
            setScanningRowIndex={setScanningRowIndex}
            showRequirements={showRequirements}
            setShowNewItemModal={setShowNewItemModal}
          />`;

data = data.replace(expectedInnerJSX, replacementInnerJSX);

// Replace Remarks
const remarksRegex = /<div className=\{`mt-6 bg-white border border-gray-200\/60 shadow-sm relative transition-all duration-300 z-\[20\][\s\S]*?<\/textarea>\n\s*?<\/div>\n\s*?<\/div>\n\s*?<\/div>\n\s*?<\/div>/;
// Let's use a simpler replace strategy for JSX content.
const oldRemarks = '<div className={`mt-6 bg-white border border-gray-200/60 shadow-sm relative transition-all duration-300 z-[20] ${collapsedSections.remarks ? \'px-6 py-3 rounded-xl\' : \'p-6 rounded-2xl\'}`}>';
const oldRemarksEnd = '</div>\n             )}\n          </div>';
const p1 = data.indexOf(oldRemarks);
const p2 = data.indexOf(oldRemarksEnd, p1);
if (p1 !== -1 && p2 !== -1) {
    data = data.substring(0, p1) + `<RemarksSection
             collapsedSections={collapsedSections}
             toggleSection={toggleSection}
             headerDetails={headerDetails}
             handleHeaderChange={handleHeaderChange}
          />` + data.substring(p2 + oldRemarksEnd.length);
}

// Replace Adjustments
const oldAdj = '<div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative mb-6 transition-all duration-300 z-[15] ${collapsedSections.adjustments ? \'px-6 py-3 rounded-xl\' : \'p-6 rounded-3xl\'}`}>';
const oldAdjEnd = '</div>\n            )}\n          </div>';
const a1 = data.indexOf(oldAdj);
const a2 = data.indexOf(oldAdjEnd, a1);
if (a1 !== -1 && a2 !== -1) {
    data = data.substring(0, a1) + `<AdjustmentsSection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            headerDetails={headerDetails}
            handleHeaderChange={handleHeaderChange}
            ledgerMasters={ledgerMasters}
          />` + data.substring(a2 + oldAdjEnd.length);
}

// Replace Summary
const oldSum = '<div className={`bg-white border border-gray-200/60 shadow-sm flex flex-col relative transition-all duration-300 z-[10] ${collapsedSections.summary ? \'px-6 py-3 rounded-xl\' : \'p-6 rounded-3xl\'}`}>';
const oldSumEnd = '</div>\n            )}\n          </div>';
const s1 = data.indexOf(oldSum);
const s2 = data.indexOf(oldSumEnd, s1);
if (s1 !== -1 && s2 !== -1) {
    data = data.substring(0, s1) + `<SummarySection
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
            totals={totals}
            activeTab={activeTab}
            headerDetails={headerDetails}
          />` + data.substring(s2 + oldSumEnd.length);
}

// InventoryActionMenu
const oldFootStart = '<div className="sticky bottom-0 -mx-4 md:-mx-6 lg:-mx-8 -mb-1 bg-white border-t border-gray-200';
const oldFootEnd = '</div>\n      </div>\n      \n      {editingRowIndex !== null && (';
const f1 = data.indexOf(oldFootStart);
const f2 = data.indexOf(oldFootEnd, f1);
if (f1 !== -1 && f2 !== -1) {
    data = data.substring(0, f1) + `<InventoryActionMenu
        activeTab={activeTab}
        isSection0Collapsed={isSection0Collapsed} setIsSection0Collapsed={setIsSection0Collapsed}
        isSection1Collapsed={isSection1Collapsed} setIsSection1Collapsed={setIsSection1Collapsed}
        isSection2Collapsed={isSection2Collapsed} setIsSection2Collapsed={setIsSection2Collapsed}
        isSection3Collapsed={isSection3Collapsed} setIsSection3Collapsed={setIsSection3Collapsed}
        handleNavigate={handleNavigate}
        handleSave={handleSave}
        setShowHistory={setShowHistory}
        setScanningRowIndex={setScanningRowIndex}
        setShowScanner={setShowScanner}
        fileInputRef={fileInputRef}
        attachedFile={attachedFile}
        setShowCalculator={setShowCalculator}
        handleDuplicateEntry={handleDuplicateEntry}
        handleNewEntry={handleNewEntry}
        handleSavePrint={handleSavePrint}
        handleSaveNew={handleSaveNew}
        handleSaveDraft={handleSaveDraft}
        handlePreview={handlePreview}
        handleGeneratePDF={handleGeneratePDF}
        handleGenerateImage={handleGenerateImage}
        handleClearEntryClick={handleClearEntryClick}
        handleDeleteEntryClick={handleDeleteEntryClick}
        setShowKeyboardShortcuts={setShowKeyboardShortcuts}
        setShowHelp={setShowHelp}
        onOpenPrintSettings={onOpenPrintSettings}
      />\n      \n      {editingRowIndex !== null && (` + data.substring(f2 + oldFootEnd.length);
}

// ItemEditModal
const oldModStart = '        <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">';
const oldModEnd = '</div>\n            </div>\n            \n            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">\n              <button \n                onClick={() => setEditingRowIndex(null)}\n                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"\n              >\n                Cancel\n              </button>\n              <button \n                onClick={() => setEditingRowIndex(null)}\n                className="px-8 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-sm active:scale-95"\n              >\n                Update Details\n              </button>\n            </div>\n          </div>\n        </div>\n      )}';
const m1 = data.indexOf(oldModStart);
const m2 = data.indexOf(oldModEnd, m1);
if (m1 !== -1 && m2 !== -1) {
    data = data.substring(0, m1) + `        <ItemEditModal
          editingRowIndex={editingRowIndex}
          setEditingRowIndex={setEditingRowIndex}
          expandedRowSection={expandedRowSection}
          setExpandedRowSection={setExpandedRowSection}
          rows={rows}
          setRows={setRows}
          itemMasters={itemMasters}
          warehouseMasters={warehouseMasters}
          handleItemOrSkuChange={handleItemOrSkuChange}
          setScanningRowIndex={setScanningRowIndex}
          setShowScanner={setShowScanner}
          activeTab={activeTab}
        />\n      )}` + data.substring(m2 + oldModEnd.length);
}


fs.writeFileSync(path, data);
console.log("Refactoring done!");
