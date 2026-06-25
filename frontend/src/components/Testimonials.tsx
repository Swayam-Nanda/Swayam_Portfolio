import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import { Quote, ChevronLeft, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface Avatar {
  id: number;
  name: string;
  icon?: string;
  image?: string;
}

interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  content: string;
  avatar?: number;
  avatar_details?: Avatar;
  display?: boolean;
  created_at?: string;
}

export function Testimonials({ data, avatars }: { data?: Testimonial[]; avatars?: Avatar[] }) {
  const [quotes, setQuotes] = useState<Testimonial[]>(data || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) setQuotes(data);
  }, [data]);

  const next = useCallback(() => {
    if (quotes.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % quotes.length);
  }, [quotes.length]);

  const prev = useCallback(() => {
    if (quotes.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  }, [quotes.length]);

  useEffect(() => {
    if (!isAutoPlaying || isModalOpen || quotes.length === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next, isModalOpen, quotes.length]);

  const handleAddFeedback = async (newQuote: Partial<Testimonial>) => {
    setIsSubmitting(true);
    try {
      await api.postTestimonial(newQuote);
      toast.success("Feedback submitted! It will appear after moderation.");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section
      id="testimonials"
      eyebrow="05 — Signals"
      title={
        <>
          Words from <span className="text-gradient-primary italic">collaborators</span>.
        </>
      }
    >
      <div
        className="relative flex flex-col items-center justify-center pt-10 md:pt-2 pb-10 overflow-visible"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {quotes.length > 0 ? (
          <div
            className="relative h-[350px] md:h-[420px] w-full max-w-6xl flex items-center justify-center"
            style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="popLayout">
              {quotes.map((quote, index) => {
                const position = getPosition(index, activeIndex, quotes.length);
                if (position === "hidden") return null;

                return (
                  <TestimonialCard
                    key={quote.id || index}
                    quote={quote}
                    position={position}
                    onClick={() => {
                      if (position === "left") prev();
                      if (position === "right") next();
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-[420px] flex items-center justify-center text-muted-foreground italic">
            No testimonials shared yet. Be the first!
          </div>
        )}

        {/* Navigation Controls */}
        <div className="mt-8 md:mt-12 flex flex-col items-center gap-6 md:gap-8">
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={prev}
              disabled={quotes.length <= 1}
              className="group flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:border-primary/50 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
            >
              <ChevronLeft
                size={24}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </button>

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all group gap-2"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Share Experience</span>
            </Button>

            <button
              onClick={next}
              disabled={quotes.length <= 1}
              className="group flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:border-primary/50 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
            >
              <ChevronRight
                size={24}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddFeedback}
        avatars={avatars || []}
        isSubmitting={isSubmitting}
      />
    </Section>
  );
}

function getPosition(index: number, activeIndex: number, total: number) {
  const diff = (index - activeIndex + total) % total;

  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  return "hidden";
}

const cardVariants = (isMobile: boolean) => ({
  center: {
    x: 0,
    y: 0,
    scale: 1,
    z: 0,
    rotateY: 0,
    rotateX: 0,
    opacity: 1,
    zIndex: 30,
    filter: "blur(0px) brightness(1)",
    boxShadow: "0 30px 60px -12px rgba(0,0,0,0.5), 0 18px 36px -18px rgba(0,0,0,0.5)",
  },
  left: {
    x: isMobile ? "-20%" : "-45%",
    y: 0,
    scale: 0.82,
    z: isMobile ? -100 : -250,
    rotateY: isMobile ? 15 : 35,
    rotateX: 2,
    opacity: 0.4,
    zIndex: 20,
    filter: isMobile ? "blur(1px) brightness(0.8)" : "blur(4px) brightness(0.7)",
  },
  right: {
    x: isMobile ? "20%" : "45%",
    y: 0,
    scale: 0.82,
    z: isMobile ? -100 : -250,
    rotateY: isMobile ? -15 : -35,
    rotateX: 2,
    opacity: 0.4,
    zIndex: 20,
    filter: isMobile ? "blur(1px) brightness(0.8)" : "blur(4px) brightness(0.7)",
  },
  hidden: {
    x: 0,
    y: 50,
    scale: 0.5,
    z: -500,
    rotateY: 0,
    opacity: 0,
    zIndex: 10,
    filter: "blur(12px) brightness(0.5)",
  },
});

function TestimonialCard({
  quote,
  position,
  onClick,
}: {
  quote: Testimonial;
  position: string;
  onClick: () => void;
}) {
  const isCenter = position === "center";
  const isMobile = useIsMobile();

  const fontSize = useMemo(() => {
    const length = quote.content.length;
    if (length > 160) return "text-sm md:text-base lg:text-lg";
    if (length > 100) return "text-base md:text-lg lg:text-xl";
    if (length > 60) return "text-lg md:text-xl lg:text-2xl";
    return "text-xl md:text-2xl lg:text-3xl";
  }, [quote.content]);

  return (
    <motion.div
      initial="hidden"
      animate={position}
      exit="hidden"
      variants={cardVariants(isMobile)}
      transition={{ type: "spring", stiffness: 180, damping: 24, mass: 1.2 }}
      onClick={onClick}
      className={`absolute w-[90vw] md:w-full max-w-[540px] select-none ${isCenter ? "cursor-default" : "cursor-pointer"}`}
      style={{
        transformOrigin: "center center",
        transformStyle: isMobile ? "flat" : "preserve-3d",
      }}
    >
      <div className="glass-strong relative group flex flex-col justify-between overflow-hidden rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white/10 h-[320px] md:h-[360px]">
        {isCenter && (
          <div className="absolute inset-0 rounded-[3rem] p-[1px] overflow-hidden pointer-events-none">
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,var(--primary),transparent)] opacity-20 animate-[spin_8s_linear_infinite]" />
          </div>
        )}

        <div className="relative z-10 flex-1 overflow-hidden pb-4">
          <Quote className="mb-4 size-8 text-primary opacity-40 shrink-0" />
          <div className="h-full flex items-start">
            <p className={`font-display leading-relaxed tracking-tight text-white/90 ${fontSize}`}>
              "{quote.content}"
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-6 flex items-center gap-4 border-t border-white/5">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl">
            {quote.avatar_details?.image ? (
              <img
                src={quote.avatar_details.image}
                alt={quote.name}
                className="size-full object-cover"
              />
            ) : (
              quote.avatar_details?.icon || quote.name.charAt(0)
            )}
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-wide">{quote.name}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-mono mt-0.5 font-semibold">
              {quote.role}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      </div>
    </motion.div>
  );
}

const MAX_CHARS = 240;

const ROLE_OPTIONS = [
  "Student",
  "Professor",
  "Freelancer",
  "Founder",
  "Engineer",
  "Designer",
  "Mentor",
  "Custom",
];

function AvatarSelection({
  avatars,
  selectedId,
  onSelect,
}: {
  avatars: Avatar[];
  selectedId?: number;
  onSelect: (id: number) => void;
}) {
  const selectedIndex = avatars.findIndex((a) => a.id === selectedId);
  const activeIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const next = () => onSelect(avatars[(activeIndex + 1) % avatars.length].id);
  const prev = () => onSelect(avatars[(activeIndex - 1 + avatars.length) % avatars.length].id);

  const getAvatarPosition = (index: number) => {
    const total = avatars.length;
    const diff = (index - activeIndex + total) % total;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    return "hidden";
  };

  const avatarVariants = {
    center: {
      scale: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      zIndex: 10,
    },
    left: {
      scale: 0.6,
      x: -80,
      opacity: 0.4,
      filter: "blur(2px)",
      zIndex: 5,
    },
    right: {
      scale: 0.6,
      x: 80,
      opacity: 0.4,
      filter: "blur(2px)",
      zIndex: 5,
    },
    hidden: {
      scale: 0.4,
      x: 0,
      opacity: 0,
      filter: "blur(4px)",
      zIndex: 0,
    },
  };

  return (
    <div className="relative h-32 flex items-center justify-center overflow-hidden">
      <button
        onClick={prev}
        className="absolute left-0 z-20 size-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="relative flex items-center justify-center size-full">
        <AnimatePresence mode="popLayout">
          {avatars.map((avatar, index) => {
            const position = getAvatarPosition(index);
            if (position === "hidden") return null;

            return (
              <motion.div
                key={avatar.id}
                variants={avatarVariants}
                initial="hidden"
                animate={position}
                exit="hidden"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute size-20 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center text-3xl"
              >
                {avatar.image ? (
                  <img src={avatar.image} alt={avatar.name} className="size-full object-cover" />
                ) : (
                  avatar.icon
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button
        onClick={next}
        className="absolute right-0 z-20 size-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  avatars,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (q: Partial<Testimonial>) => void;
  avatars: Avatar[];
  isSubmitting: boolean;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    content: "",
    name: "",
    role: "",
    avatar: avatars[0]?.id,
  });
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [customRole, setCustomRole] = useState("");

  useEffect(() => {
    if (avatars.length > 0 && !formData.avatar) {
      setFormData((prev) => ({ ...prev, avatar: avatars[0].id }));
    }
  }, [avatars, formData.avatar]);

  if (!isOpen) return null;

  const finalRole = selectedRole === "Custom" ? customRole : selectedRole;
  const isIdentityValid =
    formData.name?.trim() && (selectedRole !== "Custom" ? selectedRole : customRole.trim());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-strong relative w-full max-w-lg rounded-[2.5rem] border border-white/10 p-8 md:p-12 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="text-xs font-mono text-primary uppercase tracking-[0.2em] mb-2">
            Step {step} of 2
          </div>
          <h3 className="text-2xl font-display text-white">Share your experience</h3>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                Pick an Avatar
              </label>

              <AvatarSelection
                avatars={avatars}
                selectedId={formData.avatar}
                onSelect={(id) => setFormData({ ...formData, avatar: id })}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  Name
                </label>
                <Input
                  placeholder="John Doe"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-xl h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage:
                        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1rem",
                    }}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-zinc-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRole === "Custom" && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                      Custom Role
                    </label>
                    <Input
                      placeholder="Specialist"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl h-12"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              disabled={!isIdentityValid}
              onClick={() => setStep(2)}
              className="w-full h-14 rounded-2xl bg-primary text-black font-bold hover:scale-[1.02] active:scale-95 transition-all"
            >
              Next: Your Message
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  Your Message
                </label>
                <span
                  className={`text-[10px] font-mono ${(formData.content || "").length > MAX_CHARS ? "text-destructive" : "text-white/20"}`}
                >
                  {(formData.content || "").length} / {MAX_CHARS}
                </span>
              </div>
              <Textarea
                placeholder="What was it like working together?"
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value.slice(0, MAX_CHARS + 20) })
                }
                className="bg-white/5 border-white/10 rounded-2xl min-h-[140px] focus:border-primary/50 transition-all text-lg"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
              >
                Back
              </Button>
              <Button
                disabled={
                  !(formData.content || "").trim() ||
                  (formData.content || "").length > MAX_CHARS ||
                  isSubmitting
                }
                onClick={() => {
                  onSubmit({
                    content: formData.content,
                    name: formData.name,
                    role: finalRole,
                    avatar: formData.avatar,
                  });
                  setStep(1);
                  setFormData({ content: "", name: "", role: "", avatar: avatars[0]?.id });
                  setSelectedRole(ROLE_OPTIONS[0]);
                  setCustomRole("");
                }}
                className="flex-[2] h-14 rounded-2xl bg-primary text-black font-bold hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    Submitting... <Loader2 className="ml-2 size-4 animate-spin" />
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Decorative background glow */}
        <div className="absolute -bottom-20 -left-20 size-60 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>
    </div>
  );
}
