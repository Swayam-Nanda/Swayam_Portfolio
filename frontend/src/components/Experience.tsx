import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useVelocity,
} from "framer-motion";

const items = [
  {
    year: "2023",
    title: "Open Source Contributor",
    place: "Various",
    desc: "Performance and DX patches across frontend tooling.",
    major: false,
  },
  {
    year: "2024",
    title: "B.Tech Computer Science",
    place: "University",
    desc: "Focus on systems, distributed computing, applied ML.",
    major: true,
  },
  {
    year: "2024",
    title: "AI Hackathon — 1st Place",
    place: "National",
    desc: "Built a voice-driven multi-agent ops assistant in 36 hours.",
    major: true,
  },
  {
    year: "2025",
    title: "SWE Intern",
    place: "Fintech Lab",
    desc: "Realtime trading dashboards and a low-latency analytics pipeline.",
    major: false,
  },
  {
    year: "2026",
    title: "Independent Engineering",
    place: "Selected Clients",
    desc: "Designing & shipping production interfaces for AI-native startups.",
    major: true,
  },
];

function ExperienceItem({ item, index }: { item: (typeof items)[0]; index: number }) {
  const isEven = index % 2 === 0;

  // Card size styling
  const sizeStyles = {
    small: { scale: 1, padding: "p-4 md:p-6", title: "text-base md:text-lg" },
    medium: { scale: 1.05, padding: "p-5 md:p-7", title: "text-lg md:text-xl" },
    big: { scale: 1.1, padding: "p-6 md:p-8", title: "text-xl md:text-2xl" },
  };

  const currentSize = sizeStyles[item.card_type as keyof typeof sizeStyles] || sizeStyles.small;
  const isMajor = item.card_type === "big" || item.card_type === "medium";

  return (
    <div className="relative flex flex-col items-center justify-center w-[85vw] md:w-[400px] shrink-0 h-full">
      <motion.div
        style={{ y: isEven ? "-60%" : "60%", scale: currentSize.scale }}
        className={`text-center glass-strong ${currentSize.padding} rounded-[1.5rem] md:rounded-[2rem] border-2 ${
          isMajor
            ? "border-primary/60 bg-primary/10 shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]"
            : "border-white/10 bg-white/[0.01]"
        } w-[92%] md:w-[88%] mx-auto relative z-10 transition-all duration-500`}
      >
        {isMajor && (
          <div className="absolute inset-0 rounded-[2rem] bg-primary/5 animate-pulse pointer-events-none" />
        )}
        <div
          className={`font-mono text-[9px] uppercase tracking-[0.4em] mb-2 opacity-80 ${isMajor ? "text-primary-glow font-bold" : "text-primary"}`}
        >
          {item.year}
        </div>
        <h3
          className={`font-display font-bold tracking-tight mb-2 ${isMajor ? `${currentSize.title} text-white underline decoration-primary/30 underline-offset-4` : "text-base md:text-lg text-white/90"}`}
        >
          {item.title}
        </h3>
        <div className="text-[9px] font-medium text-primary/60 mb-3 uppercase tracking-[0.2em] italic">
          {item.place}
        </div>
        <p
          className={`font-mono text-muted-foreground leading-relaxed ${isMajor ? "text-[11px] md:text-xs font-medium" : "text-[10px]"}`}
        >
          {item.desc}
        </p>
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-primary/40 to-transparent h-16 ${isEven ? "top-full" : "bottom-full rotate-180"}`}
        />
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={isMajor ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`rounded-full shadow-glow ${isMajor ? "size-4 bg-primary" : "size-2 bg-white/40 border border-white/10"}`}
        />
      </div>
    </div>
  );
}

function JourneyStar({ progress }: { progress: MotionValue<number> }) {
  const velocity = useVelocity(progress);
  const [isScrolling, setIsScrolling] = useState(false);

  // Angle for the tight orbit
  const angle = useTransform(progress, [0, 1], [0, Math.PI * 12]);
  const orbitY = useTransform(angle, (r: number) => Math.sin(r) * 25);
  const orbitScale = useTransform(angle, (r: number) => Math.cos(r) * 0.15 + 1.1);

  // Direction logic - Flipped to match requested direction
  const isForward = useTransform(velocity, (v) => v >= 0);
  const trailRotate = useTransform(isForward, (f) => (f ? 180 : 0));

  useEffect(() => {
    return velocity.on("change", (v) => {
      setIsScrolling(Math.abs(v) > 0.0001);
    });
  }, [velocity]);

  const trailOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-50">
      <motion.div
        style={{ y: orbitY, scale: orbitScale, opacity: trailOpacity }}
        className="relative flex items-center justify-center z-50"
      >
        {/* Core Star Head - Perfect Sharp Circle */}
        <div className="relative size-7 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary shadow-[0_0_30px_var(--primary)]" />
          <div className="absolute inset-1.5 rounded-full bg-white shadow-[0_0_15px_#fff] z-10" />

          {/* Multi-Circle Waving Trail - Symmetric Waving */}
          <motion.div
            style={{
              rotate: trailRotate,
            }}
            className="absolute left-[80%] h-0 flex items-center" // Trail anchored to the right side of head (relative to head)
          >
            {[...Array(10)].map((_, i) => {
              const size = 20 - i * 1.8;
              return (
                <motion.div
                  key={i}
                  style={{
                    height: `${size}px`,
                    width: `${size}px`,
                    marginLeft: `-${size * 0.25}px`, // Negative margin to bring circles closer (overlap)
                    opacity: 1 - i * 0.1,
                    background: "var(--primary)",
                    filter: `blur(${Math.max(1, i * 0.8)}px)`,
                    borderRadius: "50%",
                  }}
                  animate={
                    isScrolling
                      ? {
                          // SYMMETRIC WAVING: [-X, X, -X]
                          y: [-12, 12, -12],
                          scale: [1, 1.15, 1],
                        }
                      : { y: 0, scale: 1 }
                  }
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.04,
                    ease: "easeInOut",
                  }}
                />
              );
            })}

            {/* Ambient Tail Glow */}
            <div className="absolute left-0 w-48 h-8 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-2xl rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

import { useIsMobile } from "@/hooks/use-mobile";
import Lightfall from "./ui/lightfall";

export function Experience({ data }: { data?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 60, damping: 20 });
  
  const lightfallSpeed = useTransform(smoothVelocity, [-1, 0, 1], [4.0, 0.5, 4.0]);
  const [currentSpeed, setCurrentSpeed] = useState(0.5);

  useEffect(() => {
    return lightfallSpeed.on("change", (v) => setCurrentSpeed(v));
  }, [lightfallSpeed]);

  const cardWidth = isMobile
    ? typeof window !== "undefined"
      ? window.innerWidth * 0.85
      : 300
    : 400;

  const formatDate = (start: string, end?: string) => {
    const startDate = new Date(start);
    const startStr = startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!end) return startStr;
    const endDate = new Date(end);
    const endStr = endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `${startStr} — ${endStr}`;
  };

  const experienceItems = (data || [])
    .map((item) => ({
      year: formatDate(item.start_date, item.end_date),
      title: item.title,
      place: item.subtitle,
      desc: item.description,
      card_type: item.card_type,
      rawDate: new Date(item.start_date).getTime(),
    }))
    .sort((a, b) => a.rawDate - b.rawDate);

  const displayItems =
    experienceItems.length > 0
      ? experienceItems
      : [
          {
            year: "2023",
            title: "Open Source Contributor",
            place: "Various",
            desc: "Performance and DX patches across frontend tooling.",
            major: false,
          },
          {
            year: "2024",
            title: "B.Tech Computer Science",
            place: "University",
            desc: "Focus on systems, distributed computing, applied ML.",
            major: true,
          },
          {
            year: "2024",
            title: "AI Hackathon — 1st Place",
            place: "National",
            desc: "Built a voice-driven multi-agent ops assistant in 36 hours.",
            major: true,
          },
          {
            year: "2025",
            title: "SWE Intern",
            place: "Fintech Lab",
            desc: "Realtime trading dashboards and a low-latency analytics pipeline.",
            major: false,
          },
          {
            year: "2026",
            title: "Independent Engineering",
            place: "Selected Clients",
            desc: "Designing & shipping production interfaces for AI-native startups.",
            major: true,
          },
        ];

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    ["0px", `-${(displayItems.length - 1) * cardWidth}px`],
  );

  return (
    <div id="experience" className="relative w-full z-40">
      {/* Mobile view */}
      <div className="md:hidden">
        <section className="relative w-full py-16 px-6 bg-transparent z-40 isolate">
          <div className="max-w-xl mx-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary block mb-3 opacity-60">
              ／ 04 — Trajectory
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-gradient leading-tight mb-12">
              The <span className="text-gradient-primary italic">Journey</span>
            </h2>
            
            <div className="relative pl-6 border-l border-white/10 space-y-12">
              {displayItems.map((item, i) => {
                const isMajor = item.card_type === "big" || item.card_type === "medium";
                return (
                  <div key={item.title + i} className="relative">
                    {/* Glowing Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 flex items-center justify-center">
                      <div className={`rounded-full shadow-glow ${isMajor ? "size-3.5 bg-primary" : "size-2.5 bg-white/40 border border-white/10"}`} />
                    </div>
                    
                    {/* Card Content */}
                    <div className={`glass-strong p-6 rounded-[1.5rem] border ${
                      isMajor
                        ? "border-primary/40 bg-primary/5 shadow-[0_0_30px_rgba(56,189,248,0.15)]"
                        : "border-white/10 bg-white/[0.01]"
                    }`}>
                      <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary mb-2 opacity-80">
                        {item.year}
                      </div>
                      <h3 className="font-display font-bold tracking-tight text-white text-base mb-1">
                        {item.title}
                      </h3>
                      <div className="text-[9px] font-medium text-primary/60 mb-3 uppercase tracking-[0.2em] italic">
                        {item.place}
                      </div>
                      <p className="font-mono text-muted-foreground text-[10px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <section 
          ref={containerRef} 
          className="relative block w-full bg-transparent overflow-visible z-40 isolate"
          style={{ minHeight: "600vh" }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center z-10">
            <div className="absolute top-24 left-0 right-0 z-40 px-6 md:px-8 pointer-events-auto">
              <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary block mb-3 opacity-60">
                  ／ 04 — Trajectory
                </span>
                <h2 className="font-display text-3xl md:text-6xl font-bold tracking-tight text-gradient leading-tight">
                  The <span className="text-gradient-primary italic">Journey</span>
                </h2>
              </div>
            </div>

            <div className="relative w-full h-[70vh] mt-12 pointer-events-auto">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
              <JourneyStar progress={smoothProgress} />
              <div className="relative h-full flex items-center overflow-visible">
                <motion.div
                  style={{ x, left: "50%", marginLeft: `-${cardWidth / 2}px` }}
                  className="absolute top-0 bottom-0 flex items-center"
                >
                  {displayItems.map((item, i) => (
                    <ExperienceItem key={item.title + i} item={item} index={i} />
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-30 pointer-events-auto">
              <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
