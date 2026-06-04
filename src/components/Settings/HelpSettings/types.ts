import React from 'react';

export interface Article {
  id: string;
  category: 'getting-started' | 'vouchers' | 'ai-engines' | 'security';
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface FeatureDefinition {
  id: string;
  name: string;
  tabKey: string;
  icon: React.ComponentType<any>;
  description: string;
  parameters: string[];
  checklist: string[];
  concept: string;
}
