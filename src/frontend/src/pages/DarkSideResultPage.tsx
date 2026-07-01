import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  Facebook,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { BRAND_COLORS } from "../components/ShareSection";
import { useAuth } from "../hooks/useAuth";
import {
  DARK_SIDE_CHART_COLORS,
  DARK_SIDE_ICONS,
  DARK_SIDE_PROFILES,
} from "../types/darkSide";
import type {
  DarkSideResultSummary,
  DarkSideScore,
  DarkSideType,
} from "../types/darkSide";

// ── SVG Donut Chart ────────────────────────────────────────────────────────────
function DarkSideDonutChart({ scores }: { scores: DarkSideScore[] }) {
  const SIZE = 220;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const OUTER_R = 85;
  const INNER_R = 50;
  const [hovered, setHovered] = useState<number | null>(null);

  const totalCount = scores.reduce((s, e) => s + e.count, 0);

  type SliceDatum = {
    startAngle: number;
    endAngle: number;
    color: string;
    darkType: DarkSideType;
    percentage: number;
    name: string;
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

  const displayScores = scores.map((s) => ({
    ...s,
    displayCount: s.count > 0 ? s.count : 0.3,
  }));
  const displayTotal = displayScores.reduce((s, e) => s + e.displayCount, 0);

  let cursor = -Math.PI / 2;
  const slices: SliceDatum[] = displayScores.map((s) => {
    const frac = displayTotal > 0 ? s.displayCount / displayTotal : 1 / 7;
    const angle = frac * 2 * Math.PI;
    const profile = DARK_SIDE_PROFILES[s.darkType as DarkSideType];
    const slice: SliceDatum = {
      startAngle: cursor,
      endAngle: cursor + angle,
      color: DARK_SIDE_CHART_COLORS[s.darkType as DarkSideType],
      darkType: s.darkType as DarkSideType,
      percentage: s.percentage,
      name: profile?.name ?? s.darkType,
    };
    cursor += angle;
    return slice;
  });

  const dominantProfile =
    DARK_SIDE_PROFILES[scores[0]?.darkType as DarkSideType];
  const DominantIcon = scores[0]
    ? DARK_SIDE_ICONS[scores[0].darkType as DarkSideType]
    : Sparkles;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Dark side personality type donut chart"
        >
          <title>Dark side personality type distribution</title>
          {slices.map((slice, i) => {
            const isHov = hovered === i;
            const isDominant = i === 0 && totalCount > 0;
            return (
              <g key={slice.darkType}>
                <path
                  d={arcPath(slice.startAngle, slice.endAngle)}
                  fill={slice.color}
                  opacity={
                    hovered === null || isHov ? (isDominant ? 1 : 0.75) : 0.35
                  }
                  style={{
                    transform: isHov || isDominant ? "scale(1.04)" : "scale(1)",
                    transformOrigin: `${CX}px ${CY}px`,
                    transition: "all 0.18s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            );
          })}
          {hovered !== null && (
            <>
              <rect
                x={CX - 26}
                y={CY + 26}
                width="52"
                height="18"
                rx="4"
                fill="oklch(var(--card))"
                stroke={slices[hovered]?.color ?? "transparent"}
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x={CX}
                y={CY + 35}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fontFamily="var(--font-body)"
                fontWeight="600"
                fill={slices[hovered]?.color ?? "oklch(var(--foreground))"}
              >
                {slices[hovered]?.percentage}%
              </text>
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none -translate-y-2">
          <DominantIcon
            className="w-6 h-6"
            style={{
              color:
                DARK_SIDE_CHART_COLORS[scores[0]?.darkType as DarkSideType],
            }}
          />
          <span className="text-[8px] font-body font-bold text-muted-foreground tracking-wider">
            DOMINANT
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full max-w-xs">
        {slices.map((s, i) => {
          const Icon = DARK_SIDE_ICONS[s.darkType];
          return (
            <div
              key={s.darkType}
              className="flex items-center gap-1.5 text-xs font-body"
              style={{ opacity: scores[i]?.count > 0 ? 1 : 0.45 }}
            >
              <Icon
                className="w-3 h-3 flex-shrink-0"
                style={{ color: s.color }}
              />
              <span className="truncate text-foreground/80">
                {dominantProfile && s.darkType === scores[0]?.darkType ? (
                  <strong>{DARK_SIDE_PROFILES[s.darkType]?.archLabel}</strong>
                ) : (
                  DARK_SIDE_PROFILES[s.darkType]?.archLabel
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Share Dark Side Result ────────────────────────────────────────────────────
function ShareDarkSideResult({ dominantType }: { dominantType: string }) {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const shareMessage = `My dark personality type is ${dominantType} on Inner-Self! Discover your dark side: ${appUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Inner-Self Dark Side Profile",
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
      data-ocid="dark_side_result.share_card"
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body">
            Share Your Result
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
          Your dominant type is{" "}
          <strong className="text-foreground">{dominantType}</strong>. Dare to
          share?
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.whatsapp, color: "#fff" }}
            data-ocid="dark_side_result.share_whatsapp"
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
            style={{ background: BRAND_COLORS.facebook, color: "#fff" }}
            data-ocid="dark_side_result.share_facebook"
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
            style={{ background: BRAND_COLORS.twitter, color: "#fff" }}
            data-ocid="dark_side_result.share_twitter"
          >
            <Twitter className="w-3.5 h-3.5" />X
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95 border border-border bg-muted/50 text-foreground"
            data-ocid="dark_side_result.share_copy_link"
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
            data-ocid="dark_side_result.share_native"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share via…
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function DarkSideResultPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [result, setResult] = useState<DarkSideResultSummary | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("darkSideResult");
    if (raw) {
      try {
        setResult(JSON.parse(raw) as DarkSideResultSummary);
      } catch {
        router.navigate({ to: "/dark-side-quiz" });
      }
    } else {
      router.navigate({ to: "/dark-side-quiz" });
    }
  }, [router]);

  if (!result) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        data-ocid="dark_side_result.loading_state"
      >
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const dominant = result.topTypes[0];
  const dominantProfile =
    DARK_SIDE_PROFILES[dominant?.darkType as DarkSideType];
  const dominantColor =
    DARK_SIDE_CHART_COLORS[dominant?.darkType as DarkSideType] ?? "#94a3b8";

  const takenAt = new Date(result.takenAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const takenTime = new Date(result.takenAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const top3 = result.topTypes.slice(0, 3).filter((s) => s.count > 0);

  return (
    <div
      className="flex-1 flex flex-col items-center px-4 py-10 bg-background"
      data-ocid="dark_side_result.page"
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
            Psychological Self-Profile
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Know Your Dark Side
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Completed on {takenAt} at {takenTime}
          </p>
          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground/70 font-body mt-1">
              Sign in to save your results across sessions
            </p>
          )}
        </motion.div>

        {/* Donut Chart Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card
            className="bg-card border-border shadow-card overflow-hidden"
            data-ocid="dark_side_result.chart_card"
          >
            <div className="h-1" style={{ background: dominantColor }} />
            <CardContent className="p-6 flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-4">
                Personality Type Distribution
              </p>
              <DarkSideDonutChart scores={result.topTypes} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Dominant Type Card */}
        {dominantProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            <Card
              className="bg-card border-border shadow-card overflow-hidden"
              data-ocid="dark_side_result.dominant_card"
            >
              <div className="h-1.5" style={{ background: dominantColor }} />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${dominantColor}18` }}
                  >
                    {(() => {
                      const DominantIcon =
                        DARK_SIDE_ICONS[dominant?.darkType as DarkSideType];
                      return (
                        <DominantIcon
                          className="w-7 h-7"
                          style={{ color: dominantColor }}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2
                        className="font-display text-lg font-bold"
                        style={{ color: dominantColor }}
                      >
                        {dominantProfile.archLabel}
                      </h2>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-body"
                        style={{
                          borderColor: `${dominantColor}80`,
                          color: dominantColor,
                        }}
                      >
                        {dominant.percentage}% dominant
                      </Badge>
                    </div>
                    <p className="text-sm font-body text-muted-foreground italic mb-1">
                      {dominantProfile.tagline}
                    </p>
                    <p className="text-xs font-body text-muted-foreground">
                      {dominantProfile.name}: Criminology / Psychology Profile
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: `${dominantColor}10`,
                      border: `1px solid ${dominantColor}30`,
                    }}
                    data-ocid="dark_side_result.strengths"
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2.5 font-body flex items-center gap-1.5"
                      style={{ color: dominantColor }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Strengths
                    </p>
                    <ul className="space-y-1.5">
                      {dominantProfile.strengths.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-xs font-body text-foreground/85 leading-relaxed"
                        >
                          <span
                            className="mt-0.5 text-[10px]"
                            style={{ color: dominantColor }}
                          >
                            ▸
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="rounded-xl p-4 bg-muted/30 border border-border/50"
                    data-ocid="dark_side_result.weaknesses"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2.5 font-body text-muted-foreground flex items-center gap-1.5">
                      <TriangleAlert className="w-3.5 h-3.5" />
                      Watch Points
                    </p>
                    <ul className="space-y-1.5">
                      {dominantProfile.weaknesses.map((w) => (
                        <li
                          key={w}
                          className="flex items-start gap-2 text-xs font-body text-foreground/75 leading-relaxed"
                        >
                          <span className="mt-0.5 text-[10px] text-muted-foreground">
                            ▸
                          </span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className="mt-4 px-4 py-3 rounded-xl text-sm font-body text-foreground/85 leading-relaxed italic flex items-start gap-2"
                  style={{
                    border: `1px solid ${dominantColor}44`,
                    background: `${dominantColor}0e`,
                  }}
                  data-ocid="dark_side_result.insight"
                >
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 not-italic" />
                  <span>
                    <strong className="not-italic font-semibold">
                      Self-awareness:
                    </strong>{" "}
                    {dominantProfile.insight}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top 3 Profile Cards */}
        {top3.slice(1).map((score, idx) => {
          const profile = DARK_SIDE_PROFILES[score.darkType as DarkSideType];
          const color = DARK_SIDE_CHART_COLORS[score.darkType as DarkSideType];
          if (!profile) return null;
          return (
            <motion.div
              key={score.darkType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + idx * 0.1, duration: 0.4 }}
            >
              <Card
                className="bg-card border-border shadow-card overflow-hidden"
                data-ocid={`dark_side_result.type_card.${idx + 2}`}
              >
                <div className="h-1" style={{ background: color }} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18` }}
                    >
                      {(() => {
                        const Icon = DARK_SIDE_ICONS[score.darkType];
                        return <Icon className="w-5 h-5" style={{ color }} />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className="font-display text-base font-bold"
                          style={{ color }}
                        >
                          {profile.archLabel}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-body"
                          style={{ borderColor: `${color}80`, color }}
                        >
                          #{idx + 2} · {score.percentage}%
                        </Badge>
                      </div>
                      <p className="text-xs font-body text-muted-foreground italic mb-2">
                        {profile.tagline}
                      </p>
                      <div
                        className="px-3 py-2 rounded-lg text-xs font-body text-foreground/85 leading-relaxed flex items-start gap-2"
                        style={{
                          border: `1px solid ${color}40`,
                          background: `${color}0d`,
                        }}
                      >
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {profile.insight}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Full Breakdown Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52 }}
        >
          <Card
            className="bg-card border-border shadow-card overflow-hidden"
            data-ocid="dark_side_result.breakdown_card"
          >
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                Full Score Breakdown
              </p>
              <div className="space-y-2.5">
                {result.topTypes.map((score, i) => {
                  const profile =
                    DARK_SIDE_PROFILES[score.darkType as DarkSideType];
                  const color =
                    DARK_SIDE_CHART_COLORS[score.darkType as DarkSideType];
                  const Icon = DARK_SIDE_ICONS[score.darkType as DarkSideType];
                  return (
                    <div
                      key={score.darkType}
                      className="flex items-center gap-3"
                      data-ocid={`dark_side_result.breakdown_item.${i + 1}`}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs font-body text-foreground/80 w-28 flex-shrink-0 truncate">
                        {profile?.archLabel}
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
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

        {/* Criminology context note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-muted/30 border border-border/50 rounded-xl p-4"
          data-ocid="dark_side_result.context_note"
        >
          <p className="text-xs font-semibold font-body text-foreground/80 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Educational Context
          </p>
          <p className="text-xs font-body text-muted-foreground leading-relaxed">
            These profiles draw from criminology and personality psychology
            research, including the Big Five, Dark Triad, and
            introversion/extraversion frameworks. This is a{" "}
            <strong className="text-foreground/80">self-awareness tool</strong>,
            not a clinical diagnosis. High scores reflect tendencies, not
            destiny. Understanding your patterns is the first step to choosing
            how you act on them.
          </p>
        </motion.div>

        {/* Share Your Result */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <ShareDarkSideResult
            dominantType={
              dominantProfile?.archLabel ?? dominant?.darkType ?? "Unknown"
            }
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
          className="flex flex-col gap-3"
          data-ocid="dark_side_result.actions"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="gap-1.5 font-body transition-smooth"
              onClick={() => router.navigate({ to: "/dark-side-quiz" })}
              data-ocid="dark_side_result.retake_button"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button
              variant="ghost"
              className="gap-1.5 font-body text-muted-foreground transition-smooth"
              onClick={() => router.navigate({ to: "/" })}
              data-ocid="dark_side_result.home_button"
            >
              <ArrowLeft className="w-4 h-4" />
              Animal Quiz
            </Button>
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </div>
  );
}
