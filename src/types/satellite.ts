/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DecayCurvePoint {
  year: number;
  altitudeKm: number;
  upper95Km: number;
  lower95Km: number;
  reentryThresholdKm: number;
}

export interface ProximityDebris {
  id: string;
  name: string;
  catalogId: string;
  distanceKm: number;
  relativeVelocityKmS: number;
  riskLevel: 'CRITICAL' | 'WARNING' | 'MONITORING';
  missDistanceMarginKm: number;
  timeToClosestApproachSec: number;
  debrisType: string;
}

export interface GhostSatellite {
  id: string;
  name: string;
  designator: string;
  noradId: string;
  launchYear: number;
  launchDate: string;
  silentSince: string;
  status: 'UNRESPONSIVE / DRIFTING' | 'KINETIC SHATTER FIELD' | 'NUCLEAR DERELICT' | 'SOLAR VOLATILE';
  statusDetails: string;
  orbitType: string; // LEO, SSO, MEO, etc.
  
  // Real-time Physics
  altitudeKm: number;
  apogeeKm: number;
  perigeeKm: number;
  velocityKmS: number;
  inclinationDeg: number;
  eccentricity: number;
  meanMotionRevDay: number;
  bstarDrag: string;
  semiMajorAxisKm: number;
  orbitalPeriodMin: number;
  thermalDegradation: string; // e.g. "-170°C to +115°C [82k Cycles]"
  
  // TabPFN Forecaster
  decayRiskScore: number; // 0 - 100
  decayRiskLevel: 'ELEVATED' | 'CRITICAL' | 'STABLE HORIZON';
  tumblingRpm: number;
  tumblingTrend: string;
  tumblingAxis: [number, number, number];
  projectedReentryDate: string;
  projectedReentryConfidence: string;
  tabPfnPredictionSummary: string;
  
  // Collision telemetry
  proximityDebris: ProximityDebris;
  
  // Decay curve data for Recharts
  decayCurve: DecayCurvePoint[];
  
  // 3D Visualization props
  orbitColor: string; // hex color for orbit trail
  modelType: 'box_solar' | 'sphere_antenna' | 'debris_cluster' | 'cylinder_dish';
  
  // Digital Séance Medium lore
  seanceToneHz: number;
  orbitsCompleted: number;
  initialSeanceLog: string;
  seanceMemoryRegisters: string[];
  conversationalLore: {
    cold: string;
    collision: string;
    living: string;
    origin: string;
    death: string;
    lastPing: string;
  };
}
