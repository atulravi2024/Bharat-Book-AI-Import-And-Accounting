const parseSafe = (val) => {
    if (typeof val === 'string') {
        val = val.replace(/,/g, '');
    }
    const parsed = parseFloat(val);
    return isFinite(parsed) && !isNaN(parsed) ? parsed : 0;
};
const rows = [{ qty: '1', rate: '100' }]; // row.tax is undefined
const calculateRowAmountBeforePreTaxRoundOff = (row) => {
    const qty = parseSafe(row.qty);
    const rate = parseSafe(row.rate);
    let amount = qty * rate;
    return isFinite(amount) && !isNaN(amount) ? Math.max(0, amount) : 0;
};
const getRowPreTaxRoundOff = (row) => {
    const roundType = row.preTaxRoundType || 'none';
    if (roundType === 'none') {
        return 0;
    }
    const amountBeforeRound = calculateRowAmountBeforePreTaxRoundOff(row);
    return amountBeforeRound; 
};
const calculateRowAmount = (row) => calculateRowAmountBeforePreTaxRoundOff(row) + getRowPreTaxRoundOff(row);

const taxAmount = rows.reduce((sum, row) => {
    const amt = calculateRowAmount(row);
    const taxPct = parseFloat(row.tax ?? '18') || 0;
    return sum + (amt * (taxPct / 100));
}, 0);

console.log('taxAmount:', taxAmount);
