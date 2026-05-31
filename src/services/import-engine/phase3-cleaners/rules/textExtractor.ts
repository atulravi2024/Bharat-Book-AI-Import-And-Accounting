export const extractTextPatterns = (narration: string) => {
  const result: any = {};
  if (!narration) return result;
  const refMatch = narration.match(/(?:NEFT|RTGS|IMPS|UPI)[/-]?([^ /]+)/i);
  if (refMatch) {
    result.inferredRef = refMatch[1];
    result.paymentMode = refMatch[0].substring(0, 4).toUpperCase();
  }
  
  // Checking for standard cheques formatting 'chq no 123456'
  const chqMatch = narration.match(/ch(?:eque|q)?[\s.-]*(?:no)?[\s.-]*(\d{6})/i);
  if (chqMatch) {
    result.chequeNumber = chqMatch[1];
  }
  
  return result;
};
