import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const MinimalistGlobe = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState("Loading weather...");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=22.80&longitude=86.20&current_weather=true&timezone=Asia%2FKolkata",
        );
        const data = await res.json();
        const code = data.current_weather.weathercode;
        const temp = Math.round(data.current_weather.temperature);

        // Simple mapping of WMO codes
        const conditions: Record<number, string> = {
          0: "Clear Sky",
          1: "Mainly Clear",
          2: "Partly Cloudy",
          3: "Overcast",
          45: "Foggy",
          48: "Foggy",
          51: "Drizzle",
          61: "Rainy",
          71: "Snowy",
          95: "Thunderstorm",
        };
        setWeather(`${conditions[code] || "Clear"} — ${temp}°C`);
      } catch (e) {
        setWeather("Connection Stable");
      }
    };

    const updateTime = () => {
      const now = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
      setTime(now);
    };

    fetchWeather();
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const isMobile = window.innerWidth <= 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    // Theme Color Management
    const getThemeColor = () => {
      const theme = document.documentElement.getAttribute("data-theme") || "blue";
      const colors: Record<string, number> = {
        blue: 0x5eb8ff,
        gold: 0xf4c46b,
        purple: 0xcf9eff,
        crimson: 0xff4d4d,
        emerald: 0x4dff88,
        white: 0xffffff,
      };
      return colors[theme] || colors.blue;
    };

    let currentThemeColor = getThemeColor();

    // Globe Constants
    const radius = 140;

    const latLonToVector3 = (lat: number, lon: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      );
    };

    // Main World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Solid Core
    const coreGeo = new THREE.SphereGeometry(radius - 0.5, isMobile ? 16 : 32, isMobile ? 16 : 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: false,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    worldGroup.add(core);

    // 2. Vector Borders
    const bordersGroup = new THREE.Group();
    worldGroup.add(bordersGroup);
    const borderLines: THREE.Line[] = [];

    fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
      .then((res) => res.json())
      .then((data) => {
        data.features.forEach((feature: any) => {
          const { geometry } = feature;
          if (geometry.type === "Polygon") {
            drawPolygon(geometry.coordinates[0], bordersGroup);
          } else if (geometry.type === "MultiPolygon") {
            geometry.coordinates.forEach((polygon: any) => {
              drawPolygon(polygon[0], bordersGroup);
            });
          }
        });
      });

    const drawPolygon = (coordinates: any, group: THREE.Group) => {
      const points = [];
      for (let i = 0; i < coordinates.length; i++) {
        const [lon, lat] = coordinates[i];
        points.push(latLonToVector3(lat, lon, radius + 0.2));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: currentThemeColor,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
      borderLines.push(line);
    };

    // 3. Rings
    const ringGroup = new THREE.Group();
    const ringMaterials: THREE.MeshBasicMaterial[] = [];
    for (let i = 0; i < 8; i++) {
      const ringGeo = new THREE.TorusGeometry(radius, 0.4, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: currentThemeColor,
        transparent: true,
        opacity: 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = (i * Math.PI) / 4;
      ringGroup.add(ring);
      ringMaterials.push(ringMat);
    }
    worldGroup.add(ringGroup);

    // 4. Jharkhand Marker
    const markerPos = latLonToVector3(22.8046, 86.2029, radius);
    const markerGroup = new THREE.Group();
    const markerGeo = new THREE.SphereGeometry(2, isMobile ? 8 : 16, isMobile ? 8 : 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(markerPos);
    markerGroup.add(marker);

    const pulseGeo = new THREE.RingGeometry(3, 6, 32);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: currentThemeColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.position.copy(markerPos);
    pulse.lookAt(0, 0, 0);
    markerGroup.add(pulse);
    worldGroup.add(markerGroup);

    // Theme Observer
    const themeObserver = new MutationObserver(() => {
      const newColor = getThemeColor();
      if (newColor !== currentThemeColor) {
        currentThemeColor = newColor;
        borderLines.forEach((line) => {
          (line.material as THREE.LineBasicMaterial).color.setHex(newColor);
        });
        ringMaterials.forEach((mat) => {
          mat.color.setHex(newColor);
        });
        pulseMat.color.setHex(newColor);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Animation Logic
    const targetYRotation = -(86.2029 + 90) * (Math.PI / 180);
    const startYRotation = targetYRotation - Math.PI * 1.5;

    worldGroup.rotation.y = startYRotation;

    let time_anim = 0;
    let rotationComplete = false;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      rotationComplete = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
      const rotationSpeed = 0.005;
      worldGroup.rotation.y += deltaMove.x * rotationSpeed;
      worldGroup.rotation.x += deltaMove.y * rotationSpeed;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isDragging) {
          worldGroup.rotation.set(0, startYRotation, 0);
          rotationComplete = false;
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(mount);

    const animate = () => {
      requestAnimationFrame(animate);
      time_anim += 0.02;

      const s = 1 + Math.sin(time_anim * 3) * 0.5;
      pulse.scale.set(s, s, 1);
      pulseMat.opacity = 0.8 * (1 - (s - 0.5) / 1.5);

      // Animate border glow
      const borderOpacity = 0.3 + Math.sin(time_anim * 2) * 0.2;
      borderLines.forEach((line) => {
        (line.material as THREE.LineBasicMaterial).opacity = borderOpacity;
      });

      if (!rotationComplete && !isDragging) {
        const currentRot = worldGroup.rotation.y;
        const diff = targetYRotation - currentRot;
        if (Math.abs(diff) < 0.001) {
          worldGroup.rotation.y = targetYRotation;
          rotationComplete = true;
        } else {
          worldGroup.rotation.y += diff * 0.05;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      themeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      coreGeo.dispose();
      coreMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();
    };
  }, []);

  const getStatusMessage = () => {
    // Extract hour from time string (format: "HH:MM AM/PM")
    const hourMatch = time.match(/^(\d+):/);
    if (!hourMatch) return "Connection stable. Leave a brief!";

    let hour = parseInt(hourMatch[1]);
    const isPM = time.includes("PM");
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    if (hour >= 9 && hour <= 20) {
      return `It's daytime here—I'm ${weather.toLowerCase()} and ready to build!`;
    }
    return `It's late here (${weather.toLowerCase()})—I'm likely resting, but leave a brief!`;
  };

  return (
    <div className="relative h-full w-full pointer-events-auto">
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 pointer-events-none text-center">
        <div className="glass px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md min-w-[220px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Connection
          </p>
          <p className="text-sm font-bold tracking-tight mt-1">Jharkhand, India — {time}</p>
          <p className="text-[10px] text-muted-foreground mt-2 max-w-[200px] mx-auto leading-relaxed tracking-wider">
            {getStatusMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};
