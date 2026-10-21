# Milo Website — AI Agent Context

> **Read this entire file before writing a single line of code.**
> This is the authoritative context document for the Milo marketing website.

---

## ⚠️ Next.js Note
This project uses Next.js with the App Router. APIs, conventions, and file structure may differ from your training data. Read `node_modules/next/dist/docs/` before writing any code. Heed all deprecation notices.

---

## What This Project Is

The **Milo marketing website** — an immersive landing page that markets the Milo events app to GenZ students. This is NOT the mobile app. The design standard is "Lusion-level": cinematic, 3D, scroll-driven.

- **GitHub:** github.com/anadix004/milo
- **Local path:** ~/Documents/College/Milo Website/milo/
- **Related app:** github.com/A6AN/Events_App

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, React 19.2, TS 5) |
| 3D / Hero motion | Canvas frame-scrubbing (image sequences in `constants/frames.ts`; Zephyr-style, 240+ JPEGs) — **not** Three.js/R3F (dropped; see audit GAP-01) |
| Animation | Framer Motion 12.38 (primary); transform CSS. GSAP **not installed** (still referenced in spec only) |
| Scroll | Lenis 1.3 (inertial smooth scroll) — see `SmoothScroll` |
| Language | TypeScript |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`), `tailwind-merge`, `clsx`, `cva` |
| Icons | lucide-react 1.7 |
| Dates | date-fns (inferred from hooks) |
| QR | qrcode 1.5 (client-side generation post SEC-03 hardening) |
| Validation | zod 4 (forms/APIs) |
| Tables / spreadsheets | xlsx (ImportStroke) |
| Headless browser | puppeteer + puppeteer-extra + stealth, `@sparticuz/chromium` (scrape-sync job) |
| Backend | Supabase (`@supabase/supabase-js 2.100`, `@supabase/ssr 0.10`, service role key server-side only) |
| Analytics/SEO | `sitemap.ts`, `manifest.ts`, not-found page (Next builtins) |

---

## Design Philosophy: The "Lusion Standard"

- **Aesthetic:** Cyber-Metropolitan / Premium Dark Mode
- **Motion:** Physics-based spring animations — NO linear movement
- **Depth:** Multi-layer parallax + WebGL particle systems
- **Interactivity:** Zero-latency transitions between 3D and 2D UI
- **Performance target:** 60 FPS on MacBook Air M-series (canvas frame-scrubbing + lazy loading of first 20 frames only)
- **Always dark** — same palette as the mobile app

### Active design reference
- `baharmilo_full_redesign.html` (root) — most advanced design, still the canonical visual spec.
- `Wireframe/`, `Event_sheets/`, `Screenshots/` — supporting assets.
- `audits/` — four audit files: `milo_comprehensive_audit.md` (most authoritative, Apr 9 2026), `milo_audit_report.md`, `manual testing report.md`, `Final Pre-Launch Polish.md`. Read these before changes around auth/RLS/admin.

---

## Page Sections (User Journey)

### Phase 1: The Metropolitan Hero
- Dark neon-lit 3D skyline
- Three 3D buildings: Mumbai · Delhi · Bangalore
- City click → "High-Speed Camera Dive" to street level
- Tech: Three.js + GSAP ScrollTrigger

### Phase 2: The Event Nebula
- Events as floating "data beads" in a 3D cloud
- Dynamic themes per category:
  - Techno: Neon/Glitch shaders
  - Social: Frosted Glass
  - Meetups: Neural Grid/Radar
- Card click → Liquid Morph → full-screen event overlay

### Phase 3: The Identity Scan
- Glassmorphism sidebar profile section
- Custom sign-up (phone OTP, no Apple Login)
- 3D avatar updates based on gender

### Phase 4: The Great Fall
- Scroll-scrubbed video: character falls through city vortex
- Lands at city-wise WhatsApp QR code
- City-specific community group links

---

## Shared Design Tokens (same as mobile app)

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Primary accent | `#C9A84C` (Gold) |
| Purple | `#b48cff` |
| Coral | `#f9643c` |
| Teal | `#3ce6b4` |
| Heading font | Syne 700/800 |
| UI font | DM Sans 300–600 |
| Borders | `0.5px rgba(255,255,255,0.08)` |

Full design doc: available via MCP tool `get_design_system`

---

## Key Files

```
milo/
  src/
    app/                    ← Next.js App Router pages
    components/             ← React components
  public/                   ← Static assets
  baharmilo_full_redesign.html  ← Standalone HTML prototype (active reference)
  migration_*.sql           ← Website's own Supabase migrations (event scraping)
  district_delhi_events*.csv ← Scraped Delhi event data
```

**Active design reference:** `baharmilo_full_redesign.html` — this standalone HTML file is the current most advanced design. Read it before doing any UI work.

---

## MCP Server

A local MCP server provides live context tools. Server at:
`~/Documents/College/milo-mcp/`

Available tools:
- `get_website_context` — full website project context
- `get_design_system` — shared Milo design doc
- `get_github_file` (repo: "website") — fetch any file from this repo
- `list_github_files` (repo: "website") — browse this repo

---

## Rules

1. **Never light mode** — always dark, same rules as the mobile app
2. **Performance first** — 60 FPS target, optimize all 3D assets
3. **Read `baharmilo_full_redesign.html`** before working on any UI section
4. **Spring physics for motion** — no CSS linear transitions for major movements
5. **Check Next.js App Router docs** — don't assume old Pages Router patterns work
6. **No window.location navigation** — Always use `next/navigation` `useRouter` to prevent hard reloads and SPA state loss.
7. **Supabase Client Instantiation** — Never call `createClient()` directly in a React component body. Always wrap it in `useMemo(() => createClient(), [])` to prevent infinite subscription loops on re-render.
8. **Z-Index System** — Avoid arbitrary `z-[...]` Tailwind classes. Consult and use the documented z-index ladder (or unify with `zIndex.ts`) to prevent stacking collisions between sidebars, modals, and overlays.
9. **Supabase Schema Consistency** — Do not submit fields to database updates (e.g. profiles) without verifying the column actually exists in the backend schema (`supabase_setup.sql`).
