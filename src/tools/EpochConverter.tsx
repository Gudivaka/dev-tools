import React, { useState, useEffect } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Clock, RefreshCw, Calendar, Globe } from 'lucide-react';

export const EpochConverter: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentEpochSeconds = Math.floor(now.getTime() / 1000);
  const currentEpochMillis = now.getTime();

  // Epoch to Date Calculation
  const parseEpoch = (input: string) => {
    const num = Number(input.trim());
    if (isNaN(num) || input.trim() === '') return null;

    // Handle seconds vs milliseconds vs microseconds vs nanoseconds
    let ms = num;
    if (num < 1e11) {
      ms = num * 1000; // Seconds
    } else if (num > 1e14 && num < 1e17) {
      ms = Math.floor(num / 1000); // Microseconds
    } else if (num >= 1e17) {
      ms = Math.floor(num / 1000000); // Nanoseconds
    }

    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  const parsedDate = parseEpoch(epochInput);

  // Relative Time helper
  const getRelativeTime = (d: Date) => {
    const diffMs = d.getTime() - Date.now();
    const diffSec = Math.floor(diffMs / 1000);
    const absSec = Math.abs(diffSec);

    if (absSec < 60) return diffSec >= 0 ? `in ${absSec} seconds` : `${absSec} seconds ago`;
    if (absSec < 3600) return diffSec >= 0 ? `in ${Math.floor(absSec / 60)} minutes` : `${Math.floor(absSec / 60)} minutes ago`;
    if (absSec < 86400) return diffSec >= 0 ? `in ${Math.floor(absSec / 3600)} hours` : `${Math.floor(absSec / 3600)} hours ago`;
    return diffSec >= 0 ? `in ${Math.floor(absSec / 86400)} days` : `${Math.floor(absSec / 86400)} days ago`;
  };

  // Convert Date Input to Epoch
  const handleDateInputChange = (val: string) => {
    setDateInput(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setEpochInput(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const setPreset = (offsetMs: number) => {
    const target = new Date(Date.now() + offsetMs);
    setEpochInput(Math.floor(target.getTime() / 1000).toString());
    setDateInput(target.toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Epoch / Timestamp Converter"
        description="Convert Unix timestamps (seconds, milliseconds) to human-readable dates and vice versa."
        onLoadSample={() => {
          setEpochInput('1700000000');
        }}
        onClear={() => {
          setEpochInput('');
          setDateInput('');
        }}
        onCopy={() => {
          if (parsedDate) {
            navigator.clipboard.writeText(parsedDate.toISOString());
          }
        }}
      />

      {/* Live Ticking Clock Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-medium">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Current Epoch (Sec)</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-2 tracking-wider">
            {currentEpochSeconds}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-purple-300 font-medium">
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Current Epoch (Ms)</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-2 tracking-wider">
            {currentEpochMillis}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Current UTC Time</span>
          </div>
          <div className="text-sm font-mono font-semibold text-emerald-200 mt-2 truncate">
            {now.toUTCString()}
          </div>
        </div>
      </div>

      {/* Converter Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Epoch -> Human Date */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
          <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Convert Epoch Timestamp to Human Date
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Enter Timestamp (Seconds or Milliseconds)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="e.g. 1700000000"
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm font-mono"
              />
              <button
                onClick={() => {
                  const nowSec = Math.floor(Date.now() / 1000).toString();
                  setEpochInput(nowSec);
                }}
                className="px-3 py-2 text-xs font-medium rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 whitespace-nowrap"
              >
                Set Now
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={() => setPreset(0)} className="px-2.5 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">Now</button>
            <button onClick={() => setPreset(3600 * 1000)} className="px-2.5 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">+1 Hour</button>
            <button onClick={() => setPreset(86400 * 1000)} className="px-2.5 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">+1 Day</button>
            <button onClick={() => setPreset(7 * 86400 * 1000)} className="px-2.5 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">+1 Week</button>
            <button onClick={() => setPreset(-86400 * 1000)} className="px-2.5 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">-1 Day</button>
          </div>

          {/* Results Table */}
          {parsedDate ? (
            <div className="mt-4 p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-gray-800/80">
                <span className="text-gray-500 font-sans">GMT / UTC:</span>
                <span className="text-indigo-300 font-semibold">{parsedDate.toUTCString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/80">
                <span className="text-gray-500 font-sans">ISO 8601:</span>
                <span className="text-emerald-300 font-semibold">{parsedDate.toISOString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/80">
                <span className="text-gray-500 font-sans">Your Local Time:</span>
                <span className="text-purple-300 font-semibold">{parsedDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-sans">Relative Time:</span>
                <span className="text-amber-300 font-semibold">{getRelativeTime(parsedDate)}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              Invalid timestamp format. Enter a valid numerical Unix epoch.
            </div>
          )}
        </div>

        {/* Right Card: Human Date Picker -> Epoch */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
          <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Convert Human Date to Epoch Timestamp
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Select Local Date & Time</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => handleDateInputChange(e.target.value)}
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm font-mono"
            />
          </div>

          {/* Results */}
          {dateInput && !isNaN(new Date(dateInput).getTime()) ? (
            <div className="mt-4 p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-gray-800/80">
                <span className="text-gray-500 font-sans">Epoch Seconds:</span>
                <span className="text-indigo-300 font-bold">{Math.floor(new Date(dateInput).getTime() / 1000)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/80">
                <span className="text-gray-500 font-sans">Epoch Milliseconds:</span>
                <span className="text-purple-300 font-bold">{new Date(dateInput).getTime()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-sans">ISO String:</span>
                <span className="text-emerald-300 font-bold">{new Date(dateInput).toISOString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-800/40 text-gray-500 text-xs">
              Select a date and time above to compute epoch timestamps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
