import React from 'react';

export const SandboxSection: React.FC<any> = ({ isOpen, toggleSection }) => {
    if (!isOpen) return null;
    return <div className="p-4 border-t border-gray-100 dark:border-gray-800">Sandbox configuration will go here.</div>;
};
