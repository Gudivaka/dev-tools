import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { FileCode2, ArrowRightLeft } from 'lucide-react';
import YAML from 'yaml';

const SAMPLE_YAML = `server:
  host: 0.0.0.0
  port: 8080
  debug: true

database:
  driver: postgres
  pool:
    max: 20
    min: 5
  tags:
    - production
    - primary`;

export const YamlConverter: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputContent, setInputContent] = useState(SAMPLE_YAML);
  const [mode, setMode] = useState<'yaml2json' | 'json2yaml'>('yaml2json');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const convert = () => {
    if (!inputContent.trim()) return { result: '', error: null };

    try {
      if (mode === 'yaml2json') {
        const parsed = YAML.parse(inputContent);
        return { result: JSON.stringify(parsed, null, 2), error: null };
      } else {
        const parsed = JSON.parse(inputContent);
        return { result: YAML.stringify(parsed), error: null };
      }
    } catch (err: any) {
      return { result: '', error: err.message };
    }
  };

  const { result, error } = convert();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="YAML ↔ JSON Data Converter"
        description="Convert YAML strings to JSON objects and vice versa with instant validation."
        onLoadSample={() => {
          setMode('yaml2json');
          setInputContent(SAMPLE_YAML);
        }}
        onClear={() => setInputContent('')}
        onCopy={() => navigator.clipboard.writeText(result)}
      />

      {/* Mode Switcher */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('yaml2json')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'yaml2json' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
            }`}
          >
            <FileCode2 className="w-4 h-4" /> YAML ➔ JSON
          </button>
          <button
            onClick={() => setMode('json2yaml')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'json2yaml' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" /> JSON ➔ YAML
          </button>
        </div>
      </div>

      {/* Code Editor Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">
            Input ({mode === 'yaml2json' ? 'YAML Format' : 'JSON Format'})
          </label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={16}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Paste code here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">
            Converted Result ({mode === 'yaml2json' ? 'JSON Output' : 'YAML Output'})
          </label>

          {error ? (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono shadow-sm">
              Syntax Error: {error}
            </div>
          ) : (
            <textarea
              rows={16}
              readOnly
              value={result}
              placeholder="Result will appear here..."
              className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-700 dark:text-emerald-300 leading-relaxed bg-slate-50/90 dark:bg-gray-950/90 shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
