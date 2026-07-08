# Full Terminal (CRT) UI Redesign

**Date:** 2026-07-08
**Status:** Approved (user picked style C "Terminal/Security Ops" → intensity A "Full Terminal (CRT)" → scope: all pages, via visual companion mockups)

## Goal

Restyle the entire ywh-tracker UI as a green-phosphor CRT terminal. Pure
restyle: no logic, data, API, or routing changes.

## Design tokens (`globals.css` rewritten)

- **Font:** monospace everywhere, loaded via `next/font` (JetBrains Mono or
  Geist Mono — whichever the installed Next version supports cleanly).
- **Palette (CSS variables):**
  - Background `#030503`; panel background `#050a06` / `#0a120c`
  - Text: bright `#86efac`, mid `#16a34a`, dim `#166534`, headings `#bbf7d0`
  - Accent `#22c55e` / `#4ade80`; alert amber `#fde047` (+ dim `#ca8a04`);
    danger red `#f87171`
  - Borders: `#14532d` (panels), `#14351c` (row separators, dashed)
- **Shape:** `border-radius: 0` everywhere; 1px solid borders; decorative
  ASCII box-drawing (`┌─┐│└┘`) for frames.
- **Effects:**
  - Full-screen scanline overlay: fixed, `pointer-events: none`,
    repeating-linear-gradient at ~2-3% opacity
  - Blinking block cursor (`█`) after page titles, CSS `steps(1)` keyframe
  - Subtle phosphor glow: light green `text-shadow` on bright text only
  - Selection color: green background, black text
  - Old animations removed: float, shimmer, glow-pulse, border-rotate;
    fade-up may stay but instant/short
- **Old classes deleted:** `.card`, `.glass`, `.gradient-text`,
  `.gradient-text-warm`, `.btn-gradient`, `.btn-ghost`, `.stat-glow-*`.
  New: `.term-panel`, `.term-btn`, `.term-btn-danger`, `.term-label`,
  `.term-cursor`, `.scanlines`.

## Layout & chrome

- **Sidebar:** `▛▚ HUNTERTRACK` logo + `v0.1.0 // SECURE` tagline; nav items
  uppercase `> DASHBOARD` style; active item inverse video (green bg, black
  text); ASCII-framed "SYS STATUS" box at bottom.
- **Page headers:** `┌─[ PAGE NAME ]─────┐` style, uppercase, with blinking
  cursor.
- **MobileNav:** same tokens; bottom bar remains functional on mobile.

## Components (all 14 UI files restyled)

- **StatsBar:** bordered panels, uppercase `HUNTERS_TRACKED` labels,
  zero-padded values (`012`), unread panel amber-themed when count > 0.
- **ActivityEntry:** table-row look:
  `[MM-DD HH:mm] BUG_TYPE @hunter [STATE] ●NEW`; dashed separators between
  rows; bug type uppercased with underscores.
- **StatusBadge:** bracket badges `[ACCEPTED]` — green accepted, amber
  resolved, red others.
- **Buttons:** `[ RUN POLL ]`, `[ MARK ALL READ ]`, `[ ADD ]` bracket style;
  inverse video on hover; delete button red variant.
- **HunterCard:** panel with square avatar (1px green border), `@username`,
  `[KYC✓]` flag, mono stats for points/rank/reports.
- **FilterBar / AddHunterForm inputs:** sharp-cornered mono inputs/selects,
  green caret, dim green placeholder.
- **Empty states:** `> NO DATA IN BUFFER_` style messages.

## Out of scope / unchanged

- All logic, data fetching, API routes, Prisma, tests.
- Local uncommitted changes to `src/lib/db.ts`, `package.json`,
  `next.config.ts` are untouched.

## Readability guardrails

- Scanlines at most 3% opacity; body text uses light greens (not pure #0F0)
  on near-black for adequate contrast; amber/red reserved for alerts.

## Verification

- `npm run lint` and `npm test` pass.
- Dev server visual check of all four pages (dashboard, hunters, hunter
  detail, settings) at desktop and mobile widths.
