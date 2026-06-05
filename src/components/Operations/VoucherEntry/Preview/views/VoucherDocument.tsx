import React from 'react';
import { FileText } from 'lucide-react';
import { numberToWords } from '../../../../../lib/numberToWords';

interface VoucherDocumentProps {
  t: (key: string, options?: any) => string;
  formatNumber: any;
  isInventory: boolean;
  previewScale: number;
  documentRef: React.RefObject<HTMLDivElement | null>;
  printConfig: any;
  layout: string;
  isClassic: boolean;
  isTechnical: boolean;
  isBold: boolean;
  isSerif: boolean;
  primaryText: string;
  primaryBg: string;
  primaryBorder: string;
  accentBg: string;
  appliedFont: string;
  baseSize: number;
  lineHeightMultiplier: number;
  headingScale: number;
  letterSpacing: number;
  wordSpacing: number;
  paragraphSpacing: number;
  headerSpacing: number;
  plainSpacing: number;
  fontWeight: string;
  textTransform: string;
  getSectionStyle: (key: string, baseClasses: string, styleOverrides?: React.CSSProperties) => any;
  A4_WIDTH: number;
  A4_HEIGHT: number;
  PHYSICAL_WIDTH: string;
  PHYSICAL_HEIGHT: string;
  filteredRows: any[];
  currentPage: number;
  itemPages: any[][];
  totalPages: number;
  type: string;
  header: any;
  totals: any;
  tStyles: any;
  parseSafe: (val: any) => number;
}

export const VoucherDocument: React.FC<VoucherDocumentProps> = ({
  t,
  formatNumber,
  isInventory,
  previewScale,
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
  itemPages,
  totalPages,
  type,
  header,
  totals,
  tStyles,
  parseSafe,
}) => {
  return (
    <div 
      className="transition-all duration-300 relative flex-shrink-0" 
      style={{ 
        width: `${A4_WIDTH * (previewScale || 1)}px`, 
        height: `${A4_HEIGHT * (previewScale || 1)}px`, 
        margin: '0 auto' 
      }}
    >
      <div 
        className="shadow-[0_30px_100px_rgba(0,0,0,0.15)] bg-white transition-transform duration-300 ease-out flex flex-col absolute top-0 left-0 origin-top-left dark:bg-gray-800"
        style={{ 
          transform: `scale(${previewScale || 1})`,
          width: PHYSICAL_WIDTH,
          minWidth: PHYSICAL_WIDTH,
          minHeight: PHYSICAL_HEIGHT,
        }}
      >
        <style>{`
          @media print {
            @page { size: ${printConfig.pageSize || 'A4'} ${printConfig.pageOrientation?.toLowerCase() || 'portrait'}; margin: 0mm; }
            body { margin: 0; padding: 0; }
            body * {
              visibility: hidden;
            }
            #voucher-to-print, #voucher-to-print * {
              visibility: visible;
            }
            #voucher-to-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
            }
            .voucher-print-page {
              width: ${PHYSICAL_WIDTH} !important;
              max-width: ${PHYSICAL_WIDTH} !important;
              min-height: ${PHYSICAL_HEIGHT} !important;
              height: auto !important;
              overflow: visible !important;
              margin: 0 !important;
              box-sizing: border-box !important;
              padding-top: calc(${(printConfig.marginTop ?? 0.5)}in + ${plainSpacing}px) !important;
              padding-bottom: calc(${(printConfig.marginBottom ?? 0.5)}in + ${plainSpacing}px) !important;
              padding-left: calc(${(printConfig.marginLeft ?? 0.5)}in + ${plainSpacing}px) !important;
              padding-right: calc(${(printConfig.marginRight ?? 0.5)}in + ${plainSpacing}px) !important;
              font-size: ${baseSize}px !important;
              line-height: ${lineHeightMultiplier} !important;
              letter-spacing: ${letterSpacing}px !important;
              word-spacing: ${wordSpacing}px !important;
              font-weight: ${fontWeight} !important;
              ${textTransform !== 'default' ? `text-transform: ${textTransform} !important;` : ''}
              border: none !important;
              box-shadow: none !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              page-break-after: always;
              ${printConfig.useGrayScale ? 'filter: grayscale(1) contrast(1.25) !important;' : ''}
            }
            .voucher-print-page:last-child {
              page-break-after: auto;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
        <div id="voucher-to-print" ref={documentRef} className="w-full h-full text-left">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
            const isLastPage = pageNum === totalPages;
            const pageRows = itemPages[pageNum - 1] || [];
            const absoluteStartIndex = itemPages.slice(0, pageNum - 1).reduce((sum, page) => sum + page.length, 0);
            
            return (
              <div 
                key={pageNum}
                className={`voucher-print-page bg-white flex-col min-h-full border border-gray-100 select-text transition-all duration-300 relative ${printConfig.useGrayScale ? 'grayscale contrast-125' : ''} ${isTechnical ? 'border-[3px] border-black' : ''} ${textTransform !== 'default' ? `text-transform-${textTransform}` : ''} ${pageNum === currentPage ? 'flex' : 'hidden print:flex'}`}
                style={{ 
                  boxSizing: 'border-box',
                  width: PHYSICAL_WIDTH, 
                  minHeight: PHYSICAL_HEIGHT,
                  height: 'auto',
                  overflow: 'visible',
                  fontSize: `${baseSize}px`,
                  lineHeight: lineHeightMultiplier,
                  letterSpacing: `${letterSpacing}px`,
                  wordSpacing: `${wordSpacing}px`,
                  fontWeight: fontWeight as any,
                  paddingTop: `calc(${(printConfig.marginTop ?? 0.5)}in + ${plainSpacing}px)`,
                  paddingBottom: `calc(${(printConfig.marginBottom ?? 0.5)}in + ${plainSpacing}px)`,
                  paddingLeft: `calc(${(printConfig.marginLeft ?? 0.5)}in + ${plainSpacing}px)`,
                  paddingRight: `calc(${(printConfig.marginRight ?? 0.5)}in + ${plainSpacing}px)`,
                  fontFamily: appliedFont,
                  backgroundColor: 'white'
                }}
              >
                <style>{`
                  #voucher-to-print h1, #voucher-to-print h2, #voucher-to-print h3, #voucher-to-print h4, #voucher-to-print h5, #voucher-to-print h6 {
                    margin-bottom: ${headerSpacing}px !important;
                  }
                  #voucher-to-print p, #voucher-to-print .paragraph {
                    margin-bottom: ${paragraphSpacing}px !important;
                  }
                `}</style>
                {isTechnical && (
                  <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                )}

                {/* Page Number Top */}
                {printConfig.showPageNumber === 'Yes' && printConfig.pageNumberLocation === 'Top' && (
                  <div className={`w-full ${printConfig.pageNumberAlignment === 'Center' ? 'text-center' : printConfig.pageNumberAlignment === 'Left' ? 'text-left' : 'text-right'} font-bold text-gray-500 mb-2 uppercase tracking-widest`} style={{ fontSize: `${baseSize * 0.7}px` }}>
                    {printConfig.pageNumberFormat === '1' ? pageNum : printConfig.pageNumberFormat === 'Page 1' ? `Page ${pageNum}` : printConfig.pageNumberFormat === '- 1 -' ? `- ${pageNum} -` : `Page ${pageNum} of ${totalPages}`}
                  </div>
                )}

                {(printConfig.headerDisplay === 'All Pages' || (!('headerDisplay' in printConfig) && pageNum === 1) || (printConfig.headerDisplay === 'First Page Only' && pageNum === 1) || (printConfig.headerDisplay === 'First & Last Page' && (pageNum === 1 || isLastPage))) && (
                  <>
                    {/* Invoice Header */}
                    {printConfig.showHeader && (
                      <div className={tStyles.headerWrap}>
                        <div className="flex items-start gap-4">
                          {printConfig.showLogo && (
                            <div className={tStyles.logoBox}>
                              <FileText size={printConfig.compactMode ? 20 : 32} />
                            </div>
                          )}
                          <div>
                            <h1 
                              {...getSectionStyle('header', tStyles.titleText, { fontSize: `${baseSize * headingScale * 2}px` })}
                            >
                              {isSerif ? type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1) : type.replace('_', ' ').toUpperCase()}
                            </h1>
                            <p {...getSectionStyle('header', tStyles.invoiceNumber, { fontSize: `${baseSize * 0.7}px` })}>{header?.voucherNumber || header?.entryNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div {...getSectionStyle('companyName', `font-black ${isBold ? 'text-white' : 'text-gray-900'} mb-1 tracking-tighter ${isSerif ? 'font-serif underline underline-offset-8' : ''}`, { fontSize: `${baseSize * headingScale * 1.5}px` })}>BHARAT BOOK</div>
                          <div {...getSectionStyle('companyAddress', `font-bold ${isBold ? 'text-white/60' : 'text-gray-500'} leading-tight uppercase tracking-widest opacity-80 ${isTechnical ? 'font-mono' : ''}`, { fontSize: `${baseSize * 0.7}px` })}>
                            Industrial Area, Phase 1<br/>
                            New Delhi, Delhi 110001, India<br/>
                            GSTIN: 07AAACB1234A1Z1<br/>
                            <span className={isBold ? 'text-white' : primaryText}>{t("contact@bharatbook.com")}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {printConfig.showBilling && (
                      <div className={tStyles.billingWrap}>
                        <div className={tStyles.billingLeftBox}>
                          <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px`, marginBottom: `${baseSize * 0.5}px` }}>{t("Bill To / Recipient")}</div>
                          <div {...getSectionStyle('partyName', tStyles.billingValue, { fontSize: `${baseSize * headingScale * 1.5}px` })}>{header.billingPartyName || header.partyName || 'Cash Sales'}</div>
                          <div {...getSectionStyle('partyAddress', `text-gray-500 font-bold leading-relaxed max-w-sm ${isTechnical ? 'font-mono uppercase tracking-tight' : ''}`, { fontSize: `${baseSize}px` })}>
                            {header.billingAddress || 'Local Customer'}<br/>
                            {header.billingState} {header.billingPinCode}, India<br/>
                            {header.billingContact && <span className={primaryText}>Contact: {header.billingContact}</span>}
                          </div>
                          {header.gstNumber && <div className={`mt-4 inline-block px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 font-black rounded-lg uppercase tracking-widest dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600`} style={{ fontSize: `${baseSize * 0.7}px` }}>GSTIN: {header.gstNumber}</div>}
                        </div>
                        <div className={tStyles.billingRightBox}>
                          <div className="space-y-8">
                            <div className={isTechnical ? 'border-b border-black/10 pb-4 flex justify-between items-end text-left' : ''}>
                              <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px` }}>{t("Document Date")}</div>
                              <div {...getSectionStyle('subheader', tStyles.billingValue, { fontSize: `${baseSize * headingScale}px` })}>{header.voucherDate || header.entryDate}</div>
                            </div>
                            {header.referenceNo && (
                              <div className={isTechnical ? 'border-b border-black/10 pb-4 flex justify-between items-end text-left' : ''}>
                                <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px` }}>{t("Ref / Invoice No")}</div>
                                <div {...getSectionStyle('subheader', tStyles.billingValue, { fontSize: `${baseSize * headingScale * 0.8}px` })}>{header.referenceNo}</div>
                              </div>
                            )}
                            {header.poNumber && (
                              <div className={isTechnical ? 'border-b border-black/10 pb-4 flex justify-between items-end text-left' : ''}>
                                <div className={tStyles.billingLabel} style={{ fontSize: `${baseSize * 0.7}px` }}>{t("Purchase Order")}</div>
                                <div {...getSectionStyle('subheader', tStyles.billingValue, { fontSize: `${baseSize * headingScale * 0.8}px` })}>{header.poNumber}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Table */}
                <div className={tStyles.tableWrap}>
                  <table className="w-full h-full border-collapse">
                    <thead>
                      <tr className={tStyles.tableHeadRow}>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell, { fontSize: `${baseSize * 0.7}px` })}>{t("SR.")}</th>
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' w-1/2', { fontSize: `${baseSize * 0.7}px` })}>{t("Description of Goods/Services")}</th>
                        {isInventory ? (
                          <>
                            {printConfig.showMrp && (
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("MRP")}</th>
                            )}
                            {printConfig.showQty && (
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Quantity")}</th>
                            )}
                            {printConfig.showRate && (
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Rate")}</th>
                            )}
                            {printConfig.showDiscountPercentage && (
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Disc (%)")}</th>
                            )}
                            {printConfig.showDiscountAmount && (
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Disc (₹)")}</th>
                            )}
                            <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Tax (%)")}</th>
                          </>
                        ) : (
                          <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Type")}</th>
                        )}
                        <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Total (₹)")}</th>
                      </tr>
                    </thead>
                    <tbody className={tStyles.tableBody}>
                      {pageRows.map((row, index) => (
                        <tr key={index} className={tStyles.tableRow}>
                          <td className={tStyles.tableCellFirst} style={{ fontSize: `${baseSize * 0.9}px` }}>{String(absoluteStartIndex + index + 1).padStart(2, '0')}</td>
                          <td className={tStyles.tableCellLeft}>
                            <div {...getSectionStyle('lineItem', `font-black text-gray-900 uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * (printConfig.compactMode ? 1.0 : 1.33)}px` })}>{isInventory ? row.itemName : row.ledgerName}</div>
                            {printConfig.showHSN && row.hsn && <div className={`${primaryText} font-black uppercase tracking-widest opacity-60`} style={{ fontSize: `${baseSize * 0.66}px`, marginTop: `${baseSize * 0.15}px` }}>{t("HSN Code")}: {row.hsn}</div>}
                          </td>
                          {isInventory ? (
                            <>
                              {printConfig.showMrp && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.mrp ? formatNumber(Number(parseSafe(row.mrp)), { minimumFractionDigits: 2 }) : '-'}</td>
                              )}
                              {printConfig.showQty && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.qty} {row.uom}</td>
                              )}
                              {printConfig.showRate && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(parseSafe(row.rate)), { minimumFractionDigits: 2 })}</td>
                              )}
                              {printConfig.showDiscountPercentage && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountPercent ? `${row.discountPercent}%` : '-'}</td>
                              )}
                              {printConfig.showDiscountAmount && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.discountAmount ? formatNumber(Number(parseSafe(row.discountAmount)), { minimumFractionDigits: 2 }) : '-'}</td>
                              )}
                              <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums align-top dark:text-gray-300`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.tax}%</td>
                            </>
                          ) : (
                            <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase align-top`} style={{ fontSize: `${baseSize * 0.9}px` }}>{row.crDr || (type === 'payment' && index === 0 ? 'Cr' : type === 'payment' ? 'Dr' : type === 'receipt' && index === 0 ? 'Dr' : type === 'receipt' ? 'Cr' : type === 'journal' ? 'Dr' : 'Cr')}</td>
                          )}
                          <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{formatNumber(Number(parseSafe(row.amount)), { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                      {(printConfig.pageSubtotalDisplay === 'All Pages' || isLastPage) && (
                        <tr className={`${tStyles.tableRow} bg-gray-50/50`}>
                          <td className={tStyles.tableCellFirst}></td>
                          <td className={tStyles.tableCellLeft}>
                            <div className={`${isSerif ? 'font-serif' : 'font-black'} text-gray-500 uppercase tracking-widest`} style={{ fontSize: `${baseSize * 0.9}px` }}>{t("Page Subtotal ({{count}} Items)", { count: pageRows.length })}</div>
                          </td>
                          {isInventory ? (
                            <>
                              {printConfig.showMrp && <td className={tStyles.tableCellRight}></td>}
                              {printConfig.showQty && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{pageRows.reduce((a, b) => a + (Number(b.qty) || 0), 0)}</td>
                              )}
                              {printConfig.showRate && <td className={tStyles.tableCellRight}></td>}
                              {printConfig.showDiscountPercentage && <td className={tStyles.tableCellRight}></td>}
                              {printConfig.showDiscountAmount && (
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(pageRows.reduce((a, b) => a + parseSafe(b.discountAmount), 0), { minimumFractionDigits: 2 })}</td>
                              )}
                              <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-bold text-gray-600 text-right tabular-nums align-top`}></td>
                            </>
                          ) : (
                            <td className={`${printConfig.compactMode ? 'py-4 px-3' : 'py-4 px-4'} font-black ${primaryText} text-right tracking-widest uppercase align-top`}></td>
                          )}
                          <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 1.2}px` }}>{formatNumber(pageRows.reduce((a, b) => a + parseSafe(b.amount), 0), { minimumFractionDigits: 2 })}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {isLastPage ? (
                  <>
                    {printConfig.showHsnSummary && (
                      <div className={`${isTechnical ? 'border-t md:border-t-2 border-black pt-2 md:pt-3' : 'border-t md:border-t-2 border-gray-200/50 pt-2 md:pt-3'} relative z-10 mt-2`}>
                        <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-1 text-left`} style={{ fontSize: `${baseSize * 0.75}px` }}>{t("HSN-wise Summary")}</div>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className={tStyles.tableHeadRow}>
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell, { fontSize: `${baseSize * 0.7}px` })}>{t("HSN / SAC")}</th>
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Taxable Value")}</th>
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Rate")}</th>
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("CGST Amount")}</th>
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("SGST Amount")}</th>
                              <th {...getSectionStyle('tableHeader', tStyles.tableHeadCell + ' text-right', { fontSize: `${baseSize * 0.7}px` })}>{t("Total Tax")}</th>
                            </tr>
                          </thead>
                          <tbody className={tStyles.tableBody}>
                            {filteredRows.reduce((acc: any[], row) => {
                              if (!row.hsn) return acc;
                              const existing = acc.find(x => x.hsn === row.hsn);
                              const taxRate = row.tax || 0;
                              const qty = row.qty || 1;
                              const rate = parseSafe(row.rate);
                              const amount = row.amount !== undefined ? parseSafe(row.amount) : qty * rate;
                              const taxAmount = (amount * taxRate) / 100;
                              
                              if (existing) {
                                existing.taxable += amount;
                                existing.taxAmount += taxAmount;
                              } else {
                                acc.push({ hsn: row.hsn, taxRate, taxable: amount, taxAmount });
                              }
                              return acc;
                            }, []).map((hsn, idx) => (
                              <tr key={`hsn-${idx}`} className={tStyles.tableRow}>
                                <td className={tStyles.tableCellLeft} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.hsn}</td>
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(hsn.taxable), { minimumFractionDigits: 2 })}</td>
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{hsn.taxRate}%</td>
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(hsn.taxAmount / 2, { minimumFractionDigits: 2 })}</td>
                                <td className={tStyles.tableCellRight} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(hsn.taxAmount / 2, { minimumFractionDigits: 2 })}</td>
                                <td className={tStyles.tableCellTotal} style={{ fontSize: `${baseSize * 0.9}px` }}>{formatNumber(Number(hsn.taxAmount), { minimumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Totals Section */}
                    <div className={tStyles.totalsWrap}>
                      <div className={isTechnical ? 'p-4 flex-1' : 'pr-8 flex-1'}>
                        {(printConfig.showAmountInWords || (header.narration && printConfig.showNarration)) && (
                          <div className={tStyles.narrationBox}>
                            {printConfig.showAmountInWords && (
                              <div>
                                <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-1`} style={{ fontSize: `${baseSize * 0.7}px` }}>{t("Total amount in words")}</div>
                                <div {...getSectionStyle('amountInWords', `font-black text-gray-800 italic leading-snug uppercase tracking-tight ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                  {t("Indian Rupees")} {numberToWords(Math.floor(totals.grandTotal || totals.finalValue))}
                                </div>
                              </div>
                            )}
                            
                            {header.narration && printConfig.showNarration && (
                              <div className={`${printConfig.showAmountInWords ? 'pt-1 mt-1 border-t border-gray-200/40' : ''} ${isTechnical ? 'border-black' : ''}`}>
                                <div className={`font-black text-gray-400 uppercase tracking-[0.2em] mb-1`} style={{ fontSize: `${baseSize * 0.7}px` }}>{t("Official Narration")}</div>
                                <div {...getSectionStyle('narration', `text-gray-600 leading-relaxed font-bold uppercase tracking-tight ${isTechnical ? 'font-mono' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>{header.narration}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={tStyles.totalsBox}>
                        <div className={`${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`} style={{ fontSize: `${baseSize * 0.9}px` }}>
                          <span>{t("Taxable Amount")}</span>
                          <span className="tabular-nums">₹{formatNumber(parseSafe(totals.taxableValue || totals.estValue), { minimumFractionDigits: 2 })}</span>
                        </div>
                        {printConfig.showTaxDetails && (
                          <div className={tStyles.totalsDivider}>
                            {(totals.computedSupplyType === 'Inter-State') ? (
                              <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                <span>{t("IGST")}</span>
                                <span className="tabular-nums">₹{formatNumber(Number(parseSafe(totals.igst)), { minimumFractionDigits: 2 })}</span>
                              </div>
                            ) : (
                              <>
                                <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                  <span>{t("CGST")}</span>
                                  <span className="tabular-nums">₹{formatNumber(Number(parseSafe(totals.cgst)), { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div {...getSectionStyle('taxDetails', `${tStyles.totalsLabel} ${isSerif ? 'font-serif normal-case tracking-normal' : ''}`, { fontSize: `${baseSize * 0.9}px` })}>
                                  <span>{t("SGST")}</span>
                                  <span className="tabular-nums">₹{formatNumber(Number(parseSafe(totals.sgst)), { minimumFractionDigits: 2 })}</span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        
                        <div className={tStyles.totalsDivider + " mt-2"}>
                          {(totals.otherAdjustment || 0) !== 0 && (
                            <div {...getSectionStyle('adjustment', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                              <span>{header.taxableAdjustmentRemarks || "Taxable Adjustments"}</span>
                              <span className="tabular-nums">₹{formatNumber(Number(parseSafe(totals.otherAdjustment)), { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          {(totals.nonTaxableAdjustment || 0) !== 0 && (
                            <div {...getSectionStyle('adjustment', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                              <span>{header.nonTaxableAdjustmentRemarks || "Non-Taxable Adjustments"}</span>
                              <span className="tabular-nums">₹{formatNumber(Number(parseSafe(totals.nonTaxableAdjustment)), { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          {(totals.voucherDiscount || 0) !== 0 && (
                            <div {...getSectionStyle('discount', tStyles.totalsLabel, { fontSize: `${baseSize * 0.8}px` })}>
                              <span>{t("Voucher Discount")}</span>
                              <span className="tabular-nums mb-1">- ₹{formatNumber(Number(parseSafe(totals.voucherDiscount)), { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 items-end pt-2 text-right w-full">
                          <div className={tStyles.grandTotalLabel} style={{ fontSize: `${baseSize * 0.9}px` }}>{layout === 'Modern' ? t("Net invoice amount") : t("Payable")}</div>
                          <div {...getSectionStyle('grandTotal', tStyles.titleText.replace('mb-1', ''), { 
                            fontSize: `${baseSize * headingScale * 2 * (
                              formatNumber(parseSafe(totals.grandTotal || totals.finalValue), { minimumFractionDigits: 2 }).length > 15 ? 0.6 :
                              formatNumber(parseSafe(totals.grandTotal || totals.finalValue), { minimumFractionDigits: 2 }).length > 12 ? 0.75 : 
                              formatNumber(parseSafe(totals.grandTotal || totals.finalValue), { minimumFractionDigits: 2 }).length > 10 ? 0.85 : 
                              1.0
                            )}px`,
                            lineHeight: '1.1'
                          })}>₹{formatNumber(parseSafe(totals.grandTotal || totals.finalValue), { minimumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    </div>

                    {/* Footers */}
                    <div className="relative z-10 mt-0 break-inside-avoid text-left">
                      <div className={tStyles.footerWrap}>
                        <div className="text-left w-1/3">
                          {printConfig.showCustomerSign && (
                            <div className={isTechnical ? 'border-2 border-black p-4 inline-block' : ''}>
                              <div {...getSectionStyle('signatures', tStyles.signaturesAuth, { fontSize: `${baseSize * 0.7}px` })}>{t("Customer Authorization")}</div>
                              <div className={tStyles.signaturesDivider}></div>
                            </div>
                          )}
                        </div>
                        <div className="text-right w-1/2">
                          {printConfig.showSignature && (
                            <div className={tStyles.signaturesBox}>
                              <div {...getSectionStyle('signatures', 'font-black text-gray-900 uppercase tracking-widest', { fontSize: `${baseSize * 0.8}px` })}>{t("Authorized For BHARAT BOOK")}</div>
                              <div className={tStyles.signaturesDivider}></div>
                              <div {...getSectionStyle('signatures', `font-black ${primaryText} uppercase tracking-[0.4em] opacity-100 mt-2`, { fontSize: `${baseSize * 0.8}px` })}>
                                {printConfig.selectedUser ? printConfig.selectedUser : t("Official Stamp & Sign")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {printConfig.showFooterNotes && (
                      <div className="w-full pt-4 pb-2 mt-4 border-t border-gray-100/50">
                        <p className={`${printConfig.compactMode ? 'text-[8px]' : 'text-[10px]'} font-black text-gray-400 text-center uppercase tracking-[0.5em]`}>
                          {t("Computer Generated Official Document")}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 mt-auto text-center font-black uppercase text-gray-400 tracking-[0.2em] opacity-50 text-xs w-full" style={{ fontSize: `${baseSize * 0.8}px` }}>{t("Continued to Page {{nextPage}}...", { nextPage: pageNum + 1 })}</div>
                )}

                {/* Page Number Bottom */}
                {printConfig.showPageNumber === 'Yes' && printConfig.pageNumberLocation === 'Bottom' && (
                  <div className={`w-full mt-auto pt-2 pb-2 ${printConfig.pageNumberAlignment === 'Center' ? 'text-center' : printConfig.pageNumberAlignment === 'Left' ? 'text-left' : 'text-right'} font-bold text-gray-500 uppercase tracking-widest bg-white`} style={{ fontSize: `${baseSize * 0.7}px` }}>
                    {printConfig.pageNumberFormat === '1' ? pageNum : printConfig.pageNumberFormat === 'Page 1' ? `Page ${pageNum}` : printConfig.pageNumberFormat === '- 1 -' ? `- ${pageNum} -` : `Page ${pageNum} of ${totalPages}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
