import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium backdrop-blur-md shadow-sm">
      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
      <span>100% Local Browser Conversion</span>
      <span className="hidden sm:inline text-emerald-400 dark:text-emerald-500/60">•</span>
      <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-300/80">
        <Lock className="w-3 h-3" /> Zero Server Telemetry
      </span>
    </div>
  );
};
