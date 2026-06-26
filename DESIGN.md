# Design Brief — AnimalMind Upgraded

## Direction

**Unified Personality & Emotion Framework** — Warm, introspective dark mode with terracotta accents. Animal archetype discovery paired with philosophical emotion quiz, admin analytics, and revision guide. Mystical psychology meets educational clarity.

## Tone

Warm, introspective, slightly mystical, educational. Deep charcoal backgrounds with terracotta accents create psychological safety for self-discovery. Admin surfaces use elevated card hierarchy for data clarity without coldness.

## Differentiation

Animal emoji + emotion pie charts + philosophical insights + revision guide for daily use + admin analytics dashboard. Non-generic warm aesthetic (terracotta, not blue) paired with premium typography (Lora serif display) across all sections including admin.

## Color Palette

| Token              | OKLCH           | Role                                  |
| ------------------ | --------------- | ------------------------------------- |
| background         | 0.14 0.015 50   | Warm charcoal, primary surface        |
| foreground         | 0.92 0.01 60    | Warm cream text, AA+ contrast         |
| card               | 0.18 0.018 50   | Elevated warm surface for sections    |
| primary            | 0.48 0.18 30    | Terracotta — actions, emphasis        |
| accent             | 0.72 0.17 70    | Warm amber — progress, highlights     |
| success            | 0.65 0.16 140   | Soft green for analytics trends       |
| warning            | 0.62 0.18 65    | Warm orange for alerts                |
| muted              | 0.22 0.02 50    | Subtle dividers, secondary text       |
| emotion-fear       | 0.45 0.2 25     | Deep red for fear emotion             |
| emotion-happiness  | 0.72 0.17 70    | Bright amber for happiness            |
| emotion-love       | 0.58 0.18 10    | Warm magenta for love                 |

## Typography

- Display: Lora — warm serif for titles, section headings, emotion names. Psychological gravitas.
- Body: Satoshi — warm sans-serif for quiz text, labels, descriptions, admin data.
- Mono: JetBrainsMono — monospace for data tables, admin user IDs, technical labels.
- Scale: Hero `text-4xl md:text-6xl` | H2 `text-2xl` | Label `text-xs uppercase tracking-widest` | Body `text-base` | Data `text-xs font-mono`

## Elevation & Depth

Warm elevated cards with soft shadows (8-24px blur) create depth. Admin surfaces use stronger shadows (20px) for sidebar/panel elevation. Hover states lift cards further. No harsh borders — color + shadow define hierarchy.

## Structural Zones

| Zone        | Background     | Details                                          |
| ----------- | -------------- | ------------------------------------------------ |
| Header      | bg-background  | Brand, nav. Optional accent line separating.     |
| Quiz/Main   | bg-background  | Full-bleed. Progress bar in accent amber.        |
| Cards       | bg-card        | Result, compatibility, emotion cards elevated.  |
| Admin Sidebar | bg-card      | User list, elevated with darker shadow.          |
| Data Tables | bg-muted/20    | Light tint for row alternation. Mono typography. |
| Footer      | bg-muted/40    | Subtle. Links, legal text in muted-foreground.   |

## Spacing & Rhythm

Spacious rhythm (24px base gaps, 16px internal padding) reflects introspective pacing. Emotion quiz single-column layout. Pie chart centered. Admin dashboard 3-column layout on desktop. Print guide uses 8.5x11 viewport with controlled margins.

## Component Patterns

- Buttons: Rounded (8px), terracotta primary on hover. Accent for primary CTA. No borders.
- Cards: Rounded (8px), shadow-card. Emoji centered on emotion/archetype cards. Hover elevation.
- Progress: Amber accent filled bar, muted remainder. Smooth 0.3s transition.
- Badges: Emoji + text, bg-muted/40, rounded-full. Used in emotion results and admin user badges.
- Tables: Mono font, light alternating rows (bg-muted/10), focus rings in accent color.
- Pie Chart: Show top 3 emotions in warm palette (fear, happiness, love). Legend below chart.

## Motion

- Entrance: Fade 0.4s on page load. Stagger card reveal by 100ms.
- Hover: Card shadow lift (card → card-hover), 0.2s smooth. Button color shift on hover.
- Progress: Bar fill animates 0.3s on advance.
- Pulsing: Soft pulse (opacity 0.8–1) on active stats in admin dashboard.
- Print: No animations. Pure static content for revision guide.

## Constraints

- No gradients on text. Solid warm colors only.
- Emoji scale: 48px on result cards, 32px on badges, 24px on lists.
- Warm color palette throughout — no cool blues or generic tech defaults.
- WCAG AA+ contrast in light and dark. Text > 16px on dark backgrounds. Focus rings bright accent.
- Admin tables use monospace for data alignment and clarity.
- Print guide: no background colors, high contrast text for legibility on white paper.

## Signature Detail

Warm terracotta primary (not cool violet/blue) + charcoal dark background subverts tech-default aesthetics. Premium serif display font (Lora) paired with refined sans (Satoshi) grounds the experience in warmth and education rather than digital precision. Emotion pie chart uses warm emotional palette, not generic rainbow. Admin retains warmth through elevated card design rather than flat corporate grids.
