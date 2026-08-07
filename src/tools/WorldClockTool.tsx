import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Clock, Plus, Trash2, Globe, Sun, Moon, Search } from 'lucide-react';

interface ClockCity {
  id: string;
  cityName: string;
  timeZone: string;
  country: string;
}

const DEFAULT_CITIES: ClockCity[] = [
  { id: 'utc', cityName: 'UTC / GMT', timeZone: 'UTC', country: 'Coordinated Universal Time' },
  { id: 'ist', cityName: 'India (IST)', timeZone: 'Asia/Kolkata', country: 'India' },
  { id: 'est', cityName: 'New York (EST/EDT)', timeZone: 'America/New_York', country: 'USA' },
  { id: 'pst', cityName: 'San Francisco (PST/PDT)', timeZone: 'America/Los_Angeles', country: 'USA' },
  { id: 'bst', cityName: 'London (GMT/BST)', timeZone: 'Europe/London', country: 'UK' },
  { id: 'jst', cityName: 'Tokyo (JST)', timeZone: 'Asia/Tokyo', country: 'Japan' },
];

const COMMON_TIMEZONES = [
  { name: 'San Francisco / Los Angeles (PST)', zone: 'America/Los_Angeles' },
  { name: 'New York / Toronto (EST)', zone: 'America/New_York' },
  { name: 'Chicago (CST)', zone: 'America/Chicago' },
  { name: 'London (GMT/BST)', zone: 'Europe/London' },
  { name: 'Paris / Berlin / Amsterdam (CET)', zone: 'Europe/Paris' },
  { name: 'Dubai (GST)', zone: 'Asia/Dubai' },
  { name: 'India (IST)', zone: 'Asia/Kolkata' },
  { name: 'Singapore / Hong Kong (SGT)', zone: 'Asia/Singapore' },
  { name: 'Tokyo / Seoul (JST)', zone: 'Asia/Tokyo' },
  { name: 'Sydney / Melbourne (AEST)', zone: 'Australia/Sydney' },
  { name: 'Auckland (NZST)', zone: 'Pacific/Auckland' },
];

// SVG Analog Clock Component
const AnalogClock: React.FC<{ date: Date; timeZone: string }> = ({ date, timeZone }) => {
  // Format date parts in specific timezone
  const getTimeInZone = (d: Date, tz: string) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).formatToParts(d);

      let h = 0, m = 0, s = 0;
      parts.forEach((p) => {
        if (p.type === 'hour') h = parseInt(p.value, 10) % 12;
        if (p.type === 'minute') m = parseInt(p.value, 10);
        if (p.type === 'second') s = parseInt(p.value, 10);
      });
      return { h, m, s };
    } catch (err) {
      return { h: d.getHours() % 12, m: d.getMinutes(), s: d.getSeconds() };
    }
  };

  const { h, m, s } = getTimeInZone(date, timeZone);

  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hourDeg = h * 30 + m * 0.5;

  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto select-none">
      {/* Clock Outer Rim */}
      <circle cx="50" cy="50" r="46" className="fill-gray-100 dark:fill-gray-900 stroke-gray-300 dark:stroke-gray-700" strokeWidth="3" />

      {/* Hour Ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const rad = (i * 30 * Math.PI) / 180;
        const x1 = 50 + 38 * Math.sin(rad);
        const y1 = 50 - 38 * Math.cos(rad);
        const x2 = 50 + 43 * Math.sin(rad);
        const y2 = 50 - 43 * Math.cos(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth={i % 3 === 0 ? '2' : '1'}
          />
        );
      })}

      {/* Hour Hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 24 * Math.sin((hourDeg * Math.PI) / 180)}
        y2={50 - 24 * Math.cos((hourDeg * Math.PI) / 180)}
        className="stroke-gray-900 dark:stroke-white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Minute Hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 32 * Math.sin((minDeg * Math.PI) / 180)}
        y2={50 - 32 * Math.cos((minDeg * Math.PI) / 180)}
        className="stroke-indigo-600 dark:stroke-indigo-400"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Second Hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 36 * Math.sin((secDeg * Math.PI) / 180)}
        y2={50 - 36 * Math.cos((secDeg * Math.PI) / 180)}
        className="stroke-red-500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center Pin */}
      <circle cx="50" cy="50" r="2.5" className="fill-red-500" />
    </svg>
  );
};

export const WorldClockTool: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  const [now, setNow] = useState(new Date());
  const [cities, setCities] = useState<ClockCity[]>(DEFAULT_CITIES);
  const [selectedTz, setSelectedTz] = useState('America/Chicago');
  const [customCityName, setCustomCityName] = useState('');

  // Interactive Time Travel Slider (0 - 1439 minutes)
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [sliderMinutes, setSliderMinutes] = useState(720); // default noon

  // Live ticking interval
  useEffect(() => {
    if (isSliderActive) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isSliderActive]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Compute displayed target Date
  const getDisplayDate = (): Date => {
    if (!isSliderActive) return now;
    const d = new Date(now);
    const hours = Math.floor(sliderMinutes / 60);
    const mins = sliderMinutes % 60;
    d.setHours(hours, mins, 0);
    return d;
  };

  const displayDate = getDisplayDate();

  const handleAddCity = () => {
    if (!selectedTz) return;
    const name = customCityName.trim() || selectedTz.split('/')[1]?.replace(/_/g, ' ') || selectedTz;
    const newCity: ClockCity = {
      id: Date.now().toString(),
      cityName: name,
      timeZone: selectedTz,
      country: selectedTz.split('/')[0] || 'World',
    };
    setCities((prev) => [...prev, newCity]);
    setCustomCityName('');
  };

  const handleRemoveCity = (id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  };

  // Format date helper
  const formatDigitalTime = (d: Date, tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(d);
    } catch (e) {
      return d.toLocaleTimeString();
    }
  };

  const formatDateString = (d: Date, tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    } catch (e) {
      return d.toLocaleDateString();
    }
  };

  const getTzOffset = (d: Date, tz: string) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'short',
      }).formatToParts(d);
      const namePart = parts.find((p) => p.type === 'timeZoneName');
      return namePart ? namePart.value : tz;
    } catch (e) {
      return tz;
    }
  };

  const isDaytime = (d: Date, tz: string) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false,
      }).formatToParts(d);
      const hourPart = parts.find((p) => p.type === 'hour');
      const hour = hourPart ? parseInt(hourPart.value, 10) : 12;
      return hour >= 6 && hour < 18;
    } catch (e) {
      return true;
    }
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="World Clock & Timezone Inspector"
        description="Inspect multiple timezones simultaneously with live digital & analog ticking clocks and time comparison sliders."
        onLoadSample={() => {
          setCities(DEFAULT_CITIES);
          setIsSliderActive(false);
        }}
        onClear={() => setCities([])}
      />

      {/* Add Timezone Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
        <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" /> Add World Timezone Clock
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Select Timezone</label>
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-medium text-gray-300"
            >
              {COMMON_TIMEZONES.map((t) => (
                <option key={t.zone} value={t.zone}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Custom Label (Optional)</label>
            <input
              ref={searchRef}
              autoFocus
              type="text"
              placeholder="e.g. Client HQ / Server 1"
              value={customCityName}
              onChange={(e) => setCustomCityName(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddCity}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 font-semibold text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Clock Card
            </button>
          </div>
        </div>
      </div>

      {/* Time Travel Slider Control */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-semibold text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isSliderActive}
              onChange={(e) => setIsSliderActive(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
            />
            <span>Time Comparison Slider (Scrub Hours)</span>
          </label>

          {isSliderActive ? (
            <button
              onClick={() => setIsSliderActive(false)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            >
              Return to Live Clock
            </button>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Ticking
            </span>
          )}
        </div>

        {isSliderActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Target Time:</span>
              <span className="text-indigo-400 font-bold text-sm">
                {String(Math.floor(sliderMinutes / 60)).padStart(2, '0')}:{String(sliderMinutes % 60).padStart(2, '0')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1439}
              value={sliderMinutes}
              onChange={(e) => setSliderMinutes(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        )}
      </div>

      {/* World Clock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => {
          const day = isDaytime(displayDate, city.timeZone);
          const digitalTime = formatDigitalTime(displayDate, city.timeZone);
          const dateStr = formatDateString(displayDate, city.timeZone);
          const offset = getTzOffset(displayDate, city.timeZone);

          return (
            <div
              key={city.id}
              className="relative p-5 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-4 hover:border-indigo-500/40 transition-all shadow-xl group"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-800/80 pb-3">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {day ? (
                      <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    )}
                    <span>{city.cityName}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{offset}</div>
                </div>

                <button
                  onClick={() => handleRemoveCity(city.id)}
                  className="p-1 text-gray-500 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove clock"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Analog Clock */}
              <div className="py-2">
                <AnalogClock date={displayDate} timeZone={city.timeZone} />
              </div>

              {/* Digital Time & Date Display */}
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold font-mono text-emerald-300 tracking-wider">
                  {digitalTime}
                </div>
                <div className="text-xs font-mono text-gray-400">{dateStr}</div>
              </div>
            </div>
          );
        })}

        {cities.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 text-xs">
            No clock cards. Add a timezone clock above to get started.
          </div>
        )}
      </div>
    </div>
  );
};
