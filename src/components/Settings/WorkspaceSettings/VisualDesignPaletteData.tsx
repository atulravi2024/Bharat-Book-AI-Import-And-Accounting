import React from 'react';
import { Palette, Focus, Layout, Columns, Signature, Maximize, Type } from 'lucide-react';

export const VISUAL_THEME_PALETTES = [
    { id: 'Modern', label: 'Modern', sub: 'Slate', icon: <Palette size={14} /> },
    { id: 'Tally', label: 'Tally ERP', sub: 'Teal', icon: <Focus size={14} className="text-teal-600" /> },
    { id: 'Vyapar', label: 'Vyapar', sub: 'Blue', icon: <Layout size={14} className="text-blue-500" /> },
    { id: 'Busy', label: 'Busy Acc', sub: 'Slate', icon: <Columns size={14} className="text-slate-600" /> },
    { id: 'Classic', label: 'Classic', sub: 'Serif', icon: <Signature size={14} /> },
    { id: 'Technical', label: 'Industrial', sub: 'Mono', icon: <Focus size={14} /> },
    { id: 'Minimal', label: 'Minimal', sub: 'Air', icon: <Maximize size={14} /> },
    { id: 'Bold', label: 'Bold', sub: 'Heavy', icon: <Layout size={14} /> },
    { id: 'Eco', label: 'Eco', sub: 'Green', icon: <Palette size={14} className="text-emerald-500" /> },
    { id: 'Royal', label: 'Royal', sub: 'Purple', icon: <Palette size={14} className="text-purple-500" /> },
    { id: 'Sunset', label: 'Sunset', sub: 'Warm', icon: <Palette size={14} className="text-orange-500" /> },
    { id: 'Ocean', label: 'Ocean', sub: 'Teal', icon: <Palette size={14} className="text-teal-500" /> },
    { id: 'Midnight', label: 'Midnight', sub: 'Navy', icon: <Palette size={14} className="text-indigo-900" /> },
    { id: 'Professional', label: 'Corporate', sub: 'Navy', icon: <Signature size={14} /> },
    { id: 'Retail', label: 'Retail', sub: 'Yellow', icon: <Columns size={14} /> },
    { id: 'Academic', label: 'Academic', sub: 'Formal', icon: <Type size={14} /> },
    { id: 'Slate', label: 'Slate', sub: 'Grey', icon: <Palette size={14} /> },
    { id: 'Crimson', label: 'Crimson', sub: 'Red', icon: <Palette size={14} className="text-red-600" /> },
    { id: 'Forest', label: 'Forest', sub: 'Moss', icon: <Palette size={14} className="text-green-800" /> }
];
