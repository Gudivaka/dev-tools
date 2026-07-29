import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Type, FileText } from 'lucide-react';

export const StringConverter: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState('Hello World Developer Tools Studio');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Metrics
  const charCount = inputText.length;
  const charNoSpaces = inputText.replace(/\s+/g, '').length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const lineCount = inputText.trim() ? inputText.split('\n').length : 0;

  // Case Converters
  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase()))
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .replace(/\s+/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .replace(/\s+/g, '-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const caseTransformations = [
    { label: 'camelCase', value: toCamelCase(inputText) },
    { label: 'PascalCase', value: toPascalCase(inputText) },
    { label: 'snake_case', value: toSnakeCase(inputText) },
    { label: 'kebab-case', value: toKebabCase(inputText) },
    { label: 'CONSTANT_CASE', value: toConstantCase(inputText) },
    { label: 'Title Case', value: toTitleCase(inputText) },
    { label: 'UPPERCASE', value: inputText.toUpperCase() },
    { label: 'lowercase', value: inputText.toLowerCase() },
  ];

  return (
    <div className="space-y-6">
      <ToolHeader
        title="String Inspector & Case Converter"
        description="Convert string case styles (camelCase, snake_case, kebab-case) and inspect text character/word metrics."
        onLoadSample={() => setInputText('the quick brown fox jumps over the lazy dog')}
        onClear={() => setInputText('')}
      />

      {/* Input */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-400" /> Enter Text String
        </label>
        <textarea
          ref={inputRef}
          autoFocus
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste string..."
          className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
        />
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-center">
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Characters</div>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{charCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-center">
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Without Spaces</div>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">{charNoSpaces}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-center">
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Words</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{wordCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-center">
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Lines</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">{lineCount}</div>
        </div>
      </div>

      {/* Transformed Case Outputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseTransformations.map((trans) => (
          <div key={trans.label} className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300">{trans.label}</span>
              <button
                onClick={() => navigator.clipboard.writeText(trans.value)}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                Copy
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={trans.value}
              className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-300 bg-gray-950"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
