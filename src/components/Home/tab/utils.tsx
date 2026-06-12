import React from 'react';
import { 
  FileText, Users, Calculator, Share2, Printer, PlaySquare, Settings, 
  BookOpen, Building2, Tag, Percent, Banknote, HelpCircle, HardDrive, 
  Key, Shield, Network, Eye, Workflow, Database, Save, CheckCircle, Layers
} from 'lucide-react';

export const colorThemes = [
  { 
    gradient: 'from-blue-500 to-cyan-500', 
    text: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400', 
    hover: 'hover:bg-blue-105 hover:bg-blue-100 dark:hover:bg-blue-900/30', 
    border: 'border-blue-100 dark:border-blue-900/40',
    hoverBorder: 'hover:border-blue-500/40 dark:hover:border-blue-400/40',
    btnSecondary: 'bg-white hover:bg-blue-50/50 dark:bg-gray-800 dark:hover:bg-blue-950/15 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-100 dark:shadow-none'
  },
  { 
    gradient: 'from-emerald-500 to-teal-500', 
    text: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400', 
    hover: 'hover:bg-emerald-105 hover:bg-emerald-100 dark:hover:bg-emerald-900/30', 
    border: 'border-emerald-100 dark:border-emerald-900/40',
    hoverBorder: 'hover:border-emerald-500/40 dark:hover:border-emerald-400/40',
    btnSecondary: 'bg-white hover:bg-emerald-50/50 dark:bg-gray-800 dark:hover:bg-emerald-950/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md shadow-emerald-100 dark:shadow-none'
  },
  { 
    gradient: 'from-purple-500 to-fuchsia-500', 
    text: 'text-purple-600 dark:text-purple-400', 
    bg: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400', 
    hover: 'hover:bg-purple-105 hover:bg-purple-100 dark:hover:bg-purple-900/30', 
    border: 'border-purple-100 dark:border-purple-900/40',
    hoverBorder: 'hover:border-purple-500/40 dark:hover:border-purple-400/40',
    btnSecondary: 'bg-white hover:bg-purple-50/50 dark:bg-gray-800 dark:hover:bg-purple-950/15 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/40',
    btnPrimary: 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-500 shadow-md shadow-purple-100 dark:shadow-none'
  },
  { 
    gradient: 'from-amber-500 to-orange-500', 
    text: 'text-amber-600 dark:text-amber-400', 
    bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400', 
    hover: 'hover:bg-amber-105 hover:bg-amber-100 dark:hover:bg-amber-900/30', 
    border: 'border-amber-100 dark:border-amber-900/40',
    hoverBorder: 'hover:border-amber-500/40 dark:hover:border-amber-400/40',
    btnSecondary: 'bg-white hover:bg-amber-50/50 dark:bg-gray-800 dark:hover:bg-amber-950/15 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-100 dark:shadow-none'
  },
  { 
    gradient: 'from-rose-500 to-pink-500', 
    text: 'text-rose-600 dark:text-rose-400', 
    bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400', 
    hover: 'hover:bg-rose-105 hover:bg-rose-100 dark:hover:bg-rose-900/30', 
    border: 'border-rose-105 dark:border-rose-900/40',
    hoverBorder: 'hover:border-rose-500/40 dark:hover:border-rose-400/40',
    btnSecondary: 'bg-white hover:bg-rose-50/50 dark:bg-gray-800 dark:hover:bg-rose-950/15 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40',
    btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-500 shadow-md shadow-rose-100 dark:shadow-none'
  },
  { 
    gradient: 'from-indigo-500 to-violet-500', 
    text: 'text-indigo-600 dark:text-indigo-400', 
    bg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400', 
    hover: 'hover:bg-indigo-105 hover:bg-indigo-100 dark:hover:bg-indigo-900/30', 
    border: 'border-indigo-100 dark:border-indigo-900/40',
    hoverBorder: 'hover:border-indigo-500/40 dark:hover:border-indigo-400/40',
    btnSecondary: 'bg-white hover:bg-indigo-50/50 dark:bg-gray-800 dark:hover:bg-indigo-950/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/40',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-100 dark:shadow-none'
  }
];

export const getTabTheme = (id: string) => {
  return colorThemes[Math.abs(id.length) % colorThemes.length];
};

export const getSubTheme = (id: string) => {
  return colorThemes[Math.abs(id.length) % colorThemes.length];
};

export const mainIcons: Record<string, React.ElementType> = {
  operations: Workflow,
  masters: Database,
  settings: Settings,
};

export const mainColors: Record<string, string> = {
  operations: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400',
  masters: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
  settings: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400',
};

// Utilities for Icons
export const getSubIcon = (id: string) => {
  if (id.includes('vouchers')) return FileText;
  if (id.includes('party')) return Users;
  if (id.includes('ledger')) return BookOpen;
  if (id.includes('item')) return Tag;
  if (id.includes('tax')) return Percent;
  if (id.includes('payment')) return Banknote;
  if (id.includes('company')) return Building2;
  if (id.includes('help')) return HelpCircle;
  
  if (id.includes('appearance') || id.includes('theme') || id.includes('visual')) return Eye;
  if (id.includes('backup') || id.includes('data') || id.includes('database')) return HardDrive;
  if (id.includes('security') || id.includes('auth') || id.includes('privacy')) return Shield;
  if (id.includes('network') || id.includes('sync') || id.includes('cloud')) return Network;
  if (id.includes('api') || id.includes('keys')) return Key;

  return Layers;
};

export const getTabIcon = (id: string, isDone?: boolean) => {
  if (isDone) return CheckCircle;
  
  if (id.includes('general')) return Settings;
  if (id.includes('calc')) return Calculator;
  if (id.includes('share')) return Share2;
  if (id.includes('print')) return Printer;
  if (id.includes('video') || id.includes('media')) return PlaySquare;
  if (id.includes('save') || id.includes('store')) return Save;
  
  return FileText;
};


