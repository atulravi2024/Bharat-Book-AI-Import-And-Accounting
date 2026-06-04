import React from 'react';

export const CollapsibleSection: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void;
    headerActions?: React.ReactNode;
}> = ({ title, icon, children, isOpen, onToggle, headerActions }) => (
    <div className={`border-b transition-all duration-300 ${isOpen ? 'bg-white' : 'hover:bg-gray-50/50'} border-gray-100 dark:bg-gray-800 dark:border-gray-800`}>
        <button 
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 px-8 text-left focus:outline-none"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'} dark:bg-gray-800`}>
                    {icon}
                </div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest dark:text-white">{title}</h3>
            </div>
            <div className="flex items-center gap-4">
                {headerActions && <div onClick={(e) => e.stopPropagation()}>{headerActions}</div>}
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100 px-8 pb-8' : 'max-h-0 opacity-0 pb-0'}`}>
            <div className="pt-2">
                {children}
            </div>
        </div>
    </div>
);

export const ToggleButton: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    active: boolean; 
    onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
    <button 
        type="button"
        onClick={onClick}
        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
            active 
            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
            : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/10'
        } dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400`}
    >
        <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'} dark:bg-gray-900`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as any, { size: 14 }) : icon}
        </div>
        <div className="flex-grow text-left flex items-center gap-2 overflow-hidden">
            <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${active ? 'text-white' : 'text-gray-900'} dark:text-white`}>{label}</span>
            <span className={`text-[7px] font-black uppercase tracking-tight opacity-70 ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                {active ? 'Active' : 'Off'}
            </span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-colors shrink-0 ${active ? 'bg-white/30' : 'bg-gray-200'} dark:bg-gray-700`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? 'right-0.5' : 'left-0.5'} dark:bg-gray-800`} />
        </div>
    </button>
);

export const SegmentedControl: React.FC<{
    options: { id: string, label: string, sub?: string, icon?: React.ReactNode }[];
    value: string;
    onChange: (val: string) => void;
}> = ({ options, value, onChange }) => (
    <div className="form-grid gap-2">
        {options.map((opt) => {
            const active = value === opt.id;
            return (
                <button
                    type="button"
                    key={opt.id}
                    onClick={() => onChange(opt.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        active 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/10'
                    } dark:bg-gray-800 dark:border-gray-800 dark:text-gray-400`}
                >
                    {opt.icon && (
                        <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-gray-50 text-blue-600'} dark:bg-gray-900`}>
                            {React.isValidElement(opt.icon) ? React.cloneElement(opt.icon as any, { size: 14 }) : opt.icon}
                        </div>
                    )}
                    <div className="flex-grow text-left flex items-baseline gap-1.5 overflow-hidden">
                        <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${active ? 'text-white' : 'text-gray-900'} dark:text-white`}>{opt.label}</span>
                        {opt.sub && (
                            <span className={`text-[7px] font-black uppercase tracking-tight opacity-70 whitespace-nowrap ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                                {opt.sub}
                            </span>
                        )}
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors shrink-0 ${active ? 'bg-white/30' : 'bg-gray-200'} dark:bg-gray-700`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? 'right-0.5' : 'left-0.5'} dark:bg-gray-800`} />
                    </div>
                </button>
            );
        })}
    </div>
);

export const MarginInput: React.FC<{ label: string, value: number, onChange: (val: number) => void }> = ({ label, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative group">
            <input 
                type="number" 
                step="0.1" 
                min="0"
                value={value ?? ''} 
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                        onChange(0);
                    } else {
                        onChange(parseFloat(val) || 0);
                    }
                }}
                className="form-input text-xs font-bold focus:border-blue-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300 pointer-events-none group-focus-within:text-blue-400">IN</div>
        </div>
    </div>
);
