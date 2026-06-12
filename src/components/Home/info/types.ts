import { ParsedVoucher } from '../../../app/types';

export interface InfoSubpageProps {
  allVouchers: ParsedVoucher[];
  partyMasters: any[];
  ledgerMasters: any[];
  itemMasters: any[];
  searchTerm?: string;
  activeTab?: 'overview' | 'analysis';
}
