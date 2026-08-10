import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { CalendarClock, Calendar, Clock, AlertCircle, Sparkles, Globe } from 'lucide-react';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';

const TIMEZONE_OPTIONS = [
  { label: `Local Browser Timezone (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, value: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: 'UTC / GMT (Coordinated Universal Time)', value: 'UTC' },
  { label: 'US Pacific Time (PST / PDT - SF/LA)', value: 'America/Los_Angeles' },
  { label: 'US Mountain Time (MST / MDT - Denver)', value: 'America/Denver' },
  { label: 'US Central Time (CST / CDT - Chicago)', value: 'America/Chicago' },
  { label: 'US Eastern Time (EST / EDT - New York/Toronto)', value: 'America/New_York' },
  { label: 'UK & Ireland (GMT / BST - London)', value: 'Europe/London' },
  { label: 'Central Europe (CET / CEST - Paris/Berlin/Amsterdam)', value: 'Europe/Paris' },
  { label: 'India Standard Time (IST)', value: 'Asia/Kolkata' },
  { label: 'Japan Standard Time (JST - Tokyo)', value: 'Asia/Tokyo' },
  { label: 'Singapore & Hong Kong (SGT / HKT)', value: 'Asia/Singapore' },
  { label: 'Australia Eastern (AEST / AEDT - Sydney)', value: 'Australia/Sydney' },
];

export const CronParser: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cronExpr, setCronExpr] = useState('*/15 * * * *');
  const [selectedTz, setSelectedTz] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [use24Hour, setUse24Hour] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Parse English Description & Field Breakdown
  let description = '';
  let parseError: string | null = null;
  let nextExecutions: { date: Date; relativeStr: string }[] = [];

  const cleanExpr = cronExpr.trim();

  // Parse Human Description via cronstrue
  if (cleanExpr) {
    try {
      description = cronstrue.toString(cleanExpr, {
        use24HourTimeFormat: use24Hour,
        verbose: true,
      });
    } catch (err: any) {
      parseError = err.message || 'Invalid cron expression format';
    }

    // Parse Next Executions via cron-parser with selected timezone
    if (!parseError) {
      try {
        const interval = CronExpressionParser.parse(cleanExpr, {
          currentDate: new Date(),
          tz: selectedTz,
        });

        const getRelativeTimeString = (targetDate: Date, now = new Date()) => {
          const diffMs = targetDate.getTime() - now.getTime();
          const diffMins = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          if (diffMins < 1) return 'in less than a minute';
          if (diffMins < 60) return `in ${diffMins} min${diffMins > 1 ? 's' : ''}`;
          if (diffHours < 24) return `in ${diffHours} hr${diffHours > 1 ? 's' : ''} ${diffMins % 60}m`;
          return `in ${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours % 24}h`;
        };

        for (let i = 0; i < 10; i++) {
          const nextDate = interval.next().toDate();
          nextExecutions.push({
            date: nextDate,
            relativeStr: getRelativeTimeString(nextDate),
          });
        }
      } catch (err: any) {
        if (!parseError) {
          parseError = err.message || 'Error computing upcoming execution dates';
        }
      }
    }
  }

  // Breakdown fields
  const fields = cleanExpr.split(/\s+/);
  const is6Field = fields.length >= 6;

  const fieldNames = is6Field
    ? ['Second', 'Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week']
    : ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Cron Expression Parser & Visualizer"
        description="Convert standard 5-part or 6-part cron syntax into plain English and preview accurate upcoming execution schedules in any timezone."
        onLoadSample={() => setCronExpr('0 9 * * 1-5')}
        onClear={() => setCronExpr('')}
      />

      {/* Input & Presets Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Enter Cron Expression
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={use24Hour}
                  onChange={(e) => setUse24Hour(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 dark:bg-gray-950 border-slate-300 dark:border-gray-700 text-indigo-600 focus:ring-0"
                />
                <span>24-Hour Clock</span>
              </label>
            </div>

            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={cronExpr}
              onChange={(e) => setCronExpr(e.target.value)}
              placeholder="e.g. */15 * * * *"
              className="w-full glass-input px-4 py-3 rounded-xl text-lg font-mono text-indigo-700 dark:text-indigo-300 font-bold tracking-wide"
            />

            {/* Timezone Selection Control */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" /> Schedule Timezone Evaluator:
                </label>
                <select
                  value={selectedTz}
                  onChange={(e) => setSelectedTz(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-gray-200"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Breakdown Summary */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 mb-1">Field Breakdown:</div>
                <div className="flex flex-wrap gap-1.5">
                  {fieldNames.map((name, idx) => {
                    const val = fields[idx] || '-';
                    return (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-[11px] flex flex-col items-center flex-1 min-w-[50px]"
                      >
                        <span className="text-[9px] text-slate-400 dark:text-gray-500 font-medium">{name}</span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          {parseError ? (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <div>
                <span className="font-bold">Invalid Cron Expression:</span> {parseError}
              </div>
            </div>
          ) : description ? (
            <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-200 space-y-2 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Human Readable Description
              </div>
              <div className="text-xl font-bold text-indigo-950 dark:text-white capitalize">{description}</div>
            </div>
          ) : null}
        </div>

        {/* Common Presets */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-gray-300">Common Presets</h3>
          <div className="space-y-2">
            {[
              { label: 'Every minute', expr: '* * * * *' },
              { label: 'Every 5 minutes', expr: '*/5 * * * *' },
              { label: 'Every 15 minutes', expr: '*/15 * * * *' },
              { label: 'Every hour at :00', expr: '0 * * * *' },
              { label: 'Daily at midnight (00:00)', expr: '0 0 * * *' },
              { label: 'Mon-Fri at 9:00 AM', expr: '0 9 * * 1-5' },
              { label: 'Weekly on Sunday 00:00', expr: '0 0 * * 0' },
              { label: '1st of month at 00:00', expr: '0 0 1 * *' },
            ].map((preset) => (
              <button
                key={preset.expr}
                onClick={() => setCronExpr(preset.expr)}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-950 hover:bg-indigo-50 dark:hover:bg-gray-800 border border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-xs transition-all"
              >
                <span className="text-slate-700 dark:text-gray-300 font-medium">{preset.label}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">{preset.expr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forecasted Executions Schedule */}
      {!parseError && nextExecutions.length > 0 && (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-gray-800 pb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-gray-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Upcoming 10 Forecasted Execution Schedule
            </h3>
            <div className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Evaluated in Timezone: <span className="font-mono font-bold text-indigo-900 dark:text-white">{selectedTz}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
            {nextExecutions.map((item, idx) => {
              const formattedTime = use24Hour
                ? item.date.toLocaleTimeString('en-US', { timeZone: selectedTz, hour12: false })
                : item.date.toLocaleTimeString('en-US', { timeZone: selectedTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

              const formattedDate = item.date.toLocaleDateString('en-US', {
                timeZone: selectedTz,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800/80 space-y-1 hover:border-emerald-500/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-gray-500 font-sans font-semibold">
                    <span>Run #{idx + 1}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{item.relativeStr}</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                    {formattedTime}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-gray-400 font-sans font-medium">
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
