# Design Brief — Inner-Self (Teal/Emerald Dark Rebuild)

## Direction

**Minimal, premium dark-theme psychology platform.** Cool near-black base with a
single vivid teal/emerald accent, replacing the previous warm amber/gold and
terracotta identity. Introspective and mystical (animal archetypes, dark side,
seven sins) but rendered with clean, modern, editorial restraint rather than
decorative noise.

## Color Palette

Defined as OKLCH triples in `src/frontend/src/index.css`, consumed via
Tailwind tokens in `tailwind.config.js`. Never hardcode colors in components;
add a token if one doesn't exist.

| Token         | OKLCH triple      | Role                                         |
| ------------- | ----------------- | --------------------------------------------- |
| background    | 0.14 0.012 235    | Cool near-black, primary surface              |
| card          | 0.18 0.014 235    | Elevation level 1                             |
| popover       | 0.22 0.016 235    | Elevation level 2 (modals, dropdowns)         |
| foreground    | 0.95 0.006 235    | Primary text                                  |
| muted-foreground | 0.66 0.014 235 | Secondary text (use `/60` opacity for tertiary) |
| primary       | 0.72 0.135 172    | Teal/emerald — buttons, links, active states  |
| accent        | 0.8 0.09 195      | Lighter cyan — badges, secondary highlights   |
| destructive   | 0.58 0.2 25       | Errors                                        |
| success       | 0.7 0.15 155      | Success states                                |
| warning       | 0.78 0.14 80      | Warnings                                      |
| border/input  | 0.34 / 0.36 (L), 235 (H) | Solid low-chroma near-white; opacity modifiers (`border-border/40` etc.) scale from this — do not make these tokens alpha-transparent by default, it breaks every existing `/NN` usage in the codebase |
| chart-1..5    | teal/blue/violet/rose/amber | General-purpose categorical chart palette |
| emotion-*     | 10 tokens, one per `EmotionType` | Canonical color per emotion, used by `emotionColor()` helper in `types/emotion.ts` |

Per-domain icon/color source of truth (do not duplicate these maps locally in a page):
- Animal archetypes: `data/archetypes.ts` → `ARCHETYPES[type].emoji` (species emoji is an intentional exception, see below) and `.color`
- Emotions: `types/emotion.ts` → `EMOTION_ICONS`, `EMOTION_COLOR_VARS` / `emotionColor()`
- Dark side types: `types/darkSide.ts` → `DARK_SIDE_ICONS`, `DARK_SIDE_CHART_COLORS`
- Seven sins: `data/sevenSinsData.ts` → `SIN_ICONS`, `SIN_PROFILES[x].color`

## Typography

- Display: **Lora** (serif) — headings, result names, emphasis quotes.
- Body: **Satoshi** (sans) — everything else.
- Mono: **JetBrainsMono** — data tables, timestamps.
- Both display/body fonts ship as a single static weight file (no variable
  font); bold text is browser-synthesized. Only 3 weights used site-wide:
  regular (400), semibold (600), bold (700).
- Scale (`tailwind.config.js` → `theme.extend.fontSize`): `xs 12 / sm 14 /
  base 16 / lg 18 / xl 20 / 2xl 24 / 3xl 32 / 4xl 40 / 5xl 48 / 6xl 64`, each
  with a tuned line-height and tracking.

## Spacing & Rhythm

- Tailwind's default 4px-based spacing scale (unchanged).
- Shared container: `.container-page` (`max-w-[1280px] mx-auto px-4 sm:px-6
  lg:px-8`) — use this instead of ad hoc `max-w-*` on new top-level page
  wrappers. Narrower content (forms, single-result cards) may still use a
  tighter `max-w-md`/`max-w-xl` inside the page.
- Marketing/section rhythm: `.section-y` (`py-16 md:py-24 lg:py-32 xl:py-40`)
  for large vertical gaps between major sections on content-heavy pages.

## Motion

- `.reveal` utility: fade + 12px translate-up, 0.5s, respects
  `prefers-reduced-motion` (global override zeroes all animation/transition
  durations).
- Page-level transitions use Motion (`motion/react`) directly per page;
  keep entrances subtle (fade + small y-offset), no bounce/overshoot.

## Icon & Emoji Policy

Emoji are removed by default and replaced with Lucide icons, **except**:
1. **Animal archetype species emoji** (`ARCHETYPES[x].emoji`) — the species
   itself (Lion vs. Sheep vs. Owl, 12 total) is the payload of the result; no
   generic icon can distinguish them, so these are kept as content.
2. **Seven Sins tarot artwork** (`SevenSinsResultPage.tsx`) — ~1,300 lines of
   hand-illustrated gold-leaf SVG per sin, plus the page's ornamental `✶`
   dividers. Kept entirely intact by design decision; only the surrounding
   chrome (share buttons, nav) was restyled.

Everywhere else (emotions, dark side types, seven sins in list/table
contexts, section headers, empty states, buttons), use the shared icon maps
above. Never introduce a new local `Record<string, string>` emoji map in a
page — it will drift from the canonical data.

## Non-negotiables carried into every page

- No em-dashes/en-dashes in UI copy (use a colon, comma, or restructure).
  Hyphens in compound words and numeric ranges are fine.
- Every interactive element needs visible `hover`/`focus-visible`/`disabled`
  states — shadcn primitives already provide this; don't override it away.
- No dead scroll: footer or a clear end-state must be reachable within one
  viewport of the last real content block.
- Known gap: Lighthouse mobile Performance does not hit the ≥90 target in a
  local/preview environment (no CDN/HTTP2/compression); Accessibility and
  Best Practices do (100 and 96 respectively as of the last audit). See the
  final rebuild report for detail.
