import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { TOOLS } from './types/tools';

// Tool Components Import
import { EpochConverter } from './tools/EpochConverter';
import { WorldClockTool } from './tools/WorldClockTool';
import { JwtDecoder } from './tools/JwtDecoder';
import { Base64Converter } from './tools/Base64Converter';
import { JsonFormatter } from './tools/JsonFormatter';
import { JsonViewer } from './tools/JsonViewer';
import { JsonDiff } from './tools/JsonDiff';
import { FileTextDiff } from './tools/FileTextDiff';
import { UrlEncoder } from './tools/UrlEncoder';
import { HashGenerator } from './tools/HashGenerator';
import { UuidGenerator } from './tools/UuidGenerator';
import { CronParser } from './tools/CronParser';
import { YamlConverter } from './tools/YamlConverter';
import { SqlFormatter } from './tools/SqlFormatter';
import { CurlConverter } from './tools/CurlConverter';
import { RegexTester } from './tools/RegexTester';
import { ColorConverter } from './tools/ColorConverter';
import { StringConverter } from './tools/StringConverter';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { HtmlEntityConverter } from './tools/HtmlEntityConverter';
import { StringEscapeTool } from './tools/StringEscapeTool';
import { HtmlPreview } from './tools/HtmlPreview';
import { PhpSerializer } from './tools/PhpSerializer';
import { EsQueryGenerator } from './tools/EsQueryGenerator';
import { NetworkSpeedTest } from './tools/NetworkSpeedTest';

const TOOL_COMPONENTS: Record<string, React.FC> = {
  'epoch-converter': EpochConverter,
  'world-clock-tool': WorldClockTool,
  'jwt-decoder': JwtDecoder,
  'base64-converter': Base64Converter,
  'json-formatter': JsonFormatter,
  'json-viewer': JsonViewer,
  'json-diff': JsonDiff,
  'file-text-diff': FileTextDiff,
  'url-encoder': UrlEncoder,
  'hash-generator': HashGenerator,
  'uuid-generator': UuidGenerator,
  'cron-parser': CronParser,
  'yaml-converter': YamlConverter,
  'sql-formatter': SqlFormatter,
  'curl-converter': CurlConverter,
  'regex-tester': RegexTester,
  'color-converter': ColorConverter,
  'string-converter': StringConverter,
  'password-generator': PasswordGenerator,
  'html-entity-converter': HtmlEntityConverter,
  'string-escape': StringEscapeTool,
  'html-preview': HtmlPreview,
  'php-serializer': PhpSerializer,
  'es-query-generator': EsQueryGenerator,
  'network-speed-test': NetworkSpeedTest,
};

export const App: React.FC = () => {
  // Theme state: dark or light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('devtoolkit_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('devtoolkit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [activeToolId, setActiveToolId] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && TOOLS.some((t) => t.id === hash)) return hash;
    return 'epoch-converter';
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Favorites state in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('devtoolkit_favorites');
      return saved ? JSON.parse(saved) : ['epoch-converter', 'world-clock-tool', 'jwt-decoder', 'network-speed-test'];
    } catch (e) {
      return ['epoch-converter', 'world-clock-tool', 'jwt-decoder', 'network-speed-test'];
    }
  });

  useEffect(() => {
    localStorage.setItem('devtoolkit_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update hash when switching tool
  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    window.location.hash = toolId;
  };

  const ActiveComponent = TOOL_COMPONENTS[activeToolId] || EpochConverter;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full max-w-[1920px] mx-auto">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeToolId={activeToolId}
          onSelectTool={handleSelectTool}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 md:p-8 min-w-0 max-w-7xl mx-auto">
          <ActiveComponent />
        </main>
      </div>

      {/* Global Command Palette Dialog */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
};

export default App;
