
import React from 'react';
import {
  DashboardIcon,
  MastersIcon,
  VouchersIcon,
  ReportsIcon,
  AIToolsIcon,
  SettingsIcon,
  MenuIcon,
  CheckCircleIcon,
  BankIcon,
  InventoryIcon,
  TaxIcon,
  AddBoxIcon,
  SwapHorizIcon,
} from '../icons/IconComponents';
import { MainView } from '../../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeView: MainView;
  onViewChange: (view: MainView) => void;
}

interface NavItemProps {
    icon: React.ReactNode; 
    label: string; 
    active?: boolean; 
    isCollapsed: boolean;
    onClick: () => void;
    intent?: 'primary' | 'secondary';
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, isCollapsed, onClick, intent = 'primary' }) => (
  <button 
    onClick={onClick}
    title={isCollapsed ? label : ''}
    className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : 'p-2'} my-0.5 rounded-lg transition-all duration-300 relative group ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50'
        : intent === 'primary'
            ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'} shrink-0`}>
        {icon}
    </div>
    {!isCollapsed && (
        <span className={`ml-2 transition-all truncate ${active ? 'font-black' : 'font-bold'} ${intent === 'primary' ? 'text-[10px] uppercase tracking-widest' : 'text-[9px] uppercase tracking-wide'}`}>
            {label}
        </span>
    )}
  </button>
);

const NavGroup: React.FC<{ 
    label: string; 
    icon: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void; 
    isSidebarOpen: boolean;
    children: React.ReactNode; 
}> = ({ label, icon, isOpen, onToggle, isSidebarOpen, children }) => {
    if (!isSidebarOpen) {
        return <div className="space-y-0.5">{children}</div>;
    }

    return (
        <div className="mb-2">
            <button 
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isOpen ? 'bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
                {isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
                )}
                <div className="flex items-center">
                    <div className={`w-4 h-4 flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100 text-blue-600' : 'opacity-60 group-hover:opacity-100'}`}>
                        {icon}
                    </div>
                    <span className={`ml-3 text-[9px] font-black uppercase tracking-[0.2em] ${isOpen ? 'text-blue-700' : ''}`}>{label}</span>
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="ml-4 pl-3 border-l border-blue-50/80 space-y-0.5 relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, activeView, onViewChange }) => {
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);

  const toggleGroup = (id: string) => {
    setOpenGroup(prev => prev === id ? null : id);
  };

  return (
    <aside className={`fixed top-0 left-0 h-full z-[90] bg-white dark:bg-gray-800 shadow-[20px_0_40px_rgba(0,0,0,0.02)] dark:shadow-none border-r border-premium-slate-100 dark:border-gray-700 transition-all duration-300 md:duration-500 ease-in-out md:relative flex flex-col max-md:w-64 ${
      isSidebarOpen
        ? 'w-64 max-md:translate-x-0'
        : 'w-20 max-md:-translate-x-full md:translate-x-0'
    }`}>
        <div className={`flex items-center p-6 border-b border-premium-slate-100 dark:border-gray-700 h-16 md:h-20 shrink-0 ${!isSidebarOpen ? 'md:px-0 md:justify-center' : ''}`}>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`flex items-center justify-center w-full transition-all group ${!isSidebarOpen ? 'md:space-x-0' : 'space-x-3 justify-start'}`}
            >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/50 shrink-0 group-hover:scale-105 transition-transform">
                    <CheckCircleIcon className="text-white text-lg md:text-xl" />
                </div>
                <div className={`flex flex-col items-start transition-opacity duration-300 overflow-hidden ${!isSidebarOpen ? 'w-0 opacity-0 md:hidden' : 'opacity-100 flex-1'}`}>
                    <span className="text-base md:text-lg font-black text-gray-900 dark:text-white leading-none font-display text-nowrap truncate w-full">Bharat Book</span>
                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mt-1 text-nowrap">Enterprise</span>
                </div>
            </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <NavItem 
                icon={<DashboardIcon className="text-xl" />} 
                label="Dashboard" 
                active={activeView === 'dashboard'} 
                isCollapsed={!isSidebarOpen} 
                onClick={() => onViewChange('dashboard')}
            />

            <div className="mt-2 space-y-1">
                <NavGroup 
                    label="Operations" 
                    icon={<AIToolsIcon className="text-base" />} 
                    isOpen={openGroup === 'ops'} 
                    onToggle={() => toggleGroup('ops')}
                    isSidebarOpen={isSidebarOpen}
                >
                    <NavItem 
                        icon={<AIToolsIcon className="text-xl" />} 
                        label="Import" 
                        active={activeView === 'import'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('import')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<AIToolsIcon className="text-xl" />} 
                        label="Bulk Operation" 
                        active={activeView === 'bulk-operation'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('bulk-operation')}
                        intent="secondary"
                    />
                </NavGroup>

                <NavGroup 
                    label="Entry" 
                    icon={<AddBoxIcon className="text-base" />} 
                    isOpen={openGroup === 'entry'} 
                    onToggle={() => toggleGroup('entry')}
                    isSidebarOpen={isSidebarOpen}
                >
                    <NavItem 
                        icon={<AddBoxIcon className="text-xl" />} 
                        label="Transactions" 
                        active={activeView === 'voucher-entry'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('voucher-entry')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<SwapHorizIcon className="text-xl" />} 
                        label="Inventory Trans." 
                        active={activeView === 'inventory-entry'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('inventory-entry')}
                        intent="secondary"
                    />
                </NavGroup>

                <NavGroup 
                    label="Masters" 
                    icon={<MastersIcon className="text-base" />} 
                    isOpen={openGroup === 'masters'} 
                    onToggle={() => toggleGroup('masters')}
                    isSidebarOpen={isSidebarOpen}
                >
                    <NavItem 
                        icon={<MastersIcon className="text-xl" />} 
                        label="Ledger Master" 
                        active={activeView === 'ledger-master'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('ledger-master')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<InventoryIcon className="text-xl" />} 
                        label="Item Master" 
                        active={activeView === 'item-master'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('item-master')}
                        intent="secondary"
                    />
                </NavGroup>

                <NavGroup 
                    label="Report" 
                    icon={<ReportsIcon className="text-base" />} 
                    isOpen={openGroup === 'reports'} 
                    onToggle={() => toggleGroup('reports')}
                    isSidebarOpen={isSidebarOpen}
                >
                    <NavItem 
                        icon={<BankIcon className="text-xl" />} 
                        label="Bank Vouchers" 
                        active={activeView === 'bank'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('bank')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<VouchersIcon className="text-xl" />} 
                        label="Ledger Report" 
                        active={activeView === 'vouchers'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('vouchers')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<TaxIcon className="text-xl" />} 
                        label="GST report" 
                        active={activeView === 'gst-report'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('gst-report')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<InventoryIcon className="text-xl" />} 
                        label="Item report" 
                        active={activeView === 'item-report'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('item-report')}
                        intent="secondary"
                    />
                    <NavItem 
                        icon={<ReportsIcon className="text-xl" />} 
                        label="Financial Report" 
                        active={activeView === 'reports'} 
                        isCollapsed={!isSidebarOpen} 
                        onClick={() => onViewChange('reports')}
                        intent="secondary"
                    />
                </NavGroup>
            </div>
        </nav>
        <div className="px-4 py-2 border-t border-slate-100 shrink-0">
            <NavItem 
                icon={<SettingsIcon className="text-xl" />} 
                label="Settings" 
                active={activeView === 'settings'} 
                isCollapsed={!isSidebarOpen} 
                onClick={() => onViewChange('settings')}
            />
        </div>
    </aside>
  );
};
