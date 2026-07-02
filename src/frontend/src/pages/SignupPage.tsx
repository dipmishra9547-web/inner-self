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
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Eye,
  EyeOff,
  Lightbulb,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAuthActionsWithSecurityQuestion } from "../hooks/useAuth";

// ─── Password strength ────────────────────────────────────────────────────────

type Strength = "weak" | "medium" | "strong";

function getPasswordStrength(pw: string): Strength {
  if (pw.length < 6) return "weak";
  const checks = [
    pw.length >= 10,
    /[A-Z]/.test(pw),
    /\d/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const score = checks.filter(Boolean).length;
  if (score >= 3) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}

const STRENGTH_CONFIG: Record<
  Strength,
  { label: string; bars: number; color: string }
> = {
  weak: { label: "Weak", bars: 1, color: "bg-destructive" },
  medium: { label: "Medium", bars: 2, color: "bg-warning" },
  strong: { label: "Strong", bars: 3, color: "bg-success" },
};

const STRENGTH_TEXT: Record<Strength, string> = {
  weak: "text-destructive",
  medium: "text-warning",
  strong: "text-success",
};

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const strength = getPasswordStrength(password);
  const { label, bars, color } = STRENGTH_CONFIG[strength];
  return (
    <div className="mt-2" aria-live="polite" aria-atomic="true">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= bars ? color : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-body">
        Strength:{" "}
        <span className={`font-medium ${STRENGTH_TEXT[strength]}`}>
          {label}
        </span>
      </p>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite book?",
  "What was your childhood nickname?",
  "What is the name of the street you grew up on?",
  "What is your favorite movie?",
  "What was your first job?",
  "What is your favorite color?",
];

// ─── Validation ───────────────────────────────────────────────────────────────

interface Fields {
  name: string;
  email: string;
  age: string;
  gender: string;
  password: string;
  confirm: string;
  securityQuestion: string;
  securityAnswer: string;
  securityHint: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
  gender?: string;
  password?: string;
  confirm?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  form?: string;
}

type FieldKey = keyof Omit<FormErrors, "form">;

function validateField(field: FieldKey, f: Fields): string | undefined {
  if (field === "name") {
    if (!f.name.trim()) return "Name is required";
    if (f.name.trim().length < 2) return "Name must be at least 2 characters";
  }
  if (field === "email") {
    if (!f.email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      return "Enter a valid email address";
  }
  if (field === "age") {
    const n = Number.parseInt(f.age, 10);
    if (!f.age) return "Age is required";
    if (Number.isNaN(n) || n < 1 || n > 120) return "Enter a valid age (1-120)";
  }
  if (field === "gender") {
    if (!f.gender) return "Please select a gender";
  }
  if (field === "password") {
    if (!f.password) return "Password is required";
    if (f.password.length < 6) return "Password must be at least 6 characters";
  }
  if (field === "confirm") {
    if (!f.confirm) return "Please confirm your password";
    if (f.confirm !== f.password) return "Passwords do not match";
  }
  if (field === "securityQuestion") {
    if (!f.securityQuestion) return "Please select a security question";
  }
  if (field === "securityAnswer") {
    if (!f.securityAnswer.trim()) return "Security answer is required";
    if (f.securityAnswer.trim().length < 2)
      return "Answer must be at least 2 characters";
    if (f.securityAnswer.trim().length > 100)
      return "Answer must be 100 characters or fewer";
  }
  return undefined;
}

function validateAll(f: Fields): FormErrors {
  const keys: FieldKey[] = [
    "name",
    "email",
    "age",
    "gender",
    "password",
    "confirm",
    "securityQuestion",
    "securityAnswer",
  ];
  const errs: FormErrors = {};
  for (const k of keys) {
    const e = validateField(k, f);
    if (e) errs[k] = e;
  }
  return errs;
}

// ─── SignupPage ───────────────────────────────────────────────────────────────

type TouchedMap = Record<FieldKey, boolean>;
const INITIAL_TOUCHED: TouchedMap = {
  name: false,
  email: false,
  age: false,
  gender: false,
  password: false,
  confirm: false,
  securityQuestion: false,
  securityAnswer: false,
};

export function SignupPage() {
  const { login, isLoggedIn } = useAuth();
  const { signup } = useAuthActionsWithSecurityQuestion();
  const navigate = useNavigate();

  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    confirm: "",
    securityQuestion: "",
    securityAnswer: "",
    securityHint: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedMap>(INITIAL_TOUCHED);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoggedIn) {
    navigate({ to: "/profile" });
    return null;
  }

  const update = (field: keyof Fields, value: string) => {
    const next = { ...fields, [field]: value };
    setFields(next);
    if (field in INITIAL_TOUCHED && touched[field as FieldKey]) {
      const err = validateField(field as FieldKey, next);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: FieldKey) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validateField(field, fields);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAll(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched(
        Object.fromEntries(
          Object.keys(INITIAL_TOUCHED).map((k) => [k, true]),
        ) as TouchedMap,
      );
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      await signup(
        fields.email,
        fields.password,
        fields.name,
        Number.parseInt(fields.age, 10),
        fields.gender,
        fields.securityQuestion,
        fields.securityAnswer.trim(),
        fields.securityHint.trim(),
      );
      await login(fields.email, fields.password);
      navigate({ to: "/profile" });
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Sign up failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (field: FieldKey) =>
    touched[field] && errors[field] ? (
      <p
        data-ocid={`signup.${field}.field_error`}
        className="mt-1.5 text-xs text-destructive font-body"
      >
        {errors[field]}
      </p>
    ) : null;

  const inputClass = (field: FieldKey, extra = "") =>
    `${extra} font-body ${
      errors[field] && touched[field]
        ? "border-destructive focus-visible:ring-destructive/30"
        : "focus-visible:border-primary focus-visible:ring-primary/20"
    }`;

  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-12"
      data-ocid="signup.page"
    >
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Create Your Profile
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-body">
            Join Inner-Self to discover your archetype and track your journey
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} noValidate data-ocid="signup.form">
            {/* Form-level error */}
            {errors.form && (
              <div
                data-ocid="signup.error_state"
                className="mb-5 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body"
              >
                {errors.form}
              </div>
            )}

            {/* Name */}
            <div className="mb-4">
              <Label
                htmlFor="signup-name"
                className="block text-sm font-medium text-foreground mb-1.5 font-body"
              >
                Full name
              </Label>
              <Input
                id="signup-name"
                data-ocid="signup.name_input"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={fields.name}
                onChange={(e) => update("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                aria-invalid={!!errors.name}
                className={inputClass("name")}
              />
              {fieldError("name")}
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label
                htmlFor="signup-email"
                className="block text-sm font-medium text-foreground mb-1.5 font-body"
              >
                Email address
              </Label>
              <Input
                id="signup-email"
                data-ocid="signup.email_input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!errors.email}
                className={inputClass("email")}
              />
              {fieldError("email")}
            </div>

            {/* Age + Gender row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label
                  htmlFor="signup-age"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Age
                </Label>
                <Input
                  id="signup-age"
                  data-ocid="signup.age_input"
                  type="number"
                  min={1}
                  max={120}
                  placeholder="25"
                  value={fields.age}
                  onChange={(e) => update("age", e.target.value)}
                  onBlur={() => handleBlur("age")}
                  aria-invalid={!!errors.age}
                  className={inputClass("age")}
                />
                {fieldError("age")}
              </div>

              <div>
                <Label
                  htmlFor="signup-gender"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Gender
                </Label>
                <Select
                  value={fields.gender}
                  onValueChange={(val) => {
                    update("gender", val);
                    setTouched((t) => ({ ...t, gender: true }));
                  }}
                >
                  <SelectTrigger
                    id="signup-gender"
                    data-ocid="signup.gender_select"
                    aria-invalid={!!errors.gender}
                    className={inputClass("gender")}
                  >
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("gender")}
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <Label
                htmlFor="signup-password"
                className="block text-sm font-medium text-foreground mb-1.5 font-body"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  data-ocid="signup.password_input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Choose a strong password"
                  value={fields.password}
                  onChange={(e) => update("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!errors.password}
                  className={inputClass("password", "pr-10")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldError("password")}
              <PasswordStrengthBar password={fields.password} />
            </div>

            {/* Confirm password */}
            <div className="mb-6">
              <Label
                htmlFor="signup-confirm"
                className="block text-sm font-medium text-foreground mb-1.5 font-body"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="signup-confirm"
                  data-ocid="signup.confirm_input"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={fields.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  onBlur={() => handleBlur("confirm")}
                  aria-invalid={!!errors.confirm}
                  className={inputClass("confirm", "pr-10")}
                />
                <button
                  type="button"
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldError("confirm")}
            </div>

            {/* Security question section */}
            <div className="mb-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-sm font-medium text-foreground font-body">
                  Password Recovery
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-4 leading-relaxed">
                Choose a security question and answer. You'll use this to reset
                your password if you ever forget it.
              </p>

              {/* Security question dropdown */}
              <div className="mb-4">
                <Label
                  htmlFor="signup-security-question"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Security question
                </Label>
                <Select
                  value={fields.securityQuestion}
                  onValueChange={(val) => {
                    update("securityQuestion", val);
                    setTouched((t) => ({ ...t, securityQuestion: true }));
                  }}
                >
                  <SelectTrigger
                    id="signup-security-question"
                    data-ocid="signup.security_question_select"
                    aria-invalid={!!errors.securityQuestion}
                    className={inputClass("securityQuestion")}
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
                {fieldError("securityQuestion")}
              </div>

              {/* Security answer */}
              <div className="mb-4">
                <Label
                  htmlFor="signup-security-answer"
                  className="block text-sm font-medium text-foreground mb-1.5 font-body"
                >
                  Your answer
                </Label>
                <Input
                  id="signup-security-answer"
                  data-ocid="signup.security_answer_input"
                  type="text"
                  autoComplete="off"
                  placeholder="Your answer (2-100 characters)"
                  value={fields.securityAnswer}
                  onChange={(e) => update("securityAnswer", e.target.value)}
                  onBlur={() => handleBlur("securityAnswer")}
                  aria-invalid={!!errors.securityAnswer}
                  className={inputClass("securityAnswer")}
                />
                {fieldError("securityAnswer")}
              </div>

              {/* Answer hint (optional) */}
              <div className="mb-6">
                <Label
                  htmlFor="signup-security-hint"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 font-body"
                >
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  Answer hint{" "}
                  <span className="text-muted-foreground/60 font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="signup-security-hint"
                  data-ocid="signup.security_hint_input"
                  type="text"
                  autoComplete="off"
                  maxLength={100}
                  placeholder="e.g. my childhood nickname (shown to you when resetting your password)"
                  value={fields.securityHint}
                  onChange={(e) => update("securityHint", e.target.value)}
                  className="font-body text-sm focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50"
                />
                <p className="mt-1 text-xs text-muted-foreground/70 font-body">
                  This is a personal reminder only: it is not a secret and not
                  validated.
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="signup.submit_button"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-lg transition-smooth font-body"
            >
              {isSubmitting ? (
                <span
                  data-ocid="signup.loading_state"
                  className="flex items-center gap-2"
                >
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </span>
              )}
            </Button>
          </form>

          {/* Divider + link */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted-foreground font-body">
              Already a user?{" "}
              <Link
                to="/login"
                data-ocid="signup.login_link"
                className="text-primary font-medium hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          Your data is stored securely on the Internet Computer
        </p>
      </div>
    </div>
  );
}
