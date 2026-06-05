export type LutFilingStage = 'draft' | 'signing' | 'completed';

export interface LutFilingData {
  companyName: string;
  iecCode: string;
  financialYear: string;
  customsPort: string;
  witness1: string;
  witness2: string;
  otp: string;
  arn: string;
  filedDate: string;
}
