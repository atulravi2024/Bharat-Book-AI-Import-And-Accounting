
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainView } from '../../app/types';

interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
  activeView: MainView;
  onViewChange: (view: MainView, settingsTab?: string, usersSubTab?: string) => void;
  settingsActiveTab?: string | null;
}

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children, activeView, onViewChange, settingsActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden print-reset-layout">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} no-print`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeView={activeView}
        settingsActiveTab={settingsActiveTab}
        onViewChange={(view, settingsTab, usersSubTab) => {
          onViewChange(view, settingsTab, usersSubTab);
          // Close on mobile after selection
          if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }}
      />
      <div id="main-wrapper" className="flex-1 flex flex-col w-full min-w-0 overflow-hidden relative print-reset-container">
        <Header pageTitle={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} onViewChange={onViewChange} />
        <main id="main-content" className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-900 overflow-hidden relative print-reset-main">
          <div className="absolute inset-0 overflow-y-auto print-reset-content flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
