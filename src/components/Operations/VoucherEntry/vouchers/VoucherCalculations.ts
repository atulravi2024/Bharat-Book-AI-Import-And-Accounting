export const parseSafe = (val: any): number => {
    if (typeof val === 'string') {
        val = val.replace(/,/g, '');
    }
const parsed = parseFloat(val);
    return isFinite(parsed) && !isNaN(parsed) ? parsed : 0;
  };

export const calculateRowAmountBeforePreTaxRoundOff = (row: any) => {
const qty = parseSafe(row.qty);
const rate = parseSafe(row.rate);
    
    let amount = qty * rate;
    
const pct = parseSafe(row.discountPct);
    if (pct > 0) {
      amount = amount - (amount * (pct / 100));
    }
    
const amt = parseSafe(row.discountAmount);
    if (amt > 0) {
      amount = amount - amt;
    }
    
const discountStr = (row.discount || '').toString();
    if (discountStr) {
      if (discountStr.includes('%')) {
const legacyPct = parseSafe(discountStr.replace('%', ''));
        amount = amount - (amount * (legacyPct / 100));
      } else {
        amount = amount - parseSafe(discountStr);
      }
    }
    
    return isFinite(amount) && !isNaN(amount) ? Math.max(0, amount) : 0;
  };

export const getRowPreTaxRoundOff = (row: any) => {
const roundType = row.preTaxRoundType || 'none';
    if (roundType === 'manual') {
      return parseSafe(row.preTaxRoundOff);
    }
    if (roundType === 'none') {
        return 0;
    }

const amountBeforeRound = calculateRowAmountBeforePreTaxRoundOff(row);
    let roundedAmount = amountBeforeRound;
    if (roundType === 'normal') {
      roundedAmount = Math.round(amountBeforeRound);
    } else if (roundType === 'up') {
      roundedAmount = Math.ceil(amountBeforeRound);
    } else if (roundType === 'down') {
      roundedAmount = Math.floor(amountBeforeRound);
    }

    return roundedAmount - amountBeforeRound;
  };

export const calculateRowAmount = (row: any) => {
    return calculateRowAmountBeforePreTaxRoundOff(row) + getRowPreTaxRoundOff(row);
  };

export const getRowPostTaxDiscount = (row: any) => {
    let amt = 0;
const taxableAmount = calculateRowAmount(row);
const taxPct = parseSafe(row.tax || '18');
const taxAmount = taxableAmount * (taxPct / 100);
const postTaxGross = taxableAmount + taxAmount;

const ptPct = parseSafe(row.postTaxDiscountPct);
    if (ptPct > 0) amt += (postTaxGross * (ptPct / 100));

const ptAmt = parseSafe(row.postTaxDiscountAmount);
    if (ptAmt > 0) amt += ptAmt;

    return amt;
  };

export const getRowRoundOff = (row: any) => {
const roundType = row.roundType || 'none';
    if (roundType === 'manual') {
      return parseSafe(row.roundOff);
    }
    if (roundType === 'none') {
        return 0;
    }

const taxableAmount = calculateRowAmount(row);
const taxPct = parseSafe(row.tax || '18');
const taxAmount = taxableAmount * (taxPct / 100);
const postTaxGross = taxableAmount + taxAmount;
    
const ptAmt = getRowPostTaxDiscount(row);
const amountBeforeRound = postTaxGross - ptAmt;

    let roundedAmount = amountBeforeRound;
    if (roundType === 'normal') {
      roundedAmount = Math.round(amountBeforeRound);
    } else if (roundType === 'up') {
      roundedAmount = Math.ceil(amountBeforeRound);
    } else if (roundType === 'down') {
      roundedAmount = Math.floor(amountBeforeRound);
    }

    return roundedAmount - amountBeforeRound;
  };

export const calculateRowNetAmount = (row: any) => {
const taxableAmount = calculateRowAmount(row);
const taxPct = parseSafe(row.tax || '18');
const taxAmount = taxableAmount * (taxPct / 100);
const postTaxGross = taxableAmount + taxAmount;
    
const ptAmt = getRowPostTaxDiscount(row);
const roundO = getRowRoundOff(row);
    
const total = postTaxGross - ptAmt + roundO;
    return isFinite(total) && !isNaN(total) ? total : 0;
  };

