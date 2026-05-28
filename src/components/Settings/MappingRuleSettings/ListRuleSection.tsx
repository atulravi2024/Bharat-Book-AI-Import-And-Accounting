import React from 'react';
import { useLanguage } from "../../../context/LanguageContext";

export const ListRuleSection: React.FC<any> = ({ isOpen, toggleSection }) => {
  const { t } = useLanguage();
    if (!isOpen) return null;
    return <div className="p-4 border-t border-gray-100 dark:border-gray-800">{t("List Rule configuration will go here.")}</div>;
};
