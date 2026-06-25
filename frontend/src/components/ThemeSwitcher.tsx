import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronRight, Check } from "lucide-react";
import { useTheme, ThemeId } from "../lib/ThemeContext";

const themes = [
  { id: "blue", color: "#5eb8ff", label: "Blue" },
  { id: "gold", color: "#f4c46b", label: "Gold" },
  { id: "white", color: "#f5f5f5", label: "White" },
  { id: "crimson", color: "#ff5a5a", label: "Crimson" },
  { id: "emerald", color: "#5ee3a8", label: "Emerald" },
  { id: "purple", color: "#b07bff", label: "Purple" },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeTheme, setTheme } = useTheme();

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".theme-studio")) setIsOpen(false);
    };
    window.addEventListener("mousedown", handleDown);
    return () => window.removeEventListener("mousedown", handleDown);
  }, [isOpen]);

  return (
    <div className="relative theme-studio">
      {/* Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`size-10 rounded-full flex items-center justify-center transition-all ${
          isOpen
            ? "bg-primary text-primary-foreground scale-110 shadow-glow"
            : "glass hover:bg-white/10 text-muted-foreground"
        }`}
      >
        <Palette className="size-5" />
      </button>

      {/* Studio Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-4 w-64 glass-strong rounded-3xl p-5 border-white/10 shadow-elegant z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-black text-sm uppercase tracking-widest text-foreground">
                Theme Studio
              </span>
              <span className="text-[10px] font-mono text-primary/60 uppercase font-bold">
                v3.1
              </span>
            </div>

            {/* Colors Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <div className="size-1 rounded-full bg-primary" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                  Visual Core
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="group relative size-8 rounded-full transition-transform active:scale-90"
                    style={{ background: t.color }}
                  >
                    {activeTheme === t.id && (
                      <motion.div
                        layoutId="active-theme"
                        className="absolute inset-0 flex items-center justify-center text-primary-foreground"
                      >
                        <Check className="size-4 drop-shadow-md" />
                      </motion.div>
                    )}
                    <div className="absolute -inset-1 rounded-full border border-white/10 scale-0 group-hover:scale-100 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative Grain Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 grain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
