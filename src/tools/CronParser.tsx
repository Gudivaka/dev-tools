import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { CalendarClock, Calendar, Clock, AlertCircle } from 'lucide-react';
import cronstrue from 'cronstrue';

export const CronParser: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cronExpr, setCronExpr] = useState('*/15 * * * *');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Parse English Description
  let description = '';
  let parseError = null;

  try {
    description = cronstrue.toString(cronExpr.trim(), { use24HourTimeFormat: true });
  } catch (err: any) {
    parseError = err.message || 'Invalid cron expression format';
  }

  // Next Executions Calculator (Simple 5-field / 6-field simulation)
  const getNextExecutions = (expr: string, count = 10) => {
    if (parseError) return [];

    const dates: Date[] = [];
    let current = new Date();

    // Standard interval step approximation for demo visualization
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return [];

    let stepMinutes = 1;
    if (parts[0].startsWith('*/')) {
      stepMinutes = parseInt(parts[0].replace('*/', ''), 10) || 1;
    }

    for (let i = 1; i <= count; i++) {
      const nextDate = new Date(current.getTime() + i * stepMinutes * 60 * 1000);
      dates.push(nextDate);
    }
    return dates;
  };

  const nextExecutions = getNextExecutions(cronExpr);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Cron Expression Parser & Visualizer"
        description="Convert crontab syntax into human-readable English and preview upcoming execution schedules."
        onLoadSample={() => setCronExpr('0 0 * * 1-5')}
        onClear={() => setCronExpr('')}
      />

      {/* Input & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
            <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-indigo-400" /> Enter Cron Expression (5 or 6 fields)
            </label>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={cronExpr}
              onChange={(e) => setCronExpr(e.target.value)}
              placeholder="e.g. */15 * * * *"
              className="w-full glass-input px-4 py-3 rounded-xl text-base font-mono text-indigo-300 font-bold"
            />
            <p className="text-[11px] text-gray-400">
              Format: <span className="font-mono text-gray-300">minute hour day-of-month month day-of-week</span>
            </p>
          </div>

          {/* Explanation Card */}
          {parseError ? (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Human Readable Description</div>
              <div className="text-lg font-semibold text-white">{description}</div>
            </div>
          )}
        </div>

        {/* Presets Column */}
        <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
          <h3 className="text-xs font-semibold text-gray-300">Common Presets</h3>
          <div className="space-y-2">
            {[
              { label: 'Every minute', expr: '* * * * *' },
              { label: 'Every 5 minutes', expr: '*/5 * * * *' },
              { label: 'Every hour at minute 0', expr: '0 * * * *' },
              { label: 'Daily at midnight', expr: '0 0 * * *' },
              { label: 'Mon-Fri at 9 AM', expr: '0 9 * * 1-5' },
              { label: 'Weekly on Sunday 00:00', expr: '0 0 * * 0' },
              { label: '1st of every month', expr: '0 0 1 * *' },
            ].map((preset) => (
              <button
                key={preset.expr}
                onClick={() => setCronExpr(preset.expr)}
                className="w-full text-left px-3 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800/80 flex items-center justify-between text-xs transition-all"
              >
                <span className="text-gray-300 font-medium">{preset.label}</span>
                <span className="font-mono text-indigo-400 text-[11px]">{preset.expr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forecasted Executions Schedule */}
      {!parseError && nextExecutions.length > 0 && (
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
          <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Upcoming Execution Schedule Forecast
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
            {nextExecutions.map((date, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-950 border border-gray-800/80 text-emerald-300">
                <div className="text-[10px] text-gray-500 font-sans font-semibold">Run #{idx + 1}</div>
                <div className="mt-1 font-bold">{date.toLocaleTimeString()}</div>
                <div className="text-[10px] text-gray-400">{date.toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
