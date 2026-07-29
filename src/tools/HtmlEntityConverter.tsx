import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Code, ArrowRightLeft } from 'lucide-react';

const SAMPLE_HTML = `<div class="container" id="main">
  <h1>Hello World & Welcome!</h1>
  <p>Cost: $50 & 50¢</p>
</div>`;

export const HtmlEntityConverter: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_HTML);
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [mode, setMode] = useState<'named' | 'decimal' | 'hex'>('named');

  // Encode HTML Entities
  const encodeHtml = (text: string) => {
    if (!text) return '';
    if (mode === 'named') {
      const textarea = document.createElement('textarea');
      textarea.innerText = text;
      return textarea.innerHTML
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    } else if (mode === 'decimal') {
      return text.split('').map((char) => `&#${char.charCodeAt(0)};`).join('');
    } else {
      return text.split('').map((char) => `&#x${char.charCodeAt(0).toString(16)};`).join('');
    }
  };

  // Decode HTML Entities
  const decodeHtml = (text: string) => {
    if (!text) return '';
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || '';
  };

  const outputText = direction === 'encode' ? encodeHtml(inputText) : decodeHtml(inputText);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="HTML Entity Encode / Decode"
        description="Convert special characters, HTML markup, and unicode into HTML named, decimal, or hex entities."
        onLoadSample={() => {
          setDirection('encode');
          setInputText(SAMPLE_HTML);
        }}
        onClear={() => setInputText('')}
        onCopy={() => navigator.clipboard.writeText(outputText)}
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              direction === 'encode' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Encode to Entities
          </button>
          <button
            onClick={() => setDirection('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              direction === 'decode' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Decode Entities
          </button>
        </div>

        {direction === 'encode' && (
          <div className="flex items-center gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setMode('named')}
              className={`px-3 py-1 rounded-lg ${mode === 'named' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Named (&amp;)
            </button>
            <button
              onClick={() => setMode('decimal')}
              className={`px-3 py-1 rounded-lg ${mode === 'decimal' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Decimal (&#38;)
            </button>
            <button
              onClick={() => setMode('hex')}
              className={`px-3 py-1 rounded-lg ${mode === 'hex' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Hex (&#x26;)
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">
            Input ({direction === 'encode' ? 'Raw Text / HTML' : 'HTML Entities'})
          </label>
          <textarea
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to convert..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">
            Converted Result ({direction === 'encode' ? 'HTML Entities' : 'Decoded Text'})
          </label>
          <textarea
            rows={14}
            readOnly
            value={outputText}
            placeholder="Result will appear here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950/90"
          />
        </div>
      </div>
    </div>
  );
};
