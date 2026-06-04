import React from "react";
import { TelemetryData } from "../types";

export function useTelemetry(recordId?: string | null, sessionDraftUuid?: string) {
  const getTelemetryKey = React.useCallback(() => {
    return `voucher_telemetry_${recordId || sessionDraftUuid}`;
  }, [recordId, sessionDraftUuid]);

  const [telemetry, setTelemetry] = React.useState<TelemetryData>(() => {
    try {
      const key = `voucher_telemetry_${recordId || sessionDraftUuid}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      printCount: 0,
      lastPrintedTimestamp: null,
      exportCount: 0,
      lastExportedFormat: null,
      lastExportedTimestamp: null,
      modificationCount: recordId ? 1 : 0,
    };
  });

  React.useEffect(() => {
    try {
      const key = getTelemetryKey();
      localStorage.setItem(key, JSON.stringify(telemetry));
    } catch (e) {
      console.error(e);
    }
  }, [telemetry, getTelemetryKey]);

  React.useEffect(() => {
    try {
      const key = `voucher_telemetry_${recordId || sessionDraftUuid}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setTelemetry(JSON.parse(saved));
      } else {
        setTelemetry({
          printCount: 0,
          lastPrintedTimestamp: null,
          exportCount: 0,
          lastExportedFormat: null,
          lastExportedTimestamp: null,
          modificationCount: recordId ? 1 : 0,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [recordId, sessionDraftUuid]);

  const incrementPrintCount = React.useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      printCount: prev.printCount + 1,
      lastPrintedTimestamp: new Date().toISOString()
    }));
  }, []);

  const incrementExportCount = React.useCallback((format: string) => {
    setTelemetry(prev => ({
      ...prev,
      exportCount: prev.exportCount + 1,
      lastExportedFormat: format,
      lastExportedTimestamp: new Date().toISOString()
    }));
  }, []);

  const incrementModCount = React.useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      modificationCount: prev.modificationCount + 1
    }));
  }, []);

  return {
    telemetry,
    setTelemetry,
    incrementPrintCount,
    incrementExportCount,
    incrementModCount,
  };
}
