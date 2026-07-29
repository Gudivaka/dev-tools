import React, { useState } from 'react';
import { 
  Clock, Binary, FileCode2, Database, Terminal, KeyRound, 
  ShieldCheck, Lock, FileJson, FolderTree, GitCompare, 
  Split, Regex, Type, Link, Fingerprint, CalendarClock, Palette, Star, Search,
  Code, RefreshCcw, Eye
} from 'lucide-react';
import { TOOLS, ToolCategory, ToolDefinition } from '../types/tools';

interface SidebarProps {
  activeToolId: string;
  onSelectTool: (toolId: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Clock, Binary, FileCode2, Database, Terminal, KeyRound, 
  ShieldCheck, Lock, FileJson, FolderTree, GitCompare, 
  Split, Regex, Type, Link, Fingerprint, CalendarClock, Palette,
  Code, RefreshCcw, Eye
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeToolId,
  onSelectTool,
  favorites,
  onToggleFavorite,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const categories: ToolCategory[] = [
    'Time & Formatters',
    'Tokens & Security',
    'JSON Utilities',
    'Diffs & Text',
    'Generators & Web'
  ];

  const filteredTools = TOOLS.filter(tool => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return tool.name.toLowerCase().includes(q) || tool.keywords.some(k => k.toLowerCase().includes(q));
  });

  const renderToolButton = (tool: ToolDefinition) => {
    const IconComponent = ICON_MAP[tool.iconName] || FileCode2;
    const isActive = tool.id === activeToolId;
    const isFav = favorites.includes(tool.id);

    return (
      <div
        key={tool.id}
        className={`group relative flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl cursor-pointer transition-all ${
          isActive
            ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
        }`}
        onClick={() => {
          onSelectTool(tool.id);
          onCloseMobile();
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
          <span className="truncate">{tool.name}</span>
        </div>

        <div className="flex items-center gap-1">
          {tool.badge && (
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {tool.badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
              isFav ? 'opacity-100 text-amber-400' : 'text-gray-600 hover:text-amber-400'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    );
  };

  const favTools = TOOLS.filter(t => favorites.includes(t.id));

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-40 w-64 h-[calc(100vh)] md:h-[calc(100vh-4rem)] bg-gray-950 border-r border-gray-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Search input inside sidebar */}
        <div className="p-3 border-b border-gray-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Filter tools..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tools Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Favorites Category */}
          {favTools.length > 0 && !filterQuery && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
                <Star className="w-3 h-3 fill-current" />
                <span>Favorites</span>
              </div>
              <div className="space-y-0.5">{favTools.map(renderToolButton)}</div>
            </div>
          )}

          {/* Categorized Tools */}
          {categories.map((category) => {
            const catTools = filteredTools.filter((t) => t.category === category);
            if (catTools.length === 0) return null;

            return (
              <div key={category}>
                <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {category}
                </div>
                <div className="space-y-0.5">{catTools.map(renderToolButton)}</div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
