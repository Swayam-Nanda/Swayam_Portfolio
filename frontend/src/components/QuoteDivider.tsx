import { motion } from "framer-motion";

interface QuoteDividerProps {
  text: string;
}

export function QuoteDivider({ text }: QuoteDividerProps) {
  return (
    <div className="w-full py-0 flex items-center justify-center select-none overflow-hidden relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1400px] px-6 md:px-12 flex items-center justify-center group"
      >
        <span
          className="font-display font-black text-[4.5vw] sm:text-[3.5vw] md:text-[2.8vw] leading-[0.95] uppercase tracking-tighter text-center transition-all duration-700 ease-out cursor-default text-white/10 group-hover:text-primary"
          style={{
            // Dynamic text-shadow glow in primary color on hover
            textShadow: "0 0 0px transparent",
          }}
          // We can use inline styles or standard CSS classes for the glow transition
          onMouseEnter={(e) => {
            e.currentTarget.style.textShadow = "0 0 40px color-mix(in oklab, var(--primary) 50%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textShadow = "0 0 0px transparent";
          }}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}
