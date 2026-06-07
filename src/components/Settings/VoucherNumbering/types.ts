export interface VoucherSetting {
    prefix: string;
    suffix: string;
    startAt: number;
    resetPattern: string;
    autoGenerate: boolean;
    padding: number;
}

export interface VoucherType {
    id: string;
    label: string;
}

export interface VoucherGroup {
    title: string;
    types: VoucherType[];
}
