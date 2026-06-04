export interface HistoryEntry {
  id: string;
  timestamp: string;
  versionLabel: string;
  modCount: number;
  editor: string;
  description: string;
  data: Record<string, string>;
}

export interface TelemetryData {
  printCount: number;
  lastPrintedTimestamp: string | null;
  exportCount: number;
  lastExportedFormat: string | null;
  lastExportedTimestamp: string | null;
  modificationCount: number;
}
