import React, { useState } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Fingerprint, RefreshCw, Search } from 'lucide-react';

export const UuidGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'decode'>('generate');

  // Generator State
  const [uuidVersion, setUuidVersion] = useState<'v4' | 'v1' | 'nanoid' | 'ulid'>('v4');
  const [count, setCount] = useState<number>(10);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [quotes, setQuotes] = useState<boolean>(false);

  // Decoder State
  const [decodeInput, setDecodeInput] = useState<string>('01ARZ3NDEKTSV4RRFFQ69G5FAV');

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

  // Decode ULID / UUID v1
  const decodeId = (str: string) => {
    const clean = str.trim();
    if (!clean) return null;

    // Try ULID Decode (26 Crockford Base32 characters)
    const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    if (clean.length === 26 && /^[0-9A-HJKMNP-TV-Z]+$/i.test(clean)) {
      const timePart = clean.substring(0, 10).toUpperCase();
      let timestamp = 0;
      for (let i = 0; i < timePart.length; i++) {
        const char = timePart[i];
        const val = CROCKFORD_BASE32.indexOf(char);
        if (val !== -1) {
          timestamp = timestamp * 32 + val;
        }
      }
      const d = new Date(timestamp);
      return {
        type: 'ULID',
        timestamp,
        dateUtc: d.toUTCString(),
        dateLocal: d.toLocaleString(),
        randomPart: clean.substring(10),
      };
    }

    // Try UUID v1 / v4 Decode (36 chars standard format)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clean)) {
      const version = clean.charAt(14);
      return {
        type: `UUID v${version}`,
        version: `Version ${version}`,
        variant: 'RFC 4122 / Leach-Salz',
        raw: clean,
      };
    }

    return { type: 'Unknown / Unrecognized ID Format' };
  };

  const decodedInfo = decodeId(decodeInput);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="UUID / ULID Generator & Decoder"
        description="Bulk generate unique identifiers (UUID v4, UUID v1, NanoID, ULID) and decode timestamps from ULID / UUIDs."
        onCopy={() => {
          if (activeTab === 'generate') navigator.clipboard.writeText(generatedList.join('\n'));
          else if (decodedInfo?.dateUtc) navigator.clipboard.writeText(decodedInfo.dateUtc);
        }}
        onDownload={() => {
          if (activeTab !== 'generate') return;
          const blob = new Blob([generatedList.join('\n')], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `uuids_${uuidVersion}.txt`;
          a.click();
        }}
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 shadow-sm">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'generate' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
          }`}
        >
          Bulk Generator
        </button>
        <button
          onClick={() => setActiveTab('decode')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'decode' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
          }`}
        >
          Decode ULID / UUID
        </button>
      </div>

      {activeTab === 'generate' ? (
        <>
          {/* Generator Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Type:</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-gray-950 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
                <button
                  onClick={() => setUuidVersion('v4')}
                  className={`px-3 py-1 rounded-lg transition-all ${uuidVersion === 'v4' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
                >
                  UUID v4
                </button>
                <button
                  onClick={() => setUuidVersion('v1')}
                  className={`px-3 py-1 rounded-lg transition-all ${uuidVersion === 'v1' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
                >
                  UUID v1
                </button>
                <button
                  onClick={() => setUuidVersion('nanoid')}
                  className={`px-3 py-1 rounded-lg transition-all ${uuidVersion === 'nanoid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
                >
                  NanoID
                </button>
                <button
                  onClick={() => setUuidVersion('ulid')}
                  className={`px-3 py-1 rounded-lg transition-all ${uuidVersion === 'ulid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
                >
                  ULID
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-700 dark:text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 dark:bg-gray-950 border-slate-300 dark:border-gray-700 text-indigo-600"
                />
                <span>Uppercase</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 dark:bg-gray-950 border-slate-300 dark:border-gray-700 text-indigo-600"
                />
                <span>Hyphens</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={quotes}
                  onChange={(e) => setQuotes(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 dark:bg-gray-950 border-slate-300 dark:border-gray-700 text-indigo-600"
                />
                <span>Quotes</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-gray-400">Qty:</span>
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

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Generated List ({generatedList.length})
            </label>
            <textarea
              rows={14}
              readOnly
              value={generatedList.join('\n')}
              className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-700 dark:text-emerald-300 leading-relaxed bg-slate-50/90 dark:bg-gray-950/90 shadow-sm"
            />
          </div>
        </>
      ) : (
        /* Decoder Tab */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 shadow-sm">
            <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Enter ULID or UUID to Decode
            </label>
            <input
              type="text"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="e.g. 01ARZ3NDEKTSV4RRFFQ69G5FAV or 1e1b8c00..."
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono text-indigo-700 dark:text-indigo-300 font-bold"
            />
          </div>

          {decodedInfo && (
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 text-xs font-mono shadow-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-gray-800 pb-2">
                <span className="text-slate-500 dark:text-gray-400 font-sans">Identifier Type:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{decodedInfo.type}</span>
              </div>
              {decodedInfo.timestamp && (
                <>
                  <div className="flex justify-between border-b border-slate-200 dark:border-gray-800 py-1.5">
                    <span className="text-slate-500 dark:text-gray-400 font-sans">Embedded Timestamp (Ms):</span>
                    <span className="text-purple-600 dark:text-purple-300 font-bold">{decodedInfo.timestamp}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-gray-800 py-1.5">
                    <span className="text-slate-500 dark:text-gray-400 font-sans">UTC Creation Time:</span>
                    <span className="text-emerald-600 dark:text-emerald-300 font-bold">{decodedInfo.dateUtc}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 dark:text-gray-400 font-sans">Local Creation Time:</span>
                    <span className="text-amber-600 dark:text-amber-300 font-bold">{decodedInfo.dateLocal}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
