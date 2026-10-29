# 🛰️ PHANTASM-ORBIT // TELEMETRY OF THE DEAD

> *"There are 36,500 uncommunicative corpses orbiting above your head at 28,000 km/h. Their chemical batteries ruptured decades ago. Their solar arrays are fractured by micrometeoroids. Yet tonight, as they cross Earth's shadow, their transponders are screaming on dead frequencies."*

**Phantasm-Orbit** is a local-first **3D Space Archeology, TabPFN Orbital Decay Forecaster, and Digital Séance Terminal** built for the **Hacktoberfest 2026 Open-Source AI Challenge (Week 4: "Ghost in the Machine")** 

---

## 👁️ THE HORROR PREMISE: GHOSTS IN THE ORBITAL MACHINE

Every day, NORAD tracks thousands of **Zombie Satellites**—derelict Cold-War payloads, nuclear-powered naval beacons, and hypervelocity shrapnel clouds that refuse to burn up. Occasionally, due to outgassing, gravity-gradient boom oscillations, or solar induction across the Van Allen radiation belts, a dead satellite wakes up after decades of silence and broadcasts a **Phantom Carrier Signal**.

**Phantasm-Orbit** transforms real aerospace telemetry into an interactive cosmic-horror command bunker:
1. **3D WebGL Orbital Graveyard (`ThreeOrbitalView.tsx`):** Tracks 5 notorious real-world orbital revenants in real time with custom procedural 3D meshes, 350 Kessler debris shrapnel particles, planetary Van Allen electromagnetic flux lines, and a live 3D-to-2D targeting reticle HUD.
2. **TabPFN Orbital Decay & Anomaly Forecaster (`TelemetrySidebar.tsx` + `app.py`):** Evaluates real NORAD Two-Line Element (TLE) physics (`BSTAR Drag`, `Eccentricity`, `Inclination`, `Mean Motion`, `Tumbling RPM`) to project multi-decade atmospheric burn-up curves with 95% confidence bounds and triggers automated crimson **Telemetry Anomaly Pulses** when decay risk exceeds 80%.
3. **Procedural Web Audio Horror Synthesizer (`audioSynthesizer.ts`):** Zero pre-recorded MP3s—uses the native Web Audio API to synthesize 52Hz/53.2Hz beating sub-bass vacuum drones, bandpass-filtered cosmic pink noise, Solfeggio séance invocation chimes, Doppler radar pings, and sawtooth anomaly alarms.
4. **Neuro-Symbolic Digital Séance Medium (`SeanceTerminal.tsx` + `server.ts`):** Tunes into each satellite's exact historical RF carrier (e.g., `108.0 MHz` for Vanguard 1, `136.65 MHz` for Transit 5B-2) and channels local **Gemma (`gemma3:1b` via Ollama)** + **Gemini AI** to let operators interrogate the dead machine's memory registers in the first person.

---

## 💀 THE 5 TRACKED ORBITAL REVENANTS (REAL NORAD CATALOG)

| Designation | NORAD ID | Launch | Silent Since | Status | The Real-World Horror Story |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Vanguard 1** | `#00005` | 1958 | May 1964 | `UNRESPONSIVE / DRIFTING` | Humanity's oldest artifact in space. Its makers are long gone, yet its corroded beryllium sphere will orbit until 2240 CE. |
| **Envisat** | `#27386` | 2002 | April 2012 | `CRITICAL KESSLER THREAT` | An 8.2-ton dead European flagship tumbling in the crowded 768 km belt—one shrapnel hit away from a 100,000-fragment cascade. |
| **Kosmos 2251 Frag** | `#34120` | 1993 | Feb 2009 | `KINETIC SHATTER FIELD` | Razor-sharp titanium shrapnel spinning at 14.8 RPM from the violent 11.7 km/s hypervelocity collision with Iridium 33. |
| **Transit 5B-2** | `#00713` | 1963 | Nov 1964 | `NUCLEAR DERELICT` | Powered by a SNAP-9A Plutonium-238 radioactive core; still screams rogue unmodulated carrier tones on `136.650 MHz`. |
| **Telstar 1** | `#00315` | 1962 | Feb 1963 | `SOLAR VOLATILE` | Blinded and deafened by the United States' 1.4-megaton *Starfish Prime* high-altitude nuclear EMP detonation in space. |

---

## ⚙️ SYSTEM ARCHITECTURE

* **Frontend (`React 19` + `TypeScript` + `Three.js` + `Recharts` + `Tailwind CSS v4`):**
  * `src/components/ThreeOrbitalView.tsx` — 60 FPS WebGL orbital mechanics engine with 3 camera modes (`Track Sat`, `Global Orbit`, `Debris Vector`), conical radar sweep, and electromagnetic dipole toggle.
  * `src/components/TelemetrySidebar.tsx` — TabPFN decay risk progress bar, live RPM tumbling gauge, 95% confidence interval Recharts decay curve, and automated >80% risk anomaly pulse hook (`useTelemetryAnomaly.ts`).
  * `src/components/SeanceTerminal.tsx` — CRT scanline terminal with live audio waveform bars, 1-click hex register dumps, and AI Orbital Diagnostic modal.
  * `src/utils/audioSynthesizer.ts` — Pure procedural Web Audio API sound engine.
* **Backend (`server.ts` + `app.py`):**
  * Hybrid **Local Ollama (`gemma3:1b`)** + **Google Gemini API** + **Python TabPFN** telemetry engine.

---

## 🚀 QUICKSTART (AWAKEN THE BUNKER IN 30 SECONDS)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/prashijain-ai/Phantasm-Orbit.git
cd Phantasm-Orbit
npm install