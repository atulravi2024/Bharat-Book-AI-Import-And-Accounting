export interface LevelThreeConfig {
  id: string;
  label: string;
  description: string;
  status: "Configured" | "Pending" | "Inactive";
  lastUpdated: string;
  type: "toggle" | "select" | "input" | "info";
  currentValue: string | boolean;
  options?: string[];
}

export interface LevelTwoConfig {
  id: string;
  label: string;
  description: string;
  progress: number; // calculated completed ratio or coverage
  tabs: LevelThreeConfig[];
}

export interface LevelOneConfig {
  id: string;
  label: string;
  description: string;
  iconName: "settings" | "paint" | "dollar" | "globe" | "sliders" | "maximize" | "file";
  subpages: LevelTwoConfig[];
}
