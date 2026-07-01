import { Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Footer() {
  const year = new Date().getFullYear();
  const { isAdmin } = useAuth();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "inner-self",
  )}`;

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left font-body max-w-sm">
            For self-reflection and entertainment. Not professional
            psychological advice.
          </p>
          <a
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 font-body whitespace-nowrap"
            data-ocid="footer.admin_link"
          >
            <Shield className="w-3 h-3" />
            {isAdmin ? "Admin Dashboard" : "Admin Access"}
          </a>
        </div>
        <p className="text-xs text-muted-foreground whitespace-nowrap font-body">
          © {year}.{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
