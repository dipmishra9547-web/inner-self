import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  Drama,
  Flame,
  Key,
  PawPrint,
  ShieldCheck,
  Skull,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: PawPrint,
    title: "Animal Archetypes",
    description:
      "Are you a bold Lion, a loyal Retriever, or a wise Wolf? Uncover the primal instincts that drive your social behavior, leadership style, and survival mechanisms.",
    color: "oklch(var(--chart-5))",
    border: "oklch(var(--chart-5) / 0.35)",
    bg: "oklch(var(--chart-5) / 0.12)",
  },
  {
    icon: Drama,
    title: "Emotional Landscape",
    description:
      "Map your core emotional drivers—from Fear and Desire to Awe and Peace. Discover how ancient Stoic and Existentialist wisdom applies to your unique emotional footprint.",
    color: "oklch(var(--chart-2))",
    border: "oklch(var(--chart-2) / 0.35)",
    bg: "oklch(var(--chart-2) / 0.12)",
  },
  {
    icon: Skull,
    title: "The Dark Side",
    description:
      "Confront your shadow self. Using criminological psychology, we reveal whether you harbor traits of a Mastermind, a Lone Planner, or a Social Flame.",
    color: "oklch(var(--chart-3))",
    border: "oklch(var(--chart-3) / 0.35)",
    bg: "oklch(var(--chart-3) / 0.12)",
  },
  {
    icon: Flame,
    title: "Seven Deadly Sins",
    description:
      "Which ancient vice secretly orchestrates your decisions? Through confessional scenarios, discover if Pride, Wrath, or Sloth is the hidden architect of your habits.",
    color: "oklch(var(--chart-4))",
    border: "oklch(var(--chart-4) / 0.35)",
    bg: "oklch(var(--chart-4) / 0.12)",
  },
];

export function LandingHomeContent() {
  return (
    <div className="flex-1 flex flex-col items-center w-full pb-20 overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative w-full max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-32 flex flex-col items-center text-center">
        {/* Ambient Hero Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-[100%] blur-[120px] opacity-[0.15] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-body text-xs font-semibold uppercase tracking-widest mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Know Thyself</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
            The most profound journey <br className="hidden md:block" />
            is the one <span className="text-primary italic">inward.</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed mb-10 max-w-2xl mx-auto">
            Inner-Self is a digital sanctuary for self-discovery. Through a series of deeply researched psychological assessments, unravel the mysteries of your personality, confront your shadow side, and illuminate the hidden forces that drive your life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold font-body text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-[0_0_40px_-10px_oklch(var(--primary))] group">
                Begin Your Journey
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 rounded-full border-border/50 bg-transparent hover:bg-white/5 hover:text-foreground font-semibold font-body text-base transition-all active:scale-95"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Dimensions of Self Section ── */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Four Dimensions of You
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Human psychology is too complex for a single label. We deconstruct your identity across four distinct psychological domains to provide a holistic mirror of your soul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative p-8 rounded-3xl border backdrop-blur-xl bg-card/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = feature.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 20px 48px rgba(0,0,0,0.4), inset 0 1px 0 ${feature.border}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)";
              }}
            >
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 transition-opacity duration-500 group-hover:opacity-30 pointer-events-none"
                style={{ background: feature.color, transform: "translate(30%, -30%)" }}
              />
              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                  style={{ background: feature.bg }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Privacy / Secure Blockchain Section ── */}
      <section className="relative w-full max-w-5xl mx-auto px-6 py-24">
        <div className="rounded-3xl border border-primary/20 bg-primary/[0.03] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-body text-xs font-semibold uppercase tracking-widest mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Absolute Privacy</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your mind is yours alone.
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed text-base mb-0">
              Psychological exploration requires complete vulnerability. That's why Inner-Self is built entirely on the Internet Computer (ICP) blockchain. Your identity, your quiz results, and your personal data are decentralized, cryptographically secure, and completely immune to corporate harvesting. No tracking. No ads. Just you and your thoughts.
            </p>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center relative z-10">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center relative shadow-[0_0_60px_-15px_oklch(var(--primary))]">
               <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20 duration-3000" />
               <Key className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
          Ready to meet your inner self?
        </h2>
        <p className="text-muted-foreground font-body text-base md:text-lg mb-10">
          Create a free account in seconds and unlock your personalized psychological dashboard. The answers you seek are already inside you.
        </p>
        <Link to="/signup">
          <Button className="h-14 px-10 rounded-full bg-foreground text-background font-semibold font-body text-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95">
            Create Free Account
          </Button>
        </Link>
      </section>
    </div>
  );
}
