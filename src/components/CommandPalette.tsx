import React, { useEffect, useState, useRef } from 'react';
import { Search, Command, X, ArrowRight } from 'lucide-react';
import { TOOLS, ToolDefinition } from '../types/tools';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredTools = TOOLS.filter((tool) => {
    const search = query.toLowerCase().trim();
    if (!search) return true;
    return (
      tool.name.toLowerCase().includes(search) ||
      tool.description.toLowerCase().includes(search) ||
      tool.keywords.some((k) => k.toLowerCase().includes(search))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelectTool(filteredTools[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base font-medium"
            placeholder="Search developer tools (e.g. JWT, Base64, Epoch, Diff)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-800/40">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">No developer tools found matching "{query}"</p>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-950 dark:text-white'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'}`}>
                      <Command className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="hidden sm:inline text-gray-400 dark:text-gray-500">{tool.category}</span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">↓</kbd> navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">↵</kbd> select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
};
