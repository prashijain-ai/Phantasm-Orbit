# 🛰️ PHANTASM-ORBIT // TELEMETRY OF THE DEAD

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js WebGL](https://img.shields.io/badge/Three.js_WebGL-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TabPFN ML](https://img.shields.io/badge/TabPFN-Orbital_Decay_ML-F59E0B?style=for-the-badge)](https://github.com/automl/TabPFN)
[![Local Gemma 3:1b](https://img.shields.io/badge/Ollama-Local_Gemma_3:1b-10B981?style=for-the-badge)](https://ollama.com/)
[![Zero API Keys](https://img.shields.io/badge/Judge_Ready-Zero_API_Keys_Required-EC4899?style=for-the-badge)](#)

> *"There are 36,500 uncommunicative corpses orbiting above your head at 28,000 km/h. Their chemical batteries ruptured decades ago. Their solar arrays are fractured by micrometeoroids. Yet tonight, as they cross Earth's shadow, their transponders are screaming on dead frequencies."*

🔗 **Live Interactive Command Center:** **[phantasm-orbit.vercel.app](https://phantasm-orbit.vercel.app/)**

<img width="1470" height="956" alt="Screenshot 2026-10-29 at 10 50 40 PM copy" src="https://github.com/user-attachments/assets/b412e41c-1c6b-4f54-9b20-346cdb386da1" />



---

## 🏆 HACKATHON SUBMISSION & CATEGORIES (DEV Week 4 // "Ghost in the Machine")

**Phantasm-Orbit** is a local-first **3D Space Archeology, TabPFN Orbital Decay Forecaster, and Digital Séance Terminal** built for the **Hacktoberfest 2026 Open-Source AI Challenge (Week 4: "Ghost in the Machine")**.

### 🎯 How We Hit Every Judging Category:
* **👻 "Ghost in the Machine" Theme Execution:** Instead of fictional ghosts, we resurrect real **Zombie Satellites**—derelict Cold-War payloads, nuclear-powered naval beacons (`Transit 5B-2`), and hypervelocity shrapnel (`Kosmos 2251`) that occasionally wake up in orbit due to solar-induced currents across the Van Allen radiation belts and broadcast **Phantom Carrier Signals**.
* **🔒 100% Local-First & Judge-Friendly (Zero API Keys Required):** Built on **Local Ollama (`gemma3:1b`)** and **TabPFN** with an automatic, deterministic **Spectral Lore Fallback Engine**. Judges can test the live deployment or clone and run locally in 10 seconds with **zero `.env` configuration or paid API keys**.
* **📊 Rigorous Scientific Telemetry Meets Generative Horror:** Combines real **NORAD Two-Line Element (TLE)** orbital mechanics (`BSTAR Drag`, `Eccentricity`, `Inclination`, `Mean Motion`, `Tumbling RPM`) with interactive 60 FPS **Three.js WebGL** visualization and **Web Audio API** procedural sound synthesis.

---

## 👁️ THE 4 CORE SUBSYSTEMS

1. **🌍 3D WebGL Orbital Graveyard (`ThreeOrbitalView.tsx`):** Tracks 5 notorious real-world orbital revenants in real time with custom procedural 3D meshes, 350 color-coded Kessler debris shrapnel particles, planetary Van Allen electromagnetic flux lines, interactive camera presets (`Track Sat`, `Global Orbit`, `Debris Vector`), and a live 3D-to-2D targeting reticle HUD.
2. **📉 TabPFN Orbital Decay & Anomaly Forecaster (`TelemetrySidebar.tsx` + `app.py`):** Evaluates real NORAD TLE physics to project multi-decade atmospheric burn-up curves with 95% confidence bounds and triggers automated crimson **Telemetry Anomaly Pulses** when decay risk exceeds 80%.
3. **🔊 Procedural Web Audio Horror Synthesizer (`audioSynthesizer.ts`):** Zero pre-recorded MP3s—uses the native Web Audio API to synthesize `52Hz/53.2Hz` beating sub-bass vacuum drones, bandpass-filtered cosmic pink noise, Solfeggio séance invocation chimes, Doppler radar pings, and sawtooth anomaly alarms.
4. **💀 Neuro-Symbolic Digital Séance Medium (`SeanceTerminal.tsx` + `server.ts`):** Tunes into each satellite's exact historical RF carrier (e.g., `108.0 MHz` for Vanguard 1, `136.65 MHz` for Transit 5B-2) and channels local **Gemma 3:1b** to decode corrupted hex memory registers and converse with the dead spacecraft in the first person.

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
  * `src/components/ThreeOrbitalView.tsx` — 60 FPS WebGL orbital mechanics engine with 3 camera modes (`Track Sat`, `Global Orbit`, `Debris Vector`), manual zoom controls, color-coded Kessler debris legend, conical radar sweep, and electromagnetic dipole toggle.
  * `src/components/TelemetrySidebar.tsx` — TabPFN decay risk progress bar, live RPM tumbling gauge, 95% confidence interval Recharts decay curve, and automated `>80%` risk anomaly pulse hook (`useTelemetryAnomaly.ts`).
  * `src/components/SeanceTerminal.tsx` — Streaming digital séance console with 1-click ghost inquiry pills (`Final Transmission`, `Collision Risk`, `Hex Registers`) and AI Orbital Diagnostic modal.
  * `src/utils/audioSynthesizer.ts` — Pure procedural Web Audio API sound engine.
* **Backend (`server.ts` + `app.py`):**
  * 100% Local-First AI Pipeline: Local Ollama (`gemma3:1b`) + Python **TabPFN** orbital telemetry engine + deterministic offline fallback for zero-configuration cloud demos.

---

## 🚀 QUICKSTART (AWAKEN THE BUNKER IN 30 SECONDS)

```bash
# 1. Clone & Install Dependencies
git clone [https://github.com/prashijain-ai/Phantasm-Orbit.git](https://github.com/prashijain-ai/Phantasm-Orbit.git)
cd Phantasm-Orbit
npm install --legacy-peer-deps

# 2. (Optional) Start Local Gemma 3:1b via Ollama for live LLM Séances
ollama run gemma3:1b

# 3. Launch the 3D Orbital Command Center
npm run dev
