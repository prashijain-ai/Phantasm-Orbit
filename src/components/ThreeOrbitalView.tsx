/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GhostSatellite } from '../types/satellite';
import { audioSynth } from '../utils/audioSynthesizer';
import { Radio, Crosshair, Eye, ShieldAlert, Zap, Orbit, Compass, Waves } from 'lucide-react';

interface ThreeOrbitalViewProps {
  satellite: GhostSatellite;
  simSpeed: number;
  scanlinesEnabled: boolean;
}

export const ThreeOrbitalView: React.FC<ThreeOrbitalViewProps> = ({
  satellite,
  simSpeed,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reticlePos, setReticlePos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: true });
  const [cameraMode, setCameraMode] = useState<'track' | 'global' | 'collision'>('track');
  const [radarActive, setRadarActive] = useState<boolean>(true);
  const [showEmField, setShowEmField] = useState<boolean>(true);
  const [dynamicProxKm, setDynamicProxKm] = useState<number>(satellite.proximityDebris.distanceKm);
  const [currentSubSat, setCurrentSubSat] = useState({ lat: 48.2, lon: 14.9, alt: satellite.altitudeKm, inSunlight: true });

  // References to keep Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const satelliteMeshRef = useRef<THREE.Group | null>(null);
  const orbitLineRef = useRef<THREE.Line | null>(null);
  const debrisPointsRef = useRef<THREE.Points | null>(null);
  const fieldGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);
  const orbitAngleRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const camSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 14,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });

  // Keep track of current satellite props in ref for animation loop
  const satRef = useRef<GhostSatellite>(satellite);
  const speedRef = useRef<number>(simSpeed);
  const showEmFieldRef = useRef<boolean>(showEmField);
  satRef.current = satellite;
  speedRef.current = simSpeed;
  showEmFieldRef.current = showEmField;

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020617, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(10, 8, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(30, 15, 20);
    scene.add(sunLight);

    // Earth group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Earth Sphere Core
    const earthRadius = 4.2;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x071126,
      emissive: 0x030814,
      specular: 0x06b6d4,
      shininess: 12,
      wireframe: false,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Earth Wireframe Grid (Latitude/Longitude parallels)
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x0e7490,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireframeSphere = new THREE.Mesh(earthGeo, wireframeMat);
    wireframeSphere.scale.set(1.002, 1.002, 1.002);
    earthGroup.add(wireframeSphere);

    // Earth Atmosphere Rim Glow (Fresnel edge ring)
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.05, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);

    // Background Stars (800 particles)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 60 + Math.random() * 80;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.8,
      transparent: true,
      opacity: 0.65,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Debris Cloud (350 debris particles orbiting)
    const debrisCount = 350;
    const debrisGeo = new THREE.BufferGeometry();
    const debrisPositions = new Float32Array(debrisCount * 3);
    const debrisColors = new Float32Array(debrisCount * 3);

    for (let i = 0; i < debrisCount; i++) {
      const alt = 4.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;
      
      debrisPositions[i * 3] = alt * Math.cos(phi) * Math.cos(theta);
      debrisPositions[i * 3 + 1] = alt * Math.sin(phi);
      debrisPositions[i * 3 + 2] = alt * Math.cos(phi) * Math.sin(theta);

      // Colors: Some red (hazardous shrapnel), some amber, most cyan/gray
      const rand = Math.random();
      if (rand < 0.12) {
        // Red alert shrapnel
        debrisColors[i * 3] = 0.95;
        debrisColors[i * 3 + 1] = 0.25;
        debrisColors[i * 3 + 2] = 0.35;
      } else if (rand < 0.35) {
        // Amber rocket fragment
        debrisColors[i * 3] = 0.96;
        debrisColors[i * 3 + 1] = 0.62;
        debrisColors[i * 3 + 2] = 0.04;
      } else {
        // Cyan dead casing
        debrisColors[i * 3] = 0.06;
        debrisColors[i * 3 + 1] = 0.71;
        debrisColors[i * 3 + 2] = 0.83;
      }
    }
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPositions, 3));
    debrisGeo.setAttribute('color', new THREE.BufferAttribute(debrisColors, 3));
    const debrisMat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const debrisPoints = new THREE.Points(debrisGeo, debrisMat);
    debrisPointsRef.current = debrisPoints;
    scene.add(debrisPoints);

    // Planetary Electromagnetic Field Lines (Van Allen Radiation Dipole Flux)
    const fieldGroup = new THREE.Group();
    fieldGroupRef.current = fieldGroup;
    scene.add(fieldGroup);

    const numFieldLoops = 10;
    const fieldMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
    });

    for (let i = 0; i < numFieldLoops; i++) {
      const azimuth = (i / numFieldLoops) * Math.PI * 2;
      const loopPoints: THREE.Vector3[] = [];
      const steps = 40;
      const L = 8.5; // Magnetic shell radius L-parameter
      for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * Math.PI;
        const sinT = Math.sin(t);
        const r = Math.max(4.2, L * sinT * sinT);
        const y = r * Math.cos(t);
        const rho = r * sinT;
        const x = rho * Math.cos(azimuth);
        const z = rho * Math.sin(azimuth);
        loopPoints.push(new THREE.Vector3(x, y, z));
      }
      const loopGeo = new THREE.BufferGeometry().setFromPoints(loopPoints);
      const loopLine = new THREE.Line(loopGeo, fieldMat);
      fieldGroup.add(loopLine);
    }

    // Create Initial Satellite Group & Orbit
    buildSatelliteAndOrbit(satRef.current);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Mouse Drag Controls for 3D Camera Rotation
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      camSphericalRef.current.theta -= deltaX * 0.006;
      camSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, camSphericalRef.current.phi - deltaY * 0.006)
      );
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camSphericalRef.current.radius = Math.max(
        6,
        Math.min(30, camSphericalRef.current.radius + e.deltaY * 0.015)
      );
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile/tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      camSphericalRef.current.theta -= deltaX * 0.008;
      camSphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, camSphericalRef.current.phi - deltaY * 0.008)
      );
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Animation Loop
    let lastTime = performance.now();
    const renderLoop = (time: number) => {
      animFrameId.current = requestAnimationFrame(renderLoop);

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Rotate Earth slowly
      earthGroup.rotation.y += 0.04 * dt;

      // Rotate Debris cloud slowly
      if (debrisPointsRef.current) {
        debrisPointsRef.current.rotation.y += 0.06 * dt;
      }

      // Rotate and toggle Electromagnetic Field Lines
      if (fieldGroupRef.current) {
        fieldGroupRef.current.visible = showEmFieldRef.current;
        fieldGroupRef.current.rotation.y += 0.03 * dt;
      }

      // Progress satellite along orbit
      const currentSat = satRef.current;
      const speed = speedRef.current;
      const orbitSpeed = (2 * Math.PI) / (currentSat.orbitalPeriodMin * 0.6) * speed * 0.05;
      orbitAngleRef.current += orbitSpeed * dt;

      // Calculate satellite 3D position on its elliptical inclined orbit
      const semiMajor = 4.2 + (currentSat.altitudeKm / 1000) * 1.5;
      const ecc = currentSat.eccentricity;
      const incRad = (currentSat.inclinationDeg * Math.PI) / 180;
      
      const r = (semiMajor * (1 - ecc * ecc)) / (1 + ecc * Math.cos(orbitAngleRef.current));
      const orbX = r * Math.cos(orbitAngleRef.current);
      const orbZ = r * Math.sin(orbitAngleRef.current);

      // Rotate for inclination
      const posX = orbX;
      const posY = orbZ * Math.sin(incRad);
      const posZ = orbZ * Math.cos(incRad);

      if (satelliteMeshRef.current) {
        satelliteMeshRef.current.position.set(posX, posY, posZ);

        // Apply tumbling rotation based on real RPM
        const rpmRadSec = (currentSat.tumblingRpm * 2 * Math.PI) / 60;
        const [axX, axY, axZ] = currentSat.tumblingAxis;
        satelliteMeshRef.current.rotation.x += axX * rpmRadSec * dt * 4;
        satelliteMeshRef.current.rotation.y += axY * rpmRadSec * dt * 4;
        satelliteMeshRef.current.rotation.z += axZ * rpmRadSec * dt * 4;

        // Project 3D satellite position to 2D screen coordinates for Reticle HUD
        const vector = new THREE.Vector3(posX, posY, posZ);
        vector.project(camera);

        const isBehindCamera = vector.z > 1;
        const screenX = ((vector.x + 1) * width) / 2;
        const screenY = ((-vector.y + 1) * height) / 2;

        setReticlePos({
          x: Math.round(screenX),
          y: Math.round(screenY),
          visible: !isBehindCamera && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height,
        });

        // Update Sub-Satellite Coordinates readout
        const latDeg = (posY / r) * 90;
        const lonDeg = ((Math.atan2(posZ, posX) * 180) / Math.PI + time * 0.02) % 360 - 180;
        const sunDot = posX * sunLight.position.x + posY * sunLight.position.y + posZ * sunLight.position.z;
        setCurrentSubSat({
          lat: parseFloat(latDeg.toFixed(2)),
          lon: parseFloat(lonDeg.toFixed(2)),
          alt: parseFloat((currentSat.altitudeKm + Math.sin(orbitAngleRef.current) * (currentSat.apogeeKm - currentSat.perigeeKm) * 0.5).toFixed(1)),
          inSunlight: sunDot > -5,
        });
      }

      // Camera positioning based on mode
      const { radius, theta, phi } = camSphericalRef.current;
      if (cameraMode === 'track' && satelliteMeshRef.current) {
        // Offset relative to satellite
        const satPos = satelliteMeshRef.current.position;
        const targetX = satPos.x + radius * Math.sin(phi) * Math.sin(theta);
        const targetY = satPos.y + radius * Math.cos(phi);
        const targetZ = satPos.z + radius * Math.sin(phi) * Math.cos(theta);

        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
        camera.lookAt(satPos);
      } else if (cameraMode === 'collision' && satelliteMeshRef.current) {
        // Close-up between ghost sat and incoming debris vector
        const satPos = satelliteMeshRef.current.position;
        camera.position.lerp(new THREE.Vector3(satPos.x + 2.2, satPos.y + 1.1, satPos.z + 2.4), 0.1);
        camera.lookAt(satPos);
      } else {
        // Global Earth-Centric orbital view
        const eyeX = radius * Math.sin(phi) * Math.sin(theta);
        const eyeY = radius * Math.cos(phi);
        const eyeZ = radius * Math.sin(phi) * Math.cos(theta);
        camera.position.lerp(new THREE.Vector3(eyeX, eyeY, eyeZ), 0.08);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Helper to construct procedural 3D model & orbit curve for selected satellite
  const buildSatelliteAndOrbit = (sat: GhostSatellite) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old satellite
    if (satelliteMeshRef.current) {
      scene.remove(satelliteMeshRef.current);
      satelliteMeshRef.current = null;
    }
    // Remove old orbit line
    if (orbitLineRef.current) {
      scene.remove(orbitLineRef.current);
      orbitLineRef.current = null;
    }

    // 1. Build Orbit Curve (Elliptical Spline)
    const semiMajor = 4.2 + (sat.altitudeKm / 1000) * 1.5;
    const ecc = sat.eccentricity;
    const incRad = (sat.inclinationDeg * Math.PI) / 180;
    const segments = 128;
    const orbitPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = (semiMajor * (1 - ecc * ecc)) / (1 + ecc * Math.cos(angle));
      const orbX = r * Math.cos(angle);
      const orbZ = r * Math.sin(angle);
      const posX = orbX;
      const posY = orbZ * Math.sin(incRad);
      const posZ = orbZ * Math.cos(incRad);
      orbitPoints.push(new THREE.Vector3(posX, posY, posZ));
    }

    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(sat.orbitColor),
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLineRef.current = orbitLine;
    scene.add(orbitLine);

    // 2. Build 3D Satellite Mesh
    const satGroup = new THREE.Group();

    if (sat.modelType === 'box_solar') {
      // Envisat-style bus: 8-ton colossus with huge radar antenna & solar wings
      const busGeo = new THREE.BoxGeometry(0.55, 0.45, 1.1);
      const busMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.8,
        roughness: 0.3,
      });
      const bus = new THREE.Mesh(busGeo, busMat);
      satGroup.add(bus);

      // Solar Wings (Solar panels with cyan cells)
      const wingGeo = new THREE.BoxGeometry(2.4, 0.04, 0.5);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.2,
        roughness: 0.2,
      });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.set(0, 0, 0);
      satGroup.add(wing);

      // ASAR radar antenna boom
      const radarArmGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4);
      const radarArmMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      const radarArm = new THREE.Mesh(radarArmGeo, radarArmMat);
      radarArm.position.set(0.4, 0.3, -0.6);
      radarArm.rotation.x = Math.PI / 4;
      satGroup.add(radarArm);
    } else if (sat.modelType === 'sphere_antenna') {
      // Vanguard 1 / Telstar style: Spherical polished hull with antenna spikes
      const sphereGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.9,
        roughness: 0.15,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      satGroup.add(sphere);

      // 6 whip antennas pointing outwards
      const spikeDirections = [
        [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
      ];
      spikeDirections.forEach(([x, y, z]) => {
        const spikeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.9);
        const spikeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x * 0.5, y * 0.5, z * 0.5);
        if (x !== 0) spike.rotation.z = Math.PI / 2;
        if (z !== 0) spike.rotation.x = Math.PI / 2;
        satGroup.add(spike);
      });
    } else if (sat.modelType === 'debris_cluster') {
      // Kosmos 2251 Fragment: Jagged shrapnel shard
      const shardGeo = new THREE.ConeGeometry(0.35, 0.9, 5);
      const shardMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        metalness: 0.85,
        roughness: 0.4,
        flatShading: true,
      });
      const shard = new THREE.Mesh(shardGeo, shardMat);
      satGroup.add(shard);

      // Trailing small fragment
      const subShardGeo = new THREE.BoxGeometry(0.15, 0.15, 0.25);
      const subShard = new THREE.Mesh(subShardGeo, shardMat);
      subShard.position.set(0.3, -0.2, 0.2);
      satGroup.add(subShard);
    } else {
      // Transit 5B-2: Cylinder body + SNAP-9A RTG isotopic housing
      const cylGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        metalness: 0.7,
        roughness: 0.3,
      });
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      satGroup.add(cyl);

      // RTG glowing warning core
      const rtgGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const rtgMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const rtg = new THREE.Mesh(rtgGeo, rtgMat);
      rtg.position.set(0, 0.48, 0);
      satGroup.add(rtg);

      // Long 30m gravity gradient boom
      const boomGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.8);
      const boomMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
      const boom = new THREE.Mesh(boomGeo, boomMat);
      boom.position.set(0, -0.9, 0);
      satGroup.add(boom);
    }

    satelliteMeshRef.current = satGroup;
    scene.add(satGroup);
  };

  
  // Re-build 3D satellite mesh and snap camera focus when selection changes
  useEffect(() => {
    buildSatelliteAndOrbit(satellite);
    audioSynth.playCarrierTone(satellite.seanceToneHz);
    setDynamicProxKm(satellite.proximityDebris.distanceKm);
    
    // Snap camera zoom distance and angles to the newly selected satellite
    camSphericalRef.current.radius = 12;
    camSphericalRef.current.theta = Math.PI / 4;
    camSphericalRef.current.phi = Math.PI / 3;
    setCameraMode('track');
  }, [satellite.id]);

  // Dynamic live fluctuations for collision proximity
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicProxKm((prev) => {
        const delta = (Math.random() - 0.5) * 0.04;
        const base = satellite.proximityDebris.distanceKm;
        return parseFloat(Math.max(1.1, Math.min(base + 1.2, prev + delta)).toFixed(2));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [satellite.proximityDebris.distanceKm]);

  // Periodic radar ping sound if radar active
  useEffect(() => {
    if (!radarActive) return;
    const pingTimer = setInterval(() => {
      audioSynth.playRadarPing();
    }, 4000);
    return () => clearInterval(pingTimer);
  }, [radarActive]);
  // Manual Zoom Handlers for UI Buttons
  const handleZoomIn = () => {
    camSphericalRef.current.radius = Math.max(6, camSphericalRef.current.radius - 2);
  };
  const handleZoomOut = () => {
    camSphericalRef.current.radius = Math.min(30, camSphericalRef.current.radius + 2);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[440px] flex-1 overflow-hidden select-none bg-slate-950">
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Grid overlay lines for aerospace HUD */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Simulated Radar Sweep Animation (Conical scanline radar) */}
      {radarActive && (
        <div className="absolute top-4 right-4 w-32 h-32 md:w-40 md:h-40 rounded-full border border-emerald-500/30 bg-slate-950/70 backdrop-blur-md p-2 pointer-events-none overflow-hidden z-10">
          {/* Radar Circles */}
          <div className="absolute inset-2 rounded-full border border-emerald-500/20" />
          <div className="absolute inset-6 rounded-full border border-emerald-500/25" />
          <div className="absolute inset-10 rounded-full border border-emerald-500/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-emerald-500/30" />
            <div className="absolute h-full w-[1px] bg-emerald-500/30" />
          </div>

          {/* Rotating Sweep Beam */}
          <div className="absolute inset-0 animate-radar origin-center">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/40 via-emerald-500/10 to-transparent origin-bottom-right" />
          </div>

          {/* Radar Center Ghost Target Blip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />

          {/* Close Debris Blip */}
          <div className="absolute top-[38%] left-[64%] w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <div className="absolute top-[38%] left-[64%] w-1.5 h-1.5 rounded-full bg-rose-500" />

          {/* Radar HUD label */}
          <div className="absolute bottom-1 left-2 text-[9px] font-mono text-emerald-400/80 tracking-wider">
            RADAR: ACTIVE (360°)
          </div>
      </div>
      )}

      {/* Target Reticle around the Ghost Satellite (Projected from 3D coords) */}
      {reticlePos.visible && (
        <div
          className="absolute pointer-events-none transition-all duration-75 ease-out z-20"
          style={{
            left: `${reticlePos.x}px`,
            top: `${reticlePos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Bracket reticle box */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400" />

            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-cyan-400/80 animate-pulse" />
            </div>

            {/* Target Label HUD */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/80 border border-cyan-500/40 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 tracking-wider">
              LOCKED // {satellite.noradId}
            </div>

            {/* Tumbling Rate Indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-amber-400 tracking-widest">
              TUMBLE: {satellite.tumblingRpm.toFixed(2)} RPM
            </div>
          </div>
        </div>
      )}

      {/* Zoom In / Out Buttons */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-cyan-500/30 rounded-lg p-1">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold transition-colors"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold transition-colors"
            >
              -
            </button>
          </div>
      {/* 3D Viewport Color Legend Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-2.5 text-[10px] font-mono text-slate-300 flex flex-col gap-1.5 z-10 shadow-lg">
        <span className="font-bold text-cyan-400 uppercase tracking-wider">
          🛰️ 3D DEBRIS MATRIX LEGEND:
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Target Satellite</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Dead Casing</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Rocket Fragment</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Critical Shrapnel</span>
        </div>
      </div>

      {/* 3D Navigation Helper Badge (Bottom-Left over Earth) */}
      <div className="absolute bottom-20 left-4 pointer-events-none bg-slate-950/75 backdrop-blur-md border border-cyan-500/30 rounded-lg px-3 py-1.5 text-[10px] font-mono text-cyan-300 flex items-center gap-2 z-10 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>[DRAG] Rotate 3D Earth • [SCROLL] Zoom • [CLICK BLIPS] Target Satellites</span>
      </div>

      {/* Top Floating Telemetry Cards Overlay */}
      <div className="absolute top-4 left-4 flex flex-col sm:flex-row gap-3 z-10 max-w-[calc(100%-10rem)]">
        {/* Collision Proximity Card */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-rose-500/40 rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Distance to Collision Proximity
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-rose-400 tabular-nums">
                {dynamicProxKm} km
              </span>
              <span className="text-[10px] font-mono text-rose-300/80 uppercase">
                {satellite.proximityDebris.name}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>TCA: {satellite.proximityDebris.timeToClosestApproachSec}s</span>
              <span>·</span>
              <span className="text-rose-400">Rel: {satellite.proximityDebris.relativeVelocityKmS} km/s</span>
            </div>
          </div>
        </div>

        {/* Orbital Velocity Card */}
        <div className="bg-slate-900/75 backdrop-blur-md border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Orbital Velocity
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-cyan-300 tabular-nums">
                {satellite.velocityKmS.toFixed(2)} km/s
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                (Mach {(satellite.velocityKmS * 2.915).toFixed(1)})
              </span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span>Period: {satellite.orbitalPeriodMin}m</span>
              <span>·</span>
              <span>{satellite.orbitType.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Coordinates & Camera Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-auto z-10">
          
          {/* Sub-Satellite Point */}
          <div className="bg-slate-900/75 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center gap-3">
            <div className="flex items-center gap-1 text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase text-slate-400">Sub-Sat:</span>
            </div>
            <span className="tabular-nums">
              {currentSubSat.lat >= 0 ? `${currentSubSat.lat}° N` : `${Math.abs(currentSubSat.lat)}° S`}
            </span>
            <span className="text-slate-600">|</span>
            <span className="tabular-nums">
              {currentSubSat.lon >= 0 ? `${currentSubSat.lon}° E` : `${Math.abs(currentSubSat.lon)}° W`}
            </span>
            <span className="text-slate-600">|</span>
            <span className="tabular-nums text-emerald-400">
              ALT: {currentSubSat.alt} km
            </span>
            <span className="text-slate-600">|</span>
            <span className={currentSubSat.inSunlight ? 'text-amber-400' : 'text-slate-400'}>
              {currentSubSat.inSunlight ? '☀️ SUNLIT' : '🌑 UMBRA'}
            </span>
          </div>

          {/* View Controls, Camera Presets & Zoom Buttons */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 p-1.5 rounded-lg">
            <button
              onClick={() => {
                setCameraMode('track');
                camSphericalRef.current.radius = 12;
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                cameraMode === 'track'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crosshair className="w-3 h-3" />
              Track Sat
            </button>
            <button
              onClick={() => {
                setCameraMode('global');
                camSphericalRef.current.radius = 24;
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                cameraMode === 'global'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3 h-3" />
              Global Orbit
            </button>
            <button
              onClick={() => {
                setCameraMode('collision');
                camSphericalRef.current.radius = 7;
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors ${
                cameraMode === 'collision'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              Debris Vector
            </button>

            <span className="h-4 w-[1px] bg-slate-700 mx-0.5" />

            {/* Manual Zoom Buttons */}
            <button
              onClick={() => {
                camSphericalRef.current.radius = Math.max(6, camSphericalRef.current.radius - 3);
              }}
              title="Zoom In"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold"
            >
              +
            </button>
            <button
              onClick={() => {
                camSphericalRef.current.radius = Math.min(30, camSphericalRef.current.radius + 3);
              }}
              title="Zoom Out"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold"
            >
              -
            </button>

            <span className="h-4 w-[1px] bg-slate-700 mx-0.5" />

            <button
              onClick={() => setRadarActive(!radarActive)}
              title="Toggle Radar Sweep"
              className={`p-1.5 rounded transition-colors ${
                radarActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowEmField(!showEmField)}
              title="Toggle Electromagnetic Field Lines"
              className={`p-1.5 rounded transition-colors ${
                showEmField
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
    </div>
  );
}