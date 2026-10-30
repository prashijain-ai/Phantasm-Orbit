/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { GHOST_SATELLITES } from './data/ghostSatellites';
import { GhostSatellite } from './types/satellite';
import { TopNav } from './components/TopNav';
import { TelemetrySidebar } from './components/TelemetrySidebar';
import { ThreeOrbitalView } from './components/ThreeOrbitalView';
import { SeanceTerminal } from './components/SeanceTerminal';
import { audioSynth } from './utils/audioSynthesizer';

export default function App() {
  const [selectedSatellite, setSelectedSatellite] = useState<GhostSatellite>(GHOST_SATELLITES[1]); // Envisat default
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  const handleCycleSimSpeed = () => {
    setSimSpeed((prev) => (prev === 1 ? 5 : prev === 5 ? 20 : 1));
  };

  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    audioSynth.toggleAudio(nextState);
    if (nextState) {
      audioSynth.playCarrierTone(selectedSatellite.seanceToneHz);
    }
  };

  // Auto-ignite audio on first user pointer interaction or keystroke to satisfy browser autoplay policy
  useEffect(() => {
    const unlockAudio = () => {
      if (audioEnabled) {
        audioSynth.toggleAudio(true);
        audioSynth.playCarrierTone(selectedSatellite.seanceToneHz);
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [audioEnabled, selectedSatellite.seanceToneHz]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100 font-mono antialiased select-none">
      {/* Optional CRT Scanline Overlay */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none crt-overlay z-50 animate-crt-flicker" />
      )}

      {/* 1. TOP NAVIGATION BAR */}
      <TopNav
        satellites={GHOST_SATELLITES}
        selectedSatellite={selectedSatellite}
        onSelectSatellite={setSelectedSatellite}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        simSpeed={simSpeed}
        onCycleSimSpeed={handleCycleSimSpeed}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* 2. MAIN WORKSPACE (Clean 2-Column Split Layout) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        
        {/* LEFT COLUMN: 3D WebGL Orbital Viewport */}
        <div className="flex-1 h-[50vh] lg:h-full relative overflow-hidden bg-slate-950 border-b lg:border-b-0 lg:border-r border-cyan-500/20">
          <ThreeOrbitalView
            satellite={selectedSatellite}
            simSpeed={simSpeed}
            scanlinesEnabled={scanlinesEnabled}
          />
        </div>

        {/* RIGHT COLUMN: Stacked TabPFN Telemetry Sidebar + Digital Séance Terminal */}
        <div className="w-full lg:w-[460px] xl:w-[500px] h-[50vh] lg:h-full flex flex-col shrink-0 bg-slate-950 overflow-hidden">
          {/* Scrollable TabPFN Telemetry Details */}
          <div className="flex-1 overflow-y-auto border-b border-cyan-500/20">
            <TelemetrySidebar satellite={selectedSatellite} />
          </div>

          {/* Fixed Bottom Digital Séance Terminal */}
          <div className="h-64 sm:h-72 shrink-0 bg-slate-900">
            <SeanceTerminal
              satellite={selectedSatellite}
              scanlinesEnabled={scanlinesEnabled}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
