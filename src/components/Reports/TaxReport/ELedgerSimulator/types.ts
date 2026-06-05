export interface LedgerBalances {
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
}

export interface Liabilities {
  igst: number;
  cgst: number;
  sgst: number;
}

export interface ChallanForm {
  head: 'IGST' | 'CGST' | 'SGST' | 'Cess';
  amt: string;
}
