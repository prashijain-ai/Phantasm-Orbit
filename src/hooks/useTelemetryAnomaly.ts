/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { audioSynth } from '../utils/audioSynthesizer';

export interface TelemetryAnomalyEvent {
  id: string;
  type:
    | 'TUMBLE_GYRO_SURGE'
    | 'BSTAR_RUNAWAY'
    | 'THERMAL_SHOCK_BREACH'
    | 'KINETIC_CASCADE_RESONANCE'
    | 'MAGNETIC_TORQUE_FLUX';
  title: string;
  description: string;
  deltaRpm: number;
  deltaDrag: string;
  timestamp: string;
  severity: 'CRITICAL' | 'ELEVATED';
}

const ANOMALY_TEMPLATES: Omit<TelemetryAnomalyEvent, 'id' | 'timestamp' | 'deltaRpm'>[] = [
  {
    type: 'TUMBLE_GYRO_SURGE',
    title: 'GYROSCOPIC TUMBLING ANOMALY',
    description: 'Sudden multi-axis spin rate perturbation detected by ground radar tracking.',
    deltaDrag: '+0.00142 m⁻¹',
    severity: 'CRITICAL',
  },
  {
    type: 'BSTAR_RUNAWAY',
    title: 'BSTAR DRAG ACCELERATION',
    description: 'Atomic oxygen friction surge causing premature orbital periapsis contraction.',
    deltaDrag: '+0.00481 m⁻¹',
    severity: 'CRITICAL',
  },
  {
    type: 'THERMAL_SHOCK_BREACH',
    title: 'THERMAL CYCLE CONTRACTION',
    description: 'Abrupt shadow-egress gradient (-160°C → +110°C) triggering chassis micro-fracture.',
    deltaDrag: '+0.00095 m⁻¹',
    severity: 'ELEVATED',
  },
  {
    type: 'KINETIC_CASCADE_RESONANCE',
    title: 'PROXIMITY RADAR INTERFERENCE',
    description: 'Hypervelocity debris cluster close-approach triggering radar cross-section doppler shift.',
    deltaDrag: '+0.00210 m⁻¹',
    severity: 'CRITICAL',
  },
  {
    type: 'MAGNETIC_TORQUE_FLUX',
    title: 'GEOMAGNETIC EDDY DISSIPATION',
    description: 'Auroral electrojet coupling inducing induced torque in dead structural metal.',
    deltaDrag: '+0.00088 m⁻¹',
    severity: 'ELEVATED',
  },
];

interface UseTelemetryAnomalyOptions {
  threshold?: number;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  pulseDurationMs?: number;
}

export function useTelemetryAnomaly(
  decayRiskScore: number,
  options: UseTelemetryAnomalyOptions = {}
) {
  const {
    threshold = 80,
    minIntervalMs = 4000,
    maxIntervalMs = 9000,
    pulseDurationMs = 1800,
  } = options;

  const [isAnomalyActive, setIsAnomalyActive] = useState<boolean>(false);
  const [currentAnomaly, setCurrentAnomaly] = useState<TelemetryAnomalyEvent | null>(null);
  const [anomalyHistory, setAnomalyHistory] = useState<TelemetryAnomalyEvent[]>([]);
  const [pulseCount, setPulseCount] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger an anomaly event
  const triggerPulse = useCallback(() => {
    const template = ANOMALY_TEMPLATES[Math.floor(Math.random() * ANOMALY_TEMPLATES.length)];
    const deltaRpm = parseFloat((Math.random() * 4.5 + 1.2).toFixed(2));
    const now = new Date();
    const timestamp = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
      now.getUTCMinutes()
    ).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(
      Math.floor(now.getUTCMilliseconds() / 100)
    )}`;

    const event: TelemetryAnomalyEvent = {
      ...template,
      id: `anom-${Date.now()}`,
      deltaRpm,
      timestamp,
    };

    setCurrentAnomaly(event);
    setIsAnomalyActive(true);
    setPulseCount((c) => c + 1);
    setAnomalyHistory((prev) => [event, ...prev.slice(0, 4)]);

    // Trigger audio chirp for anomaly
    audioSynth.playAnomalyAlert();

    // Reset pulse after duration
    if (pulseEndTimerRef.current) clearTimeout(pulseEndTimerRef.current);
    pulseEndTimerRef.current = setTimeout(() => {
      setIsAnomalyActive(false);
    }, pulseDurationMs);
  }, [pulseDurationMs]);

  // Schedule next random anomaly pulse
  const scheduleNextPulse = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const delay = Math.floor(Math.random() * (maxIntervalMs - minIntervalMs)) + minIntervalMs;
    timerRef.current = setTimeout(() => {
      triggerPulse();
      scheduleNextPulse();
    }, delay);
  }, [maxIntervalMs, minIntervalMs, triggerPulse]);

  useEffect(() => {
    // Check if TabPFN decay risk score exceeds 80% threshold
    if (decayRiskScore > threshold) {
      // Schedule periodic random pulses
      scheduleNextPulse();
    } else {
      // Below threshold, clear all active timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pulseEndTimerRef.current) clearTimeout(pulseEndTimerRef.current);
      setIsAnomalyActive(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pulseEndTimerRef.current) clearTimeout(pulseEndTimerRef.current);
    };
  }, [decayRiskScore, threshold, scheduleNextPulse]);

  return {
    isAnomalyActive,
    currentAnomaly,
    anomalyHistory,
    pulseCount,
    isThresholdExceeded: decayRiskScore > threshold,
    triggerManualAnomaly: triggerPulse,
  };
}
