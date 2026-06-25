import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AchievementsNav } from "./AchievementsNav";
import { ScrollDistortionWrapper } from "./ScrollDistortionWrapper";
import { Link } from "@tanstack/react-router";
import { Zap, Github, Linkedin, Mail, Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about", key: "about" },
  { label: "Services", href: "#services", key: "services" },
  { label: "Projects", href: "#projects", key: "projects" },
  { label: "Experience", href: "#experience", key: "experience" },
  { label: "Feedback", href: "#testimonials", key: "testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => setScrolled(latest > 50));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    ["hero", "about", "services", "projects", "experience", "testimonials", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const isContactActive = activeSection === "contact";

  const handleNavClick = (e: any, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(element, { offset: -60 });
      } else {
        const offset = 60;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setMobileMenuOpen(false);
  };

  const socials = [
    {
      icon: <Github className="size-4" />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="size-4" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "https://x.com",
      label: "X",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.374 0 0 0 0 1.942l9.77 9.77c.26.26.609.404.961.404.352 0 .701-.144.961-.404l2.777-2.77a1.374 1.374 0 0 0 0-1.942l-9.77-9.77a1.375 1.374 0 0 0 0-1.942l9.77-9.77A1.374 1.374 0 0 0 13.483 0zM13.483 1.942l8.8 8.8-8.8 8.8-1.816-1.815 6.984-6.985-6.984-6.984zM6.984 10.742l1.815 1.815-1.815 1.815-1.815-1.815z" />
        </svg>
      ),
      href: "https://leetcode.com",
      label: "LeetCode",
    },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
          scrolled || mobileMenuOpen
            ? "py-1.5"
            : "py-2.5"
        }`}
      >
        <ScrollDistortionWrapper>
          <nav className="w-full max-w-[1400px] px-4 md:px-8 flex items-center justify-between relative h-full">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="relative size-6 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                  <Zap className="size-3.5 text-primary fill-primary/20" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xs uppercase tracking-tighter text-gradient-primary">
                    SWAYAM
                  </span>
                  <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest leading-none">
                    NANDA
                  </span>
                </div>
              </Link>
              <div className="hidden xl:block h-6 w-px bg-white/10 mx-2" />
              <div className="hidden xl:flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all group"
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Centered Navigation Links - Desktop */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-1">
                {links.map((l) => {
                  const isActive = activeSection === l.key;
                  return (
                    <li key={l.key}>
                      <a
                        href={l.href}
                        onClick={(e) => handleNavClick(e, l.href)}
                        className={`px-3 py-1 text-[10px] xl:text-[11px] font-display font-bold uppercase tracking-[0.2em] transition-all relative group ${
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {l.label}
                        <motion.div
                          initial={false}
                          animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
                          className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-primary origin-center"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                        {!isActive && (
                          <div className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:block h-6 w-px bg-white/10" />
              <ThemeSwitcher />
              <a
                href="#contact"
                className={`hidden sm:flex p-1.5 rounded-full transition-all duration-300 shadow-glow items-center justify-center ${
                  isContactActive
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-white/5 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105"
                }`}
                title="Contact"
              >
                <Mail className="size-3.5" />
              </a>

              <div className="hidden lg:block h-8 w-px bg-white/10 mx-1" />

              {/* Achievements & Audio Line - Desktop or Large Mobile */}
              <div className="hidden xs:block">
                  <AchievementsNav />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-full bg-white/5 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all lg:hidden"
              >
                {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>

            </div>
          </nav>
        </ScrollDistortionWrapper>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden pt-24 px-6"
          >
            <div className="flex flex-col gap-8">
              <ul className="flex flex-col gap-4">
                {links.map((l, i) => (
                  <motion.li
                    key={l.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      className="text-2xl font-display font-black uppercase tracking-tighter hover:text-primary transition-colors block py-2"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.1 }}
                >
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    className="text-2xl font-display font-black uppercase tracking-tighter hover:text-primary transition-colors block py-2"
                  >
                    Contact
                  </a>
                </motion.li>
              </ul>

              <div className="h-px w-full bg-white/10" />

              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Connect
                </span>
                <div className="flex gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                <span className="text-sm font-display font-bold uppercase tracking-widest">Music</span>
                <div className="scale-125 origin-right">
                    <AchievementsNav />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
