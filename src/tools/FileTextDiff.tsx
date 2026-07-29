import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Split, Upload, Plus, Minus } from 'lucide-react';
import * as diff from 'diff';

const TEXT_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const TEXT_MODIFIED = `function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);
}`;

export const FileTextDiff: React.FC = () => {
  const [leftText, setLeftText] = useState(TEXT_ORIGINAL);
  const [rightText, setRightText] = useState(TEXT_MODIFIED);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  // Compute Line Diff using `diff` library
  const changes = ignoreWhitespace
    ? diff.diffTrimmedLines(leftText, rightText)
    : diff.diffLines(leftText, rightText);

  let addedLinesCount = 0;
  let removedLinesCount = 0;

  changes.forEach((change) => {
    const lineCount = (change.value.match(/\n/g) || []).length || 1;
    if (change.added) addedLinesCount += lineCount;
    if (change.removed) removedLinesCount += lineCount;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (side === 'left') setLeftText(content);
      else setRightText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="File & Text Diff Visualizer"
        description="Compare arbitrary source code or text files side-by-side or in unified view with color-coded line diffs."
        onLoadSample={() => {
          setLeftText(TEXT_ORIGINAL);
          setRightText(TEXT_MODIFIED);
        }}
        onClear={() => {
          setLeftText('');
          setRightText('');
        }}
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">View Layout:</span>
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-lg ${viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Side-by-Side Split
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1 rounded-lg ${viewMode === 'unified' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Unified View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
            />
            <span>Ignore Whitespace</span>
          </label>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">
            <Plus className="w-3.5 h-3.5" /> +{addedLinesCount} lines
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 font-semibold">
            <Minus className="w-3.5 h-3.5" /> -{removedLinesCount} lines
          </span>
        </div>
      </div>

      {/* Input Text / File Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-300">Original File / Text (Left)</label>
            <label htmlFor="file-left" className="flex items-center gap-1 text-xs text-indigo-400 cursor-pointer hover:underline">
              <Upload className="w-3.5 h-3.5" /> Upload File
            </label>
            <input type="file" id="file-left" className="hidden" onChange={(e) => handleFileUpload(e, 'left')} />
          </div>
          <textarea
            rows={10}
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Paste original file content..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-300">Modified File / Text (Right)</label>
            <label htmlFor="file-right" className="flex items-center gap-1 text-xs text-indigo-400 cursor-pointer hover:underline">
              <Upload className="w-3.5 h-3.5" /> Upload File
            </label>
            <input type="file" id="file-right" className="hidden" onChange={(e) => handleFileUpload(e, 'right')} />
          </div>
          <textarea
            rows={10}
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Paste modified file content..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Visual Diff View Output */}
      <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2 overflow-x-auto min-h-[300px]">
        <div className="text-xs font-semibold text-gray-400 pb-2 border-b border-gray-800 flex items-center gap-2">
          <Split className="w-4 h-4 text-indigo-400" /> Diff Output Highlight
        </div>

        <div className="font-mono text-xs leading-relaxed space-y-0.5">
          {changes.map((part, index) => {
            const isAdded = part.added;
            const isRemoved = part.removed;

            const lines = part.value.replace(/\n$/, '').split('\n');

            return lines.map((line, lIdx) => (
              <div
                key={`${index}-${lIdx}`}
                className={`flex items-start px-3 py-0.5 rounded ${
                  isAdded
                    ? 'bg-emerald-500/15 text-emerald-300 border-l-4 border-emerald-500'
                    : isRemoved
                    ? 'bg-red-500/15 text-red-300 border-l-4 border-red-500 line-through'
                    : 'text-gray-400'
                }`}
              >
                <span className="w-6 text-gray-600 select-none text-right mr-3">
                  {isAdded ? '+' : isRemoved ? '-' : ' '}
                </span>
                <span className="whitespace-pre-wrap flex-1">{line}</span>
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
};
