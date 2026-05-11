export const defaultVoucherSettings: Record<string, any> = {
  sales: { prefix: 'SAL/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  purchase: { prefix: 'PUR/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  journal: { prefix: 'JV/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  receipt: { prefix: 'REC/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  payment: { prefix: 'PAY/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  contra: { prefix: 'CON/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  debit_note: { prefix: 'DN/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  credit_note: { prefix: 'CN/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  stock_journal: { prefix: 'SJ/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  transfer: { prefix: 'TRF/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  physical_stock: { prefix: 'PHY/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  consumption: { prefix: 'CON/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  scrap: { prefix: 'SCR/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  rejections_in: { prefix: 'REJI/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
  rejections_out: { prefix: 'REJO/', suffix: '/23-24', startAt: 1, resetPattern: 'yearly', autoGenerate: true, padding: 3 },
};

export const getNextVoucherNumber = (type: string, isDraft: boolean = false): string => {
  if (isDraft) return '';
  const saved = localStorage.getItem('bharat_book_voucher_numbering');
  let settings = defaultVoucherSettings;
  
  if (saved) {
    try {
      settings = { ...defaultVoucherSettings, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Failed to parse voucher numbering settings", e);
    }
  }

  const typeSettings = settings[type];
  
  if (typeSettings && typeSettings.autoGenerate) {
    const prefix = typeSettings.prefix || '';
    const suffix = typeSettings.suffix || '';
    const startAt = typeSettings.startAt || 1;
    const padding = typeSettings.padding !== undefined ? typeSettings.padding : 3;
    
    return `${prefix}${String(startAt).padStart(padding, '0')}${suffix}`;
  }
  
  return '';
};

export const incrementVoucherNumber = (type: string) => {
  const saved = localStorage.getItem('bharat_book_voucher_numbering');
  let settings = { ...defaultVoucherSettings };
  
  if (saved) {
    try {
      settings = { ...defaultVoucherSettings, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Failed to parse voucher numbering settings", e);
    }
  }

  const typeSettings = settings[type];
  
  if (typeSettings && typeSettings.autoGenerate) {
    typeSettings.startAt = (typeSettings.startAt || 1) + 1;
    localStorage.setItem('bharat_book_voucher_numbering', JSON.stringify(settings));
  }
};
