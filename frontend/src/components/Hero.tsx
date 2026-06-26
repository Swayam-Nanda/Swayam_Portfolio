import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import LorenzoInteractivePortrait from "./landonorris";

import { MEDIA_BASE_URL, api } from "@/lib/api-client";
import { useTheme } from "@/lib/ThemeContext";

import { useIsMobile } from "@/hooks/use-mobile";
import { LOCAL_PORTRAIT_FALLBACKS, portraitAltFallback } from "@/lib/portraits";

const IMG_CONFIG = (isMobile: boolean) => ({
  width: isMobile ? "92vw" : "min(88vw, 520px)",
  height: "75vh",
  maxHeight: "800px",
  offsetX: "0px",
  offsetY: "0px",
  zIndex: 10,
});

// --- SWAYAM TEXT CONTROL VARIABLES ---
const TEXT_CONFIG = (isMobile: boolean) => ({
  fontSize: isMobile ? "clamp(4rem, 25vw, 15rem)" : "clamp(6rem, 35vw, 45rem)",
  heightScale: 1.15,
  widthScale: 0.9,
  fontWeight: "300", // Font weight (boldness)
  letterSpacing: "-0.04em",
  lineHeight: "0.8",

  // Positioning
  leftOffset: isMobile ? "0" : "-4vw",
  topOffset: isMobile ? "45%" : "32%", // Vertical starting position
  yOffset: "-45%", // Centering adjustment

  // Visual Effects
  opacity: 1, // Base transparency
  shadowBlur: "40px", // Glow size
  shadowOpacity: "20%", // Glow intensity
  zIndex: 2, // Layer depth
});
// -------------------------------------

export function Hero({ data }: { data?: any }) {
  const isMobile = useIsMobile();
  const currentImgConfig = IMG_CONFIG(isMobile);
  const currentTextConfig = TEXT_CONFIG(isMobile);
  const { activeTheme } = useTheme();

  const ref = useRef<HTMLDivElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);
  // { blue: 'https://...', gold: 'https://...', ... } fetched from Supabase
  const [themePortraits, setThemePortraits] = useState<Record<string, string>>({});

  const roles = data?.tagline?.split(",").map((r: string) => r.trim()) || [
    "Full Stack Developer",
    "AI Builder",
    "Creative Engineer",
    "CS Student",
    "Problem Solver",
  ];

  // Fetch per-theme portraits from Supabase on mount
  useEffect(() => {
    api.getHeroPortraits()
      .then((portraits) => setThemePortraits(portraits))
      .catch(() => {}); // fail silently, fallback handles it
  }, []);

  // The base portrait (top layer) changes with theme:
  // 1. Try Supabase-stored image for the active theme
  // 2. Fall back to legacy data.image
  // 3. Fall back to local bundled asset
  const resolveUrl = (url: string) =>
    url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;

  const portrait: string = (() => {
    const supabaseUrl = themePortraits[activeTheme];
    if (supabaseUrl) return resolveUrl(supabaseUrl);
    if (data?.image) return resolveUrl(data.image);
    return LOCAL_PORTRAIT_FALLBACKS[activeTheme] ?? LOCAL_PORTRAIT_FALLBACKS.blue;
  })();

  // The reveal/alt image is always the same regardless of theme
  const portraitAlt: string = (() => {
    if (data?.reveal_image) return resolveUrl(data.reveal_image);
    return portraitAltFallback;
  })();

  // High-performance spring tracking for the reveal center
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springConfig = { damping: 40, stiffness: 160, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Transform values for the text transition
  const typoY = useTransform(scrollYProgress, [0, 0.4], [0, 50]);
  const typoScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.8]);
  const typoOpacity = useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0]);

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Smoothed 3D tilt — disabled on mobile (touch devices have no mouse)
  const tiltX = useTransform(smoothY, [0, 100], isMobile ? [0, 0] : [4, -4]);
  const tiltY = useTransform(smoothX, [0, 100], isMobile ? [0, 0] : [-4, 4]);

  // Dynamic Theme Integration for Reveal Colors
  const [themeColor, setThemeColor] = useState("#5eb8ff");

  useEffect(() => {
    const updateThemeColor = () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") || "blue";
      const themes = [
        { id: "blue", color: "#5eb8ff" },
        { id: "gold", color: "#f4c46b" },
        { id: "white", color: "#f5f5f5" },
        { id: "crimson", color: "#ff5a5a" },
        { id: "emerald", color: "#5ee3a8" },
        { id: "purple", color: "#b07bff" },
      ];
      const match = themes.find((t) => t.id === activeTheme);
      if (match) setThemeColor(match.color);
    };

    updateThemeColor();
    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const hexToVec3 = (hex: string, intensity = 1.0) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return `${(r * intensity).toFixed(3)}, ${(g * intensity).toFixed(3)}, ${(b * intensity).toFixed(3)}`;
  };

  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [roles.length]);

  const onMove = (e: React.MouseEvent) => {
    const rect = imgWrap.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 grid-lines opacity-20" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Edge Shadow Overlays */}
      <div className="absolute inset-0 edge-shadow-overlay" />

      {/* Top Eyebrow Text & Roles */}
      <div className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 z-40 w-full text-center flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display font-black text-[10px] md:text-sm uppercase tracking-[0.5em] md:tracking-[0.8em] text-primary"
        >
          {data?.eyebrow_text || "MEET NANDA JI KA BETA"}
        </motion.p>

        {/* Dynamic Roles */}
        <div className="h-6 mt-2 md:mt-4 overflow-hidden px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="font-mono text-[8px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] text-muted-foreground/60"
            >
              {roles[roleIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Content: Left (Know More) */}
      <div className="absolute left-6 bottom-24 md:left-10 md:bottom-12 z-40">
        <motion.a
          href="#about"
          className="group flex items-center gap-3 md:gap-4"
          whileHover={{ x: 10 }}
        >
          <div className="size-10 md:size-14 rounded-full glass border-white/10 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-elegant">
            <ArrowRight className="size-4 md:size-6 rotate-90" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-lg md:text-xl uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
              Know more
            </span>
            <span className="font-display font-black text-[9px] md:text-xs uppercase tracking-widest text-muted-foreground/60 mt-0.5 md:mt-1">
              about me
            </span>
          </div>
        </motion.a>
      </div>

      {/* Bottom Content: Center (Socials) */}
      <div className="absolute left-1/2 bottom-8 md:bottom-12 -translate-x-1/2 z-40 hidden sm:block">
        <div className="flex items-center gap-4 md:gap-8">
          {[
            {
              icon: <Github className="size-5" />,
              href: data?.github || "https://github.com",
              label: "GitHub",
            },
            {
              icon: <Linkedin className="size-5" />,
              href: data?.linkedin || "https://linkedin.com",
              label: "LinkedIn",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="size-4.5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
              href: data?.twitter || "https://x.com",
              label: "X",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="size-5 fill-current">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.374 0 0 0 0 1.942l9.77 9.77c.26.26.609.404.961.404.352 0 .701-.144.961-.404l2.777-2.77a1.374 1.374 0 0 0 0-1.942l-9.77-9.77a1.375 1.374 0 0 0 0-1.942l9.77-9.77A1.374 1.374 0 0 0 13.483 0zM13.483 1.942l8.8 8.8-8.8 8.8-1.816-1.815 6.984-6.985-6.984-6.984zM6.984 10.742l1.815 1.815-1.815 1.815-1.815-1.815z" />
                </svg>
              ),
              href: data?.leetcode || "https://leetcode.com",
              label: "LeetCode",
              hoverColor: "#FFA116",
            },
          ].map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="size-12 rounded-xl glass border border-white/5 flex items-center justify-center text-muted-foreground transition-all relative group shadow-elegant"
              whileHover={{
                scale: 1.2,
                y: -8,
                rotate: 8,
                color: (s as any).hoverColor || "var(--primary)",
              }}
            >
              {s.icon}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-[8px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
                {s.label}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom Content: Right (Dynamic Actions) */}
      <div className="absolute right-6 bottom-8 md:right-10 md:bottom-12 z-40">
        <motion.a
          href="#contact"
          className="group flex items-center gap-3 md:gap-4 text-right"
          whileHover={{ x: -10 }}
        >
          <div className="flex flex-col leading-none order-1">
            <span className="font-display font-black text-lg md:text-xl uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
              Start a project
            </span>
            <span className="font-display font-black text-[9px] md:text-xs uppercase tracking-widest text-muted-foreground/60 mt-0.5 md:mt-1">
              Get in touch
            </span>
          </div>
          <div className="size-10 md:size-14 rounded-full glass border-white/10 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-elegant order-2">
            <ArrowRight className="size-4 md:size-6 rotate-90" />
          </div>
        </motion.a>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <motion.div
            ref={imgWrap}
            style={{
              rotateX: isMobile ? 0 : tiltX,
              rotateY: isMobile ? 0 : tiltY,
              scale: isMobile ? 1 : imgScale,
              y: isMobile ? 0 : imgY,
              position: "absolute",
              inset: 0,
              zIndex: currentImgConfig.zIndex,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={isMobile ? undefined : onMove}
            onMouseLeave={isMobile ? undefined : () => window.dispatchEvent(new Event("reset-blob"))}
            className={isMobile ? undefined : "cursor-none"}
          >
            {/* LAYER 1: REVEAL BG ONLY (Bottom) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                transform: "translateZ(-10px)",
                pointerEvents: "none",
              }}
            >
              <LorenzoInteractivePortrait
                baseImageUrl={portrait}
                revealImageUrl={portraitAlt}
                backgroundColor="transparent"
                blobRadius={0.14}
                blobFadeSpeed={1.8}
                fadeInDelay={0.4}
                fadeInDuration={1.2}
                colorBgVec3={hexToVec3(themeColor, 0.05)}
                colorSoftShapeVec3={hexToVec3(themeColor, 0.2)}
                colorLineVec3={hexToVec3(themeColor, 0.5)}
                maxImageWidth={520}
                yOffset={-30}
                renderMode="bgOnly"
              />
            </div>

            {/* LAYER 2: SWAYAM TEXT (Middle) */}
            <motion.div
              style={{
                y: isMobile ? 0 : typoY,
                opacity: isMobile ? 1 : typoOpacity,
                scale: isMobile ? 1 : typoScale,
                zIndex: currentTextConfig.zIndex,
                transform: `translateZ(0px) translateY(${currentTextConfig.yOffset})`,
                left: currentTextConfig.leftOffset,
                top: currentTextConfig.topOffset,
              }}
              className="pointer-events-none absolute select-none text-left w-full"
            >
              <motion.h1
                layoutId="brand-text"
                className="uppercase"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  lineHeight: currentTextConfig.lineHeight,
                  fontWeight: currentTextConfig.fontWeight,
                  // @ts-ignore - custom CSS variables
                  "--text-opacity": currentTextConfig.opacity,
                  "--text-shadow-blur": currentTextConfig.shadowBlur,
                  "--text-shadow-opacity": currentTextConfig.shadowOpacity,
                }}
              >
                <span
                  className="block text-grainy text-center md:text-left"
                  style={{
                    fontSize: currentTextConfig.fontSize,
                    transform: `scaleY(${currentTextConfig.heightScale}) scaleX(${currentTextConfig.widthScale})`,
                    letterSpacing: currentTextConfig.letterSpacing,
                    display: "inline-block",
                  }}
                >
                  {data?.name || "SWAYAM"}
                </span>
              </motion.h1>
            </motion.div>

            {/* LAYER 3: PORTRAITS ONLY (Top) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                transform: "translateZ(10px)",
                pointerEvents: "none",
              }}
            >
              <LorenzoInteractivePortrait
                baseImageUrl={portrait}
                revealImageUrl={portraitAlt}
                backgroundColor="transparent"
                blobRadius={0.14}
                blobFadeSpeed={1.8}
                fadeInDelay={0.4}
                fadeInDuration={1.2}
                colorBgVec3={hexToVec3(themeColor, 0.05)}
                colorSoftShapeVec3={hexToVec3(themeColor, 0.2)}
                colorLineVec3={hexToVec3(themeColor, 0.5)}
                maxImageWidth={520}
                yOffset={-30}
                renderMode="portraitsOnly"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
