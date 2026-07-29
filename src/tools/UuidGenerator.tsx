import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Fingerprint, RefreshCw } from 'lucide-react';

export const UuidGenerator: React.FC = () => {
  const [uuidVersion, setUuidVersion] = useState<'v4' | 'v1' | 'nanoid' | 'ulid'>('v4');
  const [count, setCount] = useState<number>(10);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [quotes, setQuotes] = useState<boolean>(false);

  // Client-side Generators
  const generateV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateV1 = () => {
    const now = Date.now();
    const hexTime = now.toString(16).padStart(12, '0');
    return `${hexTime.slice(0, 8)}-${hexTime.slice(8, 12)}-11e1-8000-00805f9b34fb`;
  };

  const generateNanoId = (size = 21) => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
    let id = '';
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    for (let i = 0; i < size; i++) {
      id += alphabet[bytes[i] % alphabet.length];
    }
    return id;
  };

  const generateUlid = () => {
    const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    const now = Date.now();
    let timeStr = '';
    let time = now;
    for (let i = 9; i >= 0; i--) {
      const mod = time % 32;
      timeStr = CROCKFORD_BASE32[mod] + timeStr;
      time = Math.floor(time / 32);
    }
    let randStr = '';
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    for (let i = 0; i < 10; i++) {
      randStr += CROCKFORD_BASE32[bytes[i] % 32];
    }
    return timeStr + randStr;
  };

  const generateBulk = () => {
    const list: string[] = [];
    for (let i = 0; i < Math.min(count, 500); i++) {
      let raw = '';
      if (uuidVersion === 'v4') raw = generateV4();
      else if (uuidVersion === 'v1') raw = generateV1();
      else if (uuidVersion === 'nanoid') raw = generateNanoId();
      else if (uuidVersion === 'ulid') raw = generateUlid();

      if (!hyphens && (uuidVersion === 'v4' || uuidVersion === 'v1')) {
        raw = raw.replace(/-/g, '');
      }

      if (uppercase) raw = raw.toUpperCase();

      if (quotes) raw = `"${raw}"`;

      list.push(raw);
    }
    return list;
  };

  const [generatedList, setGeneratedList] = useState<string[]>(generateBulk());

  const handleRegenerate = () => {
    setGeneratedList(generateBulk());
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="UUID / ULID / NanoID Generator"
        description="Bulk generate unique identifiers (UUID v4, UUID v1, NanoID, ULID) with custom formatting."
        onCopy={() => navigator.clipboard.writeText(generatedList.join('\n'))}
        onDownload={() => {
          const blob = new Blob([generatedList.join('\n')], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `uuids_${uuidVersion}.txt`;
          a.click();
        }}
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400">Type:</span>
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs">
            <button
              onClick={() => setUuidVersion('v4')}
              className={`px-3 py-1 rounded-lg ${uuidVersion === 'v4' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              UUID v4
            </button>
            <button
              onClick={() => setUuidVersion('v1')}
              className={`px-3 py-1 rounded-lg ${uuidVersion === 'v1' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              UUID v1
            </button>
            <button
              onClick={() => setUuidVersion('nanoid')}
              className={`px-3 py-1 rounded-lg ${uuidVersion === 'nanoid' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              NanoID
            </button>
            <button
              onClick={() => setUuidVersion('ulid')}
              className={`px-3 py-1 rounded-lg ${uuidVersion === 'ulid' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              ULID
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 text-xs text-gray-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
            />
            <span>Uppercase</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
            />
            <span>Hyphens</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={quotes}
              onChange={(e) => setQuotes(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
            />
            <span>Quotes</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">Quantity:</span>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 glass-input px-2 py-1 rounded-lg text-xs font-mono text-center"
            />
          </div>

          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate
          </button>
        </div>
      </div>

      {/* Generated Output */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-indigo-400" /> Generated List ({generatedList.length})
        </label>
        <textarea
          rows={14}
          readOnly
          value={generatedList.join('\n')}
          className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950/90"
        />
      </div>
    </div>
  );
};
