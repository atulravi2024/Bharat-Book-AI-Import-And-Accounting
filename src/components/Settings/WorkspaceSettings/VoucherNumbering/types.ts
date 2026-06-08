export interface VoucherSetting {
    prefix: string;
    suffix: string;
    startAt: number;
    resetPattern: 'never' | 'daily' | 'monthly' | 'yearly';
    autoGenerate: boolean;
    padding: number;
}
