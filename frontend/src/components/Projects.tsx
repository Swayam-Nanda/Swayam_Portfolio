import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "./Section";
import { useIsMobile } from "@/hooks/use-mobile";
import { MEDIA_BASE_URL } from "@/lib/api-client";

// --- Project Data ---
const projects = [
  {
    title: "Nebula AI Studio",
    tag: "AI · SaaS",
    desc: "Multi-agent workspace with realtime streams and embeddings.",
    stack: ["Next.js", "tRPC", "OpenAI", "Postgres"],
    video: "/videos/nebula.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    hue: 240,
  },
  {
    title: "Helix Commerce",
    tag: "Commerce",
    desc: "Headless storefront with edge rendering and live inventory.",
    stack: ["Remix", "Stripe", "Edge"],
    video: "/videos/helix.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    hue: 160,
  },
  {
    title: "Orbit Analytics",
    tag: "Dashboard",
    desc: "Realtime analytics engine for product teams.",
    stack: ["React", "ClickHouse", "WS"],
    video: "/videos/orbit.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bbbda50a137.jpg?auto=format&fit=crop&q=80&w=800",
    hue: 295,
  },
  {
    title: "Pulse Health",
    tag: "Mobile",
    desc: "Continuous wellness signals from wearable streams.",
    stack: ["RN", "Swift", "BLE"],
    video: "/videos/pulse.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    hue: 25,
  },
  {
    title: "Atlas Maps",
    tag: "Geo",
    desc: "Vector-tile rendering for cinematic storytelling.",
    stack: ["WebGL", "MapLibre"],
    video: "/videos/atlas.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800",
    hue: 85,
  },
  {
    title: "Codex IDE",
    tag: "Tools",
    desc: "Collaborative code surface with AI pair programming.",
    stack: ["TS", "CRDT", "LSP"],
    video: "/videos/codex.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    hue: 200,
  },
];

// --- Physics-based Stack Pills ---
function TechPill({ name, isHovered }: { name: string; isHovered: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (isHovered) {
      // Scatter randomly
      x.set((Math.random() - 0.5) * 60);
      y.set((Math.random() - 0.5) * 60);

      // Snap back after a delay
      const timeout = setTimeout(() => {
        x.set(0);
        y.set(0);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [isHovered, x, y]);

  return (
    <motion.span
      style={{ x: springX, y: springY }}
      className="rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/80 backdrop-blur-md"
    >
      {name}
    </motion.span>
  );
}

// --- Project Card Component ---
function ProjectCard({
  project,
  onHoverChange,
}: {
  project: any;
  onHoverChange: (hovered: boolean) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Tilt and Blur based on position
  const [distanceFromCenter, setDistanceFromCenter] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const center = window.innerWidth / 2;
      const cardCenter = rect.left + rect.width / 2;
      setDistanceFromCenter((cardCenter - center) / center);
    };

    const interval = setInterval(updatePosition, 50);
    return () => clearInterval(interval);
  }, []);

  const isMobile = useIsMobile();
  const rotateY = isMobile ? 0 : (isHovered ? 0 : distanceFromCenter * -15);
  const blur = isMobile ? 0 : (isHovered ? 0 : Math.min(Math.abs(distanceFromCenter) * 4, 3));
  const scale = isMobile ? 1 : (isHovered ? 1.05 : 1 - Math.abs(distanceFromCenter) * 0.1);

  const handleHover = (state: boolean) => {
    setIsHovered(state);
    onHoverChange(state);
  };

  const stack = project.tech_stack
    ? project.tech_stack.split(",").map((s: string) => s.trim())
    : [];
  const thumbnail = project.image
    ? project.image.startsWith("http")
      ? project.image
      : `${MEDIA_BASE_URL}${project.image}`
    : "";

  // Card size mapping
  const sizeClasses = {
    small: "w-[75vw] md:w-[400px] h-[350px] md:h-[450px]",
    medium: "w-[85vw] md:w-[500px] h-[400px] md:h-[500px]",
    big: "w-[95vw] md:w-[650px] h-[450px] md:h-[550px]",
  };
  const cardSizeClass =
    sizeClasses[project.card_type as keyof typeof sizeClasses] || sizeClasses.medium;

  return (
    <motion.article
      ref={cardRef}
      animate={{
        rotateY,
        scale,
        filter: `blur(${blur}px)`,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        perspective: "1000px",
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className={`relative shrink-0 ${cardSizeClass} rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/60 backdrop-blur-md group transition-colors duration-500 hover:border-primary/40 z-10 hover:z-20`}
    >
      {/* Thumbnail Layer */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ opacity: 1 }}
          animate={{
            scale: isHovered ? 1.1 : 1.05,
            filter: isHovered ? "grayscale(0) brightness(0.7)" : "grayscale(0.5) brightness(0.5)",
          }}
          src={thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700"
        />
        {/* Dark Gradient Overlay for Text Visibility */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-500 ${isHovered ? "opacity-90" : "opacity-70"}`}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-10">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
            Project
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.github_link && project.github_link !== "null" && project.github_link.trim() !== "" && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20 transition-colors"
              >
                <Github className="size-4 text-white" />
              </a>
            )}
            {project.live_link && project.live_link !== "null" && project.live_link.trim() !== "" && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary p-3 backdrop-blur hover:scale-110 transition-transform shadow-lg shadow-primary/20"
              >
                <ArrowUpRight className="size-4 text-primary-foreground" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-display text-4xl font-bold tracking-tight text-white mb-3">
            {project.title}
          </h3>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm mb-6">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {stack.map((s: string) => (
              <TechPill key={s} name={s} isHovered={isHovered} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({
  data,
  activeFilter = [],
  onClearFilter,
}: {
  data?: any[];
  activeFilter?: string[];
  onClearFilter?: () => void;
}) {
  const isMobile = useIsMobile();
  const [direction, setDirection] = useState(1);
  const [isHolding, setIsHolding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollPos = useMotionValue(0);
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  const allProjects = data && data.length > 0 ? data : [];

  // Filtering logic
  const filteredProjects = useMemo(() => {
    if (activeFilter.length === 0) return allProjects;

    return allProjects.filter((project) => {
      const projectStack = project.tech_stack
        ? project.tech_stack.split(",").map((s: string) => s.trim().toLowerCase())
        : [];
      return activeFilter.every((f) => projectStack.includes(f.toLowerCase()));
    });
  }, [allProjects, activeFilter]);

  // Random selection logic when filter matches multiple
  useEffect(() => {
    if (filteredProjects.length > 1 && activeFilter.length > 0) {
      setRandomIndex(Math.floor(Math.random() * filteredProjects.length));
    } else {
      setRandomIndex(null);
    }
  }, [filteredProjects, activeFilter]);

  const displayProjects = randomIndex !== null ? [filteredProjects[randomIndex]] : filteredProjects;

  // Infinite horizontal loop logic
  useEffect(() => {
    let animationFrame: number;
    const update = () => {
      if (!isPaused && displayProjects.length > 1) {
        const currentSpeed = isHolding ? 8 : 1;
        const delta = direction * currentSpeed;
        scrollPos.set(scrollPos.get() + delta);
      } else if (displayProjects.length <= 1) {
        scrollPos.set(0);
      }
      animationFrame = requestAnimationFrame(update);
    };
    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [direction, isHolding, isPaused, scrollPos, displayProjects.length]);

  const translateX = useTransform(scrollPos, (v) => {
    if (displayProjects.length <= 1) return "0px";
    // Estimate total width based on mix of sizes (average ~550px)
    const avgWidth = isMobile ? window.innerWidth * 0.85 + 32 : 550;
    const totalWidth = displayProjects.length * avgWidth;
    return `${(v % totalWidth) - totalWidth}px`;
  });

  // Handle speed boost on hold
  const handleArrowHold = (dir: number, state: boolean) => {
    setDirection(dir);
    setIsHolding(state);
  };

  if (allProjects.length === 0) return null;

  return (
    <Section
      id="projects"
      eyebrow="03 — Selected Work"
      title={
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <span>
            A few <span className="text-gradient-primary italic">things</span> I've shipped.
          </span>
          <AnimatePresence>
            {activeFilter.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={onClearFilter}
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-mono text-primary hover:bg-primary/20 transition-colors"
              >
                Clear Filter ({activeFilter.length})
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      }
      className="overflow-x-clip"
    >
      <div className="relative mt-8">
        {/* Cinematic Gallery Track */}
        <div
          className={`flex gap-8 overflow-visible py-12 px-[5vw] ${displayProjects.length <= 1 ? "justify-center" : ""}`}
        >
          {displayProjects.length === 0 ? (
            <div className="w-full py-20 text-center glass rounded-[2.5rem] border-dashed border-white/10">
              <p className="text-muted-foreground font-mono">
                No projects found with this tech stack.
              </p>
              <button onClick={onClearFilter} className="mt-4 text-primary text-sm hover:underline">
                View all projects
              </button>
            </div>
          ) : (
            <motion.div
              className="flex gap-8"
              style={{
                x: translateX,
              }}
            >
              {(displayProjects.length > 1
                ? [...displayProjects, ...displayProjects, ...displayProjects]
                : displayProjects
              ).map((p, i) => (
                <ProjectCard key={`${p.title}-${i}`} project={p} onHoverChange={setIsPaused} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Ambient lighting */}
        <div className="absolute -inset-x-[20vw] top-1/2 -translate-y-1/2 h-[600px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

        {/* Navigation Controls - Only show if multiple projects OR if filtered */}
        {(displayProjects.length > 1 || activeFilter.length > 0) && (
          <div className="flex flex-col items-center gap-6 mt-8">
            {activeFilter.length > 0 && (
              <button
                onClick={onClearFilter}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-display font-medium text-white transition-all hover:bg-white/10 hover:border-primary/30"
              >
                View all projects
                <ChevronRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </button>
            )}

            {displayProjects.length > 1 && (
              <div className="flex gap-4">
                <button
                  onMouseDown={() => handleArrowHold(-1, true)}
                  onMouseUp={() => handleArrowHold(-1, false)}
                  onMouseLeave={() => handleArrowHold(-1, false)}
                  onClick={() => setDirection(-1)}
                  className="p-4 rounded-full border border-white/10 hover:border-primary/50 transition-colors group bg-background/50 backdrop-blur-xl"
                >
                  <ChevronLeft className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <button
                  onMouseDown={() => handleArrowHold(1, true)}
                  onMouseUp={() => handleArrowHold(1, false)}
                  onMouseLeave={() => handleArrowHold(1, false)}
                  onClick={() => setDirection(1)}
                  className="p-4 rounded-full border border-white/10 hover:border-primary/50 transition-colors group bg-background/50 backdrop-blur-xl"
                >
                  <ChevronRight className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
