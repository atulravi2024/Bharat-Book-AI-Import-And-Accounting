
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainView } from '../../types';

interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
  activeView: MainView;
  onViewChange: (view: MainView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ pageTitle, children, activeView, onViewChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeView={activeView}
        onViewChange={(view) => {
          onViewChange(view);
          // Close on mobile after selection
          if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
          }
        }}
      />
      <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
        <Header pageTitle={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 min-h-0 bg-gray-100 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
