import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { ChevronRight, ChevronDown, Copy, Check, Search, FolderTree } from 'lucide-react';

const SAMPLE_TREE_JSON = `{
  "api": "v2",
  "status": 200,
  "data": {
    "user": {
      "id": "u_8819",
      "username": "alex_dev",
      "roles": ["engineer", "lead"],
      "isActive": true
    },
    "projects": [
      { "name": "DevToolkit", "stars": 1250, "public": true },
      { "name": "CloudEngine", "stars": 450, "public": false }
    ]
  }
}`;

// Recursive TreeNode Renderer
const TreeNode: React.FC<{
  name?: string;
  value: any;
  path: string;
  search: string;
  defaultExpanded?: boolean;
}> = ({ name, value, path, search, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const keys = isObject ? Object.keys(value) : [];

  const matchesSearch = (str: string) => search && str.toLowerCase().includes(search.toLowerCase());

  const copyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderValue = () => {
    if (value === null) return <span className="text-gray-500 font-italic">null</span>;
    if (typeof value === 'boolean') return <span className="text-amber-400 font-semibold">{value ? 'true' : 'false'}</span>;
    if (typeof value === 'number') return <span className="text-purple-400 font-semibold">{value}</span>;
    if (typeof value === 'string') return <span className="text-emerald-300">"{value}"</span>;
    return null;
  };

  return (
    <div className="text-xs font-mono py-0.5 select-none">
      <div
        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-gray-800/80 cursor-pointer group ${
          matchesSearch(name || '') || matchesSearch(String(value)) ? 'bg-indigo-600/20' : ''
        }`}
        onClick={() => isObject && setExpanded(!expanded)}
      >
        {isObject ? (
          expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )
        ) : (
          <span className="w-3.5" />
        )}

        {name && (
          <span className="text-indigo-300 font-semibold">
            {name}:
          </span>
        )}

        {isObject ? (
          <span className="text-gray-400">
            {isArray ? `Array[${value.length}]` : `Object{${keys.length}}`}
          </span>
        ) : (
          renderValue()
        )}

        <button
          onClick={copyPath}
          className="ml-auto opacity-0 group-hover:opacity-100 px-1.5 py-0.5 text-[10px] rounded bg-gray-800 text-gray-400 hover:text-white transition-opacity"
          title={`Copy path: ${path}`}
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {isObject && expanded && (
        <div className="pl-4 border-l border-gray-800/80 ml-2 space-y-0.5">
          {keys.map((k) => (
            <TreeNode
              key={k}
              name={isArray ? undefined : k}
              value={value[k]}
              path={path ? (isArray ? `${path}[${k}]` : `${path}.${k}`) : k}
              search={search}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const JsonViewer: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_TREE_JSON);
  const [search, setSearch] = useState('');

  let parsed: any = null;
  let parseError: string | null = null;
  try {
    parsed = JSON.parse(jsonInput);
  } catch (err: any) {
    parseError = err.message;
  }

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Interactive JSON Tree Viewer"
        description="Explore JSON structures visually, collapse/expand nodes, search properties, and copy JSON paths."
        onLoadSample={() => setJsonInput(SAMPLE_TREE_JSON)}
        onClear={() => setJsonInput('')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input */}
        <div className="lg:col-span-5 space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Raw JSON Input</label>
          <textarea
            rows={18}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON string here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        {/* Tree View Output */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" /> Interactive Tree View
            </label>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search keys/values..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass-input pl-8 pr-2 py-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 min-h-[400px] max-h-[550px] overflow-y-auto">
            {parseError ? (
              <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono">
                Invalid JSON: {parseError}
              </div>
            ) : parsed !== null ? (
              <TreeNode value={parsed} path="root" search={search} />
            ) : (
              <div className="text-gray-500 text-xs text-center py-12">
                Enter JSON on the left to display tree
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
