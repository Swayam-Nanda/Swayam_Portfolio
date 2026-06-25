import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-7xl px-4 py-32">
      {(eyebrow || title) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 md:mb-16 flex flex-col gap-3 md:gap-4"
        >
          {eyebrow && (
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary">
              ／ {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display text-3xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-gradient">
              {title}
            </h2>
          )}
          {intro && <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p>}
        </motion.div>
      )}
      {children}
    </section>
  );
}
