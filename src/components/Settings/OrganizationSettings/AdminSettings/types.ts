export interface FeatureGates {
    compactDensity: boolean;
    audioFeedback: boolean;
    skipPopups: boolean;
    allowNegativeStock: boolean;
    highContrastBorders: boolean;
    autoGstRounding: boolean;
}

export interface SystemLog {
    time: string;
    event: string;
    user: string;
    status: string;
}

export interface Stats {
    vouchers: number;
    parties: number;
    items: number;
    ledgers: number;
}
