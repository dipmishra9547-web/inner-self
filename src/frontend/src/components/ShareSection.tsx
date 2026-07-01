import { CheckCircle2, Copy, Facebook, Share2, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";

const APP_URL = window.location.origin;

export const BRAND_COLORS = {
  whatsapp: "#25D366",
  facebook: "#1877F2",
  twitter: "#0f1419",
} as const;

interface ShareSectionProps {
  message: string;
  ocidPrefix: string;
  heading?: string;
  subtext?: string;
  delay?: number;
  className?: string;
}

export function ShareSection({
  message,
  ocidPrefix,
  heading = "Share Inner-Self",
  subtext = "Know someone who'd love to discover their archetype? Share the app!",
  delay = 0.3,
  className = "mt-8",
}: ShareSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Inner-Self",
          text: message,
          url: APP_URL,
        });
        return;
      } catch {
        /* fall through to social links */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={className}
      data-ocid={`${ocidPrefix}.share_section`}
    >
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground font-body">
            {heading}
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4">
          {subtext}
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.whatsapp, color: "#fff" }}
            data-ocid={`${ocidPrefix}.share_whatsapp`}
          >
            <SiWhatsapp className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.facebook, color: "#fff" }}
            data-ocid={`${ocidPrefix}.share_facebook`}
          >
            <Facebook className="w-3.5 h-3.5" />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95"
            style={{ background: BRAND_COLORS.twitter, color: "#fff" }}
            data-ocid={`${ocidPrefix}.share_twitter`}
          >
            <Twitter className="w-3.5 h-3.5" />X
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium transition-smooth hover:opacity-90 active:scale-95 border border-border bg-muted/50 text-foreground"
            data-ocid={`${ocidPrefix}.share_copy_link`}
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
        </div>
        <button
          type="button"
          onClick={handleNativeShare}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-body text-muted-foreground border border-border hover:border-primary/40 hover:text-primary transition-smooth sm:hidden"
          data-ocid={`${ocidPrefix}.share_native`}
        >
          <Share2 className="w-3.5 h-3.5" />
          Share via device…
        </button>
      </div>
    </motion.div>
  );
}
