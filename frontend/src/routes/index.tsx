import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { QuoteDivider } from "@/components/QuoteDivider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { api } from "@/lib/api-client";
import { SideRays } from "@/components/ui/SideRays";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  loader: () => {
    return {
      hero: null,
      about: null,
      services: [],
      projects: [],
      experience: [],
      testimonials: [],
      avatars: [],
    };
  },
  head: () => ({
    meta: [
      { title: "Swayam — Full Stack Developer & Creative Engineer" },
      {
        name: "description",
        content:
          "Cinematic portfolio of Swayam — a full-stack engineer crafting AI-native interfaces, premium SaaS, and award-worthy web experiences.",
      },
      { property: "og:title", content: "Swayam — Full Stack Developer & Creative Engineer" },
      {
        property: "og:description",
        content: "Cinematic portfolio: AI, web, and product engineering.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const initialData = Route.useLoaderData();
  const [data, setData] = useState(initialData);
  const [filterTechs, setFilterTechs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hero, about, services, projects, experience, testimonials, avatars] = await Promise.all([
          api.getHero().catch(() => null),
          api.getAbout().catch(() => null),
          api.getServices().catch(() => []),
          api.getProjects().catch(() => []),
          api.getExperience().catch(() => []),
          api.getTestimonials().catch(() => []),
          api.getAvatars().catch(() => []),
        ]);
        setData({ hero, about, services, projects, experience, testimonials, avatars });
      } catch (err) {
        console.error("Failed to load runtime data:", err);
      }
    };
    loadData();
  }, []);

  const { hero, about, services, projects, experience, testimonials, avatars } = data;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />

      {/* Cinematic Side Rays - Mirrored Dual Perimeter Orbit */}
      <RaysBackground />

      <main className="relative z-[2]">
        {/* Hero Section */}
        <section className="relative z-20">
          <Hero data={hero} />
        </section>

        <QuoteDivider text="Every line of code has a story. Here's mine." />

        <ParallaxSection>
          <About data={about} />
        </ParallaxSection>

        <QuoteDivider text="Passion becomes skill when practiced every day." />

        <ParallaxSection>
          <Services
            data={services}
            techStackRaw={about?.tech_stack}
            selectedTechs={filterTechs}
            onTechSelect={setFilterTechs}
          />
        </ParallaxSection>

        <QuoteDivider text="Great skills create great solutions." />

        <ParallaxSection>
          <Projects
            data={projects}
            activeFilter={filterTechs}
            onClearFilter={() => setFilterTechs([])}
          />
        </ParallaxSection>

        <QuoteDivider text="Great projects create great experiences." />

        {/* Restore Experience without ParallaxSection wrapper to fix sticky scroll */}
        <Experience data={experience} />

        <QuoteDivider text="Experiences build trust; trust earns recognition." />

        <ParallaxSection>
          <Testimonials data={testimonials} avatars={avatars} />
        </ParallaxSection>

        <QuoteDivider text="Every collaboration starts with a conversation." />

        <ParallaxSection>
          <Contact />
        </ParallaxSection>
      </main>
      <Footer />
    </div>
  );
}

function ParallaxSection({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.7]);

  if (isMobile) {
    return (
      <div className="relative z-10">
        {children}
      </div>
    );
  }

  return (
    <motion.section ref={ref} style={{ y, opacity }} className="relative z-10">
      {children}
    </motion.section>
  );
}

function RaysBackground() {
  const { scrollYProgress } = useScroll();
  const { themeColors } = useTheme();
  const isMobile = useIsMobile();

  // Perimeter revolving logic: Travels along the edges clockwise
  const rayX = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1.2, 1.2, -0.2, -0.2, 1.2]);
  const rayY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-0.2, 1.2, 1.2, -0.2, -0.2]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, -720]);

  // Ray 2: Mirrored Path
  const rayX2 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [-0.2, -0.2, 1.2, 1.2, -0.2]);
  const rayY2 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1.2, -0.2, -0.2, 1.2, 1.2]);
  const rotation2 = useTransform(scrollYProgress, [0, 1], [180, -540]);

  const [tilt, setTilt] = useState(0);
  const [pos, setPos] = useState({ x: 1.2, y: -0.2 });

  const [tilt2, setTilt2] = useState(180);
  const [pos2, setPos2] = useState({ x: -0.2, y: 1.2 });

  useEffect(() => {
    const unsubRot = rotation.on("change", (v) => setTilt(v));
    const unsubX = rayX.on("change", (v) => setPos((prev) => ({ ...prev, x: v })));
    const unsubY = rayY.on("change", (v) => setPos((prev) => ({ ...prev, y: v })));

    const unsubRot2 = rotation2.on("change", (v) => setTilt2(v));
    const unsubX2 = rayX2.on("change", (v) => setPos2((prev) => ({ ...prev, x: v })));
    const unsubY2 = rayY2.on("change", (v) => setPos2((prev) => ({ ...prev, y: v })));

    return () => {
      unsubRot();
      unsubX();
      unsubY();
      unsubRot2();
      unsubX2();
      unsubY2();
    };
  }, [rotation, rayX, rayY, rotation2, rayX2, rayY2]);

  // Don't render expensive WebGL canvases on mobile — saves GPU and battery
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden opacity-60">
      <SideRays
        rayPos={pos}
        tilt={tilt}
        intensity={0.7}
        spread={8.0}
        speed={1.0}
        rayColor1={themeColors.light}
        rayColor2={themeColors.primary}
        falloff={1.0}
      />
      <SideRays
        rayPos={pos2}
        tilt={tilt2}
        intensity={0.7}
        spread={8.0}
        speed={1.0}
        rayColor1={themeColors.light}
        rayColor2={themeColors.primary}
        falloff={1.0}
      />
    </div>
  );
}
