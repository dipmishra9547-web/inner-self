import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EMOTION_PHILOSOPHY, EmotionType } from "@/types/emotion";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Printer } from "lucide-react";

// ─── Emotion accent colors ────────────────────────────────────────────────────
const EMOTION_META: Record<
  EmotionType,
  {
    color: string;
    badgeStyle: React.CSSProperties;
    situations: string[];
  }
> = {
  [EmotionType.Fear]: {
    color: "oklch(0.58 0.2 25)",
    badgeStyle: {
      background: "oklch(0.35 0.18 25 / 0.22)",
      color: "oklch(0.85 0.12 25)",
      border: "1px solid oklch(0.58 0.2 25 / 0.35)",
    },
    situations: [
      "Exam season & job interviews",
      "Starting a new relationship",
      "Financial risk & investments",
      "Public speaking & presentations",
    ],
  },
  [EmotionType.Anger]: {
    color: "oklch(0.58 0.22 20)",
    badgeStyle: {
      background: "oklch(0.35 0.2 20 / 0.22)",
      color: "oklch(0.85 0.14 20)",
      border: "1px solid oklch(0.58 0.22 20 / 0.35)",
    },
    situations: [
      "Betrayal by a trusted person",
      "Injustice at work or in systems",
      "Family conflict & disagreements",
      "Unmet expectations & disappointment",
    ],
  },
  [EmotionType.Happiness]: {
    color: "oklch(0.72 0.17 70)",
    badgeStyle: {
      background: "oklch(0.5 0.15 70 / 0.22)",
      color: "oklch(0.9 0.12 70)",
      border: "1px solid oklch(0.72 0.17 70 / 0.35)",
    },
    situations: [
      "Achieving a long-term goal",
      "Deep connection with loved ones",
      "Small daily wins & routines",
      "Personal growth milestones",
    ],
  },
  [EmotionType.Sadness]: {
    color: "oklch(0.55 0.14 260)",
    badgeStyle: {
      background: "oklch(0.35 0.12 260 / 0.22)",
      color: "oklch(0.8 0.08 260)",
      border: "1px solid oklch(0.55 0.14 260 / 0.35)",
    },
    situations: [
      "Loss, grief & bereavement",
      "Broken relationships & endings",
      "Failure after sustained effort",
      "Longing for what once was",
    ],
  },
  [EmotionType.Love]: {
    color: "oklch(0.62 0.2 10)",
    badgeStyle: {
      background: "oklch(0.4 0.18 10 / 0.22)",
      color: "oklch(0.87 0.12 10)",
      border: "1px solid oklch(0.62 0.2 10 / 0.35)",
    },
    situations: [
      "Romantic pursuit & attraction",
      "Deep, lasting friendship",
      "Creative passion & craft",
      "Spiritual connection & devotion",
    ],
  },
  [EmotionType.Anxiety]: {
    color: "oklch(0.62 0.16 55)",
    badgeStyle: {
      background: "oklch(0.4 0.14 55 / 0.22)",
      color: "oklch(0.88 0.1 55)",
      border: "1px solid oklch(0.62 0.16 55 / 0.35)",
    },
    situations: [
      "Career decisions & transitions",
      "Uncertain or unknown futures",
      "Social situations & acceptance",
      "Health scares & medical unknowns",
    ],
  },
  [EmotionType.Desire]: {
    color: "oklch(0.6 0.2 45)",
    badgeStyle: {
      background: "oklch(0.38 0.18 45 / 0.22)",
      color: "oklch(0.88 0.12 45)",
      border: "1px solid oklch(0.6 0.2 45 / 0.35)",
    },
    situations: [
      "Career ambition & advancement",
      "Financial goals & wealth building",
      "Romantic longing & pursuit",
      "Power, recognition & legacy",
    ],
  },
  [EmotionType.Guilt]: {
    color: "oklch(0.54 0.14 220)",
    badgeStyle: {
      background: "oklch(0.35 0.12 220 / 0.22)",
      color: "oklch(0.82 0.08 220)",
      border: "1px solid oklch(0.54 0.14 220 / 0.35)",
    },
    situations: [
      "Breaking promises you made",
      "Moral failures & lapses in integrity",
      "Neglecting important relationships",
      "Lingering past regrets",
    ],
  },
  [EmotionType.Awe]: {
    color: "oklch(0.65 0.18 280)",
    badgeStyle: {
      background: "oklch(0.4 0.16 280 / 0.22)",
      color: "oklch(0.86 0.1 280)",
      border: "1px solid oklch(0.65 0.18 280 / 0.35)",
    },
    situations: [
      "Encounters with vast nature",
      "Great art, music, or architecture",
      "Witnessing historical moments",
      "Scientific or cosmic discoveries",
    ],
  },
  [EmotionType.Peace]: {
    color: "oklch(0.65 0.16 155)",
    badgeStyle: {
      background: "oklch(0.42 0.14 155 / 0.22)",
      color: "oklch(0.87 0.1 155)",
      border: "1px solid oklch(0.65 0.16 155 / 0.35)",
    },
    situations: [
      "Deep meditation & stillness",
      "Nature walks & natural settings",
      "Acceptance of what cannot change",
      "Purposeful simplicity & minimalism",
    ],
  },
};

const PHILOSOPHICAL_RULES = [
  {
    number: "01",
    title: "Perception Shapes Emotion",
    school: "Stoic Philosophy",
    thinkers: "Epictetus · Marcus Aurelius · Seneca",
    application:
      "Before reacting emotionally, ask: 'Is this the event itself, or my interpretation of it?' You cannot control what happens — only how you frame it.",
    color: "oklch(0.58 0.2 25)",
    badgeStyle: {
      background: "oklch(0.35 0.18 25 / 0.22)",
      color: "oklch(0.85 0.12 25)",
      border: "1px solid oklch(0.58 0.2 25 / 0.35)",
    },
    emotions: [EmotionType.Fear, EmotionType.Anger, EmotionType.Anxiety],
  },
  {
    number: "02",
    title: "Responsibility Shapes Meaning",
    school: "Existentialist Philosophy",
    thinkers: "Jean-Paul Sartre · Søren Kierkegaard",
    application:
      "Your emotions signal where you feel responsible. Guilt, desire, and anxiety point to choices you own. Own them fully — that is where your power lives.",
    color: "oklch(0.55 0.14 260)",
    badgeStyle: {
      background: "oklch(0.35 0.12 260 / 0.22)",
      color: "oklch(0.8 0.08 260)",
      border: "1px solid oklch(0.55 0.14 260 / 0.35)",
    },
    emotions: [EmotionType.Guilt, EmotionType.Desire, EmotionType.Anxiety],
  },
  {
    number: "03",
    title: "Detachment Creates Peace",
    school: "Eastern & Contemplative",
    thinkers: "Marcus Aurelius · Buddha · Lao Tzu",
    application:
      "Happiness and peace are found not in acquiring more, but in releasing attachment to outcomes. Witness the emotion; you are not the emotion.",
    color: "oklch(0.65 0.16 155)",
    badgeStyle: {
      background: "oklch(0.42 0.14 155 / 0.22)",
      color: "oklch(0.87 0.1 155)",
      border: "1px solid oklch(0.65 0.16 155 / 0.35)",
    },
    emotions: [EmotionType.Peace, EmotionType.Awe, EmotionType.Happiness],
  },
];

const ORDERED_EMOTIONS: EmotionType[] = [
  EmotionType.Fear,
  EmotionType.Anger,
  EmotionType.Happiness,
  EmotionType.Sadness,
  EmotionType.Love,
  EmotionType.Anxiety,
  EmotionType.Desire,
  EmotionType.Guilt,
  EmotionType.Awe,
  EmotionType.Peace,
];

const RULE_MAP: Record<EmotionType, number> = {
  [EmotionType.Fear]: 0,
  [EmotionType.Anger]: 0,
  [EmotionType.Anxiety]: 0,
  [EmotionType.Guilt]: 1,
  [EmotionType.Desire]: 1,
  [EmotionType.Peace]: 2,
  [EmotionType.Awe]: 2,
  [EmotionType.Happiness]: 2,
  [EmotionType.Sadness]: 2,
  [EmotionType.Love]: 2,
};

// ─── Emotion Card ─────────────────────────────────────────────────────────────
function EmotionCard({
  emotion,
  index,
}: { emotion: EmotionType; index: number }) {
  const meta = EMOTION_META[emotion];
  const phil = EMOTION_PHILOSOPHY[emotion];

  return (
    <div
      data-ocid={`guide.emotion_card.${index + 1}`}
      className="rounded-xl border border-border bg-card flex flex-col overflow-hidden"
      style={{
        borderLeftColor: meta.color,
        borderLeftWidth: "4px",
        pageBreakInside: "avoid",
      }}
    >
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-3xl leading-none">{phil.emoji}</span>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full font-body"
            style={meta.badgeStyle}
          >
            {phil.philosopher}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-0.5">
          {emotion}
        </h3>
        <p className="text-xs text-muted-foreground font-body italic">
          {phil.philosopher} · <em>{phil.source}</em>
        </p>
      </div>

      <Separator />

      <div className="px-5 py-4">
        <blockquote
          className="font-display text-sm leading-relaxed text-foreground/90 italic border-l-2 pl-3"
          style={{ borderColor: meta.color }}
        >
          "{phil.quote}"
        </blockquote>
        <p className="mt-2 text-xs font-body text-muted-foreground">
          <span
            className="font-semibold not-italic"
            style={{ color: meta.color }}
          >
            Insight:{" "}
          </span>
          {phil.insight}
        </p>
      </div>

      <Separator />

      <div className="px-5 py-4 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
          Real-life situations
        </p>
        <ul className="space-y-1.5">
          {meta.situations.map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 text-sm font-body text-foreground/80"
            >
              <span
                className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: meta.color }}
              />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Rule Card ────────────────────────────────────────────────────────────────
function RuleCard({
  rule,
  index,
}: { rule: (typeof PHILOSOPHICAL_RULES)[0]; index: number }) {
  return (
    <div
      data-ocid={`guide.rule_card.${index + 1}`}
      className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3"
      style={{
        borderTopColor: rule.color,
        borderTopWidth: "3px",
        pageBreakInside: "avoid",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="font-display text-4xl font-bold opacity-25"
          style={{ color: rule.color }}
        >
          {rule.number}
        </span>
        <div>
          <h4 className="font-display text-base font-semibold text-foreground">
            {rule.title}
          </h4>
          <p className="text-xs text-muted-foreground font-body">
            {rule.school}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-body italic">
        {rule.thinkers}
      </p>
      <Separator />
      <p className="text-sm font-body text-foreground/85 leading-relaxed">
        {rule.application}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {rule.emotions.map((e) => (
          <span
            key={e}
            className="text-xs px-2 py-0.5 rounded-full font-body"
            style={EMOTION_META[e].badgeStyle}
          >
            {EMOTION_PHILOSOPHY[e].emoji} {e}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── GuidePage ────────────────────────────────────────────────────────────────
export function GuidePage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #111 !important; -webkit-print-color-adjust: exact; }
          .print-page { background: #fff !important; }
          .guide-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .guide-rules-grid { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 1rem !important; }
        }
      `}</style>

      <div className="min-h-screen bg-background print-page">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Top controls */}
          <div className="no-print flex items-center justify-between mb-6 gap-4 flex-wrap">
            <button
              type="button"
              data-ocid="guide.back_button"
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to quiz
            </button>
            <Button
              data-ocid="guide.print_button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </Button>
          </div>

          {/* Page header */}
          <div className="mb-10 text-center">
            <div className="no-print flex items-center justify-center gap-3 mb-3">
              <BookOpen className="w-7 h-7 text-primary" />
              <Badge variant="secondary" className="text-xs font-body">
                Daily Revision Guide
              </Badge>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              10 Philosophical Emotions
            </h1>
            <p className="font-display text-lg text-primary mb-3">
              Your Daily Revision Sheet
            </p>
            <p className="text-sm text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Each emotion mapped to its philosopher, core insight, and
              real-life situations — so you understand why you feel what you
              feel, and what to do about it.
            </p>
          </div>

          {/* Emotions grid */}
          <section data-ocid="guide.emotions_section" className="mb-14">
            <h2 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-xl">🧠</span> The 10 Core Emotions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 guide-grid">
              {ORDERED_EMOTIONS.map((emotion, index) => (
                <EmotionCard key={emotion} emotion={emotion} index={index} />
              ))}
            </div>
          </section>

          <Separator className="mb-14" />

          {/* 3 Rules */}
          <section data-ocid="guide.rules_section" className="mb-12">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                ⚡ The 3 Master Rules
              </h2>
              <p className="text-sm text-muted-foreground font-body max-w-xl mx-auto">
                All 10 emotions reduce to three timeless philosophical
                principles. Memorise these — they apply in every situation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 guide-rules-grid">
              {PHILOSOPHICAL_RULES.map((rule, index) => (
                <RuleCard key={rule.number} rule={rule} index={index} />
              ))}
            </div>
          </section>

          {/* Quick reference table */}
          <section
            data-ocid="guide.table_section"
            className="mb-12 rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">
                📋 Quick-Reference Table
              </h2>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                Emotion → Philosopher → Key rule
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-semibold">
                      Emotion
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Philosopher
                    </th>
                    <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">
                      Quote
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDERED_EMOTIONS.map((emotion) => {
                    const p = EMOTION_PHILOSOPHY[emotion];
                    const m = EMOTION_META[emotion];
                    const ruleIdx = RULE_MAP[emotion];
                    const rule = PHILOSOPHICAL_RULES[ruleIdx];
                    return (
                      <tr
                        key={emotion}
                        className="border-t border-border hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2 font-semibold text-foreground">
                            <span>{p.emoji}</span>
                            <span style={{ color: m.color }}>{emotion}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.philosopher}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground italic text-xs hidden sm:table-cell max-w-xs truncate">
                          "{p.quote}"
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={rule.badgeStyle}
                          >
                            {rule.number} {rule.title}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="no-print text-center py-8 border-t border-border">
            <p className="text-sm text-muted-foreground font-body mb-4">
              Discover which of these emotions define you most
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                data-ocid="guide.take_emotion_quiz_button"
                onClick={() => navigate({ to: "/emotion-quiz" })}
              >
                Take the Emotion Quiz
              </Button>
              <Button
                data-ocid="guide.take_animal_quiz_button"
                variant="outline"
                onClick={() => navigate({ to: "/" })}
              >
                Take the Animal Archetype Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
