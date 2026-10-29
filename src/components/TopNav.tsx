/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { GhostSatellite } from '../types/satellite';
import { audioSynth } from '../utils/audioSynthesizer';
import { Volume2, VolumeX, Tv, Radio, Sparkles } from 'lucide-react';

interface TopNavProps {
  satellites: GhostSatellite[];
  selectedSatellite: GhostSatellite;
  onSelectSatellite: (sat: GhostSatellite) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  simSpeed: number;
  onCycleSimSpeed: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  satellites,
  selectedSatellite,
  onSelectSatellite,
  scanlinesEnabled,
  onToggleScanlines,
  simSpeed,
  onCycleSimSpeed,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleAudioToggle = () => {
    const active = audioSynth.toggleAmbient();
    setIsAudioActive(active);
  };

  return (
    <header className="h-16 w-full bg-slate-950/75 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-6 flex items-center justify-between gap-3 select-none">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-widest text-white font-mono">
              PHANTASM<span className="text-rose-500">//</span>ORBIT
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              TabPFN + Local Gemma 3:1b
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
            TELEMETRY OF THE DEAD • NORAD ORBITAL GRAVEYARD
          </div>
        </div>
      </div>

      {/* Center: 1-Click Ghost Satellite Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 rounded-xl bg-slate-900/75 border border-slate-800/90">
        {satellites.map((sat) => {
          const isSelected = sat.id === selectedSatellite.id;
          const isCritical = sat.decayRiskScore > 70;
          return (
            <button
              key={sat.id}
              onClick={() => onSelectSatellite(sat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCritical ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <span>{sat.name}</span>
              <span className="text-[10px] text-slate-500 hidden md:inline">
                ({sat.launchYear})
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Horror Sound Engine, Time Speed & CRT Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleAudioToggle}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
            isAudioActive
              ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700'
          }`}
        >
          {isAudioActive ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>HORROR AUDIO: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>ENGAGE AUDIO</span>
            </>
          )}
        </button>

        <button
          onClick={onCycleSimSpeed}
          title="Cycle Orbit Speed"
          className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold">{simSpeed}x</span>
        </button>

        <button
          onClick={onToggleScanlines}
          title="Toggle Analog CRT Scanlines"
          className={`p-1.5 rounded-lg text-xs font-mono transition-all border ${
            scanlinesEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border-slate-700'
          }`}
        >
          <Tv className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};