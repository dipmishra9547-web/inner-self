import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@tanstack/react-router";
import { CheckCircle2, Copy, Facebook, Share2, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { useAuth } from "../hooks/useAuth";
import { EMOTION_PHILOSOPHY } from "../types/emotion";
import type { EmotionScore, EmotionType } from "../types/emotion";

const SLICE_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-chart-2, var(--color-secondary))",
];

const PHIL_RULES = [
  {
    icon: "👁️",
    title: "Perception shapes emotion",
    school: "Stoics",
    desc: "Your interpretation of events — not events themselves — determines how you feel.",
  },
  {
    icon: "⚖️",
    title: "Responsibility shapes meaning",
    school: "Existentialists",
    desc: "Owning your choices transforms raw emotion into purpose and direction.",
  },
  {
    icon: "🧘",
    title: "Detachment creates peace",
    school: "Eastern Philosophy",
    desc: "Releasing attachment to outcomes quiets the noise of desire and fear.",
  },
];

interface StoredResult {
  topEmotions: EmotionScore[];
  takenAt: string;
}

// ── SVG Pie / Donut Chart ─────────────────────────────────────────────────────
function EmotionPieChart({ scores }: { scores: EmotionScore[] }) {
  const SIZE = 200;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const OUTER_R = 80;
  const INNER_R = 46;
  const [hovered, setHovered] = useState<number | null>(null);

  const top3 = scores.slice(0, 3);
  const total = top3.reduce((s, e) => s + e.count, 0);

  type SliceDatum = {
    startAngle: number;
    endAngle: number;
    color: string;
    emotion: string;
    percentage: number;
    emoji: string;
  };

  function pol(angle: number, r: number) {
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  }

  function arcPath(start: number, end: number) {
    const o1 = pol(start, OUTER_R);
    const o2 = pol(end, OUTER_R);
    const i1 = pol(start, INNER_R);
    const i2 = pol(end, INNER_R);
    const large = end - start > Math.PI ? 1 : 0;
    return [
      `M ${i1.x} ${i1.y}`,
      `L ${o1.x} ${o1.y}`,
      `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${o2.x} ${o2.y}`,
      `L ${i2.x} ${i2.y}`,
      `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${i1.x} ${i1.y}`,
      "Z",
    ].join(" ");
  }

  let cursor = -Math.PI / 2;
  const slices: SliceDatum[] = top3.map((s, i) => {
    const frac = total > 0 ? s.count / total : 1 / 3;
    const angle = frac * 2 * Math.PI;
    const slice = {
      startAngle: cursor,
      endAngle: cursor + angle,
      color: SLICE_COLORS[i],
      emotion: s.emotion,
      percentage: s.percentage,
      emoji: EMOTION_PHILOSOPHY[s.emotion as EmotionType]?.emoji ?? "✨",
    };
    cursor += angle;
    return slice;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Top 3 emotion pie chart"
      >
        <title>Top 3 emotion pie chart</title>
        {slices.map((slice, i) => {
          const midA = (slice.startAngle + slice.endAngle) / 2;
          const labelPt = pol(midA, OUTER_R + 16);
          const isHov = hovered === i;
          return (
            <g key={slice.emotion}>
              <path
                d={arcPath(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                opacity={hovered === null || isHov ? 0.9 : 0.45}
                style={{
                  transform: isHov ? "scale(1.05)" : "scale(1)",
                  transformOrigin: `${CX}px ${CY}px`,
                  transition: "all 0.18s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={slice.color}
                style={{ pointerEvents: "none" }}
              >
                {slice.percentage}%
              </text>
            </g>
          );
        })}
        <text
          x={CX}
          y={CY - 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
        >
          {slices[0]?.emoji}
        </text>
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8.5"
          fill="var(--color-muted-foreground)"
          fontFamily="var(--font-body)"
          fontWeight="600"
          letterSpacing="0.06em"
        >
          PRIMARY
        </text>
      </svg>

      <div className="flex flex-wrap gap-2 justify-center">
        {slices.map((s) => (
          <span
            key={s.emotion}
            className="inline-flex items-center gap-1.5 text-xs font-body px-2.5 py-1 rounded-full"
            style={{
              border: `1.5px solid ${s.color}`,
              color: s.color,
              background: `${s.color}18`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.emoji} {s.emotion}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Share Result Component ────────────────────────────────────────────────────
function ShareEmotionResult({ topEmotion }: { topEmotion: string }) {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const shareMessage = `My top emotion is ${topEmotion} according to Inner-Self's Emotion Quiz! Find out yours: ${appUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Inner-Self Emotion Profile",
          text: shareMessage,
          url: appUrl,
        });
        return;
      } catch {
        // fall through
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank",
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <Card
      className="bg-card border-border shadow-card overflow-hidden"
      data-ocid="emotion_result.share_card"
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
            Share Your Result
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
          Your dominant emotion is{" "}
          <strong className="text-foreground">{topEmotion}</strong>. Share your
          profile!
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: "#25D366", color: "#fff" }}
            data-ocid="emotion_result.share_whatsapp"
          >
            <SiWhatsapp className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: "#1877F2", color: "#fff" }}
            data-ocid="emotion_result.share_facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: "#0f1419", color: "#fff" }}
            data-ocid="emotion_result.share_twitter"
          >
            <Twitter className="w-3.5 h-3.5" />X
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95 border border-border bg-muted/50 text-foreground"
            data-ocid="emotion_result.share_copy_link"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium border border-border/50 text-muted-foreground hover:text-primary transition-smooth"
            data-ocid="emotion_result.share_native"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share via…
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function EmotionResultPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [result, setResult] = useState<StoredResult | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("emotion_result");
    if (raw) {
      try {
        setResult(JSON.parse(raw) as StoredResult);
      } catch {
        router.navigate({ to: "/emotion-quiz" });
      }
    } else {
      router.navigate({ to: "/emotion-quiz" });
    }
  }, [router]);

  if (!result) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        data-ocid="emotion_result.loading_state"
      >
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const top3 = result.topEmotions.slice(0, 3);
  const topEmotion = top3[0]?.emotion ?? "";
  const takenAt = new Date(result.takenAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="flex-1 flex flex-col items-center px-4 py-10 bg-background"
      data-ocid="emotion_result.page"
      ref={pageRef}
    >
      <div className="w-full max-w-xl space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">
            Emotional Profile
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Your Inner Emotional Landscape
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Completed on {takenAt}
          </p>
          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground/70 font-body mt-1">
              Sign in to save your results across sessions
            </p>
          )}
        </motion.div>

        {/* Pie Chart Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card
            className="bg-card border-border shadow-card overflow-hidden"
            data-ocid="emotion_result.chart_card"
          >
            <div className="gradient-warm-accent h-1" />
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-4">
                Top 3 Dominant Emotions
              </p>
              <EmotionPieChart scores={top3} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Philosophy Cards (top 3) */}
        {top3.map((score, idx) => {
          const phil = EMOTION_PHILOSOPHY[score.emotion as EmotionType];
          if (!phil) return null;
          const color = SLICE_COLORS[idx];
          return (
            <motion.div
              key={score.emotion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + idx * 0.1, duration: 0.4 }}
            >
              <Card
                className="bg-card border-border shadow-card overflow-hidden"
                data-ocid={`emotion_result.philosophy_card.${idx + 1}`}
              >
                <div className="h-1" style={{ background: color }} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl leading-none flex-shrink-0 mt-0.5">
                      {phil.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3
                          className="font-display text-base font-bold"
                          style={{ color }}
                        >
                          {phil.emotion}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-body"
                          style={{ borderColor: `${color}80`, color }}
                        >
                          #{idx + 1} dominant · {score.percentage}%
                        </Badge>
                      </div>
                      <blockquote className="text-sm font-display italic text-foreground/90 leading-relaxed mb-1.5">
                        "{phil.quote}"
                      </blockquote>
                      <p className="text-xs text-muted-foreground font-body">
                        — {phil.philosopher},{" "}
                        <span className="italic">{phil.source}</span>
                      </p>
                      <div
                        className="mt-2.5 px-3 py-2 rounded-lg text-xs font-body text-foreground/85 leading-relaxed"
                        style={{
                          border: `1px solid ${color}44`,
                          background: `${color}12`,
                        }}
                      >
                        💡 {phil.insight}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Full Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card
            className="bg-card border-border shadow-card overflow-hidden"
            data-ocid="emotion_result.breakdown_card"
          >
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                Full Emotion Score
              </p>
              <div className="space-y-2.5">
                {result.topEmotions.map((score, i) => {
                  const phil = EMOTION_PHILOSOPHY[score.emotion as EmotionType];
                  return (
                    <div
                      key={score.emotion}
                      className="flex items-center gap-3"
                      data-ocid={`emotion_result.breakdown_item.${i + 1}`}
                    >
                      <span className="w-5 text-center text-sm flex-shrink-0">
                        {phil?.emoji}
                      </span>
                      <span className="text-xs font-body text-foreground/80 w-20 flex-shrink-0">
                        {score.emotion}
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background:
                              i < 3
                                ? SLICE_COLORS[i]
                                : "var(--color-muted-foreground)",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${score.percentage}%` }}
                          transition={{
                            delay: 0.55 + i * 0.05,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                      <span className="text-xs font-body text-muted-foreground w-8 text-right flex-shrink-0">
                        {score.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* 3 Philosophical Rules */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          data-ocid="emotion_result.rules_section"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3 text-center">
            ⚡ The 3 Universal Philosophical Rules
          </p>
          <div className="space-y-3">
            {PHIL_RULES.map((rule, i) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.1 }}
                className="flex items-start gap-3 bg-muted/30 rounded-lg p-3.5 border border-border/50"
                data-ocid={`emotion_result.rule.${i + 1}`}
              >
                <span className="text-xl flex-shrink-0">{rule.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground font-body">
                    {rule.title}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({rule.school})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Share Your Result */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
        >
          <ShareEmotionResult topEmotion={topEmotion} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78 }}
          className="flex flex-col gap-3"
          data-ocid="emotion_result.actions"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="font-body transition-smooth"
              onClick={() => router.navigate({ to: "/emotion-quiz" })}
              data-ocid="emotion_result.retake_button"
            >
              🔁 Retake Quiz
            </Button>
            <Button
              variant="ghost"
              className="font-body text-muted-foreground transition-smooth"
              onClick={() => router.navigate({ to: "/" })}
              data-ocid="emotion_result.home_button"
            >
              ← Animal Quiz
            </Button>
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}
