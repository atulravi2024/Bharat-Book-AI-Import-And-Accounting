import React from "react";
import { HistoryEntry } from "../types";

export function useVoucherHistory({
  recordId,
  sessionDraftUuid,
  auditorRole,
  createdBy,
  setSnapshotAlert,
  incrementModCount,
}: {
  recordId?: string | null;
  sessionDraftUuid?: string;
  auditorRole: string;
  createdBy: string;
  setSnapshotAlert: (msg: string) => void;
  incrementModCount: () => void;
}) {
  const [historyEntries, setHistoryEntries] = React.useState<HistoryEntry[]>(() => {
    const key = `voucher_history_${recordId || sessionDraftUuid}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [selectedHistoryId, setSelectedHistoryId] = React.useState<string | null>(null);

  const getChangesForEntry = React.useCallback((entry: HistoryEntry, allEntries: HistoryEntry[]) => {
    const idx = allEntries.findIndex(e => e.id === entry.id);
    const prevEntry = allEntries[idx + 1];
    
    if (!prevEntry) return null;

    const changes: Record<string, { from: string, to: string }> = {};
    const currentData = entry.data || {};
    const prevData = prevEntry ? (prevEntry.data || {}) : {};
    
    for (const key in currentData) {
      if (currentData[key] !== prevData[key]) {
        changes[key] = { from: prevData[key] || "", to: currentData[key] };
      }
    }
    for (const key in prevData) {
      if (!(key in currentData)) {
        changes[key] = { from: prevData[key], to: "(removed)" };
      }
    }
    return changes;
  }, []);

  const captureFormState = React.useCallback(() => {
    if (typeof document === "undefined") return {};
    const inputs = Array.from(document.querySelectorAll("input, select, textarea"));
    const data: Record<string, string> = {};
    const labelCounts: Record<string, number> = {};
    
    inputs.forEach((input) => {
      const el = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      
      const idStr = (el.getAttribute("id") || "").toLowerCase();
      const placeholderStr = (el.getAttribute("placeholder") || "").toLowerCase();
      const typeStr = (el.getAttribute("type") || "").toLowerCase();
      
      if (
        idStr.includes("search") ||
        idStr.includes("map") ||
        idStr.includes("history-version-select") ||
        placeholderStr.includes("coordinates") ||
        placeholderStr.includes("api key") ||
        typeStr === "password" ||
        el.classList.contains("cursor-not-allowed") ||
        el.closest(".system-info-section-ignore")
      ) {
        return;
      }

      let labelText = el.getAttribute("placeholder") || el.name || el.id || "";
      if (!labelText) {
        const parent = el.closest(".form-field-wrapper, .flex, div, td, th");
        const label = parent?.querySelector("label");
        if (label) {
          labelText = label.textContent?.trim() || "";
        }
      }
      
      const val = el.value?.trim();
      if ((labelText || val) && val !== undefined) {
        const cleanLabel = (labelText || "Unlabeled Field").replace(/[:*]/g, "").trim();
        if (
          cleanLabel && 
          cleanLabel.length < 50 &&
          !cleanLabel.toLowerCase().includes("history") &&
          !cleanLabel.toLowerCase().includes("audit") &&
          !cleanLabel.toLowerCase().includes("sync") &&
          !cleanLabel.toLowerCase().includes("key") &&
          !cleanLabel.toLowerCase().includes("signature") &&
          !cleanLabel.toLowerCase().includes("timer") &&
          !cleanLabel.toLowerCase().includes("gps")
        ) {
          labelCounts[cleanLabel] = (labelCounts[cleanLabel] || 0) + 1;
          const uniqueKey = labelCounts[cleanLabel] === 1 ? cleanLabel : `${cleanLabel} [Seq ${labelCounts[cleanLabel]}]`;
          data[uniqueKey] = val;
        }
      }
    });

    const sortedData: Record<string, string> = {};
    Object.keys(data).sort().forEach(key => {
      sortedData[key] = data[key];
    });
    return sortedData;
  }, []);

  React.useEffect(() => {
    const key = `voucher_history_${recordId || sessionDraftUuid}`;
    
    const recordHistoryPoint = (desc: string) => {
      const currentData = captureFormState();
      if (Object.keys(currentData).length === 0) return;

      setHistoryEntries(prev => {
        const lastEntry = prev[0];
        if (lastEntry) {
          const isIdentical = JSON.stringify(lastEntry.data) === JSON.stringify(currentData);
          if (isIdentical) return prev;
        }

        const nextNum = prev.length + 1;
        const newEntry: HistoryEntry = {
          id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
          versionLabel: `${nextNum}.0`,
          modCount: prev.length ? prev[0].modCount + 1 : (recordId ? 3 : 1),
          editor: auditorRole === "wizard" ? "Wizard AI Agent (Non-Interacting)" : (createdBy || "Admin"),
          description: desc,
          data: currentData
        };

        const updated = [newEntry, ...prev];
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      });
    };

    const timeoutTimer = setTimeout(() => {
      if (historyEntries.length === 0) {
        recordHistoryPoint("Initial Baseline Draft Setup");
      }
    }, 1500);

    const handleInputChange = () => {
      recordHistoryPoint("Auto-Captured Field Modification");
    };

    document.addEventListener("change", handleInputChange, true);
    return () => {
      clearTimeout(timeoutTimer);
      document.removeEventListener("change", handleInputChange, true);
    };
  }, [captureFormState, recordId, sessionDraftUuid, auditorRole, createdBy, historyEntries.length]);

  const handleRestoreHistory = React.useCallback((entry: HistoryEntry) => {
    try {
      Object.entries(entry.data).forEach(([labelText, val]) => {
        const labels = Array.from(document.querySelectorAll("label"));
        const label = labels.find(l => l.textContent?.trim().replace(/[:*]/g, "").trim() === labelText);
        let foundInput = false;

        if (label) {
          const parent = label.closest(".form-field-wrapper, .flex, div");
          const input = parent?.querySelector("input, select, textarea") as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          const isReadOnly = (input as HTMLInputElement | HTMLTextAreaElement)?.readOnly === true;
          if (input && !isReadOnly && !input.disabled) {
            input.value = val;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            foundInput = true;
          }
        }
        
        if (!foundInput) {
          const input = (document.querySelector(`input[name="${labelText}"], select[name="${labelText}"], textarea[name="${labelText}"]`) ||
                        document.getElementById(labelText) ||
                        document.querySelector(`input[placeholder="${labelText}"]`)) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
          if (input) {
            const isReadOnlyFB = (input as HTMLInputElement | HTMLTextAreaElement).readOnly === true;
            if (!isReadOnlyFB && !input.disabled) {
              input.value = val;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }
      });
      
      setSnapshotAlert(`✨ Restored State successfully to version v${entry.versionLabel} (Changes made by ${entry.editor} on ${entry.timestamp})`);
      incrementModCount();
    } catch (e) {
      console.error("Restore failed:", e);
    }
  }, [incrementModCount, setSnapshotAlert]);

  const handleClearHistory = React.useCallback(() => {
    try {
      const key = `voucher_history_${recordId || sessionDraftUuid}`;
      localStorage.removeItem(key);
      setHistoryEntries([]);
      setSnapshotAlert("Permanently cleared all local historical version records.");
    } catch (e) {
      console.error(e);
    }
  }, [recordId, sessionDraftUuid, setSnapshotAlert]);

  const handleForceManualCommit = React.useCallback(() => {
    const key = `voucher_history_${recordId || sessionDraftUuid}`;
    const currentData = captureFormState();
    if (Object.keys(currentData).length === 0) {
      setSnapshotAlert("❌ Cannot commit: No form inputs filled yet!");
      return;
    }
    
    setHistoryEntries(prev => {
      const lastEntry = prev[0];
      if (lastEntry) {
        const isIdentical = JSON.stringify(lastEntry.data) === JSON.stringify(currentData);
        if (isIdentical) {
          setSnapshotAlert("⚠️ No changes detected since the last savepoint! Tracking bypassed.");
          return prev;
        }
      }

      const nextNum = prev.length + 1;
      const newEntry: HistoryEntry = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
        versionLabel: `${nextNum}.0`,
        modCount: prev.length ? prev[0].modCount + 1 : (recordId ? 3 : 1),
        editor: auditorRole === "wizard" ? "Wizard AI Agent (Non-Interacting)" : (createdBy || "Admin"),
        description: "Manually Triggered Audit Point Commit",
        data: currentData
      };
      const updated = [newEntry, ...prev];
      localStorage.setItem(key, JSON.stringify(updated));
      setSnapshotAlert(`💼 Custom Audit Savepoint v${newEntry.versionLabel} committed to ledger list!`);
      return updated;
    });
  }, [captureFormState, recordId, sessionDraftUuid, auditorRole, createdBy, setSnapshotAlert]);

  return {
    historyEntries,
    selectedHistoryId,
    setSelectedHistoryId,
    getChangesForEntry,
    handleRestoreHistory,
    handleClearHistory,
    handleForceManualCommit
  };
}
