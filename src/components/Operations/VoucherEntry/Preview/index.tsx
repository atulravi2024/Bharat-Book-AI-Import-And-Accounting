import React from 'react';
import { useVoucherPreviewLogic } from './hooks/useVoucherPreviewLogic';
import { SettingsSidePanel } from './views/SettingsSidePanel';
import { PremiumHeader } from './views/PremiumHeader';
import { VoucherDocument } from './views/VoucherDocument';

export interface VoucherPreviewProps {
  header: any;
  rows: any[];
  totals: any;
  type: string;
  onClose: () => void;
  onDownloadPDF?: () => void;
  onDownloadImage?: () => void;
  autoPrint?: boolean;
}

export const VoucherPreview: React.FC<VoucherPreviewProps> = (props) => {
  const {
    t,
    formatNumber,
    isInventory,
    previewScale,
    containerRef,
    documentRef,
    printConfig,
    layout,
    isClassic,
    isTechnical,
    isBold,
    isSerif,
    primaryText,
    primaryBg,
    primaryBorder,
    accentBg,
    appliedFont,
    appliedRadius,
    baseSize,
    lineHeightMultiplier,
    headingScale,
    letterSpacing,
    wordSpacing,
    paragraphSpacing,
    headerSpacing,
    plainSpacing,
    fontWeight,
    textTransform,
    getSectionStyle,
    A4_WIDTH,
    A4_HEIGHT,
    PHYSICAL_WIDTH,
    PHYSICAL_HEIGHT,
    filteredRows,
    currentPage,
    setCurrentPage,
    handleManualPrint,
    itemPages,
    totalPages,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFullSize,
    tStyles,
    isERPTheme,
    parseSafe,
    handleToggleSetting,
  } = useVoucherPreviewLogic(props);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-full lg:max-w-7xl h-[100dvh] md:h-[95dvh] md:rounded-3xl shadow-2xl overflow-hidden flex border border-white/20 relative dark:bg-gray-800">
        
        {/* Settings Panel */}
        <SettingsSidePanel 
          t={t}
          printConfig={printConfig}
          handleToggleSetting={handleToggleSetting}
        />

        {/* Main Preview Panel */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          <PremiumHeader 
            t={t}
            type={props.type}
            header={props.header}
            onClose={props.onClose}
            onDownloadPDF={props.onDownloadPDF}
            onDownloadImage={props.onDownloadImage}
            handleManualPrint={handleManualPrint}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            previewScale={previewScale}
            manualZoom={null}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
            handleFullSize={handleFullSize}
          />

          {/* Interactive Document View Container */}
          <div 
            ref={containerRef} 
            className="flex-1 bg-gray-200/40 relative scroll-smooth overflow-auto p-4 md:p-8"
          >
            <div className="min-h-full flex flex-col justify-center items-center">
              <VoucherDocument 
                t={t}
                formatNumber={formatNumber}
                isInventory={isInventory}
                previewScale={previewScale}
                documentRef={documentRef}
                printConfig={printConfig}
                layout={layout}
                isClassic={isClassic}
                isTechnical={isTechnical}
                isBold={isBold}
                isSerif={isSerif}
                primaryText={primaryText}
                primaryBg={primaryBg}
                primaryBorder={primaryBorder}
                accentBg={accentBg}
                appliedFont={appliedFont}
                baseSize={baseSize}
                lineHeightMultiplier={lineHeightMultiplier}
                headingScale={headingScale}
                letterSpacing={letterSpacing}
                wordSpacing={wordSpacing}
                paragraphSpacing={paragraphSpacing}
                headerSpacing={headerSpacing}
                plainSpacing={plainSpacing}
                fontWeight={fontWeight}
                textTransform={textTransform}
                getSectionStyle={getSectionStyle}
                A4_WIDTH={A4_WIDTH}
                A4_HEIGHT={A4_HEIGHT}
                PHYSICAL_WIDTH={PHYSICAL_WIDTH}
                PHYSICAL_HEIGHT={PHYSICAL_HEIGHT}
                filteredRows={filteredRows}
                currentPage={currentPage}
                itemPages={itemPages}
                totalPages={totalPages}
                type={props.type}
                header={props.header}
                totals={props.totals}
                tStyles={tStyles}
                parseSafe={parseSafe}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
