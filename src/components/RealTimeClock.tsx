/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Radio } from 'lucide-react';

interface RealTimeClockProps {
  launchYear?: number;
}

export const RealTimeClock: React.FC<RealTimeClockProps> = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Format UTC Time
  const hours = String(time.getUTCHours()).padStart(2, '0');
  const minutes = String(time.getUTCMinutes()).padStart(2, '0');
  const seconds = String(time.getUTCSeconds()).padStart(2, '0');
  const ms = String(Math.floor(time.getUTCMilliseconds() / 100));

  // Calculate Julian Date (MJD)
  const jd = time.getTime() / 86400000 + 2440587.5;
  const mjd = (jd - 2400000.5).toFixed(2);

  // Day of Year (DOY)
  const startOfYear = new Date(Date.UTC(time.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((time.getTime() - startOfYear.getTime()) / 86400000) + 1;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-xs font-mono shadow-inner select-none">
      <div className="flex items-center gap-1.5 text-cyan-400">
        <Clock className="w-3.5 h-3.5 animate-spin [animation-duration:12s]" />
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          UTC:
        </span>
      </div>

      {/* Real-time UTC Clock */}
      <div className="flex items-baseline font-bold tabular-nums text-cyan-200">
        <span>{hours}:{minutes}:{seconds}</span>
        <span className="text-[10px] text-cyan-500 ml-0.5">.{ms}</span>
      </div>

      <span className="text-slate-700 hidden sm:inline">|</span>

      {/* Modified Julian Date */}
      <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
        <span className="text-[9px] uppercase text-slate-500">MJD:</span>
        <span className="text-emerald-400 font-semibold tabular-nums">{mjd}</span>
      </div>

      <span className="text-slate-700 hidden md:inline">|</span>

      {/* Day of Year */}
      <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
        <span className="text-[9px] uppercase text-slate-500">DOY:</span>
        <span className="text-amber-400 font-semibold tabular-nums">{dayOfYear}</span>
      </div>

      {/* Atomic Sync indicator */}
      <div className="hidden lg:flex items-center gap-1 pl-1 text-[10px] text-emerald-400 font-medium">
        <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
        <span className="text-[9px] uppercase tracking-widest text-emerald-500">SYNC</span>
      </div>
    </div>
  );
};
