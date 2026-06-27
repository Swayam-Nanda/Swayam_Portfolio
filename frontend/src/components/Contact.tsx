import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Section } from "./Section";
import { MinimalistGlobe } from "./ui/MinimalistGlobe";
import { ParticleExplosion } from "./ui/ParticleExplosion";
import { api } from "../lib/api-client";

const steps = ["Service", "Scope", "Details"];
const services = ["Full Stack Build", "AI Integration", "UI Engineering", "Consulting"];
const timelines = ["< 1 month", "1–3 months", "3–6 months", "Ongoing"];
const budgets = ["< $5k", "$5k–$15k", "$15k–$50k", "$50k+"];

export function Contact() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: "",
    timeline: "",
    budget: "",
    name: "",
    email: "",
    message: "",
  });
  const [done, setDone] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.postBooking(data);
      setExploding(true);
      setTimeout(() => {
        setDone(true);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Submission failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {exploding && <ParticleExplosion onComplete={() => setExploding(false)} />}

      {/* 3D Minimalist Globe Layer - Completely Unboxed, Fixed to Section Area */}
      <div className="absolute top-0 right-0 z-0 h-[300px] md:h-[800px] w-[300px] md:w-[800px] pointer-events-none translate-x-[10%] md:translate-x-[20%] translate-y-[-10%]">
        <MinimalistGlobe />
      </div>

      <Section
        id="contact"
        eyebrow="07 — Get in Touch"
        title={
          <>
            Let's <span className="text-gradient-primary italic">build</span> something inevitable.
          </>
        }
        intro="A short brief gets us aligned faster than a 30-minute call."
      >
        <div className="relative min-h-[500px] md:min-h-[600px]">
          <div className="glass relative z-10 mx-auto w-full max-w-md md:max-w-2xl overflow-hidden rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
            {/* stepper */}
            <div className="mb-8 flex items-center gap-1.5 sm:gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-1.5 sm:gap-2">
                  <div
                    className={`flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full border text-[10px] sm:text-xs font-medium transition-all ${
                      i <= step
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/15 text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="size-3 sm:size-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] ${
                      i === step ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </span>
                  {i < steps.length - 1 && <div className="h-px flex-1 bg-white/10 hidden sm:block" />}
                </div>
              ))}
            </div>

            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div
                  className="mb-6 flex size-16 items-center justify-center rounded-full"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <Check className="size-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-3xl font-bold">Brief received.</h3>
                <p className="mt-2 text-muted-foreground">I'll get back within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <StepWrap key="0">
                      <Label>What do you need?</Label>
                      <Chips
                        options={services}
                        value={data.service}
                        onChange={(v) => update("service", v)}
                      />
                    </StepWrap>
                  )}
                  {step === 1 && (
                    <StepWrap key="1">
                      <Label>Timeline</Label>
                      <Chips
                        options={timelines}
                        value={data.timeline}
                        onChange={(v) => update("timeline", v)}
                      />
                      <Label className="mt-6">Budget</Label>
                      <Chips
                        options={budgets}
                        value={data.budget}
                        onChange={(v) => update("budget", v)}
                      />
                    </StepWrap>
                  )}
                  {step === 2 && (
                    <StepWrap key="2">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name" value={data.name} onChange={(v) => update("name", v)} />
                        <Field
                          label="Email"
                          type="email"
                          value={data.email}
                          onChange={(v) => update("email", v)}
                        />
                      </div>
                      <Field
                        label="Message"
                        textarea
                        value={data.message}
                        onChange={(v) => update("message", v)}
                      />
                    </StepWrap>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                  >
                    Back
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={
                        (step === 0 && !data.service) ||
                        (step === 1 && (!data.timeline || !data.budget))
                      }
                      className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-glow)",
                      }}
                    >
                      Continue{" "}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70"
                      style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-glow)",
                      }}
                    >
                      {loading ? (
                        <>
                          Sending... <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Send Brief{" "}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 transition-all ${
            value === o
              ? "border-primary/60 bg-primary/15 text-foreground"
              : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="relative mt-4 block">
      <span className="mb-2 block font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 md:px-4 md:py-3 text-sm outline-none transition-colors focus:border-primary/60"
        />
      ) : (
        <input
          required
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 md:px-4 md:py-3 text-sm outline-none transition-colors focus:border-primary/60"
        />
      )}
    </label>
  );
}
