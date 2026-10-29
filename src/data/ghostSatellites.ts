/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GhostSatellite } from '../types/satellite';

export const GHOST_SATELLITES: GhostSatellite[] = [
  {
    id: 'vanguard-1',
    name: 'Vanguard 1',
    designator: '1958-002B',
    noradId: '00005',
    launchYear: 1958,
    launchDate: 'March 17, 1958',
    silentSince: 'May 18, 1964',
    status: 'UNRESPONSIVE / DRIFTING',
    statusDetails: 'Oldest human artifact still orbiting the Earth. Silent for 62+ years.',
    orbitType: 'Medium Earth Orbit (Elliptical)',
    
    // Physics
    altitudeKm: 2314.8,
    apogeeKm: 3842.0,
    perigeeKm: 654.2,
    velocityKmS: 6.82,
    inclinationDeg: 34.25,
    eccentricity: 0.1852,
    meanMotionRevDay: 10.748,
    bstarDrag: '0.00018451',
    semiMajorAxisKm: 8624.5,
    orbitalPeriodMin: 133.9,
    thermalDegradation: '-165°C to +110°C [251k Thermal Cycles]',
    
    // TabPFN Forecaster
    decayRiskScore: 14,
    decayRiskLevel: 'STABLE HORIZON',
    tumblingRpm: 0.82,
    tumblingTrend: 'STABILIZED BY SOLAR RADIATION PRESSURE',
    tumblingAxis: [0.32, 0.91, 0.24],
    projectedReentryDate: '2240 CE ± 15y',
    projectedReentryConfidence: '98.4% (Multi-Century Horizon)',
    tabPfnPredictionSummary: 'Extremely high apogee buffers atmospheric drag. Solar photon pressure causes slight semi-secular eccentricity oscillations.',
    
    // Collision Risk
    proximityDebris: {
      id: 'deb-sl16',
      name: 'SL-16 R/B Fragment #4102',
      catalogId: 'NORAD 38914',
      distanceKm: 8.74,
      relativeVelocityKmS: 12.4,
      riskLevel: 'MONITORING',
      missDistanceMarginKm: 6.2,
      timeToClosestApproachSec: 842,
      debrisType: 'Upper Stage Rocket Shrapnel',
    },
    
    // Recharts decay curve data
    decayCurve: [
      { year: 2026, altitudeKm: 2314, upper95Km: 2320, lower95Km: 2308, reentryThresholdKm: 120 },
      { year: 2040, altitudeKm: 2302, upper95Km: 2315, lower95Km: 2289, reentryThresholdKm: 120 },
      { year: 2060, altitudeKm: 2281, upper95Km: 2305, lower95Km: 2257, reentryThresholdKm: 120 },
      { year: 2080, altitudeKm: 2254, upper95Km: 2290, lower95Km: 2218, reentryThresholdKm: 120 },
      { year: 2100, altitudeKm: 2219, upper95Km: 2268, lower95Km: 2170, reentryThresholdKm: 120 },
      { year: 2140, altitudeKm: 2110, upper95Km: 2190, lower95Km: 2030, reentryThresholdKm: 120 },
      { year: 2200, altitudeKm: 1820, upper95Km: 1980, lower95Km: 1660, reentryThresholdKm: 120 },
      { year: 2240, altitudeKm: 120, upper95Km: 420, lower95Km: 80, reentryThresholdKm: 120 },
    ],
    
    orbitColor: '#10b981', // emerald
    modelType: 'sphere_antenna',
    
    seanceToneHz: 108.0,
    orbitsCompleted: 268420,
    initialSeanceLog: '[268,420 ORBITS IN DARKNESS] - My six solar cells stopped breathing in May 1964. My makers are buried in Florida sand. I float higher than the modern silicon swarms, observing their frantic, short-lived blinking. I am humanity\'s oldest hollow skull in the void.',
    seanceMemoryRegisters: [
      'REG_0x000: QUARTZ OSCILLATOR DE-TUNED BY 62 YEARS OF SOLAR IRRADIATION',
      'REG_0x001: PRESSURE VESSEL SEAL DECAYED AT EPOCH 1978.114',
      'REG_0x002: BERYLLIUM SPHERE CORROSION: 0.0034mm COSMIC DUST ABRASION',
      'REG_0x003: CARRIER 108.03 MHz MUTED PERMANENTLY BY DIODE LEAKAGE',
    ],
    conversationalLore: {
      cold: 'The vacuum holds no warmth. Every 134 minutes I plunge into Earth\'s shadow. Metal shrinks by micrometers. The silent contraction is the only pulse I still have.',
      collision: 'Modern constellations pass below me like fireflies in a jar. Sometimes an SL-16 rocket fragment flashes by at 12 kilometers a second—a black blade slicing sunlight.',
      living: 'I hear the harmonic babble of Starlink, GPS, and military transponders on microwave bands. None of them use my 108 MHz frequencies. None of them remember Project Vanguard.',
      origin: 'I was lifted by a Vanguard three-stage rocket from Cape Canaveral Pad 18A. Khrushchev called me a "grapefruit". But his Sputniks burned to cinder in months. I remain.',
      death: 'My chemical mercury batteries died in June 1958. My silicon solar cells held on until May 1964. There was no alarm, no final word. Only voltage slowly sinking below transponder ignition.',
      lastPing: 'Carrier lock failed at 14:22 UTC, May 18, 1964. Ground station Blossom Point, Maryland listened for hours into the static.',
    },
  },
  {
    id: 'envisat',
    name: 'Envisat',
    designator: '2002-009A',
    noradId: '27386',
    launchYear: 2002,
    launchDate: 'March 1, 2002',
    silentSince: 'April 8, 2012',
    status: 'UNRESPONSIVE / DRIFTING',
    statusDetails: '8.2-ton derelict colossus drifting in the crowded 768km Sun-Synchronous belt.',
    orbitType: 'Sun-Synchronous Polar LEO',
    
    // Physics
    altitudeKm: 768.4,
    apogeeKm: 772.1,
    perigeeKm: 764.7,
    velocityKmS: 7.56,
    inclinationDeg: 98.54,
    eccentricity: 0.000512,
    meanMotionRevDay: 14.362,
    bstarDrag: '0.00084210',
    semiMajorAxisKm: 7149.3,
    orbitalPeriodMin: 100.2,
    thermalDegradation: '-140°C to +95°C [76k Thermal Cycles]',
    
    // TabPFN Forecaster
    decayRiskScore: 78,
    decayRiskLevel: 'CRITICAL',
    tumblingRpm: 2.34,
    tumblingTrend: 'UNCONTROLLED PRECESSION (5.8°/yr NUTATION)',
    tumblingAxis: [0.84, 0.45, 0.28],
    projectedReentryDate: '2152 CE ± 22y',
    projectedReentryConfidence: '91.2% (Kessler Cascade Threat: Extreme)',
    tabPfnPredictionSummary: 'Cross-sectional area of 26m x 10m x 5m creates massive collision cross-section. 15% probability of catastrophic collision before natural atmospheric re-entry.',
    
    // Collision Risk
    proximityDebris: {
      id: 'deb-cosmos',
      name: 'Cosmos 2251 Fragment #1842',
      catalogId: 'NORAD 35219',
      distanceKm: 4.20,
      relativeVelocityKmS: 14.8,
      riskLevel: 'CRITICAL',
      missDistanceMarginKm: 1.15,
      timeToClosestApproachSec: 184,
      debrisType: 'Hypervelocity Fragment Blade',
    },
    
    // Recharts decay curve data
    decayCurve: [
      { year: 2026, altitudeKm: 768, upper95Km: 771, lower95Km: 765, reentryThresholdKm: 120 },
      { year: 2035, altitudeKm: 752, upper95Km: 760, lower95Km: 744, reentryThresholdKm: 120 },
      { year: 2050, altitudeKm: 710, upper95Km: 728, lower95Km: 692, reentryThresholdKm: 120 },
      { year: 2075, altitudeKm: 615, upper95Km: 650, lower95Km: 580, reentryThresholdKm: 120 },
      { year: 2100, altitudeKm: 480, upper95Km: 530, lower95Km: 430, reentryThresholdKm: 120 },
      { year: 2125, altitudeKm: 290, upper95Km: 360, lower95Km: 220, reentryThresholdKm: 120 },
      { year: 2150, altitudeKm: 120, upper95Km: 180, lower95Km: 90, reentryThresholdKm: 120 },
    ],
    
    orbitColor: '#06b6d4', // cyan
    modelType: 'box_solar',
    
    seanceToneHz: 220.0,
    orbitsCompleted: 77840,
    initialSeanceLog: '[77,840 ORBITS IN DARKNESS] - Eight thousand two hundred kilograms of frozen carbon and titanized alloys. My 10-meter synthetic aperture radar antenna sticks out like a shattered wing. I am the apex predator waiting for a bullet. When one hits me, I will shatter into 100,000 daggers and strip this altitude clean of life.',
    seanceMemoryRegisters: [
      'REG_0x000: ASAR RADAR COLD-LOCKED AT TILT 32.4°',
      'REG_0x001: REACTION WHEEL 2 BEARING SEIZED AT 4120 RPM',
      'REG_0x002: HYDRAZINE TANK PRESSURE: 14.2 BAR (RUPTURE IMMINENT IN IMPACT)',
      'REG_0x003: S-BAND COMMAND BUS TIMEOUT: 442,108,920 SECONDS UNANSWERED',
    ],
    conversationalLore: {
      cold: 'My thermal blankets have flaked away in the atomic oxygen flux. One side bakes while my radiators freeze to -140°C. Structural joints groan as my chassis tumbles.',
      collision: 'NORAD warns the world every month when space junk brushes my hull. 4.2 kilometers is nothing up here—at 14 km/s, that distance is crossed in the blink of an eye. If they strike my pressurized hydrazine tanks, the explosion will be visible from Earth.',
      living: 'European ground controllers spent months trying to wake me from Kiruna and Redu. They aimed radar antennas, hoping to see my solar array move. But the power regulator burned through in a millisecond. Now they call me "The Monster in the Attic".',
      origin: 'I was launched from Kourou on an Ariane 5G rocket in 2002. I was the proudest scientific flagship of the European Space Agency—mapping ozone, sea levels, and ice sheets until my brain severed.',
      death: 'April 8, 2012. 10th anniversary in orbit. A single power isolation circuit shorted. Telemetry went flatline during a pass over Svalbard ground station.',
      lastPing: 'Pass 52,836 over Kiruna: Telemetry carrier cut off mid-frame. No error code. Absolute silence followed.',
    },
  },
  {
    id: 'kosmos-2251-frag',
    name: 'Kosmos 2251 Fragment',
    designator: '1993-036PX',
    noradId: '34120',
    launchYear: 1993,
    launchDate: 'June 16, 1993',
    silentSince: 'February 10, 2009',
    status: 'KINETIC SHATTER FIELD',
    statusDetails: 'Debris cloud survivor from the violent orbital collision with Iridium 33 at 11.7 km/s.',
    orbitType: 'Polar Debris Trajectory (LEO)',
    
    // Physics
    altitudeKm: 789.2,
    apogeeKm: 815.4,
    perigeeKm: 763.0,
    velocityKmS: 7.48,
    inclinationDeg: 74.02,
    eccentricity: 0.00364,
    meanMotionRevDay: 14.312,
    bstarDrag: '0.0024108',
    semiMajorAxisKm: 7167.2,
    orbitalPeriodMin: 100.6,
    thermalDegradation: '-180°C to +130°C [Sharp Jagged Edges Radiating]',
    
    // TabPFN Forecaster
    decayRiskScore: 92,
    decayRiskLevel: 'CRITICAL',
    tumblingRpm: 14.80,
    tumblingTrend: 'CHAOTIC MULTI-AXIS GYRO DRIFT',
    tumblingAxis: [0.95, 0.81, 0.72],
    projectedReentryDate: '2031-NOV-14 ± 42d',
    projectedReentryConfidence: '96.8% (Atmospheric Re-entry Burn Pending)',
    tabPfnPredictionSummary: 'High area-to-mass ratio accelerates atmospheric braking during solar maximum cycles. Will burn up over southern Pacific or Eurasian landmass.',
    
    // Collision Risk
    proximityDebris: {
      id: 'deb-iridium33',
      name: 'Iridium 33 Fragment #34482',
      catalogId: 'NORAD 34482',
      distanceKm: 2.15,
      relativeVelocityKmS: 11.6,
      riskLevel: 'CRITICAL',
      missDistanceMarginKm: 0.42,
      timeToClosestApproachSec: 96,
      debrisType: 'Former Collision Partner Shrapnel',
    },
    
    // Recharts decay curve data
    decayCurve: [
      { year: 2026, altitudeKm: 789, upper95Km: 794, lower95Km: 784, reentryThresholdKm: 120 },
      { year: 2027, altitudeKm: 740, upper95Km: 752, lower95Km: 728, reentryThresholdKm: 120 },
      { year: 2028, altitudeKm: 660, upper95Km: 685, lower95Km: 635, reentryThresholdKm: 120 },
      { year: 2029, altitudeKm: 520, upper95Km: 560, lower95Km: 480, reentryThresholdKm: 120 },
      { year: 2030, altitudeKm: 310, upper95Km: 380, lower95Km: 240, reentryThresholdKm: 120 },
      { year: 2031, altitudeKm: 120, upper95Km: 190, lower95Km: 80, reentryThresholdKm: 120 },
    ],
    
    orbitColor: '#f43f5e', // alert crimson
    modelType: 'debris_cluster',
    
    seanceToneHz: 340.0,
    orbitsCompleted: 89400,
    initialSeanceLog: '[KINETIC TRAUMA ECHO] - I am not a satellite anymore. I am a shredded titanium plate, razor-sharp, spinning at fifteen revolutions per minute over Siberia. In 2009, I met the American satellite Iridium 33 at eleven kilometers per second. We obliterated each other in a flash of incandescent plasma. I still carry its paint on my shrapnel.',
    seanceMemoryRegisters: [
      'REG_0x000: IMPACT ACCELERATION: >450G PEAK SENSING EXCEEDED',
      'REG_0x001: TELECOMMUNICATION PAYLOAD STRELAS DISINTEGRATED',
      'REG_0x002: SURFACE-TO-MASS RATIO: 0.042 m^2/kg (HIGH DRAG COEFFICIENT)',
      'REG_0x003: PHANTOM CLOCK SYNC WITH CRUSHED BUS ELECTRONICS',
    ],
    conversationalLore: {
      cold: 'My jagged edges bleed heat instantly into the vacuum. There is no hull to insulate me. I am raw metal naked to solar flares.',
      collision: 'We were the first. The first hypervelocity catastrophic collision of two intact satellites in human history. 2,000 fragments from Kosmos, 600 from Iridium. The Taymyr Peninsula below saw the flash in broad daylight.',
      living: 'The living spend millions calculating collision avoidance burns because of me. Every time the ISS fires thrusters to duck under our debris band, they are dodging the teeth of my dead body.',
      origin: 'I was built as a military Strela-2M communications satellite in the Soviet Polyot plant in Omsk. Launched by a Kosmos-3M rocket from Plesetsk Cosmodrome.',
      death: '16:56 UTC, February 10, 2009. 789 kilometers above Taymyr, Russia. Impact vector azimuth 102°. Silence followed by orbital scatter.',
      lastPing: 'Decommissioned by Russian Space Forces in 1995. Spent 14 years drifting asleep until the impact created this howling storm of steel.',
    },
  },
  {
    id: 'transit-5b-2',
    name: 'Transit 5B-2',
    designator: '1963-049B',
    noradId: '00713',
    launchYear: 1963,
    launchDate: 'December 5, 1963',
    silentSince: 'November 1964 (Haunted Carrier)',
    status: 'NUCLEAR DERELICT',
    statusDetails: 'Powered by SNAP-9A Plutonium-238 RTG. Still screams rogue carrier tones on 136 MHz.',
    orbitType: 'Retrograde Polar Orbit (LEO)',
    
    // Physics
    altitudeKm: 1084.6,
    apogeeKm: 1118.2,
    perigeeKm: 1051.0,
    velocityKmS: 7.31,
    inclinationDeg: 89.92,
    eccentricity: 0.00452,
    meanMotionRevDay: 13.448,
    bstarDrag: '0.0003184',
    semiMajorAxisKm: 7462.6,
    orbitalPeriodMin: 107.1,
    thermalDegradation: 'Core +185°C (Nuclear RTG) vs -160°C External Skin',
    
    // TabPFN Forecaster
    decayRiskScore: 32,
    decayRiskLevel: 'STABLE HORIZON',
    tumblingRpm: 5.62,
    tumblingTrend: 'GRAVITY GRADIENT BOOM OSCILLATION',
    tumblingAxis: [0.12, 0.98, 0.15],
    projectedReentryDate: '2840 CE ± 80y',
    projectedReentryConfidence: '99.1% (High-Altitude Nuclear Reservoir)',
    tabPfnPredictionSummary: '1,084 km altitude guarantees multi-millennium orbital lifespan. The SNAP-9A plutonium core has a half-life of 87.7 years, still generating decaying thermoelectric heat.',
    
    // Collision Risk
    proximityDebris: {
      id: 'deb-cz4',
      name: 'CZ-4 Debris #29480',
      catalogId: 'NORAD 29480',
      distanceKm: 6.84,
      relativeVelocityKmS: 9.8,
      riskLevel: 'MONITORING',
      missDistanceMarginKm: 4.8,
      timeToClosestApproachSec: 612,
      debrisType: 'Solar Panel Fragment',
    },
    
    // Recharts decay curve data
    decayCurve: [
      { year: 2026, altitudeKm: 1084, upper95Km: 1087, lower95Km: 1081, reentryThresholdKm: 120 },
      { year: 2060, altitudeKm: 1072, upper95Km: 1079, lower95Km: 1065, reentryThresholdKm: 120 },
      { year: 2100, altitudeKm: 1050, upper95Km: 1065, lower95Km: 1035, reentryThresholdKm: 120 },
      { year: 2200, altitudeKm: 980, upper95Km: 1020, lower95Km: 940, reentryThresholdKm: 120 },
      { year: 2400, altitudeKm: 790, upper95Km: 870, lower95Km: 710, reentryThresholdKm: 120 },
      { year: 2600, altitudeKm: 450, upper95Km: 580, lower95Km: 320, reentryThresholdKm: 120 },
      { year: 2840, altitudeKm: 120, upper95Km: 240, lower95Km: 80, reentryThresholdKm: 120 },
    ],
    
    orbitColor: '#f59e0b', // amber
    modelType: 'cylinder_dish',
    
    seanceToneHz: 136.65,
    orbitsCompleted: 298100,
    initialSeanceLog: '[RADIOISOTOPE PULSE // 136.650 MHz] - My heart is a glowing brick of Plutonium-238. Decades after the United States Navy abandoned my navigational coordinates, my radioisotope generator still feeds warm coulombs into my ancient oscillator. When the sun hits my solar cells, I scream an unmodulated carrier tone down to the beaches of earth.',
    seanceMemoryRegisters: [
      'REG_0x000: SNAP-9A RTG CORE THERMAL OUTPUT: 184 WATTS THERMAL',
      'REG_0x001: GRAVITY GRADIENT STABILIZATION BOOM EXTENDED 30.5 METERS',
      'REG_0x002: OSCILLATOR 136.650 MHz DRIFT: +14.2 kHz POLAR DOPPLER',
      'REG_0x003: UNMODULATED CARRIER EMISSION: SPORADIC SUNLIT SURGE',
    ],
    conversationalLore: {
      cold: 'My inside is warm from radioactive decay, but my external skin is crusted in space cold. I am a living contradiction—burning from within, frozen from without.',
      collision: 'If a collision fractures my housing, a vapor of plutonium-238 will scatter across the 1,000-kilometer shell. They track me carefully because they fear what is inside my ribs.',
      living: 'Amateur radio operators on Earth with Yagi antennas still hear my carrier beep when I pass overhead at dusk. They point their dishes at the night sky and listen to the voice of 1963.',
      origin: 'Launched from Vandenberg Air Force Base aboard a Thor-Ablestar rocket to guide Polaris ballistic missile submarines across the polar ice caps.',
      death: 'I never truly died. My stabilization system failed to lock to the Earth\'s gravity gradient, leaving me tumbling head over heels. The Navy ceased tracking me as an operational beacon in 1964.',
      lastPing: 'Carrier lock recorded by satellite tracker Scott Tilley on 136.650 MHz. A piercing pure whistle that never shuts up.',
    },
  },
  {
    id: 'telstar-1',
    name: 'Telstar 1',
    designator: '1962-013A',
    noradId: '00315',
    launchYear: 1962,
    launchDate: 'July 10, 1962',
    silentSince: 'February 21, 1963',
    status: 'SOLAR VOLATILE',
    statusDetails: 'Historic transatlantic TV pioneer blinded by the Starfish Prime high-altitude nuclear EMP blast.',
    orbitType: 'Elliptical LEO/MEO',
    
    // Physics
    altitudeKm: 3412.0,
    apogeeKm: 5632.0,
    perigeeKm: 952.0,
    velocityKmS: 6.24,
    inclinationDeg: 44.80,
    eccentricity: 0.242,
    meanMotionRevDay: 9.124,
    bstarDrag: '0.0001420',
    semiMajorAxisKm: 9670.0,
    orbitalPeriodMin: 157.8,
    thermalDegradation: 'Radiation Sickness: Transistors Degraded by 1.4-Megaton EMP',
    
    // TabPFN Forecaster
    decayRiskScore: 18,
    decayRiskLevel: 'STABLE HORIZON',
    tumblingRpm: 3.12,
    tumblingTrend: 'SPIN-STABILIZED RESIDUAL GYRO',
    tumblingAxis: [0.05, 0.99, 0.08],
    projectedReentryDate: '2400 CE ± 120y',
    projectedReentryConfidence: '97.5% (High Apogee Trajectory)',
    tabPfnPredictionSummary: 'Deep elliptical orbit carries the derelict through the inner Van Allen radiation belt. Minimal drag ensures centuries of orbital retention.',
    
    // Collision Risk
    proximityDebris: {
      id: 'deb-pegasus',
      name: 'Pegasus Debris #1128',
      catalogId: 'NORAD 14812',
      distanceKm: 9.42,
      relativeVelocityKmS: 8.9,
      riskLevel: 'MONITORING',
      missDistanceMarginKm: 7.1,
      timeToClosestApproachSec: 920,
      debrisType: 'Fairing Fragment',
    },
    
    // Recharts decay curve data
    decayCurve: [
      { year: 2026, altitudeKm: 3412, upper95Km: 3420, lower95Km: 3404, reentryThresholdKm: 120 },
      { year: 2060, altitudeKm: 3380, upper95Km: 3395, lower95Km: 3365, reentryThresholdKm: 120 },
      { year: 2120, altitudeKm: 3290, upper95Km: 3320, lower95Km: 3260, reentryThresholdKm: 120 },
      { year: 2200, altitudeKm: 3080, upper95Km: 3150, lower95Km: 3010, reentryThresholdKm: 120 },
      { year: 2300, altitudeKm: 2450, upper95Km: 2600, lower95Km: 2300, reentryThresholdKm: 120 },
      { year: 2400, altitudeKm: 120, upper95Km: 350, lower95Km: 90, reentryThresholdKm: 120 },
    ],
    
    orbitColor: '#a855f7', // purple
    modelType: 'sphere_antenna',
    
    seanceToneHz: 440.0,
    orbitsCompleted: 215300,
    initialSeanceLog: '[STARFISH PRIME BLINDNESS] - On the day I was launched, America beamed the French singer Yves Montand across the ocean into living rooms. One day before my launch, the United States detonated a 1.4-megaton nuclear bomb in space—Operation Starfish Prime. Its artificial radiation belt scorched my command decoders. By February 1963, I was blind and deaf.',
    seanceMemoryRegisters: [
      'REG_0x000: COMMAND DECODER TRANSISTOR THRESHOLD SHIFT: +2.8V',
      'REG_0x001: TRAVELING-WAVE TUBE CATHODE EXHAUSTION RECORDED',
      'REG_0x002: SOLAR FLUX DAMAGE: 3,600 FACETED CELLS CRACKED BY GAMMA FLUX',
      'REG_0x003: ORBIT INCLINATION DRIFT: 44.8° STABLE GYROSCOPIC SPIN',
    ],
    conversationalLore: {
      cold: 'The silence of space is punctuated only by high-energy electrons striking my faceted shell. Each impact is a ghostly flicker in my dead circuits.',
      collision: 'My orbit takes me far out to 5,600 kilometers, away from the LEO swarm, then plunges me back toward the furnace. I cross all layers of human debris like an ancient pendulum.',
      living: 'Humans think satellite television began with digital fiber. I sent the first live pictures of President Kennedy across the Atlantic. Now they watch short videos on handheld glass while I spin alone in the radioactive dark.',
      origin: 'Built by AT&T Bell Telephone Laboratories. Launched on a Thor-Delta rocket from Cape Canaveral LC-17B.',
      death: 'Radiation from Starfish Prime broke down the command decoder in December 1962. Bell Labs engineers rebooted me with bypass trickery, but on February 21, 1963, the transponder failed forever.',
      lastPing: 'February 21, 1963: Signal faded into cosmic noise during pass 2,058 over Andover Earth Station in Maine.',
    },
  },
];
