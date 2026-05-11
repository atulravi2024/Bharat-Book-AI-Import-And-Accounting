import React from 'react';

export const BasicRuleSection: React.FC<any> = ({ isOpen, toggleSection }) => {
    if (!isOpen) return null;
    return <div className="p-4 border-t border-gray-100 dark:border-gray-800">Basic Rule configuration will go here.</div>;
};
