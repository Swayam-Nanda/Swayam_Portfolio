import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Code2,
  Sparkles,
  Layout,
  Server,
  Plug,
  Atom,
  Database,
  Flame,
  Terminal,
  GitBranch,
  Cpu,
  Globe,
  Zap,
  Box,
  Layers,
  Search,
  GraduationCap,
  X,
} from "lucide-react";
import { Section } from "./Section";

const services = [
  {
    icon: Code2,
    title: "Full Stack Development",
    desc: "End-to-end product engineering, from schema to pixel.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Sparkles,
    title: "AI Integrations",
    desc: "LLMs, RAG, agents — embedded into real products.",
  },
  {
    icon: Layout,
    title: "UI/UX Engineering",
    desc: "Design-led interfaces, polished to the frame.",
  },
  { icon: Server, title: "Backend Systems", desc: "Resilient APIs, queues, and data layers." },
  { icon: Plug, title: "API Development", desc: "Clean contracts, typed, documented, fast." },
];

const techStack1 = [
  { name: "React", icon: Atom },
  { name: "TypeScript", icon: Code2 },
  { name: "Tailwind CSS", icon: Layout },
  { name: "HTML", icon: Layout },
  { name: "CSS", icon: Layout },
  { name: "JavaScript", icon: Code2 },
  { name: "Vite", icon: Zap },
  { name: "Vercel", icon: Layers },
  { name: "GitHub", icon: GitBranch },
  { name: "Supabase", icon: Database },
];

const techStack2 = [
  { name: "PostgreSQL", icon: Database },
  { name: "Firebase", icon: Flame },
  { name: "Flask", icon: Terminal },
  { name: "Django", icon: Server },
  { name: "Python", icon: Terminal },
  { name: "REST", icon: Plug },
  { name: "Render", icon: Globe },
  { name: "Ollama", icon: Sparkles },
  { name: "IoT", icon: Cpu },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

function SlotMachineTitle({ text, isInView }: { text: string; isInView: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInView) {
      setDisplayText(text);
      return;
    }

    let currentIteration = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (currentIteration > index + 2) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      currentIteration += 1 / 2;

      if (currentIteration >= text.length + 5) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView, text]);

  return (
    <h3 className="font-display text-xl font-semibold tracking-tight min-h-[1.75rem]">
      {displayText}
    </h3>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  selectedTechs = [],
  onTechSelect,
}: {
  items: any[];
  direction?: "left" | "right";
  selectedTechs?: string[];
  onTechSelect: (name: string) => void;
}) {
  return (
    <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: 50, // Slower constant speed
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-4 pr-4 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => {
          const isSelected = selectedTechs.includes(item.name);
          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTechSelect(item.name)}
              className={`flex items-center gap-2 rounded-2xl border px-6 py-4 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 text-muted-foreground"
              }`}
            >
              <item.icon
                className={`size-5 ${isSelected ? "text-primary-foreground" : "text-primary/60"}`}
              />
              <span
                className={`font-mono text-sm font-medium tracking-tight ${isSelected ? "text-primary-foreground" : ""}`}
              >
                {item.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Sparkles,
  Layout,
  Server,
  Plug,
  Atom,
  Database,
  Flame,
  Terminal,
  GitBranch,
  Cpu,
  Globe,
  Zap,
  Box,
  Layers,
  GraduationCap,
};

export function Services({
  data,
  techStackRaw,
  selectedTechs = [],
  onTechSelect,
}: {
  data?: any[];
  techStackRaw?: string;
  selectedTechs?: string[];
  onTechSelect?: (techs: string[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2, once: true });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const toggleTech = (name: string) => {
    if (!onTechSelect) return;
    if (selectedTechs.includes(name)) {
      onTechSelect(selectedTechs.filter((t) => t !== name));
    } else {
      onTechSelect([...selectedTechs, name]);
    }
  };

  const handleCheckProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const techArray = techStackRaw
    ? techStackRaw.split(",").map((t) => t.trim())
    : [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "HTML",
        "CSS",
        "JavaScript",
        "Vite",
        "Vercel",
        "GitHub",
        "Supabase",
        "PostgreSQL",
        "Firebase",
        "Flask",
        "Django",
        "Python",
        "REST",
        "Render",
        "Ollama",
        "IoT",
      ];

  const mid = Math.ceil(techArray.length / 2);
  const row1 = techArray.slice(0, mid).map((name) => ({ name, icon: iconMap[name] || Box }));
  const row2 = techArray.slice(mid).map((name) => ({ name, icon: iconMap[name] || Box }));

  const displayServices =
    data && data.length > 0
      ? data
      : [
          {
            icon: "Code2",
            title: "Full Stack Development",
            description:
              "Engineering robust end-to-end applications with React, Django, and a versatile, modern tech stack.",
            span: "md:col-span-2 md:row-span-1",
          },
          {
            icon: "Layout",
            title: "Creative Design & Visuals",
            description:
              "Professional poster design, presentations (PPT), and high-impact brand assets for a creative edge.",
          },
          {
            icon: "Sparkles",
            title: "AI Integrations",
            description: "LLMs, RAG, agents — embedded into real products.",
          },
          {
            icon: "Atom",
            title: "UI/UX Engineering",
            description: "Design-led interfaces, polished to the frame.",
          },
          {
            icon: "GraduationCap",
            title: "Academic & Strategic Consultancy",
            description:
              "Expert guidance on technical research, academic projects, and strategic problem solving.",
          },
          {
            icon: "GitBranch",
            title: "Collaborative Engineering",
            description:
              "Partnering on open-source projects, team builds, and innovative cross-functional ventures.",
          },
        ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Section
      id="services"
      eyebrow="02 — Capabilities"
      title={
        <>
          The full <span className="text-gradient-primary italic">stack</span>, in one mind.
        </>
      }
      intro="A modular toolkit across the modern web — pick the pieces that ship your product."
    >
      <div className="space-y-12 px-4 md:px-0">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[180px]"
          style={{ perspective: "2000px" }}
        >
          {displayServices.map((s, i) => {
            const Icon = iconMap[s.icon] || Code2;
            return (
              <motion.div
                key={s.title}
                initial={{
                  opacity: 0,
                  rotateX: -30,
                  y: 50,
                  z: -100,
                }}
                whileInView={{
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  z: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
                style={{
                  transformStyle: "preserve-3d",
                  // @ts-ignore
                  "--mx": `${mousePos.x}px`,
                  // @ts-ignore
                  "--my": `${mousePos.y}px`,
                }}
                className={`glass group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${s.span ?? ""}`}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--primary) 20%, transparent), transparent 70%)",
                  }}
                />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <Icon className="size-7 text-primary transition-transform duration-500 group-hover:scale-110" />
                    <div className="size-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  </div>

                  <div>
                    <SlotMachineTitle text={s.title} isInView={isInView} />
                    <p
                      className={`mt-2 font-mono text-muted-foreground leading-relaxed ${s.title.includes("Collaborative") || s.title.includes("Academic") ? "text-[12px]" : "text-sm"}`}
                    >
                      {s.description}
                    </p>
                  </div>
                </div>

                {/* Subtle gloss effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>

        {/* Tech Stack Marquees */}
        <div className="relative space-y-4 pt-8">
          <MarqueeRow
            items={row1}
            direction="left"
            selectedTechs={selectedTechs}
            onTechSelect={toggleTech}
          />
          <MarqueeRow
            items={row2}
            direction="right"
            selectedTechs={selectedTechs}
            onTechSelect={toggleTech}
          />

          {/* Check Projects Floating Button */}
          <AnimatePresence>
            {selectedTechs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-16 z-50"
              >
                <div className="flex items-center rounded-full bg-primary shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
                  <button
                    onClick={handleCheckProjects}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-display font-semibold text-primary-foreground hover:bg-black/10 transition-colors whitespace-nowrap border-r border-primary-foreground/20"
                  >
                    <Search className="size-4" />
                    Check projects with {selectedTechs.length} stack
                    {selectedTechs.length > 1 ? "s" : ""}
                  </button>
                  <button
                    onClick={() => onTechSelect?.([])}
                    className="p-3 text-primary-foreground hover:bg-black/10 transition-colors"
                    title="Clear selection"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative divider line */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>
    </Section>
  );
}
