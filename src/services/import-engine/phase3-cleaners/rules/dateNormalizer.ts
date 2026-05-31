export const normalizeDate = (rawDate: any): string => {
  if (!rawDate) return '';
  if (typeof rawDate === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const dateObj = new Date(excelEpoch.getTime() + rawDate * 86400000);
    return dateObj.toISOString().split('T')[0];
  }
  let strDate = String(rawDate).trim();
  const dmmyyyyMatch = strDate.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmmyyyyMatch) {
    const day = dmmyyyyMatch[1].padStart(2, '0');
    const month = dmmyyyyMatch[2].padStart(2, '0');
    const year = dmmyyyyMatch[3];
    return `${year}-${month}-${day}`;
  }
  const parsedDate = new Date(strDate);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }
  return strDate;
};
