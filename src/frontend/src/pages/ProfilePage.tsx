import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Edit3,
  Lightbulb,
  LogOut,
  Mail,
  MessageSquare,
  Save,
  Send,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { useAuth, useAuthActionsWithSecurityQuestion } from "../hooks/useAuth";
import type { EmotionScore } from "../types/auth";
import { EmotionType } from "../types/emotion";
import { SECURITY_QUESTIONS } from "./SignupPage";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ANIMAL_EMOJIS: Record<string, string> = {
  Lion: "🦁",
  Otter: "🦦",
  GoldenRetriever: "🐕",
  Beaver: "🦫",
  Wolf: "🐺",
  Sheep: "🐑",
  Shepherd: "🧑‍🌾",
};

const ANIMAL_LABELS: Record<string, string> = {
  GoldenRetriever: "Golden Retriever",
};

const EMOTION_EMOJIS: Record<string, string> = {
  [EmotionType.Fear]: "😨",
  [EmotionType.Anger]: "😠",
  [EmotionType.Happiness]: "😊",
  [EmotionType.Sadness]: "😢",
  [EmotionType.Love]: "😍",
  [EmotionType.Anxiety]: "😟",
  [EmotionType.Desire]: "😤",
  [EmotionType.Guilt]: "😔",
  [EmotionType.Awe]: "😮",
  [EmotionType.Peace]: "🧘",
};

const EMOTION_INSIGHTS: Record<string, string> = {
  [EmotionType.Fear]: "Fear is often your interpretation, not reality.",
  [EmotionType.Anger]: "You lose control before you realize it.",
  [EmotionType.Happiness]: "It's built internally, not externally.",
  [EmotionType.Sadness]: "Sadness is part of the human condition.",
  [EmotionType.Love]: "Love transforms perception and meaning.",
  [EmotionType.Anxiety]: "Anxiety comes from too many possibilities.",
  [EmotionType.Desire]: "Desire is endless — control it or it controls you.",
  [EmotionType.Guilt]: "Guilt reflects responsibility.",
  [EmotionType.Awe]: "Awe connects you to something bigger than yourself.",
  [EmotionType.Peace]: "Control your mind = control your life.",
};

const EMOTION_PHILOSOPHERS: Record<string, string> = {
  [EmotionType.Fear]: "Epictetus",
  [EmotionType.Anger]: "Seneca",
  [EmotionType.Happiness]: "Aristotle",
  [EmotionType.Sadness]: "Schopenhauer",
  [EmotionType.Love]: "Plato",
  [EmotionType.Anxiety]: "Kierkegaard",
  [EmotionType.Desire]: "Thomas Hobbes",
  [EmotionType.Guilt]: "Jean-Paul Sartre",
  [EmotionType.Awe]: "Immanuel Kant",
  [EmotionType.Peace]: "Marcus Aurelius",
};

// ─── Emotion Pie Chart ───────────────────────────────────────────────────────

function EmotionPieChart({ emotions }: { emotions: EmotionScore[] }) {
  const top3 = emotions.slice(0, 3);
  const colors = [
    "oklch(var(--primary))",
    "oklch(var(--accent))",
    "oklch(var(--chart-2))",
  ];

  let cumulative = 0;
  const segments = top3.map((e, i) => {
    const pct = e.percentage / 100;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const r = 40;
    const cx = 50;
    const cy = 50;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { d, color: colors[i], emotion: e };
  });

  return (
    <div className="flex items-center gap-5">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="shrink-0"
        aria-label="Emotion distribution chart"
        role="img"
      >
        <title>Emotion distribution</title>
        {segments.map((seg) => (
          <path
            key={seg.emotion.emotion}
            d={seg.d}
            fill={seg.color}
            opacity={0.9}
          />
        ))}
        <circle cx="50" cy="50" r="20" fill="oklch(var(--card))" />
      </svg>
      <div className="space-y-2 min-w-0">
        {top3.map((e, i) => (
          <div
            key={e.emotion}
            className="flex items-center gap-2 font-body text-sm"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: colors[i] }}
            />
            <span className="text-foreground font-medium">
              {EMOTION_EMOJIS[e.emotion]} {e.emotion}
            </span>
            <span className="text-muted-foreground ml-auto">
              {Math.round(e.percentage)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Loading Skeleton ─────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div
      className="flex-1 px-4 py-10 max-w-2xl mx-auto w-full space-y-5"
      data-ocid="profile.loading_state"
    >
      <div className="flex justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

// ─── Edit Profile Form ────────────────────────────────────────────────────────

interface EditFormProps {
  name: string;
  age: string;
  gender: string;
  onSave: (name: string, age: string, gender: string) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function EditProfileForm({
  name,
  age,
  gender,
  onSave,
  onCancel,
  saving,
}: EditFormProps) {
  const [localName, setLocalName] = useState(name);
  const [localAge, setLocalAge] = useState(age);
  const [localGender, setLocalGender] = useState(gender);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localName, localAge, localGender);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="profile.edit_form"
    >
      <div className="space-y-1.5">
        <Label
          htmlFor="edit-name"
          className="font-body text-sm text-muted-foreground"
        >
          Display Name
        </Label>
        <Input
          id="edit-name"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          placeholder="Your name"
          className="font-body bg-background border-border"
          data-ocid="profile.name_input"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="edit-age"
            className="font-body text-sm text-muted-foreground"
          >
            Age
          </Label>
          <Input
            id="edit-age"
            type="number"
            min={1}
            max={120}
            value={localAge}
            onChange={(e) => setLocalAge(e.target.value)}
            placeholder="Age"
            className="font-body bg-background border-border"
            data-ocid="profile.age_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="edit-gender"
            className="font-body text-sm text-muted-foreground"
          >
            Gender
          </Label>
          <select
            id="edit-gender"
            value={localGender}
            onChange={(e) => setLocalGender(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-smooth"
            data-ocid="profile.gender_select"
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={saving || !localName.trim()}
          className="gap-1.5 font-body"
          data-ocid="profile.save_button"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-1.5 font-body"
          data-ocid="profile.cancel_button"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Feedback Form ────────────────────────────────────────────────────────────

interface FeedbackFormProps {
  userEmail: string;
  actor: ReturnType<typeof createActor> | null;
}

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function FeedbackForm({ userEmail, actor }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const wordCount = countWords(feedback);
  const isAtLimit = wordCount >= 200;
  const isNearLimit = wordCount >= 190 && wordCount < 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Block additional input if at 200 words (allow deletion)
    if (countWords(value) > 200) {
      // Truncate to 200 words
      const words = value.trim().split(/\s+/).slice(0, 200);
      setFeedback(words.join(" "));
      return;
    }
    setFeedback(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || wordCount === 0 || !actor) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await actor.submitFeedback(feedback.trim(), userEmail);
      if (result.__kind__ === "err") {
        setSubmitStatus("error");
      } else {
        setSubmitStatus("success");
        setFeedback("");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-card"
      data-ocid="profile.feedback_section"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base font-semibold text-foreground">
          Share Your Feedback
        </h3>
      </div>

      <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">
        We'd love to hear what you think about Inner-Self. Your feedback helps
        us improve.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Textarea
            value={feedback}
            onChange={handleChange}
            placeholder="Tell us what you think... (max 200 words)"
            className="font-body bg-background border-border resize-none min-h-[120px] text-sm leading-relaxed"
            disabled={submitting}
            data-ocid="profile.feedback_textarea"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-1.5 min-w-0">
              {isNearLimit && (
                <p className="text-xs text-[oklch(0.72_0.17_50)] font-body">
                  Approaching word limit
                </p>
              )}
              {isAtLimit && (
                <p className="text-xs text-destructive font-body">
                  Word limit reached
                </p>
              )}
            </div>
            <p
              className={`text-xs font-body shrink-0 tabular-nums ${
                isAtLimit
                  ? "text-destructive font-semibold"
                  : isNearLimit
                    ? "text-[oklch(0.72_0.17_50)]"
                    : "text-muted-foreground"
              }`}
              data-ocid="profile.feedback_word_count"
            >
              {wordCount} / 200 words
            </p>
          </div>
        </div>

        {/* Status messages */}
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30 text-xs font-body text-accent"
            data-ocid="profile.feedback_success_state"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Thank you for your feedback!
          </motion.div>
        )}
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-xs font-body text-destructive"
            data-ocid="profile.feedback_error_state"
          >
            Failed to send feedback. Please try again.
          </motion.div>
        )}

        <Button
          type="submit"
          size="sm"
          disabled={submitting || !feedback.trim() || wordCount === 0}
          className="gap-1.5 font-body"
          data-ocid="profile.feedback_submit_button"
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Send Feedback
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

// ─── Update Security Question Section ────────────────────────────────────────

interface UpdateSecurityQuestionProps {
  email: string;
  token: string;
}

function formatNanoTimestamp(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function UpdateSecurityQuestionSection({
  email,
  token,
}: UpdateSecurityQuestionProps) {
  const {
    getSecurityQuestion,
    getSecurityHintByToken,
    getSecurityQuestionUpdatedAt,
    updateSecurityQuestion,
  } = useAuthActionsWithSecurityQuestion();

  const [expanded, setExpanded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(
    undefined as unknown as string | null,
  );
  const [loadingCurrent, setLoadingCurrent] = useState(false);

  // Collapsed-state metadata
  const [currentHint, setCurrentHint] = useState<string | null | undefined>(
    undefined,
  );
  const [updatedAt, setUpdatedAt] = useState<bigint | null | undefined>(
    undefined,
  );

  // Form state
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [confirmAnswer, setConfirmAnswer] = useState("");
  const [newHint, setNewHint] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load hint + updatedAt on mount so they show before the user expands
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable hook-derived functions
  useEffect(() => {
    if (!token) return;
    Promise.all([
      getSecurityHintByToken(token).catch(() => null),
      getSecurityQuestionUpdatedAt(token).catch(() => null),
    ]).then(([hint, ts]) => {
      setCurrentHint(hint);
      setUpdatedAt(ts);
    });
  }, [token]);

  // Load current question when expanded for the first time
  useEffect(() => {
    if (
      !expanded ||
      currentQuestion !== (undefined as unknown as string | null)
    )
      return;
    setLoadingCurrent(true);
    getSecurityQuestion(email)
      .then((q) => setCurrentQuestion(q))
      .catch(() => setCurrentQuestion(null))
      .finally(() => setLoadingCurrent(false));
  }, [expanded, email, getSecurityQuestion, currentQuestion]);

  const refreshMetadata = () => {
    if (!token) return;
    Promise.all([
      getSecurityHintByToken(token).catch(() => null),
      getSecurityQuestionUpdatedAt(token).catch(() => null),
    ]).then(([hint, ts]) => {
      setCurrentHint(hint);
      setUpdatedAt(ts);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newQuestion) {
      setFormError("Please select a security question.");
      return;
    }
    if (!newAnswer.trim() || newAnswer.trim().length < 2) {
      setFormError("Answer must be at least 2 characters.");
      return;
    }
    if (newAnswer.trim().length > 100) {
      setFormError("Answer must be 100 characters or fewer.");
      return;
    }
    if (newAnswer.trim() !== confirmAnswer.trim()) {
      setFormError("Answers do not match. Please re-enter.");
      return;
    }

    setSaving(true);
    try {
      const result = await updateSecurityQuestion(
        token,
        newQuestion,
        newAnswer.trim(),
        newHint.trim(),
      );
      if ("err" in result) {
        setFormError(result.err);
        return;
      }
      toast.success("Security question updated!");
      setNewQuestion("");
      setNewAnswer("");
      setConfirmAnswer("");
      setNewHint("");
      setCurrentQuestion(newQuestion);
      refreshMetadata();
      setExpanded(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const hintLine =
    currentHint === undefined
      ? null // still loading
      : currentHint
        ? `Current hint: "${currentHint}"`
        : "No hint set.";

  const updatedLine =
    updatedAt === undefined
      ? null // still loading
      : updatedAt !== null
        ? `Last updated: ${formatNanoTimestamp(updatedAt)}`
        : "Never updated.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
      data-ocid="profile.security_question_section"
    >
      {/* Header / toggle */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        data-ocid="profile.security_question_toggle"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <div className="text-left">
            <p className="font-display text-base font-semibold text-foreground leading-tight">
              Security Question
            </p>
            {!expanded && (
              <div className="mt-1 space-y-0.5">
                {hintLine !== null && (
                  <p
                    className="text-xs text-muted-foreground font-body"
                    data-ocid="profile.security_hint_display"
                  >
                    {hintLine}
                  </p>
                )}
                {updatedLine !== null && (
                  <p
                    className="text-xs text-muted-foreground font-body"
                    data-ocid="profile.security_updated_at_display"
                  >
                    {updatedLine}
                  </p>
                )}
                {hintLine === null && updatedLine === null && (
                  <p className="text-xs text-muted-foreground font-body">
                    Loading…
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded form */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-border">
          {/* Current question display */}
          <div className="mt-4 mb-5 p-3 rounded-xl bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">
              Current question
            </p>
            <p className="text-sm font-medium text-foreground font-body">
              {loadingCurrent ? "Loading…" : (currentQuestion ?? "Not set")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div
                className="px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-xs font-body text-destructive"
                data-ocid="profile.security_question_error_state"
              >
                {formError}
              </div>
            )}

            {/* New question */}
            <div className="space-y-1.5">
              <Label
                htmlFor="sq-new-question"
                className="font-body text-sm font-medium text-foreground"
              >
                New security question
              </Label>
              <Select value={newQuestion} onValueChange={setNewQuestion}>
                <SelectTrigger
                  id="sq-new-question"
                  data-ocid="profile.security_question_select"
                  className="font-body bg-background border-border focus:ring-primary/20"
                >
                  <SelectValue placeholder="Choose a question…" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New answer */}
            <div className="space-y-1.5">
              <Label
                htmlFor="sq-new-answer"
                className="font-body text-sm font-medium text-foreground"
              >
                New answer
              </Label>
              <Input
                id="sq-new-answer"
                data-ocid="profile.security_answer_input"
                type="text"
                autoComplete="off"
                placeholder="Your answer (2–100 characters)"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="font-body bg-background border-border focus-visible:ring-primary/20"
              />
            </div>

            {/* Confirm answer */}
            <div className="space-y-1.5">
              <Label
                htmlFor="sq-confirm-answer"
                className="font-body text-sm font-medium text-foreground"
              >
                Confirm answer
              </Label>
              <Input
                id="sq-confirm-answer"
                data-ocid="profile.security_confirm_answer_input"
                type="text"
                autoComplete="off"
                placeholder="Repeat your answer"
                value={confirmAnswer}
                onChange={(e) => setConfirmAnswer(e.target.value)}
                className="font-body bg-background border-border focus-visible:ring-primary/20"
              />
            </div>

            {/* Hint (optional) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="sq-hint"
                className="flex items-center gap-1.5 font-body text-xs font-medium text-muted-foreground"
              >
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                Answer hint{" "}
                <span className="font-normal text-muted-foreground/60">
                  (optional)
                </span>
              </Label>
              <Input
                id="sq-hint"
                data-ocid="profile.security_hint_input"
                type="text"
                autoComplete="off"
                maxLength={100}
                placeholder="A personal reminder shown when resetting your password"
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                className="font-body text-sm bg-background border-border focus-visible:ring-primary/20 placeholder:text-muted-foreground/50"
              />
              <p className="text-xs text-muted-foreground/70 font-body">
                Not a secret — just a reminder to yourself.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="gap-1.5 font-body"
                data-ocid="profile.security_question_save_button"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Update Security Question
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setExpanded(false);
                  setFormError(null);
                  setNewQuestion("");
                  setNewAnswer("");
                  setConfirmAnswer("");
                  setNewHint("");
                }}
                className="gap-1.5 font-body"
                data-ocid="profile.security_question_cancel_button"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { account, email, name, logout, isLoggedIn, token } = useAuth();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isLoggedIn) {
    router.navigate({ to: "/login" });
    return null;
  }

  if (!account) {
    return <ProfileSkeleton />;
  }

  const handleLogout = async () => {
    await logout();
    router.navigate({ to: "/" });
  };

  const handleSaveProfile = async (
    newName: string,
    newAge: string,
    newGender: string,
  ) => {
    if (!actor || !token) {
      toast.error("Not connected to backend.");
      return;
    }
    setSaving(true);
    try {
      const updated = {
        ...account,
        name: newName,
        age: BigInt(Number.parseInt(newAge) || Number(account.age)),
        gender: newGender || account.gender,
      };
      queryClient.setQueryData(["account", token], updated);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const displayName = account.name ?? name ?? email;
  const archetypeLabel = account.animalArchetype
    ? (ANIMAL_LABELS[account.animalArchetype] ?? account.animalArchetype)
    : null;
  const archetypeEmoji = account.animalArchetype
    ? (ANIMAL_EMOJIS[account.animalArchetype] ?? "🐾")
    : null;
  const topEmotion = account.emotionResult?.topEmotions?.[0];

  return (
    <div
      className="flex-1 px-4 py-10 max-w-2xl mx-auto w-full"
      data-ocid="profile.page"
    >
      {/* Back nav */}
      <button
        type="button"
        onClick={() => router.navigate({ to: "/" })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-smooth font-body"
        data-ocid="profile.back_link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to quiz
      </button>

      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Your Profile
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Your Inner-Self journey at a glance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5 font-body"
          data-ocid="profile.logout_button"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </Button>
      </div>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5"
        data-ocid="profile.identity_card"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                {displayName}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground font-body">
                <Mail className="w-3.5 h-3.5" />
                {account.email}
              </div>
            </div>
          </div>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-1.5 font-body text-muted-foreground hover:text-foreground"
              data-ocid="profile.edit_button"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <EditProfileForm
            name={account.name}
            age={account.age.toString()}
            gender={account.gender}
            onSave={handleSaveProfile}
            onCancel={() => setEditing(false)}
            saving={saving}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm font-body">
            {account.age !== undefined && (
              <div className="bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                  Age
                </p>
                <p className="text-foreground font-semibold">
                  {account.age.toString()}
                </p>
              </div>
            )}
            {account.gender && (
              <div className="bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                  Gender
                </p>
                <p className="text-foreground font-semibold capitalize">
                  {account.gender}
                </p>
              </div>
            )}
            {account.createdAt !== undefined && (
              <div className="bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                  Member since
                </p>
                <p className="text-foreground font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {formatDate(account.createdAt)}
                </p>
              </div>
            )}
            {account.lastLogin !== undefined && (
              <div className="bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
                <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
                  Last login
                </p>
                <p className="text-foreground font-semibold">
                  {formatDate(account.lastLogin)}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Animal Archetype card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5"
        data-ocid="profile.archetype_card"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🐾</span>
          <h3 className="font-display text-base font-semibold text-foreground">
            Animal Archetype
          </h3>
        </div>

        {archetypeLabel ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-2xl border border-accent/30">
              {archetypeEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-lg font-bold text-foreground">
                  {archetypeLabel}
                </span>
                <Badge variant="secondary" className="font-body text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-primary" />
                  Completed
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                Your personality archetype
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col gap-3"
            data-ocid="profile.archetype_empty_state"
          >
            <p className="text-sm text-muted-foreground font-body">
              Discover which animal archetype reveals your true personality.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.navigate({ to: "/" })}
              className="self-start gap-1.5 font-body"
              data-ocid="profile.take_animal_quiz_button"
            >
              🐾 Take the Animal Quiz
            </Button>
          </div>
        )}
      </motion.div>

      {/* Emotion Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5"
        data-ocid="profile.emotion_card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-display text-base font-semibold text-foreground">
            Emotional Profile
          </h3>
        </div>

        {account.emotionResult &&
        account.emotionResult.topEmotions.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
              <Calendar className="w-3.5 h-3.5" />
              Taken {formatDate(account.emotionResult.takenAt)}
            </div>

            <EmotionPieChart emotions={account.emotionResult.topEmotions} />

            {topEmotion && (
              <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-1.5">
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
                  Dominant emotion insight
                </p>
                <p className="font-display text-sm font-semibold text-foreground">
                  {EMOTION_EMOJIS[topEmotion.emotion]} {topEmotion.emotion}
                </p>
                <p className="text-sm text-muted-foreground font-body italic">
                  "{EMOTION_INSIGHTS[topEmotion.emotion]}"
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  — {EMOTION_PHILOSOPHERS[topEmotion.emotion]}
                </p>
              </div>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.navigate({ to: "/emotion-quiz" })}
              className="gap-1.5 font-body text-muted-foreground hover:text-foreground -ml-1"
              data-ocid="profile.retake_emotion_quiz_button"
            >
              Retake emotion quiz →
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-3"
            data-ocid="profile.emotion_empty_state"
          >
            <p className="text-sm text-muted-foreground font-body">
              Discover the 3 core emotions shaping your inner world.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.navigate({ to: "/emotion-quiz" })}
              className="self-start gap-1.5 font-body"
              data-ocid="profile.take_emotion_quiz_button"
            >
              🧠 Take the Emotion Quiz
            </Button>
          </div>
        )}
      </motion.div>

      {/* Feedback Form */}
      <div className="mb-5">
        <FeedbackForm userEmail={account.email} actor={actor} />
      </div>

      {/* Security Question */}
      {token && (
        <div className="mb-5">
          <UpdateSecurityQuestionSection email={account.email} token={token} />
        </div>
      )}

      {/* Quick nav links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.navigate({ to: "/my-results" })}
          className="font-body text-muted-foreground hover:text-foreground gap-1.5"
          data-ocid="profile.my_results_link"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          My Results History
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.navigate({ to: "/" })}
          className="font-body text-muted-foreground hover:text-foreground gap-1.5"
          data-ocid="profile.animal_quiz_link"
        >
          🦁 Animal Quiz
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.navigate({ to: "/emotion-quiz" })}
          className="font-body text-muted-foreground hover:text-foreground gap-1.5"
          data-ocid="profile.emotion_quiz_link"
        >
          🧠 Emotion Quiz
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.navigate({ to: "/compatibility" })}
          className="font-body text-muted-foreground hover:text-foreground gap-1.5"
          data-ocid="profile.compatibility_link"
        >
          🤝 Compatibility
        </Button>
      </motion.div>
    </div>
  );
}
