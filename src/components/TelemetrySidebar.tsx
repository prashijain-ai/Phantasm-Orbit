/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GhostSatellite } from '../types/satellite';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  AlertTriangle,
  RotateCw,
  Calendar,
  Layers,
  ThermometerSnowflake,
  Compass,
  Cpu,
  Zap,
  Radio,
} from 'lucide-react';
import { useTelemetryAnomaly } from '../hooks/useTelemetryAnomaly';

interface TelemetrySidebarProps {
  satellite: GhostSatellite;
}

export const TelemetrySidebar: React.FC<TelemetrySidebarProps> = ({ satellite }) => {
  // Hook that randomly triggers 'Telemetry Anomaly' pulses when TabPFN decay risk score > 80%
  const {
    isAnomalyActive,
    currentAnomaly,
    pulseCount,
    isThresholdExceeded,
    triggerManualAnomaly,
  } = useTelemetryAnomaly(satellite.decayRiskScore);

  // Determine risk bar color
  const isHighRisk = satellite.decayRiskScore > 65;
  const riskColor = isHighRisk ? 'from-amber-500 to-rose-600' : 'from-emerald-500 to-amber-500';
  const riskTextColor = isHighRisk ? 'text-rose-400' : 'text-emerald-400';

  // Dynamic RPM surge during anomaly pulse
  const displayRpm =
    isAnomalyActive && currentAnomaly
      ? (satellite.tumblingRpm + currentAnomaly.deltaRpm).toFixed(2)
      : satellite.tumblingRpm.toFixed(2);

  return (
    <aside
      className={`w-full h-full bg-slate-900/60 backdrop-blur-md flex flex-col overflow-y-auto p-4 space-y-4 select-none transition-all duration-300 ${
        isAnomalyActive
          ? 'ring-2 ring-rose-500/80 shadow-[inset_0_0_30px_rgba(244,63,94,0.2)]'
          : ''
      }`}
    >
      {/* 3-Second Judge Explainer Banner */}
      <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-3 text-[11px] font-mono text-cyan-200 leading-relaxed shrink-0">
        <span className="font-bold text-white uppercase block mb-0.5">
          🛰️ HOW PHANTASM-ORBIT WORKS:
        </span>
        Tracks real dead satellites using <span className="text-emerald-300 font-bold">NORAD TLE physics</span>, predicts orbital decay &amp; collision risk with <span className="text-amber-300 font-bold">TabPFN</span>, and decodes first-person ghost transmissions via <span className="text-rose-300 font-bold">Local Gemma 3:1b</span>.
      </div>
      {/* Active Telemetry Anomaly Pulse Alert Banner */}
      {isAnomalyActive && currentAnomaly && (
        <div className="bg-rose-950/95 border-2 border-rose-500 rounded-xl p-3.5 shadow-[0_0_20px_rgba(244,63,94,0.45)] animate-in zoom-in-95 duration-150 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5 text-rose-300 animate-pulse">
              <Zap className="w-4 h-4 text-rose-400 fill-rose-400" />
              TELEMETRY ANOMALY DETECTED
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/80 border border-rose-500/60 text-rose-200">
              PULSE #{pulseCount}
            </span>
          </div>

          <div className="text-xs font-bold text-rose-100 font-mono">
            {currentAnomaly.title}
          </div>

          <p className="text-[11px] font-mono text-rose-300/90 leading-relaxed bg-black/30 p-2 rounded border border-rose-800/60">
            {currentAnomaly.description}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-rose-800/80 text-[10px] font-mono text-rose-400">
            <span className="font-bold">ΔRPM: +{currentAnomaly.deltaRpm} RPM</span>
            <span>Drag: {currentAnomaly.deltaDrag}</span>
            <span className="text-rose-300">{currentAnomaly.timestamp} UTC</span>
          </div>
        </div>
      )}

      {/* Selected Satellite Header */}
      <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              TARGET RELIC // {satellite.designator}
            </div>
            <h2 className="text-xl font-bold font-mono text-slate-100 tracking-tight mt-0.5">
              {satellite.name}
            </h2>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-1 rounded border uppercase font-bold tracking-wider ${
              satellite.status === 'KINETIC SHATTER FIELD'
                ? 'text-rose-400 bg-rose-950/50 border-rose-500/40'
                : satellite.status === 'NUCLEAR DERELICT'
                ? 'text-amber-400 bg-amber-950/50 border-amber-500/40'
                : 'text-cyan-400 bg-cyan-950/50 border-cyan-500/40'
            }`}
          >
            {satellite.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">NORAD Catalog ID</span>
            <span className="text-slate-200 font-semibold tabular-nums">#{satellite.noradId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Launch Year</span>
            <span className="text-slate-200 font-semibold tabular-nums">{satellite.launchYear} ({satellite.launchDate.split(',')[0]})</span>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] text-slate-500 uppercase block">Silent Horizon</span>
            <span className="text-slate-300 text-[11px]">{satellite.silentSince}</span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mt-2 leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-800/60">
          {satellite.statusDetails}
        </p>
      </div>

      {/* TabPFN Anomaly Forecasting Card */}
      <div
        className={`bg-slate-950/70 border rounded-xl p-3.5 space-y-3.5 shadow-sm transition-all duration-300 ${
          isAnomalyActive
            ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
            : 'border-cyan-500/30'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            TabPFN Anomaly Forecaster
          </div>

          <div className="flex items-center gap-1.5">
            {isThresholdExceeded ? (
              <span className="text-[9px] font-mono text-rose-400 bg-rose-950/80 border border-rose-500/60 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse font-bold">
                <Radio className="w-2.5 h-2.5 text-rose-400" />
                RISK &gt;80% [ARMED]
              </span>
            ) : (
              <button
                onClick={triggerManualAnomaly}
                title="Test Anomaly Pulse hook"
                className="text-[9px] font-mono text-cyan-400 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
              >
                <Zap className="w-2.5 h-2.5" />
                TEST PULSE
              </button>
            )}
          </div>
        </div>

        {/* 1. Decay Risk Score Progress Bar */}
        <div>
          <div className="flex justify-between items-baseline mb-1 text-xs font-mono">
            <span className="text-slate-400 text-[11px] uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Decay Risk Score
            </span>
            <div className="flex items-center gap-1.5">
              {isThresholdExceeded && (
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider animate-pulse">
                  [ANOMALY TRIGGER ZONE]
                </span>
              )}
              <span className={`font-bold tabular-nums text-sm ${riskTextColor}`}>
                {satellite.decayRiskScore} / 100 ({satellite.decayRiskLevel})
              </span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${riskColor} transition-all duration-500`}
              style={{ width: `${satellite.decayRiskScore}%` }}
            />
          </div>
          {isThresholdExceeded && (
            <div className="text-[10px] font-mono text-rose-400/80 mt-1 flex items-center justify-between">
              <span>Threshold condition met (&gt;80%)</span>
              <span className="text-[9px] uppercase text-slate-400">Random telemetry bursts scheduled</span>
            </div>
          )}
        </div>

        {/* 2. Tumbling Anomaly Rate (RPM Meter) */}
        <div
          className={`border rounded-lg p-2.5 transition-all duration-200 ${
            isAnomalyActive
              ? 'bg-rose-950/40 border-rose-500/60'
              : 'bg-slate-900/50 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                  isAnomalyActive
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <RotateCw
                  className={`w-4 h-4 animate-spin ${
                    isAnomalyActive ? '[animation-duration:1s]' : '[animation-duration:3s]'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Tumbling Anomaly Rate
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-lg font-mono font-bold tabular-nums transition-colors ${
                      isAnomalyActive ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                    }`}
                  >
                    {displayRpm}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">RPM</span>
                  {isAnomalyActive && currentAnomaly && (
                    <span className="text-[10px] font-mono text-rose-400 font-bold animate-ping">
                      SURGE!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Visual RPM gauge dot */}
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Precession</span>
              <span className="text-xs font-mono text-cyan-300 font-semibold tabular-nums">
                [{satellite.tumblingAxis.map((n) => n.toFixed(1)).join(', ')}]
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1.5 truncate">
            {satellite.tumblingTrend}
          </div>
        </div>

        {/* 3. Projected Atmospheric Re-entry Date Prediction Badge */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Projected Atmospheric Re-entry
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-rose-300 tabular-nums">
                {satellite.projectedReentryDate}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate-400 text-right max-w-[80px]">
            {satellite.projectedReentryConfidence}
          </span>
        </div>

        <p className="text-[10px] font-mono text-slate-400 leading-relaxed italic border-t border-slate-900 pt-2">
          &quot;{satellite.tabPfnPredictionSummary}&quot;
        </p>
      </div>

      {/* Recharts Line Chart: TabPFN Orbital Decay Curve */}
      <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-3.5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            TabPFN Orbital Decay Curve
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            ALTITUDE VS. TIME
          </span>
        </div>

        <div className="h-44 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={satellite.decayCurve} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="year"
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-cyan-500/50 p-2 rounded text-[11px] font-mono text-slate-200 shadow-xl">
                        <div className="font-bold text-cyan-300">EPOCH: {label} CE</div>
                        <div className="text-emerald-400">Predicted: {data.altitudeKm} km</div>
                        <div className="text-slate-400 text-[10px]">
                          95% Bound: {data.lower95Km} - {data.upper95Km} km
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Critical Re-entry Threshold (120 km) */}
              <ReferenceLine y={120} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'RE-ENTRY (120km)', fill: '#f43f5e', fontSize: 9, position: 'insideBottomRight' }} />
              
              {/* Upper 95% Confidence Bound */}
              <Line
                type="monotone"
                dataKey="upper95Km"
                stroke="#06b6d4"
                strokeDasharray="2 2"
                strokeWidth={1}
                dot={false}
              />
              {/* Main Predicted Altitude Curve */}
              <Line
                type="monotone"
                dataKey="altitudeKm"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#10b981' }}
                activeDot={{ r: 5, fill: '#06b6d4' }}
              />
              {/* Lower 95% Confidence Bound */}
              <Line
                type="monotone"
                dataKey="lower95Km"
                stroke="#06b6d4"
                strokeDasharray="2 2"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
          <div className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
            <span>Mean Predicted</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-0.5 border-b border-dashed border-cyan-400 inline-block" />
            <span>95% CI Bounds</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-0.5 bg-rose-500 inline-block" />
            <span>Burn-up Limit</span>
          </div>
        </div>
      </div>

      {/* Live Physics Grid */}
      <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-3.5 space-y-2.5 shadow-sm">
        <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          Live Orbital Physics Grid
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Inclination</span>
            <span className="text-slate-100 font-semibold tabular-nums text-sm">
              {satellite.inclinationDeg.toFixed(2)}°
            </span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Eccentricity (e)</span>
            <span className="text-slate-100 font-semibold tabular-nums text-sm">
              {satellite.eccentricity.toFixed(5)}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Mean Motion</span>
            <span className="text-slate-100 font-semibold tabular-nums text-sm">
              {satellite.meanMotionRevDay.toFixed(3)}{' '}
              <span className="text-[10px] text-slate-400">rev/d</span>
            </span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">BSTAR Drag Coeff</span>
            <span className="text-slate-100 font-semibold tabular-nums text-sm">
              {satellite.bstarDrag}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Semi-Major Axis</span>
            <span className="text-slate-100 font-semibold tabular-nums text-sm">
              {satellite.semiMajorAxisKm.toFixed(1)}{' '}
              <span className="text-[10px] text-slate-400">km</span>
            </span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Orbital Period</span>
            <span className="text-slate-100 font-semibold tabular-nums text-sm">
              {satellite.orbitalPeriodMin.toFixed(1)}{' '}
              <span className="text-[10px] text-slate-400">min</span>
            </span>
          </div>
        </div>

        {/* Thermal Degradation metric */}
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex items-center gap-2 text-xs font-mono">
          <ThermometerSnowflake className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-500 uppercase block">Thermal Stress History</span>
            <span className="text-cyan-300 text-[11px] truncate block">
              {satellite.thermalDegradation}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
