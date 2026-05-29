import { useLanguage } from '../../../../context/LanguageContext';
import React from 'react';

export const PurchaseImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Purchase Import Settings Placeholder")}</div>;
};

export const SalesImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Sales Import Settings Placeholder")}</div>;
};

export const PaymentImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Payment Import Settings Placeholder")}</div>;
};

export const ReceiptImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Receipt Import Settings Placeholder")}</div>;
};

export const JournalImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Journal Import Settings Placeholder")}</div>;
};

export const ContraImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Contra Import Settings Placeholder")}</div>;
};

export const BankImport: React.FC<any> = () => {
  const { t } = useLanguage();
  return <div className="text-sm text-gray-500 dark:text-gray-400">{t("Bank Import Settings Placeholder")}</div>;
};
