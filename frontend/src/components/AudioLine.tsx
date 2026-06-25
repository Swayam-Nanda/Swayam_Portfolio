import React, { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh, Color } from "ogl";

const vertex = `
    attribute vec2 uv;
    attribute vec3 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

const fragment = `
    precision highp float;
    uniform vec3 uColor;
    uniform float uAmplitude;
    uniform float uAlpha;
    uniform float uHover;
    uniform float uTime;
    varying vec2 vUv;

    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float waveform(vec2 uv, float time, float ampl) {
        vec2 waveformUV = uv;
        waveformUV.y += sin(waveformUV.x * 6.0 + time * 4.0) * mix(0.07, 0.11, uHover) * ampl - 0.03;
        float thickness = mix(0.022, 0.034, uHover);
        float wave = smoothstep(thickness + smoothstep(0.6, 0.2, abs(uv.x-0.5)) * 0.06, 0.0, abs(waveformUV.y-0.5)) * mix(0.9, 1.0, uHover);
        return wave;
    }

    void main() {
        vec2 uv = vUv;
        vec3 color = uColor;
        vec3 rainbow = vec3(0.7, 0.8, 1.0);
        rainbow = rgb2hsv(rainbow);
        rainbow.x += sin(uv.x * 5.0 + uTime * 3.0) * 0.08;
        rainbow = hsv2rgb(rainbow);

        float alpha = 0.0;
        float t = uTime * 0.5;
        
        // Base line always visible
        alpha += waveform(uv, t, uAmplitude);
        
        // Additional layers only visible when playing
        if (uAmplitude > 0.1) {
            alpha += waveform(uv, t + sin(t * 2.0 + uv.x * 1.0) * 0.4, uAmplitude * 0.8);
            alpha += waveform(uv, t + cos(t * 2.0 + uv.x * 1.0) * 0.4, uAmplitude * 0.6);
        }
        
        alpha *= uAlpha;
        
        // Strong always-visible base line for contrast against dark/glass bg
        float baseLine = smoothstep(0.013, 0.0, abs(uv.y - 0.53)) * 0.92 * uAlpha;
        alpha = max(alpha, baseLine);

        // Subtle rainbow shift – keep mostly uColor so primary hue reads clearly
        color = mix(color, rainbow, 0.18 * smoothstep(0.0, 1.0, alpha));
        
        // Boost brightness so wave pops off the glass surface
        color = min(color * 1.35, vec3(1.0));
        
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
    }
`;

export function AudioLine({ hover = 0, amplitude = 1, alpha = 1 }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uColor: { value: new Color("#E0E0E0") },
        uAmplitude: { value: amplitude },
        uAlpha: { value: alpha },
        uHover: { value: hover },
        uTime: { value: 0 },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationId: number;
    const update = (time: number) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = time * 0.001;
      program.uniforms.uHover.value += (hover - program.uniforms.uHover.value) * 0.1;
      program.uniforms.uAmplitude.value += (amplitude - program.uniforms.uAmplitude.value) * 0.1;
      program.uniforms.uAlpha.value += (alpha - program.uniforms.uAlpha.value) * 0.1;
      renderer.render({ scene: mesh });
    };
    animationId = requestAnimationFrame(update);

    const resize = () => {
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      if (containerRef.current) containerRef.current.removeChild(gl.canvas);
    };
  }, [hover, amplitude, alpha]);

  return <div ref={containerRef} className="w-full h-full" />;
}
