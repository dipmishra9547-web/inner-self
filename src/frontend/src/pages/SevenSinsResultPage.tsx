import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Facebook,
  Share2,
  Twitter,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { BRAND_COLORS } from "../components/ShareSection";
import { SIN_PRINCIPLES, SIN_PROFILES } from "../data/sevenSinsData";
import type { SinPrinciples } from "../data/sevenSinsData";
import type { SevenSinsResult, SinType } from "../types/sevenSins";

// ── Gold palette ────────────────────────────────────────────────────────────────────────
const G = {
  primary: "#d4af37",
  light: "#f5d878",
  dark: "#a07810",
  border: "#c9a227",
  faint: "rgba(212,175,55,0.18)",
  glow: "rgba(212,175,55,0.45)",
} as const;

// ── Tarot archetype mapping ─────────────────────────────────────────────────────
const TAROT_NAMES: Record<SinType, string> = {
  pride: "The Tower",
  greed: "The King of Pentacles",
  lust: "The Lovers",
  envy: "The Hermit",
  gluttony: "The Hanged Man",
  wrath: "The Devil",
  sloth: "The Moon",
};

const TAROT_ROMAN: Record<SinType, string> = {
  pride: "XVI",
  greed: "XIV",
  lust: "VI",
  envy: "IX",
  gluttony: "XII",
  wrath: "XV",
  sloth: "XVIII",
};

// ── Sin Symbol Components ────────────────────────────────────────────────────────────

function PrideSymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Pride — Imperial Crown"
    >
      <defs>
        <radialGradient id="prideGlow" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#f5d878" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a07810" stopOpacity="0" />
        </radialGradient>
        <filter id="prideBlur">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Background */}
      <circle cx="70" cy="70" r="68" fill="#0a0805" />
      <circle cx="70" cy="70" r="64" fill="url(#prideGlow)" />
      {/* Outer decorative ring */}
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#a07810"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="3 4"
      />
      {/* Inner decorative ring */}
      <circle
        cx="70"
        cy="70"
        r="52"
        fill="none"
        stroke="#c9a227"
        strokeWidth="0.4"
        opacity="0.2"
      />
      {/* Radiating rays behind crown */}
      {[
        0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280,
        300, 320, 340,
      ].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 70 + 30 * Math.cos(rad);
        const y1 = 70 + 30 * Math.sin(rad);
        const x2 = 70 + 54 * Math.cos(rad);
        const y2 = 70 + 54 * Math.sin(rad);
        return (
          <line
            key={`ray-${deg}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d4af37"
            strokeWidth={deg % 40 === 0 ? "0.8" : "0.4"}
            opacity={deg % 40 === 0 ? 0.25 : 0.12}
          />
        );
      })}
      {/* Crown base band — ornate */}
      <rect x="24" y="88" width="92" height="20" rx="3" fill="#7a5a08" />
      <rect x="26" y="90" width="88" height="16" rx="2" fill="#c9a227" />
      <rect x="28" y="92" width="84" height="12" rx="1.5" fill="#d4af37" />
      {/* Band inner highlight */}
      <rect
        x="29"
        y="93"
        width="82"
        height="3"
        rx="1"
        fill="#f5d878"
        opacity="0.4"
      />
      {/* Band filigree */}
      <path
        d="M28,98 Q38,94 48,98 Q58,94 68,98 Q78,94 88,98 Q98,94 112,98"
        stroke="#f0d060"
        strokeWidth="0.7"
        fill="none"
        opacity="0.5"
      />
      {/* Band gems */}
      <circle
        cx="46"
        cy="98"
        r="5"
        fill="#6a0a20"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="46" cy="98" r="2.5" fill="#cc2244" opacity="0.7" />
      <circle
        cx="70"
        cy="98"
        r="6.5"
        fill="#0a0a3a"
        stroke="#f0d060"
        strokeWidth="1.2"
      />
      <circle cx="70" cy="98" r="3.5" fill="#3344aa" opacity="0.7" />
      <circle
        cx="94"
        cy="98"
        r="5"
        fill="#6a0a20"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="94" cy="98" r="2.5" fill="#cc2244" opacity="0.7" />
      {/* Small band gems */}
      <circle
        cx="34"
        cy="98"
        r="2.5"
        fill="#1a6a1a"
        stroke="#c9a227"
        strokeWidth="0.7"
      />
      <circle
        cx="106"
        cy="98"
        r="2.5"
        fill="#1a6a1a"
        stroke="#c9a227"
        strokeWidth="0.7"
      />
      {/* Crown arches */}
      <path d="M26,88 Q28,68 38,60 Q44,72 52,88" fill="#8a6808" />
      <path d="M28,88 Q30,70 38,62 Q43,73 50,88" fill="#c9a227" />
      <path d="M88,88 Q96,72 102,60 Q112,68 114,88" fill="#8a6808" />
      <path d="M90,88 Q98,73 102,62 Q110,70 112,88" fill="#c9a227" />
      {/* Arch jewels */}
      <circle
        cx="38"
        cy="62"
        r="4"
        fill="#8b2200"
        stroke="#f0d060"
        strokeWidth="0.8"
      />
      <circle
        cx="102"
        cy="62"
        r="4"
        fill="#8b2200"
        stroke="#f0d060"
        strokeWidth="0.8"
      />
      {/* Left outer spike */}
      <polygon points="24,88 24,56 34,70 44,48 54,68 54,88" fill="#8a6808" />
      <polygon points="26,88 26,59 34,72 44,51 52,69 52,88" fill="#c9a227" />
      <polygon points="28,88 28,62 34,73 44,54 50,70 50,88" fill="#d4af37" />
      {/* Right outer spike */}
      <polygon points="116,88 116,56 106,70 96,48 86,68 86,88" fill="#8a6808" />
      <polygon points="114,88 114,59 106,72 96,51 88,69 88,88" fill="#c9a227" />
      <polygon points="112,88 112,62 106,73 96,54 90,70 90,88" fill="#d4af37" />
      {/* Center spike — tallest */}
      <polygon
        points="52,88 52,50 62,68 70,26 78,68 88,50 88,88"
        fill="#8a6808"
      />
      <polygon
        points="54,88 54,52 63,69 70,29 77,69 86,52 86,88"
        fill="#c9a227"
      />
      <polygon
        points="56,88 56,54 64,70 70,32 76,70 84,54 84,88"
        fill="#d4af37"
      />
      <polygon
        points="58,88 58,56 65,71 70,36 75,71 82,56 82,88"
        fill="#f0d060"
      />
      {/* Orb on center spike top */}
      <circle
        cx="70"
        cy="30"
        r="9"
        fill="#8a6808"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="70" cy="30" r="7" fill="#c9a227" />
      <circle cx="70" cy="30" r="4.5" fill="#f0d060" />
      <circle cx="70" cy="30" r="2.5" fill="#fffde0" opacity="0.85" />
      {/* Cross atop orb */}
      <rect x="68.5" y="21" width="3" height="8" rx="0.8" fill="#f0d060" />
      <rect x="65" y="24" width="10" height="3" rx="0.8" fill="#f0d060" />
      {/* Spike tips */}
      <circle
        cx="44"
        cy="50"
        r="4.5"
        fill="#d4af37"
        stroke="#f0d060"
        strokeWidth="0.8"
      />
      <circle cx="44" cy="50" r="2" fill="#fffde0" opacity="0.8" />
      <circle
        cx="96"
        cy="50"
        r="4.5"
        fill="#d4af37"
        stroke="#f0d060"
        strokeWidth="0.8"
      />
      <circle cx="96" cy="50" r="2" fill="#fffde0" opacity="0.8" />
    </svg>
  );
}

function GreedSymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Greed — Scales of Accumulation"
    >
      <defs>
        <radialGradient id="greedGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7a5008" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill="#0a0805" />
      <circle cx="70" cy="70" r="64" fill="url(#greedGlow)" />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#a07810"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="3 4"
      />
      {/* Decorative pentacle marks */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 70 + 52 * Math.cos(rad - Math.PI / 2);
        const cy2 = 70 + 52 * Math.sin(rad - Math.PI / 2);
        return (
          <circle
            key={`pent-${deg}`}
            cx={cx}
            cy={cy2}
            r="1.5"
            fill="#d4af37"
            opacity="0.35"
          />
        );
      })}
      {/* Balance beam pole */}
      <rect x="68" y="22" width="4" height="74" rx="2" fill="#a07810" />
      <rect
        x="69"
        y="24"
        width="2"
        height="70"
        rx="1"
        fill="#d4af37"
        opacity="0.7"
      />
      {/* Ornate top finial */}
      <circle
        cx="70"
        cy="21"
        r="7"
        fill="#8a6808"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="70" cy="21" r="4.5" fill="#d4af37" />
      <circle cx="70" cy="21" r="2.5" fill="#f5d878" />
      {/* Pentacle on finial */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const r1 = (deg * Math.PI) / 180;
        const r2 = (((deg + 144) % 360) * Math.PI) / 180;
        return (
          <line
            key={`fin-${deg}`}
            x1={70 + 3.5 * Math.cos(r1 - Math.PI / 2)}
            y1={21 + 3.5 * Math.sin(r1 - Math.PI / 2)}
            x2={70 + 3.5 * Math.cos(r2 - Math.PI / 2)}
            y2={21 + 3.5 * Math.sin(r2 - Math.PI / 2)}
            stroke="#8a6808"
            strokeWidth="0.7"
          />
        );
      })}
      {/* Balance beam — tilted to show imbalance */}
      <rect
        x="24"
        y="51"
        width="92"
        height="4"
        rx="2"
        fill="#8a6808"
        transform="rotate(-8, 70, 53)"
      />
      <rect
        x="25"
        y="52"
        width="90"
        height="2"
        rx="1"
        fill="#d4af37"
        opacity="0.8"
        transform="rotate(-8, 70, 53)"
      />
      {/* Center pivot */}
      <circle
        cx="70"
        cy="53"
        r="6"
        fill="#a07810"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="70" cy="53" r="3.5" fill="#d4af37" />
      {/* Left chain (higher — lighter pan) */}
      {[0, 1, 2, 3, 4].map((n) => (
        <ellipse
          key={`lchain-${n}`}
          cx={32 + n * 1}
          cy={55 + n * 6}
          rx="3"
          ry="2"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1.2"
          transform={`rotate(${n % 2 === 0 ? 0 : 90}, ${32 + n}, ${55 + n * 6})`}
        />
      ))}
      {/* Right chain (lower — heavier pan) */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ellipse
          key={`rchain-${i}`}
          cx={108 - i * 1}
          cy={55 + i * 6}
          rx="3"
          ry="2"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1.2"
          transform={`rotate(${i % 2 === 0 ? 0 : 90}, ${108 - i}, ${55 + i * 6})`}
        />
      ))}
      {/* Left pan — empty, higher */}
      <path
        d="M18,76 Q25,68 46,68 Q62,68 67,76 Q62,84 46,84 Q25,84 18,76Z"
        fill="#8a6808"
        stroke="#c9a227"
        strokeWidth="1"
      />
      <path
        d="M21,76 Q28,70 46,70 Q62,70 65,76 Q62,82 46,82 Q28,82 21,76Z"
        fill="#b08820"
      />
      {/* Left pan rim filigree */}
      <path
        d="M20,74 Q35,70 46,72 Q57,70 66,74"
        stroke="#f0d060"
        strokeWidth="0.7"
        fill="none"
        opacity="0.5"
      />
      {/* Pentacle on left pan */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const r1 = (deg * Math.PI) / 180;
        const r2 = (((deg + 144) % 360) * Math.PI) / 180;
        return (
          <line
            key={`lpent-${deg}`}
            x1={42 + 8 * Math.cos(r1 - Math.PI / 2)}
            y1={76 + 8 * Math.sin(r1 - Math.PI / 2)}
            x2={42 + 8 * Math.cos(r2 - Math.PI / 2)}
            y2={76 + 8 * Math.sin(r2 - Math.PI / 2)}
            stroke="#f0d060"
            strokeWidth="0.8"
            opacity="0.4"
          />
        );
      })}
      {/* Right pan — overflowing coins, lower */}
      <path
        d="M73,95 Q78,87 99,87 Q116,87 122,95 Q116,103 99,103 Q78,103 73,95Z"
        fill="#8a6808"
        stroke="#c9a227"
        strokeWidth="1"
      />
      <path
        d="M76,95 Q81,89 99,89 Q114,89 119,95 Q114,101 99,101 Q81,101 76,95Z"
        fill="#b08820"
      />
      {/* Coins overflowing from right pan */}
      <circle
        cx="88"
        cy="85"
        r="7"
        fill="#a07810"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="88" cy="85" r="5" fill="#c9a227" />
      <text
        x="88"
        y="88"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#7a5a08"
        fontFamily="serif"
      >
        $
      </text>
      <circle
        cx="100"
        cy="83"
        r="7"
        fill="#a07810"
        stroke="#f0d060"
        strokeWidth="1"
      />
      <circle cx="100" cy="83" r="5" fill="#c9a227" />
      <text
        x="100"
        y="86"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#7a5a08"
        fontFamily="serif"
      >
        $
      </text>
      <circle
        cx="112"
        cy="87"
        r="6"
        fill="#9a7010"
        stroke="#d4af37"
        strokeWidth="0.8"
      />
      <circle cx="112" cy="87" r="4" fill="#b08820" />
      <circle
        cx="94"
        cy="92"
        r="5.5"
        fill="#a07810"
        stroke="#d4af37"
        strokeWidth="0.8"
      />
      <circle cx="94" cy="92" r="3.5" fill="#c9a227" />
      {/* Fallen coins below pan */}
      <circle
        cx="78"
        cy="108"
        r="5"
        fill="#9a7010"
        stroke="#c9a227"
        strokeWidth="0.8"
        opacity="0.8"
      />
      <circle
        cx="90"
        cy="112"
        r="4.5"
        fill="#9a7010"
        stroke="#c9a227"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <circle
        cx="103"
        cy="110"
        r="4"
        fill="#8a6808"
        stroke="#c9a227"
        strokeWidth="0.7"
        opacity="0.6"
      />
      {/* Base ornament */}
      <path
        d="M58,96 Q70,100 82,96"
        stroke="#c9a227"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <rect x="66" y="96" width="8" height="14" rx="2" fill="#8a6808" />
      <rect x="67.5" y="97" width="5" height="12" rx="1.5" fill="#b08820" />
      <ellipse
        cx="70"
        cy="110"
        rx="16"
        ry="5"
        fill="#7a5808"
        stroke="#c9a227"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function WrathSymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Wrath — Crossed Blades"
    >
      <defs>
        <radialGradient id="wrathGlow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#cc3300" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#440000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wrathFlame" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#cc2200" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#880000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill="#0a0505" />
      <circle cx="70" cy="70" r="64" fill="url(#wrathGlow)" />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#a07810"
        strokeWidth="0.6"
        opacity="0.3"
        strokeDasharray="3 4"
      />
      {/* Outer gore ring */}
      <circle
        cx="70"
        cy="70"
        r="48"
        fill="none"
        stroke="#8a2200"
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Flame burst at cross-point */}
      <ellipse cx="70" cy="72" rx="28" ry="22" fill="url(#wrathFlame)" />
      {/* Flame petals */}
      <path
        d="M70,82 Q58,72 62,56 Q70,48 70,44 Q70,48 78,56 Q82,72 70,82Z"
        fill="#aa2200"
        opacity="0.8"
      />
      <path
        d="M70,80 Q60,70 64,57 Q70,51 70,47 Q70,51 76,57 Q80,70 70,80Z"
        fill="#cc3300"
        opacity="0.85"
      />
      <path
        d="M70,76 Q63,67 66,58 Q70,53 70,50 Q70,53 74,58 Q77,67 70,76Z"
        fill="#dd5500"
      />
      <path
        d="M70,72 Q65,64 67,59 Q70,55 70,52 Q70,55 73,59 Q75,64 70,72Z"
        fill="#ee8800"
      />
      <path
        d="M70,66 Q67,60 68,57 Q70,54 70,53 Q70,54 72,57 Q73,60 70,66Z"
        fill="#ffaa00"
      />
      {/* Lateral flames */}
      <path
        d="M60,75 Q52,68 56,58 Q62,52 70,52 Q64,58 62,66 Q60,72 60,75Z"
        fill="#aa2200"
        opacity="0.7"
      />
      <path
        d="M80,75 Q88,68 84,58 Q78,52 70,52 Q76,58 78,66 Q80,72 80,75Z"
        fill="#aa2200"
        opacity="0.7"
      />
      {/* Blood drops falling */}
      <ellipse cx="52" cy="98" rx="3" ry="5" fill="#8b0000" opacity="0.8" />
      <ellipse cx="52" cy="103" rx="2" ry="3" fill="#6b0000" opacity="0.6" />
      <ellipse
        cx="88"
        cy="96"
        rx="2.5"
        ry="4.5"
        fill="#8b0000"
        opacity="0.75"
      />
      <ellipse
        cx="88"
        cy="100"
        rx="1.5"
        ry="2.5"
        fill="#6b0000"
        opacity="0.55"
      />
      <ellipse cx="70" cy="102" rx="2" ry="4" fill="#8b0000" opacity="0.65" />
      {/* Sword — left-to-right diagonal */}
      {/* Sword blade */}
      <polygon points="22,22 28,16 118,96 112,102" fill="#8a6808" />
      <polygon points="24,22 28,18 116,96 112,100" fill="#c9a227" />
      <polygon points="25,22 28,20 114,96 112,99" fill="#e8d060" />
      {/* Sword fuller (blood groove) */}
      <line
        x1="28"
        y1="22"
        x2="110"
        y2="96"
        stroke="#a07810"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Sword tip */}
      <polygon points="112,100 118,96 122,110" fill="#c9a227" />
      {/* Sword guard (crossguard) */}
      <rect
        x="60"
        y="52"
        width="22"
        height="8"
        rx="3"
        fill="#8a6808"
        transform="rotate(42, 71, 56)"
      />
      <rect
        x="61"
        y="53"
        width="20"
        height="6"
        rx="2"
        fill="#d4af37"
        transform="rotate(42, 71, 56)"
      />
      {/* Sword pommel */}
      <circle
        cx="24"
        cy="22"
        r="7"
        fill="#8a6808"
        stroke="#d4af37"
        strokeWidth="1"
      />
      <circle cx="24" cy="22" r="4.5" fill="#c9a227" />
      <circle cx="24" cy="22" r="2" fill="#f0d060" />
      {/* Dagger — right-to-left diagonal */}
      {/* Dagger blade */}
      <polygon points="118,22 114,16 22,96 26,102" fill="#7a5808" />
      <polygon points="116,22 114,18 24,96 26,100" fill="#b08820" />
      <polygon points="115,22 114,20 26,96 26,99" fill="#d4af37" />
      {/* Dagger tip */}
      <polygon points="26,100 22,96 18,110" fill="#b08820" />
      {/* Dagger guard */}
      <rect
        x="56"
        y="52"
        width="18"
        height="6"
        rx="2.5"
        fill="#8a6808"
        transform="rotate(-42, 69, 55)"
      />
      <rect
        x="57"
        y="53"
        width="16"
        height="4"
        rx="2"
        fill="#c9a227"
        transform="rotate(-42, 69, 55)"
      />
      {/* Dagger pommel */}
      <ellipse
        cx="118"
        cy="22"
        rx="6"
        ry="5"
        fill="#8a6808"
        stroke="#d4af37"
        strokeWidth="1"
      />
      <ellipse cx="118" cy="22" rx="4" ry="3.5" fill="#c9a227" />
      {/* Lightning bolts */}
      <path
        d="M44,30 L50,50 L44,52 L54,74"
        stroke="#f0d060"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        strokeLinejoin="round"
      />
      <path
        d="M96,30 L90,50 L96,52 L86,74"
        stroke="#f0d060"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        strokeLinejoin="round"
      />
      {/* Rune marks around blades */}
      <path
        d="M34,112 L30,104 L38,100"
        stroke="#a07810"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M106,112 L110,104 L102,100"
        stroke="#a07810"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function EnvySymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Envy — Serpent Mirror"
    >
      <defs>
        <radialGradient id="envyGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#336633" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#001a00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mirrorSheen" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#8a6808" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a1a00" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="eyeIris" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#66cc66" stopOpacity="1" />
          <stop offset="100%" stopColor="#1a4a1a" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill="#050a05" />
      <circle cx="70" cy="70" r="64" fill="url(#envyGlow)" />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#3a6a3a"
        strokeWidth="0.6"
        opacity="0.3"
        strokeDasharray="3 4"
      />
      {/* Mirror oval — cracked */}
      <ellipse
        cx="70"
        cy="58"
        rx="30"
        ry="36"
        fill="#0a1a0a"
        stroke="#8a6808"
        strokeWidth="2"
      />
      <ellipse
        cx="70"
        cy="58"
        rx="27"
        ry="33"
        fill="url(#mirrorSheen)"
        opacity="0.7"
      />
      {/* Mirror ornate frame top */}
      <path
        d="M40,30 Q45,20 70,18 Q95,20 100,30"
        stroke="#c9a227"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M44,28 Q50,22 70,20 Q90,22 96,28"
        stroke="#f0d060"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* Frame corner flourishes */}
      <path
        d="M40,30 Q34,34 32,42"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M100,30 Q106,34 108,42"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mirror crack lines */}
      <path
        d="M70,28 L62,48 L74,62"
        stroke="#a07810"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M70,28 L78,50"
        stroke="#a07810"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M62,48 L54,55"
        stroke="#a07810"
        strokeWidth="0.5"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M74,62 L80,70"
        stroke="#a07810"
        strokeWidth="0.4"
        fill="none"
        opacity="0.3"
      />
      {/* Envy eye visible in mirror reflection */}
      <ellipse
        cx="70"
        cy="52"
        rx="16"
        ry="10"
        fill="#0a1a0a"
        stroke="#5a8a5a"
        strokeWidth="1"
      />
      <circle cx="70" cy="52" r="8" fill="url(#eyeIris)" />
      <circle cx="70" cy="52" r="6" fill="#2a6a2a" />
      <circle cx="70" cy="52" r="4" fill="#0a0f0a" />
      <circle cx="70" cy="52" r="2" fill="#050905" />
      <circle cx="67" cy="50" r="1.5" fill="#99ffaa" opacity="0.5" />
      {/* Eye lashes */}
      {[56, 60, 64, 70, 76, 80, 84].map((x) => (
        <line
          key={`elash-${x}`}
          x1={x}
          y1={43}
          x2={x}
          y2={x === 70 ? 38 : x < 66 || x > 74 ? 41 : 39}
          stroke="#4a7a4a"
          strokeWidth="1"
          opacity="0.7"
        />
      ))}
      {/* Mirror bottom ornament */}
      <path
        d="M42,88 Q55,96 70,94 Q85,96 98,88"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Serpent coiled around mirror */}
      {/* Serpent body path — coils around ellipse */}
      <path
        d="M70,94 Q48,98 36,86 Q24,72 32,54 Q36,38 50,28 Q60,22 70,22"
        stroke="#2a7a2a"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M70,94 Q48,98 36,86 Q24,72 32,54 Q36,38 50,28 Q60,22 70,22"
        stroke="#3a9a3a"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Scale pattern on serpent */}
      {[
        [44, 86, 0],
        [36, 74, 15],
        [32, 62, 25],
        [36, 48, 10],
        [46, 34, -5],
      ].map(([sx, sy, rot]) => (
        <ellipse
          key={`scale-${sx}-${sy}`}
          cx={sx}
          cy={sy}
          rx="4"
          ry="3"
          fill="#1a6a1a"
          stroke="#5aaa5a"
          strokeWidth="0.5"
          transform={`rotate(${rot}, ${sx}, ${sy})`}
          opacity="0.7"
        />
      ))}
      {/* Right side serpent body */}
      <path
        d="M70,94 Q92,98 104,86 Q116,72 108,54 Q104,38 90,28 Q80,22 70,22"
        stroke="#2a7a2a"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M70,94 Q92,98 104,86 Q116,72 108,54 Q104,38 90,28 Q80,22 70,22"
        stroke="#3a9a3a"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Serpent head */}
      <ellipse
        cx="70"
        cy="19"
        rx="9"
        ry="7"
        fill="#2a7a2a"
        stroke="#5aaa5a"
        strokeWidth="1"
      />
      <ellipse cx="70" cy="19" rx="7" ry="5.5" fill="#3a9a3a" />
      {/* Serpent eyes */}
      <circle cx="66" cy="17" r="2" fill="#ffcc00" />
      <ellipse cx="66" cy="17" rx="0.7" ry="1.5" fill="#0a0a00" />
      <circle cx="74" cy="17" r="2" fill="#ffcc00" />
      <ellipse cx="74" cy="17" rx="0.7" ry="1.5" fill="#0a0a00" />
      {/* Forked tongue */}
      <path
        d="M70,24 L67,30 M70,24 L73,30"
        stroke="#cc2222"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* Gold accent bands */}
      <path
        d="M32,54 Q34,52 38,54"
        stroke="#d4af37"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M108,54 Q106,52 102,54"
        stroke="#d4af37"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

function GluttonySymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Gluttony — Overflowing Cornucopia"
    >
      <defs>
        <radialGradient id="gluttonyGlow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#8b4513" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a0a00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill="#080503" />
      <circle cx="70" cy="70" r="64" fill="url(#gluttonyGlow)" />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#a07810"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="3 4"
      />
      {/* Chain of excess — outer ring */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i * 20 * Math.PI) / 180;
        const cx = 70 + 54 * Math.cos(angle);
        const cy2 = 70 + 54 * Math.sin(angle);
        const deg = i * 20;
        return (
          <ellipse
            key={`chain-${deg}`}
            cx={cx}
            cy={cy2}
            rx="3.5"
            ry="2.5"
            fill="none"
            stroke="#8a6808"
            strokeWidth="1"
            transform={`rotate(${deg}, ${cx}, ${cy2})`}
            opacity="0.5"
          />
        );
      })}
      {/* Goblet / Cornucopia body */}
      {/* Main vessel body */}
      <path
        d="M35,85 Q30,65 38,48 Q50,28 70,26 Q90,28 102,48 Q110,65 105,85 Q95,100 70,104 Q45,100 35,85Z"
        fill="#7a5808"
      />
      <path
        d="M38,84 Q34,66 42,50 Q53,32 70,30 Q87,32 98,50 Q106,66 102,84 Q92,98 70,101 Q48,98 38,84Z"
        fill="#a07810"
      />
      <path
        d="M42,82 Q38,66 46,52 Q57,36 70,34 Q83,36 94,52 Q102,66 98,82 Q88,95 70,98 Q52,95 42,82Z"
        fill="#c9a227"
      />
      {/* Vessel rim — ornate */}
      <path
        d="M35,85 Q52,78 70,80 Q88,78 105,85"
        stroke="#f0d060"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M37,81 Q54,75 70,77 Q86,75 103,81"
        stroke="#d4af37"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      {/* Engraving on vessel */}
      <path
        d="M46,60 Q58,55 70,58 Q82,55 94,60"
        stroke="#f0d060"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M44,70 Q57,64 70,67 Q83,64 96,70"
        stroke="#f0d060"
        strokeWidth="0.7"
        fill="none"
        opacity="0.35"
      />
      {/* Vessel base */}
      <ellipse cx="70" cy="104" rx="22" ry="7" fill="#8a6808" />
      <ellipse cx="70" cy="104" rx="18" ry="5" fill="#b08820" />
      <path
        d="M52,104 Q61,100 70,101 Q79,100 88,104"
        stroke="#f0d060"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* Stem */}
      <rect x="65" y="104" width="10" height="16" rx="4" fill="#9a7210" />
      <rect x="67" y="105" width="6" height="14" rx="3" fill="#c9a227" />
      <ellipse cx="70" cy="112" rx="8" ry="5" fill="#b08820" />
      <ellipse cx="70" cy="112" rx="6" ry="3.5" fill="#d4af37" />
      {/* Foot base */}
      <ellipse
        cx="70"
        cy="120"
        rx="24"
        ry="7"
        fill="#7a5808"
        stroke="#c9a227"
        strokeWidth="1"
      />
      <ellipse cx="70" cy="120" rx="20" ry="5" fill="#9a7010" />
      {/* Overflowing contents — fruits and grapes spilling */}
      {/* Grapes cluster left */}
      {[
        [42, 72],
        [46, 68],
        [50, 72],
        [44, 76],
        [48, 76],
        [40, 78],
      ].map(([gx, gy]) => (
        <circle
          key={`grape-l-${gx}-${gy}`}
          cx={gx}
          cy={gy}
          r="4"
          fill="#5a1a8a"
          stroke="#9955cc"
          strokeWidth="0.7"
          opacity="0.9"
        />
      ))}
      <path
        d="M46,64 Q48,60 50,64"
        stroke="#2a5a1a"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Grapes cluster right */}
      {[
        [98, 72],
        [94, 68],
        [90, 72],
        [96, 76],
        [92, 76],
        [100, 78],
      ].map(([gx, gy]) => (
        <circle
          key={`grape-r-${gx}-${gy}`}
          cx={gx}
          cy={gy}
          r="4"
          fill="#5a1a8a"
          stroke="#9955cc"
          strokeWidth="0.7"
          opacity="0.9"
        />
      ))}
      <path
        d="M94,64 Q92,60 90,64"
        stroke="#2a5a1a"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Apple */}
      <circle
        cx="62"
        cy="44"
        r="9"
        fill="#cc2200"
        stroke="#8a1500"
        strokeWidth="1"
      />
      <circle cx="62" cy="44" r="7" fill="#ee3311" />
      <path
        d="M62,36 Q64,30 68,34"
        stroke="#2a5a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="65" cy="38" rx="4" ry="2.5" fill="#2a7a1a" />
      {/* Pear */}
      <path
        d="M78,50 Q72,44 74,36 Q80,30 84,36 Q90,44 84,50 Q82,56 78,50Z"
        fill="#aacc22"
        stroke="#556600"
        strokeWidth="0.8"
      />
      <path
        d="M81,32 Q83,26 86,30"
        stroke="#2a5a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Bread loaf */}
      <path
        d="M52,56 Q48,46 58,42 Q68,40 72,46 Q76,52 68,56 Q62,58 52,56Z"
        fill="#c8822a"
        stroke="#8a5010"
        strokeWidth="0.8"
      />
      <path
        d="M53,55 Q50,47 59,44 Q68,42 71,47 Q74,52 67,55 Q60,57 53,55Z"
        fill="#e09840"
      />
      {/* Spilled liquid drops at rim */}
      <ellipse cx="36" cy="87" rx="3" ry="2" fill="#8b2235" opacity="0.7" />
      <ellipse cx="34" cy="93" rx="2" ry="3" fill="#8b2235" opacity="0.5" />
      <ellipse cx="104" cy="87" rx="3" ry="2" fill="#8b2235" opacity="0.7" />
      <ellipse cx="106" cy="93" rx="2" ry="3" fill="#8b2235" opacity="0.5" />
    </svg>
  );
}

function LustSymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Lust — Pierced Heart"
    >
      <defs>
        <radialGradient id="lustGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#cc2244" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#440011" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heartGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ff4466" stopOpacity="1" />
          <stop offset="60%" stopColor="#cc1133" stopOpacity="1" />
          <stop offset="100%" stopColor="#880022" stopOpacity="1" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill="#080305" />
      <circle cx="70" cy="70" r="64" fill="url(#lustGlow)" />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#a07810"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="3 4"
      />
      {/* Falling rose petals */}
      <ellipse
        cx="28"
        cy="38"
        rx="7"
        ry="4"
        fill="#8b1a2a"
        transform="rotate(-35, 28, 38)"
        opacity="0.7"
      />
      <ellipse
        cx="112"
        cy="32"
        rx="6"
        ry="3.5"
        fill="#8b1a2a"
        transform="rotate(20, 112, 32)"
        opacity="0.65"
      />
      <ellipse
        cx="22"
        cy="80"
        rx="5"
        ry="3"
        fill="#aa2234"
        transform="rotate(-50, 22, 80)"
        opacity="0.6"
      />
      <ellipse
        cx="118"
        cy="75"
        rx="6"
        ry="3.5"
        fill="#aa2234"
        transform="rotate(45, 118, 75)"
        opacity="0.55"
      />
      <ellipse
        cx="35"
        cy="108"
        rx="5"
        ry="3"
        fill="#8b1a2a"
        transform="rotate(-20, 35, 108)"
        opacity="0.5"
      />
      <ellipse
        cx="105"
        cy="110"
        rx="5.5"
        ry="3"
        fill="#8b1a2a"
        transform="rotate(30, 105, 110)"
        opacity="0.5"
      />
      {/* Intertwined vine left */}
      <path
        d="M26,100 Q22,80 30,62 Q38,46 50,38 Q56,34 60,36"
        stroke="#1a4a0a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M26,100 Q22,80 30,62 Q38,46 50,38 Q56,34 60,36"
        stroke="#2a7a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Vine right */}
      <path
        d="M114,100 Q118,80 110,62 Q102,46 90,38 Q84,34 80,36"
        stroke="#1a4a0a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M114,100 Q118,80 110,62 Q102,46 90,38 Q84,34 80,36"
        stroke="#2a7a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Vine leaf buds */}
      <ellipse
        cx="36"
        cy="68"
        rx="6"
        ry="3.5"
        fill="#2a6a1a"
        transform="rotate(-40, 36, 68)"
      />
      <ellipse
        cx="42"
        cy="50"
        rx="5"
        ry="3"
        fill="#2a6a1a"
        transform="rotate(-20, 42, 50)"
      />
      <ellipse
        cx="104"
        cy="68"
        rx="6"
        ry="3.5"
        fill="#2a6a1a"
        transform="rotate(40, 104, 68)"
      />
      <ellipse
        cx="98"
        cy="50"
        rx="5"
        ry="3"
        fill="#2a6a1a"
        transform="rotate(20, 98, 50)"
      />
      {/* Main heart shape */}
      <path
        d="M70,96 Q40,80 32,60 Q26,42 42,34 Q54,28 64,38 Q67,42 70,46 Q73,42 76,38 Q86,28 98,34 Q114,42 108,60 Q100,80 70,96Z"
        fill="url(#heartGrad)"
        stroke="#880022"
        strokeWidth="1.5"
      />
      {/* Heart highlight */}
      <path
        d="M54,36 Q60,32 66,38 Q68,41 70,44"
        stroke="#ff8899"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      {/* Heart vein details */}
      <path
        d="M70,90 Q60,75 52,65"
        stroke="#cc0033"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M70,90 Q80,75 88,65"
        stroke="#cc0033"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      {/* Arrow shaft — diagonal pierce */}
      <line
        x1="22"
        y1="28"
        x2="118"
        y2="112"
        stroke="#c9a227"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="28"
        x2="118"
        y2="112"
        stroke="#f0d060"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Arrow tip */}
      <polygon
        points="118,112 108,108 114,100"
        fill="#d4af37"
        stroke="#f0d060"
        strokeWidth="0.8"
      />
      {/* Arrow tail feathers */}
      <path
        d="M22,28 L16,20 M22,28 L14,26 M22,28 L20,16"
        stroke="#d4af37"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrow gold banding */}
      <line
        x1="50"
        y1="52"
        x2="56"
        y2="58"
        stroke="#8a6808"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="84"
        y1="82"
        x2="90"
        y2="88"
        stroke="#8a6808"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Central flame in heart */}
      <path
        d="M70,72 Q64,62 68,54 Q70,50 70,48 Q70,50 72,54 Q76,62 70,72Z"
        fill="#ffaa22"
        opacity="0.8"
      />
      <path
        d="M70,68 Q66,60 68,55 Q70,52 70,50 Q70,52 72,55 Q74,60 70,68Z"
        fill="#ffdd44"
        opacity="0.7"
      />
      {/* Blood drops from pierce point */}
      <ellipse cx="66" cy="78" rx="2.5" ry="4" fill="#6b0000" opacity="0.8" />
      <ellipse cx="75" cy="58" rx="2" ry="3.5" fill="#6b0000" opacity="0.7" />
    </svg>
  );
}

function SlothSymbol() {
  return (
    <svg
      viewBox="0 0 140 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Sloth — Hourglass of Wasted Time"
    >
      <defs>
        <radialGradient id="slothGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#334488" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#110022" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonFace" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#c8c8e8" stopOpacity="1" />
          <stop offset="100%" stopColor="#7a7aaa" stopOpacity="1" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill="#05050f" />
      <circle cx="70" cy="70" r="64" fill="url(#slothGlow)" />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="#4a4a88"
        strokeWidth="0.6"
        opacity="0.3"
        strokeDasharray="3 4"
      />
      {/* Stars in background */}
      {[
        [20, 20, 1.5],
        [30, 15, 1],
        [110, 18, 1.5],
        [120, 28, 1],
        [15, 55, 1.2],
        [125, 50, 1.2],
        [18, 90, 1],
        [122, 88, 1.3],
        [25, 115, 1.5],
        [115, 112, 1.2],
        [105, 22, 1],
        [35, 120, 1],
      ].map(([sx, sy, sr]) => (
        <circle
          key={`star-${sx}-${sy}`}
          cx={sx}
          cy={sy}
          r={sr}
          fill="#d4af37"
          opacity="0.5"
        />
      ))}
      {/* Four-pointed star accents */}
      {[
        [22, 20],
        [118, 26],
        [20, 88],
      ].map(([sx, sy]) => (
        <g key={`4s-${sx}-${sy}`}>
          <line
            x1={sx - 4}
            y1={sy}
            x2={sx + 4}
            y2={sy}
            stroke="#f0d060"
            strokeWidth="0.7"
            opacity="0.6"
          />
          <line
            x1={sx}
            y1={sy - 4}
            x2={sx}
            y2={sy + 4}
            stroke="#f0d060"
            strokeWidth="0.7"
            opacity="0.6"
          />
        </g>
      ))}
      {/* Crescent moon with sleeping face — upper right */}
      {/* Moon body */}
      <circle cx="96" cy="36" r="22" fill="url(#moonFace)" />
      {/* Crescent cutout */}
      <circle cx="106" cy="30" r="18" fill="#05050f" />
      {/* Moon face — sleeping */}
      <path
        d="M82,38 Q86,34 90,38"
        stroke="#555588"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M82,44 Q86,48 90,44"
        stroke="#555588"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Sleeping eyes (closed Z) */}
      <path
        d="M80,38 Q82,36 84,38"
        stroke="#3a3a66"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M88,38 Q90,36 92,38"
        stroke="#3a3a66"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Zzz */}
      <text
        x="75"
        y="28"
        fontSize="7"
        fill="#8888bb"
        opacity="0.7"
        fontFamily="serif"
      >
        z
      </text>
      <text
        x="81"
        y="22"
        fontSize="6"
        fill="#8888bb"
        opacity="0.5"
        fontFamily="serif"
      >
        z
      </text>
      <text
        x="86"
        y="16"
        fontSize="5"
        fill="#8888bb"
        opacity="0.35"
        fontFamily="serif"
      >
        z
      </text>
      {/* Moon crater details */}
      <circle
        cx="82"
        cy="48"
        r="3"
        fill="none"
        stroke="#9999bb"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <circle
        cx="76"
        cy="34"
        r="2"
        fill="none"
        stroke="#9999bb"
        strokeWidth="0.7"
        opacity="0.35"
      />
      {/* Gold crescent rim highlight */}
      <path
        d="M78,26 Q72,36 76,50"
        stroke="#d4af37"
        strokeWidth="1.2"
        fill="none"
        opacity="0.4"
      />
      {/* Hourglass — main structure */}
      {/* Outer frame top cap */}
      <rect x="30" y="20" width="56" height="8" rx="3" fill="#8a6808" />
      <rect x="32" y="22" width="52" height="5" rx="2" fill="#d4af37" />
      {/* Outer frame bottom cap */}
      <rect x="30" y="112" width="56" height="8" rx="3" fill="#8a6808" />
      <rect x="32" y="113" width="52" height="5" rx="2" fill="#d4af37" />
      {/* Frame side pillars */}
      <rect x="30" y="26" width="5" height="88" rx="2" fill="#9a7010" />
      <rect
        x="31.5"
        y="27"
        width="2.5"
        height="86"
        rx="1"
        fill="#c9a227"
        opacity="0.6"
      />
      <rect x="81" y="26" width="5" height="88" rx="2" fill="#9a7010" />
      <rect
        x="82.5"
        y="27"
        width="2.5"
        height="86"
        rx="1"
        fill="#c9a227"
        opacity="0.6"
      />
      {/* Frame pillar joints */}
      <ellipse cx="32.5" cy="68" rx="4" ry="3" fill="#c9a227" />
      <ellipse cx="83.5" cy="68" rx="4" ry="3" fill="#c9a227" />
      {/* Upper glass chamber */}
      <path d="M35,26 Q36,42 58,66 Q60,68 58,66 Q36,42 35,26Z" fill="#1a1a3a" />
      <path d="M81,26 Q80,42 58,66 Q56,68 58,66 Q80,42 81,26Z" fill="#1a1a3a" />
      {/* Upper glass — small amount of sand remaining at top */}
      <path
        d="M36,26 L80,26 Q78,38 62,58 Q60,62 58,62 Q56,62 54,58 Q38,38 36,26Z"
        fill="#111128"
        stroke="#3a3a66"
        strokeWidth="0.5"
        opacity="0.8"
      />
      {/* Tiny bit of sand left in upper */}
      <path
        d="M48,26 L68,26 Q66,32 60,40 Q58,42 58,42 Q58,42 56,40 Q50,32 48,26Z"
        fill="#c9a227"
        opacity="0.35"
      />
      {/* Neck — pinched middle */}
      <path d="M54,66 Q57,68 58,70 Q59,68 62,66" fill="#1a1a3a" />
      <ellipse
        cx="58"
        cy="70"
        rx="5"
        ry="3"
        fill="#8a6808"
        stroke="#c9a227"
        strokeWidth="0.8"
      />
      <ellipse cx="58" cy="70" rx="3" ry="2" fill="#c9a227" />
      {/* Sand trickling — very slow */}
      <ellipse cx="58" cy="74" rx="1" ry="2" fill="#d4af37" opacity="0.6" />
      <ellipse cx="58" cy="78" rx="0.7" ry="1" fill="#d4af37" opacity="0.4" />
      {/* Lower glass chamber */}
      <path
        d="M35,112 Q36,96 58,72 Q60,70 58,72 Q36,96 35,112Z"
        fill="#1a1a3a"
      />
      <path
        d="M81,112 Q80,96 58,72 Q56,70 58,72 Q80,96 81,112Z"
        fill="#1a1a3a"
      />
      <path
        d="M36,112 L80,112 Q78,100 62,80 Q60,76 58,76 Q56,76 54,80 Q38,100 36,112Z"
        fill="#111128"
        stroke="#3a3a66"
        strokeWidth="0.5"
        opacity="0.8"
      />
      {/* Large sand pile at bottom */}
      <path
        d="M38,112 Q44,88 58,82 Q72,88 78,112Z"
        fill="#c9a227"
        opacity="0.55"
      />
      <path
        d="M42,112 Q48,92 58,87 Q68,92 74,112Z"
        fill="#d4af37"
        opacity="0.65"
      />
      <path
        d="M46,112 Q52,98 58,94 Q64,98 70,112Z"
        fill="#f0d060"
        opacity="0.5"
      />
      {/* Wilting vines on hourglass frame */}
      <path
        d="M30,40 Q22,46 18,56 Q16,64 20,68"
        stroke="#1a4a0a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M30,40 Q22,46 18,56 Q16,64 20,68"
        stroke="#2a6a1a"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Wilting vine leaves */}
      <ellipse
        cx="20"
        cy="52"
        rx="6"
        ry="3"
        fill="#1a5a1a"
        transform="rotate(-40, 20, 52)"
        opacity="0.7"
      />
      <ellipse
        cx="17"
        cy="64"
        rx="5"
        ry="2.5"
        fill="#1a5a1a"
        transform="rotate(-20, 17, 64)"
        opacity="0.6"
      />
      {/* Cobweb in upper corner */}
      <path
        d="M35,26 Q40,32 35,38"
        stroke="#6666aa"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M35,26 Q44,28 44,36"
        stroke="#6666aa"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M38,26 Q40,30 38,34"
        stroke="#6666aa"
        strokeWidth="0.4"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M35,30 Q39,31 44,30"
        stroke="#6666aa"
        strokeWidth="0.4"
        fill="none"
        opacity="0.35"
      />
      <path
        d="M35,34 Q38,35 42,34"
        stroke="#6666aa"
        strokeWidth="0.3"
        fill="none"
        opacity="0.3"
      />
      {/* Gold accent on caps */}
      <path
        d="M33,24 Q58,20 83,24"
        stroke="#f0d060"
        strokeWidth="0.7"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M33,115 Q58,119 83,115"
        stroke="#f0d060"
        strokeWidth="0.7"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

const ILLUSTRATIONS: Record<SinType, React.FC> = {
  pride: PrideSymbol,
  greed: GreedSymbol,
  lust: LustSymbol,
  envy: EnvySymbol,
  gluttony: GluttonySymbol,
  wrath: WrathSymbol,
  sloth: SlothSymbol,
};

// ── Single Tarot Card ─────────────────────────────────────────────────────────────────
function TarotCard({
  sin,
  percentage,
  cardIndex,
  isDominant,
  delay,
}: {
  sin: SinType;
  percentage: number;
  cardIndex: number;
  isDominant: boolean;
  delay: number;
}) {
  const profile = SIN_PROFILES[sin];
  const principles: SinPrinciples = SIN_PRINCIPLES[sin];
  const tarotName = TAROT_NAMES[sin];
  const roman = TAROT_ROMAN[sin];
  const Illustration = ILLUSTRATIONS[sin];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        delay,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        !isDominant
          ? { scale: 1.05, y: -6, transition: { duration: 0.2 } }
          : undefined
      }
      whileTap={{ scale: 0.97 }}
      className="relative flex-shrink-0"
      style={{
        width: isDominant ? "min(240px, 56vw)" : "min(150px, 36vw)",
        perspective: "800px",
      }}
      data-ocid={`seven_sins_result.tarot_card.${cardIndex}`}
    >
      {/* Dominant badge */}
      {isDominant && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.35 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{
            background: "linear-gradient(90deg,#8b0000,#cc2200,#8b0000)",
            color: G.light,
            border: `1px solid ${G.primary}`,
            boxShadow: "0 0 12px #cc220088",
            fontFamily: "var(--font-display)",
          }}
        >
          ✶ Dominant ✶
        </motion.div>
      )}

      {/* Card outer container */}
      <div
        className="relative w-full"
        style={{
          background: "#0d0a0a",
          border: `2px solid ${G.border}`,
          borderRadius: "10px",
          boxShadow: isDominant
            ? `0 0 32px ${G.glow}, 0 0 64px rgba(212,175,55,0.2), inset 0 0 20px rgba(0,0,0,0.8)`
            : "0 8px 24px rgba(0,0,0,0.6), inset 0 0 12px rgba(0,0,0,0.5)",
          padding: "6px",
        }}
      >
        {/* Dominant pulsing glow overlay */}
        {isDominant && (
          <motion.div
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-lg pointer-events-none z-10"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${G.glow} 0%, transparent 70%)`,
            }}
          />
        )}
        {/* Subtle shimmer sweep on dominant card */}
        {isDominant && (
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
            className="absolute inset-0 rounded-lg pointer-events-none z-10 overflow-hidden"
            style={{ skewX: "-15deg" }}
          >
            <div
              className="absolute top-0 bottom-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(245,216,120,0.08), transparent)",
              }}
            />
          </motion.div>
        )}

        {/* Inner card border */}
        <div
          className="relative w-full h-full flex flex-col overflow-hidden"
          style={{
            border: `1px solid ${G.dark}`,
            borderRadius: "6px",
            background:
              "linear-gradient(160deg, #1a0f0a 0%, #0d0a0a 40%, #150a0d 100%)",
          }}
        >
          {/* Top corners */}
          <CornerOrnament pos="tl" roman={roman} isDominant={isDominant} />
          <CornerOrnament pos="tr" roman={roman} isDominant={isDominant} />

          {/* 1. Roman numeral row */}
          <div className="flex items-center justify-center pt-4 pb-0.5 px-3">
            <span
              className="uppercase tracking-widest text-center"
              style={{
                fontFamily: "var(--font-display)",
                color: G.dark,
                fontSize: isDominant ? "0.65rem" : "0.48rem",
                letterSpacing: "0.25em",
              }}
            >
              {roman}
            </span>
          </div>

          {/* 2. Tarot archetype name */}
          <div className="flex items-center justify-center pb-0.5 px-2">
            <span
              className="text-center italic leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: G.border,
                fontSize: isDominant ? "0.7rem" : "0.5rem",
                textShadow: `0 0 6px ${G.faint}`,
              }}
            >
              {tarotName}
            </span>
          </div>

          {/* 3. Symbol area */}
          <div
            className="px-2 py-1 relative"
            style={{ flexShrink: 0, height: isDominant ? "150px" : "90px" }}
          >
            <div
              className="w-full h-full rounded overflow-hidden"
              style={{
                border: `1px solid ${G.dark}44`,
                background: "#0a0708",
              }}
            >
              <Illustration />
            </div>
          </div>

          {/* 4. Sin name in gold */}
          <div className="flex items-center justify-center pt-2 pb-0 px-3">
            <span
              className="uppercase tracking-widest text-center leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: G.primary,
                fontSize: isDominant ? "0.9rem" : "0.65rem",
                textShadow: `0 0 8px ${G.glow}`,
                letterSpacing: "0.18em",
              }}
            >
              {profile.name}
            </span>
          </div>

          {/* 5. Subtitle in italics */}
          <div className="flex items-center justify-center px-3 pb-0.5">
            <span
              className="text-center italic leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: `${G.border}cc`,
                fontSize: isDominant ? "0.6rem" : "0.44rem",
              }}
            >
              {principles.subtitle}
            </span>
          </div>

          {/* 6. Percentage score */}
          <div className="flex items-center justify-center py-1">
            <span
              style={{
                fontFamily: "var(--font-display)",
                color: G.light,
                fontSize: isDominant ? "1.6rem" : "1.05rem",
                fontWeight: 700,
                textShadow: `0 0 12px ${G.glow}, 0 0 24px ${G.faint}`,
                letterSpacing: "0.02em",
              }}
            >
              {percentage}%
            </span>
          </div>

          {/* 7. Percentage fill bar */}
          <div className="px-3 pb-2">
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: "3px", background: "rgba(212,175,55,0.15)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${G.dark}, ${G.primary}, ${G.light})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  delay: delay + 0.5,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>

          {/* 8–10. Core principles section */}
          <div
            className="px-3 pb-3 flex flex-col gap-1"
            style={{
              borderTop: `1px solid ${G.dark}55`,
              paddingTop: "6px",
            }}
          >
            {/* Description */}
            <p
              className="text-center leading-snug"
              style={{
                fontFamily: "var(--font-body)",
                color: `${G.border}99`,
                fontSize: isDominant ? "0.62rem" : "0.44rem",
                lineHeight: 1.4,
              }}
            >
              {principles.description}
            </p>

            {/* Thin divider */}
            <div
              className="w-full"
              style={{
                height: "1px",
                background: `${G.dark}44`,
                margin: "3px 0",
              }}
            />

            {/* Inner Power */}
            <div className="flex flex-col gap-0.5">
              <span
                className="uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-display)",
                  color: G.primary,
                  fontSize: isDominant ? "0.52rem" : "0.38rem",
                  letterSpacing: "0.15em",
                }}
              >
                Inner Power
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: `${G.border}88`,
                  fontSize: isDominant ? "0.58rem" : "0.42rem",
                  lineHeight: 1.35,
                }}
              >
                {principles.innerPower}
              </p>
            </div>

            {/* Antidote */}
            <div className="flex items-baseline gap-1 flex-wrap">
              <span
                className="uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-display)",
                  color: G.primary,
                  fontSize: isDominant ? "0.52rem" : "0.38rem",
                  letterSpacing: "0.15em",
                  flexShrink: 0,
                }}
              >
                Antidote:
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: G.light,
                  fontSize: isDominant ? "0.58rem" : "0.42rem",
                  fontStyle: "italic",
                }}
              >
                {principles.antidote}
              </span>
            </div>
          </div>

          {/* Bottom corners */}
          <CornerOrnament pos="bl" roman={roman} isDominant={isDominant} />
          <CornerOrnament pos="br" roman={roman} isDominant={isDominant} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Corner ornament ────────────────────────────────────────────────────────────────
function CornerOrnament({
  pos,
  roman,
  isDominant,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  roman: string;
  isDominant: boolean;
}) {
  const isTop = pos === "tl" || pos === "tr";
  const isLeft = pos === "tl" || pos === "bl";
  return (
    <div
      className="absolute"
      style={{
        top: isTop ? 4 : undefined,
        bottom: !isTop ? 4 : undefined,
        left: isLeft ? 4 : undefined,
        right: !isLeft ? 4 : undefined,
        lineHeight: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: isLeft ? "flex-start" : "flex-end",
        gap: "1px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          color: G.dark,
          fontSize: isDominant ? "0.55rem" : "0.42rem",
        }}
      >
        {roman}
      </span>
      <span
        style={{ color: G.dark, fontSize: isDominant ? "0.55rem" : "0.42rem" }}
      >
        ✶
      </span>
    </div>
  );
}

// ── Share component (gothic styled) ───────────────────────────────────────────────
function ShareSection({
  dominantName,
  dominantPct,
}: {
  dominantName: string;
  dominantPct: number;
}) {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const shareMessage = `My dominant sin is ${dominantName} (${dominantPct}%). Discover yours on Inner-Self: ${appUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Seven Sins Tarot Reading",
          text: shareMessage,
          url: appUrl,
        });
        return;
      } catch {
        /* fall through */
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
    <div
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg,#0d0a0a,#150a0d)",
        border: `1px solid ${G.dark}`,
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
      }}
      data-ocid="seven_sins_result.share_card"
    >
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-4 h-4" style={{ color: G.primary }} />
        <p
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: "var(--font-display)", color: G.primary }}
        >
          Share Your Reading
        </p>
      </div>
      <p
        className="text-xs mb-4"
        style={{ color: `${G.border}99`, fontFamily: "var(--font-body)" }}
      >
        Your soul is marked by{" "}
        <strong style={{ color: G.border }}>{dominantName}</strong>. Dare to
        share?
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:opacity-90 active:scale-95"
          style={{ background: BRAND_COLORS.whatsapp, color: "#fff" }}
          data-ocid="seven_sins_result.share_whatsapp"
        >
          <SiWhatsapp className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:opacity-90 active:scale-95"
          style={{ background: BRAND_COLORS.facebook, color: "#fff" }}
          data-ocid="seven_sins_result.share_facebook"
        >
          <Facebook className="w-3.5 h-3.5" /> Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter/X"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:opacity-90 active:scale-95"
          style={{
            background: BRAND_COLORS.twitter,
            color: "#fff",
            border: `1px solid ${G.dark}`,
          }}
          data-ocid="seven_sins_result.share_twitter"
        >
          <Twitter className="w-3.5 h-3.5" /> X
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:opacity-90 active:scale-95"
          style={{
            background: "#1a0f0a",
            color: copied ? G.light : `${G.border}cc`,
            border: `1px solid ${G.dark}`,
          }}
          data-ocid="seven_sins_result.share_copy_link"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleNativeShare}
          className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth"
          style={{
            background: "#1a0f0a",
            color: `${G.border}99`,
            border: `1px solid ${G.dark}44`,
          }}
          data-ocid="seven_sins_result.share_native"
        >
          <Share2 className="w-3.5 h-3.5" /> Share via…
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────────────
export function SevenSinsResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<SevenSinsResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("sevenSinsResult");
    if (raw) {
      try {
        setResult(JSON.parse(raw) as SevenSinsResult);
      } catch {
        router.navigate({ to: "/seven-sins-quiz" });
      }
    } else {
      router.navigate({ to: "/seven-sins-quiz" });
    }
  }, [router]);

  if (!result) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        data-ocid="seven_sins_result.loading_state"
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: G.primary, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const sorted = [...result.scores].sort((a, b) => b.percentage - a.percentage);
  const dominant = sorted[0];
  const dominantProfile = SIN_PROFILES[dominant.sin];
  const takenAt = new Date(result.takenAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const others = sorted.slice(1);

  return (
    <AnimatePresence>
      <div
        className="flex-1 flex flex-col items-center px-4 py-10 min-h-screen"
        style={{
          background: `
            repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(26,15,10,0.4) 28px, rgba(26,15,10,0.4) 29px),
            repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(26,15,10,0.3) 28px, rgba(26,15,10,0.3) 29px),
            radial-gradient(ellipse at 20% 50%, #2d1810 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, #1a0f0a 0%, transparent 50%),
            linear-gradient(180deg, #1a0f0a 0%, #120a08 40%, #1a0f0a 100%)
          `,
        }}
        data-ocid="seven_sins_result.page"
      >
        {/* Reading header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8 max-w-xl w-full"
        >
          {/* Ornamental divider top */}
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${G.dark})`,
              }}
            />
            <span style={{ color: G.primary, fontSize: "1.2rem" }}>✶</span>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${G.dark}, transparent)`,
              }}
            />
          </div>
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ fontFamily: "var(--font-display)", color: G.dark }}
          >
            Inner-Self · Tarot Reading
          </p>
          <h1
            className="font-display text-2xl sm:text-3xl font-bold mb-2"
            style={{
              color: G.primary,
              textShadow: `0 0 20px ${G.glow}, 0 0 40px rgba(212,175,55,0.15)`,
              fontFamily: "var(--font-display)",
            }}
          >
            The Seven Sins Reading
          </h1>
          {result.userName && result.userName !== "Anonymous" && (
            <p
              className="text-sm mb-1"
              style={{
                color: `${G.border}bb`,
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
              }}
            >
              A reading for{" "}
              <span style={{ color: G.light }}>{result.userName}</span>
            </p>
          )}
          <p
            className="text-xs"
            style={{ color: `${G.dark}bb`, fontFamily: "var(--font-body)" }}
          >
            {takenAt}
          </p>
          {/* Ornamental divider bottom */}
          <div className="flex items-center gap-3 mt-4 justify-center">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${G.dark})`,
              }}
            />
            <span style={{ color: G.primary, fontSize: "1.2rem" }}>✶</span>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${G.dark}, transparent)`,
              }}
            />
          </div>
        </motion.div>

        {/* Dominant card — center prominent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex justify-center mb-10 w-full"
        >
          <TarotCard
            sin={dominant.sin}
            percentage={dominant.percentage}
            cardIndex={1}
            isDominant
            delay={0.35}
          />
        </motion.div>

        {/* 6 remaining cards in a row */}
        <div className="w-full max-w-3xl mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs uppercase tracking-widest mb-5"
            style={{ fontFamily: "var(--font-display)", color: G.dark }}
          >
            The Remaining Six
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            {others.map((score, i) => (
              <TarotCard
                key={score.sin}
                sin={score.sin}
                percentage={score.percentage}
                cardIndex={i + 2}
                isDominant={false}
                delay={0.9 + i * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Fortune / Insight box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="w-full max-w-xl mb-6"
          data-ocid="seven_sins_result.insight"
        >
          <div
            className="rounded-xl p-6 text-center relative"
            style={{
              background: "linear-gradient(135deg,#0d0a0a,#15080e)",
              border: `1px solid ${G.primary}`,
              boxShadow: `0 0 24px ${G.faint}, inset 0 0 16px rgba(0,0,0,0.6)`,
            }}
          >
            {/* Corner flourishes */}
            {["tl", "tr", "bl", "br"].map((c) => (
              <span
                key={c}
                className="absolute"
                style={{
                  top: c.startsWith("t") ? 6 : undefined,
                  bottom: c.startsWith("b") ? 6 : undefined,
                  left: c.endsWith("l") ? 8 : undefined,
                  right: c.endsWith("r") ? 8 : undefined,
                  color: G.dark,
                  fontSize: "1rem",
                  lineHeight: 1,
                }}
              >
                ✶
              </span>
            ))}
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ fontFamily: "var(--font-display)", color: G.primary }}
            >
              Your Reading
            </p>
            <p
              className="text-sm leading-relaxed italic mb-4"
              style={{ fontFamily: "var(--font-display)", color: G.border }}
            >
              {dominantProfile.insight}
            </p>
            <div className="flex items-center gap-3 justify-center">
              <div
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${G.dark})`,
                }}
              />
              <span
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)", color: G.dark }}
              >
                {TAROT_NAMES[dominant.sin]}
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${G.dark}, transparent)`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Share */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75 }}
          className="w-full max-w-xl mb-5"
        >
          <ShareSection
            dominantName={dominantProfile.name}
            dominantPct={dominant.percentage}
          />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          className="w-full max-w-xl grid grid-cols-2 gap-3 mb-8"
          data-ocid="seven_sins_result.actions"
        >
          <Button
            type="button"
            onClick={() => router.navigate({ to: "/seven-sins-quiz" })}
            className="font-display transition-smooth"
            style={{
              background: "linear-gradient(135deg,#1a0f0a,#0d0a0a)",
              border: `1px solid ${G.primary}`,
              color: G.primary,
              boxShadow: `0 0 10px ${G.faint}`,
            }}
            data-ocid="seven_sins_result.retake_button"
          >
            ✶ Retake Quiz
          </Button>
          <Button
            type="button"
            onClick={() => router.navigate({ to: "/" })}
            className="font-display transition-smooth gap-1.5"
            style={{
              background: "transparent",
              border: `1px solid ${G.dark}44`,
              color: `${G.border}88`,
            }}
            data-ocid="seven_sins_result.home_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </motion.div>

        <div className="h-4" />
      </div>
    </AnimatePresence>
  );
}
