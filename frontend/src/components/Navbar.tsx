import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  onExport?: (format: 'json' | 'jpg' | 'gltf') => void;
}

const Navbar = ({ onExport }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'json' | 'jpg' | 'gltf') => {
    if (onExport) {
      onExport(format);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-pc-surface bg-pc-bg">
      <h1 className="text-xl font-bold text-pc-cyan">PromptCraft 3D</h1>
      {onExport && (
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-pc-surface hover:bg-pc-surface/80 border border-pc-surface text-pc-text px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Room
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-pc-surface border border-slate-700/50 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                onClick={() => handleExport('gltf')}
                className="w-full text-left px-4 py-3 hover:bg-pc-cyan/10 hover:text-pc-cyan text-pc-text text-sm font-semibold transition-colors flex items-center gap-2"
              >
                3D Model (.gltf)
              </button>
              <button 
                onClick={() => handleExport('json')}
                className="w-full text-left px-4 py-3 hover:bg-pc-cyan/10 hover:text-pc-cyan text-pc-text text-sm font-semibold transition-colors border-t border-slate-700/30 flex items-center gap-2"
              >
                Layout Data (.json)
              </button>
              <button 
                onClick={() => handleExport('jpg')}
                className="w-full text-left px-4 py-3 hover:bg-pc-cyan/10 hover:text-pc-cyan text-pc-text text-sm font-semibold transition-colors border-t border-slate-700/30 flex items-center gap-2"
              >
                Screenshot (.jpg)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;