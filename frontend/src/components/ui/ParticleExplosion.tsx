import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const ParticleExplosion = ({ onComplete }: { onComplete: () => void }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorPrimary = new THREE.Color("#5eb8ff");

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const angle = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = Math.random() * 2 + 1;

      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(angle);
      velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(angle);
      velocities[i * 3 + 2] = speed * Math.cos(phi);

      colors[i * 3] = colorPrimary.r;
      colors[i * 3 + 1] = colorPrimary.g;
      colors[i * 3 + 2] = colorPrimary.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let frame = 0;
    let opacity = 1.0;

    const animate = () => {
      frame++;
      const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < particlesCount; i++) {
        positionsAttr.array[i * 3] += velocities[i * 3];
        positionsAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
        positionsAttr.array[i * 3 + 2] += velocities[i * 3 + 2];

        // Add "gravity" or drag
        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;
        velocities[i * 3 + 2] *= 0.98;
      }
      positionsAttr.needsUpdate = true;

      if (frame > 60) {
        opacity -= 0.02;
        material.opacity = Math.max(0, opacity);
      }

      if (opacity <= 0) {
        onComplete();
        return;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  return <div ref={mountRef} className="fixed inset-0 z-[9999] pointer-events-none" />;
};
