import { Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function Footer() {
  const year = new Date().getFullYear();
  const { isAdmin } = useAuth();
  const instaLink =
    "https://www.instagram.com/dip_mishra01?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground font-body">
              For self-reflection and entertainment.
            </p>
            <p className="text-[10px] text-muted-foreground/70 font-body uppercase tracking-wider">
              Not professional psychological advice
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 font-body"
              data-ocid="footer.admin_link"
            >
              <Shield className="w-3.5 h-3.5" />
              {isAdmin ? "Admin Dashboard" : "Admin Access"}
            </a>

            <div className="h-4 w-[1px] bg-border hidden sm:block" />

            <p className="text-xs text-muted-foreground font-body">
              © {year}.{" "}
              <a
                href={instaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary font-medium transition-colors duration-200"
              >
                Built with love by Dip Mishra
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
