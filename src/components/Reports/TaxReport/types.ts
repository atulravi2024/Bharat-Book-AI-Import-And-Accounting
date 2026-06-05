export interface TdsClaimRecord {
  id: string;
  tan: string;
  deductor: string;
  section: string;
  rate: number;
  baseAmount: number;
  taxAmount: number;
  status: string;
  date: string;
}

export interface Instalment {
  title: string;
  date: string;
  cumulativePercent: number;
  key: string;
}

export type TaxRegime = 'sec115baa' | 'regular';
export type TaxTab = 'kpis' | 'advance-tax' | 'tds-ledger' | 'tax-projection' | 'tds-tcs-calculator' | 'presumptive-tax' | 'depreciation-schedule' | 'compliance-tracker' | 'tax-loss-tracker' | 'lut-application' | 'eledger-simulator' | 'info';
