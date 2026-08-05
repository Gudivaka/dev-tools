import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { RefreshCcw } from 'lucide-react';

const SAMPLE_PHP_SERIALIZED = `a:3:{s:2:"id";i:101;s:4:"name";s:15:"Alice Developer";s:5:"roles";a:2:{i:0;s:5:"admin";i:1;s:3:"dev";}}`;

export const PhpSerializer: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState(SAMPLE_PHP_SERIALIZED);
  const [direction, setDirection] = useState<'unserialize' | 'serialize'>('unserialize');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simple PHP Unserializer
  const phpUnserialize = (str: string) => {
    if (!str.trim()) return null;
    let offset = 0;

    const readUntil = (delimiter: string) => {
      const pos = str.indexOf(delimiter, offset);
      if (pos === -1) throw new Error(`Invalid PHP serialized format near index ${offset}`);
      const val = str.substring(offset, pos);
      offset = pos + delimiter.length;
      return val;
    };

    const parseValue = (): any => {
      const type = str[offset];
      offset += 2; // skip type and colon e.g. 's:'

      switch (type) {
        case 'N':
          return null;
        case 'b': {
          const val = readUntil(';');
          return val === '1';
        }
        case 'i': {
          const val = readUntil(';');
          return parseInt(val, 10);
        }
        case 'd': {
          const val = readUntil(';');
          return parseFloat(val);
        }
        case 's': {
          const len = parseInt(readUntil(':'), 10);
          if (str[offset] === '"') offset += 1;
          const val = str.substring(offset, offset + len);
          offset += len + 2; // skip quote and semicolon '";'
          return val;
        }
        case 'a': {
          const count = parseInt(readUntil(':'), 10);
          if (str[offset] === '{') offset += 1;
          const obj: any = {};
          let isArray = true;

          for (let i = 0; i < count; i++) {
            const key = parseValue();
            const value = parseValue();
            if (typeof key !== 'number' || key !== i) isArray = false;
            obj[key] = value;
          }
          if (str[offset] === '}') offset += 1;

          if (isArray) return Object.values(obj);
          return obj;
        }
        default:
          throw new Error(`Unsupported PHP serialized type '${type}'`);
      }
    };

    try {
      return parseValue();
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Simple PHP Serializer
  const phpSerialize = (val: any): string => {
    if (val === null) return 'N;';
    if (typeof val === 'boolean') return `b:${val ? 1 : 0};`;
    if (typeof val === 'number') return Number.isInteger(val) ? `i:${val};` : `d:${val};`;
    if (typeof val === 'string') return `s:${new TextEncoder().encode(val).length}:"${val}";`;
    if (Array.isArray(val)) {
      let res = `a:${val.length}:{`;
      val.forEach((item, idx) => {
        res += `i:${idx};${phpSerialize(item)}`;
      });
      return res + '}';
    }
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      let res = `a:${keys.length}:{`;
      keys.forEach((key) => {
        res += `${phpSerialize(key)}${phpSerialize(val[key])}`;
      });
      return res + '}';
    }
    return 'N;';
  };

  const processConversion = () => {
    if (direction === 'unserialize') {
      const res = phpUnserialize(inputText);
      if (res && res.error) return `Error: ${res.error}`;
      return JSON.stringify(res, null, 2);
    } else {
      try {
        const json = JSON.parse(inputText);
        return phpSerialize(json);
      } catch (err: any) {
        return `Error parsing JSON input: ${err.message}`;
      }
    }
  };

  const resultText = processConversion();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="PHP Serializer & Unserializer"
        description="Convert PHP serialized data strings to readable JSON objects and vice versa."
        onLoadSample={() => {
          setDirection('unserialize');
          setInputText(SAMPLE_PHP_SERIALIZED);
        }}
        onClear={() => setInputText('')}
        onCopy={() => navigator.clipboard.writeText(resultText)}
      />

      {/* Control Bar */}
      <div className="flex items-center gap-2 p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 shadow-sm">
        <button
          onClick={() => setDirection('unserialize')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            direction === 'unserialize' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
          }`}
        >
          PHP Serialized ➔ JSON
        </button>
        <button
          onClick={() => setDirection('serialize')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            direction === 'serialize' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
          }`}
        >
          JSON ➔ PHP Serialized
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">
            Input ({direction === 'unserialize' ? 'PHP Serialized String' : 'JSON Object'})
          </label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste serialized string e.g. a:2:{...}"
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">
            Converted Result ({direction === 'unserialize' ? 'Formatted JSON' : 'PHP Serialized Result'})
          </label>
          <textarea
            rows={14}
            readOnly
            value={resultText}
            placeholder="Result will appear here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-700 dark:text-emerald-300 leading-relaxed bg-slate-50/90 dark:bg-gray-950/90 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
