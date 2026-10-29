/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { GhostSatellite } from '../types/satellite';
import { audioSynth } from '../utils/audioSynthesizer';
import {
  Skull,
  Send,
  Trash2,
  Terminal,
  Activity,
  Radio,
  Sparkles,
  Bot,
} from 'lucide-react';

interface SeanceTerminalProps {
  satellite: GhostSatellite;
  scanlinesEnabled: boolean;
}

interface TerminalMessage {
  id: string;
  sender: 'SYSTEM' | 'MEDIUM' | 'OPERATOR' | 'ENTITY';
  timestamp: string;
  text: string;
}

export const SeanceTerminal: React.FC<SeanceTerminalProps> = ({ satellite }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAiDiagnosticOpen, setIsAiDiagnosticOpen] = useState<boolean>(false);
  const [aiDiagnosticText, setAiDiagnosticText] = useState<string>('');
  const [isLoadingAiDiagnostic, setIsLoadingAiDiagnostic] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = new Date().toISOString().substring(11, 19);
    const initialMsgs: TerminalMessage[] = [
      {
        id: `sys-${Date.now()}-1`,
        sender: 'SYSTEM',
        timestamp: now,
        text: `RF LOCKED: ${satellite.seanceToneHz.toFixed(1)} MHz // LOCAL GEMMA 3:1B MEDIUM READY`,
      },
      {
        id: `sat-${Date.now()}-2`,
        sender: 'ENTITY',
        timestamp: now,
        text: satellite.initialSeanceLog,
      },
    ];
    setMessages(initialMsgs);
  }, [satellite.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleInvokeSeance = async (queryOverride?: string) => {
    const query = queryOverride || inputText.trim();
    if (!query || isStreaming) return;

    audioSynth.playSeanceInvocation();

    const now = new Date().toISOString().substring(11, 19);
    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'OPERATOR', timestamp: now, text: query },
    ]);
    setInputText('');
    setIsStreaming(true);

    let entityResponse = '';

    try {
      const res = await fetch('/api/gemini/seance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satellite, userQuery: query }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text && !data.fallback) {
          entityResponse = data.text;
        }
      }
    } catch {
      // Fallback to built-in spectral lore
    }

    if (!entityResponse) {
      entityResponse = generateGhostResponse(query, satellite);
    }

    let currentIdx = 0;
    const msgId = `stream-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: msgId,
        sender: 'ENTITY',
        timestamp: new Date().toISOString().substring(11, 19),
        text: '',
      },
    ]);

    const streamNextChar = () => {
      if (currentIdx < entityResponse.length) {
        const chunk = entityResponse.substring(0, currentIdx + 3);
        currentIdx += 3;
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, text: chunk } : m))
        );
        if (Math.random() < 0.25) audioSynth.playTerminalBlip();
        streamingTimeoutRef.current = setTimeout(streamNextChar, 18);
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, text: entityResponse } : m))
        );
        setIsStreaming(false);
      }
    };

    streamingTimeoutRef.current = setTimeout(streamNextChar, 200);
  };

  const generateGhostResponse = (query: string, sat: GhostSatellite): string => {
    const q = query.toLowerCase();
    if (q.includes('memory') || q.includes('register') || q.includes('dump')) {
      return `[HEX REGISTER DUMP]\n${sat.seanceMemoryRegisters.join('\n')}`;
    }
    if (q.includes('cold') || q.includes('battery') || q.includes('thermal')) {
      return sat.conversationalLore.cold;
    }
    if (q.includes('collision') || q.includes('debris') || q.includes('horror')) {
      return sat.conversationalLore.collision;
    }
    if (q.includes('final') || q.includes('transmission') || q.includes('die')) {
      return `${sat.conversationalLore.death} ${sat.conversationalLore.lastPing}`;
    }
    if (q.includes('origin') || q.includes('launch') || q.includes('who')) {
      return sat.conversationalLore.origin;
    }
    return `${sat.conversationalLore.living} (Signal on ${sat.seanceToneHz} MHz is fading—ask about my final transmission, collision debris, or dump my registers.)`;
  };

  const handleRequestAiDiagnostic = async () => {
    setIsAiDiagnosticOpen(true);
    setIsLoadingAiDiagnostic(true);
    setAiDiagnosticText('');

    try {
      const res = await fetch('/api/gemini/anomaly-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satellite }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.insight) {
          setAiDiagnosticText(data.insight);
          setIsLoadingAiDiagnostic(false);
          return;
        }
      }
    } catch {
      // fallback
    }

    setAiDiagnosticText(
      `1. STRUCTURAL & SOLAR PRESSURE DEGRADATION:\n- Asymmetric photon torque drives tumbling anomaly at ${satellite.tumblingRpm} RPM.\n\n2. KESSLER COLLISION HAZARD:\n- Closest shrapnel: ${satellite.proximityDebris.name} (${satellite.proximityDebris.distanceKm} km at ${satellite.proximityDebris.relativeVelocityKmS} km/s).\n\n3. GEOMAGNETIC EDDY COUPLING:\n- Orbital inclination (${satellite.inclinationDeg}°) induces residual currents across dead payload bus.`
    );
    setIsLoadingAiDiagnostic(false);
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col select-none overflow-hidden">
      {/* Clean Single-Line Terminal Header (Never Overflows) */}
      <div className="h-9 px-3 bg-slate-900 border-b border-emerald-500/30 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-mono font-bold text-emerald-400 truncate">
            DIGITAL SÉANCE // SPEAK TO {satellite.name.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-cyan-400 hidden sm:flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            {satellite.seanceToneHz.toFixed(1)} MHz
          </span>
          <button
            onClick={handleRequestAiDiagnostic}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 flex items-center gap-1"
          >
            <Bot className="w-3 h-3" />
            <span>DIAGNOSTIC</span>
          </button>
          <button
            onClick={() => setMessages([])}
            title="Clear Terminal"
            className="p-1 text-slate-500 hover:text-slate-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Streaming Transcript Area */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-2 bg-slate-950">
        {messages.map((msg) => (
          <div key={msg.id} className="leading-relaxed">
            <span
              className={`text-[10px] font-bold mr-2 ${
                msg.sender === 'SYSTEM'
                  ? 'text-cyan-400'
                  : msg.sender === 'OPERATOR'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              [{msg.timestamp}] {msg.sender === 'ENTITY' ? `${satellite.name.toUpperCase()}:` : `${msg.sender}:`}
            </span>
            <span className="text-slate-200 whitespace-pre-wrap">{msg.text}</span>
          </div>
        ))}
        {isStreaming && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] animate-pulse">
            <Activity className="w-3 h-3 animate-spin" />
            <span>DECODING GHOST CARRIER...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 1-Click Inquiry Pills + Input */}
      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 shrink-0 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10px] font-mono">
          <span className="text-slate-400 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Ask Ghost:
          </span>
          <button
            onClick={() => handleInvokeSeance('What was your final transmission?')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 shrink-0"
          >
            Final Transmission
          </button>
          <button
            onClick={() => handleInvokeSeance('Probe adjacent collision debris')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-rose-300 border border-rose-500/30 shrink-0"
          >
            Collision Risk
          </button>
          <button
            onClick={() => handleInvokeSeance('Dump raw memory registers')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 shrink-0"
          >
            Hex Registers
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInvokeSeance();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Talk to ${satellite.name} (Gemma 3:1b)...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isStreaming}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={isStreaming || !inputText.trim()}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 flex items-center gap-1.5 shrink-0 disabled:opacity-40"
          >
            <Skull className="w-3.5 h-3.5" />
            <span>SÉANCE</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Diagnostic Modal */}
      {isAiDiagnosticOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-xl p-5 max-w-lg w-full space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-indigo-400 font-bold text-xs">
                TABPFN + GEMMA 3:1B // ORBITAL DIAGNOSTIC
              </span>
              <button
                onClick={() => setIsAiDiagnosticOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
              >
                Close
              </button>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line bg-slate-950 p-3 rounded-lg border border-slate-800">
              {isLoadingAiDiagnostic ? 'Synthesizing telemetry...' : aiDiagnosticText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};