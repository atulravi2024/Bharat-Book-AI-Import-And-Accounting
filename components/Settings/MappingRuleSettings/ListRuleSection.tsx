import React from 'react';

export const ListRuleSection: React.FC<any> = ({ isOpen, toggleSection }) => {
    if (!isOpen) return null;
    return <div className="p-4 border-t border-gray-100">List Rule configuration will go here.</div>;
};
