import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { useAuthActionsWithSecurityQuestion } from "../hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

// ─── ForgotPasswordPage ───────────────────────────────────────────────────────

export function ForgotPasswordPage() {
  const {
    getSecurityQuestion,
    getSecurityHint,
    verifySecurityQuestion,
    resetPasswordWithSecurityQuestion,
  } = useAuthActionsWithSecurityQuestion();

  const [step, setStep] = useState<Step>(1);
  const [isDone, setIsDone] = useState(false);

  // Step 1 state
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const [securityHint, setSecurityHint] = useState<string | null>(null);

  // Step 2 state
  const [answer, setAnswer] = useState("");

  // Step 3 state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Step 1: look up the security question + hint ──
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setIsLoading(true);
    try {
      const [question, hint] = await Promise.all([
        getSecurityQuestion(email.trim()),
        getSecurityHint(email.trim()),
      ]);
      if (!question) {
        setError("No account found with that email.");
        return;
      }
      setSecurityQuestion(question);
      setSecurityHint(hint);
      setStep(2);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: verify the answer ──
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }
    setIsLoading(true);
    try {
      const correct = await verifySecurityQuestion(email.trim(), answer.trim());
      if (!correct) {
        setError("Incorrect answer. Please try again.");
        return;
      }
      setStep(3);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: reset password ──
  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPasswordWithSecurityQuestion(
        email.trim(),
        securityQuestion ?? "",
        answer.trim(),
        newPassword,
      );
      setIsDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Success screen ──
  if (isDone) {
    return (
      <div
        className="flex-1 flex items-center justify-center px-4 py-12"
        data-ocid="forgot_password.page"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4 shadow-card">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
              Password Reset!
            </h1>
            <p className="text-muted-foreground mt-2 text-sm font-body">
              Your password has been successfully updated
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-card p-8">
            <div
              className="flex flex-col items-center text-center gap-5"
              data-ocid="forgot_password.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                Your password has been reset. You can now log in with your new
                password.
              </p>
              <Link to="/login" data-ocid="forgot_password.go_to_login_button">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-8 rounded-lg transition-smooth font-body">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 font-body">
            Your data is stored securely on the Internet Computer
          </p>
        </div>
      </div>
    );
  }

  const stepIcon =
    step === 3 ? (
      <KeyRound className="w-8 h-8 text-primary" />
    ) : step === 2 ? (
      <HelpCircle className="w-8 h-8 text-primary" />
    ) : (
      <KeyRound className="w-8 h-8 text-primary" />
    );

  const stepTitle =
    step === 1
      ? "Reset Password"
      : step === 2
        ? "Security Question"
        : "New Password";

  const stepSubtitle =
    step === 1
      ? "Enter your email to find your account"
      : step === 2
        ? "Answer your security question to continue"
        : "Choose a strong new password";

  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-12"
      data-ocid="forgot_password.page"
    >
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4 shadow-card">
            {stepIcon}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            {stepTitle}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-body">
            {stepSubtitle}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {([1, 2, 3] as const).map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? "w-8 bg-primary" : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">
          {/* Error banner */}
          {error && (
            <div
              data-ocid="forgot_password.error_state"
              className="mb-5 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body"
            >
              {error}
            </div>
          )}

          {/* ── Step 1: Email lookup ── */}
          {step === 1 && (
            <form
              onSubmit={handleStep1}
              noValidate
              data-ocid="forgot_password.step1_form"
            >
              <div className="mb-6">
                <Label
                  htmlFor="fp-email"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Email address
                </Label>
                <Input
                  id="fp-email"
                  data-ocid="forgot_password.email_input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body focus-visible:border-primary focus-visible:ring-primary/20"
                />
                <p className="mt-1.5 text-xs text-muted-foreground font-body">
                  We'll look up your security question
                </p>
              </div>

              <Button
                type="submit"
                data-ocid="forgot_password.step1_submit_button"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-lg transition-smooth font-body"
              >
                {isLoading ? (
                  <span
                    data-ocid="forgot_password.loading_state"
                    className="flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Looking up account…
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>

              <div className="mt-5 pt-4 border-t border-border text-center">
                <Link
                  to="/login"
                  data-ocid="forgot_password.back_to_login_link"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors font-body"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </form>
          )}

          {/* ── Step 2: Security question + answer ── */}
          {step === 2 && (
            <form
              onSubmit={handleStep2}
              noValidate
              data-ocid="forgot_password.step2_form"
            >
              {/* Display the security question prominently */}
              {securityQuestion && (
                <div className="mb-5 p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-medium text-muted-foreground font-body uppercase tracking-wide mb-1.5">
                    Your security question
                  </p>
                  <p
                    className="text-sm font-semibold text-foreground font-body leading-relaxed"
                    data-ocid="forgot_password.security_question_display"
                  >
                    {securityQuestion}
                  </p>
                  {/* Hint — shown only if non-empty */}
                  {securityHint && securityHint.trim() !== "" && (
                    <p
                      className="mt-2 text-xs italic text-muted-foreground font-body"
                      data-ocid="forgot_password.security_hint_display"
                    >
                      Your hint: {securityHint}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <Label
                  htmlFor="fp-answer"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Your answer
                </Label>
                <Input
                  id="fp-answer"
                  data-ocid="forgot_password.answer_input"
                  type="text"
                  autoComplete="off"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="font-body focus-visible:border-primary focus-visible:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                data-ocid="forgot_password.step2_submit_button"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-lg transition-smooth font-body"
              >
                {isLoading ? (
                  <span
                    data-ocid="forgot_password.loading_state"
                    className="flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  "Verify Answer"
                )}
              </Button>

              <div className="mt-5 pt-4 border-t border-border text-center">
                <button
                  type="button"
                  data-ocid="forgot_password.back_to_step1_button"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                    setAnswer("");
                    setSecurityQuestion(null);
                    setSecurityHint(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors font-body"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: New password ── */}
          {step === 3 && (
            <form
              onSubmit={handleStep3}
              noValidate
              data-ocid="forgot_password.step3_form"
              className="space-y-5"
            >
              <div>
                <Label
                  htmlFor="fp-new-password"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="fp-new-password"
                    data-ocid="forgot_password.new_password_input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 font-body focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="fp-confirm-password"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Confirm new password
                </Label>
                <div className="relative">
                  <Input
                    id="fp-confirm-password"
                    data-ocid="forgot_password.confirm_password_input"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 font-body focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                data-ocid="forgot_password.step3_submit_button"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-lg transition-smooth font-body"
              >
                {isLoading ? (
                  <span
                    data-ocid="forgot_password.loading_state"
                    className="flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Resetting…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset Password
                  </span>
                )}
              </Button>

              <div className="pt-4 border-t border-border text-center">
                <button
                  type="button"
                  data-ocid="forgot_password.back_to_step2_button"
                  onClick={() => {
                    setStep(2);
                    setError(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors font-body"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          Your data is stored securely on the Internet Computer
        </p>
      </div>
    </div>
  );
}
