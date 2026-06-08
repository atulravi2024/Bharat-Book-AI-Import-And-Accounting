export interface FeatureDefinition {
    id: string;
    name: string;
    tabKey: string;
    icon: any;
    description: string;
    concept: string;
    parameters: string[];
    checklist: string[];
}

export interface Article {
    id: string;
    category: string;
    title: string;
    summary: string;
    content: string;
    tags: string[];
}
