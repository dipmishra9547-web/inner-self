import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { LandingHomeContent } from "../components/LandingHomeContent";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Drama,
  Flame,
  HelpCircle,
  LayoutDashboard,
  Lock,
  PawPrint,
  Share2,
  Skull,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ShareSection } from "../components/ShareSection";
import { useAuth } from "../hooks/useAuth";

const APP_URL = window.location.origin;
const SHARE_MESSAGE = `Discover your personality with Inner-Self! Find your Animal Archetype, Emotion Profile, and Dark Side. Take the quiz now: ${APP_URL}`;

const QUIZ_THEME = {
  animal: {
    icon: PawPrint,
    color: "oklch(var(--chart-5))",
    muted: "oklch(var(--chart-5) / 0.12)",
    border: "oklch(var(--chart-5) / 0.35)",
  },
  emotion: {
    icon: Drama,
    color: "oklch(var(--chart-2))",
    muted: "oklch(var(--chart-2) / 0.12)",
    border: "oklch(var(--chart-2) / 0.35)",
  },
  darkSide: {
    icon: Skull,
    color: "oklch(var(--chart-3))",
    muted: "oklch(var(--chart-3) / 0.12)",
    border: "oklch(var(--chart-3) / 0.35)",
  },
  sevenSins: {
    icon: Flame,
    color: "oklch(var(--chart-4))",
    muted: "oklch(var(--chart-4) / 0.12)",
    border: "oklch(var(--chart-4) / 0.35)",
  },
} as const;

const QUIZZES = [
  {
    theme: QUIZ_THEME.animal,
    title: "Animal Archetype Quiz",
    description:
      "Discover which of 7 animal archetypes best represents your personality. Are you a bold Lion, a playful Otter, a loyal Golden Retriever, an organized Beaver, a wise Wolf, a gentle Sheep, or a guiding Shepherd? 15 questions to reveal your inner animal.",
    href: "/animal-quiz",
    badgeLabel: "15 Questions",
    ocid: "home.animal_quiz",
  },
  {
    theme: QUIZ_THEME.emotion,
    title: "Emotion Quiz",
    description:
      "Uncover your emotional landscape across 10 core emotions: Fear, Anger, Happiness, Sadness, Love, Anxiety, Desire, Guilt, Awe, and Peace. See your top emotions in a pie chart alongside philosophical insights from Stoic, Existentialist, and Eastern wisdom.",
    href: "/emotion-quiz",
    badgeLabel: "10 Questions",
    ocid: "home.emotion_quiz",
  },
  {
    theme: QUIZ_THEME.darkSide,
    title: "Know Your Dark Side",
    description:
      "Explore the darker dimensions of your personality through criminological psychology. Discover if you're a Lone Planner, Mastermind, Quiet Idealist, or Social Flame, and whether you carry traits of the Manipulator, Psychopath, or Sociopath. Results shown as a detailed pie chart with strengths and weaknesses.",
    href: "/dark-side-quiz",
    badgeLabel: "15 Questions",
    ocid: "home.darkside_quiz",
  },
  {
    theme: QUIZ_THEME.sevenSins,
    title: "Seven Deadly Sins",
    description:
      "Uncover which of the 7 deadly sins secretly drives your behavior and personality: Pride, Greed, Wrath, Envy, Gluttony, Lust, or Sloth. 15 confessional scenario questions reveal your hidden sin profile with percentage breakdowns.",
    href: "/seven-sins-quiz",
    badgeLabel: "15 Questions",
    ocid: "home.seven_sins_quiz",
  },
] as const;

// ── User Guide Modal ─────────────────────────────────────────────────────────

const GUIDE_SECTIONS = [
  {
    id: "welcome",
    icon: Sparkles,
    heading: "Welcome to Inner-Self",
    accentColor: "oklch(var(--primary))",
    content: (
      <p className="text-sm text-muted-foreground font-body leading-relaxed">
        Inner-Self is a personal exploration app that helps you discover who you
        really are through psychological quizzes. Each quiz looks at a different
        dimension of your personality: your instincts, emotions, shadow side,
        and deepest tendencies.{" "}
        <span className="text-foreground font-medium">
          There are no right or wrong answers
        </span>
        , just honest reflection.
      </p>
    ),
  },
  {
    id: "start",
    icon: ChevronRight,
    heading: "How to Get Started",
    accentColor: "oklch(var(--accent))",
    content: (
      <ol className="space-y-3">
        {(
          [
            {
              step: 1,
              label: "Create your account",
              desc: 'Tap "Create Account" on the login page and fill in your name, email, age, gender, and a password. You\'ll also choose a security question in case you ever forget your password.',
            },
            {
              step: 2,
              label: "Log in",
              desc: "Use your email and password to sign in.",
            },
            {
              step: 3,
              label: "You land here",
              desc: "Your personal homepage, where all four quizzes are waiting for you.",
            },
          ] as const
        ).map(({ step, label, desc }) => (
          <li key={step} className="flex gap-3 items-start">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-display"
              style={{
                background: "oklch(var(--accent) / 0.18)",
                color: "oklch(var(--accent))",
              }}
            >
              {step}
            </span>
            <div>
              <span className="text-sm font-semibold text-foreground font-body">
                {label}:{" "}
              </span>
              <span className="text-sm text-muted-foreground font-body">
                {desc}
              </span>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "quizzes",
    icon: BookOpen,
    heading: "The Four Quizzes",
    accentColor: "oklch(var(--chart-5))",
    content: (
      <div className="space-y-3">
        {QUIZZES.map(({ theme, title, description }) => (
          <div
            key={title}
            className="flex gap-3 items-start rounded-xl p-3 border"
            style={{ borderColor: theme.border, background: theme.muted }}
          >
            <theme.icon
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: theme.color }}
            />
            <div>
              <p
                className="text-sm font-semibold font-body mb-0.5"
                style={{ color: theme.color }}
              >
                {title}
              </p>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    heading: "Your Dashboard",
    accentColor: "oklch(var(--accent))",
    content: (
      <div>
        <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
          After taking any quiz, your results are saved automatically. Tap{" "}
          <span className="text-foreground font-medium">"My Dashboard"</span> in
          the navigation to:
        </p>
        <ul className="space-y-2">
          {(
            [
              "See all your past quiz attempts",
              "View your latest result for each quiz",
              'See your "Full Profile" card with all four quiz results in one place',
              "Track how your Seven Deadly Sins results have changed over time",
            ] as const
          ).map((item) => (
            <li key={item} className="flex gap-2 items-start">
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "oklch(var(--accent))" }}
              />
              <span className="text-sm text-muted-foreground font-body">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "profile",
    icon: User,
    heading: "Your Profile",
    accentColor: "oklch(var(--chart-5))",
    content: (
      <div>
        <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
          Tap your name or the profile icon in the top navigation to reach your
          profile page. From there you can:
        </p>
        <ul className="space-y-2">
          {(
            [
              "Update your security question, answer, and hint",
              "Submit feedback about the app (up to 200 words)",
              "See when your security question was last updated",
            ] as const
          ).map((item) => (
            <li key={item} className="flex gap-2 items-start">
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "oklch(var(--chart-5))" }}
              />
              <span className="text-sm text-muted-foreground font-body">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "sharing",
    icon: Share2,
    heading: "Sharing",
    accentColor: "oklch(var(--chart-4))",
    content: (
      <p className="text-sm text-muted-foreground font-body leading-relaxed">
        After completing any quiz, tap{" "}
        <span className="text-foreground font-medium">"Share Your Result"</span>{" "}
        on the result page to share via WhatsApp, Facebook, Twitter/X, or copy a
        link. You can also share the app itself from the homepage using the
        share section below the quiz cards.
      </p>
    ),
  },
  {
    id: "password",
    icon: Lock,
    heading: "Forgot Your Password?",
    accentColor: "oklch(var(--chart-3))",
    content: (
      <p className="text-sm text-muted-foreground font-body leading-relaxed">
        On the login page, tap{" "}
        <span className="text-foreground font-medium">"Forgot Password?"</span>,
        enter your email, answer your security question (using your hint if you
        set one), and you'll be able to set a new password instantly.
      </p>
    ),
  },
];

function UserGuideModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.78)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          data-ocid="home.user_guide.dialog"
        >
          <motion.div
            className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-2xl border border-border overflow-hidden bg-popover"
            style={{
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.72), 0 0 0 1px oklch(var(--primary) / 0.2)",
            }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0 bg-card">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/15">
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground leading-none mb-0.5">
                    How does this work?
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-body tracking-wide uppercase">
                    Your Inner-Self Guide
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close guide"
                data-ocid="home.user_guide.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
            >
              {GUIDE_SECTIONS.map(
                ({ id, icon: Icon, heading, accentColor, content }, idx) => (
                  <motion.section
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.28 }}
                    data-ocid={`home.user_guide.section.${idx + 1}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${accentColor.replace(")", " / 0.15)")}`,
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{ color: accentColor }}
                        />
                      </div>
                      <h3
                        className="font-display text-sm font-bold"
                        style={{ color: accentColor }}
                      >
                        {heading}
                      </h3>
                    </div>
                    {content}
                    {idx < GUIDE_SECTIONS.length - 1 && (
                      <div className="mt-6 border-t border-border" />
                    )}
                  </motion.section>
                ),
              )}

              {/* Blockchain note */}
              <div className="rounded-xl p-4 text-center bg-primary/[0.07] border border-primary/20">
                <p className="text-xs text-muted-foreground font-body flex items-center justify-center gap-1.5 flex-wrap">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  All data is stored securely on the{" "}
                  <span className="text-foreground font-medium">
                    Internet Computer blockchain
                  </span>
                  . Only you can see your results.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoggedInHomeContent() {
  const navigate = useNavigate();
  const { name } = useAuth();
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col container-page py-10 sm:py-14 max-w-3xl">
      {/* User Guide Modal */}
      <UserGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center mb-6"
        data-ocid="home.welcome_section"
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[300px] sm:w-[500px] max-w-[90vw] h-[200px] rounded-full blur-3xl opacity-15 pointer-events-none -mt-8"
          style={{ background: "oklch(var(--primary))" }}
        />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body mb-3">
          Your Journey Inward
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
          {name ? (
            <>
              Welcome, <span className="text-primary">{name}</span>
            </>
          ) : (
            "Welcome to Inner-Self"
          )}
        </h1>
        <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto mb-5">
          Explore four psychological quizzes designed to reveal your archetypes,
          emotional patterns, and the hidden dimensions of your personality.
        </p>

        {/* Guide pill button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.35 }}
        >
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/[0.09] text-primary font-body text-sm font-medium transition-smooth hover:opacity-90 active:scale-95"
            data-ocid="home.user_guide_open_modal_button"
          >
            <HelpCircle className="w-4 h-4" />
            How does this work?
          </button>
        </motion.div>
      </motion.div>

      {/* Quiz cards */}
      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-4"
        data-ocid="home.quiz_cards_list"
      >
        {QUIZZES.map((quiz, index) => (
          <motion.div
            key={quiz.href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.1 + 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            data-ocid={`${quiz.ocid}.card.${index + 1}`}
          >
            <div
              className="group relative flex flex-col h-full rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = quiz.theme.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 ${quiz.theme.border}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
              }}
            >
              {/* Ambient Glow */}
              <div
                className="absolute top-0 right-0 w-56 h-56 rounded-full blur-[50px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40"
                style={{
                  background: quiz.theme.color,
                  transform: "translate(35%, -35%)",
                }}
              />

              <div className="flex flex-col flex-1 p-5 relative z-10">
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: quiz.theme.muted }}
                  >
                    <quiz.theme.icon
                      className="w-6 h-6"
                      style={{ color: quiz.theme.color }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      color: quiz.theme.color,
                      borderColor: quiz.theme.border,
                      background: quiz.theme.muted,
                    }}
                  >
                    {quiz.badgeLabel}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display text-base font-bold text-foreground mb-2 leading-snug">
                  {quiz.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-muted-foreground font-body leading-relaxed flex-1 mb-5">
                  {quiz.description}
                </p>

                {/* CTA Button */}
                <button
                  type="button"
                  className="w-full mt-auto py-2.5 rounded-lg font-body font-semibold text-sm transition-all duration-300 border bg-transparent"
                  style={{
                    color: quiz.theme.color,
                    borderColor: quiz.theme.border,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = quiz.theme.muted;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: quiz.href });
                  }}
                  data-ocid={`${quiz.ocid}.start_button`}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Share section */}
      <ShareSection message={SHARE_MESSAGE} ocidPrefix="home" />
    </div>
  );
}

export function HomePage() {
  const { isLoggedIn } = useAuth();
  
  if (isLoggedIn) {
    return <LoggedInHomeContent />;
  }
  
  return <LandingHomeContent />;
}
