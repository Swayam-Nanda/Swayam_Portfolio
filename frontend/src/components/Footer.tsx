import { Github, Linkedin, Mail, ArrowUpRight, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { icon: Github, href: "https://github.com/SWAYAM-NANDA-JI", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/swayam-nanda", label: "LinkedIn" },
  { icon: XLogo, href: "https://x.com/SWAYAM_NANDA_", label: "X" },
  { icon: Mail, href: "mailto:swayamnanda8@gmail.com", label: "Email" },
];

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Feedback", href: "#testimonials" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-transparent border-t border-white/5 overflow-hidden">
      {/* Decorative background logo */}
      <div className="absolute -bottom-10 -right-20 pointer-events-none opacity-[0.02] select-none">
        <span className="font-display text-[20vw] font-black leading-none uppercase tracking-tighter">
          SWAYAM
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="size-5 text-primary fill-primary/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl uppercase tracking-tighter text-gradient-primary">
                  SWAYAM
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] leading-none">
                  NANDA
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-mono">
              Crafting premium digital experiences through minimal design and cutting-edge
              technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-col sm:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-display font-bold text-muted-foreground hover:text-primary transition-colors flex items-center group gap-2"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="size-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Connect</h4>
            <div className="flex flex-wrap gap-4 relative min-h-[3rem]">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-xl sm:size-12 sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
                    title={social.label}
                  >
                    <social.icon className="size-4 sm:size-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Column */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Inquiry</h4>
            <div className="glass rounded-xl sm:rounded-[2rem] p-5 sm:p-6 border-white/10 relative group overflow-hidden">
              <div className="relative z-10 space-y-4">
                <p className="text-sm font-display font-bold text-white">Have a project in mind?</p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary group"
                >
                  START A CONVERSATION
                  <ArrowUpRight className="size-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
              <div className="absolute top-0 right-0 size-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {currentYear} SWAYAM NANDA</span>
            <span className="size-1 rounded-full bg-white/20 hidden sm:block" />
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2 group"
            >
              Back to Top
              <ArrowUpRight className="size-3 -rotate-45 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Background decoration line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </footer>
  );
}
