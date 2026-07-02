import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  EMOTION_ICONS,
  EMOTION_PHILOSOPHY,
  EmotionType,
  emotionColor,
} from "@/types/emotion";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Brain, ListChecks, Printer } from "lucide-react";

function emotionBadgeStyle(emotion: EmotionType): React.CSSProperties {
  return {
    background: emotionColor(emotion, 0.18),
    color: emotionColor(emotion),
    border: `1px solid ${emotionColor(emotion, 0.4)}`,
  };
}

// ─── Real-life situations per emotion ─────────────────────────────────────────
const EMOTION_SITUATIONS: Record<EmotionType, string[]> = {
  [EmotionType.Fear]: [
    "Exam season and job interviews",
    "Starting a new relationship",
    "Financial risk and investments",
    "Public speaking and presentations",
  ],
  [EmotionType.Anger]: [
    "Betrayal by a trusted person",
    "Injustice at work or in systems",
    "Family conflict and disagreements",
    "Unmet expectations and disappointment",
  ],
  [EmotionType.Happiness]: [
    "Achieving a long-term goal",
    "Deep connection with loved ones",
    "Small daily wins and routines",
    "Personal growth milestones",
  ],
  [EmotionType.Sadness]: [
    "Loss, grief and bereavement",
    "Broken relationships and endings",
    "Failure after sustained effort",
    "Longing for what once was",
  ],
  [EmotionType.Love]: [
    "Romantic pursuit and attraction",
    "Deep, lasting friendship",
    "Creative passion and craft",
    "Spiritual connection and devotion",
  ],
  [EmotionType.Anxiety]: [
    "Career decisions and transitions",
    "Uncertain or unknown futures",
    "Social situations and acceptance",
    "Health scares and medical unknowns",
  ],
  [EmotionType.Desire]: [
    "Career ambition and advancement",
    "Financial goals and wealth building",
    "Romantic longing and pursuit",
    "Power, recognition and legacy",
  ],
  [EmotionType.Guilt]: [
    "Breaking promises you made",
    "Moral failures and lapses in integrity",
    "Neglecting important relationships",
    "Lingering past regrets",
  ],
  [EmotionType.Awe]: [
    "Encounters with vast nature",
    "Great art, music, or architecture",
    "Witnessing historical moments",
    "Scientific or cosmic discoveries",
  ],
  [EmotionType.Peace]: [
    "Deep meditation and stillness",
    "Nature walks and natural settings",
    "Acceptance of what cannot change",
    "Purposeful simplicity and minimalism",
  ],
};

const PHILOSOPHICAL_RULES = [
  {
    number: "01",
    title: "Perception Shapes Emotion",
    school: "Stoic Philosophy",
    thinkers: "Epictetus · Marcus Aurelius · Seneca",
    application:
      "Before reacting emotionally, ask: 'Is this the event itself, or my interpretation of it?' You cannot control what happens, only how you frame it.",
    emotions: [EmotionType.Fear, EmotionType.Anger, EmotionType.Anxiety],
  },
  {
    number: "02",
    title: "Responsibility Shapes Meaning",
    school: "Existentialist Philosophy",
    thinkers: "Jean-Paul Sartre · Søren Kierkegaard",
    application:
      "Your emotions signal where you feel responsible. Guilt, desire, and anxiety point to choices you own. Own them fully: that is where your power lives.",
    emotions: [EmotionType.Guilt, EmotionType.Desire, EmotionType.Anxiety],
  },
  {
    number: "03",
    title: "Detachment Creates Peace",
    school: "Eastern & Contemplative",
    thinkers: "Marcus Aurelius · Buddha · Lao Tzu",
    application:
      "Happiness and peace are found not in acquiring more, but in releasing attachment to outcomes. Witness the emotion; you are not the emotion.",
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

function EmotionCard({
  emotion,
  index,
}: { emotion: EmotionType; index: number }) {
  const phil = EMOTION_PHILOSOPHY[emotion];
  const Icon = EMOTION_ICONS[emotion];
  const color = emotionColor(emotion);

  return (
    <div
      data-ocid={`guide.emotion_card.${index + 1}`}
      className="group relative flex flex-col h-full rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        pageBreakInside: "avoid",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = color;
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 ${color}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
      }}
    >
      {/* Ambient Glow */}
      <div
        className="absolute top-0 left-0 w-48 h-48 rounded-full blur-[50px] opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-25"
        style={{
          background: color,
          transform: "translate(-30%, -30%)",
        }}
      />

      <div className="px-5 pt-5 pb-4 relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border"
            style={{ 
              background: emotionColor(emotion, 0.1),
              borderColor: emotionColor(emotion, 0.2)
            }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full font-body uppercase tracking-wider"
            style={emotionBadgeStyle(emotion)}
          >
            {phil.philosopher}
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-1">
          {emotion}
        </h3>
        <p className="text-xs text-muted-foreground font-body italic">
          {phil.philosopher} · <em className="text-foreground/70">{phil.source}</em>
        </p>
      </div>

      <div className="px-5 py-5 relative z-10 bg-white/[0.02] border-y border-white/[0.05]">
        <blockquote className="font-display text-sm leading-relaxed text-foreground/90 italic">
          <span className="text-2xl leading-none opacity-40 mr-1" style={{ color }}>"</span>
          {phil.quote}
          <span className="text-2xl leading-none opacity-40 ml-1" style={{ color }}>"</span>
        </blockquote>
        
        <div className="mt-4 p-3.5 rounded-xl border border-white/[0.05]" style={{ background: "rgba(0,0,0,0.3)" }}>
          <p className="text-xs font-body text-muted-foreground leading-relaxed">
            <span className="font-semibold uppercase tracking-wider not-italic block mb-1" style={{ color }}>
              Insight
            </span>
            {phil.insight}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 flex-1 relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
          Real-life situations
        </p>
        <ul className="space-y-2.5">
          {EMOTION_SITUATIONS[emotion].map((s) => (
            <li
              key={s}
              className="flex items-start gap-2.5 text-sm font-body text-foreground/80 leading-snug"
            >
              <span
                className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
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
  const color = emotionColor(rule.emotions[0]);

  return (
    <div
      data-ocid={`guide.rule_card.${index + 1}`}
      className="group relative flex flex-col h-full rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        pageBreakInside: "avoid",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = color;
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 ${color}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
      }}
    >
      {/* Ambient Glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[50px] opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-25"
        style={{
          background: color,
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="px-5 pt-5 pb-4 relative z-10 flex flex-col h-full">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border"
            style={{ 
              background: emotionColor(rule.emotions[0], 0.1),
              borderColor: emotionColor(rule.emotions[0], 0.2)
            }}
          >
            <span className="font-display text-xl font-bold" style={{ color }}>{rule.number}</span>
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full font-body uppercase tracking-wider"
            style={emotionBadgeStyle(rule.emotions[0])}
          >
            {rule.school}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-5">
          <h4 className="font-display text-xl font-bold text-foreground mb-1 leading-tight">
            {rule.title}
          </h4>
          <p className="text-xs text-muted-foreground font-body italic">
            {rule.thinkers}
          </p>
        </div>

        {/* Application Box */}
        <div className="mb-6 flex-1">
          <div className="p-4 rounded-xl border border-white/[0.05]" style={{ background: "rgba(0,0,0,0.2)" }}>
            <p className="text-sm font-body text-foreground/90 leading-relaxed">
              {rule.application}
            </p>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-auto pt-4 border-t border-white/[0.05]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
            Governs these emotions
          </p>
          <div className="flex flex-wrap gap-2">
            {rule.emotions.map((e) => {
              const EmotionIcon = EMOTION_ICONS[e];
              return (
                <span
                  key={e}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-body font-medium"
                  style={emotionBadgeStyle(e)}
                >
                  <EmotionIcon className="w-3.5 h-3.5" />
                  {e}
                </span>
              );
            })}
          </div>
        </div>
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
              Back to Home
            </button>
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
              real-life situations, so you understand why you feel what you
              feel, and what to do about it.
            </p>
          </div>

          {/* Emotions grid */}
          <section data-ocid="guide.emotions_section" className="mb-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              The 10 Core Emotions
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
                The 3 Master Rules
              </h2>
              <p className="text-sm text-muted-foreground font-body max-w-xl mx-auto">
                All 10 emotions reduce to three timeless philosophical
                principles. Memorise these: they apply in every situation.
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
            className="mb-12 w-full min-w-0 relative rounded-2xl border backdrop-blur-xl overflow-hidden"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10 px-6 py-5 border-b border-white/[0.05] bg-white/[0.02]">
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-primary" />
                Quick-Reference Table
              </h2>
              <p className="text-xs text-muted-foreground font-body mt-1 uppercase tracking-wider">
                Emotion <span className="opacity-50 mx-1">→</span> Philosopher <span className="opacity-50 mx-1">→</span> Key rule
              </p>
            </div>
            
            <div className="relative z-10 overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-black/20 text-muted-foreground text-[10px] uppercase tracking-widest border-b border-white/[0.05]">
                    <th className="text-left px-6 py-4 font-semibold">Emotion</th>
                    <th className="text-left px-4 py-4 font-semibold">Philosopher</th>
                    <th className="text-left px-4 py-4 font-semibold hidden sm:table-cell">Quote</th>
                    <th className="text-left px-6 py-4 font-semibold">Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {ORDERED_EMOTIONS.map((emotion) => {
                    const p = EMOTION_PHILOSOPHY[emotion];
                    const Icon = EMOTION_ICONS[emotion];
                    const ruleIdx = RULE_MAP[emotion];
                    const rule = PHILOSOPHICAL_RULES[ruleIdx];
                    return (
                      <tr
                        key={emotion}
                        className="group hover:bg-white/[0.03] transition-colors duration-300"
                      >
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2.5 font-semibold text-foreground group-hover:translate-x-1 transition-transform duration-300">
                            <Icon
                              className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
                              style={{ color: emotionColor(emotion) }}
                            />
                            <span style={{ color: emotionColor(emotion) }}>
                              {emotion}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-4 text-foreground/80 font-medium">
                          {p.philosopher}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground italic text-xs hidden sm:table-cell max-w-xs truncate group-hover:text-foreground/70 transition-colors duration-300">
                          "{p.quote}"
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-[11px] px-3 py-1 rounded-full inline-block whitespace-nowrap leading-snug font-medium border"
                            style={{
                              background: emotionColor(rule.emotions[0], 0.1),
                              color: emotionColor(rule.emotions[0]),
                              borderColor: emotionColor(rule.emotions[0], 0.2),
                            }}
                          >
                            <span className="font-bold opacity-50 mr-1">{rule.number}</span>
                            {rule.title}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
