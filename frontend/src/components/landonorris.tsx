import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function parseVec3(vec3String: string): [number, number, number] {
  const parts = vec3String.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    return [parts[0], parts[1], parts[2]];
  }
  return [1, 1, 1];
}

export default function LorenzoInteractivePortrait({
  baseImageUrl = "",
  revealImageUrl = "",
  backgroundColor = "#FFFFFF",
  blobRadius = 0.35,
  blobFadeSpeed = 2.5,
  mobileBreakpoint = 768,
  mobileImagePosition = "bottom",
  fadeInDelay = 0.2,
  fadeInDuration = 0.8,
  colorBgVec3 = "1.0,1.0,1.0",
  colorSoftShapeVec3 = "0.961,0.961,0.961",
  colorLineVec3 = "0.91,0.91,0.91",
  maxImageWidth = 520,
  yOffset = 0,
  renderMode = "all", // "all", "bgOnly", "portraitsOnly"
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    const gu = { time: { value: 0 }, dTime: { value: 0 }, aspect: { value: width / height } };
    const scene = new THREE.Scene();
    if (backgroundColor && backgroundColor !== "transparent" && renderMode !== "portraitsOnly") {
      scene.background = new THREE.Color(backgroundColor);
    }

    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000,
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    setTimeout(() => {
      setIsReady(true);
    }, fadeInDelay * 1000);

    class Blob {
      renderer: THREE.WebGLRenderer;
      rtOutput: THREE.WebGLRenderTarget;
      rtScene: THREE.Mesh;
      rtCamera: THREE.Camera;
      uniforms: any;
      prevRenderTarget: THREE.WebGLRenderTarget;
      cleanupListeners: () => void;
      updateAutoRipples: (dt: number) => void;

      constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.rtOutput = new THREE.WebGLRenderTarget(width, height, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
        });
        this.prevRenderTarget = new THREE.WebGLRenderTarget(width, height, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
        });

        this.uniforms = {
          pointer: { value: new THREE.Vector2(10, 10) },
          pointerDown: { value: 1 },
          pointerRadius: { value: blobRadius },
          pointerDuration: { value: blobFadeSpeed },
          prevFrame: { value: this.prevRenderTarget.texture },
          time: gu.time,
          dTime: gu.dTime,
          aspect: gu.aspect,
          virtualPointer1: { value: new THREE.Vector2(10, 10) },
          virtualPointer1Down: { value: 0 },
          virtualPointer2: { value: new THREE.Vector2(10, 10) },
          virtualPointer2Down: { value: 0 },
          colorBg: { value: new THREE.Vector3(...parseVec3(colorBgVec3)) },
          colorSoftShape: { value: new THREE.Vector3(...parseVec3(colorSoftShapeVec3)) },
          colorLine: { value: new THREE.Vector3(...parseVec3(colorLineVec3)) },
          texBlob: { value: this.rtOutput.texture },
        };

        let virtualPathTime = 0;
        let isVirtualActive = false;
        let nextVirtualStartTime = performance.now() + 2000;

        this.updateAutoRipples = (dt: number) => {
          const now = performance.now();

          if (!isVirtualActive && now > nextVirtualStartTime) {
            isVirtualActive = true;
            virtualPathTime = 0;
          }

          if (isVirtualActive) {
            virtualPathTime += dt * 0.4;
            const y = -1.3 + virtualPathTime * 2.5;

            const x1 = -0.5 + Math.sin(virtualPathTime * 14.5) * 0.5;
            const x2 = 0.5 - Math.sin(virtualPathTime * 14.5) * 0.5;

            if (y > 1.4) {
              isVirtualActive = false;
              this.uniforms.virtualPointer1Down.value = 0;
              this.uniforms.virtualPointer2Down.value = 0;
              this.uniforms.virtualPointer1.value.set(10, 10);
              this.uniforms.virtualPointer2.value.set(10, 10);
              nextVirtualStartTime = now + 3000 + Math.random() * 1000;
            } else {
              this.uniforms.virtualPointer1.value.set(x1, y);
              this.uniforms.virtualPointer1Down.value = 1.0;
              this.uniforms.virtualPointer2.value.set(x2, y);
              this.uniforms.virtualPointer2Down.value = 1.0;
            }
          }
        };

        const handleMouseMove = (event: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          this.uniforms.pointer.value.x = ((event.clientX - rect.left) / width) * 2 - 1;
          this.uniforms.pointer.value.y = -((event.clientY - rect.top) / height) * 2 + 1;
        };

        const handleTouchMove = (event: TouchEvent) => {
          if (event.touches.length > 0) {
            const rect = container.getBoundingClientRect();
            const touch = event.touches[0];
            this.uniforms.pointer.value.x = ((touch.clientX - rect.left) / width) * 2 - 1;
            this.uniforms.pointer.value.y = -((touch.clientY - rect.top) / height) * 2 + 1;
          }
        };

        const handleMouseLeave = () => {
          this.uniforms.pointer.value.set(10, 10);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("reset-blob", handleMouseLeave);
        container.addEventListener("mouseleave", handleMouseLeave);
        container.addEventListener("touchend", handleMouseLeave);

        const blobMaterial = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position.xy, 0.0, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time, dTime, aspect, pointerDown, pointerRadius, pointerDuration;
            uniform vec2 pointer, virtualPointer1, virtualPointer2;
            uniform float virtualPointer1Down, virtualPointer2Down;
            uniform sampler2D prevFrame;
            varying vec2 vUv;

            float hash(vec2 p) { 
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
            }
            
            float noise(vec2 p) {
              vec2 i = floor(p); 
              vec2 f = fract(p); 
              f = f * f * (3.0 - 2.0 * f);
              float a = hash(i); 
              float b = hash(i + vec2(1.0, 0.0)); 
              float c = hash(i + vec2(0.0, 1.0)); 
              float d = hash(i + vec2(1.0, 1.0));
              return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            void main() {
              float rVal = texture2D(prevFrame, vUv).r;
              rVal -= clamp(dTime / pointerDuration, 0.0, 0.06); 
              rVal = clamp(rVal, 0.0, 1.0);
              
              vec2 uv = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
              float f = 0.0;
              
              if (pointerDown > 0.5) {
                vec2 mouse = pointer * vec2(aspect, 1.0);
                float dist = length(uv - mouse);
                float angle = atan(uv.y - mouse.y, uv.x - mouse.x);
                float noiseVal = noise(vec2(angle * 3.0 + time * 0.5, dist * 5.0));
                float organicRadius = pointerRadius * (0.7 + noiseVal * 0.5);
                float mF = 1.0 - smoothstep(organicRadius * 0.05, organicRadius * 1.2, dist);
                f = max(f, mF * (0.8 + noiseVal * 0.2));
              }

              if (virtualPointer1Down > 0.5) {
                  vec2 vMouse = virtualPointer1 * vec2(aspect, 1.0);
                  float dist = length(uv - vMouse);
                  float angle = atan(uv.y - vMouse.y, uv.x - vMouse.x);
                  float noiseVal = noise(vec2(angle * 3.0 - time * 0.3, dist * 5.0));
                  float organicRadius = (pointerRadius * 1.1) * (0.8 + noiseVal * 0.4);
                  float vF = 1.0 - smoothstep(organicRadius * 0.1, organicRadius * 1.5, dist);
                  f = max(f, vF * (0.7 + noiseVal * 0.2));
              }

              if (virtualPointer2Down > 0.5) {
                  vec2 vMouse = virtualPointer2 * vec2(aspect, 1.0);
                  float dist = length(uv - vMouse);
                  float angle = atan(uv.y - vMouse.y, uv.x - vMouse.x);
                  float noiseVal = noise(vec2(angle * 2.5 + time * 0.4, dist * 4.0));
                  float organicRadius = (pointerRadius * 1.1) * (0.8 + noiseVal * 0.4);
                  float vF = 1.0 - smoothstep(organicRadius * 0.1, organicRadius * 1.5, dist);
                  f = max(f, vF * (0.7 + noiseVal * 0.2));
              }
              
              rVal += f * 0.3;
              rVal = clamp(rVal, 0.0, 1.0);
              
              gl_FragColor = vec4(vec3(rVal), 1.0);
            }
          `,
        });
        this.rtScene = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blobMaterial);
        this.rtCamera = new THREE.Camera();

        this.cleanupListeners = () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("reset-blob", handleMouseLeave);
          container.removeEventListener("mouseleave", handleMouseLeave);
          container.removeEventListener("touchend", handleMouseLeave);
        };
      }

      render() {
        this.renderer.setRenderTarget(this.rtOutput);
        this.renderer.render(this.rtScene, this.rtCamera);
        this.renderer.setRenderTarget(null);
        const temp = this.prevRenderTarget;
        this.prevRenderTarget = this.rtOutput;
        this.rtOutput = temp;
        this.uniforms.prevFrame.value = this.prevRenderTarget.texture;
        this.uniforms.texBlob.value = this.rtOutput.texture;
      }
    }

    const blob = new Blob(renderer);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";
    let baseImage: THREE.Mesh;
    let helmetImage: THREE.Mesh;
    let bgPlane: THREE.Mesh;

    const baseTexture = textureLoader.load(baseImageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const img = texture.image;
      const targetWidth = Math.min(width * 0.9, maxImageWidth);
      const scale = targetWidth / img.width;
      const planeWidth = img.width * scale;
      const planeHeight = img.height * scale;

      if (renderMode === "all" || renderMode === "portraitsOnly") {
        baseImage.geometry.dispose();
        baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        baseImage.position.y = yOffset;
      }

      if (renderMode === "all" || renderMode === "portraitsOnly") {
        if (helmetImage) {
          helmetImage.geometry.dispose();
          helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
          helmetImage.position.y = yOffset;
        }
      }

      if (renderMode === "all" || renderMode === "bgOnly") {
        if (bgPlane) {
          bgPlane.geometry.dispose();
          bgPlane.geometry = new THREE.PlaneGeometry(width, height);
          bgPlane.position.y = 0;
        }
      }
    });

    const helmetTexture = textureLoader.load(revealImageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    if (renderMode === "all" || renderMode === "portraitsOnly") {
      const baseImageMaterial = new THREE.MeshBasicMaterial({
        map: baseTexture,
        transparent: true,
      });
      baseImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), baseImageMaterial);
      baseImage.position.z = 0;
      scene.add(baseImage);
    }

    if (renderMode === "all" || renderMode === "bgOnly") {
      const bgPlaneMaterial = new THREE.ShaderMaterial({
        uniforms: blob.uniforms,
        vertexShader: `
          varying vec2 vUv;
          varying vec4 vPosProj;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vPosProj = gl_Position;
          }
        `,
        fragmentShader: `
          uniform sampler2D texBlob;
          uniform float time;
          uniform vec3 colorBg;
          uniform vec3 colorSoftShape;
          uniform vec3 colorLine;
          varying vec2 vUv;
          varying vec4 vPosProj;

          float hash(vec2 p) { 
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
          }
          
          float noise(vec2 p) {
            vec2 i = floor(p); 
            vec2 f = fract(p); 
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i); 
            float b = hash(i + vec2(1.0, 0.0)); 
            float c = hash(i + vec2(0.0, 1.0)); 
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }
          
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
              value += amplitude * noise(p);
              p *= 2.1;
              amplitude *= 0.3;
            }
            return value;
          }

          void main() {
            vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
            vec4 blobData = texture2D(texBlob, blobUV);
            
            if (blobData.r < 0.02) discard;

            vec2 uv = vUv * 3.5;
            vec2 distortionField = vUv * 2.0;
            float distortion = fbm(distortionField + time * 0.2);
            float distortionStrength = 0.7;
            vec2 warpedUv = uv + (distortion - 0.5) * distortionStrength;
            float n = fbm(warpedUv);

            float softShapeMix = smoothstep(0.1, 0.9, sin(n * 3.0));
            vec3 baseColor = mix(colorBg, colorSoftShape, softShapeMix);
            float linePattern = fract(n * 15.0);
            float lineMix = 1.0 - smoothstep(0.49, 0.51, linePattern);
            vec3 finalColor = mix(baseColor, colorLine, lineMix);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        transparent: true,
      });
      bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), bgPlaneMaterial);
      bgPlane.position.z = 0.05;
      scene.add(bgPlane);
    }

    if (renderMode === "all" || renderMode === "portraitsOnly") {
      const helmetImageMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texBlob: blob.uniforms.texBlob,
          map: { value: helmetTexture },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec4 vPosProj;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vPosProj = gl_Position;
          }
        `,
        fragmentShader: `
          uniform sampler2D texBlob;
          uniform sampler2D map;
          varying vec2 vUv;
          varying vec4 vPosProj;

          void main() {
            vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
            vec4 blobData = texture2D(texBlob, blobUV);
            
            if (blobData.r < 0.02) discard;

            vec4 texColor = texture2D(map, vUv);
            gl_FragColor = texColor;
          }
        `,
        transparent: true,
      });
      helmetImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), helmetImageMaterial);
      helmetImage.position.z = 0.1;
      scene.add(helmetImage);
    }

    const clock = new THREE.Clock();
    let animationId: number;
    const animate = () => {
      const dt = clock.getDelta();
      gu.time.value += dt;
      gu.dTime.value = dt;

      // Dynamic theme color update
      if (blob.uniforms.colorBg) {
        blob.uniforms.colorBg.value.set(...parseVec3(colorBgVec3));
        blob.uniforms.colorSoftShape.value.set(...parseVec3(colorSoftShapeVec3));
        blob.uniforms.colorLine.value.set(...parseVec3(colorLineVec3));
      }

      blob.updateAutoRipples(dt);
      blob.render();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      gu.aspect.value = newWidth / newHeight;
      if (baseTexture.image) {
        const img = baseTexture.image;
        const targetWidth = Math.min(newWidth * 0.9, maxImageWidth);
        const scale = targetWidth / img.width;
        const planeWidth = img.width * scale;
        const planeHeight = img.height * scale;

        if (renderMode === "all" || renderMode === "portraitsOnly") {
          baseImage.geometry.dispose();
          baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
          baseImage.position.y = yOffset;
        }

        if (renderMode === "all" || renderMode === "portraitsOnly") {
          if (helmetImage) {
            helmetImage.geometry.dispose();
            helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
            helmetImage.position.y = yOffset;
          }
        }

        if (renderMode === "all" || renderMode === "bgOnly") {
          if (bgPlane) {
            bgPlane.geometry.dispose();
            bgPlane.geometry = new THREE.PlaneGeometry(newWidth, newHeight);
            bgPlane.position.y = 0;
          }
        }
      }
    };
    window.addEventListener("resize", handleResize);

    cleanupRef.current = () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      blob.cleanupListeners();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      baseTexture.dispose();
      helmetTexture.dispose();
      blob.rtOutput.dispose();
      blob.prevRenderTarget.dispose();
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [
    baseImageUrl,
    revealImageUrl,
    backgroundColor,
    blobRadius,
    blobFadeSpeed,
    colorBgVec3,
    colorSoftShapeVec3,
    colorLineVec3,
    maxImageWidth,
    yOffset,
    renderMode,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minWidth: 250,
        minHeight: 250,
        backgroundColor:
          backgroundColor !== "transparent" && renderMode !== "portraitsOnly"
            ? backgroundColor
            : "transparent",
        cursor: "default",
        overflow: "hidden",
        touchAction: "none",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor:
            backgroundColor !== "transparent" && renderMode !== "portraitsOnly"
              ? backgroundColor
              : "transparent",
          opacity: isReady ? 0 : 1,
          transition: `opacity ${fadeInDuration}s ease-out`,
          pointerEvents: isReady ? "none" : "auto",
          zIndex: 10,
        }}
      />
    </div>
  );
}
