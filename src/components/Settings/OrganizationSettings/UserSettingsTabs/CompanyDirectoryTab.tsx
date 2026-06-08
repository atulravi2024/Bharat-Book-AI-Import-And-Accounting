import React from 'react';
import { CompanyDirectory } from './modular/CompanyDirectory';

interface CompanyDirectoryTabProps {
  searchTerm?: string;
}

export const CompanyDirectoryTab: React.FC<CompanyDirectoryTabProps> = ({ searchTerm }) => {
  return <CompanyDirectory searchTerm={searchTerm} />;
};

export default CompanyDirectoryTab;
