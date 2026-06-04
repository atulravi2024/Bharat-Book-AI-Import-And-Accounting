
import React from 'react';

export const HistoryLogTable: React.FC<any> = ({ snapshots, restoreSnapshot, handleDeleteSnapshot }) => {
  if (!snapshots || snapshots.length === 0) return <div className="text-sm p-4 text-gray-500">No history snapshots available.</div>;
  return (
    <div className="overflow-x-auto w-full border mt-2">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 uppercase text-gray-600 font-semibold tracking-wider font-mono text-xs">
          <tr>
            <th className="p-2 text-left">Timestamp</th>
            <th className="p-2 text-left">Label</th>
            <th className="p-2 text-right">Size</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white font-mono text-xs">
          {snapshots.map((s: any) => (
            <tr key={s.id}>
              <td className="p-2">{new Date(s.timestamp).toLocaleString()}</td>
              <td className="p-2">{s.label}</td>
              <td className="p-2 text-right">{(s.sizeBytes / 1024).toFixed(1)} KB</td>
              <td className="p-2 text-center space-x-2">
                <button onClick={() => restoreSnapshot(s.id)} className="text-blue-500 underline">Restore</button>
                {handleDeleteSnapshot && <button onClick={() => handleDeleteSnapshot(s.id)} className="text-red-500 underline">Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
