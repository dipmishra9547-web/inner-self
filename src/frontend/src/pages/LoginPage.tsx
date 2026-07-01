import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

function validate(email: string, password: string): FormErrors {
  const errs: FormErrors = {};
  if (!email) errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Enter a valid email address";
  if (!password) errs.password = "Password is required";
  else if (password.length < 6)
    errs.password = "Password must be at least 6 characters";
  return errs;
}

const GUIDE_STEPS = [
  {
    icon: UserPlus,
    title: 'Click "Create Account" below',
    desc: "Tap the button to open the sign-up form.",
  },
  {
    icon: User,
    title: "Enter your details",
    desc: "Fill in your name, email address, age, and gender.",
  },
  {
    icon: LockKeyhole,
    title: "Choose a strong password",
    desc: "Use at least 8 characters, mixing letters, numbers, and symbols.",
  },
  {
    icon: ShieldCheck,
    title: "Set a security question",
    desc: "This is used to recover your account if you ever forget your password.",
  },
  {
    icon: Sparkles,
    title: 'Click "Sign Up" and you\'re in!',
    desc: "Your account is created instantly. Start exploring your inner self.",
  },
];

export function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, string>;
  const redirectTo = (search?.redirect as string) ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);

  if (isLoggedIn) {
    navigate({ to: redirectTo });
    return null;
  }

  const handleBlur = (field: "email" | "password") => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(email, password);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(email, password);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ email: true, password: true });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      await login(email, password);
      navigate({ to: redirectTo });
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Login failed. Please check your credentials.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex-1 flex items-start justify-center px-4 py-10"
      data-ocid="login.page"
    >
      <div className="w-full max-w-md space-y-6">
        {/* ── Brand header ── */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4 shadow-card">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-body">
            Sign in to your Inner-Self account
          </p>
        </div>

        {/* ── Login card ── */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} noValidate data-ocid="login.form">
            {errors.form && (
              <div
                data-ocid="login.error_state"
                className="mb-5 px-4 py-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-body"
              >
                {errors.form}
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <Label
                htmlFor="login-email"
                className="block text-sm font-medium text-foreground mb-1.5 font-body"
              >
                Email address
              </Label>
              <Input
                id="login-email"
                data-ocid="login.email_input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    const errs = validate(e.target.value, password);
                    setErrors((prev) => ({ ...prev, email: errs.email }));
                  }
                }}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
                className={
                  errors.email && touched.email
                    ? "border-destructive focus-visible:ring-destructive/30 font-body"
                    : "focus-visible:border-primary focus-visible:ring-primary/20 font-body"
                }
              />
              {errors.email && touched.email && (
                <p
                  id="login-email-error"
                  data-ocid="login.email.field_error"
                  className="mt-1.5 text-xs text-destructive font-body"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <Label
                htmlFor="login-password"
                className="block text-sm font-medium text-foreground mb-1.5 font-body"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  data-ocid="login.password_input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) {
                      const errs = validate(email, e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        password: errs.password,
                      }));
                    }
                  }}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "login-password-error" : undefined
                  }
                  className={
                    errors.password && touched.password
                      ? "border-destructive focus-visible:ring-destructive/30 pr-10 font-body"
                      : "focus-visible:border-primary focus-visible:ring-primary/20 pr-10 font-body"
                  }
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
              {errors.password && touched.password && (
                <p
                  id="login-password-error"
                  data-ocid="login.password.field_error"
                  className="mt-1.5 text-xs text-destructive font-body"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="mb-6 text-right">
              <Link
                to="/forgot-password"
                data-ocid="login.forgot_password_link"
                className="text-sm text-primary hover:underline transition-colors font-body inline-flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="login.submit_button"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 rounded-lg transition-smooth font-body"
            >
              {isSubmitting ? (
                <span
                  data-ocid="login.loading_state"
                  className="flex items-center gap-2"
                >
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-body text-muted-foreground px-1 uppercase tracking-widest">
            New to Inner-Self?
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Create Account card ── */}
        <div
          className="bg-card border-2 border-primary/40 rounded-2xl shadow-card overflow-hidden"
          data-ocid="login.create_account.section"
        >
          {/* Header band */}
          <div className="bg-primary/10 px-6 pt-6 pb-5 border-b border-primary/20">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                  New here? Create your account
                </h2>
                <p className="text-sm text-muted-foreground font-body mt-0.5">
                  It's free and takes under a minute.
                </p>
              </div>
            </div>
          </div>

          {/* Guide section */}
          <div className="px-6 pt-5 pb-2">
            <button
              type="button"
              data-ocid="login.guide.toggle"
              onClick={() => setGuideOpen((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-semibold text-foreground font-body mb-3 hover:text-primary transition-colors"
              aria-expanded={guideOpen}
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                How to create an account
              </span>
              {guideOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {guideOpen && (
              <ol className="space-y-3 mb-4" data-ocid="login.guide.steps">
                {GUIDE_STEPS.map((step, i) => (
                  <li
                    key={step.title}
                    className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
                    data-ocid={`login.guide.step.${i + 1}`}
                  >
                    {/* Number badge */}
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {/* Icon + text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <step.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-sm font-semibold text-foreground font-body">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* CTA button */}
          <div className="px-6 pb-6">
            <Link to="/signup" data-ocid="login.create_account_button">
              <Button
                type="button"
                className="w-full h-12 rounded-xl font-semibold text-base font-body bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/30 shadow-sm transition-smooth gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create My Account
              </Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground font-body mt-3">
              Already have an account? Sign in above.
            </p>
          </div>
        </div>

        {/* Admin note */}
        <div className="text-center pb-4">
          <p className="text-xs text-muted-foreground font-body">
            Platform admin?{" "}
            <Link
              to="/admin"
              data-ocid="login.admin_link"
              className="text-primary hover:underline transition-colors"
            >
              Access Admin Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
