import React from 'react';
import { Command, Github, Menu, Search, Zap, Sun, Moon } from 'lucide-react';
import { PrivacyBadge } from './PrivacyBadge';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/80 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">DevToolkit</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-500/30">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">100% Client-Side Web Tools</p>
          </div>
        </div>
      </div>

      {/* Middle: Command Palette Quick Search Button */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-900/80 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-xl transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span>Search developer tools or actions...</span>
          </div>
          <kbd className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right Side: Theme Switcher, Privacy Badge & GitHub Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:block">
          <PrivacyBadge />
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 transition-all flex items-center gap-1.5 text-xs font-semibold"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 fill-current" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 fill-current" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          title="Search tools"
        >
          <Search className="w-5 h-5" />
        </button>

        <a
          href="https://github.com/Gudivaka/dev-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl transition-all"
        >
          <Github className="w-4 h-4 text-gray-900 dark:text-white" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
};
